# ASEVA — Product Requirements Document (PRD)

**Document Reference:** `docs/01-product-requirements.md`  
**Phase:** 1 — Business Discovery and Product Requirements  
**Status:** Approved for Architectural Implementation  
**Currency Standard:** NGN (Integer Kobo: ₦1.00 = 100 kobo)  
**System Scope:** Dual Interface (Public Website + Unified Management Dashboard)  

---

## Section A: Business Overview

### A.1 Vision & Mission
**ASEVA** is a premier Nigerian full-service event planning and design company. The business specializes in transforming personal milestones and corporate ambitions into immersive, seamless, and memorable physical experiences. The business mission is to combine timeless elegance, precise logistics, transparent financial tracking, and authentic client care.

### A.2 Core Value Propositions
* **End-to-End Orchestration:** Handling venue sourcing, creative spatial styling, vendor vetting, contract negotiations, day-of event execution, and post-event tear-down.
* **Fiscal Transparency:** Eliminating hidden costs through structured quotation contracts, milestone payment schedules, and exact expense audit trails.
* **Uncompromising Operational Rigor:** Treating every event as a critical production schedule with defined milestones, responsible assignees, contingency protocols, and real-time task status.

---

## Section B: Customer Personas

### Persona 1: The Discerning Bride ("Zainab & Femi")
* **Demographics:** Age 27–36; professional couple based in Lagos/Abuja or in the diaspora (UK/US/Canada) planning a destination wedding in Nigeria.
* **Pain Points:** Overwhelmed by vendor reliability issues; fear of delays on the wedding day; difficulty tracking expenses across decor, catering, photography, and sound; communication bottlenecks due to timezone differences.
* **Motivations:** Wants a breath-taking, bespoke aesthetic that honors cultural traditions with modern luxury; requires total peace of mind that logistics are handled with military precision.
* **Key Website Conversion Driver:** High-resolution photo essays of previous weddings, authentic aesthetic coherence, explicit service packages, and an effortless booking inquiry form.

### Persona 2: The Corporate Marketing Director ("Mr. Babatunde")
* **Demographics:** Age 38–52; VP of Marketing or Head of Corporate Affairs at a financial institution, telecom, or FMCG corporation.
* **Pain Points:** Tight corporate deadlines; needs formal RFP/quotation documents with tax compliance and itemized pricing; cannot afford technical failures during executive presentations or awards dinners.
* **Motivations:** Reliable vendor coordination, strict adherence to run-of-show timing, polished brand-aligned decor, and clean financial invoicing for corporate auditing.
* **Key Website Conversion Driver:** Professional corporate event portfolio, clear statement of capabilities (AGMs, galas, product reveals), prompt professional follow-up within 24 hours.

### Persona 3: The Milestone Celebrant ("Chief Mrs. Adeleke")
* **Demographics:** Age 45–65; high-net-worth individual celebrating a 50th/60th birthday, chieftaincy, or retirement gala.
* **Pain Points:** High guest count (500–1,500 guests), complex security and VIP seating requirements, pressure to entertain high-profile guests with exquisite hospitality.
* **Motivations:** Exclusive access to premier venues, top-tier caterers, immersive audiovisual production, and red-carpet guest experience.
* **Key Website Conversion Driver:** Elegance, discretion, testimonials from reputable clients, direct phone/VIP consultation booking path.

---

## Section C: Business Requirements

1. **Unified Infrastructure:** The public marketing site and the internal administrative dashboard must communicate with the same Supabase database instance.
2. **Deterministic Financial Management:**
   * Money must never be stored as floating-point numbers. All currency values are stored as integer kobo (`BIGINT`).
   * Financial statistics (balances, gross profit, cash collected) must be dynamically derived from confirmed payment transactions and actual expense receipts rather than editable summary fields.
3. **Data Integrity & Multi-Event Clients:**
   * A client entity must exist independently of an event, allowing repeated bookings across years without duplicate records.
   * An enquiry must remain distinct from a confirmed booking until contract agreement and deposit verification occur.
