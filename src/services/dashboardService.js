import { supabase } from '../api/client';

// Initial realistic seed state for ASEVA operational workspace (stored in memory/localStorage)
const STORAGE_KEY = 'aseva_workspace_state_v1';

const INITIAL_MOCK_DATA = {
  business: {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'ASEVA Luxury Event Atelier',
    legal_name: 'ASEVA Events & Productions Limited',
    email: 'operations@asevaevents.com',
    phone: '+234 800 000 2738',
    address: '14B Walter Carrington Crescent, Victoria Island, Lagos, Nigeria',
    currency: 'NGN',
    timezone: 'Africa/Lagos',
  },
  enquiries: [
    {
      id: 'enq-001',
      reference_code: 'ASV-2026-1042',
      full_name: 'Chief Adeleke Babatunde',
      email: 'a.babatunde@atlanticenergy.ng',
      phone: '+234 802 345 6789',
      event_type: 'social',
      preferred_date: '2026-12-18',
      alternate_date: '2026-12-19',
      location: 'Victoria Island, Lagos',
      venue_name: 'The Monarch Lagos',
      guest_count: '251-500',
      estimated_budget: '₦50,000,000+',
      service_id: 'srv-003',
      vision_notes: 'Diamond Jubilee 60th birthday gala. Requires royal velvet draping, 3-course French/Nigerian fine dining, live highlife orchestra, and full protocol security detail.',
      referral_source: 'Personal Referral',
      status: 'under_review',
      quoted_price_kobo: 6500000000, // ₦65,000,000
      internal_notes: 'High-profile client. Lead planner Folashade assigned for private discovery call.',
      created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    },
    {
      id: 'enq-002',
      reference_code: 'ASV-2026-1043',
      full_name: 'Dr. Osas & Barrister Nneka Ighodaro',
      email: 'nneka.ighodaro@lawchambers.com',
      phone: '+234 803 112 3344',
      event_type: 'wedding',
      preferred_date: '2027-02-14',
      alternate_date: '2027-02-20',
      location: 'Ikoyi, Lagos',
      venue_name: 'Eko Hotel Grand Ballroom',
      guest_count: '500+',
      estimated_budget: '₦50,000,000+',
      service_id: 'srv-001',
      vision_notes: 'Dual ceremony traditional and white wedding. Crystal chandeliers, bespoke glass runway, and top-tier floral scenography with imported white orchids.',
      referral_source: 'Instagram',
      status: 'new',
      quoted_price_kobo: null,
      internal_notes: 'Received via public booking form. Awaiting date conflict check against February quota.',
      created_at: new Date(Date.now() - 6 * 3600 * 1000).toISOString(),
    },
    {
      id: 'enq-003',
      reference_code: 'ASV-2026-1044',
      full_name: 'Zenith Tech Holdings Ltd (Attn: Folake Solanke)',
      email: 'events@zenithtech.africa',
      phone: '+234 809 888 7766',
      event_type: 'corporate',
      preferred_date: '2026-12-05',
      alternate_date: '2026-12-06',
      location: 'Victoria Island, Lagos',
      venue_name: 'Civic Centre Grand Banquet Hall',
      guest_count: '101-250',
      estimated_budget: '₦25,000,000 - ₦50,000,000',
      service_id: 'srv-002',
      vision_notes: 'Annual Pan-African FinTech Leadership Summit & Gala Dinner. State-of-the-art curved LED display, translation booths, and live broadcast setup.',
      referral_source: 'Corporate Partnership',
      status: 'quotation_sent',
      quoted_price_kobo: 3200000000, // ₦32,000,000
      internal_notes: 'Quotation sent to VP Operations. Awaiting board budget sign-off.',
      created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    },
  ],
  clients: [
    {
      id: 'cli-001',
      full_name: 'Alhaji Mansur Danjuma',
      company_name: 'Danjuma Continental Investments',
      email: 'mansur@danjumagroup.com',
      phone: '+234 803 777 9900',
      alt_phone: '+234 802 111 2233',
      address: 'Plot 12, Queens Drive, Ikoyi, Lagos',
      notes: 'Premier patron. Prefers direct WhatsApp communication. Strict security protocol required.',
      is_vip: true,
      created_at: '2026-08-10T10:00:00Z',
    },
    {
      id: 'cli-002',
      full_name: 'Mrs. Tara & Engr. Femi Alabi',
      company_name: 'Alabi Energy Consortium',
      email: 'tara.alabi@alabiglobal.com',
      phone: '+234 805 444 3322',
      alt_phone: null,
      address: '5 Banana Island Road, Ikoyi, Lagos',
      notes: 'Commissioned daughter’s wedding and anniversary celebration. Prompt payment history.',
      is_vip: true,
      created_at: '2026-09-01T12:00:00Z',
    },
    {
      id: 'cli-003',
      full_name: 'Apex Capital Partners Ltd',
      company_name: 'Apex Capital Partners',
      email: 'corp@apexcapital.ng',
      phone: '+234 801 222 3344',
      alt_phone: null,
      address: 'Heritage Towers, Marina, Lagos Island',
      notes: 'Corporate client holding annual partner summits and end-of-year award galas.',
      is_vip: false,
      created_at: '2026-10-05T15:30:00Z',
    },
  ],
  events: [
    {
      id: 'evt-001',
      client_id: 'cli-001',
      title: 'The Danjuma Imperial Nuptials',
      event_type: 'wedding',
      event_date: '2026-12-28',
      setup_date: '2026-12-26',
      teardown_date: '2026-12-29',
      venue_name: 'The Monarch Grand Pavilion',
      venue_address: 'Lekki-Epe Expressway, Meadow Hall Way, Lekki, Lagos',
      guest_count: 650,
      agreed_price_kobo: 7500000000, // ₦75,000,000
      status: 'planning',
      lead_planner: 'Folashade Adeleke (Lead Director)',
      notes: 'Bespoke glasshouse installation. 3-day rehearsal, traditional Yoruba ceremony, and white wedding banquet.',
      created_at: '2026-09-15T09:00:00Z',
    },
    {
      id: 'evt-002',
      client_id: 'cli-002',
      title: 'Alabi 25th Silver Jubilee & Renewal',
      event_type: 'social',
      event_date: '2026-12-20',
      setup_date: '2026-12-19',
      teardown_date: '2026-12-21',
      venue_name: 'Eko Hotel Grand Ballroom',
      venue_address: 'Plot 1415 Adetokunbo Ademola St, Victoria Island, Lagos',
      guest_count: 350,
      agreed_price_kobo: 3800000000, // ₦38,000,000
      status: 'ready',
      lead_planner: 'Chiamaka Nwosu (Senior Planner)',
      notes: 'Silver and midnight blue color story. 5-course plated dinner by Michelin-starred guest chef.',
      created_at: '2026-09-20T11:00:00Z',
    },
    {
      id: 'evt-003',
      client_id: 'cli-003',
      title: 'Apex Capital Annual Global Gala 2026',
      event_type: 'corporate',
      event_date: '2026-12-12',
      setup_date: '2026-12-11',
      teardown_date: '2026-12-13',
      venue_name: 'Civic Centre Grand Banquet Hall',
      venue_address: 'Ozumba Mbadiwe Avenue, Victoria Island, Lagos',
      guest_count: 220,
      agreed_price_kobo: 2200000000, // ₦22,000,000
      status: 'planning',
      lead_planner: 'Tunde Bakare (Operations Manager)',
      notes: 'High-security executive summit. Keynote stage with panoramic LED curved wall.',
      created_at: '2026-10-10T14:00:00Z',
    },
  ],
  payment_schedules: [
    // Danjuma Wedding (₦75M)
    { id: 'sch-001', event_id: 'evt-001', milestone_name: 'Initial Retainer (30%)', amount_kobo: 2250000000, due_date: '2026-09-20', is_paid: true },
    { id: 'sch-002', event_id: 'evt-001', milestone_name: 'Mid-Planning Installment (40%)', amount_kobo: 3000000000, due_date: '2026-11-15', is_paid: true },
    { id: 'sch-003', event_id: 'evt-001', milestone_name: 'Final Production Balance (30%)', amount_kobo: 2250000000, due_date: '2026-12-14', is_paid: false },
    // Alabi Silver Jubilee (₦38M)
    { id: 'sch-004', event_id: 'evt-002', milestone_name: 'Commitment Deposit (40%)', amount_kobo: 1520000000, due_date: '2026-09-25', is_paid: true },
    { id: 'sch-005', event_id: 'evt-002', milestone_name: 'Final Production Settlement (60%)', amount_kobo: 2280000000, due_date: '2026-12-05', is_paid: false },
    // Apex Gala (₦22M)
    { id: 'sch-006', event_id: 'evt-003', milestone_name: 'Contract Retainer (50%)', amount_kobo: 1100000000, due_date: '2026-10-15', is_paid: true },
    { id: 'sch-007', event_id: 'evt-003', milestone_name: 'Pre-Event Balance (50%)', amount_kobo: 1100000000, due_date: '2026-11-30', is_paid: false },
  ],
  payments: [
    {
      id: 'pay-001',
      event_id: 'evt-001',
      schedule_id: 'sch-001',
      amount_kobo: 2250000000, // ₦22.5M
      payment_method: 'bank_transfer',
      transaction_reference: 'CBN-ASV-99281-DANJUMA',
      payment_date: '2026-09-18T14:22:00Z',
      status: 'confirmed',
      receipt_url: '/receipts/asv-rec-001.pdf',
      recorded_by: 'Folashade Adeleke',
      notes: 'Initial 30% retainer cleared via Zenith Corporate Banking.',
    },
    {
      id: 'pay-002',
      event_id: 'evt-001',
      schedule_id: 'sch-002',
      amount_kobo: 3000000000, // ₦30M
      payment_method: 'bank_transfer',
      transaction_reference: 'CBN-ASV-10492-DANJUMA2',
      payment_date: '2026-11-14T09:45:00Z',
      status: 'confirmed',
      receipt_url: '/receipts/asv-rec-002.pdf',
      recorded_by: 'Folashade Adeleke',
      notes: 'Mid-term 40% installment confirmed by accountant.',
    },
    {
      id: 'pay-003',
      event_id: 'evt-002',
      schedule_id: 'sch-004',
      amount_kobo: 1520000000, // ₦15.2M
      payment_method: 'bank_transfer',
      transaction_reference: 'GTB-ASV-48201-ALABI',
      payment_date: '2026-09-24T16:10:00Z',
      status: 'confirmed',
      receipt_url: '/receipts/asv-rec-003.pdf',
      recorded_by: 'Chiamaka Nwosu',
      notes: 'Commitment deposit confirmed via GTBank transfer.',
    },
    {
      id: 'pay-004',
      event_id: 'evt-003',
      schedule_id: 'sch-006',
      amount_kobo: 1100000000, // ₦11M
      payment_method: 'bank_transfer',
      transaction_reference: 'ACCESS-ASV-30192-APEX',
      payment_date: '2026-10-14T11:00:00Z',
      status: 'confirmed',
      receipt_url: '/receipts/asv-rec-004.pdf',
      recorded_by: 'Tunde Bakare',
      notes: '50% corporate retainer received via Access Bank wire.',
    },
  ],
  tasks: [
    {
      id: 'tsk-001',
      event_id: 'evt-001',
      title: 'Finalize Custom Glasshouse Engineering Approval',
      description: 'Review structural CAD schematics with venue management and structural engineers for the outdoor pavilion.',
      due_date: '2026-12-01',
      priority: 'critical',
      status: 'in_progress',
      assigned_to: 'Folashade Adeleke',
    },
    {
      id: 'tsk-002',
      event_id: 'evt-001',
      title: 'Grand Menu Tasting & Sommelier Wine Pairing',
      description: 'Private 8-course tasting session with the bride and groom at Gourmet Affairs studio.',
      due_date: '2026-12-05',
      priority: 'high',
      status: 'pending',
      assigned_to: 'Chiamaka Nwosu',
    },
    {
      id: 'tsk-003',
      event_id: 'evt-002',
      title: 'Confirm Live Jazz Ensemble & Sound Technicians',
      description: 'Execute technical rider agreements for 12-piece jazz ensemble and ambient acoustic engineering.',
      due_date: '2026-12-02',
      priority: 'high',
      status: 'completed',
      assigned_to: 'Tunde Bakare',
    },
    {
      id: 'tsk-004',
      event_id: 'evt-003',
      title: 'Secure Lagos State Safety Commission Event Clearance',
      description: 'Obtain statutory fire, capacity, and security clearance certificates for corporate VIP attendance.',
      due_date: '2026-11-28',
      priority: 'critical',
      status: 'completed',
      assigned_to: 'Tunde Bakare',
    },
    {
      id: 'tsk-005',
      event_id: 'evt-001',
      title: 'Dispatch Personalized Calligraphy Guest Suites',
      description: 'Coupled with RFID entry badges for 650 VIP patrons.',
      due_date: '2026-12-08',
      priority: 'medium',
      status: 'pending',
      assigned_to: 'Chiamaka Nwosu',
    },
  ],
  procurement_items: [
    {
      id: 'prc-001',
      event_id: 'evt-001',
      item_name: 'Custom Curved Clear Acrylic Ghost Chairs',
      category: 'Furniture & Seating',
      quantity: 650,
      estimated_cost_kobo: 450000000, // ₦4.5M
      actual_cost_kobo: 420000000, // ₦4.2M
      vendor_name: 'Royal Rentals Lagos',
      deadline: '2026-12-25',
      status: 'ordered',
    },
    {
      id: 'prc-002',
      event_id: 'evt-001',
      item_name: 'Tiered Venetian Crystal Chandeliers (3m diameter)',
      category: 'Lighting & Scenography',
      quantity: 12,
      estimated_cost_kobo: 600000000, // ₦6M
      actual_cost_kobo: 580000000, // ₦5.8M
      vendor_name: 'Lumina Grand Scenography',
      deadline: '2026-12-24',
      status: 'ordered',
    },
    {
      id: 'prc-003',
      event_id: 'evt-002',
      item_name: 'Silver Rimmed Fine Porcelain Chargers & Cutlery',
      category: 'Tableware & Linens',
      quantity: 400,
      estimated_cost_kobo: 180000000, // ₦1.8M
      actual_cost_kobo: 175000000, // ₦1.75M
      vendor_name: 'Prestige Table Arts',
      deadline: '2026-12-18',
      status: 'acquired',
    },
    {
      id: 'prc-004',
      event_id: 'evt-003',
      item_name: 'Ultra-Fine P2.6 Curved Indoor LED Wall (18m x 4m)',
      category: 'Audiovisual & Staging',
      quantity: 1,
      estimated_cost_kobo: 550000000, // ₦5.5M
      actual_cost_kobo: 520000000, // ₦5.2M
      vendor_name: 'Megasound Pro Africa',
      deadline: '2026-12-11',
      status: 'requested',
    },
  ],
  vendors: [
    {
      id: 'vnd-001',
      name: 'Gourmet Affairs Executive Catering',
      category: 'Catering & Gastronomy',
      contact_person: 'Chef Femi Doherty',
      phone: '+234 803 555 1234',
      email: 'femi@gourmetaffairs.ng',
      city: 'Victoria Island, Lagos',
      bank_name: 'Zenith Bank PLC',
      account_number: '1012398401',
      rating: 5,
      notes: 'Michelin-grade plating standards. Exceptional execution for banquets exceeding 500 guests.',
    },
    {
      id: 'vnd-002',
      name: 'Bella Rosa Floral Architecture',
      category: 'Florals & Spatial Scenography',
      contact_person: 'Dupe Onitiri',
      phone: '+234 802 888 4567',
      email: 'dupe@bellarosang.com',
      city: 'Ikoyi, Lagos',
      bank_name: 'GTBank',
      account_number: '0129840291',
      rating: 5,
      notes: 'Direct importer of Dutch white orchids, Ecuadorian roses, and lush greenery.',
    },
    {
      id: 'vnd-003',
      name: 'Megasound Pro & Technical Engineering',
      category: 'Audiovisual & Lighting',
      contact_person: 'Emeka Okafor',
      phone: '+234 809 333 7890',
      email: 'emeka@megasound.ng',
      city: 'Ikeja, Lagos',
      bank_name: 'Access Bank',
      account_number: '0089201948',
      rating: 5,
      notes: 'Concert-grade line arrays, sound insulation, computerized trussing, and intelligent moving heads.',
    },
    {
      id: 'vnd-004',
      name: 'Zircon VIP Security & Protocol',
      category: 'Security & Protocol',
      contact_person: 'Capt. Ibrahim Danladi (Rtd)',
      phone: '+234 803 111 9922',
      email: 'ibrahim@zirconprotocol.com',
      city: 'Victoria Island, Lagos',
      bank_name: 'Stanbic IBTC',
      account_number: '9201948201',
      rating: 4,
      notes: 'Diplomatic crowd management, convoy coordination, armed escort protocol, and digital metal detectors.',
    },
    {
      id: 'vnd-005',
      name: 'Studio Remi Cinematography & Photography',
      category: 'Photography & Media',
      contact_person: 'Remi Benson',
      phone: '+234 805 777 6655',
      email: 'remi@studioremi.com',
      city: 'Lekki Phase 1, Lagos',
      bank_name: 'First Bank of Nigeria',
      account_number: '2019482019',
      rating: 5,
      notes: 'High-end editorial fashion photography, 4K RED cinema cameras, same-day highlight reel delivery.',
    },
  ],
  expenses: [
    {
      id: 'exp-001',
      event_id: 'evt-001',
      vendor_id: 'vnd-001',
      vendor_name: 'Gourmet Affairs Executive Catering',
      category: 'Catering',
      amount_kobo: 1800000000, // ₦18M
      payment_method: 'bank_transfer',
      expense_date: '2026-10-01',
      notes: 'Deposit for 650 guest multi-course banquet and dessert pavilion.',
      receipt_url: '/receipts/exp-001.pdf',
    },
    {
      id: 'exp-002',
      event_id: 'evt-001',
      vendor_id: 'vnd-002',
      vendor_name: 'Bella Rosa Floral Architecture',
      category: 'Florals & Decor',
      amount_kobo: 1400000000, // ₦14M
      payment_method: 'bank_transfer',
      expense_date: '2026-10-15',
      notes: 'Procurement of imported florals, suspended installations, and head table arches.',
      receipt_url: '/receipts/exp-002.pdf',
    },
    {
      id: 'exp-003',
      event_id: 'evt-002',
      vendor_id: 'vnd-003',
      vendor_name: 'Megasound Pro & Technical Engineering',
      category: 'Audiovisual',
      amount_kobo: 450000000, // ₦4.5M
      payment_method: 'bank_transfer',
      expense_date: '2026-10-20',
      notes: 'Acoustic sound system and mood lighting for Eko Hotel Ballroom.',
      receipt_url: '/receipts/exp-003.pdf',
    },
    {
      id: 'exp-004',
      event_id: 'evt-003',
      vendor_id: 'vnd-004',
      vendor_name: 'Zircon VIP Security & Protocol',
      category: 'Security',
      amount_kobo: 250000000, // ₦2.5M
      payment_method: 'bank_transfer',
      expense_date: '2026-10-25',
      notes: '30-officer protocol detail and VIP escort for executive summit.',
      receipt_url: '/receipts/exp-004.pdf',
    },
  ],
  team_members: [
    {
      id: 'mem-001',
      name: 'Folashade Adeleke',
      email: 'folashade@asevaevents.com',
      role: 'owner',
      title: 'Founder & Creative Director',
      is_active: true,
    },
    {
      id: 'mem-002',
      name: 'Tunde Bakare',
      email: 'tunde@asevaevents.com',
      role: 'manager',
      title: 'Operations Director & Head of Production',
      is_active: true,
    },
    {
      id: 'mem-003',
      name: 'Chiamaka Nwosu',
      email: 'chiamaka@asevaevents.com',
      role: 'planner',
      title: 'Senior Event Architect',
      is_active: true,
    },
    {
      id: 'mem-004',
      name: 'Zainab Balogun',
      email: 'zainab@asevaevents.com',
      role: 'assistant',
      title: 'Guest Experience Coordinator',
      is_active: true,
    },
  ],
  audit_logs: [
    {
      id: 'log-001',
      actor_name: 'Folashade Adeleke',
      action: 'event_created',
      entity_type: 'event',
      entity_id: 'evt-001',
      description: 'Initialized event workspace "The Danjuma Imperial Nuptials" with contract value ₦75,000,000.',
      created_at: '2026-09-15T09:00:00Z',
    },
    {
      id: 'log-002',
      actor_name: 'Folashade Adeleke',
      action: 'payment_verified',
      entity_type: 'payment',
      entity_id: 'pay-001',
      description: 'Recorded bank transfer settlement of ₦25,000,000 for Danjuma Imperial Nuptials.',
      created_at: '2026-09-16T11:20:00Z',
    },
    {
      id: 'log-003',
      actor_name: 'Tunde Bakare',
      action: 'expense_logged',
      entity_type: 'expense',
      entity_id: 'exp-001',
      description: 'Disbursed ₦14,000,000 to The Monarch Grand Pavilion for venue hire.',
      created_at: '2026-09-18T14:30:00Z',
    },
  ],
};

