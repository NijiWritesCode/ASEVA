# ASEVA — Public Website Wireframes & Page Architecture

**Document Reference:** `docs/03-public-website-wireframes.md`  
**Phase:** 3 — UI/UX Design System and Interface Architecture  
**Status:** Approved Layout Architecture  
**Design Standard:** Editorial Luxury Flagship  

---

## 1. Global Public Layout Wireframe (`PublicLayout`)

```text
┌────────────────────────────────────────────────────────────────────────┐
│  [STICKY HEADER / BLUR BACKDROP]                                       │
│  [ASEVA LOGO]              About   Services   Portfolio   FAQs   Contact │  [INQUIRE DATE (CTA)]
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                          <OUTLET: PAGE CONTENT>                        │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│  [EDITORIAL FOOTER / OBSIDIAN-950 BACKGROUND]                          │
│  ┌──────────────────┬──────────────────┬────────────────┬───────────┐  │
│  │ Brand Ethos      │ Explore Links    │ Concierge Info │ Begin     │  │
│  │ Architectural    │ • Studio Story   │ • Email Direct │ Journey   │  │
│  │ Event Design     │ • Curated Works  │ • WhatsApp VIP │ [Reserve] │  │
│  │ Lagos / Abuja    │ • FAQs           │ • Location Map │           │  │
│  └──────────────────┴──────────────────┴────────────────┴───────────┘  │
│  © 2026 ASEVA Events Nigeria. All rights reserved. • Staff Access       │
└────────────────────────────────────────────────────────────────────────┘
```

---

## 2. Page-by-Page Architectural Wireframes

### 2.1 Home Page (`/`)
* **Objective:** Establish instant luxury credibility, communicate architectural planning rigor, showcase past event caliber, and drive qualified booking inquiries.
* **Layout Structure:**
  1. **Hero Section (Full-bleed):**
     * Eyebrow: `[Sparkles] Curated Event Architecture & Production`
     * Headline: *Elevating Life’s Defining Moments.* (Editorial serif, 72px)
     * Subtitle: Concierge planning for luxury weddings, corporate galas, and momentous celebrations.
     * Actions: Primary: `[Inquire Event Date]` (Gold button); Secondary: `[Explore Portfolio]` (Outline button).
  2. **Brand Manifesto:**
     * High-contrast quote section on subtle sand-200 backdrop articulating the philosophy of precision logistics and emotional resonance.
  3. **Signature Service Pillars (Grid):**
     * 3-column card grid: *Full-Service Weddings*, *Corporate Summits & Galas*, *Milestone Celebrations*.
     * Includes imagery, short scope teaser, and direct link to service detail.
  4. **Curated Showcase / Works Carousel:**
     * Pinned GSAP horizontal or stacked scroll showcasing selected grand events (Eko Atlantic Nuptials, Aethelgard Gala) with attendee count and venue highlights.
  5. **The ASEVA Standard (Methodology):**
     * 3-step timeline: *Spatial Conceptualization* $\rightarrow$ *Fiscal & Vendor Governance* $\rightarrow$ *Immaculate Execution*.
  6. **Verified Testimonial Spotlight:**
     * Elegant editorial quote slider with verified client names and event categories.
  7. **Consultation Reservation Banner:**
     * Full-width dark obsidian invitation with high-impact conversion callout.
* **Responsive Behavior:**
  * Desktop: Multi-column grids, large serif typography, pinned scroll triggers.
  * Tablet: 2-column cards, fluid typography.
  * Mobile: Single column, touch-swipe gallery, sticky bottom inquiry pill.
* **Animation Requirements:** GSAP staggered headline reveal, smooth parallax on imagery, subtle hover card zooms.

---

### 2.2 About Page (`/about`)
* **Objective:** Introduce the studio’s leadership, brand heritage, and meticulous standards of execution.
* **Layout Structure:**
  1. **Editorial Banner:**
     * Headline: *Crafting Experiences of Distinction.*
     * Narrative statement on why ASEVA limits its seasonal commissions.
  2. **Leadership & Creative Direction:**
     * Founder & Creative Director portrait, artistic statement, and background in structural design and hospitality.
  3. **Core Pillars & Values (Grid):**
     * *Architectural Scenography*, *Fiscal Transparency*, *Unwavering Discretion*, *Military Timing*.
  4. **The Planning Atelier:**
     * Visual walkthrough of how moodboards, 3D floorplans, and vendor contracts are formulated.
  5. **Direct Consultation Invitation:**
     * Dual action to book a studio appointment or submit a remote discovery inquiry.

---

### 2.3 Services Catalog Page (`/services`)
* **Objective:** Clearly communicate the four core service pillars, their comprehensive scopes, starting investments, and deliverables.
* **Layout Structure:**
  1. **Category Filter Tabs:**
     * `All Offerings` | `Luxury Weddings` | `Corporate Galas` | `Social Milestones` | `Decor & Scenography`.
  2. **Service Cards Grid:**
     * Large cards containing category overline, bold serif title, descriptive brief, starting investment indicator in NGN, checklist of core inclusions, and dual CTA (`[View Full Scope]` / `[Inquire This Service]`).
  3. **Custom Bespoke Commission Callout:**
     * Reassuring note for clients requiring unique hybrid services or international destination coordination.

---

