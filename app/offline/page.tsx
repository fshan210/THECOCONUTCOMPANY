import type { Metadata } from "next";
import { StatePanel } from "@/components/launch/StatePanel";

export const metadata: Metadata = { title: "Offline", robots: { index: false, follow: false } };

export default function OfflinePage() {
  return <main className="grid min-h-[72vh] place-items-center bg-[#f8f4ec] px-4 py-12"><div className="w-full max-w-[680px]"><StatePanel kind="offline" eyebrow="Connection paused" title="The grove is briefly offline." body="Your saved choices remain on this device. Reconnect, then return to the .CO world." primary={{ label: "Try home again", href: "/" }} secondary={{ label: "Visit your shelf", href: "/cart" }} /></div></main>;
}
