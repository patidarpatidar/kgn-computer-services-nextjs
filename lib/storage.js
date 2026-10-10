export const readLocal = (key, fallback) => {
  if (typeof window === "undefined") return fallback;
  try {
    const value = window.localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch { return fallback; }
};
export const writeLocal = (key, value) => {
  if (typeof window !== "undefined") window.localStorage.setItem(key, JSON.stringify(value));
};
export const money = (value) => new Intl.NumberFormat("en-IN", {
  style: "currency", currency: "INR", maximumFractionDigits: 0
}).format(Number(value || 0));
export const whatsappLink = (number, message) =>
  `https://wa.me/${String(number || "").replace(/\D/g, "")}?text=${encodeURIComponent(message)}`;
export const makeId = (prefix = "KGN") => `${prefix}-${Date.now().toString().slice(-7)}`;
