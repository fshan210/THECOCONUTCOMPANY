"use client";

import Link from "next/link";
import { useEffect, useRef, useState, useTransition, type ComponentProps, type ReactNode } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, ArrowRight, BookOpen, Check, CheckCircle2, ChefHat, CircleAlert, Eye, EyeOff, Heart, Loader2, LockKeyhole, Mail, PackageCheck, ShieldCheck, ShoppingBag, UserRound, Zap } from "lucide-react";
import { motion } from "framer-motion";
import { ReferenceHeader } from "@/components/home/ReferenceHomePage";
import { createClientSubmissionLock } from "@/lib/auth/client-submission-lock";

type AuthResult = { ok?: boolean; message?: string; status?: string; email?: string; flow?: string; returnTo?: string; retryAfter?: number; resumed?: boolean; data?: { delivery?: string; maskedDestination?: string } };
type Notice = { kind: "success" | "error"; message: string } | null;
type AuthVariant = "login" | "register" | "forgot" | "reset" | "verify" | "verified";

class AuthApiError extends Error {
  flow?: string;
  returnTo?: string;
  retryAfter?: number;
  constructor(result: AuthResult) {
    super(result.message || "We could not complete that request.");
    this.flow = result.flow;
    this.returnTo = result.returnTo;
    this.retryAfter = result.retryAfter;
  }
}

async function cognitoAuth(input: Record<string, string>) {
  const response = await fetch("/api/auth/cognito", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify(input) });
  const result = (await response.json()) as AuthResult;
  if (!response.ok || !result.ok) throw new AuthApiError(result);
  return result;
}

async function resendConfirmation(email: string, returnTo?: string) {
  const response = await fetch("/api/auth/cognito/resend-confirmation", { method: "POST", credentials: "same-origin", headers: { "content-type": "application/json" }, body: JSON.stringify({ email, returnTo }) });
  const result = (await response.json()) as AuthResult;
  if (!response.ok || !result.ok) throw new AuthApiError(result);
  return result;
}

async function subscribeNewsletter(email: string) {
  const response = await fetch("/api/newsletter", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ email: email.trim().toLowerCase(), source: "customer_registration", consent: true, honeypot: "" }) });
  if (!response.ok) throw new Error("Newsletter consent could not be saved.");
}

const emailIsValid = (email: string) => /^\S+@\S+\.\S+$/.test(email);
const allowedClientReturnPaths = new Set(["/shop", "/cart", "/wishlist", "/account", "/products"]);
const safeClientReturnTo = (value?: string | null) => {
  if (!value || !value.startsWith("/") || value.startsWith("//")) return "/shop";
  const path = value.split("?")[0] || "/shop";
  return allowedClientReturnPaths.has(path) ? value : "/shop";
};
const passwordRules = (password: string) => [
  ["At least 10 characters", password.length >= 10],
  ["One uppercase letter", /[A-Z]/.test(password)],
  ["One lowercase letter", /[a-z]/.test(password)],
  ["One number", /\d/.test(password)],
  ["One special character", /[^A-Za-z0-9]/.test(password)]
] as const;

const authBackgrounds: Record<AuthVariant, { desktop: string; mobile: string }> = {
  login: { desktop: "/assets/redesign/auth/backgrounds/sign-in-desktop.png", mobile: "/assets/redesign/auth/backgrounds/sign-in-mobile.png" },
  register: { desktop: "/assets/redesign/auth/backgrounds/sign-in-desktop.png", mobile: "/assets/redesign/auth/backgrounds/sign-in-mobile.png" },
  forgot: { desktop: "/assets/redesign/auth/backgrounds/recovery-desktop.png", mobile: "/assets/redesign/auth/backgrounds/recovery-mobile.png" },
  reset: { desktop: "/assets/redesign/auth/backgrounds/recovery-desktop.png", mobile: "/assets/redesign/auth/backgrounds/recovery-mobile.png" },
  verify: { desktop: "/assets/redesign/auth/backgrounds/verification-desktop.png", mobile: "/assets/redesign/auth/backgrounds/verification-mobile.png" },
  verified: { desktop: "/assets/redesign/auth/backgrounds/verification-desktop.png", mobile: "/assets/redesign/auth/backgrounds/verification-mobile.png" }
};

