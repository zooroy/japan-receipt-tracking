import { GoogleGenerativeAI, SchemaType } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const receiptSchema: any = {
  type: SchemaType.OBJECT,
  properties: {
    store_name: { type: SchemaType.STRING, description: "店名（日文原文）" },
    store_name_zh: { type: SchemaType.STRING, description: "店名繁體中文翻譯" },
    date: { type: SchemaType.STRING, description: "消費日期 YYYY-MM-DD 格式，如收據上沒有日期則用今天" },
    total_amount: { type: SchemaType.INTEGER, description: "總金額（日圓整數，不含貨幣符號）" },
    tax_type: {
      type: SchemaType.STRING,
      enum: ["reduced_8", "standard_10", "tax_free", "unknown"],
      description: "稅別：reduced_8=8%輕減稅率、standard_10=10%標準稅率、tax_free=免稅、unknown=不明",
    },
    category: {
      type: SchemaType.STRING,
      enum: ["food", "shopping", "transport", "accommodation", "sightseeing", "other"],
      description: "消費分類：food=飲食、shopping=購物、transport=交通、accommodation=住宿、sightseeing=觀光、other=其他",
    },
    items: {
      type: SchemaType.ARRAY,
      description: "品項明細",
      items: {
        type: SchemaType.OBJECT,
        properties: {
          name: { type: SchemaType.STRING, description: "品項名稱（日文）" },
          name_zh: { type: SchemaType.STRING, description: "品項名稱繁體中文" },
          price: { type: SchemaType.INTEGER, description: "品項金額（日圓整數）" },
        },
        required: ["name", "name_zh", "price"],
      },
    },
  },
  required: ["store_name", "store_name_zh", "date", "total_amount", "tax_type", "category", "items"],
};

export interface ReceiptData {
  store_name: string;
  store_name_zh: string;
  date: string;
  total_amount: number;
  tax_type: "reduced_8" | "standard_10" | "tax_free" | "unknown";
  category: "food" | "shopping" | "transport" | "accommodation" | "sightseeing" | "other";
  items: { name: string; name_zh: string; price: number }[];
  image_hash?: string;
}

export async function analyzeReceipt(base64Image: string, mimeType: string): Promise<ReceiptData> {
  const model = genAI.getGenerativeModel({
    model: "gemini-2.5-flash-lite",
    generationConfig: {
      responseMimeType: "application/json",
      responseSchema: receiptSchema,
    },
  });

  const prompt = `請分析這張日本收據圖片，擷取以下資訊：
- 店名（日文原文及繁體中文翻譯）
- 消費日期（YYYY-MM-DD 格式）
- 總金額（日圓整數）
- 稅別（8%輕減稅率/10%標準稅率/免稅/不明）
- 消費分類（飲食/購物/交通/住宿/觀光/其他）
- 所有品項明細（含日文名稱、繁體中文名稱、金額）

請以 JSON 格式回傳，確保 total_amount 與 items price 均為整數日圓金額。`;

  const result = await model.generateContent([
    { text: prompt },
    { inlineData: { data: base64Image, mimeType } },
  ]);

  return JSON.parse(result.response.text()) as ReceiptData;
}
