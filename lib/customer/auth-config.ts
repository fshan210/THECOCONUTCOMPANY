export const customerSessionCookie = "co-customer-session";

export type CustomerSession = {
  uid: string;
  email: string;
  name: string;
  initials: string;
  emailVerified: boolean;
  issuedAt: number;
  expiresAt: number;
};