4. **Strict Audit Trail:** Any creation, modification, or cancellation of payments, contracts, or expenses must record the timestamp and acting staff member.
5. **Data Protection & Row Level Security (RLS):** All internal business records, client personal identifiable information (PII), and financial data must be shielded behind Supabase RLS policies.

---

## Section D: Public Website Requirements

### D.1 Navigation & Global Structure
* **Header / Navigation:** Sticky header with subtle backdrop blur; logo branding; desktop navigation links (`About`, `Services`, `Portfolio`, `FAQs`, `Contact`); prominent CTA button (`Inquire / Reserve Date`).
* **Footer:** Newsletter/inquiry capture, business contact coordinates (address placeholder, email, phone), social media links, operating hours, copyright, legal disclaimer.

### D.2 Page-by-Page Requirements

#### 1. Home Page (`/`)
* **Hero Section:** Full-bleed editorial presentation with GSAP scroll-driven entrance, luxury typography, brand hook, and dual CTA (`Explore Portfolio` / `Reserve Your Date`).
* **Brand Introduction:** Concise brand ethos explaining ASEVA’s standard of service.
* **Signature Services Carousel / Grid:** 3–4 featured service pillars with imagery and hover reveals.
* **Featured Showcase / Work:** Curated highlights of recent high-impact events.
* **The ASEVA Standard (Process):** 4-step workflow (Consultation $\rightarrow$ Conceptualization $\rightarrow$ Curation $\rightarrow$ Flawless Execution).
* **Testimonials:** Verified client reviews (clearly marked as placeholders until real quotes are provided).
* **Call-to-Action Banner:** High-converting invitation to initiate consultation.

#### 2. About Page (`/about`)
* **Brand Story & Creative Direction:** Narrative of ASEVA's establishment and mission.
* **Core Philosophy:** Precision planning, artistic decor, and stress-free client experience.
* **Leadership / Team:** Founder & creative lead profile with professional editorial portrait.
* **Values:** Integrity, Aesthetic Elegance, Accountability, Discretion.

#### 3. Services Page (`/services`) & Detail Pages (`/services/:slug`)
* Dynamic listing fed from the `services` database table.
* **Service Attributes:** Title, Slug, Short Description, Detailed Scope of Work, Deliverables checklist, Image asset, Base starting investment (or "Inquire for custom proposal").
* Service Categories:
  1. *Full-Service Wedding Planning & Design*
  2. *Corporate Galas & Brand Experiences*
  3. *Milestone Celebrations & Private Dinners*
  4. *Event Styling, Decor & Floral Production*

#### 4. Portfolio / Gallery Page (`/portfolio`) & Case Studies (`/portfolio/:slug`)
* Dynamic gallery with category filtering tabs (`All`, `Weddings`, `Corporate`, `Celebrations`, `Intimate`).
* Image cards with subtle zoom transitions, location, guest count, and view case study action.
* Case study detail view featuring narrative brief, design moodboard highlights, event gallery, and vendor acknowledgment.

#### 5. Booking Enquiry Page (`/book`)
* High-conversion qualification form built with `react-hook-form` and validated with `zod`.
* Fields specified in Section F.1.
* Anti-abuse protection: Honey-pot field, rate limiting on submission Edge Function.
* Real-time loading indicator and immediate navigation to confirmation upon success.

#### 6. Contact Page (`/contact`)
* Direct email address, telephone contact, physical consultation studio address, business operating hours, interactive map placeholder.

#### 7. FAQs Page (`/faqs`)
* Accordion-style expandable items addressing:
  * How early should we book ASEVA?
  * What is the booking deposit policy?
  * Do you travel for destination events?
  * Can we bring our own vendors?
  * What happens if we need to reschedule?

#### 8. Booking Confirmation Page (`/booking-confirmed`)
* Reassuring milestone page displaying the generated inquiry reference code (e.g., `ASV-ENQ-2026-XXXX`).
* Explains next steps: Initial review within 24 hours $\rightarrow$ Discovery call scheduling $\rightarrow$ Bespoke quotation.

