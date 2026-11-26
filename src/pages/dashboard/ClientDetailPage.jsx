import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  Users, 
  ArrowLeft, 
  CalendarDays, 
  CreditCard, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  Star, 
  ArrowRight,
  Plus,
  ShieldCheck
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Table } from '../../components/shared/Table';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function ClientDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { formatNaira } = useKobo();

  const { data: client, isLoading } = useQuery({
    queryKey: ['dashboard', 'client', id],
    queryFn: () => dashboardService.getClientById(id),
  });

  if (isLoading || !client) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="card" count={3} />
        <LoadingSkeleton variant="table" />
      </div>
    );
  }

  const eventColumns = [
    {
      header: 'Event Title',
      accessor: 'title',
      cellClassName: 'font-semibold text-obsidian-950',
      render: (val, row) => (
        <Link to={`/dashboard/events/${row.id}`} className="hover:text-gold-600 transition-colors">
          {val}
        </Link>
      ),
    },
    {
      header: 'Category',
      accessor: 'event_type',
      cellClassName: 'text-obsidian-700 capitalize',
    },
    {
      header: 'Date',
      accessor: 'event_date',
      cellClassName: 'text-obsidian-600 font-mono text-xs',
    },
    {
      header: 'Venue',
      accessor: 'venue_name',
      cellClassName: 'text-obsidian-600 truncate max-w-xs',
    },
    {
      header: 'Agreed Fee',
      accessor: 'agreed_price_kobo',
      align: 'right',
      cellClassName: 'font-mono font-medium text-obsidian-900',
      render: (val) => formatNaira(val, false),
    },
    {
      header: 'Paid (NGN)',
      accessor: 'paid_kobo',
      align: 'right',
      cellClassName: 'font-mono text-emerald-800 font-medium',
      render: (val) => formatNaira(val, false),
    },
    {
      header: 'Status',
      accessor: 'status',
      align: 'center',
      render: (val) => <Badge status={val} />,
    },
    {
      header: 'Action',
      align: 'right',
      render: (_, row) => (
        <Link to={`/dashboard/events/${row.id}`}>
          <Button variant="ghost" size="sm">
            <span>Workspace</span>
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="space-y-8">
      {/* Back Link & Header */}
      <div className="space-y-3">
        <Link to="/dashboard/clients" className="text-xs font-semibold text-gold-600 hover:underline flex items-center">
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          <span>Return to All Clients</span>
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-3">
            <h1 className="font-serif text-3xl font-bold text-obsidian-950">
              {client.full_name}
            </h1>
            {client.is_vip && (
              <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold-100 text-gold-800 border border-gold-300">
                <Star className="w-2.5 h-2.5 mr-1 fill-gold-600 text-gold-600" />
                VIP Patron
              </span>
            )}
          </div>

          <Link to="/dashboard/events">
            <Button variant="gold" size="sm">
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Commission New Event</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Financial Summary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
            Lifetime Billed Contracts
          </span>
          <p className="font-mono text-2xl font-bold text-obsidian-950">
            {formatNaira(client.total_billed_kobo, false)}
          </p>
          <span className="text-[11px] text-obsidian-500 font-light">
            Across {client.events.length} production commissions
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-emerald-700 font-semibold block">
            Total Cash Received
          </span>
          <p className="font-mono text-2xl font-bold text-emerald-800">
            {formatNaira(client.total_paid_kobo, false)}
          </p>
          <span className="text-[11px] text-emerald-600 font-light">
            Verified bank & online transactions
          </span>
        </div>

        <div className="bg-white border border-sand-300 p-6 rounded-sm space-y-1 shadow-sm">
          <span className="text-[10px] uppercase tracking-wider text-amber-700 font-semibold block">
            Outstanding Receivables
          </span>
          <p className="font-mono text-2xl font-bold text-amber-900">
            {formatNaira(client.total_balance_kobo, false)}
          </p>
          <span className="text-[11px] text-amber-700 font-light">
            Due per milestone installment schedules
          </span>
        </div>
      </div>

      {/* Patron Coordinates & Relationship Notes */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-5 bg-white border border-sand-300 p-6 rounded-sm shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-obsidian-950 border-b border-sand-200 pb-2">
            Direct Coordinates
          </h2>
          <div className="space-y-3 text-xs text-obsidian-700">
            {client.company_name && (
              <div>
                <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Corporate Entity</span>
                <p className="font-medium text-obsidian-950 flex items-center mt-0.5">
                  <Building2 className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                  {client.company_name}
                </p>
              </div>
            )}
            <div>
              <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Email Address</span>
              <a href={`mailto:${client.email}`} className="text-gold-700 hover:underline">
                {client.email}
              </a>
            </div>
            <div>
              <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Telephone & WhatsApp</span>
              <a
                href={`https://wa.me/${client.phone.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="text-emerald-700 font-semibold hover:underline flex items-center"
              >
                <Phone className="w-3 h-3 mr-1" />
                {client.phone}
              </a>
            </div>
            {client.address && (
              <div>
                <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Primary Address</span>
                <p className="text-obsidian-900 flex items-start mt-0.5">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-obsidian-400 shrink-0 mt-0.5" />
                  <span>{client.address}</span>
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="lg:col-span-7 bg-white border border-sand-300 p-6 rounded-sm shadow-sm space-y-4">
          <h2 className="font-serif text-base font-bold text-obsidian-950 border-b border-sand-200 pb-2">
            Relationship Notes & Protocol
          </h2>
          <p className="text-xs text-obsidian-700 leading-relaxed font-light italic bg-sand-50 p-4 rounded-sm border border-sand-200">
            {client.notes || 'No specific relationship protocols recorded for this patron.'}
          </p>
        </div>
      </div>

      {/* Associated Events Table */}
      <div className="space-y-4">
        <h2 className="font-serif text-xl font-bold text-obsidian-950">
          Commission History & Active Projects
        </h2>

        <Table
          columns={eventColumns}
          data={client.events}
          emptyTitle="No Events Found"
          emptyDescription="This client does not currently have any active or past event commissions."
        />
      </div>
    </div>
  );
}
