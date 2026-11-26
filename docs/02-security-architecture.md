# ASEVA — Security Architecture & Row Level Security (RLS)

**Document Reference:** `docs/02-security-architecture.md`  
**Phase:** 2 — System Architecture, Database Design and Project Foundation  
**Status:** Approved Security Specification  

---

## 1. Security Philosophy & Threat Model

ASEVA processes sensitive commercial data, including customer personal identifiable information (PII), high-value financial transactions (in millions of Naira), vendor bank details, and proprietary event production briefs.

### Core Security Tenets
1. **Zero Frontend Trust:** No client-side role check or route guard is relied upon for data protection. All authorization is enforced at the PostgreSQL database layer via Row Level Security (RLS).
2. **Multi-Tenant Isolation:** All operational tables contain a `business_id` foreign key. An authenticated user can only access records belonging to a business where they hold an active membership in `business_members`.
3. **Prevention of Recursive RLS Loops:** RLS policies that evaluate user membership never query `business_members` directly within standard table policies. Instead, they invoke trusted `SECURITY DEFINER` functions that execute with administrative privileges and cached session attributes, preventing PostgreSQL recursion errors and ensuring peak query performance.
4. **Least Privilege Principles:** Public anon keys have read-only access to published marketing collateral and strictly rate-limited insert access to the inquiry endpoint. Public callers have zero ability to read, list, update, or delete customer inquiries.
5. **Secret Hygiene:** Service-role keys, Paystack secret keys, and Resend API tokens reside exclusively in Supabase Vault / Edge Function secrets and are never bundled into the frontend application.

---

## 2. PostgreSQL Authorization Helper Functions

To enforce fast, non-recursive RLS policies across the entire schema, we implement two helper functions:

```sql
-- 1. Check if the current authenticated user belongs to the specified business
CREATE OR REPLACE FUNCTION public.is_business_member(_business_id UUID)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 
    FROM public.business_members
    WHERE business_id = _business_id
      AND user_id = auth.uid()
      AND is_active = true
  );
$$;

-- 2. Retrieve the active role of the current authenticated user for a business
CREATE OR REPLACE FUNCTION public.get_business_role(_business_id UUID)
RETURNS VARCHAR
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT role 
  FROM public.business_members
  WHERE business_id = _business_id
    AND user_id = auth.uid()
    AND is_active = true
  LIMIT 1;
$$;
```

---

## 3. Row Level Security Policy Matrix

| Table Name | Public (Anon) Access | Authenticated Staff Access | Role-Specific Constraints |
| :--- | :--- | :--- | :--- |
| **`businesses`** | `SELECT` public profile only (`name`, `logo_url`, `currency`, `timezone`) | Full access to own business | Update requires `role = 'owner'` |
| **`profiles`** | None | `SELECT` all active members; `UPDATE` own profile (`id = auth.uid()`) | Users can only edit their own profile |
| **`business_members`** | None | `SELECT` members in same business | `INSERT`/`UPDATE`/`DELETE` restricted to `role = 'owner'` |
| **`services`** | `SELECT` where `is_active = true` | Full read/write for own business | Modifications restricted to `owner`, `manager` |
| **`service_packages`**| `SELECT` where parent service active| Full read/write for own business | Modifications restricted to `owner`, `manager` |
| **`portfolio_items`** | `SELECT` where `is_published = true`| Full read/write for own business | Modifications restricted to `owner`, `manager`, `planner` |
| **`booking_inquiries`**| `INSERT` only (validation checked) | Full `SELECT`, `UPDATE` within business | Public cannot read or list inquiries |
| **`clients`** | None | Full access for business members | Creation/editing by `owner`, `manager`, `planner` |
| **`events`** | None | Full access for business members | Creation/editing by `owner`, `manager`, `planner` |
| **`payment_schedules`**| None| Full access for business members | Creation/editing restricted to `owner`, `manager` |
| **`payments`** | None | Full `SELECT` for `owner`, `manager` | Insertion/modification restricted to `owner`, `manager` |
| **`expenses`** | None | Full `SELECT` for business members | Insertion/modification by `owner`, `manager`, `planner` |
| **`event_tasks`** | None | Full access for business members | All roles can view and update assigned task status |
| **`procurement_items`**| None| Full access for business members | Insertion by `planner`+; status updates by all members |
| **`vendors`** | None | Full access for business members | Insertion/modification by `owner`, `manager`, `planner` |
| **`event_vendors`** | None | Full access for business members | Insertion/modification by `owner`, `manager`, `planner` |
| **`documents`** | None | Full access for business members | Signed URL generation required for private docs |
| **`activity_logs`** | None | `SELECT` only for `owner`, `manager` | System-inserted; no user `UPDATE` or `DELETE` |
| **`notifications`** | None | `SELECT`, `UPDATE` where `user_id = auth.uid()` | Users only access their own notifications |

---

## 4. Storage Bucket Policies

Four distinct storage buckets are configured:

1. **`public-portfolio` (Public Bucket):**
   * **Read:** Unauthenticated public `GET` allowed.
   * **Write:** Authenticated staff members with `is_business_member()` check.
   * **Max File Size:** 10MB (optimized `.webp`, `.jpg`, `.png`).
2. **`event-documents` (Private Bucket):**
   * **Read:** Restricted to authenticated members of the associated business.
   * **Write:** Restricted to `owner`, `manager`, and `planner`.
   * **File Types:** `.pdf`, `.docx`, `.xlsx`, `.dwg`.
3. **`business-receipts` (Private Bucket):**
   * **Read:** Restricted to `owner` and `manager`.
   * **Write:** Authenticated staff who recorded the expense.
   * **File Types:** `.pdf`, `.jpg`, `.png`.
4. **`client-attachments` (Private Bucket):**
   * **Read:** Restricted to authenticated business members.
   * **Write:** Authenticated business members.

---

## 5. Paystack Webhook Security

To prevent financial spoofing, Paystack payment confirmations are handled through a dedicated Supabase Edge Function:
1. Paystack sends an HTTP POST with header `x-paystack-signature`.
2. The Edge Function computes `crypto.subtle.digest("SHA-512", ...)` or HMAC SHA512 using the `PAYSTACK_SECRET_KEY`.
3. If the computed hash does not match `x-paystack-signature`, the request is immediately rejected with HTTP 401.
4. The transaction reference is checked against `payments.transaction_reference` to ensure idempotency. If already confirmed, the function exits with HTTP 200 without duplicate processing.
5. The transaction amount in kobo is matched with the expected invoice balance before updating status to `confirmed`.
