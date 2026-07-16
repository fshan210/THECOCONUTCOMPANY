import type { Metadata } from "next";
import Link from "next/link";
import { CustomerSimplePage } from "@/components/auth/CustomerAccountDashboard";
import { StructuredData } from "@/components/seo/StructuredData";
import { deleteCustomerAccount, updateCustomerProfile } from "@/lib/customer/actions";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
import { getCustomerProfile } from "@/lib/customer/aws-api";
import { createPageMetadata } from "@/lib/seo/metadata";
import { productCategories } from "@/lib/catalog";

export const metadata: Metadata = createPageMetadata({ title: "Profile", description: "Manage your .CO profile, addresses and preferences.", path: "/profile", index: false });
const fieldClass = "co-input";

export default async function ProfilePage() {
  const session = await requireVerifiedCustomerSession();
  const profile = await getCustomerProfile();
  const address = profile?.address ?? {};
  return <>
    <StructuredData breadcrumbs={[{ name: "Home", path: "/" }, { name: "Profile", path: "/profile" }]} />
    <CustomerSimplePage session={session} title="Profile." body="Keep your identity, delivery details, and communication preferences current." items={[]} suppressEmpty />
    <section className="bg-[var(--co-cream)] px-4 pb-20 md:pb-24">
      <form action={updateCustomerProfile} className="mx-auto grid max-w-4xl gap-5 rounded-[36px] border border-[var(--co-border)] bg-[var(--co-white)] p-6 shadow-[0_18px_48px_rgba(58,36,22,.065)] md:grid-cols-2 md:p-8">
        <div className="md:col-span-2"><p className="co-label mb-3">Edit profile</p><h2 className="text-4xl font-bold leading-none text-[var(--co-brown)]">Personal details</h2></div>
        <Field name="firstName" label="First name" value={profile?.firstName ?? session.name.split(" ")[0]} />
        <Field name="lastName" label="Last name" value={profile?.lastName ?? session.name.split(" ").slice(1).join(" ")} />
        <Field name="displayName" label="Display name" value={profile?.displayName ?? session.name} />
        <Field name="phone" label="Phone" value={profile?.phone} type="tel" />
        <label className="space-y-2 md:col-span-2"><span className="block text-sm font-medium text-coconut">Product interest</span><select name="preferredCategory" defaultValue={profile?.preferredCategory ?? productCategories[0]} className={fieldClass}>{productCategories.map((category)=><option key={category}>{category}</option>)}</select></label>
        <div className="border-t border-black/8 pt-6 md:col-span-2"><p className="co-label mb-3">Delivery address</p></div>
        <Field name="line1" label="Address line 1" value={address.line1} /><Field name="line2" label="Address line 2" value={address.line2} />
        <Field name="city" label="City" value={address.city} /><Field name="region" label="State" value={address.region} />
        <Field name="postalCode" label="Postal code" value={address.postalCode} /><Field name="country" label="Country" value={address.country ?? "India"} />
        <label className="flex min-h-12 items-center gap-3 text-sm text-coconut md:col-span-2"><input name="newsletterOptIn" type="checkbox" defaultChecked={profile?.newsletterOptIn ?? true} className="size-5 accent-[#214d2b]" />Receive product notes and recipes.</label>
        <label className="flex min-h-12 items-center gap-3 text-sm text-coconut md:col-span-2"><input name="marketingOptIn" type="checkbox" defaultChecked={profile?.marketingOptIn ?? false} className="size-5 accent-[#214d2b]" />Receive launch and member offers.</label>
        <button type="submit" className="co-admin-primary-button md:col-span-2">Save profile</button>
      </form>
      <div className="mx-auto mt-5 grid max-w-4xl gap-5 md:grid-cols-2">
        <section className="rounded-[28px] border border-black/7 bg-white/65 p-6"><p className="co-label">Security</p><h2 className="mt-3 font-['Cormorant_Garamond'] text-3xl">Password and access</h2><p className="mt-3 text-sm text-[#695e55]">Password changes use the verified Cognito recovery flow.</p><Link href={`/forgot-password?email=${encodeURIComponent(session.email)}`} className="mt-5 inline-flex rounded-full border border-black/10 px-5 py-3 text-sm font-semibold">Change password</Link></section>
        <form action={deleteCustomerAccount} className="rounded-[28px] border border-red-900/10 bg-white/65 p-6"><p className="co-label text-red-800">Account controls</p><h2 className="mt-3 font-['Cormorant_Garamond'] text-3xl">Delete account</h2><p className="mt-3 text-sm text-[#695e55]">Type DELETE to permanently remove your customer profile.</p><input name="confirmation" aria-label="Type DELETE to confirm" className={`${fieldClass} mt-4`} /><button className="mt-4 rounded-full border border-red-900/20 px-5 py-3 text-sm font-semibold text-red-900">Delete account</button></form>
      </div>
    </section>
  </>;
}

function Field({name,label,value="",type="text"}:{name:string;label:string;value?:string;type?:string}) { return <label className="space-y-2"><span className="block text-sm font-medium text-coconut">{label}</span><input name={name} type={type} defaultValue={value} className={fieldClass} /></label>; }
