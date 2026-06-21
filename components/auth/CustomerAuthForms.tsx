"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormRegisterReturn } from "react-hook-form";
import { CheckCircle2, Eye, EyeOff, Loader2, LogIn, Mail, UserPlus } from "lucide-react";
import {
  confirmPasswordReset,
  createUserWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signInWithPopup,
  updateProfile
} from "firebase/auth";
import { useSearchParams } from "next/navigation";
import { establishCustomerSession, type CustomerAuthState } from "@/lib/customer/actions";
import { productCategories } from "@/lib/catalog";
import { getFirebaseClientAuth, getGoogleAuthProvider } from "@/lib/firebase/client";
import { isFirebasePublicConfigured } from "@/lib/firebase/config";
import { validateAuthProtection } from "@/lib/security/actions";
import { getRecaptchaToken } from "@/components/security/recaptcha";

const initialState: CustomerAuthState = { ok: false, message: "" };

const loginSchema = z.object({
  email: z.string().email("Use a valid email."),
  password: z.string().min(8, "Password must be at least 8 characters.")
});

const registerSchema = loginSchema.extend({
  name: z.string().min(2, "Enter your name."),
  preference: z.string().min(2)
});

type LoginFields = z.infer<typeof loginSchema>;
type RegisterFields = z.infer<typeof registerSchema>;

export function CustomerLoginForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<CustomerAuthState>(initialState);
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { register, trigger, setFocus, formState: { errors } } = useForm<LoginFields>({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" }
  });

  return (
    <form
      ref={formRef}
      className="mt-8 space-y-5"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!(await trigger())) {
          if (errors.email) setFocus("email");
          else setFocus("password");
          return;
        }
        setState(initialState);
        const data = new FormData(form);
        startTransition(async () => {
          try {
            if (!isFirebasePublicConfigured()) {
              setState({ ok: false, status: "error", message: "Account login is temporarily unavailable." });
              return;
            }
            const email = String(data.get("email"));
            const protection = await validateAuthProtection({
              action: "customer_login",
              email,
              recaptchaToken: await getRecaptchaToken("customer_login")
            });
            if (!protection.ok) {
              setState({ ok: false, status: "error", message: protection.message || "Security check failed." });
              return;
            }
            const credential = await signInWithEmailAndPassword(getFirebaseClientAuth(), email, String(data.get("password")));
            const idToken = await credential.user.getIdToken();
            await establishCustomerSession({ idToken });
          } catch (error) {
            if (isNextRedirectError(error)) throw error;
            setState({ ok: false, status: "error", message: formatFirebaseError(error) });
          }
        });
      }}
    >
      <AuthMessage message={state.message} positive={state.ok} />
      <AuthInput id="customer-email" label="Email" type="email" autoComplete="username" error={errors.email?.message} disabled={pending} register={register("email")} />
      <PasswordInput id="customer-password" label="Password" show={showPassword} onToggle={() => setShowPassword((value) => !value)} disabled={pending} error={errors.password?.message} register={register("password")} />
      <button type="submit" disabled={pending} className="co-admin-primary-button w-full">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
        {pending ? "Signing you in..." : "Login"}
      </button>
      <button type="button" disabled={pending} onClick={() => startTransition(() => void loginWithGoogle(setState))} className="inline-flex min-h-12 w-full items-center justify-center rounded-full border border-[var(--co-border)] bg-[var(--co-white)] px-5 text-sm font-bold text-[var(--co-ink)] transition hover:border-[var(--co-black)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[rgba(244,201,93,0.72)]">
        Continue with Google
      </button>
      <button type="button" disabled={pending} onClick={() => void sendResetFromForm(formRef.current, setState)} className="inline-flex w-full items-center justify-center gap-2 text-sm text-coconut underline underline-offset-4">
        <Mail size={15} /> Forgot password?
      </button>
      <p className="text-center text-sm text-coconut/72">
        Need the reset page?{" "}
        <Link href="/forgot-password" className="font-medium text-coconut underline underline-offset-4">
          Open password reset
        </Link>
      </p>
      <p className="text-center text-sm text-coconut/72">
        New to .CO?{" "}
        <Link href="/register" className="font-medium text-coconut underline underline-offset-4">
          Create account
        </Link>
      </p>
    </form>
  );
}

