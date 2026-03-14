import { config } from "../../_lib/config";
import { requireAdmin } from "../../_lib/guard";
import { getOrigin, json, optionsResponse } from "../../_lib/http";
import { adminRepo } from "../../_lib/submissions";
import { adminStatusSchema } from "../../_lib/validation";

export default async function handler(req: Request) {
  const origin = getOrigin(req, config.allowedOrigins);
  if (req.method === "OPTIONS") return optionsResponse(origin);

  const unauthorized = requireAdmin(req, origin);
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(req.url);
    const id = url.pathname.split("/").pop() || "";
    const type = url.searchParams.get("type") || "";

    if (!id) {
      return json(400, { success: false, message: "Missing submission id" }, origin);
    }

    if (req.method === "GET") {
      if (!type) return json(400, { success: false, message: "type query is required" }, origin);
      const result = await adminRepo.getById(type, id);
      if (result.error) return json(404, { success: false, message: "Submission not found" }, origin);
      return json(200, { success: true, message: "Submission fetched successfully", data: result.data }, origin);
    }

    if (req.method === "PATCH") {
      const body = await req.json();
      const parsed = adminStatusSchema.safeParse({ ...body, type: body.type || type });
      if (!parsed.success) {
        return json(400, { success: false, message: "Validation failed", errors: parsed.error.errors.map((e) => e.message) }, origin);
      }

      const updated = await adminRepo.updateStatus(parsed.data.type, id, parsed.data.status, parsed.data.adminNotes);
      if (updated.error) {
        return json(404, { success: false, message: "Submission not found" }, origin);
      }

      return json(200, { success: true, message: "Submission status updated", data: updated.data }, origin);
    }

    return json(405, { success: false, message: "Method not allowed" }, origin);
  } catch (error) {
    console.error("[admin/submissions/:id]", error);
    return json(500, { success: false, message: "Unable to process admin request" }, origin);
  }
}
