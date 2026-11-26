import { supabase } from '../api/client';

// Approved fallback seed catalog in accordance with Phase 1/2 requirements
const FALLBACK_SERVICES = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    title: 'Full-Service Wedding Planning & Design',
    slug: 'full-service-wedding-planning',
    short_description: 'End-to-end creative direction, vendor curation, architectural styling, and day-of execution for luxury nuptials.',
    full_description: 'Our signature offering designed for couples seeking an extraordinary, stress-free celebration. From initial spatial conceptualization to the final dance, ASEVA orchestrates every detail with flawless precision and emotional resonance.',
    category: 'wedding',
    starting_price_kobo: 350000000, // ₦3,500,000.00
    image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_active: true,
    display_order: 1,
    service_packages: [
      {
        id: '20000000-0000-0000-0000-000000000001',
        name: 'The Sovereign Bespoke Experience',
        description: 'Comprehensive end-to-end luxury wedding planning from concept to wedding weekend conclusion.',
        price_kobo: 350000000,
        inclusions: [
          'Dedicated lead wedding planner and 4 associate coordinators',
          'Custom 3D spatial floorplans and lighting design schematics',
          'Comprehensive vendor sourcing, vetting, and contract negotiation',
          'Full budget management and installment disbursement auditing',
          'Rehearsal dinner coordination and day-of minute-by-minute run of show',
          'Guest RSVP and concierge hospitality coordination'
        ],
        is_popular: true,
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    title: 'Corporate Galas & Brand Experiences',
    slug: 'corporate-galas-brand-experiences',
    short_description: 'Sophisticated corporate galas, award dinners, product launches, and summits with immaculate technical and visual polish.',
    full_description: 'We partner with premier corporations and international institutions to produce seamless brand environments. We manage strict run-of-show timing, audiovisual engineering, VIP hospitality, and corporate identity compliance.',
    category: 'corporate',
    starting_price_kobo: 500000000, // ₦5,000,000.00
    image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_active: true,
    display_order: 2,
    service_packages: [
      {
        id: '20000000-0000-0000-0000-000000000002',
        name: 'Executive Corporate Summit & Gala',
        description: 'Flawless production for leadership conferences, annual awards, and high-impact galas.',
        price_kobo: 500000000,
        inclusions: [
          'Senior event director and production management team',
          'Stage design, state-of-the-art audiovisual and livestream engineering',
          'VIP protocol and dignitary seating management',
          'Corporate brand alignment and print/digital asset verification',
          'Post-event financial closeout and vendor reconciliation report'
        ],
        is_popular: true,
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    title: 'Milestone Celebrations & Private Galas',
    slug: 'milestone-celebrations-private-galas',
    short_description: 'Bespoke milestone birthdays, anniversaries, and high-profile private dinners crafted with discretion and grandeur.',
    full_description: 'Whether celebrating an iconic 50th birthday or an intimate anniversary dinner under the stars, we curate exclusive experiences characterized by haute cuisine, fine florals, and tailored entertainment.',
    category: 'social',
    starting_price_kobo: 250000000, // ₦2,500,000.00
    image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    is_featured: true,
    is_active: true,
    display_order: 3,
    service_packages: [
      {
        id: '20000000-0000-0000-0000-000000000003',
        name: 'Private Estate Gala',
        description: 'High-touch celebratory dining and scenography.',
        price_kobo: 250000000,
        inclusions: [
          'Bespoke tablescape design and customized menus',
          'Sommelier and fine dining vendor curation',
          'Acoustic entertainment and ambient lighting'
        ],
        is_popular: false,
      }
    ]
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    title: 'Event Styling, Decor & Floral Architecture',
    slug: 'styling-decor-floral-architecture',
    short_description: 'Immersive scenography, bespoke floral installations, custom fabrication, and elevated lighting concepts.',
    full_description: 'For clients who have established logistics but desire our signature aesthetic elevation. We transform empty spaces into breathtaking atmospheric landscapes.',
    category: 'styling',
    starting_price_kobo: 200000000, // ₦2,000,000.00
    image_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80',
    is_featured: false,
    is_active: true,
    display_order: 4,
    service_packages: []
  }
];

const FALLBACK_PORTFOLIO = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    title: 'The Luminary Glasshouse Nuptials',
    slug: 'the-luminary-glasshouse-nuptials',
    event_type: 'Luxury Wedding',
    client_name: 'Zainab & Femi',
    event_date: '2026-03-14',
    location: 'Eko Atlantic, Lagos',
    guest_count: 450,
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'
    ],
    narrative: 'Set within a custom-erected glass pavilion overlooking the Atlantic shoreline, this celebration married timeless ivory florals with warm champagne ambient illumination. Over 450 guests experienced a four-course synchronized dining service followed by an extraordinary midnight after-party.',
    testimonial: 'ASEVA gave us the wedding of our dreams. Everything moved with such effortless poise and structural grandeur.',
    testimonial_author: 'Zainab & Femi Balogun',
    is_featured: true,
    is_published: true,
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    title: 'Aethelgard Annual Leadership Gala',
    slug: 'aethelgard-leadership-gala',
    event_type: 'Corporate Gala',
    client_name: 'Aethelgard Capital Holdings',
    event_date: '2026-05-20',
    location: 'Transcorp Hilton, Abuja',
    guest_count: 300,
    cover_image_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80'
    ],
    narrative: 'An executive awards dinner hosting 300 business leaders. Characterized by architectural lighting, sharp timing, and distinguished keynote staging.',
    testimonial: 'ASEVA set a new benchmark for our corporate events. Their attention to detail and punctuality was immaculate.',
    testimonial_author: 'Head of Corporate Communications',
    is_featured: true,
    is_published: true,
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    title: 'The Golden Soirée: 50th Milestone Jubilee',
    slug: 'the-golden-soiree-milestone-jubilee',
    event_type: 'Milestone Celebration',
    client_name: 'Dr. & Mrs. K. Adeleke',
    event_date: '2026-07-08',
    location: 'Ikoyi, Lagos',
    guest_count: 200,
    cover_image_url: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?auto=format&fit=crop&w=1200&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80'
    ],
    narrative: 'An intimate, high-security celebratory dinner set in a private botanical estate. Rich velvet draping, personalized calligraphed menus, and acoustic string quartets.',
    testimonial: 'Unmatched discretion and culinary choreography. Our guests still speak of the evening.',
    testimonial_author: 'Dr. K. Adeleke',
    is_featured: true,
    is_published: true,
  }
];

