## Context

此為全新的個人旅遊記帳 Web App，從零開始建立。使用者在日本旅行時，以手機瀏覽器拍攝收據，系統呼叫 Gemini 2.0 Flash 擷取並翻譯消費資料，儲存至 Supabase PostgreSQL，並在 Dashboard 呈現消費統計。

無現有程式碼基礎，所有決策皆為全新架構選型。

## Goals / Non-Goals

**Goals:**

- 手機瀏覽器可直接使用相機拍攝收據（PWA 不需要安裝 native app）
- AI 自動擷取結構化資料，使用者只需確認，最小化手動輸入
- Dashboard 提供直觀的消費視覺化，幫助掌握旅行花費
- 部署簡單，Vercel + Supabase 免費方案即可運行

**Non-Goals:**

- 不做 native mobile app（React Native / Expo）
- 不做離線功能（offline-first / service worker cache）
- 不做收據圖片雲端儲存
- 不做多人分帳

## Decisions

### Next.js 16 App Router 作為全端框架

採用 Next.js 16 App Router，Server Actions 與 API Routes 處理後端邏輯。Gemini API 呼叫、匯率 API 呼叫均在 Server 端執行，避免 API Key 暴露在前端。

替代方案：純前端 SPA + 獨立 Express API Server → 增加部署複雜度，Vercel 單一部署更簡單。

### Supabase 作為資料庫（不使用 Supabase Auth）

使用 Supabase PostgreSQL 儲存收據資料。Prisma 作為 ORM 提供型別安全的資料庫操作。不使用 Supabase Auth，因為 App 為單人使用，無需帳號系統與資料隔離。

替代方案：Supabase Auth + Google OAuth → 需要 Google Console 設定、callback route、RLS 規則，對單人 App 是 overkill。

### Middleware 密碼保護取代帳號系統

App 以單一密碼保護存取，密碼存放於環境變數 `APP_PASSWORD`。登入時驗證密碼後寫入 httpOnly cookie，middleware 在每個 request 驗證 cookie 是否有效。無帳號系統、無 session 管理、無第三方 OAuth。資料表移除 `user_id` 欄位，因為只有一個使用者。

替代方案：Google OAuth + email 白名單 → 需要完整 OAuth 設定，仍需維護白名單邏輯。

### 不儲存收據圖片

收據圖片轉為 base64 後直接送至 Gemini API，分析完成後丟棄，不存入 Supabase Storage。降低架構複雜度與存儲成本，使用者本地相簿已有原始照片。

替代方案：上傳至 Supabase Storage 保存圖片 → 增加存儲成本與上傳延遲，MVP 不需要。

### ExchangeRate-API 每日快取匯率

在 Next.js API Route 實作每日匯率快取（以日期為 key 存入資料庫或記憶體），同一天的收據使用同一匯率。拍攝收據時記錄當下匯率，確保歷史資料準確。

替代方案：即時查詢匯率 → 每次拍照都呼叫 API，超出免費額度風險；使用固定匯率 → 不準確。

### 旅程以 is_active 標記當前旅程

每位使用者的「當前旅程」以 `travels.is_active = true` 標記。新增收據時自動帶入當前旅程的 `travel_id`，不需使用者手動選擇。Dashboard 與收據列表均以當前旅程的資料為預設範圍，透過 TravelSwitcher 元件切換旅程。

替代方案：獨立的 user_settings 資料表存放 active_travel_id → 多一個資料表，`is_active` 欄位更簡單；session 存放 active_travel_id → 跨裝置會不同步。

### 消費分類由 Gemini 自動判定

Gemini 在擷取收據資料時，同時判斷消費分類（食事、購物、交通、住宿、觀光、其他）。使用者可在確認頁面修改。

替代方案：使用者手動選擇分類 → 增加摩擦；固定關鍵字規則分類 → 準確度低。

### 資料模型設計

```
travels 資料表：
- id (uuid)
- name (text, 旅程名稱，例如「東京9日遊」)
- start_date (date, nullable)
- end_date (date, nullable)
- is_active (boolean, default false, 同時只有一個 true)
- created_at (timestamptz)

receipts 資料表：
- id (uuid)
- travel_id (uuid, FK to travels.id, 非 nullable)
- date (date, 消費日期)
- store_name (text, 日文原名)
- store_name_zh (text, 繁體中文店名)
- total_amount (integer, 日圓金額，以圓為單位，例如 ¥1,890 存為 1890)
- total_amount_twd (integer, 台幣金額，以元為單位，四捨五入至整數)
- exchange_rate (decimal, 當日匯率 JPY/TWD)
- tax_type (enum: reduced_8, standard_10, tax_free, unknown)
- category (enum: food, shopping, transport, accommodation, sightseeing, other)
- items (jsonb, 品項陣列 [{name, name_zh, price}])
- notes (text, 使用者備註，可空)
- created_at (timestamptz)

exchange_rate_cache 資料表：
- date (date, PK)
- rate (decimal, JPY to TWD)
- fetched_at (timestamptz)
```

`is_active` 約束：travels 資料表中 `is_active = true` 的記錄同時只能有一筆，切換旅程時先將舊的設為 false 再將新的設為 true（在單一 transaction 內完成）。

## Risks / Trade-offs

- **Gemini API 費用**：Gemini 2.0 Flash 有免費額度，個人使用應不超過限制；若大量使用需注意費用。緩解：每張收據只呼叫一次 API。
- **Gemini 擷取準確度**：日本收據格式多樣，部分老式收據可能辨識失敗。緩解：使用者確認步驟可手動修正。
- **手機瀏覽器相機權限**：iOS Safari 需要 HTTPS 才能存取相機（Vercel 部署預設 HTTPS，本地開發需注意）。
- **Supabase 免費方案閒置暫停**：7 天無活動後資料庫自動 pause，首次喚醒需數秒。對個人旅遊 app 影響有限。

## Open Questions

（無，MVP 範疇已明確）
