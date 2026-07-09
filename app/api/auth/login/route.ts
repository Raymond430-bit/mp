import { NextRequest, NextResponse } from "next/server";
import { loginSchema } from "@/lib/validators";
import { loginUser } from "@/lib/auth";
import { rateLimiters, logAuditEvent, getClientIP } from "@/lib/security";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    const rateLimit = await rateLimiters.login(ip);
    if (!rateLimit.success) {
      await logAuditEvent({ action: "RATE_LIMIT_EXCEEDED", resource: "auth/login", ip, userAgent, metadata: { type: "login", ip } });
      return NextResponse.json({ error: "Too many login attempts. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const validated = loginSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid input", details: validated.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await loginUser(validated.data, request);
    if ("requires2FA" in result) {
      return NextResponse.json({ requires2FA: true, message: "Two-factor authentication required" }, { status: 200 });
    }

    return NextResponse.json({ success: true, user: result.user, csrfToken: result.csrfToken }, { status: 200 });
  } catch (error) {
    await logAuditEvent({ action: "LOGIN_ERROR", resource: "auth/login", ip, userAgent, metadata: { error: error instanceof Error ? error.message : "Unknown" } });
    const message = error instanceof Error ? error.message : "Authentication failed";
    const status = message.includes("locked") ? 423 : 401;
    return NextResponse.json({ error: message }, { status });
  }
}