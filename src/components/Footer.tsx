export default function Footer() {
  return (
    <footer id="about">
      <div className="footer-content">
        <div>
          <h3>ShopFlow</h3>
          <p>A modern e-commerce frontend built with React and TypeScript.</p>
        </div>
        <div>
          <h4>Quick Links</h4>
          <a href="#home">Home</a>
          <a href="#products">Shop</a>
        </div>
        <div>
          <h4>Technology</h4>
          <p>React 19</p>
          <p>TypeScript</p>
          <p>Vite</p>
          <p>Vitest + Testing Library</p>
        </div>
      </div>
      <p className="copyright">© 2026 ShopFlow. Built for portfolio purposes.</p>
    </footer>
  );
}
