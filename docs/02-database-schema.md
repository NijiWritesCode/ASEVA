# ASEVA — Relational Database Schema & Data Dictionary

**Document Reference:** `docs/02-database-schema.md`  
**Phase:** 2 — System Architecture, Database Design and Project Foundation  
**Status:** Approved for Migration Generation  
**Target Engine:** PostgreSQL 15+ (Supabase)  
**Monetary Standard:** `BIGINT` Integer Kobo (1 NGN = 100 kobo)  

---

## 1. Relational Entity Relationship Model

```
                    ┌─────────────────────────┐
                    │       businesses        │
                    │   (Tenant Workspace)    │
                    └────────────┬────────────┘
                                 │
     ┌───────────────────────────┼───────────────────────────┐
     │ 1:N                       │ 1:N                       │ 1:N
     ▼                           ▼                           ▼
┌──────────────┐        ┌───────────────────┐       ┌─────────────────┐
│   services   │        │ business_members  │       │     clients     │
│ & packages   │        │ (Role Assignment) │       │ (Customer CRM)  │
└──────────────┘        └─────────┬─────────┘       └────────┬────────┘
                                  │                          │
                                  │ N:1                      │ 1:N
                                  ▼                          ▼
                        ┌───────────────────┐       ┌─────────────────┐
                        │     profiles      │       │     events      │
                        │(Supabase auth.user)       │ (Confirmed Proj)│
                        └───────────────────┘       └────────┬────────┘
                                                             │
                  ┌────────────────────┬─────────────────────┼────────────────────┐
                  │ 1:N                │ 1:N                 │ 1:N                │ 1:N
                  ▼                    ▼                     ▼                    ▼
        ┌──────────────────┐ ┌──────────────────┐  ┌──────────────────┐ ┌──────────────────┐
        │   event_tasks    │ │procurement_items │  │  event_vendors   │ │  event_expenses  │
        │(Milestone Action)│ │(Equipment/Rental)│  │ (Assigned Leads) │ │(Disbursed Kobo)  │
        └──────────────────┘ └──────────────────┘  └────────┬─────────┘ └──────────────────┘
                                                            │
                                                            │ N:1
                                                            ▼
                                                   ┌──────────────────┐
                                                   │     vendors      │
                                                   │(Master Directory)│
                                                   └──────────────────┘

        ┌──────────────────┐        ┌──────────────────┐       ┌──────────────────┐
        │payment_schedules │        │     payments     │       │booking_inquiries │
        │ (Due Milestones) │        │(Confirmed Record)│       │ (Inbound Leads)  │
        └──────────────────┘        └──────────────────┘       └──────────────────┘
```

---

## 2. Table Specifications & Data Dictionary

### 2.1 `businesses` (Tenancy Root)
Represents the organizational workspace for ASEVA.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`name`**: `VARCHAR(255)` NOT NULL
* **`slug`**: `VARCHAR(100)` NOT NULL UNIQUE
* **`legal_name`**: `VARCHAR(255)` NULL
* **`email`**: `VARCHAR(255)` NOT NULL
* **`phone`**: `VARCHAR(50)` NULL
* **`address`**: `TEXT` NULL
* **`currency`**: `VARCHAR(10)` NOT NULL DEFAULT `'NGN'`
* **`timezone`**: `VARCHAR(50)` NOT NULL DEFAULT `'Africa/Lagos'`
* **`logo_url`**: `TEXT` NULL
* **`settings`**: `JSONB` NOT NULL DEFAULT `'{}'::jsonb`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`updated_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_businesses_slug` UNIQUE (`slug`)

---

### 2.2 `profiles` (User Extensions)
Extends Supabase `auth.users` with personal presentation attributes.
* **`id`**: `UUID` PRIMARY KEY REFERENCES `auth.users(id)` ON DELETE CASCADE
* **`full_name`**: `VARCHAR(255)` NOT NULL
* **`avatar_url`**: `TEXT` NULL
* **`phone`**: `VARCHAR(50)` NULL
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`updated_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`

---

