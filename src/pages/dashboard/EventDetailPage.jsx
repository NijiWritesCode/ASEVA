import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CalendarDays, 
  ArrowLeft, 
  CreditCard, 
  CheckSquare, 
  Package, 
  Building2, 
  Receipt, 
  Clock, 
  MapPin, 
  Users, 
  Plus, 
  CheckCircle2, 
  AlertCircle, 
  TrendingUp, 
  FileText, 
  DollarSign,
  Printer,
  ExternalLink
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Table } from '../../components/shared/Table';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { EventFinancialWidget } from '../../components/dashboard/EventFinancialWidget';
import { dashboardService } from '../../services/dashboardService';
import { paystackService } from '../../services/paystackService';
import { useKobo } from '../../hooks/useKobo';

export function EventDetailPage() {
  const { id } = useParams();
  const queryClient = useQueryClient();
  const { formatNaira } = useKobo();

  const [activeTab, setActiveTab] = useState('overview');

  // Modal States
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [paymentModalOpen, setPaymentModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [procurementModalOpen, setProcurementModalOpen] = useState(false);

  // Task Form State
  const [taskTitle, setTaskTitle] = useState('');
  const [taskDueDate, setTaskDueDate] = useState('');
  const [taskPriority, setTaskPriority] = useState('medium');
  const [taskAssignee, setTaskAssignee] = useState('Folashade Adeleke');

  // Payment Form State
  const [paymentAmountNaira, setPaymentAmountNaira] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [paymentRef, setPaymentRef] = useState('');
  const [paymentScheduleId, setPaymentScheduleId] = useState('');
  const [paymentNotes, setPaymentNotes] = useState('');

  // Expense Form State
  const [expenseAmountNaira, setExpenseAmountNaira] = useState('');
  const [expenseCategory, setExpenseCategory] = useState('Decor');
  const [expenseVendor, setExpenseVendor] = useState('');
  const [expenseNotes, setExpenseNotes] = useState('');

  // Procurement Form State
  const [procItemName, setProcItemName] = useState('');
  const [procCategory, setProcCategory] = useState('Furniture & Seating');
  const [procQuantity, setProcQuantity] = useState('100');
  const [procCostNaira, setProcCostNaira] = useState('500,000');
  const [procVendor, setProcVendor] = useState('');
  const [procDeadline, setProcDeadline] = useState('');

  const { data: event, isLoading } = useQuery({
    queryKey: ['dashboard', 'event', id],
    queryFn: () => dashboardService.getEventById(id),
  });

  const updateStatusMutation = useMutation({
    mutationFn: (newStatus) => dashboardService.updateEventStatus(id, newStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard', 'event', id] }),
  });

  const addTaskMutation = useMutation({
    mutationFn: (data) => dashboardService.createTask({ ...data, eventId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'event', id] });
      setTaskModalOpen(false);
      setTaskTitle('');
      setTaskDueDate('');
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ taskId, newStatus }) => dashboardService.updateTaskStatus(taskId, newStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard', 'event', id] }),
  });

  const recordPaymentMutation = useMutation({
    mutationFn: (data) => dashboardService.recordManualPayment({ ...data, eventId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'event', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'payments'] });
      setPaymentModalOpen(false);
      setPaymentAmountNaira('');
      setPaymentRef('');
      setPaymentNotes('');
    },
  });

  const paystackMutation = useMutation({
    mutationFn: async (milestone) => {
      const ref = paystackService.generateReference();
      return paystackService.verifyAndReconcile({
        reference: ref,
        eventId: id,
        milestoneId: milestone.id,
        amountKobo: milestone.amount_kobo,
        notes: `Paystack automated settlement for ${milestone.milestone_name}. Verified with integer-kobo integrity.`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'event', id] });
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
    },
  });

  const recordExpenseMutation = useMutation({
    mutationFn: (data) => dashboardService.recordExpense({ ...data, eventId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'event', id] });
      setExpenseModalOpen(false);
      setExpenseAmountNaira('');
      setExpenseNotes('');
    },
  });

  const addProcurementMutation = useMutation({
    mutationFn: (data) => dashboardService.createProcurementItem({ ...data, eventId: id }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'event', id] });
      setProcurementModalOpen(false);
      setProcItemName('');
    },
  });

  if (isLoading || !event) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="card" count={4} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!taskTitle || !taskDueDate) return;
    addTaskMutation.mutate({
      title: taskTitle,
      dueDate: taskDueDate,
      priority: taskPriority,
      assignedTo: taskAssignee,
    });
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    const clean = parseFloat(paymentAmountNaira.replace(/,/g, '')) || 0;
    if (clean <= 0) return;
    recordPaymentMutation.mutate({
      amountKobo: Math.round(clean * 100),
      paymentMethod,
      transactionReference: paymentRef || `TXN-ASV-${Date.now()}`,
      scheduleId: paymentScheduleId || null,
      notes: paymentNotes,
    });
  };

  const handleRecordExpense = (e) => {
    e.preventDefault();
    const clean = parseFloat(expenseAmountNaira.replace(/,/g, '')) || 0;
    if (clean <= 0) return;
    recordExpenseMutation.mutate({
      amountKobo: Math.round(clean * 100),
      category: expenseCategory,
      vendorName: expenseVendor || 'Supplier Payee',
      notes: expenseNotes,
    });
  };

  const handleAddProcurement = (e) => {
    e.preventDefault();
    const cleanCost = parseFloat(procCostNaira.replace(/,/g, '')) || 0;
    addProcurementMutation.mutate({
      itemName: procItemName,
      category: procCategory,
      quantity: parseInt(procQuantity) || 1,
      estimatedCostKobo: Math.round(cleanCost * 100),
      vendorName: procVendor,
      deadline: procDeadline,
    });
  };

  const tabs = [
    { id: 'overview', label: 'Overview & Brief', icon: FileText },
    { id: 'tasks', label: `Tasks (${event.tasks.length})`, icon: CheckSquare },
    { id: 'finances', label: `Finances & Inflow (${event.payments.length})`, icon: CreditCard },
    { id: 'expenses', label: `Expenses & Profit (${event.expenses.length})`, icon: Receipt },
    { id: 'procurement', label: `Procurement (${event.procurement_items.length})`, icon: Package },
  ];

  return (
    <div className="space-y-8">
      {/* Return Link & Header */}
      <div className="space-y-3">
        <Link to="/dashboard/events" className="text-xs font-semibold text-gold-600 hover:underline flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Return to All Events</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <h1 className="font-serif text-3xl font-bold text-obsidian-950">
                {event.title}
              </h1>
              <Badge status={event.status} />
            </div>
            <p className="text-xs text-obsidian-600 mt-1 flex items-center">
              <span>Client: </span>
              <Link to={`/dashboard/clients/${event.client_id}`} className="text-gold-700 font-semibold hover:underline ml-1">
                {event.client?.full_name || 'Private Patron'}
              </Link>
              <span className="mx-2">•</span>
              <span className="capitalize">{event.event_type}</span>
              <span className="mx-2">•</span>
              <span className="font-mono text-obsidian-800">{event.event_date}</span>
            </p>
          </div>

          {/* Actions & Stage Progression */}
          <div className="flex flex-wrap items-center gap-3">
            <Link to={`/dashboard/events/${event.id}/invoice`} target="_blank">
              <Button variant="outline" size="sm">
                <Printer className="w-3.5 h-3.5 mr-1.5" />
                <span>Invoice / Contract</span>
              </Button>
            </Link>

            <Link to={`/portal/${event.id}`} target="_blank">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                <span>Client Portal</span>
              </Button>
            </Link>

            <div className="flex items-center space-x-2 pl-2 border-l border-sand-300">
              <span className="text-xs text-obsidian-500 font-medium">Stage:</span>
              <select
                value={event.status}
                onChange={(e) => updateStatusMutation.mutate(e.target.value)}
                className="text-xs bg-white border border-sand-300 rounded px-3 py-1.5 font-semibold text-obsidian-950 focus:outline-none focus:border-gold-500"
              >
                <option value="planning">Planning Phase</option>
                <option value="ready">Ready for Production</option>
                <option value="in_progress">In Progress (Execution)</option>
                <option value="completed">Completed & Reconciled</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Health Summary Widget */}
      <EventFinancialWidget
        agreedPriceKobo={event.financials.agreed_price_kobo}
        totalPaidKobo={event.financials.total_paid_kobo}
        balanceKobo={event.financials.balance_kobo}
        totalExpensesKobo={event.financials.total_expenses_kobo}
        grossMarginKobo={event.financials.gross_margin_kobo}
        grossMarginPercent={event.financials.gross_margin_percent}
      />

      {/* Workspace Tabs Navigation */}
      <div className="border-b border-sand-300 flex overflow-x-auto gap-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 whitespace-nowrap transition-all ${
                isActive
                  ? 'border-gold-500 text-gold-700 bg-white/70'
                  : 'border-transparent text-obsidian-600 hover:text-obsidian-950 hover:bg-sand-100/50'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: OVERVIEW & BRIEF */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-7 space-y-6">
            <Card title="Production Specification & Logistics">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 text-xs text-obsidian-700">
                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Secured Venue</span>
                  <p className="font-bold text-obsidian-950 flex items-center mt-0.5">
                    <Building2 className="w-3.5 h-3.5 mr-1 text-gold-600" />
                    {event.venue_name}
                  </p>
                  <p className="text-[11px] text-obsidian-500 mt-0.5">{event.venue_address}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Attendance Scale</span>
                  <p className="font-bold text-obsidian-950 flex items-center mt-0.5">
                    <Users className="w-3.5 h-3.5 mr-1 text-gold-600" />
                    {event.guest_count} Patrons
                  </p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Lead Planning Director</span>
                  <p className="font-semibold text-obsidian-950 mt-0.5">{event.lead_planner}</p>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">Event Schedule</span>
                  <p className="font-mono text-obsidian-900 mt-0.5">Date: {event.event_date}</p>
                  {event.setup_date && (
                    <p className="font-mono text-[11px] text-obsidian-500">Setup: {event.setup_date}</p>
                  )}
                </div>
              </div>
            </Card>

            <Card title="Creative Brief & Spatial Narrative">
              <div className="p-4 bg-sand-50 rounded-sm border border-sand-200 text-xs text-obsidian-800 leading-relaxed font-light italic">
                "{event.notes || 'No specific creative notes logged.'}"
              </div>
            </Card>
          </div>

          <div className="lg:col-span-5 space-y-6">
            <Card title="Patron Contact Coordinates">
              <div className="space-y-3 text-xs text-obsidian-700">
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Client Name</span>
                  <p className="font-bold text-obsidian-950">{event.client?.full_name}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Email</span>
                  <a href={`mailto:${event.client?.email}`} className="text-gold-700 hover:underline">
                    {event.client?.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Phone</span>
                  <a
                    href={`https://wa.me/${event.client?.phone?.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-semibold hover:underline"
                  >
                    {event.client?.phone}
                  </a>
                </div>
              </div>
            </Card>
          </div>
        </div>
      )}

      {/* TAB 2: TASKS CHECKLIST */}
      {activeTab === 'tasks' && (
        <Card>
          <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-obsidian-950">
                Planning Milestones & Execution Checklist
              </h2>
              <p className="text-xs text-obsidian-600">Track deliverables, vendor checks, and rehearsal timelines.</p>
            </div>
            <Button variant="gold" size="sm" onClick={() => setTaskModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add Planning Task</span>
            </Button>
          </div>

          <div className="space-y-3">
            {event.tasks.length === 0 ? (
              <p className="text-xs text-obsidian-500 text-center py-10">No tasks currently assigned to this event.</p>
            ) : (
              event.tasks.map((task) => {
                const isCompleted = task.status === 'completed';
                return (
                  <div
                    key={task.id}
                    className={`flex items-start justify-between p-4 rounded-sm border transition-colors ${
                      isCompleted ? 'bg-sand-50/50 border-sand-200 opacity-60' : 'bg-white border-sand-300 hover:border-gold-400'
                    }`}
                  >
                    <div className="flex items-start space-x-3">
                      <button
                        onClick={() =>
                          toggleTaskMutation.mutate({
                            taskId: task.id,
                            newStatus: isCompleted ? 'pending' : 'completed',
                          })
                        }
                        className="mt-0.5 text-obsidian-400 hover:text-emerald-600 transition-colors"
                      >
                        <CheckCircle2
                          className={`w-5 h-5 ${isCompleted ? 'text-emerald-600 fill-emerald-100' : ''}`}
                        />
                      </button>
                      <div className="space-y-1">
                        <p className={`text-xs font-semibold ${isCompleted ? 'line-through text-obsidian-500' : 'text-obsidian-950'}`}>
                          {task.title}
                        </p>
                        {task.description && (
                          <p className="text-[11px] text-obsidian-600 font-light">{task.description}</p>
                        )}
                        <div className="flex items-center space-x-3 text-[11px] text-obsidian-500">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1 text-gold-600" />
                            Due {task.due_date}
                          </span>
                          <span>•</span>
                          <span>Assigned: {task.assigned_to}</span>
                        </div>
                      </div>
                    </div>

                    <Badge status={task.priority} />
                  </div>
                );
              })
            )}
          </div>
        </Card>
      )}

      {/* TAB 3: FINANCES & MILESTONES */}
      {activeTab === 'finances' && (
        <div className="space-y-8">
          {/* Milestone Schedule */}
          <Card>
            <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-4">
              <div>
                <h2 className="font-serif text-lg font-bold text-obsidian-950">
                  Agreed Milestone Payment Schedule
                </h2>
                <p className="text-xs text-obsidian-600">Contractual tranches and installment due dates.</p>
              </div>
              <Button variant="gold" size="sm" onClick={() => setPaymentModalOpen(true)}>
                <Plus className="w-4 h-4 mr-1.5" />
                <span>Record Received Payment</span>
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {event.payment_schedules.map((sch) => (
                <div
                  key={sch.id}
                  className={`p-4 border rounded-sm space-y-2 ${
                    sch.is_paid ? 'bg-emerald-50/60 border-emerald-300' : 'bg-sand-50/70 border-sand-300'
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
                  <div className="pt-2 border-t border-sand-200/80 flex items-center justify-between">
                    <span className="text-[11px] text-obsidian-500">
                      Due: {sch.due_date}
                    </span>
                    {!sch.is_paid && (
                      <Button
                        variant="gold"
                        size="sm"
                        className="text-[10px] py-1 px-2.5 h-auto"
                        onClick={() => paystackMutation.mutate(sch)}
                        disabled={paystackMutation.isPending}
                      >
                        <CreditCard className="w-3 h-3 mr-1" />
                        <span>Pay via Paystack</span>
                      </Button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </Card>

          {/* Payments Inflow Log */}
          <Card>
            <h2 className="font-serif text-lg font-bold text-obsidian-950 border-b border-sand-200 pb-4 mb-4">
              Confirmed Payment Inflows
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-sand-100/70 border-b border-sand-300 text-obsidian-600 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Reference Code</th>
                    <th className="py-3 px-4">Method</th>
                    <th className="py-3 px-4 text-right">Amount (NGN)</th>
                    <th className="py-3 px-4 text-center">Status</th>
                    <th className="py-3 px-4">Recorded By</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-sand-200">
                  {event.payments.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-8 text-center text-obsidian-500">
                        No payments recorded yet.
                      </td>
                    </tr>
                  ) : (
                    event.payments.map((p) => (
                      <tr key={p.id} className="hover:bg-sand-50/60">
                        <td className="py-3 px-4 font-mono text-[11px]">{new Date(p.payment_date).toLocaleDateString('en-NG')}</td>
                        <td className="py-3 px-4 font-mono font-bold text-gold-700">{p.transaction_reference}</td>
                        <td className="py-3 px-4 capitalize">{p.payment_method.replace('_', ' ')}</td>
                        <td className="py-3 px-4 font-mono font-bold text-emerald-800 text-right">{formatNaira(p.amount_kobo, false)}</td>
                        <td className="py-3 px-4 text-center"><Badge status={p.status} /></td>
                        <td className="py-3 px-4 text-obsidian-600">{p.recorded_by}</td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* TAB 4: EXPENSES & MARGINS */}
      {activeTab === 'expenses' && (
        <Card>
          <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-obsidian-950">
                Disbursements & Operational Costs
              </h2>
              <p className="text-xs text-obsidian-600">Track payments made to catering, floral, AV, and security vendors.</p>
            </div>
            <Button variant="gold" size="sm" onClick={() => setExpenseModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Log Expense Disbursement</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/70 border-b border-sand-300 text-obsidian-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Vendor Payee</th>
                  <th className="py-3 px-4">Notes</th>
                  <th className="py-3 px-4 text-right">Amount (NGN)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {event.expenses.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-obsidian-500">
                      No expense disbursements recorded yet.
                    </td>
                  </tr>
                ) : (
                  event.expenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-sand-50/60">
                      <td className="py-3 px-4 font-mono text-[11px]">{exp.expense_date}</td>
                      <td className="py-3 px-4 font-semibold text-obsidian-900">{exp.category}</td>
                      <td className="py-3 px-4 text-obsidian-700">{exp.vendor_name}</td>
                      <td className="py-3 px-4 text-obsidian-500 font-light truncate max-w-xs">{exp.notes || '—'}</td>
                      <td className="py-3 px-4 font-mono font-bold text-obsidian-950 text-right">{formatNaira(exp.amount_kobo, false)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 5: PROCUREMENT ITEMS */}
      {activeTab === 'procurement' && (
        <Card>
          <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-obsidian-950">
                Physical Rentals & Decor Procurement
              </h2>
              <p className="text-xs text-obsidian-600">Requisitions for chairs, chandeliers, staging, and technical assets.</p>
            </div>
            <Button variant="gold" size="sm" onClick={() => setProcurementModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Add Requisition</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/70 border-b border-sand-300 text-obsidian-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Item Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4 text-center">Qty</th>
                  <th className="py-3 px-4">Supplier</th>
                  <th className="py-3 px-4 text-right">Est. Cost (NGN)</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {event.procurement_items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-obsidian-500">
                      No procurement items logged for this event.
                    </td>
                  </tr>
                ) : (
                  event.procurement_items.map((item) => (
                    <tr key={item.id} className="hover:bg-sand-50/60">
                      <td className="py-3 px-4 font-semibold text-obsidian-950">{item.item_name}</td>
                      <td className="py-3 px-4 text-obsidian-700">{item.category}</td>
                      <td className="py-3 px-4 text-center font-bold text-obsidian-900">{item.quantity}</td>
                      <td className="py-3 px-4 text-obsidian-600">{item.vendor_name || 'TBD'}</td>
                      <td className="py-3 px-4 font-mono font-medium text-obsidian-950 text-right">{formatNaira(item.estimated_cost_kobo, false)}</td>
                      <td className="py-3 px-4 text-center"><Badge status={item.status} /></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL: ADD TASK */}
      <Modal
        isOpen={taskModalOpen}
        onClose={() => setTaskModalOpen(false)}
        title="Add Event Planning Task"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setTaskModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" onClick={handleCreateTask} loading={addTaskMutation.isPending}>
              Add Task
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
          <Input
            label="Task Action Item"
            required
            placeholder="e.g. Confirm Sommelier Wine Pairing Menu"
            value={taskTitle}
            onChange={(e) => setTaskTitle(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Due Date"
              type="date"
              required
              value={taskDueDate}
              onChange={(e) => setTaskDueDate(e.target.value)}
            />
            <Select
              label="Priority Level"
              value={taskPriority}
              onChange={(e) => setTaskPriority(e.target.value)}
            >
              <option value="low">Low Priority</option>
              <option value="medium">Medium Priority</option>
              <option value="high">High Priority</option>
              <option value="critical">Critical</option>
            </Select>
          </div>
        </form>
      </Modal>

      {/* MODAL: RECORD PAYMENT */}
      <Modal
        isOpen={paymentModalOpen}
        onClose={() => setPaymentModalOpen(false)}
        title="Record Received Client Payment"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setPaymentModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" onClick={handleRecordPayment} loading={recordPaymentMutation.isPending}>
              Record Inflow
            </Button>
          </div>
        }
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs">
          <Input
            label="Amount Paid (NGN)"
            required
            placeholder="e.g. 15,000,000"
            value={paymentAmountNaira}
            onChange={(e) => setPaymentAmountNaira(e.target.value)}
            helperText="Stored accurately in integer kobo."
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Payment Method"
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value)}
            >
              <option value="bank_transfer">Direct Bank Wire</option>
              <option value="paystack">Paystack Online</option>
              <option value="pos">POS Terminal</option>
              <option value="cash">Cash / Bank Deposit</option>
            </Select>
            <Input
              label="Transaction Reference"
              placeholder="e.g. CBN-ASV-99201"
              value={paymentRef}
              onChange={(e) => setPaymentRef(e.target.value)}
            />
          </div>
          <Select
            label="Linked Milestone (Optional)"
            value={paymentScheduleId}
            onChange={(e) => setPaymentScheduleId(e.target.value)}
          >
            <option value="">General payment / unallocated</option>
            {event.payment_schedules.map((s) => (
              <option key={s.id} value={s.id}>
                {s.milestone_name} ({formatNaira(s.amount_kobo, false)})
              </option>
            ))}
          </Select>
          <Textarea
            label="Payment Notes"
            rows={2}
            value={paymentNotes}
            onChange={(e) => setPaymentNotes(e.target.value)}
          />
        </form>
      </Modal>

      {/* MODAL: LOG EXPENSE */}
      <Modal
        isOpen={expenseModalOpen}
        onClose={() => setExpenseModalOpen(false)}
        title="Log Operational Disbursement"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setExpenseModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" onClick={handleRecordExpense} loading={recordExpenseMutation.isPending}>
              Record Expense
            </Button>
          </div>
        }
      >
        <form onSubmit={handleRecordExpense} className="space-y-4 text-xs">
          <Input
            label="Disbursement Amount (NGN)"
            required
            placeholder="e.g. 2,500,000"
            value={expenseAmountNaira}
            onChange={(e) => setExpenseAmountNaira(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Expense Category"
              value={expenseCategory}
              onChange={(e) => setExpenseCategory(e.target.value)}
            >
              <option value="Catering">Catering & Beverage</option>
              <option value="Florals & Decor">Florals & Decor</option>
              <option value="Audiovisual">Audiovisual & Lighting</option>
              <option value="Security">Security & Protocol</option>
              <option value="Photography">Photography & Film</option>
              <option value="Logistics">Logistics & Permits</option>
            </Select>
            <Input
              label="Vendor / Payee Name"
              placeholder="e.g. Gourmet Affairs"
              value={expenseVendor}
              onChange={(e) => setExpenseVendor(e.target.value)}
            />
          </div>
          <Textarea
            label="Disbursement Description"
            rows={2}
            value={expenseNotes}
            onChange={(e) => setExpenseNotes(e.target.value)}
          />
        </form>
      </Modal>

      {/* MODAL: ADD PROCUREMENT ITEM */}
      <Modal
        isOpen={procurementModalOpen}
        onClose={() => setProcurementModalOpen(false)}
        title="Add Procurement Requisition"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setProcurementModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="gold" size="sm" onClick={handleAddProcurement} loading={addProcurementMutation.isPending}>
              Save Requisition
            </Button>
          </div>
        }
      >
        <form onSubmit={handleAddProcurement} className="space-y-4 text-xs">
          <Input
            label="Item Name / Description"
            required
            placeholder="e.g. Chiavari Crystal Chairs"
            value={procItemName}
            onChange={(e) => setProcItemName(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Category"
              value={procCategory}
              onChange={(e) => setProcCategory(e.target.value)}
            >
              <option value="Furniture & Seating">Furniture & Seating</option>
              <option value="Lighting & Scenography">Lighting & Scenography</option>
              <option value="Tableware & Linens">Tableware & Linens</option>
              <option value="Audiovisual & Staging">Audiovisual & Staging</option>
            </Select>
            <Input
              label="Quantity Required"
              type="number"
              required
              value={procQuantity}
              onChange={(e) => setProcQuantity(e.target.value)}
            />
          </div>
          <Input
            label="Estimated Budget Cost (NGN)"
            required
            placeholder="e.g. 1,500,000"
            value={procCostNaira}
            onChange={(e) => setProcCostNaira(e.target.value)}
          />
          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Supplier / Vendor"
              placeholder="e.g. Royal Rentals Lagos"
              value={procVendor}
              onChange={(e) => setProcVendor(e.target.value)}
            />
            <Input
              label="Required On-Site Date"
              type="date"
              value={procDeadline}
              onChange={(e) => setProcDeadline(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
