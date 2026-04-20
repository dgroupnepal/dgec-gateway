# DGEC Gateway — Student Portal + Admin Dashboard

Production-ready SaaS platform for **D Group Education Consultancy Pvt. Ltd. (DGEC)**.  
Built for students applying to study in Korea, Japan, and other countries from Nepal.

[![Deploy](https://img.shields.io/badge/deploy-Vercel-black?logo=vercel)](https://dgroup.edu.np)
[![Worker](https://img.shields.io/badge/API-Cloudflare_Workers-orange?logo=cloudflare)](https://dgec-contact-api.dgroupofficial.workers.dev)

---

## Architecture

| Layer | Technology | Why |
|-------|-----------|-----|
| Frontend | React 18 + Vite + TypeScript | Fast DX, SSR-ready via Vercel |
| Styling | Tailwind CSS + shadcn/ui | Consistent, accessible components |
| Auth | Supabase Auth (email + Google OAuth) | Managed JWT, RLS integration |
| Database | Supabase (PostgreSQL) + RLS | Row-level security per user role |
| Storage | Supabase Storage | Secure private file uploads |
| API | Cloudflare Workers | Edge-native, globally distributed |
| Email | Resend | Reliable transactional delivery |
| Hosting | Vercel (frontend) + Cloudflare (Worker) | Zero-config CDN + edge compute |
| CI/CD | GitHub Actions | Auto-deploy on push to main |

---

## Features

### Student Portal (`/portal/*`)
- **Login / Register** — Email + password or Google OAuth
- **Dashboard** — Application status timeline, notifications, payment alerts
- **Profile** — Personal info, passport, emergency contact
- **Documents** — Upload passport, transcripts, bank statements (PDF/image, 10 MB max)
- **Messages** — Real-time chat with DGEC staff (Supabase Realtime)
- **Payments** — Invoice history, payment status, receipt download

### Admin Dashboard (`/admin/*`)
- **Analytics** — Revenue charts, application pipeline breakdown, quick stats
- **Students** — Search, filter, view all registered students
- **Pipeline** — Drag-and-drop Kanban board (inquiry → completed)
- **Documents** — Verify/reject uploads with rejection reason + student notification
- **Messages** — Reply to student threads, resolve conversations
- **Payments** — Create invoices, mark paid, track outstanding
- **Audit Log** — Full trail of all admin actions

### Public Marketing Site
- SEO landing pages: Study in Korea, Travel Services, Blog
- Lead capture: student inquiry + contact forms
- WhatsApp floating button
- Privacy Policy, Terms, Disclaimer

---

## Folder Structure

```
dgec-gateway/
├── src/
│   ├── components/
│   │   ├── auth/          # ProtectedRoute
│   │   ├── layout/        # Header, Footer, Layout
│   │   └── ui/            # shadcn/ui components
│   ├── contexts/
│   │   └── AuthContext.tsx  # Supabase auth + profile state
│   ├── integrations/
│   │   └── supabase/      # client.ts + types.ts
│   ├── pages/
│   │   ├── portal/        # Student portal pages
│   │   ├── admin/         # Admin dashboard pages
│   │   └── *.tsx          # Public marketing pages
│   └── lib/
│       ├── api.ts         # Cloudflare Worker API client
│       └── utils.ts
├── api/                   # Vercel serverless (legacy)
├── supabase/
│   └── migrations/        # SQL migrations + RLS policies
├── .github/workflows/     # GitHub Actions CI/CD
├── cloudflare-worker.ts   # Cloudflare Worker entry
└── .env.example
```

---

## Quick Start

### 1. Clone & install

```bash
git clone https://github.com/dgroupnepal/dgec-gateway.git
cd dgec-gateway
npm install
```

### 2. Configure environment

```bash
cp .env.example .env
# Fill in VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY, etc.
```

### 3. Run Supabase migration

```bash
# In Supabase dashboard > SQL Editor, run:
# supabase/migrations/20260420000000_full_portal_schema.sql
```

### 4. Create Supabase Storage bucket

In Supabase dashboard → Storage → New bucket:
- Name: `documents`
- Public: **OFF**
- File size limit: 10 MB
- Allowed MIME types: `image/jpeg,image/png,image/webp,application/pdf`

### 5. Configure Google OAuth

In Supabase dashboard → Auth → Providers → Google:
- Add Client ID & Secret from Google Cloud Console
- Redirect URL: `https://your-project.supabase.co/auth/v1/callback`

### 6. Run locally

```bash
npm run dev
# App: http://localhost:8080
# Admin: http://localhost:8080/admin/login
# Portal: http://localhost:8080/portal/login
```

---

## Database Schema

| Table | Purpose |
|-------|---------|
| `profiles` | Extends auth.users — role, passport, phone |
| `applications` | Visa/university applications per student |
| `application_timeline` | Status change history per application |
| `documents` | Uploaded files metadata + verification status |
| `message_threads` | Conversation threads between student ↔ DGEC |
| `messages` | Individual messages in a thread |
| `notifications` | In-app alerts for students |
| `payments` | Invoices and payment tracking |
| `audit_logs` | Admin action audit trail |

**Roles:** `student` | `staff` | `admin` | `super_admin`

All tables have **Row Level Security** — students see only their own data.

---

## Deployment

### Frontend → Vercel

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel --prod

# Set env vars in Vercel dashboard or:
vercel env add VITE_SUPABASE_URL
vercel env add VITE_SUPABASE_ANON_KEY
vercel env add VITE_API_BASE_URL
```

### Backend → Cloudflare Workers

```bash
# Install Wrangler
npm i -g wrangler

# Login
wrangler login

# Set secrets
wrangler secret put SUPABASE_SERVICE_ROLE_KEY
wrangler secret put RESEND_API_KEY
wrangler secret put ADMIN_API_TOKEN

# Deploy
wrangler deploy cloudflare-worker.ts
```

### Custom Domain

In Vercel dashboard → Project → Settings → Domains → Add `dgroup.edu.np`

---

## CI/CD (GitHub Actions)

On every push to `main`:
1. TypeScript check + lint + unit tests
2. Production build
3. Deploy to Vercel (frontend)
4. Deploy to Cloudflare Workers (API)

Required GitHub Secrets:
```
VITE_SUPABASE_URL
VITE_SUPABASE_ANON_KEY
VITE_API_BASE_URL
SUPABASE_URL
SUPABASE_SERVICE_ROLE_KEY
RESEND_API_KEY
ADMIN_API_TOKEN
VERCEL_TOKEN
VERCEL_ORG_ID
VERCEL_PROJECT_ID
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
```

---

## Security

- **RLS policies** on every table — enforced at database level
- **Supabase Auth** JWT tokens auto-refreshed
- **File upload validation** — MIME type + size checked client & server side
- **Rate limiting** — Cloudflare Worker blocks abusive IPs
- **Input validation** — Zod schemas on all API endpoints
- **Audit logs** — Every admin action is recorded
- **HTTPS only** — Vercel + Cloudflare enforce TLS

---

## API Endpoints (Cloudflare Worker)

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/contact` | — | Contact form |
| POST | `/student-inquiry` | — | Student inquiry |
| POST | `/document-upload` | — | File upload |
| GET | `/admin/uploads` | Token | List submissions |
| GET | `/admin/uploads/:id` | Token | Submission detail |
| PATCH | `/admin/uploads/:id/status` | Token | Update status |

---

## License

Private — D Group Education Consultancy Pvt. Ltd. All rights reserved.
