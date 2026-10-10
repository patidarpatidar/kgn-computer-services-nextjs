"use client";
import { useMemo, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { Search, SlidersHorizontal } from "lucide-react";
import { useStore } from "../../components/StoreProvider";
import ProductCard from "../../components/ProductCard";
import categories from "../../data/categories.json";
function ProductListing() {
 const {products}=useStore(); const params=useSearchParams();
 const [query,setQuery]=useState(""); const [category,setCategory]=useState(params.get("category")||"all"); const [sort,setSort]=useState("featured");
 const shown=useMemo(()=>products.filter(p=>{const categoryName=categories.find(item=>item.id===p.category)?.name||p.category;return p.active!==false&&(!query||`${p.name} ${p.description} ${p.category} ${categoryName}`.toLowerCase().includes(query.toLowerCase()))&&(category==="all"||p.category===category)}).sort((a,b)=>sort==="price-low"?a.price-b.price:sort==="price-high"?b.price-a.price:sort==="name"?a.name.localeCompare(b.name):(Number(b.featured)-Number(a.featured))),[products,query,category,sort]);
 return <><div className="page-hero"><div className="container"><span className="eyebrow">THE KGN CATALOGUE</span><h1>Find your next tech essential.</h1><p>Browse the range or ask us for a custom configuration.</p></div></div><section className="section"><div className="container"><div className="catalog-toolbar"><label className="search-box"><Search size={19}/><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search laptops, printers, accessories..."/></label><label className="sort-box"><SlidersHorizontal size={17}/><select value={sort} onChange={e=>setSort(e.target.value)}><option value="featured">Featured first</option><option value="price-low">Price: low to high</option><option value="price-high">Price: high to low</option><option value="name">Name A–Z</option></select></label></div><div className="filter-chips">{[["all","All products"],...categories.map(c=>[c.id,c.name])].map(([id,label])=><button key={id} className={category===id?"filter-chip active":"filter-chip"} onClick={()=>setCategory(id)}>{label}</button>)}</div><div className="results-line">{shown.length} product{shown.length!==1?"s":""} found</div>{shown.length?<div className="product-grid">{shown.map(p=><ProductCard key={p.id} product={p}/>)}</div>:<div className="empty-state"><span>🔎</span><h3>No matching products</h3><p>Try a different search or category.</p><button className="button" onClick={()=>{setQuery("");setCategory("all")}}>Clear filters</button></div>}</div></section></>;
}
export default function ProductsPage(){return <Suspense fallback={<div className="container section">Loading products…</div>}><ProductListing/></Suspense>}
