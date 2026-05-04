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
- [x] 2.3 建立 `middleware.ts` 實作 Middleware Cookie Protection（middleware 密碼保護取代帳號系統）：驗證 auth cookie 有效則放行，無效則重導至 `/login`
- [x] 2.4 建立 `src/app/api/auth/logout/route.ts`，清除 cookie 並重導至 `/login`；在 Navbar 加入 Sign Out 按鈕
- [x] 2.5 建立 `src/lib/prisma.ts`，提供 Prisma client

## 3. 旅程管理

- [x] 3.1 建立 `src/app/api/travels/route.ts`，實作 Create Travel（POST）與 Travel List（GET）API
- [x] 3.2 建立 `src/app/api/travels/[id]/activate/route.ts`，實作 Switch Active Travel 與 Receipt Association with Active Travel：旅程以 is_active 標記當前旅程，在單一 transaction 內切換，確保收據與當前旅程正確關聯
- [x] 3.3 建立旅程列表頁（`src/app/travels/page.tsx`），顯示 Travel List（逆時序，含空狀態），當前旅程視覺標示
- [x] 3.4 建立 `src/components/travels/CreateTravelDialog.tsx`，實作 Create Travel Dialog：名稱必填、起迄日期選填，提交成功後關閉 Dialog 並刷新旅程列表
- [x] 3.5 建立 `src/components/travels/TravelSwitcher.tsx`，實作 Travel Switcher in Navigation
- [x] 3.6 在 middleware 加入邏輯：若使用者已登入但無 active travel，存取 `/` 與 `/receipts/new` 時重導至 `/travels`

## 4. 匯率轉換

- [x] 4.1 建立 `src/lib/exchange-rate.ts`，實作 Daily Exchange Rate Fetch（exchangerate-api 每日快取匯率）與每日快取匯率邏輯
- [x] 4.2 建立 `src/app/api/exchange-rate/route.ts` GET Route Handler，對外提供今日匯率
- [x] 4.3 實作 TWD Amount Calculation 函式：`Math.round(totalJPY * rate)`

## 5. 收據擷取

- [x] 5.1 建立 `src/components/receipts/ReceiptCapture.tsx`，實作 Receipt Image Input：相機按鈕（`capture="environment"`）與相簿按鈕（無 `capture`）分開
- [x] 5.2 建立 `src/lib/gemini.ts`，實作 AI Receipt Analysis via Gemini：呼叫 Gemini AI 函式，將圖片轉為 base64 送出
- [x] 5.3 在 Gemini prompt 中定義結構化 schema，擷取 store_name、store_name_zh、date、total_amount、tax_type、消費分類由 gemini 自動判定（category）、items；不儲存收據圖片，僅傳送 base64
- [x] 5.4 建立 `src/app/api/analyze-receipt/route.ts` POST Route Handler，接收圖片、呼叫 Gemini、回傳結構化 JSON
- [x] 5.5 建立 `src/components/receipts/ReceiptConfirm.tsx` 確認頁面，實作 User Confirmation Before Saving：預填表單可編輯所有欄位
- [x] 5.6 建立 `src/app/api/receipts/route.ts` POST handler 實作 Receipt Saved to Database：驗證輸入、換算 TWD、寫入 receipts 資料表

## 6. Dashboard

- [x] 6.1 建立 `src/app/page.tsx` Dashboard 頁面骨架，資料範圍以 active travel 的 travel_id 篩選
- [x] 6.2 建立 `src/components/dashboard/SpendingOverview.tsx`，實作 Spending Overview Cards 含 Exchange Rate Display on Dashboard
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
- [x] 9.2 移除 Supabase SDK，改用本地 postgresql 作為資料庫（移除 supabase）；安裝 `@prisma/adapter-pg`，更新 `src/lib/prisma.ts` 使用 `PrismaPg` adapter
- [x] 9.3 移除 `prisma/schema.prisma` datasource 的 `url` 欄位（Prisma 7 breaking change），改用 `prisma.config.ts` 設定連線字串
- [x] 9.4 建立 `.env`（Prisma CLI 讀取）與 `.env.local`（Next.js 讀取），兩者均設定 `DATABASE_URL`

## 10. 旅程管理改善

