export interface Env {
  DOCUMENTS_BUCKET: R2Bucket;
  DGEC_DB: D1Database;
  ALLOWED_ORIGINS?: string;
  ADMIN_API_TOKEN?: string;
}

type UploadRow = {
  id: number;
  full_name: string | null;
  phone: string | null;
  email: string | null;
  passport_number: string | null;
  message: string | null;
  file_key: string;
  original_file_name: string | null;
  file_type: string | null;
  file_size: number | null;
  status: string;
  created_at: string;
  updated_at: string;
};

const STATUS_VALUES = ["new", "reviewing", "approved", "rejected", "completed"] as const;

type StatusValue = (typeof STATUS_VALUES)[number];

const json = (body: unknown, status = 200, origin = "*") =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": origin,
      "Access-Control-Allow-Headers": "Content-Type, x-admin-token",
      "Access-Control-Allow-Methods": "GET,POST,PATCH,OPTIONS",
    },
  });

const parseAllowedOrigins = (value?: string) =>
  (value || "")
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);

const resolveOrigin = (request: Request, env: Env) => {
  const requestOrigin = request.headers.get("origin") || "";
  const allowed = parseAllowedOrigins(env.ALLOWED_ORIGINS);
  if (!requestOrigin || allowed.length === 0 || allowed.includes(requestOrigin)) {
    return requestOrigin || "*";
  }
  return "null";
};

const sanitizeText = (value: FormDataEntryValue | null) => {
  if (typeof value !== "string") return "";
  // eslint-disable-next-line no-control-regex
  return value.trim().replace(/[\u0000-\u001F\u007F]/g, "");
};

const getUploadFile = (formData: FormData) => {
  const candidates = [
    ...formData.getAll("files"),
    formData.get("file"),
    formData.get("document"),
    formData.get("upload"),
  ].filter((item): item is File => item instanceof File);

  return candidates[0] || null;
};

const requireAdminIfConfigured = (request: Request, env: Env) => {
  if (!env.ADMIN_API_TOKEN) return null;
  if (request.headers.get("x-admin-token") === env.ADMIN_API_TOKEN) return null;
  return json({ success: false, message: "Unauthorized" }, 401, resolveOrigin(request, env));
};

