export interface Customer {
  id: string;
  loyalty_card_number?: string;
  name?: string;
  email?: string;
  phone?: string;
  points: number;
  created_at: string;
  updated_at: string;
}

export interface Visitor {
  id: string;
  created_at: string;
}