const authQuotes: Record<AuthVariant, ReactNode> = {
  login: <>Good things are better<br />when they’re natural,<br />thoughtful, and made<br />to be shared.</>,
  register: <>A more thoughtful<br />table starts with<br />brighter choices.</>,
  forgot: <>Good things are better<br />when they’re natural, thoughtful,<br />and made to be shared.</>,
  reset: <>A small reset.<br />A brighter return.</>,
  verify: <>More good<br />things are coming.</>,
  verified: <>The next good thing<br />starts here.</>
};

const authMarkers: Record<AuthVariant, string> = {
  login: "04 — SIGN IN + ACCOUNT ENTRY",
  register: "04 — CREATE YOUR ACCOUNT",
  forgot: "05 — PASSWORD RESET",
  reset: "05 — CHOOSE A NEW PASSWORD",
  verify: "05 — VERIFICATION CODE",
  verified: "05 — ACCOUNT VERIFIED"
};

function Scene({ variant }: { variant: AuthVariant }) {
  const background = authBackgrounds[variant];
  return <aside className="co-auth-scene" aria-label="A sunlit .CO coconut ritual" style={{ "--auth-scene-desktop": `url(\"${background.desktop}\")`, "--auth-scene-mobile": `url(\"${background.mobile}\")` } as React.CSSProperties}><blockquote className="co-auth-scene-quote"><p>{authQuotes[variant]}</p><span aria-hidden="true" /><cite>The .CO way</cite></blockquote></aside>;
}

