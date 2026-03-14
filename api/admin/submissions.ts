import { config } from "../_lib/config";
import { requireAdmin } from "../_lib/guard";
import { getOrigin, json, optionsResponse } from "../_lib/http";
import { adminRepo } from "../_lib/submissions";

const asCsv = (rows: Array<Record<string, unknown>>) => {
  if (rows.length === 0) return "";
  const headers = Array.from(new Set(rows.flatMap((row) => Object.keys(row))));
  const escape = (v: unknown) => `"${String(v ?? "").replace(/"/g, '""')}"`;
  const lines = [headers.join(",")];
  for (const row of rows) {
    lines.push(headers.map((header) => escape(row[header])).join(","));
  }
  return lines.join("\n");
};

export default async function handler(req: Request) {
  const origin = getOrigin(req, config.allowedOrigins);
  if (req.method === "OPTIONS") return optionsResponse(origin);
  const unauthorized = requireAdmin(req, origin);
  if (unauthorized) return unauthorized;

  try {
    const url = new URL(req.url);

    if (req.method === "GET") {
      const filters = Object.fromEntries(url.searchParams.entries());
      const exportCsv = url.searchParams.get("export") === "csv";
      const result = await adminRepo.listAll(filters);

      const errors = result.filter((item) => item.error);
      if (errors.length > 0) {
        throw new Error(JSON.stringify(errors));
      }

      const data = result.flatMap((item) =>
        ((item.data as Array<Record<string, unknown>>) || []).map((row) => ({ ...row, submission_type: item.type })),
      );

      if (exportCsv) {
        const csv = asCsv(data);
        return new Response(csv, {
          status: 200,
          headers: {
            "Content-Type": "text/csv",
            "Content-Disposition": `attachment; filename="dgec-submissions-${Date.now()}.csv"`,
            "Access-Control-Allow-Origin": origin || "*",
          },
        });
      }

      return json(200, { success: true, message: "Submissions fetched successfully", data }, origin);
    }

    return json(405, { success: false, message: "Method not allowed" }, origin);
  } catch (error) {
    console.error("[admin/submissions]", error);
    return json(500, { success: false, message: "Unable to fetch submissions" }, origin);
  }
}
