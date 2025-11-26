# Lucent Landing Page (Next.js)

<div align="center">
  <img src="https://github.com/PromptKits/.github/blob/main/profile/resources/logo.png" alt="Lucent Logo" width="300"/>
  <p>A marketing experience for Lucent’s focus companion — highlighting benefits, testimonials, pricing, and direct download links for iOS & Android.</p>
  <p>A marketing experience for Lucent’s focus companion — highlighting benefits, testimonials, pricing, and direct download links for iOS & Android.</p>
  <div>
    <img src="https://img.shields.io/badge/-Next.js-000000?style=flat&logo=next.js" alt="Next.js"/>
    <img src="https://img.shields.io/badge/-TypeScript-000000?style=flat&logo=typescript" alt="TypeScript"/>
    <img src="https://img.shields.io/badge/-Tailwind_CSS-000000?style=flat&logo=tailwind-css" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/-Shadcn_UI-000000?style=flat&logo=shadcn" alt="Shadcn UI"/>
    <img src="https://img.shields.io/badge/-next--intl-000000?style=flat&logo=google-translate" alt="Internationalization"/>
    <img src="https://img.shields.io/badge/-next--intl-000000?style=flat&logo=google-translate" alt="Internationalization"/>
  </div>
</div>

## 📋 Table of Contents

