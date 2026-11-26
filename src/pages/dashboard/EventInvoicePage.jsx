import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Printer, ArrowLeft, Download, ShieldCheck, Sparkles, Copy, Check } from 'lucide-react';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';
import { Button } from '../../components/shared/Button';
import { Badge } from '../../components/shared/Badge';

export function EventInvoicePage() {
  const { id } = useParams();
  const { formatNaira } = useKobo();
  const [copied, setCopied] = React.useState(false);

  const { data: event, isLoading } = useQuery({
    queryKey: ['dashboard', 'event', id],
    queryFn: () => dashboardService.getEventById(id),
  });

  if (isLoading || !event) {
    return (
      <div className="min-h-screen bg-sand-100 flex items-center justify-center p-8">
        <p className="font-serif text-sm uppercase tracking-widest text-obsidian-600">
          Generating Branded Document...
        </p>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const handleCopyPortalLink = () => {
    const portalUrl = `${window.location.origin}/portal/${event.id}`;
    navigator.clipboard.writeText(portalUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  const invoiceNumber = `INV-ASV-${new Date(event.created_at || Date.now()).getFullYear()}-${event.id.replace('evt-', '')}`;

  return (
    <div className="min-h-screen bg-sand-100 py-8 px-4 sm:px-6 print:p-0 print:bg-white">
      {/* Top Floating Control Bar (Hidden on Print) */}
      <div className="max-w-4xl mx-auto mb-6 flex items-center justify-between print:hidden">
        <Link to={`/dashboard/events/${event.id}`}>
          <Button variant="outline" size="sm">
            <ArrowLeft className="w-3.5 h-3.5 mr-1.5" />
            <span>Return to Workspace</span>
          </Button>
        </Link>

        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm" onClick={handleCopyPortalLink}>
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
                <span>Portal Link Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 mr-1.5" />
                <span>Share Portal Link</span>
              </>
            )}
          </Button>

          <Button variant="gold" size="sm" onClick={handlePrint}>
            <Printer className="w-3.5 h-3.5 mr-1.5" />
            <span>Print / Save PDF</span>
          </Button>
        </div>
      </div>

      {/* Official Printable Luxury Document Container */}
      <div className="max-w-4xl mx-auto bg-white border border-sand-300 print:border-0 shadow-lg print:shadow-none p-8 sm:p-14 space-y-8 text-obsidian-900 rounded-sm">
        {/* Brand Header & Document Reference */}
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 border-b-2 border-obsidian-950 pb-8">
          <div className="space-y-1.5">
            <span className="font-serif text-3xl font-bold tracking-widest text-gold-600 block">
              ASEVA
            </span>
            <span className="text-[10px] uppercase tracking-widest text-obsidian-500 font-semibold block">
              Event Architecture & Bespoke Luxury Production
            </span>
            <p className="text-xs text-obsidian-600 font-light leading-relaxed max-w-sm pt-1">
              Plot 14 Admiralty Way, Lekki Phase 1, Lagos, Nigeria<br />
              RC Number: 1849204 • Tax ID: 22948102-0001<br />
              concierge@asevaevents.com • +234 (0) 800 273 8238
            </p>
          </div>

          <div className="text-left sm:text-right space-y-1 shrink-0">
            <span className="inline-block px-2.5 py-1 text-[11px] font-bold tracking-widest uppercase bg-obsidian-950 text-gold-400 rounded-sm mb-1">
              Official Tax Invoice
            </span>
            <p className="font-mono text-sm font-bold text-obsidian-950">
              {invoiceNumber}
            </p>
            <p className="text-xs text-obsidian-600 font-mono">
              Date: {new Date().toLocaleDateString('en-NG')}
            </p>
            <p className="text-xs text-obsidian-600 font-mono">
              Event Date: {event.event_date}
            </p>
          </div>
        </div>

        {/* Bill To & Celebration Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs border-b border-sand-200 pb-8">
          <div className="space-y-1.5">
            <span className="text-[10px] uppercase font-bold tracking-wider text-obsidian-500 block">
              Commissioned By (Patron)
            </span>
            <h3 className="font-serif text-base font-bold text-obsidian-950">
              {event.client?.full_name || 'Private Patron'}
            </h3>
            {event.client?.company_name && (
              <p className="font-medium text-obsidian-700">{event.client.company_name}</p>
            )}
            <p className="text-obsidian-600">{event.client?.email}</p>
            <p className="text-obsidian-600 font-mono">{event.client?.phone}</p>
            {event.client?.address && (
              <p className="text-obsidian-500 max-w-xs">{event.client.address}</p>
            )}
          </div>

          <div className="space-y-1.5 sm:text-right">
            <span className="text-[10px] uppercase font-bold tracking-wider text-obsidian-500 block">
              Celebration Scope
            </span>
            <h3 className="font-serif text-base font-bold text-obsidian-950">
              {event.title}
            </h3>
            <p className="text-obsidian-700 font-medium capitalize">
              {event.event_type} • {event.guest_count} Invited Patrons
            </p>
            <p className="text-obsidian-600">
              Venue: <strong>{event.venue_name}</strong>
            </p>
            <p className="text-obsidian-500 text-[11px]">
              Lead Director: {event.lead_planner || 'Folashade Adeleke'}
            </p>
          </div>
        </div>

        {/* Itemized Deliverables Scope */}
        <div className="space-y-3">
          <h4 className="font-serif text-sm font-bold text-obsidian-950 uppercase tracking-wider">
            Scope of Architectural Commission
          </h4>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-300 text-obsidian-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Itemized Scope & Deliverables</th>
                <th className="py-2.5 text-center">Stage</th>
                <th className="py-2.5 text-right">Allocation (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200">
              <tr>
                <td className="py-3 pr-4">
                  <p className="font-semibold text-obsidian-950">Full Architectural Planning & Creative Direction</p>
                  <p className="text-[11px] text-obsidian-500 font-light">
                    Concept development, spatial 3D CAD modeling, guest flow choreography, and complete run-of-show direction.
                  </p>
                </td>
                <td className="py-3 text-center">
                  <Badge status={event.status} />
                </td>
                <td className="py-3 text-right font-mono font-medium">Included</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <p className="font-semibold text-obsidian-950">Bespoke Floral Sculptures & Structural Scenography</p>
                  <p className="text-[11px] text-obsidian-500 font-light">
                    Imported florals, custom glasshouse archways, architectural table styling, and ambient lighting design.
                  </p>
                </td>
                <td className="py-3 text-center">Confirmed</td>
                <td className="py-3 text-right font-mono font-medium">Included</td>
              </tr>
              <tr>
                <td className="py-3 pr-4">
                  <p className="font-semibold text-obsidian-950">Vendor Management & On-Site Concierge Stewardship</p>
                  <p className="text-[11px] text-obsidian-500 font-light">
                    Coordination of Michelin-standard catering, high-fidelity acoustics, VIP security details, and hospitality.
                  </p>
                </td>
                <td className="py-3 text-center">Active</td>
                <td className="py-3 text-right font-mono font-medium">Included</td>
              </tr>
            </tbody>
            <tfoot>
              <tr className="border-t-2 border-obsidian-950 font-serif">
                <td colSpan={2} className="py-3 font-bold text-sm text-obsidian-950">
                  Total Agreed Contract Value (NGN)
                </td>
                <td className="py-3 text-right font-mono font-bold text-base text-obsidian-950">
                  {formatNaira(event.financials?.agreed_price_kobo, false)}
                </td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Contractual Milestone Payment Schedule */}
        <div className="space-y-3 pt-2">
          <h4 className="font-serif text-sm font-bold text-obsidian-950 uppercase tracking-wider">
            Contractual Milestone Payment Schedule
          </h4>
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-sand-300 text-obsidian-500 uppercase tracking-wider text-[10px]">
                <th className="py-2.5">Tranche Milestone</th>
                <th className="py-2.5">Due Date</th>
                <th className="py-2.5 text-center">Status</th>
                <th className="py-2.5 text-right">Amount (NGN)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-sand-200 font-mono text-[11px]">
              {event.payment_schedules?.map((sch) => (
                <tr key={sch.id}>
                  <td className="py-2.5 font-sans font-medium text-obsidian-900">{sch.milestone_name}</td>
                  <td className="py-2.5 text-obsidian-600">{sch.due_date}</td>
                  <td className="py-2.5 text-center font-sans">
                    <span className={sch.is_paid ? 'text-emerald-700 font-bold' : 'text-amber-700 font-medium'}>
                      {sch.is_paid ? 'Verified & Paid' : 'Due for Payment'}
                    </span>
                  </td>
                  <td className="py-2.5 text-right font-bold text-obsidian-950">
                    {formatNaira(sch.amount_kobo, false)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Financial Summary & Balance Block */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6 p-6 bg-sand-50 border border-sand-300 rounded-sm">
          <div className="space-y-1 text-xs">
            <span className="font-semibold text-obsidian-950 block">Settlement Status Summary:</span>
            <p className="text-obsidian-600">
              Verified Paid Collections: <strong className="text-emerald-800 font-mono">{formatNaira(event.financials?.total_paid_kobo, false)}</strong>
            </p>
            <p className="text-obsidian-600">
              Outstanding Balance Due: <strong className="text-amber-800 font-mono">{formatNaira(event.financials?.balance_kobo, false)}</strong>
            </p>
          </div>

          <div className="text-left sm:text-right font-mono space-y-0.5">
            <span className="text-[10px] uppercase font-sans font-bold tracking-widest text-obsidian-500 block">
              Net Balance Outstanding
            </span>
            <p className="text-2xl font-bold text-obsidian-950">
              {formatNaira(event.financials?.balance_kobo, false)}
            </p>
          </div>
        </div>

        {/* Bank Wire Details & Official Seal */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs pt-2">
          <div className="space-y-2 border-l-2 border-gold-400 pl-4">
            <span className="font-semibold text-obsidian-950 uppercase tracking-wider block text-[11px]">
              Designated Bank Wire Settlement Details
            </span>
            <p className="text-obsidian-600 font-light">
              Bank Name: <strong>Zenith Bank Plc</strong><br />
              Account Name: <strong>ASEVA LUXURY EVENTS LTD</strong><br />
              Account Number: <strong className="font-mono text-gold-700 text-sm">1019283746</strong><br />
              Payment Narration: <strong>{invoiceNumber}</strong>
            </p>
          </div>

          <div className="sm:text-right space-y-3">
            <span className="text-[10px] uppercase tracking-widest text-obsidian-400 font-sans block">
              Authorized Signature & Seal
            </span>
            <div className="pt-4 border-b border-obsidian-300 w-48 sm:ml-auto" />
            <p className="font-serif text-xs font-bold text-obsidian-950">
              Folashade Adeleke
            </p>
            <p className="text-[10px] text-obsidian-500 uppercase tracking-wider">
              Creative Director & Executive Partner
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
