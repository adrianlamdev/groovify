import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function generateToken(): string {
  // Generate random values using Web Crypto API
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (byte) => byte.toString(16).padStart(2, "0")).join(
    "",
  );
}

async function createHash(message: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return hashHex;
}

export async function GET() {
  const cookieStore = await cookies();

  // Generate a new CSRF token
  const csrfToken = generateToken();

  // Hash the token before storing it in the cookie
  const hashedToken = await createHash(csrfToken + process.env.CSRF_SECRET!);

  // Set the cookie with the hashed token
  cookieStore.set("csrf_token", hashedToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
  });

  return NextResponse.json(
    { csrfToken },
    {
      status: 200,
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
        Pragma: "no-cache",
      },
    },
  );
}
