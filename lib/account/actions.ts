"use server";
import { addressInputSchema, addressIdParamSchema, mePatchSchema } from "@dotco/contracts";
import { revalidatePath } from "next/cache";
import { customerAwsApi } from "@/lib/customer/aws-api";
import { requireVerifiedCustomerSession } from "@/lib/customer/auth";
export type AccountActionResult = { ok: boolean; message: string };
export async function saveAccountAddress(input: unknown, id?: string): Promise<AccountActionResult> {
  await requireVerifiedCustomerSession();
  const parsed = addressInputSchema.safeParse(input);
  if (!parsed.success || (id && !addressIdParamSchema.safeParse({addressId:id}).success)) return { ok:false, message:"Check the address fields and try again." };
  try {
    const result = await customerAwsApi(id ? `v1/me/addresses/${encodeURIComponent(id)}` : "v1/me/addresses", {method:id ? "PATCH" : "POST",body:JSON.stringify(parsed.data)});
    if (!result.ok) return {ok:false,message:"Your address could not be saved. Please try again."};
    revalidatePath("/account"); revalidatePath("/account/addresses");
    return {ok:true,message:"Your address is saved."};
  } catch { return {ok:false,message:"We couldn’t connect. Your changes haven’t been saved."}; }
}
export async function removeAccountAddress(id: string): Promise<AccountActionResult> {
  await requireVerifiedCustomerSession();
  if (!addressIdParamSchema.safeParse({addressId:id}).success) return {ok:false,message:"This address could not be found."};
  try {
    const result = await customerAwsApi(`v1/me/addresses/${encodeURIComponent(id)}`, {method:"DELETE"});
    if (!result.ok) return {ok:false,message:"Your address could not be removed. Please try again."};
    revalidatePath("/account/addresses"); return {ok:true,message:"Address removed."};
  } catch { return {ok:false,message:"We couldn’t connect. Your address hasn’t been removed."}; }
}
export async function saveAccountPreferences(input: unknown): Promise<AccountActionResult> {
  await requireVerifiedCustomerSession();
  const parsed = mePatchSchema.safeParse(input);
  if (!parsed.success) return {ok:false,message:"Please check your details. Names need at least two characters and phone numbers must be valid."};
  try {
    const result = await customerAwsApi("v1/me",{method:"PATCH",body:JSON.stringify(parsed.data)});
    if (!result.ok) return {ok:false,message:"We couldn’t save your preferences. Please try again."};
    revalidatePath("/profile"); revalidatePath("/account");
    return {ok:true,message:"Your preferences are saved."};
  } catch { return {ok:false,message:"We couldn’t connect. Your changes haven’t been saved."}; }
}
