# ASEVA — System Architecture & Technical Foundation

**Document Reference:** `docs/02-system-architecture.md`  
**Phase:** 2 — System Architecture, Database Design and Project Foundation  
**Status:** Approved Architectural Specification  
**Application Runtime:** React 18 (Vite, JSX) + Supabase (PostgreSQL 15+, Deno Edge Functions)  

---

## 1. High-Level System Architecture

The ASEVA platform is engineered as a unified, full-stack event enterprise architecture consisting of two distinct, cohesive presentation tiers operating against a unified, secure database and operational runtime:

```
                            ┌───────────────────────────────────────────────┐
                            │               CLIENT BROWSERS                 │
                            └───────┬───────────────────────────────┬───────┘
                                    │                               │
                      Public Routes │               Protected Admin │
                                    ▼                               ▼
                      ┌───────────────────────────┐   ┌───────────────────────────┐
                      │      PUBLIC WEBSITE       │   │    OPERATIONAL DASHBOARD  │
                      │  - Editorial Portfolio    │   │  - Lead Triage & CRM      │
                      │  - Services & Packages    │   │  - Event Planning Engine  │
                      │  - Zod Booking Form       │   │  - Kobo Financial Tracker │
                      │  - GSAP / Motion UI       │   │  - Recharts & Analytics   │
                      └─────────────┬─────────────┘   └─────────────┬─────────────┘
                                    │                               │
                                    │ Anon Key (RLS Limited)        │ Authenticated JWT (RLS Scoped)
                                    ▼                               ▼
                      ┌───────────────────────────────────────────────────────────┐
                      │                  SUPABASE PLATFORM API                    │
                      │  PostgREST API • GoTrue (Auth) • Storage Engine           │
                      └───────┬───────────────────────────────┬───────────────────┘
                              │                               │
               Insert Booking │               Webhook / Ingest│
                              ▼                               ▼
             ┌────────────────────────────────┐  ┌────────────────────────────────┐
             │     SUPABASE EDGE FUNCTIONS    │  │     THIRD-PARTY SERVICES       │
             │  • /submit-inquiry             │  │  • Paystack Payment Gateway    │
             │  • /paystack-webhook           │◄─┤    (HMAC SHA512 Verification)  │
             │  • /send-notification (Resend) ├─►│  • Resend Transactional Email  │
             └────────────────┬───────────────┘  └────────────────────────────────┘
                              │
                              ▼
             ┌────────────────────────────────────────────────────────────────────┐
             │                     POSTGRESQL RELATIONAL ENGINE                   │
             │  18 Normalized Tables • Integer Kobo Financial Standard (`BIGINT`)  │
             │  Database Constraints • Triggers • Row Level Security (RLS)        │
             └────────────────────────────────────────────────────────────────────┘
```

---

## 2. Frontend Directory & Module Architecture

The frontend is built strictly in **JavaScript and JSX** using **Vite**. The structure guarantees strict separation of concerns, preventing business logic from leaking into presentation components:

```text
src/
├── animations/           # Motion variants and GSAP scroll timeline helpers
│   ├── gsapTransitions.js
│   └── motionVariants.js
├── api/                  # Direct Supabase API client and network abstractions
│   ├── client.js         # Configured Supabase JS client
│   └── queryClient.js    # TanStack Query client with stale/cache config
├── assets/               # Static icons, vector logos, and imagery
├── components/
│   ├── dashboard/        # Dashboard-specific domain components (tables, cards, charts)
│   ├── public/           # Marketing-specific components (hero, service grid, case studies)
│   └── shared/           # Reusable atomic UI elements (buttons, inputs, modals, badges)
├── context/              # Global React contexts (AuthContext, ToastContext)
│   └── AuthContext.jsx
├── hooks/                # Custom reusable hooks (useAuth, useCurrency, useGSAP)
│   ├── useAuth.js
│   └── useKobo.js
├── layouts/              # Top-level shell layouts
│   ├── AuthLayout.jsx    # Login and recovery shell
│   ├── DashboardLayout.jsx # Authenticated sidebar, breadcrumbs, and topbar
│   └── PublicLayout.jsx  # Editorial navigation, main, and footer shell
├── pages/
│   ├── dashboard/        # Dashboard view controllers
│   │   ├── CalendarPage.jsx
│   │   ├── ClientsPage.jsx
│   │   ├── EnquiriesPage.jsx
│   │   ├── EventsPage.jsx
│   │   ├── ExpensesPage.jsx
│   │   ├── OverviewPage.jsx
│   │   ├── PaymentsPage.jsx
│   │   ├── ProcurementPage.jsx
│   │   ├── ReportsPage.jsx
│   │   ├── SettingsPage.jsx
│   │   └── TasksPage.jsx
│   └── public/           # Marketing view controllers
│       ├── AboutPage.jsx
│       ├── BookingConfirmedPage.jsx
│       ├── BookingPage.jsx
│       ├── ContactPage.jsx
│       ├── FaqsPage.jsx
│       ├── HomePage.jsx
│       ├── NotFoundPage.jsx
│       ├── PortfolioDetailPage.jsx
│       ├── PortfolioPage.jsx
│       ├── ServiceDetailPage.jsx
│       └── ServicesPage.jsx
├── routes/               # Routing configuration with guards
│   ├── AppRoutes.jsx
│   └── ProtectedRoute.jsx
├── schemas/              # Zod validation schemas for forms
│   ├── bookingSchema.js
│   ├── expenseSchema.js
│   └── paymentSchema.js
├── services/             # Query/mutation service functions for TanStack Query
│   ├── clientService.js
│   ├── enquiryService.js
│   ├── eventService.js
│   ├── financialService.js
│   └── publicCatalogService.js
├── styles/               # Global CSS, Tailwind directives, and typography
│   └── index.css
├── utils/                # Pure formatting and calculation helpers
│   ├── currency.js       # Integer kobo to formatted NGN converter
│   ├── date.js           # date-fns Lagos timezone formatting helpers
│   └── errorBoundary.jsx # React class error boundary
├── App.jsx               # Root application entry with providers
└── main.jsx              # Vite DOM mounting
```