### 2.4 Service Detail Page (`/services/:slug`)
* **Objective:** In-depth breakdown of a single service offering, addressing all deliverables, timeline expectations, and direct booking conversion.
* **Layout Structure:**
  1. **Breadcrumb Trail:** `Home / Services / Full-Service Wedding Planning`
  2. **Hero Overview:** Service title, target client profile, and lead time recommendations (e.g., "Recommended booking: 6–12 months prior").
  3. **Detailed Scope of Work:**
     * Tabbed or accordion list of what is included: *Pre-Planning & Budgeting*, *Vendor Procurement*, *Design & Spatial Styling*, *Day-of Production Leadership*.
  4. **Investment & Milestone Structure:**
     * Clear explanation of starting fees, retainer policy (30/40/30), and transparent expense management.
  5. **Related Case Studies:**
     * 2 past events executed under this exact service offering.
  6. **Targeted Inquiry CTA:**
     * Pre-populates the booking enquiry form with this specific service selected.

---

### 2.5 Portfolio Showcase Page (`/portfolio`)
* **Objective:** High-resolution visual proof of past production mastery, filterable by event category.
* **Layout Structure:**
  1. **Category Filter Tabs:** `All Works` | `Weddings` | `Galas & Corporate` | `Private Dinners` | `Styling`.
  2. **Masonry / Editorial Image Grid:**
     * Image cards with subtle gold hover borders, location badges, guest count indicators, and narrative titles.
  3. **Quick View / Deep Dive:**
     * Clicking opens either the comprehensive case study (`/portfolio/:slug`) or an accessible high-res lightbox gallery.
* **Responsive Behavior:** 3 columns on desktop, 2 on tablet, single column on mobile with lazy loading.

---

### 2.6 Portfolio Case Study Detail (`/portfolio/:slug`)
* **Objective:** In-depth storytelling of a specific commission, showing problem-solving, design concepts, and vendor collaboration.
* **Layout Structure:**
  1. **Project Hero:** Full-width hero photography, event title, client anonymized moniker, location, date, guest count.
  2. **The Commission Brief:** What the client envisioned and the logistical challenges solved by ASEVA.
  3. **Spatial & Floral Gallery:** Multi-image editorial gallery showcasing entrance arches, tablescapes, lighting schematics, and crowd atmosphere.
  4. **Vendor Credits:** Polite acknowledgment of participating masters (florists, caterers, lighting technicians, venue).
  5. **Verified Client Testimonial:** Quote from the host or corporate director.

---

### 2.7 Booking Enquiry Page (`/book`)
* **Objective:** Frictionless, structured lead qualification capturing all parameters needed to assess calendar feasibility and draft a proposal.
* **Layout Structure:**
  1. **Reassurance Header:** Clear explanation of the consultation process and response timeline (24–48 hours).
  2. **Progressive Form Container:**
     * *Part 1: Contact Coordinates* (Name, Email, WhatsApp Phone).
     * *Part 2: Event Specifics* (Type, Preferred Date, Alternate Date, City/Region, Secured Venue).
     * *Part 3: Capacity & Investment* (Guest count bracket, NGN budget bracket, required service package).
     * *Part 4: Vision & Specifics* (Thematic ideas, cultural requirements, referral source).
     * Anti-bot honeypot and client-side Zod validation.
  3. **Notice Banner:** Clear advisory that submitting an inquiry is an initial consultation request, not a confirmed booking.
  4. **Submission Button:** Gold high-emphasis button with loading spinner state.

---

### 2.8 Booking Confirmation Page (`/booking-confirmed`)
* **Objective:** Deliver immediate reassurance, issue an enquiry tracking reference code, and outline the next steps.
* **Layout Structure:**
  1. **Confirmation Icon & Monogram:** Gold architectural seal.
  2. **Reference Card:** Displaying unique generated code (e.g., `ASV-2027-4821`).
  3. **What to Expect Next (Timeline):**
     * *Step 1: Calendar Feasibility Review (Within 24 Hours)*
     * *Step 2: Private Discovery Consultation Call*
     * *Step 3: Bespoke Proposal & Quotation Formulation*
  4. **Emergency Concierge Link:** Direct link to phone/WhatsApp for urgent dates (< 60 days away).

---

### 2.9 Contact Page (`/contact`)
* **Objective:** Provide direct communication coordinates for corporate RFPs, press inquiries, and physical consultation appointments.
* **Layout Structure:**
  1. **Direct Communication Cards:** Concierge email, telephone/WhatsApp line, studio address in Victoria Island, studio hours.
  2. **Map & Directions Card:** Location overview.
  3. **Booking Referral Callout:** Directs event inquiries to the structured form.

---

### 2.10 FAQs Page (`/faqs`)
* **Objective:** Address common client inquiries regarding retainers, vendor policies, date changes, and destination logistics.
* **Layout Structure:**
  1. **Categorized Accordion Items:**
     * *Booking & Retainers* (Deposit policies, contract terms).
     * *Vendor Coordination* (Can clients use their own vendors?).
     * *Destination Logistics* (Travel protocols within Nigeria and abroad).
     * *Postponements & Contingencies* (Inclement weather, date rescheduling).

---

### 2.11 404 Not Found Page (`*`)
* **Objective:** Maintain brand poise and guide lost visitors back to portfolio or booking.
* **Layout Structure:**
  1. **Clean Editorial Error:** Large serif "404", thoughtful apology, and direct navigational links to Home, Services, and Portfolio.
