import { z } from "zod";
import { config } from "./_lib/config";
import { emailService } from "./_lib/email";
import { applyPublicGuard } from "./_lib/guard";
import { getClientIp, getOrigin, json, optionsResponse } from "./_lib/http";
import { hasHoneypot, isAllowedFile, phoneRegex, sanitizeText } from "./_lib/security";
import { submissionsRepo } from "./_lib/submissions";
import { supabase } from "./_lib/supabase";

const formSchema = z.object({
  studentFullName: z.string().min(1).max(100),
  phone: z.string().regex(phoneRegex, "Invalid phone format"),
  email: z.string().email().max(100),
  passportNumber: z.string().max(50).optional().default(""),
  message: z.string().max(2000).optional().default(""),
  honeypot: z.string().optional(),
});

export default async function handler(req: Request) {
  const origin = getOrigin(req, config.allowedOrigins);
  if (req.method === "OPTIONS") return optionsResponse(origin);
  if (req.method !== "POST") return json(405, { success: false, message: "Method not allowed" }, origin);

  const blocked = applyPublicGuard(req, origin);
  if (blocked) return blocked;

  try {
    const formData = await req.formData();

    const body = {
      studentFullName: String(formData.get("studentFullName") || ""),
      phone: String(formData.get("phone") || ""),
      email: String(formData.get("email") || ""),
      passportNumber: String(formData.get("passportNumber") || ""),
      message: String(formData.get("message") || ""),
      honeypot: String(formData.get("website") || ""),
    };

    const parsed = formSchema.safeParse(body);
    if (!parsed.success) {
      return json(400, { success: false, message: "Validation failed", errors: parsed.error.errors.map((e) => e.message) }, origin);
    }

    if (hasHoneypot(parsed.data.honeypot)) {
      return json(200, { success: true, message: "Submission received successfully" }, origin);
    }

    const files = formData.getAll("files").filter((item): item is File => item instanceof File);

    if (files.length === 0) {
      return json(400, { success: false, message: "At least one file is required" }, origin);
    }

    if (files.length > config.maxFilesPerUpload) {
      return json(400, { success: false, message: `Maximum ${config.maxFilesPerUpload} files allowed` }, origin);
    }

    const maxFileBytes = config.maxFileSizeMb * 1024 * 1024;

    for (const file of files) {
      if (!isAllowedFile(file.name)) {
        return json(400, { success: false, message: `File type not allowed: ${file.name}` }, origin);
      }
      if (file.size > maxFileBytes) {
        return json(400, { success: false, message: `${file.name} exceeds ${config.maxFileSizeMb}MB limit` }, origin);
      }
    }

    const uploadPayload = {
      student_full_name: sanitizeText(parsed.data.studentFullName),
      phone: sanitizeText(parsed.data.phone),
      email: parsed.data.email.toLowerCase().trim(),
      passport_number: sanitizeText(parsed.data.passportNumber || ""),
      message: sanitizeText(parsed.data.message || ""),
      status: "new",
      source: "website",
      ip_address: getClientIp(req),
      user_agent: req.headers.get("user-agent") || "unknown",
    };

    const created = await submissionsRepo.createDocumentUpload(uploadPayload);
    if (created.error) throw new Error(JSON.stringify(created.error));

    const uploadedRows: Record<string, unknown>[] = [];

    for (const file of files) {
      const timestamp = Date.now();
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
      const path = `${created.data.id}/${timestamp}-${safeName}`;
      const bytes = new Uint8Array(await file.arrayBuffer());

      const storageResult = await supabase.storage.from(config.storageBucket).upload(path, bytes, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

      if (storageResult.error) {
        throw new Error(storageResult.error.message);
      }

      uploadedRows.push({
        document_upload_id: created.data.id,
        file_name: file.name,
        file_size: file.size,
        mime_type: file.type,
        file_path: path,
        storage_bucket: config.storageBucket,
      });
    }

    const fileRows = await submissionsRepo.createUploadedFiles(uploadedRows);
    if (fileRows.error) throw new Error(JSON.stringify(fileRows.error));

    const references = (fileRows.data || []).map((row) => `${row.file_name} (${row.file_path})`).join("<br/>");

    const adminEmail = await emailService.sendDocumentUploadNotification({
      studentFullName: uploadPayload.student_full_name,
      phone: uploadPayload.phone,
      email: uploadPayload.email,
      passportNumber: uploadPayload.passport_number,
      message: uploadPayload.message,
      files: references,
    });

    const confirmationEmail = await emailService.sendUserConfirmation(uploadPayload.email, uploadPayload.student_full_name, "documents");
    const emailFailed = !adminEmail.success || !confirmationEmail.success;

    return json(
      emailFailed ? 207 : 201,
      {
        success: !emailFailed,
        message: emailFailed
          ? "Documents saved, but one or more emails failed to send."
          : "Documents uploaded successfully",
        data: { id: created.data.id, createdAt: created.data.created_at, files: fileRows.data, emailStatus: { adminEmail, confirmationEmail } },
      },
      origin,
    );
  } catch (error) {
    console.error("[document-upload]", error);
    return json(500, { success: false, message: "Unable to process document upload" }, origin);
  }
}
