# ASEVA — Business Discovery & Operational Analysis

**Document Reference:** `docs/01-business-discovery.md`  
**Phase:** 1 — Business Discovery and Product Requirements  
**Status:** Approved for Architectural Baseline  
**Currency:** Nigerian Naira (NGN), stored in minor units (integer kobo)  
**Timezone:** Africa/Lagos (WAT, UTC+1)  

---

## 1. Executive Summary & Brand Identity

**ASEVA** is an elite event-planning and event-management business dedicated to delivering bespoke, sophisticated, and flawlessly orchestrated experiences. Operating in the premium lifestyle, corporate, and luxury celebratory sectors, ASEVA curates high-stakes events ranging from grand weddings and executive corporate galas to milestone anniversaries, luxury brand activations, and private VIP dinners.

The platform architecture unites two intertwined interfaces powered by a single PostgreSQL/Supabase database:
1. **A Public-Facing Business Website:** An editorial, high-aesthetic digital flagship that showcases ASEVA's portfolio, communicates brand values, educates prospective clients, and captures qualified booking enquiries without friction.
2. **A Private Event-Management Dashboard:** An enterprise-grade operational console empowering ASEVA's planning team to triage enquiries, convert qualified leads into confirmed events, schedule milestones, track procurement, coordinate trusted vendors, log itemised expenses, and maintain strict financial auditability (with zero floating-point financial ambiguity).

---

## 2. Business Problem Statement & Market Opportunity

### Current Operational Bottlenecks
* **Fragmented Lead Capture:** Enquiries currently arrive through unstandardised channels (WhatsApp messages, direct phone calls, informal direct messages, unstructured emails). Critical event parameters (guest counts, budgets, logistical constraints) are frequently missed or require prolonged back-and-forth messaging.
* **Disconnection Between Enquiries and Confirmed Bookings:** Leads are frequently lost in spreadsheet records. Inquiries are mistakenly treated as confirmed bookings without formalised contracts or deposit receipts.
* **Financial Leakage & Currency Precision Issues:** Event budgeting in Nigeria is prone to fluctuating vendor costs, manual cash/bank transfer records without formal reconciliation, and confusion between total contract revenue vs. actual cash collected.
* **Disconnected Procurement & Vendor Coordination:** Equipment rentals, decor fabrication, catering, lighting, and entertainment are managed across scattered notes. There is no unified system tracking whether critical procurement items are *Needed*, *Requested*, *Ordered*, or *Acquired*.
* **Lack of Real-Time Profitability Visibility:** Event planners often only discover true event margins weeks after the event concludes, due to unrecorded ad-hoc operational expenses.

### Strategic Opportunity
By building an integrated full-stack solution, ASEVA will:
* Elevate customer perception through an editorial, high-performance website that positions the brand alongside world-class event maisons.
* Automate the lead-to-booking pipeline with automated notifications, status progression, and structured qualification.
* Deliver complete operational control to ASEVA's team with real-time tracking of tasks, vendors, disbursements, payment milestones, and gross margins.

---

## 3. Frontend Discovery: Public-Facing Experience

### 3.1 Target Customer Personas
1. **The Discerning Bride & Groom (Luxury Weddings):** High expectations, emotionally invested, demanding aesthetic perfection, seeking stress-free coordination and design mastery.
2. **The Corporate Brand Director / Event Head (Corporate Galas, Product Launches):** Professional, deadline-driven, requires formal proposals, rigid timelines, strict budget accountability, and flawless brand representation.
3. **The High-Net-Worth Celebrant (Milestone Anniversaries, VIP Birthdays):** Seeks exclusivity, discretion, bespoke thematic styling, and high-touch concierge-level execution.

### 3.2 Key Problems Solved by the Website
* Establishes immediate trust and luxury positioning through typography, imagery, and restrained motion.
* Eliminates ambiguous pricing or unqualified inquiries by prompting users for estimated guest count, budget bracket, and event nature.
* Educates clients on ASEVA’s structured end-to-end event planning methodology.
* Clarifies that submitting an inquiry is an initial consultation request, not a confirmed reservation.

### 3.3 Information Prospective Clients Need Before Inquiring
* **Scope of Services:** Does ASEVA handle full-scale production, partial planning, month-of coordination, or creative design/styling?
* **Aesthetic Proof:** Curated photo and narrative documentation of past events illustrating scale, lighting, floral architecture, and table styling.
* **Planning Process:** Clear roadmap of what happens after submitting an inquiry.
* **Geographic Coverage:** Primary operations in Lagos and Abuja, with availability for nationwide and destination travel.
* **Lead Time & Exclusivity:** How far in advance bookings must be made.

### 3.4 Public Website Architecture & Page Objectives

