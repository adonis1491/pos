export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  description?: string;
};

export type NewProduct = Partial<Product>;