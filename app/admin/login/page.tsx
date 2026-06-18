import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { CheckCircle2, LockKeyhole, ShieldCheck, Sparkles } from "lucide-react";
import { AdminLoginForm } from "@/components/admin/AdminForms";
import { createAdminCsrfToken, getAdminSession, isAdminAuthConfigured } from "@/lib/admin/auth";
import { getAdminPath } from "@/lib/admin/path";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect(getAdminPath());

  const configured = isAdminAuthConfigured();
  const csrfToken = createAdminCsrfToken();

  return (
    <section className="relative grid min-h-dvh overflow-hidden bg-[radial-gradient(circle_at_18%_12%,rgba(216,192,122,0.38),transparent_28%),linear-gradient(135deg,#fffdf8_0%,#F5EBD7_42%,rgba(74,111,74,0.24)_100%)] px-4 py-6 sm:px-6 lg:px-8">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[34vw] opacity-[0.1]" />
      <div className="pointer-events-none absolute left-8 top-20 hidden h-44 w-44 rounded-full border border-coconut/10 md:block" />
      <div className="mx-auto grid w-full max-w-7xl gap-8 lg:grid-cols-[0.88fr_1.12fr] lg:items-center">
        <div className="co-admin-login-panel relative z-10 p-6 sm:p-8 md:p-10">
          <Link href="/" className="mb-8 block w-28 rounded-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coconut">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={124} height={100} priority className="h-auto w-full" />
          </Link>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-grove/20 bg-grove/10 px-3 py-2 text-xs font-medium uppercase tracking-editorial text-grove">
            <LockKeyhole size={14} /> Secure internal access
          </div>
          <h1 className="font-display text-5xl leading-[0.98] text-coconut md:text-7xl">Enter the .CO operating system.</h1>
          <p className="mt-6 max-w-xl text-base leading-8 text-coconut/74">
            A private command center for analytics, CMS, products, customers, SEO, media, users, and launch operations.
          </p>
          {!configured ? (
            <div className="co-neu-inset mt-8 border-amber-800/25 bg-sun/25 p-4 text-sm leading-7 text-coconut">
              Set `ADMIN_EMAIL`, `ADMIN_PASSWORD_HASH`, and `ADMIN_SESSION_SECRET` in Vercel to activate secure login.
            </div>
          ) : null}
          <AdminLoginForm configured={configured} csrfToken={csrfToken} />
        </div>
        <div className="co-admin-login-panel relative hidden min-h-[680px] overflow-hidden lg:block">
          <Image src="/assets/generated/composition-morning.webp" alt=".CO admin product preview" fill priority sizes="48vw" className="object-contain p-12" />
          <div className="absolute left-8 top-8 max-w-sm rounded-lg border border-paper/18 bg-coconut/82 p-6 text-paper shadow-[0_24px_80px_rgba(62,46,31,0.26)] backdrop-blur-xl">
            <Sparkles className="mb-5 text-sun" size={22} />
            <h2 className="font-display text-4xl leading-tight">Built for global FMCG operations.</h2>
            <p className="mt-4 text-sm leading-7 text-paper/72">Clean controls, audit-aware auth, role visibility, and content systems that feel native to the brand.</p>
          </div>
          <div className="absolute bottom-8 left-8 right-8 grid gap-3 md:grid-cols-3">
            {[
              ["RBAC", "Role scoped access", ShieldCheck],
              ["CMS", "Visual content ops", CheckCircle2],
              ["Analytics", "GA4-ready insight", CheckCircle2]
            ].map(([item, detail, Icon]) => {
              const TypedIcon = Icon as typeof CheckCircle2;
              return (
                <span key={item as string} className="rounded-lg border border-paper/20 bg-coconut/86 px-4 py-4 text-paper shadow-[0_18px_42px_rgba(62,46,31,0.2)] backdrop-blur-xl">
                  <span className="flex items-center gap-2 text-xs uppercase tracking-editorial"><TypedIcon size={14} /> {item as string}</span>
                  <span className="mt-2 block text-xs leading-5 text-paper/68">{detail as string}</span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
