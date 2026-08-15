# Decor-AI 🌸✨

> **24/7 AI Event Decor Lead Intake, Instant Quote Calculator & Sales Pipeline CRM OS**

Decor-AI is an autonomous AI agent and luxury sales pipeline application built specifically for event designers, luxury florists, and spatial decoration businesses. It automates multi-channel lead intake across **WhatsApp Business**, **Instagram Direct**, and **Website Live Widgets**, extracts event parameters in natural conversation, calculates instant itemized multi-tier quotes, qualifies high-ticket clients, and logs deals straight into a CRM pipeline.

---

## 🌟 Key Features

- 💬 **Omnichannel AI Intake Simulators**: Realistic interactive mockups for WhatsApp Business, Instagram DM, Website Live Widget, and Direct Concierge Portal.
- 📐 **Instant Dynamic Pricing Engine**: Generates Silver Essential, Gold Signature Luxury, and Platinum Bespoke Royal packages with deposit schedules.
- 🔥 **High-Value Lead Qualification**: Automated lead scoring and VIP alerts with audio chime notifications and 1-click closing actions.
- 📊 **Visual 24/7 Sales Pipeline**: Interactive 6-stage Kanban board, Lead Directory with CSV export, and Revenue Analytics.
- 📄 **Printable Digital Proposals**: Formal client proposal generator with deliverables, payment terms, and digital signature blocks.
- ☁️ **Cloudflare Ready**: Native support for Cloudflare Pages with `wrangler.toml`, SPA redirect routing, and optimized static bundling.

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Build for Production
```bash
npm run build
```

---

## ☁️ Cloudflare Pages Deployment

### Option A: Cloudflare Pages Dashboard (Recommended)
1. Push your code to GitHub.
2. Log into the Cloudflare Dashboard -> **Workers & Pages** -> **Create application** -> **Pages** -> **Connect to Git**.
3. Select your repository `Decor-AI`.
4. Configure Build settings:
   - **Framework preset**: `Vite`
   - **Build command**: `npm run build`
   - **Build output directory**: `dist`
5. Click **Save and Deploy**.

### Option B: Wrangler CLI
```bash
npx wrangler pages deploy dist --project-name decor-ai
```

---

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS, Vanilla Glassmorphism utilities, Lucide Icons, Canvas Confetti
- **Audio Synthesis**: Web Audio API Chime synthesizer
- **Deployment**: Cloudflare Pages / Workers