#### 9. 404 Error Page (`/404`)
* Editorial error page with intuitive navigation links back to safe routes.

---

## Section E: Private Dashboard Requirements

### E.1 Authentication & Session Management
* Secure Supabase Auth using email and password.
* Route guards for all `/dashboard/*` paths.
* Access tokens stored securely; automatic refresh token handling.
* Password reset and update profile flows.
* Access-denied screen for unauthorized accounts.

### E.2 Dashboard Modules & Features

#### 1. Executive Overview (`/dashboard`)
* **KPI Metrics Cards:**
  * Active Confirmed Events (Count)
  * New Enquiries Awaiting Review (Count)
  * Total Confirmed Revenue (NGN Kobo)
  * Total Cash Collected (NGN Kobo)
  * Total Outstanding Receivables (NGN Kobo)
  * Upcoming Deadlines / Overdue Tasks (Count)
* **Visual Charts (Recharts):**
  * Monthly Cash Flow (Payments Received vs. Expenses Disbursed)
  * Booking Distribution by Event Type
* **Upcoming Events Table:** Next 5 scheduled events with dates, clients, venues, and payment status badges.
* **Urgent Action Items:** Overdue tasks, unconfirmed payments, pending procurement orders.

#### 2. Enquiry Management (`/dashboard/enquiries`)
* Filterable, searchable data table of all booking inquiries.
* Search by client name, email, event type, date range.
* Status pills: `new`, `under_review`, `quotation_sent`, `accepted`, `declined`, `converted`.
* Detail Drawer/Modal:
  * Complete submitted data.
  * Internal staff notes thread.
  * Action: "Send Quotation" (enters agreed quote amount in kobo).
  * Action: "Convert to Event & Client" (atomic database transaction).
  * Action: "Decline" with reason code.

#### 3. Client Management (`/dashboard/clients`)
* Master client directory.
* Profile attributes: Name, Company, Email, Phone, Secondary Phone, Physical Address, Internal Notes, VIP status.
* Client 360 View:
  * Associated events (past and active).
  * Total lifetime billing and lifetime payments.
  * Direct communication log.

#### 4. Event Management (`/dashboard/events` & `/dashboard/events/:id`)
* Event Master Record: Title, Event Type, Client Association, Target Date, Setup Date, Teardown Date, Venue Name, Venue Address, Guest Count, Agreed Total Fee (Kobo), Contract URL, Status (`planning`, `ready`, `in_progress`, `completed`, `cancelled`).
* Event Workspace Tabs:
  * **Overview:** Key event parameters, countdown timer, financial status widget.
  * **Tasks:** Kanban / Table view of planning tasks.
  * **Finances & Payments:** Agreed fee, payment schedule, logged payments, balance due.
  * **Expenses:** Logged expenses, vendor disbursements, receipts, margin analysis.
  * **Procurement:** Required rental/purchase items, status tracker.
  * **Vendors:** Linked service providers, contract fees, contact leads.
  * **Documents:** Signed agreements, floorplans, moodboards, run-of-show schedules.

#### 5. Payment Management (`/dashboard/payments`)
* Financial operations hub.
* Record manual payment: Amount (kobo), Payment Method (`bank_transfer`, `cash`, `pos`, `paystack`), Reference, Payment Date, Attached Proof of Payment, Internal Notes.
* Integration with Paystack webhook for automated online reconciliation.
* Payment Schedules: Generate milestone dates with target sums.
* Payment status indicators: `unpaid`, `partially_paid`, `fully_paid`, `overdue`.

#### 6. Task Management (`/dashboard/tasks`)
* Global view of all tasks across all events with multi-event filters.
* Filter by: Event, Assignee, Priority (`low`, `medium`, `high`, `critical`), Due Date, Status (`pending`, `in_progress`, `completed`, `cancelled`).
* Quick toggle for task completion.

