# ASEVA — Booking Qualification Workflow & Edge Ingestion

**Document Reference:** `docs/04-booking-workflow.md`  
**Phase:** 4 — Public Website and Booking System  
**Status:** Approved Workflow Specification  
**Monetary Scope:** Qualification Bracket in NGN $\leftrightarrow$ Converted Contract in Integer Kobo  

---

## 1. End-to-End Customer Booking Lifecycle

```
[PROSPECTIVE CLIENT]
        │
        ├─► Browses Editorial Portfolio & Services at /services
        │
        ├─► Navigates to /book (Pre-selected service if clicked from service detail)
        │
        ▼
[BOOKING FORM QUALIFICATION]
        │
        ├─► Client inputs contact, preferred future date, location, guest & budget brackets
        ├─► Hidden honeypot field (_hp) validates non-bot human behavior
        ├─► React Hook Form + Zod validates all inputs client-side
        │
        ▼
[SECURE EDGE SUBMISSION]
        │
        ├─► Edge Function: /functions/v1/submit-inquiry (or Supabase PostgREST insert)
        ├─► Database-level constraints enforce data integrity
        ├─► Unique Reference Code generated (e.g. ASV-2027-4821)
        ├─► Row inserted into `booking_inquiries` with initial status: 'new'
        │
        ├──► [RESEND TRANSACTIONAL EMAIL: Client Confirmation]
        └──► [RESEND ADMINISTRATIVE EMAIL: ASEVA Concierge Alert]
        │
        ▼
[CLIENT REASSURANCE]
        │
        └─► Redirected to /booking-confirmed with tracking reference & 3-step next steps
        │
        ▼
[OPERATIONAL DASHBOARD TRIAGE]
        │
        ├─► Appears in /dashboard/enquiries with status 'new'
        ├─► Director conducts calendar feasibility check
        ├─► Moves to 'under_review' ──► Discovery Call ──► 'quotation_sent'
        │
        ├─► If Accepted & Retainer Verified:
        │     Atomic RPC `convert_inquiry_to_booking()` creates Client & Event Workspace
        │
        └─► If Infeasible / Rejected:
              Status updated to 'declined' with internal reason code
```

---

## 2. Booking Enquiry Form Specification

### 2.1 Form Field Definitions & Validation Rules

| Field Name | Type | Validation Rule | Purpose & Guidance |
| :--- | :--- | :--- | :--- |
| **`fullName`** | `text` | Required, min 3, max 255 chars | Primary contact name for proposal. |
| **`email`** | `email` | Valid email format | Primary proposal and invoicing recipient. |
| **`phone`** | `tel` | Min 10, max 25 chars | WhatsApp number for scheduling consultation. |
| **`eventType`** | `select` | Enum: `wedding`, `corporate`, `social`, `styling`, `other` | Categorizes the nature of the production. |
| **`preferredDate`** | `date` | Required, strictly future date | Primary celebration date. |
| **`alternateDate`** | `date` | Optional | Secondary date if primary is booked. |
| **`location`** | `text` | Required, min 2 chars | Target city (e.g., Victoria Island, Lagos). |
| **`venueName`** | `text` | Optional | Secured venue if already contracted. |
| **`guestCount`** | `select` | `50-100`, `101-250`, `251-500`, `500+` | Staffing and seating capacity benchmark. |
| **`estimatedBudget`**| `select` | `₦5M-₦10M`, `₦10M-₦25M`, `₦25M-₦50M`, `₦50M+` | Informs proposal tier and procurement feasibility. |
| **`visionNotes`** | `textarea` | Optional | Thematic ideas, cultural ceremonies, notes. |
| **`referralSource`**| `select` | `Instagram`, `Past Event`, `Referral`, `Press` | Marketing acquisition channel tracking. |
| **`_hp`** | `hidden` | Max 0 length | Honeypot field; filled only by automated spam bots. |

---

## 3. Anti-Abuse & Security Architecture

1. **Client-Side Honeypot:** A hidden field (`_hp`) with `tabIndex="-1"` and `autoComplete="off"` is imperceptible to human users. Any submission with content in `_hp` is immediately dropped.
2. **Date Sanity Verification:** The form prevents selection of past or present-day dates, requiring dates to be in the future.
3. **Least-Privilege Database Isolation:** Public visitors possess insert-only privileges to `booking_inquiries`. Row Level Security (RLS) strictly blocks anonymous callers from selecting, listing, updating, or deleting any enquiry records.
4. **Duplicate Submission Protection:** The form submission button disables and displays a loading spinner immediately upon submit, preventing accidental double-posts.

---

## 4. Transactional Email Integration (Resend)

Configured within the backend Supabase Edge Function (`supabase/functions/submit-inquiry/index.ts`):
* **Trigger:** Successfully inserted row in `booking_inquiries`.
* **Client Confirmation Email:**
  * Sender: `ASEVA Concierge <concierge@asevaevents.com>`
  * Recipient: Client's submitted email
  * Content: Formal branded acknowledgement, booking reference code, date recap, and 24–48 hour timeline expectation.
* **Staff Administrative Alert:**
  * Recipient: ASEVA internal team email (`concierge@asevaevents.com`)
  * Content: Immediate notification with client name, phone, event type, date, budget bracket, and direct dashboard review link.
* **Fault Isolation:** Email dispatch failures are caught and logged without aborting the successful creation of the database record.
