import { useEffect } from "react";
import type { Product } from "../types";
import { formatPrice } from "../lib/money";

interface Props {
  product: Product;
  onClose: () => void;
  onAdd: (product: Product) => void;
}

export default function ProductModal({ product, onClose, onAdd }: Props) {
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  return (
    <div className="modal" onClick={onClose}>
      <div
        className="modal-content"
        role="dialog"
        aria-modal="true"
        aria-label={product.title}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="close-modal" onClick={onClose} aria-label="Close details">✕</button>
        <div className="details-container">
          <img src={product.images[0] ?? product.thumbnail} alt={product.title} className="details-image" />
          <div className="details-info">
            <p className="product-category">{product.category}</p>
            <h2>{product.title}</h2>
            <p>{product.description}</p>
            <p>⭐ {product.rating.toFixed(1)}</p>
            <p><strong>Brand:</strong> {product.brand ?? "N/A"}</p>
            <p><strong>Stock:</strong> {product.stock}</p>
            <p><strong>Discount:</strong> {product.discountPercentage}%</p>
            <div className="details-price">{formatPrice(product.price)}</div>
            <button
              className="details-button"
              onClick={() => {
                onAdd(product);
                onClose();
              }}
            >
              Add to Cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
