# Property Portal Web App

Independent web project for Property Portal. It contains the Expo Router screens, React Native Web components, shared client contracts, bilingual UI, and browser workflows.

## Setup

```bash
npm ci
npm run dev
```

Open [http://localhost:8081](http://localhost:8081). Configure `EXPO_PUBLIC_API_URL` to point at the API project when it is not running on `http://localhost:3001`.

## Routes

- `/` — home search and featured listings.
- `/properties` and `/properties/:id` — public search and details.
- `/auth` — account access and recovery.
- `/favorites` — saved listings.
- `/dashboard` — seller listing management.
- `/admin` — moderation and location administration.

## Checks

```bash
npm run typecheck
npm run build
npm run test:e2e
```

Web filters persist in the URL, public pages support Burmese and English, and screens use the API boundary rather than server internals.