| Page | Route | Purpose & Key Content |
| :--- | :--- | :--- |
| **Home** | `/` | Editorial hero showcase, brand manifesto, signature service highlights, curated portfolio carousel, client testimonials, booking CTA banner. |
| **About ASEVA** | `/about` | Brand heritage, creative director philosophy, the ASEVA planning standard, commitment to precision and emotional resonance. |
| **Services** | `/services` | Overview of service offerings (Full-Service Planning, Design & Production, Corporate Experiential, Intimate Gatherings). |
| **Service Details** | `/services/:slug` | In-depth breakdown of inclusions, deliverables, timeline expectations, and targeted enquiry CTA. |
| **Portfolio / Gallery** | `/portfolio` | High-resolution editorial gallery filterable by category (Weddings, Galas, Brand Activations, Private Dinners). |
| **Portfolio Showcase** | `/portfolio/:slug` | Deep-dive case study with narrative backstory, guest capacity, design concept, vendor credits, and photo essays. |
| **Booking Enquiry** | `/book` | Multi-step or progressive responsive qualification form capturing contact details, event scope, date, budget, and logistical notes. |
| **Contact** | `/contact` | Direct communication avenues (concierge email, telephone, office consultation location, direct map guide). |
| **FAQs** | `/faqs` | Answers to common client questions regarding retainer deposits, planning timelines, vendor selection, and changes of date. |
| **Confirmation** | `/booking-confirmed` | Reassuring post-submission page confirming receipt, providing an enquiry reference code, and outlining next steps within 24–48 hours. |
| **Not Found** | `*` (404) | Branded, elegant 404 screen guiding lost visitors back to Home or Portfolio. |

### 3.5 The Public Booking Inquiry Journey
```
[Visitor lands on Site]
         │
         ▼
[Explores Editorial Portfolio & Services]
         │
         ▼
[Clicks "Reserve Date" or "Inquire"]
         │
         ▼
[Fills Booking Inquiry Form (Validation, Kobo-friendly budget, Date selection)]
         │
         ▼
[Client-side validation & Anti-spam checks pass]
         │
         ▼
[Submission via Supabase Edge Function: Ingests to DB with status 'new']
         │
         ├──► [Customer receives automated branded email acknowledgement via Resend]
         └──► [ASEVA team receives high-priority administrative alert in Dashboard]
         │
         ▼
[Visitor is routed to /booking-confirmed with tracking reference & guidance]
```

### 3.6 Booking Enquiry Form Field Specifications
* **Full Name:** Required string (min 3 chars).
* **Email Address:** Required valid email.
* **Phone Number:** Required valid international/Nigerian telephone format (`+234...` or `0...`).
* **Event Type:** Selection (Wedding, Corporate Event, Milestone Celebration, Gala Dinner, Brand Activation, Private Dinner, Other).
* **Preferred Event Date:** Required date picker (must be in the future, validated).
* **Alternative Event Date:** Optional secondary date in case of venue/planner unavailability.
* **Event Location / City:** Required (Lagos Island, Lagos Mainland, Abuja, Destination/Other).
* **Target Venue (if secured):** Optional text.
* **Estimated Guest Count:** Required numeric bracket (e.g., 50–100, 101–250, 251–500, 500+).
* **Estimated Budget Range (NGN):** Required bracket (e.g., ₦5M–₦10M, ₦10M–₦25M, ₦25M–₦50M, ₦50M+).
* **Required Service Package:** Selection based on published services.
* **Vision & Special Requirements:** Textarea for theme ideas, cultural ceremonies, accessibility requirements.
* **Referral Source:** Optional select (Instagram, Word of Mouth, Attended Past Event, Corporate Referral, Press).

### 3.7 Mobile & Responsive Requirements
* Fluid typography scaled using modern CSS clamp formulas.
* Touch-first navigation with smooth off-canvas navigation and thumb-reachable action buttons.
* Network-conscious imagery using responsive `srcset`, modern formats (`.webp`), and explicit width/height to eliminate Layout Shift (CLS).
* Full compliance with iOS and Android viewport constraints (preventing iOS zoom on form input focus by ensuring 16px minimum font size).

---

## 4. Backend Discovery: Operational & Dashboard Architecture

### 4.1 Inquiry Processing & Lead Qualification
When an inquiry arrives:
1. Status is initialized as `new`.
2. The team reviews date availability and budget feasibility.
3. Status moves to `under_review`.
4. If feasible, ASEVA arranges an initial consultation call and prepares a customized quotation.
5. Status becomes `quotation_sent` with attached quotation reference and agreed total sum in NGN kobo.

### 4.2 Client Entity vs. Event Entity
* **Client Entity:** Represents the human or corporate counterparty (Name, Email, Phone, Company, Billing Address, Lifetime Value, Total Events Managed).
* **Event Entity:** A distinct project tied to a Client. A single client (e.g., a corporate conglomerate or high-net-worth family) can commission multiple events over time.
* **Conversion Workflow:** When an enquiry is approved (`accepted`), the system either links to an existing client record or creates a new client record, then creates the confirmed `event` entity.

### 4.3 Financial Governance & Currency Representation
* **Zero Floating-Point Error:** Every monetary column (`agreed_price`, `amount_paid`, `balance_due`, `estimated_cost`, `actual_cost`) is defined as `BIGINT` representing integer kobo (1 NGN = 100 kobo).
* **Derived Truth:** An event’s `balance_due` is never manually modified in the database. It is calculated deterministically:
  $$\text{Balance Due} = \text{Agreed Event Price} - \sum(\text{Confirmed Payments})$$
