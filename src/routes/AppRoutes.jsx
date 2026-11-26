import React, { Suspense, lazy } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PublicLayout } from '../layouts/PublicLayout';
import { DashboardLayout } from '../layouts/DashboardLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';

// Public Pages (Core landing pages imported immediately for instant first-paint)
import { HomePage } from '../pages/public/HomePage';
import { AboutPage } from '../pages/public/AboutPage';
import { ServicesPage, ServiceDetailPage } from '../pages/public/ServicesPage';
import { PortfolioPage, PortfolioDetailPage } from '../pages/public/PortfolioPage';
import { BookingPage, BookingConfirmedPage } from '../pages/public/BookingPage';
import { ContactPage, FaqsPage, NotFoundPage } from '../pages/public/ContactPage';

// Lazy-Loaded Dashboard Operational Workspaces (Separated into distinct on-demand chunks)
const OverviewPage = lazy(() => import('../pages/dashboard/OverviewPage').then((m) => ({ default: m.OverviewPage })));
const EnquiriesPage = lazy(() => import('../pages/dashboard/EnquiriesPage').then((m) => ({ default: m.EnquiriesPage })));
const ClientsPage = lazy(() => import('../pages/dashboard/ClientsPage').then((m) => ({ default: m.ClientsPage })));
const ClientDetailPage = lazy(() => import('../pages/dashboard/ClientDetailPage').then((m) => ({ default: m.ClientDetailPage })));
const EventsPage = lazy(() => import('../pages/dashboard/EventsPage').then((m) => ({ default: m.EventsPage })));
const EventDetailPage = lazy(() => import('../pages/dashboard/EventDetailPage').then((m) => ({ default: m.EventDetailPage })));
const PaymentsPage = lazy(() => import('../pages/dashboard/PaymentsPage').then((m) => ({ default: m.PaymentsPage })));
const TasksPage = lazy(() => import('../pages/dashboard/TasksPage').then((m) => ({ default: m.TasksPage })));
const ProcurementPage = lazy(() => import('../pages/dashboard/ProcurementPage').then((m) => ({ default: m.ProcurementPage })));
const VendorsPage = lazy(() => import('../pages/dashboard/VendorsPage').then((m) => ({ default: m.VendorsPage })));
const ExpensesPage = lazy(() => import('../pages/dashboard/ExpensesPage').then((m) => ({ default: m.ExpensesPage })));
const CalendarPage = lazy(() => import('../pages/dashboard/CalendarPage').then((m) => ({ default: m.CalendarPage })));
const ReportsPage = lazy(() => import('../pages/dashboard/ReportsPage').then((m) => ({ default: m.ReportsPage })));
const SettingsPage = lazy(() => import('../pages/dashboard/SettingsPage').then((m) => ({ default: m.SettingsPage })));
const LoginPage = lazy(() => import('../pages/dashboard/LoginPage').then((m) => ({ default: m.LoginPage })));
const EventInvoicePage = lazy(() => import('../pages/dashboard/EventInvoicePage').then((m) => ({ default: m.EventInvoicePage })));
const ClientPortalPage = lazy(() => import('../pages/public/ClientPortalPage').then((m) => ({ default: m.ClientPortalPage })));

function PageLoader() {
  return (
    <div className="min-h-[50vh] flex flex-col items-center justify-center p-8 space-y-3">
      <div className="w-7 h-7 rounded-full border-2 border-gold-400 border-t-transparent animate-spin" />
      <span className="font-serif text-[11px] uppercase tracking-widest text-obsidian-600">
        ASEVA • Initializing Workspace...
      </span>
    </div>
  );
}

export function AppRoutes() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        {/* 1. Public Marketing Routes */}
        <Route element={<PublicLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/services" element={<ServicesPage />} />
          <Route path="/services/:slug" element={<ServiceDetailPage />} />
          <Route path="/portfolio" element={<PortfolioPage />} />
          <Route path="/portfolio/:slug" element={<PortfolioDetailPage />} />
          <Route path="/book" element={<BookingPage />} />
          <Route path="/booking-confirmed" element={<BookingConfirmedPage />} />
          <Route path="/portal" element={<ClientPortalPage />} />
          <Route path="/portal/:code" element={<ClientPortalPage />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/faqs" element={<FaqsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>

        {/* 2. Staff Authentication Routes */}
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>

        {/* 3. Protected Dashboard Routes */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<OverviewPage />} />
          <Route path="enquiries" element={<EnquiriesPage />} />
          <Route path="clients" element={<ClientsPage />} />
          <Route path="clients/:id" element={<ClientDetailPage />} />
          <Route path="events" element={<EventsPage />} />
          <Route path="events/:id" element={<EventDetailPage />} />
          <Route path="payments" element={<PaymentsPage />} />
          <Route path="tasks" element={<TasksPage />} />
          <Route path="procurement" element={<ProcurementPage />} />
          <Route path="vendors" element={<VendorsPage />} />
          <Route path="expenses" element={<ExpensesPage />} />
          <Route path="calendar" element={<CalendarPage />} />
          <Route
            path="reports"
            element={
              <ProtectedRoute requireManager>
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="settings"
            element={
              <ProtectedRoute requireManager>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 4. Standalone Printable Document Routes */}
        <Route
          path="/dashboard/events/:id/invoice"
          element={
            <ProtectedRoute>
              <EventInvoicePage />
            </ProtectedRoute>
          }
        />
      </Routes>
    </Suspense>
  );
}
