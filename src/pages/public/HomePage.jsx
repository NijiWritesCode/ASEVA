import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowRight, 
  Sparkles, 
  CalendarDays, 
  ShieldCheck, 
  Award, 
  ChevronRight, 
  CheckCircle2, 
  Users, 
  MapPin,
  Quote
} from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { SeoMeta } from '../../components/shared/SeoMeta';
import { publicCatalogService } from '../../services/publicCatalogService';
import { useKobo } from '../../hooks/useKobo';
import { createScrollReveal } from '../../animations/gsapTransitions';

export function HomePage() {
  const { formatNaira } = useKobo();
  const heroRef = useRef(null);

  // Load services and portfolio from Supabase (or fallback seed)
  const { data: services = [] } = useQuery({
    queryKey: ['public', 'services'],
    queryFn: () => publicCatalogService.getServices(),
  });

  const { data: portfolio = [] } = useQuery({
    queryKey: ['public', 'portfolio'],
    queryFn: () => publicCatalogService.getPortfolioItems(),
  });

  useEffect(() => {
    if (heroRef.current) {
      createScrollReveal(heroRef.current.children, { y: 30, stagger: 0.12, duration: 0.8 });
    }
  }, []);

  const testimonials = [
    {
      quote: "ASEVA orchestrated our wedding with such poise and architectural mastery. Every floral arrangement and minute of our run-of-show moved with absolute perfection.",
      author: "Zainab & Femi Balogun",
      role: "Luxury Nuptials • Eko Atlantic, Lagos",
    },
    {
      quote: "Setting up a multi-day corporate summit for 300 international executives required military precision. ASEVA delivered an immaculate production without a single hitch.",
      author: "Head of Corporate Affairs",
      role: "Aethelgard Capital Holdings • Abuja",
    },
    {
      quote: "Unmatched discretion, bespoke spatial scenography, and complete peace of mind. Our guests still speak of the 50th jubilee gala.",
      author: "Chief & Dr. (Mrs.) Adeleke",
      role: "Private Estate Jubilee • Ikoyi, Lagos",
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-32 pb-16">
      <SeoMeta
        title="ASEVA — Luxury Event Architecture & Bespoke Design"
        description="Nigeria's premier event planning maison crafting luxury weddings, corporate galas, and bespoke celebratory experiences with architectural precision."
      />

      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 sm:pt-20 sm:pb-32 border-b border-sand-300/80 bg-gradient-to-b from-sand-100 via-sand-50 to-sand-100">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div ref={heroRef} className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 text-xs font-semibold tracking-widest text-gold-600 uppercase bg-gold-50/80 px-3 py-1 rounded-full border border-gold-200/60">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Bespoke Event Architecture • Lagos & Abuja</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-obsidian-950 leading-[1.08]">
              Elevating Life’s Defining Moments.
            </h1>

            <p className="text-base sm:text-lg text-obsidian-700 leading-relaxed font-light max-w-2xl">
              ASEVA curates luxury weddings, executive corporate galas, and momentous celebrations with architectural vision, transparent financial governance, and uncompromising logistical rigor.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link to="/book">
                <Button variant="gold" size="lg">
                  <span>Reserve Your Date</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link to="/portfolio">
                <Button variant="outline" size="lg">
                  Explore Portfolio
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Decorative architectural background watermark */}
        <div className="hidden lg:block absolute -right-20 top-1/2 -translate-y-1/2 pointer-events-none opacity-5 font-serif text-[18rem] font-bold text-obsidian-950 select-none">
          ASV
        </div>
      </section>

      {/* 2. Business Manifesto */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-white border border-sand-300 p-8 sm:p-16 rounded-sm shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-5 space-y-3">
            <span className="text-[11px] font-semibold tracking-widest text-gold-600 uppercase block">
              The Planning Atelier
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian-950">
              Where Precision Logistics Meets Fine Artistry.
            </h2>
          </div>
          <div className="lg:col-span-7 text-xs sm:text-sm text-obsidian-600 leading-relaxed space-y-4 font-light">
            <p>
              We view event production not merely as logistics, but as transient architecture—a discipline demanding spatial mastery, emotional sensitivity, and rigorous operational control.
            </p>
            <p>
              By strictly limiting our seasonal commissions, ASEVA ensures that every celebration receives the dedicated attention of our senior directors. From custom 3D floorplans and transparent milestone contracts in NGN to minute-by-minute run-of-show orchestration, we protect your peace of mind.
            </p>
          </div>
        </div>
      </section>

      {/* 3. Main Services Pillars */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-300 pb-6">
          <div>
            <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
              Curated Services
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian-950 mt-1">
              Our Core Offerings
            </h2>
          </div>
          <Link to="/services" className="text-xs font-semibold uppercase tracking-wider text-obsidian-900 hover:text-gold-600 flex items-center">
            <span>Explore All Scopes</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.slice(0, 3).map((service) => (
            <div
              key={service.slug}
              className="bg-white border border-sand-300 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400 hover:shadow-md transition-all group"
            >
              <div className="aspect-[16/10] overflow-hidden bg-sand-200">
                <img
                  src={service.image_url}
                  alt={service.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <span className="text-[10px] font-semibold tracking-widest uppercase text-gold-600">
                    {service.category}
                  </span>
                  <h3 className="font-serif text-xl font-bold text-obsidian-950 group-hover:text-gold-600 transition-colors">
                    {service.title}
                  </h3>
                  <p className="text-xs text-obsidian-600 leading-relaxed font-light line-clamp-3">
                    {service.short_description}
                  </p>
                </div>

                <div className="pt-4 border-t border-sand-200 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase text-obsidian-500 block">Investment</span>
                    <span className="font-serif text-xs font-bold text-obsidian-900 font-mono">
                      {service.starting_price_kobo > 0
                        ? `From ${formatNaira(service.starting_price_kobo, false)}`
                        : 'Custom Proposal'}
                    </span>
                  </div>
                  <Link to={`/services/${service.slug}`}>
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. The ASEVA Standard (Why Choose Us) */}
      <section className="bg-obsidian-950 text-sand-100 py-24 border-y border-obsidian-800">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-16">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
              Our Methodology
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-sand-50">
              The ASEVA Planning Standard
            </h2>
            <p className="text-xs sm:text-sm text-sand-400 leading-relaxed font-light">
              We structure every event as a production schedule with defined milestones, transparent financial governance, and proactive contingency protocols.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-obsidian-900/80 border border-obsidian-800 p-8 rounded-sm space-y-4">
              <span className="font-serif text-3xl font-extrabold text-gold-400">01</span>
              <h3 className="font-serif text-lg font-bold text-sand-50">Spatial Conceptualization</h3>
              <p className="text-xs text-sand-400 leading-relaxed font-light">
                We transform empty spaces into immersive worlds with custom CAD schematics, 3D floral mockups, and atmospheric lighting design.
              </p>
            </div>

            <div className="bg-obsidian-900/80 border border-obsidian-800 p-8 rounded-sm space-y-4">
              <span className="font-serif text-3xl font-extrabold text-gold-400">02</span>
              <h3 className="font-serif text-lg font-bold text-sand-50">Fiscal & Vendor Governance</h3>
              <p className="text-xs text-sand-400 leading-relaxed font-light">
                Zero ambiguous fee structures. Transparent milestone schedules in NGN kobo, vetted supplier contracts, and rigorous expense auditing.
              </p>
            </div>

            <div className="bg-obsidian-900/80 border border-obsidian-800 p-8 rounded-sm space-y-4">
              <span className="font-serif text-3xl font-extrabold text-gold-400">03</span>
              <h3 className="font-serif text-lg font-bold text-sand-50">Immaculate Execution</h3>
              <p className="text-xs text-sand-400 leading-relaxed font-light">
                Minute-by-minute run-of-show orchestration directed by our senior planners, ensuring you and your guests experience uninterrupted serenity.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Featured Work / Portfolio Showcase */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-sand-300 pb-6">
          <div>
            <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
              Curated Archives
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold text-obsidian-950 mt-1">
              Featured Case Studies
            </h2>
          </div>
          <Link to="/portfolio" className="text-xs font-semibold uppercase tracking-wider text-obsidian-900 hover:text-gold-600 flex items-center">
            <span>View All Works</span>
            <ChevronRight className="w-4 h-4 ml-0.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {portfolio.slice(0, 2).map((item) => (
            <Link
              key={item.slug}
              to={`/portfolio/${item.slug}`}
              className="group bg-white border border-sand-300 rounded-sm overflow-hidden hover:border-gold-400 hover:shadow-md transition-all flex flex-col"
            >
              <div className="aspect-[16/10] overflow-hidden bg-sand-200">
                <img
                  src={item.cover_image_url}
                  alt={item.title}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              </div>
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-gold-600 font-semibold">
                  <span>{item.event_type}</span>
                  <span className="flex items-center text-obsidian-500 font-normal">
                    <Users className="w-3.5 h-3.5 mr-1" />
                    {item.guest_count ? `${item.guest_count} Guests` : 'Private'}
                  </span>
                </div>
                <h3 className="font-serif text-xl font-bold text-obsidian-950 group-hover:text-gold-600 transition-colors">
                  {item.title}
                </h3>
                <div className="flex items-center text-xs text-obsidian-500">
                  <MapPin className="w-3.5 h-3.5 mr-1.5 text-gold-600" />
                  <span>{item.location}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 6. Verified Testimonials */}
      <section className="bg-sand-200/50 py-20 border-y border-sand-300">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 space-y-12">
          <div className="text-center max-w-xl mx-auto">
            <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
              Client Endorsements
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-obsidian-950 mt-1">
              Words From Our Patrons
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((t, idx) => (
              <div key={idx} className="bg-white p-8 border border-sand-300 rounded-sm flex flex-col justify-between space-y-6">
                <div className="space-y-4">
                  <Quote className="w-6 h-6 text-gold-500/50" />
                  <p className="text-xs sm:text-sm text-obsidian-700 leading-relaxed font-light italic">
                    "{t.quote}"
                  </p>
                </div>
                <div className="border-t border-sand-200 pt-4">
                  <p className="font-serif text-xs font-bold text-obsidian-950">{t.author}</p>
                  <p className="text-[11px] text-obsidian-500">{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="bg-obsidian-950 text-sand-50 border border-obsidian-800 p-10 sm:p-16 rounded-sm text-center max-w-4xl mx-auto space-y-6 relative overflow-hidden">
          <span className="text-xs font-semibold tracking-widest text-gold-400 uppercase">
            Exclusive Seasonal Calendar
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-bold tracking-tight text-sand-50">
            Let Us Architect Your Next Milestone.
          </h2>
          <p className="text-xs sm:text-sm text-sand-300 max-w-lg mx-auto font-light leading-relaxed">
            Our directors accept a limited number of high-stakes productions per season. Submit an initial enquiry to check date availability and schedule a discovery consultation.
          </p>
          <div className="pt-4 flex justify-center">
            <Link to="/book">
              <Button variant="gold" size="lg">
                <span>Reserve Event Date</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
