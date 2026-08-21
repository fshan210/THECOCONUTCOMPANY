"use client";

import Link from "next/link";
import { ArrowRight, Check, Mail, Store } from "lucide-react";
import { useId, useState } from "react";
import { trackEvent } from "@/lib/analytics/events";
import { cn } from "@/lib/utils";

type CartInterestHandoffProps = {
  variant?: "drawer" | "page";
  productSlugs?: string[];
  productCategories?: string[];
};

type SubmissionStatus = "idle" | "saving" | "saved" | "error";

export function CartInterestHandoff({
  variant = "page",
  productSlugs = [],
  productCategories = [],
}: CartInterestHandoffProps) {
  const fieldId = useId();
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [status, setStatus] = useState<SubmissionStatus>("idle");
  const [message, setMessage] = useState("");
  const compact = variant === "drawer";

  return (
    <section
      aria-labelledby={`${fieldId}-title`}
      className={cn(
        "rounded-[24px] border border-[#214d2b]/12 bg-[linear-gradient(145deg,rgba(255,255,255,.76),rgba(229,240,223,.7))] shadow-[inset_0_1px_0_rgba(255,255,255,.82),0_14px_34px_rgba(58,36,22,.06)]",
        compact ? "p-4" : "p-5 md:p-6"
      )}
    >
      <div className={cn(!compact && "max-w-xl")}>
        <p className="co-label flex items-center gap-2 text-[#214d2b]">
          <Mail size={12} aria-hidden="true" />
          Launch handoff
        </p>
        <h2
          id={`${fieldId}-title`}
          className={cn(
            "mt-2 font-['Cormorant_Garamond'] leading-none tracking-[-.035em] text-[#2a1b13]",
            compact ? "text-[1.75rem]" : "text-[2.4rem] md:text-[3rem]"
          )}
        >
          Hear when your shelf is ready.
        </h2>
        <p className={cn("mt-2 leading-5 text-[#655b52]", compact ? "text-[11px]" : "text-sm")}>
          Join for launch and product updates. This does not place an order or reserve stock.
        </p>
      </div>

      {status === "saved" ? (
        <div className="mt-4 flex items-start gap-3 rounded-[18px] bg-[#214d2b] p-4 text-white" role="status">
          <span className="mt-0.5 grid size-7 shrink-0 place-items-center rounded-full bg-white/14">
            <Check size={15} aria-hidden="true" />
          </span>
          <div>
            <p className="text-sm font-semibold">Interest received.</p>
            <p className="mt-1 text-[11px] leading-5 text-white/75">
              We saved your email preference, not an order or reservation.
            </p>
          </div>
        </div>
      ) : (
        <form
          className="mt-4"
          data-analytics-form="newsletter"
          onSubmit={async (event) => {
            event.preventDefault();
            if (!event.currentTarget.reportValidity() || !consent) {
              setStatus("error");
              setMessage("Please enter a valid email and agree to receive .CO updates.");
              return;
            }

            setStatus("saving");
            setMessage("");
            try {
              const response = await fetch("/api/newsletter", {
                method: "POST",
                headers: { "content-type": "application/json" },
                body: JSON.stringify({
                  email: email.trim().toLowerCase(),
                  source: compact ? "cart_drawer_early_access" : "cart_page_early_access",
                  consent,
                  favouriteProduct: productSlugs[0]?.slice(0, 100) || undefined,
                  interestedCategory: Array.from(new Set(productCategories)).join(", ").slice(0, 100) || undefined,
                  honeypot: "",
                }),
              });
              const payload = (await response.json().catch(() => null)) as { ok?: boolean; message?: string } | null;
              if (!response.ok || !payload?.ok) {
                throw new Error(payload?.message || "We could not save your interest right now.");
              }
              setStatus("saved");
              trackEvent("waitlist_submit", { status: "success", source: compact ? "cart_drawer" : "cart_page" });
            } catch (error) {
              setStatus("error");
              setMessage(error instanceof Error ? error.message : "We could not save your interest right now.");
              trackEvent("waitlist_submit", { status: "error", source: compact ? "cart_drawer" : "cart_page" });
            }
          }}
        >
          <label htmlFor={fieldId} className="text-[11px] font-semibold text-[#2a1b13]">
            Email address
          </label>
          <div className={cn("mt-2 grid gap-2", !compact && "sm:grid-cols-[1fr_auto]")}>
            <input
              id={fieldId}
              type="email"
              required
              autoComplete="email"
              inputMode="email"
              value={email}
              onChange={(event) => {
                setEmail(event.target.value);
                setStatus("idle");
                setMessage("");
              }}
              aria-describedby={`${fieldId}-help ${fieldId}-status`}
              aria-invalid={status === "error"}
              className="min-h-12 min-w-0 rounded-[15px] border border-[#35271e]/14 bg-white/82 px-4 text-sm text-[#2a1b13] outline-none transition placeholder:text-[#74685e] focus:border-[#214d2b] focus:ring-4 focus:ring-[#214d2b]/10"
              placeholder="you@example.com"
            />
            <button
              type="submit"
              disabled={status === "saving"}
              className="co-press inline-flex min-h-12 items-center justify-center gap-2 whitespace-nowrap rounded-[15px] bg-[#214d2b] px-5 text-[10px] font-semibold uppercase tracking-[.06em] text-white shadow-[0_10px_22px_rgba(33,77,43,.2)] transition hover:bg-[#183b20] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b] disabled:cursor-wait disabled:opacity-65"
            >
              {status === "saving" ? "Joining..." : "Join early access"}
              {status !== "saving" ? <ArrowRight size={14} aria-hidden="true" /> : null}
            </button>
          </div>
          <label className="mt-3 flex min-h-11 cursor-pointer items-start gap-3 text-[10px] leading-5 text-[#655b52]">
            <input
              type="checkbox"
              required
              checked={consent}
              onChange={(event) => {
                setConsent(event.target.checked);
                setStatus("idle");
                setMessage("");
              }}
              className="mt-1 size-4 shrink-0 accent-[#214d2b] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"
            />
            <span id={`${fieldId}-help`}>
              I agree to receive .CO launch and product emails. I can unsubscribe at any time.
            </span>
          </label>
          <p
            id={`${fieldId}-status`}
            className={cn("min-h-5 text-[10px] leading-5", status === "error" ? "text-[#8a3028]" : "text-[#214d2b]")}
            role="status"
            aria-live="polite"
          >
            {message}
          </p>
        </form>
      )}

      <div className="mt-4 border-t border-[#214d2b]/10 pt-4">
        <div className="flex items-start gap-3">
          <span className="grid size-9 shrink-0 place-items-center rounded-full bg-white/70 text-[#214d2b]">
            <Store size={16} aria-hidden="true" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-[#2a1b13]">Stockist or hospitality interest?</p>
            <p className="mt-1 text-[10px] leading-5 text-[#655b52]">
              The contact route prepares an email in your mail app. It does not store a trade enquiry on this site.
            </p>
            <Link
              href="/contact#contact-form"
              className="mt-2 inline-flex min-h-11 items-center gap-2 text-[10px] font-semibold uppercase tracking-[.06em] text-[#214d2b] underline decoration-[#214d2b]/30 underline-offset-4 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]"
            >
              Start stockist enquiry <ArrowRight size={13} aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
