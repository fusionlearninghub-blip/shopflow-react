import type { Product } from "../types";
import { formatPrice } from "../lib/money";

interface Props {
  product: Product;
  onAdd: (product: Product) => void;
  onView: (product: Product) => void;
}

export default function ProductCard({ product, onAdd, onView }: Props) {
  return (
    <article className="product-card">
      <img src={product.thumbnail} alt={product.title} className="product-image" loading="lazy" />
      <div className="product-info">
        <p className="product-category">{product.category}</p>
        <h3 className="product-title">
          <button className="link-button" onClick={() => onView(product)}>
            {product.title}
          </button>
        </h3>
        <div className="product-rating">⭐ {product.rating.toFixed(1)}</div>
        <div className="product-bottom">
          <span className="product-price">{formatPrice(product.price)}</span>
          <button className="add-button" onClick={() => onAdd(product)} aria-label={`Add ${product.title} to cart`}>
            Add to Cart
          </button>
        </div>
      </div>
    </article>
  );
}
