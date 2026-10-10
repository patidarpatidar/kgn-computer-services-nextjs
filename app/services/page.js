"use client";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { useStore } from "../../components/StoreProvider";
import ServiceCard from "../../components/ServiceCard";
import Link from "next/link";
import { ArrowRight, CheckCircle2, MessageCircle, Search } from "lucide-react";

function ServicesListing() {
  const params = useSearchParams();
  const {services, serviceCategories} = useStore();
  const [category, setCategory] = useState(params.get("category") || "all");
  const shown = useMemo(
    () => services.filter(service => service.active !== false && (category === "all" || service.category === category)),
    [services, category]
  );

  return <>
    <div className="page-hero"><div className="container"><span className="eyebrow">LOCAL TECH SUPPORT</span><h1>Help for your everyday tech.</h1><p>Find a service, tell us what is happening and we’ll help you understand the next step.</p><div className="hero-actions service-hero-actions"><Link className="button" href="/inquiry"><MessageCircle size={17}/> Describe your issue</Link><a className="button button-outline" href="#service-list"><Search size={17}/> Browse services</a></div></div></div>
    <section className="service-steps"><div className="container service-steps-grid">{[["01","Choose a service","Find the support that best fits your device or setup."],["02","Share the details","Tell us the model, symptoms and your preferred timing."],["03","Confirm the next step","We’ll discuss availability and any estimate before work begins."]].map(([number,title,copy])=><div key={number}><span>{number}</span><div><strong>{title}</strong><p>{copy}</p></div></div>)}</div></section>
    <section className="section" id="service-list"><div className="container">
      <div className="section-heading"><div><span className="eyebrow">SERVICE DIRECTORY</span><h2>How can we help?</h2><p>Service scope and pricing are confirmed after we understand your requirements.</p></div><Link className="text-link" href="/contact">Contact the shop <ArrowRight size={16}/></Link></div>
      <div className="filter-chips service-filter-chips" aria-label="Filter services by category">{[["all","All services"],...serviceCategories.map(name=>[name,name])].map(([id,label])=><button type="button" key={id} className={category===id?"filter-chip active":"filter-chip"} onClick={()=>setCategory(id)}>{label}</button>)}</div>
      {shown.length?<div className="service-grid service-grid-large">{shown.map(service=><ServiceCard key={service.id} service={service}/>)}</div>:<div className="empty-state"><span>🛠️</span><h3>No services in this category yet</h3><p>Choose another category or send us a message with your requirements.</p><button className="button" onClick={()=>setCategory("all")}>Show all services</button></div>}
      <div className="service-note"><div><h3>Not sure what you need?</h3><p>Start with the device, issue and your preferred time. We’ll help you choose the next step.</p></div><Link className="button" href="/inquiry">Request assistance <ArrowRight size={18}/></Link></div>
      <div className="service-reassurance"><CheckCircle2 size={19}/><p><strong>Clear estimates first.</strong> We’ll confirm the available service, expected cost and timing before you decide how to proceed.</p></div>
    </div></section>
  </>;
}

export default function ServicesPage() {
  return <Suspense fallback={<div className="container section">Loading services…</div>}><ServicesListing/></Suspense>;
}
