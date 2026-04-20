-- ============================================================
-- DGEC Full Portal Schema
-- Student Portal + Admin Dashboard
-- ============================================================

-- ── Profiles (extends auth.users) ──────────────────────────
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  phone text,
  avatar_url text,
  role text not null default 'student'
    check (role in ('student','staff','admin','super_admin')),
  nationality text,
  passport_number text,
  date_of_birth date,
  address text,
  emergency_contact text,
  onboarding_completed boolean not null default false,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Applications ───────────────────────────────────────────
create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  assigned_staff_id uuid references public.profiles(id),
  type text not null check (type in ('visa','university','insurance','air_ticket','other')),
  destination_country text not null,
  university text,
  program text,
  intake text,
  status text not null default 'inquiry'
    check (status in ('inquiry','documents_pending','under_review','approved','rejected','visa_processing','completed','cancelled')),
  priority text not null default 'normal' check (priority in ('low','normal','high','urgent')),
  notes text,
  target_date date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Application Timeline ────────────────────────────────────
create table if not exists public.application_timeline (
  id uuid primary key default gen_random_uuid(),
  application_id uuid not null references public.applications(id) on delete cascade,
  actor_id uuid references public.profiles(id),
  event text not null,
  description text,
  status_from text,
  status_to text,
  created_at timestamptz not null default now()
);

-- ── Documents ──────────────────────────────────────────────
create table if not exists public.documents (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  uploaded_by uuid references public.profiles(id),
  document_type text not null
    check (document_type in (
      'passport','photo','transcript','diploma','bank_statement',
      'medical','police_clearance','language_cert','recommendation',
      'birth_certificate','marriage_certificate','employment_letter','other'
    )),
  file_name text not null,
  file_size bigint not null,
  mime_type text,
  storage_path text not null,
  status text not null default 'pending'
    check (status in ('pending','approved','rejected','expired')),
  rejection_reason text,
  expires_at date,
  verified_by uuid references public.profiles(id),
  verified_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Message Threads ────────────────────────────────────────
create table if not exists public.message_threads (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  subject text not null default 'General',
  status text not null default 'open' check (status in ('open','resolved','archived')),
  last_message_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Messages ───────────────────────────────────────────────
create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references public.message_threads(id) on delete cascade,
  sender_id uuid not null references public.profiles(id),
  body text not null,
  attachments jsonb default '[]'::jsonb,
  read_by jsonb default '[]'::jsonb,
  created_at timestamptz not null default now()
);

-- ── Notifications ─────────────────────────────────────────
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  type text not null
    check (type in ('application_update','document_request','message','payment','system')),
  title text not null,
  body text not null,
  action_url text,
  read boolean not null default false,
  created_at timestamptz not null default now()
);

-- ── Payments ──────────────────────────────────────────────
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references public.profiles(id) on delete cascade,
  application_id uuid references public.applications(id) on delete set null,
  invoice_number text unique not null,
  description text not null,
  amount_npr numeric(12,2) not null,
  amount_usd numeric(12,2),
  currency text not null default 'NPR' check (currency in ('NPR','USD','KRW','JPY')),
  payment_method text check (payment_method in ('bank_transfer','esewa','khalti','cash','card','stripe')),
  status text not null default 'pending' check (status in ('pending','partial','paid','overdue','cancelled','refunded')),
  due_date date,
  paid_at timestamptz,
  receipt_path text,
  notes text,
  created_by uuid references public.profiles(id),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ── Audit Logs ────────────────────────────────────────────
create table if not exists public.audit_logs (
  id uuid primary key default gen_random_uuid(),
  actor_id uuid references public.profiles(id),
  action text not null,
  resource_type text not null,
  resource_id text,
  old_value jsonb,
  new_value jsonb,
  ip_address text,
  user_agent text,
  created_at timestamptz not null default now()
);