#### 7. Procurement Management (`/dashboard/procurement`)
* Cross-event tracking of physical assets and rentals.
* Columns: Item Name, Category (Furniture, Lighting, Linens, Floral, Cutlery, Signage), Quantity, Estimated Unit Cost, Actual Unit Cost, Total Cost, Supplier/Vendor, Delivery Deadline, Status (`needed`, `requested`, `ordered`, `acquired`, `cancelled`), Event Association.

#### 8. Vendor Directory (`/dashboard/vendors`)
* Master rolodex of vetted event suppliers.
* Categories: Catering, Cakes/Desserts, Floral Design, Audiovisual/Lighting, Photography/Cinematography, MC/Entertainment, Security, Hair & Makeup, Transport/Logistics.
* Fields: Business Name, Contact Person, Phone, Email, Base City, Bank Account Details (for disbursements), Rating/Performance Notes.

#### 9. Expense Management & Profitability (`/dashboard/expenses`)
* Expense logging tied directly to specific events and optional vendor accounts.
* Fields: Category, Amount (kobo), Expense Date, Payment Method, Paid Status, Receipt Attachment, Recorded By Staff ID.
* Profitability Widget:
  $$\text{Contract Price} - \text{Total Expenses} = \text{Net Gross Profit}$$

#### 10. Master Calendar (`/dashboard/calendar`)
* Month, week, and day views.
* Color-coded event dates, task due dates, payment instalment milestones, and vendor delivery appointments.
* Click-through directly to the corresponding event or task record.

#### 11. Reports & Analytics (`/dashboard/reports`)
* Date-range filtered reporting:
  * Total Booked Revenue vs. Realized Cash Inflow.
  * Aggregate Expense Breakdown by Category.
  * Overall Business Profit Margins.
  * Enquiry Conversion Funnel Efficiency (Inquiry $\rightarrow$ Quote $\rightarrow$ Confirmed Event).
  * Vendor Spend Distribution.

#### 12. Settings & Business Configuration (`/dashboard/settings`)
* Business profile (Legal Name, Trading Name, Logo, Address, Default Currency: NGN).
* Staff management: Invite team members, assign roles (`owner`, `manager`, `planner`, `assistant`), revoke access.
* Services & packages catalog management.

---

## Section F: Booking Lifecycle State Machine

```
  ┌────────────────────────────────────────────────────────┐
  │                   1. NEW ENQUIRY                       │
  │  Customer submits form on website. Stored with status   │
  │  'new'. Notification dispatched to team.               │
  └──────────────────────────┬─────────────────────────────┘
                             │
                             ▼
  ┌────────────────────────────────────────────────────────┐
  │                  2. UNDER REVIEW                       │
  │  Team checks calendar availability & budget fit.       │
  │  Conducts discovery call with client.                  │
  └──────────┬───────────────────────────────┬─────────────┘
             │                               │
    [Decline / No fit]                       │ [Feasible & Qualified]
             │                               │
             ▼                               ▼
  ┌───────────────────────┐       ┌────────────────────────┐
  │      DECLINED         │       │   3. QUOTATION SENT    │
  │  Reason logged;       │       │  Proposal & total fee   │
  │  polite email sent.   │       │  dispatched to client. │
  └───────────────────────┘       └──────────┬─────────────┘
                                             │
                         ┌───────────────────┴───────────────────┐
                         │                                       │
                [Client Rejects]                        [Client Accepts]
                         │                                       │
                         ▼                                       ▼
              ┌─────────────────────┐                 ┌────────────────────┐
              │      DECLINED       │                 │    4. ACCEPTED     │
              │  Logged in archive. │                 │  Client agrees to  │
              └─────────────────────┘                 │  proposal & terms. │
                                                      └──────────┬─────────┘
                                                                 │
                                                       [Deposit Verified]
                                                                 │
                                                                 ▼
                                                      ┌────────────────────┐
                                                      │ 5. CONVERTED TO    │
                                                      │    BOOKING (EVENT) │
                                                      │ Client created/    │
                                                      │ linked. Event row  │
                                                      │ initialized.       │
                                                      └────────────────────┘
```

