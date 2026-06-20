import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerRegisterForm } from "@/components/auth/CustomerAuthForms";
import { Appear } from "@/components/motion/Appear";
import { DoodleImage, PublicSection } from "@/components/PublicDesign";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";
import { publicAssets } from "@/lib/public-assets";

export const metadata: Metadata = createPageMetadata({
  title: "Register",
  description: "Create your .CO customer account.",
  path: "/register"
});

export default async function RegisterPage() {
  const session = await getCustomerSession();
  if (session) redirect("/account");

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Register", path: "/register" }]} />
      <PublicSection className="pt-28 md:pt-32">
        <DoodleImage src={publicAssets.doodles.rawCoconut} className="right-8 top-20 h-36 w-36 md:h-56 md:w-56" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <Appear className="rounded-3xl border border-coconut/10 bg-[#fff8ea] p-6 shadow-[0_18px_48px_rgba(62,46,31,0.06)] md:p-10">
            <p className="mb-5 text-[0.72rem] font-medium uppercase tracking-editorial text-grove">Create account</p>
            <h1 className="font-display text-5xl font-light leading-tight text-coconut md:text-7xl">Build your coconut ritual library.</h1>
            <p className="mt-5 text-base leading-8 text-coconut/70">A warm customer account for favourite products, saved recipes, and gentle .CO notes.</p>
            <CustomerRegisterForm />
          </Appear>
          <Appear delay={0.1} className="relative hidden min-h-[560px] overflow-hidden rounded-3xl border border-coconut/10 bg-[#fff8ea] shadow-[0_18px_48px_rgba(62,46,31,0.06)] lg:block">
            <Image src={publicAssets.water.hero} alt=".CO coconut water story" fill priority sizes="38vw" className="object-contain p-8 drop-shadow-[0_34px_54px_rgba(62,46,31,0.18)]" />
          </Appear>
        </div>
      </PublicSection>
    </>
  );
}
