# GRUB-PAE — Environment Variable Setup Guide

**Company:** Tesseract Holdings  
**Last updated:** 2026-06-02  

---

## Quick Start

Run the setup script from the repo root:

```bash
./scripts/setup-env.sh
```

This copies all `.env.example` files to `.env` across every module and prints a checklist of keys that require real values.

---

## Module-by-Module Reference

### 1. API Server (`enatega-multivendor-api-custom/.env`)

This is the most critical `.env` file — all other modules depend on the API being live.

| Variable | Required | Description |
|---|---|---|
| `PORT` | Yes | API server port. Default: `4000` |
| `MONGODB_URI` | Yes | MongoDB Atlas connection string. `REPLACE_WITH_YOUR_MONGODB_URI` |
| `JWT_SECRET` | Yes | Secret for signing JWTs. Use a 64+ char random string. |
| `FIREBASE_PROJECT_ID` | Yes | GRUB-PAE Firebase project ID |
| `FIREBASE_CLIENT_EMAIL` | Yes | Firebase Admin SDK service account email |
| `FIREBASE_PRIVATE_KEY` | Yes | Firebase Admin SDK private key (include `\n` line breaks) |
| `PAYSTACK_PUBLIC_KEY` | Yes | Paystack publishable key. `REPLACE_WITH_YOUR_PAYSTACK_PUBLIC_KEY` |
| `PAYSTACK_SECRET_KEY` | Yes | Paystack secret key. `REPLACE_WITH_YOUR_PAYSTACK_SECRET_KEY` |
| `GOOGLE_MAPS_API_KEY` | Yes | Google Maps Platform API key. `REPLACE_WITH_YOUR_GOOGLE_MAPS_KEY` |
| `TWILIO_ACCOUNT_SID` | Yes | Twilio account SID for SMS OTP. `REPLACE_WITH_YOUR_TWILIO_SID` |
| `TWILIO_AUTH_TOKEN` | Yes | Twilio auth token. `REPLACE_WITH_YOUR_TWILIO_AUTH_TOKEN` |
| `TWILIO_PHONE_NUMBER` | Yes | Twilio sender phone number (e.g. `+12345678901`) |
| `SENDGRID_API_KEY` | Yes | SendGrid API key for transactional email. `REPLACE_WITH_YOUR_SENDGRID_KEY` |
| `SENDGRID_FROM_EMAIL` | Yes | Verified sender email address |
| `CLOUDINARY_UPLOAD_URL` | Yes | Cloudinary upload endpoint. `REPLACE_WITH_YOUR_CLOUDINARY_URL` |
| `CLOUDINARY_API_KEY` | Yes | Cloudinary API key. `REPLACE_WITH_YOUR_CLOUDINARY_API_KEY` |
| `CLOUDINARY_API_SECRET` | Yes | Cloudinary API secret |
| `SENTRY_DSN` | No | Sentry DSN for API error tracking. `REPLACE_WITH_YOUR_SENTRY_DSN` |
| `AMPLITUDE_API_KEY` | No | Amplitude API key for server-side events |
| `NODE_ENV` | Yes | `development` or `production` |

---

### 2. Admin Dashboard (`enatega-multivendor-admin/.env`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | Yes | Full URL of GRUB-PAE API. Dev: `http://localhost:4000/` Prod: `https://api.grubpae.com/` |
| `NEXT_PUBLIC_WS_SERVER_URL` | Yes | WebSocket URL of GRUB-PAE API. Dev: `ws://localhost:4000/` Prod: `wss://api.grubpae.com/` |

---

### 3. Customer Web (`enatega-multivendor-web/.env`)

| Variable | Required | Description |
|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | Yes | Full URL of GRUB-PAE API. Dev: `http://localhost:4000/` Prod: `https://api.grubpae.com/` |
| `NEXT_PUBLIC_WS_SERVER_URL` | Yes | WebSocket URL of GRUB-PAE API. Dev: `ws://localhost:4000/` Prod: `wss://api.grubpae.com/` |

---

### 4. Customer App (`enatega-multivendor-app/environment.js`)

The customer app does **not** use a `.env` file — configuration is in `environment.js` and fetched at runtime from the API via the `getConfiguration` query.

| Variable | Location | Description |
|---|---|---|
| `GRAPHQL_URL` | `environment.js` | GRUB-PAE GraphQL endpoint. Replace `aws-server-v2.enatega.com` |
| `WS_GRAPHQL_URL` | `environment.js` | GRUB-PAE WebSocket endpoint |
| `googleMapsApiKey` | `app.json` (iOS + Android) | GRUB-PAE Google Maps key — set at build time |
| Firebase config | `google-services.json` | GRUB-PAE Firebase project — replace Enatega's file |
| `SENTRY_DSN` | `environment.js` | GRUB-PAE Sentry DSN for customer app |
| EAS Project ID | `app.json` | GRUB-PAE EAS project — replace Enatega's |

Runtime values (fetched from API `getConfiguration`):
- `GOOGLE_MAPS_KEY` (served via Configuration)
- `AMPLITUDE_API_KEY` (served via Configuration)
- Google OAuth client IDs (served via Configuration)

