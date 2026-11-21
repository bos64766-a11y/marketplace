# SNABTASH Agent Instructions & Architecture Guide

Welcome to SNABTASH (snab.uz), a B2B wholesale marketplace platform.

## Architecture Overview

- **Backend:** Django 5.1 REST Framework (`backend/`)
  - `apps.products`: Category & Product catalog, multilingual fields (uz, ru).
  - `apps.orders`: Sequential B2B order IDs, atomic checkout, customer lookup.
  - `apps.settings_app`: SiteSettings, Banners, ShowcaseSections, Partners, secure file uploads, token authentication.
  - `apps.analytics`: Staff-only revenue, order metrics, and business intelligence.
- **Frontend:** React 19 + TypeScript + Vite + Tailwind CSS (`src/`)
  - `src/context/AppContext.tsx`: Global application state, cart, customer profile, and admin auth.
  - `src/services/api.ts`: API client connecting to Railway backend.
- **Deployment:**
  - Backend: Railway (`marketplace-production-24565a08.up.railway.app`)
  - Frontend: Vercel (`snab.uz`, `snabtash.uz`)

## Quality & Security Guidelines

1. **Permissions:** All mutation endpoints (`POST`, `PUT`, `PATCH`, `DELETE`) require `IsAdminUser`. Public read access uses `IsAdminOrReadOnly`.
2. **Checkout:** Customer orders are placed via `POST /api/orders/` with atomic transactions.
3. **Bundle Efficiency:** Never embed large Base64 images in TypeScript files; use media URLs or optimized WebP assets.
4. **Testing:** Run backend tests with `python manage.py test` and frontend typecheck with `npm run lint`.