- [x] 10.1 建立 `src/app/api/travels/[id]/route.ts` DELETE endpoint 實作 Delete Travel（旅程刪除須保護當前旅程）：防止刪除當前旅程（回傳 400），在單一 transaction 內先刪收據再刪旅程
- [x] 10.2 在 `TravelList` 加入刪除按鈕（僅非當前旅程顯示）與確認 Dialog（顯示旅程名稱與警告文字）
- [x] 10.3 旅程卡片改為可點擊：當前旅程點擊導覽至 `/`，其他旅程點擊切換並導覽至 `/`
- [x] 10.4 Navbar 在「🇯🇵 記帳」右側加入 MapPin 圖示按鈕，連結至 `/travels`

## 11. 收據新增彈窗

- [x] 11.1 建立 `src/components/receipts/NewReceiptDialog.tsx` 實作 Receipt Capture Dialog（收據新增改為 dialog 彈窗）：以 `@base-ui/react` Dialog 包裹 `NewReceiptClient`；依狀態控制 `disablePointerDismissal` 與 showCloseButton；實作 Receipt Image Input 入口（相機/相簿）
- [x] 11.2 建立 `src/components/receipts/NewReceiptButton.tsx`：獨立 Client Component，管理 dialog open 狀態，供 Dashboard 空白狀態使用
- [x] 11.3 `NewReceiptClient` 新增 `onStateChange` callback（回報 idle / analyzing / confirm），供 Dialog 控制可否關閉
- [x] 11.4 Navbar「+ 新增收據」按鈕改為觸發 Dialog，移除 `Link href="/receipts/new"`
- [x] 11.5 Dashboard 空白狀態（無收據）使用 `NewReceiptButton` 替代原本的 Link + Button

## 12. UX 改善

- [x] 12.1 Dashboard 加入 Dashboard Empty State：server-side 計算 receiptCount，為 0 時顯示空白引導畫面；有收據時呈現 Trip-Scoped Dashboard 完整視圖
- [x] 12.2 `/receipts/new` 頁面加入「‹ 返回」連結至 Dashboard

## 13. 重複收據偵測

- [x] 13.1 `prisma/schema.prisma` 新增 `image_hash String? @unique` 欄位至 `receipts` 資料表
- [x] 13.2 `src/app/api/analyze-receipt/route.ts` 在呼叫 Gemini 前計算圖片 sha-256 圖片 hash 重複收據偵測，查詢 DB；重複則回傳 409（含 store_name_zh、date、travel_name）
- [x] 13.3 `src/app/api/receipts/route.ts` 接受並儲存 `image_hash` 欄位
- [x] 13.4 `NewReceiptClient` 處理 409 回應，實作 Duplicate Receipt Detection 用戶提示：顯示重複收據錯誤訊息（店名、日期、旅程名稱）
- [x] 13.5 `ReceiptConfirm` 提交時將 `data.image_hash` 帶入 POST body；儲存成功後呼叫 `queryClient.invalidateQueries({ queryKey: ["receipts"] })` 更新 Dashboard
- [x] 13.6 在終端機執行 `pnpm prisma migrate dev --name add_image_hash`，將 `image_hash` 欄位套用至資料庫

## 14. 刪除單筆收據

- [x] 14.1 建立 `src/app/api/receipts/[id]/route.ts` DELETE endpoint：查詢收據是否存在（404）、直接刪除、回傳 `{ ok: true }`
- [x] 14.2 更新 `ReceiptList.tsx`：在展開的收據詳情底部加入「刪除收據」按鈕（Trash2 icon，destructive 樣式）
- [x] 14.3 在 `ReceiptList.tsx` 加入確認 Dialog，顯示店名與「無法復原」警告，確認後呼叫 DELETE endpoint
- [x] 14.4 刪除成功後呼叫 `router.refresh()` 更新列表與統計數字

## 15. 收據流程清理與 UX 優化

