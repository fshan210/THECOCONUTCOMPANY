"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type ComponentProps, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Check, CheckCircle2, CircleAlert, Eye, EyeOff, Loader2, ShieldCheck, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

type AuthResult = { ok?: boolean; message?: string; status?: string; email?: string };
type Notice = { kind: "success" | "error"; message: string } | null;

async function cognitoAuth(input: Record<string, string>) {
  const response = await fetch("/api/auth/cognito", {
    method: "POST",
    credentials: "same-origin",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(input)
  });
  const result = await response.json() as AuthResult;
  if (!response.ok || !result.ok) throw new Error(result.message || "We could not complete that request.");
  return result;
}

const emailIsValid = (email: string) => /^\S+@\S+\.\S+$/.test(email);
const passwordRules = (password: string) => [
  ["At least 8 characters", password.length >= 8],
  ["One uppercase letter", /[A-Z]/.test(password)],
  ["One lowercase letter", /[a-z]/.test(password)],
  ["One number", /\d/.test(password)],
  ["One special character", /[^A-Za-z0-9]/.test(password)]
] as const;

function NoticePanel({ notice }: { notice: Notice }) {
  if (!notice) return null;
  const Icon = notice.kind === "success" ? CheckCircle2 : CircleAlert;
  return <div role={notice.kind === "error" ? "alert" : "status"} aria-live="polite" className={`flex gap-3 rounded-2xl border px-4 py-3 text-sm leading-5 ${notice.kind === "success" ? "border-[#214d2b]/15 bg-[#e9f1e4] text-[#214d2b]" : "border-red-900/10 bg-red-50 text-red-900"}`}><Icon className="mt-0.5 shrink-0" size={17}/>{notice.message}</div>;
}

function Field({ label, id, type = "text", value, onChange, error, autoComplete, disabled, children }: { label: string; id: string; type?: string; value: string; onChange: (value: string) => void; error?: string; autoComplete?: string; disabled?: boolean; children?: ReactNode }) {
  return <div className="space-y-2"><label htmlFor={id} className="text-sm font-semibold text-[#2a1b13]">{label}</label><div className="relative"><input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} disabled={disabled} aria-invalid={Boolean(error)} className="co-auth-input pr-12" />{children}</div>{error ? <p role="alert" className="text-xs text-red-800">{error}</p> : null}</div>;
}

function PasswordField({ label, id, value, onChange, error, autoComplete = "current-password", disabled }: Omit<ComponentProps<typeof Field>, "type" | "children">) {
  const [visible, setVisible] = useState(false);
  return <Field label={label} id={id} type={visible ? "text" : "password"} value={value} onChange={onChange} error={error} autoComplete={autoComplete} disabled={disabled}><button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid size-9 -translate-y-1/2 place-items-center rounded-full text-[#685a4d] transition hover:bg-[#f1eadf] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#214d2b]">{visible ? <EyeOff size={17}/> : <Eye size={17}/>}</button></Field>;
}

export function AuthShell({ eyebrow, title, description, children }: { eyebrow: string; title: string; description: string; children: ReactNode }) {
  return <main className="co-auth-page"><motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }} className="co-auth-card"><div className="co-auth-orb" aria-hidden="true"><Sparkles size={18}/></div><p className="co-label text-[#214d2b]">{eyebrow}</p><h1 className="mt-4 font-['Cormorant_Garamond'] text-[clamp(2.6rem,8vw,3.35rem)] leading-[0.9] tracking-[-0.045em] text-[#2a1b13]">{title}</h1><p className="mt-4 text-sm leading-6 text-[#695e55]">{description}</p>{children}</motion.section></main>;
}

function PrimaryButton({ children, pending, type = "submit", onClick }: { children: ReactNode; pending?: boolean; type?: "button" | "submit"; onClick?: () => void }) {
  return <button type={type} disabled={pending} onClick={onClick} className="co-auth-primary">{pending ? <Loader2 className="animate-spin" size={17}/> : null}{children}</button>;
}

function GoogleButton({ onClick, disabled }: { onClick: () => void; disabled?: boolean }) {
  return <button type="button" disabled={disabled} onClick={onClick} className="co-auth-secondary"><span className="grid size-5 place-items-center rounded-full bg-white text-xs font-black text-[#4285f4] shadow-sm">G</span>Continue with Google</button>;
}

