# ASEVA — Page Data Contracts & Frontend Validation Specs

**Document Reference:** `docs/03-data-contracts.md`  
**Phase:** 3 — UI/UX Design System and Interface Architecture  
**Status:** Approved Data Contract Specification  
**Monetary Standard:** Integer Kobo (`BIGINT` in DB $\leftrightarrow$ Formatted NGN in UI)  

---

## 1. Overview & Type Synchronization Strategy

To ensure zero drift between the PostgreSQL database constraints and frontend forms:
1. **Field Naming Convention:**
   * Database columns: `snake_case` (e.g. `agreed_price_kobo`, `preferred_date`, `is_active`).
   * Frontend form models / Zod schemas: `camelCase` (e.g. `fullName`, `preferredDate`, `amountNaira`), converted at service boundaries into database column names.
2. **Financial Precision:**
   * User inputs are collected in decimal Naira (e.g. `₦3,500,000.00`).
   * Before sending to Supabase PostgREST or Edge Functions, they are converted into integer kobo (`350000000`).
   * Displays retrieve `*_kobo` columns and format via `formatKoboToNaira()`.
3. **Date Formats:**
   * Database timestamps: ISO 8601 UTC strings (`timestamptz`).
   * Form date pickers: ISO date strings (`YYYY-MM-DD`).
   * Display presentations: Lagos timezone (`d MMMM yyyy`).

---

## 2. Public Interface Data Contracts

### 2.1 Public Services Catalog
* **Consumer:** `/services` and `/services/:slug`
* **Source:** Table `services` LEFT JOIN `service_packages`
* **Filter:** `is_active = true`
* **Data Contract Schema:**
```typescript
interface PublicServiceContract {
  id: string; // UUID
  title: string; // VARCHAR(255)
  slug: string; // VARCHAR(255)
  short_description: string;
  full_description: string | null;
  category: 'wedding' | 'corporate' | 'social' | 'styling' | 'other';
  starting_price_kobo: number; // BIGINT (0 or positive)
  image_url: string | null;
  is_featured: boolean;
  display_order: number;
  service_packages: Array<{
    id: string;
    name: string;
    description: string | null;
    price_kobo: number;
    inclusions: string[]; // JSONB array of strings
    is_popular: boolean;
  }>;
}
```

---

### 2.2 Public Portfolio Case Studies
* **Consumer:** `/portfolio` and `/portfolio/:slug`
* **Source:** Table `portfolio_items`
* **Filter:** `is_published = true`
* **Data Contract Schema:**
```typescript
interface PublicPortfolioContract {
  id: string; // UUID
  title: string; // VARCHAR(255)
  slug: string; // VARCHAR(255)
  event_type: string; // VARCHAR(100)
  client_name: string | null;
  event_date: string | null; // ISO YYYY-MM-DD
  location: string; // e.g. "Eko Atlantic, Lagos"
  guest_count: number | null;
  cover_image_url: string;
  gallery_images: string[]; // JSONB array of URLs
  narrative: string | null;
  testimonial: string | null;
  testimonial_author: string | null;
  is_featured: boolean;
}
```

---

### 2.3 Public Booking Enquiry Submission
* **Consumer:** `/book`
* **Destination:** `POST /booking_inquiries` or Edge Function `/submit-inquiry`
* **Frontend Zod Validation vs Backend Constraint Mapping:**

