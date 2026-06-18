import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminLoginForm } from "@/components/admin/AdminForms";
import { getAdminSession, isAdminAuthConfigured } from "@/lib/admin/auth";

export default async function AdminLoginPage() {
  const session = await getAdminSession();
  if (session) redirect("/admin");

  const configured = isAdminAuthConfigured();

  return (
    <section className="relative grid min-h-dvh overflow-hidden bg-[linear-gradient(135deg,#fffdf8_0%,#F5EBD7_46%,rgba(74,111,74,0.22)_100%)] px-5 py-10">
      <div className="co-wave-pattern pointer-events-none absolute inset-y-0 right-0 w-[34vw] opacity-[0.08]" />
      <div className="mx-auto grid w-full max-w-6xl gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
        <div className="co-glass p-6 md:p-10">
          <Link href="/" className="mb-10 block w-28">
            <Image src="/images/logo.svg" alt=".CO The Coconut Company" width={124} height={100} priority className="h-auto w-full" />
          </Link>
          <p className="mb-5 text-[0.72rem] uppercase tracking-editorial text-grove">Secure admin</p>
          <h1 className="font-display text-5xl leading-tight text-ink md:text-7xl">Enter the .CO operating system.</h1>
          <p className="mt-6 max-w-xl text-sm leading-7 text-muted">
            Role-based access for analytics, website CMS, product management, media, SEO, customers, users, and settings.
          </p>
          {!configured ? (
            <div className="co-neu-inset mt-8 p-4 text-sm leading-7 text-coconut">
              Set `ADMIN_EMAIL`, `ADMIN_PASSWORD`, and `ADMIN_SESSION_SECRET` in the deployment environment to activate secure login.
            </div>
          ) : null}
          <AdminLoginForm configured={configured} />
        </div>
        <div className="co-glass relative hidden min-h-[620px] overflow-hidden lg:block">
          <Image src="/assets/generated/composition-morning.webp" alt=".CO admin product preview" fill priority sizes="48vw" className="object-contain p-10" />
          <div className="absolute bottom-8 left-8 right-8 grid gap-3 md:grid-cols-3">
            {["RBAC", "CMS", "Analytics"].map((item) => (
              <span key={item} className="co-glass-dark px-4 py-3 text-center text-xs uppercase tracking-editorial text-paper/82">
                {item}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
