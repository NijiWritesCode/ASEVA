# ASEVA — Open Business Questions & Technical Assumptions

**Document Reference:** `docs/01-open-questions.md`  
**Phase:** 1 — Business Discovery and Product Requirements  
**Status:** Awaiting Business Owner Feedback  
**Integrity Rule:** In accordance with the ASEVA Master Development Rules, no business facts, pricing, or credentials have been fabricated. Working assumptions are clearly designated below.

---

## 1. Executive Summary

To ensure rapid technical progress while maintaining strict real-world business fidelity, this register documents:
1. **Verified Facts:** Parameters explicitly defined in the Master Project Prompt.
2. **Technical Assumptions:** Engineering baselines adopted to build a functional architecture without blocking progress.
3. **Open Business Questions:** Specific, critical operational decisions requiring clarification from the business owner (ASEVA).

---

## 2. Verified Facts vs. Technical Assumptions

| Category | Verified Project Fact | Adopted Technical Assumption |
| :--- | :--- | :--- |
| **Currency** | Currency is Nigerian Naira (NGN). All money is stored as integer kobo. | Minor unit integer calculation: `amount_in_kobo = Math.round(naira * 100)`. Formatted as `₦X,XXX,XXX.XX` via `Intl.NumberFormat('en-NG')`. |
| **Timezone** | Operations occur within Nigeria. | System timestamps use UTC (`timestamptz`), while frontend displays and date calculations adapt to `Africa/Lagos` (WAT, UTC+1). |
| **Payment Integration** | Paystack is the designated online payment gateway. | System supports both online Paystack payments and manual payment entries (Bank Transfer, Cash, POS) with transaction references. |
| **Email Service** | Resend is the designated transactional email provider. | Edge Functions handle email delivery via Resend REST API; email failures are decoupled so they never roll back database record creation. |
| **Tech Stack** | React (JavaScript/JSX, no TS on frontend), Vite, Tailwind CSS, Motion for React, GSAP, Supabase. | Edge Functions utilize TypeScript as mandated by Supabase Edge Deno Runtime, while all React frontend code remains pure JavaScript/JSX. |

---

## 3. Detailed Open Business Questions

### 3.1 Brand Identity & Design Assets
* **Q1.1: Official Logo & Brand Mark:**  
  * *Current Assumption:* Using a minimalist, typographic SVG wordmark: `"ASEVA"` in elegant serif typography with an editorial subtitle `"EVENT ARCHITECTURE & DESIGN"`.  
  * *Required from Owner:* Vector SVG / EPS logo files, brand mark variants (dark background, light background, favicon).
* **Q1.2: Brand Palette & Color Tokens:**  
  * *Current Assumption:* A luxury neutral palette:
    * Primary: Deep Obsidian (`#0F1115`)
    * Accent: Champagne Warm Gold (`#D4AF37` / `#C5A059`)
    * Surface/Base: Alabaster / Warm Ivory (`#FBF9F5`)
    * Muted: Slate Grey (`#6B7280`)
  * *Required from Owner:* Confirmation if existing brand guidelines or hex codes exist.
* **Q1.3: Real Event Photography & Case Studies:**  
  * *Current Assumption:* Using high-resolution, unwatermarked editorial placeholder images of luxury events.
  * *Required from Owner:* Real photographs of ASEVA-planned events, categorized by event type with client credits.

---

### 3.2 Services, Packages & Pricing Model
* **Q2.1: Published Starting Prices:**  
  * *Current Assumption:* Website displays `"Inquire for bespoke proposal"` or representative starting prices (e.g., Full Wedding Planning starting from ₦3,500,000; Corporate Galas starting from ₦5,000,000).
  * *Required from Owner:* Exact starting prices or confirmation whether pricing should remain strictly private upon request.
* **Q2.2: Standard Service Package Names & Inclusions:**  
  * *Current Assumption:* Establishing four initial service offerings in the database:
    1. *Full-Service Wedding Planning & Design*
    2. *Corporate Galas & Brand Experiences*
    3. *Milestone Celebrations & Private Galas*
    4. *Partial Planning & Event-Month Coordination*
  * *Required from Owner:* The exact official service package names, scopes of work, and standard deliverables.

---

