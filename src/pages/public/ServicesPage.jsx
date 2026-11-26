import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowRight, CheckCircle2, ChevronRight, ShieldCheck, Sparkles, MessageSquare } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { SeoMeta } from '../../components/shared/SeoMeta';
import { publicCatalogService } from '../../services/publicCatalogService';
import { useKobo } from '../../hooks/useKobo';

export function ServicesPage() {
  const navigate = useNavigate();
  const { formatNaira } = useKobo();
  const [activeCategory, setActiveCategory] = useState('all');
  const [selectedServiceId, setSelectedServiceId] = useState('');
  const [selectedEventType, setSelectedEventType] = useState('wedding');

  const { data: services = [], isLoading } = useQuery({
    queryKey: ['public', 'services'],
    queryFn: () => publicCatalogService.getServices(),
  });

  const categories = [
    { id: 'all', label: 'All Offerings' },
    { id: 'wedding', label: 'Luxury Weddings' },
    { id: 'corporate', label: 'Corporate Galas' },
    { id: 'social', label: 'Milestone Celebrations' },
    { id: 'styling', label: 'Spatial Scenography' },
  ];

  const filteredServices = activeCategory === 'all'
    ? services
    : services.filter((s) => s.category === activeCategory);

  const handleInquireClick = (service) => {
    setSelectedServiceId(service.id);
    setSelectedEventType(service.category);
    navigate('/contact#inquiry-form', {
      state: { selectedServiceId: service.id, selectedEventType: service.category },
    });
  };

  return (
    <div className="space-y-24 py-12 max-w-7xl mx-auto px-6 sm:px-8">
      <SeoMeta
        title="Services & Packages — Event Architecture"
        description="Explore ASEVA's luxury wedding planning, corporate gala production, milestone celebration curation, and spatial floral design offerings."
      />

      {/* Main Section: Services Catalog */}
      <div className="space-y-12">
        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase flex items-center">
            <Sparkles className="w-3.5 h-3.5 mr-1.5" />
            Curated Scopes
          </span>
          <h1 className="font-serif text-4xl sm:text-6xl font-bold text-obsidian-950 leading-[1.1]">
            Our Service Offerings.
          </h1>
          <p className="text-base text-obsidian-700 leading-relaxed font-light">
            Each commission is structured with defined deliverables, dedicated senior coordinators, and transparent financial milestones in Nigerian Naira.
          </p>
        </div>

        {/* Category Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2 border-b border-sand-300 pb-4">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
                activeCategory === cat.id
                  ? 'bg-obsidian-950 text-sand-50 shadow-sm'
                  : 'bg-sand-200/60 text-obsidian-700 hover:bg-sand-200 hover:text-obsidian-950'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Services List Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {filteredServices.map((service) => (
            <div
              key={service.slug}
              className="bg-white border border-sand-300 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400 hover:shadow-md transition-all group"
            >
              <div className="aspect-[16/9] overflow-hidden bg-sand-200 relative">
                <img
                  src={service.image_url}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4">
                  <span className="text-[10px] font-semibold tracking-widest uppercase bg-obsidian-950/80 text-sand-50 px-2.5 py-1 rounded backdrop-blur-sm">
                    {service.category}
                  </span>
                </div>
              </div>

              <div className="p-8 flex-1 flex flex-col justify-between space-y-6">
                <div className="space-y-3">
                  <h2 className="font-serif text-2xl font-bold text-obsidian-950 group-hover:text-gold-600 transition-colors">
                    {service.title}
                  </h2>
                  <p className="text-xs sm:text-sm text-obsidian-600 leading-relaxed font-light">
                    {service.short_description}
                  </p>

                  {service.service_packages && service.service_packages.length > 0 && (
                    <div className="pt-2">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-obsidian-500 block mb-2">
                        Sample Inclusions:
                      </span>
                      <ul className="space-y-1.5 text-xs text-obsidian-700">
                        {service.service_packages[0].inclusions.slice(0, 3).map((inc, i) => (
                          <li key={i} className="flex items-start">
                            <CheckCircle2 className="w-3.5 h-3.5 text-gold-600 mr-2 shrink-0 mt-0.5" />
                            <span className="font-light">{inc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>

                <div className="pt-6 border-t border-sand-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <span className="text-[10px] uppercase text-obsidian-500 block font-medium">Starting Investment</span>
                    <span className="font-serif text-sm font-bold text-obsidian-950 font-mono">
                      {service.starting_price_kobo > 0
                        ? formatNaira(service.starting_price_kobo, false)
                        : 'Bespoke Proposal'}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <Link to={`/services/${service.slug}`}>
                      <Button variant="outline" size="sm">
                        Full Scope
                      </Button>
                    </Link>
                    <Button
                      variant="gold"
                      size="sm"
                      onClick={() => handleInquireClick(service)}
                    >
                      Inquire
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Centered Callout Section: Tell Us What You Want */}
      <section
        id="tell-us-what-you-want"
        className="scroll-mt-24 pt-16 pb-8 border-t border-sand-300"
      >
        <div className="max-w-3xl mx-auto text-center space-y-6 flex flex-col items-center justify-center">
          <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-gold-600 uppercase bg-gold-50/80 px-3.5 py-1.5 rounded-full border border-gold-200/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Bespoke Commission Consultation</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-5xl font-bold text-obsidian-950">
            Tell Us What You Want.
          </h2>

          <p className="text-sm sm:text-base text-obsidian-600 leading-relaxed font-light max-w-2xl mx-auto">
            Have a distinct architectural concept, an unconventional venue, or multi-day festive program? Share your requirements with our studio directors. We assess date availability, budget alignment, and logistics before scheduling your discovery consultation.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto">
            <Link
              to="/contact#inquiry-form"
              state={{ selectedServiceId, selectedEventType }}
              className="w-full sm:w-auto"
            >
              <Button variant="gold" size="lg" className="w-full sm:w-auto shadow-sm">
                <span>Contact & Inquire With Form</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <Link to="/contact" className="w-full sm:w-auto">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                <MessageSquare className="w-4 h-4 mr-2 text-gold-600" />
                <span>Contact Studio Directly</span>
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export function ServiceDetailPage() {
  const { formatNaira } = useKobo();
  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 space-y-12">
      <SeoMeta
        title="Full-Service Wedding Planning & Design — Scope of Work"
        description="Comprehensive scope of work, deliverables, and milestone investment for luxury weddings at ASEVA."
      />

      <div className="space-y-4">
        <Link to="/services" className="text-xs font-semibold text-gold-600 hover:underline flex items-center">
          ← Return to All Service Offerings
        </Link>
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase block">
          Comprehensive Architectural Offering
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-obsidian-950">
          Full-Service Wedding Planning & Design
        </h1>
        <p className="text-base text-obsidian-700 leading-relaxed font-light max-w-3xl">
          Our signature offering designed for couples seeking an extraordinary, stress-free celebration. From initial spatial conceptualization to the final dance, ASEVA orchestrates every detail with flawless precision and emotional resonance.
        </p>
      </div>

      <div className="aspect-[21/9] bg-sand-200 rounded-sm overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80"
          alt="Full-Service Wedding Planning"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          <div className="bg-white p-8 border border-sand-300 rounded-sm space-y-6">
            <h2 className="font-serif text-xl font-bold text-obsidian-950 border-b border-sand-200 pb-3">
              Included Deliverables & Scope
            </h2>
            <ul className="space-y-3.5 text-xs text-obsidian-700 leading-relaxed font-light">
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-3 shrink-0 mt-0.5" />
                <span><strong>Dedicated Team:</strong> Senior lead wedding planner plus 4 coordination associates on site for the wedding weekend.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-3 shrink-0 mt-0.5" />
                <span><strong>Spatial CAD & 3D Schematics:</strong> Detailed spatial layout, seating flow, staging elevation, and ambient lighting mockups.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-3 shrink-0 mt-0.5" />
                <span><strong>Vendor Procurement & Vetting:</strong> Comprehensive negotiation with floral masters, fine-dining caterers, sound technicians, and security protocol.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-3 shrink-0 mt-0.5" />
                <span><strong>Fiscal Auditing:</strong> Structured milestone schedule, deposit escrow, and itemized expense reconciliation.</span>
              </li>
              <li className="flex items-start">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mr-3 shrink-0 mt-0.5" />
                <span><strong>Minute-by-Minute Run of Show:</strong> Precision timing coordination for bridal party, officiants, speeches, culinary service, and entertainment.</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Sidebar Summary */}
        <div className="space-y-6">
          <div className="bg-white p-6 border border-sand-300 rounded-sm space-y-4">
            <span className="text-[10px] font-semibold tracking-widest uppercase text-obsidian-500 block">
              Investment Benchmark
            </span>
            <p className="font-serif text-2xl font-bold text-obsidian-950 font-mono">
              {formatNaira(350000000, false)}
            </p>
            <p className="text-[11px] text-obsidian-500 font-light leading-relaxed">
              Base investment covers full planning direction and production coordination. Vendor procurement costs are budgeted transparently.
            </p>
            <div className="pt-2">
              <Link to="/contact#inquiry-form" state={{ selectedEventType: 'wedding' }}>
                <Button variant="gold" size="md" className="w-full">
                  Inquire This Service
                </Button>
              </Link>
            </div>
          </div>

          <div className="bg-sand-50 p-6 border border-sand-300 rounded-sm space-y-2 text-xs text-obsidian-600">
            <p className="font-semibold text-obsidian-900">Lead Time Guidance</p>
            <p className="font-light leading-relaxed">
              We recommend engaging our atelier 6 to 12 months prior to your wedding date to ensure venue and vendor availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
