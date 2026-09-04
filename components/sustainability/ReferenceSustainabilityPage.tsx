"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { MotionConfig, motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, BarChart3, FileCheck2, GraduationCap, Leaf, MapPin, Recycle, Users } from 'lucide-react';
import { DarkShell } from '@/components/reference/DarkReference';
import { NewsletterSection } from '@/components/launch/NewsletterSection';
import { SustainabilityTrace } from './SustainabilityTrace';
import { SustainabilitySeasonal } from './SustainabilitySeasonal';
import { SustainabilityFlow } from './SustainabilityFlow';
import { SustainabilityCalculator } from './SustainabilityCalculator';
import { SustainabilityEvidence } from './SustainabilityEvidence';

/* FORM seed: reference-board-locked.
 * Sustainability reference contract: five supplied boards own composition and order.
 * Keep the established shared shell. Farm hero → trace & seasons → whole-coconut flow
 * → impact & people → receipts, roadmap, source, shared newsletter. No deployment.
 * Warm brown/amber, editorial serif, supplied imagery, tactile controls. Reference
 * data is labelled; no unverified operating/certification claims become live proof.
 */
const asset='/assets/redesign/sustainability/cinematic/';
const ease=[.22,1,.36,1] as const;
const principles=[
  {Icon:MapPin,title:'Trace the source',copy:'Know where every coconut comes from, and who harvested it.'},
  {Icon:Recycle,title:'Use the whole coconut',copy:'From water to shell, every part has a purpose. Nothing wasted, ever.'},
  {Icon:BarChart3,title:'Measure the outcome',copy:'The proposed model would track impact across people, product, and planet with defined data.'},
  {Icon:FileCheck2,title:'Show the evidence',copy:'The proposed register would link records and verification when they become available.'},
];
const indicators=[
  {Icon:Users,value:'67%',label:'Women leadership',copy:'Across our operations'},
  {Icon:Users,value:'2,850+',label:'Farmers & workers',copy:'Connected through the value chain'},
  {Icon:MapPin,value:'12',label:'Regional clusters',copy:'Across the reference model'},
  {Icon:GraduationCap,value:'4,320+',label:'Hours of training',copy:'Skills, safety and regenerative practices'},
];
const regions=[
  {name:'Kerala',clusters:4,path:'M100 125 L120 152 135 195 145 222 155 247 142 239 129 215 118 185 110 153Z',x:119,y:174},
  {name:'Tamil Nadu',clusters:3,path:'M120 152 L145 143 186 147 204 133 205 158 194 193 177 227 155 247 145 222 135 195Z',x:174,y:184},
  {name:'Karnataka',clusters:3,path:'M81 43 L104 34 138 53 154 91 145 120 145 143 120 152 100 125 89 92Z',x:113,y:99},
  {name:'Andhra Pradesh',clusters:2,path:'M138 53 L166 42 190 73 231 67 255 45 279 40 249 77 220 96 204 133 186 147 145 143 145 120 154 91Z',x:210,y:91},
];

