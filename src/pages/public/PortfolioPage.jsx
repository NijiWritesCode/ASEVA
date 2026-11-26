import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Users, MapPin, Calendar, ArrowRight, Quote, Sparkles } from 'lucide-react';
import { Button } from '../../components/shared/Button';
import { SeoMeta } from '../../components/shared/SeoMeta';
import { publicCatalogService } from '../../services/publicCatalogService';

export function PortfolioPage() {
  const [filter, setFilter] = useState('all');

  const { data: portfolio = [], isLoading } = useQuery({
    queryKey: ['public', 'portfolio'],
    queryFn: () => publicCatalogService.getPortfolioItems(),
  });

  const categories = [
    { id: 'all', label: 'All Commissions' },
    { id: 'Luxury Wedding', label: 'Luxury Weddings' },
    { id: 'Corporate Gala', label: 'Corporate Galas' },
    { id: 'Milestone Celebration', label: 'Milestones & Private' },
  ];

  const filteredItems = filter === 'all'
    ? portfolio
    : portfolio.filter((item) => item.event_type.toLowerCase().includes(filter.toLowerCase()));

  return (
    <div className="space-y-16 py-12 max-w-7xl mx-auto px-6 sm:px-8">
      <SeoMeta
        title="Portfolio & Archives — Selected Commissions"
        description="Explore ASEVA's visual record of luxury weddings, corporate galas, and bespoke celebratory experiences in Lagos and Abuja."
      />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase">
          Curated Archives
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-bold text-obsidian-950 leading-[1.1]">
          Selected Commissions.
        </h1>
        <p className="text-base text-obsidian-700 leading-relaxed font-light">
          A visual record of architectural beauty, refined spatial styling, and bespoke celebratory production crafted with uncompromising precision.
        </p>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex flex-wrap items-center gap-2 border-b border-sand-300 pb-4">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setFilter(cat.id)}
            className={`px-4 py-2 text-xs font-semibold uppercase tracking-wider rounded-sm transition-all ${
              filter === cat.id
                ? 'bg-obsidian-950 text-sand-50 shadow-sm'
                : 'bg-sand-200/60 text-obsidian-700 hover:bg-sand-200 hover:text-obsidian-950'
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Portfolio Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map((item) => (
          <Link
            key={item.slug}
            to={`/portfolio/${item.slug}`}
            className="group bg-white border border-sand-300 rounded-sm overflow-hidden flex flex-col justify-between hover:border-gold-400 hover:shadow-md transition-all"
          >
            <div className="aspect-[16/11] overflow-hidden bg-sand-200 relative">
              <img
                src={item.cover_image_url}
                alt={item.title}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-4 left-4">
                <span className="text-[10px] font-semibold tracking-widest uppercase bg-obsidian-950/80 text-sand-50 px-2.5 py-1 rounded backdrop-blur-sm">
                  {item.event_type}
                </span>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px] text-obsidian-500">
                  <span className="flex items-center">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-gold-600" />
                    {item.location}
                  </span>
                  <span className="flex items-center">
                    <Users className="w-3.5 h-3.5 mr-1 text-obsidian-400" />
                    {item.guest_count ? `${item.guest_count} Guests` : 'Private'}
                  </span>
                </div>

                <h2 className="font-serif text-xl font-bold text-obsidian-950 group-hover:text-gold-600 transition-colors">
                  {item.title}
                </h2>

                <p className="text-xs text-obsidian-600 leading-relaxed font-light line-clamp-3">
                  {item.narrative}
                </p>
              </div>

              <div className="pt-4 border-t border-sand-200 flex items-center justify-between text-xs font-semibold text-obsidian-900 group-hover:text-gold-600 transition-colors">
                <span>View Case Study</span>
                <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PortfolioDetailPage() {
  const { slug } = useParams();

  const { data: item } = useQuery({
    queryKey: ['public', 'portfolio', slug],
    queryFn: () => publicCatalogService.getPortfolioItemBySlug(slug || 'the-luminary-glasshouse-nuptials'),
  });

  const caseStudy = item || {
    title: 'The Luminary Glasshouse Nuptials',
    event_type: 'Luxury Wedding',
    location: 'Eko Atlantic, Lagos',
    guest_count: 450,
    cover_image_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1600&q=80',
    gallery_images: [
      'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1545232979-8bf68ee9b1af?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=80'
    ],
    narrative: 'Set within a custom-erected glass pavilion overlooking the Atlantic shoreline, this celebration married timeless ivory florals with warm champagne ambient illumination. Over 450 guests experienced a four-course synchronized dining service followed by an extraordinary midnight after-party.',
    testimonial: 'ASEVA gave us the wedding of our dreams. Everything moved with such effortless poise and structural grandeur.',
    testimonial_author: 'Zainab & Femi Balogun',
  };

  return (
    <div className="max-w-5xl mx-auto px-6 sm:px-8 py-16 space-y-12">
      <SeoMeta
        title={`${caseStudy.title} — Case Study`}
        description={caseStudy.narrative?.slice(0, 150)}
      />

      <div className="space-y-4">
        <Link to="/portfolio" className="text-xs font-semibold text-gold-600 hover:underline flex items-center">
          ← Return to All Works & Archives
        </Link>
        <span className="text-xs font-semibold tracking-widest text-gold-600 uppercase block">
          {caseStudy.event_type} Case Study
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-bold text-obsidian-950">
          {caseStudy.title}
        </h1>
        <div className="flex flex-wrap items-center gap-6 text-xs text-obsidian-600 font-light pt-1">
          <span className="flex items-center"><MapPin className="w-3.5 h-3.5 mr-1.5 text-gold-600" />{caseStudy.location}</span>
          <span className="flex items-center"><Users className="w-3.5 h-3.5 mr-1.5 text-gold-600" />{caseStudy.guest_count} Guests</span>
        </div>
      </div>

      {/* Main Cover Image */}
      <div className="aspect-[16/9] bg-sand-200 rounded-sm overflow-hidden shadow-sm">
        <img
          src={caseStudy.cover_image_url}
          alt={caseStudy.title}
          className="w-full h-full object-cover"
        />
      </div>

      {/* Narrative Brief */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        <div className="lg:col-span-8 bg-white p-8 border border-sand-300 rounded-sm space-y-4">
          <h2 className="font-serif text-xl font-bold text-obsidian-950 border-b border-sand-200 pb-3">
            The Commission & Design Story
          </h2>
          <p className="text-xs sm:text-sm text-obsidian-700 leading-relaxed font-light">
            {caseStudy.narrative}
          </p>
        </div>

        {/* Testimonial Quote */}
        {caseStudy.testimonial && (
          <div className="lg:col-span-4 bg-sand-200/50 p-6 border border-sand-300 rounded-sm space-y-4">
            <Quote className="w-5 h-5 text-gold-600" />
            <p className="text-xs text-obsidian-800 italic leading-relaxed font-light">
              "{caseStudy.testimonial}"
            </p>
            <div className="pt-2 border-t border-sand-300/80">
              <p className="font-serif text-xs font-bold text-obsidian-950">{caseStudy.testimonial_author}</p>
              <p className="text-[10px] text-obsidian-500 uppercase tracking-wider">Host & Patron</p>
            </div>
          </div>
        )}
      </div>

      {/* Image Gallery */}
      {caseStudy.gallery_images && caseStudy.gallery_images.length > 0 && (
        <div className="space-y-4 pt-4">
          <h3 className="font-serif text-lg font-bold text-obsidian-950">Visual Documentation</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {caseStudy.gallery_images.map((imgUrl, i) => (
              <div key={i} className="aspect-[4/3] bg-sand-200 rounded-sm overflow-hidden border border-sand-300">
                <img
                  src={imgUrl}
                  alt={`${caseStudy.title} gallery view ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Conversion Action */}
      <div className="bg-obsidian-950 text-sand-50 p-8 rounded-sm text-center space-y-4">
        <h3 className="font-serif text-xl font-bold text-sand-50">Envisioning a similar celebration?</h3>
        <p className="text-xs text-sand-400 font-light max-w-md mx-auto">
          Contact our atelier to begin conceptualizing your event spatial plan and vendor team.
        </p>
        <Link to="/book" className="inline-block pt-2">
          <Button variant="gold" size="md">
            Reserve Consultation Date
          </Button>
        </Link>
      </div>
    </div>
  );
}
