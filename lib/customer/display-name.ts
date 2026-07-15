import type { CustomerSession } from "@/lib/customer/auth-config";

/**
 * Converts the limited, server-verified customer profile into the compact
 * greeting used in navigation. This deliberately never receives Cognito
 * tokens or unfiltered identity-provider attributes.
 */
export function customerGreeting(session: Pick<CustomerSession, "name" | "email"> | null) {
  const fullName = session?.name?.trim();
  if (fullName && !fullName.includes("@")) return fullName.split(/\s+/)[0] || "Member";

  const emailPrefix = session?.email?.split("@")[0]?.trim();
  if (emailPrefix) return emailPrefix;

  return "Member";
}
