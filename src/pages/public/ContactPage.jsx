import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Mail, Phone, MapPin, Clock, ArrowRight, MessageSquare, ShieldCheck, ChevronDown, Sparkles } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { SeoMeta } from '../../components/shared/SeoMeta';
import { BookingEnquiryForm } from '../../components/public/BookingEnquiryForm';

export function ContactPage() {
  const location = useLocation();
  const preselectedServiceId = location.state?.selectedServiceId || '';
  const preselectedEventType = location.state?.selectedEventType || 'wedding';

  useEffect(() => {
    if (location.hash) {
      const targetId = location.hash.replace('#', '');
      const el = document.getElementById(targetId);
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [location.hash]);

  const handleScrollToForm = (e) => {
    e.preventDefault();
    const el = document.getElementById('inquiry-form');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 sm:px-8 py-16 space-y-20">
      <SeoMeta
        title="Concierge & Studio Contact"
        description="Connect with ASEVA's event planning directors in Victoria Island, Lagos. Private consultation bookings and corporate inquiries."
      />

      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
          Private Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-obsidian-950 leading-[1.1]">
          Connect With Our Studio.
        </h1>
        <p className="text-base text-obsidian-700 leading-relaxed font-light">
          For executive consultations, press inquiries, and private celebratory commissions across Nigeria and international destinations.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
        {/* Left Column: Coordinates */}
        <div className="lg:col-span-7 bg-white p-8 sm:p-12 border border-sand-300 rounded-sm shadow-sm space-y-8">
          <h2 className="font-serif text-2xl font-bold text-obsidian-950 border-b border-sand-200 pb-4">
            Direct Communications
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-xs text-obsidian-700">
            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
                <Mail className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-obsidian-950">Concierge Email</h3>
              <p className="text-obsidian-600 font-light">concierge@asevaevents.com</p>
              <p className="text-[11px] text-obsidian-500">Typical response within 24 hours</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
                <Phone className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-obsidian-950">Telephone & WhatsApp</h3>
              <p className="text-obsidian-600 font-light">+234 800 000 2738</p>
              <p className="text-[11px] text-obsidian-500">Mon–Fri: 09:00 – 18:00 (WAT)</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
                <MapPin className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-obsidian-950">Consultation Studio</h3>
              <p className="text-obsidian-600 font-light">Victoria Island, Lagos, Nigeria</p>
              <p className="text-[11px] text-obsidian-500">By private appointment only</p>
            </div>

            <div className="space-y-2">
              <div className="w-8 h-8 rounded-full bg-gold-100 text-gold-700 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-sm font-bold text-obsidian-950">Operating Hours</h3>
              <p className="text-obsidian-600 font-light">Monday – Friday: 09:00 – 18:00</p>
              <p className="text-[11px] text-obsidian-500">Weekend production on-site</p>
            </div>
          </div>
        </div>

        {/* Right Column: Inquiry Callout */}
        <div className="lg:col-span-5 bg-obsidian-950 text-sand-100 p-8 sm:p-10 border border-obsidian-800 rounded-sm space-y-6">
          <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase block">
            Planning a Wedding or Gala?
          </span>
          <h3 className="font-serif text-2xl font-bold text-sand-50">
            Submit a Structured Booking Inquiry
          </h3>
          <p className="text-xs text-sand-400 leading-relaxed font-light">
            Rather than general email inquiries, our step-by-step booking form allows our directors to assess venue feasibility, date conflicts, and budget brackets immediately.
          </p>
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <a href="#inquiry-form" onClick={handleScrollToForm} className="flex-1">
              <Button variant="gold" size="lg" className="w-full">
                <span>Start Step Form</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Embedded Booking Inquiry Section */}
      <section
        id="inquiry-form"
        className="scroll-mt-24 pt-16 border-t border-sand-300 space-y-10"
      >
        <div className="max-w-3xl mx-auto text-center space-y-3">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-gold-600 uppercase bg-gold-50/80 px-3.5 py-1.5 rounded-full border border-gold-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tell Us What You Want</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-obsidian-950">
            Direct Lead Consultation Form
          </h2>
          <p className="text-sm text-obsidian-600 leading-relaxed font-light max-w-xl mx-auto">
            Describe your celebration vision, preferred schedule, and parameters across 4 simple steps. Review your answers and submit manually when you are ready.
          </p>
        </div>

        <BookingEnquiryForm
          preselectedServiceId={preselectedServiceId}
          preselectedEventType={preselectedEventType}
        />
      </section>
    </div>
  );
}

export function FaqsPage() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqCategories = [
    {
      category: 'Booking, Retainers & Milestones',
      items: [
        {
          q: 'How far in advance should we engage ASEVA?',
          a: 'For luxury weddings and high-profile galas, we recommend engaging our studio 6 to 12 months in advance to secure top-tier venues and artisan vendors. We occasionally accept commissions on shorter timelines subject to availability.'
        },
        {
          q: 'What is ASEVA’s booking deposit and payment schedule policy?',
          a: 'We operate on a transparent, milestone-driven financial standard in Nigerian Naira: typically 30% initial commitment deposit upon contract signing, 40% mid-planning installment, and the remaining 30% balance two weeks prior to the event date.'
        },
        {
          q: 'Is our initial booking enquiry a confirmed reservation?',
          a: 'No. Submitting an enquiry allows our directors to review calendar availability. A reservation is only confirmed once contracts are executed and the initial retainer is verified in our bank accounts.'
        }
      ]
    },
    {
      category: 'Vendor Partnerships & Logistics',
      items: [
        {
          q: 'Can we bring our own vendors?',
          a: 'Yes. While ASEVA maintains a vetted master rolodex of caterers, decorators, and technicians, we collaborate with our clients’ preferred vendors provided they satisfy our standards for safety, reliability, and insurance.'
        },
        {
          q: 'Do you manage destination celebrations outside Lagos and Abuja?',
          a: 'Yes. ASEVA regularly manages destination celebrations across the UK, UAE, Southern Europe, and throughout Africa. Logistics, flights, and accommodations are budgeted cleanly as transparent expenses.'
        },
        {
          q: 'What happens if we need to reschedule our date?',
          a: 'We accommodate date adjustments subject to our calendar availability. Our contracts clearly define terms for date transfers and vendor commitment liabilities.'
        }
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 sm:px-8 py-16 space-y-12">
      <SeoMeta
        title="Frequently Answered Questions"
        description="Find answers to common questions about ASEVA's event planning retainers, vendor policies, destination events, and execution timelines."
      />

      <div className="space-y-4">
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
          Client Guidance
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-obsidian-950">
          Frequently Answered Questions.
        </h1>
        <p className="text-sm text-obsidian-600 leading-relaxed font-light">
          Common inquiries regarding our engagement model, financial standards, and operational process.
        </p>
      </div>

      <div className="space-y-10">
        {faqCategories.map((group, groupIdx) => (
          <div key={groupIdx} className="space-y-4">
            <h2 className="font-serif text-lg font-bold text-obsidian-950 border-b border-sand-300 pb-2">
              {group.category}
            </h2>
            <div className="space-y-3">
              {group.items.map((faq, idx) => {
                const uniqueKey = `${groupIdx}-${idx}`;
                const isOpen = openIndex === uniqueKey;
                return (
                  <div
                    key={idx}
                    className="bg-white border border-sand-300 rounded-sm overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenIndex(isOpen ? null : uniqueKey)}
                      className="w-full p-5 text-left flex items-center justify-between text-xs sm:text-sm font-semibold text-obsidian-950 hover:text-gold-600 transition-colors"
                    >
                      <span className="font-serif">{faq.q}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-gold-600 shrink-0 ml-4 transition-transform duration-200 ${
                          isOpen ? 'rotate-180' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs text-obsidian-600 leading-relaxed font-light border-t border-sand-100">
                        {faq.a}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function NotFoundPage() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <SeoMeta title="Page Not Found" />
      <span className="font-serif text-6xl font-bold text-gold-600">404</span>
      <h1 className="font-serif text-2xl font-bold text-obsidian-950">
        Page Not Located
      </h1>
      <p className="text-xs text-obsidian-600 max-w-sm font-light leading-relaxed">
        The requested address does not exist or has been relocated within our archives.
      </p>
      <div className="pt-2">
        <Link to="/">
          <Button variant="primary" size="md">
            Return to Homepage
          </Button>
        </Link>
      </div>
    </div>
  );
}
