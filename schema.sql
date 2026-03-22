-- Contact Form Table
CREATE TABLE IF NOT EXISTS contact_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  subject TEXT,
  service TEXT,
  country TEXT,
  message TEXT NOT NULL,
  status TEXT DEFAULT 'new',
  created_at TEXT,
  updated_at TEXT
);

-- Document Upload Table
CREATE TABLE IF NOT EXISTS document_submissions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  passport_number TEXT,
  message TEXT,
  file_key TEXT,
  original_file_name TEXT,
  file_type TEXT,
  file_size INTEGER,
  status TEXT DEFAULT 'new',
  created_at TEXT,
  updated_at TEXT
);
