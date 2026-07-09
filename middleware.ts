import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function middleware(request: NextRequest) {
  const response = NextResponse.next();
  response.headers.set('X-Request-ID', crypto.randomUUID());
  return response;
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\.ico|sitemap\.xml|robots\.txt).*)'],
};
