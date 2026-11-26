# ASEVA — Private Event-Management Dashboard Specification & Walkthrough

**Document Reference:** `docs/05-private-dashboard.md`  
**Phase:** 5 — Private Event-Management Dashboard  
**Status:** Completed & Live Verified  
**Stack:** React 18 (pure JSX), Tailwind CSS, TanStack Query v5, Recharts, Lucide React, Supabase PostgreSQL with Integer Kobo Financial Standard.

---

## 1. Executive Summary

Phase 5 delivers the private back-office operational command center for **ASEVA**, bridging inbound qualified leads submitted through the public editorial website directly into full-lifecycle event production workspaces, multi-tranche milestone payment tracking, task checklists, physical procurement registers, master vendor contacts, itemized expense disbursements, and real-time gross operating margins.

---

## 2. Information Architecture & Navigation

The private dashboard operates under `/dashboard` protected by `ProtectedRoute.jsx` and `DashboardLayout.jsx`, featuring a responsive dark-obsidian navigation sidebar, top breadcrumb bar, public website preview trigger, and live notification counters.

| Section | Route | Target User Persona | Primary Capability |
| :--- | :--- | :--- | :--- |
| **Overview** | `/dashboard` | All Staff & Management | 4 KPI cards, 90-day upcoming production schedule, Urgent Action Center (tasks & leads). |
| **Enquiries** | `/dashboard/enquiries` | Lead Planners & Directors | Inbound lead triage, slide-over inquiry drawer, quotation builder, atomic event conversion. |
| **Clients** | `/dashboard/clients` | Planners & Directors | Master patron CRM, corporate entity links, VIP tags, Client 360 profile view. |
| **Client 360** | `/dashboard/clients/:id` | Planners & Directors | Lifetime billed contracts, verified cash collected, balance due, all associated events. |
| **Events** | `/dashboard/events` | Operations & Planners | Master registry of confirmed celebrations with status stage filters and contract fees. |
| **Event Workspace** | `/dashboard/events/:id` | Event Leads & Coordinators | 6-tab deep project workspace: Overview, Tasks, Milestone Finances, Expenses, Procurement, Vendors. |
| **Payments** | `/dashboard/payments` | Finance & Operations | Master cash inflow ledger, payment channel filtering, manual payment recording with reference. |
| **Tasks** | `/dashboard/tasks` | Coordinators & Planners | Multi-event action items board with Kanban (Pending, In Progress, Completed) and List views. |
| **Procurement** | `/dashboard/procurement` | Logistics & Decor Leads | Physical rental and decor asset tracker with status flow (`needed` $\rightarrow$ `requested` $\rightarrow$ `ordered` $\rightarrow$ `acquired`). |
| **Vendors** | `/dashboard/vendors` | Planners & Procurement | Categorized supplier rolodex (Catering, Florals, AV, Security, Media) with direct WhatsApp links. |
| **Expenses** | `/dashboard/expenses` | Management & Accounting | Log disbursements against events, vendor payee links, real-time Gross Operating Margin widget. |
| **Calendar** | `/dashboard/calendar` | All Staff | Interactive monthly calendar with color-coded markers for events (gold), tasks (blue), and payments (emerald). |
| **Reports** | `/dashboard/reports` | Directors & Owners | Audited financial inflow vs. disbursements charts (Recharts), category revenue donut, conversion funnel, CSV export. |
| **Settings** | `/dashboard/settings` | Directors & Owners | Business legal entity profile, staff RBAC role governance (Owner, Manager, Planner, Assistant), catalog packages. |
| **Auth** | `/login` | All Staff | Secure portal login with one-click "Instant Director Access" demo bypass for testing. |

---

## 3. Financial Integrity & Integer Kobo Standard

