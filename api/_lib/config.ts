const required = ["SUPABASE_URL", "SUPABASE_SERVICE_ROLE_KEY", "ADMIN_EMAIL", "EMAIL_FROM"] as const;

for (const key of required) {
  if (!process.env[key]) {
    console.warn(`[config] Missing environment variable: ${key}`);
  }
}

export const config = {
  supabaseUrl: process.env.SUPABASE_URL || "",
  supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY || "",
  storageBucket: process.env.STORAGE_BUCKET || "dgec-documents",
  adminEmail: process.env.ADMIN_EMAIL || "info@dgroup.edu.np",
  founderEmail: process.env.FOUNDER_EMAIL,
  emailFrom: process.env.EMAIL_FROM || "DGEC <no-reply@dgroup.edu.np>",
  resendApiKey: process.env.RESEND_API_KEY,
  adminApiToken: process.env.ADMIN_API_TOKEN || "",
  allowedOrigins: (process.env.ALLOWED_ORIGINS || "").split(",").map((item) => item.trim()).filter(Boolean),
  maxFileSizeMb: Number(process.env.MAX_FILE_SIZE_MB || 10),
  maxFilesPerUpload: Number(process.env.MAX_FILES_PER_UPLOAD || 5),
  rateLimitWindowMs: Number(process.env.RATE_LIMIT_WINDOW_MS || 60000),
  rateLimitMaxRequests: Number(process.env.RATE_LIMIT_MAX_REQUESTS || 8),
};
