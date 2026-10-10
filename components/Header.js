"use client";
import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingBag, MessageCircle, Laptop, UserRound, Wrench } from "lucide-react";
import { useStore } from "./StoreProvider";

export default function Header() {
  const [open, setOpen] = useState(false);
  const {site, cart} = useStore();
  const cartCount = cart.reduce((count, item) => count + item.quantity, 0);
  const links = [["Home","/"],["Products","/products"],["Services","/services"],["Repairs","/services?category=Computer%20repair"],["Contact","/contact"]];
  return <>
    <div className="announcement">{site.announcement}</div>
    <header className="header">
      <div className="container header-inner">
        <Link className="brand" href="/" onClick={()=>setOpen(false)}>
          <span className="brand-mark"><Laptop size={24}/></span>
          <span><strong>KGN <em>Computer</em></strong><small>& SERVICES</small></span>
        </Link>
        <nav id="primary-navigation" className={`nav ${open ? "nav-open" : ""}`} aria-label="Main navigation">
          {links.map(([label,href])=><Link key={href} href={href} onClick={()=>setOpen(false)}>{label}</Link>)}
          <Link href="/inquiry" onClick={()=>setOpen(false)}><MessageCircle size={16}/> Send an enquiry</Link>
          <Link href="/profile" onClick={()=>setOpen(false)}><UserRound size={16}/> My orders & profile</Link>
          <Link className="mobile-nav-cart" href="/cart" onClick={()=>setOpen(false)}><ShoppingBag size={16}/> Cart ({cartCount})</Link>
        </nav>
        <div className="header-actions">
          <Link className="profile-icon" href="/profile" aria-label="My profile" title="My Profile"><UserRound size={19}/></Link>
          <Link className="cart-icon" href="/cart" aria-label={`Shopping cart, ${cartCount} items`}><ShoppingBag size={20}/><span>{cartCount}</span></Link>
          <Link className="button button-small" href="/inquiry"><Wrench size={16}/> Get help</Link>
          <button className="menu-toggle" onClick={()=>setOpen(!open)} aria-label={open?"Close menu":"Open menu"} aria-expanded={open} aria-controls="primary-navigation">{open?<X/>:<Menu/>}</button>
        </div>
      </div>
    </header>
  </>;
}
