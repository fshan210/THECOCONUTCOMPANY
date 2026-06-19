export const customerSessionCookie = process.env.SESSION_COOKIE_NAME || "co_session";

export type CustomerAccountStatus = "pending" | "active" | "suspended" | "deleted";

export type CustomerSession = {
  uid: string;
  email: string;
  name: string;
  initials: string;
  emailVerified: boolean;
  accountStatus: CustomerAccountStatus;
  issuedAt: number;
  expiresAt: number;
};
