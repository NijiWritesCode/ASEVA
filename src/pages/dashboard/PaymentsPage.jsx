import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CreditCard, 
  Search, 
  Plus, 
  TrendingUp, 
  AlertCircle, 
  Filter, 
  ArrowRight,
  Building2,
  Calendar,
  FileCheck
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

export function PaymentsPage() {
  const queryClient = useQueryClient();
  const { formatNaira, formatCompact } = useKobo();

  const [searchTerm, setSearchTerm] = useState('');
  const [methodFilter, setMethodFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Record Payment Form State
  const [selectedEventId, setSelectedEventId] = useState('');
  const [amountNaira, setAmountNaira] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('bank_transfer');
  const [reference, setReference] = useState('');
  const [paymentDate, setPaymentDate] = useState(new Date().toISOString().split('T')[0]);
  const [notes, setNotes] = useState('');

  const { data: metrics } = useQuery({
    queryKey: ['dashboard', 'overview'],
    queryFn: () => dashboardService.getDashboardMetrics(),
  });

  const { data: events = [] } = useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: () => dashboardService.getEvents(),
  });

  const { data: payments = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'payments', methodFilter, eventFilter, searchTerm],
    queryFn: () => dashboardService.getPayments({ method: methodFilter, eventId: eventFilter, search: searchTerm }),
  });

  const recordPaymentMutation = useMutation({
    mutationFn: (data) => dashboardService.recordManualPayment(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setSelectedEventId('');
    setAmountNaira('');
    setPaymentMethod('bank_transfer');
    setReference('');
    setNotes('');
  };

  const handleRecordPayment = (e) => {
    e.preventDefault();
    if (!selectedEventId || !amountNaira) return;

    const clean = parseFloat(amountNaira.replace(/,/g, '')) || 0;
    if (clean <= 0) return;

    recordPaymentMutation.mutate({
      eventId: selectedEventId,
      amountKobo: Math.round(clean * 100),
      paymentMethod,
      transactionReference: reference || `TXN-ASV-${Date.now()}`,
      paymentDate: new Date(paymentDate).toISOString(),
      notes,
    });
  };

  const columns = [
    {
      header: 'Payment Date',
      accessor: 'payment_date',
      cellClassName: 'font-mono text-xs text-obsidian-700',
      render: (val) => new Date(val).toLocaleDateString('en-NG'),
    },
    {
      header: 'Reference Code',
      accessor: 'transaction_reference',
      cellClassName: 'font-mono font-bold text-gold-700 text-xs',
    },
    {
      header: 'Commission Project',
      accessor: 'event_title',
      cellClassName: 'font-semibold text-obsidian-950',
      render: (val, row) => (
        <Link to={`/dashboard/events/${row.event_id}`} className="hover:text-gold-600 transition-colors">
          {val}
        </Link>
      ),
    },
    {
      header: 'Payment Method',
      accessor: 'payment_method',
      cellClassName: 'capitalize text-obsidian-700 text-xs',
      render: (val) => val.replace('_', ' '),
    },
    {
      header: 'Amount Received (NGN)',
      accessor: 'amount_kobo',
      align: 'right',
      cellClassName: 'font-mono font-bold text-emerald-800',
      render: (val) => formatNaira(val, false),
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (val) => <Badge status={val} />,
    },
    {
      header: 'Recorded By',
      accessor: 'recorded_by',
      cellClassName: 'text-obsidian-500 text-xs',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Financial Ledger & Payment Inflows
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Reconciliation of client contract deposits, bank wires, POS terminals, and Paystack receipts in Nigerian Naira.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Record Client Payment</span>
        </Button>
      </div>

      {/* Financial Health Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
            Total Booked Contract Value
          </span>
          <p className="font-mono text-2xl font-bold text-obsidian-950">
            {metrics ? formatNaira(metrics.totalContractValueKobo, false) : '—'}
          </p>
          <span className="text-[11px] text-obsidian-500 font-light">
            Across active event projects
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold block">
            Total Cash Collected
          </span>
          <p className="font-mono text-2xl font-bold text-emerald-800">
            {metrics ? formatNaira(metrics.cashCollectedKobo, false) : '—'}
          </p>
          <span className="text-[11px] text-emerald-600 font-light">
            Verified to company bank accounts
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold block">
            Outstanding Receivables
          </span>
          <p className="font-mono text-2xl font-bold text-amber-900">
            {metrics ? formatNaira(metrics.balanceDueKobo, false) : '—'}
          </p>
          <span className="text-[11px] text-amber-700 font-light">
            Subject to scheduled milestone installments
          </span>
        </div>
      </div>

      <Card>
        {/* Search & Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mb-6">
          <div className="sm:col-span-6 relative">
            <Search className="w-4 h-4 absolute left-3 top-3 text-obsidian-400" />
            <input
              type="text"
              placeholder="Search by reference code, event title, or staff notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-sand-50 border border-sand-300 rounded-sm text-xs focus:outline-none focus:border-gold-500"
            />
          </div>

          <div className="sm:col-span-3">
            <select
              value={methodFilter}
              onChange={(e) => setMethodFilter(e.target.value)}
              className="w-full py-2 px-3 bg-sand-50 border border-sand-300 rounded-sm text-xs text-obsidian-900 focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Payment Channels</option>
              <option value="bank_transfer">Direct Bank Wire</option>
              <option value="paystack">Paystack Online</option>
              <option value="pos">POS Terminal</option>
              <option value="cash">Cash / Bank Deposit</option>
            </select>
          </div>

          <div className="sm:col-span-3">
            <select
              value={eventFilter}
              onChange={(e) => setEventFilter(e.target.value)}
              className="w-full py-2 px-3 bg-sand-50 border border-sand-300 rounded-sm text-xs text-obsidian-900 focus:outline-none focus:border-gold-500"
            >
              <option value="all">All Events</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.title}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Payments Table */}
        {isLoading ? (
          <LoadingSkeleton variant="table" />
        ) : (
          <Table
            columns={columns}
            data={payments}
            emptyTitle="No Payments Located"
            emptyDescription="Record a new customer installment or verify an online transaction reference."
          />
        )}
      </Card>

      {/* Modal: Record Manual Payment */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Record Client Inflow Payment"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleRecordPayment}
              loading={recordPaymentMutation.isPending}
            >
              Confirm Payment Inflow
            </Button>
          </div>
        }
      >
        <form onSubmit={handleRecordPayment} className="space-y-4 text-xs text-obsidian-700">
          <Select
            label="Credited Event Project"
            required
            value={selectedEventId}
            onChange={(e) => setSelectedEventId(e.target.value)}
          >
            <option value="">Select confirmed event...</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title} — {ev.client_name}
              </option>
            ))}
          </Select>

          <Input
            label="Amount Paid (NGN)"
            required
            placeholder="e.g. 15,000,000"
            value={amountNaira}
            onChange={(e) => setAmountNaira(e.target.value)}
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
              <option value="cash">Cash / Bank Teller</option>
            </Select>

            <Input
              label="Transaction Reference"
              placeholder="e.g. CBN-ASV-99201"
              value={reference}
              onChange={(e) => setReference(e.target.value)}
            />
          </div>

          <Input
            label="Payment Date"
            type="date"
            value={paymentDate}
            onChange={(e) => setPaymentDate(e.target.value)}
          />

          <Textarea
            label="Internal Reconciliation Notes"
            rows={2}
            placeholder="Bank branch, issuing account name, or milestone allocation..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
