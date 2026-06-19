"use client";

import { createContext, useContext } from "react";

const AdminPathContext = createContext("/control-center");

export function AdminPathProvider({ basePath, children }: { basePath: string; children: React.ReactNode }) {
  return <AdminPathContext.Provider value={basePath}>{children}</AdminPathContext.Provider>;
}

export function buildAdminHref(basePath: string, path = "") {
  const normalizedBase = basePath.replace(/\/+$/, "");
  const suffix = path ? `/${path.replace(/^\/+/, "")}` : "";
  return `${normalizedBase}${suffix}`;
}

export function useAdminBasePath() {
  return useContext(AdminPathContext);
}

export function useAdminHref(path = "") {
  return buildAdminHref(useAdminBasePath(), path);
}
