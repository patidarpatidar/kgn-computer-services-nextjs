"use client";
import { MessageCircle } from "lucide-react";
import { useStore } from "./StoreProvider";
import { whatsappLink } from "../lib/storage";
export default function WhatsAppFloat() {
  const {site} = useStore();
  return <a className="whatsapp-float" href={whatsappLink(site.whatsapp, `Hello ${site.name}, I need some information about your products or services.`)} target="_blank" rel="noopener noreferrer" aria-label={`Chat with ${site.shortName || site.name} on WhatsApp`} title="Chat with us on WhatsApp">
    <span className="whatsapp-float-icon"><MessageCircle size={24}/><i aria-hidden="true"/></span>
    <span className="whatsapp-float-copy"><strong>Chat with us</strong><small>Ask about products or services</small></span>
  </a>;
}