export function ReferenceSustainabilityPage() {
  const reduced=useReducedMotion();
  const [region,setRegion]=useState(0);
  return <MotionConfig reducedMotion="user"><DarkShell className="rd-sustainability"><main>
    <section className="sustain-hero" aria-labelledby="sustainability-title">
      <picture className="sustain-hero__media"><source media="(min-width: 1100px)" srcSet={`${asset}hero-desktop.webp`}/><img src={`${asset}hero-mobile.webp`} alt="" width="992" height="1586" fetchPriority="high"/></picture>
      <div className="sustain-hero__shade"/>
      <div className="sustain-hero__copy">
        <p className="sustain-label">Our impact</p>
        <h1 id="sustainability-title">{['Nothing wasted.','Everything','accounted for.'].map((line,index)=><span key={line} className={index===2?'italic':''}><motion.i initial={reduced?false:{y:'102%'}} animate={{y:0}} transition={{duration:reduced?0:.8,delay:reduced?0:index*.1,ease}}>{line}</motion.i></span>)}</h1>
        <motion.div initial={reduced?false:{opacity:.4,y:12}} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.7,delay:reduced?0:.3,ease}}><p>This reference experience shows how<br/>sustainability could become traceable:<br/>from a coconut’s recorded origin to the<br/>evidence behind each proposed outcome.</p><div className="sustain-actions"><a className="sustain-primary" href="#trace">Trace the demo batch<ArrowRight/></a><a className="sustain-secondary" href="#flow">Explore the model</a></div></motion.div>
        <div className="hero-location"><MapPin/><span>Pollachi · Tamil Nadu · India<small>10.6554° N, 76.9626° E</small></span></div>
      </div>
      <div className="origin-seal"><Leaf/><span>Traceable origin</span><Image src="/images/logo.svg" alt=".CO" width={60} height={38}/><small>Whole coconut thinking</small></div>
      <svg className="hero-curve" viewBox="0 0 1440 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 51 C310 -57 566 41 900 74 S1300 92 1440 54 V100 H0Z"/></svg>
    </section>
    <section className="sustain-principles" aria-labelledby="principles-heading"><p className="sustain-label">Our sustainability principle</p><h2 id="principles-heading">A coconut shouldn’t disappear<br/>when the bottle is filled.</h2><p>This proposed system is designed to source responsibly, use each part with purpose,<br/>measure defined outcomes, and publish evidence when it is ready for review.</p><div className="principle-grid"><motion.div className="principle-line" initial={{scaleX:reduced?1:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:reduced?0:1.2,ease}}/>{principles.map(({Icon,title,copy},index)=><motion.article key={title} initial={reduced?false:{opacity:.45,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:reduced?0:.55,delay:reduced?0:index*.14,ease}}><span><Icon/></span><i>0{index+1}</i><h3>{title}</h3><p>{copy}</p></motion.article>)}</div></section>
    <SustainabilityTrace/>
    <SustainabilitySeasonal/>
    <SustainabilityFlow/>
    <SustainabilityCalculator/>
    <section id="people" className="people-section" aria-labelledby="people-heading">
      <div className="people-scene"><Image src={`${asset}people.webp`} fill sizes="100vw" alt="Women working with whole and split coconuts at a community processing site"/></div>
      <div className="people-copy"><p className="sustain-label">The people in the system</p><h2 id="people-heading">Impact should<br/>reach <em>people too.</em></h2><p>Behind every .CO product is a community of skilled, resilient people. Our ambition is a value chain where farmers, workers, and women-led enterprises share in the value they create.</p><a href="#community-measurement" className="sustain-secondary">How we measure this<ArrowRight/></a></div>
      <div className="people-stats sustain-panel"><p className="people-stat-flag">Reference-board indicators · illustrative and unverified</p>{indicators.map(({Icon,value,label,copy},index)=><motion.article key={label} aria-label={`${value}, ${label}. Illustrative reference-board indicator; these are not verified operating figures.`} initial={reduced?false:{opacity:.5,y:14}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:reduced?0:.55,delay:reduced?0:index*.12,ease}}><Icon/><strong>{value}</strong><b>{label}</b><small>{copy}</small><i>Reference · unverified</i></motion.article>)}</div>
      <p className="people-disclosure">Publication requires a defined reporting period, source records, and evidence review.</p>
      <div className="community-grid">
        <article className="regional-map sustain-panel"><h3>Regional cluster model</h3><svg viewBox="0 0 310 270" role="img" aria-label="Schematic of four southern Indian regions in the reference model, not an operating-coverage map">{regions.map(({name,path,x,y},index)=><g key={name} data-active={region===index}><path d={path}/><circle cx={x} cy={y} r="5"/></g>)}</svg><div className="region-controls">{regions.map(({name,clusters},index)=><button key={name} aria-pressed={region===index} onClick={()=>setRegion(index)}><i/><span>{name}<small>{clusters} reference clusters</small></span></button>)}</div><p role="status">{regions[region].name} · {regions[region].clusters} clusters in the reference model. Actual coverage requires validation.</p></article>
        <article className="community-panel sustain-panel"><div className="community-photo"><Image src={`${asset}people.webp`} fill alt="Women taking part in coconut processing" sizes="(min-width: 900px) 240px, 50vw"/></div><div><h3>Women-led. Community-rooted. Future-focused.</h3><p>From production and quality to finance, a stronger coconut system must build opportunity for the people inside it.</p><Link className="sustain-secondary" href="/about">Meet our communities<ArrowRight/></Link></div></article>
      </div>
      <details id="community-measurement" className="community-measurement"><summary>How community impact will be measured<ArrowRight/></summary><p>Each indicator requires a dated reporting period, a defined participant group, a survey or attendance record, and independent review where possible. The figures above are retained from the supplied visual references, not presented as verified company outcomes.</p><a href="#receipts">See women-led enterprise evidence</a></details>
    </section>
    <SustainabilityEvidence/>
    <section className="closing-source" aria-labelledby="closing-heading"><div className="closing-scene"><Image src={`${asset}closing.webp`} fill alt="Coconut growers sharing a coconut at the source" sizes="100vw"/></div><div className="closing-copy"><h2 id="closing-heading">A better<br/>coconut system<br/><em>starts at the source.</em></h2><p>To the farmers who grow it, the communities who care for it, and the choices we make every day—thank you for being part of it.</p><div><a className="sustain-primary" href="#trace">Trace your batch<ArrowRight/></a><a className="sustain-secondary" href="#receipts">Read our methodology<ArrowRight/></a><Link className="sustain-secondary" href="/shop">Explore .CO products<ArrowRight/></Link></div></div></section>
    <NewsletterSection/>
  </main></DarkShell></MotionConfig>;
}
