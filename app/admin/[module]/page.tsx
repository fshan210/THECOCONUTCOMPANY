import { notFound } from "next/navigation";
import { AdminModulePage } from "@/components/admin/AdminDashboard";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminNavItems } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/auth";
import { getAdminPath } from "@/lib/admin/path";
import { ContentManager } from "@/components/admin/ContentManager";
import { getAdminContentRecords } from "@/lib/content/server";
import { isFirebaseAdminConfigured } from "@/lib/firebase/admin";
import type { ContentType } from "@/lib/content/types";

type AdminModuleProps = {
  params: Promise<{ module: string }>;
  searchParams: Promise<{ cms?: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function AdminModuleRoute({ params, searchParams }: AdminModuleProps) {
  const { module } = await params;
  const item = adminNavItems.find((navItem) => navItem.href === `/admin/${module}`);
  if (!item) notFound();

  const session = await requireAdminSession(item.permission);
  const managedTypes = ["products", "recipes", "journal", "testimonials", "homepage", "seo"] as const;
  const managedType = managedTypes.includes(module as ContentType) ? module as ContentType : null;
  const records = managedType ? await getAdminContentRecords(managedType) : [];
  const { cms } = await searchParams;

  return (
    <AdminShell session={{ email: session.email, name: session.name, role: session.role }} adminBasePath={getAdminPath()}>
      {managedType ? <ContentManager type={managedType} records={records} writable={isFirebaseAdminConfigured()} message={cms} /> : <AdminModulePage module={module} />}
    </AdminShell>
  );
}
