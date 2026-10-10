
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  ShoppingBag,
  MessageCircle,
  Laptop,
  UserRound,
  Wrench,
  ChevronRight,
} from "lucide-react";

import { useStore } from "./StoreProvider";
import { whatsappLink } from "../lib/storage";

const links = [
  { label: "Home", href: "/" },
  { label: "Products", href: "/products" },
  { label: "Services", href: "/services" },
  {
    label: "Repairs",
    href: "/services?category=Computer%20repair",
    match: "/services",
  },
  { label: "Contact", href: "/contact" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const pathname = usePathname();
  const { site = {}, cart = [] } = useStore();

  const cartCount = cart.reduce(
    (count, item) => count + (Number(item.quantity) || 0),
    0
  );

  const cartTotal = cart.reduce(
    (total, item) =>
      total +
      (Number(item.price) || 0) * (Number(item.quantity) || 0),
    0
  );

  const shopName = site.shortName || site.name || "KGN Computer";

  const whatsappHref = site.whatsapp
    ? whatsappLink(
        site.whatsapp,
        `Hello ${site.name || "KGN Computer"}, I need help with products or services.`
      )
    : "";

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;

    const onKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open]);

  const closeMenu = () => setOpen(false);

  const isActive = (href) => {
    if (href === "/") return pathname === "/";
    if (href === "/services?category=Computer%20repair") {
      return pathname === "/services";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {site.announcement && (
        <div className="announcement">
          <span>{site.announcement}</span>

          <Link href="/inquiry" onClick={closeMenu}>
            Get assistance <ChevronRight size={14} />
          </Link>
        </div>
      )}

      <header className={`header ${scrolled ? "header-scrolled" : ""}`}>
        <div className="container header-inner">
          <Link
            className="brand"
            href="/"
            onClick={closeMenu}
            aria-label={`${shopName} home`}
          >
            <span className="brand-mark">
              <Laptop size={24} />
            </span>

            <span className="brand-copy">
              <strong>{shopName}</strong>
              <small>&amp; SERVICES</small>
            </span>
          </Link>

          <nav
            id="primary-navigation"
            className={`nav ${open ? "nav-open" : ""}`}
            aria-label="Main navigation"
          >
            {links.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={closeMenu}
                className={isActive(href) ? "nav-link-active" : ""}
                aria-current={isActive(href) ? "page" : undefined}
              >
                {label}
              </Link>
            ))}

            <div className="mobile-nav-divider" />

            <Link href="/inquiry" onClick={closeMenu}>
              <MessageCircle size={17} />
              Send an enquiry
            </Link>

           
          
           
          </nav>

          {open && (
            <button
              type="button"
              className="nav-backdrop"
              aria-label="Close navigation menu"
              onClick={closeMenu}
              tabIndex={-1}
            />
          )}

          <div className="header-actions">
            {site.whatsapp && (
              <a
                className="header-whatsapp"
                href={whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Chat with us on WhatsApp"
                title="Chat on WhatsApp"
              >
                <MessageCircle size={19} />
              </a>
            )}

            <Link
              className={`profile-icon ${
                isActive("/profile") ? "header-action-active" : ""
              }`}
              href="/profile"
              aria-label="My profile and orders"
              title="My profile"
            >
              <UserRound size={19} />
            </Link>

            <Link
              className={`cart-icon ${
                isActive("/cart") ? "header-action-active" : ""
              }`}
              href="/cart"
              aria-label={`Shopping cart, ${cartCount} items`}
              title={`Cart: ${cartCount} items · ₹${cartTotal.toLocaleString(
                "en-IN"
              )}`}
            >
              <ShoppingBag size={20} />
              <span>{cartCount > 99 ? "99+" : cartCount}</span>
            </Link>

            <Link className="button button-small header-help" href="/inquiry">
              <Wrench size={16} />
              Get help
            </Link>

            <button
              type="button"
              className="menu-toggle"
              onClick={() => setOpen((current) => !current)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="primary-navigation"
            >
              {open ? <X size={23} /> : <Menu size={23} />}
            </button>
          </div>
        </div>
      </header>
    </>
  );
}
