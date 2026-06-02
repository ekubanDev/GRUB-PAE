# GRUB-PAE — Backend Decision

**Decision:** Build a custom API server (`enatega-multivendor-api-custom`)  
**Date:** 2026-06-02  
**Decision maker:** Tesseract Holdings  

---

## Context

The enatega/food-delivery-multivendor repository is partially open source:
- **Frontend (5 modules):** MIT licensed — free to use and modify
- **Backend API:** Proprietary — requires a paid license from Enatega (Ninjas Code)

GRUB-PAE needs a production backend. The options evaluated were:

---

## Option 1 — License Enatega's API (Rejected)

**What it means:** Pay Enatega for a license to use their backend source code or hosted API.

**Pros:**
- Faster time to first working system
- Schema contract already implemented

**Cons:**
- Ongoing licensing cost with no IP ownership
- No control over the codebase — cannot add Ghana-specific features (mobile money, phone validation, Paystack)
- Vendor lock-in: any Enatega API change could break GRUB-PAE frontends
- Cannot audit or harden security
- Enatega's payment system is built around Stripe/PayPal — replacing it would require their cooperation

**Decision:** Rejected.

---

## Option 2 — Build Custom API (Chosen)

**What it means:** Build a Node.js/Apollo Server/MongoDB API that satisfies the exact GraphQL schema contract the 5 frontend modules expect.

**Pros:**
- Full IP ownership under Tesseract Holdings — no recurring licensing fees
- Complete control over schema evolution, features, and performance
- Can integrate Paystack natively as the primary payment provider
- Can add Ghana-specific features (mobile money labels, +233 phone validation, GHS currency) without negotiation
- Can use MongoDB Atlas West Africa region for lower latency
- Security: full audit capability, no undisclosed endpoints

**Cons:**
- Higher upfront engineering effort
- Need to reverse-engineer the full GraphQL schema from frontend queries/mutations (documented in `GRAPHQL_SCHEMA_REQUIRED.graphql`)
- Risk of schema gaps — any operation missed will surface as a runtime error in a frontend module

**Risk mitigation:** The Phase 1 audit documented every GraphQL operation across all 5 modules. The schema contract file (`docs/GRAPHQL_SCHEMA_REQUIRED.graphql`) must be treated as a test spec — the custom API must satisfy every operation before any frontend module is connected.

**Decision:** Chosen. ✅

---

## Tech Stack

| Layer | Technology | Reason |
|---|---|---|
| Runtime | Node.js 20 LTS | Team familiarity, matches frontend JS ecosystem |
| HTTP server | Express.js | Minimal overhead, good middleware ecosystem |
| GraphQL | Apollo Server 4 | Matches Apollo Client on all frontends |
| Subscriptions | graphql-subscriptions + subscriptions-transport-ws | Matches WebSocketLink version used in all 5 frontend modules |
| Database ORM | Mongoose | Schema validation, clean model API |
| Database | MongoDB Atlas | Matches Enatega's schema patterns; West Africa cluster available |
| Auth | Firebase Admin SDK | All frontend modules already use Firebase Auth; no migration needed |
| Payments | Paystack | Ghana/West Africa market; supports mobile money (MTN, Vodafone, AirtelTigo), card, bank transfer |
| Maps | Google Maps Platform | Ghana geocoding coverage confirmed |
| Push | Firebase Cloud Messaging | Integrated with Firebase Auth already |
| SMS/OTP | Twilio | Supports +233 (Ghana) numbers |
| Email | SendGrid (or Nodemailer fallback) | Transactional emails |
| Media | Cloudinary | Image uploads for restaurant/food photos |
| Error tracking | Sentry | Matches existing frontend Sentry calls |
| Secrets | Environment variables + `.env` | Never stored in code |

---

## GraphQL Contract Commitment

The custom API **must not change** the following without a corresponding frontend update:
- Operation names (query/mutation/subscription names)
- Argument names and types
- Return type field names

Adding new fields to existing types is safe (non-breaking). Removing or renaming fields is breaking and requires coordinated frontend changes.

The full required schema is documented in: `docs/GRAPHQL_SCHEMA_REQUIRED.graphql` (generated in Phase 3).
