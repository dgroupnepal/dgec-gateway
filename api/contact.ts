import { config } from "./_lib/config";
import { emailService } from "./_lib/email";
import { applyPublicGuard } from "./_lib/guard";
import { getClientIp, getOrigin, json, optionsResponse } from "./_lib/http";
import { sanitizeText, hasHoneypot } from "./_lib/security";
import { submissionsRepo } from "./_lib/submissions";
import { contactSchema } from "./_lib/validation";

export default async function handler(req: Request) {
  const origin = getOrigin(req, config.allowedOrigins);
  if (req.method === "OPTIONS") return optionsResponse(origin);
  if (req.method !== "POST") return json(405, { success: false, message: "Method not allowed" }, origin);

  const blocked = applyPublicGuard(req, origin);
  if (blocked) return blocked;

  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);

    if (!parsed.success) {
      return json(400, { success: false, message: "Validation failed", errors: parsed.error.errors.map((e) => e.message) }, origin);
    }

    if (hasHoneypot(parsed.data.honeypot)) {
      return json(200, { success: true, message: "Submission received successfully" }, origin);
    }

    const payload = {
      full_name: sanitizeText(parsed.data.fullName),
      phone: sanitizeText(parsed.data.phone),
      email: parsed.data.email.toLowerCase().trim(),
      subject: sanitizeText(parsed.data.subject || "General inquiry"),
      message: sanitizeText(parsed.data.message),
      status: "new",
      source: "website",
      ip_address: getClientIp(req),
      user_agent: req.headers.get("user-agent") || "unknown",
    };

    const saved = await submissionsRepo.createContact(payload);
    if (saved.error) throw new Error(JSON.stringify(saved.error));

    const adminEmail = await emailService.sendContactNotification({
      fullName: payload.full_name,
      phone: payload.phone,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    });

    const confirmationEmail = await emailService.sendUserConfirmation(payload.email, payload.full_name, "contact");

    const emailFailed = !adminEmail.success || !confirmationEmail.success;

    return json(
      emailFailed ? 207 : 201,
      {
        success: !emailFailed,
        message: emailFailed
          ? "Submission saved, but one or more emails failed to send."
          : "Submission received successfully",
        data: { id: saved.data.id, createdAt: saved.data.created_at, emailStatus: { adminEmail, confirmationEmail } },
      },
      origin,
    );
  } catch (error) {
    console.error("[contact]", error);
    return json(500, { success: false, message: "Unable to process contact submission" }, origin);
  }
}
