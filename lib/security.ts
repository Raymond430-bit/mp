import { NextRequest } from "next/server";

export function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return request.ip || "unknown";
}

export async function checkRateLimit(identifier: string, limit: number, windowSeconds: number) {
  return { success: true, limit, remaining: limit - 1, reset: Date.now() + windowSeconds * 1000 };
}

export const rateLimiters = {
  login: (id: string) => checkRateLimit(id, 5, 600),
  register: (id: string) => checkRateLimit(id, 3, 3600),
  api: (id: string) => checkRateLimit(id, 100, 60),
};

export async function logAuditEvent(event: any) {
  console.log("[AUDIT]", event);
}