const mapRow = (row: Record<string, unknown>) => ({
  ...row,
  fileSize: row.file_size,
  fileType: row.file_type,
  fileKey: row.file_key,
  fullName: row.full_name,
  passportNumber: row.passport_number,
  originalFileName: row.original_file_name,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

async function handleDocumentUpload(request: Request, env: Env) {
  const origin = resolveOrigin(request, env);
  if (request.method !== "POST") return json({ success: false, message: "Method not allowed" }, 405, origin);

  const formData = await request.formData();
  const file = getUploadFile(formData);
  if (!file) return json({ success: false, message: "A file is required" }, 400, origin);

  const fullName = sanitizeText(formData.get("studentFullName") || formData.get("fullName"));
  const phone = sanitizeText(formData.get("phone"));
  const email = sanitizeText(formData.get("email")).toLowerCase();
  const passportNumber = sanitizeText(formData.get("passportNumber"));
  const message = sanitizeText(formData.get("message"));

  const now = new Date().toISOString();
  const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
  const fileKey = `${Date.now()}-${crypto.randomUUID()}-${sanitizedFileName}`;

  await env.DOCUMENTS_BUCKET.put(fileKey, file.stream(), {
    httpMetadata: {
      contentType: file.type || "application/octet-stream",
    },
    customMetadata: {
      fullName,
      email,
      passportNumber,
    },
  });

  const inserted = await env.DGEC_DB.prepare(
    `INSERT INTO document_submissions (
      full_name, phone, email, passport_number, message,
      file_key, original_file_name, file_type, file_size,
      status, created_at, updated_at
    ) VALUES (?1, ?2, ?3, ?4, ?5, ?6, ?7, ?8, ?9, 'new', ?10, ?11)`
  )
    .bind(
      fullName || null,
      phone || null,
      email || null,
      passportNumber || null,
      message || null,
      fileKey,
      file.name || null,
      file.type || null,
      file.size,
      now,
      now,
    )
    .run();

  if (!inserted.success) {
    return json(
      {
        success: false,
        message: "File uploaded to storage but database insert failed.",
        key: fileKey,
      },
      500,
      origin,
    );
  }

  return json(
    {
      success: true,
      message: "Documents uploaded successfully",
      key: fileKey,
      recordId: inserted.meta.last_row_id,
    },
    201,
    origin,
  );
}

async function listUploads(request: Request, env: Env) {
  const authBlocked = requireAdminIfConfigured(request, env);
  if (authBlocked) return authBlocked;

  const url = new URL(request.url);
  const search = (url.searchParams.get("search") || "").trim();
  const status = (url.searchParams.get("status") || "").trim();
  const limit = Math.min(Number(url.searchParams.get("limit") || "50"), 100);
  const offset = Math.max(Number(url.searchParams.get("offset") || "0"), 0);

  const clauses: string[] = [];
  const bindings: unknown[] = [];

  if (search) {
    clauses.push("(LOWER(full_name) LIKE ? OR LOWER(email) LIKE ? OR LOWER(passport_number) LIKE ?)");
    const term = `%${search.toLowerCase()}%`;
    bindings.push(term, term, term);
  }

  if (status && STATUS_VALUES.includes(status as StatusValue)) {
    clauses.push("status = ?");
    bindings.push(status);
  }

  const whereClause = clauses.length > 0 ? `WHERE ${clauses.join(" AND ")}` : "";

  const rows = await env.DGEC_DB.prepare(
    `SELECT * FROM document_submissions ${whereClause} ORDER BY datetime(created_at) DESC LIMIT ? OFFSET ?`,
  )
    .bind(...bindings, limit, offset)
    .all<UploadRow>();

  const totals = await env.DGEC_DB.prepare(
    `SELECT status, COUNT(*) as count FROM document_submissions GROUP BY status`,
  ).all<{ status: string; count: number }>();

  return json(
    {
      success: true,
      data: {
        uploads: (rows.results || []).map((row) => mapRow(row as Record<string, unknown>)),
        summary: (totals.results || []).reduce<Record<string, number>>((acc, item) => {
          acc[item.status] = Number(item.count);
          return acc;
        }, {}),
      },
    },
    200,
    resolveOrigin(request, env),
  );
}

async function getUploadById(request: Request, env: Env, id: number) {
  const authBlocked = requireAdminIfConfigured(request, env);
  if (authBlocked) return authBlocked;

  const row = await env.DGEC_DB.prepare(`SELECT * FROM document_submissions WHERE id = ?`).bind(id).first<UploadRow>();
  if (!row) return json({ success: false, message: "Upload not found" }, 404, resolveOrigin(request, env));

  return json({ success: true, data: mapRow(row as Record<string, unknown>) }, 200, resolveOrigin(request, env));
}

async function updateUploadStatus(request: Request, env: Env, id: number) {
  const authBlocked = requireAdminIfConfigured(request, env);
  if (authBlocked) return authBlocked;

  const body = (await request.json().catch(() => ({}))) as { status?: string };
  if (!body.status || !STATUS_VALUES.includes(body.status as StatusValue)) {
    return json({ success: false, message: `Status must be one of: ${STATUS_VALUES.join(", ")}` }, 400, resolveOrigin(request, env));
  }

  const now = new Date().toISOString();
  const updated = await env.DGEC_DB.prepare(
    `UPDATE document_submissions SET status = ?1, updated_at = ?2 WHERE id = ?3`,
  )
    .bind(body.status, now, id)
    .run();

  if (!updated.success || updated.meta.changes === 0) {
    return json({ success: false, message: "Upload not found" }, 404, resolveOrigin(request, env));
  }

  return getUploadById(request, env, id);
}

async function getFileByKey(request: Request, env: Env, key: string) {
  const authBlocked = requireAdminIfConfigured(request, env);
  if (authBlocked) return authBlocked;

  const object = await env.DOCUMENTS_BUCKET.get(key);
  if (!object) return json({ success: false, message: "File not found" }, 404, resolveOrigin(request, env));

  const headers = new Headers();
  object.writeHttpMetadata(headers);
  headers.set("etag", object.httpEtag);
  headers.set("Access-Control-Allow-Origin", resolveOrigin(request, env));
  headers.set("Access-Control-Allow-Headers", "Content-Type, x-admin-token");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");
  return new Response(object.body, { headers });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    if (request.method === "OPTIONS") {
      return json({ success: true }, 200, resolveOrigin(request, env));
    }

    const url = new URL(request.url);
    const { pathname } = url;

    if (pathname === "/document-upload") {
      return handleDocumentUpload(request, env);
    }

    if (pathname === "/admin/uploads" && request.method === "GET") {
      return listUploads(request, env);
    }

    const uploadMatch = pathname.match(/^\/admin\/uploads\/(\d+)$/);
    if (uploadMatch && request.method === "GET") {
      return getUploadById(request, env, Number(uploadMatch[1]));
    }

    const statusMatch = pathname.match(/^\/admin\/uploads\/(\d+)\/status$/);
    if (statusMatch && request.method === "PATCH") {
      return updateUploadStatus(request, env, Number(statusMatch[1]));
    }

    if (uploadMatch && request.method === "PATCH") {
      return updateUploadStatus(request, env, Number(uploadMatch[1]));
    }

    const fileMatch = pathname.match(/^\/admin\/files\/(.+)$/);
    if (fileMatch && request.method === "GET") {
      return getFileByKey(request, env, decodeURIComponent(fileMatch[1]));
    }

    return json({ success: false, message: "Not found" }, 404, resolveOrigin(request, env));
  },
};