-- ── Indexes ───────────────────────────────────────────────
create index if not exists idx_profiles_role on public.profiles(role);
create index if not exists idx_applications_student on public.applications(student_id);
create index if not exists idx_applications_status on public.applications(status);
create index if not exists idx_applications_staff on public.applications(assigned_staff_id);
create index if not exists idx_timeline_application on public.application_timeline(application_id);
create index if not exists idx_documents_student on public.documents(student_id);
create index if not exists idx_documents_application on public.documents(application_id);
create index if not exists idx_documents_status on public.documents(status);
create index if not exists idx_threads_student on public.message_threads(student_id);
create index if not exists idx_messages_thread on public.messages(thread_id);
create index if not exists idx_notifications_user on public.notifications(user_id, read);
create index if not exists idx_payments_student on public.payments(student_id);
create index if not exists idx_audit_actor on public.audit_logs(actor_id);
create index if not exists idx_audit_resource on public.audit_logs(resource_type, resource_id);

-- ── Updated-at triggers ───────────────────────────────────
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end; $$;

do $$ begin
  -- profiles
  if not exists (select 1 from pg_trigger where tgname = 'trg_profiles_updated_at') then
    create trigger trg_profiles_updated_at before update on public.profiles
      for each row execute procedure public.set_updated_at();
  end if;
  -- applications
  if not exists (select 1 from pg_trigger where tgname = 'trg_applications_updated_at') then
    create trigger trg_applications_updated_at before update on public.applications
      for each row execute procedure public.set_updated_at();
  end if;
  -- documents
  if not exists (select 1 from pg_trigger where tgname = 'trg_documents_updated_at') then
    create trigger trg_documents_updated_at before update on public.documents
      for each row execute procedure public.set_updated_at();
  end if;
  -- threads
  if not exists (select 1 from pg_trigger where tgname = 'trg_threads_updated_at') then
    create trigger trg_threads_updated_at before update on public.message_threads
      for each row execute procedure public.set_updated_at();
  end if;
  -- payments
  if not exists (select 1 from pg_trigger where tgname = 'trg_payments_updated_at') then
    create trigger trg_payments_updated_at before update on public.payments
      for each row execute procedure public.set_updated_at();
  end if;
end $$;

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles(id, email, full_name, avatar_url, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name'),
    new.raw_user_meta_data->>'avatar_url',
    coalesce(new.raw_user_meta_data->>'role', 'student')
  )
  on conflict (id) do nothing;
  return new;
end; $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ── Row Level Security ────────────────────────────────────
alter table public.profiles enable row level security;
alter table public.applications enable row level security;
alter table public.application_timeline enable row level security;
alter table public.documents enable row level security;
alter table public.message_threads enable row level security;
alter table public.messages enable row level security;
alter table public.notifications enable row level security;
alter table public.payments enable row level security;
alter table public.audit_logs enable row level security;

-- Helper: is the current user admin/staff/super_admin?
create or replace function public.is_staff()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('staff','admin','super_admin')
  );
$$;

-- Helper: is the current user admin/super_admin?
create or replace function public.is_admin()
returns boolean language sql security definer set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role in ('admin','super_admin')
  );
$$;

-- ── profiles policies ────────────────────────────────────
drop policy if exists "profiles: own read" on public.profiles;
create policy "profiles: own read" on public.profiles
  for select using (id = auth.uid() or public.is_staff());

drop policy if exists "profiles: own update" on public.profiles;
create policy "profiles: own update" on public.profiles
  for update using (id = auth.uid() or public.is_admin())
  with check (id = auth.uid() or public.is_admin());

drop policy if exists "profiles: admin insert" on public.profiles;
create policy "profiles: admin insert" on public.profiles
  for insert with check (id = auth.uid() or public.is_admin());

-- ── applications policies ────────────────────────────────
drop policy if exists "applications: student own read" on public.applications;
create policy "applications: student own read" on public.applications
  for select using (student_id = auth.uid() or public.is_staff());

drop policy if exists "applications: student insert" on public.applications;
create policy "applications: student insert" on public.applications
  for insert with check (student_id = auth.uid() or public.is_staff());

