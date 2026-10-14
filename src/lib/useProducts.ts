import { useCallback, useEffect, useState } from "react";
import type { Product } from "../types";
import { fetchProducts } from "./api";

export type Status = "loading" | "error" | "success";

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<Status>("loading");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    const controller = new AbortController();
    setStatus("loading");
    fetchProducts(controller.signal)
      .then((data) => {
        setProducts(data);
        setStatus("success");
      })
      .catch((error: unknown) => {
        if (error instanceof DOMException && error.name === "AbortError") return;
        console.error(error);
        setStatus("error");
      });
    return () => controller.abort();
  }, [attempt]);

  const retry = useCallback(() => setAttempt((n) => n + 1), []);

  return { products, status, retry };
}
