import { NextRequest, NextResponse } from "next/server";
import { registerSchema } from "@/lib/validators";
import { registerUser } from "@/lib/auth";
import { rateLimiters, logAuditEvent, getClientIP } from "@/lib/security";

export async function POST(request: NextRequest) {
  const ip = getClientIP(request);
  const userAgent = request.headers.get("user-agent") || "unknown";

  try {
    const rateLimit = await rateLimiters.register(ip);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Too many registration attempts. Please try again later." }, { status: 429 });
    }

    const body = await request.json();
    const validated = registerSchema.safeParse(body);
    if (!validated.success) {
      return NextResponse.json({ error: "Invalid input", details: validated.error.flatten().fieldErrors }, { status: 400 });
    }

    const result = await registerUser(validated.data, request);
    await logAuditEvent({ userId: result.userId, action: "REGISTER_SUCCESS", resource: "auth/register", ip, userAgent, metadata: { email: validated.data.email } });

    return NextResponse.json({ success: true, message: result.message }, { status: 201 });
  } catch (error) {
    await logAuditEvent({ action: "REGISTER_ERROR", resource: "auth/register", ip, userAgent, metadata: { error: error instanceof Error ? error.message : "Unknown" } });
    return NextResponse.json({ error: error instanceof Error ? error.message : "Registration failed" }, { status: 400 });
  }
}