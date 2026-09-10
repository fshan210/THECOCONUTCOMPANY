import type { Metadata } from "next";
import { RecoverySurface } from "@/components/commerce/RecoverySurface";
export const metadata: Metadata = {
  title: "Offline",
  robots: { index: false, follow: false },
};
export default function OfflinePage() {
  return <RecoverySurface kind="offline" />;
}
