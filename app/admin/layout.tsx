import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin OS | .CO The Coconut Company",
  description: "Internal operating system for .CO The Coconut Company.",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false
    }
  }
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return children;
}
