export interface Product {
  id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  rating: number;
  stock: number;
  brand?: string;
  discountPercentage: number;
  thumbnail: string;
  images: string[];
}

export interface CartItem {
  id: number;
  title: string;
  price: number;
  thumbnail: string;
  quantity: number;
}

export type SortKey = "default" | "price-low" | "price-high" | "rating" | "name";