export function CustomerForgotPasswordForm() {
  const [state, setState] = useState<CustomerAuthState>(initialState);
  const [pending, startTransition] = useTransition();
  const { register, handleSubmit, formState: { errors } } = useForm<{ email: string }>({
    resolver: zodResolver(z.object({ email: z.string().email("Use a valid email.") })),
    defaultValues: { email: "" }
  });

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(({ email }) => {
        startTransition(async () => {
          try {
            const protection = await validateAuthProtection({
              action: "customer_password_reset",
              email,
              recaptchaToken: await getRecaptchaToken("customer_password_reset")
            });
            if (!protection.ok) {
              setState({ ok: false, status: "error", message: protection.message || "Security check failed." });
              return;
            }
            await sendPasswordResetEmail(getFirebaseClientAuth(), email);
            setState({ ok: true, status: "success", message: "Password reset email sent. Check your inbox." });
          } catch (error) {
            setState({ ok: false, status: "error", message: formatFirebaseError(error) });
          }
        });
      })}
    >
      <AuthMessage message={state.message} positive={state.ok} />
      <AuthInput id="forgot-email" label="Email" type="email" autoComplete="username" disabled={pending} error={errors.email?.message} register={register("email")} />
      <button type="submit" disabled={pending} className="co-admin-primary-button w-full">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <Mail size={18} />}
        {pending ? "Sending reset link..." : "Send reset link"}
      </button>
      <Link href="/login" className="block text-center text-sm text-coconut underline underline-offset-4">
        Back to login
      </Link>
    </form>
  );
}

export function CustomerResetPasswordForm() {
  const searchParams = useSearchParams();
  const oobCode = searchParams.get("oobCode") || "";
  const [state, setState] = useState<CustomerAuthState>(initialState);
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm<{ password: string }>({
    resolver: zodResolver(z.object({ password: z.string().min(8, "Password must be at least 8 characters.") })),
    defaultValues: { password: "" }
  });

  return (
    <form
      className="mt-8 space-y-5"
      onSubmit={handleSubmit(({ password }) => {
        startTransition(async () => {
          try {
            if (!oobCode) {
              setState({ ok: false, status: "error", message: "Reset code is missing. Use the link from your email." });
              return;
            }
            await confirmPasswordReset(getFirebaseClientAuth(), oobCode, password);
            setState({ ok: true, status: "success", message: "Password updated. You can now log in." });
          } catch (error) {
            setState({ ok: false, status: "error", message: formatFirebaseError(error) });
          }
        });
      })}
    >
      <AuthMessage message={state.message} positive={state.ok} />
      <PasswordInput id="reset-password" label="New password" show={showPassword} onToggle={() => setShowPassword((value) => !value)} disabled={pending} error={errors.password?.message} register={register("password")} />
      <button type="submit" disabled={pending} className="co-admin-primary-button w-full">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle2 size={18} />}
        {pending ? "Updating password..." : "Update password"}
      </button>
      <Link href="/login" className="block text-center text-sm text-coconut underline underline-offset-4">
        Back to login
      </Link>
    </form>
  );
}

export function CustomerRegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, setState] = useState<CustomerAuthState>(initialState);
  const [pending, startTransition] = useTransition();
  const [showPassword, setShowPassword] = useState(false);
  const { register, trigger, setFocus, formState: { errors } } = useForm<RegisterFields>({
    resolver: zodResolver(registerSchema),
    defaultValues: { name: "", email: "", password: "", preference: productCategories[0] }
  });

  return (
    <form
      ref={formRef}
      className="mt-8 grid gap-5 md:grid-cols-2"
      onSubmit={async (event) => {
        event.preventDefault();
        const form = event.currentTarget;
        if (!(await trigger())) {
          if (errors.name) setFocus("name");
          else if (errors.email) setFocus("email");
          else setFocus("password");
          return;
        }
        setState(initialState);
        const data = new FormData(form);
        startTransition(async () => {
          try {
            if (!isFirebasePublicConfigured()) {
              setState({ ok: false, status: "error", message: "Account registration is temporarily unavailable." });
              return;
            }
            const email = String(data.get("email"));
            const protection = await validateAuthProtection({
              action: "customer_register",
              email,
              recaptchaToken: await getRecaptchaToken("customer_register")
            });
            if (!protection.ok) {
              setState({ ok: false, status: "error", message: protection.message || "Security check failed." });
              return;
            }
            const auth = getFirebaseClientAuth();
            const credential = await createUserWithEmailAndPassword(auth, email, String(data.get("password")));
            await updateProfile(credential.user, { displayName: String(data.get("name")) });
            await sendEmailVerification(credential.user);
            const idToken = await credential.user.getIdToken(true);
            await establishCustomerSession({
              idToken,
              name: String(data.get("name")),
              preference: String(data.get("preference")),
              newsletterOptIn: true
            });
          } catch (error) {
            if (isNextRedirectError(error)) throw error;
            setState({ ok: false, status: "error", message: formatFirebaseError(error) });
          }
        });
      }}
    >
      <div className="md:col-span-2">
        <AuthMessage message={state.message} positive={state.ok} />
      </div>
      <AuthInput id="register-name" label="Name" type="text" autoComplete="name" error={errors.name?.message} disabled={pending} register={register("name")} />
      <AuthInput id="register-email" label="Email" type="email" autoComplete="username" error={errors.email?.message} disabled={pending} register={register("email")} />
      <div className="space-y-2 md:col-span-2">
        <label htmlFor="register-preference" className="block text-sm font-medium text-coconut">
          Product interest
        </label>
        <select id="register-preference" disabled={pending} className="co-input" {...register("preference")}>
          {productCategories.map((category) => (
            <option key={category}>{category}</option>
          ))}
        </select>
      </div>
      <div className="md:col-span-2">
        <PasswordInput id="register-password" label="Password" show={showPassword} onToggle={() => setShowPassword((value) => !value)} disabled={pending} error={errors.password?.message} register={register("password")} />
      </div>
      <button type="submit" disabled={pending} className="co-admin-primary-button md:col-span-2">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <UserPlus size={18} />}
        {pending ? "Creating your .CO space..." : "Create account"}
      </button>
    </form>
  );
}

