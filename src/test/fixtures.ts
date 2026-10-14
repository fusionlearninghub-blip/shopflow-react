import type { Product } from "../types";

export const makeProduct = (over: Partial<Product> = {}): Product => ({
  id: 1,
  title: "Red Lipstick",
  description: "A bold red lipstick.",
  category: "beauty",
  price: 12.99,
  rating: 4.2,
  stock: 20,
  brand: "Essence",
  discountPercentage: 5,
  thumbnail: "https://example.com/1.png",
  images: ["https://example.com/1-large.png"],
  ...over,
});

export const PRODUCTS: Product[] = [
  makeProduct({ id: 1, title: "Red Lipstick", category: "beauty", price: 12.99, rating: 4.2 }),
  makeProduct({ id: 2, title: "Apple Watch", category: "accessories", price: 199, rating: 4.8 }),
  makeProduct({ id: 3, title: "Blue Jeans", category: "clothing", price: 45.5, rating: 3.9 }),
];
