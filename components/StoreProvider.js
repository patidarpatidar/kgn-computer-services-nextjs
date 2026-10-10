"use client";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import seedProducts from "../data/products.json";
import seedServices from "../data/services.json";
import seedSite from "../data/site.json";
import { readLocal, writeLocal } from "../lib/storage";

const StoreContext = createContext(null);
const seedServiceCategories = [...new Set(seedServices.map(service => service.category).filter(Boolean))];
export function StoreProvider({ children }) {
  const [products, setProducts] = useState(seedProducts);
  const [services, setServices] = useState(seedServices);
  const [serviceCategories, setServiceCategories] = useState(seedServiceCategories);
  const [site, setSite] = useState(seedSite);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [profile, setProfile] = useState({ name: "", phone: "", email: "", address: "" });
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const storedServices = readLocal("kgn_services", seedServices);
    const retiredSeedServiceIds = new Set(["s1", "s2", "s3", "s4", "s5", "s6"]);
    const customServices = storedServices.filter(service => !retiredSeedServiceIds.has(service.id));
    const normalizedServices = [
      ...seedServices,
      ...customServices.map(service => service.category ? service : {...service, category: "General support"})
    ];
    const retiredSeedCategories = new Set(["Computer repair", "Setup & installation", "Security & networking", "Data & storage"]);
    const storedServiceCategories = readLocal("kgn_service_categories", seedServiceCategories)
      .filter(category => !retiredSeedCategories.has(category));
    const storedSite = readLocal("kgn_site", seedSite);
    const legacySiteValues = {
      name: "KGN Computer and Services",
      shortName: "KGN Computer",
      tagline: "Computers, accessories & reliable tech support",
      description: "Your local destination for computers, accessories, repairs and technical support.",
      phone: "9340004380",
      whatsapp: "919340004380",
      email: "kgncomputer@example.com",
      address: "Neemuch, Madhya Pradesh, India",
      hours: "Mon–Sat · 10:00 AM–8:00 PM",
      announcement: "Computer sales, accessories and doorstep tech support"
    };
    const siteWithCurrentListing = Object.fromEntries(
      Object.entries(storedSite).map(([key, value]) => [key, legacySiteValues[key] === value ? seedSite[key] : value])
    );
    const siteWithVerifiedGoogleDetails = {
      ...siteWithCurrentListing,
      googleRating: seedSite.googleRating,
      googleReviewCount: seedSite.googleReviewCount,
      googleReviewDistribution: seedSite.googleReviewDistribution,
      googleFeaturedReview: seedSite.googleFeaturedReview,
      googleMapsUrl: seedSite.googleMapsUrl,
      googleReviewsUrl: seedSite.googleReviewsUrl,
      businessCategory: seedSite.businessCategory
    };
    setProducts(readLocal("kgn_products", seedProducts));
    setServices(normalizedServices);
    setServiceCategories([...new Set([...storedServiceCategories, ...normalizedServices.map(service => service.category)])]);
    setSite({...seedSite, ...siteWithVerifiedGoogleDetails, socialLinks: {...seedSite.socialLinks, ...storedSite.socialLinks}});
    setCart(readLocal("kgn_cart", []));
    setOrders(readLocal("kgn_orders", []));
    setProfile(readLocal("kgn_profile", { name: "", phone: "", email: "", address: "" }));
    setReady(true);
  }, []);
  useEffect(() => { if (ready) writeLocal("kgn_cart", cart); }, [cart, ready]);
  useEffect(() => { if (ready) writeLocal("kgn_orders", orders); }, [orders, ready]);
  useEffect(() => { if (ready) writeLocal("kgn_profile", profile); }, [profile, ready]);
  useEffect(() => { if (ready) writeLocal("kgn_products", products); }, [products, ready]);
  useEffect(() => { if (ready) writeLocal("kgn_services", services); }, [services, ready]);
  useEffect(() => { if (ready) writeLocal("kgn_service_categories", serviceCategories); }, [serviceCategories, ready]);
  useEffect(() => { if (ready) writeLocal("kgn_site", site); }, [site, ready]);

  const addToCart = (product, quantity = 1) => setCart(prev => {
    const found = prev.find(item => item.id === product.id);
    return found ? prev.map(item => item.id === product.id ? {...item, quantity: item.quantity + quantity} : item)
      : [...prev, {id: product.id, quantity, name: product.name, price: product.price, emoji: product.emoji}];
  });
  const changeQty = (id, quantity) => setCart(prev => quantity <= 0 ? prev.filter(x => x.id !== id) : prev.map(x => x.id === id ? {...x, quantity} : x));
  const removeFromCart = id => setCart(prev => prev.filter(x => x.id !== id));
  const clearCart = () => setCart([]);
  const saveOrder = (order) => setOrders(prev => [order, ...prev]);
  const updateOrderStatus = (id, status) => setOrders(prev => prev.map(order => order.id === id ? { ...order, status, statusHistory: [...(order.statusHistory || []), { status, at: new Date().toISOString() }] } : order));
  const removeOrder = (id) => setOrders(prev => prev.filter(order => order.id !== id));
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const value = useMemo(() => ({products, setProducts, services, setServices, serviceCategories, setServiceCategories, site, setSite, cart, addToCart, changeQty, removeFromCart, clearCart, total, orders, saveOrder, updateOrderStatus, removeOrder, profile, setProfile, ready}), [products, services, serviceCategories, site, cart, total, orders, profile, ready]);
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}
export const useStore = () => useContext(StoreContext);
