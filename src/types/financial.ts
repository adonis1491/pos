export interface DailyFinancials {
  id: string;
  date: string;
  total_sales: number;
  total_orders: number;
  created_at: string;
  updated_at: string;
}

export interface OrderSummary {
  id: string;
  total: number;
  payment_type: string;
  customer_id?: string;
  visitor_id?: string;
  created_at: string;
  items: {
    product_name: string;
    quantity: number;
    price: number;
    total: number;
  }[];
}