export function AuthShell({ variant, eyebrow, title, description, children }: { variant: AuthVariant; eyebrow: string; title: ReactNode; description: string; children: ReactNode }) {
  const recovery = variant === "forgot" || variant === "reset";
  const background = authBackgrounds[variant];
  return <div className={`co-auth-page co-auth-page--${variant}`}><ReferenceHeader />{recovery ? <div className="co-auth-recovery" style={{ "--auth-scene-desktop": `url(\"${background.desktop}\")`, "--auth-scene-mobile": `url(\"${background.mobile}\")` } as React.CSSProperties}><motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="co-auth-recovery-content"><header className="co-auth-intro"><p className="co-auth-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>{children}<blockquote className="co-auth-recovery-quote"><p>{authQuotes[variant]}</p><span aria-hidden="true" /><cite>The .CO way</cite></blockquote></motion.section></div> : <div className="co-auth-split"><motion.section initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }} className="co-auth-content"><div className="co-auth-content-inner"><header className="co-auth-intro"><p className="co-auth-eyebrow">{eyebrow}</p><h1>{title}</h1><p>{description}</p></header>{children}</div></motion.section><Scene variant={variant} /></div>}<p className="co-auth-marker">{authMarkers[variant]}</p></div>;
}

function NoticePanel({ notice }: { notice: Notice }) {
  const Icon = notice?.kind === "success" ? CheckCircle2 : CircleAlert;
  return <div className={`co-auth-notice ${notice ? `is-${notice.kind}` : "is-empty"}`} role={notice?.kind === "error" ? "alert" : "status"} aria-live="polite">{notice ? <><Icon aria-hidden="true" size={17} /><span>{notice.message}</span></> : null}</div>;
}

function Field({ label, id, type = "text", value, onChange, error, hint, autoComplete, disabled, icon, inputMode, maxLength, children }: { label: string; id: string; type?: string; value: string; onChange: (value: string) => void; error?: string; hint?: string; autoComplete?: string; disabled?: boolean; icon?: ReactNode; inputMode?: "email" | "numeric" | "text"; maxLength?: number; children?: ReactNode }) {
  const describedBy = [error ? `${id}-error` : "", hint ? `${id}-hint` : ""].filter(Boolean).join(" ") || undefined;
  return <div className="co-auth-field"><label htmlFor={id}>{label}</label><div className="co-auth-field-control">{icon ? <span className="co-auth-field-icon" aria-hidden="true">{icon}</span> : null}<input id={id} type={type} value={value} onChange={(event) => onChange(event.target.value)} autoComplete={autoComplete} disabled={disabled} aria-invalid={Boolean(error)} aria-describedby={describedBy} inputMode={inputMode} maxLength={maxLength} className="co-auth-input" />{children}</div><div className="co-auth-field-message">{error ? <p id={`${id}-error`} role="alert">{error}</p> : hint ? <p id={`${id}-hint`}>{hint}</p> : null}</div></div>;
}

function PasswordField({ label, id, value, onChange, error, hint, autoComplete = "current-password", disabled }: Omit<ComponentProps<typeof Field>, "type" | "children" | "icon">) {
  const [visible, setVisible] = useState(false);
  return <Field label={label} id={id} type={visible ? "text" : "password"} value={value} onChange={onChange} error={error} hint={hint} autoComplete={autoComplete} disabled={disabled} icon={<LockKeyhole size={18} />}><button type="button" onClick={() => setVisible((current) => !current)} aria-label={visible ? "Hide password" : "Show password"} className="co-auth-password-toggle">{visible ? <EyeOff size={18} /> : <Eye size={18} />}</button></Field>;
}

function PrimaryButton({ children, pending, type = "submit", onClick }: { children: ReactNode; pending?: boolean; type?: "button" | "submit"; onClick?: () => void }) {
  return <button type={type} disabled={pending} onClick={onClick} className="co-auth-primary"><span className="co-auth-primary-fill" aria-hidden="true" />{pending ? <Loader2 className="co-auth-spinner" size={17} /> : null}<span>{children}</span>{!pending ? <ArrowRight aria-hidden="true" size={18} /> : null}</button>;
}

function OAuthButtons() {
  return <div className="co-auth-oauth" aria-label="Social sign-in availability"><button type="button" disabled aria-disabled="true" title="Google sign-in is not configured"><span className="co-google-mark">G</span><span>Continue with Google</span><small>Unavailable</small></button><button type="button" disabled aria-disabled="true" title="Apple sign-in is not configured"><span className="co-apple-mark">●</span><span>Continue with Apple</span><small>Unavailable</small></button></div>;
}

const benefits = [
  { icon: PackageCheck, title: "Track orders", copy: "Follow your orders in real time." },
  { icon: Heart, title: "Save favourites", copy: "Keep products and recipes you love." },
  { icon: BookOpen, title: "Keep recipes", copy: "Save, organise and cook with ease." },
  { icon: Zap, title: "Checkout faster", copy: "Use saved details when available." }
];

function BenefitPanel({ register = false }: { register?: boolean }) {
  return <aside className="co-auth-benefits"><h2>{register ? "Why join .CO?" : "Why make an account?"}</h2>{!register ? <p>It’s free, easy, and makes everything better.</p> : null}<div className="co-auth-benefit-grid">{benefits.map(({ icon: Icon, title, copy }) => <div key={title}><span className="co-auth-benefit-icon"><Icon size={21} /></span><span><strong>{title}</strong><small>{copy}</small></span></div>)}</div>{!register ? <Link className="co-auth-primary" href="/register"><span>Create account</span><ArrowRight size={18} /></Link> : null}</aside>;
}

function AuthTabs({ active }: { active: "login" | "register" }) {
  return <nav className="co-auth-tabs" aria-label="Account access"><Link aria-current={active === "login" ? "page" : undefined} href="/login">Sign in</Link><Link aria-current={active === "register" ? "page" : undefined} href="/register">Create account</Link></nav>;
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
  const passwordError = password && password.length < 10 ? "Use at least 10 characters." : "";
  const returnTo = safeClientReturnTo(search.get("redirect"));
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailIsValid(email) || password.length < 10) { setNotice({ kind: "error", message: "Check your email and password, then try again." }); return; }
    startTransition(async () => {
      try {
        await cognitoAuth({ action: "login", email, password, returnTo });
        if (!remember) window.sessionStorage.setItem("co-session-preference", "session");
        setNotice({ kind: "success", message: "Welcome back to .CO." });
        window.dispatchEvent(new Event("co-auth-changed"));
        router.refresh();
        window.setTimeout(() => router.replace(returnTo), 450);
      } catch (error) {
        if (error instanceof AuthApiError && error.flow === "verification_required") { router.replace(`/verify-email?notice=unconfirmed&returnTo=${encodeURIComponent(returnTo)}`); return; }
        if (error instanceof AuthApiError && error.flow === "password_reset_required") { router.replace(`/forgot-password?email=${encodeURIComponent(email)}`); return; }
        setNotice({ kind: "error", message: error instanceof Error ? error.message : "Unable to sign in." });
      }
    });
  };
  return <><AuthTabs active="login" /><form onSubmit={submit} className="co-auth-form" noValidate><NoticePanel notice={notice} /><Field label="Email address" id="login-email" type="email" value={email} onChange={setEmail} autoComplete="username" inputMode="email" disabled={pending} error={emailError} icon={<Mail size={18} />} /><PasswordField label="Password" id="login-password" value={password} onChange={setPassword} autoComplete="current-password" disabled={pending} error={passwordError} /><div className="co-auth-inline"><label className="co-auth-check"><input type="checkbox" checked={remember} onChange={(event) => setRemember(event.target.checked)} /><span aria-hidden="true"><Check size={12} /></span>Remember me</label><Link href={`/forgot-password?email=${encodeURIComponent(email)}`}>Forgot password?</Link></div><PrimaryButton pending={pending}>{pending ? "Signing in" : "Sign in"}</PrimaryButton><div className="co-auth-divider"><span>or continue with</span></div><OAuthButtons /><p className="co-auth-privacy">We’ll never post without your permission.<br />By continuing, you agree to our <Link href="/terms-and-conditions">Terms of Use</Link> and <Link href="/privacy-policy">Privacy Policy</Link>.</p></form><BenefitPanel /></>;
}

