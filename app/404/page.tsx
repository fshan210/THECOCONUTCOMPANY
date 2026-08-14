import type { Metadata } from "next";
import NotFound from "@/app/not-found";

export const metadata: Metadata = {
  title: "Page not found | .CO The Coconut Company",
  robots: { index: false, follow: false },
};

export default function ExplicitNotFoundPage() {
  return <NotFound />;
}
