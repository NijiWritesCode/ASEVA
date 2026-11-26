import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CalendarDays, 
  Inbox, 
  TrendingUp, 
  AlertCircle,
  ArrowRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Building2,
  Sparkles,
  MapPin,
  Calendar,
  Layers,
  ChevronRight,
  Check
} from 'lucide-react';
import { KpiCard } from '../../components/dashboard/KpiCard';
import { Table } from '../../components/shared/Table';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function OverviewPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { formatNaira, formatCompact } = useKobo();

  const { data: metrics, isLoading } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getDashboardMetrics(),
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ taskId, newStatus }) => dashboardService.updateTaskStatus(taskId, newStatus),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  if (isLoading || !metrics) {
    return (
      <div className="space-y-10">
        <LoadingSkeleton variant="title" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <LoadingSkeleton variant="card" count={4} />
        </div>
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  // Streamlined 5-column architecture: Eliminates horizontal overflow completely
  // while preserving and elevating context by grouping related metadata.
  const columns = [
    {
      header: 'Production & Patron',
      accessor: 'title',
      className: 'w-[32%]',
      cellClassName: 'py-4',
      render: (val, row) => (
        <div className="space-y-1">
          <Link
            to={`/dashboard/events/${row.id}`}
            className="font-serif text-sm font-semibold text-obsidian-950 hover:text-gold-600 transition-colors block leading-snug"
          >
            {val}
          </Link>
          <div className="flex items-center space-x-2 text-[11px] text-obsidian-600">
            <span className="font-medium text-obsidian-800">{row.client_name}</span>
            <span>•</span>
            <span className="capitalize text-obsidian-500">{row.event_type || 'Bespoke Production'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Schedule & Location',
      accessor: 'event_date',
      className: 'w-[26%]',
      cellClassName: 'py-4',
      render: (val, row) => (
        <div className="space-y-1">
          <div className="flex items-center text-xs font-mono font-medium text-obsidian-900">
            <Calendar className="w-3.5 h-3.5 mr-1.5 text-gold-600 shrink-0" />
            <span>{val}</span>
          </div>
          <div className="flex items-center text-[11px] text-obsidian-600 truncate max-w-xs">
            <MapPin className="w-3 h-3 mr-1 text-obsidian-400 shrink-0" />
            <span className="truncate">{row.venue_name || 'Venue TBA'}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Financial Standing',
      accessor: 'agreed_price_kobo',
      className: 'w-[22%]',
      cellClassName: 'py-4',
      render: (val, row) => (
        <div className="space-y-1">
          <p className="font-mono text-xs font-bold text-obsidian-950">
            {formatNaira(val, false)}
          </p>
          <div className="flex items-center space-x-1.5">
            <Badge status={row.payment_status} />
            <span className="text-[10px] font-mono text-obsidian-600">
              Paid: {formatCompact(row.paid_kobo)}
            </span>
          </div>
        </div>
      ),
    },
    {
      header: 'Production Stage',
      accessor: 'status',
      align: 'center',
      className: 'w-[12%]',
      cellClassName: 'py-4 text-center',
      render: (val) => <Badge status={val} />,
    },
    {
      header: 'Workspace',
      align: 'right',
      className: 'w-[8%]',
      cellClassName: 'py-4 text-right',
      render: (_, row) => (
        <Link to={`/dashboard/events/${row.id}`}>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <span>Manage</span>
            <ChevronRight className="w-3.5 h-3.5 ml-1 text-obsidian-400" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-10 sm:space-y-12">
      {/* Top Banner & Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 pb-6 border-b border-sand-300/80">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 tracking-wide">
              Live Operations Feed
            </span>
            <span className="text-xs text-obsidian-500 font-mono">
              NGN Integer-Kobo Ledger Active
            </span>
          </div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian-950 tracking-tight">
            Executive Operations Overview
          </h1>
          <p className="text-xs sm:text-sm text-obsidian-600 max-w-2xl">
            Real-time fiscal positioning, active production timelines, and inbound bespoke commissions in Nigerian Naira.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <Link to="/dashboard/events">
            <Button variant="outline" size="sm">
              <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
              <span>All Events</span>
            </Button>
          </Link>
          <Link to="/dashboard/enquiries">
            <Button variant="gold" size="sm">
              <Inbox className="w-3.5 h-3.5 mr-1.5" />
              <span>Review Enquiries ({metrics.newEnquiriesCount})</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <KpiCard
          title="Active Confirmed Events"
          value={metrics.activeEventsCount}
          subtitle="Projects in production"
          icon={CalendarDays}
          variant="gold"
          change="+2 from last month"
          changeType="positive"
        />

        <KpiCard
          title="Inbound Enquiries"
          value={metrics.newEnquiriesCount}
          subtitle="Awaiting feasibility review"
          icon={Inbox}
          variant="blue"
          change={metrics.newEnquiriesCount > 0 ? 'Requires attention' : 'All cleared'}
          changeType={metrics.newEnquiriesCount > 0 ? 'neutral' : 'positive'}
        />

        <KpiCard
          title="Cash Collected (Inflow)"
          value={formatCompact(metrics.cashCollectedKobo)}
          subtitle="Verified via bank & Paystack"
          icon={TrendingUp}
          variant="emerald"
          change="Reconciled to bank ledger"
          changeType="positive"
        />

        <KpiCard
          title="Balance Due (Receivables)"
          value={formatCompact(metrics.balanceDueKobo)}
          subtitle="Contract fee minus collections"
          icon={AlertCircle}
          variant="amber"
          change="Subject to payment milestones"
          changeType="neutral"
        />
      </div>

      {/* Upcoming Confirmed Events Data Table — Primary Operational Centerpiece */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="font-serif text-lg sm:text-xl font-bold text-obsidian-950">
              Upcoming Production Schedule
            </h2>
            <p className="text-xs text-obsidian-600 mt-0.5">
              Active bespoke commissions currently in planning and active execution
            </p>
          </div>
          <Link
            to="/dashboard/events"
            className="text-xs font-medium text-gold-600 hover:text-gold-700 flex items-center transition-colors self-start sm:self-auto"
          >
            <span>View Full Schedule ({metrics.upcomingEvents.length})</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        <Table
          columns={columns}
          data={metrics.upcomingEvents}
          emptyTitle="No Confirmed Events"
          emptyDescription="Convert incoming inquiries or create a new event project to begin tracking production."
        />
      </div>

      {/* Split Action Center & Inbound Pipeline — Secondary Focus */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left: Urgent Milestones Checklist */}
        <div className="bg-white border border-sand-300 rounded-sm p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-amber-50 text-amber-700 flex items-center justify-center shrink-0 border border-amber-200">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-obsidian-950">
                  Action Center — Urgent Tasks
                </h2>
                <p className="text-[11px] text-obsidian-500">
                  High-priority production milestones requiring sign-off
                </p>
              </div>
            </div>
            <Link to="/dashboard/tasks" className="text-xs font-medium text-gold-600 hover:underline">
              View All Tasks →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.urgentTasks.length === 0 ? (
              <p className="text-xs text-obsidian-500 py-6 text-center">No urgent planning tasks pending.</p>
            ) : (
              metrics.urgentTasks.slice(0, 3).map((task) => (
                <div
                  key={task.id}
                  className="flex items-start justify-between p-4 rounded-sm bg-sand-50/70 border border-sand-200/90 hover:bg-sand-100/60 transition-colors"
                >
                  <div className="space-y-1.5 pr-4">
                    <p className="text-xs font-semibold text-obsidian-950 leading-snug">
                      {task.title}
                    </p>
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-obsidian-500">
                      <span className="font-medium text-obsidian-800">{task.event_title}</span>
                      <span>•</span>
                      <span className="flex items-center text-amber-700 font-mono">
                        <Clock className="w-3 h-3 mr-1" />
                        Due {task.due_date}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2.5 shrink-0 pt-0.5">
                    <Badge status={task.priority} />
                    <button
                      onClick={() =>
                        toggleTaskMutation.mutate({
                          taskId: task.id,
                          newStatus: 'completed',
                        })
                      }
                      title="Mark task completed"
                      className="p-1.5 text-obsidian-400 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Right: Inbound Inquiries Awaiting Review */}
        <div className="bg-white border border-sand-300 rounded-sm p-6 sm:p-7 space-y-5 shadow-sm">
          <div className="flex items-center justify-between border-b border-sand-200 pb-4">
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-full bg-gold-50 text-gold-700 flex items-center justify-center shrink-0 border border-gold-200">
                <Inbox className="w-4 h-4" />
              </div>
              <div>
                <h2 className="font-serif text-base font-bold text-obsidian-950">
                  New Leads & Consultations
                </h2>
                <p className="text-[11px] text-obsidian-500">
                  Prospective patrons awaiting seasonal triage
                </p>
              </div>
            </div>
            <Link to="/dashboard/enquiries" className="text-xs font-medium text-gold-600 hover:underline">
              Open Pipeline →
            </Link>
          </div>

          <div className="space-y-3">
            {metrics.pendingEnquiries.length === 0 ? (
              <p className="text-xs text-obsidian-500 py-6 text-center">All customer inquiries have been processed.</p>
            ) : (
              metrics.pendingEnquiries.slice(0, 3).map((enq) => (
                <div
                  key={enq.id}
                  className="p-4 rounded-sm bg-sand-50/70 border border-sand-200/90 hover:bg-sand-100/60 transition-colors flex items-center justify-between gap-4"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <span className="font-mono text-[11px] font-bold text-gold-700">
                        {enq.reference_code}
                      </span>
                      <Badge status={enq.status} />
                    </div>
                    <p className="text-xs font-semibold text-obsidian-950 truncate">
                      {enq.full_name}
                    </p>
                    <p className="text-[11px] text-obsidian-500 truncate">
                      {enq.event_type.toUpperCase()} • Target: {enq.preferred_date} • {enq.estimated_budget}
                    </p>
                  </div>

                  <Link to="/dashboard/enquiries" className="shrink-0">
                    <Button variant="outline" size="sm">
                      Review
                    </Button>
                  </Link>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
