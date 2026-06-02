# GRUB-PAE — Monorepo Audit Report

**Project:** GRUB-PAE (forked from enatega/food-delivery-multivendor)  
**Company:** Tesseract Holdings  
**Audit Date:** 2026-06-02  
**Audited By:** Senior Engineer, Phase 1  

---

## 1. Repository Structure

The monorepo contains **5 frontend modules**. There is **no API server** in the open-source repo — it is proprietary and must be built from scratch in Phase 3.

| Module | Directory | Framework | Language | Role | Dev Port |
|---|---|---|---|---|---|
| Admin Dashboard | `enatega-multivendor-admin` | Next.js 14 | TypeScript | Super-admin and vendor management | 3001 |
| Customer App | `enatega-multivendor-app` | React Native (Expo SDK 51) | JavaScript | Customer-facing mobile app | — (Expo) |
| Rider App | `enatega-multivendor-rider` | React Native (Expo, expo-router) | TypeScript | Rider/driver app | — (Expo) |
| Store App | `enatega-multivendor-store` | React Native (Expo, expo-router) | TypeScript | Restaurant/vendor management | — (Expo) |
| Customer Web | `enatega-multivendor-web` | Next.js 14 | TypeScript | Customer-facing web app | 3000 |

> **Note:** The playbook referred to `enatega-multivendor-restaurant`. The actual directory is `enatega-multivendor-store`. All future references should use `enatega-multivendor-store`.

---

## 2. Module Detail

### 2.1 enatega-multivendor-admin (Next.js Admin Dashboard)

- **Package name:** `enatega-frontend`
- **Version:** 0.1.0
- **Key dependencies:** `@apollo/client`, `next`, `primereact`, `primeicons`, `next-intl`, `next-themes`, `firebase`, `formik`, `chart.js`, `@react-google-maps/api`, `graphql-ws`, `date-fns`
- **Backend connection:** Apollo Client via `NEXT_PUBLIC_SERVER_URL` env var (`.env.example` → `http://localhost:8001/`). WebSocket via `NEXT_PUBLIC_WS_SERVER_URL`.
- **Apollo setup:** `lib/hooks/useSetApollo.tsx` — reads `SERVER_URL` and `WS_SERVER_URL` from `useConfiguration()` context hook, then dynamically constructs HTTP and WebSocket links.
- **Auth token:** Stored in `localStorage` under `user-{APP_NAME}`. Sent as `Authorization: Bearer <token>` header.
- **Special header:** `bop-auth` (metrics token via `MetricsGeneral` mutation + nonce system).

### 2.2 enatega-multivendor-app (Customer Mobile App)

- **Package name:** `enatega-full-app`
- **Version:** 5.0.0 (app store version 1.1.18)
- **Key dependencies:** `@apollo/client`, `expo`, `@sentry/react-native`, `@amplitude/analytics-react-native`, `@microsoft/react-native-clarity`, `@react-native-google-signin/google-signin`, `@react-navigation/*`, `expo-updates`, `react-native-flash-message`
- **Backend connection:** `src/apollo/index.js` reads `GRAPHQL_URL` and `WS_GRAPHQL_URL` from `environment.js`. **Both are hardcoded to `https://aws-server-v2.enatega.com/graphql`** across all Expo channels (production, staging, development).
- **Auth token:** Stored in `AsyncStorage` under key `token`.
- **Special headers:** `bop-auth`, `nonce`, `user-agent: EnategaApp/{platform}`, `accept-language`, `x-platform`.

### 2.3 enatega-multivendor-rider (Rider App)

- **Package name:** `mobile-architecture`
- **Version:** 1.0.0 (app store version 1.1.77)
- **Key dependencies:** `@apollo/client`, `expo`, `expo-router`, `@sentry/react-native`, `@cloudinary/url-gen`, `@gorhom/bottom-sheet`, `@shopify/flash-list`, `expo-audio`, `expo-av`
- **Backend connection:** `environment.ts` — hardcoded to `https://aws-server-v2.enatega.com/graphql` for both `__DEV__` and production. Apollo setup in `lib/apollo/index.ts`.
- **Auth token:** Stored in `AsyncStorage` under `RIDER_TOKEN` constant.
- **Special headers:** `bop-auth`, `nonce`, `x-platform`, `accept-language`, `user-agent: Yalla-Rider-App/{platform}`.

