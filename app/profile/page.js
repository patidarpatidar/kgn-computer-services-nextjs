
"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import {
  UserRound,
  Package,
  MapPin,
  Phone,
  Mail,
  CalendarDays,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  ShoppingBag,
  PencilLine,
  Save,
  Clock3,
  CreditCard,
  Truck,
  CheckCircle2,
  XCircle,
  Search,
  Copy,
  Check,
  X,
  RotateCcw,
} from "lucide-react";

import { useStore } from "../../components/StoreProvider";
import { money, whatsappLink } from "../../lib/storage";
import './profile.css'
const statusSteps = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
];

const allStatuses = [
  "Pending",
  "Confirmed",
  "Processing",
  "Shipped",
  "Delivered",
  "Cancelled",
];

const normalizePhone = (value = "") => String(value).replace(/\D/g, "");

const dateLabel = (value) => {
  if (!value) return "Date not available";

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) return "Date not available";

  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(date);
};

const statusClass = (status) =>
  `order-status status-${String(status || "pending")
    .toLowerCase()
    .replaceAll(" ", "-")}`;

const safeMoney = (value) => money(Number(value) || 0);

export default function ProfilePage() {
  const { profile, setProfile, orders = [], site = {} } = useStore();

  const [draft, setDraft] = useState(profile || {});
  const [phoneLookup, setPhoneLookup] = useState(profile?.phone || "");
  const [editing, setEditing] = useState(!profile?.name);
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);

  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showAllFilters, setShowAllFilters] = useState(false);

  const [copiedOrder, setCopiedOrder] = useState("");
  const [copyError, setCopyError] = useState(false);
  const [lookupSubmitted, setLookupSubmitted] = useState(false);

  useEffect(() => {
    setDraft(profile || {});
    setPhoneLookup(profile?.phone || "");
    setEditing(!profile?.name);
  }, [profile]);

  const update = (event) => {
    const { name, value } = event.target;

    setDraft((current) => ({
      ...current,
      [name]: value,
    }));
  };

  const saveProfile = (event) => {
    event.preventDefault();

    const nextProfile = {
      ...(profile || {}),
      ...draft,
      name: String(draft.name || "").trim(),
      phone: String(draft.phone || "").trim(),
      email: String(draft.email || "").trim(),
      address: String(draft.address || "").trim(),
    };

    setProfile(nextProfile);
    setDraft(nextProfile);
    setPhoneLookup(nextProfile.phone);
    setEditing(false);
    setSaved(true);

    window.setTimeout(() => setSaved(false), 2600);
  };

  const myOrders = useMemo(() => {
    const phone = normalizePhone(phoneLookup);
    const query = search.trim().toLowerCase();

    return orders
      .filter((order) => {
        const orderPhone = normalizePhone(order.customer?.phone);
        return phone.length > 0 && orderPhone === phone;
      })
      .filter((order) => filter === "All" || order.status === filter)
      .filter((order) => {
        if (!query) return true;

        const searchableText = [
          order.id,
          order.status,
          order.customer?.name,
          ...(order.items || []).map((item) => item.name),
        ]
          .filter(Boolean)
          .join(" ")
          .toLowerCase();

        return searchableText.includes(query);
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, [orders, phoneLookup, filter, search]);

  const phoneMatchedOrders = useMemo(() => {
    const phone = normalizePhone(phoneLookup);

    if (!phone) return [];

    return orders.filter(
      (order) =>
        normalizePhone(order.customer?.phone) === phone
    );
  }, [orders, phoneLookup]);

  const totalSpent = phoneMatchedOrders
    .filter((order) => order.status === "Delivered")
    .reduce((sum, order) => sum + Number(order.total || 0), 0);

  const pendingCount = phoneMatchedOrders.filter(
    (order) =>
      !["Delivered", "Cancelled"].includes(order.status)
  ).length;

  const orderStatusCount = (status) => {
    if (status === "All") return phoneMatchedOrders.length;

    return phoneMatchedOrders.filter(
      (order) => order.status === status
    ).length;
  };

  const clearFilters = () => {
    setFilter("All");
    setSearch("");
  };

  const clearOrderSearch = () => {
    setSearch("");
  };

  const findOrders = (event) => {
    event?.preventDefault();
    setLookupSubmitted(true);
    setSelected(null);
  };

  const copyOrderReference = async (orderId) => {
    try {
      await navigator.clipboard.writeText(String(orderId));
      setCopiedOrder(String(orderId));
      setCopyError(false);

      window.setTimeout(() => setCopiedOrder(""), 2000);
    } catch {
      setCopiedOrder("");
      setCopyError(true);

      window.setTimeout(() => setCopyError(false), 2500);
    }
  };

  const contactByPhone = () => {
    const phone = String(site.phone || "").replace(/[^\d+]/g, "");
    return phone ? `tel:${phone}` : "#";
  };

  const supportMessage = (order) =>
    `Hello ${site.name || "KGN Computer"}, I need an update on order ${
      order.id
    }. Name: ${order.customer?.name || profile?.name || ""}; Mobile: ${
      order.customer?.phone || phoneLookup
    }; Current status: ${order.status || "Pending"}.`;

  const visibleStatuses = showAllFilters
    ? allStatuses
    : allStatuses.slice(0, 4);

  return (
    <section className="profile-page section">
      <div className="container">
        {/* Page heading */}
        <div className="profile-welcome">
          <div>
            <span className="eyebrow">CUSTOMER ACCOUNT</span>
            <h1>
              My Profile <span>&amp; Orders</span>
            </h1>
            <p>
              Manage your details and keep track of your KGN Computer orders.
            </p>
          </div>

          <div className="profile-welcome-icon">
            <UserRound size={32} />
          </div>
        </div>

        {/* Order statistics */}
        <div className="profile-stats">
          <div>
            <span className="profile-stat-icon blue">
              <Package size={19} />
            </span>
            <div>
              <small>Total orders</small>
              <strong>{phoneMatchedOrders.length}</strong>
            </div>
          </div>

          <div>
            <span className="profile-stat-icon orange">
              <Clock3 size={19} />
            </span>
            <div>
              <small>In progress</small>
              <strong>{pendingCount}</strong>
            </div>
          </div>

          <div>
            <span className="profile-stat-icon green">
              <CheckCircle2 size={19} />
            </span>
            <div>
              <small>Delivered value</small>
              <strong>{safeMoney(totalSpent)}</strong>
            </div>
          </div>
        </div>

        <div className="profile-layout">
          {/* LEFT: Profile and support */}
          <aside className="profile-sidebar">
            <div className="profile-card profile-details-card">
              <div className="profile-card-heading">
                <span className="profile-avatar">
                  <UserRound size={25} />
                </span>

                <div>
                  <h2>{profile?.name || "Your account"}</h2>
                  <p>Customer profile</p>
                </div>

                <button
                  type="button"
                  className="profile-edit-icon"
                  onClick={() => {
                    setDraft(profile || {});
                    setEditing((current) => !current);
                    setSaved(false);
                  }}
                  aria-label={editing ? "Close profile editor" : "Edit profile"}
                  title={editing ? "Close editor" : "Edit profile"}
                >
                  {editing ? <X size={17} /> : <PencilLine size={17} />}
                </button>
              </div>

              {editing ? (
                <form
                  className="profile-edit-form"
                  onSubmit={saveProfile}
                >
                  <label>
                    Full name
                    <input
                      required
                      name="name"
                      value={draft?.name || ""}
                      onChange={update}
                      placeholder="Your full name"
                      autoComplete="name"
                    />
                  </label>

                  <label>
                    Mobile number
                    <input
                      required
                      type="tel"
                      name="phone"
                      value={draft?.phone || ""}
                      onChange={update}
                      placeholder="Phone used for orders"
                      autoComplete="tel"
                    />
                  </label>

                  <label>
                    Email address
                    <input
                      type="email"
                      name="email"
                      value={draft?.email || ""}
                      onChange={update}
                      placeholder="name@example.com"
                      autoComplete="email"
                    />
                  </label>

                  <label>
                    Address
                    <textarea
                      name="address"
                      value={draft?.address || ""}
                      onChange={update}
                      placeholder="Your delivery address"
                      rows={3}
                      autoComplete="street-address"
                    />
                  </label>

                  <button className="button button-full" type="submit">
                    <Save size={16} />
                    Save profile
                  </button>

                  {saved && (
                    <p className="success-note" role="status">
                      <Check size={15} />
                      Profile saved on this device.
                    </p>
                  )}
                </form>
              ) : (
                <div className="profile-contact-list">
                  <p>
                    <Phone size={15} />
                    <span>{profile?.phone || "Add your mobile number"}</span>
                  </p>

                  <p>
                    <Mail size={15} />
                    <span>{profile?.email || "Add your email"}</span>
                  </p>

                  <p>
                    <MapPin size={15} />
                    <span>{profile?.address || "Add your address"}</span>
                  </p>

                  <button
                    type="button"
                    className="button button-outline button-full"
                    onClick={() => {
                      setDraft(profile || {});
                      setEditing(true);
                    }}
                  >
                    <PencilLine size={15} />
                    Edit details
                  </button>
                </div>
              )}
            </div>

            <div className="profile-help-card">
              <span>
                {site.whatsapp ? (
                  <MessageCircle size={20} />
                ) : (
                  <Phone size={20} />
                )}
              </span>

              <h3>Need help with an order?</h3>

              <p>
                Contact {site.shortName || site.name || "KGN Computer"} for
                product, delivery or payment queries.
              </p>

              {site.whatsapp ? (
                <a
                  className="button button-whatsapp button-full"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={whatsappLink(
                    site.whatsapp,
                    `Hello ${site.name || "KGN Computer"}, I need help with my order. My name is ${
                      profile?.name || ""
                    }, mobile: ${phoneLookup}.`
                  )}
                >
                  <MessageCircle size={16} />
                  WhatsApp support
                </a>
              ) : (
                <a
                  className="button button-full"
                  href={contactByPhone()}
                >
                  <Phone size={16} />
                  {site.phone ? `Call ${site.phone}` : "Contact support"}
                </a>
              )}
            </div>
          </aside>

          {/* RIGHT: Orders */}
          <div className="profile-orders-column">
            <div className="profile-card orders-card">
              <div className="orders-heading">
                <div>
                  <span className="eyebrow">PURCHASE HISTORY</span>
                  <h2>My Orders</h2>
                  <p>
                    Open an order to see its details and status timeline.
                  </p>
                </div>

                <span className="orders-count">
                  {myOrders.length} {myOrders.length === 1 ? "order" : "orders"}
                </span>
              </div>

              {/* Search by checkout phone */}
              <form className="order-lookup" onSubmit={findOrders}>
                <label htmlFor="order-phone">
                  Find orders by checkout mobile number
                </label>

                <div className="order-lookup-row">
                  <div className="search-box">
                    <Search size={17} />

                    <input
                      id="order-phone"
                      type="tel"
                      value={phoneLookup}
                      onChange={(event) => {
                        setPhoneLookup(event.target.value);
                        setLookupSubmitted(false);
                      }}
                      placeholder="Enter the same phone used at checkout"
                      autoComplete="tel"
                    />

                    {phoneLookup && (
                      <button
                        type="button"
                        className="search-clear-button"
                        onClick={() => {
                          setPhoneLookup("");
                          setLookupSubmitted(false);
                          setSelected(null);
                        }}
                        aria-label="Clear phone number"
                        title="Clear phone number"
                      >
                        <X size={15} />
                      </button>
                    )}
                  </div>

                  <button className="button button-small" type="submit">
                    Find orders
                  </button>
                </div>

                <small>
                  Use the same mobile number entered when placing the order.
                </small>

                {lookupSubmitted && (
                  <p className="lookup-result-note" role="status">
                    {phoneMatchedOrders.length > 0
                      ? `${phoneMatchedOrders.length} matching ${
                          phoneMatchedOrders.length === 1 ? "order" : "orders"
                        } found.`
                      : "No matching orders found for this mobile number."}
                  </p>
                )}
              </form>

              {/* Status filters and order search */}
              <div className="orders-toolbar">
                <div className="filter-chips">
                  <button
                    type="button"
                    className={`filter-chip ${
                      filter === "All" ? "active" : ""
                    }`}
                    onClick={() => setFilter("All")}
                  >
                    All <span>{orderStatusCount("All")}</span>
                  </button>

                  {visibleStatuses.map((status) => (
                    <button
                      type="button"
                      key={status}
                      className={`filter-chip ${
                        filter === status ? "active" : ""
                      }`}
                      onClick={() => setFilter(status)}
                    >
                      {status}
                      <span>{orderStatusCount(status)}</span>
                    </button>
                  ))}

                  <button
                    type="button"
                    className="filter-more-button"
                    onClick={() => setShowAllFilters((current) => !current)}
                    aria-expanded={showAllFilters}
                  >
                    {showAllFilters ? (
                      <>
                        <ChevronUp size={14} /> Less
                      </>
                    ) : (
                      <>
                        <ChevronDown size={14} /> More statuses
                      </>
                    )}
                  </button>
                </div>

                <div className="search-box order-search">
                  <Search size={15} />

                  <input
                    value={search}
                    onChange={(event) => setSearch(event.target.value)}
                    placeholder="Search order / item"
                    aria-label="Search orders by reference or item"
                  />

                  {search && (
                    <button
                      type="button"
                      className="search-clear-button"
                      onClick={clearOrderSearch}
                      aria-label="Clear order search"
                      title="Clear search"
                    >
                      <X size={15} />
                    </button>
                  )}
                </div>

                {(filter !== "All" || search) && (
                  <button
                    type="button"
                    className="clear-filters-button"
                    onClick={clearFilters}
                  >
                    <RotateCcw size={14} />
                    Clear filters
                  </button>
                )}
              </div>

              {/* Order list */}
              {myOrders.length === 0 ? (
                <div className="profile-empty">
                  <span>
                    <ShoppingBag size={29} />
                  </span>

                  <h3>
                    {!normalizePhone(phoneLookup)
                      ? "Find your orders"
                      : phoneMatchedOrders.length === 0
                      ? "No orders found"
                      : "No orders match these filters"}
                  </h3>

                  <p>
                    {!normalizePhone(phoneLookup)
                      ? "Enter the mobile number you used at checkout to view your order history."
                      : phoneMatchedOrders.length === 0
                      ? "Check the mobile number used when placing your order. Orders saved on another device will not appear in this demo."
                      : "Try a different status or clear your search to see your orders."}
                  </p>

                  {(filter !== "All" || search) && (
                    <button
                      type="button"
                      className="button button-outline"
                      onClick={clearFilters}
                    >
                      <RotateCcw size={15} />
                      Clear filters
                    </button>
                  )}

                  <Link className="button" href="/products">
                    Browse products
                  </Link>
                </div>
              ) : (
                <>
                  <div className="order-results-line">
                    Showing <strong>{myOrders.length}</strong>{" "}
                    {myOrders.length === 1 ? "order" : "orders"}
                    {filter !== "All" ? ` · ${filter}` : ""}
                    {search ? ` · Search: "${search}"` : ""}
                  </div>

                  <div className="profile-order-list">
                    {myOrders.map((order) => {
                      const isSelected = selected === order.id;
                      const items = order.items || [];

                      return (
                        <article
                          className={`profile-order ${
                            isSelected ? "order-expanded" : ""
                          }`}
                          key={order.id}
                        >
                          <div className="profile-order-summary-wrap">
                            <button
                              type="button"
                              className="profile-order-summary"
                              onClick={() =>
                                setSelected(isSelected ? null : order.id)
                              }
                              aria-expanded={isSelected}
                              aria-controls={`order-details-${order.id}`}
                            >
                              <span className="order-summary-art">
                                {items[0]?.emoji || "📦"}
                              </span>

                              <span className="order-summary-main">
                                <strong>{order.id || "Order reference"}</strong>

                                <small>
                                  <CalendarDays size={13} />
                                  {dateLabel(order.createdAt)}
                                </small>

                                <small className="order-summary-items">
                                  {items.length} item type
                                  {items.length === 1 ? "" : "s"}
                                  {items.length
                                    ? ` · ${items
                                        .map((item) => item.name)
                                        .filter(Boolean)
                                        .join(", ")}`
                                    : ""}
                                </small>
                              </span>

                              <span className="order-summary-right">
                                <strong>{safeMoney(order.total)}</strong>
                                <span className={statusClass(order.status)}>
                                  {order.status || "Pending"}
                                </span>
                              </span>

                              {isSelected ? (
                                <ChevronUp size={18} />
                              ) : (
                                <ChevronDown size={18} />
                              )}
                            </button>

                            <button
                              type="button"
                              className="order-copy-quick"
                              onClick={() => copyOrderReference(order.id)}
                              aria-label={`Copy order reference ${order.id}`}
                              title="Copy order reference"
                            >
                              {copiedOrder === String(order.id) ? (
                                <Check size={15} />
                              ) : (
                                <Copy size={15} />
                              )}
                              <span>
                                {copiedOrder === String(order.id)
                                  ? "Copied"
                                  : "Copy ID"}
                              </span>
                            </button>
                          </div>

                          {isSelected && (
                            <div
                              className="order-detail-panel"
                              id={`order-details-${order.id}`}
                            >
                              {/* Order reference */}
                              <div className="order-detail-top">
                                <div>
                                  <small>ORDER REFERENCE</small>
                                  <strong>{order.id || "—"}</strong>
                                </div>

                                <button
                                  type="button"
                                  className="copy-order-button"
                                  onClick={() =>
                                    copyOrderReference(order.id)
                                  }
                                >
                                  {copiedOrder === String(order.id) ? (
                                    <Check size={15} />
                                  ) : (
                                    <Copy size={15} />
                                  )}

                                  {copiedOrder === String(order.id)
                                    ? "Copied"
                                    : "Copy reference"}
                                </button>

                                <div>
                                  <small>PLACED ON</small>
                                  <strong>{dateLabel(order.createdAt)}</strong>
                                </div>
                              </div>

                              {copyError && (
                                <p className="copy-error-note" role="status">
                                  Clipboard access was unavailable. Please
                                  select and copy the order reference manually.
                                </p>
                              )}

                              {/* Order status */}
                              <div className="order-progress">
                                <h4>Order status</h4>

                                {order.status === "Cancelled" ? (
                                  <div className="cancelled-status">
                                    <XCircle size={18} />
                                    This order was cancelled.
                                  </div>
                                ) : (
                                  <div className="status-track">
                                    {statusSteps.map((step, index) => {
                                      const currentIndex =
                                        statusSteps.indexOf(order.status);
                                      const done =
                                        currentIndex >= index &&
                                        currentIndex !== -1;

                                      return (
                                        <div
                                          className={`status-step ${
                                            done ? "step-done" : ""
                                          }`}
                                          key={step}
                                        >
                                          <span>
                                            {done ? (
                                              <CheckCircle2 size={16} />
                                            ) : (
                                              index + 1
                                            )}
                                          </span>
                                          <small>{step}</small>
                                        </div>
                                      );
                                    })}
                                  </div>
                                )}

                                {order.statusHistory?.length > 0 && (
                                  <div className="status-history">
                                    <strong>Status history</strong>

                                    {order.statusHistory.map((event, index) => (
                                      <p
                                        key={`${event.status}-${index}`}
                                      >
                                        <span>{event.status}</span>
                                        <small>{dateLabel(event.at)}</small>
                                      </p>
                                    ))}
                                  </div>
                                )}
                              </div>

                              {/* Items and total */}
                              <div className="order-detail-section">
                                <h4>Items ordered</h4>

                                {items.length === 0 ? (
                                  <p>No item details available.</p>
                                ) : (
                                  items.map((item, index) => (
                                    <div
                                      className="order-item-line"
                                      key={`${item.id || item.name || "item"}-${index}`}
                                    >
                                      <span className="order-item-emoji">
                                        {item.emoji || "📦"}
                                      </span>

                                      <span>
                                        <strong>
                                          {item.name || "Product"}
                                        </strong>
                                        <small>
                                          {safeMoney(item.price)} ×{" "}
                                          {Number(item.quantity) || 0}
                                        </small>
                                      </span>

                                      <strong>
                                        {safeMoney(
                                          Number(item.price || 0) *
                                            Number(item.quantity || 0)
                                        )}
                                      </strong>
                                    </div>
                                  ))
                                )}

                                <div className="order-money-line">
                                  <span>Subtotal / estimated total</span>
                                  <strong>{safeMoney(order.total)}</strong>
                                </div>

                                <p className="price-note">
                                  Final amount may change after stock, taxes
                                  and delivery are confirmed by the shop.
                                </p>
                              </div>

                              {/* Delivery and payment */}
                              <div className="order-detail-grid">
                                <div>
                                  <h4>
                                    <MapPin size={15} />
                                    Delivery / customer details
                                  </h4>

                                  <p>{order.customer?.name || "—"}</p>
                                  <p>{order.customer?.phone || "—"}</p>
                                  <p>
                                    {order.customer?.address ||
                                      "Address not provided"}
                                  </p>

                                  {order.customer?.note && (
                                    <p>Note: {order.customer.note}</p>
                                  )}
                                </div>

                                <div>
                                  <h4>
                                    <CreditCard size={15} />
                                    Payment details
                                  </h4>

                                  <p>
                                    Method:{" "}
                                    {order.paymentMethod || "To be confirmed"}
                                  </p>

                                  <p>
                                    Status:{" "}
                                    <strong>
                                      {order.paymentStatus || "Unpaid"}
                                    </strong>
                                  </p>

                                  <p>
                                    Transaction reference:{" "}
                                    {order.transactionId || "Not added"}
                                  </p>

                                  <h4 className="delivery-heading">
                                    <Truck size={15} />
                                    Delivery
                                  </h4>

                                  <p>
                                    {order.deliveryNote ||
                                      "Collection / delivery details to be confirmed by the shop."}
                                  </p>
                                </div>
                              </div>

                              {/* Order-specific support */}
                              {site.whatsapp ? (
                                <a
                                  className="button button-whatsapp button-full"
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  href={whatsappLink(
                                    site.whatsapp,
                                    supportMessage(order)
                                  )}
                                >
                                  <MessageCircle size={16} />
                                  Ask about this order on WhatsApp
                                </a>
                              ) : (
                                <a
                                  className="button button-full"
                                  href={contactByPhone()}
                                >
                                  <Phone size={16} />
                                  {site.phone
                                    ? `Call ${site.phone} about this order`
                                    : "Contact support"}
                                </a>
                              )}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                </>
              )}
            </div>

            <p className="profile-demo-disclaimer">
              <strong>Demo version:</strong> Profile and order data are stored
              in this browser's local storage. Looking up orders by phone number
              is not secure authentication. This demo does not sync orders
              across devices. Use a database and verified customer login before
              production use.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
