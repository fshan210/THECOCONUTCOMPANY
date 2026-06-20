import type { Metadata } from "next";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { updateCustomerProfile } from "@/lib/customer/actions";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { createPageMetadata } from "@/lib/seo/metadata";
import { productCategories } from "@/lib/catalog";

export const metadata: Metadata = createPageMetadata({
  title: "Profile",
  description: "Manage your .CO profile, addresses and preferences.",
  path: "/profile"
});

export default async function ProfilePage() {
  const session = await requireVerifiedCustomerSession();

  return (
    <>
      <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Profile", path: "/profile" }]} />
      <CustomerSimplePage
        session={session}
        title="Profile."
        body="Keep your name, product preferences, and recipe updates in one calm place."
        items={[
          { title: "Identity", detail: `${session.name} / ${session.email}` },
          { title: "Preferences", detail: "Choose the coconut products and recipe notes you care about most." },
          { title: "Privacy", detail: "Your account tools stay focused on the customer experience." }
        ]}
      />
      <section className="px-5 pb-20 md:px-8 md:pb-24">
        <form action={updateCustomerProfile} className="co-glass mx-auto grid max-w-3xl gap-5 p-6 md:grid-cols-2 md:p-8">
          <div className="md:col-span-2">
            <p className="mb-3 text-[0.72rem] uppercase tracking-editorial text-grove">Edit profile</p>
            <h2 className="font-display text-4xl text-coconut">Customer preferences</h2>
          </div>
          <label className="space-y-2">
            <span className="block text-sm font-medium text-coconut">Display name</span>
            <input name="displayName" defaultValue={session.name} className="co-input" />
          </label>
          <label className="space-y-2">
            <span className="block text-sm font-medium text-coconut">Product interest</span>
            <select name="preferredCategory" className="co-input">
              {productCategories.map((category) => (
                <option key={category}>{category}</option>
              ))}
            </select>
          </label>
          <label className="flex min-h-12 items-center gap-3 text-sm text-coconut md:col-span-2">
            <input name="newsletterOptIn" type="checkbox" defaultChecked className="h-5 w-5 accent-[#3E2E1F]" />
            Receive product notes, recipes, and gentle .CO updates.
          </label>
          <button type="submit" className="co-admin-primary-button md:col-span-2">
            Save profile
          </button>
        </form>
      </section>
    </>
  );
}
