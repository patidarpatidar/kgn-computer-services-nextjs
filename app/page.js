"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Search,
  ShieldCheck,
  Truck,
  Headset,
  BadgeCheck,
  ChevronRight,
  Sparkles,
  MessageCircle,
  Laptop,
  Wrench,
  ShoppingBag,
  X,
} from "lucide-react";

import { useStore } from "../components/StoreProvider";
import ProductCard from "../components/ProductCard";
import ServiceCard from "../components/ServiceCard";
import GoogleReviews from "../components/GoogleReviews";
import categories from "../data/categories.json";

const categoryEmojis = {
  laptops: "💻",
  desktops: "🖥️",
  printers: "🖨️",
  accessories: "⌨️",
  networking: "📶",
  cctv: "📹",
};

const trustItems = [
  {
    icon: ShieldCheck,
    title: "Helpful guidance",
    desc: "Choose with confidence",
  },
  {
    icon: BadgeCheck,
    title: "Budget-friendly options",
    desc: "Explore suitable products",
  },
  {
    icon: Headset,
    title: "Personal support",
    desc: "Get help when needed",
  },
  {
    icon: Truck,
    title: "Order assistance",
    desc: "Confirm stock and delivery",
  },
];

export default function HomePage() {
  const { products, services, site } = useStore();

  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("all");
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  const activeProducts = useMemo(
    () => products.filter((p) => p.active !== false),
    [products]
  );

  const filteredProducts = useMemo(() => {
    const query = search.trim().toLowerCase();

    return activeProducts.filter((p) => {
      const matchesCategory =
        activeCategory === "all" ||
        p.category === activeCategory;

      const matchesSearch =
        !query ||
        [p.name, p.description, p.category, p.brand]
          .filter(Boolean)
          .some((value) =>
            String(value).toLowerCase().includes(query)
          );

      return matchesCategory && matchesSearch;
    });
  }, [activeProducts, activeCategory, search]);

  const displayedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, 4);

  const featuredServices = services
    .filter((s) => s.active !== false && s.featured)
    .slice(0, 3);

  const faqs = [
    {
      question: "Are product prices final?",
      answer:
        "Prices shown in this demo are indicative. Contact us to confirm the exact model, availability and final price before ordering.",
    },
    {
      question: "Can you recommend a computer for my budget?",
      answer:
        "Yes. Tell us your budget, intended use, software requirements and preferred features. We can discuss suitable options.",
    },
    {
      question: "Do you provide computer repair services?",
      answer:
        "You can enquire about troubleshooting, installation and other listed services. We will confirm the scope, estimated cost and timing.",
    },
    {
      question: "How can I place an order?",
      answer:
        "Browse products, add items to your cart if supported, and follow the available checkout or WhatsApp enquiry flow.",
    },
  ];

  return (
    <main className="home-page">
      {/* HERO */}
      <section className="hero hero-interactive">
        <div className="container hero-grid">
          <div className="hero-copy">
            <span className="pill">
              <span className="live-dot" />
              {site.shortName || "KGN Computer"} · Your local technology partner
            </span>

            <h1>
              The right tech.
              <br />
              <span>Without the guesswork.</span>
            </h1>

            <p>
              Computers, accessories and practical tech support
              for your home, study and business.
            </p>

            <form
              className="home-search"
              onSubmit={(event) => {
                event.preventDefault();
                document
                  .getElementById("popular-products")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <Search size={19} />
              <input
                aria-label="Search products"
                placeholder="Search laptops, printers, accessories..."
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setActiveCategory("all");
                }}
              />

              {search && (
                <button
                  type="button"
                  aria-label="Clear search"
                  className="search-clear"
                  onClick={() => setSearch("")}
                >
                  <X size={17} />
                </button>
              )}

              <button className="button" type="submit">
                Search
              </button>
            </form>

            <div className="hero-actions">
              <Link className="button" href="/products">
                Explore products <ArrowRight size={18} />
              </Link>

              <Link className="button button-outline" href="/services">
                <Wrench size={17} /> Explore services
              </Link>
            </div>

            <div className="hero-proof">
              <div className="proof-avatars">
                <span>💻</span>
                <span>🛠️</span>
                <span>🤝</span>
              </div>
              <span>
                <strong>Advice tailored to your needs</strong>
                <small>Tell us your budget and requirements</small>
              </span>
            </div>
          </div>

          <div className="hero-visual">
            <div className="hero-glow" />

            <div className="hero-device">
              <div className="device-screen">
                <div className="screen-top">
                  <span />
                  <span />
                  <span />
                </div>

                <div className="screen-content">
                  <Sparkles size={25} />
                  <span className="screen-label">KGN TECH DESK</span>
                  <div className="screen-shape">K</div>
                  <strong>Everything tech.</strong>
                  <small>Products · Repair · Support</small>
                </div>
              </div>
              <div className="device-base" />
            </div>

            <div className="floating-card float-one">
              <span>⚡</span>
              <div>
                <strong>Need help choosing?</strong>
                <small>Start with your requirements</small>
              </div>
            </div>

            <div className="floating-card float-two">
              <span>✓</span>
              <div>
                <strong>Explore your options</strong>
                <small>Compare before you decide</small>
              </div>
            </div>

            <Link className="hero-visual-link" href="/inquiry">
              Get a recommendation <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* TRUST */}
      <section className="trust-strip">
        <div className="container trust-grid">
          {trustItems.map(({ icon: Icon, title, desc }) => (
            <div key={title}>
              <Icon size={23} />
              <span>
                <strong>{title}</strong>
                <small>{desc}</small>
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* CATEGORIES */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SHOP BY NEED</span>
              <h2>What are you looking for?</h2>
              <p>Choose a category to discover relevant products.</p>
            </div>

            <Link className="text-link" href="/products">
              All products <ArrowRight size={16} />
            </Link>
          </div>

          <div className="category-grid">
            {categories.map(({ id, name }) => (
              <button
                key={id}
                type="button"
                className={`category-tile ${
                  activeCategory === id ? "category-active" : ""
                }`}
                onClick={() => {
                  setActiveCategory(id);
                  setSearch("");
                  setShowAllProducts(false);
                  document
                    .getElementById("popular-products")
                    ?.scrollIntoView({ behavior: "smooth" });
                }}
              >
                <span>{categoryEmojis[id] || "🔌"}</span>
                <strong>{name}</strong>
                <ChevronRight size={16} />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* PRODUCTS */}
      <section
        className="section section-muted"
        id="popular-products"
      >
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">YOUR NEXT TECH PICK</span>
              <h2>
                {search
                  ? "Search results"
                  : activeCategory === "all"
                  ? "Popular picks"
                  : categories.find((c) => c.id === activeCategory)?.name ||
                    "Products"}
              </h2>
              <p>
                {filteredProducts.length} product
                {filteredProducts.length === 1 ? "" : "s"} available
                in this demo catalogue.
              </p>
            </div>

            <Link className="text-link" href="/products">
              Browse catalogue <ArrowRight size={16} />
            </Link>
          </div>

          <div className="product-filter-row">
            <button
              type="button"
              className={`filter-chip ${
                activeCategory === "all" ? "filter-chip-active" : ""
              }`}
              onClick={() => setActiveCategory("all")}
            >
              All products
            </button>

            {categories.map(({ id, name }) => (
              <button
                type="button"
                key={id}
                className={`filter-chip ${
                  activeCategory === id ? "filter-chip-active" : ""
                }`}
                onClick={() => setActiveCategory(id)}
              >
                {name}
              </button>
            ))}
          </div>

          {displayedProducts.length > 0 ? (
            <div className="product-grid">
              {displayedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="empty-products">
              <ShoppingBag size={36} />
              <h3>No matching products</h3>
              <p>Try another search or browse all categories.</p>
              <button
                type="button"
                className="button"
                onClick={() => {
                  setSearch("");
                  setActiveCategory("all");
                }}
              >
                Show all products
              </button>
            </div>
          )}

          {filteredProducts.length > 4 && (
            <div className="products-more">
              <button
                type="button"
                className="button button-outline"
                onClick={() => setShowAllProducts((value) => !value)}
              >
                {showAllProducts ? "Show fewer" : "View all matching products"}
                <ArrowRight size={17} />
              </button>
            </div>
          )}
        </div>
      </section>

      {/* SERVICES */}
      <section className="section">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">HERE TO HELP</span>
              <h2>Tech support made simple</h2>
              <p>
                From setup to troubleshooting, tell us what you need.
              </p>
            </div>

            <Link className="text-link" href="/services">
              All services <ArrowRight size={16} />
            </Link>
          </div>

          <div className="service-grid">
            {featuredServices.map((service) => (
              <ServiceCard key={service.id} service={service} />
            ))}
          </div>

          <div className="service-help-banner">
            <div className="service-help-icon">
              <Laptop size={26} />
            </div>
            <div>
              <strong>Not sure which service you need?</strong>
              <p>Describe the issue and request personalised guidance.</p>
            </div>
            <Link className="button" href="/inquiry">
              Ask for help <ArrowRight size={17} />
            </Link>
          </div>
        </div>
      </section>

      {/* REVIEWS */}
      <GoogleReviews site={site} />

      {/* HOW IT WORKS */}
      <section className="section how-section">
        <div className="container how-grid">
          <div>
            <span className="eyebrow">A SIMPLE WAY TO GET STARTED</span>
            <h2>Good tech advice starts with your needs.</h2>
            <p>
              Tell us how you’ll use a device, what your budget looks like
              or what isn’t working. We’ll help you explore suitable options.
            </p>
            <Link className="button" href="/inquiry">
              Tell us what you need <ArrowRight size={17} />
            </Link>
          </div>

          <div className="how-steps">
            {[
              ["01", "Share your requirement", "Tell us about a product, repair or setup."],
              ["02", "Discuss options", "Confirm availability, scope and an estimate."],
              ["03", "Choose what works", "Proceed once the details are clear."],
            ].map(([number, title, copy]) => (
              <article key={number}>
                <span>{number}</span>
                <div>
                  <strong>{title}</strong>
                  <p>{copy}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* INTERACTIVE FAQ */}
      <section className="section section-muted">
        <div className="container faq-layout">
          <div>
            <span className="eyebrow">GOOD TO KNOW</span>
            <h2>Frequently asked questions</h2>
            <p>Quick answers before you contact us.</p>
            <Link className="text-link" href="/contact">
              Contact details and hours <ArrowRight size={16} />
            </Link>
          </div>

          <div className="faq-list">
            {faqs.map((faq, index) => (
              <article
                className={`faq-item ${
                  openFaq === index ? "faq-item-open" : ""
                }`}
                key={faq.question}
              >
                <button
                  type="button"
                  aria-expanded={openFaq === index}
                  onClick={() =>
                    setOpenFaq((current) =>
                      current === index ? -1 : index
                    )
                  }
                >
                  {faq.question}
                  <ChevronRight
                    size={19}
                    className="faq-chevron"
                  />
                </button>

                {openFaq === index && (
                  <p className="faq-answer">{faq.answer}</p>
                )}
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section">
        <div className="container cta-card">
          <div>
            <span className="eyebrow">LET'S FIND YOUR SOLUTION</span>
            <h2>Tell us what you need.</h2>
            <p>
              Share your budget, use case or technical issue.
              We’ll help you explore suitable options.
            </p>
          </div>

          <Link className="button button-light" href="/inquiry">
            Start an enquiry <ArrowRight size={18} />
          </Link>
        </div>
      </section>

      {/* MOBILE QUICK ACTIONS */}
      <nav className="mobile-quick-actions" aria-label="Quick actions">
        <Link href="/products">
          <ShoppingBag size={19} />
          <span>Shop</span>
        </Link>
        <Link href="/services">
          <Wrench size={19} />
          <span>Services</span>
        </Link>
        <Link href="/inquiry">
          <MessageCircle size={19} />
          <span>Enquiry</span>
        </Link>
      </nav>
    </main>
  );
}