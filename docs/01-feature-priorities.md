# ASEVA — Feature Prioritisation Matrix

**Document Reference:** `docs/01-feature-priorities.md`  
**Phase:** 1 — Business Discovery and Product Requirements  
**Status:** Approved for Implementation Roadmap  

---

## 1. Prioritisation Framework

Features are classified according to business criticality, risk profile, and technical dependencies:

* **P0 (Critical / Non-Negotiable):** Core capabilities required for the platform to be functional, secure, and usable for real business operations. Without these, the business cannot operate.
* **P1 (Important / High-Value):** Capabilities that enhance automation, improve visibility, and streamline daily operational workflows, scheduled for the primary production release.
* **P2 (Advanced / Post-MVP):** Sophisticated optimizations, deeper analytics, third-party expansions, and luxury enhancements that can be introduced iteratively post-launch.

---

## 2. Feature Priority Matrix

### 2.1 Public-Facing Marketing Website

| ID | Feature Name | Description | Priority | Complexity | Dependencies |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **PUB-01** | Editorial Brand Home Page | High-impact hero section, brand ethos, services highlights, featured event work, CTA banners. | **P0** | Medium | UI Design System |
| **PUB-02** | Services & Detail Catalog | Dynamic listing of services with descriptions, inclusions, and starting price points loaded from database. | **P0** | Medium | DB Services Table |
| **PUB-03** | Portfolio Gallery & Filtering | Filterable showcase of past events by category (Weddings, Galas, Corporate) with high-res photography. | **P0** | Medium | DB Portfolio Table |
| **PUB-04** | Booking Enquiry Form | Multi-field validation form (Zod + React Hook Form) capturing client contact, event date, guest count, and budget. | **P0** | Medium | Edge Function / DB |
| **PUB-05** | Booking Confirmation Screen | Clear confirmation page giving user a unique inquiry tracking code and setting expectations. | **P0** | Low | PUB-04 |
| **PUB-06** | About & FAQs Pages | Brand story, company values, and expandable FAQs addressing key client booking questions. | **P0** | Low | UI Components |
| **PUB-07** | Contact Page | Direct telephone, email, consultation address, and operating hours. | **P0** | Low | None |
| **PUB-08** | Anti-Spam / Rate Limiting | Honeypot fields and Edge Function rate-limiting on inquiry submissions to prevent bot spam. | **P0** | Medium | Edge Function |
| **PUB-09** | GSAP Scroll Storytelling | Cinematic scroll animations, pinned image reveals, and smooth transitions. | **P1** | High | GSAP Integration |
| **PUB-10** | Detailed Portfolio Case Studies | Deep-dive individual event pages (`/portfolio/:slug`) with design narratives and vendor credits. | **P1** | Medium | PUB-03 |
| **PUB-11** | Transactional Client Email | Automated branded email confirmation dispatched to client upon inquiry submission via Resend. | **P1** | Medium | Resend API / Edge Fn |
| **PUB-12** | Social Share & Open Graph | Dynamic meta tags, social share cards, and structured JSON-LD business schema. | **P1** | Low | SEO Architecture |

---

### 2.2 Private Management Dashboard

