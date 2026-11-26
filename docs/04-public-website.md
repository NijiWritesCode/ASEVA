# ASEVA — Public Website Architecture & Implementation

**Document Reference:** `docs/04-public-website.md`  
**Phase:** 4 — Public Website and Booking System  
**Status:** Approved for Production Deployment  
**Aesthetic Style:** Editorial Architectural Luxury  

---

## 1. Executive Summary & Page Inventory

The public website for **ASEVA** operates as the digital flagship for the brand. Built using **React (pure JSX)**, **Tailwind CSS**, and **TanStack Query**, it communicates high-touch event architecture, fiscal transparency, and logistical precision.

### Complete Page Inventory

| Route | View Component | Business Objective | Data Source |
| :--- | :--- | :--- | :--- |
| `/` | `HomePage` | First impression, brand manifesto, signature service highlights, featured case studies, client testimonials, booking callout. | Supabase `services`, `portfolio_items` |
| `/about` | `AboutPage` | Founder vision, studio philosophy, 3-step planning standard, leadership portrait, and commitment to transparency. | Static editorial copy |
| `/services` | `ServicesPage` | Filterable catalog by category (`wedding`, `corporate`, `social`, `styling`) with starting fees in NGN and scope previews. | Supabase `services` + `service_packages` |
| `/services/:slug` | `ServiceDetailPage` | Detailed scope of work, inclusions checklist, team allocation, and targeted inquiry CTA pre-populating form state. | Supabase `services` by slug |
| `/portfolio` | `PortfolioPage` | Editorial case studies filterable by event type, with location badges, attendee counts, and high-res photography. | Supabase `portfolio_items` |
| `/portfolio/:slug` | `PortfolioDetailPage`| In-depth narrative case study, design brief, spatial gallery, vendor acknowledgments, and verified host quotes. | Supabase `portfolio_items` by slug |
| `/book` | `BookingPage` | Multi-section booking qualification form capturing client details, date, budget bracket, and guest count with Zod validation. | Client submission $\rightarrow$ `enquiryService` |
| `/booking-confirmed`| `BookingConfirmedPage`| Immediate reassurance, displaying generated tracking reference code (`ASV-YYYY-XXXX`) and next steps roadmap. | Navigation route state |
| `/contact` | `ContactPage` | Direct coordinates: concierge email, WhatsApp line, studio address in Victoria Island, and studio hours. | Verified contact coordinates |
| `/faqs` | `FaqsPage` | Interactive accordion answering questions regarding retainers, vendor policies, destination travel, and rescheduling. | Categorized FAQ store |
| `*` | `NotFoundPage` | Editorial 404 error page maintaining luxury composure and guiding users to active sections. | Static fallback |

---

## 2. Dynamic Data Fetching & Fallback Resilience

All catalog pages are connected to Supabase through `src/services/publicCatalogService.js` and managed via **TanStack Query (`@tanstack/react-query`)**:

```javascript
// Example from HomePage and ServicesPage
const { data: services = [], isLoading } = useQuery({
  queryKey: ['public', 'services'],
  queryFn: () => publicCatalogService.getServices(),
});
```

### Fallback Architecture
To guarantee that the public website never crashes or renders blank screens during offline development or backend database migration cycles, `publicCatalogService` includes the approved Phase 1 seed catalog. When a database connection is unavailable or tables are empty, it gracefully delivers the approved seed services and portfolio case studies.

---

## 3. SEO, Social Graph & Structured Business Data

Search engine discoverability and social preview cards are handled dynamically across all views using the [`SeoMeta`](file:///c:/Users/HP/Desktop/ASEVA/src/components/shared/SeoMeta.jsx) component:
1. **Dynamic Document Titles:** Standardized format (e.g. `Full-Service Wedding Planning | ASEVA`).
2. **Meta Descriptions:** Tailored 150-character descriptions for high click-through rates.
3. **Open Graph & Twitter Cards:** Full support for `og:title`, `og:description`, `og:image`, and `og:type`.
4. **Structured JSON-LD Schema:** Injects schema conforming to `https://schema.org/EventPlanningService` detailing:
   * Brand Name: `ASEVA Luxury Event Architecture`
   * Telephone: `+234 800 000 2738`
   * Studio Coordinates: `Victoria Island, Lagos, Nigeria`
   * Price Range: `₦₦₦₦`
   * Operational Regions: Lagos, Abuja, Port Harcourt, United Kingdom, United Arab Emirates.

---

## 4. Mobile & Touch Ergonomics

* **Viewport Adaptability:** Fluid typography using CSS clamp scaling; all form inputs enforce `font-size: 16px` on mobile viewports to prevent unwanted iOS auto-zoom behavior.
* **Touch Targets:** Minimum 44px $\times$ 44px tap targets across navigation toggles, accordion headers, and filter pills.
* **Responsive Image Optimization:** Responsive aspect ratios (`16/10` and `16/9`) with object-cover and lazy-loading attributes (`loading="lazy"`) to optimize bandwidth across Nigerian mobile networks.
