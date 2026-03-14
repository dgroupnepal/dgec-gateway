-- DGEC backend schema
create extension if not exists "pgcrypto";

create table if not exists public.contact_submissions (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  subject text not null default 'General inquiry',
  message text not null,
  status text not null default 'new' check (status in ('new','contacted','in_progress','completed','rejected')),
  source text not null default 'website',
  ip_address text,
  user_agent text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.student_inquiries (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  phone text not null,
  email text not null,
  country text not null,
  current_education text not null,
  interested_course text not null,
  interested_university text,
  preferred_intake text not null,
  message text not null,
  type text not null default 'student_inquiry',
  status text not null default 'new' check (status in ('new','contacted','in_progress','completed','rejected')),
  source text not null default 'website',
  ip_address text,
  user_agent text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.document_uploads (
  id uuid primary key default gen_random_uuid(),
  student_full_name text not null,
  phone text not null,
  email text not null,
  passport_number text,
  message text,
  status text not null default 'new' check (status in ('new','contacted','in_progress','completed','rejected')),
  source text not null default 'website',
  ip_address text,
  user_agent text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.uploaded_files (
  id uuid primary key default gen_random_uuid(),
  document_upload_id uuid not null references public.document_uploads(id) on delete cascade,
  file_name text not null,
  file_size bigint not null,
  mime_type text,
  file_path text not null,
  storage_bucket text not null,
  created_at timestamptz not null default now()
);

create index if not exists idx_contact_created_at on public.contact_submissions(created_at desc);
create index if not exists idx_contact_email on public.contact_submissions(email);
create index if not exists idx_student_created_at on public.student_inquiries(created_at desc);
create index if not exists idx_student_email on public.student_inquiries(email);
create index if not exists idx_documents_created_at on public.document_uploads(created_at desc);
create index if not exists idx_documents_email on public.document_uploads(email);
create index if not exists idx_uploaded_files_parent on public.uploaded_files(document_upload_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_contact_updated_at on public.contact_submissions;
create trigger trg_contact_updated_at before update on public.contact_submissions
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_student_updated_at on public.student_inquiries;
create trigger trg_student_updated_at before update on public.student_inquiries
for each row execute procedure public.set_updated_at();

drop trigger if exists trg_documents_updated_at on public.document_uploads;
create trigger trg_documents_updated_at before update on public.document_uploads
for each row execute procedure public.set_updated_at();
