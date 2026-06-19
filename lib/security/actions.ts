"use server";

import { z } from "zod";
import { checkRateLimit } from "@/lib/security/rate-limit";
import { verifyRecaptchaToken } from "@/lib/security/recaptcha";
import { writeSecurityEvent } from "@/lib/security/events";

const protectionSchema = z.object({
  action: z.enum([
    "customer_login",
    "customer_register",
    "customer_password_reset",
    "admin_login",
    "newsletter",
    "contact_form",
    "distributor_enquiry"
  ]),
  email: z.string().email().optional(),
  recaptchaToken: z.string().optional()
});

const limits = {
  customer_login: { limit: 8, windowMs: 1000 * 60 * 10, area: "customer_auth" },
  customer_register: { limit: 5, windowMs: 1000 * 60 * 20, area: "customer_auth" },
  customer_password_reset: { limit: 4, windowMs: 1000 * 60 * 30, area: "customer_auth" },
  admin_login: { limit: 5, windowMs: 1000 * 60 * 10, area: "admin_auth" },
  newsletter: { limit: 6, windowMs: 1000 * 60 * 15, area: "forms" },
  contact_form: { limit: 4, windowMs: 1000 * 60 * 15, area: "forms" },
  distributor_enquiry: { limit: 4, windowMs: 1000 * 60 * 15, area: "forms" }
} as const;

export async function validateAuthProtection(input: unknown) {
  const parsed = protectionSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Security check failed. Refresh and try again." };

  const config = limits[parsed.data.action];
  const key = parsed.data.email || "anonymous";
  const rate = await checkRateLimit({
    key,
    action: parsed.data.action,
    limit: config.limit,
    windowMs: config.windowMs,
    area: config.area
  });

  if (!rate.allowed) return { ok: false, message: "Too many attempts. Please wait a few minutes and try again." };

  const recaptcha = await verifyRecaptchaToken(parsed.data.recaptchaToken, parsed.data.action);
  await writeSecurityEvent({
    actorEmail: parsed.data.email || null,
    action: parsed.data.action,
    area: config.area,
    outcome: recaptcha.ok ? (recaptcha.skipped ? "skipped" : "allowed") : "blocked",
    metadata: { recaptchaScore: recaptcha.score ?? null, recaptchaSkipped: Boolean(recaptcha.skipped) }
  });

  return recaptcha.ok ? { ok: true, skipped: recaptcha.skipped } : { ok: false, message: recaptcha.message || "Security check failed." };
}
