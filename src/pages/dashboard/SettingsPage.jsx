import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Settings, 
  Building2, 
  Users, 
  Sparkles, 
  CheckCircle2, 
  Plus, 
  ShieldCheck, 
  Mail, 
  Phone, 
  MapPin,
  Lock
} from 'lucide-react';
import { Card } from '../../components/shared/Card';
import { Badge } from '../../components/shared/Badge';
import { Button } from '../../components/shared/Button';
import { Modal } from '../../components/shared/Modal';
import { Input } from '../../components/shared/Input';
import { Select } from '../../components/shared/Select';
import { Textarea } from '../../components/shared/Textarea';
import { LoadingSkeleton } from '../../components/shared/LoadingSkeleton';
import { dashboardService } from '../../services/dashboardService';
import { publicCatalogService } from '../../services/publicCatalogService';
import { useKobo } from '../../hooks/useKobo';

export function SettingsPage() {
  const queryClient = useQueryClient();
  const { formatNaira } = useKobo();

  const [activeTab, setActiveTab] = useState('profile');
  const [inviteModalOpen, setInviteModalOpen] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Invite Member Form
  const [inviteName, setInviteName] = useState('');
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('planner');
  const [inviteTitle, setInviteTitle] = useState('Event Associate');

  const { data: settings, isLoading } = useQuery({
    queryKey: ['dashboard', 'settings'],
    queryFn: () => dashboardService.getSettings(),
  });

  const { data: services = [] } = useQuery({
    queryKey: ['public', 'services'],
    queryFn: () => publicCatalogService.getServices(),
  });

  const { data: auditLogs = [] } = useQuery({
    queryKey: ['dashboard', 'audit_logs'],
    queryFn: () => dashboardService.getAuditLogs(),
    enabled: activeTab === 'audit',
  });

  // Profile Form state
  const [legalName, setLegalName] = useState('ASEVA Events & Productions Limited');
  const [tradingName, setTradingName] = useState('ASEVA Luxury Event Atelier');
  const [email, setEmail] = useState('operations@asevaevents.com');
  const [phone, setPhone] = useState('+234 800 000 2738');
  const [address, setAddress] = useState('14B Walter Carrington Crescent, Victoria Island, Lagos, Nigeria');

  const updateProfileMutation = useMutation({
    mutationFn: (data) => dashboardService.updateBusinessProfile(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'settings'] });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    },
  });

  const inviteMemberMutation = useMutation({
    mutationFn: (data) => dashboardService.inviteTeamMember(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', 'settings'] });
      setInviteModalOpen(false);
      setInviteName('');
      setInviteEmail('');
    },
  });

  const handleSaveProfile = (e) => {
    e.preventDefault();
    updateProfileMutation.mutate({
      name: tradingName,
      legal_name: legalName,
      email,
      phone,
      address,
    });
  };

  const handleInviteMember = (e) => {
    e.preventDefault();
    if (!inviteName || !inviteEmail) return;

    inviteMemberMutation.mutate({
      name: inviteName,
      email: inviteEmail,
      role: inviteRole,
      title: inviteTitle,
    });
  };

  if (isLoading || !settings) {
    return (
      <div className="space-y-6">
        <LoadingSkeleton variant="title" />
        <LoadingSkeleton variant="card" count={3} />
      </div>
    );
  }

  const tabs = [
    { id: 'profile', label: 'Business Profile', icon: Building2 },
    { id: 'team', label: `Team Members & Roles (${settings.team_members.length})`, icon: Users },
    { id: 'catalog', label: 'Service Catalog Tiers', icon: Sparkles },
    { id: 'audit', label: 'Audit Trail Ledger', icon: ShieldCheck },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="font-serif text-2xl font-bold text-obsidian-950">
          Workspace Settings & Governance
        </h1>
        <p className="text-xs text-obsidian-600 mt-1">
          Configure atelier organization identity, manage staff role-based access control (RBAC), and review service catalog packages.
        </p>
      </div>

      {/* Tabs */}
      <div className="border-b border-sand-300 flex space-x-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-4 py-3 text-xs font-semibold uppercase tracking-wider border-b-2 transition-all ${
                isActive
                  ? 'border-gold-500 text-gold-700 bg-white/70'
                  : 'border-transparent text-obsidian-600 hover:text-obsidian-950'
              }`}
            >
              <Icon className="w-4 h-4 mr-2" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* TAB 1: BUSINESS PROFILE */}
      {activeTab === 'profile' && (
        <Card>
          <div className="border-b border-sand-200 pb-4 mb-6">
            <h2 className="font-serif text-base font-bold text-obsidian-950">
              Corporate Legal & Operational Details
            </h2>
            <p className="text-xs text-obsidian-500">
              Information displayed on customer contracts, proposals, and official invoices.
            </p>
          </div>

          {saveSuccess && (
            <div className="bg-emerald-50 border border-emerald-300 p-3 rounded-sm mb-6 flex items-center text-xs text-emerald-800">
              <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-600 shrink-0" />
              <span>Business profile updated successfully.</span>
            </div>
          )}

          <form onSubmit={handleSaveProfile} className="space-y-5 text-xs text-obsidian-700 max-w-2xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Brand Trading Name"
                required
                value={tradingName}
                onChange={(e) => setTradingName(e.target.value)}
              />
              <Input
                label="Registered Legal Entity"
                required
                value={legalName}
                onChange={(e) => setLegalName(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Concierge Email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                label="Studio Telephone"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <Input
              label="Physical Studio & Atelier Address"
              required
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <Input
                label="System Currency Standard"
                disabled
                value="NGN (Nigerian Naira — Integer Kobo)"
                helperText="Fixed database standard. Floating point forbidden."
              />
              <Input
                label="Operating Timezone"
                disabled
                value="Africa/Lagos (WAT, UTC+1)"
                helperText="Standard for all deadlines and production schedules."
              />
            </div>

            <div className="pt-4">
              <Button variant="gold" size="md" type="submit" loading={updateProfileMutation.isPending}>
                Save Organization Settings
              </Button>
            </div>
          </form>
        </Card>
      )}

      {/* TAB 2: TEAM MEMBERS & RBAC */}
      {activeTab === 'team' && (
        <Card>
          <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-6">
            <div>
              <h2 className="font-serif text-base font-bold text-obsidian-950">
                Staff Governance & Role-Based Permissions
              </h2>
              <p className="text-xs text-obsidian-500">
                Roles determine access to financial reports, client conversion actions, and settings.
              </p>
            </div>

            <Button variant="gold" size="sm" onClick={() => setInviteModalOpen(true)}>
              <Plus className="w-4 h-4 mr-1.5" />
              <span>Invite Staff Member</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/70 border-b border-sand-300 text-obsidian-600 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">Staff Member</th>
                  <th className="py-3 px-4">Email</th>
                  <th className="py-3 px-4">Position Title</th>
                  <th className="py-3 px-4 text-center">Assigned Role</th>
                  <th className="py-3 px-4 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {settings.team_members.map((member) => (
                  <tr key={member.id} className="hover:bg-sand-50/60">
                    <td className="py-3.5 px-4 font-semibold text-obsidian-950">
                      {member.name}
                    </td>
                    <td className="py-3.5 px-4 text-obsidian-600">{member.email}</td>
                    <td className="py-3.5 px-4 text-obsidian-800">{member.title}</td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="font-mono uppercase font-bold text-[10px] tracking-wider px-2 py-0.5 rounded bg-sand-200 text-obsidian-800">
                        {member.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* TAB 3: SERVICE CATALOG TIERS */}
      {activeTab === 'catalog' && (
        <Card>
          <div className="border-b border-sand-200 pb-4 mb-6">
            <h2 className="font-serif text-base font-bold text-obsidian-950">
              Active Public Offerings & Starting Investment Tiers
            </h2>
            <p className="text-xs text-obsidian-500">
              These service tiers sync directly to prospective client inquiries on the public website.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {services.map((srv) => (
              <div key={srv.slug} className="p-5 border border-sand-300 rounded-sm bg-sand-50/40 space-y-3">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gold-700 tracking-wider">
                      {srv.category}
                    </span>
                    <h3 className="font-serif text-base font-bold text-obsidian-950">
                      {srv.title}
                    </h3>
                  </div>
                  <Badge status="confirmed" />
                </div>

                <p className="text-xs text-obsidian-600 font-light line-clamp-2">
                  {srv.short_description}
                </p>

                <div className="pt-2 border-t border-sand-200 flex items-center justify-between text-xs">
                  <span className="text-obsidian-500">Starting Investment:</span>
                  <span className="font-mono font-bold text-obsidian-950">
                    {srv.starting_price_kobo > 0 ? formatNaira(srv.starting_price_kobo, false) : 'Bespoke Proposal'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}

      {/* TAB 4: IMMUTABLE AUDIT TRAIL */}
      {activeTab === 'audit' && (
        <Card>
          <div className="flex items-center justify-between border-b border-sand-200 pb-4 mb-4">
            <div>
              <h2 className="font-serif text-lg font-bold text-obsidian-950">
                Immutable System Audit Logs
              </h2>
              <p className="text-xs text-obsidian-600">
                Traceable ledger of all financial transactions, contract agreements, lead conversions, and status updates.
              </p>
            </div>
            <span className="text-[11px] font-mono font-semibold px-2 py-1 bg-sand-100 rounded text-obsidian-700">
              {auditLogs.length} Logged Entries
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-sand-100/70 border-b border-sand-300 text-obsidian-600 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Timestamp (WAT)</th>
                  <th className="py-3 px-4">Actor</th>
                  <th className="py-3 px-4">Action</th>
                  <th className="py-3 px-4">Entity</th>
                  <th className="py-3 px-4">Audit Description</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-sand-200">
                {auditLogs.map((log) => (
                  <tr key={log.id} className="hover:bg-sand-50/60">
                    <td className="py-3 px-4 font-mono text-[11px] text-obsidian-700 whitespace-nowrap">
                      {new Date(log.created_at).toLocaleString('en-NG')}
                    </td>
                    <td className="py-3 px-4 font-semibold text-obsidian-950">
                      {log.actor_name}
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-gold-100 text-gold-800">
                        {log.action.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono text-[11px] text-obsidian-600 uppercase">
                      {log.entity_type} ({log.entity_id})
                    </td>
                    <td className="py-3 px-4 text-obsidian-700">
                      {log.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      )}

      {/* MODAL: INVITE MEMBER */}
      <Modal
        isOpen={inviteModalOpen}
        onClose={() => setInviteModalOpen(false)}
        title="Invite New Atelier Staff Member"
        size="md"
        footer={
          <div className="flex justify-end space-x-3">
            <Button variant="outline" size="sm" onClick={() => setInviteModalOpen(false)}>
              Cancel
            </Button>
            <Button
              variant="gold"
              size="sm"
              onClick={handleInviteMember}
              loading={inviteMemberMutation.isPending}
            >
              Grant Access
            </Button>
          </div>
        }
      >
        <form onSubmit={handleInviteMember} className="space-y-4 text-xs text-obsidian-700">
          <Input
            label="Staff Full Name"
            required
            placeholder="e.g. Zainab Balogun"
            value={inviteName}
            onChange={(e) => setInviteName(e.target.value)}
          />

          <Input
            label="Corporate Email Address"
            type="email"
            required
            placeholder="zainab@asevaevents.com"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
          />

          <Input
            label="Position / Job Title"
            placeholder="e.g. Lead Guest Coordinator"
            value={inviteTitle}
            onChange={(e) => setInviteTitle(e.target.value)}
          />

          <Select
            label="Role-Based Access Level (RBAC)"
            value={inviteRole}
            onChange={(e) => setInviteRole(e.target.value)}
          >
            <option value="owner">Owner (Full unrestricted administrative control)</option>
            <option value="manager">Manager (Operations, financial ledgers & margin reports)</option>
            <option value="planner">Planner (Event project execution & task checklists)</option>
            <option value="assistant">Assistant (Read-only guest list & check-in coordination)</option>
          </Select>
        </form>
      </Modal>
    </div>
  );
}
