import type { ReactNode } from "react";
import { PersistentAccountShell } from "@/components/account/AccountShell";
export default function AccountLayout({ children }: { children: ReactNode }) {
  return <PersistentAccountShell>{children}</PersistentAccountShell>;
}
