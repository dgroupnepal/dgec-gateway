
CREATE TABLE public.document_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name TEXT,
  phone TEXT,
  email TEXT,
  passport_number TEXT,
  message TEXT,
  file_key TEXT NOT NULL,
  original_file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_document_submissions_created_at ON public.document_submissions(created_at DESC);
CREATE INDEX idx_document_submissions_status ON public.document_submissions(status);
CREATE INDEX idx_document_submissions_email ON public.document_submissions(email);
CREATE INDEX idx_document_submissions_passport_number ON public.document_submissions(passport_number);

ALTER TABLE public.document_submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public insert on document_submissions"
ON public.document_submissions
FOR INSERT
TO anon, authenticated
WITH CHECK (true);

CREATE POLICY "Allow authenticated read on document_submissions"
ON public.document_submissions
FOR SELECT
TO authenticated
USING (true);
