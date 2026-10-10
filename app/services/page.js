"use client";
import "./services.css";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import {
  ArrowRight,
  CheckCircle2,
  MessageCircle,
  Search,
  X,
  SlidersHorizontal,
  Wrench,
  Clock3,
  ShieldCheck,
  RotateCcw,
  Eye,
  Send,
  ChevronDown,
} from "lucide-react";

import { useStore } from "../../components/StoreProvider";
import ServiceCard from "../../components/ServiceCard";

function ServicesListing() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const { services = [], serviceCategories = [] } = useStore();

  const [category, setCategory] = useState(params.get("category") || "all");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("name");
  const [selectedService, setSelectedService] = useState(null);

  const activeServices = useMemo(
    () => services.filter((service) => service.active !== false),
    [services]
  );

  const shown = useMemo(() => {
    const query = search.trim().toLowerCase();

    const result = activeServices.filter((service) => {
      const matchesCategory =
        category === "all" || service.category === category;

      const searchableText = [
        service.name,
        service.title,
        service.category,
        service.description,
        service.shortDescription,
        ...(Array.isArray(service.features) ? service.features : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return matchesCategory && (!query || searchableText.includes(query));
    });

    return [...result].sort((a, b) => {
      const nameA = String(a.name || a.title || "").toLowerCase();
      const nameB = String(b.name || b.title || "").toLowerCase();

      if (sortBy === "name") return nameA.localeCompare(nameB);
      if (sortBy === "category") {
        return String(a.category || "").localeCompare(String(b.category || ""));
      }
      if (sortBy === "featured") {
        return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
      }

      return 0;
    });
  }, [activeServices, category, search, sortBy]);

  function changeCategory(nextCategory) {
    setCategory(nextCategory);

    const nextParams = new URLSearchParams(params.toString());

    if (nextCategory === "all") {
      nextParams.delete("category");
    } else {
      nextParams.set("category", nextCategory);
    }

    const queryString = nextParams.toString();
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    });
  }

  function clearFilters() {
    setSearch("");
    setSortBy("name");
    changeCategory("all");
  }

  function serviceName(service) {
    return service.name || service.title || "Technical Service";
  }

  function serviceDescription(service) {
    return (
      service.description ||
      service.shortDescription ||
      "Contact us to discuss your requirements, availability and estimated cost."
    );
  }

  function inquiryHref(service) {
    const name = serviceName(service);
    return `/inquiry?service=${encodeURIComponent(
      service.slug || service.id || name
    )}`;
  }

  return (
    <>
      <div className="page-hero services-hero">
        <div className="container services-hero-inner">
          <span className="eyebrow">KGN COMPUTER & SERVICES</span>

          <h1>Technology problems? Let’s solve them.</h1>

          <p>
            Explore computer, software, networking and other technical
            services. Tell us what you need, and we’ll help you choose the
            next step.
          </p>

          <div className="hero-actions service-hero-actions">
            <a className="button" href="/inquiry">
              <MessageCircle size={17} />
              Request assistance
            </a>

            <a className="button button-outline" href="#service-list">
              <Search size={17} />
              Explore services
            </a>
          </div>

          <div className="services-trust-points">
            <span><CheckCircle2 size={17} /> Clear estimates</span>
            <span><ShieldCheck size={17} /> Confirm before work</span>
            <span><MessageCircle size={17} /> Easy inquiry</span>
          </div>
        </div>
      </div>

      <section className="service-steps">
        <div className="container service-steps-grid">
          {[
            {
              number: "01",
              title: "Choose a service",
              copy: "Browse by category or search for the help you need.",
            },
            {
              number: "02",
              title: "Explain your issue",
              copy: "Share your device, symptoms and requirements.",
            },
            {
              number: "03",
              title: "Confirm the plan",
              copy: "Discuss availability, estimated cost and timing first.",
            },
          ].map((step) => (
            <div className="interactive-step" key={step.number}>
              <span>{step.number}</span>
              <div>
                <strong>{step.title}</strong>
                <p>{step.copy}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="section" id="service-list">
        <div className="container">
          <div className="section-heading">
            <div>
              <span className="eyebrow">SERVICE DIRECTORY</span>
              <h2>Find the right service</h2>
              <p>Search, filter and explore available technical services.</p>
            </div>

            <a className="text-link" href="/contact">
              Contact the shop <ArrowRight size={16} />
            </a>
          </div>

          <div className="services-toolbar">
            <label className="services-search">
              <Search size={19} />
              <input
                type="search"
                placeholder="Search computer repair, CCTV, software..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search services"
              />

              {search && (
                <button
                  type="button"
                  className="search-clear"
                  onClick={() => setSearch("")}
                  aria-label="Clear search"
                >
                  <X size={17} />
                </button>
              )}
            </label>

            <label className="services-sort">
              <SlidersHorizontal size={17} />
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
                aria-label="Sort services"
              >
                <option value="name">Name: A–Z</option>
                <option value="category">Category</option>
                <option value="featured">Featured first</option>
              </select>
              <ChevronDown size={16} />
            </label>
          </div>

          <div
            className="filter-chips service-filter-chips"
            aria-label="Filter services by category"
          >
            {[["all", "All services"], ...serviceCategories.map((item) => [
              item,
              item,
            ])].map(([id, label]) => (
              <button
                type="button"
                key={id}
                className={
                  category === id ? "filter-chip active" : "filter-chip"
                }
                onClick={() => changeCategory(id)}
                aria-pressed={category === id}
              >
                {label}
                {id === "all" && <span>{activeServices.length}</span>}
              </button>
            ))}
          </div>

          <div className="services-results-bar">
            <p aria-live="polite">
              Showing <strong>{shown.length}</strong> of{" "}
              <strong>{activeServices.length}</strong> services
              {category !== "all" ? ` in ${category}` : ""}
            </p>

            {(search || category !== "all" || sortBy !== "name") && (
              <button
                className="services-reset"
                type="button"
                onClick={clearFilters}
              >
                <RotateCcw size={14} /> Reset filters
              </button>
            )}
          </div>

          {shown.length > 0 ? (
            <div className="service-grid service-grid-large interactive-service-grid">
              {shown.map((service) => (
                <article
                  className="interactive-service-item"
                  key={service.id || service.slug || serviceName(service)}
                >
                  {service.featured && (
                    <span className="service-featured-label">
                      <CheckCircle2 size={13} /> Featured
                    </span>
                  )}

                  <ServiceCard service={service} />

                  <div className="interactive-service-actions">
                    <button
                      className="service-detail-button"
                      type="button"
                      onClick={() => setSelectedService(service)}
                    >
                      <Eye size={16} /> View details
                    </button>

                    <a
                      className="service-request-button"
                      href={inquiryHref(service)}
                    >
                      Request service <ArrowRight size={16} />
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state services-empty-state">
              <span><Wrench size={30} /></span>
              <h3>No matching services found</h3>
              <p>
                Try another keyword or category, or contact us to discuss a
                custom requirement.
              </p>

              <div className="hero-actions">
                <button className="button" type="button" onClick={clearFilters}>
                  <RotateCcw size={16} /> Show all services
                </button>
                <a className="button button-outline" href="/inquiry">
                  <MessageCircle size={16} /> Ask for help
                </a>
              </div>
            </div>
          )}

          <div className="service-note interactive-service-note">
            <div className="service-note-icon">
              <MessageCircle size={23} />
            </div>
            <div>
              <h3>Need something not listed here?</h3>
              <p>
                Tell us about your device, business or technical requirement.
                We’ll discuss whether we can help.
              </p>
            </div>
            <a className="button" href="/inquiry">
              Describe your requirement <ArrowRight size={17} />
            </a>
          </div>

          <div className="service-reassurance">
            <CheckCircle2 size={19} />
            <p>
              <strong>Understand the estimate first.</strong> Service
              availability, cost and timing should be confirmed before work
              begins.
            </p>
          </div>
        </div>
      </section>

      {selectedService && (
        <div
          className="service-modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedService(null);
            }
          }}
        >
          <section
            className="service-details-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="service-modal-title"
          >
            <button
              type="button"
              className="service-modal-close"
              onClick={() => setSelectedService(null)}
              aria-label="Close service details"
            >
              <X size={21} />
            </button>

            <span className="eyebrow">SERVICE DETAILS</span>
            <h2 id="service-modal-title">
              {serviceName(selectedService)}
            </h2>

            {selectedService.category && (
              <span className="service-modal-category">
                {selectedService.category}
              </span>
            )}

            <p className="service-modal-description">
              {serviceDescription(selectedService)}
            </p>

            {Array.isArray(selectedService.features) &&
              selectedService.features.length > 0 && (
                <div className="service-modal-features">
                  <h3>What this service may include</h3>
                  {selectedService.features.map((feature, index) => (
                    <p key={`${feature}-${index}`}>
                      <CheckCircle2 size={16} /> {feature}
                    </p>
                  ))}
                </div>
              )}

            <div className="service-modal-info">
              <div>
                <Clock3 size={18} />
                <span>
                  <strong>Timing</strong>
                  <small>Confirm when you inquire</small>
                </span>
              </div>
              <div>
                <ShieldCheck size={18} />
                <span>
                  <strong>Estimate</strong>
                  <small>Confirm before work begins</small>
                </span>
              </div>
            </div>

            <div className="service-modal-actions">
              <a
                className="button"
                href={inquiryHref(selectedService)}
              >
                <Send size={16} /> Request this service
              </a>
              <button
                type="button"
                className="button button-outline"
                onClick={() => setSelectedService(null)}
              >
                Continue browsing
              </button>
            </div>
          </section>
        </div>
      )}
    </>
  );
}

export default function ServicesPage() {
  return (
    <Suspense
      fallback={<div className="container section">Loading services…</div>}
    >
      <ServicesListing />
    </Suspense>
  );
}