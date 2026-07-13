import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AuthShell, CustomerLoginForm } from "@/components/auth/CustomerAuthForms";
import { StructuredData } from "@/components/seo/StructuredData";
import { safeReturnTo } from "@/lib/auth/verification-state";
import { getCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Sign In", description: "Sign in to your .CO customer account.", path: "/login", index: false });

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ redirect?: string }> }) {
  const { redirect: returnTo } = await searchParams;
  if (await getCustomerSession()) redirect(safeReturnTo(returnTo));
  return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Sign in", path: "/login" }]} /><AuthShell eyebrow="Customer account" title="Welcome back." description="Sign in to keep your favourites, saved recipes, and .CO shelf close."><CustomerLoginForm/></AuthShell></>;
}
