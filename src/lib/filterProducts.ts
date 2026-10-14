import type { Product, SortKey } from "../types";

export function filterProducts(
  products: Product[],
  search: string,
  category: string,
  sort: SortKey,
): Product[] {
  const term = search.trim().toLowerCase();

  const result = products.filter(
    (p) =>
      p.title.toLowerCase().includes(term) &&
      (category === "all" || p.category === category),
  );

  switch (sort) {
    case "price-low":
      return result.sort((a, b) => a.price - b.price);
    case "price-high":
      return result.sort((a, b) => b.price - a.price);
    case "rating":
      return result.sort((a, b) => b.rating - a.rating);
    case "name":
      return result.sort((a, b) => a.title.localeCompare(b.title));
    default:
      return result;
  }
}

export function getCategories(products: Product[]): string[] {
  return [...new Set(products.map((p) => p.category))].sort();
}
