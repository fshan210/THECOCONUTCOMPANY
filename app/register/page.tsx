import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell, CustomerRegisterForm } from "@/components/auth/CustomerAuthForms";
import { StructuredData } from "@/components/seo/StructuredData";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Create Account", description: "Create your .CO customer account.", path: "/register", index: false });

export default async function RegisterPage() {
  if (await getCustomerSession()) redirect("/account");
  return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Create account", path: "/register" }]} /><AuthShell eyebrow="Made for living" title="Create your .CO account." description="A calm place for favourites, thoughtful orders, and everyday coconut rituals."><CustomerRegisterForm/></AuthShell></>;
}