---

## Section G: Payment Lifecycle & Financial Architecture

### G.1 Currency Integrity Rules
1. **Integer Representation:** An amount of ₦2,500,000.00 is stored as `250000000` (kobo).
2. **Display Formatting:** Formatted in frontend via an internationalization helper:
   ```javascript
   export const formatKoboToNaira = (koboAmount) => {
     const naira = Number(koboAmount || 0) / 100;
     return new Intl.NumberFormat('en-NG', {
       style: 'currency',
       currency: 'NGN',
       minimumFractionDigits: 2,
     }).format(naira);
   };
   ```
3. **No Direct Overwriting:** Outstanding balance is calculated dynamically:
   ```sql
   balance_due = agreed_price - COALESCE(SUM(payments.amount) FILTER (WHERE payments.status = 'confirmed'), 0)
   ```

### G.2 Payment Workflow
1. **Schedule Generation:** Planners set up payment milestones (e.g., Retainer Deposit, Milestone 2, Final Balance).
2. **Online Payment (Paystack):**
   * Customer initiates transaction with reference generated on backend.
   * Edge Function initialises transaction with Paystack API.
   * Customer completes payment in Paystack modal or redirect.
   * Paystack webhook notifies Supabase Edge Function (`/paystack-webhook`).
   * Webhook verifies HMAC SHA512 signature against Paystack Secret Key.
   * On `charge.success`, payment record status is updated to `confirmed`.
3. **Manual Bank Transfer / Cash:**
   * Staff logs payment with mandatory fields: Amount (kobo), date, bank transaction reference, staff user ID.
   * Optional receipt proof uploaded to private storage bucket.
   * System records transaction in `payments` and writes entry to `activity_logs`.

---

## Section H: Event Management Lifecycle

1. **Phase 1: Inception & Onboarding:**
   * Contract executed, deposit logged.
   * Event workspace initialized.
   * Shared moodboard and design objectives drafted.
2. **Phase 2: Planning & Sourcing:**
   * Critical tasks populated from standard event templates.
   * Vendors shortlisted and booked.
   * Venue walkthrough scheduled.
   * Procurement items cataloged and ordered.
3. **Phase 3: Final Pre-Production (T-30 to T-1 Days):**
   * Final guest count confirmed.
   * Run-of-show minute-by-minute schedule finalized.
   * Final balance payment collected.
   * All procurement items verified as `acquired`.
4. **Phase 4: Day-of Production:**
   * Setup & load-in execution.
   * Real-time vendor coordination.
   * Event execution according to run-of-show.
5. **Phase 5: Post-Event Wrap-up & Reconciliation:**
   * Teardown and equipment return verified.
   * Outstanding vendor invoices reconciled and logged as expenses.
   * Final event profitability calculated and closed out.
   * Review/testimonial request sent to client.

---

## Section I: User Roles & Permissions Matrix

| Permission | Owner | Manager | Planner | Assistant |
| :--- | :---: | :---: | :---: | :---: |
| **Manage Business Info & Preferences** | Full | View Only | View Only | No Access |
| **Manage Staff Members & Roles** | Full | No Access | No Access | No Access |
| **View Financial Reports & Margin Analytics** | Full | Full | No Access | No Access |
| **Create / Modify Quotations & Contract Prices** | Full | Full | View Only | No Access |
| **Record Manual Payments** | Full | Full | No Access | No Access |
| **Record / Update Expenses** | Full | Full | Full | View Only |
| **Convert Inquiries to Events** | Full | Full | No Access | No Access |
| **Manage Clients (Create, Edit, Delete)** | Full | Full | Create/Edit | View Only |
| **Manage Events (Create, Edit, Delete)** | Full | Full | Create/Edit | View Only |
| **Manage Tasks (Create, Assign, Update Status)** | Full | Full | Full | Full (Assigned) |
| **Manage Procurement Items** | Full | Full | Full | Update Status |
| **Manage Vendors** | Full | Full | Create/Edit | View Only |
| **View Audit Logs** | Full | Full | No Access | No Access |