### 2.3 `business_members` (RBAC & Multi-Tenancy)
Associates authenticated users with a business workspace and assigns an operational role.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`user_id`**: `UUID` NOT NULL REFERENCES `profiles(id)` ON DELETE CASCADE
* **`role`**: `VARCHAR(30)` NOT NULL CHECK (`role` IN ('owner', 'manager', 'planner', 'assistant'))
* **`is_active`**: `BOOLEAN` NOT NULL DEFAULT `true`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`updated_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Constraints:** `UNIQUE(business_id, user_id)`
* **Indexes:** `idx_business_members_lookup` (`business_id`, `user_id`, `role`)

---

### 2.4 `services` (Public Catalog)
Published offerings exhibited on the marketing website and used for proposal scoping.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`title`**: `VARCHAR(255)` NOT NULL
* **`slug`**: `VARCHAR(255)` NOT NULL
* **`short_description`**: `TEXT` NOT NULL
* **`full_description`**: `TEXT` NULL
* **`category`**: `VARCHAR(100)` NOT NULL CHECK (`category` IN ('wedding', 'corporate', 'social', 'styling', 'other'))
* **`starting_price_kobo`**: `BIGINT` NOT NULL DEFAULT 0 CHECK (`starting_price_kobo` >= 0)
* **`image_url`**: `TEXT` NULL
* **`is_featured`**: `BOOLEAN` NOT NULL DEFAULT `false`
* **`is_active`**: `BOOLEAN` NOT NULL DEFAULT `true`
* **`display_order`**: `INT` NOT NULL DEFAULT 0
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`updated_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Constraints:** `UNIQUE(business_id, slug)`
* **Indexes:** `idx_services_active` (`business_id`, `is_active`, `display_order`)

---

