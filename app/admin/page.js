"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  LayoutDashboard, Package, ClipboardList, Wrench, Settings, Plus, Trash2,
  Download, Upload, MessageCircle, Save, Pencil, X, Check, FolderPlus, Search,
  Eye, EyeOff, ExternalLink
} from "lucide-react";
import Link from "next/link";
import { useStore } from "../../components/StoreProvider";
import { money, readLocal, writeLocal, makeId, whatsappLink } from "../../lib/storage";
import productCategories from "../../data/categories.json";

const tabs = [
  ["overview", "Overview", LayoutDashboard],
  ["products", "Products", Package],
  ["orders", "Orders & enquiries", ClipboardList],
  ["services", "Services", Wrench],
  ["settings", "Shop settings", Settings]
];
const orderStatuses = ["Pending", "Confirmed", "Awaiting payment", "Paid", "Processing", "Completed", "Cancelled"];

const newProduct = () => ({
  id: makeId("P"), slug: "", name: "", category: productCategories[0]?.id || "accessories",
  price: 0, oldPrice: 0, stock: 0, featured: false, badge: "", emoji: "💻",
  description: "", specs: [], active: true
});

const newService = categories => ({
  id: makeId("S"), slug: "", name: "", category: categories[0] || "",
  icon: "Wrench", priceLabel: "Ask for a quote", description: "",
  features: [], featured: false, active: true
});

