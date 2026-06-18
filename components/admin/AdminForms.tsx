"use client";

import Link from "next/link";
import { useRef } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight, KeyRound, Mail } from "lucide-react";
import { loginAdmin, requestAdminPasswordReset, type AdminActionState } from "@/lib/admin/actions";

const initialState: AdminActionState = { ok: false, message: "" };

const loginSchema = z.object({
  email: z.string().email("Use a valid admin email."),
  password: z.string().min(8, "Password must be at least 8 characters."),
  remember: z.boolean().optional()
});

const resetSchema = z.object({
  email: z.string().email("Use a valid admin email.")
});

type LoginFields = z.infer<typeof loginSchema>;
type ResetFields = z.infer<typeof resetSchema>;

export function AdminLoginForm({ configured }: { configured: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const validatedRef = useRef(false);
  const [state, action] = useFormState(loginAdmin, initialState);
  const {
    register,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "", remember: true }
  });

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={async (event) => {
        if (validatedRef.current) {
          validatedRef.current = false;
          return;
        }
        event.preventDefault();
        if (await trigger()) {
          validatedRef.current = true;
          formRef.current?.requestSubmit();
        }
      }}
      className="mt-8 space-y-4"
    >
      <FieldError message={state.message} positive={state.ok} />
      <label className="block text-xs uppercase tracking-editorial text-muted" htmlFor="admin-email">
        Admin email
      </label>
      <input id="admin-email" type="email" autoComplete="email" disabled={!configured} className="co-neu-inset w-full px-4 py-4 text-sm text-ink outline-none focus:border-coconut disabled:opacity-50" {...register("email")} />
      <FieldError message={errors.email?.message} />
      <label className="block text-xs uppercase tracking-editorial text-muted" htmlFor="admin-password">
        Password
      </label>
      <input id="admin-password" type="password" autoComplete="current-password" disabled={!configured} className="co-neu-inset w-full px-4 py-4 text-sm text-ink outline-none focus:border-coconut disabled:opacity-50" {...register("password")} />
      <FieldError message={errors.password?.message} />
      <label className="flex items-center gap-3 text-sm text-muted">
        <input type="checkbox" value="true" className="h-4 w-4 accent-[#3E2E1F]" {...register("remember")} />
        Keep me signed in for 7 days
      </label>
      <button disabled={!configured || isSubmitting} type="submit" className="co-button-soft inline-flex min-h-12 w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-sm text-paper disabled:opacity-50">
        Enter admin OS <KeyRound size={16} />
      </button>
      <div className="flex items-center justify-between gap-4 text-sm">
        <Link href="/admin/forgot-password" className="text-coconut underline underline-offset-4">
          Forgot password
        </Link>
        <Link href="/" className="inline-flex items-center gap-2 text-muted">
          Public site <ArrowRight size={14} />
        </Link>
      </div>
    </form>
  );
}

export function AdminForgotPasswordForm({ configured }: { configured: boolean }) {
  const formRef = useRef<HTMLFormElement>(null);
  const validatedRef = useRef(false);
  const [state, action] = useFormState(requestAdminPasswordReset, initialState);
  const {
    register,
    trigger,
    formState: { errors, isSubmitting }
  } = useForm<ResetFields>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" }
  });

  return (
    <form
      ref={formRef}
      action={action}
      onSubmit={async (event) => {
        if (validatedRef.current) {
          validatedRef.current = false;
          return;
        }
        event.preventDefault();
        if (await trigger()) {
          validatedRef.current = true;
          formRef.current?.requestSubmit();
        }
      }}
      className="mt-8 space-y-4"
    >
      <FieldError message={state.message} positive={state.ok} />
      <label className="block text-xs uppercase tracking-editorial text-muted" htmlFor="reset-email">
        Admin email
      </label>
      <input id="reset-email" type="email" autoComplete="email" disabled={!configured} className="co-neu-inset w-full px-4 py-4 text-sm text-ink outline-none focus:border-coconut disabled:opacity-50" {...register("email")} />
      <FieldError message={errors.email?.message} />
      <button disabled={!configured || isSubmitting} type="submit" className="co-button-soft inline-flex min-h-12 w-full items-center justify-center gap-3 bg-ink px-6 py-4 text-sm text-paper disabled:opacity-50">
        Request reset workflow <Mail size={16} />
      </button>
      <Link href="/admin/login" className="inline-flex items-center gap-2 text-sm text-coconut underline underline-offset-4">
        Back to login
      </Link>
    </form>
  );
}

function FieldError({ message, positive = false }: { message?: string; positive?: boolean }) {
  if (!message) return null;
  return <p className={`text-sm leading-6 ${positive ? "text-grove" : "text-coconut"}`}>{message}</p>;
}
