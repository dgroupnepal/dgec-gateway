import { config } from "./config";
import { json, getClientIp } from "./http";
import { checkRateLimit } from "./rate-limit";

export const applyPublicGuard = (req: Request, origin: string) => {
  const ip = getClientIp(req);
  const limiter = checkRateLimit(ip, config.rateLimitMaxRequests, config.rateLimitWindowMs);
  if (limiter.limited) {
    return json(429, { success: false, message: "Too many requests. Please try again shortly." }, origin);
  }

  return null;
};

export const requireAdmin = (req: Request, origin: string) => {
  const token = req.headers.get("x-admin-token") || req.headers.get("authorization")?.replace("Bearer ", "");
  if (!config.adminApiToken || token !== config.adminApiToken) {
    return json(401, { success: false, message: "Unauthorized admin request" }, origin);
  }
  return null;
};
