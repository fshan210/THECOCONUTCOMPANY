"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ResponsiveImage } from "@/components/media/ResponsiveImage";
import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState, type MouseEvent, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { ArrowRight, BookOpen, CreditCard, Heart, Leaf, LockKeyhole, MapPin, Package, Settings, ShieldCheck, Soup, UserRound } from "lucide-react";
import { ReferenceHeader } from "@/components/home/ReferenceHomePage";
import { useCustomerSession } from "@/components/auth/CustomerAuthProvider";
import { isAccountRoute } from "@/lib/account/routes";
import type { AccountView } from "@/lib/account/routes";
import "@/styles/reference-account.css";
const tabs = [
  {label:"Overview",href:"/account",views:["overview","empty"],Icon:UserRound},
  {label:"Orders",href:"/orders",views:["orders","history","detail"],Icon:Package},
  {label:"Wishlist",href:"/wishlist",views:["wishlist"],Icon:Heart},
  {label:"Recipes",href:"/saved-recipes",views:["recipes"],Icon:Soup},
  {label:"Addresses",href:"/account/addresses",views:["addresses"],Icon:MapPin},
  {label:"Payments",href:"/account/payments",views:["payments"],Icon:CreditCard},
  {label:"Preferences",href:"/profile",views:["preferences"],Icon:Settings},
  {label:"Security",href:"/account/security",views:["security"],Icon:LockKeyhole}
];
const intros: Record<AccountView,{title:string;emphasis?:string;body:string;note:string;scene:number}> = {
  overview:{title:"Good to see you,",body:"Everything you’ve ordered, saved and come back for.",note:"Thank you for being part of our story.",scene:1},
  orders:{title:"My Orders",emphasis:"Good things are on their way.",body:"Nourishment from nature, delivered to your door.",note:"Pure goodness. A brighter tomorrow.",scene:1},
  history:{title:"Order History",emphasis:"The good things keep coming.",body:"A record of your coconut moments, from everyday essentials to special discoveries.",note:"Real ingredients. A brighter you. Always .CO.",scene:1},
  detail:{title:"Order Details",emphasis:"Real ingredients. A brighter tomorrow.",body:"Your order, with every detail in one place.",note:"Good things travel further.",scene:1},
  addresses:{title:"Saved Addresses",emphasis:"Good things, closer to you.",body:"Keep your addresses saved for a faster, smoother checkout — so your coconut favourites always find their way home.",note:"Wellness finds its way home.",scene:1},
  wishlist:{title:"Keep your favourites close.",body:"The good stuff, always within reach. Pick up where inspiration left off.",note:"Good things are better together.",scene:5},
  recipes:{title:"Saved Recipes",emphasis:"Good food stays with you.",body:"Your saved recipes, ready when you are. Real ingredients. A kinder kitchen.",note:"Coconut makes it better.",scene:7},
  preferences:{title:"Your preferences,",emphasis:"a more coconutful you.",body:"Personalise your experience, get inspired, and stay connected to a more nourishing way of life.",note:"Good things, your way.",scene:1},
  security:{title:"Your peace of mind matters.",body:"Manage your account, keep your data safe, and control where you’re signed in.",note:"Good things are better when you feel secure.",scene:1},
  payments:{title:"Your payment preferences",emphasis:"A little peace of mind.",body:"Clear details for every step of your coconut journey.",note:"Good things, thoughtfully handled.",scene:5},
  empty:{title:"Your .CO space",emphasis:"A more coconutful you.",body:"Save your favourites, manage your orders, explore recipes and more — all in one place.",note:"Good things taste better together.",scene:1}
};
type ShellDetails = {view:AccountView;name:string};
const ShellContext=createContext<((details:ShellDetails)=>void)|null>(null);
function routeView(path:string):AccountView {
 if(path==='/orders/history')return 'history';
 if(path.startsWith('/orders/'))return 'detail';
 return ({'/orders':'orders','/wishlist':'wishlist','/saved-recipes':'recipes','/profile':'preferences','/account/addresses':'addresses','/account/payments':'payments','/account/security':'security','/account/empty':'empty'} as Record<string,AccountView>)[path]||'overview';
}
export function PersistentAccountShell({children}:{children:ReactNode}) {
 const pathname=usePathname();const session=useCustomerSession();
 const [details,setDetails]=useState<ShellDetails>({view:routeView(pathname),name:session?.name||'Your account'});
 return <ShellContext.Provider value={setDetails}><AccountShell view={details.view} name={details.name}>{children}</AccountShell></ShellContext.Provider>;
}
export function AccountContent({view,name,children}:{view:AccountView;name:string;children:ReactNode}) {
 const setDetails=useContext(ShellContext);const page=useRef<HTMLDivElement>(null);const reduce=useReducedMotion();const pathname=usePathname();
 useLayoutEffect(()=>{setDetails?.({view,name});const node=page.current;if(!node)return;const frame=node.closest<HTMLElement>('.ac-body');const animations:Animation[]=[];
 const content=node.animate(reduce?[{opacity:0},{opacity:1}]:[{opacity:0,transform:'translateY(18px)'},{opacity:1,transform:'translateY(0)'}],{duration:reduce?150:540,easing:'cubic-bezier(.22,1,.36,1)'});animations.push(content);
 if(!reduce) Array.from(node.querySelectorAll<HTMLElement>('.ac-panel,.ac-promo,.ac-empty')).filter(element=>!element.parentElement?.closest('.ac-panel,.ac-promo,.ac-empty')).forEach((card,index)=>animations.push(card.animate([{opacity:0,transform:'translateY(-18px) scale(.99)'},{opacity:1,transform:'translateY(0) scale(1)'}],{duration:580,delay:80+Math.min(index,6)*45,easing:'cubic-bezier(.22,1,.36,1)',fill:'backwards'})));
 Promise.allSettled(animations.map(animation=>animation.finished)).then(()=>{if(node.isConnected&&frame)frame.style.minHeight='';});
 return()=>animations.forEach(animation=>animation.cancel());
 },[view,name,pathname,reduce,setDetails]);
 return <div ref={page} className="ac-page-content" data-account-ready={pathname}>{children}</div>;
}
export function AccountShell({view,name,children}:{view:AccountView;name:string;children:ReactNode}) {
 const intro=intros[view]; const scene=intro.scene===1?5:intro.scene; const reduce=useReducedMotion(); const nav=useRef<HTMLElement>(null);
 const frame=useRef<HTMLDivElement>(null); const hero=useRef<HTMLElement>(null);
 useEffect(()=>{const active=nav.current?.querySelector<HTMLElement>('[aria-current="page"]'); if(active && nav.current) nav.current.scrollTo({left:active.offsetLeft-nav.current.offsetLeft-16,behavior:reduce?"instant":"smooth"});},[view,reduce]);
 useEffect(()=>{if(reduce||!hero.current)return;const image=hero.current.querySelector('img');if(!image)return;const push=image.animate([{transform:'scale(1)'},{transform:'scale(1.015)'}],{duration:16000,fill:'forwards',easing:'ease-out'});const observer=new IntersectionObserver(([entry])=>entry.isIntersecting?push.play():push.pause());observer.observe(hero.current);return()=>{observer.disconnect();push.cancel();};},[scene,reduce]);
 const holdFrame=(event:MouseEvent<HTMLElement>)=>{if(event.button!==0||event.metaKey||event.ctrlKey||event.shiftKey||event.altKey)return;const link=(event.target as Element).closest<HTMLAnchorElement>('a[href]');if(!link||link.origin!==location.origin||!isAccountRoute(link.pathname)||link.pathname===location.pathname)return;const body=frame.current;if(body)body.style.minHeight=`${Math.ceil(body.getBoundingClientRect().height)}px`;const page=body?.querySelector<HTMLElement>('.ac-page-content');page?.animate(reduce?[{opacity:1},{opacity:.72}]:[{opacity:1,transform:'translateY(0) scale(1)'},{opacity:.72,transform:'translateY(-6px) scale(.995)'}],{duration:210,easing:'cubic-bezier(.4,0,.2,1)'});};
 useEffect(()=>{const holdHistory=()=>{const body=frame.current;if(body)body.style.minHeight=`${Math.ceil(body.getBoundingClientRect().height)}px`;};window.addEventListener('popstate',holdHistory);return()=>window.removeEventListener('popstate',holdHistory);},[]);
 return <div className="co-account" data-account-view={view}>
  <ReferenceHeader/>
  <header ref={hero} className={`ac-hero ac-hero--${view}`}>
   <picture><source media="(max-width: 600px)" srcSet={`/assets/redesign/account/scene-${scene+1}.webp`}/><img src={`/assets/redesign/account/scene-${scene}.webp`} alt="" fetchPriority="high" width="1672" height="941"/></picture>
   <div className="ac-hero-copy"><p className="ac-eyebrow">{view==="overview" ? "Welcome back" : "My account"}</p><h1>{intro.title}{view==="overview" ? <em>{name.split(" ")[0]}.</em> : intro.emphasis ? <em>{intro.emphasis}</em> : null}</h1><p>{intro.body}</p><span className="ac-script">{intro.note}</span></div>
  </header>
  <div className="ac-content">
   <nav className="ac-tabs" aria-label="Account sections" ref={nav} onClickCapture={holdFrame}>{tabs.map(({label,href,views,Icon})=><Link key={href} href={href} scroll={false} data-motion="off" aria-current={views.includes(view)?"page":undefined}>{views.includes(view)&&<motion.span className="ac-active-tab" layoutId="account-active-tab" transition={reduce?{duration:.15}:{type:"spring",stiffness:190,damping:26,mass:.9}}/>}<Icon size={20}/><span>{label}</span></Link>)}</nav>
   <div className="ac-body" ref={frame} onClickCapture={holdFrame}>{children}</div>
   <footer className="ac-footer"><div className="ac-trust">{[{Icon:ShieldCheck,title:"Secure account",body:"Your details, thoughtfully handled",href:"/privacy-policy"},{Icon:Package,title:"Delivery & returns",body:"Read our delivery policies",href:"/shipping-returns"},{Icon:Heart,title:"Your .CO favourites",body:"Good things, kept close",href:"/wishlist"},{Icon:Leaf,title:"Our coconut story",body:"Rooted in a better tomorrow",href:"/sustainability"}].map(({Icon,title,body,href})=><Link href={href} key={title}><Icon/><span>{title}<small>{body}</small></span></Link>)}</div><p><span>.CO</span> — Goodness stays with you</p><div className="ac-footer-links"><Link href="/contact">Support</Link><Link href="/privacy-policy">Privacy</Link><Link href="/terms-and-conditions">Terms</Link></div></footer>
  </div>
 </div>;
}
export function ActionLink({href,children,secondary=false}:{href:string;children:ReactNode;secondary?:boolean}) {return <Link className={secondary?"ac-text-link":"ac-button"} href={href}>{children}<ArrowRight size={16}/></Link>;}
export function Panel({title,children,className="",action}:{title?:string;children:ReactNode;className?:string;action?:ReactNode}) {return <section className={`ac-panel ${className}`}>{title&&<div className="ac-panel-heading"><h2 className="ac-eyebrow">{title}</h2>{action}</div>}{children}</section>;}
export function Promo({title,body,href="/shop",action="Explore the collection",scene=5,className=""}:{title:string;body:string;href?:string;action?:string;scene?:number;className?:string}) {return <section className={`ac-promo ${className}`}><ResponsiveImage src={`/assets/redesign/account/scene-${scene===1?5:scene}.webp`} alt="" loading="lazy" width={1672} height={941}/><div><h2>{title}</h2><p>{body}</p><ActionLink href={href}>{action}</ActionLink></div></section>;}
export function HelpPanel(){return <Panel title="Here to help" className="ac-help">{[["Track an order","Delivery updates in one place","/track-order"],["Returns & delivery","Find our current policies","/shipping-returns"],["Contact support","We’re here for your questions","/contact"]].map(([title,body,href])=><Link href={href} key={title}><BookOpen size={20}/><span>{title}<small>{body}</small></span><ArrowRight size={16}/></Link>)}</Panel>;}
export function EmptyCard({title,body,href,action,scene=5}:{title:string;body:string;href:string;action:string;scene?:number}) {return <div className="ac-empty"><ResponsiveImage src={`/assets/redesign/account/scene-${scene===1?5:scene}.webp`} alt="" loading="lazy" width={1672} height={941}/><div><h3>{title}</h3><p>{body}</p><ActionLink href={href}>{action}</ActionLink></div></div>;}
export function Unavailable({children}:{children:ReactNode}) {return <div className="ac-notice" role="status"><ShieldCheck size={19}/><p>{children}</p></div>;}
