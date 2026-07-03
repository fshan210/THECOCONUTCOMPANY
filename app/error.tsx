"use client";

import { StatePanel } from "@/components/launch/StatePanel";

export default function ErrorPage({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  void error;
  return <main className="grid min-h-[72vh] place-items-center bg-[#f8f4ec] px-4 py-12"><div className="w-full max-w-[680px]"><StatePanel kind="error" eyebrow="Something slipped" title="Let’s set this coconut upright." body="The page hit an unexpected problem. Your account and saved shelf have not been changed." onPrimary={{ label: "Try again", action: reset }} secondary={{ label: "Back home", href: "/" }} /></div></main>;
}