function googleUnavailable(setNotice: (notice: Notice) => void) {
  setNotice({ kind: "error", message: "Google sign-in will appear here once the Cognito Google identity provider is configured." });
}

export function CustomerLoginForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState(search.get("email") || "");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [notice, setNotice] = useState<Notice>(search.get("verified") ? { kind: "success", message: "Email verified. Sign in to continue." } : null);
  const [pending, startTransition] = useTransition();
  const emailError = email && !emailIsValid(email) ? "Enter a valid email address." : "";
  const passwordError = password && password.length < 8 ? "Use at least 8 characters." : "";

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailIsValid(email) || password.length < 8) { setNotice({ kind: "error", message: "Check your email and password, then try again." }); return; }
    startTransition(async () => {
      try {
        await cognitoAuth({ action: "login", email, password });
        const hasCart = Boolean(window.localStorage.getItem("co-cart") && JSON.parse(window.localStorage.getItem("co-cart") || "[]").length);
        if (!remember) window.sessionStorage.setItem("co-session-preference", "session");
        setNotice({ kind: "success", message: "Welcome back to .CO." });
        window.setTimeout(() => router.replace(search.get("redirect") || (hasCart ? "/cart" : "/account")), 450);
      } catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "Unable to sign in." }); }
    });
  };

  return <form onSubmit={submit} className="mt-8 space-y-5" noValidate><NoticePanel notice={notice}/><Field label="Email" id="login-email" type="email" value={email} onChange={setEmail} autoComplete="username" disabled={pending} error={emailError}/><PasswordField label="Password" id="login-password" value={password} onChange={setPassword} autoComplete="current-password" disabled={pending} error={passwordError}/><div className="flex items-center justify-between gap-4 text-sm"><label className="flex cursor-pointer items-center gap-2 text-[#65594f]"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} className="size-4 accent-[#214d2b]"/>Remember me</label><Link href={`/forgot-password?email=${encodeURIComponent(email)}`} className="font-semibold text-[#214d2b] underline underline-offset-4">Forgot password?</Link></div><PrimaryButton pending={pending}>{pending ? "Signing in" : "Sign in"}</PrimaryButton><div className="co-auth-divider"><span>or</span></div><GoogleButton disabled={pending} onClick={() => googleUnavailable(setNotice)}/><p className="text-center text-sm text-[#65594f]">New to .CO? <Link className="font-semibold text-[#214d2b] underline underline-offset-4" href="/register">Create an account</Link></p></form>;
}

export function CustomerRegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [terms, setTerms] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const rules = passwordRules(password);
  const passwordReady = rules.every(([, fulfilled]) => fulfilled);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2 || !emailIsValid(email) || !passwordReady || password !== confirmPassword || !terms) { setNotice({ kind: "error", message: "Complete each field and accept the terms to create your account." }); return; }
    startTransition(async () => {
      try {
        await cognitoAuth({ action: "signup", name: name.trim(), email, password });
        window.localStorage.setItem("co_pending_verify_email", email);
        setNotice({ kind: "success", message: `Account created. We sent a six-digit code to ${email}.` });
        window.setTimeout(() => router.push(`/verify-email?email=${encodeURIComponent(email)}`), 700);
      } catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "Unable to create your account." }); }
    });
  };
  return <form onSubmit={submit} className="mt-8 space-y-5" noValidate><NoticePanel notice={notice}/><Field label="Name" id="register-name" value={name} onChange={setName} autoComplete="name" disabled={pending} error={name && name.trim().length < 2 ? "Enter at least two characters." : ""}/><Field label="Email" id="register-email" type="email" value={email} onChange={setEmail} autoComplete="username" disabled={pending} error={email && !emailIsValid(email) ? "Enter a valid email address." : ""}/><PasswordField label="Password" id="register-password" value={password} onChange={setPassword} autoComplete="new-password" disabled={pending}/><PasswordChecklist rules={rules}/><PasswordField label="Confirm password" id="register-confirm-password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" disabled={pending} error={confirmPassword && confirmPassword !== password ? "Passwords do not match." : ""}/><label className="flex cursor-pointer items-start gap-3 text-sm leading-5 text-[#65594f]"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} className="mt-0.5 size-4 shrink-0 accent-[#214d2b]"/>I agree to the <Link href="/terms" className="font-semibold text-[#214d2b] underline underline-offset-4">terms</Link> and acknowledge the privacy policy.</label><PrimaryButton pending={pending}>{pending ? "Creating your account" : "Create account"}</PrimaryButton><div className="co-auth-divider"><span>or</span></div><GoogleButton disabled={pending} onClick={() => googleUnavailable(setNotice)}/><p className="text-center text-sm text-[#65594f]">Already have an account? <Link className="font-semibold text-[#214d2b] underline underline-offset-4" href="/login">Sign in</Link></p></form>;
}

