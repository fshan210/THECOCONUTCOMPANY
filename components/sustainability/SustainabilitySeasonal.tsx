"use client";

import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Activity, CircleDot, Leaf, ShieldCheck, Sprout, Users } from 'lucide-react';

const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const harvest = 'M45 155 C120 155 165 58 280 58 S440 155 550 155 S705 76 820 76 S970 155 1055 155';
const availability = 'M45 255 C100 248 120 217 165 227 S215 241 258 220 S310 218 353 230 S413 208 456 235 S523 239 562 225 S640 235 681 239 S744 215 793 212 S870 243 916 232 S992 235 1055 239';

export function SustainabilitySeasonal() {
  const reduced = useReducedMotion();
  const [month, setMonth] = useState<number | null>(null);
  const [visible, setVisible] = useState({ harvest: true, availability: true });
  return <section className="sustain-section seasonal-section sustain-panel" aria-labelledby="seasonal-heading">
    <div className="seasonal-heading"><div><h2 id="seasonal-heading">Coconuts have a rhythm.<br/><em>We follow it.</em></h2><p>The reference sourcing model follows<br/>seasonal cycles. The curves below are<br/>illustrative, not a procurement forecast.</p></div>
      <div className="chart-legend" aria-label="Visible seasonal series">
        <button aria-pressed={visible.harvest} onClick={() => setVisible(value => ({...value, harvest: !value.harvest}))}><Activity/>Harvest activity</button>
        <button aria-pressed={visible.availability} onClick={() => setVisible(value => ({...value, availability: !value.availability}))}><CircleDot/>Product availability</button>
      </div>
    </div>
    <div className="seasonal-chart" tabIndex={0} aria-label="Seasonal graph. Scroll horizontally on small screens; select a month for its season.">
      <div className="seasonal-chart-inner">
        <div className="month-buttons">{months.map((name,i) => <button key={name} aria-pressed={month === i} onPointerEnter={() => setMonth(i)} onFocus={() => setMonth(i)} onClick={() => setMonth(i)}>{name}</button>)}</div>
        <svg viewBox="0 0 1100 290" role="img" aria-label="Illustrative annual pattern: main harvest March to May, mid harvest July to August, second harvest September to November.">
          <defs><linearGradient id="sustain-harvest-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#ce8240" stopOpacity=".42"/><stop offset="1" stopColor="#ce8240" stopOpacity=".02"/></linearGradient><linearGradient id="sustain-availability-fill" x1="0" y1="0" x2="0" y2="1"><stop stopColor="#92976a" stopOpacity=".38"/><stop offset="1" stopColor="#92976a" stopOpacity=".04"/></linearGradient></defs>
          {months.map((name,i) => <line key={name} x1={45+i*92} x2={45+i*92} y1="0" y2="280" className={month===i?'active-guide':'grid-line'}/>)}
          <line x1="45" x2="1055" y1="155" y2="155" className="grid-line"/><line x1="45" x2="1055" y1="255" y2="255" className="grid-line"/>
          <g opacity={visible.harvest ? 1 : .08} className="chart-series">
            <path d={`${harvest} L1055 160 L45 160Z`} fill="url(#sustain-harvest-fill)"/>
            <motion.path d={harvest} className="harvest-path" initial={{pathLength:reduced?1:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:reduced?0:1.4,ease:[.22,1,.36,1]}}/>
          </g>
          <g opacity={visible.availability ? 1 : .08} className="chart-series">
            <path d={`${availability} L1055 260 L45 260Z`} fill="url(#sustain-availability-fill)"/>
            <motion.path d={availability} className="availability-path" initial={{pathLength:reduced?1:0}} whileInView={{pathLength:1}} viewport={{once:true}} transition={{duration:reduced?0:1.4,delay:reduced?0:.15,ease:[.22,1,.36,1]}}/>
          </g>
        </svg>
        <div className="harvest-periods"><span>Peak harvest<small>Mar – May</small></span><span>Mid harvest<small>Jul – Aug</small></span><span>Second harvest<small>Sep – Nov</small></span></div>
      </div>
    </div>
    <p className="chart-readout" role="status">{month===null ? 'Select a month to explore the cycle.' : `${months[month]} · ${month>=2&&month<=4?'Peak harvest':month>=6&&month<=7?'Mid harvest':month>=8&&month<=10?'Second harvest':'Between harvest peaks'}.`} <span>Illustrative reference pattern, not a procurement forecast.</span></p>
    <div className="seasonal-notes">{[[Sprout,'Seasonal by design','A proposed cycle aligned with harvest rhythms.'],[Users,'People and place','Relationships require documented origin records.'],[Leaf,'No forced pace','The model lets seasonal timing lead.'],[ShieldCheck,'Evidence before claims','Outcomes stay pending until records are published.']].map(([Icon,title,body])=>{const NoteIcon=Icon as typeof Leaf;return <span key={String(title)}><NoteIcon/><b>{title as string}</b><small>{body as string}</small></span>})}</div>
  </section>;
}
