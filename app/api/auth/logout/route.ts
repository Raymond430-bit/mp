import { NextRequest, NextResponse } from "next/server";
import { logoutUser } from "@/lib/auth";

export async function POST(request: NextRequest) {
  await logoutUser(request);
  return NextResponse.json({ success: true }, { status: 200 });
}