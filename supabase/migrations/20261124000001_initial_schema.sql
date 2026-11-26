-- ==============================================================================
-- ASEVA PLATFORM — MIGRATION 01: Core Relational Schema
-- Version: 20261124000001
-- Description: Creates 18 tables, constraints, foreign keys, indexes and helpers.
-- ==============================================================================

-- 1. Enable required PostgreSQL extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ==============================================================================
-- 2. TENANCY & IDENTITY TABLES
-- ==============================================================================

-- 2.1 businesses (Organizational Workspace)
CREATE TABLE IF NOT EXISTS public.businesses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(100) NOT NULL UNIQUE,
    legal_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    address TEXT,
    currency VARCHAR(10) NOT NULL DEFAULT 'NGN',
    timezone VARCHAR(50) NOT NULL DEFAULT 'Africa/Lagos',
    logo_url TEXT,
    settings JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.2 profiles (User Presentation metadata linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    phone VARCHAR(50),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 2.3 business_members (RBAC & Workspace Association)
CREATE TABLE IF NOT EXISTS public.business_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    role VARCHAR(30) NOT NULL CHECK (role IN ('owner', 'manager', 'planner', 'assistant')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_business_member UNIQUE (business_id, user_id)
);

CREATE INDEX IF NOT EXISTS idx_business_members_lookup 
ON public.business_members(business_id, user_id, role);

-- ==============================================================================
-- 3. PUBLIC MARKETING & SERVICE CATALOG TABLES
-- ==============================================================================

-- 3.1 services (Master Service Offerings)
CREATE TABLE IF NOT EXISTS public.services (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    short_description TEXT NOT NULL,
    full_description TEXT,
    category VARCHAR(100) NOT NULL CHECK (category IN ('wedding', 'corporate', 'social', 'styling', 'other')),
    starting_price_kobo BIGINT NOT NULL DEFAULT 0 CHECK (starting_price_kobo >= 0),
    image_url TEXT,
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_active BOOLEAN NOT NULL DEFAULT true,
    display_order INT NOT NULL DEFAULT 0,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_business_service_slug UNIQUE (business_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_services_active 
ON public.services(business_id, is_active, display_order);

-- 3.2 service_packages (Granular Inclusions & Pricing Tiers)
CREATE TABLE IF NOT EXISTS public.service_packages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    service_id UUID NOT NULL REFERENCES public.services(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price_kobo BIGINT NOT NULL DEFAULT 0 CHECK (price_kobo >= 0),
    inclusions JSONB NOT NULL DEFAULT '[]'::jsonb,
    is_popular BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_service_packages_service 
ON public.service_packages(service_id);

-- 3.3 portfolio_items (Curated Case Studies & Gallery)
CREATE TABLE IF NOT EXISTS public.portfolio_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    client_name VARCHAR(255),
    event_date DATE,
    location VARCHAR(255) NOT NULL,
    guest_count INT CHECK (guest_count IS NULL OR guest_count >= 0),
    cover_image_url TEXT NOT NULL,
    gallery_images JSONB NOT NULL DEFAULT '[]'::jsonb,
    narrative TEXT,
    testimonial TEXT,
    testimonial_author VARCHAR(255),
    is_featured BOOLEAN NOT NULL DEFAULT false,
    is_published BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_business_portfolio_slug UNIQUE (business_id, slug)
);

CREATE INDEX IF NOT EXISTS idx_portfolio_published 
ON public.portfolio_items(business_id, is_published, event_type);

-- ==============================================================================
-- 4. INBOUND LEAD MANAGEMENT & CRM TABLES
-- ==============================================================================

-- 4.1 booking_inquiries (Incoming Enquiries)
CREATE TABLE IF NOT EXISTS public.booking_inquiries (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    reference_code VARCHAR(50) NOT NULL UNIQUE,
    full_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    preferred_date DATE NOT NULL,
    alternate_date DATE,
    location VARCHAR(255) NOT NULL,
    venue_name VARCHAR(255),
    guest_count VARCHAR(50) NOT NULL,
    estimated_budget VARCHAR(100) NOT NULL,
    service_id UUID REFERENCES public.services(id) ON DELETE SET NULL,
    vision_notes TEXT,
    referral_source VARCHAR(100),
    status VARCHAR(30) NOT NULL DEFAULT 'new' 
        CHECK (status IN ('new', 'under_review', 'quotation_sent', 'accepted', 'declined', 'converted')),
    quoted_price_kobo BIGINT CHECK (quoted_price_kobo IS NULL OR quoted_price_kobo >= 0),
    internal_notes TEXT,
    declined_reason TEXT,
    converted_event_id UUID,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_inquiries_business_status 
ON public.booking_inquiries(business_id, status, created_at DESC);

-- 4.2 clients (Confirmed Customer Directory)
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    full_name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    alt_phone VARCHAR(50),
    address TEXT,
    notes TEXT,
    is_vip BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_clients_business_search 
ON public.clients(business_id, full_name, email);

-- ==============================================================================
-- 5. EVENT PRODUCTION & OPERATIONAL TABLES
-- ==============================================================================

-- 5.1 events (Confirmed Event Projects)
CREATE TABLE IF NOT EXISTS public.events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    client_id UUID NOT NULL REFERENCES public.clients(id) ON DELETE RESTRICT,
    title VARCHAR(255) NOT NULL,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    setup_date DATE,
    teardown_date DATE,
    venue_name VARCHAR(255) NOT NULL,
    venue_address TEXT,
    guest_count INT NOT NULL DEFAULT 0 CHECK (guest_count >= 0),
    agreed_price_kobo BIGINT NOT NULL CHECK (agreed_price_kobo >= 0),
    status VARCHAR(30) NOT NULL DEFAULT 'planning' 
        CHECK (status IN ('planning', 'ready', 'in_progress', 'completed', 'cancelled')),
    lead_planner_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    inquiry_id UUID REFERENCES public.booking_inquiries(id) ON DELETE SET NULL,
    contract_url TEXT,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_events_business_date 
ON public.events(business_id, event_date, status);

-- Add foreign key back to booking_inquiries.converted_event_id
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint WHERE conname = 'fk_inquiry_converted_event'
    ) THEN
        ALTER TABLE public.booking_inquiries
        ADD CONSTRAINT fk_inquiry_converted_event
        FOREIGN KEY (converted_event_id) REFERENCES public.events(id) ON DELETE SET NULL;
    END IF;
END $$;

-- 5.2 payment_schedules (Milestone Instalment Deadlines)
CREATE TABLE IF NOT EXISTS public.payment_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    milestone_name VARCHAR(255) NOT NULL,
    amount_kobo BIGINT NOT NULL CHECK (amount_kobo > 0),
    due_date DATE NOT NULL,
    is_paid BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_schedules_event 
ON public.payment_schedules(event_id, due_date);

-- 5.3 payments (Verified Cash Inflow)
CREATE TABLE IF NOT EXISTS public.payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    schedule_id UUID REFERENCES public.payment_schedules(id) ON DELETE SET NULL,
    amount_kobo BIGINT NOT NULL CHECK (amount_kobo > 0),
    payment_method VARCHAR(30) NOT NULL 
        CHECK (payment_method IN ('bank_transfer', 'paystack', 'cash', 'pos', 'cheque')),
    transaction_reference VARCHAR(255) NOT NULL UNIQUE,
    payment_date TIMESTAMPTZ NOT NULL DEFAULT now(),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' 
        CHECK (status IN ('pending', 'confirmed', 'failed', 'refunded')),
    receipt_url TEXT,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_payments_event 
ON public.payments(event_id, status);

-- 5.4 event_tasks (Operational Milestone Actions)
CREATE TABLE IF NOT EXISTS public.event_tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    due_date DATE NOT NULL,
    priority VARCHAR(20) NOT NULL DEFAULT 'medium' 
        CHECK (priority IN ('low', 'medium', 'high', 'critical')),
    status VARCHAR(20) NOT NULL DEFAULT 'pending' 
        CHECK (status IN ('pending', 'in_progress', 'completed', 'cancelled')),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_tasks_event_due 
ON public.event_tasks(event_id, status, due_date);

-- 5.5 vendors (Master Rolodex)
CREATE TABLE IF NOT EXISTS public.vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    contact_person VARCHAR(255),
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100),
    bank_name VARCHAR(100),
    account_number VARCHAR(50),
    rating SMALLINT CHECK (rating IS NULL OR (rating >= 1 AND rating <= 5)),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_vendors_business_cat 
ON public.vendors(business_id, category);

-- 5.6 event_vendors (Assigned Event Suppliers)
CREATE TABLE IF NOT EXISTS public.event_vendors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    vendor_id UUID NOT NULL REFERENCES public.vendors(id) ON DELETE CASCADE,
    contract_fee_kobo BIGINT NOT NULL DEFAULT 0 CHECK (contract_fee_kobo >= 0),
    role_description VARCHAR(255),
    status VARCHAR(20) NOT NULL DEFAULT 'confirmed' 
        CHECK (status IN ('contacted', 'quoted', 'confirmed', 'completed', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_event_vendor UNIQUE (event_id, vendor_id)
);

CREATE INDEX IF NOT EXISTS idx_event_vendors_link 
ON public.event_vendors(event_id, vendor_id);

-- 5.7 procurement_items (Physical Assets & Rentals)
CREATE TABLE IF NOT EXISTS public.procurement_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    item_name VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    quantity INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
    estimated_cost_kobo BIGINT NOT NULL DEFAULT 0 CHECK (estimated_cost_kobo >= 0),
    actual_cost_kobo BIGINT NOT NULL DEFAULT 0 CHECK (actual_cost_kobo >= 0),
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    deadline DATE,
    status VARCHAR(20) NOT NULL DEFAULT 'needed' 
        CHECK (status IN ('needed', 'requested', 'ordered', 'acquired', 'cancelled')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_procurement_event 
ON public.procurement_items(event_id, status);

-- 5.8 expenses (Cost Outflow)
CREATE TABLE IF NOT EXISTS public.expenses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    event_id UUID NOT NULL REFERENCES public.events(id) ON DELETE CASCADE,
    vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
    category VARCHAR(100) NOT NULL,
    description VARCHAR(255) NOT NULL,
    amount_kobo BIGINT NOT NULL CHECK (amount_kobo > 0),
    expense_date DATE NOT NULL DEFAULT CURRENT_DATE,
    payment_method VARCHAR(30) NOT NULL DEFAULT 'bank_transfer',
    receipt_url TEXT,
    recorded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_expenses_event 
ON public.expenses(event_id, category, expense_date);

-- 5.9 documents (Attachments & Contracts)
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    event_id UUID REFERENCES public.events(id) ON DELETE CASCADE,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    file_url TEXT NOT NULL,
    file_type VARCHAR(50) NOT NULL,
    file_size_bytes BIGINT NOT NULL DEFAULT 0,
    uploaded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- 5.10 activity_logs (Immutable Audit Trail)
CREATE TABLE IF NOT EXISTS public.activity_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    metadata JSONB NOT NULL DEFAULT '{}'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_activity_entity 
ON public.activity_logs(entity_type, entity_id, created_at DESC);

-- 5.11 notifications (In-App Staff Alerts)
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    business_id UUID NOT NULL REFERENCES public.businesses(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    link TEXT,
    is_read BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_notifications_user 
ON public.notifications(user_id, is_read, created_at DESC);

-- ==============================================================================
-- 6. COMPUTED VIEWS & HELPER FUNCTIONS
-- ==============================================================================

-- 6.1 View: Event Financial Summary (Deterministic Balance Due & Gross Margin)
CREATE OR REPLACE VIEW public.view_event_financials AS
SELECT 
    e.id AS event_id,
    e.business_id,
    e.agreed_price_kobo,
    COALESCE(p.total_paid_kobo, 0) AS total_paid_kobo,
    (e.agreed_price_kobo - COALESCE(p.total_paid_kobo, 0)) AS balance_due_kobo,
    COALESCE(x.total_expenses_kobo, 0) AS total_expenses_kobo,
    (e.agreed_price_kobo - COALESCE(x.total_expenses_kobo, 0)) AS gross_profit_margin_kobo,
    CASE 
        WHEN COALESCE(p.total_paid_kobo, 0) >= e.agreed_price_kobo THEN 'fully_paid'
        WHEN COALESCE(p.total_paid_kobo, 0) > 0 THEN 'partially_paid'
        ELSE 'unpaid'
    END AS payment_status
FROM public.events e
LEFT JOIN (
    SELECT event_id, SUM(amount_kobo) AS total_paid_kobo
    FROM public.payments
    WHERE status = 'confirmed'
    GROUP BY event_id
) p ON e.id = p.event_id
LEFT JOIN (
    SELECT event_id, SUM(amount_kobo) AS total_expenses_kobo
    FROM public.expenses
    GROUP BY event_id
) x ON e.id = x.event_id;

-- 6.2 Trigger Function: Update `updated_at` timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at trigger to applicable tables
CREATE TRIGGER set_timestamp_businesses BEFORE UPDATE ON public.businesses FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_timestamp_profiles BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_timestamp_services BEFORE UPDATE ON public.services FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_timestamp_inquiries BEFORE UPDATE ON public.booking_inquiries FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_timestamp_clients BEFORE UPDATE ON public.clients FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
CREATE TRIGGER set_timestamp_events BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