### 2.4 enatega-multivendor-store (Restaurant/Vendor App)

- **Package name:** `enatega-store-app`
- **Version:** 1.0.0 (app store version 1.0.75)
- **Key dependencies:** `@apollo/client`, `expo`, `expo-router`, `expo-secure-store`, `@gorhom/bottom-sheet`, Bluetooth printer support
- **Backend connection:** `environment.js` — hardcoded to `https://aws-server-v2.enatega.com/graphql`. Apollo setup in `lib/apollo/index.ts`.
- **Auth token:** Stored in `expo-secure-store` under `STORE_TOKEN` constant.
- **Special headers:** `bop-auth`, `nonce`, `x-platform`.

### 2.5 enatega-multivendor-web (Customer Web App)

- **Package name:** `enatega-frontend`
- **Version:** 0.1.0
- **Key dependencies:** `@apollo/client`, `next`, `firebase`, `formik`, `framer-motion`, `lottie-react`, `@react-google-maps/api`, `@react-oauth/google`, `@emailjs/browser`, `graphql-ws`, `next-intl`
- **Backend connection:** Apollo Client via `NEXT_PUBLIC_SERVER_URL` (`.env.example` → `http://localhost:8001/`). WebSocket via `NEXT_PUBLIC_WS_SERVER_URL`. Setup in `lib/hooks/useSetApollo.tsx`.
- **Auth token:** Same pattern as admin — `localStorage`.

---

## 3. Environment Variable Audit

### 3.1 Admin (`enatega-multivendor-admin`)

| Variable | Source File | Current Value | Action Required |
|---|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | `.env.example` | `http://localhost:8001/` | Replace with GRUB-PAE API URL |
| `NEXT_PUBLIC_WS_SERVER_URL` | `.env.example` | `ws://localhost:8001/` | Replace with GRUB-PAE WS URL |

`.gitignore` status: ✅ `.env` and `.env*.local` are excluded.

### 3.2 Customer App (`enatega-multivendor-app`)

| Variable | Source File | Current Value | Action Required |
|---|---|---|---|
| `GRAPHQL_URL` | `environment.js` | `https://aws-server-v2.enatega.com/graphql` | Replace with GRUB-PAE API URL |
| `WS_GRAPHQL_URL` | `environment.js` | `wss://aws-server-v2.enatega.com/graphql` | Replace with GRUB-PAE WS URL |
| `googleMapsApiKey` (iOS) | `app.json` | `AIzaSyCcm7_Wd7uvmC9YnYLu2JHGWPt6z1MaL1E` ⚠️ LIVE KEY | Replace with GRUB-PAE Google Maps key |
| `googleMaps.apiKey` (Android) | `app.json` | `AIzaSyCcm7_Wd7uvmC9YnYLu2JHGWPt6z1MaL1E` ⚠️ LIVE KEY | Replace with GRUB-PAE Google Maps key |
| Firebase config | `google-services.json` | Enatega's Firebase project `enatega-multivendor` ⚠️ | Replace with GRUB-PAE Firebase project |
| Sentry DSN | `environment.js` | `https://4213c02977911e1b75898c93cc5517fb@...` ⚠️ | Replace with GRUB-PAE Sentry DSN |
| EAS Project ID | `app.json` | `331d4e5b-b12a-434a-92ec-d6d283dc0e46` | Replace with GRUB-PAE EAS project |
| Expo owner | `app.json` | `ninjas_code` | Replace with Tesseract Holdings Expo account |
| Bundle ID (iOS) | `app.json` | `com.enatega.multivendor` | Replace with `com.tesseract.grubpae` |
| Package (Android) | `app.json` | `com.enatega.multivendor` | Replace with `com.tesseract.grubpae` |

`.gitignore` status: ⚠️ **NO .gitignore exists** — `google-services.json` with live Firebase API key is currently tracked by git.

### 3.3 Rider App (`enatega-multivendor-rider`)

