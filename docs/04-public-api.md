# ASEVA — Public API & Edge Ingestion Reference

**Document Reference:** `docs/04-public-api.md`  
**Phase:** 4 — Public Website and Booking System  
**Status:** Approved Public API Specification  
**Protocol:** HTTPS REST (PostgREST API via Supabase Client & Deno Edge Function)  

---

## 1. Endpoints Overview

| Method | Endpoint | Description | Auth Requirement |
| :--- | :--- | :--- | :--- |
| `GET` | `/rest/v1/services` | Retrieve published active event services and package tiers | Public (Anon Key) |
| `GET` | `/rest/v1/portfolio_items` | Retrieve published event case studies and photography | Public (Anon Key) |
| `POST` | `/functions/v1/submit-inquiry` | Ingest qualified customer booking inquiry | Public (Honeypot Checked) |

---

## 2. Endpoint Details

### 2.1 `GET /rest/v1/services`
Retrieves all services where `is_active = true`, ordered by `display_order`.
* **Headers:**
  ```http
  apikey: <SUPABASE_ANON_KEY>
  Authorization: Bearer <SUPABASE_ANON_KEY>
  ```
* **Query Parameters:**
  ```http
  ?select=*,service_packages(*)&is_active=eq.true&order=display_order.asc
  ```
* **Response (200 OK):**
  ```json
  [
    {
      "id": "10000000-0000-0000-0000-000000000001",
      "title": "Full-Service Wedding Planning & Design",
      "slug": "full-service-wedding-planning",
      "category": "wedding",
      "short_description": "End-to-end creative direction, vendor curation, architectural styling, and day-of execution for luxury nuptials.",
      "starting_price_kobo": 350000000,
      "image_url": "https://.../wedding-hero.webp",
      "is_featured": true,
      "display_order": 1,
      "service_packages": [
        {
          "id": "20000000-0000-0000-0000-000000000001",
          "name": "The Sovereign Bespoke Experience",
          "price_kobo": 350000000,
          "inclusions": [
            "Dedicated lead wedding planner and 4 associate coordinators",
            "Custom 3D spatial floorplans and lighting design schematics"
          ],
          "is_popular": true
        }
      ]
    }
  ]
  ```

---

### 2.2 `GET /rest/v1/portfolio_items`
Retrieves published portfolio items.
* **Query Parameters:**
  ```http
  ?select=*&is_published=eq.true&order=created_at.desc
  ```
* **Response (200 OK):**
  ```json
  [
    {
      "id": "30000000-0000-0000-0000-000000000001",
      "title": "The Luminary Glasshouse Nuptials",
      "slug": "the-luminary-glasshouse-nuptials",
      "event_type": "Luxury Wedding",
      "location": "Eko Atlantic, Lagos",
      "guest_count": 450,
      "cover_image_url": "https://.../nuptials.webp",
      "gallery_images": [
        "https://.../gallery-1.webp",
        "https://.../gallery-2.webp"
      ],
      "narrative": "Set within a custom-erected glass pavilion overlooking the Atlantic shoreline...",
      "testimonial": "ASEVA gave us the wedding of our dreams.",
      "testimonial_author": "Zainab & Femi Balogun",
      "is_featured": true
    }
  ]
  ```

---

### 2.3 `POST /functions/v1/submit-inquiry`
Handles public lead qualification submission.
* **Headers:**
  ```http
  Content-Type: application/json
  apikey: <SUPABASE_ANON_KEY>
  ```
* **Request Body:**
  ```json
  {
    "fullName": "Folashade Adeleke",
    "email": "folashade.a@example.com",
    "phone": "+2348035551234",
    "eventType": "wedding",
    "preferredDate": "2027-04-18",
    "alternateDate": "2027-05-02",
    "location": "Victoria Island, Lagos",
    "venueName": "The Monarch Event Centre",
    "guestCount": "251-500",
    "estimatedBudget": "₦25,000,000 - ₦50,000,000",
    "serviceId": "10000000-0000-0000-0000-000000000001",
    "visionNotes": "Classic luxury styling with ivory florals and warm champagne ambient illumination.",
    "referralSource": "Instagram",
    "_hp": ""
  }
  ```
* **Success Response (201 Created):**
  ```json
  {
    "success": true,
    "referenceCode": "ASV-2027-4821",
    "message": "Your booking enquiry has been received into our priority queue."
  }
  ```
* **Validation Error (422 Unprocessable Entity):**
  ```json
  {
    "error": "Missing mandatory fields"
  }
  ```
* **Anti-Abuse Error (400 Bad Request):**
  ```json
  {
    "error": "Bot submission rejected"
  }
  ```
