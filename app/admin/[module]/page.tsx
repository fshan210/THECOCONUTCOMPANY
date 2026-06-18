import { notFound } from "next/navigation";
import { AdminModulePage } from "@/components/admin/AdminDashboard";
import { AdminShell } from "@/components/admin/AdminShell";
import { adminNavItems } from "@/lib/admin/data";
import { requireAdminSession } from "@/lib/admin/auth";

type AdminModuleProps = {
  params: Promise<{ module: string }>;
};

export const dynamic = "force-dynamic";
export const dynamicParams = true;

export default async function AdminModuleRoute({ params }: AdminModuleProps) {
  const { module } = await params;
  const item = adminNavItems.find((navItem) => navItem.href === `/admin/${module}`);
  if (!item) notFound();

  const session = await requireAdminSession(item.permission);

  return (
    <AdminShell session={{ email: session.email, name: session.name, role: session.role }}>
      <AdminModulePage module={module} />
    </AdminShell>
  );
}