const accountReasons = [
  { id: "pantry", icon: ShoppingBag, title: "Shop the pantry", copy: "Discover our coconut products" },
  { id: "recipes", icon: ChefHat, title: "Find recipes", copy: "Get inspired in the kitchen" },
  { id: "both", icon: Heart, title: "Both, please", copy: "Products, recipes and more" }
] as const;

export function CustomerRegisterForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [reason, setReason] = useState<(typeof accountReasons)[number]["id"]>("pantry");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [marketing, setMarketing] = useState(false);
  const [terms, setTerms] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const returnTo = safeClientReturnTo(search.get("returnTo") || search.get("redirect"));
  const rules = passwordRules(password);
  const passwordReady = rules.every(([, fulfilled]) => fulfilled);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (name.trim().length < 2 || !emailIsValid(email) || !passwordReady || password !== confirmPassword || !terms) { setNotice({ kind: "error", message: "Complete each field and accept the terms to create your account." }); return; }
    startTransition(async () => {
      try {
        const result = await cognitoAuth({ action: "signup", name: name.trim(), email, password, returnTo });
        let newsletterSaved = true;
        if (marketing) { try { await subscribeNewsletter(email); } catch { newsletterSaved = false; } }
        setNotice({ kind: "success", message: `${result.resumed ? "We sent a fresh verification code." : "Account created. We sent a six-digit code to your email."}${marketing && !newsletterSaved ? " Your account is ready, but we could not save the optional newsletter choice." : ""}` });
        window.setTimeout(() => router.push(`/verify-email?notice=created&returnTo=${encodeURIComponent(returnTo)}`), 850);
      } catch (error) {
        if (error instanceof AuthApiError && error.flow === "account_exists") { setNotice({ kind: "error", message: "An account already exists with this email. Sign in or reset your password." }); return; }
        setNotice({ kind: "error", message: error instanceof Error ? error.message : "Unable to create your account." });
      }
    });
  };
  return <><section className="co-auth-step"><p className="co-auth-step-label">Step 1</p><h2>What brings you to .CO?</h2><div className="co-auth-choice-list">{accountReasons.map(({ id, icon: Icon, title, copy }) => <button key={id} type="button" aria-pressed={reason === id} onClick={() => setReason(id)}><Icon size={25} /><span><strong>{title}</strong><small>{copy}</small></span><i aria-hidden="true">{reason === id ? <Check size={16} /> : null}</i></button>)}</div></section><section className="co-auth-step"><p className="co-auth-step-label">Step 2</p><h2>Let’s set up your account for shopping and recipes.</h2><form onSubmit={submit} className="co-auth-form co-auth-register-form" noValidate><NoticePanel notice={notice} /><Field label="Full name" id="register-name" value={name} onChange={setName} autoComplete="name" disabled={pending} error={name && name.trim().length < 2 ? "Enter at least two characters." : ""} hint="So we know what to call you." icon={<UserRound size={18} />} /><Field label="Email address" id="register-email" type="email" value={email} onChange={setEmail} autoComplete="username" inputMode="email" disabled={pending} error={email && !emailIsValid(email) ? "Enter a valid email address." : ""} hint="We’ll send your order updates and recipe ideas." icon={<Mail size={18} />} /><PasswordField label="Password" id="register-password" value={password} onChange={setPassword} autoComplete="new-password" disabled={pending} hint="Use 10+ characters with upper and lowercase, a number and a symbol." /><PasswordChecklist rules={rules} /><PasswordField label="Confirm password" id="register-confirm-password" value={confirmPassword} onChange={setConfirmPassword} autoComplete="new-password" disabled={pending} error={confirmPassword && confirmPassword !== password ? "Passwords do not match." : ""} hint="Just to be sure we’ve got it right." /><label className="co-auth-switch"><input type="checkbox" checked={marketing} onChange={(event) => setMarketing(event.target.checked)} /><span aria-hidden="true"><i /></span><b>Send me seasonal recipe drops and product stories<small>Good food. A brighter tomorrow.</small></b></label><label className="co-auth-check co-auth-terms"><input type="checkbox" checked={terms} onChange={(event) => setTerms(event.target.checked)} /><span aria-hidden="true"><Check size={12} /></span><b>I agree to the <Link href="/terms-and-conditions">terms</Link> and acknowledge the <Link href="/privacy-policy">privacy policy</Link>.</b></label><PrimaryButton pending={pending}>{pending ? "Creating your account" : "Create account"}</PrimaryButton><p className="co-auth-account-link">Already have an account? <Link href="/login">Sign in</Link></p><div className="co-auth-divider"><span>or continue with</span></div><OAuthButtons /></form></section><BenefitPanel register /></>;
}

