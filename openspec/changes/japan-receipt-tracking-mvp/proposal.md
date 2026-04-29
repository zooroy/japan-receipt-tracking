## Why

旅行日本時，消費以現金或感應式付款為主，難以即時追蹤花費明細。透過拍攝收據並讓 AI 自動擷取與翻譯資料，可以大幅降低記帳摩擦，讓旅行者隨時掌握消費狀況。

## What Changes

- 建立全新的 Next.js 16 Web App（支援 PWA，可在手機瀏覽器使用相機）
- 實作旅程管理功能，使用者可建立多個旅程，收據自動歸屬於當前旅程
- 實作收據拍照上傳流程，呼叫 Gemini 2.0 Flash 擷取店名、金額、品項、稅別，並翻譯為繁體中文
- 整合 ExchangeRate-API 進行每日 JPY → TWD 匯率快取換算
- 建立 Dashboard 首頁，以旅程為單位顯示花費統計圖表與摘要資訊
- 實作收據列表頁，依旅程顯示收據，支援關鍵字搜尋
- 以 Next.js Middleware 密碼保護 App，僅限本人存取

## Non-Goals

- 不支援多人共用或旅行分帳功能（MVP 僅限個人使用）
- 不儲存收據原始圖片（圖片送 Gemini 分析後即丟棄，不上傳至雲端）
- 不支援多幣別（僅追蹤日圓，換算台幣）
- 不支援手動新增收據（MVP 僅支援拍照掃描）
- 不支援多人共用旅程或分帳（旅程僅限個人使用）

## Capabilities

### New Capabilities

- `user-auth`: 以 Next.js Middleware 驗證密碼 cookie，保護所有路由，僅允許持有正確密碼的裝置存取，無帳號系統
- `travel-management`: 建立與管理旅程（名稱、起迄日期），切換當前使用中旅程，所有收據與統計以旅程為單位隔離
- `receipt-capture`: 拍攝或上傳收據圖片，呼叫 Gemini 2.0 Flash 擷取結構化資料（店名、金額、品項、稅別），並翻譯為繁體中文，使用者確認後儲存至當前旅程
- `currency-conversion`: 整合 ExchangeRate-API，每日快取 JPY → TWD 匯率，於新增收據時自動換算並儲存當日匯率
- `dashboard`: 首頁儀表板，以當前旅程為範圍顯示總花費（日圓與台幣）、每日花費趨勢長條圖、消費分類圓環圖、稅別統計、今日匯率與最近收據列表
- `receipt-list`: 收據列表頁，顯示當前旅程的所有收據，支援關鍵字搜尋

### Modified Capabilities

（無，此為全新專案）

## Impact

- Affected specs: user-auth, travel-management, receipt-capture, currency-conversion, dashboard, receipt-list
- Affected code:
  - New: src/app/layout.tsx
  - New: src/app/page.tsx
  - New: src/app/login/page.tsx
  - New: src/app/api/auth/login/route.ts
  - New: src/app/travels/page.tsx
  - New: src/app/receipts/page.tsx
  - New: src/app/receipts/new/page.tsx
  - New: src/components/travels/TravelSwitcher.tsx
  - New: src/components/travels/CreateTravelDialog.tsx
  - New: src/app/api/receipts/route.ts
  - New: src/app/api/exchange-rate/route.ts
  - New: src/app/api/analyze-receipt/route.ts
  - New: src/lib/supabase.ts
  - New: src/lib/gemini.ts
  - New: src/lib/exchange-rate.ts
  - New: src/components/dashboard/SpendingOverview.tsx
  - New: src/components/dashboard/DailyChart.tsx
  - New: src/components/dashboard/CategoryChart.tsx
  - New: src/components/dashboard/RecentReceipts.tsx
  - New: src/components/receipts/ReceiptCapture.tsx
  - New: src/components/receipts/ReceiptConfirm.tsx
  - New: src/components/receipts/ReceiptList.tsx
  - New: prisma/schema.prisma
  - New: middleware.ts
