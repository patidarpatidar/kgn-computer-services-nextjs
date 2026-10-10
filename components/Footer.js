"use client";
import Link from "next/link";
import {
  MapPin, Phone, Mail, Clock, Laptop, ArrowUpRight, Instagram,
  Facebook, Youtube, Linkedin, Twitter, Music2, MessageCircle, ArrowRight
} from "lucide-react";
import { useStore } from "./StoreProvider";
import { whatsappLink } from "../lib/storage";

const socialPlatforms = [
  ["instagram", "Instagram", Instagram],
  ["facebook", "Facebook", Facebook],
  ["youtube", "YouTube", Youtube],
  ["linkedin", "LinkedIn", Linkedin],
  ["x", "X", Twitter],
  ["tiktok", "TikTok", Music2]
];

export default function Footer() {
  const {site} = useStore();
  const socials = site.socialLinks || {};
  const whatsapp = whatsappLink(site.whatsapp, `Hello ${site.name}, I found you on your website and would like to know more.`);
  return <footer className="footer">
    <div className="container footer-topline"><span className="footer-pulse"/><span>{site.announcement || "Local computer sales, repairs and friendly tech support"}</span><Link href="/inquiry">Tell us what you need <ArrowRight size={14}/></Link></div>
    <div className="container footer-grid">
      <div className="footer-about">
        <Link className="brand footer-brand" href="/"><span className="brand-mark"><Laptop size={24}/></span><span><strong>{site.shortName||"KGN Computer"}</strong><small>& SERVICES</small></span></Link>
        <p>{site.tagline || "Computers, accessories and friendly support for your home, study and business."}</p>
        <a className="footer-whatsapp" href={whatsapp} target="_blank" rel="noopener noreferrer"><MessageCircle size={17}/><span><strong>Chat with our team</strong><small>We’re happy to help you choose</small></span><ArrowUpRight size={16}/></a>
        <div className="footer-social-block"><strong className="footer-social-heading">Follow the shop</strong><div className="footer-socials" aria-label="Social media links">
          {socialPlatforms.map(([id,label,Icon])=>{
            const href=socials[id];
            const validHref=typeof href==="string"&&/^https?:\/\/\S+$/i.test(href);
            return validHref
              ? <a key={id} href={href} target="_blank" rel="noopener noreferrer" aria-label={`KGN on ${label}`} title={`Follow us on ${label}`}><Icon size={18}/></a>
              : <span key={id} className="footer-social-unavailable" aria-label={`${label} link not configured`} title={`Add the ${label} URL in Admin → Shop settings`}><Icon size={18}/></span>;
          })}
        </div><small className="footer-social-hint">Add your profile links from Admin → Shop settings.</small></div>
      </div>
      <div className="footer-link-column"><h4>Explore</h4><Link href="/products">Shop all products <ArrowUpRight size={14}/></Link><Link href="/services">Repairs & services <ArrowUpRight size={14}/></Link><Link href="/contact">Visit & contact <ArrowUpRight size={14}/></Link><Link href="/profile">My orders & profile <ArrowUpRight size={14}/></Link><Link href="/inquiry">Send an enquiry <ArrowUpRight size={14}/></Link></div>
      <div className="footer-contact-column"><h4>Come say hello</h4>
        <a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(site.address||"")}`} target="_blank" rel="noopener noreferrer"><span className="footer-contact-icon"><MapPin size={16}/></span><span><small>VISIT / SERVICE AREA</small><strong>{site.address}</strong></span><ArrowUpRight size={14}/></a>
        <a href={`tel:${String(site.phone||"").replace(/[^\d+]/g,"")}`}><span className="footer-contact-icon"><Phone size={16}/></span><span><small>CALL THE SHOP</small><strong>{site.phone}</strong></span><ArrowUpRight size={14}/></a>
        <a href={`mailto:${site.email}`}><span className="footer-contact-icon"><Mail size={16}/></span><span><small>EMAIL</small><strong>{site.email}</strong></span><ArrowUpRight size={14}/></a>
        <div className="footer-hours"><Clock size={16}/><span><small>SHOP HOURS</small><strong>{site.hours}</strong></span></div>
      </div>
    </div>
    <div className="footer-bottom"><div className="container"><span>© {new Date().getFullYear()} {site.name}. All rights reserved.</span><span>Prices and availability are confirmed on enquiry.</span><Link href="/products">Back to shopping <ArrowRight size={13}/></Link></div></div>
  </footer>;
}
