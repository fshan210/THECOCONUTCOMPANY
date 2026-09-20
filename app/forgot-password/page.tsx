import type { Metadata } from "next";
import { AuthShell, CustomerForgotPasswordForm } from "@/components/auth/CustomerAuthForms";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Reset Password", description: "Reset your .CO account password.", path: "/forgot-password", index: false });

export default function ForgotPasswordPage() { return <AuthShell variant="forgot" eyebrow="The gentle reset" title={<>Even the most<br/>mindful among us<br/><em>forget things.</em></>} description="It happens. Let’s get you back to the good stuff — recipes, products and a more thoughtful way of living."><CustomerForgotPasswordForm/></AuthShell>; }