export const publicCatalogService = {
  /**
   * Fetches all active services with their associated packages
   */
  async getServices() {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, service_packages(*)')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      if (error || !data || data.length === 0) {
        return FALLBACK_SERVICES;
      }
      return data;
    } catch {
      return FALLBACK_SERVICES;
    }
  },

  /**
   * Fetches a specific service by its slug
   */
  async getServiceBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('services')
        .select('*, service_packages(*)')
        .eq('slug', slug)
        .eq('is_active', true)
        .single();

      if (error || !data) {
        return FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
      }
      return data;
    } catch {
      return FALLBACK_SERVICES.find((s) => s.slug === slug) || null;
    }
  },

  /**
   * Fetches all published portfolio case studies
   */
  async getPortfolioItems() {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error || !data || data.length === 0) {
        return FALLBACK_PORTFOLIO;
      }
      return data;
    } catch {
      return FALLBACK_PORTFOLIO;
    }
  },

  /**
   * Fetches a specific portfolio item by its slug
   */
  async getPortfolioItemBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('portfolio_items')
        .select('*')
        .eq('slug', slug)
        .eq('is_published', true)
        .single();

      if (error || !data) {
        return FALLBACK_PORTFOLIO.find((p) => p.slug === slug) || null;
      }
      return data;
    } catch {
      return FALLBACK_PORTFOLIO.find((p) => p.slug === slug) || null;
    }
  },
};