| Variable | Source File | Current Value | Action Required |
|---|---|---|---|
| `GRAPHQL_URL` | `environment.ts` | `https://aws-server-v2.enatega.com/graphql` | Replace with GRUB-PAE API URL |
| `WS_GRAPHQL_URL` | `environment.ts` | `wss://aws-server-v2.enatega.com/graphql` | Replace with GRUB-PAE WS URL |
| `GOOGLE_MAPS_KEY` | `environment.ts` (from ConfigurationContext) | Fetched from backend at runtime | Replace via Configuration model seed |
| `googleMapsApiKey` (iOS) | `app.json` | `AIzaSyCcm7_Wd7uvmC9YnYLu2JHGWPt6z1MaL1E` ⚠️ LIVE KEY | Replace with GRUB-PAE Google Maps key |
| `googleMaps.apiKey` (Android) | `app.json` | `AIzaSyCcm7_Wd7uvmC9YnYLu2JHGWPt6z1MaL1E` ⚠️ LIVE KEY | Replace with GRUB-PAE Google Maps key |
| Firebase config | `google-services.json` | Enatega's Firebase project ⚠️ | Replace with GRUB-PAE Firebase project |
| Sentry DSN | `environment.ts` | `https://e963731ba0f84e5d823a2bbe2968ea4d@...` ⚠️ | Replace with GRUB-PAE Sentry DSN |
| EAS Project ID | `app.json` | `9144a7fc-b205-464a-8fb6-64eb66fc8743` | Replace with GRUB-PAE EAS project |
| Bundle ID (iOS) | `app.json` | `com.enatega.multirider` | Replace with `com.tesseract.grubpae.rider` |
| Package (Android) | `app.json` | `com.enatega.multirider` | Replace with `com.tesseract.grubpae.rider` |

`.gitignore` status: ⚠️ **NO .gitignore exists** — `google-services.json` with live Firebase API key is tracked by git.

### 3.4 Store App (`enatega-multivendor-store`)

| Variable | Source File | Current Value | Action Required |
|---|---|---|---|
| `GRAPHQL_URL` | `environment.js` | `https://aws-server-v2.enatega.com/graphql` | Replace with GRUB-PAE API URL |
| `WS_GRAPHQL_URL` | `environment.js` | `wss://aws-server-v2.enatega.com/graphql` | Replace with GRUB-PAE WS URL |
| Firebase config | `google-services.json` | Enatega's Firebase project ⚠️ | Replace with GRUB-PAE Firebase project |
| EAS Project ID | `app.json` | `6a94161f-f21b-4ad9-8a04-c95b54ef0116` | Replace with GRUB-PAE EAS project |
| Bundle ID (iOS) | `app.json` | `multivendor.enatega.restaurant` | Replace with `com.tesseract.grubpae.store` |
| Package (Android) | `app.json` | `multivendor.enatega.restaurant` | Replace with `com.tesseract.grubpae.store` |

`.gitignore` status: ✅ `.env` and `.env*.local` are excluded (no `.env` files used in this module anyway).

### 3.5 Web (`enatega-multivendor-web`)

| Variable | Source File | Current Value | Action Required |
|---|---|---|---|
| `NEXT_PUBLIC_SERVER_URL` | `.env.example` | `http://localhost:8001/` | Replace with GRUB-PAE API URL |
| `NEXT_PUBLIC_WS_SERVER_URL` | `.env.example` | `ws://localhost:8001/` | Replace with GRUB-PAE WS URL |

`.gitignore` status: ✅ `.env` and `.env*.local` are excluded.

---

## 4. Configuration Pattern — Critical Architecture Note

The backend serves a `Configuration` object to all frontends via the `getConfiguration` GraphQL query. This object acts as a **runtime key store** — the frontend fetches it on startup and uses it to configure itself. This is why many API keys are not hardcoded in `.env` files but instead fetched dynamically.

The `Configuration` type includes all of the following, managed via the admin dashboard:

