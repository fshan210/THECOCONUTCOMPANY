"use client";

import { Check, Send } from "lucide-react";
import { useId, useState } from "react";
import { trackNewsletterSignup } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className, compact = false }: { className?: string; compact?: boolean }) {
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");

  return (
    <form
      data-analytics-form="newsletter"
      className={cn("relative", className)}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!event.currentTarget.reportValidity() || !consent) {
          setStatus("error");
          return;
        }
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
      <label htmlFor={fieldId} className="sr-only">Email address</label>
      <div className={cn("co-newsletter-control", compact && "co-newsletter-control--compact")}>
        <input
          id={fieldId}
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(event) => { setEmail(event.target.value); setStatus("idle"); }}
          inputMode="email"
          aria-describedby={`${fieldId}-status`}
          aria-invalid={status === "error"}
          placeholder="Enter your email address"
          className="co-newsletter-input"
        />
        <button type="submit" disabled={status === "saving"} className="co-primary-cta co-newsletter-submit">
          {status === "saved" ? <Check size={14} /> : <Send size={13} />}
          {status === "saved" ? "Joined" : status === "saving" ? "Joining…" : status === "error" ? "Try again" : "Subscribe"}
        </button>
      </div>
      <label className="co-newsletter-consent">
        <input type="checkbox" required checked={consent} onChange={(event) => { setConsent(event.target.checked); setStatus("idle"); }} />
        <span>I agree to receive .CO news and can unsubscribe at any time.</span>
      </label>
      <p id={`${fieldId}-status`} className="co-newsletter-status" role="status" aria-live="polite">
        {status === "saved" ? "You’re on the list. Welcome to .CO." : status === "error" ? (!consent ? "Please agree to receive .CO news before subscribing." : "Please enter a valid email, or try again in a moment.") : ""}
      </p>
    </form>
  );
}
