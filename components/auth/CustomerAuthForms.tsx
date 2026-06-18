"use client";

import Link from "next/link";
import { useRef, useState, useTransition } from "react";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import type { UseFormRegisterReturn } from "react-hook-form";
import { CheckCircle2, Eye, EyeOff, Loader2, LogIn, UserPlus } from "lucide-react";
import { loginCustomer, registerCustomer, type CustomerAuthState } from "@/lib/customer/actions";
import { productCategories } from "@/lib/catalog";

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
  const [state, action] = useFormState(loginCustomer, initialState);
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
        if (!(await trigger())) {
          if (errors.email) setFocus("email");
          else setFocus("password");
          return;
        }
        startTransition(() => action(new FormData(event.currentTarget)));
      }}
    >
      <AuthMessage message={state.message} positive={state.ok} />
      <AuthInput id="customer-email" label="Email" type="email" autoComplete="username" error={errors.email?.message} disabled={pending} register={register("email")} />
      <PasswordInput id="customer-password" label="Password" show={showPassword} onToggle={() => setShowPassword((value) => !value)} disabled={pending} error={errors.password?.message} register={register("password")} />
      <button type="submit" disabled={pending} className="co-admin-primary-button w-full">
        {pending ? <Loader2 className="animate-spin" size={18} /> : <LogIn size={18} />}
        {pending ? "Signing you in..." : "Login"}
      </button>
      <p className="text-center text-sm text-coconut/72">
        New to .CO?{" "}
        <Link href="/register" className="font-medium text-coconut underline underline-offset-4">
          Create account
        </Link>
      </p>
    </form>
  );
}

export function CustomerRegisterForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [state, action] = useFormState(registerCustomer, initialState);
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
        if (!(await trigger())) {
          if (errors.name) setFocus("name");
          else if (errors.email) setFocus("email");
          else setFocus("password");
          return;
        }
        startTransition(() => action(new FormData(event.currentTarget)));
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
        <button type="button" onClick={onToggle} aria-label={show ? "Hide password" : "Show password"} className="absolute right-2 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-md text-coconut transition hover:bg-coconut/10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-coconut">
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
    <p className={`flex items-start gap-2 rounded-md px-3 py-2 text-sm leading-6 ${positive ? "bg-grove/12 text-grove" : "bg-red-950/5 text-red-900"}`} role={positive ? "status" : "alert"}>
      <CheckCircle2 className="mt-1 shrink-0" size={15} />
      <span>{message}</span>
    </p>
  );
}
