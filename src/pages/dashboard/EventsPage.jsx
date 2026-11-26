import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  CalendarDays, 
  Calendar,
  Search, 
  Plus, 
  ArrowRight, 
  Filter, 
  MapPin, 
  Users, 
  CreditCard,
  Building2,
  Clock,
  Sparkles
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

export function EventsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { formatNaira } = useKobo();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // New Event Form State
  const [title, setTitle] = useState('');
  const [clientId, setClientId] = useState('');
  const [eventType, setEventType] = useState('wedding');
  const [eventDate, setEventDate] = useState('');
  const [venueName, setVenueName] = useState('');
  const [venueAddress, setVenueAddress] = useState('');
  const [guestCount, setGuestCount] = useState('350');
  const [feeNaira, setFeeNaira] = useState('45,000,000');
  const [leadPlanner, setLeadPlanner] = useState('Folashade Adeleke');
  const [notes, setNotes] = useState('');

  const { data: events = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'events', statusFilter, searchTerm],
    queryFn: () => dashboardService.getEvents({ status: statusFilter, search: searchTerm }),
  });

  const { data: clients = [] } = useQuery({
    queryKey: ['dashboard', 'clients'],
    queryFn: () => dashboardService.getClients(),
  });

  const createEventMutation = useMutation({
    mutationFn: (eventData) => dashboardService.createEvent(eventData),
    onSuccess: (newEvent) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'events'] });
      setModalOpen(false);
      resetForm();
      navigate(`/dashboard/events/${newEvent.id}`);
    },
  });

  const resetForm = () => {
    setTitle('');
    setClientId('');
    setEventType('wedding');
    setEventDate('');
    setVenueName('');
    setVenueAddress('');
    setGuestCount('350');
    setFeeNaira('45,000,000');
    setNotes('');
  };

  const handleCreateEvent = (e) => {
    e.preventDefault();
    if (!title || !clientId || !eventDate || !venueName) return;

    const cleanFee = parseFloat(feeNaira.replace(/,/g, '')) || 45000000;
    const agreedPriceKobo = Math.round(cleanFee * 100);

    createEventMutation.mutate({
      title,
      clientId,
      eventType,
      eventDate,
      venueName,
      venueAddress,
      guestCount,
      agreedPriceKobo,
      leadPlanner,
      notes,
    });
  };

  const statusTabs = [
    { id: 'all', label: 'All Commissions' },
    { id: 'planning', label: 'Planning' },
    { id: 'ready', label: 'Ready for Production' },
    { id: 'in_progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' },
    { id: 'cancelled', label: 'Cancelled' },
  ];

  const columns = [
    {
      header: 'Event & Patron',
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
            <span className="capitalize text-obsidian-500">{row.event_type}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Schedule & Venue',
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
            <span className="truncate">{row.venue_name}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Financials (NGN)',
      accessor: 'agreed_price_kobo',
      className: 'w-[22%]',
      cellClassName: 'py-4',
      render: (val, row) => (
        <div className="space-y-1">
          <p className="font-mono text-xs font-bold text-obsidian-900">
            {formatNaira(val, false)}
          </p>
          <div className="flex items-center space-x-2 text-[10px] font-mono">
            <span className="text-emerald-700">Paid: {formatNaira(row.paid_kobo, false)}</span>
            <span className="text-obsidian-300">|</span>
            <span className="text-amber-800">Bal: {formatNaira(row.balance_kobo, false)}</span>
          </div>
        </div>
      ),
    },
    {
      header: 'Stage',
      accessor: 'status',
      align: 'center',
      className: 'w-[10%]',
      cellClassName: 'py-4 text-center',
      render: (val) => <Badge status={val} />,
    },
    {
      header: 'Action',
      align: 'right',
      className: 'w-[10%]',
      cellClassName: 'py-4 text-right',
      render: (_, row) => (
        <Link to={`/dashboard/events/${row.id}`}>
          <Button variant="outline" size="sm" className="whitespace-nowrap">
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Event Production Workspaces
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Master registry of confirmed celebrations, multi-tranche milestone schedules, task kanban boards, and expense reconciliations.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Create New Event</span>
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

        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-3 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search by event title, patron name, venue, or celebration type..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-sand-50 border border-sand-300 rounded-sm text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        {/* Events Table */}
        {isLoading ? (
          <LoadingSkeleton variant="table" />
        ) : (
          <Table
            columns={columns}
            data={events}
            emptyTitle="No Events Located"
            emptyDescription="Create a new event commission or convert an inbound booking enquiry."
          />
        )}
      </Card>

      {/* Modal: Create New Event */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Commission New Event Project"
        size="lg"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleCreateEvent}
              loading={createEventMutation.isPending}
            >
              Initialize Workspace
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateEvent} className="space-y-4 text-xs text-obsidian-700">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Input
                label="Official Event Title"
                required
                placeholder="e.g. The Danjuma Imperial Nuptials"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <Select
              label="Commissioning Client / Patron"
              required
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
            >
              <option value="">Select a client profile...</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.full_name} {c.company_name ? `(${c.company_name})` : ''}
                </option>
              ))}
            </Select>

            <Select
              label="Event Nature / Category"
              required
              value={eventType}
              onChange={(e) => setEventType(e.target.value)}
            >
              <option value="wedding">Luxury Nuptials / Wedding</option>
              <option value="corporate">Executive Corporate Gala / Summit</option>
              <option value="social">Milestone Jubilee / Birthday / Anniversary</option>
              <option value="styling">Spatial Floral & Scenography Styling Only</option>
              <option value="other">Bespoke Private Gathering</option>
            </Select>

            <Input
              label="Primary Event Date"
              type="date"
              required
              value={eventDate}
              onChange={(e) => setEventDate(e.target.value)}
            />

            <Input
              label="Target Attendance Scale"
              placeholder="e.g. 500"
              value={guestCount}
              onChange={(e) => setGuestCount(e.target.value)}
            />

            <Input
              label="Confirmed Venue Name"
              required
              placeholder="e.g. The Monarch Lagos or Eko Hotel Grand Ballroom"
              value={venueName}
              onChange={(e) => setVenueName(e.target.value)}
            />

            <Input
              label="Venue Street Address / City"
              placeholder="e.g. Lekki-Epe Expressway, Lagos"
              value={venueAddress}
              onChange={(e) => setVenueAddress(e.target.value)}
            />

            <Input
              label="Agreed Contract Investment (NGN)"
              required
              placeholder="e.g. 45,000,000"
              value={feeNaira}
              onChange={(e) => setFeeNaira(e.target.value)}
              helperText="Stored accurately in integer kobo."
            />

            <Select
              label="Lead Planning Director Assigned"
              value={leadPlanner}
              onChange={(e) => setLeadPlanner(e.target.value)}
            >
              <option value="Folashade Adeleke">Folashade Adeleke (Creative Director)</option>
              <option value="Tunde Bakare">Tunde Bakare (Operations Director)</option>
              <option value="Chiamaka Nwosu">Chiamaka Nwosu (Senior Event Architect)</option>
              <option value="Zainab Balogun">Zainab Balogun (Guest Coordinator)</option>
            </Select>
          </div>

          <Textarea
            label="Initial Production Brief & Aesthetic Concept"
            rows={3}
            placeholder="Log spatial themes, entertainment requirements, cultural ceremonies, or VIP security protocol..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
