import type { Metadata } from "next";
import { AuthShell, CustomerForgotPasswordForm } from "@/components/auth/CustomerAuthForms";
import { StructuredData } from "@/components/seo/StructuredData";
import { createPageMetadata } from "@/lib/seo/metadata";

export const metadata: Metadata = createPageMetadata({ title: "Reset Password", description: "Reset your .CO account password.", path: "/forgot-password", index: false });

export default function ForgotPasswordPage() { return <><StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Reset password", path: "/forgot-password" }]} /><AuthShell eyebrow="Password reset" title="Let’s get you back in." description="Enter your account email and we’ll send a secure six-digit reset code."><CustomerForgotPasswordForm/></AuthShell></>; }
