// Middleware for route protection
// This is a placeholder for testing - in a real app, this would check Supabase auth

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // For testing purposes, allow all routes
  // In a real implementation, this would check for authentication session
  return NextResponse.next();
}

// Configure which routes the middleware will run on
export const config = {
  matcher: [
    // Protect all dashboard routes
    '/((?!_next/static|_next/image|favicon.ico|public|api).*)',
  ],
};