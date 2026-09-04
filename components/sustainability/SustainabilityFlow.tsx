"use client";

import Image from 'next/image';
import { useEffect, useId, useRef, useState, type RefObject } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, CircleDot, Droplets, Leaf, Plus, Recycle, Sprout, type LucideIcon } from 'lucide-react';
import { transparentProductAssets } from '@/lib/website-assets';

type Destination = { title: string; copy: string; use: string; detail: string; asset?: string; Icon?: LucideIcon };
type Stream = { name: string; share: string; Icon: LucideIcon; method: string; destinations: Destination[] };
const streams: Stream[] = [
  { name:'Water', share:'~25%', Icon:Droplets, method:'The edible liquid is directed into beverage production. The proportion is an approximate material split from the reference design, not an audited batch measurement.', destinations:[
    {title:'.CO Coconut Water',copy:'Hydration, naturally.',use:'Beverage & wellness',asset:'water',detail:'The water stream becomes a beverage. Product-specific yield and diversion measurements require batch records before an impact claim is published.'},
  ]},
  { name:'Kernel / Pulp', share:'~31%', Icon:CircleDot, method:'Kernel can feed several food streams. Outputs are alternatives within this share, not additional percentages of the whole coconut.', destinations:[
    {title:'Coconut Milk',copy:'Plant-based nourishment.',use:'Food & beverage',asset:'kitchen-milk',detail:'Kernel is processed for coconut milk. Input mass, extraction yield, and remaining solids belong in the same mass-balance record.'},
    {title:'Virgin Coconut Oil',copy:'Pure. Versatile. Essential.',use:'Food, beauty & wellness',asset:'kitchen-oil',detail:'Oil is a kernel-derived product. The illustration does not claim that every coconut produces all listed kernel products simultaneously.'},
    {title:'Coconut Flour',copy:'Natural. Gluten-free.',use:'Food & baking',asset:'kitchen-flour',detail:'Kernel solids can become flour. Destination and recovery figures will be linked when approved processing records are available.'},
  ]},
  { name:'Shell', share:'~17%', Icon:Recycle, method:'Shell pathways depend on processing and end use. Biochar carbon storage requires a documented process, stability assumptions, and measurement, reporting and verification (MRV).', destinations:[
    {title:'CoCarbon',copy:'Activated carbon by .CO',use:'Filtration & purification · planned',Icon:Recycle,detail:'An activated-carbon pathway shown in the reference. Production scale, filtration performance, and recovery claims are not verified by this page.'},
    {title:'Biochar',copy:'A material with another purpose.',use:'Soil amendment · planned',Icon:Leaf,detail:'A planned shell-to-biochar stream. No certification or verified carbon-storage claim is made; production and field evidence remain required.'},
    {title:'Charcoal & Crafts',copy:'Traditional uses, reimagined.',use:'Energy & artisan uses · planned',Icon:CircleDot,detail:'Craft and energy destinations are shown as potential pathways. They must be counted separately from long-term carbon storage.'},
  ]},
  { name:'Husk', share:'~27%', Icon:Leaf, method:'Husk and coir can return material value to growing systems. A measured mass balance should track collection, treatment, destination, and any losses.', destinations:[
    {title:'Soil Application',copy:'Returned to the earth.',use:'Regenerative agriculture · planned',Icon:Sprout,detail:'Coir and related husk materials can support soil applications. Local suitability, treatment, and actual destination need evidence.'},
    {title:'MRV / Carbon Accounting',copy:'Measured. Reported. Transparent.',use:'Impact & transparency · framework',Icon:CircleDot,detail:'MRV is an accounting layer across the system, not a separate physical output. It must avoid double-counting carbon or material recovery.'},
  ]},
];

type Connection = { d: string; stream: string; stage: number };
const materialWindows: Record<string, [number, number, number, number]> = {
  CoCarbon: [773, 898, 72, 48],
  Biochar: [768, 986, 82, 48],
  'Charcoal & Crafts': [770, 1070, 74, 50],
  'Soil Application': [770, 1159, 78, 56],
  'MRV / Carbon Accounting': [767, 1260, 78, 64],
};

/** Viewport onto the supplied board's material artwork; original pixels stay intact. */
function MaterialArtwork({ title }: { title: string }) {
  const [x, y, width, height] = materialWindows[title];
  const clip = useId().replaceAll(':', '');
  return <svg className="material-artwork" viewBox={`0 0 ${width} ${height}`} aria-hidden="true">
    <defs><clipPath id={clip}><rect width={width} height={height}/></clipPath></defs>
    <image clipPath={`url(#${clip})`} href="/assets/redesign/sustainability/cinematic/material-reference.webp" x={-x} y={-y} width="941" height="1672"/>
  </svg>;
}
function FlowConnections({ root, active, revision }: { root: RefObject<HTMLDivElement>; active: string; revision: string | null }) {
  const reduced = useReducedMotion();
  const [paths, setPaths] = useState<Connection[]>([]);
  useEffect(() => {
    const element = root.current;
    if (!element) return;
    let frame = 0;
    const measure = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const bounds = element.getBoundingClientRect();
        const source = element.querySelector('[data-flow-source]')?.getBoundingClientRect();
        if (!source) return;
        const sx = source.right - bounds.left, sy = source.top + source.height * .5 - bounds.top;
        const next: Connection[] = [];
        element.querySelectorAll<HTMLElement>('[data-stream]').forEach((row, index) => {
          const node = row.querySelector('[data-flow-node]')?.getBoundingClientRect();
          if (!node) return;
          const name = row.dataset.stream || '';
          const nx = node.left - bounds.left, ny = node.top + node.height / 2 - bounds.top;
          next.push({ d:`M${sx},${sy} C${sx+80},${sy} ${nx-80},${ny} ${nx},${ny}`,stream:name,stage:index });
          row.querySelectorAll('[data-flow-destination]').forEach(destination => {
            const box = destination.getBoundingClientRect();
            const x = box.left-bounds.left, y = box.top+box.height/2-bounds.top, start = node.right-bounds.left;
            next.push({d:`M${start},${ny} C${start+65},${ny} ${x-65},${y} ${x},${y}`,stream:name,stage:index+1});
          });
        });
        setPaths(next);
      });
    };
    const observer = new ResizeObserver(measure);
    observer.observe(element);
    element.querySelectorAll('[data-flow-node], [data-flow-destination]').forEach(node => observer.observe(node));
    measure();
    return () => { observer.disconnect(); cancelAnimationFrame(frame); };
  }, [root, revision]);
  return <motion.svg className="flow-connections" aria-hidden="true" initial="hidden" whileInView="visible" viewport={{once:true,amount:.1}}>{paths.map((path,index)=><g key={index} data-selected={path.stream===active}><path d={path.d} className="flow-track"/><motion.path d={path.d} className="flow-current" variants={{hidden:{pathLength:reduced?1:0},visible:{pathLength:1,transition:{duration:reduced?0:1,delay:reduced?0:path.stage*.16,ease:[.22,1,.36,1]}}}}/></g>)}</motion.svg>;
}

