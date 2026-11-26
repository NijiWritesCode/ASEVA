-- ==============================================================================
-- ASEVA PLATFORM — MIGRATION 02: Row Level Security & Stored Procedures
-- Version: 20261124000002
-- Description: Enables RLS across all tables and establishes non-recursive policies
-- ==============================================================================

-- ==============================================================================
-- 1. SECURITY DEFINER HELPER FUNCTIONS (Anti-Recursion Layer)
-- ==============================================================================

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

-- Helper to check if user has manager or owner role
CREATE OR REPLACE FUNCTION public.is_business_manager_or_owner(_business_id UUID)
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
      AND role IN ('owner', 'manager')
      AND is_active = true
  );
$$;

-- ==============================================================================
-- 2. ENABLE ROW LEVEL SECURITY
-- ==============================================================================

ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.service_packages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.portfolio_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.booking_inquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payment_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.event_vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.procurement_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- ==============================================================================
-- 3. DEFINE ROW LEVEL SECURITY POLICIES
-- ==============================================================================

-- 3.1 businesses
-- Public can view basic business branding (name, slug, logo, currency)
CREATE POLICY "Public can view business branding"
ON public.businesses FOR SELECT
USING (true);

-- Authenticated members can view full business details
CREATE POLICY "Members can view full business profile"
ON public.businesses FOR SELECT
TO authenticated
USING (public.is_business_member(id));

-- Only owner can update business settings
CREATE POLICY "Owners can update business settings"
ON public.businesses FOR UPDATE
TO authenticated
USING (public.get_business_role(id) = 'owner')
WITH CHECK (public.get_business_role(id) = 'owner');

-- 3.2 profiles
-- Authenticated users can view profiles of colleagues in shared businesses
CREATE POLICY "Users can view relevant profiles"
ON public.profiles FOR SELECT
TO authenticated
USING (
    id = auth.uid() OR
    EXISTS (
        SELECT 1 FROM public.business_members bm1
        JOIN public.business_members bm2 ON bm1.business_id = bm2.business_id
        WHERE bm1.user_id = auth.uid() AND bm2.user_id = profiles.id
    )
);

-- Users can update their own profile
CREATE POLICY "Users can update own profile"
ON public.profiles FOR UPDATE
TO authenticated
USING (id = auth.uid())
WITH CHECK (id = auth.uid());

-- 3.3 business_members
-- Members can view members of their own business
CREATE POLICY "Members can view workspace teammates"
ON public.business_members FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

-- Only owners can insert/update/delete membership
CREATE POLICY "Owners can manage memberships"
ON public.business_members FOR ALL
TO authenticated
USING (public.get_business_role(business_id) = 'owner')
WITH CHECK (public.get_business_role(business_id) = 'owner');

-- 3.4 services
-- Public can view active services
CREATE POLICY "Public can view active services"
ON public.services FOR SELECT
USING (is_active = true);

-- Members can view all services (including drafts)
CREATE POLICY "Members can view all services"
ON public.services FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

-- Managers and owners can manage services
CREATE POLICY "Managers can manage services"
ON public.services FOR ALL
TO authenticated
USING (public.is_business_manager_or_owner(business_id))
WITH CHECK (public.is_business_manager_or_owner(business_id));

-- 3.5 service_packages
-- Public can view packages for active services
CREATE POLICY "Public can view active packages"
ON public.service_packages FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.services s
        WHERE s.id = service_packages.service_id AND s.is_active = true
    )
);

-- Members can manage packages
CREATE POLICY "Managers can manage packages"
ON public.service_packages FOR ALL
TO authenticated
USING (
    EXISTS (
        SELECT 1 FROM public.services s
        WHERE s.id = service_packages.service_id 
          AND public.is_business_manager_or_owner(s.business_id)
    )
);

-- 3.6 portfolio_items
-- Public can view published portfolio items
CREATE POLICY "Public can view published portfolio"
ON public.portfolio_items FOR SELECT
USING (is_published = true);

-- Members can manage portfolio
CREATE POLICY "Members can manage portfolio"
ON public.portfolio_items FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.7 booking_inquiries
-- Public can insert new inquiries (Anon insertion with basic checks)
CREATE POLICY "Public can submit booking inquiries"
ON public.booking_inquiries FOR INSERT
WITH CHECK (
    full_name IS NOT NULL AND 
    email IS NOT NULL AND 
    phone IS NOT NULL AND 
    event_type IS NOT NULL AND 
    preferred_date IS NOT NULL
);

