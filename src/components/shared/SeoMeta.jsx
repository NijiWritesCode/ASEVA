import { useEffect } from 'react';

/**
 * Dynamic SEO and Open Graph metadata manager
 * Injects canonical links, descriptions, and structured JSON-LD schema
 */
export function SeoMeta({
  title = 'ASEVA — Event Architecture & Bespoke Design',
  description = 'ASEVA curates luxury weddings, corporate galas, and bespoke celebratory experiences across Nigeria and premier destination venues.',
  canonicalUrl = 'https://asevaevents.com',
  ogImage = '/favicon.svg',
  type = 'website',
}) {
  useEffect(() => {
    // 1. Update document title
    document.title = title.includes('ASEVA') ? title : `${title} | ASEVA`;

    // 2. Helper to set or create meta tags
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let element = document.querySelector(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.setAttribute('content', content);
    };

    setMetaTag('description', description);
    setMetaTag('og:title', title, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:type', type, true);
    setMetaTag('og:image', ogImage, true);

    // 3. Structured Data (JSON-LD) for Local Event Planning Business
    const schemaScriptId = 'aseva-structured-data';
    let script = document.getElementById(schemaScriptId);
    if (!script) {
      script = document.createElement('script');
      script.id = schemaScriptId;
      script.type = 'application/ld+json';
      document.head.appendChild(script);
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'EventPlanningService',
      'name': 'ASEVA Luxury Event Architecture',
      'description': description,
      'url': 'https://asevaevents.com',
      'telephone': '+2348000002738',
      'address': {
        '@type': 'PostalAddress',
        'addressLocality': 'Victoria Island',
        'addressRegion': 'Lagos',
        'addressCountry': 'NG'
      },
      'priceRange': '₦₦₦₦',
      'areaServed': ['Lagos', 'Abuja', 'Port Harcourt', 'United Kingdom', 'United Arab Emirates']
    };

    script.textContent = JSON.stringify(structuredData);
  }, [title, description, canonicalUrl, ogImage, type]);

  return null;
}
