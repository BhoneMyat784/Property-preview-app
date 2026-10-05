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

## Appearance

Use the moon/sun button in the header to switch between light and dark mode. The app initially follows your system appearance, including changes while it is open. A manual choice is saved in this browser and synchronized across open tabs. The toggle supports keyboard activation and Burmese/English labels. Theme preferences stay on the device and require no account.
