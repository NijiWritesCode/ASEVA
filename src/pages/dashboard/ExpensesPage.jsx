import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Receipt, 
  Search, 
  Plus, 
  Filter, 
  TrendingUp, 
  ArrowRight,
  Building2,
  Calendar,
  DollarSign,
  PieChart
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
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function ExpensesPage() {
  const queryClient = useQueryClient();
  const { formatNaira, formatCompact } = useKobo();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [eventId, setEventId] = useState('');
  const [category, setCategory] = useState('Catering');
  const [vendorName, setVendorName] = useState('');
  const [amountNaira, setAmountNaira] = useState('');
  const [expenseDate, setExpenseDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const { data: metrics } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getDashboardMetrics(),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: () => dashboardService.getEvents(),
  });

  const { data: expenses = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'expenses', categoryFilter, eventFilter],
    queryFn: () => dashboardService.getExpenses({ category: categoryFilter, eventId: eventFilter }),
  });

  const recordExpenseMutation = useMutation({
    mutationFn: (data) => dashboardService.recordExpense(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setEventId('');
    setCategory('Catering');
    setVendorName('');
    setAmountNaira('');
    setNotes('');
  };

  const handleRecordExpense = (e) => {
    e.preventDefault();
    if (!eventId || !amountNaira) return;

    const clean = parseFloat(amountNaira.replace(/,/g, '')) || 0;
    if (clean <= 0) return;

    recordExpenseMutation.mutate({
      eventId,
      category,
      vendorName,
      amountKobo: Math.round(clean * 100),
      expenseDate,
      notes,
    });
  };

  // Compute Total Operational Spend & Gross Profit Margin
  const totalExpensesKobo = expenses.reduce((acc, exp) => acc + BigInt(exp.amount_kobo), 0n);
  const totalContractRevenueKobo = metrics ? BigInt(metrics.totalContractValueKobo) : 0n;
  const grossMarginKobo = totalContractRevenueKobo > totalExpensesKobo ? totalContractRevenueKobo - totalExpensesKobo : 0n;
  const grossMarginPercent = totalContractRevenueKobo > 0n ? Number((grossMarginKobo * 100n) / totalContractRevenueKobo) : 0;

  const columns = [
    {
      header: 'Disbursement Date',
      accessor: 'expense_date',
      cellClassName: 'font-mono text-xs text-obsidian-700',
    },
    {
      header: 'Event Commission',
      accessor: 'event_title',
      cellClassName: 'font-semibold text-obsidian-950',
      render: (val, row) => (
        <Link to={`/dashboard/events/${row.event_id}`} className="hover:text-gold-600 transition-colors">
          {val}
        </Link>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      cellClassName: 'text-obsidian-800 font-medium',
    },
    {
      header: 'Supplier / Vendor Payee',
      accessor: 'vendor_name',
      cellClassName: 'text-obsidian-700',
    },
    {
      header: 'Disbursement Description',
      accessor: 'notes',
      cellClassName: 'text-obsidian-500 font-light truncate max-w-xs',
      render: (val) => val || '—',
    },
    {
      header: 'Amount (NGN)',
      accessor: 'amount_kobo',
      align: 'right',
      cellClassName: 'font-mono font-bold text-obsidian-950',
      render: (val) => formatNaira(val, false),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Expense Logging & Profitability Analysis
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Tracking vendor disbursements, operational overheads, and real gross operating margins in Nigerian Naira.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Log Disbursement</span>
        </Button>
      </div>

      {/* Margin Analytics Widget */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
            Contract Revenue (Booked)
          </span>
          <p className="font-mono text-2xl font-bold text-obsidian-950">
            {metrics ? formatNaira(metrics.totalContractValueKobo, false) : '—'}
          </p>
          <span className="text-[11px] text-obsidian-500 font-light">
            Base production commission contracts
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-rose-700 font-semibold block">
            Total Operational Disbursements
          </span>
          <p className="font-mono text-2xl font-bold text-rose-800">
            {formatNaira(Number(totalExpensesKobo), false)}
          </p>
          <span className="text-[11px] text-rose-600 font-light">
            Paid to catering, florals, AV & decor
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold block">
            Gross Operating Margin
          </span>
          <p className="font-mono text-2xl font-bold text-emerald-800">
            {formatNaira(Number(grossMarginKobo), false)}{' '}
            <span className="text-sm font-sans font-normal text-emerald-600">
              ({grossMarginPercent}%)
            </span>
          </p>
          <span className="text-[11px] text-emerald-600 font-light">
            Atelier retained operating profit
          </span>
        </div>
      </div>

      <Card>
        {/* Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
          <div className="sm:col-span-6">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full py-2 px-3 bg-sand-50 border border-sand-300 rounded-sm text-xs text-obsidian-900 focus:outline-none focus:border-gold-500"
            >
              <option value="all">Filter by All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-6">
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="w-full py-2 px-3 bg-sand-50 border border-sand-300 rounded-sm text-xs text-obsidian-900 focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Expense Categories</option>
              <option value="Catering">Catering & Beverage</option>
              <option value="Florals & Decor">Florals & Decor</option>
              <option value="Audiovisual">Audiovisual & Lighting</option>
              <option value="Security">Security & Protocol</option>
              <option value="Photography">Photography & Film</option>
              <option value="Logistics">Logistics & Permits</option>
            </select>
          </div>
        </div>

        {/* Expenses Table */}
        {isLoading ? (
          <LoadingSkeleton variant="table" />
        ) : (
          <Table
            columns={columns}
            data={expenses}
            emptyTitle="No Expenses Recorded"
            emptyDescription="Log an operational disbursement to reconcile vendor costs."
          />
        )}
      </Card>

      {/* Modal: Log Expense */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Log Operational Disbursement"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleRecordExpense}
              loading={recordExpenseMutation.isPending}
            >
              Save Disbursement
            </Button>
          </div>
        }
      >
        <form onSubmit={handleRecordExpense} className="space-y-4 text-xs text-obsidian-700">
          <Select
            label="Credited Event Commission"
            required
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Select confirmed event...</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </Select>

          <Input
            label="Disbursement Amount (NGN)"
            required
            placeholder="e.g. 2,500,000"
            value={amountNaira}
            onChange={(e) => setAmountNaira(e.target.value)}
            helperText="Stored accurately in integer kobo."
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Expense Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Catering">Catering & Gastronomy</option>
              <option value="Florals & Decor">Florals & Decor</option>
              <option value="Audiovisual">Audiovisual & Staging</option>
              <option value="Security">Security & Protocol</option>
              <option value="Photography">Photography & Media</option>
              <option value="Logistics">Permits & Transport</option>
            </Select>

            <Input
              label="Supplier / Vendor Payee"
              placeholder="e.g. Gourmet Affairs"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />
          </div>

          <Input
            label="Payment Date"
            type="date"
            value={expenseDate}
            onChange={(e) => setExpenseDate(e.target.value)}
          />

          <Textarea
            label="Disbursement Notes / Invoice Details"
            rows={2}
            placeholder="Invoice number, scope of work, bank transaction reference..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
