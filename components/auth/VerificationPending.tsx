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
    <section className="relative overflow-hidden bg-paper px-5 py-16 md:px-8 md:py-24">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-80 opacity-[0.08]" />
      <div className="co-glass mx-auto max-w-3xl p-6 text-center md:p-10">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-grove/12 text-grove">
          <MailCheck size={28} />
        </div>
        <p className="mt-7 text-[0.72rem] uppercase tracking-editorial text-grove">Verification pending</p>
        <h1 className="mt-4 font-display text-5xl leading-tight text-ink md:text-7xl">Confirm your .CO account.</h1>
        <p className="mx-auto mt-5 max-w-xl text-sm leading-7 text-muted">
          {session.email}
        </p>
        <div className={`mx-auto mt-6 max-w-xl rounded-lg border px-4 py-3 text-sm leading-6 ${ok ? "border-grove/20 bg-grove/10 text-grove" : "border-coconut/12 bg-paper/72 text-coconut"}`}>
          {message}
        </div>
        <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
          <button type="button" disabled={pending} onClick={resend} className="co-admin-primary-button">
            {pending ? <Loader2 className="animate-spin" size={18} /> : <RotateCcw size={18} />}
            Resend email
          </button>
          <button type="button" disabled={pending} onClick={refreshStatus} className="co-neu inline-flex min-h-12 items-center justify-center gap-2 rounded-lg px-5 text-sm font-medium text-coconut">
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
