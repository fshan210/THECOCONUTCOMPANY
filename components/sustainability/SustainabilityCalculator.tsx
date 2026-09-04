"use client";

import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, ChevronDown, Leaf, Minus, Plus, Recycle, ShieldCheck, Sprout } from 'lucide-react';
import { transparentProductAssets } from '@/lib/website-assets';
import { calculateReferenceImpact, isReferenceBatch, REFERENCE_BATCH, REFERENCE_PACK_SIZE, REFERENCE_UNITS } from '@/lib/sustainability-reference';

function ImpactNumber({ value, animate, delay }: { value: number; animate: boolean; delay: number }) {
  const reduced = useReducedMotion();
  const [number, setNumber] = useState(animate && !reduced ? 0 : value);
  useEffect(() => {
    if (!animate || reduced) { setNumber(value); return; }
    let frame = 0;
    let start: number | null = null;
    function tick(now: number) {
      start ??= now;
      const progress = Math.max(0, Math.min(1, (now-start-delay)/650));
      setNumber(value * (1-Math.pow(1-progress,3)));
      if (progress<1) frame=requestAnimationFrame(tick);
    }
    frame=requestAnimationFrame(tick);
    return ()=>cancelAnimationFrame(frame);
  },[value,animate,reduced,delay]);
  return <span aria-hidden="true">{number.toFixed(2)}</span>;
}

