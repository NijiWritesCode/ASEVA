# ASEVA — Design System Specification

**Document Reference:** `docs/03-design-system.md`  
**Phase:** 3 — UI/UX Design System and Interface Architecture  
**Status:** Approved Design Baseline  
**Aesthetic Direction:** Editorial Architectural Luxury & Modern High-Performance Workspace  

---

## 1. Design Ethos & Philosophy

ASEVA's brand identity bridges two worlds:
1. **The Public Digital Flagship:** High-fashion editorial poise, deliberate whitespace, cinematic imagery, serif display typography, and restrained motion. It avoids generic SaaS aesthetics or cluttered multi-colored badges, instead exuding the quiet confidence of a high-end atelier or private architectural salon.
2. **The Operational Management Dashboard:** An ergonomic, information-dense operational workspace. It retains the brand's sophisticated obsidian and champagne gold DNA while maximizing data readability, providing clean tabular data grids, clear hierarchy, and frictionless workflows for rapid event coordination.

Both interfaces feel fundamentally cut from the same cloth—sharing color tokens, border radius treatments, elevation shadows, and typographic discipline.

---

## 2. Color Token Architecture

The color system is organized into foundational semantic tokens configured via Tailwind CSS variables and extended classes:

### 2.1 Primary & Neutral Tones
* **Obsidian (Deep Charcoal / Black):**
  * `obsidian-950` (`#0B0C0E`): Deepest background for public hero footers, dark accents, and primary headings.
  * `obsidian-900` (`#121316`): Primary surface for dark navigation bars, modals, and high-emphasis elements.
  * `obsidian-800` (`#1B1D22`): Dark borders, dividers, and secondary dark cards.
  * `obsidian-700` (`#262930`): Subdued text on dark surfaces, secondary icons.
  * `obsidian-600` (`#383C46`): Muted labels, secondary descriptions on light backgrounds.
* **Sand & Alabaster (Warm Neutrals):**
  * `sand-50` (`#FDFCFB`): Pure light background for inputs and cards.
  * `sand-100` (`#FAF8F5`): Default page canvas background (warm off-white, prevents eye fatigue).
  * `sand-200` (`#F4F0E8`): Card surfaces, secondary button backgrounds, subtle hover fills.
  * `sand-300` (`#E8E2D5`): Structural border lines, table dividers, card contours.
  * `sand-400` (`#D5CCBC`): Heavy borders, disabled state fills.
  * `sand-500` (`#B8ACA0`): Subtle placeholder text and inactive icons.

### 2.2 Accent & Brand Metallics
* **Warm Champagne Gold:**
  * `gold-50` (`#FBF8F0`): Warm subtle tint for highlighted banners.
  * `gold-100` (`#F5EED9`): Pill badges and soft gold callouts.
  * `gold-400` (`#D4AF37`): Primary brand gold for active accents, key highlights, and icons.
  * `gold-500` (`#C5A059`): Primary gold button fills and text emphasis.
  * `gold-600` (`#A8833E`): Deep metallic gold for link hovers and strong badges.
  * `gold-800` (`#664B24`): High-contrast gold text on light backgrounds.

### 2.3 Semantic Status Colors (Tuned for Luxury Interfaces)
To prevent harsh neon accents from degrading the luxury aesthetic, status colors are calibrated with soft backgrounds and deep, readable text tones:
* **Success / Confirmed (`emerald`):**
  * Surface: `#ECFDF5` (`bg-emerald-50`)
  * Border: `#A7F3D0` (`border-emerald-200`)
  * Text: `#065F46` (`text-emerald-800`)
* **Pending / In Review (`amber`):**
  * Surface: `#FFFBEB` (`bg-amber-50`)
  * Border: `#FDE68A` (`border-amber-200`)
  * Text: `#92400E` (`text-amber-800`)
* **Urgent / Critical / Overdue (`rose`):**
  * Surface: `#FFF1F2` (`bg-rose-50`)
  * Border: `#FECDD3` (`border-rose-200`)
  * Text: `#9F1239` (`text-rose-800`)