| Form Field | Frontend Zod Rule | DB Column | DB Constraint / Type |
| :--- | :--- | :--- | :--- |
| `fullName` | `string().min(3).max(255)` | `full_name` | `VARCHAR(255) NOT NULL` |
| `email` | `string().email()` | `email` | `VARCHAR(255) NOT NULL` |
| `phone` | `string().min(10).max(25)` | `phone` | `VARCHAR(50) NOT NULL` |
| `eventType` | `enum(['wedding', 'corporate', ...])`| `event_type`| `VARCHAR(100) NOT NULL` |
| `preferredDate` | `string().refine(isFutureDate)` | `preferred_date`| `DATE NOT NULL` |
| `alternateDate` | `string().optional()` | `alternate_date`| `DATE NULL` |
| `location` | `string().min(2)` | `location` | `VARCHAR(255) NOT NULL` |
| `venueName` | `string().optional()` | `venue_name` | `VARCHAR(255) NULL` |
| `guestCount` | `string().min(1)` | `guest_count` | `VARCHAR(50) NOT NULL` |
| `estimatedBudget`| `string().min(1)` | `estimated_budget`| `VARCHAR(100) NOT NULL` |
| `serviceId` | `string().uuid().optional()` | `service_id` | `UUID REFERENCES services` |
| `visionNotes` | `string().optional()` | `vision_notes` | `TEXT NULL` |
| `referralSource`| `string().optional()` | `referral_source`| `VARCHAR(100) NULL` |
| `_hp` (Honeypot)| `string().max(0)` | *N/A (Dropped)* | *Rejected if filled* |

---

## 3. Dashboard Interface Data Contracts

### 3.1 Enquiry Management Record
* **Consumer:** `/dashboard/enquiries`
* **Data Contract Schema:**
```typescript
interface DashboardEnquiryContract {
  id: string; // UUID
  reference_code: string; // Unique, e.g. "ASV-2027-1042"
  full_name: string;
  email: string;
  phone: string;
  event_type: string;
  preferred_date: string; // YYYY-MM-DD
  alternate_date: string | null;
  location: string;
  venue_name: string | null;
  guest_count: string;
  estimated_budget: string;
  service_id: string | null;
  vision_notes: string | null;
  referral_source: string | null;
  status: 'new' | 'under_review' | 'quotation_sent' | 'accepted' | 'declined' | 'converted';
  quoted_price_kobo: number | null;
  internal_notes: string | null;
  declined_reason: string | null;
  converted_event_id: string | null;
  created_at: string; // ISO timestamptz
}
```

---

### 3.2 Client Record & 360 View
* **Consumer:** `/dashboard/clients`
* **Data Contract Schema:**
```typescript
interface DashboardClientContract {
  id: string; // UUID
  full_name: string;
  company_name: string | null;
  email: string;
  phone: string;
  alt_phone: string | null;
  address: string | null;
  notes: string | null;
  is_vip: boolean;
  created_at: string;
  // Computed client statistics
  events_count?: number;
  total_billed_kobo?: number;
  total_paid_kobo?: number;
}
```

---

### 3.3 Event Master & Workspace Record
* **Consumer:** `/dashboard/events` & `/dashboard/events/:id`
* **Source:** `events` LEFT JOIN `view_event_financials`
* **Data Contract Schema:**
```typescript
interface DashboardEventContract {
  id: string; // UUID
  client_id: string;
  title: string;
  event_type: string;
  event_date: string; // YYYY-MM-DD
  setup_date: string | null;
  teardown_date: string | null;
  venue_name: string;
  venue_address: string | null;
  guest_count: number;
  agreed_price_kobo: number; // BIGINT
  status: 'planning' | 'ready' | 'in_progress' | 'completed' | 'cancelled';
  lead_planner_id: string | null;
  inquiry_id: string | null;
  contract_url: string | null;
  notes: string | null;
  created_at: string;
  // Associated client relation
  client?: {
    id: string;
    full_name: string;
    email: string;
    phone: string;
    company_name: string | null;
  };
  // Computed Financials from view_event_financials
  financials?: {
    total_paid_kobo: number;
    balance_due_kobo: number;
    total_expenses_kobo: number;
    gross_profit_margin_kobo: number;
    payment_status: 'unpaid' | 'partially_paid' | 'fully_paid';
  };
}
```

---