async function loginWithGoogle(setState: (state: CustomerAuthState) => void) {
  try {
    if (!isFirebasePublicConfigured()) {
      setState({ ok: false, status: "error", message: "Account login is temporarily unavailable." });
      return;
    }
    const protection = await validateAuthProtection({
      action: "customer_login",
      recaptchaToken: await getRecaptchaToken("customer_login")
    });
    if (!protection.ok) {
      setState({ ok: false, status: "error", message: protection.message || "Security check failed." });
      return;
    }
    const credential = await signInWithPopup(getFirebaseClientAuth(), getGoogleAuthProvider());
    const idToken = await credential.user.getIdToken();
    await establishCustomerSession({ idToken, name: credential.user.displayName || undefined });
  } catch (error) {
    if (isNextRedirectError(error)) throw error;
    setState({ ok: false, status: "error", message: formatFirebaseError(error) });
  }
}

async function sendResetFromForm(form: HTMLFormElement | null, setState: (state: CustomerAuthState) => void) {
  const email = form ? String(new FormData(form).get("email") || "") : "";
  if (!email) {
    setState({ ok: false, status: "error", message: "Enter your email first, then request a reset link." });
    return;
  }
  try {
    const protection = await validateAuthProtection({
      action: "customer_password_reset",
      email,
      recaptchaToken: await getRecaptchaToken("customer_password_reset")
    });
    if (!protection.ok) {
      setState({ ok: false, status: "error", message: protection.message || "Security check failed." });
      return;
    }
    await sendPasswordResetEmail(getFirebaseClientAuth(), email);
    setState({ ok: true, status: "success", message: "Password reset email sent. Check your inbox." });
  } catch (error) {
    setState({ ok: false, status: "error", message: formatFirebaseError(error) });
  }
}

function formatFirebaseError(error: unknown) {
  const message = error instanceof Error ? error.message : "Firebase authentication failed.";
  if (message.includes("auth/invalid-credential")) return "Invalid email or password.";
  if (message.includes("auth/email-already-in-use")) return "An account already exists for this email.";
  if (message.includes("auth/weak-password")) return "Use a stronger password.";
  if (message.includes("auth/popup-closed-by-user")) return "Google sign-in was closed before completion.";
  return message.replace("Firebase: ", "");
}

function isNextRedirectError(error: unknown) {
  if (!error || typeof error !== "object") return false;
  const digest = "digest" in error ? String(error.digest) : "";
  const message = error instanceof Error ? error.message : "";
  return digest.startsWith("NEXT_REDIRECT") || message.includes("NEXT_REDIRECT");
}

function AuthInput({ id, label, type, autoComplete, disabled, error, register }: { id: string; label: string; type: string; autoComplete: string; disabled: boolean; error?: string; register: UseFormRegisterReturn }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-coconut">
        {label}
      </label>
      <input id={id} type={type} autoComplete={autoComplete} disabled={disabled} aria-invalid={Boolean(error)} className="co-input" {...register} />
      <AuthMessage message={error} />
    </div>
  );
}

function PasswordInput({ id, label, show, onToggle, disabled, error, register }: { id: string; label: string; show: boolean; onToggle: () => void; disabled: boolean; error?: string; register: UseFormRegisterReturn }) {
  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-coconut">{label}</label>
      <div className="relative">
        <input id={id} type={show ? "text" : "password"} autoComplete="current-password" disabled={disabled} aria-invalid={Boolean(error)} className="co-input pr-14" {...register} />
        <button type="button" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-[var(--co-brown)] transition hover:bg-[var(--co-cream)] focus-visible:outline focus-visible:outline-4 focus-visible:outline-offset-2 focus-visible:outline-[rgba(244,201,93,0.72)]">
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
      <AuthMessage message={error} />
    </div>
  );
}

function AuthMessage({ message, positive = false }: { message?: string; positive?: boolean }) {
  if (!message) return null;
  return (
    <p className={`flex items-start gap-2 rounded-[28px] px-4 py-3 text-sm leading-6 ${positive ? "bg-[var(--co-palm)]/10 text-[var(--co-palm)]" : "bg-red-950/5 text-red-900"}`} role={positive ? "status" : "alert"}>
      <CheckCircle2 className="mt-1 shrink-0" size={15} />
      <span>{message}</span>
    </p>
  );
}
