import { NextRequest, NextResponse } from "next/server";

export function middleware(request: NextRequest) {
  // Handle CORS preflight requests
  if (request.method === "OPTIONS") {
    return new NextResponse(null, {
      status: 204,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization, RSC",
        "Access-Control-Max-Age": "86400",
      },
    });
  }

  // Add CORS headers to all responses
  const response = NextResponse.next();
  response.headers.set("Access-Control-Allow-Origin", "*");
  response.headers.set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  response.headers.set("Access-Control-Allow-Headers", "Content-Type, Authorization, RSC");

  return response;
}

// Apply middleware to all routes
export const config = {
  matcher: "/:path*",
};
