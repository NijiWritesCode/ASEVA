-- ==============================================================================
-- ASEVA PLATFORM — Development Seed Data
-- File: supabase/seed.sql
-- Description: Seeds the core business entity, initial services, packages, and portfolio items.
-- ==============================================================================

-- 1. Seed Business Workspace (ASEVA)
INSERT INTO public.businesses (
    id,
    name,
    slug,
    legal_name,
    email,
    phone,
    address,
    currency,
    timezone,
    logo_url,
    settings
) VALUES (
    '00000000-0000-0000-0000-000000000001',
    'ASEVA Events',
    'aseva-events',
    'ASEVA Luxury Event Architecture Limited',
    'concierge@asevaevents.com',
    '+234 800 000 2738',
    'Victoria Island, Lagos, Nigeria',
    'NGN',
    'Africa/Lagos',
    '/favicon.svg',
    '{"branding": {"primaryColor": "#0F1115", "accentColor": "#D4AF37"}}'::jsonb
) ON CONFLICT (id) DO NOTHING;

-- 2. Seed Services Catalog
INSERT INTO public.services (
    id,
    business_id,
    title,
    slug,
    short_description,
    full_description,
    category,
    starting_price_kobo,
    image_url,
    is_featured,
    is_active,
    display_order
) VALUES 
(
    '10000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'Full-Service Wedding Planning & Design',
    'full-service-wedding-planning',
    'End-to-end creative direction, vendor curation, architectural styling, and day-of execution for luxury nuptials.',
    'Our signature offering designed for couples seeking an extraordinary, stress-free celebration. From initial spatial conceptualization to the final dance, ASEVA orchestrates every detail with flawless precision and emotional resonance.',
    'wedding',
    350000000, -- ₦3,500,000.00
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    1
),
(
    '10000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Corporate Galas & Brand Experiences',
    'corporate-galas-brand-experiences',
    'Sophisticated corporate galas, award dinners, product launches, and summits with immaculate technical and visual polish.',
    'We partner with premier corporations and international institutions to produce seamless brand environments. We manage strict run-of-show timing, audiovisual engineering, VIP hospitality, and corporate identity compliance.',
    'corporate',
    500000000, -- ₦5,000,000.00
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    2
),
(
    '10000000-0000-0000-0000-000000000003',
    '00000000-0000-0000-0000-000000000001',
    'Milestone Celebrations & Private Galas',
    'milestone-celebrations-private-galas',
    'Bespoke milestone birthdays, anniversaries, and high-profile private dinners crafted with discretion and grandeur.',
    'Whether celebrating an iconic 50th birthday or an intimate anniversary dinner under the stars, we curate exclusive experiences characterized by haute cuisine, fine florals, and tailored entertainment.',
    'social',
    250000000, -- ₦2,500,000.00
    'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    true,
    true,
    3
),
(
    '10000000-0000-0000-0000-000000000004',
    '00000000-0000-0000-0000-000000000001',
    'Event Styling, Decor & Floral Architecture',
    'styling-decor-floral-architecture',
    'Immersive scenography, bespoke floral installations, custom fabrication, and elevated lighting concepts.',
    'For clients who have established logistics but desire our signature aesthetic elevation. We transform empty spaces into breathtaking atmospheric landscapes.',
    'styling',
    200000000, -- ₦2,000,000.00
    'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    false,
    true,
    4
) ON CONFLICT (id) DO NOTHING;

-- 3. Seed Service Packages
INSERT INTO public.service_packages (
    id,
    service_id,
    name,
    description,
    price_kobo,
    inclusions,
    is_popular
) VALUES
(
    '20000000-0000-0000-0000-000000000001',
    '10000000-0000-0000-0000-000000000001',
    'The Sovereign Bespoke Experience',
    'Comprehensive end-to-end luxury wedding planning from concept to wedding weekend conclusion.',
    350000000,
    '[
      "Dedicated lead wedding planner and 4 associate coordinators",
      "Custom 3D spatial floorplans and lighting design schematics",
      "Comprehensive vendor sourcing, vetting, and contract negotiation",
      "Full budget management and installment disbursement auditing",
      "Rehearsal dinner coordination and day-of minute-by-minute run of show",
      "Guest RSVP and concierge hospitality coordination"
    ]'::jsonb,
    true
),
(
    '20000000-0000-0000-0000-000000000002',
    '10000000-0000-0000-0000-000000000002',
    'Executive Corporate Summit & Gala',
    'Flawless production for leadership conferences, annual awards, and high-impact galas.',
    500000000,
    '[
      "Senior event director and production management team",
      "Stage design, state-of-the-art audiovisual and livestream engineering",
      "VIP protocol and dignitary seating management",
      "Corporate brand alignment and print/digital asset verification",
      "Post-event financial closeout and vendor reconciliation report"
    ]'::jsonb,
    true
) ON CONFLICT (id) DO NOTHING;

-- 4. Seed Portfolio Case Studies
INSERT INTO public.portfolio_items (
    id,
    business_id,
    title,
    slug,
    event_type,
    client_name,
    event_date,
    location,
    guest_count,
    cover_image_url,
    gallery_images,
    narrative,
    testimonial,
    testimonial_author,
    is_featured,
    is_published
) VALUES
(
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    'The Luminary Glasshouse Nuptials',
    'the-luminary-glasshouse-nuptials',
    'Luxury Wedding',
    'Z & F',
    '2026-03-14',
    'Eko Atlantic, Lagos',
    450,
    'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    '[
      "https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80",
      "https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80"
    ]'::jsonb,
    'Set within a custom-erected glass pavilion overlooking the Atlantic shoreline, this celebration married timeless ivory florals with warm champagne ambient illumination. Over 450 guests experienced a four-course synchronized dining service followed by an extraordinary midnight after-party.',
    'ASEVA gave us the wedding of our dreams. Everything moved with such effortless poise.',
    'Zainab & Femi',
    true,
    true
),
(
    '30000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    'Aethelgard Annual Leadership Gala',
    'aethelgard-leadership-gala',
    'Corporate Gala',
    'Aethelgard Capital',
    '2026-05-20',
    'Transcorp Hilton, Abuja',
    300,
    'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    '[
      "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80"
    ]'::jsonb,
    'An executive awards dinner hosting 300 business leaders. Characterized by architectural lighting, sharp timing, and distinguished keynote staging.',
    'ASEVA set a new benchmark for our corporate events. Their attention to detail and punctuality was immaculate.',
    'Head of Corporate Communications',
    true,
    true
) ON CONFLICT (id) DO NOTHING;
