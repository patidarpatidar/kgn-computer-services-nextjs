# KGN Computer and Services — Next.js JavaScript Starter

Mobile-first computer shop, product catalogue, services, cart, WhatsApp enquiry and demo admin panel.

## Requirements
- Node.js 18.17+ (Node 20 LTS recommended)
- npm

## Run locally
```bash
npm install
npm run dev
```
Open http://localhost:3000

## Main routes
- `/` Home
- `/products` Product catalogue and search/filter
- `/products/[slug]` Product detail
- `/services` Services catalogue
- `/cart` Cart and WhatsApp order
- `/inquiry` General enquiry form (WhatsApp)
- `/contact` Contact details and WhatsApp
- `/admin` Demo admin dashboard: products, enquiries, orders, services and settings

## Edit the JSON catalogue
All seed data is in `data/`:
- `products.json`
- `services.json`
- `site.json`
- `categories.json`

The storefront reads seed JSON, then uses browser localStorage for admin changes and customer cart/order demo state. Admin edits do not write back to files on the server (browsers cannot safely write project files). In Admin, use **Export products JSON** to download edited product data and replace `data/products.json` manually when needed.

## Important before production
- Update shop phone, WhatsApp number, address and hours in `data/site.json`.
- Replace demo images / emoji illustrations with licensed real product photos.
- Add a real database and authenticated server-side admin before collecting live customer data.
- The demo admin panel is not secured. Do not deploy it as a production admin without authentication and authorization.
- WhatsApp click-to-chat opens a prefilled message. It cannot automatically attach images or send messages silently.
- Payment QR sharing is intentionally manual in this starter. Add the real shop QR image under `public/images/payment-qr.png`; never use the placeholder for actual payment. Verify payment before marking an order paid.
