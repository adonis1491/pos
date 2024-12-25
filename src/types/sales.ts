export type OrderItem = {
  id: string;
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  total: number;
  timestamp: string;
};

export type Order = {
  id: string;
  items: OrderItem[];
  total: number;
  paymentType: string;
  timestamp: string;
};

export type DailyRevenue = {
  date: string;
  totalAmount: number;
  orderCount: number;
  topSellingItems: {
    productName: string;
    quantity: number;
    revenue: number;
  }[];
};