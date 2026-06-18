export const customerSessionCookie = "co-customer-session";

export type CustomerSession = {
  email: string;
  name: string;
  initials: string;
  issuedAt: number;
  expiresAt: number;
};
