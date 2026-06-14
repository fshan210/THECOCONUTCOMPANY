import Link from "next/link";
import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { isSupabaseAuthConfigured } from "@/lib/auth/supabase-auth";

export const metadata: Metadata = createPageMetadata({
  title: "Sign In",
  description: "Sign in to your .CO account for saved products and early access interest.",
  path: "/sign-in"
});

export default function SignInPage() {
  const configured = isSupabaseAuthConfigured();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sign In", path: "/sign-in" }]} />
      <section className="co-wave-edge relative mx-auto grid min-h-[70vh] max-w-5xl place-items-center overflow-hidden px-5 py-24 md:px-8">
        <div className="co-glass w-full max-w-xl p-6 md:p-10">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Account</p>
          <h1 className="font-display text-5xl text-ink md:text-6xl">Sign in to .CO</h1>
          <p className="mt-5 text-sm leading-7 text-muted">
            Email and magic link authentication is prepared for Supabase Auth. It will activate when Supabase public keys are configured.
          </p>
          <form className="mt-8 space-y-4" data-analytics-form="newsletter">
            <label className="block text-xs uppercase tracking-editorial text-muted" htmlFor="email">
              Email
            </label>
            <input
              id="email"
              type="email"
              placeholder="you@example.com"
              className="co-neu-inset w-full px-4 py-4 text-sm text-ink outline-none focus:border-coconut"
            />
            <button type="button" className="co-button-soft inline-flex w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-sm text-paper">
              Send magic link <Mail size={16} />
            </button>
          </form>
          <p className="mt-6 text-xs leading-6 text-muted">
            Auth status: {configured ? "Supabase environment is configured." : "Supabase environment is not configured yet."}
          </p>
          <p className="mt-8 text-sm text-muted">
            New here?{" "}
            <Link href="/sign-up" className="text-coconut underline underline-offset-4">
              Create early access account
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
