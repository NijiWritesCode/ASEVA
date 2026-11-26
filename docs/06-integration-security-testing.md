# ASEVA — Integration, Security, Automated Testing & Production Readiness

**Document Reference:** `docs/06-integration-security-testing.md`  
**Phase:** 6 — Integrations, Security & Production Readiness  
**Status:** Implemented, Tested & Live Verified  
**Stack:** React 18 (pure JSX), Vitest, Tailwind CSS, TanStack Query, Paystack API, Supabase Edge Functions, PostgreSQL Integer-Kobo Financial Standard.

---

## 1. Executive Summary

Phase 6 bridges the editorial public marketing website and the private back-office operational command center into an integrated, secure, and production-ready digital ecosystem for **ASEVA**.

Key capabilities delivered in this phase:
1. **End-to-End Lead Synchronization:** Inbound consultation inquiries submitted on the public website immediately flow into the private dashboard pipeline (`/dashboard/enquiries`) and update executive KPI meters in real time.
2. **Paystack Luxury Payment Gateway Integration:** Complete integer-kobo transaction initialization, payment verification, and webhook handlers for automated milestone settlement.
3. **Anti-Spam & Rate-Limiting Defenses:** Client-side honeypot traps and sliding-window rate limiting paired with server-side validation.
4. **Automated Testing Suite (Vitest):** 15 automated unit and integration tests across 5 test suites covering integer-kobo math, honeypot rejection, date validation, atomic enquiry-to-event conversion, Paystack transaction configs, and RBAC governance.
5. **Code-Splitting & Production Performance:** Route-based lazy loading with dynamic imports and manual vendor chunking, dramatically reducing initial bundle size and eliminating oversized chunk warnings.
6. **Luxury SEO & Structured Data:** Open Graph metadata, Twitter Cards, robots.txt, sitemap.xml, and JSON-LD `LocalBusiness` schema.

---

## 2. Public $\leftrightarrow$ Private Lead Synchronization

### 2.1 Workflow Architecture
* **Public Form (`/book` & `/services`):** Prospective patrons complete the 5-step consultation booking flow with manual submission controls.
* **Service Layer (`enquiryService.js`):**
  1. Validates honeypot fields (`_hp`, `honeypot`).
  2. Enforces sliding-window rate limits (max 3 submissions per 15 minutes per device).
  3. Validates that the event date is strictly in the future.
  4. Generates an audit-traceable reference code (`ASV-YYYY-XXXX`).
  5. Atomically writes the inquiry into the local operational store (`dashboardService.createEnquiry(...)`) and attempts database synchronization with Supabase `booking_inquiries`.
* **Private Dashboard (`/dashboard/enquiries` & `/dashboard`):**
  * When staff navigate to the dashboard, the new enquiry appears immediately at the top of the pipeline with status `new`.
  * The Overview page KPI card for **Inbound Enquiries** increments, and the inquiry surfaces under **New Leads & Consultations**.

---

## 3. Paystack Payment Gateway Integration

In Nigerian luxury event commerce, high-net-worth patrons settle multi-million Naira commissions across contractual milestones.

### 3.1 Financial Standard Alignment
* Paystack's API requires all transaction amounts to be passed as **integer kobo** (`1 NGN = 100 kobo`).
* This aligns with ASEVA's BigInt integer-kobo architecture (`agreed_price_kobo`, `paid_kobo`, `amount_kobo`), ensuring zero floating-point arithmetic errors.

### 3.2 Service Implementation (`src/services/paystackService.js`)
* **`generateReference(prefix)`:** Creates traceable transaction references, e.g. `PSTK-ASV-2026-928173-4512`.
* **`initializeTransaction({ email, amountKobo, eventId, milestoneId, eventTitle, milestoneName })`:** Builds a Paystack checkout configuration with custom metadata fields for automatic reconciliation.
* **`verifyAndReconcile({ reference, eventId, milestoneId, amountKobo })`:** Reconciles confirmed payments directly into the event financial ledger and automatically updates the associated milestone schedule status (`is_paid = true`).

### 3.3 Supabase Webhook Edge Function (`supabase/functions/paystack-webhook/index.ts`)
* Listens for Paystack `charge.success` HTTP POST events.
* Verifies the cryptographic HMAC SHA-512 signature (`x-paystack-signature`) against `PAYSTACK_SECRET_KEY`.
* Implements idempotency: verifies whether the `transaction_reference` has already been recorded before writing.
* Atomically records the verified payment into the `payments` table and updates `payment_schedules`.

