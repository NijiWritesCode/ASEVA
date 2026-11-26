import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Building2, 
  Search, 
  Plus, 
  Phone, 
  Mail, 
  MapPin, 
  Star, 
  CreditCard,
  CheckCircle2,
  Filter
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';

export function VendorsPage() {
  const queryClient = useQueryClient();

  const [categoryFilter, setCategoryFilter] = useState('all');
  const [modalOpen, setModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [category, setCategory] = useState('Catering & Gastronomy');
  const [contactPerson, setContactPerson] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('Victoria Island, Lagos');
  const [bankName, setBankName] = useState('Zenith Bank');
  const [accountNumber, setAccountNumber] = useState('');
  const [rating, setRating] = useState('5');
  const [notes, setNotes] = useState('');

  const { data: vendors = [], isLoading } = useQuery({
    queryKey: ['dashboard', 'vendors', categoryFilter],
    queryFn: () => dashboardService.getVendors(categoryFilter),
  });

  const createVendorMutation = useMutation({
    mutationFn: (data) => dashboardService.createVendor(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'vendors'] });
      setModalOpen(false);
      resetForm();
    },
  });

  const resetForm = () => {
    setName('');
    setCategory('Catering & Gastronomy');
    setContactPerson('');
    setPhone('');
    setEmail('');
    setCity('Victoria Island, Lagos');
    setAccountNumber('');
    setNotes('');
  };

  const handleCreateVendor = (e) => {
    e.preventDefault();
    if (!name || !phone) return;

    createVendorMutation.mutate({
      name,
      category,
      contactPerson,
      phone,
      email,
      city,
      bankName,
      accountNumber,
      rating,
      notes,
    });
  };

  const categories = [
    { id: 'all', label: 'All Suppliers' },
    { id: 'Catering & Gastronomy', label: 'Catering & Gastronomy' },
    { id: 'Florals & Spatial Scenography', label: 'Florals & Decor' },
    { id: 'Audiovisual & Lighting', label: 'Audiovisual & Lighting' },
    { id: 'Security & Protocol', label: 'Security & Protocol' },
    { id: 'Photography & Media', label: 'Photography & Film' },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="font-serif text-2xl font-bold text-obsidian-950">
            Master Vendor Rolodex & Artisan Directory
          </h1>
          <p className="text-xs text-obsidian-600 mt-1">
            Vetted suppliers across Nigeria: fine-dining caterers, master florists, sound technicians, and diplomatic security protocol.
          </p>
        </div>

        <Button variant="gold" size="sm" onClick={() => setModalOpen(true)}>
          <Plus className="w-4 h-4 mr-1.5" />
          <span>Register New Vendor</span>
        </Button>
      </div>

      <Card>
        {/* Category Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-sand-200 pb-4 mb-6">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id)}
              className={`px-3 py-1.5 text-xs font-medium rounded-sm transition-all ${
                categoryFilter === cat.id
                  ? 'bg-obsidian-950 text-sand-50 shadow-sm'
                  : 'bg-sand-100 text-obsidian-700 hover:bg-sand-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Vendors Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LoadingSkeleton variant="card" count={6} />
          </div>
        ) : vendors.length === 0 ? (
          <div className="text-center py-16 text-obsidian-500 space-y-3">
            <Building2 className="w-8 h-8 mx-auto text-obsidian-400" />
            <p className="text-sm font-semibold">No suppliers found in this category</p>
            <p className="text-xs max-w-sm mx-auto font-light">
              Add verified suppliers to build ASEVA's trusted execution network.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {vendors.map((vendor) => (
              <div
                key={vendor.id}
                className="bg-white border border-sand-300 rounded-sm p-6 hover:border-gold-400 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-gold-700 block mb-0.5">
                        {vendor.category}
                      </span>
                      <h2 className="font-serif text-lg font-bold text-obsidian-950">
                        {vendor.name}
                      </h2>
                      {vendor.contact_person && (
                        <p className="text-xs text-obsidian-600 font-light mt-0.5">
                          Attn: {vendor.contact_person}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center text-gold-600">
                      {[...Array(vendor.rating || 5)].map((_, i) => (
                        <Star key={i} className="w-3 h-3 fill-gold-500 text-gold-500" />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-obsidian-600 pt-2 border-t border-sand-100">
                    <p className="flex items-center text-[11px]">
                      <Phone className="w-3.5 h-3.5 mr-2 text-obsidian-400" />
                      <a
                        href={`https://wa.me/${vendor.phone.replace(/[^0-9]/g, '')}`}
                        target="_blank"
                        rel="noreferrer"
                        className="text-emerald-700 font-semibold hover:underline"
                      >
                        {vendor.phone}
                      </a>
                    </p>
                    {vendor.email && (
                      <p className="flex items-center text-[11px] truncate">
                        <Mail className="w-3.5 h-3.5 mr-2 text-obsidian-400" />
                        <span className="truncate">{vendor.email}</span>
                      </p>
                    )}
                    {vendor.city && (
                      <p className="flex items-center text-[11px]">
                        <MapPin className="w-3.5 h-3.5 mr-2 text-obsidian-400" />
                        <span>{vendor.city}</span>
                      </p>
                    )}
                  </div>

                  {vendor.notes && (
                    <p className="text-[11px] text-obsidian-500 font-light italic bg-sand-50 p-2.5 rounded-sm border border-sand-200 line-clamp-2">
                      "{vendor.notes}"
                    </p>
                  )}
                </div>

                {vendor.bank_name && vendor.account_number && (
                  <div className="pt-3 border-t border-sand-200 text-[11px] text-obsidian-500 flex items-center justify-between">
                    <span className="flex items-center">
                      <CreditCard className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                      <span>{vendor.bank_name}</span>
                    </span>
                    <span className="font-mono font-medium text-obsidian-900">{vendor.account_number}</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Modal: Register Vendor */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Register Master Supplier / Artisan"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleCreateVendor}
              loading={createVendorMutation.isPending}
            >
              Save Supplier Profile
            </Button>
          </div>
        }
      >
        <form onSubmit={handleCreateVendor} className="space-y-4 text-xs text-obsidian-700">
          <Input
            label="Supplier / Enterprise Name"
            required
            placeholder="e.g. Gourmet Affairs Executive Catering"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-4">
            <Select
              label="Service Specialization"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="Catering & Gastronomy">Catering & Gastronomy</option>
              <option value="Florals & Spatial Scenography">Florals & Spatial Scenography</option>
              <option value="Audiovisual & Lighting">Audiovisual & Lighting</option>
              <option value="Security & Protocol">Security & Protocol</option>
              <option value="Photography & Media">Photography & Media</option>
              <option value="Entertainment">Entertainment & Musicians</option>
            </Select>

            <Input
              label="Lead Contact Representative"
              placeholder="e.g. Chef Femi Doherty"
              value={contactPerson}
              onChange={(e) => setContactPerson(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Telephone & WhatsApp Number"
              required
              placeholder="+234 800 000 0000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />

            <Input
              label="Email Address"
              type="email"
              placeholder="contact@supplier.ng"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <Input
              label="Settlement Bank Name"
              placeholder="e.g. Zenith Bank PLC"
              value={bankName}
              onChange={(e) => setBankName(e.target.value)}
            />

            <Input
              label="Settlement NUBAN Account Number"
              placeholder="10-digit account number"
              value={accountNumber}
              onChange={(e) => setAccountNumber(e.target.value)}
            />
          </div>

          <Textarea
            label="Internal Evaluation & Performance Notes"
            rows={2}
            placeholder="Quality standards, equipment tier, responsiveness..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </form>
      </Modal>
    </div>
  );
}