* **Informational / Quotation Sent (`purple`/`blue`):**
  * Surface: `#F5F3FF` (`bg-purple-50`)
  * Border: `#DDD6FE` (`border-purple-200`)
  * Text: `#5B21B6` (`text-purple-800`)

---

## 3. Typography Scale & Font Hierarchy

### 3.1 Font Families
1. **Display & Editorial Serif:** `Cinzel` & `Playfair Display`
   * Used for brand titles, hero headlines, section headers, case study titles, and modal titles.
   * Evokes classical architectural balance, fine tailoring, and editorial distinction.
2. **Body & Interface Sans:** `Plus Jakarta Sans`
   * Used for body copy, form labels, data table cells, buttons, and navigation links.
   * Highly legible at micro-sizes (10px–12px) and renders with exceptional clarity on high-DPI displays.
3. **Tabular Figures & Currency:** `Plus Jakarta Sans` with `font-feature-settings: "tnum"`
   * Used for all integer kobo financial records, invoice balances, dates, and reference codes. Ensures aligned vertical columns without wobbling decimal points.

### 3.2 Typographic Hierarchy Scale

| Token | Class | Size / Line-Height | Weight | Tracking | Primary Usage |
| :--- | :--- | :--- | :---: | :---: | :--- |
| **Display 1** | `font-serif text-5xl sm:text-7xl` | 48px – 72px / 1.1 | Bold (700) | `-0.02em` | Homepage Hero Title |
| **Display 2** | `font-serif text-3xl sm:text-5xl` | 32px – 48px / 1.15 | Bold (700) | `-0.015em` | Page Titles (About, Services, Portfolio) |
| **Section H1**| `font-serif text-2xl sm:text-3xl` | 24px – 30px / 1.25 | SemiBold (600) | `-0.01em` | Major Section Heads, Dashboard Page Titles |
| **Card H2**   | `font-serif text-lg sm:text-xl` | 18px – 20px / 1.35 | SemiBold (600) | Normal | Card Headers, Modal Titles, Table Groupings |
| **Overline**  | `text-[11px] uppercase` | 11px / 1.4 | SemiBold (600) | `0.15em` | Category Tag, Eyebrow Heading, Status Label |
| **Body Large**| `text-base` | 16px / 1.6 | Regular / Light | Normal | Hero Subtitles, Service Scope Introductions |
| **Body Normal**| `text-sm` | 14px / 1.5 | Regular (400) | Normal | Primary Content, Form Text, Descriptions |
| **Body Small**| `text-xs` | 12px / 1.4 | Regular / Medium | `0.01em` | Table Content, Input Labels, Metadata |
| **Micro / Footnote**| `text-[10px]` | 10px / 1.3 | Medium (500) | `0.05em` | Badges, Currency Subtext, Audit Timestamps |

---

## 4. Spacing, Borders, and Elevation

### 4.1 Spatial Grid
Based on an 8pt modular rhythm (with 4px half-steps for compact interface elements):
* `space-1` (4px): Micro gaps between icons and adjacent text.
* `space-2` (8px): Gaps in badge containers, pill elements, and tight table padding.
* `space-3` (12px): Standard form field vertical gaps, dropdown padding.
* `space-4` (16px): Card internal padding (mobile), standard toolbar gaps.
* `space-6` (24px): Desktop card padding, grid gaps between data cards.
* `space-8` (32px): Dashboard section spacing, between major table modules.
* `space-12` to `space-24` (48px–96px): Marketing landing page section rhythm.

### 4.2 Border-Radius Philosophy
To reflect architectural precision and haute horlogerie, ASEVA avoids cartoonish, bulbous rounded corners:
* Buttons, inputs, cards, and modals use **`rounded-sm` (2px) to `rounded` (4px)**.
* Status pills and avatar containers use **`rounded-full`** for distinct visual contrast.

### 4.3 Elevation & Shadows
* **`shadow-sm`**: Subtle ambient lift for cards on sand backgrounds (`box-shadow: 0 1px 2px 0 rgba(11, 12, 14, 0.05)`).
* **`shadow-md`**: Hover state for interactive cards and service tiers.
* **`shadow-2xl`**: Deep backdrop shadow for modals, slide-out drawers, and floating menus.

