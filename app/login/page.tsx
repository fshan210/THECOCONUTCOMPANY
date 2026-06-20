import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { Droplets, Heart, ShieldCheck } from "lucide-react";
import { CustomerLoginForm } from "@/components/auth/CustomerAuthForms";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

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
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.bottle} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-center">
          <Appear className="rounded-3xl border border-coconut/10 bg-[#fff8ea] p-6 shadow-[0_18px_48px_rgba(62,46,31,0.06)] md:p-10">
            <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Customer login</p>
            <h1 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Welcome back to your .CO space.</h1>
            <p className="mt-5 text-base leading-8 text-coconut/70">Save products, revisit recipes, and keep your coconut rituals close.</p>
            <CustomerLoginForm />
          </Appear>
          <Appear delay={0.1} className="relative min-h-[520px] overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] shadow-[0_18px_48px_rgba(62,46,31,0.06)]">
            <Image src={publicAssets.water.lifestyle} alt=".CO coconut water lifestyle" fill priority sizes="(min-width: 1024px) 48vw, 92vw" className="object-cover" />
            <div className="absolute bottom-6 left-6 right-6 grid gap-3 md:grid-cols-3">
              {[
                ["Wishlist", Heart],
                ["Hydration", Droplets],
                ["Private", ShieldCheck]
              ].map(([label, Icon]) => {
                const TypedIcon = Icon as typeof Heart;
                return <span key={label as string} className="rounded-2xl bg-coconut/86 px-4 py-3 text-sm text-paper backdrop-blur-xl"><TypedIcon className="mb-2" size={16} />{label as string}</span>;
              })}
            </div>
          </Appear>
        </div>
      </PublicSection>
    </>
  );
}