function PasswordChecklist({ rules }: { rules: ReturnType<typeof passwordRules> }) {
  return <ul className="co-auth-password-rules">{rules.map(([label, fulfilled]) => <li key={label} className={fulfilled ? "is-ready" : ""}><span>{fulfilled ? <Check size={10} /> : null}</span>{label}</li>)}</ul>;
}

export function CustomerVerifyEmailForm({ initialEmail = "", maskedDestination = "your email address", initialReturnTo = "/shop" }: { initialEmail?: string; maskedDestination?: string; initialReturnTo?: string }) {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState(initialEmail || search.get("email") || "");
  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [notice, setNotice] = useState<Notice>(search.get("notice") === "unconfirmed" ? { kind: "error", message: "Your email is not verified yet. Enter your code or request a new one." } : search.get("notice") === "created" ? { kind: "success", message: "Account created. Check your email for the six-digit code." } : null);
  const [remaining, setRemaining] = useState(0);
  const [retrySequence, setRetrySequence] = useState(0);
  const [pending, startTransition] = useTransition();
  const refs = useRef<Array<HTMLInputElement | null>>([]);
  const countdownRef = useRef<number | null>(null);
  const submissionLock = useRef(createClientSubmissionLock());
  const returnTo = safeClientReturnTo(search.get("returnTo") || initialReturnTo);
  useEffect(() => () => {
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
  }, []);
  useEffect(() => {
    if (!retrySequence) return;
    submissionLock.current.release();
    refs.current[0]?.focus();
  }, [retrySequence]);
  const tick = (seconds: number) => {
    if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
    setRemaining(seconds);
    countdownRef.current = window.setInterval(() => setRemaining((value) => {
      if (value <= 1) {
        if (countdownRef.current !== null) window.clearInterval(countdownRef.current);
        countdownRef.current = null;
        return 0;
      }
      return value - 1;
    }), 1000);
  };
  const setDigit = (index: number, value: string) => { const next = [...digits]; next[index] = value.replace(/\D/g, "").slice(-1); setDigits(next); if (next[index] && index < 5) refs.current[index + 1]?.focus(); };
  const paste = (event: React.ClipboardEvent) => { const code = event.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6); if (!code) return; event.preventDefault(); setDigits(Array.from({ length: 6 }, (_, index) => code[index] || "")); refs.current[Math.min(code.length, 5)]?.focus(); };
  const verify = () => {
    if (!submissionLock.current.tryAcquire()) return;
    const code = digits.join("");
    if (!emailIsValid(email) || code.length !== 6 || pending) { submissionLock.current.release(); setNotice({ kind: "error", message: "Enter the complete six-digit code." }); return; }
    startTransition(async () => {
      try { await cognitoAuth({ action: "confirm", email, code, returnTo }); setNotice({ kind: "success", message: "Your email has been verified." }); window.setTimeout(() => router.replace(`/email-verified?returnTo=${encodeURIComponent(returnTo)}&email=${encodeURIComponent(email)}`), 500); }
      catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not verify that code." }); setDigits(["", "", "", "", "", ""]); setRetrySequence((value) => value + 1); }
    });
  };
  const resend = () => {
    if (!emailIsValid(email) || remaining || pending) return;
    startTransition(async () => {
      try { const result = await resendConfirmation(email, returnTo); setNotice({ kind: "success", message: `A fresh code is on its way to ${result.data?.maskedDestination || maskedDestination}.` }); tick(60); }
      catch (error) { if (error instanceof AuthApiError && error.retryAfter) tick(error.retryAfter); setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not resend the code." }); }
    });
  };
  return <div className="co-auth-verify"><NoticePanel notice={notice} /><div className="co-auth-email-summary"><Mail size={20} /><span>Sent to <strong>{maskedDestination}</strong></span><Link href="/register">Change email</Link></div>{!initialEmail ? <Field label="Email address" id="verify-email" type="email" value={email} onChange={setEmail} autoComplete="email" inputMode="email" disabled={pending} icon={<Mail size={18} />} /> : null}<fieldset><legend className="sr-only">Six-digit verification code</legend><div className={`co-auth-code-row ${digits.every(Boolean) ? "is-complete" : ""}`} onPaste={paste}>{digits.map((digit, index) => <input key={index} ref={(element) => { refs.current[index] = element; }} value={digit} placeholder=" " onChange={(event) => setDigit(index, event.target.value)} onKeyDown={(event) => { if (event.key === "ArrowLeft" && index > 0) refs.current[index - 1]?.focus(); if (event.key === "ArrowRight" && index < 5) refs.current[index + 1]?.focus(); if (event.key === "Backspace" && !digits[index] && index > 0) refs.current[index - 1]?.focus(); if (event.key === "Enter") verify(); }} inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} autoFocus={index === 0} disabled={pending} aria-label={`Verification digit ${index + 1}`} maxLength={1} className="co-auth-code" />)}</div></fieldset><div className="co-auth-resend"><p>Didn’t get it? <button type="button" disabled={Boolean(remaining) || pending} onClick={resend}>Resend code</button></p><small>{remaining ? `You can resend in 00:${String(remaining).padStart(2, "0")}` : "You can request a new code now."}</small></div><PrimaryButton pending={pending} type="button" onClick={verify}>{pending ? "Verifying" : "Verify & continue"}</PrimaryButton><Link className="co-auth-back" href="/login"><ArrowLeft size={18} />Back to sign in</Link><div className="co-auth-divider"><span>When it’s right, you’ll be welcomed in.</span></div></div>;
}

