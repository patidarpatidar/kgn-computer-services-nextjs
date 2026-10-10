"use client";
import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { UserRound, Package, MapPin, Phone, Mail, CalendarDays, ChevronDown, ChevronUp, MessageCircle, ShoppingBag, PencilLine, Save, Clock3, CreditCard, Truck, CheckCircle2, XCircle, Search } from "lucide-react";
import { useStore } from "../../components/StoreProvider";
import { money, whatsappLink } from "../../lib/storage";

const statusSteps = ["Pending", "Confirmed", "Processing", "Shipped", "Delivered"];
const dateLabel = (value) => new Intl.DateTimeFormat("en-IN", { dateStyle: "medium", timeStyle: "short" }).format(new Date(value));
const statusClass = (status) => `order-status status-${String(status || "pending").toLowerCase().replaceAll(" ", "-")}`;

export default function ProfilePage() {
  const { profile, setProfile, orders, site } = useStore();
  const [draft, setDraft] = useState(profile);
  const [phoneLookup, setPhoneLookup] = useState(profile.phone || "");
  const [editing, setEditing] = useState(!profile.name);
  const [selected, setSelected] = useState(null);
  const [saved, setSaved] = useState(false);
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  useEffect(() => { setDraft(profile); setPhoneLookup(profile.phone || ""); setEditing(!profile.name); }, [profile]);
  const update = (e) => setDraft({ ...draft, [e.target.name]: e.target.value });

  const myOrders = useMemo(() => {
    const phone = phoneLookup.replace(/\D/g, "");
    return orders.filter(order => phone && String(order.customer?.phone || "").replace(/\D/g, "") === phone)
      .filter(order => filter === "All" || order.status === filter)
      .filter(order => `${order.id} ${(order.items || []).map(i => i.name).join(" ")}`.toLowerCase().includes(search.toLowerCase()))
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [orders, phoneLookup, filter, search]);
  const totalSpent = myOrders.filter(o => o.status === "Delivered").reduce((sum, o) => sum + Number(o.total || 0), 0);
  const pendingCount = myOrders.filter(o => !["Delivered", "Cancelled"].includes(o.status)).length;

  const saveProfile = (e) => {
    e.preventDefault();
    setProfile(draft);
    setPhoneLookup(draft.phone);
    setEditing(false);
    setSaved(true);
    window.setTimeout(() => setSaved(false), 2600);
  };

  return <section className="profile-page section"><div className="container">
    <div className="profile-welcome"><div><span className="eyebrow">CUSTOMER ACCOUNT</span><h1>My Profile <span> & Orders</span></h1><p>Manage your details and keep track of your KGN Computer orders.</p></div><div className="profile-welcome-icon"><UserRound size={32}/></div></div>
    <div className="profile-stats"><div><span className="profile-stat-icon blue"><Package size={19}/></span><div><small>Total orders</small><strong>{myOrders.length}</strong></div></div><div><span className="profile-stat-icon orange"><Clock3 size={19}/></span><div><small>In progress</small><strong>{pendingCount}</strong></div></div><div><span className="profile-stat-icon green"><CheckCircle2 size={19}/></span><div><small>Delivered value</small><strong>{money(totalSpent)}</strong></div></div></div>

    <div className="profile-layout"><aside className="profile-sidebar">
      <div className="profile-card profile-details-card"><div className="profile-card-heading"><span className="profile-avatar"><UserRound size={25}/></span><div><h2>{profile.name || "Your account"}</h2><p>Customer profile</p></div><button className="profile-edit-icon" onClick={() => {setDraft(profile);setEditing(!editing);}} aria-label="Edit profile"><PencilLine size={17}/></button></div>
        {editing ? <form className="profile-edit-form" onSubmit={saveProfile}><label>Full name<input required name="name" value={draft.name || ""} onChange={update} placeholder="Your full name"/></label><label>Mobile number<input required type="tel" name="phone" value={draft.phone || ""} onChange={update} placeholder="Phone used for orders"/></label><label>Email address<input type="email" name="email" value={draft.email || ""} onChange={update} placeholder="name@example.com"/></label><label>Address<textarea name="address" value={draft.address || ""} onChange={update} placeholder="Your address" rows={3}/></label><button className="button button-full" type="submit"><Save size={16}/> Save profile</button>{saved&&<p className="success-note">Profile saved on this device.</p>}</form> : <div className="profile-contact-list"><p><Phone size={15}/>{profile.phone || "Add your mobile number"}</p><p><Mail size={15}/>{profile.email || "Add your email"}</p><p><MapPin size={15}/>{profile.address || "Add your address"}</p><button className="button button-outline button-full" onClick={() => setEditing(true)}><PencilLine size={15}/> Edit details</button></div>}
      </div>
      <div className="profile-help-card"><span><MessageCircle size={20}/></span><h3>Need help with an order?</h3><p>Contact KGN Computer & Services for product, delivery or payment queries.</p><a className="button button-whatsapp button-full" target="_blank" rel="noreferrer" href={whatsappLink(site.whatsapp, `Hello ${site.name}, I need help with my order. My name is ${profile.name || ""}, mobile: ${phoneLookup}.`)}><MessageCircle size={16}/> WhatsApp support</a></div>
    </aside>

    <div className="profile-orders-column"><div className="profile-card orders-card"><div className="orders-heading"><div><span className="eyebrow">PURCHASE HISTORY</span><h2>My Orders</h2><p>Open an order to see its full details and status timeline.</p></div><span className="orders-count">{myOrders.length} orders</span></div>
      <div className="order-lookup"><label htmlFor="order-phone">Find orders by checkout mobile number</label><div className="order-lookup-row"><div className="search-box"><Search size={17}/><input id="order-phone" type="tel" value={phoneLookup} onChange={e=>setPhoneLookup(e.target.value)} placeholder="Enter the same phone used at checkout"/></div><button className="button button-small" onClick={()=>setPhoneLookup(phoneLookup.trim())}>Find orders</button></div><small>Demo note: orders are saved in this browser only; use the same mobile number entered at checkout.</small></div>
      <div className="orders-toolbar"><div className="filter-chips"><button className={`filter-chip ${filter === "All" ? "active" : ""}`} onClick={()=>setFilter("All")}>All</button>{["Pending","Confirmed","Processing","Shipped","Delivered","Cancelled"].map(s=><button key={s} className={`filter-chip ${filter === s ? "active" : ""}`} onClick={()=>setFilter(s)}>{s}</button>)}</div><div className="search-box order-search"><Search size={15}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search order / item"/></div></div>
      {myOrders.length === 0 ? <div className="profile-empty"><span><ShoppingBag size={29}/></span><h3>{phoneLookup.trim() ? "No orders found" : "Your orders will appear here"}</h3><p>{phoneLookup.trim() ? "Check that you entered the same mobile number used when placing your order." : "Place an order enquiry from the products page, then come back here to view its details."}</p><Link className="button" href="/products">Browse products</Link></div> : <div className="profile-order-list">{myOrders.map(order => <article className={`profile-order ${selected === order.id ? "order-expanded" : ""}`} key={order.id}>
        <button className="profile-order-summary" onClick={()=>setSelected(selected === order.id ? null : order.id)} aria-expanded={selected === order.id}><span className="order-summary-art">{order.items?.[0]?.emoji || "📦"}</span><span className="order-summary-main"><strong>{order.id}</strong><small><CalendarDays size={13}/>{dateLabel(order.createdAt)}</small><small>{(order.items || []).length} item type{(order.items || []).length === 1 ? "" : "s"} · {(order.items || []).map(i=>i.name).join(", ")}</small></span><span className="order-summary-right"><strong>{money(order.total)}</strong><span className={statusClass(order.status)}>{order.status}</span></span>{selected === order.id ? <ChevronUp size={18}/> : <ChevronDown size={18}/>}</button>
        {selected === order.id && <div className="order-detail-panel"><div className="order-detail-top"><div><small>ORDER REFERENCE</small><strong>{order.id}</strong></div><div><small>PLACED ON</small><strong>{dateLabel(order.createdAt)}</strong></div></div>
          <div className="order-progress"><h4>Order status</h4>{order.status === "Cancelled" ? <div className="cancelled-status"><XCircle size={18}/> This order was cancelled.</div> : <div className="status-track">{statusSteps.map((step, index) => {const current = statusSteps.indexOf(order.status);const done = current >= index;return <div className={`status-step ${done ? "step-done" : ""}`} key={step}><span>{done ? <CheckCircle2 size={16}/> : index + 1}</span><small>{step}</small></div>})}</div>}{order.statusHistory?.length > 0 && <div className="status-history"><strong>Status history</strong>{order.statusHistory.map((event, i)=><p key={`${event.status}-${i}`}><span>{event.status}</span><small>{dateLabel(event.at)}</small></p>)}</div>}</div>
          <div className="order-detail-section"><h4>Items ordered</h4>{(order.items || []).map((item, i)=><div className="order-item-line" key={`${item.id}-${i}`}><span className="order-item-emoji">{item.emoji || "📦"}</span><span><strong>{item.name}</strong><small>{money(item.price)} × {item.quantity}</small></span><strong>{money(item.price * item.quantity)}</strong></div>)}<div className="order-money-line"><span>Subtotal / estimated total</span><strong>{money(order.total)}</strong></div><p className="price-note">Final amount may change after stock, taxes and delivery are confirmed by the shop.</p></div>
          <div className="order-detail-grid"><div><h4><MapPin size={15}/> Delivery / customer details</h4><p>{order.customer?.name || "—"}</p><p>{order.customer?.phone || "—"}</p><p>{order.customer?.address || "Address not provided"}</p>{order.customer?.note && <p>Note: {order.customer.note}</p>}</div><div><h4><CreditCard size={15}/> Payment details</h4><p>Method: {order.paymentMethod || "To be confirmed"}</p><p>Status: <strong>{order.paymentStatus || "Unpaid"}</strong></p><p>Transaction reference: {order.transactionId || "Not added"}</p><h4 className="delivery-heading"><Truck size={15}/> Delivery</h4><p>{order.deliveryNote || "Collection / delivery details to be confirmed by the shop."}</p></div></div>
          <a className="button button-whatsapp button-full" target="_blank" rel="noreferrer" href={whatsappLink(site.whatsapp, `Hello ${site.name}, I need an update on order ${order.id}. Name: ${order.customer?.name || ""}; Mobile: ${order.customer?.phone || ""}; Current status: ${order.status}.`)}><MessageCircle size={16}/> Ask about this order on WhatsApp</a>
        </div>}
      </article>)}</div>}
    </div><p className="profile-demo-disclaimer">Demo version: profile and order data are stored in this browser's local storage. This is not secure customer authentication and orders do not sync across devices. Add a database and verified login before production use.</p></div></div>
  </div></section>;
}
