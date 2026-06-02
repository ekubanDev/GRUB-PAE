# GRUB-PAE — System Architecture

**Company:** Tesseract Holdings  
**Platform:** Food Delivery — Ghana & West Africa  

---

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────────┐
│                        GRUB-PAE Platform                            │
│                      (Tesseract Holdings)                           │
└─────────────────────────────────────────────────────────────────────┘

  ┌──────────────────┐     ┌──────────────────┐
  │  Customer Web    │     │  Admin Dashboard │
  │  (Next.js 14)    │     │  (Next.js 14)    │
  │  Port: 3000      │     │  Port: 3001      │
  └────────┬─────────┘     └────────┬─────────┘
           │                        │
  ┌────────┴─────────┐              │
  │  Customer App    │              │
  │  (Expo / RN)     │              │
  └────────┬─────────┘              │
           │                        │
  ┌────────┴─────────┐              │
  │   Rider App      │              │
  │  (Expo / RN)     │              │
  └────────┬─────────┘              │
           │                        │
  ┌────────┴─────────┐              │
  │   Store App      │              │
  │  (Expo / RN)     │              │
  └────────┬─────────┘              │
           │                        │
           └────────────┬───────────┘
                        │
              GraphQL / WebSocket
                  (Apollo)
                        │
           ┌────────────▼───────────┐
           │    GRUB-PAE API        │
           │  (Node.js + Express    │
           │   + Apollo Server)     │
           │   Port: 4000           │
           └─┬──────────┬──────────┘
             │          │
    ┌────────▼──┐  ┌────▼────────────────────────────────┐
    │  MongoDB  │  │         Third-Party Services         │
    │  Atlas    │  │                                      │
    │           │  │  Firebase Admin  (Auth)              │
    └───────────┘  │  Firebase FCM    (Push)              │
                   │  Paystack        (Payments/MoMo)     │
                   │  Google Maps     (Geocoding/Routes)  │
                   │  Twilio          (SMS OTP)           │
                   │  Cloudinary      (Media Storage)     │
                   │  SendGrid        (Transactional Email)│
                   │  Sentry          (Error Tracking)    │
                   │  Amplitude       (Analytics)         │
                   └──────────────────────────────────────┘
```

---

## Module Roles

| Module | Tech | Role | Audience |
|---|---|---|---|
| `enatega-multivendor-web` | Next.js 14 + TypeScript | Customer-facing web ordering | End customers |
| `enatega-multivendor-admin` | Next.js 14 + TypeScript | Platform management | Super-admins, vendors |
| `enatega-multivendor-app` | React Native (Expo) | Customer mobile ordering | End customers |
| `enatega-multivendor-rider` | React Native (Expo) | Delivery management | Riders/drivers |
| `enatega-multivendor-store` | React Native (Expo) | Restaurant order management | Restaurant operators |
| `enatega-multivendor-api-custom` | Node.js + Apollo Server | GraphQL API + business logic | All above modules |

---

## Data Flow

### Order Placement
```
Customer App/Web
  → PlaceOrder mutation (GraphQL)
  → API validates cart + address
  → Paystack: initializeTransaction
  → Order saved to MongoDB (status: PENDING)
  → FCM push to Restaurant (Store App)
  → Restaurant accepts → status: ACCEPTED
  → FCM push to available Riders
  → Rider accepts → status: ASSIGNED
  → GraphQL Subscription: SubscriptionRiderLocation
  → Customer tracks rider in real-time
  → Rider marks delivered → status: DELIVERED
  → ReviewOrder mutation available to customer
```

### Authentication Flow
```
User registers/logs in
  → Login/CreateUser mutation
  → API verifies Firebase ID token (Firebase Admin SDK)
  → API returns JWT
  → Client stores JWT in AsyncStorage/SecureStore/localStorage
  → All subsequent requests: Authorization: Bearer <JWT>
```

### Configuration Bootstrap
```
App starts
  → getConfiguration query (no auth required)
  → API returns Configuration object from MongoDB
  → Client uses: Google Maps key, Firebase config,
                 Sentry DSN, Amplitude key, etc.
  → Admin dashboard manages Configuration via mutations
```

---

## Real-Time Architecture

GraphQL Subscriptions over WebSocket (subscriptions-transport-ws):

| Subscription | Purpose |
|---|---|
| `SubscriptionOrder` | Customer tracks their order status |
| `SubscriptionRiderLocation` | Customer sees rider position on map |
| `OrderStatusChanged` | Real-time order updates across all apps |
| `SubscriptionNewMessage` | Live chat between customer and rider |
| `subscribeToNewOrders` | Restaurant receives new orders |
| `riderLocation` | Admin tracks all active riders |

---

## Infrastructure (Target: Phase 5+)

```
                    ┌──────────────┐
                    │  Cloudflare  │
                    │  (CDN + DNS) │
                    └──────┬───────┘
                           │
               ┌───────────▼────────────┐
               │     Load Balancer      │
               └───────────┬────────────┘
                           │
         ┌─────────────────▼──────────────────┐
         │         VPS / Cloud Host            │
         │  ┌──────────────────────────────┐  │
         │  │   Docker / docker-compose    │  │
         │  │                              │  │
         │  │  [grubpae-api]  :4000        │  │
         │  │  [grubpae-admin] :3001       │  │
         │  │  [grubpae-web]  :3000        │  │
         │  │  [nginx]        :80/:443     │  │
         │  └──────────────────────────────┘  │
         └────────────────────────────────────┘
                           │
                  ┌────────▼─────────┐
                  │  MongoDB Atlas   │
                  │  (West Africa    │
                  │   cluster)       │
                  └──────────────────┘
```

---

## Key Design Decisions

See [BACKEND_DECISION.md](BACKEND_DECISION.md) for the custom API rationale.  
See [ENV_SETUP.md](ENV_SETUP.md) for all environment variable documentation.
