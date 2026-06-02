# GRUB-PAE

**Food delivery platform for Ghana and West Africa**

Built by **Tesseract Holdings** — Beyond Dimensions

---

## What is GRUB-PAE?

GRUB-PAE is a full-stack food delivery platform built for the Ghanaian and West African market. It connects customers, restaurants, and delivery riders through a unified system — supporting card payments and mobile money (MTN, Vodafone Cash, AirtelTigo) via Paystack, with maps defaulting to Accra and phone validation covering the +233 region.

The platform is built on top of the open-source Enatega multivendor frontend (MIT licensed) with a fully custom, Tesseract-owned API backend.

---

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for the full system diagram.

```
Customer Web  ─┐
Admin Panel   ─┼──► GRUB-PAE API (Node.js/GraphQL) ──► MongoDB Atlas
Customer App  ─┤         │
Rider App     ─┤         ├── Firebase (Auth + Push)
Store App     ─┘         ├── Paystack (Payments + Mobile Money)
                         ├── Google Maps (Ghana coverage)
                         └── Twilio / SendGrid / Cloudinary
```

---

## Modules

| Module | Tech | Purpose | Port |
|---|---|---|---|
| `enatega-multivendor-web` | Next.js 14 | Customer web ordering | 3000 |
| `enatega-multivendor-admin` | Next.js 14 | Platform & vendor management | 3001 |
| `enatega-multivendor-api-custom` | Node.js + Apollo Server | GraphQL API + business logic | 4000 |
| `enatega-multivendor-app` | React Native (Expo) | Customer mobile app | Expo |
| `enatega-multivendor-rider` | React Native (Expo) | Rider/driver app | Expo |
| `enatega-multivendor-store` | React Native (Expo) | Restaurant management app | Expo |

---

## Quick Start

### 1. Clone and set up environment

```bash
git clone https://github.com/ekubanDev/GRUB-PAE.git
cd GRUB-PAE
./scripts/setup-env.sh
```

The setup script copies all `.env.example` files and prints a checklist of keys that need real values.

### 2. Fill in required credentials

Open `enatega-multivendor-api-custom/.env` and set at minimum:

```
MONGODB_URI=...
JWT_SECRET=...
FIREBASE_PROJECT_ID=grub-pae
FIREBASE_CLIENT_EMAIL=...
FIREBASE_PRIVATE_KEY=...
PAYSTACK_SECRET_KEY=...
GOOGLE_MAPS_API_KEY=...
```

See [docs/ENV_SETUP.md](docs/ENV_SETUP.md) for the full reference.

### 3. Start the web stack

```bash
docker-compose -f docker-compose.dev.yml up
```

This starts MongoDB, the API, the admin dashboard, and the customer web app.

| Service | URL |
|---|---|
| API (GraphQL) | http://localhost:4000/graphql |
| Admin Dashboard | http://localhost:3001 |
| Customer Web | http://localhost:3000 |
| API Health | http://localhost:4000/health |

### 4. Mobile apps (Expo — run natively, not in Docker)

```bash
# Customer app
cd enatega-multivendor-app && npx expo start

# Rider app
cd enatega-multivendor-rider && npx expo start

# Store/restaurant app
cd enatega-multivendor-store && npx expo start
```

Before building, register your Android apps in the Firebase console (project: `grub-pae`) and download the `google-services.json` for each package:

| App | Package |
|---|---|
| Customer | `com.tesseract.grubpae` |
| Rider | `com.tesseract.grubpae.rider` |
| Store | `com.tesseract.grubpae.store` |

---

## Environment Variables

Full documentation: [docs/ENV_SETUP.md](docs/ENV_SETUP.md)

Summary of critical keys per module:

**API** (`enatega-multivendor-api-custom/.env`): MongoDB URI, Firebase Admin SDK, Paystack secret, Google Maps key, JWT secret, Twilio, SendGrid, Cloudinary.

**Admin & Web** (`.env`): `NEXT_PUBLIC_SERVER_URL`, `NEXT_PUBLIC_WS_SERVER_URL`.

**Mobile apps**: Configured via `environment.js/ts` (server URL) and `app.json` (Google Maps key, EAS project ID).

---

## Key Technical Decisions

| Decision | Choice | Reason |
|---|---|---|
| Backend | Custom Node.js/Apollo (this repo) | Full IP ownership — Enatega's API is proprietary |
| Payments | Paystack | Ghana/West Africa market, supports mobile money |
| Auth | Firebase Auth | Token verification across all 5 frontend modules |
| Database | MongoDB Atlas | West Africa cluster, matches Enatega's schema patterns |
| Maps | Google Maps Platform | Ghana geocoding confirmed |
| Currency | GHS (Ghana Cedis ₵) | Primary deployment market |
| Map default | Accra, Ghana (5.6037, -0.1870) | Primary deployment city |

See [docs/BACKEND_DECISION.md](docs/BACKEND_DECISION.md) for the full API decision rationale.

---

## CI / CD

GitHub Actions runs on every PR to `grubpae-main`:

| Job | What it checks |
|---|---|
| `security-audit` | `npm audit --audit-level=critical` on all 6 modules |
| `build-web` | Next.js production build |
| `build-admin` | Next.js production build |
| `build-api` | `npm ci` + syntax check |
| `lint` | ESLint across all JS/TS |

---

## Contributing

1. Branch off `grubpae-main`
2. Open a PR — CI must pass before merge
3. Never commit credentials — all `.env` files are in `.gitignore`
4. Keep `upstream` remote pointing at `enatega/food-delivery-multivendor` for security patches

---

## License

Frontend modules (MIT) — originally from [enatega/food-delivery-multivendor](https://github.com/enatega/food-delivery-multivendor).  
Custom API (`enatega-multivendor-api-custom`) — proprietary, owned by Tesseract Holdings.

See [THIRD_PARTY_LICENSES.md](THIRD_PARTY_LICENSES.md) for upstream attribution.
