import { AdminDashboardHome } from "@/components/admin/AdminDashboard";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdminSession } from "@/lib/admin/auth";
import { getAdminPath } from "@/lib/admin/path";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const session = await requireAdminSession("analytics");

  return (
    <AdminShell session={{ email: session.email, name: session.name, role: session.role }} adminBasePath={getAdminPath()}>
      <AdminDashboardHome />
    </AdminShell>
  );
}
