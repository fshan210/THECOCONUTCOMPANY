"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { AnimatePresence, motion } from "framer-motion";
import { Check, Cookie, Gift, Leaf, Settings2, X } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { readCookieConsent, saveCookieConsent } from "@/lib/privacy/consent";

const welcomeKey = "co_welcome_claimed_v1";
const ease = [0.16, 1, 0.3, 1] as const;

export function LaunchExperience() {
  const pathname = usePathname();
  const router = useRouter();
  const excluded = pathname.startsWith("/admin") || pathname.startsWith("/control-center");
  const [consentVisible, setConsentVisible] = useState(false);
  const [consentResolved, setConsentResolved] = useState(false);
  const [preferencesOpen, setPreferencesOpen] = useState(false);
  const [welcomeOpen, setWelcomeOpen] = useState(false);
  const [analytics, setAnalytics] = useState(false);
  const [marketing, setMarketing] = useState(false);
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [claimed, setClaimed] = useState(false);

  useEffect(() => {
    if (excluded) return;
    const consent = readCookieConsent();
    setConsentVisible(!consent);
    setConsentResolved(Boolean(consent));
    setAnalytics(Boolean(consent?.analytics));
    setMarketing(Boolean(consent?.marketing));
  }, [excluded]);

  useEffect(() => {
    if (excluded || !consentResolved || window.localStorage.getItem(welcomeKey)) return;
    const timer = window.setTimeout(() => setWelcomeOpen(true), 3200);
    return () => window.clearTimeout(timer);
  }, [consentResolved, excluded]);

  if (excluded) return null;

  const commitConsent = (nextAnalytics: boolean, nextMarketing: boolean) => {
    saveCookieConsent({ analytics: nextAnalytics, marketing: nextMarketing });
    setAnalytics(nextAnalytics);
    setMarketing(nextMarketing);
    setConsentResolved(true);
    setConsentVisible(false);
    setPreferencesOpen(false);
  };

  return (
    <>
      <AnimatePresence>
        {consentVisible ? (
          <motion.aside initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 24 }} transition={{ duration: .45, ease }} role="region" aria-label="Cookie consent" className="fixed inset-x-3 bottom-[calc(12px+env(safe-area-inset-bottom))] z-[240] mx-auto max-w-[1100px] rounded-[24px] border border-white/70 bg-[rgba(248,244,236,.94)] p-4 shadow-[0_24px_80px_rgba(42,27,19,.22)] backdrop-blur-2xl md:flex md:items-center md:gap-5 md:p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full bg-[#e6ecdf] text-[#214d2b]"><Cookie size={20} /></span>
            <div className="mt-3 min-w-0 flex-1 md:mt-0"><p className="font-['Cormorant_Garamond'] text-2xl leading-none">A thoughtful cookie moment.</p><p className="mt-2 text-[11px] leading-5 text-[#655a52]">Essential cookies keep .CO working. Optional analytics helps us improve the experience.</p></div>
            <div className="mt-4 grid grid-cols-2 gap-2 md:mt-0 md:flex">
              <button type="button" onClick={() => commitConsent(false, false)} className="min-h-11 rounded-full border border-[#214d2b]/20 px-4 text-[9px] font-semibold uppercase">Reject optional</button>
              <button type="button" onClick={() => setPreferencesOpen(true)} className="min-h-11 rounded-full border border-[#214d2b]/20 px-4 text-[9px] font-semibold uppercase">Manage</button>
              <button type="button" onClick={() => commitConsent(true, true)} className="co-primary-cta col-span-2 min-h-11 rounded-full bg-[#214d2b] px-5 text-[9px] font-semibold uppercase text-white">Accept all</button>
            </div>
          </motion.aside>
        ) : null}
      </AnimatePresence>

      {!consentVisible ? <button type="button" onClick={() => setPreferencesOpen(true)} aria-label="Manage cookie preferences" className="fixed bottom-[calc(10px+env(safe-area-inset-bottom))] left-3 z-[120] grid size-10 place-items-center rounded-full border border-black/8 bg-[rgba(248,244,236,.9)] text-[#214d2b] shadow-lg backdrop-blur-xl"><Cookie size={16} /></button> : null}

      <Dialog.Root open={preferencesOpen} onOpenChange={setPreferencesOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[245] bg-[#211812]/45 backdrop-blur-sm" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[250] w-[min(92vw,520px)] -translate-x-1/2 -translate-y-1/2 rounded-[28px] border border-white/70 bg-[#f8f4ec] p-6 shadow-[0_35px_110px_rgba(22,15,10,.32)] focus:outline-none">
            <div className="flex items-start justify-between"><div><Dialog.Title className="font-['Cormorant_Garamond'] text-4xl">Cookie preferences</Dialog.Title><Dialog.Description className="mt-2 text-xs leading-6 text-[#665b52]">Choose what feels right. Essential storage is always enabled.</Dialog.Description></div><Dialog.Close aria-label="Close preferences" className="grid size-10 place-items-center rounded-full border border-black/8"><X size={17}/></Dialog.Close></div>
            <div className="mt-6 space-y-3">
              <Preference title="Essential" body="Authentication, basket and consent choices." checked disabled onChange={() => undefined} />
              <Preference title="Analytics" body="Anonymous usage and performance measurement." checked={analytics} onChange={setAnalytics} />
              <Preference title="Marketing" body="Future campaign measurement and personalisation." checked={marketing} onChange={setMarketing} />
            </div>
            <button type="button" onClick={() => commitConsent(analytics, marketing)} className="co-primary-cta mt-6 min-h-12 w-full rounded-full bg-[#214d2b] text-[10px] font-semibold uppercase text-white">Save preferences</button>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      <Dialog.Root open={welcomeOpen} onOpenChange={setWelcomeOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 z-[225] bg-[#211812]/42 backdrop-blur-[7px]" />
          <Dialog.Content className="fixed left-1/2 top-1/2 z-[230] w-[min(92vw,780px)] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-[30px] border border-white/70 bg-[#f8f4ec] shadow-[0_38px_120px_rgba(22,15,10,.34)] focus:outline-none md:grid md:grid-cols-[.88fr_1.12fr]">
            <div className="relative hidden min-h-[520px] overflow-hidden bg-[url('/assets/home/refined/naturally-hydrating-4k.png')] bg-cover bg-center md:block"><div className="absolute inset-0 bg-gradient-to-t from-[#17361d]/80 via-transparent to-white/10"/><p className="absolute bottom-7 left-7 right-7 font-['Cormorant_Garamond'] text-3xl leading-none text-white">A small welcome,<br/>made for living.</p></div>
            <div className="relative p-6 md:p-8"><Dialog.Close aria-label="Close welcome offer" className="absolute right-4 top-4 grid size-10 place-items-center rounded-full border border-black/8"><X size={17}/></Dialog.Close><span className="grid size-12 place-items-center rounded-full bg-[#e4eadc] text-[#214d2b]"><Gift size={21}/></span><Dialog.Title className="mt-5 font-['Cormorant_Garamond'] text-[42px] leading-[.9]">Welcome to .CO</Dialog.Title><Dialog.Description className="mt-4 text-sm leading-6 text-[#655a52]">Claim an exclusive <strong className="text-[#214d2b]">50% off your first purchase</strong>. Quietly useful, never noisy.</Dialog.Description>
              {claimed ? <div className="mt-7 rounded-[22px] bg-[#e5ecdf] p-5 text-[#214d2b]" role="status"><Check size={20}/><p className="mt-3 font-semibold">Your welcome is saved.</p><p className="mt-1 text-xs">Taking you to create your .CO account…</p></div> : <form className="mt-7 space-y-3" onSubmit={(event) => { event.preventDefault(); if (!event.currentTarget.reportValidity()) return; window.localStorage.setItem(welcomeKey, "claimed"); window.localStorage.setItem("co_welcome_email", email.trim().toLowerCase()); if (name.trim()) window.localStorage.setItem("co_welcome_name", name.trim()); document.cookie = "co_welcome_claimed=1; Max-Age=31536000; Path=/; SameSite=Lax; Secure"; setClaimed(true); window.setTimeout(() => router.push("/register?source=welcome"), 700); }}>
                <label className="sr-only" htmlFor="welcome-name">Name (optional)</label><input id="welcome-name" value={name} onChange={(event)=>setName(event.target.value)} autoComplete="name" placeholder="Name (optional)" className="min-h-12 w-full rounded-[15px] border border-black/8 bg-white/65 px-4 text-sm outline-none focus:border-[#214d2b]" />
                <label className="sr-only" htmlFor="welcome-email">Email address</label><input id="welcome-email" type="email" required value={email} onChange={(event)=>setEmail(event.target.value)} autoComplete="email" placeholder="Email address" className="min-h-12 w-full rounded-[15px] border border-black/8 bg-white/65 px-4 text-sm outline-none focus:border-[#214d2b]" />
                <button type="submit" className="co-primary-cta min-h-12 w-full rounded-full bg-[#214d2b] text-[10px] font-semibold uppercase text-white">Claim my reward</button>
              </form>}
              <p className="mt-4 flex items-center gap-2 text-[9px] leading-4 text-[#756a61]"><Leaf size={13}/> One welcome only. Unsubscribe whenever you like.</p>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </>
  );
}

function Preference({ title, body, checked, disabled = false, onChange }: { title: string; body: string; checked: boolean; disabled?: boolean; onChange: (value: boolean) => void }) {
  return <label className="flex min-h-16 cursor-pointer items-center gap-4 rounded-[18px] border border-black/7 bg-white/55 p-4"><span className="grid size-10 place-items-center rounded-full bg-[#edf0e7] text-[#214d2b]"><Settings2 size={17}/></span><span className="min-w-0 flex-1"><strong className="block text-sm">{title}</strong><span className="mt-1 block text-[10px] leading-4 text-[#6b6057]">{body}</span></span><input type="checkbox" checked={checked} disabled={disabled} onChange={(event)=>onChange(event.target.checked)} className="size-5 accent-[#214d2b]" /></label>;
}
