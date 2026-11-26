import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Sparkles, Award, ArrowRight, CheckCircle2, Clock, Landmark } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { SeoMeta } from '../../components/shared/SeoMeta';

export function AboutPage() {
  return (
    <div className="space-y-20 py-12 max-w-7xl mx-auto px-6 sm:px-8">
      <SeoMeta
        title="About Our Studio & Heritage"
        description="Learn about ASEVA's architectural approach to luxury event management, leadership, values, and planning rigor."
      />

      {/* Page Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
          Studio Heritage & Ethos
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-obsidian-950 leading-[1.1]">
          The Art of Intentional Celebration.
        </h1>
        <p className="text-base text-obsidian-700 leading-relaxed font-light">
          ASEVA was founded with a singular conviction: that extraordinary events should not be left to chance or superficial styling. They must be conceived as architectural commissions, engineered with structural poise, logistical discipline, and emotional resonance.
        </p>
      </div>

      {/* Story & Philosophy Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 pt-8 border-t border-sand-300">
        <div className="space-y-6">
          <span className="text-[11px] font-semibold tracking-widest text-gold-600 uppercase block">
            Our Approach
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian-950">
            Transient Architecture with Permanent Memory.
          </h2>
          <div className="text-xs sm:text-sm text-obsidian-600 space-y-4 font-light leading-relaxed">
            <p>
              Operating primarily across Lagos and Abuja, with availability for destination commissions throughout Africa and Europe, ASEVA serves discerning couples, corporate institutions, and high-profile individuals who require uncompromising excellence.
            </p>
            <p>
              We reject the generic, formulaic templates common in modern event planning. Instead, every spatial floorplan, floral installation, and lighting trajectory is engineered specifically for the venue and the narrative of our hosts.
            </p>
          </div>
        </div>

        <div className="space-y-6">
          <span className="text-[11px] font-semibold tracking-widest text-gold-600 uppercase block">
            Our Distinction
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian-950">
            Why Our Clients Trust Us.
          </h2>
          <div className="space-y-3">
            <div className="flex items-start space-x-3 bg-white p-4 border border-sand-300 rounded-sm">
              <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-xs font-bold text-obsidian-950">Fiscal Transparency in NGN</h4>
                <p className="text-[11px] text-obsidian-600 font-light mt-0.5">
                  Milestone contracts, itemized procurement records, and zero surprise vendor expenses.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-white p-4 border border-sand-300 rounded-sm">
              <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-xs font-bold text-obsidian-950">Exclusive Seasonal Quotas</h4>
                <p className="text-[11px] text-obsidian-600 font-light mt-0.5">
                  We limit our bookings so our principal directors are physically present to lead rehearsals and execution.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 bg-white p-4 border border-sand-300 rounded-sm">
              <CheckCircle2 className="w-4 h-4 text-gold-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-serif text-xs font-bold text-obsidian-950">Vetted Vendor Rolodex</h4>
                <p className="text-[11px] text-obsidian-600 font-light mt-0.5">
                  Pre-negotiated partnerships with West Africa’s most distinguished caterers, florists, and lighting engineers.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Leadership Profile */}
      <div className="bg-white border border-sand-300 p-8 sm:p-12 rounded-sm grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
        <div className="md:col-span-4 aspect-[4/5] bg-sand-200 rounded-sm overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=800&q=80"
            alt="ASEVA Creative Leadership"
            className="w-full h-full object-cover"
          />
        </div>
        <div className="md:col-span-8 space-y-4">
          <span className="text-[11px] font-semibold tracking-widest text-gold-600 uppercase block">
            Creative Direction & Leadership
          </span>
          <h3 className="font-serif text-2xl font-bold text-obsidian-950">
            Bespoke Vision, Guided by Discipline.
          </h3>
          <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed font-light">
            "An extraordinary celebration is not created in the final hours; it is earned through months of quiet, methodical calculation. When you enter an ASEVA event, you feel the harmony because every single logistical question was answered long before the doors opened."
          </p>
          <div className="pt-2">
            <p className="font-serif text-xs font-bold text-obsidian-950">Principal Event Director</p>
            <p className="text-[11px] text-obsidian-500">ASEVA Event Architecture</p>
          </div>
        </div>
      </div>

      {/* Booking CTA Banner */}
      <div className="bg-sand-200/70 p-10 rounded-sm border border-sand-300 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-6">
        <div>
          <h3 className="font-serif text-xl font-bold text-obsidian-950">Ready to discuss your date?</h3>
          <p className="text-xs text-obsidian-600 mt-1 font-light">
            Our concierge will review your parameters and coordinate a private consultation.
          </p>
        </div>
        <Link to="/book" className="shrink-0">
          <Button variant="primary" size="md">
            <span>Inquire Now</span>
            <ArrowRight className="w-4 h-4 ml-1.5" />
          </Button>
        </Link>
      </div>
    </div>
  );
}
