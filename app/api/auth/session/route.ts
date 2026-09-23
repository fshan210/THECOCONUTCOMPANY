import { getCustomerSession } from "@/lib/customer/auth";
import { privateJson } from "@/lib/security/http";

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

  return privateJson({ authenticated: Boolean(user), user });
}
