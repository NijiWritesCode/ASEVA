import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Sparkles, 
  Calendar, 
  MapPin, 
  CreditCard, 
  FileText, 
  Clock, 
  CheckCircle2, 
  ShieldCheck, 
  Phone, 
  MessageSquare, 
  ChevronRight, 
  Download, 
  ArrowRight,
  Printer,
  Search,
  ExternalLink
} from 'lucide-react';
import { portalService } from '../../services/portalService';
import { paystackService } from '../../services/paystackService';
import { useKobo } from '../../hooks/useKobo';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { SeoMeta } from '../../components/shared/SeoMeta';

export function ClientPortalPage() {
  const { code } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { formatNaira, formatCompact } = useKobo();

  const [inputCode, setInputCode] = useState(code || '');
  const [activeTab, setActiveTab] = useState('finances');
  const [paySuccessMsg, setPaySuccessMsg] = useState(null);

  const queryCode = code || (inputCode ? null : 'demo');

  const { data: portalData, isLoading, error } = useQuery({
    queryKey: ['portal', code || inputCode || 'demo'],
    queryFn: () => portalService.lookupEvent(code || inputCode || 'demo'),
    enabled: Boolean(code || inputCode || true),
    retry: false,
  });

  const handleLookup = (e) => {
    e.preventDefault();
    if (!inputCode.trim()) return;
    navigate(`/portal/${encodeURIComponent(inputCode.trim())}`);
  };

  const payMutation = useMutation({
    mutationFn: async (milestone) => {
      const ref = paystackService.generateReference('PSTK-PORTAL');
      return paystackService.verifyAndReconcile({
        reference: ref,
        eventId: portalData.event.id,
        milestoneId: milestone.id,
        amountKobo: milestone.amount_kobo,
        notes: `Patron self-service Paystack settlement via Client Portal.`,
      });
    },
    onSuccess: (data) => {
      setPaySuccessMsg(data.message);
      queryClient.invalidateQueries({ queryKey: ['portal'] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setTimeout(() => setPaySuccessMsg(null), 8000);
    },
  });

  return (
    <div className="min-h-screen bg-sand-100 py-12 px-4 sm:px-6 lg:px-8">
      <SeoMeta
        title="Patron Concierge Portal — ASEVA"
        description="Private client portal for milestone payments, event countdowns, and production roadmap tracking."
      />

      <div className="max-w-5xl mx-auto space-y-8">
        {/* Top Concierge Header & Quick Lookup */}
        <div className="bg-obsidian-950 text-sand-100 rounded-sm p-6 sm:p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6 shadow-xl border border-obsidian-800">
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="font-serif text-lg font-bold tracking-widest text-gold-400">
                ASEVA
              </span>
              <span className="text-[10px] tracking-widest uppercase text-sand-400 bg-obsidian-800 px-2 py-0.5 rounded">
                Patron Concierge Portal
              </span>
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Private Commission Workspace
            </h1>
            <p className="text-xs text-sand-400 max-w-lg font-light leading-relaxed">
              Track your milestone schedule, settle invoices via Paystack in Nigerian Naira, review creative roadmaps, and stay connected with your lead director.
            </p>
          </div>

          {/* Quick Access Code Switcher */}
          <form onSubmit={handleLookup} className="flex items-center space-x-2 shrink-0">
            <input
              type="text"
              placeholder="Ref Code (e.g. ASV-2026-XXXX)"
              value={inputCode}
              onChange={(e) => setInputCode(e.target.value)}
              className="bg-obsidian-900 border border-obsidian-700 rounded-sm px-3 py-2 text-xs text-sand-100 placeholder-obsidian-500 focus:outline-none focus:border-gold-400 w-48 sm:w-56"
            />
            <Button variant="gold" size="sm" type="submit">
              <Search className="w-3.5 h-3.5 mr-1" />
              <span>Lookup</span>
            </Button>
          </form>
        </div>

        {paySuccessMsg && (
          <div className="p-4 bg-emerald-50 border border-emerald-300 text-emerald-900 rounded-sm text-xs flex items-center justify-between shadow-sm animate-fade-in">
            <div className="flex items-center space-x-2">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span className="font-medium">{paySuccessMsg}</span>
            </div>
            <button onClick={() => setPaySuccessMsg(null)} className="text-emerald-700 hover:underline">
              Dismiss
            </button>
          </div>
        )}

        {isLoading ? (
          <div className="bg-white border border-sand-300 rounded-sm p-16 text-center space-y-4">
            <div className="w-8 h-8 rounded-full border-2 border-gold-500 border-t-transparent animate-spin mx-auto" />
            <p className="font-serif text-xs uppercase tracking-widest text-obsidian-600">
              Retrieving Commission Records...
            </p>
          </div>
        ) : error || !portalData ? (
          <div className="bg-white border border-sand-300 rounded-sm p-12 text-center space-y-4 shadow-sm">
            <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center mx-auto border border-amber-200">
              <Search className="w-6 h-6" />
            </div>
            <h3 className="font-serif text-lg font-bold text-obsidian-950">
              Celebration Not Located
            </h3>
            <p className="text-xs text-obsidian-600 max-w-md mx-auto leading-relaxed">
              {error?.message || 'We could not find an active event matching your reference code. Please verify the code on your booking confirmation.'}
            </p>
            <Button variant="gold" size="sm" onClick={() => setInputCode('demo')}>
              Load Flagship Demo Commission
            </Button>
          </div>
        ) : portalData.type === 'enquiry_only' ? (
          <div className="bg-white border border-sand-300 rounded-sm p-10 space-y-6 shadow-sm">
            <div className="flex items-center space-x-3 text-gold-700">
              <Clock className="w-6 h-6" />
              <h2 className="font-serif text-xl font-bold text-obsidian-950">
                Inquiry Under Active Feasibility Review
              </h2>
            </div>
            <p className="text-xs text-obsidian-700 leading-relaxed max-w-xl">
              Thank you, <strong>{portalData.enquiry.full_name}</strong>. Your consultation request for <strong>{portalData.enquiry.event_type.toUpperCase()}</strong> on <strong>{portalData.enquiry.preferred_date}</strong> (Ref: <span className="font-mono font-bold text-gold-700">{portalData.enquiry.reference_code}</span>) is being triaged by our executive team.
            </p>
            <div className="p-4 bg-sand-50 rounded-sm border border-sand-200 text-xs text-obsidian-600">
              Our directors will contact you at <strong>{portalData.enquiry.phone}</strong> or <strong>{portalData.enquiry.email}</strong> within 24 to 48 hours to present formal proposal options.
            </div>
          </div>
        ) : (
          /* Confirmed Event Portal */
          <div className="space-y-8">
            {/* Celebration Hero Card */}
            <div className="bg-white border border-sand-300 rounded-sm p-6 sm:p-8 shadow-sm space-y-6">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6 pb-6 border-b border-sand-200">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Badge status={portalData.event.status} />
                    <span className="text-[11px] font-mono text-obsidian-500 uppercase">
                      Commission ID: {portalData.event.id}
                    </span>
                  </div>
                  <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian-950 tracking-tight">
                    {portalData.event.title}
                  </h2>
                  <div className="flex flex-wrap items-center gap-4 text-xs text-obsidian-600 pt-1">
                    <span className="flex items-center font-medium text-obsidian-900">
                      <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                      {portalData.event.event_date}
                    </span>
                    <span>•</span>
                    <span className="flex items-center">
                      <MapPin className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                      {portalData.event.venue_name}
                    </span>
                    <span>•</span>
                    <span>{portalData.event.guest_count} Invited Guests</span>
                  </div>
                </div>

                {/* Days Countdown Callout */}
                <div className="bg-gold-50 border border-gold-200 p-4 sm:p-5 rounded-sm text-center shrink-0 min-w-[180px]">
                  <span className="text-[10px] uppercase tracking-widest text-gold-800 font-semibold block">
                    Event Countdown
                  </span>
                  <p className="font-serif text-3xl sm:text-4xl font-bold text-gold-900 my-0.5">
                    {portalData.event.days_remaining > 0 ? portalData.event.days_remaining : 0}
                  </p>
                  <span className="text-[11px] text-gold-700">
                    Days to Your Celebration
                  </span>
                </div>
              </div>

              {/* Lead Director Contact & Print Action */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 text-xs pt-1">
                <div className="flex items-center space-x-3">
                  <div className="w-9 h-9 rounded-full bg-obsidian-950 text-gold-400 flex items-center justify-center font-serif text-xs font-bold shrink-0">
                    FA
                  </div>
                  <div>
                    <p className="font-semibold text-obsidian-950">
                      {portalData.event.lead_planner || 'Folashade Adeleke'}
                    </p>
                    <p className="text-[11px] text-obsidian-500">
                      Lead Executive Producer & Creative Director
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <a
                    href="https://wa.me/2348000000000"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center px-3 py-1.5 rounded-sm border border-sand-300 text-obsidian-700 hover:bg-sand-50 transition-colors font-medium text-xs"
                  >
                    <MessageSquare className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                    <span>WhatsApp Concierge</span>
                  </a>
                  <Link
                    to={`/dashboard/events/${portalData.event.id}/invoice`}
                    target="_blank"
                    className="inline-flex items-center px-3 py-1.5 rounded-sm bg-obsidian-950 text-gold-400 hover:bg-obsidian-900 transition-colors font-medium text-xs"
                  >
                    <Printer className="w-3.5 h-3.5 mr-1.5" />
                    <span>Print Official Invoice</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Financial Vital Signs Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              <div className="bg-white border border-sand-300 rounded-sm p-6 shadow-sm space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-obsidian-500 font-semibold block">
                  Total Agreed Contract
                </span>
                <p className="font-serif text-2xl font-bold text-obsidian-950">
                  {formatNaira(portalData.financials.agreed_price_kobo, false)}
                </p>
                <span className="text-[11px] text-obsidian-500 block">
                  All inclusions & production
                </span>
              </div>

              <div className="bg-white border border-sand-300 rounded-sm p-6 shadow-sm space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-emerald-700 font-semibold block">
                  Verified Collections (Paid)
                </span>
                <p className="font-serif text-2xl font-bold text-emerald-800">
                  {formatNaira(portalData.financials.total_paid_kobo, false)}
                </p>
                <span className="text-[11px] text-emerald-600 block">
                  Settled via Bank Wire / Paystack
                </span>
              </div>

              <div className="bg-white border border-sand-300 rounded-sm p-6 shadow-sm space-y-1">
                <span className="text-[11px] uppercase tracking-wider text-amber-700 font-semibold block">
                  Current Balance Outstanding
                </span>
                <p className="font-serif text-2xl font-bold text-amber-800">
                  {formatNaira(portalData.financials.balance_kobo, false)}
                </p>
                <span className="text-[11px] text-amber-600 block">
                  Subject to contractual milestones
                </span>
              </div>
            </div>

            {/* Navigation Tabs */}
            <div className="border-b border-sand-300 flex space-x-6 text-xs font-semibold uppercase tracking-wider">
              <button
                onClick={() => setActiveTab('finances')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'finances'
                    ? 'border-gold-500 text-gold-700 font-bold'
                    : 'border-transparent text-obsidian-600 hover:text-obsidian-950'
                }`}
              >
                Milestone Payment Schedule
              </button>
              <button
                onClick={() => setActiveTab('roadmap')}
                className={`pb-3 border-b-2 transition-all ${
                  activeTab === 'roadmap'
                    ? 'border-gold-500 text-gold-700 font-bold'
                    : 'border-transparent text-obsidian-600 hover:text-obsidian-950'
                }`}
              >
                Production Roadmap & Stages
              </button>
            </div>

            {/* TAB 1: MILESTONE FINANCES */}
            {activeTab === 'finances' && (
              <div className="space-y-6">
                <div className="bg-white border border-sand-300 rounded-sm p-6 sm:p-7 space-y-5 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-sand-200 pb-4">
                    <div>
                      <h3 className="font-serif text-lg font-bold text-obsidian-950">
                        Contractual Tranches & Milestone Settlements
                      </h3>
                      <p className="text-xs text-obsidian-600">
                        Select any pending installment to settle directly via Paystack or review bank wire details.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                    {portalData.payment_schedules.map((sch) => (
                      <div
                        key={sch.id}
                        className={`p-5 border rounded-sm space-y-3 transition-all ${
                          sch.is_paid
                            ? 'bg-emerald-50/50 border-emerald-200'
                            : 'bg-white border-sand-300 shadow-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] uppercase font-bold tracking-wider text-obsidian-600">
                            {sch.milestone_name}
                          </span>
                          <Badge status={sch.is_paid ? 'confirmed' : 'pending'} />
                        </div>

                        <p className="font-mono text-xl font-bold text-obsidian-950">
                          {formatNaira(sch.amount_kobo, false)}
                        </p>

                        <div className="text-[11px] text-obsidian-500 space-y-1 pt-1 border-t border-sand-200/80">
                          <p className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-gold-600" />
                            <span>Due Date: {sch.due_date}</span>
                          </p>
                          <p>
                            Status:{' '}
                            <strong className={sch.is_paid ? 'text-emerald-700' : 'text-amber-700'}>
                              {sch.is_paid ? 'Verified & Settled' : 'Payment Awaiting Settlement'}
                            </strong>
                          </p>
                        </div>

                        {!sch.is_paid ? (
                          <Button
                            variant="gold"
                            size="sm"
                            className="w-full mt-2"
                            onClick={() => payMutation.mutate(sch)}
                            loading={payMutation.isPending}
                          >
                            <CreditCard className="w-3.5 h-3.5 mr-1.5" />
                            <span>Pay via Paystack</span>
                          </Button>
                        ) : (
                          <div className="pt-2 text-center text-[11px] font-semibold text-emerald-800 flex items-center justify-center">
                            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-600" />
                            <span>Payment Verified</span>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Direct Bank Wire Instructions */}
                <div className="bg-sand-50 border border-sand-300 rounded-sm p-6 space-y-3 text-xs text-obsidian-800">
                  <h4 className="font-serif text-sm font-bold text-obsidian-950 flex items-center">
                    <FileText className="w-4 h-4 mr-1.5 text-gold-700" />
                    <span>Official Bank Wire Instructions (Nigerian Naira)</span>
                  </h4>
                  <p className="text-obsidian-600 leading-relaxed font-light">
                    For corporate wire transfers or direct executive bank deposits, please disburse payments to ASEVA's designated corporate treasury account:
                  </p>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 font-mono text-[11px] pt-1">
                    <div className="p-3 bg-white border border-sand-200 rounded">
                      <span className="text-obsidian-400 block text-[9px] uppercase font-sans">Bank Entity</span>
                      <strong className="text-obsidian-950">Zenith Bank Plc</strong>
                    </div>
                    <div className="p-3 bg-white border border-sand-200 rounded">
                      <span className="text-obsidian-400 block text-[9px] uppercase font-sans">Account Name</span>
                      <strong className="text-obsidian-950">ASEVA LUXURY EVENTS LTD</strong>
                    </div>
                    <div className="p-3 bg-white border border-sand-200 rounded">
                      <span className="text-obsidian-400 block text-[9px] uppercase font-sans">Account Number</span>
                      <strong className="text-gold-700 text-sm">1019283746</strong>
                    </div>
                  </div>
                  <p className="text-[10px] text-obsidian-500 pt-1">
                    * Please quote your Commission ID (<strong>{portalData.event.id}</strong>) in the payment narration to accelerate automated reconciliation.
                  </p>
                </div>
              </div>
            )}

            {/* TAB 2: PRODUCTION ROADMAP */}
            {activeTab === 'roadmap' && (
              <div className="bg-white border border-sand-300 rounded-sm p-6 sm:p-8 space-y-6 shadow-sm">
                <div>
                  <h3 className="font-serif text-lg font-bold text-obsidian-950">
                    Event Production Milestones
                  </h3>
                  <p className="text-xs text-obsidian-600">
                    Transparent progression across every architectural planning and curation phase.
                  </p>
                </div>

                <div className="space-y-6 relative pl-6 border-l-2 border-gold-300 ml-2">
                  {portalData.roadmap.map((stage, idx) => (
                    <div key={idx} className="relative space-y-1">
                      {/* Timeline Dot */}
                      <div
                        className={`absolute -left-[31px] top-0.5 w-4 h-4 rounded-full border-2 ${
                          stage.status === 'completed'
                            ? 'bg-emerald-600 border-white ring-2 ring-emerald-200'
                            : stage.status === 'in_progress'
                            ? 'bg-gold-500 border-white ring-2 ring-gold-200 animate-pulse'
                            : 'bg-sand-300 border-white'
                        }`}
                      />

                      <div className="flex items-center space-x-2">
                        <span className="font-mono text-[10px] font-bold text-gold-700">
                          {stage.phase}
                        </span>
                        <Badge status={stage.status} />
                        <span className="text-[11px] text-obsidian-500 font-mono">
                          {stage.date}
                        </span>
                      </div>

                      <h4 className="font-serif text-base font-semibold text-obsidian-950">
                        {stage.title}
                      </h4>
                      <p className="text-xs text-obsidian-600 font-light leading-relaxed">
                        {stage.description}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
