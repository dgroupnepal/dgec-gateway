# DGEC Website Backend + Frontend Integration

Production-ready form backend for **D Group Education Consultancy Pvt. Ltd. (DGEC)** with Supabase storage, email notifications, secure admin APIs, and fully connected React form flows.

## What is implemented

- `POST /api/contact` for contact form submissions.
- `POST /api/student-inquiry` for student counseling inquiries.
- `POST /api/document-upload` for secure document uploads.
- `GET /api/admin/submissions` for protected submission listing and filtering.
- `GET /api/admin/submissions/:id` for protected submission detail.
- `PATCH /api/admin/submissions/:id/status` for protected status updates.
- CSV export support via `GET /api/admin/submissions?export=csv`.

All submission flows include:
- server-side validation (Zod)
- honeypot anti-spam support
- in-memory rate limiting
- database persistence in Supabase PostgreSQL
- notification email to admin inbox
- confirmation email to the user
- structured JSON responses

---

## Tech stack

- Frontend: React + Vite + TypeScript
- API: Vercel serverless functions in `api/`
- Database: Supabase PostgreSQL
- File storage: Supabase Storage bucket
- Email: Resend API (`RESEND_API_KEY`)
- Validation: Zod

---

## Project structure

```txt
api/
  contact.ts
  student-inquiry.ts
  document-upload.ts
  admin/submissions.ts
  admin/submissions/[id].ts
  _lib/
    config.ts
    email.ts
    guard.ts
    http.ts
    rate-limit.ts
    security.ts
    submissions.ts
    supabase.ts
    validation.ts
src/
  lib/api.ts
  pages/Contact.tsx
  pages/DocumentUpload.tsx
  pages/StudentInquiry.tsx
supabase/migrations/
  20260314174000_create_dgec_submission_tables.sql
.env.example
vercel.json
```

---

## Environment configuration

Copy and configure:

```bash
cp .env.example .env
```

Required values:

- `SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `STORAGE_BUCKET`
- `RESEND_API_KEY`
- `EMAIL_FROM`
- `ADMIN_EMAIL` (default DGEC inbox)
- `ADMIN_API_TOKEN` (protect admin endpoints)

For frontend API base:

- `VITE_API_BASE_URL`
  - Keep empty in same-domain Vercel deployment.
  - Set a full URL if frontend and backend are deployed separately.

---

## Supabase setup

1. Create a Supabase project.
2. Run migration SQL from:
   - `supabase/migrations/20260314174000_create_dgec_submission_tables.sql`
3. Create storage bucket matching `STORAGE_BUCKET` (default `dgec-documents`).
4. Set bucket privacy to **private**.
5. Use service role key in backend env.

### Suggested storage policies

- Write/read only with service role key.
- Do not expose public bucket for student documents.

---

## Local development

Install deps and run frontend:

```bash
npm install
npm run dev
```

For serverless API local runtime, use Vercel CLI if available:

```bash
vercel dev
```

If using only Vite locally, frontend runs but API routes require Vercel runtime or deployed backend URL.

---

## Deployment (Vercel)

1. Import repo in Vercel.
2. Set all env vars from `.env.example` in Vercel project settings.
3. Deploy.
4. Verify:
   - `/api/contact`
   - `/api/student-inquiry`
   - `/api/document-upload`

`vercel.json` already defines Node runtime for API functions.

---

## API usage

### Public endpoints

- `POST /api/contact`
- `POST /api/student-inquiry`
- `POST /api/document-upload` (multipart/form-data)

### Admin endpoints (protected)

Pass header:

```txt
x-admin-token: <ADMIN_API_TOKEN>
```

Endpoints:
- `GET /api/admin/submissions?type=&status=&search=&from=&to=&limit=&offset=`
- `GET /api/admin/submissions/:id?type=contact|student_inquiry|document_upload`
- `PATCH /api/admin/submissions/:id/status` body:
  ```json
  {
    "type": "contact",
    "status": "in_progress",
    "adminNotes": "Called the student"
  }
  ```

---

## Testing form submissions

1. Submit Contact form on `/contact`.
2. Submit Student Inquiry form on `/student-inquiry`.
3. Submit Document form on `/documents` with a supported file.
4. Confirm:
   - record appears in Supabase table
   - files exist in storage bucket
   - admin email received at `info@dgroup.edu.np`
   - user receives auto-confirmation email

---

## Troubleshooting

### Email not sent

- Verify `RESEND_API_KEY` is valid.
- Verify `EMAIL_FROM` uses a verified sender domain in Resend.
- Check function logs for `Email API failed` errors.

### File upload fails

- Check `MAX_FILE_SIZE_MB` and allowed extensions.
- Verify storage bucket exists and service role key has permission.
- Ensure request is `multipart/form-data` and file field key is `files`.

### Admin API unauthorized

- Ensure request header `x-admin-token` exactly matches `ADMIN_API_TOKEN`.

### CORS issues

- Add frontend origin(s) to `ALLOWED_ORIGINS` (comma-separated).

---

## Future scalability notes

The backend is modular under `api/_lib`, making it easy to add:

- appointment booking module
- visa tracking module
- student portal account workflows
- payment integration and invoices
- audit logs and admin user management

DGEC brand tone remains professional, clean, and trust-oriented while backend logic is production-oriented and extensible.

---

## Cloudflare Worker + R2 + D1 (Document Admin)

This repository now includes a Cloudflare Worker implementation for DGEC document uploads and admin document management:

- Worker entry: `cloudflare-worker.ts`
- D1 schema: `cloudflare/d1/schema.sql`

### Endpoints provided by the worker

- `POST /document-upload`
  - Keeps multipart upload flow
  - Uploads file to `DOCUMENTS_BUCKET` (R2)
  - Persists metadata row to `DGEC_DB` (D1)
  - Returns `{ success, message, key, recordId }`
- `GET /admin/uploads`
  - List uploads (newest first)
  - Supports `search`, `status`, `limit`, `offset`
- `GET /admin/uploads/:id`
  - Fetch single upload details
- `PATCH /admin/uploads/:id/status`
  - Update status (`new|reviewing|approved|rejected|completed`)
- `GET /admin/files/:key`
  - Basic admin file retrieval by R2 object key

### Required Cloudflare bindings

- `DOCUMENTS_BUCKET` (R2)
- `DGEC_DB` (D1)
- Optional: `ALLOWED_ORIGINS`, `ADMIN_API_TOKEN`

### D1 migration

Run schema from:

- `cloudflare/d1/schema.sql`

