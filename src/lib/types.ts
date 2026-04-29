export interface Travel {
  id: string;
  name: string;
  start_date: Date | string | null;
  end_date: Date | string | null;
  is_active: boolean;
  created_at: Date | string;
}

export interface ReceiptItem {
  name: string;
  name_zh: string;
  price: number;
}

export interface Receipt {
  id: string;
  travel_id: string;
  date: Date | string;
  store_name: string;
  store_name_zh: string;
  total_amount: number;
  total_amount_twd: number;
  exchange_rate: number | string;
  tax_type: string;
  category: string;
  items: unknown;
  notes: string | null;
  created_at: Date | string;
}
