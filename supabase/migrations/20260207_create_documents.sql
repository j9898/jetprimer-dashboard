-- Create documents table for customer document uploads
CREATE TABLE IF NOT EXISTS documents (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  customer_id BIGINT NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_path TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  mime_type TEXT NOT NULL,
  document_type TEXT NOT NULL DEFAULT 'other', -- 'passport', 'id_card', 'address_proof', 'business', 'other'
  status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'verified', 'rejected'
  admin_note TEXT,
  uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  reviewed_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes for faster lookups
CREATE INDEX IF NOT EXISTS idx_documents_customer_id ON documents(customer_id);
CREATE INDEX IF NOT EXISTS idx_documents_status ON documents(status);
CREATE INDEX IF NOT EXISTS idx_documents_document_type ON documents(document_type);

-- Enable Row Level Security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own documents
CREATE POLICY "Users can view their own documents" ON documents
  FOR SELECT
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can insert their own documents
CREATE POLICY "Users can insert their own documents" ON documents
  FOR INSERT
  WITH CHECK (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
  );

-- Policy: Users can delete their own pending documents
CREATE POLICY "Users can delete their own pending documents" ON documents
  FOR DELETE
  USING (
    customer_id IN (
      SELECT id FROM customers WHERE user_id = auth.uid()
    )
    AND status = 'pending'
  );

-- Storage bucket for customer documents
-- Run this in Supabase Dashboard > Storage or via SQL:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('customer-documents', 'customer-documents', false);

-- Storage policies (run in Supabase Dashboard SQL editor):
-- Allow authenticated users to upload to their own folder
-- CREATE POLICY "Users can upload documents" ON storage.objects
--   FOR INSERT WITH CHECK (
--     bucket_id = 'customer-documents' AND
--     auth.role() = 'authenticated'
--   );

-- Allow users to read their own documents
-- CREATE POLICY "Users can read own documents" ON storage.objects
--   FOR SELECT USING (
--     bucket_id = 'customer-documents' AND
--     auth.role() = 'authenticated'
--   );

-- Allow users to delete their own documents
-- CREATE POLICY "Users can delete own documents" ON storage.objects
--   FOR DELETE USING (
--     bucket_id = 'customer-documents' AND
--     auth.role() = 'authenticated'
--   );
