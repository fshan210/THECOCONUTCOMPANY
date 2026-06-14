import Link from "next/link";
import type { Metadata } from "next";
import { Bell } from "lucide-react";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";
import { productCategories } from "@/lib/catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Sign Up",
  description: "Join .CO early access for product launches, saved products and brand updates.",
  path: "/sign-up"
});

export default function SignUpPage() {
  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sign Up", path: "/sign-up" }]} />
      <section className="mx-auto grid max-w-5xl place-items-center px-5 py-24 md:px-8">
        <div className="w-full border border-shell bg-porcelain p-6 shadow-soft md:p-10">
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Early access</p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl">Join the .CO launch circle.</h1>
          <p className="mt-5 max-w-2xl text-sm leading-7 text-muted">
            Create interest for product drops, recipes, and future member features. Supabase Auth wiring is ready for activation.
          </p>
          <form className="mt-8 grid gap-4 md:grid-cols-2" data-analytics-form="newsletter">
            <input type="text" placeholder="Name" className="border border-shell bg-paper px-4 py-4 text-sm text-ink outline-none focus:border-coconut" />
            <input type="email" placeholder="Email" className="border border-shell bg-paper px-4 py-4 text-sm text-ink outline-none focus:border-coconut" />
            <select className="border border-shell bg-paper px-4 py-4 text-sm text-ink outline-none focus:border-coconut md:col-span-2">
              {productCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
            <button type="button" className="inline-flex items-center justify-center gap-3 bg-ink px-6 py-4 text-sm text-paper md:col-span-2">
              Notify Me <Bell size={16} />
            </button>
          </form>
          <p className="mt-8 text-sm text-muted">
            Already joined?{" "}
            <Link href="/sign-in" className="text-coconut underline underline-offset-4">
              Sign in
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