### 3.4 Direct Workspace Actions (`EventDetailPage.jsx`)
* In the **Finances & Milestones** tab of any event workspace (`/dashboard/events/:id`), each unpaid milestone card features a direct **`[Pay via Paystack]`** trigger that invokes `paystackMutation`, records the verified inflow, and recalculates the gross margin in real time.

---

## 4. Security, Anti-Spam & RBAC Governance

### 4.1 Anti-Spam Defenses
* **Honeypot Trap:** Hidden inputs (`_hp`, `honeypot`) invisible to human visitors. If filled by automated scrapers or bots, submission is rejected immediately.
* **Sliding-Window Rate Limiting:** Client-side tracking in `localStorage` blocks repetitive form submissions exceeding 3 requests per 15-minute window.
* **Input Sanitization:** Strings are trimmed, dates validated with ISO timestamps, and numbers parsed strictly to integers.

### 4.2 Role-Based Access Control (RBAC)
* Handled through `ProtectedRoute.jsx` and `useAuth.js`:
  * **Owner & Manager:** Full read/write access across all 12 operational views, including sensitive financial analytics (`/dashboard/reports`) and business governance (`/dashboard/settings`).
  * **Planner & Assistant:** Restricted from viewing executive profit margins or company settings. Navigation items for restricted sections are hidden, and direct URL navigation triggers automatic redirects.

---

## 5. Automated Testing Suite (Vitest)

An automated test suite was introduced with 15 tests across 5 test suites:

```bash
$ npm test

 RUN  v5.1.2 C:/Users/HP/Desktop/ASEVA

 ✓ tests/enquiry.test.js (4 tests)
 ✓ tests/kobo.test.js (4 tests)
 ✓ tests/paystack.test.js (3 tests)
 ✓ tests/rbac.test.js (3 tests)
 ✓ tests/conversion.test.js (1 test)

 Test Files  5 passed (5)
      Tests  15 passed (15)
   Start at  06:06:22
   Duration  2.26s
```

### Test Coverage Summary

| Test Suite | Spec File | Key Assertions Tested |
| :--- | :--- | :--- |
| **Integer-Kobo Engine** | `tests/kobo.test.js` | Exact 1 NGN = 100 kobo conversion, formatting with and without decimals, compact luxury abbreviations (`₦75.0M`), 30%/40%/30% milestone tranche division with 0 kobo drift, and Gross Operating Margin percentage calculation. |
| **Enquiry & Anti-Spam** | `tests/enquiry.test.js` | Bot rejection when honeypot fields contain values, future date validation, audit reference code formatting (`ASV-YYYY-XXXX`), and client rate-limit enforcement. |
| **Lead Conversion** | `tests/conversion.test.js` | Atomic conversion of booking enquiry into CRM client profile, event project workspace, and 3-tranche milestone schedule whose sum equals 100% of agreed contract fee. |
| **Paystack Integration** | `tests/paystack.test.js` | Reference code formatting, integer-kobo transaction initialization without decimals, and rejection of zero or negative amounts. |
| **RBAC Governance** | `tests/rbac.test.js` | Permission checks ensuring Owners/Managers have access to reports/settings, while Planners/Assistants are strictly blocked. |

---

## 6. Performance & Production Optimization

### 6.1 Route-Based Code-Splitting
* Configured `React.lazy()` and `<Suspense fallback={<PageLoader />}>` in `src/routes/AppRoutes.jsx`.
* Core public landing pages are imported immediately for fast First Contentful Paint (FCP).
* All 14 private dashboard views are split into on-demand dynamic chunks loaded only when staff access `/dashboard`.

### 6.2 Manual Rollup Chunking (`vite.config.js`)
Configured explicit vendor separation:
* `vendor-react` (React, React-DOM, React Router)
* `vendor-query` (TanStack Query)
* `vendor-animation` (Motion, GSAP)
* `vendor-charts` (Recharts)
* `vendor-icons` (Lucide React)

**Result:** Zero chunk size warnings during production build. Individual page chunks range from 3 kB to 27 kB.

### 6.3 Search Engine Optimization (SEO) & Metadata
* **`index.html`:** Open Graph cards, Twitter summary tags, editorial meta descriptions, and JSON-LD `LocalBusiness` structured data for Lagos luxury event planning.
* **`public/robots.txt`:** Allows crawling of marketing routes while protecting `/dashboard/` and `/login`.
* **`public/sitemap.xml`:** XML sitemap indexing all public marketing routes.

---

## 7. Verification Status

* **Automated Tests:** 15/15 tests passing cleanly (`npm test`).
* **Production Build:** `npm run build` completes in ~17s with **exit code 0**.
* **Route Health:** Both public (`/`) and private (`/dashboard`) endpoints return **HTTP 200**.
