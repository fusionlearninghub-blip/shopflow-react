import type { CartItem } from "../types";

export const CART_KEY = "shopflowCart";

function isCartItem(value: unknown): value is CartItem {
  if (typeof value !== "object" || value === null) return false;
  const v = value as Record<string, unknown>;
  return (
    typeof v.id === "number" &&
    typeof v.title === "string" &&
    typeof v.price === "number" &&
    typeof v.thumbnail === "string" &&
    typeof v.quantity === "number" &&
    v.quantity > 0
  );
}

/** Reads the saved cart. Bad or missing data returns an empty cart instead of crashing. */
export function loadCart(): CartItem[] {
  try {
    const raw = localStorage.getItem(CART_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed.filter(isCartItem) : [];
  } catch {
    return [];
  }
}

export function saveCart(items: CartItem[]): void {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(items));
  } catch {
    /* storage full or blocked: the cart still works for this visit */
  }
}