---

## 3. Technology Integration Rationale

| Dependency | Category | Operational Purpose in ASEVA |
| :--- | :--- | :--- |
| **React 18** | UI Framework | Declarative component architecture; pure JSX with zero TypeScript overhead on frontend. |
| **Vite** | Build Tool | Instant Hot Module Replacement (HMR), optimized production bundling, asset hashing. |
| **React Router v7** | Routing | Client-side routing with nested layouts, parameterized routes, and route-level protection guards. |
| **Tailwind CSS v3** | Styling | Utility-first styling with bespoke luxury color tokens (Obsidian, Gold, Sand) and typography scales. |
| **Motion for React** | UI Animation | Fluid modal transitions, drawer slide-ins, status badge pulses, and button hover dynamics. |
| **GSAP & ScrollTrigger**| Narrative Animation| Editorial landing page reveals, pinned showcase slides, and parallax storytelling. |
| **TanStack Query v5** | Server State | Declarative fetching, caching, deduplication, background re-fetching, and optimistic mutations. |
| **React Hook Form** | Form Engine | Uncontrolled form performance with zero unnecessary re-renders during high-volume inputs. |
| **Zod** | Validation | Strict schema-based validation for booking inquiries, payments, and expense creation. |
| **Lucide React** | Iconography | Lightweight, consistent SVG icon set for dashboard actions and navigation. |
| **Recharts** | Data Visualization | Cash flow charts, profit margin area charts, and booking type distribution rings. |
| **date-fns** | Date Handling | Lightweight, immutable date manipulation with strict support for `Africa/Lagos` timezone. |
| **@supabase/supabase-js**| Backend Client | Realtime subscriptions, database PostgREST client, and GoTrue session management. |

---

## 4. State Management & Data Fetching Flow

### Server State (TanStack Query)
1. **Query Key Factory Pattern:** Structured query keys prevent cache collisions and streamline cache invalidation:
   * `['enquiries', { status, page }]`
   * `['events', eventId]`
   * `['events', eventId, 'payments']`
   * `['events', eventId, 'expenses']`
   * `['dashboard', 'metrics', businessId]`
2. **Mutation & Invalidation:**
   * When a payment is recorded via `financialService.recordPayment()`, TanStack Query invalidates:
     1. `['events', eventId, 'payments']`
     2. `['events', eventId]` (to update computed balance)
     3. `['dashboard', 'metrics']` (to update global revenue/receivables)

### Client State (React Context)
* **AuthContext:** Maintains authenticated session state, active business workspace, user profile, and user role (`owner`, `manager`, `planner`, `assistant`).
* Minimizes global client state; UI states (modals, drawers) are managed via local component state or URL query params.

---

## 5. Backend Runtime & Edge Compute Architecture

### Edge Functions (Deno Runtime)
Edge Functions execute isolated, privileged operations using Supabase Edge Runtime:
1. `submit-inquiry`:
   * Validates submitted payload against Zod schema.
   * Performs rate-limiting check and honeypot evaluation.
   * Inserts row into `booking_inquiries`.
   * Invokes Resend API to send acknowledgement to customer and alert to ASEVA staff.
2. `paystack-webhook`:
   * Receives incoming HTTP POST from Paystack.
   * Computes HMAC SHA512 hash using `PAYSTACK_SECRET_KEY` and compares with `x-paystack-signature` header.
   * If valid and event is `charge.success`, records/updates payment in `payments` with `status = 'confirmed'`.
   * Enforces idempotency via unique transaction reference constraint.

---

## 6. Financial Architecture & Precision

* **Integer Kobo Standard:** All monetary amounts are stored in database columns typed as `BIGINT`.
* **Zero Floating-Point Representation:**
  * ₦1,000,000.00 is stored as `100000000`.
  * Conversions occur only at presentation boundaries via `formatKoboToNaira()` utility.
* **Deterministic Calculations:** Outstanding balances and gross margins are derived from confirmed records via database views and PostgreSQL functions, eliminating desynchronization bugs.