export function CustomerForgotPasswordForm() {
  const search = useSearchParams();
  const [email, setEmail] = useState(search.get("email") || "");
  const [sent, setSent] = useState(false);
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailIsValid(email)) { setNotice({ kind: "error", message: "Enter the email address for your account." }); return; }
    startTransition(async () => {
      try { await cognitoAuth({ action: "forgot", email }); setNotice(null); setSent(true); }
      catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not send a reset code." }); }
    });
  };
  if (sent) return <motion.section initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="co-auth-inbox"><span className="co-auth-inbox-icon"><Mail size={32} /></span><h2>Check your <em>inbox.</em></h2><p>The reset code should arrive shortly.<br />Keep this page open while you check.</p><small>Can’t see it? Check your spam folder — sometimes it takes the scenic route.</small><Link className="co-auth-primary" href={`/reset-password?email=${encodeURIComponent(email)}`}><span>Enter the reset code</span><ArrowRight size={18} /></Link><Link href="/login" className="co-auth-back"><ArrowLeft size={18} />Back to sign in</Link></motion.section>;
  return <form onSubmit={submit} className="co-auth-recovery-form" noValidate><NoticePanel notice={notice} /><Field label="Email address" id="forgot-email" type="email" value={email} onChange={setEmail} autoComplete="email" inputMode="email" disabled={pending} error={email && !emailIsValid(email) ? "Enter a valid email address." : ""} icon={<Mail size={18} />} /><p>We’ll send a secure code that lets you choose a new password.<br />No judgment, no rush.</p><PrimaryButton pending={pending}>{pending ? "Sending" : "Send me the code"}</PrimaryButton><div className="co-auth-divider"><span><Link href="/login">Back to sign in</Link></span></div></form>;
}