* **Instalment & Schedule Tracking:** Support for:
  1. *Commitment Retainer / Deposit* (e.g., 30% upon signing).
  2. *Mid-term Planning Instalment* (e.g., 40% 60 days before event).
  3. *Final Balance Instalment* (e.g., 30% 14 days before event).
* **Payment Modalities:**
  * **Online (Paystack):** Webhook-verified transactions matching cryptographic HMAC SHA512 signatures.
  * **Manual (Bank Transfer / Cash):** Requires administrative entry with bank reference, date received, recording staff ID, and mandatory receipt upload.

### 4.4 Event Planning Operational Modules

```
                    ┌─────────────────────────────────────────┐
                    │               EVENT ENTITY              │
                    │  (Title, Date, Venue, Client, Budget)   │
                    └────────────────────┬────────────────────┘
                                         │
     ┌───────────────────┬───────────────┴───────────────┬───────────────────┐
     ▼                   ▼                               ▼                   ▼
┌───────────────┐ ┌───────────────┐             ┌─────────────────┐ ┌─────────────────┐
│ EVENT TASKS   │ │  PROCUREMENT  │             │ EVENT VENDORS   │ │ EVENT EXPENSES  │
│ - Deadlines   │ │ - Needed      │             │ - Category      │ │ - Category      │
│ - Assignees   │ │ - Ordered     │             │ - Contract fee  │ │ - Actual kobo   │
│ - Priorities  │ │ - Acquired    │             │ - Contact lead  │ │ - Receipts      │
│ - Statuses    │ │ - Item costs  │             │ - Deliverables  │ │ - Payee vendor  │
└───────────────┘ └───────────────┘             └─────────────────┘ └─────────────────┘
```

#### A. Task Management
* Tasks represent planning milestones (e.g., "Confirm floral mockup", "Finalise seating chart", "Tasting session").
* Attributes: Title, Description, Due Date, Priority (`low`, `medium`, `high`, `critical`), Status (`pending`, `in_progress`, `completed`, `cancelled`), Assignee (`user_id`).

#### B. Procurement Lifecycle
* Covers physical goods, rentals, and equipment sourced specifically for the event (e.g., 200 Chiavari chairs, custom monogrammed dance floor, 50 centerpieces).
* Status progression: `needed` $\rightarrow$ `requested` $\rightarrow$ `ordered` $\rightarrow$ `acquired` (or `cancelled`).
* Keeps track of Estimated Cost vs. Actual Purchase Cost to alert planners of supply price inflation.

#### C. Vendor Directory & Event Allocations
* Reusable master vendor directory (caterers, florists, audiovisual technicians, pyrotechnics, security, mixologists).
* Junction table `event_vendors` links specific vendors to events with agreed contractor pricing, assigned briefing documents, and delivery timelines.

#### D. Expense Logging & True Event Profitability
* Operating expenses logged against specific events with vendor associations, invoice numbers, and digital receipts in Supabase Storage.
* Calculation of **Gross Event Margin**:
  $$\text{Gross Margin} = \text{Agreed Event Revenue} - \sum(\text{Verified Event Expenses})$$
* Calculation of **Realized Cash Margin**:
  $$\text{Realized Cash Margin} = \sum(\text{Collected Payments}) - \sum(\text{Disbursed Expenses})$$

---

## 5. Security, Access Control & Multi-Tenancy

### Role-Based Access Control (RBAC) Matrix
The platform incorporates business membership roles associated with the authenticated workspace:

| Permission / Capability | Owner | Manager | Planner | Assistant |
| :--- | :---: | :---: | :---: | :---: |
| View Financial Reports & Total Profits | ✅ | ✅ | ❌ | ❌ |
| Record / Verify Payments | ✅ | ✅ | ❌ | ❌ |
| Record Event Expenses | ✅ | ✅ | ✅ | ❌ |
| Convert Enquiries to Confirmed Events | ✅ | ✅ | ❌ | ❌ |
| Manage Clients & Event Master Data | ✅ | ✅ | ✅ | ❌ |
| Create & Update Tasks / Procurement | ✅ | ✅ | ✅ | ✅ |
| View Calendar & Assigned Tasks | ✅ | ✅ | ✅ | ✅ |
| Manage Staff Accounts & Roles | ✅ | ❌ | ❌ | ❌ |
| Edit Business Settings & Billing | ✅ | ❌ | ❌ | ❌ |

### Row Level Security (RLS) Mandate
* Every private table (`clients`, `events`, `payments`, `expenses`, `tasks`, `procurement_items`, `vendors`) possesses a `business_id` foreign key.
* RLS policies ensure authenticated users can only query or mutate rows where `business_id` matches the business they belong to via `business_members`.
* Public submissions to `booking_inquiries` occur through an Edge Function executing with controlled validation, or via an insert-only public RLS policy that prevents unauthenticated select access.

---

## 6. Definition of Phase 1 Success
This Business Discovery phase is deemed complete when all operational workflows, financial equations, customer personas, and security boundaries have been formally codified into documentation without inventing unsubstantiated business details.
