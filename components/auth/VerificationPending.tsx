"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { CheckCircle2, Loader2, MailCheck, RotateCcw } from "lucide-react";
import { reload, sendEmailVerification } from "firebase/auth";
import type { CustomerSession } from "@/lib/customer/auth-config";
import { establishCustomerSession } from "@/lib/customer/actions";
import { getFirebaseClientAuth } from "@/lib/firebase/client";

export function VerificationPending({ session }: { session: CustomerSession }) {
  const [message, setMessage] = useState("We sent a verification link to your inbox. Verify your email to open your orders, wishlist, saved recipes, and profile tools.");
  const [ok, setOk] = useState(false);
  const [pending, startTransition] = useTransition();

  function resend() {
    startTransition(async () => {
      try {
        const user = getFirebaseClientAuth().currentUser;
        if (!user) {
          setOk(false);
          setMessage("Please log in again, then resend the verification email.");
          return;
        }
        await sendEmailVerification(user);
        setOk(true);
        setMessage("Verification email sent again. Check your inbox and spam folder.");
      } catch (error) {
        setOk(false);
        setMessage(error instanceof Error ? error.message.replace("Firebase: ", "") : "Could not resend verification email.");
      }
    });
  }

  function refreshStatus() {
    startTransition(async () => {
      try {
        const user = getFirebaseClientAuth().currentUser;
        if (!user) {
          setOk(false);
          setMessage("Please log in again after opening the verification link.");
          return;
        }
        await reload(user);
        const idToken = await user.getIdToken(true);
        await establishCustomerSession({ idToken });
      } catch (error) {
        setOk(false);
        setMessage(error instanceof Error ? error.message.replace("Firebase: ", "") : "Could not refresh verification status.");
      }
    });
  }

  return (
    <section className="co-section bg-[var(--co-cream)] pt-24 md:pt-32">
      <div className="co-container max-w-3xl rounded-[36px] border border-[var(--co-border)] bg-[var(--co-white)] p-6 text-center shadow-[0_18px_48px_rgba(58,36,22,0.065)] md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-[var(--co-palm)]/10 text-[var(--co-palm)]">
          <MailCheck size={28} />
        </div>
        <p className="co-label mt-7">Verification pending</p>
        <h1 className="mt-4 text-[clamp(48px,7vw,92px)] font-bold leading-[0.86] text-[var(--co-ink)]">Confirm your .CO account.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-[var(--co-muted)]">
          {session.email}
        </p>
        <div className={`mx-auto mt-6 max-w-xl rounded-[28px] border px-4 py-3 text-sm leading-6 ${ok ? "border-[var(--co-palm)]/20 bg-[var(--co-palm)]/10 text-[var(--co-palm)]" : "border-[var(--co-border)] bg-[var(--co-cream)] text-[var(--co-brown)]"}`}>
          {message}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" disabled={pending} onClick={resend} className="co-admin-primary-button">
            {pending ? <Loader2 className="animate-spin" size={18} /> : <RotateCcw size={18} />}
            Resend email
          </button>
          <button type="button" disabled={pending} onClick={refreshStatus} className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-[var(--co-border)] bg-[var(--co-white)] px-5 text-sm font-bold text-[var(--co-brown)]">
            {pending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
            I verified
          </button>
        </div>
        <Link href="/" className="mt-7 inline-flex text-sm font-medium text-coconut underline underline-offset-4">
          Continue browsing
        </Link>
      </div>
    </section>
  );
}
