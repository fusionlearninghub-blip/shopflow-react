import type { CartItem, Product } from "../types";

export type CartAction =
  | { type: "add"; product: Product }
  | { type: "changeQuantity"; id: number; amount: number }
  | { type: "remove"; id: number }
  | { type: "clear" };

export function cartReducer(state: CartItem[], action: CartAction): CartItem[] {
  switch (action.type) {
    case "add": {
      const { product } = action;
      const exists = state.some((item) => item.id === product.id);
      if (exists) {
        return state.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item,
        );
      }
      return [
        ...state,
        {
          id: product.id,
          title: product.title,
          price: product.price,
          thumbnail: product.thumbnail,
          quantity: 1,
        },
      ];
    }
    case "changeQuantity":
      return state
        .map((item) =>
          item.id === action.id ? { ...item, quantity: item.quantity + action.amount } : item,
        )
        .filter((item) => item.quantity > 0);
    case "remove":
      return state.filter((item) => item.id !== action.id);
    case "clear":
      return [];
  }
}

export const cartTotals = (items: CartItem[]) => ({
  totalItems: items.reduce((sum, item) => sum + item.quantity, 0),
  totalPrice: items.reduce((sum, item) => sum + item.price * item.quantity, 0),
});
