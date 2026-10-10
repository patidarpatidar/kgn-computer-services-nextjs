"use client";
import { MessageCircle, Phone } from "lucide-react";
import { useStore } from "./StoreProvider";
import { whatsappLink } from "../lib/storage";
export default function WhatsAppFloat() {
  const {site} = useStore();
  const hasWhatsApp = Boolean(site.whatsapp);
  const href = hasWhatsApp
    ? whatsappLink(site.whatsapp, `Hello ${site.name}, I need some information about your products or services.`)
    : `tel:${String(site.phone||"").replace(/[^\d+]/g,"")}`;
  return <a className={`whatsapp-float${hasWhatsApp?"":" call-float"}`} href={href} target={hasWhatsApp?"_blank":undefined} rel={hasWhatsApp?"noopener noreferrer":undefined} aria-label={hasWhatsApp?`Chat with ${site.shortName || site.name} on WhatsApp`:`Call ${site.shortName || site.name}`} title={hasWhatsApp?"Chat with us on WhatsApp":"Call the shop"}>
    <span className="whatsapp-float-icon">{hasWhatsApp?<><MessageCircle size={24}/><i aria-hidden="true"/></>:<Phone size={22}/>}</span>
    <span className="whatsapp-float-copy"><strong>{hasWhatsApp?"Chat with us":"Call the shop"}</strong><small>{hasWhatsApp?"Ask about products or services":site.phone}</small></span>
  </a>;
}
