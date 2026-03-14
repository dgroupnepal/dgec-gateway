CREATE TABLE IF NOT EXISTS document_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT,
  phone TEXT,
  email TEXT,
  passport_number TEXT,
  message TEXT,
  file_key TEXT NOT NULL,
  original_file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  status TEXT NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'reviewing', 'approved', 'rejected', 'completed')),
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_document_submissions_created_at ON document_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_document_submissions_status ON document_submissions(status);
CREATE INDEX IF NOT EXISTS idx_document_submissions_email ON document_submissions(email);
CREATE INDEX IF NOT EXISTS idx_document_submissions_passport_number ON document_submissions(passport_number);
