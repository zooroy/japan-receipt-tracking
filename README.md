# Japan Receipt Tracking

日本旅遊收據管理 App，支援拍照上傳、AI 自動辨識收據內容、日幣台幣即時換算，並提供旅程維度的消費統計儀表板。

## 功能概覽

- **收據掃描**：上傳收據照片，由 Gemini AI 自動擷取店名、金額、品項明細、消費分類、稅別
- **多旅程管理**：依旅程分類管理收據，隨時切換當前旅程
- **消費儀表板**：總支出概覽、每日消費折線圖、分類圓餅圖、稅別統計
- **日幣換算**：即時取得 JPY → TWD 匯率，每筆收據同時記錄日幣與台幣金額
- **重複偵測**：透過圖片 hash 防止重複上傳同一張收據
- **單一密碼認證**：簡易密碼保護，JWT 維持登入狀態

## 技術架構

```
src/
├── app/                  # Next.js App Router
│   ├── page.tsx          # 儀表板（Server Component）
│   ├── login/            # 登入頁
│   ├── travels/          # 旅程管理
│   ├── receipts/         # 收據列表
│   └── api/              # API Routes
│       ├── auth/         # 登入 / 登出
│       ├── receipts/     # 收據 CRUD
│       ├── travels/      # 旅程 CRUD
│       ├── analyze-receipt/  # AI 辨識
│       └── exchange-rate/    # 匯率查詢
├── components/           # React 元件
│   ├── dashboard/        # 儀表板元件（圖表、統計）
│   ├── receipts/         # 收據相關元件
│   ├── travels/          # 旅程相關元件
│   ├── layout/           # Navbar 等版面元件
│   └── ui/               # 基礎 UI 元件（shadcn）
├── lib/                  # 工具與共用邏輯
│   ├── auth.ts           # JWT 驗證
│   ├── gemini.ts         # Gemini AI 整合
│   ├── exchange-rate.ts  # 匯率查詢與快取
│   ├── prisma.ts         # Prisma client
│   ├── queries.ts        # 資料庫查詢
│   ├── categories.ts     # 消費分類設定
│   └── types.ts          # 共用型別
└── proxy.ts              # Auth middleware
```

## 開發框架與套件

| 類別 | 套件 |
|---|---|
| 框架 | Next.js 16、React 19 |
| 資料庫 ORM | Prisma 7（PostgreSQL） |
| UI 元件 | shadcn/ui、Base UI |
| 樣式 | Tailwind CSS 4 |
| 圖表 | Recharts |
| 表單 | React Hook Form + Zod |
| 資料請求 | TanStack Query |
| 認證 | jose（JWT） |
| 日期 | date-fns、react-day-picker |

## 使用的外部 API

| API | 用途 |
|---|---|
| [Google Gemini API](https://ai.google.dev/)（`gemini-2.5-flash-lite`） | 收據圖片辨識：店名、金額、品項、分類、稅別 |
| [ExchangeRate-API](https://www.exchangerate-api.com/) | JPY → TWD 即時匯率，結果快取於資料庫避免重複呼叫 |

## 資料模型

```
Travel        旅程（名稱、起訖日期、是否啟用）
  └── Receipt 收據（店名、日幣金額、台幣金額、匯率、分類、稅別、品項 JSON、圖片 hash）

ExchangeRateCache  匯率每日快取
```

## 環境變數

```env
DATABASE_URL=           # PostgreSQL 連線字串
APP_PASSWORD=           # 登入密碼（同時作為 JWT secret）
GEMINI_API_KEY=         # Google Gemini API 金鑰
EXCHANGE_RATE_API_KEY=  # ExchangeRate-API 金鑰
```

## 本地開發

```bash
# 安裝依賴
pnpm install

# 初始化資料庫
pnpm prisma migrate dev

# 啟動開發伺服器
pnpm dev
```

## 操作流程

1. **登入**：輸入設定的密碼（`APP_PASSWORD`）
2. **建立旅程**：輸入旅程名稱與日期，設為當前旅程
3. **新增收據**：點「+ 新增收據」，上傳收據照片
4. **AI 辨識**：系統自動辨識並填入店名、金額、分類等欄位，可手動修正
5. **查看儀表板**：切換旅程即可查看該旅程的消費總覽與圖表分析
6. **旅程切換**：Navbar 頂部可隨時切換不同旅程
