import { CART_KEY, loadCart, saveCart } from "./storage";

describe("cart storage", () => {
  it("returns an empty cart when nothing is saved", () => {
    expect(loadCart()).toEqual([]);
  });

  it("round-trips a saved cart", () => {
    const items = [{ id: 1, title: "A", price: 5, thumbnail: "x", quantity: 2 }];
    saveCart(items);
    expect(loadCart()).toEqual(items);
  });

  it("ignores corrupted JSON instead of crashing", () => {
    localStorage.setItem(CART_KEY, "{not json");
    expect(loadCart()).toEqual([]);
  });

  it("drops entries that have the wrong shape", () => {
    localStorage.setItem(CART_KEY, JSON.stringify([{ id: "1" }, { id: 2, title: "B", price: 1, thumbnail: "t", quantity: 1 }]));
    expect(loadCart()).toHaveLength(1);
  });
});
