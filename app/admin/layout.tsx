import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin OS | .CO The Coconut Company",
  description: "Internal operating system for .CO The Coconut Company."
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
