import Image from "next/image";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { CustomerRegisterForm } from "@/components/auth/CustomerAuthForms";
import { FloatingDoodleLayer } from "@/components/BrandDoodles";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

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
      <section className="relative overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_50%,rgba(74,111,74,0.18)_100%)] px-5 py-16 md:px-8 md:py-24">
        <FloatingDoodleLayer density="light" />
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="co-glass p-6 md:p-10">
            <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Create account</p>
            <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl">Build your coconut ritual library.</h1>
            <p className="mt-5 text-base leading-8 text-muted">A warm customer account for favourite products, saved recipes, newsletter preferences, and launch orders.</p>
            <CustomerRegisterForm />
          </div>
          <div className="relative hidden min-h-[560px] lg:block">
            <Image src="/assets/transparent/co-tender-coconut.webp" alt="Tender coconut" fill priority sizes="38vw" className="object-contain drop-shadow-[0_34px_54px_rgba(62,46,31,0.24)]" />
          </div>
        </div>
      </section>
    </>
  );
}
