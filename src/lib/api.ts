import type { Product } from "../types";

export const API_URL = "https://dummyjson.com/products?limit=100";

export async function fetchProducts(signal?: AbortSignal): Promise<Product[]> {
  const response = await fetch(API_URL, { signal });
  if (!response.ok) {
    throw new Error(`Failed to fetch products (${response.status})`);
  }
  const data: { products: Product[] } = await response.json();
  return data.products;
}
