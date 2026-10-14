import { useCart } from "../cart/CartContext";
import { formatPrice } from "../lib/money";

interface Props {
  open: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export default function CartSidebar({ open, onClose, onCheckout }: Props) {
  const { items, totalPrice, dispatch } = useCart();

  function handleClear() {
    if (items.length > 0 && window.confirm("Are you sure you want to clear your cart?")) {
      dispatch({ type: "clear" });
    }
  }

  return (
    <>
      <div className={`overlay${open ? " active" : ""}`} onClick={onClose} />
      <aside className={`cart-sidebar${open ? " active" : ""}`} aria-label="Shopping cart" aria-hidden={!open}>
        <div className="cart-header">
          <h2>Your Cart</h2>
          <button onClick={onClose} aria-label="Close cart">✕</button>
        </div>

        <div className="cart-items">
          {items.length === 0 ? (
            <div style={{ textAlign: "center", padding: 40 }}>
              <h3>Your cart is empty</h3>
              <p>Add some products to get started.</p>
            </div>
          ) : (
            items.map((item) => (
              <div className="cart-item" key={item.id}>
                <img src={item.thumbnail} alt={item.title} />
                <div className="cart-item-info">
                  <h4>{item.title}</h4>
                  <p className="cart-price">{formatPrice(item.price * item.quantity)}</p>
                  <div className="quantity-controls">
                    <button
                      onClick={() => dispatch({ type: "changeQuantity", id: item.id, amount: -1 })}
                      aria-label={`Decrease quantity of ${item.title}`}
                    >
                      −
                    </button>
                    <span aria-label={`Quantity of ${item.title}`}>{item.quantity}</span>
                    <button
                      onClick={() => dispatch({ type: "changeQuantity", id: item.id, amount: 1 })}
                      aria-label={`Increase quantity of ${item.title}`}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="remove-item"
                    onClick={() => dispatch({ type: "remove", id: item.id })}
                    aria-label={`Remove ${item.title}`}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="cart-footer">
          <div className="cart-total">
            <span>Total:</span>
            <strong data-testid="cart-total">{formatPrice(totalPrice)}</strong>
          </div>
          <button className="clear-cart" onClick={handleClear}>Clear Cart</button>
          <button className="checkout-button" onClick={onCheckout} disabled={items.length === 0}>
            Checkout
          </button>
        </div>
      </aside>
    </>
  );
}