function slugify(value) {
  return value.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export default function AdminPage() {
  const {
    products, setProducts, services, setServices, serviceCategories, setServiceCategories,
    site, setSite, orders, updateOrderStatus, removeOrder
  } = useStore();
  const [tab, setTab] = useState("overview");
  const [notice, setNotice] = useState("");
  const [productEditing, setProductEditing] = useState(null);
  const [productForm, setProductForm] = useState({});
  const [serviceEditing, setServiceEditing] = useState(null);
  const [serviceForm, setServiceForm] = useState({});
  const [enquiries, setEnquiries] = useState([]);
  const [orderQuery, setOrderQuery] = useState("");
  const [orderStatusFilter, setOrderStatusFilter] = useState("All");
  const [newCategory, setNewCategory] = useState("");
  const fileRef = useRef(null);

  useEffect(() => {
    setEnquiries(readLocal("kgn_enquiries", []));
  }, []);

  const saveNotice = message => {
    setNotice(message);
    window.setTimeout(() => setNotice(""), 3000);
  };

  const filteredOrders = useMemo(() => orders.filter(order => {
    const query = orderQuery.trim().toLowerCase();
    const matchesQuery = !query || `${order.id} ${order.customer?.name || ""} ${order.customer?.phone || ""}`.toLowerCase().includes(query);
    return matchesQuery && (orderStatusFilter === "All" || order.status === orderStatusFilter);
  }), [orders, orderQuery, orderStatusFilter]);

  const beginNewProduct = () => {
    setProductForm(newProduct());
    setProductEditing("new");
  };
  const beginEditProduct = product => {
    setProductForm({...product, specs: product.specs || []});
    setProductEditing(product.id);
  };
  const saveProduct = event => {
    event.preventDefault();
    if (!productForm.name.trim()) return saveNotice("Enter a product name before saving.");
    if (Number(productForm.price) < 0 || Number(productForm.oldPrice) < 0 || Number(productForm.stock) < 0) {
      return saveNotice("Price, old price and stock cannot be negative.");
    }
    const product = {
      ...productForm,
      slug: slugify(productForm.slug || productForm.name),
      price: Number(productForm.price),
      oldPrice: Number(productForm.oldPrice),
      stock: Number(productForm.stock),
      specs: Array.isArray(productForm.specs) ? productForm.specs : []
    };
    const duplicateSlug = products.some(item => item.slug === product.slug && item.id !== productEditing);
    if (duplicateSlug) return saveNotice("That product URL is already in use. Choose a different slug.");
    setProducts(current => productEditing === "new"
      ? [product, ...current]
      : current.map(item => item.id === productEditing ? product : item));
    setProductEditing(null);
    saveNotice("Product saved on this device.");
  };
  const deleteProduct = id => {
    if (window.confirm("Remove this product from the catalogue?")) {
      setProducts(current => current.filter(product => product.id !== id));
      saveNotice("Product removed.");
    }
  };
  const exportProducts = () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(products, null, 2)], {type: "application/json"}));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "kgn-products.json";
    anchor.click();
    URL.revokeObjectURL(url);
  };
  const importProducts = event => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result);
        if (!Array.isArray(data) || data.some(item => !item || typeof item.id !== "string" || typeof item.name !== "string" || typeof item.slug !== "string")) {
          throw new Error("The file must contain products with id, name and slug fields.");
        }
        setProducts(data);
        saveNotice(`${data.length} products imported.`);
      } catch (error) {
        saveNotice(error instanceof Error ? error.message : "Could not read that product file.");
      }
    };
    reader.onerror = () => saveNotice("Could not read that product file.");
    reader.readAsText(file);
    event.target.value = "";
  };

  const beginNewService = () => {
    setServiceForm(newService(serviceCategories));
    setServiceEditing("new");
  };
  const beginEditService = service => {
    setServiceForm({...service, features: service.features || []});
    setServiceEditing(service.id);
  };
  const saveService = event => {
    event.preventDefault();
    if (!serviceForm.name.trim()) return saveNotice("Enter a service name before saving.");
    if (!serviceForm.category || !serviceCategories.includes(serviceForm.category)) {
      return saveNotice("Choose one of the saved service categories.");
    }
    const service = {
      ...serviceForm,
      slug: slugify(serviceForm.slug || serviceForm.name),
      features: Array.isArray(serviceForm.features) ? serviceForm.features.filter(Boolean) : []
    };
    const duplicateSlug = services.some(item => item.slug === service.slug && item.id !== serviceEditing);
    if (duplicateSlug) return saveNotice("That service URL is already in use. Choose a different slug.");
    setServices(current => serviceEditing === "new"
      ? [service, ...current]
      : current.map(item => item.id === serviceEditing ? service : item));
    setServiceEditing(null);
    saveNotice("Service saved on this device.");
  };
  const addServiceCategory = event => {
    event.preventDefault();
    const value = newCategory.trim();
    if (!value) return;
    if (serviceCategories.some(category => category.toLowerCase() === value.toLowerCase())) {
      return saveNotice("That service category already exists.");
    }
    setServiceCategories(current => [...current, value]);
    setNewCategory("");
    saveNotice("Service category added.");
  };
  const removeServiceCategory = category => {
    if (services.some(service => service.category === category)) {
      return saveNotice("Move or remove the services in this category before deleting it.");
    }
    setServiceCategories(current => current.filter(item => item !== category));
    saveNotice("Service category removed.");
  };
  const deleteService = id => {
    if (window.confirm("Remove this service from the service directory?")) {
      setServices(current => current.filter(service => service.id !== id));
      saveNotice("Service removed.");
    }
  };

  const updateEnquiry = (id, status) => {
    const updated = enquiries.map(enquiry => enquiry.id === id ? {...enquiry, status} : enquiry);
    setEnquiries(updated);
    writeLocal("kgn_enquiries", updated);
    saveNotice("Enquiry status updated.");
  };
  const removeEnquiry = id => {
    if (!window.confirm("Remove this enquiry from this device?")) return;
    const updated = enquiries.filter(enquiry => enquiry.id !== id);
    setEnquiries(updated);
    writeLocal("kgn_enquiries", updated);
    saveNotice("Enquiry removed.");
  };
  const stats = [
    ["Products", products.length, Package],
    ["Services", services.length, Wrench],
    ["Orders", orders.length, ClipboardList],
    ["New enquiries", enquiries.filter(enquiry => (enquiry.status || "New") === "New").length, MessageCircle]
  ];

  return <section className="admin-page"><div className="container">
    <div className="admin-heading"><div><span className="eyebrow">STORE MANAGEMENT</span><h1>Admin workspace</h1><p>Manage your catalogue, services and customer follow-ups.</p></div><span className="demo-label">LOCAL DEMO · THIS DEVICE ONLY</span></div>
    {notice && <div className="admin-notice" role="status"><Check size={17}/>{notice}</div>}
    <div className="admin-shell">
      <aside className="admin-sidebar" aria-label="Admin navigation"><div className="admin-shop-mark">K<span>G</span>N</div><small>MANAGEMENT</small>{tabs.map(([id,label,Icon])=><button type="button" key={id} className={tab===id?"admin-tab active":"admin-tab"} onClick={()=>{setTab(id);setProductEditing(null);setServiceEditing(null)}}><Icon size={18}/>{label}</button>)}<div className="admin-sidebar-foot">Saved in this browser<br/>Not shared across devices</div></aside>
      <div className="admin-content">
        {tab === "overview" && <>
          <div className="admin-content-title"><div><h2>Overview</h2><p>A quick snapshot of the shop workspace.</p></div><button className="button button-small" type="button" onClick={()=>{setTab("products");beginNewProduct()}}><Plus size={16}/> Add product</button></div>
          <div className="admin-stats">{stats.map(([label,value,Icon])=><div className="admin-stat" key={label}><span><Icon size={19}/></span><small>{label}</small><strong>{value}</strong></div>)}</div>
          <div className="admin-panel"><h3>Quick actions</h3><div className="quick-actions"><button type="button" onClick={()=>setTab("products")}><Package/>Manage products<small>Edit catalogue, prices and visibility</small></button><button type="button" onClick={()=>setTab("orders")}><ClipboardList/>Manage orders<small>Track customer details and order status</small></button><button type="button" onClick={()=>setTab("services")}><Wrench/>Manage services<small>Organize service categories and offerings</small></button><button type="button" onClick={()=>setTab("settings")}><Settings/>Shop settings<small>Update contact and WhatsApp details</small></button></div></div>
          <div className="admin-warning">Orders, products, services and settings are stored in this browser’s local storage. WhatsApp conversations are not received by this panel, and this demo does not sync across devices.</div>
        </>}

        {tab === "products" && <>
          <div className="admin-content-title"><div><h2>Products</h2><p>Publish and maintain the public product catalogue.</p></div><div className="admin-title-actions"><button className="button button-small button-outline" type="button" onClick={exportProducts}><Download size={16}/> Export</button><button className="button button-small button-outline" type="button" onClick={()=>fileRef.current?.click()}><Upload size={16}/> Import</button><input ref={fileRef} hidden type="file" accept=".json,application/json" onChange={importProducts}/><button className="button button-small" type="button" onClick={beginNewProduct}><Plus size={16}/> Add product</button></div></div>
          {productEditing !== null && <form className="admin-edit-form" onSubmit={saveProduct}><div className="edit-form-head"><h3>{productEditing==="new"?"Add product":"Edit product"}</h3><button type="button" className="icon-button" aria-label="Close product form" onClick={()=>setProductEditing(null)}><X/></button></div>
            <div className="admin-form-grid"><label>Product name *<input required value={productForm.name||""} onChange={event=>setProductForm({...productForm,name:event.target.value})}/></label><label>Slug<input value={productForm.slug||""} onChange={event=>setProductForm({...productForm,slug:event.target.value})} placeholder="Generated from name if blank"/></label><label>Category<select value={productForm.category||""} onChange={event=>setProductForm({...productForm,category:event.target.value})}>{productCategories.map(category=><option value={category.id} key={category.id}>{category.name}</option>)}</select></label><label>Price (₹)<input required type="number" min="0" value={productForm.price??0} onChange={event=>setProductForm({...productForm,price:event.target.value})}/></label><label>Previous price (₹)<input type="number" min="0" value={productForm.oldPrice??0} onChange={event=>setProductForm({...productForm,oldPrice:event.target.value})}/></label><label>Stock (display only)<input type="number" min="0" value={productForm.stock??0} onChange={event=>setProductForm({...productForm,stock:event.target.value})}/></label><label>Visual / emoji<input value={productForm.emoji||""} onChange={event=>setProductForm({...productForm,emoji:event.target.value})}/></label><label>Badge<input value={productForm.badge||""} onChange={event=>setProductForm({...productForm,badge:event.target.value})}/></label></div>
            <label>Description<textarea rows="3" value={productForm.description||""} onChange={event=>setProductForm({...productForm,description:event.target.value})}/></label><label>Specifications (one per line)<textarea rows="4" value={(productForm.specs||[]).join("\n")} onChange={event=>setProductForm({...productForm,specs:event.target.value.split("\n").map(value=>value.trim()).filter(Boolean)})}/></label><div className="admin-checks"><label><input type="checkbox" checked={!!productForm.featured} onChange={event=>setProductForm({...productForm,featured:event.target.checked})}/> Feature on home page</label><label><input type="checkbox" checked={productForm.active!==false} onChange={event=>setProductForm({...productForm,active:event.target.checked})}/> Visible in catalogue</label></div><button className="button" type="submit"><Save size={16}/> Save product</button>
          </form>}
          {products.length ? <div className="admin-product-list">{products.map(product=><article className="admin-product-card" key={product.id}><span className="admin-product-emoji">{product.emoji||"💻"}</span><div className="admin-product-copy"><strong>{product.name}</strong><small>{product.category} · {money(product.price)} · Stock: {product.stock ?? "—"}</small><span className={product.active===false?"visibility-label hidden":"visibility-label"}>{product.active===false?<EyeOff size={13}/>:<Eye size={13}/>} {product.active===false?"Hidden":"Visible"}{product.featured&&" · Featured"}</span></div><div className="admin-row-actions"><Link href={`/products/${product.slug}`} className="icon-button" aria-label={`View ${product.name}`}><ExternalLink size={16}/></Link><button type="button" className="icon-button" aria-label={`Edit ${product.name}`} onClick={()=>beginEditProduct(product)}><Pencil size={16}/></button><button type="button" className="icon-button danger-button" aria-label={`Delete ${product.name}`} onClick={()=>deleteProduct(product.id)}><Trash2 size={16}/></button></div></article>)}</div>:<div className="admin-empty"><Package size={34}/><h3>No products yet</h3><p>Add an item to make it available in your catalogue.</p><button type="button" className="button" onClick={beginNewProduct}><Plus size={16}/> Add a product</button></div>}
        </>}

        {tab === "orders" && <>
          <div className="admin-content-title"><div><h2>Orders & enquiries</h2><p>Review locally saved order requests and WhatsApp enquiry leads.</p></div></div>
          <div className="admin-warning">WhatsApp messages are not imported automatically. Orders created through this site appear here; customers must still send their message in WhatsApp.</div>
          <div className="admin-order-tools"><label className="search-box"><Search size={17}/><input aria-label="Search orders" value={orderQuery} onChange={event=>setOrderQuery(event.target.value)} placeholder="Search reference, name or phone"/></label><label>Status<select value={orderStatusFilter} onChange={event=>setOrderStatusFilter(event.target.value)}><option>All</option>{orderStatuses.map(status=><option key={status}>{status}</option>)}</select></label></div>
          <div className="admin-section-title"><h3>Orders <span>{filteredOrders.length}</span></h3></div>
          {filteredOrders.length ? <div className="admin-order-list">{filteredOrders.map(order=><article className="admin-order-card" key={order.id}><div className="admin-order-head"><div><strong>{order.id}</strong><small>{new Date(order.createdAt).toLocaleString()}</small></div><span className={`order-status ${order.status?.toLowerCase().replace(/\s+/g,"-")}`}>{order.status}</span></div><div className="admin-order-customer"><strong>{order.customer?.name||"Customer"}</strong><a href={`tel:${order.customer?.phone||""}`}>{order.customer?.phone||"No phone number"}</a><small>{order.customer?.address||"No delivery address provided"}</small></div><div className="admin-order-items">{(order.items||[]).map((item,index)=><span key={`${item.id||item.name}-${index}`}>{item.emoji||"📦"} {item.name} × {item.quantity}</span>)}</div><div className="admin-order-bottom"><strong>Indicative total: {money(order.total)}</strong><label>Update status<select value={order.status||"Pending"} onChange={event=>{updateOrderStatus(order.id,event.target.value);saveNotice("Order status updated.")}}>{orderStatuses.map(status=><option key={status}>{status}</option>)}</select></label><div className="admin-row-actions"><a className="icon-button" href={whatsappLink(site.whatsapp,`Hello ${order.customer?.name||""}, following up about order ${order.id}.`)} target="_blank" rel="noopener noreferrer" aria-label={`Contact ${order.customer?.name||"customer"} on WhatsApp`}><MessageCircle size={16}/></a><button type="button" className="icon-button danger-button" aria-label={`Delete order ${order.id}`} onClick={()=>{if(window.confirm("Delete this saved order from this device?")){removeOrder(order.id);saveNotice("Order removed.")}}}><Trash2 size={16}/></button></div></div></article>)}</div>:<div className="admin-empty"><ClipboardList size={34}/><h3>No orders found</h3><p>Orders placed through the cart enquiry form will appear here.</p></div>}
          <div className="admin-section-title enquiries-title"><h3>Enquiries <span>{enquiries.length}</span></h3></div>
          {enquiries.length ? <div className="admin-enquiry-list">{enquiries.map((enquiry,index)=><article className="admin-enquiry-card" key={enquiry.id||index}><div><strong>{enquiry.name||"Enquiry"}</strong><small>{enquiry.type||"General enquiry"} · {enquiry.subject||"No subject"}</small><p>{enquiry.message}</p><a href={`tel:${enquiry.phone||""}`}>{enquiry.phone||"No phone number"}</a></div><label>Follow-up<select value={enquiry.status||"New"} onChange={event=>updateEnquiry(enquiry.id,event.target.value)}>{["New","Contacted","Closed"].map(status=><option key={status}>{status}</option>)}</select></label><div className="admin-row-actions"><a className="icon-button" href={whatsappLink(site.whatsapp,`Hello ${enquiry.name||""}, following up on your enquiry about ${enquiry.subject||enquiry.type||"our services"}.`)} target="_blank" rel="noopener noreferrer" aria-label={`Contact ${enquiry.name||"enquirer"} on WhatsApp`}><MessageCircle size={16}/></a><button type="button" className="icon-button danger-button" aria-label="Delete enquiry" onClick={()=>removeEnquiry(enquiry.id)}><Trash2 size={16}/></button></div></article>)}</div>:<p className="admin-muted">Enquiries submitted using the site’s enquiry form will appear here. WhatsApp conversations are not imported.</p>}
        </>}

        {tab === "services" && <>
          <div className="admin-content-title"><div><h2>Services & categories</h2><p>Organize service offerings into customer-facing categories.</p></div><button className="button button-small" type="button" onClick={beginNewService}><Plus size={16}/> Add service</button></div>
          <div className="admin-panel service-category-manager"><div className="admin-panel-heading"><div><h3>Service categories</h3><p>Categories organize the services directory.</p></div><FolderPlus size={20}/></div><form className="admin-add-category" onSubmit={addServiceCategory}><input aria-label="New service category" value={newCategory} onChange={event=>setNewCategory(event.target.value)} placeholder="For example, On-site support"/><button className="button button-small" type="submit"><Plus size={16}/> Add category</button></form><div className="admin-category-list">{serviceCategories.map(category=><div key={category}><span>{category}</span><small>{services.filter(service=>service.category===category).length} services</small><button type="button" className="icon-button danger-button" aria-label={`Delete ${category} category`} onClick={()=>removeServiceCategory(category)}><Trash2 size={15}/></button></div>)}</div></div>
          {serviceEditing !== null && <form className="admin-edit-form" onSubmit={saveService}><div className="edit-form-head"><h3>{serviceEditing==="new"?"Add service":"Edit service"}</h3><button type="button" className="icon-button" aria-label="Close service form" onClick={()=>setServiceEditing(null)}><X/></button></div><div className="admin-form-grid"><label>Service name *<input required value={serviceForm.name||""} onChange={event=>setServiceForm({...serviceForm,name:event.target.value})}/></label><label>URL slug<input value={serviceForm.slug||""} onChange={event=>setServiceForm({...serviceForm,slug:event.target.value})} placeholder="Generated from name if blank"/></label><label>Category<select required value={serviceForm.category||""} onChange={event=>setServiceForm({...serviceForm,category:event.target.value})}><option value="">Choose a category</option>{serviceCategories.map(category=><option key={category}>{category}</option>)}</select></label><label>Icon name<input value={serviceForm.icon||""} onChange={event=>setServiceForm({...serviceForm,icon:event.target.value})} placeholder="Wrench, Wifi, Printer"/></label><label>Price note<input value={serviceForm.priceLabel||""} onChange={event=>setServiceForm({...serviceForm,priceLabel:event.target.value})} placeholder="Ask for a quote"/></label></div><label>Description<textarea rows="3" value={serviceForm.description||""} onChange={event=>setServiceForm({...serviceForm,description:event.target.value})}/></label><label>What's included (one per line)<textarea rows="3" value={(serviceForm.features||[]).join("\n")} onChange={event=>setServiceForm({...serviceForm,features:event.target.value.split("\n").map(value=>value.trim()).filter(Boolean)})}/></label><div className="admin-checks"><label><input type="checkbox" checked={!!serviceForm.featured} onChange={event=>setServiceForm({...serviceForm,featured:event.target.checked})}/> Feature on home page</label><label><input type="checkbox" checked={serviceForm.active!==false} onChange={event=>setServiceForm({...serviceForm,active:event.target.checked})}/> Visible in directory</label></div><button className="button" type="submit"><Save size={16}/> Save service</button></form>}
          <div className="admin-service-list">{services.map(service=><article className="admin-service-row admin-managed-service" key={service.id}><label className="admin-service-active" title={service.active===false?"Service hidden":"Service visible"}><input type="checkbox" checked={service.active!==false} aria-label={`${service.active===false?"Show":"Hide"} ${service.name}`} onChange={event=>setServices(current=>current.map(item=>item.id===service.id?{...item,active:event.target.checked}:item))}/></label><div className="admin-service-copy"><strong>{service.name}</strong><p>{service.description}</p><small>{service.category||"Uncategorized"} · {service.priceLabel||"Ask for a quote"}</small></div><div className="admin-row-actions"><button type="button" className="icon-button" aria-label={`Edit ${service.name}`} onClick={()=>beginEditService(service)}><Pencil size={16}/></button><button type="button" className="icon-button danger-button" aria-label={`Delete ${service.name}`} onClick={()=>deleteService(service.id)}><Trash2 size={16}/></button></div></article>)}</div>
          {!services.length&&<div className="admin-empty"><Wrench size={34}/><h3>No services yet</h3><p>Add a service category, then create a service offering.</p></div>}
        </>}

        {tab === "settings" && <>
          <div className="admin-content-title"><div><h2>Shop settings</h2><p>Contact information and messaging used throughout the shop.</p></div></div>
          <form className="admin-edit-form settings-form" onSubmit={event=>{event.preventDefault();writeLocal("kgn_site",site);saveNotice("Shop settings saved on this device.")}}><div className="admin-form-grid"><label>Shop name<input name="name" value={site.name||""} onChange={event=>setSite({...site,name:event.target.value})}/></label><label>Short name<input name="shortName" value={site.shortName||""} onChange={event=>setSite({...site,shortName:event.target.value})}/></label><label>Tagline<input name="tagline" value={site.tagline||""} onChange={event=>setSite({...site,tagline:event.target.value})}/></label><label>Phone<input name="phone" type="tel" value={site.phone||""} onChange={event=>setSite({...site,phone:event.target.value})}/></label><label>WhatsApp number with country code<input name="whatsapp" inputMode="tel" value={site.whatsapp||""} onChange={event=>setSite({...site,whatsapp:event.target.value})}/></label><label>Email<input name="email" type="email" value={site.email||""} onChange={event=>setSite({...site,email:event.target.value})}/></label><label>Business hours<input name="hours" value={site.hours||""} onChange={event=>setSite({...site,hours:event.target.value})}/></label><label className="span-two">Address<input name="address" value={site.address||""} onChange={event=>setSite({...site,address:event.target.value})}/></label><label className="span-two">Announcement bar<input name="announcement" value={site.announcement||""} onChange={event=>setSite({...site,announcement:event.target.value})}/></label></div><div className="admin-social-settings" id="social-links"><div><h3>Social profile links</h3><p>Paste the full public profile URL. Only links you add are clickable in the footer.</p></div><div className="admin-form-grid">{[["instagram","Instagram"],["facebook","Facebook"],["youtube","YouTube"],["linkedin","LinkedIn"],["x","X"],["tiktok","TikTok"]].map(([id,label])=><label key={id}>{label} URL<input type="url" placeholder={`https://${id==="x"?"x.com":`${id}.com`}/yourprofile`} value={site.socialLinks?.[id]||""} onChange={event=>setSite({...site,socialLinks:{...(site.socialLinks||{}),[id]:event.target.value}})}/></label>)}</div></div><button className="button" type="submit"><Save size={16}/> Save settings</button><p className="form-footnote">Payments are not collected by this site. Customer orders remain enquiries until confirmed by the shop.</p></form>
        </>}
      </div>
    </div>
  </div></section>;
}
