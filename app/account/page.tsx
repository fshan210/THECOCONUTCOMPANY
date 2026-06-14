import Link from "next/link";
import type { Metadata } from "next";
import { PalmLeafDoodle } from "@/components/BrandDoodles";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { isSupabaseAuthConfigured } from "@/lib/auth/supabase-auth";

export const metadata: Metadata = createPageMetadata({
  title: "Account",
  description: "Your .CO profile, saved products, early access interest and newsletter status.",
  path: "/account"
});

export default function AccountPage() {
  const configured = isSupabaseAuthConfigured();
  const sections = [
    { title: "Profile", body: "Name, email, and location fields will sync with Supabase Auth profiles." },
    { title: "Saved products", body: "Save .CO Water, MELT.CO and future product interests." },
    { title: "Early access interest", body: "Track which product categories you want to hear about first." },
    { title: "Newsletter status", body: "Manage launch notes, recipes, and distributor updates." }
  ];

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Account", path: "/account" }]} />
      <section className="relative overflow-hidden px-5 py-24 md:px-8">
        <PalmLeafDoodle className="co-brand-doodle absolute right-6 top-10 hidden w-44 text-grove md:block" />
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Account</p>
              <h1 className="font-display text-6xl leading-none text-ink md:text-8xl">Your .CO space.</h1>
              <p className="mt-6 max-w-2xl text-sm leading-7 text-muted">
                Protected account architecture is ready. Full session state will activate after Supabase Auth environment variables are configured.
              </p>
            </div>
            <Link href="/sign-in" className="inline-flex items-center justify-center bg-ink px-6 py-4 text-sm text-paper">
              Sign in
            </Link>
          </div>
          <div className="co-glass mb-6 p-5 text-sm text-muted">
            Auth status: {configured ? "Supabase environment is configured." : "Supabase environment is not configured yet."}
          </div>
          <div className="grid gap-5 md:grid-cols-4">
            {sections.map((section) => (
              <article key={section.title} className="co-glass p-6">
                <h2 className="font-display text-3xl text-ink">{section.title}</h2>
                <p className="mt-4 text-sm leading-7 text-muted">{section.body}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