let inMemoryFallback = null;

function getStoredState() {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (!parsed.audit_logs) parsed.audit_logs = INITIAL_MOCK_DATA.audit_logs;
        return parsed;
      }
    }
  } catch (e) {
    console.warn('localStorage read error:', e);
  }
  if (!inMemoryFallback) {
    inMemoryFallback = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
  }
  return inMemoryFallback;
}

function saveStoredState(state) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (e) {
    console.warn('localStorage write error:', e);
  }
  inMemoryFallback = state;
}

export const dashboardService = {
  // 1. Overview KPIs & Summary Metrics
  async getDashboardMetrics() {
    const state = getStoredState();

    const activeEvents = state.events.filter((e) => e.status !== 'cancelled' && e.status !== 'completed');
    const newEnquiries = state.enquiries.filter((e) => e.status === 'new' || e.status === 'under_review');

    // Total Booked Contract Value across active events
    const totalContractValueKobo = state.events
      .filter((e) => e.status !== 'cancelled')
      .reduce((acc, ev) => acc + BigInt(ev.agreed_price_kobo), 0n);

    // Total Cash Collected via confirmed payments
    const cashCollectedKobo = state.payments
      .filter((p) => p.status === 'confirmed')
      .reduce((acc, p) => acc + BigInt(p.amount_kobo), 0n);

    // Outstanding Balance Due
    const balanceDueKobo = totalContractValueKobo > cashCollectedKobo 
      ? totalContractValueKobo - cashCollectedKobo 
      : 0n;

    // Active upcoming commissions with enriched client names and financial metrics
    const upcomingEvents = [...state.events]
      .filter((e) => e.status !== 'cancelled' && e.status !== 'completed')
      .sort((a, b) => new Date(a.event_date) - new Date(b.event_date))
      .slice(0, 15)
      .map((ev) => {
        const client = state.clients.find((c) => c.id === ev.client_id);
        const eventPayments = state.payments
          .filter((p) => p.event_id === ev.id && p.status === 'confirmed')
          .reduce((acc, p) => acc + BigInt(p.amount_kobo), 0n);
        const agreedKobo = BigInt(ev.agreed_price_kobo);
        const paymentStatus = eventPayments >= agreedKobo ? 'fully_paid' : eventPayments > 0n ? 'partially_paid' : 'unpaid';

        return {
          ...ev,
          client_name: client?.full_name || 'Private Client',
          paid_kobo: Number(eventPayments),
          balance_kobo: Number(agreedKobo > eventPayments ? agreedKobo - eventPayments : 0n),
          payment_status: paymentStatus,
        };
      });

    // Urgent Action Center Items:
    // a. Tasks due in next 7 days
    const urgentTasks = state.tasks
      .filter((t) => t.status !== 'completed' && t.status !== 'cancelled')
      .sort((a, b) => new Date(a.due_date) - new Date(b.due_date))
      .slice(0, 5)
      .map((t) => {
        const event = state.events.find((e) => e.id === t.event_id);
        return {
          ...t,
          event_title: event?.title || 'General Event Task',
        };
      });

    // b. Inbound enquiries awaiting review
    const pendingEnquiries = state.enquiries
      .filter((enq) => enq.status === 'new' || enq.status === 'under_review')
      .slice(0, 5);

    return {
      activeEventsCount: activeEvents.length,
      newEnquiriesCount: newEnquiries.length,
      totalContractValueKobo: Number(totalContractValueKobo),
      cashCollectedKobo: Number(cashCollectedKobo),
      balanceDueKobo: Number(balanceDueKobo),
      upcomingEvents,
      urgentTasks,
      pendingEnquiries,
    };
  },

  // 2. Enquiries Pipeline Management
  async getEnquiries(filters = {}) {
    const state = getStoredState();
    let result = [...state.enquiries];

    if (filters.status && filters.status !== 'all') {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.full_name.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.reference_code.toLowerCase().includes(q) ||
          e.event_type.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async createEnquiry(enquiryData) {
    const state = getStoredState();
    const id = enquiryData.id || `enq-${Date.now()}`;
    const newEnquiry = {
      id,
      business_id: '00000000-0000-0000-0000-000000000001',
      reference_code: enquiryData.reference_code || `ASV-${new Date().getFullYear()}-${Math.floor(1000 + Math.random() * 9000)}`,
      full_name: enquiryData.full_name || enquiryData.fullName,
      email: enquiryData.email,
      phone: enquiryData.phone,
      event_type: enquiryData.event_type || enquiryData.eventType || 'wedding',
      preferred_date: enquiryData.preferred_date || enquiryData.preferredDate,
      alternate_date: enquiryData.alternate_date || enquiryData.alternateDate || null,
      location: enquiryData.location || 'Lagos, Nigeria',
      venue_name: enquiryData.venue_name || enquiryData.venueName || null,
      guest_count: parseInt(enquiryData.guest_count || enquiryData.guestCount, 10) || 250,
      estimated_budget: enquiryData.estimated_budget || enquiryData.estimatedBudget || '₦40M - ₦60M',
      vision_notes: enquiryData.vision_notes || enquiryData.visionNotes || '',
      referral_source: enquiryData.referral_source || enquiryData.referralSource || 'Direct Inquiry',
      status: 'new',
      internal_notes: null,
      quoted_price_kobo: null,
      converted_event_id: null,
      created_at: new Date().toISOString(),
    };
    state.enquiries.unshift(newEnquiry);
    saveStoredState(state);
    return newEnquiry;
  },

  async updateEnquiryStatus(id, newStatus, internalNotes = '', quotedPriceKobo = null) {
    const state = getStoredState();
    const idx = state.enquiries.findIndex((e) => e.id === id);
    if (idx !== -1) {
      state.enquiries[idx].status = newStatus;
      if (internalNotes) state.enquiries[idx].internal_notes = internalNotes;
      if (quotedPriceKobo !== null) state.enquiries[idx].quoted_price_kobo = quotedPriceKobo;
      saveStoredState(state);
      return state.enquiries[idx];
    }
    throw new Error('Enquiry not found');
  },

  async convertEnquiryToBooking(inquiryIdOrOptions, maybeOptions = {}) {
    const params = typeof inquiryIdOrOptions === 'string'
      ? { inquiryId: inquiryIdOrOptions, ...maybeOptions }
      : (inquiryIdOrOptions || {});
    const { inquiryId, agreedPriceKobo, eventTitle, leadPlanner } = params;
    const state = getStoredState();
    const enq = state.enquiries.find((e) => e.id === inquiryId);
    if (!enq) throw new Error('Enquiry not found');

    // 1. Create or link client
    let client = state.clients.find((c) => c.email.toLowerCase() === enq.email.toLowerCase());
    if (!client) {
      client = {
        id: `cli-${Date.now()}`,
        full_name: enq.full_name,
        company_name: null,
        email: enq.email,
        phone: enq.phone,
        alt_phone: null,
        address: enq.location,
        notes: `Converted from enquiry ${enq.reference_code}. Notes: ${enq.vision_notes || ''}`,
        is_vip: false,
        created_at: new Date().toISOString(),
      };
      state.clients.unshift(client);
    }

    // 2. Create Confirmed Event Project
    const eventId = `evt-${Date.now()}`;
    const newEvent = {
      id: eventId,
      client_id: client.id,
      title: eventTitle || `${enq.full_name}'s Celebration`,
      event_type: enq.event_type,
      event_date: enq.preferred_date,
      setup_date: null,
      teardown_date: null,
      venue_name: enq.venue_name || enq.location,
      venue_address: enq.location,
      guest_count: parseInt(enq.guest_count) || 200,
      agreed_price_kobo: agreedPriceKobo,
      status: 'planning',
      lead_planner: leadPlanner || 'Folashade Adeleke',
      notes: enq.vision_notes || '',
      created_at: new Date().toISOString(),
    };
    state.events.unshift(newEvent);

    // 3. Generate standard 3-tranche milestone payment schedule (30% / 40% / 30%)
    const fee = BigInt(agreedPriceKobo);
    const depositKobo = Number((fee * 30n) / 100n);
    const midKobo = Number((fee * 40n) / 100n);
    const finalKobo = Number(fee - BigInt(depositKobo) - BigInt(midKobo));

    const eventDateObj = new Date(enq.preferred_date);
    const depositDueDate = new Date().toISOString().split('T')[0];
    const midDueDate = new Date(eventDateObj.getTime() - 45 * 24 * 3600 * 1000).toISOString().split('T')[0];
    const finalDueDate = new Date(eventDateObj.getTime() - 14 * 24 * 3600 * 1000).toISOString().split('T')[0];

    state.payment_schedules.push(
      { id: `sch-${Date.now()}-1`, event_id: eventId, milestone_name: 'Initial Retainer Deposit (30%)', amount_kobo: depositKobo, due_date: depositDueDate, is_paid: false },
      { id: `sch-${Date.now()}-2`, event_id: eventId, milestone_name: 'Mid-Planning Installment (40%)', amount_kobo: midKobo, due_date: midDueDate, is_paid: false },
      { id: `sch-${Date.now()}-3`, event_id: eventId, milestone_name: 'Final Production Settlement (30%)', amount_kobo: finalKobo, due_date: finalDueDate, is_paid: false }
    );

    // 4. Update enquiry status
    enq.status = 'converted';
    enq.converted_event_id = eventId;

    // 5. Immutable Audit Log
    if (!state.audit_logs) state.audit_logs = [];
    state.audit_logs.unshift({
      id: `log-${Date.now()}-c`,
      actor_name: leadPlanner || 'Folashade Adeleke',
      action: 'enquiry_converted',
      entity_type: 'event',
      entity_id: eventId,
      description: `Converted enquiry ${enq.reference_code} for ${enq.full_name} into confirmed event "${newEvent.title}".`,
      created_at: new Date().toISOString(),
    });

    saveStoredState(state);
    return { client, event: newEvent, enquiry: enq };
  },

  // 3. Clients Directory
  async getClients(search = '') {
    const state = getStoredState();
    let result = state.clients.map((cli) => {
      const clientEvents = state.events.filter((e) => e.client_id === cli.id);
      const totalBilledKobo = clientEvents.reduce((acc, ev) => acc + BigInt(ev.agreed_price_kobo), 0n);
      return {
        ...cli,
        events_count: clientEvents.length,
        total_billed_kobo: Number(totalBilledKobo),
      };
    });

    if (search) {
      const q = search.toLowerCase();
      result = result.filter((c) => c.full_name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.phone.includes(q));
    }

    return result.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async getClientById(id) {
    const state = getStoredState();
    const client = state.clients.find((c) => c.id === id);
    if (!client) throw new Error('Client not found');

    const clientEvents = state.events
      .filter((e) => e.client_id === id)
      .map((ev) => {
        const payments = state.payments
          .filter((p) => p.event_id === ev.id && p.status === 'confirmed')
          .reduce((acc, p) => acc + BigInt(p.amount_kobo), 0n);
        const agreedKobo = BigInt(ev.agreed_price_kobo);
        return {
          ...ev,
          paid_kobo: Number(payments),
          balance_kobo: Number(agreedKobo > payments ? agreedKobo - payments : 0n),
        };
      });

    const totalPaidKobo = state.payments
      .filter((p) => clientEvents.some((ev) => ev.id === p.event_id) && p.status === 'confirmed')
      .reduce((acc, p) => acc + BigInt(p.amount_kobo), 0n);

    const totalBilledKobo = clientEvents.reduce((acc, ev) => acc + BigInt(ev.agreed_price_kobo), 0n);

    return {
      ...client,
      events: clientEvents,
      total_paid_kobo: Number(totalPaidKobo),
      total_billed_kobo: Number(totalBilledKobo),
      total_balance_kobo: Number(totalBilledKobo > totalPaidKobo ? totalBilledKobo - totalPaidKobo : 0n),
    };
  },

  async createClient(data) {
    const state = getStoredState();
    const newClient = {
      id: `cli-${Date.now()}`,
      full_name: data.fullName,
      company_name: data.companyName || null,
      email: data.email,
      phone: data.phone,
      alt_phone: data.altPhone || null,
      address: data.address || null,
      notes: data.notes || '',
      is_vip: !!data.isVip,
      created_at: new Date().toISOString(),
    };
    state.clients.unshift(newClient);
    saveStoredState(state);
    return newClient;
  },

  // 4. Events Management & Detailed Workspace
  async getEvents(filters = {}) {
    const state = getStoredState();
    let result = state.events.map((ev) => {
      const client = state.clients.find((c) => c.id === ev.client_id);
      const eventPayments = state.payments
        .filter((p) => p.event_id === ev.id && p.status === 'confirmed')
        .reduce((acc, p) => acc + BigInt(p.amount_kobo), 0n);
      const agreedKobo = BigInt(ev.agreed_price_kobo);
      const paymentStatus = eventPayments >= agreedKobo ? 'fully_paid' : eventPayments > 0n ? 'partially_paid' : 'unpaid';

      return {
        ...ev,
        client_name: client?.full_name || 'Private Patron',
        paid_kobo: Number(eventPayments),
        balance_kobo: Number(agreedKobo > eventPayments ? agreedKobo - eventPayments : 0n),
        payment_status: paymentStatus,
      };
    });

    if (filters.status && filters.status !== 'all') {
      result = result.filter((e) => e.status === filters.status);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.client_name.toLowerCase().includes(q) ||
          e.venue_name.toLowerCase().includes(q) ||
          e.event_type.toLowerCase().includes(q)
      );
    }

    return result.sort((a, b) => new Date(a.event_date) - new Date(b.event_date));
  },

  async getEventById(id) {
    const state = getStoredState();
    const event = state.events.find((e) => e.id === id);
    if (!event) throw new Error('Event not found');

    const client = state.clients.find((c) => c.id === event.client_id);
    const tasks = state.tasks.filter((t) => t.event_id === id);
    const schedules = state.payment_schedules.filter((s) => s.event_id === id);
    const payments = state.payments.filter((p) => p.event_id === id);
    const expenses = state.expenses.filter((exp) => exp.event_id === id);
    const procurement = state.procurement_items.filter((prc) => prc.event_id === id);

    const totalPaidKobo = payments
      .filter((p) => p.status === 'confirmed')
      .reduce((acc, p) => acc + BigInt(p.amount_kobo), 0n);
    const agreedKobo = BigInt(event.agreed_price_kobo);
    const balanceKobo = agreedKobo > totalPaidKobo ? agreedKobo - totalPaidKobo : 0n;

    const totalExpensesKobo = expenses.reduce((acc, exp) => acc + BigInt(exp.amount_kobo), 0n);
    const grossMarginKobo = agreedKobo > totalExpensesKobo ? agreedKobo - totalExpensesKobo : 0n;
    const grossMarginPercent = agreedKobo > 0n ? Number((grossMarginKobo * 100n) / agreedKobo) : 0;

    return {
      ...event,
      client,
      tasks,
      payment_schedules: schedules,
      payments,
      expenses,
      procurement_items: procurement,
      financials: {
        agreed_price_kobo: Number(agreedKobo),
        total_paid_kobo: Number(totalPaidKobo),
        balance_kobo: Number(balanceKobo),
        total_expenses_kobo: Number(totalExpensesKobo),
        gross_margin_kobo: Number(grossMarginKobo),
        gross_margin_percent: grossMarginPercent,
      },
    };
  },

  async createEvent(data) {
    const state = getStoredState();
    const newEvent = {
      id: `evt-${Date.now()}`,
      client_id: data.clientId,
      title: data.title,
      event_type: data.eventType,
      event_date: data.eventDate,
      setup_date: data.setupDate || null,
      teardown_date: data.teardownDate || null,
      venue_name: data.venueName,
      venue_address: data.venueAddress || '',
      guest_count: parseInt(data.guestCount) || 100,
      agreed_price_kobo: data.agreedPriceKobo,
      status: 'planning',
      lead_planner: data.leadPlanner || 'Folashade Adeleke',
      notes: data.notes || '',
      created_at: new Date().toISOString(),
    };
    state.events.unshift(newEvent);

    // Optional milestone schedule setup
    if (data.milestones && data.milestones.length > 0) {
      data.milestones.forEach((m, idx) => {
        state.payment_schedules.push({
          id: `sch-${Date.now()}-${idx}`,
          event_id: newEvent.id,
          milestone_name: m.name,
          amount_kobo: m.amountKobo,
          due_date: m.dueDate,
          is_paid: false,
        });
      });
    }

    saveStoredState(state);
    return newEvent;
  },

  async updateEventStatus(id, status) {
    const state = getStoredState();
    const ev = state.events.find((e) => e.id === id);
    if (ev) {
      ev.status = status;
      saveStoredState(state);
      return ev;
    }
    throw new Error('Event not found');
  },

  // 5. Payments Inflow Ledger
  async getPayments(filters = {}) {
    const state = getStoredState();
    let result = state.payments.map((p) => {
      const event = state.events.find((e) => e.id === p.event_id);
      return {
        ...p,
        event_title: event?.title || 'Unknown Event',
      };
    });

    if (filters.method && filters.method !== 'all') {
      result = result.filter((p) => p.payment_method === filters.method);
    }
    if (filters.eventId && filters.eventId !== 'all') {
      result = result.filter((p) => p.event_id === filters.eventId);
    }
    if (filters.search) {
      const q = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.transaction_reference.toLowerCase().includes(q) ||
          p.event_title.toLowerCase().includes(q) ||
          (p.notes && p.notes.toLowerCase().includes(q))
      );
    }

    return result.sort((a, b) => new Date(b.payment_date) - new Date(a.payment_date));
  },

  async recordManualPayment(data) {
    const state = getStoredState();
    const newPayment = {
      id: `pay-${Date.now()}`,
      event_id: data.eventId,
      schedule_id: data.scheduleId || null,
      amount_kobo: data.amountKobo,
      payment_method: data.paymentMethod,
      transaction_reference: data.transactionReference || `TXN-ASV-${Date.now()}`,
      payment_date: data.paymentDate || new Date().toISOString(),
      status: 'confirmed',
      receipt_url: data.receiptUrl || null,
      recorded_by: data.recordedBy || 'Folashade Adeleke',
      notes: data.notes || '',
    };
    state.payments.unshift(newPayment);

    // If linked to milestone schedule, check if milestone is completed
    if (data.scheduleId) {
      const sch = state.payment_schedules.find((s) => s.id === data.scheduleId);
      if (sch) sch.is_paid = true;
    }

    // Immutable Audit Log
    if (!state.audit_logs) state.audit_logs = [];
    state.audit_logs.unshift({
      id: `log-${Date.now()}-p`,
      actor_name: data.recordedBy || 'Folashade Adeleke',
      action: 'payment_recorded',
      entity_type: 'payment',
      entity_id: newPayment.id,
      description: `Recorded ${data.paymentMethod.replace('_', ' ')} inflow of ₦${(data.amountKobo / 100).toLocaleString('en-NG')} (Ref: ${newPayment.transaction_reference}).`,
      created_at: new Date().toISOString(),
    });

    saveStoredState(state);
    return newPayment;
  },

  async updateMilestoneStatus(scheduleId, isPaid = true) {
    const state = getStoredState();
    const sch = state.payment_schedules.find((s) => s.id === scheduleId);
    if (sch) {
      sch.is_paid = isPaid;
      saveStoredState(state);
      return sch;
    }
    throw new Error('Milestone schedule not found');
  },

  _getRawState() {
    return getStoredState();
  },

  _saveRawState(state) {
    saveStoredState(state);
  },

  // 6. Tasks & Milestone Checklist
  async getTasks(filters = {}) {
    const state = getStoredState();
    let result = state.tasks.map((t) => {
      const event = state.events.find((e) => e.id === t.event_id);
      return {
        ...t,
        event_title: event?.title || 'Unassigned Event',
      };
    });

    if (filters.status && filters.status !== 'all') {
      result = result.filter((t) => t.status === filters.status);
    }
    if (filters.priority && filters.priority !== 'all') {
      result = result.filter((t) => t.priority === filters.priority);
    }
    if (filters.eventId && filters.eventId !== 'all') {
      result = result.filter((t) => t.event_id === filters.eventId);
    }

    return result.sort((a, b) => new Date(a.due_date) - new Date(b.due_date));
  },

  async createTask(data) {
    const state = getStoredState();
    const newTask = {
      id: `tsk-${Date.now()}`,
      event_id: data.eventId,
      title: data.title,
      description: data.description || '',
      due_date: data.dueDate,
      priority: data.priority || 'medium',
      status: 'pending',
      assigned_to: data.assignedTo || 'Folashade Adeleke',
      created_at: new Date().toISOString(),
    };
    state.tasks.unshift(newTask);
    saveStoredState(state);
    return newTask;
  },

  async updateTaskStatus(id, newStatus) {
    const state = getStoredState();
    const t = state.tasks.find((task) => task.id === id);
    if (t) {
      t.status = newStatus;
      if (newStatus === 'completed') t.completed_at = new Date().toISOString();
      saveStoredState(state);
      return t;
    }
    throw new Error('Task not found');
  },

  // 7. Central Procurement Register
  async getProcurementItems(filters = {}) {
    const state = getStoredState();
    let result = state.procurement_items.map((item) => {
      const event = state.events.find((e) => e.id === item.event_id);
      return {
        ...item,
        event_title: event?.title || 'Unassigned Event',
      };
    });

    if (filters.status && filters.status !== 'all') {
      result = result.filter((i) => i.status === filters.status);
    }
    if (filters.eventId && filters.eventId !== 'all') {
      result = result.filter((i) => i.event_id === filters.eventId);
    }

    return result;
  },

  async createProcurementItem(data) {
    const state = getStoredState();
    const newItem = {
      id: `prc-${Date.now()}`,
      event_id: data.eventId,
      item_name: data.itemName,
      category: data.category || 'Decor',
      quantity: parseInt(data.quantity) || 1,
      estimated_cost_kobo: data.estimatedCostKobo || 0,
      actual_cost_kobo: data.actualCostKobo || 0,
      vendor_name: data.vendorName || '',
      deadline: data.deadline,
      status: 'needed',
    };
    state.procurement_items.unshift(newItem);
    saveStoredState(state);
    return newItem;
  },

  async updateProcurementStatus(id, newStatus) {
    const state = getStoredState();
    const itm = state.procurement_items.find((i) => i.id === id);
    if (itm) {
      itm.status = newStatus;
      saveStoredState(state);
      return itm;
    }
    throw new Error('Procurement item not found');
  },

  // 8. Vendors Master Rolodex
  async getVendors(category = 'all') {
    const state = getStoredState();
    if (category === 'all') return state.vendors;
    return state.vendors.filter((v) => v.category === category);
  },

  async createVendor(data) {
    const state = getStoredState();
    const newVendor = {
      id: `vnd-${Date.now()}`,
      name: data.name,
      category: data.category,
      contact_person: data.contactPerson,
      phone: data.phone,
      email: data.email,
      city: data.city || 'Lagos',
      bank_name: data.bankName || '',
      account_number: data.accountNumber || '',
      rating: parseInt(data.rating) || 5,
      notes: data.notes || '',
    };
    state.vendors.unshift(newVendor);
    saveStoredState(state);
    return newVendor;
  },

  // 9. Expenses Disbursements & Margins
  async getExpenses(filters = {}) {
    const state = getStoredState();
    let result = state.expenses.map((exp) => {
      const event = state.events.find((e) => e.id === exp.event_id);
      return {
        ...exp,
        event_title: event?.title || 'General Event',
      };
    });

    if (filters.eventId && filters.eventId !== 'all') {
      result = result.filter((e) => e.event_id === filters.eventId);
    }
    if (filters.category && filters.category !== 'all') {
      result = result.filter((e) => e.category === filters.category);
    }

    return result.sort((a, b) => new Date(b.expense_date) - new Date(a.expense_date));
  },

  async recordExpense(data) {
    const state = getStoredState();
    const newExpense = {
      id: `exp-${Date.now()}`,
      event_id: data.eventId,
      vendor_id: data.vendorId || null,
      vendor_name: data.vendorName || 'General Disbursement',
      category: data.category,
      amount_kobo: data.amountKobo,
      payment_method: data.paymentMethod || 'bank_transfer',
      expense_date: data.expenseDate || new Date().toISOString().split('T')[0],
      notes: data.notes || '',
      receipt_url: data.receiptUrl || null,
    };
    state.expenses.unshift(newExpense);

    // Immutable Audit Log
    if (!state.audit_logs) state.audit_logs = [];
    state.audit_logs.unshift({
      id: `log-${Date.now()}-e`,
      actor_name: 'Tunde Bakare',
      action: 'expense_logged',
      entity_type: 'expense',
      entity_id: newExpense.id,
      description: `Disbursed ₦${(data.amountKobo / 100).toLocaleString('en-NG')} to ${newExpense.vendor_name} (${data.category}).`,
      created_at: new Date().toISOString(),
    });

    saveStoredState(state);
    return newExpense;
  },

  // 10. Master Calendar Unified Aggregator
  async getCalendarEvents() {
    const state = getStoredState();
    const events = state.events.map((e) => ({
      id: `cal-evt-${e.id}`,
      type: 'event',
      title: e.title,
      date: e.event_date,
      status: e.status,
      details: `${e.guest_count} guests at ${e.venue_name}`,
      url: `/dashboard/events/${e.id}`,
    }));

    const taskDeadlines = state.tasks
      .filter((t) => t.status !== 'completed')
      .map((t) => ({
        id: `cal-tsk-${t.id}`,
        type: 'task',
        title: `Task: ${t.title}`,
        date: t.due_date,
        priority: t.priority,
        details: `Assigned to ${t.assigned_to}`,
        url: '/dashboard/tasks',
      }));

    const paymentDeadlines = state.payment_schedules
      .filter((s) => !s.is_paid)
      .map((s) => {
        const ev = state.events.find((e) => e.id === s.event_id);
        return {
          id: `cal-pay-${s.id}`,
          type: 'payment',
          title: `Due: ${s.milestone_name}`,
          date: s.due_date,
          amount_kobo: s.amount_kobo,
          details: ev?.title || 'Client milestone',
          url: '/dashboard/payments',
        };
      });

    return [...events, ...taskDeadlines, ...paymentDeadlines];
  },

  // 11. Reports & Financial Analytics
  async getReportsData() {
    const state = getStoredState();

    // Monthly Cash Inflow vs Expenses Breakdown
    const monthlyData = [
      { month: 'Jul 26', revenue: 15.0, expenses: 8.2, margin: 6.8 },
      { month: 'Aug 26', revenue: 22.5, expenses: 11.4, margin: 11.1 },
      { month: 'Sep 26', revenue: 37.7, expenses: 19.8, margin: 17.9 },
      { month: 'Oct 26', revenue: 26.2, expenses: 14.1, margin: 12.1 },
      { month: 'Nov 26', revenue: 30.0, expenses: 15.5, margin: 14.5 },
      { month: 'Dec 26', revenue: 45.0, expenses: 22.0, margin: 23.0 },
    ];

    // Revenue Share by Category
    const categoryShare = [
      { name: 'Luxury Weddings', value: 75.0, color: '#D4AF37' },
      { name: 'Milestone Celebrations', value: 38.0, color: '#0F172A' },
      { name: 'Corporate Galas', value: 22.0, color: '#2563EB' },
      { name: 'Spatial Styling', value: 12.5, color: '#059669' },
    ];

    // Enquiry Conversion Funnel
    const funnel = [
      { stage: 'Inquiries Received', count: 48 },
      { stage: 'Quotations Prepared', count: 32 },
      { stage: 'Discovery Consultations', count: 24 },
      { stage: 'Confirmed Contracts', count: 18 },
    ];

    return {
      monthlyData,
      categoryShare,
      funnel,
    };
  },

  // 12. Workspace Settings
  async getSettings() {
    const state = getStoredState();
    return {
      business: state.business,
      team_members: state.team_members,
    };
  },

  async updateBusinessProfile(data) {
    const state = getStoredState();
    state.business = {
      ...state.business,
      ...data,
    };
    saveStoredState(state);
    return state.business;
  },

  async inviteTeamMember(memberData) {
    const state = getStoredState();
    const newMember = {
      id: `mem-${Date.now()}`,
      name: memberData.name,
      email: memberData.email,
      role: memberData.role,
      title: memberData.title || 'Event Associate',
      is_active: true,
    };
    state.team_members.push(newMember);
    saveStoredState(state);
    return newMember;
  },

  // 13. Immutable Audit Logging System
  async getAuditLogs(filters = {}) {
    const state = getStoredState();
    let result = state.audit_logs || [];
    if (filters.entityId) {
      result = result.filter((l) => l.entity_id === filters.entityId);
    }
    if (filters.action) {
      result = result.filter((l) => l.action === filters.action);
    }
    return [...result].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  },

  async logAction({ actorName = 'System Lead', action, entityType, entityId, description }) {
    const state = getStoredState();
    if (!state.audit_logs) state.audit_logs = [];
    const entry = {
      id: `log-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      actor_name: actorName,
      action,
      entity_type: entityType,
      entity_id: entityId,
      description,
      created_at: new Date().toISOString(),
    };
    state.audit_logs.unshift(entry);
    saveStoredState(state);
    return entry;
  },

  resetToSeedData() {
    inMemoryFallback = JSON.parse(JSON.stringify(INITIAL_MOCK_DATA));
    try {
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(inMemoryFallback));
      }
    } catch (e) {
      // ignore
    }
    return inMemoryFallback;
  },
};