### 3.4 Payment Transaction Record
* **Consumer:** `/dashboard/payments` & `/dashboard/events/:id/finances`
* **Data Contract Schema:**
```typescript
interface DashboardPaymentContract {
  id: string; // UUID
  event_id: string;
  schedule_id: string | null;
  amount_kobo: number; // BIGINT > 0
  payment_method: 'bank_transfer' | 'paystack' | 'cash' | 'pos' | 'cheque';
  transaction_reference: string; // Unique string
  payment_date: string; // ISO timestamptz
  status: 'pending' | 'confirmed' | 'failed' | 'refunded';
  receipt_url: string | null;
  recorded_by: string | null; // Profile UUID
  notes: string | null;
  created_at: string;
  event?: {
    id: string;
    title: string;
    client?: { full_name: string };
  };
}
```

---

### 3.5 Payment Milestone Schedule
* **Consumer:** `/dashboard/events/:id/finances`
* **Data Contract Schema:**
```typescript
interface PaymentScheduleContract {
  id: string; // UUID
  event_id: string;
  milestone_name: string; // e.g. "Commitment Retainer (30%)"
  amount_kobo: number; // BIGINT > 0
  due_date: string; // YYYY-MM-DD
  is_paid: boolean;
}
```

---

### 3.6 Event Task Record
* **Consumer:** `/dashboard/tasks` & `/dashboard/events/:id/tasks`
* **Data Contract Schema:**
```typescript
interface EventTaskContract {
  id: string; // UUID
  event_id: string;
  title: string;
  description: string | null;
  due_date: string; // YYYY-MM-DD
  priority: 'low' | 'medium' | 'high' | 'critical';
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  assigned_to: string | null;
  completed_at: string | null;
  event?: { title: string };
  assignee?: { full_name: string; avatar_url: string | null };
}
```

---

### 3.7 Procurement Item Record
* **Consumer:** `/dashboard/procurement` & `/dashboard/events/:id/procurement`
* **Data Contract Schema:**
```typescript
interface ProcurementItemContract {
  id: string; // UUID
  event_id: string;
  item_name: string;
  category: string;
  quantity: number; // >= 1
  estimated_cost_kobo: number;
  actual_cost_kobo: number;
  vendor_id: string | null;
  deadline: string | null;
  status: 'needed' | 'requested' | 'ordered' | 'acquired' | 'cancelled';
  vendor?: { name: string };
}
```

---

### 3.8 Master Vendor Record
* **Consumer:** `/dashboard/vendors`
* **Data Contract Schema:**
```typescript
interface VendorContract {
  id: string; // UUID
  name: string;
  category: string;
  contact_person: string | null;
  phone: string;
  email: string | null;
  city: string | null;
  bank_name: string | null;
  account_number: string | null;
  rating: number | null; // 1 to 5
  notes: string | null;
}
```

---

### 3.9 Expense Disbursement Record
* **Consumer:** `/dashboard/expenses` & `/dashboard/events/:id/expenses`
* **Data Contract Schema:**
```typescript
interface ExpenseContract {
  id: string; // UUID
  event_id: string;
  vendor_id: string | null;
  category: string;
  description: string;
  amount_kobo: number; // BIGINT > 0
  expense_date: string; // YYYY-MM-DD
  payment_method: string;
  receipt_url: string | null;
  recorded_by: string | null;
  event?: { title: string };
  vendor?: { name: string };
}
```

---

### 3.10 Executive Dashboard Metrics Contract
* **Consumer:** `/dashboard`
* **Source:** Stored procedure `get_dashboard_metrics(business_id)`
* **Data Contract Schema:**
```typescript
interface DashboardMetricsContract {
  active_events_count: number;
  pending_inquiries_count: number;
  total_revenue_agreed_kobo: number;
  total_cash_collected_kobo: number;
  total_expenses_disbursed_kobo: number;
  total_outstanding_kobo?: number; // Computed in frontend or view
  overdue_tasks_count: number;
  upcoming_deadlines_count: number;
}
```
