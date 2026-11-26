import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Users, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Building2, 
  ArrowRight, 
  Star,
  CalendarDays,
  CreditCard
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Textarea } from '../../components/shared/Textarea';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { useKobo } from '../../hooks/useKobo';

export function ClientsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { formatNaira } = useKobo();

  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  // New Client Form
  const [fullName, setFullName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [isVip, setIsVip] = useState(false);

  const { data: clients = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'clients', searchTerm],
    queryFn: () => dashboardService.getClients(searchTerm),
  });

  const createClientMutation = useMutation({
    mutationFn: (clientData) => dashboardService.createClient(clientData),
    onSuccess: (newClient) => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'clients'] });
      setModalOpen(false);
      resetForm();
      navigate(`/dashboard/clients/${newClient.id}`);
    },
  });

  const resetForm = () => {
    setFullName('');
    setCompanyName('');
    setEmail('');
    setPhone('');
    setAddress('');
    setNotes('');
    setIsVip(false);
  };

  const handleCreateClient = (e) => {
    e.preventDefault();
    if (!fullName || !email || !phone) return;

    createClientMutation.mutate({
      fullName,
      companyName,
      email,
      phone,
      address,
      notes,
      isVip,
    });
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Client CRM & Patron Directory
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Master directory of high-net-worth patrons, corporate stakeholders, and commissioning families.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Add New Client</span>
        </Button>
      </div>

      <Card>
        {/* Search */}
        <div className="relative mb-6">
          <Search className="w-4 h-4 absolute left-3 top-3 text-obsidian-400" />
          <input
            type="text"
            placeholder="Search by client name, corporate entity, email, or telephone number..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-sand-50 border border-sand-300 rounded-sm text-xs focus:outline-none focus:border-gold-500"
          />
        </div>

        {/* Client Cards Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        ) : clients.length === 0 ? (
          <div className="text-center py-16 text-obsidian-500 space-y-3">
            <Users className="w-8 h-8 mx-auto text-obsidian-400" />
            <p className="text-sm font-semibold">No clients located</p>
            <p className="text-xs max-w-sm mx-auto font-light">
              Add your first client or convert an inbound booking enquiry to populate the patron rolodex.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {clients.map((client) => (
              <div
                key={client.id}
                onClick={() => navigate(`/dashboard/clients/${client.id}`)}
                className="bg-white border border-sand-300 rounded-sm p-6 hover:border-gold-400 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-5 group"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <h2 className="font-serif text-lg font-bold text-obsidian-950 group-hover:text-gold-600 transition-colors">
                        {client.full_name}
                      </h2>
                      {client.company_name && (
                        <p className="text-xs text-obsidian-600 flex items-center mt-0.5 font-light">
                          <Building2 className="w-3 h-3 mr-1 text-gold-600" />
                          {client.company_name}
                        </p>
                      )}
                    </div>
                    {client.is_vip && (
                      <span className="inline-flex items-center text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gold-100 text-gold-800 border border-gold-300">
                        <Star className="w-2.5 h-2.5 mr-1 fill-gold-600 text-gold-600" />
                        VIP Patron
                      </span>
                    )}
                  </div>

                  <div className="space-y-1.5 text-xs text-obsidian-600">
                    <p className="flex items-center text-[11px]">
                      <Mail className="w-3.5 h-3.5 mr-2 text-obsidian-400" />
                      <span className="truncate">{client.email}</span>
                    </p>
                    <p className="flex items-center text-[11px]">
                      <Phone className="w-3.5 h-3.5 mr-2 text-obsidian-400" />
                      <span>{client.phone}</span>
                    </p>
                    {client.address && (
                      <p className="flex items-center text-[11px] truncate">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-obsidian-400 shrink-0" />
                        <span className="truncate">{client.address}</span>
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-xs">
                  <div>
                    <span className="text-[10px] uppercase text-obsidian-500 block">Total Billed</span>
                    <span className="font-mono font-bold text-obsidian-950">
                      {formatNaira(client.total_billed_kobo, false)}
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] uppercase text-obsidian-500 block">Commissions</span>
                    <span className="font-bold text-gold-700">
                      {client.events_count} {client.events_count === 1 ? 'Event' : 'Events'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal: New Client */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New Client Profile"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleCreateClient}
              loading={createClientMutation.isPending}
            >
              Save Client Profile
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateClient} className="space-y-4 text-xs text-obsidian-700">
          <Input
            label="Full Name & Title"
            required
            placeholder="e.g. Chief Adeleke Babatunde"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
          />

          <Input
            label="Corporate Entity / Affiliation (Optional)"
            placeholder="e.g. Atlantic Energy Consortium"
            value={companyName}
            onChange={(e) => setCompanyName(e.target.value)}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input
              label="Email Address"
              type="email"
              required
              placeholder="e.g. client@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Input
              label="Telephone & WhatsApp Number"
              type="tel"
              required
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>

          <Input
            label="Primary Address / City"
            placeholder="e.g. Plot 12, Queens Drive, Ikoyi, Lagos"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />

          <Textarea
            label="Relationship Notes & Protocol"
            rows={3}
            placeholder="Protocol requirements, personal preferences, executive assistants..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />

          <div className="flex items-center space-x-2 pt-1">
            <input
              type="checkbox"
              id="vip-checkbox"
              checked={isVip}
              onChange={(e) => setIsVip(e.target.checked)}
              className="rounded border-sand-300 text-gold-600 focus:ring-gold-400"
            />
            <label htmlFor="vip-checkbox" className="text-xs font-semibold text-obsidian-900 cursor-pointer">
              Tag as VIP Patron (Priority Atelier Support)
            </label>
          </div>
        </form>
      </Modal>
    </div>
  );
}
