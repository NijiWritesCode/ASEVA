-- ==============================================================================
-- ASEVA PLATFORM — MIGRATION 03: Storage Buckets & Storage Policies
-- Version: 20261124000003
-- Description: Sets up 4 storage buckets with public vs authenticated access rules
-- ==============================================================================

-- 1. Create storage buckets in the storage schema (if supported)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('public-portfolio', 'public-portfolio', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml']),
    ('event-documents', 'event-documents', false, 52428800, ARRAY['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'image/jpeg', 'image/png']),
    ('business-receipts', 'business-receipts', false, 20971520, ARRAY['application/pdf', 'image/jpeg', 'image/png']),
    ('client-attachments', 'client-attachments', false, 52428800, ARRAY['application/pdf', 'image/jpeg', 'image/png'])
ON CONFLICT (id) DO NOTHING;

-- 2. Storage Policies for `public-portfolio`
CREATE POLICY "Public can view portfolio assets"
ON storage.objects FOR SELECT
USING (bucket_id = 'public-portfolio');

CREATE POLICY "Authenticated staff can upload portfolio assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'public-portfolio');

CREATE POLICY "Authenticated staff can update/delete portfolio assets"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'public-portfolio');

-- 3. Storage Policies for `event-documents`
CREATE POLICY "Authenticated staff can view event documents"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'event-documents');

CREATE POLICY "Authenticated staff can upload event documents"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'event-documents');

-- 4. Storage Policies for `business-receipts`
CREATE POLICY "Authenticated staff can view receipts"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'business-receipts');

CREATE POLICY "Authenticated staff can upload receipts"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'business-receipts');

-- 5. Storage Policies for `client-attachments`
CREATE POLICY "Authenticated staff can view client attachments"
ON storage.objects FOR SELECT
TO authenticated
USING (bucket_id = 'client-attachments');

CREATE POLICY "Authenticated staff can upload client attachments"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client-attachments');
