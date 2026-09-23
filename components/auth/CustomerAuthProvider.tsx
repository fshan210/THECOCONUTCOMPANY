"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
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
  const generationRef = useRef(0);
  const requestRef = useRef<AbortController | null>(null);
  const serverScope = session ? session.email.toLowerCase() + ":" + session.expiresAt : "guest";
  const serverScopeRef = useRef(serverScope);
  if (serverScopeRef.current !== serverScope) {
    serverScopeRef.current = serverScope;
    generationRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
  }

  // A server navigation (including the logout server action) is authoritative
  // and should replace a previously refreshed client-side value.
  useEffect(() => {
    generationRef.current += 1;
    requestRef.current?.abort();
    requestRef.current = null;
    setCurrentSession(session);
  }, [serverScope, session]);

  const refreshSession = useCallback(async () => {
    const generation = generationRef.current + 1;
    generationRef.current = generation;
    requestRef.current?.abort();
    const controller = new AbortController();
    requestRef.current = controller;
    try {
      const response = await fetch("/api/auth/session", { cache: "no-store", credentials: "same-origin", signal: controller.signal });
      if (!response.ok) return;
      const result = await response.json() as SafeSessionResponse;
      if (generationRef.current !== generation) return;
      setCurrentSession(result.authenticated ? toCustomerSession(result.user) : null);
    } catch {
      // Keep the server-rendered session if a transient network error occurs.
    } finally {
      if (generationRef.current === generation) requestRef.current = null;
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
      generationRef.current += 1;
      requestRef.current?.abort();
      requestRef.current = null;
    };
  }, [refreshSession]);

  return <CustomerAuthContext.Provider value={currentSession}>{children}</CustomerAuthContext.Provider>;
}

export function useCustomerSession() {
  return useContext(CustomerAuthContext);
}
