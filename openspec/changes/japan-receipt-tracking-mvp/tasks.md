## 1. 專案初始化與環境設定

- [x] 1.1 建立 Next.js 16 App Router 專案（含 TypeScript、TailwindCSS v4、shadcn/ui），確認 Next.js 16 App Router 作為全端框架
- [x] 1.2 建立 Supabase 專案，取得 PostgreSQL 連線字串（Supabase 作為資料庫（不使用 Supabase Auth），不啟用 Supabase Auth 功能）
- [x] 1.3 設定所有環境變數（DATABASE_URL、DIRECT_URL、APP_PASSWORD、GEMINI_API_KEY、EXCHANGE_RATE_API_KEY）
- [x] 1.4 安裝並設定 Prisma ORM，連接 Supabase PostgreSQL，建立 prisma/schema.prisma
- [x] 1.5 依照資料模型設計建立 `travels`（無 user_id）、`receipts`（無 user_id，travel_id 非 nullable FK）、`exchange_rate_cache` 三張資料表的 Prisma schema，執行 `prisma migrate dev`
- [x] 1.6 安裝其餘依賴：TanStack Query v5、Zod、React Hook Form、date-fns、shadcn/ui Charts

## 2. 認證系統

- [x] 2.1 建立 `src/app/login/page.tsx`，實作 Password Login 頁面：單一密碼輸入框，提交後呼叫 `/api/auth/login`
- [x] 2.2 建立 `src/app/api/auth/login/route.ts`，驗證密碼是否符合 `APP_PASSWORD` 環境變數，成功則寫入 signed httpOnly cookie，失敗回傳 401
- [x] 2.3 建立 `middleware.ts` 實作 Middleware Cookie Protection（密碼保護取代帳號系統）：驗證 auth cookie 有效則放行，無效則重導至 `/login`（排除 `/login` 與 `/api/auth/login`）
- [x] 2.4 建立 `src/app/api/auth/logout/route.ts`，清除 cookie 並重導至 `/login`；在 Navbar 加入 Sign Out 按鈕呼叫此 endpoint（Middleware 密碼保護取代帳號系統 登出流程）
- [x] 2.5 建立 `src/lib/supabase.ts`，提供 Prisma client（不使用 Supabase Auth SDK）

## 3. 旅程管理

- [x] 3.1 建立 `src/app/api/travels/route.ts`，實作 Create Travel（POST）與 Travel List（GET）API（無 user_id，單人使用）
- [x] 3.2 建立 `src/app/api/travels/[id]/activate/route.ts`，實作 Switch Active Travel：在單一 transaction 內將舊 `is_active = true` 改為 false，再將目標旅程設為 true（旅程以 is_active 標記當前旅程）
- [x] 3.3 建立旅程列表頁（`src/app/travels/page.tsx`），顯示 Travel List（逆時序，含空狀態），當前旅程視覺標示
- [x] 3.4 建立 `src/components/travels/CreateTravelDialog.tsx`，實作 Create Travel Dialog（shadcn/ui Dialog）：名稱必填、起迄日期選填，提交成功後關閉 Dialog 並刷新旅程列表；支援 `defaultOpen` prop 供自動開啟
- [x] 3.5 建立 `src/components/travels/TravelSwitcher.tsx`，實作 Travel Switcher in Navigation：顯示當前旅程名稱，點擊展開所有旅程清單可切換；無旅程時顯示「建立旅程」提示
- [x] 3.6 在 middleware 加入邏輯：若使用者已登入但無 active travel，存取 `/` 與 `/receipts/new` 時重導至 `/travels`（No active travel 場景）；旅程列表頁接收 `?new=true` query param 時自動開啟 CreateTravelDialog

## 4. 匯率轉換

- [x] 4.1 建立 `src/lib/exchange-rate.ts`，實作 Daily Exchange Rate Fetch 與 ExchangeRate-API 每日快取匯率邏輯（查詢 exchange_rate_cache；存在則回傳快取，否則呼叫 ExchangeRate-API 並存入 DB）
- [x] 4.2 建立 `src/app/api/exchange-rate/route.ts` GET Route Handler，對外提供今日匯率（供 client 顯示 Exchange Rate Display on Dashboard）
- [x] 4.3 實作 TWD Amount Calculation 函式：`Math.round(totalJPY * rate)`，確認 TWD 金額以四捨五入整數儲存