---

### 5. Rider App (`enatega-multivendor-rider/environment.ts`)

Same pattern as customer app.

| Variable | Location | Description |
|---|---|---|
| `GRAPHQL_URL` | `environment.ts` | GRUB-PAE GraphQL endpoint |
| `WS_GRAPHQL_URL` | `environment.ts` | GRUB-PAE WebSocket endpoint |
| `GOOGLE_MAPS_KEY` | `environment.ts` (from ConfigurationContext) | Fetched from API at runtime |
| `googleMapsApiKey` | `app.json` (iOS + Android) | GRUB-PAE Google Maps key — set at build time |
| Firebase config | `google-services.json` | GRUB-PAE Firebase project |
| `SENTRY_DSN` | `environment.ts` | GRUB-PAE Sentry DSN for rider app |

---

### 6. Store App (`enatega-multivendor-store/environment.js`)

| Variable | Location | Description |
|---|---|---|
| `GRAPHQL_URL` | `environment.js` | GRUB-PAE GraphQL endpoint |
| `WS_GRAPHQL_URL` | `environment.js` | GRUB-PAE WebSocket endpoint |
| Firebase config | `google-services.json` | GRUB-PAE Firebase project |

---

## Configuration Object (Runtime — Managed via Admin Dashboard)

Many values are stored in MongoDB and served to all frontends via the `getConfiguration` GraphQL query. After deploying the API, these are set through the admin dashboard under **Configuration**.

| Config Field | Description | Must Set Before Go-Live |
|---|---|---|
| `googleApiKey` | Google Maps API key served to all apps | ✅ |
| `firebaseKey` + Firebase fields | Firebase Web SDK config | ✅ |
| `vapidKey` | Firebase Web Push VAPID key | ✅ |
| `currency` | Default: `GHS` | ✅ |
| `currencySymbol` | Default: `₵` | ✅ |
| `deliveryRate` | Base delivery rate in GHS | ✅ |
| `webAmplitudeApiKey` | Amplitude key for web app | ✅ |
| `appAmplitudeApiKey` | Amplitude key for mobile app | ✅ |
| `customerAppSentryUrl` | Sentry DSN for customer app | ✅ |
| `riderAppSentryUrl` | Sentry DSN for rider app | ✅ |
| `restaurantAppSentryUrl` | Sentry DSN for store app | ✅ |
| `dashboardSentryUrl` | Sentry DSN for admin dashboard | ✅ |
| `webSentryUrl` | Sentry DSN for web app | ✅ |
| `cloudinaryUploadUrl` | Cloudinary upload endpoint | ✅ |
| `cloudinaryApiKey` | Cloudinary API key | ✅ |
| `sendGridApiKey` | SendGrid API key | ✅ |
| `twilioAccountSid` | Twilio SID | ✅ |
| `twilioAuthToken` | Twilio auth token | ✅ |
| `twilioPhoneNumber` | Twilio sender number | ✅ |
| `androidClientID` | Google OAuth Android client ID | ✅ |
| `iOSClientID` | Google OAuth iOS client ID | ✅ |
| `webClientID` | Google OAuth web client ID | ✅ |
| `testOtp` | OTP value for testing (e.g. `1234`) | Dev only |
| `skipEmailVerification` | Skip email OTP for dev/test | Dev only |
| `skipMobileVerification` | Skip SMS OTP for dev/test | Dev only |

---

## Internationalisation

### Admin (`enatega-multivendor-admin`)
- Library: `next-intl`
- Translation files: `enatega-multivendor-admin/messages/` (check for `en.json`)
- Primary language: English (`en`)

### Customer Web (`enatega-multivendor-web`)
- Library: `next-intl`
- Translation files: `enatega-multivendor-web/messages/`
- Primary language: English (`en`)
- Planned: Twi (`tw`) — strings marked TODO for translation

### Customer App (`enatega-multivendor-app`)
- Library: `i18next`
- Config file: `enatega-multivendor-app/i18next.js`
- Translation files: look for `locales/` or `translations/` directories
- Primary language: English (`en`)
- Planned: Twi (`tw`) — Phase 4

### Rider App (`enatega-multivendor-rider`)
- Library: `expo-localization` (Expo built-in)
- Primary language: English (`en`)

### Store App (`enatega-multivendor-store`)
- Library: `expo-localization` + `expo-localization`
- Primary language: English (`en`)

---

## Secrets Management Rules

1. **Never commit real credentials.** All `.env` files are in `.gitignore`.
2. All `google-services.json` files must contain GRUB-PAE's Firebase project — never Enatega's.
3. All `app.json` Google Maps API keys must be GRUB-PAE's keys — never Enatega's.
4. Production secrets are managed via the hosting provider's secrets manager (e.g. Railway environment variables, AWS Secrets Manager, or equivalent).
5. The Paystack secret key (`PAYSTACK_SECRET_KEY`) must never appear in any frontend code or be served via `getConfiguration`.