- [Lucent Landing Page (Next.js)](#lucent-landing-page-nextjs)
  - [📋 Table of Contents](#-table-of-contents)
  - [🚀 Overview](#-overview)
  - [✨ Landing Highlights](#-landing-highlights)
  - [🏗️ Architecture](#️-architecture)
  - [🛠️ Tech Stack](#️-tech-stack)
  - [🚀 Getting Started](#-getting-started)
  - [Environment Variables](#environment-variables)
  - [📁 Project Structure](#-project-structure)
  - [🧩 Content \& Localization](#-content--localization)
  - [🚢 Deployment](#-deployment)
  - [🧪 QA \& Tooling](#-qa--tooling)
  - [📞 Support \& License](#-support--license)

## 🚀 Overview

This repository hosts the **Lucent marketing site** — a polished landing page built with Next.js App Router. The page showcases the mobile app, communicates the value proposition, and funnels visitors to the App Store, Google Play, or the authenticated product experience.

- **Audience-first storytelling** with a hero, stats, benefits, testimonials, FAQ, and pricing.
- **Multi-lingual experience** powered by `next-intl` and JSON message catalogs.
- **Conversion-focused CTAs** with deep links to the live mobile apps.
- **Performance-ready** build designed for Vercel, Netlify, or static export.

## ✨ Landing Highlights

- **Hero + CTA:** Responsive mockups, dual store buttons, and social proof metrics sourced from `src/features/landing/data/stats.tsx`.
- **Benefits Sections:** Three narrative rows (Focus Routines, Insights, Balance) rendered from localized content (`messages/*.json`).
- **Interactive Pricing:** Tier cards defined in `src/features/landing/data/pricing.ts` plus CTA anchors and gradient accents.
- **Testimonials & FAQ:** Data-driven components to showcase community trust and answer onboarding questions.
- **Footer Experience:** Locale switch, policy links, and download buttons for instant hand-offs to the native apps.

## 🏗️ Architecture

- **Modular features:** `src/features/landing` contains `atoms`, `moleculus`, and `organisms` so sections stay composable.
- **Data-driven UI:** Content objects live under `src/features/landing/data` (CTA copy, pricing, testimonials) for quick updates.
- **Global layouts:** `src/app/[locale]/home` renders the landing page, sharing layout primitives with the rest of Lucent FE.
- **Translations:** Each copy deck lives in `messages/{locale}.json`, consumed through `next-intl`.

## 🛠️ Tech Stack

| Layer     | Tools                                                             |
| --------- | ----------------------------------------------------------------- |
| Framework | Next.js 15 (App Router, server components)                        |
| Language  | TypeScript strict mode                                            |
| Styling   | Tailwind CSS v4 + CSS variables                                   |
| UI Kit    | shadcn/ui primitives + custom atoms                               |
| State     | Zustand + React server/use client components where needed         |
| Intl      | `next-intl` routing + locale middleware                           |
| Tooling   | Bun (preferred), ESLint, Prettier, Husky, lint-staged, Commitlint |

## 🚀 Getting Started

1. **Clone & install**
   ```bash
   git clone <repository-url>
   cd lucent-fe
   bun install   # or npm install / pnpm install
   bun install   # or npm install / pnpm install
   ```
2. **Environment setup**
3. **Environment setup**
   ```bash
   cp .env.example .env.local
   ```
4. **Run the dev server**
5. **Run the dev server**
   ```bash
   bun run dev    # http://localhost:3000
   ```
6. **Open the landing page**
   - Default route: `/en/home`
   - Root `/` redirects based on the active locale configuration in `src/i18n/routing.ts`.
     bun run dev # http://localhost:3000
   ```

   ```
7. **Open the landing page**
   - Default route: `/en/home`
   - Root `/` redirects based on the active locale configuration in `src/i18n/routing.ts`.

### Useful scripts

### Useful scripts

```bash
bun run dev            # Start Next.js locally
bun run build          # Create a production build
bun run start          # Serve the production build
bun run lint           # ESLint (TypeScript aware)
bun run format         # Check Prettier
bun run format:fix     # Fix formatting issues
bun run prepare        # Install Husky git hooks
bun run dev            # Start Next.js locally
bun run build          # Create a production build
bun run start          # Serve the production build
bun run lint           # ESLint (TypeScript aware)
bun run format         # Check Prettier
bun run format:fix     # Fix formatting issues
bun run prepare        # Install Husky git hooks
```

## Environment Variables

Copy `.env.example` → `.env.local` and adjust as needed:
Copy `.env.example` → `.env.local` and adjust as needed:

```env
NEXT_PUBLIC_APP_NAME=Lucent
NEXT_PUBLIC_APP_URL=https://lucent.app
NEXT_PUBLIC_API_URL=https://api.lucent.app

NEXT_PUBLIC_APP_URL=https://lucent.app
NEXT_PUBLIC_API_URL=https://api.lucent.app

NEXT_PUBLIC_AUTH_PROVIDER=clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_xxxxx
CLERK_SECRET_KEY=sk_xxxxx

NEXT_PUBLIC_ANALYTICS_ID=G-XXXXXXX
BASE_PATH=           # Optional; use when hosting in a sub-path/CDN
```

- `BASE_PATH` feeds assets such as `siteDetails.siteLogo`.
- Store URLs used in CTA buttons come from `src/features/landing/constants/storeData.ts`.

## 📁 Project Structure

```
lucent-fe/
├── src/
│   ├── app/[locale]/home/page.tsx      # Landing entrypoint
│   ├── features/landing/               # Marketing-specific modules
│   │   ├── atoms/                      # Buttons, cards, layout shells
│   │   ├── moleculus/                  # CTA, pricing column, testimonials list
│   │   ├── organisms/                  # Hero, Benefits, FAQ, Footer, etc.
│   │   ├── data/                       # CTA copy, pricing tiers, testimonials
│   │   └── constants/storeData.ts      # App/Play store links
│   ├── i18n/                           # next-intl routing + helpers
│   ├── components/                     # Shared UI primitives (shadcn)
│   └── messages/                       # Locale JSON strings
├── public/images                       # Landing mockups & illustrations
├── tailwind.config.js                  # Tailwind theme tokens
├── postcss.config.js
├── next.config.ts
├── bun.lock / package-lock.json
└── README.md
```

## 🧩 Content & Localization

- **Copy updates:** Edit `messages/{locale}.json` (e.g., `messages/en.json` under `landing` namespace). Components read via `landingLocalizeStrings`.
- **Static data:** For stats/testimonials/pricing, update objects in `src/features/landing/data`.
- **Store links:** Configure `APP_STORE_URL` and `PLAY_STORE_URL` in `src/features/landing/constants/storeData.ts`.
- **Assets:** Hero and section mockups live in `public/images`. Keep both `.png` and `.webp` variants for best browser support.

## 🚢 Deployment

- Optimized for **Vercel** (zero-config) but also works on Netlify or Docker (see `Dockerfile`).
- Remember to set production env vars (Clerk, analytics, API base) in your hosting dashboard.
- If serving from a custom domain path, set `BASE_PATH` and redeploy so asset URLs resolve correctly.

## 🧪 QA & Tooling

- **Linting:** `bun run lint`
- **Formatting:** `bun run format:fix`
- **E2E smoke tests:** Cypress specs live in `cypress/e2e`. Run with `bunx cypress open`.
- **Git hooks:** Husky runs lint-staged + commitlint to keep commits consistent.

## 📞 Support & License

- Contact: [support@lucent.app](mailto:support@lucent.app)
- License: [MIT](LICENSE)
- Issues/Ideas: open a GitHub issue or reach the Lucent team directly.

---

<div align="center">
  <sub>Built with ❤️ by the Lucent Team</sub>
</div>