## 5. 收據擷取

- [x] 5.1 建立 `src/components/receipts/ReceiptCapture.tsx`，實作 Receipt Image Input：兩個獨立按鈕，相機按鈕用 `capture="environment"`，相簿按鈕不加 `capture` 屬性（不可合併為同一個 input，iOS Safari 會無法開啟相簿）
- [x] 5.2 建立 `src/lib/gemini.ts`，實作呼叫 Gemini 2.0 Flash 的函式，將圖片轉為 base64 送出（不儲存收據圖片）
- [x] 5.3 在 Gemini prompt 中定義結構化 schema，要求 AI Receipt Analysis via Gemini 擷取 store_name、store_name_zh、date、total_amount、tax_type，以及消費分類由 Gemini 自動判定的 category，以及 items 陣列
- [x] 5.4 建立 `src/app/api/analyze-receipt/route.ts` POST Route Handler，接收圖片、呼叫 Gemini、回傳結構化 JSON
- [x] 5.5 建立 `src/components/receipts/ReceiptConfirm.tsx` 確認頁面，實作 User Confirmation Before Saving：預填表單可編輯所有欄位，含「儲存」與「取消」按鈕
- [x] 5.6 建立 `src/app/api/receipts/route.ts` POST handler，實作 Receipt Saved to Database 與 Receipt Association with Active Travel：從 active travel 取得 travel_id，驗證 user session、換算 TWD、寫入 receipts 資料表

## 6. Dashboard

- [x] 6.1 建立 `src/app/page.tsx` Dashboard 頁面骨架，資料範圍以 active travel 的 travel_id 篩選（Trip-Scoped Dashboard）
- [x] 6.2 建立 `src/components/dashboard/SpendingOverview.tsx`，實作 Spending Overview Cards（active travel 的總 JPY、總 TWD、收據數量、今日匯率 Exchange Rate Display on Dashboard）
- [x] 6.3 建立 `src/components/dashboard/DailyChart.tsx`，實作 Daily Spending Trend Chart（shadcn/ui Charts BarChart，X 軸為日期，Y 軸為 JPY 花費，資料範圍限當前旅程）
- [x] 6.4 建立 `src/components/dashboard/CategoryChart.tsx`，實作 Category Breakdown Donut Chart（shadcn/ui Charts DonutChart，按 category 聚合 JPY，資料範圍限當前旅程）
- [x] 6.5 建立 Tax Type Summary 區塊於 Dashboard 頁面，依 tax_type 顯示各類型 JPY 總計（資料範圍限當前旅程）
- [x] 6.6 建立 `src/components/dashboard/RecentReceipts.tsx`，實作 Recent Receipts List on Dashboard（當前旅程最新 5 筆收據，含空狀態 CTA 按鈕）

## 7. 收據列表

- [x] 7.1 建立 `src/app/receipts/page.tsx` 與 `src/components/receipts/ReceiptList.tsx`，實作 Receipt List Display（只顯示 active travel 的收據，逆時序，含空狀態）
- [x] 7.2 實作 Keyword Search 輸入框，依 store_name、store_name_zh、items 模糊比對（ILIKE）更新列表
- [x] 7.3 在列表頁頂部顯示 Receipt Total Summary（搜尋篩選後 JPY/TWD 總計與筆數）
- [x] 7.4 實作 Receipt Expandable Row：點擊收據列展開顯示品項明細、台幣金額、匯率、備註，再次點擊收合（使用 shadcn/ui Collapsible）

## 8. 部署

- [x] 8.1 將專案推送至 GitHub，在 Vercel 建立 Project 並設定所有環境變數
- [x] 8.2 執行 `prisma migrate deploy` 將 schema 同步至 Supabase 生產環境資料庫
- [x] 8.3 以手機 HTTPS 環境測試相機權限與完整收據擷取流程
