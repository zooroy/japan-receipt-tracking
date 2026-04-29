## 1. 專案初始化與環境設定

- [x] 1.1 建立 Next.js App Router 專案（含 TypeScript、TailwindCSS v4、shadcn/ui），確認 Next.js App Router 作為全端框架
- [x] 1.2 建立 Supabase 專案，取得 PostgreSQL 連線字串（Supabase 作為資料庫（不使用 Supabase Auth），不啟用 Supabase Auth 功能）
- [x] 1.3 設定所有環境變數（DATABASE_URL、DIRECT_URL、APP_PASSWORD、GEMINI_API_KEY、EXCHANGE_RATE_API_KEY）
- [x] 1.4 安裝並設定 Prisma ORM，連接 Supabase PostgreSQL，建立 prisma/schema.prisma
- [x] 1.5 依照資料模型設計建立 `travels`、`receipts`、`exchange_rate_cache` 三張資料表的 Prisma schema，執行 `prisma migrate dev`
- [x] 1.6 安裝其餘依賴：TanStack Query v5、Zod、React Hook Form、date-fns、shadcn/ui Charts

## 2. 認證系統

- [x] 2.1 建立 `src/app/login/page.tsx`，實作 Password Login 頁面：單一密碼輸入框，提交後呼叫 `/api/auth/login`
- [x] 2.2 建立 `src/app/api/auth/login/route.ts`，驗證密碼是否符合 `APP_PASSWORD` 環境變數，成功則寫入 signed httpOnly cookie，失敗回傳 401
- [x] 2.3 建立 `middleware.ts` 實作 Middleware Cookie Protection：驗證 auth cookie 有效則放行，無效則重導至 `/login`
- [x] 2.4 建立 `src/app/api/auth/logout/route.ts`，清除 cookie 並重導至 `/login`；在 Navbar 加入 Sign Out 按鈕
- [x] 2.5 建立 `src/lib/prisma.ts`，提供 Prisma client

## 3. 旅程管理

- [x] 3.1 建立 `src/app/api/travels/route.ts`，實作 Create Travel（POST）與 Travel List（GET）API
- [x] 3.2 建立 `src/app/api/travels/[id]/activate/route.ts`，實作 Switch Active Travel：在單一 transaction 內切換 is_active
- [x] 3.3 建立旅程列表頁（`src/app/travels/page.tsx`），顯示 Travel List（逆時序，含空狀態），當前旅程視覺標示
- [x] 3.4 建立 `src/components/travels/CreateTravelDialog.tsx`，實作 Create Travel Dialog：名稱必填、起迄日期選填，提交成功後關閉 Dialog 並刷新旅程列表
- [x] 3.5 建立 `src/components/travels/TravelSwitcher.tsx`，實作 Travel Switcher in Navigation
- [x] 3.6 在 middleware 加入邏輯：若使用者已登入但無 active travel，存取 `/` 與 `/receipts/new` 時重導至 `/travels`

## 4. 匯率轉換

- [x] 4.1 建立 `src/lib/exchange-rate.ts`，實作 Daily Exchange Rate Fetch 與每日快取匯率邏輯
- [x] 4.2 建立 `src/app/api/exchange-rate/route.ts` GET Route Handler，對外提供今日匯率
- [x] 4.3 實作 TWD Amount Calculation 函式：`Math.round(totalJPY * rate)`

## 5. 收據擷取

- [x] 5.1 建立 `src/components/receipts/ReceiptCapture.tsx`，實作 Receipt Image Input：相機按鈕（`capture="environment"`）與相簿按鈕（無 `capture`）分開
- [x] 5.2 建立 `src/lib/gemini.ts`，實作呼叫 Gemini AI 的函式，將圖片轉為 base64 送出
- [x] 5.3 在 Gemini prompt 中定義結構化 schema，擷取 store_name、store_name_zh、date、total_amount、tax_type、category、items
- [x] 5.4 建立 `src/app/api/analyze-receipt/route.ts` POST Route Handler，接收圖片、呼叫 Gemini、回傳結構化 JSON
- [x] 5.5 建立 `src/components/receipts/ReceiptConfirm.tsx` 確認頁面，實作 User Confirmation Before Saving：預填表單可編輯所有欄位
- [x] 5.6 建立 `src/app/api/receipts/route.ts` POST handler，驗證輸入、換算 TWD、寫入 receipts 資料表

## 6. Dashboard

- [x] 6.1 建立 `src/app/page.tsx` Dashboard 頁面骨架，資料範圍以 active travel 的 travel_id 篩選
- [x] 6.2 建立 `src/components/dashboard/SpendingOverview.tsx`，實作 Spending Overview Cards
- [x] 6.3 建立 `src/components/dashboard/DailyChart.tsx`，實作 Daily Spending Trend Chart
- [x] 6.4 建立 `src/components/dashboard/CategoryChart.tsx`，實作 Category Breakdown Donut Chart
- [x] 6.5 建立 Tax Type Summary 區塊（`src/components/dashboard/TaxTypeSummary.tsx`）
- [x] 6.6 建立 `src/components/dashboard/RecentReceipts.tsx`，實作 Recent Receipts List on Dashboard

