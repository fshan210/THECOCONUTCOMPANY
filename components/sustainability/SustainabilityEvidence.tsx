"use client";
import Link from 'next/link';

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Box, ChevronDown, CircleDot, Leaf, MapPin, Recycle, ShieldCheck, Users } from 'lucide-react';

const evidence = [
  {Icon:MapPin,area:'Origin traceability',documents:'Traceability protocol · Batch map',status:'In progress',detail:'The batch shown above is a reference record. A live registry, origin evidence and batch-level records must be approved before records can be verified.'},
  {Icon:Recycle,area:'Waste-stream measurement',documents:'Waste audit report · Methodology',status:'In progress',detail:'An audited mass balance should record input weight, each output stream, losses and the final destination. No waste audit is currently linked here.'},
  {Icon:Leaf,area:'Biochar MRV',documents:'MRV methodology · Field data',status:'Modelled',detail:'The calculator uses the supplied design reference, not a validated carbon model. Production, permanence, uncertainty and field data are required for verification.'},
  {Icon:ShieldCheck,area:'Carbon standard certification',documents:'Project documents · Validation report',status:'In progress',detail:'No carbon-standard certification is asserted on this page. The register will link the actual project and validation documents once available.'},
  {Icon:Box,area:'Packaging recovery methodology',documents:'Recovery model · Partner network',status:'In progress',detail:'A recovery claim requires the collection boundary, material weights, responsible partners and final processing destinations. This methodology is not published yet.'},
  {Icon:Users,area:'Women-led enterprise data',documents:'Impact survey · Governance policy',status:'In progress',detail:'The reference indicators are not verified operating figures. A dated survey, reporting boundary and governance evidence are required before public reporting.'},
] as const;
const roadmap = [
  {title:'Now',subtitle:'Current focus',items:['Farm mapping','Baseline measurement','Returnable trial design','Factory-level tracking','Women-led enterprise baseline']},
  {title:'Next',subtitle:'Planned next steps',items:['Batch-level traceability','Quarterly reporting','Partner-network expansion','Product-level LCA pilots','WLE programme development']},
  {title:'Later',subtitle:'Longer-term ambitions',items:['Real-time traceability','Verified impact dashboard','Recovery at scale','Net-positive roadmap','Regional livelihood index']},
] as const;

export function SustainabilityEvidence() {
  const reduced=useReducedMotion();
  const [open,setOpen]=useState<number|null>(null);
  const [roadmapOpen,setRoadmapOpen]=useState(false);
  return <>
    <section id="receipts" className="sustain-section evidence-section" aria-labelledby="evidence-heading">
      <div className="evidence-intro"><p className="sustain-label">The receipts</p><h2 id="evidence-heading">Don’t take <br/>our word for it.</h2><p>This proposed register is designed to link methods, data, and supporting evidence when those records are ready to publish.</p><p className="evidence-caveat">The register is being built. “Modelled” means illustrative, not independently verified.</p></div>
      <div className="evidence-table sustain-panel">
        <div className="evidence-head" aria-hidden="true"><span>Area</span><span>Evidence & documents</span><span>Status</span><span>Last updated</span></div>
        {evidence.map(({Icon,area,documents,status,detail},index)=><motion.div className="evidence-row" key={area} initial={reduced?false:{opacity:.5,y:10}} whileInView={{opacity:1,y:0}} viewport={{once:true}} transition={{duration:reduced?0:.45,delay:reduced?0:index*.06}}>
          <button aria-expanded={open===index} aria-controls={`evidence-${index}`} onClick={()=>setOpen(open===index?null:index)}><span className="evidence-area"><Icon/><b>{area}</b></span><span className="evidence-documents">{documents}</span><i data-status={status}>{status}</i><span className="evidence-updated">Not published<ChevronDown/></span></button>
          {open===index&&<div id={`evidence-${index}`} className="evidence-detail"><p>{detail}</p><Link href="/contact">Request supporting documentation<ArrowRight/></Link></div>}
        </motion.div>)}
        <div className="evidence-foot"><ShieldCheck/><span>The register is pending publication.<br/>Supporting records will be linked only when available.</span><Link className="sustain-primary" href="/contact">Ask about the register<ArrowRight/></Link></div>
      </div>
    </section>
    <section className="roadmap-section" aria-labelledby="roadmap-heading"><div className="roadmap-intro"><p className="sustain-label">Next</p><h2 id="roadmap-heading">Better <em>isn’t finished.</em></h2><p>We’re building in the open. What’s next will take time—because real change follows seasons, not shortcuts.</p><small>Planning view from the approved reference. Items are not completion or certification claims.</small></div>
      <div className="roadmap sustain-panel"><div className="roadmap-columns">{roadmap.map((column,index)=><motion.article key={column.title} initial={reduced?false:{opacity:.5,x:14}} whileInView={{opacity:index===2?.72:1,x:0}} viewport={{once:true}} transition={{duration:reduced?0:.6,delay:reduced?0:index*.15,ease:[.22,1,.36,1]}}><h3>{column.title}</h3><p>{column.subtitle}</p><ul>{column.items.map(item=><li key={item}><CircleDot/><span>{item}</span></li>)}</ul></motion.article>)}</div><motion.i className="roadmap-line" initial={{scaleX:reduced?1:0}} whileInView={{scaleX:1}} viewport={{once:true}} transition={{duration:reduced?0:1.3,ease:[.22,1,.36,1]}}/>
        <div className="roadmap-foot"><span><ShieldCheck/>Progress updates will carry supporting evidence.</span><button className="sustain-secondary" aria-expanded={roadmapOpen} aria-controls="roadmap-details" onClick={()=>setRoadmapOpen(value=>!value)}>View roadmap details<ChevronDown/></button></div>
        {roadmapOpen&&<div id="roadmap-details" className="roadmap-details"><p>Each milestone needs an owner, a reporting period, a measurable completion criterion and a linked record before it can be marked complete. No dates or completed checks are invented here.</p><Link href="/contact">Ask about the roadmap<ArrowRight/></Link></div>}
      </div>
    </section>
  </>;
}
