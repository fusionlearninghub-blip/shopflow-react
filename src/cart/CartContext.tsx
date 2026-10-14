import { createContext, useContext, useEffect, useMemo, useReducer, type ReactNode } from "react";
import type { CartItem } from "../types";
import { cartReducer, cartTotals, type CartAction } from "./cartReducer";
import { loadCart, saveCart } from "./storage";

interface CartContextValue {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  dispatch: React.Dispatch<CartAction>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, dispatch] = useReducer(cartReducer, undefined, loadCart);

  useEffect(() => {
    saveCart(items);
  }, [items]);

  const value = useMemo(() => ({ items, ...cartTotals(items), dispatch }), [items]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside <CartProvider>");
  return ctx;
}
