# Project Memory & Operational Notes

- **Live URL:** `https://marketplace-production-24565a08.up.railway.app`
- **Domain:** `https://snab.uz`, `https://snabtash.uz`
- **Database:** PostgreSQL on Railway.
- **Order ID format:** Sequential integer string (starting 1001+) for B2B tracking.
- **Auth:** Django Token Authentication (`/api/auth/login/`), admin actions restricted with `IsAdminUser`.
- **Bundle Target:** Main JS bundle must remain below 500 KB (currently ~420 KB / 119 KB gzip).