drop policy if exists "applications: staff update" on public.applications;
create policy "applications: staff update" on public.applications
  for update using (public.is_staff() or student_id = auth.uid())
  with check (public.is_staff() or student_id = auth.uid());

drop policy if exists "applications: admin delete" on public.applications;
create policy "applications: admin delete" on public.applications
  for delete using (public.is_admin());

-- ── application_timeline policies ────────────────────────
drop policy if exists "timeline: readable by owner or staff" on public.application_timeline;
create policy "timeline: readable by owner or staff" on public.application_timeline
  for select using (
    public.is_staff() or
    exists (select 1 from public.applications a
            where a.id = application_id and a.student_id = auth.uid())
  );

drop policy if exists "timeline: insert by staff" on public.application_timeline;
create policy "timeline: insert by staff" on public.application_timeline
  for insert with check (public.is_staff() or actor_id = auth.uid());

-- ── documents policies ────────────────────────────────────
drop policy if exists "documents: student own read" on public.documents;
create policy "documents: student own read" on public.documents
  for select using (student_id = auth.uid() or public.is_staff());

drop policy if exists "documents: student upload" on public.documents;
create policy "documents: student upload" on public.documents
  for insert with check (student_id = auth.uid() or public.is_staff());

drop policy if exists "documents: staff verify" on public.documents;
create policy "documents: staff verify" on public.documents
  for update using (public.is_staff() or student_id = auth.uid());

drop policy if exists "documents: admin delete" on public.documents;
create policy "documents: admin delete" on public.documents
  for delete using (public.is_admin());

-- ── message_threads policies ─────────────────────────────
drop policy if exists "threads: student own or staff" on public.message_threads;
create policy "threads: student own or staff" on public.message_threads
  for select using (student_id = auth.uid() or public.is_staff());

drop policy if exists "threads: student create" on public.message_threads;
create policy "threads: student create" on public.message_threads
  for insert with check (student_id = auth.uid() or public.is_staff());

drop policy if exists "threads: update open/close" on public.message_threads;
create policy "threads: update open/close" on public.message_threads
  for update using (student_id = auth.uid() or public.is_staff());

-- ── messages policies ────────────────────────────────────
drop policy if exists "messages: thread participant read" on public.messages;
create policy "messages: thread participant read" on public.messages
  for select using (
    sender_id = auth.uid() or public.is_staff() or
    exists (select 1 from public.message_threads t
            where t.id = thread_id and t.student_id = auth.uid())
  );

drop policy if exists "messages: thread participant write" on public.messages;
create policy "messages: thread participant write" on public.messages
  for insert with check (
    sender_id = auth.uid() and (
      public.is_staff() or
      exists (select 1 from public.message_threads t
              where t.id = thread_id and t.student_id = auth.uid())
    )
  );

-- ── notifications policies ────────────────────────────────
drop policy if exists "notifications: own" on public.notifications;
create policy "notifications: own" on public.notifications
  for all using (user_id = auth.uid() or public.is_admin());

-- ── payments policies ─────────────────────────────────────
drop policy if exists "payments: student own read" on public.payments;
create policy "payments: student own read" on public.payments
  for select using (student_id = auth.uid() or public.is_staff());

drop policy if exists "payments: staff manage" on public.payments;
create policy "payments: staff manage" on public.payments
  for insert with check (public.is_staff());

drop policy if exists "payments: staff update" on public.payments;
create policy "payments: staff update" on public.payments
  for update using (public.is_staff());

-- ── audit_logs policies ───────────────────────────────────
drop policy if exists "audit: admin read" on public.audit_logs;
create policy "audit: admin read" on public.audit_logs
  for select using (public.is_admin());

drop policy if exists "audit: insert from functions" on public.audit_logs;
create policy "audit: insert from functions" on public.audit_logs
  for insert with check (true);

-- ── Storage Buckets ───────────────────────────────────────
-- Run in Supabase dashboard or via CLI after creating the bucket:
-- insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
-- values (
--   'documents',
--   'documents',
--   false,
--   10485760, -- 10 MB
--   array['image/jpeg','image/png','image/webp','application/pdf']
-- );