## 7. 收據列表

- [x] 7.1 建立 `src/app/receipts/page.tsx` 與 `src/components/receipts/ReceiptList.tsx`，實作 Receipt List Display
- [x] 7.2 實作 Keyword Search 輸入框，依 store_name、store_name_zh、items 模糊比對（ILIKE）更新列表
- [x] 7.3 在列表頁頂部顯示 Receipt Total Summary（搜尋篩選後 JPY/TWD 總計與筆數）
- [x] 7.4 實作 Receipt Expandable Row：點擊展開顯示品項明細、台幣金額、匯率、備註

## 8. 部署

- [x] 8.1 將專案推送至 GitHub，在 Vercel 建立 Project 並設定所有環境變數
- [x] 8.2 執行 `prisma migrate deploy` 將 schema 同步至生產環境資料庫
- [x] 8.3 以手機 HTTPS 環境測試相機權限與完整收據擷取流程

## 9. 基礎設施遷移

- [x] 9.1 從 npm 遷移至 pnpm；package.json 加入 `pnpm.onlyBuiltDependencies` 解決 Prisma build scripts
- [x] 9.2 移除 Supabase SDK，改用本地 PostgreSQL；安裝 `@prisma/adapter-pg`，更新 `src/lib/prisma.ts` 使用 `PrismaPg` adapter
- [x] 9.3 移除 `prisma/schema.prisma` datasource 的 `url` 欄位（Prisma 7 breaking change），改用 `prisma.config.ts` 設定連線字串
- [x] 9.4 建立 `.env`（Prisma CLI 讀取）與 `.env.local`（Next.js 讀取），兩者均設定 `DATABASE_URL`

## 10. 旅程管理改善

- [x] 10.1 建立 `src/app/api/travels/[id]/route.ts` DELETE endpoint：防止刪除當前旅程（回傳 400），在單一 transaction 內先刪收據再刪旅程
- [x] 10.2 在 `TravelList` 加入刪除按鈕（僅非當前旅程顯示）與確認 Dialog（顯示旅程名稱與警告文字）
- [x] 10.3 旅程卡片改為可點擊：當前旅程點擊導覽至 `/`，其他旅程點擊切換並導覽至 `/`
- [x] 10.4 Navbar 在「🇯🇵 記帳」右側加入 MapPin 圖示按鈕，連結至 `/travels`

## 11. 收據新增彈窗

- [x] 11.1 建立 `src/components/receipts/NewReceiptDialog.tsx`：以 `@base-ui/react` Dialog 包裹 `NewReceiptClient`；依狀態控制 `disablePointerDismissal` 與 showCloseButton
- [x] 11.2 建立 `src/components/receipts/NewReceiptButton.tsx`：獨立 Client Component，管理 dialog open 狀態，供 Dashboard 空白狀態使用
- [x] 11.3 `NewReceiptClient` 新增 `onStateChange` callback（回報 idle / analyzing / confirm），供 Dialog 控制可否關閉
- [x] 11.4 Navbar「+ 新增收據」按鈕改為觸發 Dialog，移除 `Link href="/receipts/new"`
- [x] 11.5 Dashboard 空白狀態（無收據）使用 `NewReceiptButton` 替代原本的 Link + Button

## 12. UX 改善

- [x] 12.1 Dashboard 加入無收據時的空白引導狀態：server-side 計算 receiptCount，為 0 時顯示引導畫面
- [x] 12.2 `/receipts/new` 頁面加入「‹ 返回」連結至 Dashboard

## 13. 重複收據偵測

- [x] 13.1 `prisma/schema.prisma` 新增 `image_hash String? @unique` 欄位至 `receipts` 資料表
- [x] 13.2 `src/app/api/analyze-receipt/route.ts` 在呼叫 Gemini 前計算圖片 SHA-256 hash，查詢 DB；重複則回傳 409（含 store_name_zh、date、travel_name）
- [x] 13.3 `src/app/api/receipts/route.ts` 接受並儲存 `image_hash` 欄位
- [x] 13.4 `NewReceiptClient` 處理 409 回應，顯示重複收據錯誤訊息（店名、日期、旅程名稱）
- [x] 13.5 `ReceiptConfirm` 提交時將 `data.image_hash` 帶入 POST body；儲存成功後呼叫 `queryClient.invalidateQueries({ queryKey: ["receipts"] })` 更新 Dashboard
- [x] 13.6 在終端機執行 `pnpm prisma migrate dev --name add_image_hash`，將 `image_hash` 欄位套用至資料庫