| Field | Purpose |
|---|---|
| `googleApiKey` | Google Maps API key (served to all apps at runtime) |
| `firebaseKey`, `authDomain`, `projectId`, `storageBucket`, `msgSenderId`, `appId`, `measurementId` | Firebase Web SDK config |
| `vapidKey` | Firebase Web Push VAPID key |
| `publishableKey`, `secretKey` | **Stripe** — must be replaced with Paystack keys |
| `clientId`, `clientSecret`, `sandbox` | **PayPal** — must be removed entirely |
| `twilioAccountSid`, `twilioAuthToken`, `twilioPhoneNumber`, `twilioWhatsAppNumber` | Twilio SMS/OTP |
| `sendGridApiKey`, `sendGridEmail`, `sendGridEmailName` | SendGrid email |
| `cloudinaryUploadUrl`, `cloudinaryApiKey` | Cloudinary media uploads |
| `webAmplitudeApiKey`, `appAmplitudeApiKey` | Amplitude analytics |
| `dashboardSentryUrl`, `webSentryUrl`, `apiSentryUrl`, `customerAppSentryUrl`, `restaurantAppSentryUrl`, `riderAppSentryUrl` | Sentry DSNs (6 separate projects) |
| `iOSClientID`, `androidClientID`, `expoClientID`, `webClientID` | Google OAuth client IDs |
| `currency`, `currencySymbol` | Default currency |
| `deliveryRate` | Default delivery fee |
| `costType` | Delivery cost calculation type |
| `skipEmailVerification`, `skipMobileVerification` | OTP skip flags for testing |
| `testOtp` | Test OTP value |
| `isPaidVersion` | Feature flag for paid features |

**Phase 3 implication:** The custom API must seed the `Configuration` collection with GRUB-PAE's own keys on first startup. The admin panel then manages updates going forward.

---

## 5. Backend Dependency Map

The API server is **proprietary and not included in this repo**. Based on analysis of all GraphQL operations across the 5 frontend modules, the custom API must implement the following:

### 5.1 Third-Party Services (Must Be Integrated in Custom API)

| Service | Purpose | Enatega Integration | GRUB-PAE Action |
|---|---|---|---|
| **MongoDB Atlas** | Primary database | Mongoose ORM | Keep — same schema |
| **Firebase Admin SDK** | Auth token verification (all user types) | Firebase Admin | Keep — verify JWT tokens |
| **Firebase Cloud Messaging** | Push notifications | FCM via Admin SDK | Keep |
| **Google Maps Platform** | Geocoding, Directions, Places autocomplete | `@googlemaps/google-maps-services-js` | Keep — Ghana coverage confirmed |
| **Stripe** | Card payments | Full integration | **Remove entirely — replace with Paystack** |
| **PayPal** | PayPal payments | Full integration | **Remove entirely** |
| **Twilio** | SMS OTP verification | `twilio` npm package | Keep for OTP delivery |
| **SendGrid** | Transactional email | `@sendgrid/mail` | Keep (or swap for Nodemailer) |
| **Cloudinary** | Image/media storage (restaurant photos, food images) | REST API | Keep |
| **Amplitude** | Analytics (web + mobile) | SDK | Keep |
| **Sentry** | Error tracking (6 separate DSNs) | `@sentry/node` | Keep — replace DSNs |
| **Microsoft Clarity** | Session recording (customer app only) | SDK | Optional |

### 5.2 MongoDB Models Required

Derived from all GraphQL queries and mutations across all frontend modules:

| Model | Key Fields |
|---|---|
| `User` | `_id`, `name`, `email`, `phone`, `password`, `notificationToken`, `addresses`, `favourite`, `isActive`, `appleId`, `isPhoneVerified`, `isEmailVerified` |
| `Rider` | `_id`, `name`, `email`, `phone`, `password`, `isAvailable`, `location`, `zone`, `notificationToken`, `earnings`, `vehicleType`, `licenseNumber` |
| `Restaurant` | `_id`, `name`, `image`, `address`, `location`, `categories`, `rating`, `isAvailable`, `openingTimes`, `zone`, `owner`, `commissionRate`, `tax`, `shopType`, `cuisines`, `isActive` |
| `Category` | `_id`, `title`, `description`, `image`, `foods`, `restaurant` |
| `SubCategory` | `_id`, `title`, `parentCategoryId`, `restaurant` |
| `Food` | `_id`, `title`, `description`, `image`, `variations`, `category`, `restaurant`, `isAvailable` |
| `Addon` (Option) | `_id`, `title`, `description`, `quantityMinimum`, `quantityMaximum`, `options` |
| `Order` | `_id`, `restaurant`, `rider`, `user`, `items`, `paymentMethod`, `paymentStatus`, `orderStatus`, `totalAmount`, `deliveryCharges`, `tipping`, `taxationAmount`, `address`, `deliveryAddress`, `coupon`, `createdAt` |
| `Address` | `_id`, `deliveryAddress`, `latitude`, `longitude`, `label`, `selected`, `user` |
| `Zone` | `_id`, `title`, `description`, `coordinates`, `isActive` |
| `Coupon` | `_id`, `title`, `discount`, `enabled`, `restaurant` |
| `Review` | `_id`, `order`, `restaurant`, `user`, `rating`, `description`, `createdAt` |
| `Configuration` | All fields from Section 4 above |
| `Banner` | `_id`, `title`, `description`, `action`, `file`, `screen` |
| `Cuisine` | `_id`, `name`, `image`, `shopType` |
| `ShopType` | `_id`, `name`, `image`, `isActive` |
| `Notification` | `_id`, `title`, `body`, `data`, `read`, `user`, `createdAt` |
| `SupportTicket` | `_id`, `subject`, `description`, `status`, `user`, `email`, `createdAt` |
| `Tipping` | `_id`, `tipVariations`, `enabled` |
| `Taxation` | `_id`, `taxationCharges`, `enabled` |
| `WithdrawRequest` | `_id`, `rider`, `requestAmount`, `requestTime`, `status` |
| `ChatMessage` | `_id`, `order`, `user`, `rider`, `message`, `createdAt` |
| `AppVersion` | `_id`, `platform`, `version`, `mandatory` |

### 5.3 GraphQL Operations Required (by module)

#### Customer App (`enatega-multivendor-app`)

**Queries (29):** User, GetReviewsByRestaurant, profile, cities (GetCountryByIso), order, myOrders, getConfiguration, restaurantList (Restaurants), restaurantListPreview, topRatedVendors, restaurant, getCuisines, rider, getTaxation (Taxes), getTipping (Tips), FavouriteRestaurant (UserFavourite), fetchCategoryDetailsByStore, popularFoodItems, chat (Chat), recentOrderRestaurants, mostOrderedRestaurants, relatedItems, popularItems, getBanners, getZones, versions, GetVersions, GetSubCategories, GetSubCategoriesByParentId, FetchAllShopTypes, NearByRestaurantsCuisines

**Mutations (26):** SendChatMessage, PlaceOrder, PushToken, ForgotPassword, ResetPassword, Coupon (applyCoupon), DeleteAddress, DeleteBulkAddresses, CreateAddress, EditAddress, ChangePassword, SelectAddress, ReviewOrder, AddFavourite, EmailExist, PhoneExist, SendOtpToEmail, SendOtpToPhoneNumber, Deactivate, Login, CreateUser, UpdateUser, UpdateNotificationStatus, CancelOrder, CreateActivity, VerifyOtp

**Subscriptions (4):** SubscriptionOrder, SubscriptionRiderLocation, OrderStatusChanged, SubscriptionNewMessage

#### Rider App (`enatega-multivendor-rider`)

**Mutation files:** activity, address, authentication, chat, metrics, notification, order, push-token, restaurant, rider, user, withdraw-request

**Query files:** banner, category, chat, cities, coupon, cuisine, earnings, food, order (x2 variants), configuration, restaurant (x3 variants), rider, sub-category, taxation, tipping, user, vendor, version, zone

**Subscriptions:** `lib/apollo/subscriptions.ts`

#### Store App (`enatega-multivendor-store`)

**Mutation files:** activity, address, authentication, chat, notification, order, push-token, restaurant, rider, user, withdraw-request, work-schedule

**Query files:** configuration, earnings, orders, store, version

**Subscriptions:** `lib/apollo/subscriptions.ts`

#### Admin Dashboard (`enatega-multivendor-admin`)

**Mutation domains:** addons, app-versions, authentication, banners, category, commission-rate, configuration, coupons, cuisines, dispatch, food, metrics, notifications, options, restaurant, shop-type, staff, sub-category, supportTickets, taxations, tippings, upload, user, vendor, withdraw-requests, zone

