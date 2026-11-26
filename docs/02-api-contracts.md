# ASEVA — API Contracts & Integration Specifications

**Document Reference:** `docs/02-api-contracts.md`  
**Phase:** 2 — System Architecture, Database Design and Project Foundation  
**Status:** Approved Architectural Contract  
**Protocol:** REST (PostgREST via Supabase JS Client) + Edge Functions (HTTPS JSON)  

---

## 1. Public API Contracts (Marketing Website)

### 1.1 `GET /services` (Public Active Services)
Retrieves the published catalog of event design and planning services.
* **Access:** Unauthenticated (Anon Key)
* **Query Parameters:** `is_active=eq.true&order=display_order.asc`
* **Response Payload (200 OK):**
```json
[
  {
    "id": "c1f7a28e-89db-410a-b31c-6d9b233a7e01",
    "title": "Full-Service Wedding Planning & Design",
    "slug": "full-service-wedding-planning",
    "category": "wedding",
    "short_description": "Comprehensive creative direction, vendor curation, spatial design, and day-of orchestration.",
    "starting_price_kobo": 350000000,
    "image_url": "https://.../wedding-hero.webp",
    "is_featured": true,
    "display_order": 1,
    "service_packages": [
      {
        "id": "e9b21034-7f2a-4a6c-9c71-2b0e8971f110",
        "name": "Signature Curated Experience",
        "price_kobo": 350000000,
        "inclusions": [
          "Bespoke spatial design & 3D floorplans",
          "Comprehensive vendor procurement & contract review",
          "Unlimited planning consultations",
          "Full day-of production lead & coordination team"
        ],
        "is_popular": true
      }
    ]
  }
]
```

---

### 1.2 `GET /portfolio_items` (Public Portfolio Showcase)
Retrieves published event photo essays and case studies.
* **Access:** Unauthenticated (Anon Key)
* **Query Parameters:** `is_published=eq.true&order=created_at.desc`
* **Response Payload (200 OK):**
```json
[
  {
    "id": "90d1f4ba-e9b2-4cd8-89c7-54c379a29e41",
    "title": "The Glasshouse Gala — Private Estate Celebration",
    "slug": "the-glasshouse-gala",
    "event_type": "Social Gala",
    "location": "Banana Island, Lagos",
    "guest_count": 250,
    "cover_image_url": "https://.../glasshouse-cover.webp",
    "gallery_images": [
      "https://.../img-1.webp",
      "https://.../img-2.webp"
    ],
    "narrative": "A transcendent evening of architectural floral installations, bespoke chandeliers, and multi-course dining...",
    "testimonial": "ASEVA executed our celebration with poise and perfection beyond our imagination.",
    "testimonial_author": "Chief & Mrs. A."
  }
]
```

---

### 1.3 `POST /functions/v1/submit-inquiry` (Public Booking Submission)
Edge Function handling inbound booking inquiries with rate-limiting and validation.
* **Access:** Unauthenticated (Anon Key + Honeypot Check)
* **Request Payload:**
```json
{
  "fullName": "Amina Bello",
  "email": "amina.bello@example.com",
  "phone": "+2348031234567",
  "eventType": "wedding",
  "preferredDate": "2027-04-18",
  "alternateDate": "2027-05-02",
  "location": "Lagos Island",
  "venueName": "The Monarch Event Centre",
  "guestCount": "251-500",
  "estimatedBudget": "₦25,000,000 - ₦50,000,000",
  "serviceId": "c1f7a28e-89db-410a-b31c-6d9b233a7e01",
  "visionNotes": "Looking for modern minimalist styling with warm champagne accents and lush hanging florals.",
  "referralSource": "Instagram",
  "_hp": "" // Honeypot field - must be empty
}
```
* **Success Response (201 Created):**
```json
{
  "success": true,
  "referenceCode": "ASV-2026-8924",
  "message": "Your booking enquiry has been received. Our concierge will contact you within 24 hours."
}
```
* **Validation Error Response (422 Unprocessable Entity):**
```json
{
  "error": "Validation Failed",
  "details": [
    {
      "field": "phone",
      "message": "Please provide a valid Nigerian or international phone number."
    }
  ]
}
```

---

## 2. Private Dashboard API Contracts (Authenticated Staff)

### 2.1 `POST /rpc/convert_inquiry_to_booking`
Atomic stored procedure that converts an approved enquiry into a client and a confirmed event workspace.
* **Access:** Authenticated (`role = 'owner'` OR `role = 'manager'`)
* **Request Payload:**
```json
{
  "p_inquiry_id": "8f9e1234-a4b5-4c6d-8e9f-0123456789ab",
  "p_agreed_price_kobo": 350000000,
  "p_lead_planner_id": "4d5e6f7a-8b9c-0d1e-2f3a-4b5c6d7e8f9a",
  "p_schedules": [
    {
      "milestone_name": "Commitment Retainer (30%)",
      "amount_kobo": 105000000,
      "due_date": "2026-12-05"
    },
    {
      "milestone_name": "Mid-Term Production Milestone (40%)",
      "amount_kobo": 140000000,
      "due_date": "2027-02-15"
    },
    {
      "milestone_name": "Final Balance Settlement (30%)",
      "amount_kobo": 105000000,
      "due_date": "2027-04-04"
    }
  ]
}
```
* **Response Payload (200 OK):**
```json
{
  "success": true,
  "client_id": "b1c2d3e4-f5a6-7b8c-9d0e-1f2a3b4c5d6e",
  "event_id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d"
}
```

---

### 2.2 `POST /payments` (Record Manual Payment)
Records a manual payment received via bank transfer, cash, or POS.
* **Access:** Authenticated (`role = 'owner'` OR `role = 'manager'`)
* **Request Payload:**
```json
{
  "event_id": "a9b8c7d6-e5f4-3a2b-1c0d-9e8f7a6b5c4d",
  "schedule_id": "7b8c9d0e-1f2a-3b4c-5d6e-7f8a9b0c1d2e",
  "amount_kobo": 105000000,
  "payment_method": "bank_transfer",
  "transaction_reference": "ZEN-TXN-20261124-9843",
  "payment_date": "2026-11-24T14:30:00Z",
  "receipt_url": "https://.../receipts/zen-9843.pdf",
  "notes": "Verified receipt of 30% retainer in Zenith Bank account."
}
```
* **Response Payload (201 Created):**
```json
{
  "id": "e4f5a6b7-c8d9-0e1f-2a3b-4c5d6e7f8a9b",
  "amount_kobo": 105000000,
  "status": "confirmed",
  "transaction_reference": "ZEN-TXN-20261124-9843"
}
```

---

### 2.3 `GET /rpc/get_dashboard_metrics`
Returns aggregate operational and financial key performance indicators for executive reporting.
* **Access:** Authenticated (`role = 'owner'` OR `role = 'manager'`)
* **Response Payload (200 OK):**
```json
{
  "active_events_count": 8,
  "pending_inquiries_count": 4,
  "total_revenue_agreed_kobo": 4500000000,
  "total_cash_collected_kobo": 2850000000,
  "total_outstanding_kobo": 1650000000,
  "total_expenses_disbursed_kobo": 1820000000,
  "realized_cash_margin_kobo": 1030000000,
  "overdue_tasks_count": 3,
  "upcoming_deadlines_count": 7
}
```