| ID | Feature Name | Description | Priority | Complexity | Dependencies |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **DSH-01** | Staff Authentication & Auth Guards | Secure email/password login, session persistence, logout, and protected route wrappers. | **P0** | Medium | Supabase Auth |
| **DSH-02** | Executive Overview Dashboard | High-level metrics: active events, pending enquiries, cash collected, outstanding balances, upcoming events. | **P0** | Medium | DB Schema & RPC |
| **DSH-03** | Enquiry Management Pipeline | Table of enquiries, search/filter, detail view, status transitions (`new`, `under_review`, `quoted`, `declined`). | **P0** | Medium | DB Enquiries Table |
| **DSH-04** | Enquiry Conversion Engine | Atomic conversion of an accepted enquiry into a client entity and confirmed event record. | **P0** | High | DB Functions / RPC |
| **DSH-05** | Client Directory & History | Master client list with search, contact cards, and complete event/payment history. | **P0** | Medium | DB Clients Table |
| **DSH-06** | Event Master Management | Detailed event workspaces with title, type, venue, date, guest count, agreed price, and status. | **P0** | Medium | DB Events Table |
| **DSH-07** | Manual Payment Recording | Recording of bank transfers/cash with integer kobo amounts, transaction references, dates, and receipts. | **P0** | Medium | DB Payments Table |
| **DSH-08** | Dynamic Balance Calculation | Exact outstanding balance computation derived from agreed price minus verified payments. | **P0** | Medium | DB Computed Logic |
| **DSH-09** | Event Task Management | Creation, assignment, due dates, priority levels, and completion toggles for planning milestones. | **P0** | Medium | DB Tasks Table |
| **DSH-10** | Event Expense Logging | Logging of operating expenses with categories, amounts, receipts, and vendor links. | **P0** | Medium | DB Expenses Table |
| **DSH-11** | Vendor Rolodex | Reusable vendor directory with categories, contacts, locations, and bank details. | **P0** | Low | DB Vendors Table |
| **DSH-12** | Event Procurement Tracker | Itemized tracking of equipment and rentals with status (`needed`, `ordered`, `acquired`). | **P1** | Medium | DB Procurement Table|
| **DSH-13** | Payment Milestone Schedules | Generating structured payment milestones (Deposit, Mid-term, Final balance) with due dates. | **P1** | Medium | DB Schedules Table |
| **DSH-14** | Interactive Master Calendar | Monthly and weekly calendar showing events, task deadlines, payment milestones, and deliveries. | **P1** | High | Calendar Component |
| **DSH-15** | Paystack Online Payments | Paystack checkout initialization and webhook verification for automated payment tracking. | **P1** | High | Paystack Edge Fn |
| **DSH-16** | Financial & Profitability Reports | Charts (Recharts) displaying cash inflow vs. outflow, profit margins per event, and category breakdowns. | **P1** | High | Recharts / Aggregates |
| **DSH-17** | Staff Notification System | In-app alerts for new enquiries, overdue tasks, and payment due dates. | **P1** | Medium | DB Notifications |
| **DSH-18** | User Role-Based Access (RBAC) | Strict permission enforcement separating Owner, Manager, Planner, and Assistant capabilities. | **P1** | High | Supabase RLS |
| **DSH-19** | Audit Logging | Immutable log tracking who modified payments, contracts, expenses, and event parameters. | **P2** | Medium | DB Activity Logs |
| **DSH-20** | PDF Invoice & Receipt Export | Automated generation of branded PDF invoices and payment receipts for clients. | **P2** | High | PDF Generation Engine |
| **DSH-21** | Bulk CSV Data Export | Exporting financial summaries, vendor directories, and task lists to CSV/Excel. | **P2** | Low | Frontend Utility |

---

### 2.3 Backend Infrastructure, Database & Security

| ID | Feature Name | Description | Priority | Complexity | Dependencies |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **INF-01** | Relational Database Migrations | Structured SQL migrations defining 18 normalized tables with foreign keys, checks, and indexes. | **P0** | High | Supabase CLI |
| **INF-02** | Integer Kobo Financial Standard | Database-level constraints ensuring all monetary fields are non-negative `BIGINT` kobo values. | **P0** | Low | SQL DDL |
| **INF-03** | Row Level Security (RLS) | Comprehensive RLS policies isolating business tenant data and enforcing least-privilege access. | **P0** | High | Supabase RLS |
| **INF-04** | Public Booking Edge Function | Secure Edge Function endpoint validating public inquiries and creating database records. | **P0** | Medium | Supabase Deno Edge |
| **INF-05** | Supabase Storage Buckets | Public bucket for portfolio images; private buckets for receipts, contracts, and internal documents. | **P0** | Medium | Supabase Storage |
| **INF-06** | Paystack Webhook Edge Function | Webhook handler validating HMAC SHA512 signatures and executing idempotent payment updates. | **P1** | High | Paystack Secret |
| **INF-07** | Resend Email Edge Function | Edge Function dispatching transactional emails to clients and staff upon key milestones. | **P1** | Medium | Resend API Key |
| **INF-08** | Automated Database Backup | Continuous WAL archiving and scheduled backup verification. | **P1** | Medium | Supabase Infra |

---

## 3. Scope Definition for Release Phases

### Minimum Viable Product (MVP / Release 1.0)
The primary milestone focuses on deploying the complete **P0** capability set:
1. Public website delivering brand credibility and capturing qualified leads via the booking inquiry form.
2. Direct ingestion into Supabase with automated staff visibility.
3. Authenticated dashboard enabling staff to triage leads, convert to clients, create events, log tasks, record manual payments (bank transfers/cash in kobo), record expenses, and observe real-time balance calculations.
4. Total database isolation and security via Supabase RLS.

### Release 1.1 (Automation & Financial Expansion)
Encompasses the **P1** scope:
1. Paystack online payment integration with cryptographically verified webhooks.
2. Interactive multi-view master calendar.
3. Resend email dispatching for instant customer confirmations.
4. Advanced financial charts (cash flow, expense category distributions, gross margins).
5. Granular RBAC permissions distinguishing Planners from Managers/Owners.

### Release 2.0 (Enterprise Scaling)
Encompasses the **P2** scope:
1. Branded PDF invoice and quotation generator.
2. Client portal with self-service moodboard and payment viewing.
3. Automated WhatsApp/SMS alerts for event countdowns.
4. Exportable CSV financial archives.
