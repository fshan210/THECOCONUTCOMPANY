import { resolveDeployment } from "@/lib/deployment/environment.mjs";
import { getCustomerSession } from "@/lib/customer/auth";
import { privateJson } from "@/lib/security/http";

/**
 * A deliberately small BFF session read. The browser can learn whether a
 * session exists and display the profile name, but never receives Cognito or
 * session tokens from this endpoint.
 */
export async function GET() {
  const started = performance.now();
  const session = await getCustomerSession();
  const auth = performance.now() - started;
  const user = session
    ? {
        name: session.name,
        email: session.email,
        initials: session.initials,
        emailVerified: session.emailVerified,
        accountStatus: session.accountStatus
      }
    : null;

  const headers = resolveDeployment().environment !== "production"
    ? { "server-timing": `auth;dur=${auth.toFixed(1)}, total;dur=${(performance.now() - started).toFixed(1)}` }
    : undefined;
  return privateJson({ authenticated: Boolean(user), user }, { headers });
}