### 2.5 `service_packages` (Tiered Inclusions)
Granular packages under each master service.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`service_id`**: `UUID` NOT NULL REFERENCES `services(id)` ON DELETE CASCADE
* **`name`**: `VARCHAR(255)` NOT NULL
* **`description`**: `TEXT` NULL
* **`price_kobo`**: `BIGINT` NOT NULL DEFAULT 0 CHECK (`price_kobo` >= 0)
* **`inclusions`**: `JSONB` NOT NULL DEFAULT `'[]'::jsonb`
* **`is_popular`**: `BOOLEAN` NOT NULL DEFAULT `false`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_service_packages_service` (`service_id`)

---

### 2.6 `portfolio_items` (Editorial Case Studies)
Curated gallery showcases demonstrating past event excellence.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`title`**: `VARCHAR(255)` NOT NULL
* **`slug`**: `VARCHAR(255)` NOT NULL
* **`event_type`**: `VARCHAR(100)` NOT NULL
* **`client_name`**: `VARCHAR(255)` NULL (Can be anonymized for privacy)
* **`event_date`**: `DATE` NULL
* **`location`**: `VARCHAR(255)` NOT NULL
* **`guest_count`**: `INT` NULL
* **`cover_image_url`**: `TEXT` NOT NULL
* **`gallery_images`**: `JSONB` NOT NULL DEFAULT `'[]'::jsonb`
* **`narrative`**: `TEXT` NULL
* **`testimonial`**: `TEXT` NULL
* **`testimonial_author`**: `VARCHAR(255)` NULL
* **`is_featured`**: `BOOLEAN` NOT NULL DEFAULT `false`
* **`is_published`**: `BOOLEAN` NOT NULL DEFAULT `true`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Constraints:** `UNIQUE(business_id, slug)`
* **Indexes:** `idx_portfolio_published` (`business_id`, `is_published`, `event_type`)

---

### 2.7 `booking_inquiries` (Lead Pipeline)
Inbound event leads submitted from the public website or entered manually.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`reference_code`**: `VARCHAR(50)` NOT NULL UNIQUE
* **`full_name`**: `VARCHAR(255)` NOT NULL
* **`email`**: `VARCHAR(255)` NOT NULL
* **`phone`**: `VARCHAR(50)` NOT NULL
* **`event_type`**: `VARCHAR(100)` NOT NULL
* **`preferred_date`**: `DATE` NOT NULL
* **`alternate_date`**: `DATE` NULL
* **`location`**: `VARCHAR(255)` NOT NULL
* **`venue_name`**: `VARCHAR(255)` NULL
* **`guest_count`**: `VARCHAR(50)` NOT NULL
* **`estimated_budget`**: `VARCHAR(100)` NOT NULL
* **`service_id`**: `UUID` NULL REFERENCES `services(id)` ON DELETE SET NULL
* **`vision_notes`**: `TEXT` NULL
* **`referral_source`**: `VARCHAR(100)` NULL
* **`status`**: `VARCHAR(30)` NOT NULL DEFAULT `'new'` CHECK (`status` IN ('new', 'under_review', 'quotation_sent', 'accepted', 'declined', 'converted'))
* **`quoted_price_kobo`**: `BIGINT` NULL CHECK (`quoted_price_kobo` IS NULL OR `quoted_price_kobo` >= 0)
* **`internal_notes`**: `TEXT` NULL
* **`declined_reason`**: `TEXT` NULL
* **`converted_event_id`**: `UUID` NULL (Self-referential or soft link to `events`)
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`updated_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_inquiries_business_status` (`business_id`, `status`, `created_at` DESC)

---

### 2.8 `clients` (Customer CRM)
Confirmed human or corporate entities who commission events.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`full_name`**: `VARCHAR(255)` NOT NULL
* **`company_name`**: `VARCHAR(255)` NULL
* **`email`**: `VARCHAR(255)` NOT NULL
* **`phone`**: `VARCHAR(50)` NOT NULL
* **`alt_phone`**: `VARCHAR(50)` NULL
* **`address`**: `TEXT` NULL
* **`notes`**: `TEXT` NULL
* **`is_vip`**: `BOOLEAN` NOT NULL DEFAULT `false`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`updated_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_clients_business_search` (`business_id`, `full_name`, `email`)

---

### 2.9 `events` (Confirmed Project Workspaces)
The master container for an accepted, confirmed event project.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`client_id`**: `UUID` NOT NULL REFERENCES `clients(id)` ON DELETE RESTRICT
* **`title`**: `VARCHAR(255)` NOT NULL
* **`event_type`**: `VARCHAR(100)` NOT NULL
* **`event_date`**: `DATE` NOT NULL
* **`setup_date`**: `DATE` NULL
* **`teardown_date`**: `DATE` NULL
* **`venue_name`**: `VARCHAR(255)` NOT NULL
* **`venue_address`**: `TEXT` NULL
* **`guest_count`**: `INT` NOT NULL DEFAULT 0 CHECK (`guest_count` >= 0)
* **`agreed_price_kobo`**: `BIGINT` NOT NULL CHECK (`agreed_price_kobo` >= 0)
* **`status`**: `VARCHAR(30)` NOT NULL DEFAULT `'planning'` CHECK (`status` IN ('planning', 'ready', 'in_progress', 'completed', 'cancelled'))
* **`lead_planner_id`**: `UUID` NULL REFERENCES `profiles(id)` ON DELETE SET NULL
* **`inquiry_id`**: `UUID` NULL REFERENCES `booking_inquiries(id)` ON DELETE SET NULL
* **`contract_url`**: `TEXT` NULL
* **`notes`**: `TEXT` NULL
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`updated_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_events_business_date` (`business_id`, `event_date`, `status`)

---

### 2.10 `payment_schedules` (Instalment Milestones)
Agreed payment tranches tied to an event.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`event_id`**: `UUID` NOT NULL REFERENCES `events(id)` ON DELETE CASCADE
* **`milestone_name`**: `VARCHAR(255)` NOT NULL
* **`amount_kobo`**: `BIGINT` NOT NULL CHECK (`amount_kobo` > 0)
* **`due_date`**: `DATE` NOT NULL
* **`is_paid`**: `BOOLEAN` NOT NULL DEFAULT `false`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_schedules_event` (`event_id`, `due_date`)

---

