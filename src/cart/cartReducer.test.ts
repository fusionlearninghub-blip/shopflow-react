import { cartReducer, cartTotals } from "./cartReducer";
import { makeProduct } from "../test/fixtures";

const lipstick = makeProduct({ id: 1, price: 10 });
const watch = makeProduct({ id: 2, title: "Watch", price: 100 });

describe("cartReducer", () => {
  it("adds a new product with quantity 1", () => {
    const state = cartReducer([], { type: "add", product: lipstick });
    expect(state).toEqual([
      { id: 1, title: "Red Lipstick", price: 10, thumbnail: lipstick.thumbnail, quantity: 1 },
    ]);
  });

  it("increases quantity when the same product is added again", () => {
    let state = cartReducer([], { type: "add", product: lipstick });
    state = cartReducer(state, { type: "add", product: lipstick });
    expect(state).toHaveLength(1);
    expect(state[0].quantity).toBe(2);
  });

  it("does not mutate the previous state", () => {
    const before = cartReducer([], { type: "add", product: lipstick });
    const snapshot = JSON.parse(JSON.stringify(before));
    cartReducer(before, { type: "add", product: lipstick });
    expect(before).toEqual(snapshot);
  });

  it("changes quantity up and down", () => {
    let state = cartReducer([], { type: "add", product: lipstick });
    state = cartReducer(state, { type: "changeQuantity", id: 1, amount: 2 });
    expect(state[0].quantity).toBe(3);
    state = cartReducer(state, { type: "changeQuantity", id: 1, amount: -1 });
    expect(state[0].quantity).toBe(2);
  });

  it("removes an item when quantity reaches zero", () => {
    const state = cartReducer(
      cartReducer([], { type: "add", product: lipstick }),
      { type: "changeQuantity", id: 1, amount: -1 },
    );
    expect(state).toEqual([]);
  });

  it("removes one item and leaves the others", () => {
    let state = cartReducer([], { type: "add", product: lipstick });
    state = cartReducer(state, { type: "add", product: watch });
    state = cartReducer(state, { type: "remove", id: 1 });
    expect(state.map((i) => i.id)).toEqual([2]);
  });

  it("clears the cart", () => {
    const state = cartReducer(cartReducer([], { type: "add", product: lipstick }), { type: "clear" });
    expect(state).toEqual([]);
  });

  it("calculates totals", () => {
    let state = cartReducer([], { type: "add", product: lipstick });
    state = cartReducer(state, { type: "add", product: lipstick });
    state = cartReducer(state, { type: "add", product: watch });
    expect(cartTotals(state)).toEqual({ totalItems: 3, totalPrice: 120 });
  });
});
