# Alpha Watch & Opticals — Premium Watch House & Opticals eCommerce PWA

> **Timeless Watches. Perfect Vision.**  
> Authorized Retailer for Titan, Casio, Timex, Fastrack, Sonata, Maxima, Titan Eyewear, SKINN Perfumes, and Fire-Boltt.  
> **Physical Showroom**: Chowdhary Complex, Degree College Chauraha, Raebareli, Uttar Pradesh 229001  
> **Contact**: Mohd. Shoeb | Mob: +91 90444 77735 | WhatsApp: +91 90444 77735

---

## 🌟 Features & Capabilities

- **Luxury Horological & Eyewear Design**: Deep luxury navy (`#0b162c`), rich warm gold (`#d4af37`), ivory pearl (`#faf8f5`), and emerald accents.
- **Real Physical Store Integration**: High-resolution authentic store photography featuring the illuminated exterior signage, multi-tier watch showroom, optical frames wall, SKINN perfume lounge, and wall clocks collection.
- **Complete Customer Journey**:
  - Home & Category exploration
  - Real-time live search, filters (brand, category, price range, stock availability)
  - Detailed product view with zoomable image gallery, variant selectors, tech specs table, and Raebareli pincode delivery checker
  - Persistent guest cart with automated migration upon login/registration
  - Seamless Checkout supporting **Store Pickup (Pay at Shop)** and **Doorstep Delivery (UPI Payment QR + Receipt Proof Upload)**
  - Dynamic Order Confirmation with unique alphanumeric order tracking numbers
  - Customer Account Dashboard with 9 interactive tabs (Profile, Orders timeline, Wishlist, Saved Addresses, Notifications, Support tickets, Payment proofs, Password management)
- **Admin Management Suite** (`/admin`):
  - Executive Dashboard with KPI cards, revenue analytics, pending approval alerts, and low-stock warnings
  - Order Management with payment proof review, approve/reject workflow, and status tracking (Pending → Confirmed → Packed → Ready/Dispatched → Delivered)
  - Products CRUD with variant configuration, badge toggles, and stock controls
  - Customer CRM with role promotion and block/unblock security
  - Coupon Engine & Review Moderation
  - Live Store Settings (timings, addresses, UPI ID, delivery fee rules)
- **Progressive Web App (PWA)**:
  - Installable on Android, iOS, and Desktop
  - Web App Manifest + Service Worker for offline fallback and asset caching
- **Local SEO & Schema Markup**:
  - Full OpenGraph metadata & Twitter cards
  - Schema.org `LocalBusiness` & `Product` structured JSON-LD data
  - Dynamic `sitemap.xml` and `robots.txt`

---

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS, Custom Glassmorphism, Framer Motion
- **State Management**: Zustand
- **Database & Storage**: In-memory + persistent singleton data layer (Insforge architecture)
- **Testing**: Playwright End-to-End Suite (39/39 Passing)

---

## 🚀 Getting Started

```bash
# Clone the repository
git clone https://github.com/vishishthgaurlittle-byte/alpha-watch-opticals.git
cd alpha-watch-opticals

# Install dependencies
npm install

# Run the development server
npm run dev

# Build for production
npm run build
npm run start
```

---

## 🔒 Security & Credentials

- `.env.local` and tokens are strictly excluded via `.gitignore`.
- Production credentials and OAuth secrets should be configured directly in your Vercel Project Settings.

---

© 2026 Alpha Watch & Opticals. All rights reserved.
