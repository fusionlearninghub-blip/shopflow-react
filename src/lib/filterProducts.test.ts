import { filterProducts, getCategories } from "./filterProducts";
import { PRODUCTS } from "../test/fixtures";

describe("filterProducts", () => {
  it("returns everything with no filters", () => {
    expect(filterProducts(PRODUCTS, "", "all", "default")).toHaveLength(3);
  });

  it("searches titles case-insensitively", () => {
    const result = filterProducts(PRODUCTS, "  APPLE ", "all", "default");
    expect(result.map((p) => p.title)).toEqual(["Apple Watch"]);
  });

  it("filters by category", () => {
    expect(filterProducts(PRODUCTS, "", "clothing", "default").map((p) => p.id)).toEqual([3]);
  });

  it("combines search and category", () => {
    expect(filterProducts(PRODUCTS, "red", "clothing", "default")).toEqual([]);
  });

  it("sorts by price low to high and high to low", () => {
    expect(filterProducts(PRODUCTS, "", "all", "price-low").map((p) => p.id)).toEqual([1, 3, 2]);
    expect(filterProducts(PRODUCTS, "", "all", "price-high").map((p) => p.id)).toEqual([2, 3, 1]);
  });

  it("sorts by rating and by name", () => {
    expect(filterProducts(PRODUCTS, "", "all", "rating").map((p) => p.id)).toEqual([2, 1, 3]);
    expect(filterProducts(PRODUCTS, "", "all", "name").map((p) => p.title)).toEqual([
      "Apple Watch",
      "Blue Jeans",
      "Red Lipstick",
    ]);
  });

  it("does not change the original array order", () => {
    const ids = PRODUCTS.map((p) => p.id);
    filterProducts(PRODUCTS, "", "all", "price-high");
    expect(PRODUCTS.map((p) => p.id)).toEqual(ids);
  });
});

describe("getCategories", () => {
  it("returns unique sorted categories", () => {
    expect(getCategories(PRODUCTS)).toEqual(["accessories", "beauty", "clothing"]);
  });
});