export function CustomerResetPasswordForm() {
  const router = useRouter();
  const search = useSearchParams();
  const [email, setEmail] = useState(search.get("email") || "");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [notice, setNotice] = useState<Notice>(null);
  const [pending, startTransition] = useTransition();
  const rules = passwordRules(password);
  const ready = rules.every(([, fulfilled]) => fulfilled);
  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    if (!emailIsValid(email) || !/^\d{6}$/.test(code) || !ready || password !== confirm) { setNotice({ kind: "error", message: "Check the email, six-digit code, and new password." }); return; }
    startTransition(async () => {
      try { await cognitoAuth({ action: "reset", email, code, password }); setNotice({ kind: "success", message: "Password changed. You can sign in now." }); window.setTimeout(() => router.replace(`/login?email=${encodeURIComponent(email)}`), 650); }
      catch (error) { setNotice({ kind: "error", message: error instanceof Error ? error.message : "We could not reset your password." }); }
    });
  };
  return <form onSubmit={submit} className="co-auth-recovery-form co-auth-reset-form" noValidate><NoticePanel notice={notice} /><Field label="Email address" id="reset-email" type="email" value={email} onChange={setEmail} autoComplete="email" inputMode="email" disabled={pending} icon={<Mail size={18} />} /><Field label="Six-digit code" id="reset-code" value={code} onChange={(value) => setCode(value.replace(/\D/g, "").slice(0, 6))} autoComplete="one-time-code" inputMode="numeric" maxLength={6} disabled={pending} icon={<ShieldCheck size={18} />} /><PasswordField label="New password" id="reset-password" value={password} onChange={setPassword} autoComplete="new-password" disabled={pending} /><PasswordChecklist rules={rules} /><PasswordField label="Confirm new password" id="reset-confirm" value={confirm} onChange={setConfirm} autoComplete="new-password" disabled={pending} error={confirm && confirm !== password ? "Passwords do not match." : ""} /><PrimaryButton pending={pending}>{pending ? "Updating password" : "Update password"}</PrimaryButton><Link href="/login" className="co-auth-back"><ArrowLeft size={18} />Back to sign in</Link></form>;
}

export function EmailVerifiedCard() {
  const search = useSearchParams();
  const returnTo = safeClientReturnTo(search.get("returnTo"));
  const email = search.get("email") || "";
  const continuation = `/login?verified=1&redirect=${encodeURIComponent(returnTo)}${email ? `&email=${encodeURIComponent(email)}` : ""}`;
  return <div className="co-auth-verified-card"><motion.div initial={{ scale: 0.78, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: "spring", stiffness: 220, damping: 18 }} className="co-auth-verified-icon"><ShieldCheck size={36} /></motion.div><h2>Welcome to <em>.CO</em></h2><p>Your email is verified. Enter your password once to establish your secure session.</p><Link href={continuation} className="co-auth-primary"><span>Continue securely</span><ArrowRight size={18} /></Link><Link href="/shop" className="co-auth-back">Continue shopping</Link></div>;
}
