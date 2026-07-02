"use client";

import { Check, Send } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function NewsletterForm({ className, compact = false }: { className?: string; compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "saved">("idle");

  return (
    <form
      data-analytics-form="newsletter"
      className={cn("relative", className)}
      onSubmit={(event) => {
        event.preventDefault();
        if (!event.currentTarget.reportValidity()) return;
        setStatus("saving");
        window.localStorage.setItem("co_newsletter_email", email.trim().toLowerCase());
        window.setTimeout(() => setStatus("saved"), 350);
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
          {status === "saved" ? "Joined" : status === "saving" ? "Joining…" : "Subscribe"}
        </button>
      </div>
      <p id={`${compact ? "footer-" : ""}newsletter-status`} className="mt-2 min-h-4 text-[9px] text-current/65" role="status" aria-live="polite">
        {status === "saved" ? "You’re on the list. Welcome to .CO." : ""}
      </p>
    </form>
  );
}