- [x] 15.1 刪除 `src/app/receipts/new/page.tsx`（新增收據改由 Navbar 彈窗處理）
- [x] 15.2 移除 `ReceiptList` 與 `RecentReceipts` 的空狀態（Dashboard 已在前端攔截無收據情況）
- [x] 15.3 移除 `ReceiptList` 標題列的「新增」按鈕，改為加入返回 Dashboard 的 ChevronLeft back 按鈕
- [x] 15.4 `RecentReceipts`「查看全部」按鈕從 CardHeader 移至卡片底部（border-top 分隔，視線流向更自然）
- [x] 15.5 `ReceiptConfirm`「重新拍照」按鈕文字更正為「重新選擇」（行為是退回上一步，非直接開啟相機）
- [x] 15.6 `GET /api/receipts` 排序由收據日期（date）改為建立時間（created_at）新到舊
- [x] 15.7 執行 `npx prisma generate` 修復 `image_hash` 欄位 Prisma client 未同步導致的 500 錯誤

## 16. Navbar 與旅程管理重構

- [x] 16.1 `TravelSwitcher` 下拉選單底部新增「旅程管理」選項（Travel Management Navigation Link，Settings icon），點擊以 `router.push("/travels")` 導覽
- [x] 16.2 Navbar 移除 MapPin 旅程管理圖示按鈕（Travel Management Navigation Link 整合至 TravelSwitcher）
- [x] 16.3 Navbar 新增 `minimal` prop，travels 頁面使用 `<Navbar minimal />`，隱藏 travelSwitcher、新增收據按鈕
- [x] 16.4 `src/app/travels/page.tsx` 啟用中旅程置頂：active travel 排第一，其餘依 created_at 倒序

## 17. Next.js 16 遷移修復

- [x] 17.1 將 `src/middleware.ts` 更名為 `src/proxy.ts`，函式名稱由 `middleware` 改為 `proxy`（Next.js 16 breaking change：middleware → proxy），解決 `pnpm dev` 執行數分鐘後崩潰的問題

## 18. Dashboard 圖表暗色主題與效能優化

- [x] 18.1 `LazyCharts.tsx` 兩個 `dynamic()` 呼叫加入 `loading` fallback（Card + Skeleton），DailyChart 為 `h-40`、CategoryChart 為 `h-[180px]`，消除 chart 區域在 hydration 前的空白 CLS
- [x] 18.2 `DailyChart.tsx` 所有圖表元素改用 CSS 變數（`var(--muted-foreground)`、`var(--border)`、`var(--primary)`、`var(--popover)` 等），修正暗色主題下顏色不匹配問題
- [x] 18.3 `DailyChart.tsx` Tooltip 加入 `contentStyle` 覆寫，使用 `var(--popover)`、`var(--border)`、`var(--popover-foreground)`，修正暗色主題下 tooltip 全白問題
- [x] 18.4 `CategoryChart.tsx` Tooltip 同步修正暗色主題 `contentStyle`
- [x] 18.5 `CategoryChart.tsx` 移除以 index 為基礎的本地 `COLORS` 陣列，改用 `getCategoryColor()` 依分類鍵取色，確保與其他元件顏色一致

## 19. 消費分類顏色系統

- [x] 19.1 建立 `src/lib/categories.ts`，定義 `CATEGORIES` 常數（food、shopping、transport、accommodation、sightseeing、other），提供 `getCategoryLabel()` 與 `getCategoryColor()` 共用函式
- [x] 19.2 `RecentReceipts.tsx` 移除本地 `CATEGORY_LABELS`，在分類文字左側加入 `w-2 h-2 rounded-full` 彩色圓點，以 `getCategoryColor()` 設定 `backgroundColor`
- [x] 19.3 `ReceiptList.tsx` 移除本地 `CATEGORY_LABELS`，收據列表的分類 Badge 改用 `getCategoryColor()` 動態設定背景色（30% 透明度）與文字色，`border-0` 移除邊框

## 20. 旅程管理 UX 改善

- [x] 20.1 `CreateTravelDialog.tsx` 建立旅程成功後，呼叫 `/api/travels/:id/activate` 自動啟用新旅程，再以 `router.push("/")` 導覽至 Dashboard，使用者無需手動切換
- [x] 20.2 `src/app/api/travels/[id]/route.ts` DELETE endpoint 移除「當前旅程不可刪除」的 400 防護，允許刪除任何旅程（含 active travel）
- [x] 20.3 `TravelList.tsx` 刪除按鈕移除 `{!isActive && ...}` 條件，所有旅程（含啟用中）均顯示刪除按鈕
