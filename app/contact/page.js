"use client";
import Link from "next/link";
import { MapPin, Phone, Mail, Clock, MessageCircle, ArrowRight, Wrench, ShoppingBag } from "lucide-react";
import { useStore } from "../../components/StoreProvider";
import { whatsappLink } from "../../lib/storage";

export default function ContactPage() {
  const {site} = useStore();
  const directionsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address)}`;

  return <>
    <div className="page-hero"><div className="container"><span className="eyebrow">CONTACT KGN</span><h1>Let’s get your tech sorted.</h1><p>Ask about product availability, pricing, repairs or support. We recommend checking before visiting.</p></div></div>
    <section className="section"><div className="container contact-grid">
      <div className="contact-main"><span className="eyebrow">WE’RE HAPPY TO HELP</span><h2>Choose how you’d like to reach us.</h2><p>Share what you need and we’ll help you understand the next step.</p>
        <a className="button button-whatsapp" href={whatsappLink(site.whatsapp,`Hello ${site.name}, I would like to enquire about your products and services.`)} target="_blank" rel="noopener noreferrer"><MessageCircle size={18}/> Chat on WhatsApp</a>
        <div className="contact-cards">
          <a href={directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin/><span><small>VISIT / SERVICE AREA</small><strong>{site.address}</strong><small>Open directions search <ArrowRight size={12}/></small></span></a>
          <a href={`tel:${String(site.phone||"").replace(/[^\d+]/g,"")}`}><Phone/><span><small>PHONE</small><strong>{site.phone}</strong><small>Tap to call <ArrowRight size={12}/></small></span></a>
          <a href={`mailto:${site.email}`}><Mail/><span><small>EMAIL</small><strong>{site.email}</strong><small>Send an email <ArrowRight size={12}/></small></span></a>
          <div><Clock/><span><small>BUSINESS HOURS</small><strong>{site.hours}</strong><small>Please confirm service availability before visiting.</small></span></div>
        </div>
      </div>
      <aside className="contact-side"><span className="contact-art">📍</span><h3>Planning a visit?</h3><p>Call or message first to check shop timing, product stock or technician availability.</p><a className="button button-outline" href={directionsUrl} target="_blank" rel="noopener noreferrer"><MapPin size={16}/> Search for directions</a><div className="contact-map-placeholder"><MapPin size={24}/><strong>{site.address}</strong><small>Directions open a map search. Confirm the exact location with the shop before travelling.</small></div></aside>
    </div></section>
    <section className="section section-muted"><div className="container contact-shortcuts"><div><span className="eyebrow">START HERE</span><h2>What can we help with?</h2><p>Choose a path to get your question to the right place.</p></div><Link className="contact-shortcut" href="/products"><ShoppingBag/><span><strong>Product advice</strong><small>Browse devices and accessories</small></span><ArrowRight/></Link><Link className="contact-shortcut" href="/services"><Wrench/><span><strong>Repair & support</strong><small>Find setup and support options</small></span><ArrowRight/></Link></div></section>
  </>;
}