export function SustainabilityCalculator() {
  const reduced = useReducedMotion();
  const [mode,setMode]=useState<'units'|'batch'>('units');
  const [product,setProduct]=useState('water');
  const [quantity,setQuantity]=useState(24);
  const [packs,setPacks]=useState(false);
  const [batch,setBatch]=useState(REFERENCE_BATCH);
  const [error,setError]=useState('');
  const [snapshot,setSnapshot]=useState({id:0,...calculateReferenceImpact(24)!});
  function calculate() {
    if(product!=='water'){setError('An approved product-specific model for Virgin Coconut Oil is not available. Select .CO Coconut Water to explore the reference scenario.');return;}
    if(mode==='batch'&&!isReferenceBatch(batch)){setError('No published model matches this batch. Try the supplied reference code CO-W-2608-0147.');return;}
    const result=calculateReferenceImpact(mode==='batch'?REFERENCE_UNITS:quantity,mode==='units'&&packs);
    if(!result){setError('Enter a whole quantity between 1 and 999.');return;}
    setError('');
    setSnapshot(current=>({id:current.id+1,...result}));
  }
  const metrics=[
    {Icon:Recycle,value:snapshot.diverted,label:'Shell + husk diverted',copy:'Reference diversion scenario',unit:'kg'},
    {Icon:Sprout,value:snapshot.biochar,label:'Biochar produced',copy:'Reference conversion scenario',unit:'kg'},
    {Icon:Leaf,value:snapshot.carbon,label:'CO₂e stored',copy:'Modelled, not verified storage',unit:'kg CO₂e'},
  ];
  return <section id="impact" className="sustain-section impact-section" aria-labelledby="impact-heading">
    <div className="impact-intro-scene"><div className="impact-heading"><p className="sustain-label">Your impact</p><h2 id="impact-heading">What does <em>your</em><br/>coconut leave behind?</h2><p>See how everyday choices could help restore soil, store carbon, and keep resources in a circular loop.</p><small>Explore the supplied reference scenario. These are not verified product or historical impact claims.</small></div><div className="impact-product-image"><Image src="/assets/redesign/sustainability/cinematic/impact.webp" fill alt="Approved .CO Coconut Water and Virgin Coconut Oil packaging with coconuts" sizes="(min-width: 900px) 65vw, 100vw"/></div></div>
    <div className="calculator sustain-panel">
      <div className="calculator-controls">
        <div className="calculator-tabs" aria-label="Calculator input mode"><button aria-pressed={mode==='units'} onClick={()=>{setMode('units');setError('')}}>Units</button><button aria-pressed={mode==='batch'} onClick={()=>{setMode('batch');setError('')}}>Batch code</button><Link href="/account/orders">Order history<ArrowRight/></Link></div>
        <div className="calculator-inputs">
          <label htmlFor="impact-product">1. Choose a product</label>
          <div className="product-select"><Image src={transparentProductAssets[product==='water'?'water':'kitchen-oil'].src} width={43} height={64} alt=""/><select id="impact-product" value={product} onChange={event=>{setProduct(event.target.value);setError('')}}><option value="water">.CO Coconut Water</option><option value="oil">Virgin Coconut Oil · model pending</option></select></div>
          {mode==='units'?<>
            <label htmlFor="impact-quantity">2. Enter quantity</label>
            <div className="quantity-control"><button aria-label="Decrease quantity" disabled={quantity<=1} onClick={()=>setQuantity(value=>Math.max(1,value-1))}><Minus/></button><div><input id="impact-quantity" type="number" min="1" max="999" step="1" value={quantity} onChange={event=>setQuantity(Number(event.target.value))}/><small>{packs?'Reference packs':'Units'}</small></div><button aria-label="Increase quantity" disabled={quantity>=999} onClick={()=>setQuantity(value=>Math.min(999,value+1))}><Plus/></button></div>
            <fieldset><legend>3. Unit type</legend><div><button aria-pressed={!packs} onClick={()=>setPacks(false)}>Units</button><button aria-pressed={packs} onClick={()=>setPacks(true)}>Multipacks · {REFERENCE_PACK_SIZE}</button></div></fieldset>
          </>:<div className="calculator-batch"><label htmlFor="impact-batch">2. Enter batch code</label><input id="impact-batch" value={batch} onChange={event=>setBatch(event.target.value)} maxLength={48}/><p>The reference batch contains {REFERENCE_UNITS} example units. No live registry is connected.</p></div>}
          <button className="sustain-primary calculate-button" onClick={calculate}>Calculate impact<ArrowRight/></button>
          {error&&<p className="trace-error" role="alert">{error}</p>}
        </div>
        <p className="calculator-note"><Leaf/>Reference model only. Verified LCA and field records are required before real impact can be reported.</p>
      </div>
      <div className="calculator-results">
        <h3>Your impact results <span>Illustrative estimate</span></h3><p>Reference scenario for {snapshot.units} units of .CO Coconut Water.</p>
        <div className="metric-list" key={snapshot.id}>{metrics.map(({Icon,value,label,copy,unit},index)=><motion.article key={label} initial={snapshot.id&&!reduced?{opacity:.3,y:12}:false} animate={{opacity:1,y:0}} transition={{duration:reduced?0:.45,delay:reduced?0:index*.14,ease:[.22,1,.36,1]}}><Icon/><span><b>{label}</b><small>{copy}</small></span><strong aria-label={`${value.toFixed(2)} ${unit}`}><ImpactNumber value={value} animate={snapshot.id>0} delay={index*140}/><small>{unit}</small></strong><i aria-hidden="true"><ArrowRight/></i></motion.article>)}</div>
        <p className="sr-only" role="status">{snapshot.id>0?`Calculation complete: ${snapshot.diverted.toFixed(2)} kilograms diverted, ${snapshot.biochar.toFixed(2)} kilograms biochar, ${snapshot.carbon.toFixed(2)} kilograms CO2e. Illustrative reference scenario only.`:''}</p>
        <details><summary><ShieldCheck/>How is this calculated?<ChevronDown/></summary><p>The supplied board shows 24 units producing 8.64 kg diversion, 2.16 kg biochar and 6.48 kg CO₂e storage. This UI scales those figures linearly: 0.36, 0.09 and 0.27 kg per reference unit. A multipack is an explicitly illustrative six-unit input, not a listed SKU.</p><p>These coefficients have no published LCA, verification period, uncertainty range or certification. They must not be used as a real-world carbon claim.</p></details>
      </div>
    </div>
    <p className="impact-disclosure"><ShieldCheck/>Results illustrate the reference design. Verified reporting will require lifecycle assessment, material recovery records, and on-ground measurements.</p>
  </section>;
}