-- Public CANNOT view, update, or delete any inquiry
-- Authenticated members can view and update inquiries
CREATE POLICY "Members can view inquiries"
ON public.booking_inquiries FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Members can update inquiries"
ON public.booking_inquiries FOR UPDATE
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.8 clients
-- Business members can view clients
CREATE POLICY "Members can view clients"
ON public.clients FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

-- Planners, managers, and owners can create/update clients
CREATE POLICY "Staff can manage clients"
ON public.clients FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.9 events
-- Business members can view events
CREATE POLICY "Members can view events"
ON public.events FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

-- Planners, managers, and owners can create/update events
CREATE POLICY "Staff can manage events"
ON public.events FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.10 payment_schedules
CREATE POLICY "Members can view payment schedules"
ON public.payment_schedules FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Managers can manage payment schedules"
ON public.payment_schedules FOR ALL
TO authenticated
USING (public.is_business_manager_or_owner(business_id))
WITH CHECK (public.is_business_manager_or_owner(business_id));

-- 3.11 payments
-- View payments: restricted to business members
CREATE POLICY "Members can view payments"
ON public.payments FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

-- Record or modify payments: restricted to manager or owner
CREATE POLICY "Managers can manage payments"
ON public.payments FOR ALL
TO authenticated
USING (public.is_business_manager_or_owner(business_id))
WITH CHECK (public.is_business_manager_or_owner(business_id));

-- 3.12 event_tasks
CREATE POLICY "Members can view tasks"
ON public.event_tasks FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Members can manage tasks"
ON public.event_tasks FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.13 vendors & event_vendors
CREATE POLICY "Members can view vendors"
ON public.vendors FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Members can manage vendors"
ON public.vendors FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

CREATE POLICY "Members can view event vendors"
ON public.event_vendors FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Members can manage event vendors"
ON public.event_vendors FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.14 procurement_items
CREATE POLICY "Members can view procurement items"
ON public.procurement_items FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Members can manage procurement items"
ON public.procurement_items FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.15 expenses
CREATE POLICY "Members can view expenses"
ON public.expenses FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Staff can record expenses"
ON public.expenses FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.16 documents
CREATE POLICY "Members can view documents"
ON public.documents FOR SELECT
TO authenticated
USING (public.is_business_member(business_id));

CREATE POLICY "Staff can manage documents"
ON public.documents FOR ALL
TO authenticated
USING (public.is_business_member(business_id))
WITH CHECK (public.is_business_member(business_id));

-- 3.17 activity_logs
CREATE POLICY "Managers can view activity logs"
ON public.activity_logs FOR SELECT
TO authenticated
USING (public.is_business_manager_or_owner(business_id));

-- Insertion is handled via triggers or authenticated functions
CREATE POLICY "System can insert activity logs"
ON public.activity_logs FOR INSERT
TO authenticated
WITH CHECK (public.is_business_member(business_id));

-- 3.18 notifications
CREATE POLICY "Users can manage own notifications"
ON public.notifications FOR ALL
TO authenticated
USING (user_id = auth.uid())
WITH CHECK (user_id = auth.uid());

-- ==============================================================================
-- 4. STORED PROCEDURES (BUSINESS OPERATIONS)
-- ==============================================================================

