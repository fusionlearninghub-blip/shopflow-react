import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useCart } from "./cart/CartContext";
import CartSidebar from "./components/CartSidebar";
import CheckoutModal from "./components/CheckoutModal";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import ProductCard from "./components/ProductCard";
import ProductModal from "./components/ProductModal";
import ShopControls from "./components/ShopControls";
import { filterProducts, getCategories } from "./lib/filterProducts";
import { useProducts } from "./lib/useProducts";
import type { Product, SortKey } from "./types";

export default function App() {
  const { products, status, retry } = useProducts();
  const { dispatch } = useCart();

  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState<SortKey>("default");
  const [cartOpen, setCartOpen] = useState(false);
  const [checkoutOpen, setCheckoutOpen] = useState(false);
  const [selected, setSelected] = useState<Product | null>(null);
  const [toast, setToast] = useState("");
  const toastTimer = useRef<number | undefined>(undefined);

  const categories = useMemo(() => getCategories(products), [products]);
  const visible = useMemo(
    () => filterProducts(products, search, category, sort),
    [products, search, category, sort],
  );

  const addToCart = useCallback(
    (product: Product) => {
      dispatch({ type: "add", product });
      setToast(`${product.title} added to cart`);
      window.clearTimeout(toastTimer.current);
      toastTimer.current = window.setTimeout(() => setToast(""), 2500);
    },
    [dispatch],
  );

  useEffect(() => () => window.clearTimeout(toastTimer.current), []);

  const closeProduct = useCallback(() => setSelected(null), []);
  const closeCheckout = useCallback(() => setCheckoutOpen(false), []);

  return (
    <>
      <Header onOpenCart={() => setCartOpen(true)} />
      <Hero />

      <main id="products" className="products-section">
        <div className="section-heading">
          <div>
            <p className="section-label">OUR PRODUCTS</p>
            <h2>Explore Our Store</h2>
          </div>
        </div>

        <ShopControls
          search={search}
          category={category}
          sort={sort}
          categories={categories}
          onSearch={setSearch}
          onCategory={setCategory}
          onSort={setSort}
        />

        {status === "loading" && <div className="loading" role="status">Loading products...</div>}

        {status === "error" && (
          <div className="error-message" role="alert">
            Unable to load products. Please try again.
            <div>
              <button className="retry-button" onClick={retry}>Try again</button>
            </div>
          </div>
        )}

        {status === "success" && visible.length === 0 && (
          <div className="no-products">
            <h3>No products found</h3>
            <p>Try another search or category.</p>
          </div>
        )}

        <div className="product-grid">
          {visible.map((p) => (
            <ProductCard key={p.id} product={p} onAdd={addToCart} onView={setSelected} />
          ))}
        </div>
      </main>

      <CartSidebar
        open={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          setCheckoutOpen(true);
        }}
      />

      {selected && <ProductModal product={selected} onClose={closeProduct} onAdd={addToCart} />}
      {checkoutOpen && <CheckoutModal onClose={closeCheckout} />}

      <div className={`toast${toast ? " show" : ""}`} role="status" aria-live="polite">
        {toast}
      </div>

      <Footer />
    </>
  );
}