### 2.11 `payments` (Confirmed Financial Inflow)
Actual monetary transactions received for an event.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`event_id`**: `UUID` NOT NULL REFERENCES `events(id)` ON DELETE CASCADE
* **`schedule_id`**: `UUID` NULL REFERENCES `payment_schedules(id)` ON DELETE SET NULL
* **`amount_kobo`**: `BIGINT` NOT NULL CHECK (`amount_kobo` > 0)
* **`payment_method`**: `VARCHAR(30)` NOT NULL CHECK (`payment_method` IN ('bank_transfer', 'paystack', 'cash', 'pos', 'cheque'))
* **`transaction_reference`**: `VARCHAR(255)` NOT NULL UNIQUE
* **`payment_date`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **`status`**: `VARCHAR(20)` NOT NULL DEFAULT `'confirmed'` CHECK (`status` IN ('pending', 'confirmed', 'failed', 'refunded'))
* **`receipt_url`**: `TEXT` NULL
* **`recorded_by`**: `UUID` NULL REFERENCES `profiles(id)` ON DELETE SET NULL
* **`notes`**: `TEXT` NULL
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_payments_event` (`event_id`, `status`), `idx_payments_ref` UNIQUE (`transaction_reference`)

---

### 2.12 `event_tasks` (Planning Milestones)
Operational checklist items tied to an event.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`event_id`**: `UUID` NOT NULL REFERENCES `events(id)` ON DELETE CASCADE
* **`title`**: `VARCHAR(255)` NOT NULL
* **`description`**: `TEXT` NULL
* **`due_date`**: `DATE` NOT NULL
* **`priority`**: `VARCHAR(20)` NOT NULL DEFAULT `'medium'` CHECK (`priority` IN ('low', 'medium', 'high', 'critical'))
* **`status`**: `VARCHAR(20)` NOT NULL DEFAULT `'pending'` CHECK (`status` IN ('pending', 'in_progress', 'completed', 'cancelled'))
* **`assigned_to`**: `UUID` NULL REFERENCES `profiles(id)` ON DELETE SET NULL
* **`completed_at`**: `TIMESTAMPTZ` NULL
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_tasks_event_due` (`event_id`, `status`, `due_date`)

---

### 2.13 `procurement_items` (Equipment & Rentals)
Physical items and rentals sourced specifically for an event.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`event_id`**: `UUID` NOT NULL REFERENCES `events(id)` ON DELETE CASCADE
* **`item_name`**: `VARCHAR(255)` NOT NULL
* **`category`**: `VARCHAR(100)` NOT NULL
* **`quantity`**: `INT` NOT NULL DEFAULT 1 CHECK (`quantity` > 0)
* **`estimated_cost_kobo`**: `BIGINT` NOT NULL DEFAULT 0 CHECK (`estimated_cost_kobo` >= 0)
* **`actual_cost_kobo`**: `BIGINT` NOT NULL DEFAULT 0 CHECK (`actual_cost_kobo` >= 0)
* **`vendor_id`**: `UUID` NULL REFERENCES `vendors(id)` ON DELETE SET NULL
* **`deadline`**: `DATE` NULL
* **`status`**: `VARCHAR(20)` NOT NULL DEFAULT `'needed'` CHECK (`status` IN ('needed', 'requested', 'ordered', 'acquired', 'cancelled'))
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_procurement_event` (`event_id`, `status`)

---

### 2.14 `vendors` (Master Rolodex)
Master catalog of vetted suppliers and service providers.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`name`**: `VARCHAR(255)` NOT NULL
* **`category`**: `VARCHAR(100)` NOT NULL
* **`contact_person`**: `VARCHAR(255)` NULL
* **`phone`**: `VARCHAR(50)` NOT NULL
* **`email`**: `VARCHAR(255)` NULL
* **`city`**: `VARCHAR(100)` NULL
* **`bank_name`**: `VARCHAR(100)` NULL
* **`account_number`**: `VARCHAR(50)` NULL
* **`rating`**: `SMALLINT` NULL CHECK (`rating` BETWEEN 1 AND 5)
* **`notes`**: `TEXT` NULL
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_vendors_business_cat` (`business_id`, `category`)

