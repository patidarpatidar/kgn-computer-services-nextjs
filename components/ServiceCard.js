"use client";
import Link from "next/link";
import { Wrench, MonitorCog, Printer, ShieldCheck, Wifi, HardDrive, ArrowUpRight } from "lucide-react";
const icons = {Wrench,MonitorCog,Printer,ShieldCheck,Wifi,HardDrive};
export default function ServiceCard({service}) {
 const Icon=icons[service.icon]||Wrench;
 return <article className="service-card"><div className="service-card-top"><div className="service-icon"><Icon size={25}/></div>{service.category&&<span className="service-category-tag">{service.category}</span>}</div><h3>{service.name}</h3><p>{service.description}</p><div className="service-features">{(service.features||[]).slice(0,3).map(f=><span key={f}>✓ {f}</span>)}</div><div className="service-card-bottom"><small>{service.priceLabel||"Ask us for a quote"}</small><Link className="text-link" href={`/inquiry?service=${encodeURIComponent(service.name)}`}>Request service <ArrowUpRight size={16}/></Link></div></article>;
}
