# ASEVA — Component Inventory & Interface Architecture

**Document Reference:** `docs/03-component-inventory.md`  
**Phase:** 3 — UI/UX Design System and Interface Architecture  
**Status:** Approved Component Registry  

---

## 1. Global Component Hierarchy

Components are categorized into three distinct layers to ensure modularity and maintainability:

```text
src/components/
├── shared/         # Universal atomic & molecular UI primitives (zero domain knowledge)
│   ├── Badge.jsx
│   ├── Breadcrumbs.jsx
│   ├── Button.jsx
│   ├── Card.jsx
│   ├── ConfirmDialog.jsx
│   ├── DatePicker.jsx
│   ├── Drawer.jsx
│   ├── EmptyState.jsx
│   ├── Input.jsx
│   ├── LoadingSkeleton.jsx
│   ├── LoadingSpinner.jsx
│   ├── Modal.jsx
│   ├── Select.jsx
│   ├── Table.jsx
│   └── Toast.jsx
│
├── public/         # Marketing-specific composition components
│   ├── CaseStudyCard.jsx
│   ├── FaqAccordion.jsx
│   ├── HeroBanner.jsx
│   ├── PortfolioGrid.jsx
│   ├── ProcessTimeline.jsx
│   ├── ServiceCard.jsx
│   └── TestimonialSlider.jsx
│
└── dashboard/      # Operational management components
    ├── ActivityStream.jsx
    ├── CalendarView.jsx
    ├── EnquiryDetailDrawer.jsx
    ├── EventFinancialWidget.jsx
    ├── ExpenseModal.jsx
    ├── KpiCard.jsx
    ├── PaymentRecordModal.jsx
    ├── StatusSelect.jsx
    ├── TaskChecklist.jsx
    └── VendorSelect.jsx
```

---

## 2. Shared Atomic Component Registry

### 2.1 `Button`
* **Props:** `variant` (`'primary'`, `'gold'`, `'secondary'`, `'outline'`, `'ghost'`, `'danger'`), `size` (`'sm'`, `'md'`, `'lg'`), `type`, `disabled`, `loading`, `icon` (Lucide component), `children`, `onClick`, `className`.
* **States:** Default, Hover, Active, Focus-visible, Loading (spinner replaces icon or prepends text), Disabled.
* **A11y:** Focus rings using `focus:ring-2 focus:ring-gold-400 focus:ring-offset-2`, `aria-busy` during loading.

### 2.2 `Badge`
* **Props:** `status` (string matching database enums), `label` (optional override), `size` (`'sm'`, `'md'`), `className`.
* **Variants:** `new`, `under_review`, `quotation_sent`, `accepted`, `declined`, `converted`, `confirmed`, `fully_paid`, `partially_paid`, `unpaid`, `planning`, `completed`, `critical`, `high`, `medium`, `low`.
* **Semantics:** Accessible badge with high-contrast text and border contrast conforming to WCAG AA.

### 2.3 `Card` & `CardHeader`
* **Props:** `children`, `className`, `hover` (boolean), `padding` (`'none'`, `'sm'`, `'md'`, `'lg'`).
* **Header Props:** `title`, `subtitle`, `action` (ReactNode), `badge` (ReactNode).
* **Styles:** Subtle 1px `border-sand-300`, background `white`, elevation `shadow-sm`.

### 2.4 `Input`, `Textarea`, `Select`
* **Props:** `label`, `error` (string or field error), `helperText`, `icon` (Lucide icon), `required`, standard HTML input attributes.
* **Validation State:** Displays error message in `text-rose-600 text-xs mt-1`, inputs bordered in `border-rose-400`.
* **Accessibility:** Automatic linking between `label htmlFor` and `input id`, with `aria-invalid` and `aria-describedby` when errors exist.

### 2.5 `Modal`
* **Props:** `isOpen`, `onClose`, `title`, `children`, `maxWidth` (`'max-w-md'`, `'max-w-lg'`, `'max-w-2xl'`), `footer` (ReactNode).
* **Interaction:** Traps focus inside modal; closes on `Escape` key and backdrop click; locks body scroll.

### 2.6 `Drawer` (Slide-Over Sheet)
* **Props:** `isOpen`, `onClose`, `title`, `subtitle`, `children`, `footer` (ReactNode), `width` (`'max-w-md'`, `'max-w-lg'`, `'max-w-xl'`).
* **Interaction:** Animated slide-in from right margin using CSS/Motion transform; backdrop scrim with subtle blur.

### 2.7 `ConfirmDialog`
* **Props:** `isOpen`, `onClose`, `onConfirm`, `title`, `description`, `confirmText`, `cancelText`, `isDestructive` (boolean), `loading` (boolean).
* **Usage:** Prevents accidental deletion, enquiry declines, or payment cancellations.

### 2.8 `EmptyState`
* **Props:** `icon` (Lucide component), `title`, `description`, `action` (`{ label, onClick, icon }`).
* **Styles:** Centered container, muted colors, clear call-to-action to initialize data.

### 2.9 `LoadingSkeleton`
* **Props:** `variant` (`'card'`, `'table-row'`, `'text'`, `'stat'`), `count` (number).
* **Geometry:** Uses `bg-sand-200 animate-pulse` matched to layout grids to eliminate layout jumps.

### 2.10 `Breadcrumbs`
* **Props:** `items` (Array of `{ label, href }`).
* **Usage:** Top of dashboard views providing context (e.g., `Dashboard / Events / The Luminary Glasshouse / Finances`).

---

## 3. Dashboard Domain Component Registry

### 3.1 `KpiCard`
* **Props:** `title`, `value` (formatted string), `subtitle`, `icon` (Lucide icon), `trend` (`{ direction: 'up' | 'down', label: string }`), `variant` (`'default'`, `'gold'`, `'emerald'`, `'amber'`).
* **Purpose:** Executive stats on dashboard overview.

### 3.2 `EventFinancialWidget`
* **Props:** `agreedPriceKobo`, `totalPaidKobo`, `balanceDueKobo`, `totalExpensesKobo`, `grossMarginKobo`.
* **Purpose:** Visual financial health bar showing agreed fee, progress bar of collected cash vs. outstanding balance, and real-time gross margin percentage.

### 3.3 `EnquiryDetailDrawer`
* **Props:** `inquiry` (object), `isOpen`, `onClose`, `onStatusChange`, `onConvert`.
* **Purpose:** Side-sheet displaying all fields from public submission, internal notes log, and action triggers.

### 3.4 `PaymentRecordModal`
* **Props:** `isOpen`, `onClose`, `eventId`, `events` (list), `onSuccess`.
* **Purpose:** Modal containing form for logging manual bank transfers or cash with integer kobo conversion and receipt attachment.

---

## 4. Public Marketing Component Registry

### 4.1 `HeroBanner`
* **Props:** `headline`, `subheadline`, `primaryAction`, `secondaryAction`.
* **Motion:** Integrated with GSAP text reveals and entrance transitions.

### 4.2 `ServiceCard`
* **Props:** `service` (`title`, `slug`, `category`, `description`, `startingPriceKobo`, `imageUrl`).
* **Purpose:** Cards rendered on services catalog page with hover interactions.

### 4.3 `CaseStudyCard`
* **Props:** `item` (`title`, `slug`, `eventType`, `location`, `guestCount`, `coverImageUrl`).
* **Purpose:** Curated portfolio cards on homepage and portfolio gallery.

### 4.4 `FaqAccordion`
* **Props:** `items` (Array of `{ question, answer }`).
* **Purpose:** Expandable/collapsible FAQ cards with smooth height transition.
