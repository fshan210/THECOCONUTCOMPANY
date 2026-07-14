"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";
import { trackNewsletterSignup } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  return (
    <form
      data-analytics-form="newsletter"
      className={cn("relative", className)}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!event.currentTarget.reportValidity() || !consent) return;
        setStatus("saving");
        try {
          const response = await fetch("/api/newsletter", {
            method: "POST",
            headers: { "content-type": "application/json" },
            body: JSON.stringify({ email: email.trim().toLowerCase(), source: compact ? "footer_newsletter" : "homepage_newsletter", consent, honeypot: "" })
          });
          const payload = await response.json().catch(() => null) as { ok?: boolean } | null;
          if (!response.ok || !payload?.ok) throw new Error("Newsletter request failed");
          setStatus("saved");
          trackNewsletterSignup("success");
        } catch {
          setStatus("error");
          trackNewsletterSignup("error");
        }
      }}
    >
      <label htmlFor={compact ? "footer-newsletter-email" : "newsletter-email"} className="sr-only">Email address</label>
      <div className="flex min-h-12 items-center overflow-hidden rounded-[13px] border border-black/8 bg-[#fffaf0] pl-4 text-[#2a1b13] shadow-sm">
        <input
          id={compact ? "footer-newsletter-email" : "newsletter-email"}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }}
          aria-describedby={`${compact ? "footer-" : ""}newsletter-status`}
          placeholder="Enter your email address"
          className="min-w-0 flex-1 bg-transparent py-3 text-xs outline-none"
        />
        <button type="submit" disabled={status === "saving"} className="co-primary-cta mr-1 inline-flex min-h-10 items-center justify-center gap-2 rounded-[10px] bg-[#304f2c] px-4 text-[9px] font-semibold uppercase text-white disabled:opacity-60 md:px-6">
          {status === "saved" ? <Check size={14} /> : <Send size={13} />}
          {status === "saved" ? "Joined" : status === "saving" ? "Joining…" : status === "error" ? "Try again" : "Subscribe"}
        </button>
      </div>
      <label className="mt-2 flex cursor-pointer items-start gap-2 text-[9px] leading-4 text-current/70">
        <input type="checkbox" checked={consent} onChange={(event) => { setConsent(event.target.checked); setStatus("idle"); }} className="mt-0.5 size-3 shrink-0 accent-[#214d2b]" />
        <span>I agree to receive .CO news and can unsubscribe at any time.</span>
      </label>
      <p id={`${compact ? "footer-" : ""}newsletter-status`} className="mt-2 min-h-4 text-[9px] text-current/65" role="status" aria-live="polite">
        {status === "saved" ? "You’re on the list. Welcome to .CO." : status === "error" ? "We could not save that on this device. Please try again." : ""}
      </p>
    </form>
  );
}
