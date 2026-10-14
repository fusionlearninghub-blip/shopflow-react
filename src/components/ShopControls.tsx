import type { SortKey } from "../types";

interface Props {
  search: string;
  category: string;
  sort: SortKey;
  categories: string[];
  onSearch: (value: string) => void;
  onCategory: (value: string) => void;
  onSort: (value: SortKey) => void;
}

export default function ShopControls({ search, category, sort, categories, onSearch, onCategory, onSort }: Props) {
  return (
    <div className="shop-controls">
      <label className="visually-hidden" htmlFor="search-input">Search products</label>
      <input
        id="search-input"
        type="text"
        placeholder="Search products..."
        value={search}
        onChange={(e) => onSearch(e.target.value)}
      />

      <label className="visually-hidden" htmlFor="category-select">Category</label>
      <select id="category-select" value={category} onChange={(e) => onCategory(e.target.value)}>
        <option value="all">All Categories</option>
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      <label className="visually-hidden" htmlFor="sort-select">Sort</label>
      <select id="sort-select" value={sort} onChange={(e) => onSort(e.target.value as SortKey)}>
        <option value="default">Sort By</option>
        <option value="price-low">Price: Low → High</option>
        <option value="price-high">Price: High → Low</option>
        <option value="rating">Highest Rating</option>
        <option value="name">Name: A → Z</option>
      </select>
    </div>
  );
}