---

## Section J: MVP Requirements (Release 1.0)

### Frontend (Public)
* High-performance responsive website (Home, About, Services, Service Detail, Portfolio, Booking Enquiry, Contact, FAQs, Confirmation, 404).
* Booking Enquiry form with full client-side validation (Zod + React Hook Form).
* Dynamic loading of published services and portfolio projects from database.
* Elegant aesthetic using Tailwind CSS and Motion for React.

### Frontend (Dashboard)
* Secure login and authenticated session management.
* Executive dashboard overview with real-time financial stats and upcoming events.
* Complete Enquiry triaging pipeline (Review, Quote, Decline, Convert).
* Client directory with history view.
* Event management module with task tracking and expense logging.
* Manual payment recording with automatic balance calculation.
* Vendor directory and event allocation.

### Backend (Supabase)
* Relational PostgreSQL schema with foreign keys, constraints, and indexes.
* Row Level Security (RLS) enforcing multi-tenant isolation.
* Supabase Edge Function for public booking inquiry submission with anti-spam checks.
* Resend email notification integration for booking inquiries.
* Storage buckets for public portfolio images and private receipts/documents.

---

## Section K: Future Enhancements (Post-MVP Roadmap)

1. **Client Portal (`/portal`):** Dedicated authenticated interface where clients can view their contract, see payment receipts, review moodboards, and track countdowns.
2. **Automated WhatsApp / SMS Notifications:** Integration with Termii or Twilio for instant SMS/WhatsApp alerts for booking milestones.
3. **Interactive Seating Chart & Guest List Manager:** Drag-and-drop spatial table layout tool for day-of coordination.
4. **Automated PDF Invoice & Quotation Generation:** Headless PDF rendering of branded ASEVA invoices and receipts.
5. **Multi-Currency Support:** Ability to generate quotes in USD/GBP for international destination events while recording base books in NGN kobo.

---

## Section L: Unresolved Business Questions & Assumptions Table

| Item | Status | Working Technical Assumption | Action Required from Business Owner |
| :--- | :--- | :--- | :--- |
| **Official Brand Assets** | Unconfirmed | Using editorial neutral palette (Obsidian, Warm Champagne Gold, Cream, Sand) with serif display typography (`Playfair Display`/`Cinzel`) and clean sans body (`Plus Jakarta Sans`). | Supply vector SVG logo, brand color codes, and official typography licenses if custom. |
| **Official Contact Info** | Unconfirmed | Using standard professional placeholders: `concierge@asevaevents.com`, `+234 800 000 0000`, Victoria Island, Lagos. | Provide official registered address, phone numbers, and customer care email. |
| **Published Pricing** | Unconfirmed | Displaying "Starting from ₦X,XXX,XXX" or "Inquire for Bespoke Proposal" rather than fixed retail checkout prices. | Confirm standard starting price points for primary packages. |
| **Deposit Percentage** | Unconfirmed | Defaulting to 30% commitment retainer, 40% mid-planning payment, 30% final balance (14 days before event). | Validate standard contractual payment milestone terms. |
| **Cancellation Policy** | Unconfirmed | Retainers classified as non-refundable in documentation and FAQs. | Supply legal terms and conditions for client cancellation and refunds. |
| **Paystack Credentials** | Unconfirmed | Developing against Paystack Test Mode keys; production webhooks require live secret key in Supabase Secrets. | Provide Paystack test and live API keys when deploying to staging/prod. |
| **Resend Sender Domain** | Unconfirmed | Developing using Resend test sandbox sender (`onboarding@resend.dev`); production requires verified custom DNS domain. | Configure DNS records (SPF, DKIM, DMARC) for ASEVA's custom sending domain. |
