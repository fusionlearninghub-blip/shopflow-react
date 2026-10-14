import { useCart } from "../cart/CartContext";

export default function Header({ onOpenCart }: { onOpenCart: () => void }) {
  const { totalItems } = useCart();
  return (
    <header className="navbar">
      <div className="logo">
        Shop<span>Flow</span>
      </div>
      <nav aria-label="Main">
        <a href="#home">Home</a>
        <a href="#products">Shop</a>
        <a href="#about">About</a>
      </nav>
      <div className="nav-actions">
        <button className="cart-button" onClick={onOpenCart} aria-label={`Open cart, ${totalItems} items`}>
          🛒 Cart <span id="cart-count">{totalItems}</span>
        </button>
      </div>
    </header>
  );
}