### 3.3 Financial Policies: Retainers, Milestones & Cancellations
* **Q3.1: Standard Payment Milestone Structure:**  
  * *Current Assumption:* Defaulting to a three-tranche milestone schedule:
    * Milestone 1: 30% Non-refundable booking retainer upon contract execution.
    * Milestone 2: 40% Mid-planning installment due 60 days before the event date.
    * Milestone 3: 30% Final balance payment due 14 days before the event date.
  * *Required from Owner:* Confirmation of the business's standard payment schedule policy.
* **Q3.2: Cancellation & Refund Policy:**  
  * *Current Assumption:* Retainers are strictly non-refundable to cover initial planning labor and vendor reservations.
  * *Required from Owner:* Official terms regarding client cancellation, date rescheduling, and vendor commitment liabilities.
* **Q3.3: Reimbursable Expenses vs. Planning Fees:**  
  * *Current Assumption:* Planning fee is fixed in the contract; vendor procurement expenses can either be billed directly through ASEVA or handled directly by the client.
  * *Required from Owner:* Clarification on whether vendor payments are disbursed through ASEVA's accounts or settled directly between client and vendor.

---

### 3.4 Operational Staff Structure & Roles
* **Q4.1: Initial Team Size & Internal Hierarchy:**  
  * *Current Assumption:* Supporting four hierarchical roles:
    1. `owner`: Complete administrative and financial authority.
    2. `manager`: Full operational and quotation authority; access to financial reports.
    3. `planner`: Assigned to specific events; manages tasks, vendors, and expenses; cannot view overall business profit reports.
    4. `assistant`: Read-only access to event briefs; can toggle task completion.
  * *Required from Owner:* Confirmation of the actual team structure and whether planners should have visibility into event contract values.

---

### 3.5 Contact Details & Legal Entity Information
* **Q5.1: Registered Legal Name & Consultation Studio:**  
  * *Current Assumption:* Using placeholder: `"ASEVA Events Nigeria Limited"`, Victoria Island, Lagos, Nigeria.
  * *Required from Owner:* Registered business name, CAC registration number (if displayed), physical consultation address, and official customer phone line.
* **Q5.2: Invoicing & Tax Compliance:**  
  * *Current Assumption:* Financial calculations reflect gross contract amounts; value-added tax (VAT at 7.5%) can be optionally appended to quotations.
  * *Required from Owner:* Does ASEVA issue formal VAT invoices to corporate clients, and is Withholding Tax (WHT) deducted by corporate clients?

---

### 3.6 Third-Party Integrations & Production Credentials
* **Q6.1: Paystack Account Status:**  
  * *Current Assumption:* Project will be implemented and tested using Paystack Test API Keys (`pk_test_...` and `sk_test_...`).
  * *Required from Owner:* Registered Paystack merchant account for production cutover.
* **Q6.2: Resend Custom Domain:**  
  * *Current Assumption:* Development will use Resend's test sender domain (`onboarding@resend.dev`) or a development verified sandbox.
  * *Required from Owner:* Access to DNS settings for ASEVA’s official domain (e.g., `asevaevents.com`) to add DKIM, SPF, and DMARC records.

---

## 4. Impact Assessment & Risk Mitigation

| Open Question Area | Technical Impact If Unresolved | Mitigation Strategy Applied |
| :--- | :--- | :--- |
| **Brand Colors / Logo** | Purely visual styling; negligible architectural risk. | Built fully with CSS tokens / Tailwind variables so color schemes can be updated globally in seconds. |
| **Service Catalog** | Schema depends on flexible service data. | Stored in dynamic `services` and `service_packages` database tables with seed data, fully editable from the dashboard. |
| **Payment Tranches** | Could cause rigidity if hardcoded. | Modeled as flexible `payment_schedules` records tied to an event rather than fixed rigid database columns. |
| **Tax / VAT** | Could disrupt gross margin calculations. | Designed with dedicated `subtotal_amount`, `tax_amount`, and `agreed_price` (all in integer kobo). |

---

## 5. Next Steps
With Phase 1 documentation established, the operational requirements, security boundaries, and financial logic are firmly codified. We are prepared to proceed to **Phase 2 — System Architecture, Database Design and Project Foundation** upon approval.
