import { NextRequest, NextResponse } from "next/server";
import { marketFilterSchema } from "@/lib/validators";
import { rateLimiters, getClientIP } from "@/lib/security";

export async function GET(request: NextRequest) {
  const ip = getClientIP(request);
  try {
    const rateLimit = await rateLimiters.api(ip);
    if (!rateLimit.success) {
      return NextResponse.json({ error: "Rate limit exceeded" }, { status: 429 });
    }

    const { searchParams } = new URL(request.url);
    const params = marketFilterSchema.safeParse({
      page: searchParams.get("page") || "1",
      limit: searchParams.get("limit") || "50",
      sortBy: searchParams.get("sortBy") || "market_cap",
      sortOrder: searchParams.get("sortOrder") || "desc",
      search: searchParams.get("search") || undefined,
    });

    if (!params.success) {
      return NextResponse.json({ error: "Invalid parameters" }, { status: 400 });
    }

    const mockCoins = Array.from({ length: params.data.limit }, (_, i) => ({
      id: `coin-${i}`, symbol: ["DOGE","SHIB","PEPE","FLOKI","BONK","WIF"][i % 6],
      name: ["Dogecoin","Shiba Inu","Pepe","Floki","Bonk","dogwifhat"][i % 6],
      currentPrice: Math.random() * 10,
      marketCap: Math.random() * 10e9,
      volume24h: Math.random() * 500e6,
      priceChange24h: (Math.random() - 0.5) * 30,
      priceChangePercentage24h: (Math.random() - 0.5) * 50,
      lastUpdated: new Date().toISOString(),
    }));

    return NextResponse.json({
      success: true, data: mockCoins,
      meta: { page: params.data.page, limit: params.data.limit, total: 1000, totalPages: 20, timestamp: new Date().toISOString(), requestId: crypto.randomUUID() }
    }, { headers: { "Cache-Control": "public, max-age=30" } });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch market data" }, { status: 500 });
  }
}