export type ApiResponse<T = unknown> = {
  success: boolean;
  message: string;
  data?: T;
  errors?: string[];
};

export const json = <T>(status: number, body: ApiResponse<T>, origin?: string) => {
  const headers = new Headers({
    "Content-Type": "application/json",
  });

  if (origin) {
    headers.set("Access-Control-Allow-Origin", origin);
    headers.set("Vary", "Origin");
  }

  headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Admin-Token");
  headers.set("Access-Control-Allow-Methods", "GET,POST,PATCH,OPTIONS");

  return new Response(JSON.stringify(body), { status, headers });
};

export const optionsResponse = (origin?: string) => json(200, { success: true, message: "OK" }, origin);

export const getClientIp = (req: Request) => req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "unknown";

export const getOrigin = (req: Request, allowedOrigins: string[]) => {
  const origin = req.headers.get("origin") || "";
  if (!origin) return "*";
  if (allowedOrigins.length === 0 || allowedOrigins.includes(origin)) return origin;
  return "";
};