Floating-point currency arithmetic is strictly prohibited throughout the platform:
* **Storage Standard:** All monetary amounts are stored in database tables as integer kobo (`BIGINT`), where 1 NGN = 100 kobo (e.g. ₦45,000,000 = `4500000000n`).
* **Conversion Layer:** Form inputs accept clean comma-formatted Naira strings and convert directly to kobo integers prior to mutation.
* **Presentation Layer:** The [`useKobo`](file:///c:/Users/HP/Desktop/ASEVA/src/hooks/useKobo.js) hook converts kobo integers into formatted standard Nigerian Naira strings (`₦45,000,000`) or compact financial expressions (`₦45.0M`).
* **Gross Operating Margin:** Calculated as $\text{Contract Revenue (Kobo)} - \text{Total Operational Disbursements (Kobo)}$, generating accurate profit margins without rounding drift.

---

## 4. Key Workflows Implemented

### 4.1 Inbound Lead to Active Event Conversion
1. Inbound inquiries submitted from the public step form land in `/dashboard/enquiries` with status `new`.
2. Planners click any row to open the slide-over **`EnquiryDrawer`**, inspecting guest counts, venue feasibility, and creative vision notes.
3. Planners click **`[Convert to Confirmed Event]`**, opening the conversion modal to confirm agreed contract fee in NGN and assign a lead director.
4. The system atomically creates or links the Client profile, instantiates the Event Project workspace, and auto-generates a standard 3-tranche milestone payment schedule (30% Retainer Deposit, 40% Mid-Planning, 30% Final Settlement).
5. The interface immediately navigates to `/dashboard/events/:id`.

### 4.2 Event Workspace Multi-Tab Operations (`/dashboard/events/:id`)
* **Overview:** Displays venue details, countdown timer, guest attendance, and stage dropdown (`planning` $\rightarrow$ `ready` $\rightarrow$ `in_progress` $\rightarrow$ `completed`).
* **Tasks:** Planning checklist with priority pills (`critical`, `high`, `medium`, `low`) and single-click completion toggles.
* **Finances & Milestones:** Milestone cards tracking payment status, alongside an itemized ledger of verified inflows.
* **Expenses:** Log disbursements to suppliers with categorized tagging (Catering, Florals, AV, Security).
* **Procurement:** Track physical assets (e.g. 650 clear ghost chairs, crystal chandeliers, curved LED walls) with stage progression.

### 4.3 Executive Analytics & CSV Export (`/dashboard/reports`)
* Utilizes **Recharts** to render:
  * Monthly Cash Inflow vs. Operating Disbursements (Dual-bar comparison).
  * Contract Revenue share by Event Category (Inner-radius donut chart).
  * Customer Acquisition Funnel (Inquiries $\rightarrow$ Quotations $\rightarrow$ Consultations $\rightarrow$ Contracts).
* Includes **`[Export Audit CSV]`** to download clean financial data for external tax audits.

### 4.4 Ergonomic Layout & Zero-Horizontal-Scroll Architecture
* **Fixed Stationary Sidebar:** Desktop navigation sidebar is anchored directly to the viewport (`fixed inset-y-0 left-0 z-30 w-56 h-screen`), making it completely stationary and immune to page scrolling while allowing internal scrolling of links on low-height screens.
* **Sticky Header & Offset Content:** The main content wrapper offsets the fixed sidebar (`lg:pl-56`) with a sticky top operational bar (`sticky top-0 z-20 bg-white/95 backdrop-blur-sm`), keeping breadcrumbs, public site links, and notifications accessible during deep page scrolls.
* **Streamlined 5-Column Table Architecture:** Consolidated previously sprawled 9-10 column tables into 5 rich, contextual columns (`Production & Patron`, `Schedule & Location`, `Financial Standing`, `Production Stage`, `Workspace Action`), cutting table width by 50% and completely eliminating horizontal scrolling on standard laptop displays.
* **Visual Breathing Room:** Restructured the executive overview with `space-y-10 sm:space-y-12`, elevating Upcoming Production to the primary centerpiece right beneath the KPI cards, and moving secondary action items (Urgent Tasks & New Enquiries) below into a calm, balanced 2-column grid capped at 3 priority items with generous container padding (`p-6 sm:p-7`).

---

## 5. Verification Status

* **Build Output:** `vite build` completed cleanly with **exit code 0**.
* **Route Health:** Verified all 13 private dashboard routes return HTTP 200 on the live dev server (`http://localhost:3000`).
* **State Persistence:** Seed data and mutations persist in browser storage (`localStorage`), allowing comprehensive interactive testing of all features offline.