---

## 5. UI Component Design Specifications

### 5.1 Buttons (`Button`)
* **Primary (Obsidian):** Solid dark background (`bg-obsidian-950`), warm sand text (`text-sand-50`), subtle gold focus ring. High authority.
* **Gold (Signature):** Rich champagne metallic fill (`bg-gold-500`), obsidian text (`text-obsidian-950`). Used for primary conversion actions ("Reserve Date", "Confirm Payment").
* **Secondary:** Soft sand fill (`bg-sand-200`), dark text. For neutral secondary actions.
* **Outline:** Architectural 1px obsidian or sand border, transparent background, subtle hover invert.
* **Ghost:** Zero border, hover fill `bg-sand-200/60`. For inline table actions, close buttons, and pagination controls.
* **Danger:** Muted rose crimson (`bg-rose-700`), white text. For destructive actions (Delete, Decline).

### 5.2 Inputs & Form Controls
* **Background:** Subtle warm sand tint (`bg-sand-50/80`), transitioning to crisp white on focus.
* **Borders:** 1px `border-sand-300`, elevating to `border-gold-500` with subtle `ring-1 ring-gold-400` on active focus.
* **Validation State:** Red border (`border-rose-400`), accompanying micro-icon, and assistive error text below.
* **Labels:** Uppercase, tracking-widest, `text-xs font-medium text-obsidian-700`.

### 5.3 Data Tables
* **Header:** Subtle sand fill (`bg-sand-100`), uppercase tracking-wider labels, border-b `border-sand-300`.
* **Row Hover:** Smooth transition to `hover:bg-sand-50/90`.
* **Numeric Columns:** Right-aligned, monospace or tabular figure fonts for kobo currency sums.
* **Action Menu:** Right-aligned, compact icon buttons or subtle dropdown triggers.

### 5.4 Slide-Over Drawers & Modals
* **Backdrop:** Semi-transparent obsidian scrim (`bg-obsidian-950/60`) with `backdrop-blur-sm`.
* **Drawer Behavior:** Slides in from the right edge with spring physics for editing enquiry details, recording manual payments, or viewing client histories without losing table context.

### 5.5 Empty & Loading States
* **Empty State:** Centered container, muted monochrome or gold line icon, serif headline, concise explanatory text, and a primary action button.
* **Skeleton Loaders:** Soft pulsing sand shapes (`bg-sand-200 animate-pulse`) mirroring exact card and row geometries to prevent Cumulative Layout Shift (CLS).

---

## 6. Motion Design System

### 6.1 Principles of Motion
1. **Purposeful & Restrained:** Animations communicate spatial relationships, state changes, or hierarchy—never decorative clutter.
2. **Material Weight:** Elements feel tactile and substantial, utilizing ease-out curves that settle with precision.
3. **Accessibility First:** All animations strictly observe `@media (prefers-reduced-motion: reduce)`.

### 6.2 Motion for React (Micro-Interactions & Modals)
* **Modal / Dialog:** Fade-in backdrop (`opacity: 0` $\rightarrow$ `1`), scale & translate dialog (`scale: 0.98, y: 10` $\rightarrow$ `scale: 1, y: 0`) over 200ms.
* **Drawer / Slide-over:** Smooth x-axis slide (`x: "100%"` $\rightarrow$ `x: 0`) with subtle cubic bezier (`[0.16, 1, 0.3, 1]`).
* **Dropdown & Popover:** Quick 150ms opacity and height reveal.

### 6.3 GSAP & ScrollTrigger (Public Editorial Storytelling)
* **Hero Entrance:** Staggered reveal of serif headline, sub-headline, and action buttons on initial page mount.
* **Pinned Section / Showcase:** High-resolution event imagery panning gracefully on desktop scroll.
* **Parallax Accents:** Subtle vertical translation on floral and architectural photography.
* **Cleanup Mandate:** All GSAP ScrollTrigger instances must be killed and scoped within `gsap.context()` inside `useEffect()` returns to prevent memory leaks and broken layouts during route transitions.