**Query domains:** addon, app-versions, audit, category, configuration, coupons, cuisines, dashboard, earnings, food, notifications, options, orders, restaurants, riders, shop-types, staff, sub-categories, supportTickets, tippings, token, transaction-history, user, vendors, withdraw-requests, zone

**Subscriptions:** order-subscription, rider-subscription

#### Customer Web (`enatega-multivendor-web`)

**Mutation domains:** Notification, SupportTickets, addresses, auth, chatWithRider, coupon, metrics, orders, restaurant

**Query domains:** Countries, SupportTickets, banner, config, cuisines, order-tracking, orders, profile, restaurants, rider, shop-type, tipping, vendors, zone

**Subscriptions:** orders, riderLocation

---

## 6. Security Findings

### CRITICAL — Action Before Phase 2

| # | Finding | File(s) | Risk | Action |
|---|---|---|---|---|
| 1 | Enatega's live Google Maps API key committed to repo | `enatega-multivendor-app/app.json`, `enatega-multivendor-rider/app.json` | API quota abuse/billing on Enatega's account | Replace with placeholder immediately. Tesseract must provision its own key. |
| 2 | Enatega's Firebase API key and project config committed to repo | `*/google-services.json` (3 files) | Using Enatega's Firebase project for auth | Replace all 3 files with GRUB-PAE Firebase project config |
| 3 | Enatega's Sentry DSNs hardcoded in `environment.js/ts` | All 3 mobile `environment.*` files | Sending error data to Enatega's Sentry account | Replace with GRUB-PAE Sentry DSNs |
| 4 | No `.gitignore` in customer app or rider app | `enatega-multivendor-app/`, `enatega-multivendor-rider/` | Any future `.env` or secrets file would be committed | Create `.gitignore` for both modules in Phase 2 |
| 5 | EAS project IDs point to Enatega's Expo account | All 3 `app.json` files | OTA updates would push to Enatega's account | Replace with GRUB-PAE EAS project IDs |
| 6 | Bundle IDs and package names are Enatega-branded | All 3 `app.json` files | Branding, potential App Store conflicts | Update to `com.tesseract.grubpae.*` in Phase 4 |

### HIGH — Action in Phase 3

| # | Finding | Risk | Action |
|---|---|---|---|
| 7 | Configuration model stores Stripe and PayPal keys | Payment data routed through wrong provider for Ghana market | Remove `publishableKey`, `secretKey`, `clientId`, `clientSecret`, `sandbox` fields; add Paystack equivalents |
| 8 | Twilio credentials in Configuration | Twilio may have poor Ghana coverage | Evaluate — Twilio does support Ghana (+233) but confirm pricing |

---

## 7. Dependency Notes

### Microsoft Clarity (`@microsoft/react-native-clarity`)
Present in customer app (`App.js`). Hardcoded session ID `mcdyi6urgs`. This is Enatega's Clarity project. Remove or replace with GRUB-PAE's own Clarity/analytics project.

### `bop-auth` / `MetricsGeneral` Mutation
A non-standard security mechanism present in admin, web, customer app, and rider. The frontend obtains a short-lived "public token" by calling the `MetricsGeneral` mutation with a nonce. This token is sent as `bop-auth` header on all requests. The custom API must implement this mechanism or the frontends will fail to authenticate even before login. Document this clearly in Phase 3.

### i18n
- Admin: `next-intl` (Next.js)
- Web: `next-intl` (Next.js)
- Customer App: `i18next` (imported as `./i18next` in `App.js`)
- Rider/Store: `expo-localization` plugin

---

## 8. Phase Readiness Assessment

| Phase | Status | Blockers |
|---|---|---|
| Phase 1 — Audit | ✅ Complete | None |
| Phase 2 — Init | Ready | Need GRUB-PAE GitHub remote URL, GRUB-PAE Firebase project, GRUB-PAE EAS account |
| Phase 3 — Custom API | Ready to scaffold | Need: Paystack keys, MongoDB Atlas URI, GRUB-PAE Firebase Admin credentials, GRUB-PAE Google Maps key |
| Phase 4 — Localization | Ready | Depends on Phase 3 complete, need final bundle IDs confirmed |
| Phase 5 — DevOps | Ready | Depends on Phase 2 |

