"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import type { CustomerSession } from "@/lib/customer/auth-config";

const CustomerAuthContext = createContext<CustomerSession | null>(null);

type SafeSessionResponse = {
  authenticated: boolean;
  user: Pick<CustomerSession, "name" | "email" | "initials" | "emailVerified" | "accountStatus"> | null;
};

function toCustomerSession(user: SafeSessionResponse["user"]): CustomerSession | null {
  if (!user) return null;
  return {
    ...user,
    // These values are intentionally not exposed by the client BFF response.
    // The server layout remains the authority for them.
    uid: "customer-session",
    issuedAt: 0,
    expiresAt: 0
  };
}

export function CustomerAuthProvider({ session, children }: { session: CustomerSession | null; children: React.ReactNode }) {
  const [currentSession, setCurrentSession] = useState<CustomerSession | null>(session);

  // A server navigation (including the logout server action) is authoritative
  // and should replace a previously refreshed client-side value.
  useEffect(() => {
    setCurrentSession(session);
  }, [session]);

  const refreshSession = useCallback(async () => {
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin" });
      if (!response.ok) return;
      const result = await response.json() as SafeSessionResponse;
      setCurrentSession(result.authenticated ? toCustomerSession(result.user) : null);
    } catch {
      // Keep the server-rendered session if a transient network error occurs.
    }
  }, []);

  useEffect(() => {
    const handleAuthChange = () => { void refreshSession(); };
    const handleVisibility = () => {
      if (document.visibilityState === "visible") void refreshSession();
    };

    window.addEventListener("co-auth-changed", handleAuthChange);
    window.addEventListener("focus", handleAuthChange);
    document.addEventListener("visibilitychange", handleVisibility);
    return () => {
      window.removeEventListener("co-auth-changed", handleAuthChange);
      window.removeEventListener("focus", handleAuthChange);
      document.removeEventListener("visibilitychange", handleVisibility);
    };
  }, [refreshSession]);

  return <CustomerAuthContext.Provider value={currentSession}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerSession() {
  return useContext(CustomerAuthContext);
}