---

### 2.15 `event_vendors` (Event Allocations)
Contracted vendors linked to a specific event project.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`event_id`**: `UUID` NOT NULL REFERENCES `events(id)` ON DELETE CASCADE
* **`vendor_id`**: `UUID` NOT NULL REFERENCES `vendors(id)` ON DELETE CASCADE
* **`contract_fee_kobo`**: `BIGINT` NOT NULL DEFAULT 0 CHECK (`contract_fee_kobo` >= 0)
* **`role_description`**: `VARCHAR(255)` NULL
* **`status`**: `VARCHAR(20)` NOT NULL DEFAULT `'confirmed'` CHECK (`status` IN ('contacted', 'quoted', 'confirmed', 'completed', 'cancelled'))
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Constraints:** `UNIQUE(event_id, vendor_id)`
* **Indexes:** `idx_event_vendors_link` (`event_id`, `vendor_id`)

---

### 2.16 `expenses` (Cost Outflow)
Operating disbursements incurred on behalf of an event.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`event_id`**: `UUID` NOT NULL REFERENCES `events(id)` ON DELETE CASCADE
* **`vendor_id`**: `UUID` NULL REFERENCES `vendors(id)` ON DELETE SET NULL
* **`category`**: `VARCHAR(100)` NOT NULL
* **`description`**: `VARCHAR(255)` NOT NULL
* **`amount_kobo`**: `BIGINT` NOT NULL CHECK (`amount_kobo` > 0)
* **`expense_date`**: `DATE` NOT NULL DEFAULT CURRENT_DATE
* **`payment_method`**: `VARCHAR(30)` NOT NULL DEFAULT `'bank_transfer'`
* **`receipt_url`**: `TEXT` NULL
* **`recorded_by`**: `UUID` NULL REFERENCES `profiles(id)` ON DELETE SET NULL
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_expenses_event` (`event_id`, `category`, `expense_date`)

---

### 2.17 `documents` (Attachments & Contracts)
Uploaded files linked to events, clients, or expenses.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`event_id`**: `UUID` NULL REFERENCES `events(id)` ON DELETE CASCADE
* **`client_id`**: `UUID` NULL REFERENCES `clients(id)` ON DELETE CASCADE
* **`title`**: `VARCHAR(255)` NOT NULL
* **`file_url`**: `TEXT` NOT NULL
* **`file_type`**: `VARCHAR(50)` NOT NULL
* **`file_size_bytes`**: `BIGINT` NOT NULL DEFAULT 0
* **`uploaded_by`**: `UUID` NULL REFERENCES `profiles(id)` ON DELETE SET NULL
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`

---

### 2.18 `activity_logs` (Audit Trail)
Immutable security and operational event log.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`user_id`**: `UUID` NULL REFERENCES `profiles(id)` ON DELETE SET NULL
* **`action`**: `VARCHAR(100)` NOT NULL
* **`entity_type`**: `VARCHAR(50)` NOT NULL
* **`entity_id`**: `UUID` NOT NULL
* **`metadata`**: `JSONB` NOT NULL DEFAULT `'{}'::jsonb`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_activity_entity` (`entity_type`, `entity_id`, `created_at` DESC)

---

### 2.19 `notifications` (Staff Alerts)
In-app notification system for staff tasks and inquiries.
* **`id`**: `UUID` PRIMARY KEY DEFAULT `gen_random_uuid()`
* **`business_id`**: `UUID` NOT NULL REFERENCES `businesses(id)` ON DELETE CASCADE
* **`user_id`**: `UUID` NOT NULL REFERENCES `profiles(id)` ON DELETE CASCADE
* **`title`**: `VARCHAR(255)` NOT NULL
* **`message`**: `TEXT` NOT NULL
* **`link`**: `TEXT` NULL
* **`is_read`**: `BOOLEAN` NOT NULL DEFAULT `false`
* **`created_at`**: `TIMESTAMPTZ` NOT NULL DEFAULT `now()`
* **Indexes:** `idx_notifications_user` (`user_id`, `is_read`, `created_at` DESC)
