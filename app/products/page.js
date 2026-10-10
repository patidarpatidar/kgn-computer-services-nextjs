"use client";

import { useEffect, useMemo, useState, Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Search, SlidersHorizontal, X, Heart, ArrowUpDown,
  GitCompareArrows, Eye, ShoppingBag, Check, Star,
  ChevronDown, RotateCcw, MessageCircle, PackageCheck
} from "lucide-react";

import { useStore } from "../../components/StoreProvider";
import ProductCard from "../../components/ProductCard";
import categories from "../../data/categories.json";
import "./products.css";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

function ProductListing() {
const { products = [], addToCart } = useStore();
const [cartNotice, setCartNotice] = useState("");  const params = useSearchParams();

  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [sort, setSort] = useState("featured");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [featuredOnly, setFeaturedOnly] = useState(false);
  const [wishlist, setWishlist] = useState([]);
  const [compareIds, setCompareIds] = useState([]);
  const [quickView, setQuickView] = useState(null);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);
  const [wishlistOnly, setWishlistOnly] = useState(false);

  useEffect(() => {
    setCategory(params.get("category") || "all");
  }, [params]);

  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem("kgn-wishlist") || "[]"));
    } catch {
      setWishlist([]);
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("kgn-wishlist", JSON.stringify(wishlist));
    } catch {
      // The page remains usable if browser storage is unavailable.
    }
  }, [wishlist]);

  const maxAvailablePrice = useMemo(
    () =>
      Math.max(
        0,
        ...products
          .filter((p) => p.active !== false)
          .map((p) => Number(p.price) || 0)
      ),
    [products]
  );

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();

    return products
      .filter((p) => {
        if (p.active === false) return false;

        const categoryName =
          categories.find((c) => c.id === p.category)?.name || p.category;

        const text = [
          p.name, p.description, p.category, categoryName,
          p.slug, p.badge, ...(p.specs || [])
        ].filter(Boolean).join(" ").toLowerCase();

        if (q && !text.includes(q)) return false;
        if (category !== "all" && p.category !== category) return false;
        if (minPrice !== "" && Number(p.price) < Number(minPrice)) return false;
        if (maxPrice !== "" && Number(p.price) > Number(maxPrice)) return false;
        if (inStockOnly && !(Number(p.stock) > 0)) return false;
        if (featuredOnly && !p.featured) return false;
        if (wishlistOnly && !wishlist.includes(p.id)) return false;

        return true;
      })
      .sort((a, b) => {
        if (sort === "price-low") return a.price - b.price;
        if (sort === "price-high") return b.price - a.price;
        if (sort === "name") return a.name.localeCompare(b.name);
        if (sort === "discount") {
          const discount = (p) =>
            p.oldPrice > p.price
              ? (p.oldPrice - p.price) / p.oldPrice
              : 0;
          return discount(b) - discount(a);
        }
        return Number(b.featured) - Number(a.featured);
      });
  }, [
    products, query, category, sort, minPrice, maxPrice,
    inStockOnly, featuredOnly, wishlistOnly, wishlist
  ]);

  const comparedProducts = products.filter((p) =>
    compareIds.includes(p.id) && p.active !== false
  );

  const hasFilters =
    query || category !== "all" || minPrice !== "" ||
    maxPrice !== "" || inStockOnly || featuredOnly || wishlistOnly;

  function resetFilters() {
    setQuery("");
    setCategory("all");
    setSort("featured");
    setMinPrice("");
    setMaxPrice("");
    setInStockOnly(false);
    setFeaturedOnly(false);
    setWishlistOnly(false);
  }

  function toggleWishlist(id) {
    setWishlist((old) =>
      old.includes(id) ? old.filter((item) => item !== id) : [...old, id]
    );
  }
  function handleAddToCart(product) {
  if (typeof addToCart !== "function") {
    setCartNotice("Please connect addToCart in StoreProvider.");
    return;
  }

  if (Number(product.stock) <= 0) {
    setCartNotice(`${product.name} is currently out of stock.`);
    return;
  }

  addToCart(product);
  setCartNotice(`${product.name} added to cart.`);
}

  function toggleCompare(id) {
    setCompareIds((old) => {
      if (old.includes(id)) return old.filter((item) => item !== id);
      if (old.length >= 3) return old;
      return [...old, id];
    });
  }

  return (
    <main className="products-page">
      <section className="products-hero">
        <div className="container products-hero-content">
          <span className="products-kicker">
            <span className="products-live-dot" />
            KGN COMPUTER & SERVICES
          </span>
          <h1>
            Find your next <span>tech essential.</span>
          </h1>
          <p>
            Discover computers, accessories and technology solutions
            that fit your needs and budget.
          </p>

          <form
            className="products-hero-search"
            onSubmit={(e) => {
              e.preventDefault();
              document.getElementById("catalog-results")?.scrollIntoView({
                behavior: "smooth",
                block: "start",
              });
            }}
          >
            <Search size={20} />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="What are you looking for?"
              aria-label="Search all products"
            />
            {query && (
              <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                <X size={17} />
              </button>
            )}
            <button type="submit" className="products-search-submit">Search</button>
          </form>

          <div className="products-hero-benefits">
            <span><Check size={15} /> Explore product options</span>
            <span><Check size={15} /> Compare specifications</span>
            <span><Check size={15} /> Ask before ordering</span>
          </div>
        </div>
      </section>

      <section className="section products-catalogue">
        <div className="container">
          <div className="products-heading">
            <div>
              <span className="eyebrow">EXPLORE THE CATALOGUE</span>
              <h2>Shop products</h2>
              <p>Find a product that works for you.</p>
            </div>
            <div className="catalogue-total">
              <strong>{shown.length}</strong>
              <span>matching products</span>
            </div>
          </div>

          <div className="products-category-strip">
            <button
              className={`products-category-chip ${category === "all" ? "active" : ""}`}
              onClick={() => setCategory("all")}
              type="button"
            >
              <span>✨</span> All products
            </button>

            {categories.map((c) => (
              <button
                key={c.id}
                className={`products-category-chip ${category === c.id ? "active" : ""}`}
                onClick={() => setCategory(c.id)}
                type="button"
              >
                <span>{{
                  laptops: "💻", desktops: "🖥️", printers: "🖨️",
                  accessories: "⌨️", networking: "📶", cctv: "📹"
                }[c.id] || "🔌"}</span>
                {c.name}
              </button>
            ))}
          </div>

          <div className="products-toolbar">
            <label className="products-search-field">
              <Search size={19} />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search products, brands or specifications..."
                aria-label="Filter products"
              />
              {query && (
                <button type="button" onClick={() => setQuery("")} aria-label="Clear search">
                  <X size={16} />
                </button>
              )}
            </label>

            <button
              type="button"
              className="products-filter-toggle"
              onClick={() => setMobileFiltersOpen((v) => !v)}
              aria-expanded={mobileFiltersOpen}
            >
              <SlidersHorizontal size={17} />
              Filters
              {hasFilters && <span className="products-filter-dot" />}
            </button>

            <label className="products-sort">
              <ArrowUpDown size={17} />
              <select value={sort} onChange={(e) => setSort(e.target.value)}>
                <option value="featured">Featured first</option>
                <option value="price-low">Price: low to high</option>
                <option value="price-high">Price: high to low</option>
                <option value="discount">Biggest discount</option>
                <option value="name">Name A–Z</option>
              </select>
              <ChevronDown size={15} />
            </label>
          </div>

          <div className="products-layout">
            <aside className={`products-sidebar ${mobileFiltersOpen ? "open" : ""}`}>
              <div className="products-sidebar-heading">
                <h3>Refine products</h3>
                <button type="button" onClick={() => setMobileFiltersOpen(false)} aria-label="Close filters">
                  <X size={19} />
                </button>
              </div>

              <div className="products-filter-group">
                <h4>Categories</h4>
                <button
                  type="button"
                  className={`products-side-category ${category === "all" ? "selected" : ""}`}
                  onClick={() => setCategory("all")}
                >
                  <span>All products</span>
                  <span>{products.filter((p) => p.active !== false).length}</span>
                </button>
                {categories.map((c) => (
                  <button
                    type="button"
                    key={c.id}
                    className={`products-side-category ${category === c.id ? "selected" : ""}`}
                    onClick={() => setCategory(c.id)}
                  >
                    <span>{c.name}</span>
                    <span>{products.filter((p) => p.active !== false && p.category === c.id).length}</span>
                  </button>
                ))}
              </div>

              <div className="products-filter-group">
                <h4>Price range</h4>
                <div className="products-price-inputs">
                  <label>
                    <span>Min ₹</span>
                    <input
                      type="number"
                      min="0"
                      max={maxAvailablePrice || undefined}
                      value={minPrice}
                      onChange={(e) => setMinPrice(e.target.value)}
                      placeholder="0"
                    />
                  </label>
                  <label>
                    <span>Max ₹</span>
                    <input
                      type="number"
                      min="0"
                      value={maxPrice}
                      onChange={(e) => setMaxPrice(e.target.value)}
                      placeholder={String(maxAvailablePrice)}
                    />
                  </label>
                </div>
                {minPrice !== "" && maxPrice !== "" && Number(minPrice) > Number(maxPrice) && (
                  <p className="products-validation">Minimum price must not exceed maximum.</p>
                )}
              </div>

              <div className="products-filter-group">
                <h4>Availability & type</h4>
                <label className="products-check-row">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                  />
                  <span>In stock only</span>
                </label>
                <label className="products-check-row">
                  <input
                    type="checkbox"
                    checked={featuredOnly}
                    onChange={(e) => setFeaturedOnly(e.target.checked)}
                  />
                  <span>Featured products</span>
                </label>
                <label className="products-check-row">
                  <input
                    type="checkbox"
                    checked={wishlistOnly}
                    onChange={(e) => setWishlistOnly(e.target.checked)}
                  />
                  <span>My wishlist ({wishlist.length})</span>
                </label>
              </div>

              <button type="button" className="products-reset" onClick={resetFilters}>
                <RotateCcw size={15} /> Reset all filters
              </button>
              <button
                type="button"
                className="products-apply-mobile"
                onClick={() => setMobileFiltersOpen(false)}
              >
                Show {shown.length} products
              </button>
            </aside>

            {mobileFiltersOpen && (
              <button
                type="button"
                aria-label="Close filter panel"
                className="products-filter-backdrop"
                onClick={() => setMobileFiltersOpen(false)}
              />
            )}

            <div className="products-results" id="catalog-results">
              <div className="products-results-top">
                <p>
                  Showing <strong>{shown.length}</strong> products
                  {category !== "all" && (
                    <> in <strong>{categories.find((c) => c.id === category)?.name || category}</strong></>
                  )}
                </p>
                {hasFilters && (
                  <button type="button" onClick={resetFilters} className="products-clear-link">
                    Clear filters <X size={14} />
                  </button>
                )}
              </div>
{cartNotice && (
  <div className="products-cart-notice" role="status">
    <Check size={18} />
    <span>{cartNotice}</span>
    <Link href="/cart">View cart</Link>
    <button
      type="button"
      onClick={() => setCartNotice("")}
      aria-label="Dismiss message"
    >
      <X size={16} />
    </button>
  </div>
)}
              {shown.length > 0 ? (
                <div className="products-advanced-grid">
                  {shown.map((p) => {
                    const saved = wishlist.includes(p.id);
                    const comparing = compareIds.includes(p.id);
                    const discount = p.oldPrice > p.price
                      ? Math.round((1 - p.price / p.oldPrice) * 100)
                      : 0;

                    return (
                      <article className="advanced-product-card" key={p.id}>
                        <div className="advanced-product-visual">
                          {p.badge && (
                            <span className="advanced-product-badge">{p.badge}</span>
                          )}
                          {discount > 0 && (
                            <span className="advanced-discount">-{discount}%</span>
                          )}
                          <button
                            type="button"
                            className={`advanced-wishlist ${saved ? "saved" : ""}`}
                            onClick={() => toggleWishlist(p.id)}
                            aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
                            title={saved ? "Remove from wishlist" : "Add to wishlist"}
                          >
                            <Heart size={19} fill={saved ? "currentColor" : "none"} />
                          </button>
                          <div className="advanced-product-emoji" aria-hidden="true">
                            {p.emoji || "🔌"}
                          </div>
                          <span className={`advanced-stock ${Number(p.stock) > 0 ? "available" : "unavailable"}`}>
                            <span />
                            {Number(p.stock) > 0 ? `${p.stock} in stock` : "Out of stock"}
                          </span>
                        </div>

                        <div className="advanced-product-body">
                          <span className="advanced-product-category">
                            {categories.find((c) => c.id === p.category)?.name || p.category}
                          </span>
                          <h3>{p.name}</h3>
                          <p className="advanced-product-description">
                            {p.description}
                          </p>

                          <div className="advanced-price-row">
                            <strong>{money(p.price)}</strong>
                            {p.oldPrice > p.price && (
                              <del>{money(p.oldPrice)}</del>
                            )}
                          </div>

                          {p.oldPrice > p.price && (
                            <span className="advanced-savings">
                              Save {money(p.oldPrice - p.price)}
                            </span>
                          )}

                         <div className="advanced-product-actions">
  <Link
    href={`/products/${encodeURIComponent(p.slug || p.id)}`}
    className="advanced-detail-link"
  >
    <Eye size={16} />
    View details
  </Link>

  <button
    type="button"
    className="advanced-add-to-cart"
    onClick={() => handleAddToCart(p)}
    disabled={Number(p.stock) <= 0}
  >
    <ShoppingBag size={16} />
    {Number(p.stock) > 0 ? "Add to cart" : "Out of stock"}
  </button>

  <button
    type="button"
    className="advanced-quick-view"
    onClick={() => setQuickView(p)}
  >
    Quick view
  </button>

  <button
    type="button"
    className={`advanced-compare ${comparing ? "selected" : ""}`}
    onClick={() => toggleCompare(p.id)}
    aria-label={comparing ? "Remove from compare" : "Compare product"}
  >
    {comparing ? <Check size={17} /> : <GitCompareArrows size={17} />}
  </button>
</div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <div className="products-empty">
                  <span><Search size={30} /></span>
                  <h3>No matching products</h3>
                  <p>Try changing your search or relaxing a filter.</p>
                  <button type="button" className="products-primary-button" onClick={resetFilters}>
                    Reset filters
                  </button>
                </div>
              )}

              <p className="products-disclaimer">
                Prices are indicative demo prices. Confirm the exact model,
                stock and final price before ordering.
              </p>
            </div>
          </div>
        </div>
      </section>

      {compareIds.length > 0 && (
        <div className="products-compare-bar">
          <div>
            <GitCompareArrows size={20} />
            <span><strong>{compareIds.length}/3</strong> products selected</span>
          </div>
          <button
            type="button"
            className="products-compare-button"
            disabled={comparedProducts.length < 2}
            onClick={() => document.getElementById("products-comparison")?.showModal()}
          >
            Compare now
          </button>
          <button type="button" className="products-compare-clear" onClick={() => setCompareIds([])}>
            Clear
          </button>
        </div>
      )}

      <dialog id="products-comparison" className="products-modal products-compare-modal">
        <div className="products-modal-heading">
          <div><span className="eyebrow">SIDE-BY-SIDE</span><h2>Compare products</h2></div>
          <button type="button" onClick={() => document.getElementById("products-comparison")?.close()} aria-label="Close comparison">
            <X size={21} />
          </button>
        </div>
        <div className="products-comparison-grid">
          {comparedProducts.map((p) => (
            <div className="products-comparison-item" key={p.id}>
              <span className="comparison-emoji">{p.emoji || "🔌"}</span>
              <h3>{p.name}</h3>
              <strong>{money(p.price)}</strong>
              <p>{categories.find((c) => c.id === p.category)?.name || p.category}</p>
              <p>{p.description}</p>
              <p>{Number(p.stock) > 0 ? `${p.stock} in stock` : "Out of stock"}</p>
              <ul>{(p.specs || []).map((spec) => <li key={spec}>{spec}</li>)}</ul>
              <Link href="/inquiry" className="products-primary-button">Enquire</Link>
              <button type="button" className="products-remove-compare" onClick={() => toggleCompare(p.id)}>Remove</button>
            </div>
          ))}
        </div>
      </dialog>

      {quickView && (
        <div className="products-quick-backdrop" onMouseDown={(e) => {
          if (e.target === e.currentTarget) setQuickView(null);
        }}>
          <section
            className="products-quick-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="quick-product-name"
          >
            <button
              type="button"
              className="products-quick-close"
              onClick={() => setQuickView(null)}
              aria-label="Close quick view"
            >
              <X size={21} />
            </button>
            <div className="products-quick-visual">{quickView.emoji || "🔌"}</div>
            <div className="products-quick-content">
              <span className="eyebrow">
                {categories.find((c) => c.id === quickView.category)?.name || quickView.category}
              </span>
              <h2 id="quick-product-name">{quickView.name}</h2>
              <div className="products-quick-price">
                <strong>{money(quickView.price)}</strong>
                {quickView.oldPrice > quickView.price && <del>{money(quickView.oldPrice)}</del>}
              </div>
              <p>{quickView.description}</p>
              <div className="products-quick-stock">
                <PackageCheck size={18} />
                {Number(quickView.stock) > 0
                  ? `${quickView.stock} units shown in demo stock`
                  : "Currently shown as out of stock"}
              </div>
              <h3>Specifications & details</h3>
              <ul className="products-spec-list">
                {(quickView.specs || []).map((spec) => (
                  <li key={spec}><Check size={16} />{spec}</li>
                ))}
              </ul>
              <div className="products-quick-actions">
                <Link href={`/inquiry?product=${encodeURIComponent(quickView.slug || quickView.id)}`} className="products-primary-button">
                  <MessageCircle size={17} /> Enquire about product
                </Link>
                <button
                  type="button"
                  className={`products-secondary-button ${wishlist.includes(quickView.id) ? "selected" : ""}`}
                  onClick={() => toggleWishlist(quickView.id)}
                >
                  <Heart size={17} fill={wishlist.includes(quickView.id) ? "currentColor" : "none"} />
                  {wishlist.includes(quickView.id) ? "Saved" : "Save"}
                </button>
              </div>
              <p className="products-quick-note">
                Price and availability must be confirmed with the shop before ordering.
              </p>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="container section">Loading catalogue…</div>}>
      <ProductListing />
    </Suspense>
  );
}