function PasswordChecklist({ rules }: { rules: ReturnType<typeof passwordRules> }) { return <ul className="grid grid-cols-1 gap-1.5 rounded-2xl bg-[#f7f1e8] p-3 text-xs text-[#695e55] sm:grid-cols-2">{rules.map(([label, fulfilled]) => <li key={label} className={`flex items-center gap-2 transition-colors ${fulfilled ? "text-[#214d2b]" : ""}`}><span className={`grid size-4 place-items-center rounded-full border ${fulfilled ? "border-[#214d2b] bg-[#214d2b] text-white" : "border-[#cfc4b5]"}`}>{fulfilled ? <Check size={10}/> : null}</span>{label}</li>)}</ul>; }

export function CustomerVerifyEmailForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState(search.get("email") || "");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [notice, setNotice] = useState<Notice>(null);
  const [remaining, setRemaining] = useState(30);
  const [pending, startTransition] = useTransition();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  useEffect(() => { if (!email) setEmail(window.localStorage.getItem("co_pending_verify_email") || ""); }, [email]);
  useEffect(() => { if (!remaining) return; const timer = window.setTimeout(() => setRemaining((value) => value - 1), 1000); return () => window.clearTimeout(timer); }, [remaining]);
  const setDigit = (index: number, value: string) => { const next = [...digits]; next[index] = value.replace(/\D/g, "").slice(-1); setDigits(next); if (next[index] && index < 5) refs.current[index + 1]?.focus(); };
  const paste = (event: React.ClipboardEvent) => { const code = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (!code) return; event.preventDefault(); setDigits(Array.from({ length: 6 }, (_, index) => code[index] || "")); refs.current[Math.min(code.length, 5)]?.focus(); };
  const verify = () => { const code = digits.join(""); if (!emailIsValid(email) || code.length !== 6) { setNotice({ kind: "error", message: "Enter the email address and all six code digits." }); return; } startTransition(async () => { try { await cognitoAuth({ action: "confirm", email, code }); window.localStorage.removeItem("co_pending_verify_email"); setNotice({ kind: "success", message: "Your email has been verified." }); window.setTimeout(() => router.replace(`/email-verified?email=${encodeURIComponent(email)}`), 500); } catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not verify that code." }); setDigits(["", "", "", "", "", ""]); refs.current[0]?.focus(); } }); };
  const resend = () => { if (!emailIsValid(email) || remaining) return; startTransition(async () => { try { await cognitoAuth({ action: "resend", email }); setNotice({ kind: "success", message: "A fresh code is on its way." }); setRemaining(30); } catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not resend the code." }); } }); };
  return <div className="mt-8 space-y-5"><NoticePanel notice={notice}/><Field label="Email" id="verify-email" type="email" value={email} onChange={setEmail} autoComplete="email" disabled={pending}/><div><div className="flex items-center justify-between"><label className="text-sm font-semibold text-[#2a1b13]">Verification code</label><span className="text-xs text-[#695e55]">6 digits</span></div><div className="mt-2 grid grid-cols-6 gap-2" onPaste={paste}>{digits.map((digit, index) => <input key={index} ref={(element) => { refs.current[index] = element; }} value={digit} onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus(); }} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} aria-label={`Verification digit ${index + 1}`} maxLength={1} className="co-auth-code" />)}</div></div><PrimaryButton pending={pending} type="button" onClick={verify}>{pending ? "Verifying" : "Verify email"}</PrimaryButton><div className="flex items-center justify-between gap-3 text-sm"><button type="button" disabled={Boolean(remaining) || pending} onClick={resend} className="font-semibold text-[#214d2b] underline underline-offset-4 disabled:cursor-not-allowed disabled:opacity-45">{remaining ? `Resend in ${remaining}s` : "Resend code"}</button><Link href="/register" className="font-semibold text-[#214d2b] underline underline-offset-4">Change email</Link></div></div>;
}

export function CustomerForgotPasswordForm() {
  const router = useRouter(); const search = useSearchParams(); const [email, setEmail] = useState(search.get("email") || ""); const [notice, setNotice] = useState<Notice>(null); const [pending, startTransition] = useTransition();
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!emailIsValid(email)) { setNotice({ kind: "error", message: "Enter the email address for your account." }); return; } startTransition(async () => { try { await cognitoAuth({ action: "forgot", email }); setNotice({ kind: "success", message: "A password reset code is on its way." }); window.setTimeout(() => router.push(`/reset-password?email=${encodeURIComponent(email)}`), 650); } catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not send a reset code." }); } }); };
  return <form onSubmit={submit} className="mt-8 space-y-5" noValidate><NoticePanel notice={notice}/><Field label="Email" id="forgot-email" type="email" value={email} onChange={setEmail} autoComplete="email" disabled={pending}/><PrimaryButton pending={pending}>{pending ? "Sending code" : "Send reset code"}</PrimaryButton><Link className="block text-center text-sm font-semibold text-[#214d2b] underline underline-offset-4" href="/login">Back to sign in</Link></form>;
}

export function CustomerResetPasswordForm() {
  const router = useRouter(); const search = useSearchParams(); const [email, setEmail] = useState(search.get("email") || ""); const [code, setCode] = useState(""); const [password, setPassword] = useState(""); const [confirm, setConfirm] = useState(""); const [notice, setNotice] = useState<Notice>(null); const [pending, startTransition] = useTransition(); const rules = passwordRules(password); const ready = rules.every(([, fulfilled]) => fulfilled);
  const submit = (event: React.FormEvent) => { event.preventDefault(); if (!emailIsValid(email) || !/^\d{6}$/.test(code) || !ready || password !== confirm) { setNotice({ kind: "error", message: "Check the email, six-digit code, and new password." }); return; } startTransition(async () => { try { await cognitoAuth({ action: "reset", email, code, password }); setNotice({ kind: "success", message: "Password changed. You can sign in now." }); window.setTimeout(() => router.replace(`/login?email=${encodeURIComponent(email)}`), 650); } catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not reset your password." }); } }); };
  return <form onSubmit={submit} className="mt-8 space-y-5" noValidate><NoticePanel notice={notice}/><Field label="Email" id="reset-email" type="email" value={email} onChange={setEmail} autoComplete="email" disabled={pending}/><Field label="Six-digit code" id="reset-code" value={code} onChange={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))} autoComplete="one-time-code" disabled={pending}/><PasswordField label="New password" id="reset-password" value={password} onChange={setPassword} autoComplete="new-password" disabled={pending}/><PasswordChecklist rules={rules}/><PasswordField label="Confirm new password" id="reset-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" disabled={pending} error={confirm && confirm !== password ? "Passwords do not match." : ""}/><PrimaryButton pending={pending}>{pending ? "Updating password" : "Update password"}</PrimaryButton><Link href="/login" className="block text-center text-sm font-semibold text-[#214d2b] underline underline-offset-4">Back to sign in</Link></form>;
}

export function EmailVerifiedCard() { const router = useRouter(); const search = useSearchParams(); const email = search.get("email") || ""; useEffect(() => { const timer = window.setTimeout(() => router.replace(`/login?verified=1&email=${encodeURIComponent(email)}`), 2400); return () => window.clearTimeout(timer); }, [email, router]); return <div className="mt-9 text-center"><motion.div initial={{ scale: 0.7, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mx-auto grid size-20 place-items-center rounded-full bg-[#e5f0df] text-[#214d2b]"><ShieldCheck size={38}/></motion.div><h2 className="mt-6 font-['Cormorant_Garamond'] text-4xl leading-none text-[#2a1b13]">Your email is verified.</h2><p className="mt-3 text-sm leading-6 text-[#695e55]">Welcome to .CO. Sign in securely to open your account dashboard.</p><Link href={`/login?verified=1&email=${encodeURIComponent(email)}`} className="co-auth-primary mt-7">Continue to sign in</Link><Link href="/shop" className="mt-4 block text-sm font-semibold text-[#214d2b] underline underline-offset-4">Continue shopping</Link></div>; }
