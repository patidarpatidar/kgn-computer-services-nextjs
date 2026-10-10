
"use client";

import Link from "next/link";
import { useState } from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  Laptop,
  ArrowUpRight,
  Instagram,
  Facebook,
  Youtube,
  Linkedin,
  Twitter,
  Music2,
  MessageCircle,
  ArrowRight,
  ArrowUp,
  Check,
  Copy,
} from "lucide-react";

import { useStore } from "./StoreProvider";
import { whatsappLink } from "../lib/storage";

const socialPlatforms = [
  ["instagram", "Instagram", Instagram],
  ["facebook", "Facebook", Facebook],
  ["youtube", "YouTube", Youtube],
  ["linkedin", "LinkedIn", Linkedin],
  ["x", "X", Twitter],
  ["tiktok", "TikTok", Music2],
];

const validWebUrl = (value) => {
  if (typeof value !== "string" || !value.trim()) return false;

  try {
    const url = new URL(value);
    return url.protocol === "https:" || url.protocol === "http:";
  } catch {
    return false;
  }
};

export default function Footer() {
  const { site = {} } = useStore();
  const [copied, setCopied] = useState(false);

  const socials = site.socialLinks || {};
  const shopName = site.shortName || site.name || "KGN Computer";

  const locationLink = validWebUrl(site.googleMapsUrl)
    ? site.googleMapsUrl
    : `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
        site.address || shopName
      )}`;

  const whatsappHref = site.whatsapp
    ? whatsappLink(
        site.whatsapp,
        `Hello ${site.name || "KGN Computer"}, I found you on your website and would like to know more.`
      )
    : "";

  const phone = String(site.phone || "").replace(/[^\d+]/g, "");
  const email = String(site.email || "").trim();

  const copyPhone = async () => {
    if (!site.phone || !navigator.clipboard) return;

    try {
      await navigator.clipboard.writeText(String(site.phone));
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="footer">
      <div className="container footer-topline">
        <span className="footer-pulse" />

        <span>
          {site.announcement ||
            "Local computer sales, repairs and friendly tech support"}
        </span>

        <Link href="/inquiry">
          Tell us what you need <ArrowRight size={14} />
        </Link>
      </div>

      <div className="container footer-grid">
        {/* Brand and social links */}
        <div className="footer-about">
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark">
              <Laptop size={24} />
            </span>

            <span>
              <strong>{shopName}</strong>
              <small>&amp; SERVICES</small>
            </span>
          </Link>

          <p className="footer-tagline">
            {site.tagline ||
              "Computers, accessories and friendly support for your home, study and business."}
          </p>

          {site.whatsapp ? (
            <a
              className="footer-whatsapp"
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
            >
              <span className="footer-whatsapp-icon">
                <MessageCircle size={19} />
              </span>

              <span>
                <strong>Chat with our team</strong>
                <small>We're happy to help you choose</small>
              </span>

              <ArrowUpRight size={17} />
            </a>
          ) : (
            <a className="footer-whatsapp" href={phone ? `tel:${phone}` : "/contact"}>
              <span className="footer-whatsapp-icon">
                <Phone size={19} />
              </span>

              <span>
                <strong>Call the shop</strong>
                <small>{site.phone || "Visit our contact page"}</small>
              </span>

              <ArrowUpRight size={17} />
            </a>
          )}

          <div className="footer-social-block">
            <strong className="footer-social-heading">
              Follow the shop
            </strong>

            <div className="footer-socials" aria-label="Social media links">
              {socialPlatforms.map(([id, label, Icon]) => {
                const href = socials[id];

                if (validWebUrl(href)) {
                  return (
                    <a
                      key={id}
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`KGN on ${label}`}
                      title={`Follow us on ${label}`}
                    >
                      <Icon size={18} />
                    </a>
                  );
                }

                return (
                  <span
                    key={id}
                    className="footer-social-unavailable"
                    aria-label={`${label} link not configured`}
                    title={`Add the ${label} URL in Admin → Shop settings`}
                  >
                    <Icon size={18} />
                  </span>
                );
              })}
            </div>

            <small className="footer-social-hint">
              Social links can be managed from Admin → Shop settings.
            </small>
          </div>
        </div>

        {/* Explore links */}
        <div className="footer-link-column">
          <h4>Explore</h4>

          <Link href="/products">
            Shop all products <ArrowUpRight size={14} />
          </Link>

          <Link href="/services">
            Repairs &amp; services <ArrowUpRight size={14} />
          </Link>

          <Link href="/contact">
            Visit &amp; contact <ArrowUpRight size={14} />
          </Link>

          <Link href="/profile">
            My orders &amp; profile <ArrowUpRight size={14} />
          </Link>

          <Link href="/cart">
            Shopping cart <ArrowUpRight size={14} />
          </Link>

          <Link href="/inquiry">
            Send an enquiry <ArrowUpRight size={14} />
          </Link>
        </div>

        {/* Contact details */}
        <div className="footer-contact-column">
          <h4>Come say hello</h4>

          <a
            href={locationLink}
            target="_blank"
            rel="noopener noreferrer"
            className="footer-contact-link"
          >
            <span className="footer-contact-icon">
              <MapPin size={17} />
            </span>

            <span>
              <small>VISIT / SERVICE AREA</small>
              <strong>{site.address || "View our location"}</strong>
            </span>

            <ArrowUpRight size={14} />
          </a>

          <div className="footer-contact-link footer-phone-row">
            <span className="footer-contact-icon">
              <Phone size={17} />
            </span>

            <span>
              <small>CALL THE SHOP</small>
              {site.phone ? (
                <a href={`tel:${phone}`}>
                  <strong>{site.phone}</strong>
                </a>
              ) : (
                <strong>Phone number not configured</strong>
              )}
            </span>

            {site.phone && (
              <button
                type="button"
                className="footer-copy-button"
                onClick={copyPhone}
                title="Copy phone number"
                aria-label="Copy shop phone number"
              >
                {copied ? <Check size={15} /> : <Copy size={15} />}
              </button>
            )}
          </div>

          {email && (
            <a
              href={`mailto:${email}`}
              className="footer-contact-link"
            >
              <span className="footer-contact-icon">
                <Mail size={17} />
              </span>

              <span>
                <small>EMAIL</small>
                <strong>{email}</strong>
              </span>

              <ArrowUpRight size={14} />
            </a>
          )}

          <a
            className="footer-contact-link footer-hours"
            href={locationLink}
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="footer-contact-icon">
              <Clock size={17} />
            </span>

            <span>
              <small>SHOP HOURS</small>
              <strong>{site.hours || "Please contact us for timings"}</strong>
            </span>

            <ArrowUpRight size={14} />
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="footer-bottom">
        <div className="container footer-bottom-inner">
          <span>
            © {new Date().getFullYear()} {site.name || shopName}. All rights reserved.
          </span>

          <span>Prices and availability are confirmed on enquiry.</span>

          <Link href="/products">
            Back to shopping <ArrowRight size={13} />
          </Link>

          <button
            type="button"
            className="footer-back-top"
            onClick={scrollToTop}
            aria-label="Back to top"
            title="Back to top"
          >
            <ArrowUp size={17} />
          </button>
        </div>
      </div>
    </footer>
  );
}
