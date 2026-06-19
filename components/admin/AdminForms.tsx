"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, CheckCircle2, Eye, EyeOff, KeyRound, Loader2, Mail, ShieldAlert } from "lucide-react";
import { sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import { loginAdmin, requestAdminPasswordReset, type AdminActionState } from "@/lib/admin/actions";
import { getAdminPath } from "@/lib/admin/path";
import { getFirebaseClientAuth } from "@/lib/firebase/client";
import { isFirebasePublicConfigured } from "@/lib/firebase/config";

const initialState: AdminActionState = { ok: false, message: "" };

const loginSchema = z.object({
  email: z.string().email("Use a valid admin email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean().optional(),
  csrf: z.string().min(16)
});

const resetSchema = z.object({
  email: z.string().email("Use a valid admin email.")
});

type LoginFields = z.infer<typeof loginSchema>;
type ResetFields = z.infer<typeof resetSchema>;

export function AdminLoginForm({ configured, csrfToken }: { configured: boolean; csrfToken: string }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(loginAdmin, initialState);
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    trigger,
    setFocus,
    formState: { errors, isSubmitting }
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true, csrf: csrfToken }
  });

  return (
    <form
      ref={formRef}
      onSubmit={async (event) => {
        event.preventDefault();
        const valid = await trigger();
        if (!valid) {
          if (errors.email) setFocus("email");
          else if (errors.password) setFocus("password");
          return;
        }
        const values = new FormData(event.currentTarget);
        startTransition(async () => {
          if (!isFirebasePublicConfigured()) {
            action(createAdminTokenFormData("", csrfToken, Boolean(values.get("remember"))));
            return;
          }
          try {
            const credential = await signInWithEmailAndPassword(getFirebaseClientAuth(), String(values.get("email")), String(values.get("password")));
            const idToken = await credential.user.getIdToken();
            action(createAdminTokenFormData(idToken, csrfToken, Boolean(values.get("remember"))));
          } catch (error) {
            action(createAdminTokenFormData("", csrfToken, Boolean(values.get("remember"))));
          }
        });
      }}
      className="relative z-10 mt-8 space-y-5"
    >
      <input type="hidden" value={csrfToken} {...register("csrf")} />
      <FieldMessage message={state.message} positive={state.ok} />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-coconut" htmlFor="admin-email">
          Admin email
        </label>
        <input
          id="admin-email"
          type="email"
          inputMode="email"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="username"
          disabled={pending}
          aria-invalid={Boolean(errors.email)}
          className="co-input"
          placeholder="admin@company.com"
          {...register("email")}
        />
        <FieldMessage message={errors.email?.message} />
      </div>
      <div className="space-y-2">
        <label className="block text-sm font-medium text-coconut" htmlFor="admin-password">
          Password
        </label>
        <div className="relative">
          <input
            id="admin-password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            disabled={pending}
            aria-invalid={Boolean(errors.password)}
            className="co-input pr-14"
            placeholder="Enter secure password"
            {...register("password")}
          />
          <button
            type="button"
            aria-label={showPassword ? "Hide password" : "Show password"}
            onClick={() => setShowPassword((value) => !value)}
            className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md text-coconut transition hover:bg-coconut/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coconut"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
        </div>
        <FieldMessage message={errors.password?.message} />
      </div>
      <label className="flex min-h-11 items-center gap-3 text-sm text-coconut">
        <input type="checkbox" value="true" disabled={pending} className="h-5 w-5 rounded border-coconut accent-[#3E2E1F] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coconut" {...register("remember")} />
        Keep me signed in for 7 days
      </label>
      <button disabled={isSubmitting || pending} type="submit" className="co-admin-primary-button w-full">
        {pending ? <Loader2 className="animate-spin" size={18} /> : state.ok ? <CheckCircle2 size={18} /> : <KeyRound size={18} />}
        {pending ? "Verifying secure session..." : "Enter admin OS"}
      </button>
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href={getAdminPath("forgot-password")} className="text-coconut underline underline-offset-4 transition hover:text-grove focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coconut">
          Forgot password
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-coconut/75 transition hover:text-coconut focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-coconut">
          Public site <ArrowRight size={14} />
        </Link>
      </div>
    </form>
  );
}

function createAdminTokenFormData(idToken: string, csrfToken: string, remember: boolean) {
  const formData = new FormData();
  formData.set("idToken", idToken);
  formData.set("csrf", csrfToken);
  if (remember) formData.set("remember", "true");
  return formData;
}

export function AdminForgotPasswordForm({ configured }: { configured: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(requestAdminPasswordReset, initialState);
  const [pending, startTransition] = useTransition();
  const {
    register,
    trigger,
    setFocus,
    formState: { errors, isSubmitting }
  } = useForm<ResetFields>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" }
  });

  return (
    <form
      ref={formRef}
      onSubmit={async (event) => {
        event.preventDefault();
        if (!(await trigger())) {
          setFocus("email");
          return;
        }
        const formData = new FormData(event.currentTarget);
        startTransition(async () => {
          try {
            if (isFirebasePublicConfigured()) {
              await sendPasswordResetEmail(getFirebaseClientAuth(), String(formData.get("email")));
            }
          } finally {
            action(formData);
          }
        });
      }}
      className="mt-8 space-y-4"
    >
      <FieldMessage message={state.message} positive={state.ok} />
      <div className="space-y-2">
        <label className="block text-sm font-medium text-coconut" htmlFor="reset-email">
          Admin email
        </label>
        <input id="reset-email" type="email" inputMode="email" autoCapitalize="none" autoCorrect="off" autoComplete="username" disabled={pending} className="co-input" placeholder="admin@company.com" {...register("email")} />
        <FieldMessage message={errors.email?.message} />
      </div>
      <button disabled={isSubmitting || pending} type="submit" className="co-admin-primary-button w-full">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
        {pending ? "Preparing recovery..." : "Request reset workflow"}
      </button>
      <Link href={getAdminPath("login")} className="inline-flex items-center gap-2 text-sm text-coconut underline underline-offset-4">
        Back to login
      </Link>
    </form>
  );
}

function FieldMessage({ message, positive = false }: { message?: string; positive?: boolean }) {
  if (!message) return null;
  return (
    <p className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm leading-6 ${positive ? "bg-grove/12 text-grove" : "bg-red-950/5 text-red-900"}`} role={positive ? "status" : "alert"}>
      {positive ? <CheckCircle2 className="mt-1 shrink-0" size={15} /> : <ShieldAlert className="mt-1 shrink-0" size={15} />}
      <span>{message}</span>
    </p>
  );
}
