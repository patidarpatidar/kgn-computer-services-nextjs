"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft, Check, ChevronRight, Heart, MessageCircle,
  PackageCheck, Share2, ShieldCheck, ShoppingBag, Truck
} from "lucide-react";
import { useStore } from "../../../components/StoreProvider";
import categories from "../../../data/categories.json";
import "./product-detail.css";

const money = (value) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(Number(value) || 0);

export default function ProductDetailPage() {
  const params = useParams();
  const slug = String(params?.slug || "");
  const { products = [] } = useStore();

  const product = useMemo(
    () => products.find((item) => item.slug === slug || item.id === slug),
    [products, slug]
  );

  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [notice, setNotice] = useState("");

  useEffect(() => {
    try {
      setWishlist(JSON.parse(localStorage.getItem("kgn-wishlist") || "[]"));
    } catch {
      setWishlist([]);
    }
  }, []);

  const saved = Boolean(product && wishlist.includes(product.id));
  const categoryName =
    categories.find((item) => item.id === product?.category)?.name ||
    product?.category ||
    "Products";

  const related = useMemo(
    () =>
      products
        .filter(
          (item) =>
            item.active !== false &&
            item.id !== product?.id &&
            item.category === product?.category
        )
        .slice(0, 4),
    [products, product]
  );

  function toggleWishlist() {
    if (!product) return;
    const next = saved
      ? wishlist.filter((id) => id !== product.id)
      : [...wishlist, product.id];
    setWishlist(next);
    try {
      localStorage.setItem("kgn-wishlist", JSON.stringify(next));
    } catch {}
    setNotice(saved ? "Removed from your wishlist." : "Saved to your wishlist.");
  }

  async function shareProduct() {
    if (!product) return;
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: product.name, text: product.description || product.name, url });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setNotice("Product link copied.");
      } else {
        setNotice("Copy this page URL to share the product.");
      }
    } catch {
      // Sharing was cancelled or unavailable; the page remains usable.
    }
  }

  if (!product || product.active === false) {
    return (
      <main className="product-detail-page">
        <div className="pd-container pd-not-found">
          <span className="pd-not-found-icon">🔎</span>
          <h1>Product not found</h1>
          <p>This product may have been removed or its URL may have changed.</p>
          <Link className="pd-primary-btn" href="/products">
            <ArrowLeft size={17} /> Back to products
          </Link>
        </div>
      </main>
    );
  }

  const discount =
    Number(product.oldPrice) > Number(product.price)
      ? Math.round((1 - Number(product.price) / Number(product.oldPrice)) * 100)
      : 0;

  const inquiryUrl = `/inquiry?product=${encodeURIComponent(product.slug || product.id)}&quantity=${quantity}`;

  return (
    <main className="product-detail-page">
      <div className="pd-container">
        <nav className="pd-breadcrumb" aria-label="Breadcrumb">
          <Link href="/">Home</Link><ChevronRight size={14} />
          <Link href="/products">Products</Link><ChevronRight size={14} />
          <Link href={`/products?category=${encodeURIComponent(product.category || "")}`}>{categoryName}</Link>
          <ChevronRight size={14} /><span>{product.name}</span>
        </nav>

        <Link href="/products" className="pd-back-link">
          <ArrowLeft size={16} /> Back to all products
        </Link>

        <section className="pd-product-layout">
          <div className="pd-visual-panel">
            <div className="pd-badges">
              {product.badge && <span className="pd-badge">{product.badge}</span>}
              {discount > 0 && <span className="pd-discount">Save {discount}%</span>}
            </div>
            <button
              type="button"
              className={`pd-wishlist ${saved ? "is-saved" : ""}`}
              onClick={toggleWishlist}
              aria-label={saved ? "Remove from wishlist" : "Add to wishlist"}
              title={saved ? "Remove from wishlist" : "Add to wishlist"}
            >
              <Heart size={21} fill={saved ? "currentColor" : "none"} />
            </button>
            <div className="pd-product-art" aria-hidden="true">{product.emoji || "🔌"}</div>
            <span className={`pd-stock ${Number(product.stock) > 0 ? "in-stock" : "out-stock"}`}>
              <span />{Number(product.stock) > 0 ? `${product.stock} in stock (demo)` : "Out of stock"}
            </span>
          </div>

          <div className="pd-product-info">
            <span className="pd-eyebrow">{categoryName}</span>
            <h1>{product.name}</h1>
            <p className="pd-description">{product.description || "Contact us for product details and availability."}</p>

            <div className="pd-price-line">
              <strong>{money(product.price)}</strong>
              {discount > 0 && <del>{money(product.oldPrice)}</del>}
              {discount > 0 && <span className="pd-save-tag">{discount}% OFF</span>}
            </div>
            {discount > 0 && <p className="pd-saving">You save {money(Number(product.oldPrice) - Number(product.price))}</p>}

            <div className="pd-assurances">
              <div><ShieldCheck size={18} /><span><b>Product guidance</b><small>Ask before you order</small></span></div>
              <div><Truck size={18} /><span><b>Delivery details</b><small>Confirm with the shop</small></span></div>
              <div><PackageCheck size={18} /><span><b>Stock confirmation</b><small>Demo stock may vary</small></span></div>
            </div>

            <div className="pd-quantity-row">
              <span>Quantity</span>
              <div className="pd-quantity-control">
                <button type="button" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity">−</button>
                <output aria-live="polite">{quantity}</output>
                <button type="button" onClick={() => setQuantity((q) => Math.min(99, q + 1))} aria-label="Increase quantity">+</button>
              </div>
              <span className="pd-subtotal">Subtotal: <b>{money(Number(product.price) * quantity)}</b></span>
            </div>

            <div className="pd-actions">
              <Link href={inquiryUrl} className="pd-primary-btn">
                <MessageCircle size={18} /> Enquire / Order
              </Link>
              <button type="button" className="pd-secondary-btn" onClick={shareProduct}>
                <Share2 size={17} /> Share
              </button>
            </div>
            {notice && <p className="pd-notice" role="status">{notice}</p>}
            <p className="pd-demo-note">Demo listing: final price, exact model, warranty, delivery and availability must be confirmed with KGN Computer & Services.</p>
          </div>
        </section>

        <section className="pd-details-grid">
          <div className="pd-details-card">
            <span className="pd-eyebrow">PRODUCT INFORMATION</span>
            <h2>Specifications & details</h2>
            {Array.isArray(product.specs) && product.specs.length > 0 ? (
              <ul className="pd-spec-list">
                {product.specs.map((spec, index) => <li key={`${spec}-${index}`}><Check size={17} />{spec}</li>)}
              </ul>
            ) : (
              <p>Contact the shop to confirm specifications for this model.</p>
            )}
          </div>
          <div className="pd-details-card pd-help-card">
            <span className="pd-help-icon"><ShoppingBag size={22} /></span>
            <h2>Need help choosing?</h2>
            <p>Tell us your budget and requirements. We can help you check suitable options before ordering.</p>
            <Link href={inquiryUrl} className="pd-text-link">Ask about this product <ChevronRight size={16} /></Link>
          </div>
        </section>

        {related.length > 0 && (
          <section className="pd-related-section">
            <div className="pd-section-heading">
              <div><span className="pd-eyebrow">YOU MAY ALSO LIKE</span><h2>Related products</h2></div>
              <Link href={`/products?category=${encodeURIComponent(product.category || "")}`}>View category <ChevronRight size={16} /></Link>
            </div>
            <div className="pd-related-grid">
              {related.map((item) => (
                <Link href={`/products/${encodeURIComponent(item.slug || item.id)}`} className="pd-related-card" key={item.id}>
                  <span className="pd-related-art">{item.emoji || "🔌"}</span>
                  <span className="pd-related-category">{categories.find((c) => c.id === item.category)?.name || item.category}</span>
                  <strong>{item.name}</strong>
                  <span className="pd-related-price">{money(item.price)}</span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