-- 4.1 convert_inquiry_to_booking
-- Converts an accepted enquiry into a client entity and confirmed event workspace atomically.
CREATE OR REPLACE FUNCTION public.convert_inquiry_to_booking(
    p_inquiry_id UUID,
    p_agreed_price_kobo BIGINT,
    p_lead_planner_id UUID DEFAULT NULL,
    p_schedules JSONB DEFAULT '[]'::jsonb
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_inquiry RECORD;
    v_client_id UUID;
    v_event_id UUID;
    v_schedule JSONB;
BEGIN
    -- 1. Fetch and validate inquiry
    SELECT * INTO v_inquiry 
    FROM public.booking_inquiries 
    WHERE id = p_inquiry_id;

    IF NOT FOUND THEN
        RAISE EXCEPTION 'Booking inquiry with ID % not found.', p_inquiry_id;
    END IF;

    -- Verify caller authorization
    IF NOT public.is_business_manager_or_owner(v_inquiry.business_id) THEN
        RAISE EXCEPTION 'Unauthorized: Only managers and owners can convert inquiries.';
    END IF;

    -- 2. Check for existing client by email in this business, or create new client
    SELECT id INTO v_client_id 
    FROM public.clients 
    WHERE business_id = v_inquiry.business_id 
      AND email = v_inquiry.email 
    LIMIT 1;

    IF v_client_id IS NULL THEN
        INSERT INTO public.clients (
            business_id,
            full_name,
            email,
            phone,
            notes
        ) VALUES (
            v_inquiry.business_id,
            v_inquiry.full_name,
            v_inquiry.email,
            v_inquiry.phone,
            'Created automatically upon conversion of inquiry ' || v_inquiry.reference_code
        ) RETURNING id INTO v_client_id;
    END IF;

    -- 3. Create confirmed event record
    INSERT INTO public.events (
        business_id,
        client_id,
        title,
        event_type,
        event_date,
        venue_name,
        guest_count,
        agreed_price_kobo,
        status,
        lead_planner_id,
        inquiry_id,
        notes
    ) VALUES (
        v_inquiry.business_id,
        v_client_id,
        v_inquiry.full_name || ' — ' || v_inquiry.event_type,
        v_inquiry.event_type,
        v_inquiry.preferred_date,
        COALESCE(v_inquiry.venue_name, v_inquiry.location),
        -- Extract numeric digits from guest_count or default to 100
        COALESCE(NULLIF(regexp_replace(v_inquiry.guest_count, '\D', '', 'g'), '')::INT, 100),
        p_agreed_price_kobo,
        'planning',
        p_lead_planner_id,
        p_inquiry_id,
        v_inquiry.vision_notes
    ) RETURNING id INTO v_event_id;

    -- 4. Create payment schedules if provided
    IF jsonb_array_length(p_schedules) > 0 THEN
        FOR v_schedule IN SELECT * FROM jsonb_array_elements(p_schedules)
        LOOP
            INSERT INTO public.payment_schedules (
                business_id,
                event_id,
                milestone_name,
                amount_kobo,
                due_date
            ) VALUES (
                v_inquiry.business_id,
                v_event_id,
                (v_schedule->>'milestone_name'),
                (v_schedule->>'amount_kobo')::BIGINT,
                (v_schedule->>'due_date')::DATE
            );
        END LOOP;
    END IF;

    -- 5. Update inquiry status to converted
    UPDATE public.booking_inquiries
    SET status = 'converted',
        quoted_price_kobo = p_agreed_price_kobo,
        converted_event_id = v_event_id
    WHERE id = p_inquiry_id;

    -- 6. Log activity
    INSERT INTO public.activity_logs (
        business_id,
        user_id,
        action,
        entity_type,
        entity_id,
        metadata
    ) VALUES (
        v_inquiry.business_id,
        auth.uid(),
        'converted_inquiry_to_event',
        'event',
        v_event_id,
        jsonb_build_object(
            'inquiry_id', p_inquiry_id,
            'client_id', v_client_id,
            'agreed_price_kobo', p_agreed_price_kobo
        )
    );

    RETURN jsonb_build_object(
        'success', true,
        'client_id', v_client_id,
        'event_id', v_event_id
    );
END;
$$;

-- 4.2 get_dashboard_metrics
-- Aggregates real-time business performance from genuine database records.
CREATE OR REPLACE FUNCTION public.get_dashboard_metrics(p_business_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_metrics JSONB;
BEGIN
    -- Ensure caller belongs to this business
    IF NOT public.is_business_member(p_business_id) THEN
        RAISE EXCEPTION 'Unauthorized: User is not a member of this business.';
    END IF;

    SELECT jsonb_build_object(
        'active_events_count', (
            SELECT COUNT(*) 
            FROM public.events 
            WHERE business_id = p_business_id AND status IN ('planning', 'ready', 'in_progress')
        ),
        'pending_inquiries_count', (
            SELECT COUNT(*) 
            FROM public.booking_inquiries 
            WHERE business_id = p_business_id AND status IN ('new', 'under_review')
        ),
        'total_revenue_agreed_kobo', (
            SELECT COALESCE(SUM(agreed_price_kobo), 0) 
            FROM public.events 
            WHERE business_id = p_business_id AND status != 'cancelled'
        ),
        'total_cash_collected_kobo', (
            SELECT COALESCE(SUM(amount_kobo), 0) 
            FROM public.payments 
            WHERE business_id = p_business_id AND status = 'confirmed'
        ),
        'total_expenses_disbursed_kobo', (
            SELECT COALESCE(SUM(amount_kobo), 0) 
            FROM public.expenses 
            WHERE business_id = p_business_id
        ),
        'overdue_tasks_count', (
            SELECT COUNT(*) 
            FROM public.event_tasks 
            WHERE business_id = p_business_id 
              AND status != 'completed' 
              AND due_date < CURRENT_DATE
        ),
        'upcoming_deadlines_count', (
            SELECT COUNT(*) 
            FROM public.event_tasks 
            WHERE business_id = p_business_id 
              AND status != 'completed' 
              AND due_date BETWEEN CURRENT_DATE AND (CURRENT_DATE + INTERVAL '7 days')
        )
    ) INTO v_metrics;

    RETURN v_metrics;
END;
$$;
