# ASEVA — Private Management Dashboard Wireframes & UX Patterns

**Document Reference:** `docs/03-dashboard-wireframes.md`  
**Phase:** 3 — UI/UX Design System and Interface Architecture  
**Status:** Approved Layout Architecture  
**Design Standard:** Professional High-Density Operational Workspace  

---

## 1. Master Dashboard Shell Layout (`DashboardLayout`)

```text
┌─────────────────┬────────────────────────────────────────────────────────┐
│ [ASEVA WORKSPACE]│ [TOPBAR: Breadcrumbs | Public Site Link | Bell | Profile]│
├─────────────────┼────────────────────────────────────────────────────────┤
│ • Overview      │ [PAGE HEADER: Title | Subtitle | Primary Action Button] │
│ • Enquiries (3) │                                                        │
│ • Clients       │ ┌──────────────┬──────────────┬──────────────┬─────────┐ │
│ • Events (6)    │ │ Active Evts  │ New Inquiries│ Cash Recv'd  │ Balance │ │
│ • Payments      │ │      6       │      3       │  ₦21.5M      │ ₦13.0M  │ │
│ • Tasks         │ └──────────────┴──────────────┴──────────────┴─────────┘ │
│ • Procurement   │                                                        │
│ • Vendors       │ ┌────────────────────────────────────────────────────┐ │
│ • Expenses      │ │ [SEARCH / FILTER TOOLBAR]                          │ │
│ • Calendar      │ ├────────────────────────────────────────────────────┤ │
│ • Reports       │ │ [DATA TABLE WITH TABULAR AMOUNTS & STATUS PILLS]   │ │
│ • Settings      │ │ • Rows with hover highlight                        │ │
│ ────────────────│ │ • Monospace kobo calculations                      │ │
│ [User Profile]  │ │ • Row-level quick action triggers                  │ │
│ [Sign Out]      │ └────────────────────────────────────────────────────┘ │
└─────────────────┴────────────────────────────────────────────────────────┘
```

---

## 2. Core Dashboard UI Interaction Patterns

### 2.1 The Operational Drawer (Slide-Over Pattern)
* **Usage:** Viewing full enquiry details, client 360 profiles, quick-editing event briefs, or inspecting expense receipts without navigating away from the current table.
* **Layout:**
  * Width: 480px on desktop (full-width on mobile).
  * Header: Entity title, status badge, close `(X)` button.
  * Body: Scrollable grouped data cards with key-value pairs, notes thread, and activity logs.
  * Footer: Sticky bottom action bar (`[Save Changes]`, `[Cancel]`, or contextual action like `[Convert to Event]`).

### 2.2 Confirmation Dialog Pattern
* **Usage:** Destructive or critical operations (e.g., declining an enquiry, cancelling an event, deleting a task, voiding a payment).
* **Components:**
  * Warning icon (rose-toned circle).
  * Clear title: e.g. "Decline Booking Enquiry?"
  * Explanation: "This action will archive enquiry ASV-2027-1042. You will be prompted to record a reason for internal audit."
  * Action buttons: Primary `[Confirm & Decline]` (Rose button), Secondary `[Keep Active]` (Neutral button).

### 2.3 Empty State Pattern
* **Usage:** Displayed when a table has zero rows (new setup or zero filter matches).
* **Components:**
  * Centered muted icon (`Package`, `Calendar`, `Users`).
  * Headline: "No records located".
  * Subtext: "No confirmed payments recorded for this event. Record a manual bank transfer or verify a Paystack reference."
  * Action: Prominent button to create the first record.

### 2.4 Loading Skeleton Pattern
* **Usage:** Rendered while TanStack Query fetches server data.
* **Geometry:** Exact replicas of card headers, metric values, and table rows using `bg-sand-200 animate-pulse` to prevent layout shifts.

---

## 3. Section-by-Section Dashboard Wireframes

### 3.1 Overview (`/dashboard`)
* **KPI Metrics Grid (4 Cards):**
  * *Active Confirmed Events* (Count + link to `/dashboard/events`).
  * *New Enquiries* (Count + blue badge alert).
  * *Cash Collected (NGN)* (Integer kobo formatted to compact millions, e.g., ₦21.5M).
  * *Outstanding Balance Due (NGN)* (Agreed event fees minus confirmed payments).
* **Upcoming Production Schedule Table:** Next 5 confirmed events with dates, clients, venues, contract fee in NGN, payment status badge (`fully_paid`, `partially_paid`, `unpaid`), and event status badge (`planning`, `ready`).
* **Urgent Action Center (Split Card):**
  * Left: Overdue and upcoming 7-day planning tasks.
  * Right: Inbound enquiries awaiting review (> 24 hours).

---

### 3.2 Enquiry Pipeline (`/dashboard/enquiries`)
* **Toolbar:** Search bar (by name, email, ref code), status tabs (`All`, `New`, `Under Review`, `Quotation Sent`, `Accepted`, `Declined`), and date range filter.
* **Data Table:**
  * Columns: Ref Code, Client Name & Contact, Event Type, Target Date, Budget Bracket, Status Badge, Action Button.
* **Interactive Drawer (`EnquiryDrawer`):**
  * Opens on row click.
  * Displays guest count, location, venue, vision notes, and staff notes.
  * Primary Actions:
    * `[Prepare Quotation]`: Opens modal to set quoted price in kobo.
    * `[Convert to Event & Client]`: Triggers atomic RPC procedure with milestone payment schedule builder.
    * `[Decline]`: Prompts for decline reason code.

---

