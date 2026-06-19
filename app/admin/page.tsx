import { redirect } from "next/navigation";
import { getAdminPath } from "@/lib/admin/path";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  redirect(getAdminPath("dashboard"));
}
