import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Droplets, Heart, ShieldCheck } from "lucide-react";
import { CustomerLoginForm } from "@/components/auth/CustomerAuthForms";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({
  title: "Login",
  description: "Login to your .CO customer account.",
  path: "/login"
});

export default async function LoginPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Login", path: "/login" }]} />
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_46%,rgba(168,176,123,0.24)_100%)] px-5 py-16 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <div className="co-glass p-6 md:p-10">
            <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Customer login</p>
            <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl">Welcome back to your .CO space.</h1>
            <p className="mt-5 text-base leading-8 text-muted">Save products, revisit recipes, manage addresses, and keep your coconut rituals close.</p>
            <CustomerLoginForm />
          </div>
          <div className="co-glass relative min-h-[520px] overflow-hidden">
            <Image src="/assets/generated/composition-poolside.webp" alt=".CO coconut water lifestyle" fill priority sizes="(min-width: 1024px) 48vw, 92vw" className="object-contain p-8" />
            <div className="absolute bottom-6 left-6 right-6 grid gap-3 md:grid-cols-3">
              {[
                ["Wishlist", Heart],
                ["Hydration", Droplets],
                ["Private", ShieldCheck]
              ].map(([label, Icon]) => {
                const TypedIcon = Icon as typeof Heart;
                return <span key={label as string} className="rounded-lg bg-coconut/86 px-4 py-3 text-sm text-paper backdrop-blur-xl"><TypedIcon className="mb-2" size={16} />{label as string}</span>;
              })}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