### 3.3 Client Directory (`/dashboard/clients`)
* **Grid / Table Toggle:**
  * Cards displaying: Client full name, corporate entity, contact coordinates (phone with one-click WhatsApp link, email), total lifetime events count, and total billed kobo.
* **Client 360 View (`/dashboard/clients/:id`):**
  * Detailed history showing all associated events (active and past), total payments received, balance due, and internal relationship notes.
* **Action:** `[Add New Client]` modal for offline corporate accounts.

---

### 3.4 Event Workspaces (`/dashboard/events` & `/dashboard/events/:id`)
* **List View:** Table of confirmed events with filter by status (`planning`, `ready`, `in_progress`, `completed`, `cancelled`).
* **Event Workspace Tabs (`/dashboard/events/:id`):**
  1. **Overview Tab:** Hero event countdown timer, venue address, guest count, agreed contract fee (kobo), total paid (kobo), outstanding balance (kobo), lead planner in charge.
  2. **Tasks Tab:** Planning milestones checklist with priority pills (`critical`, `high`, `medium`, `low`) and completion checkboxes.
  3. **Finances Tab:** Payment milestone schedule (Deposit, Mid-term, Final), payment transaction history with receipts, and balance calculation.
  4. **Expenses Tab:** Itemized operational expenses, categorized spend, vendor disbursement links, and gross profit margin computation.
  5. **Procurement Tab:** Equipment, furniture, and decor item requisitions with status tracker (`needed`, `requested`, `ordered`, `acquired`).
  6. **Vendors Tab:** Contracted event suppliers, contracted fees, assigned contact persons, and delivery briefs.

---

### 3.5 Payment Management (`/dashboard/payments`)
* **Financial Hub View:**
  * Top Cards: Total Booked Contract Value | Total Cash In Bank | Total Overdue Receivables.
  * Filter Toolbar: Method (`bank_transfer`, `paystack`, `cash`, `pos`), Status (`confirmed`, `pending`), Event selector.
  * Payment Inflow Table: Payment Date, Event Title, Amount (NGN Kobo), Method, Reference Code, Recorded By Staff, Receipt Link.
* **Manual Payment Modal (`RecordPaymentModal`):**
  * Form fields: Event Selector, Payment Milestone (optional), Amount (Naira input converted automatically to kobo), Payment Method, Transaction Reference (mandatory unique string), Date & Time Received, Receipt File Upload (Supabase Storage), Staff Notes.

---

### 3.6 Task Management (`/dashboard/tasks`)
* **Multi-Event Task Board:**
  * View toggle: Tabular list or Kanban columns (`Pending`, `In Progress`, `Completed`).
  * Filter by: Specific Event, Assigned Staff Member, Priority Level, Due Date (Overdue, Today, This Week).
  * Quick-actions: Single-click status progression and assignee re-assignment.

---

### 3.7 Procurement & Asset Management (`/dashboard/procurement`)
* **Central Procurement Register:**
  * Tracks physical rental items across all active events (e.g. 500 Chiavari chairs, staging truss, floral arches).
  * Status Flow Pills: `needed` (Grey) $\rightarrow$ `requested` (Amber) $\rightarrow$ `ordered` (Blue) $\rightarrow$ `acquired` (Emerald).
  * Cost tracking: Compares Estimated Cost vs. Actual Purchase Cost to identify cost variances early.

---

### 3.8 Vendor Directory (`/dashboard/vendors`)
* **Master Supplier Rolodex:**
  * Categorized: *Catering*, *Florals & Decor*, *Audiovisual & Lighting*, *Photography*, *Security & Protocol*, *Entertainment & MCs*.
  * Profile Card: Business name, contact representative, telephone, email, city, bank details (for wire transfers), internal performance rating (1–5 stars).
  * Event Association: Displays which upcoming events this vendor is contracted for.

---

### 3.9 Expense Logging & Profitability (`/dashboard/expenses`)
* **Expense Log:**
  * Logged disbursements against events.
  * Columns: Date, Event Name, Category, Description, Vendor Payee, Amount (Kobo), Payment Method, Receipt Document Link.
* **Profitability Analytics Widget:**
  * Displays: Contract Revenue (NGN) $-$ Recorded Expenses (NGN) $=$ **Gross Operating Margin (NGN & %)**.

---

### 3.10 Master Interactive Calendar (`/dashboard/calendar`)
* **Calendar Views:** Monthly grid and Weekly schedule.
* **Unified Event Markers:**
  * Gold dots: Event production dates (setup, event day, teardown).
  * Blue dots: Task due dates.
  * Emerald dots: Payment milestone due dates.
  * Amber dots: Procurement delivery deadlines.
* **Interaction:** Clicking any date or marker opens a popover summary with direct navigation to the workspace.

---

### 3.11 Business Reports & Performance (`/dashboard/reports`)
* **Executive Charts (Recharts):**
  * *Monthly Cash Inflow vs. Operating Disbursements* (Bar / Area chart).
  * *Event Category Revenue Share* (Donut ring chart).
  * *Enquiry Conversion Rate* (Funnel: Inquiries $\rightarrow$ Quoted $\rightarrow$ Confirmed).
  * *Average Gross Margin per Event Type*.
* **Export Controls:** Button to export clean CSV datasets for external tax and accounting audits.

---

### 3.12 Workspace Settings (`/dashboard/settings`)
* **Settings Tabs:**
  1. **Business Profile:** Legal Name, Trading Name, Logo, Studio Address, Default Currency (NGN), Timezone (`Africa/Lagos`).
  2. **Team Members & RBAC:** Invite staff by email, assign roles (`owner`, `manager`, `planner`, `assistant`), toggle active access status.
  3. **Catalog Management:** Add/edit public services, service packages, starting fees, and display order.
