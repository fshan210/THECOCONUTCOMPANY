"use client";

import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

export function ContactQuickForm() {
  const [status, setStatus] = useState("");
  return <form className="rounded-[28px] border border-black/6 bg-[#f8f4ec] p-5 md:p-7" data-analytics-form="contact" onSubmit={(event)=>{event.preventDefault();if(!event.currentTarget.reportValidity())return;const data=new FormData(event.currentTarget);const subject=encodeURIComponent(`.CO enquiry — ${String(data.get("topic"))}`);const body=encodeURIComponent(`Name: ${String(data.get("name"))}\nEmail: ${String(data.get("email"))}\n\n${String(data.get("message"))}`);setStatus("Your email app is opening with the message ready for your review.");window.location.href=`mailto:hello@cothecoconutcompany.com?subject=${subject}&body=${body}`;}}>
    <p className="text-[10px] font-semibold uppercase tracking-[.15em] text-[#214d2b]">Send a note</p><h2 className="mt-3 font-['Cormorant_Garamond'] text-4xl leading-none">What can we help with?</h2>
    <div className="mt-6 grid gap-4 md:grid-cols-2"><Field name="name" label="Name" autoComplete="name"/><Field name="email" label="Email" type="email" autoComplete="email"/><label className="grid gap-2 text-xs font-semibold md:col-span-2">Topic<select name="topic" className="min-h-12 rounded-[14px] border border-black/8 bg-white px-4 font-normal outline-none"><option>Product question</option><option>Retail or distributor</option><option>Recipe or community</option><option>Account support</option></select></label><label className="grid gap-2 text-xs font-semibold md:col-span-2">Message<textarea name="message" required minLength={10} rows={5} className="rounded-[14px] border border-black/8 bg-white p-4 font-normal outline-none" placeholder="Tell us a little more…"/></label></div>
    <button className="co-primary-cta mt-5 inline-flex min-h-12 items-center gap-3 rounded-full bg-[#214d2b] px-6 text-[10px] font-semibold uppercase text-white">Prepare email <ArrowRight size={14}/></button><p className="mt-4 flex min-h-5 items-center gap-2 text-xs text-[#214d2b]" role="status" aria-live="polite">{status?<><Check size={14}/>{status}</>:null}</p>
  </form>;
}

function Field({name,label,type="text",autoComplete}:{name:string;label:string;type?:string;autoComplete:string}){return <label className="grid gap-2 text-xs font-semibold">{label}<input name={name} type={type} required autoComplete={autoComplete} className="min-h-12 rounded-[14px] border border-black/8 bg-white px-4 font-normal outline-none"/></label>}
