import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Helper function to create SHA-256 hash using Web Crypto API
async function createHash(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function middleware(request: NextRequest) {
  // Only check CSRF for POST requests
  if (request.method === "POST") {
    const csrfToken = request.headers.get("x-csrf-token");
    const csrfCookie = request.cookies.get("csrf_token");

    // If either is missing, reject the request
    if (!csrfToken || !csrfCookie) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 },
      );
    }

    // Hash the token from the request header
    const hashedToken = await createHash(csrfToken + process.env.CSRF_SECRET!);

    // Compare with the cookie value
    if (hashedToken !== csrfCookie.value) {
      return NextResponse.json(
        { error: "Invalid CSRF token" },
        { status: 403 },
      );
    }
  }

  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: "/api/v1/:path*", // Apply to all API routes
};
