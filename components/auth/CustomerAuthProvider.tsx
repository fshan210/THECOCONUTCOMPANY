"use client";

import { createContext, useContext } from "react";
import type { CustomerSession } from "@/lib/customer/auth-config";

const CustomerAuthContext = createContext<CustomerSession | null>(null);

export function CustomerAuthProvider({ session, children }: { session: CustomerSession | null; children: React.ReactNode }) {
  return <CustomerAuthContext.Provider value={session}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerSession() {
  return useContext(CustomerAuthContext);
}