export function SustainabilityFlow() {
  const [active, setActive] = useState('Water');
  const [expanded, setExpanded] = useState<string | null>(null);
  const root = useRef<HTMLDivElement>(null);
  return <section id="flow" className="sustain-section flow-section" aria-labelledby="flow-heading">
    <div className="flow-intro-scene">
      <div className="flow-hero-image"><Image src="/assets/redesign/sustainability/cinematic/world-3.webp" fill sizes="100vw" alt="A splash-lit split coconut releasing warm material streams"/></div>
      <div className="flow-intro"><p className="sustain-label">Nothing stops at the bottle</p><h2 id="flow-heading">One coconut.<br/><em>Many lives.</em></h2><p>This reference model follows each part of a coconut through proposed destination pathways. Shares and outcomes remain illustrative until measured.</p><a href="#flow-system" className="sustain-primary">How the flow works<ArrowRight/></a><small>Scroll to explore the reference flow</small></div>
    </div>
    <div id="flow-system" ref={root} className="flow-system">
      <FlowConnections root={root} active={active} revision={expanded}/>
      <div className="flow-origin-column">
        <div className="flow-source sustain-panel" data-flow-source><p className="sustain-label">One coconut</p><b>100% utilised</b><div className="flow-source-art"><Image src="/assets/redesign/sustainability/cinematic/world-3.webp" fill sizes="240px" alt="Whole and split coconut"/></div><small>Whole-coconut design ambition.<br/>Not an audited recovery rate.</small></div>
        <aside className="flow-methodology sustain-panel" aria-live="polite"><p className="sustain-label">{active} stream</p><dl><div><dt>Material share</dt><dd>{streams.find(stream=>stream.name===active)?.share}</dd></div><div><dt>Measurement</dt><dd>Reference estimate</dd></div><div><dt>Evidence status</dt><dd>Publication pending</dd></div></dl><p>{streams.find(stream=>stream.name===active)?.method}</p><a href="#receipts" className="sustain-secondary">View methodology<ArrowRight/></a></aside>
      </div>
      <div className="stream-list">{streams.map(stream=><div key={stream.name} className="stream-row" data-stream={stream.name} data-active={active===stream.name} onPointerEnter={event=>{if(event.pointerType==='mouse')setActive(stream.name)}}>
        <div className="stream-control"><button className="stream-node sustain-panel" data-flow-node aria-pressed={active===stream.name} onFocus={()=>setActive(stream.name)} onClick={()=>setActive(stream.name)}><stream.Icon/><span><b>{stream.name}</b><small>{stream.share}</small></span></button>{active===stream.name&&<p className="mobile-stream-method">{stream.method}</p>}</div>
        <div className="destination-list">{stream.destinations.map((destination,index)=>{
          const id=`stream-${stream.name.replace(/\W/g,'').toLowerCase()}-${index}`;
          return <article key={destination.title} className="destination sustain-panel" data-flow-destination>
            <div className="destination-copy"><h3>{destination.title}</h3><p>{destination.copy}</p><small>Destination pathway</small><span>{destination.use}</span></div>
            {destination.asset?<Image src={transparentProductAssets[destination.asset].src} alt={destination.title} width={86} height={104} className="destination-pack"/>:<MaterialArtwork title={destination.title}/>}
            <button aria-expanded={expanded===id} aria-controls={id} aria-label={`Details: ${destination.title}`} onClick={()=>{setActive(stream.name);setExpanded(expanded===id?null:id)}}><Plus/></button>
            {expanded===id&&<div className="destination-detail" id={id}><b>Method & evidence</b><p>{destination.detail}</p><a href="#receipts">Explore the evidence register<ArrowRight/></a></div>}
          </article>;
        })}</div>
      </div>)}</div>
    </div>
    <div className="flow-closing"><div className="circular-seal"><Leaf/><span>Circular by nature</span></div><div><h2>Waste isn’t the end of the story.<br/><em>It’s another material waiting for a purpose.</em></h2><p>The proposed circular model gives each stream a defined destination; operating outcomes require measurement and supporting records.</p></div><a className="sustain-secondary" href="#receipts">Review the evidence status<ArrowRight/></a></div>
  </section>;
}
