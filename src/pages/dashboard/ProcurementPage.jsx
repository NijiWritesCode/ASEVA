import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Package, 
  Search, 
  Plus, 
  Filter, 
  Building2, 
  Clock, 
  CheckCircle2, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Table } from '../../components/shared/Table';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function ProcurementPage() {
  const queryClient = useQueryClient();
  const { formatNaira } = useKobo();

  const [statusFilter, setStatusFilter] = useState('all');
  const [eventFilter, setEventFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [itemName, setItemName] = useState('');
  const [category, setCategory] = useState('Furniture & Seating');
  const [eventId, setEventId] = useState('');
  const [quantity, setQuantity] = useState('100');
  const [costNaira, setCostNaira] = useState('500,000');
  const [vendorName, setVendorName] = useState('');
  const [deadline, setDeadline] = useState('');

  const { data: events = [] } = useQuery({
    queryKey: ['dashboard', 'events'],
    queryFn: () => dashboardService.getEvents(),
  });

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'procurement', statusFilter, eventFilter],
    queryFn: () => dashboardService.getProcurementItems({ status: statusFilter, eventId: eventFilter }),
  });

  const addItemMutation = useMutation({
    mutationFn: (data) => dashboardService.createProcurementItem(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'procurement'] });
      setModalOpen(false);
      resetForm();
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, newStatus }) => dashboardService.updateProcurementStatus(id, newStatus),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['dashboard', 'procurement'] }),
  });

  const resetForm = () => {
    setItemName('');
    setCategory('Furniture & Seating');
    setEventId('');
    setQuantity('100');
    setCostNaira('500,000');
    setVendorName('');
    setDeadline('');
  };

  const handleCreateItem = (e) => {
    e.preventDefault();
    if (!itemName || !eventId) return;

    const cleanCost = parseFloat(costNaira.replace(/,/g, '')) || 0;
    addItemMutation.mutate({
      itemName,
      category,
      eventId,
      quantity: parseInt(quantity) || 1,
      estimatedCostKobo: Math.round(cleanCost * 100),
      vendorName,
      deadline,
    });
  };

  const statusTabs = [
    { id: 'all', label: 'All Items' },
    { id: 'needed', label: 'Needed' },
    { id: 'requested', label: 'Requested' },
    { id: 'ordered', label: 'Ordered' },
    { id: 'acquired', label: 'Acquired On-Site' },
  ];

  const columns = [
    {
      header: 'Item Specification',
      accessor: 'item_name',
      cellClassName: 'font-semibold text-obsidian-950',
    },
    {
      header: 'Event Commission',
      accessor: 'event_title',
      cellClassName: 'text-gold-700 font-medium',
      render: (val, row) => (
        <Link to={`/dashboard/events/${row.event_id}`} className="hover:underline">
          {val}
        </Link>
      ),
    },
    {
      header: 'Category',
      accessor: 'category',
      cellClassName: 'text-obsidian-600',
    },
    {
      header: 'Qty',
      accessor: 'quantity',
      align: 'center',
      cellClassName: 'font-bold text-obsidian-900',
    },
    {
      header: 'Supplier / Vendor',
      accessor: 'vendor_name',
      cellClassName: 'text-obsidian-700 font-light',
      render: (val) => val || 'TBD',
    },
    {
      header: 'Est. Budget (NGN)',
      accessor: 'estimated_cost_kobo',
      align: 'right',
      cellClassName: 'font-mono font-medium text-obsidian-950',
      render: (val) => formatNaira(val, false),
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (val) => <Badge status={val} />,
    },
    {
      header: 'Progress Stage',
      align: 'right',
      render: (_, row) => (
        <select
          value={row.status}
          onChange={(e) =>
            updateStatusMutation.mutate({
              id: row.id,
              newStatus: e.target.value,
            })
          }
          className="text-[10px] bg-sand-100 border border-sand-300 rounded px-2 py-1 font-medium text-obsidian-800"
        >
          <option value="needed">Needed</option>
          <option value="requested">Requested</option>
          <option value="ordered">Ordered</option>
          <option value="acquired">Acquired On-Site</option>
        </select>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Procurement & Physical Asset Register
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Tracking custom crystal chairs, imported floral structures, staging truss, chandeliers, and table art across all commissions.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>New Requisition</span>
        </Button>
      </div>

      <Card>
        {/* Status Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-sand-200 pb-4 mb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                statusFilter === tab.id
                  ? 'bg-obsidian-950 text-sand-50 shadow-sm'
                  : 'bg-sand-100 text-obsidian-700 hover:bg-sand-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Event Filter */}
        <div className="mb-6 max-w-sm">
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

        {/* Table */}
        {isLoading ? (
          <LoadingSkeleton variant="table" />
        ) : (
          <Table
            columns={columns}
            data={items}
            emptyTitle="No Procurement Items"
            emptyDescription="Create a requisition to track physical rentals and decor assets."
          />
        )}
      </Card>

      {/* Modal: Add Requisition */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add Procurement Requisition"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleCreateItem}
              loading={addItemMutation.isPending}
            >
              Save Requisition
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateItem} className="space-y-4 text-xs text-obsidian-700">
          <Input
            label="Item Specification / Description"
            required
            placeholder="e.g. 650 Custom Clear Ghost Chairs"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />

          <Select
            label="Associated Event Commission"
            required
            value={eventId}
            onChange={(e) => setEventId(e.target.value)}
          >
            <option value="">Select event...</option>
            {events.map((ev) => (
              <option key={ev.id} value={ev.id}>
                {ev.title}
              </option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Asset Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
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
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />
          </div>

          <Input
            label="Estimated Budget Cost (NGN)"
            required
            placeholder="e.g. 1,500,000"
            value={costNaira}
            onChange={(e) => setCostNaira(e.target.value)}
            helperText="Stored accurately in integer kobo."
          />

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Rental Supplier / Vendor"
              placeholder="e.g. Royal Rentals Lagos"
              value={vendorName}
              onChange={(e) => setVendorName(e.target.value)}
            />

            <Input
              label="Required On-Site Delivery Date"
              type="date"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
