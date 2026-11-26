import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Inbox,
  Users,
  CalendarDays,
  CreditCard,
  CheckSquare,
  Package,
  Building2,
  Receipt,
  Calendar,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
  Bell,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Breadcrumbs } from '../components/shared/Breadcrumbs';

export function DashboardLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, profile, role, signOut, isManager } = useAuth();

  const navigation = [
    { name: 'Overview', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Enquiries', path: '/dashboard/enquiries', icon: Inbox },
    { name: 'Clients', path: '/dashboard/clients', icon: Users },
    { name: 'Events', path: '/dashboard/events', icon: CalendarDays },
    { name: 'Payments', path: '/dashboard/payments', icon: CreditCard, managerOnly: false },
    { name: 'Tasks', path: '/dashboard/tasks', icon: CheckSquare },
    { name: 'Procurement', path: '/dashboard/procurement', icon: Package },
    { name: 'Vendors', path: '/dashboard/vendors', icon: Building2 },
    { name: 'Expenses', path: '/dashboard/expenses', icon: Receipt },
    { name: 'Calendar', path: '/dashboard/calendar', icon: Calendar },
    { name: 'Reports', path: '/dashboard/reports', icon: BarChart3, managerOnly: true },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings, managerOnly: true },
  ];

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-sand-100">
      {/* Desktop Fixed Sidebar — pinned to viewport, completely unaffected by page scroll */}
      <aside className="hidden lg:flex lg:flex-col fixed inset-y-0 left-0 z-30 w-56 h-screen bg-obsidian-950 text-sand-100 border-r border-obsidian-800">
        {/* Brand Header */}
        <div className="h-16 flex items-center px-5 border-b border-obsidian-800 justify-between shrink-0">
          <Link to="/dashboard" className="flex items-center space-x-2">
            <span className="font-serif text-lg font-bold tracking-widest text-gold-400">
              ASEVA
            </span>
            <span className="text-[9px] tracking-wider uppercase text-sand-400 font-sans px-1.5 py-0.5 rounded bg-obsidian-800">
              Workspace
            </span>
          </Link>
        </div>

        {/* Navigation Items */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navigation.map((item) => {
            if (item.managerOnly && !isManager) return null;
            const isActive = location.pathname === item.path || 
              (item.path !== '/dashboard' && location.pathname.startsWith(item.path));
            const Icon = item.icon;

            return (
              <Link
                key={item.name}
                to={item.path}
                className={`flex items-center px-3 py-2 text-xs font-medium tracking-wide rounded-sm transition-colors ${
                  isActive
                    ? 'bg-gold-500/15 text-gold-400 border-l-2 border-gold-400 font-semibold'
                    : 'text-sand-400 hover:text-sand-100 hover:bg-obsidian-900'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 mr-2.5 shrink-0 ${isActive ? 'text-gold-400' : 'text-sand-500'}`} />
                <span className="truncate">{item.name}</span>
              </Link>
            );
          })}
        </nav>

        {/* User Card & Sign Out */}
        <div className="p-3.5 border-t border-obsidian-800 bg-obsidian-900/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2.5 overflow-hidden">
              <div className="w-7 h-7 rounded-full bg-gold-600/30 text-gold-400 border border-gold-500/40 flex items-center justify-center font-serif text-[11px] font-semibold shrink-0">
                {profile?.full_name?.charAt(0) || user?.email?.charAt(0).toUpperCase() || 'A'}
              </div>
              <div className="truncate">
                <p className="text-[11px] font-medium text-sand-100 truncate">
                  {profile?.full_name || user?.email}
                </p>
                <p className="text-[9px] uppercase tracking-wider text-gold-400/80">
                  {role || 'Staff Member'}
                </p>
              </div>
            </div>
            <button
              onClick={handleSignOut}
              title="Sign Out"
              className="p-1 text-sand-400 hover:text-rose-400 hover:bg-obsidian-800 rounded transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>

      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div 
            className="fixed inset-0 bg-obsidian-950/70 backdrop-blur-sm" 
            onClick={() => setSidebarOpen(false)} 
          />
          <div className="relative flex flex-col w-64 bg-obsidian-950 text-sand-100 z-10">
            <div className="h-16 flex items-center justify-between px-6 border-b border-obsidian-800 shrink-0">
              <span className="font-serif text-lg font-bold tracking-widest text-gold-400">
                ASEVA
              </span>
              <button onClick={() => setSidebarOpen(false)} className="text-sand-400 p-1">
                <X className="w-5 h-5" />
              </button>
            </div>
            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
              {navigation.map((item) => {
                if (item.managerOnly && !isManager) return null;
                const isActive = location.pathname === item.path;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    onClick={() => setSidebarOpen(false)}
                    className={`flex items-center px-3.5 py-2.5 text-xs font-medium rounded-sm ${
                      isActive ? 'bg-gold-500/15 text-gold-400' : 'text-sand-400 hover:text-sand-100'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-3 shrink-0" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
            <div className="p-4 border-t border-obsidian-800 shrink-0">
              <button
                onClick={handleSignOut}
                className="flex items-center w-full px-3 py-2 text-xs text-rose-300 hover:bg-obsidian-900 rounded"
              >
                <LogOut className="w-4 h-4 mr-2" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Operational Body with left padding offsetting the fixed desktop sidebar */}
      <div className="lg:pl-56 flex flex-col min-h-screen min-w-0">
        {/* Top Operational Bar (Sticky with subtle blur) */}
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-sand-300 flex items-center justify-between px-6 shrink-0">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-1.5 text-obsidian-800 hover:bg-sand-200 rounded"
            >
              <Menu className="w-5 h-5" />
            </button>
            <div className="flex items-center space-x-2 text-xs">
              <Breadcrumbs
                items={
                  location.pathname === '/dashboard'
                    ? [{ label: 'Overview' }]
                    : location.pathname
                        .split('/')
                        .filter(Boolean)
                        .slice(1)
                        .map((seg, idx, arr) => ({
                          label: seg.replace(/_/g, ' ').replace(/-/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase()),
                          href: idx === arr.length - 1 ? undefined : `/dashboard/${arr.slice(0, idx + 1).join('/')}`,
                        }))
                }
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            <Link to="/" target="_blank" className="text-xs font-medium text-gold-600 hover:text-gold-700 flex items-center">
              <Sparkles className="w-3.5 h-3.5 mr-1" />
              <span>Public Site</span>
            </Link>
            <div className="h-4 w-px bg-sand-300" />
            <button className="p-1.5 text-obsidian-600 hover:text-obsidian-950 relative">
              <Bell className="w-4 h-4" />
            </button>
          </div>
        </header>

        {/* View Content Outlet with Generous Ergonomic Spacing */}
        <main className="flex-1 px-5 sm:px-8 lg:px-10 py-8 min-w-0">
          <div className="max-w-7xl mx-auto space-y-10">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
