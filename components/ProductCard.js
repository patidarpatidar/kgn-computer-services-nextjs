"use client";
import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, ArrowUpRight } from "lucide-react";
import { useStore } from "./StoreProvider";
import { money } from "../lib/storage";
import categories from "../data/categories.json";
export default function ProductCard({product}) {
  const {addToCart} = useStore();
  const [added, setAdded] = useState(false);
  const categoryName = categories.find(category => category.id === product.category)?.name || product.category;
  const addProduct = () => {
    addToCart(product);
    setAdded(true);
  };
  return <article className="product-card">
    <Link href={`/products/${product.slug}`} className="product-art" aria-label={`View ${product.name}`}>
      {product.badge && <span className="product-badge">{product.badge}</span>}<span className="product-emoji">{product.emoji || "💻"}</span><span className="art-arrow"><ArrowUpRight size={17}/></span>
    </Link>
    <div className="product-info"><span className="eyebrow">{categoryName}</span><Link href={`/products/${product.slug}`}><h3>{product.name}</h3></Link><p className="product-desc">{product.description}</p>
      <div className="product-price"><strong>{money(product.price)}</strong>{product.oldPrice>product.price&&<del>{money(product.oldPrice)}</del>}</div>
      <div className="product-card-actions"><Link href={`/products/${product.slug}`} className="text-link">View details</Link><button className={`icon-button add-button${added?" added":""}`} onClick={addProduct} aria-label={added?`${product.name} added to cart`:`Add ${product.name} to cart`} aria-live="polite"><ShoppingCart size={18}/><span>{added?"Added":"Add to cart"}</span></button></div>
    </div>
  </article>;
}
