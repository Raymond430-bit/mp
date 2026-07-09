import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken, generateAccessToken } from "@/lib/security";

export async function POST(request: NextRequest) {
  const refreshToken = request.cookies.get("__Host-mp-rt")?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }

  const payload = await verifyRefreshToken(refreshToken);
  if (!payload) {
    return NextResponse.json({ error: "Invalid refresh token" }, { status: 401 });
  }

  const newAccessToken = await generateAccessToken({
    sub: payload.userId,
    email: "", // Fetch from DB in production
    role: "user",
    kycLevel: "none",
  });

  const response = NextResponse.json({ success: true }, { status: 200 });
  response.cookies.set("__Host-mp-at", newAccessToken, { httpOnly: true, secure: true, sameSite: "strict", path: "/", maxAge: 900 });
  return response;
}