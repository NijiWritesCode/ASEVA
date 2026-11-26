import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Search, 
  Filter, 
  Mail, 
  Phone, 
  Calendar, 
  ArrowRight, 
  Sparkles, 
  UserCheck, 
  XCircle, 
  CheckCircle2,
  Clock,
  MapPin,
  Building2,
  Users,
  FileText
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Drawer } from '../../components/shared/Drawer';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function EnquiriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { formatNaira, nairaToKobo } = useKobo();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [convertModalOpen, setConvertModalOpen] = useState(false);

  // Convert modal form state
  const [convertFeeNaira, setConvertFeeNaira] = useState('45,000,000');
  const [convertTitle, setConvertTitle] = useState('');
  const [convertPlanner, setConvertPlanner] = useState('Folashade Adeleke');
  const [staffNotes, setStaffNotes] = useState('');

  const { data: enquiries = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'enquiries', selectedStatus, searchTerm],
    queryFn: () => dashboardService.getEnquiries({ status: selectedStatus, search: searchTerm }),
  });

  const updateStatusMutation = useMutation({
    mutationFn: ({ id, status, notes, quotedPriceKobo }) =>
      dashboardService.updateEnquiryStatus(id, status, notes, quotedPriceKobo),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setSelectedEnquiry(updated);
    },
  });

  const convertMutation = useMutation({
    mutationFn: ({ inquiryId, agreedPriceKobo, eventTitle, leadPlanner }) =>
      dashboardService.convertEnquiryToBooking({ inquiryId, agreedPriceKobo, eventTitle, leadPlanner }),
    onSuccess: ({ event }) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard'] });
      setConvertModalOpen(false);
      setDrawerOpen(false);
      navigate(`/dashboard/events/${event.id}`);
    },
  });

  const handleRowClick = (enq) => {
    setSelectedEnquiry(enq);
    setStaffNotes(enq.internal_notes || '');
    setConvertTitle(`${enq.full_name}'s ${enq.event_type === 'wedding' ? 'Nuptials' : 'Celebration'}`);
    setDrawerOpen(true);
  };

  const handleSaveNotes = () => {
    if (!selectedEnquiry) return;
    updateStatusMutation.mutate({
      id: selectedEnquiry.id,
      status: selectedEnquiry.status,
      notes: staffNotes,
      quotedPriceKobo: selectedEnquiry.quoted_price_kobo,
    });
  };

  const handleOpenConvertModal = () => {
    if (!selectedEnquiry) return;
    const baseFee = selectedEnquiry.quoted_price_kobo 
      ? (selectedEnquiry.quoted_price_kobo / 100).toLocaleString('en-NG')
      : '45,000,000';
    setConvertFeeNaira(baseFee);
    setConvertModalOpen(true);
  };

  const handleConfirmConvert = () => {
    if (!selectedEnquiry) return;
    const cleanFee = parseFloat(convertFeeNaira.replace(/,/g, '')) || 45000000;
    const agreedPriceKobo = Math.round(cleanFee * 100);

    convertMutation.mutate({
      inquiryId: selectedEnquiry.id,
      agreedPriceKobo,
      eventTitle: convertTitle,
      leadPlanner: convertPlanner,
    });
  };

  const statusTabs = [
    { id: 'all', label: 'All Inquiries' },
    { id: 'new', label: 'New' },
    { id: 'under_review', label: 'Under Review' },
    { id: 'quotation_sent', label: 'Quotation Sent' },
    { id: 'converted', label: 'Converted to Event' },
    { id: 'declined', label: 'Declined' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Booking Enquiries Pipeline
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Triage incoming consultation inquiries, evaluate seasonal quota feasibility, issue formal proposals, and convert into active event workspaces.
          </p>
        </div>
      </div>

      <Card>
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-sand-200 pb-4 mb-4">
          {statusTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedStatus(tab.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                selectedStatus === tab.id
                  ? 'bg-obsidian-950 text-sand-50 shadow-sm'
                  : 'bg-sand-100 text-obsidian-700 hover:bg-sand-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Search Toolbar */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-3 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search enquiries by client name, email, event type, or reference code..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-sand-50 border border-sand-300 rounded-sm text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        {/* Data Table */}
        {isLoading ? (
          <LoadingSkeleton variant="table" />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/70 border-b border-sand-300 text-obsidian-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Ref Code</th>
                  <th className="py-3 px-4">Client Contact</th>
                  <th className="py-3 px-4">Event Type</th>
                  <th className="py-3 px-4">Target Date</th>
                  <th className="py-3 px-4">Location / Venue</th>
                  <th className="py-3 px-4">Budget Bracket</th>
                  <th className="py-3 px-4 text-center">Status</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {enquiries.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="py-12 text-center text-obsidian-500">
                      No booking enquiries match your selected filters.
                    </td>
                  </tr>
                ) : (
                  enquiries.map((enq) => (
                    <tr
                      key={enq.id}
                      onClick={() => handleRowClick(enq)}
                      className="hover:bg-sand-50/80 transition-colors cursor-pointer"
                    >
                      <td className="py-3.5 px-4 font-mono font-bold text-gold-700">
                        {enq.reference_code}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-obsidian-950">{enq.full_name}</p>
                        <p className="text-[11px] text-obsidian-500">{enq.email}</p>
                      </td>
                      <td className="py-3.5 px-4 font-medium text-obsidian-800 capitalize">
                        {enq.event_type}
                      </td>
                      <td className="py-3.5 px-4 text-obsidian-700 font-mono text-[11px]">
                        {enq.preferred_date}
                      </td>
                      <td className="py-3.5 px-4 text-obsidian-600 truncate max-w-xs">
                        {enq.venue_name || enq.location}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-obsidian-800 text-[11px]">
                        {enq.estimated_budget}
                      </td>
                      <td className="py-3.5 px-4 text-center">
                        <Badge status={enq.status} />
                      </td>
                      <td className="py-3.5 px-4 text-right" onClick={(e) => e.stopPropagation()}>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleRowClick(enq)}
                        >
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      {/* Slide-over Enquiry Drawer */}
      <Drawer
        isOpen={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        title={selectedEnquiry?.full_name || 'Enquiry Details'}
        subtitle={`Reference: ${selectedEnquiry?.reference_code || ''}`}
        size="lg"
      >
        {selectedEnquiry && (
          <div className="space-y-6">
            {/* Status and Action Header */}
            <div className="flex items-center justify-between p-4 bg-sand-50 border border-sand-300 rounded-sm">
              <div>
                <span className="text-[10px] uppercase font-semibold text-obsidian-500 block">
                  Current Pipeline Status
                </span>
                <div className="mt-1">
                  <Badge status={selectedEnquiry.status} />
                </div>
              </div>

              {selectedEnquiry.status !== 'converted' && (
                <Button
                  variant="gold"
                  size="sm"
                  onClick={handleOpenConvertModal}
                  className="shadow-sm"
                >
                  <UserCheck className="w-3.5 h-3.5 mr-1.5" />
                  <span>Convert to Confirmed Event</span>
                </Button>
              )}
            </div>

            {/* Client Coordinates */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-obsidian-950 border-b border-sand-200 pb-2">
                Client Contact Information
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Email</span>
                  <a href={`mailto:${selectedEnquiry.email}`} className="text-gold-700 hover:underline">
                    {selectedEnquiry.email}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Telephone / WhatsApp</span>
                  <a
                    href={`https://wa.me/${selectedEnquiry.phone.replace(/[^0-9]/g, '')}`}
                    target="_blank"
                    rel="noreferrer"
                    className="text-emerald-700 font-semibold hover:underline flex items-center"
                  >
                    <Phone className="w-3 h-3 mr-1" />
                    {selectedEnquiry.phone}
                  </a>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Event Location</span>
                  <p className="text-obsidian-900">{selectedEnquiry.location}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Referral Source</span>
                  <p className="text-obsidian-900">{selectedEnquiry.referral_source || 'Website'}</p>
                </div>
              </div>
            </div>

            {/* Event Parameters */}
            <div className="space-y-3">
              <h3 className="font-serif text-sm font-bold text-obsidian-950 border-b border-sand-200 pb-2">
                Event Parameters
              </h3>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Event Nature</span>
                  <p className="text-obsidian-900 capitalize font-medium">{selectedEnquiry.event_type}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Preferred Date</span>
                  <p className="text-obsidian-900 font-mono font-medium">{selectedEnquiry.preferred_date}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Alternate Date</span>
                  <p className="text-obsidian-900 font-mono">{selectedEnquiry.alternate_date || 'None'}</p>
                </div>
                <div>
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Attendance Scale</span>
                  <p className="text-obsidian-900 font-medium">{selectedEnquiry.guest_count} Guests</p>
                </div>
                <div className="col-span-2">
                  <span className="text-[10px] uppercase text-obsidian-500 block font-semibold">Client Target Budget Bracket</span>
                  <p className="text-obsidian-950 font-mono font-bold">{selectedEnquiry.estimated_budget}</p>
                </div>
              </div>
            </div>

            {/* Client Vision Notes */}
            <div className="space-y-2">
              <h3 className="font-serif text-sm font-bold text-obsidian-950 border-b border-sand-200 pb-2">
                Client Vision & Ceremonies
              </h3>
              <div className="bg-sand-50 p-4 rounded-sm border border-sand-200 text-xs text-obsidian-800 leading-relaxed font-light italic">
                "{selectedEnquiry.vision_notes || 'No specific aesthetic requirements provided in the form.'}"
              </div>
            </div>

            {/* Internal Staff Notes & Status Controls */}
            <div className="space-y-3 pt-2">
              <h3 className="font-serif text-sm font-bold text-obsidian-950 border-b border-sand-200 pb-2">
                Internal Review & Audit Notes
              </h3>
              <Textarea
                label="Staff Internal Notes"
                rows={3}
                value={staffNotes}
                onChange={(e) => setStaffNotes(e.target.value)}
                placeholder="Log call summary, feasibility notes, or client preferences..."
              />

              <div className="flex flex-wrap gap-2 pt-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleSaveNotes}
                  loading={updateStatusMutation.isPending}
                >
                  Save Notes
                </Button>

                {selectedEnquiry.status === 'new' && (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedEnquiry.id,
                        status: 'under_review',
                        notes: staffNotes,
                      })
                    }
                  >
                    Mark Under Review
                  </Button>
                )}

                {selectedEnquiry.status !== 'quotation_sent' && selectedEnquiry.status !== 'converted' && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedEnquiry.id,
                        status: 'quotation_sent',
                        notes: staffNotes,
                      })
                    }
                  >
                    Mark Quotation Sent
                  </Button>
                )}

                {selectedEnquiry.status !== 'declined' && selectedEnquiry.status !== 'converted' && (
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() =>
                      updateStatusMutation.mutate({
                        id: selectedEnquiry.id,
                        status: 'declined',
                        notes: staffNotes,
                      })
                    }
                  >
                    Decline Enquiry
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </Drawer>

      {/* Modal: Convert Enquiry into Confirmed Event & Client */}
      <Modal
        isOpen={convertModalOpen}
        onClose={() => setConvertModalOpen(false)}
        title="Convert Enquiry to Confirmed Event"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setConvertModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleConfirmConvert}
              loading={convertMutation.isPending}
            >
              <span>Confirm & Generate Workspace</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
            </Button>
          </div>
        }
      >
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleConfirmConvert();
          }}
          className="space-y-5 text-xs text-obsidian-700"
        >
          <p className="leading-relaxed font-light">
            Converting will automatically generate an official <strong>Client Profile</strong> and an <strong>Active Event Workspace</strong>, with an automated 3-tranche milestone payment schedule (30% deposit, 40% mid-planning, 30% final balance).
          </p>

          <Input
            label="Official Event Title"
            required
            value={convertTitle}
            onChange={(e) => setConvertTitle(e.target.value)}
          />

          <Input
            label="Agreed Contract Fee (NGN)"
            required
            value={convertFeeNaira}
            onChange={(e) => setConvertFeeNaira(e.target.value)}
            helperText="Stored accurately in integer kobo."
          />

          <Select
            label="Lead Planning Director Assigned"
            value={convertPlanner}
            onChange={(e) => setConvertPlanner(e.target.value)}
          >
            <option value="Folashade Adeleke">Folashade Adeleke (Creative Director)</option>
            <option value="Tunde Bakare">Tunde Bakare (Operations Director)</option>
            <option value="Chiamaka Nwosu">Chiamaka Nwosu (Senior Event Architect)</option>
            <option value="Zainab Balogun">Zainab Balogun (Guest Coordinator)</option>
          </Select>

          <div className="p-3 bg-gold-50/80 border border-gold-200/60 rounded-sm space-y-1 text-[11px] text-obsidian-800">
            <p className="font-semibold text-gold-900">Standard 3-Tranche Milestone Schedule:</p>
            <p>• <strong>Retainer Deposit (30%):</strong> Due immediately upon contract execution.</p>
            <p>• <strong>Mid-Planning (40%):</strong> Due 45 days prior to event date.</p>
            <p>• <strong>Final Settlement (30%):</strong> Due 14 days prior to event date.</p>
          </div>
        </form>
      </Modal>
    </div>
  );
}
