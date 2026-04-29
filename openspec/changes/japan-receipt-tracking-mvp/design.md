## Context

此為全新的個人旅遊記帳 Web App，從零開始建立。使用者在日本旅行時，以手機瀏覽器拍攝收據，系統呼叫 Gemini AI 擷取並翻譯消費資料，儲存至 PostgreSQL，並在 Dashboard 呈現消費統計。

初始版本使用 Supabase 作為資料庫托管；後改為直接連接本地或自托管 PostgreSQL（使用 `@prisma/adapter-pg` + `PrismaPg`），移除 Supabase SDK 依賴。包管理工具從 npm 遷移至 pnpm。

## Goals / Non-Goals

**Goals:**

- 手機瀏覽器可直接使用相機拍攝收據（PWA 不需要安裝 native app）
- AI 自動擷取結構化資料，使用者只需確認，最小化手動輸入
- Dashboard 提供直觀的消費視覺化，幫助掌握旅行花費
- 部署簡單，Vercel + PostgreSQL 免費方案即可運行

**Non-Goals:**

- 不做 native mobile app（React Native / Expo）
- 不做離線功能（offline-first / service worker cache）
- 不做收據圖片雲端儲存
- 不做多人分帳

## Decisions

### Next.js App Router 作為全端框架

採用 Next.js App Router，Server Components 與 API Routes 處理後端邏輯。Gemini API 呼叫、匯率 API 呼叫均在 Server 端執行，避免 API Key 暴露在前端。

替代方案：純前端 SPA + 獨立 Express API Server → 增加部署複雜度，Vercel 單一部署更簡單。

### PostgreSQL 作為資料庫（移除 Supabase）

初始使用 Supabase PostgreSQL；後改為直接使用 PostgreSQL（本地 Homebrew 安裝或自托管）。Prisma 7 使用 `@prisma/adapter-pg`（`PrismaPg`）作為 runtime adapter，`prisma.config.ts` 負責 CLI 連線設定。`.env` 供 Prisma CLI 讀取，`.env.local` 供 Next.js 讀取，兩者均需設定 `DATABASE_URL`。

替代方案：繼續使用 Supabase → 有免費方案 7 天閒置暫停限制；本地 PostgreSQL 開發更穩定。

### Middleware 密碼保護取代帳號系統

App 以單一密碼保護存取，密碼存放於環境變數 `APP_PASSWORD`。登入時驗證密碼後寫入 httpOnly cookie，middleware 在每個 request 驗證 cookie 是否有效。無帳號系統、無 session 管理、無第三方 OAuth。資料表移除 `user_id` 欄位，因為只有一個使用者。

替代方案：Google OAuth + email 白名單 → 需要完整 OAuth 設定，對單人 App 是 overkill。

### 不儲存收據圖片

收據圖片轉為 base64 後直接送至 Gemini API，分析完成後丟棄，不存入 Storage。降低架構複雜度與存儲成本，使用者本地相簿已有原始照片。

替代方案：上傳至雲端 Storage 保存圖片 → 增加存儲成本與上傳延遲，MVP 不需要。

### ExchangeRate-API 每日快取匯率

在 API Route 實作每日匯率快取（以日期為 key 存入資料庫），同一天的收據使用同一匯率。拍攝收據時記錄當下匯率，確保歷史資料準確。

替代方案：即時查詢匯率 → 每次拍照都呼叫 API，超出免費額度風險；使用固定匯率 → 不準確。

### 旅程以 is_active 標記當前旅程

每位使用者的「當前旅程」以 `travels.is_active = true` 標記。切換旅程時在單一 transaction 內先將舊的設為 false 再將新的設為 true。Dashboard 與收據列表均以當前旅程的資料為預設範圍。

替代方案：session 存放 active_travel_id → 跨裝置不同步；獨立 user_settings 資料表 → 多一張表，`is_active` 更簡單。

### 旅程刪除須保護當前旅程

刪除旅程的 DELETE API 在執行前檢查 `is_active`；若為 true 則回傳 400 錯誤，防止誤刪當前旅程。前端確認 Dialog 顯示旅程名稱與「所有收據將一併刪除」警告。

### 收據新增改為 Dialog 彈窗

`NewReceiptDialog` 以 `@base-ui/react` Dialog 包裹 `NewReceiptClient`，在任何頁面均可觸發，不跳轉至 `/receipts/new`。狀態分三階段（idle / analyzing / confirm）：

- **idle**：可點擊外部關閉，顯示 X 按鈕
- **analyzing**：`disablePointerDismissal={true}` + 攔截 `onOpenChange` 防止 Escape 關閉，隱藏 X 按鈕
- **confirm**：`disablePointerDismissal={true}` 防止誤觸關閉，顯示 X 按鈕

儲存成功後呼叫 `queryClient.invalidateQueries({ queryKey: ["receipts"] })`，確保 Dashboard 的所有 TanStack Query 資料重新 fetch。

替代方案：維持跳轉至 `/receipts/new` 頁面 → 使用者失去操作上下文，返回後需重新載入 Dashboard。

### SHA-256 圖片 Hash 重複收據偵測

上傳圖片至 `/api/analyze-receipt` 時，Server 端使用 Node.js `crypto.createHash("sha256")` 計算圖片 buffer 的 hash，在呼叫 Gemini 前先查詢 `receipts.image_hash`（唯一索引）。若找到重複，回傳 409 並附上已存記錄的店名、日期、旅程名稱，不消耗 Gemini API quota。Hash 與收據資料一同儲存至 DB（`image_hash` 欄位）。

替代方案：前端計算 hash → 可節省傳輸但無法在 Server 端信任；比對收據金額 + 日期 → 碰撞率高，同一天同一家店可能有多筆合法收據。

### 消費分類由 Gemini 自動判定

Gemini 在擷取收據資料時，同時判斷消費分類。使用者可在確認頁面修改。

替代方案：使用者手動選擇分類 → 增加摩擦；固定關鍵字規則分類 → 準確度低。

### 資料模型設計

```
travels 資料表：
- id (uuid)
- name (text)
- start_date (date, nullable)
- end_date (date, nullable)
- is_active (boolean, default false)
- created_at (timestamptz)

receipts 資料表：
- id (uuid)
- travel_id (uuid, FK to travels.id, 非 nullable)
- date (date)
- store_name (text, 日文原名)
- store_name_zh (text, 繁體中文)
- total_amount (integer, 日圓)
- total_amount_twd (integer, 台幣，四捨五入)
- exchange_rate (decimal(10,4))
- tax_type (enum: reduced_8, standard_10, tax_free, unknown)
- category (enum: food, shopping, transport, accommodation, sightseeing, other)
- items (jsonb, [{name, name_zh, price}])
- notes (text, nullable)
- image_hash (text, nullable, unique index)
- created_at (timestamptz)

exchange_rate_cache 資料表：
- date (date, PK)
- rate (decimal(10,4))
- fetched_at (timestamptz)
```

## Risks / Trade-offs

- **Gemini API 費用**：Gemini 有免費額度，個人使用應不超過限制；SHA-256 dedup 可避免重複呼叫消耗 quota。
- **Gemini 擷取準確度**：日本收據格式多樣，部分老式收據可能辨識失敗。緩解：使用者確認步驟可手動修正。
- **手機瀏覽器相機權限**：iOS Safari 需要 HTTPS 才能存取相機（Vercel 部署預設 HTTPS，本地開發需注意）。
- **SHA-256 碰撞**：機率極低（2^-256），對個人使用可忽略。

## Open Questions

（無，MVP 範疇已明確）