---

## 9. Files Requiring Changes in Phase 2

| File | Module | Change Type |
|---|---|---|
| `environment.js` | app | Replace hardcoded `aws-server-v2.enatega.com` URL |
| `environment.ts` | rider | Replace hardcoded `aws-server-v2.enatega.com` URL |
| `environment.js` | store | Replace hardcoded `aws-server-v2.enatega.com` URL |
| `app.json` | app | Google Maps key, EAS project ID, Expo owner, bundle IDs |
| `app.json` | rider | Google Maps key, EAS project ID, bundle IDs |
| `app.json` | store | EAS project ID, bundle IDs |
| `google-services.json` | app, rider, store | Replace all 3 with GRUB-PAE Firebase project |
| `.env.example` | admin, web | Update URL placeholders |
| Create `.gitignore` | app, rider | Add `.env`, `google-services.json`, `*.p8`, `*.p12` |

---

*Report generated during Phase 1 audit. Last updated: 2026-06-02.*

---

## 10. Dependency Security Audit (Phase 2)

Audit run: `npm audit --audit-level=high` across all 5 modules. Date: 2026-06-02.  
**No auto-fixes applied** — review required before remediation.

### Summary

| Module | Critical | High | Moderate | Low | Total |
|---|---|---|---|---|---|
| enatega-multivendor-admin | 3 | 12 | 12 | 1 | 28 |
| enatega-multivendor-app | **17** | 14 | 38 | 0 | 69 |
| enatega-multivendor-rider | 1 | 12 | 29 | 3 | 45 |
| enatega-multivendor-store | 1 | 11 | 24 | 2 | 38 |
| enatega-multivendor-web | 2 | **21** | 14 | 3 | 40 |
| **TOTAL** | **24** | **70** | **117** | **9** | **220** |

### Notable Vulnerabilities (recurring across modules)

| Package | Severity | CVE / Advisory | Modules Affected | Notes |
|---|---|---|---|---|
| `yaml` 2.0.0–2.8.2 | Moderate | [GHSA-48c2-rrv3-qjmp](https://github.com/advisories/GHSA-48c2-rrv3-qjmp) | All 5 | Stack overflow via deeply nested YAML. `npm audit fix` resolves. |
| `ws` 8.0.0–8.20.0 | Moderate | [GHSA-58qx-3vcg-4xpx](https://github.com/advisories/GHSA-58qx-3vcg-4xpx) | rider, store | Uninitialized memory disclosure. `npm audit fix` resolves. |
| `webpack` 5.49.0–5.104.0 | High | [GHSA-8fgc-7cc6-rx7x](https://github.com/advisories/GHSA-8fgc-7cc6-rx7x), [GHSA-38r7-794h-5758](https://github.com/advisories/GHSA-38r7-794h-5758) | web | SSRF via `buildHttp` allowedUris bypass. `npm audit fix` resolves. |
| `uuid` <11.1.1 | Moderate | [GHSA-w5hq-g745-h8pq](https://github.com/advisories/GHSA-w5hq-g745-h8pq) | admin | Missing buffer bounds check. `npm audit fix` resolves. |
| `yargs-parser` 6.0.0–13.1.1 | Moderate | [GHSA-p9pc-299p-vxgp](https://github.com/advisories/GHSA-p9pc-299p-vxgp) | app | Prototype pollution. Fix requires `--force` (breaking change). |

### Customer App Note
The customer app (`enatega-multivendor-app`) has **17 critical** vulnerabilities — the highest count. This is expected for a React Native/Expo project of this age; most will be in transitive dev dependencies (bundlers, CLI tools) rather than runtime code. The CI pipeline (Phase 5) will gate on `--audit-level=critical` to prevent regressions.

### Recommended Remediation Order
1. `npm audit fix` (non-breaking) across all 5 modules — resolves `yaml`, `ws`, `uuid`, `webpack`
2. Review breaking-change fixes (`--force`) per module individually — do not bulk-apply
3. Pin resolved versions in each module's `package.json` after verification
4. Re-run audit post-fix and update this section

**Do not run `npm audit fix --force` without reviewing the breaking changes per module.**
