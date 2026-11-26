import React from 'react';
import { useLocation } from 'react-router-dom';
import { SeoMeta } from '../../components/shared/SeoMeta';
import { BookingEnquiryForm } from '../../components/public/BookingEnquiryForm';
import { Sparkles, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/shared/Button';

export function BookingPage() {
  const location = useLocation();
  const preselectedServiceId = location.state?.selectedServiceId || '';
  const preselectedEventType = location.state?.selectedEventType || 'wedding';

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 space-y-12">
      <SeoMeta
        title="Inquire Event Date — Booking Qualification"
        description="Submit your event parameters for date availability review and bespoke consultation with ASEVA's event directors."
      />

      {/* Page Header */}
      <div className="space-y-4 max-w-2xl">
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase flex items-center">
          <Sparkles className="w-3.5 h-3.5 mr-1.5" />
          Client Onboarding & Date Inquiries
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-obsidian-950 leading-[1.1]">
          Inquire Your Event Date.
        </h1>
        <p className="text-sm text-obsidian-600 leading-relaxed font-light">
          Please provide the parameters of your planned celebration. Our directors will review calendar availability against our seasonal quota and contact you within 24–48 hours for a discovery consultation.
        </p>
      </div>

      {/* Main Reusable Booking Form */}
      <BookingEnquiryForm
        preselectedServiceId={preselectedServiceId}
        preselectedEventType={preselectedEventType}
      />
    </div>
  );
}

export function BookingConfirmedPage() {
  const location = useLocation();
  const state = location.state || {};

  const referenceCode = state.referenceCode || `ASV-${new Date().getFullYear()}-4821`;
  const clientName = state.clientName || 'Valued Patron';

  return (
    <div className="max-w-3xl mx-auto px-6 py-20 text-center space-y-8">
      <SeoMeta
        title="Enquiry Confirmed — ASEVA"
        description="Your booking enquiry has been received into our priority queue."
      />

      <div className="w-16 h-16 mx-auto rounded-full bg-gold-100 flex items-center justify-center text-gold-700 shadow-sm border border-gold-300/50">
        <ShieldCheck className="w-8 h-8" />
      </div>

      <div className="space-y-3">
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
          Enquiry Successfully Logged
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-bold text-obsidian-950">
          Thank You, {clientName}.
        </h1>
        <p className="text-sm text-obsidian-600 leading-relaxed max-w-lg mx-auto font-light">
          Your event parameters have been registered into our queue. Our concierge directors will inspect our seasonal calendar and be in touch within 24 to 48 hours.
        </p>
      </div>

      {/* Reference Card */}
      <div className="bg-white border border-sand-300 p-6 rounded-sm max-w-md mx-auto shadow-sm space-y-2">
        <span className="text-[10px] uppercase tracking-wider text-obsidian-500 font-semibold block">
          Your Booking Reference Code
        </span>
        <p className="font-mono text-xl font-bold text-gold-700 tracking-wider">
          {referenceCode}
        </p>
        <p className="text-[11px] text-obsidian-500 font-light">
          Please quote this reference in all correspondence with our studio.
        </p>
      </div>

      {/* Next Steps Timeline */}
      <div className="bg-sand-50 border border-sand-300 p-8 rounded-sm text-left max-w-xl mx-auto space-y-4">
        <h3 className="font-serif text-base font-bold text-obsidian-950 border-b border-sand-200 pb-2">
          What Happens Next
        </h3>
        <ul className="space-y-3 text-xs text-obsidian-700 font-light">
          <li className="flex items-start">
            <span className="font-serif font-bold text-gold-700 mr-2.5">1.</span>
            <span><strong>Date Feasibility:</strong> Our directors review date availability and initial guest/budget alignment.</span>
          </li>
          <li className="flex items-start">
            <span className="font-serif font-bold text-gold-700 mr-2.5">2.</span>
            <span><strong>Discovery Call:</strong> We will reach out via WhatsApp or email to schedule an introductory consultation.</span>
          </li>
          <li className="flex items-start">
            <span className="font-serif font-bold text-gold-700 mr-2.5">3.</span>
            <span><strong>Bespoke Proposal:</strong> You will receive a formalized quotation and milestone schedule for review.</span>
          </li>
        </ul>
      </div>

      <div className="pt-4 flex justify-center space-x-4">
        <Link to="/">
          <Button variant="outline" size="md">
            Return to Homepage
          </Button>
        </Link>
        <Link to="/portfolio">
          <Button variant="primary" size="md">
            Explore Portfolio
          </Button>
        </Link>
      </div>
    </div>
  );
}
