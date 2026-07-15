import { NextResponse } from "next/server";
import { getCustomerSession } from "@/lib/customer/auth";

/**
 * A deliberately small BFF session read. The browser can learn whether a
 * session exists and display the profile name, but never receives Cognito or
 * session tokens from this endpoint.
 */
export async function GET() {
  const session = await getCustomerSession();
  const user = session
    ? {
        name: session.name,
        email: session.email,
        initials: session.initials,
        emailVerified: session.emailVerified,
        accountStatus: session.accountStatus
      }
    : null;

  return NextResponse.json(
    { authenticated: Boolean(user), user },
    { headers: { "Cache-Control": "private, no-store, max-age=0" } }
  );
}
