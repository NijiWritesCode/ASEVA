import React, { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { Menu, X, ArrowRight, ShieldCheck, Phone, Mail, MapPin } from 'lucide-react';
import { Button } from '../components/shared/Button';

export function PublicLayout() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: 'About', path: '/about' },
    { name: 'Services', path: '/services' },
    { name: 'Portfolio', path: '/portfolio' },
    { name: 'FAQs', path: '/faqs' },
    { name: 'Contact', path: '/contact' },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-sand-100 text-obsidian-900 selection:bg-gold-500 selection:text-white">
      {/* Editorial Top Navigation */}
      <header className="sticky top-0 z-40 bg-sand-100/90 backdrop-blur-md border-b border-sand-300/60 transition-all">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <Link to="/" className="flex flex-col items-start group">
            <span className="font-serif text-2xl sm:text-3xl font-extrabold tracking-widest text-obsidian-950 group-hover:text-gold-600 transition-colors">
              ASEVA
            </span>
            <span className="text-[9px] tracking-[0.25em] text-obsidian-600 uppercase font-sans -mt-1">
              Event Architecture
            </span>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.path;
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-xs font-medium tracking-widest uppercase transition-colors hover:text-gold-600 ${
                    isActive ? 'text-gold-600 border-b border-gold-500 pb-1' : 'text-obsidian-700'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Action CTAs */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/book">
              <Button variant="primary" size="md">
                Inquire Date
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Trigger */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-obsidian-900 hover:text-gold-600 focus:outline-none"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-sand-100 border-b border-sand-300 px-6 py-6 space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className="block text-sm font-medium tracking-wider uppercase text-obsidian-800 hover:text-gold-600 py-1"
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-sand-300 flex flex-col space-y-3">
              <Link to="/book" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="primary" size="md" className="w-full">
                  Inquire Date
                </Button>
              </Link>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <Button variant="outline" size="md" className="w-full">
                  Staff Portal
                </Button>
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Page Content */}
      <main className="flex-1">
        <Outlet />
      </main>

      {/* Editorial Luxury Footer */}
      <footer className="bg-obsidian-950 text-sand-100 border-t border-obsidian-800 pt-16 pb-12">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-16 border-b border-obsidian-800">
            {/* Column 1: Brand Ethos */}
            <div className="space-y-4 md:col-span-1">
              <span className="font-serif text-2xl font-bold tracking-widest text-sand-50 block">
                ASEVA
              </span>
              <p className="text-xs text-sand-400 leading-relaxed max-w-sm">
                Curating bespoke celebratory architecture, luxury nuptials, and high-stakes corporate productions with uncompromising precision and elegance.
              </p>
              <div className="flex items-center text-xs text-gold-400 pt-2">
                <ShieldCheck className="w-4 h-4 mr-1.5" />
                <span>Operating across Lagos, Abuja & Destinations</span>
              </div>
            </div>

            {/* Column 2: Navigation */}
            <div>
              <h4 className="font-serif text-sm font-semibold tracking-wider text-sand-100 uppercase mb-4">
                Explore
              </h4>
              <ul className="space-y-2.5 text-xs text-sand-400">
                <li><Link to="/about" className="hover:text-gold-400 transition-colors">Our Ethos & Studio</Link></li>
                <li><Link to="/services" className="hover:text-gold-400 transition-colors">Services & Offerings</Link></li>
                <li><Link to="/portfolio" className="hover:text-gold-400 transition-colors">Portfolio & Archives</Link></li>
                <li><Link to="/faqs" className="hover:text-gold-400 transition-colors">Client FAQs</Link></li>
                <li><Link to="/contact" className="hover:text-gold-400 transition-colors">Private Consultation</Link></li>
              </ul>
            </div>

            {/* Column 3: Contact Coordinates */}
            <div>
              <h4 className="font-serif text-sm font-semibold tracking-wider text-sand-100 uppercase mb-4">
                Concierge
              </h4>
              <ul className="space-y-3 text-xs text-sand-400">
                <li className="flex items-center">
                  <Mail className="w-4 h-4 mr-2 text-gold-400 shrink-0" />
                  <span>concierge@asevaevents.com</span>
                </li>
                <li className="flex items-center">
                  <Phone className="w-4 h-4 mr-2 text-gold-400 shrink-0" />
                  <span>+234 800 000 2738</span>
                </li>
                <li className="flex items-start">
                  <MapPin className="w-4 h-4 mr-2 text-gold-400 shrink-0 mt-0.5" />
                  <span>Victoria Island, Lagos, Nigeria</span>
                </li>
              </ul>
            </div>

            {/* Column 4: Booking Callout */}
            <div className="space-y-4">
              <h4 className="font-serif text-sm font-semibold tracking-wider text-sand-100 uppercase mb-2">
                Begin Your Journey
              </h4>
              <p className="text-xs text-sand-400 leading-relaxed">
                We accept a limited number of high-touch events per season to ensure unwavering quality and focus.
              </p>
              <Link to="/book" className="inline-block w-full">
                <Button variant="gold" size="md" className="w-full">
                  <span>Reserve Date</span>
                  <ArrowRight className="w-4 h-4 ml-1.5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-sand-500 gap-4">
            <p>© {new Date().getFullYear()} ASEVA Events Nigeria. All rights reserved.</p>
            <div className="flex space-x-6">
              <Link to="/login" className="hover:text-gold-400 transition-colors">Staff Access</Link>
              <span>•</span>
              <span>All amounts in Nigerian Naira (NGN)</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
