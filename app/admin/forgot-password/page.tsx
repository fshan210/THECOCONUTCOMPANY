import Image from "next/image";
import Link from "next/link";
import { AdminForgotPasswordForm } from "@/components/admin/AdminForms";
import { isAdminAuthConfigured } from "@/lib/admin/auth";
import { getAdminPath } from "@/lib/admin/path";

export default function AdminForgotPasswordPage() {
  const configured = isAdminAuthConfigured();

  return (
    <section className="relative grid min-h-dvh place-items-center overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_52%,rgba(168,176,123,0.3)_100%)] px-5 py-10">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[34vw] opacity-[0.08]" />
      <div className="co-glass w-full max-w-xl p-6 md:p-10">
        <Link href="/" className="mb-10 block w-28">
          <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={124} height={100} priority className="h-auto w-full" />
        </Link>
        <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Admin recovery</p>
        <h1 className="font-display text-5xl leading-tight text-ink md:text-6xl">Request password reset.</h1>
        <p className="mt-5 text-sm leading-7 text-muted">
          This validates admin identity and is ready to connect to the configured transactional email provider.
        </p>
        <AdminForgotPasswordForm configured={configured} />
        <Link href={getAdminPath("login")} className="mt-6 inline-flex text-sm text-coconut underline underline-offset-4">
          Return to secure login
        </Link>
      </div>
    </section>
  );
}
