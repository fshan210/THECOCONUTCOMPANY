"use client";

import Image from 'next/image';
import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { ArrowRight, Box, Factory, MapPin, PackageCheck, QrCode, ScanLine, ShieldCheck, Sprout, Truck, X } from 'lucide-react';
import { isReferenceBatch, REFERENCE_BATCH } from '@/lib/sustainability-reference';

const fields = [
  ['Batch', REFERENCE_BATCH], ['Origin', 'Pollachi, Tamil Nadu'],
  ['Harvest period', 'Aug 10 – Aug 18, 2025'], ['Farmer collective', 'Aliyar Organic Farmers'],
  ['Processing facility', '.CO Care Hub, Pollachi'], ['Production date', 'Aug 22, 2025'],
  ['Batch status', 'In transit · reference example'],
] as const;
const journey = [
  [Sprout, 'Harvested', 'Aug 10'], [Truck, 'Collected', 'Aug 11'], [ScanLine, 'Quality checked', 'Aug 12'],
  [Factory, 'Processed', 'Aug 14'], [Box, 'Packed', 'Aug 20'], [Truck, 'Dispatched', 'Aug 22'],
] as const;
type BarcodeAPI = new (options: { formats: string[] }) => { detect(image: ImageBitmap): Promise<{ rawValue: string }[]> };

export function SustainabilityTrace() {
  const reduced = useReducedMotion();
  const [code, setCode] = useState(REFERENCE_BATCH);
  const [run, setRun] = useState(0);
  const [phase, setPhase] = useState(0);
  const [error, setError] = useState('');
  const [scanOpen, setScanOpen] = useState(false);
  const [scanMessage, setScanMessage] = useState('Select a QR image from your device. It is decoded locally and is never uploaded.');
  const helpRef = useRef<HTMLElement>(null);
  const running = run > 0 && phase < 7;

  useEffect(() => {
    if (!run) return;
    if (reduced) { setPhase(7); return; }
    let step = 0;
    const timer = window.setInterval(() => {
      step += 1;
      setPhase(step);
      if (step === 7) window.clearInterval(timer);
    }, 200);
    return () => window.clearInterval(timer);
  }, [run, reduced]);

  function trace(event: FormEvent) {
    event.preventDefault();
    setPhase(0);
    setError('');
    if (!isReferenceBatch(code)) {
      setRun(0);
      setError('No published record matches this code. Check the printed code, contact us, or try the reference example below.');
      return;
    }
    setRun(value => value + 1);
  }

  async function scanImage(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    const Detector = (window as unknown as { BarcodeDetector?: BarcodeAPI }).BarcodeDetector;
    if (!Detector) {
      setScanMessage('QR image decoding is not supported in this browser. Enter the batch code printed next to the QR instead.');
      return;
    }
    let bitmap: ImageBitmap | undefined;
    try {
      setScanMessage('Reading the QR image on your device…');
      bitmap = await createImageBitmap(file);
      const results = await new Detector({ formats: ['qr_code'] }).detect(bitmap);
      let scanned = results[0]?.rawValue?.trim();
      if (!scanned) throw new Error('No QR found');
      try { scanned = new URL(scanned).searchParams.get('batch') || scanned; } catch { /* A plain batch code is supported. */ }
      if (!/^CO-[A-Z0-9-]{3,40}$/i.test(scanned)) throw new Error('Not a batch QR');
      setCode(scanned.toUpperCase());
      setScanMessage('Batch code read. Choose Trace batch to look up the record.');
    } catch {
      setScanMessage('No readable .CO batch code was found. Try a sharper image or enter the printed code manually.');
    } finally { bitmap?.close(); }
  }

  return <section id="trace" className="sustain-section trace-section" aria-labelledby="trace-heading">
    <div className="trace-intro">
      <p className="sustain-label">Trace your coconut</p>
      <h2 id="trace-heading">From one batch,<br/>back <em>to the farm.</em></h2>
      <p>This reference demonstration shows how an approved batch record could connect a product to its recorded origin. Only the supplied demo code returns data.</p>
      <form className="sustain-panel trace-form" onSubmit={trace}>
        <label htmlFor="batch-code">Trace a batch</label>
        <div className="trace-input">
          <input id="batch-code" value={code} onChange={event => { setCode(event.target.value.toUpperCase()); setError(''); setRun(0); setPhase(0); }} required maxLength={48} autoComplete="off" spellCheck={false} aria-describedby="trace-disclosure" aria-invalid={Boolean(error)} />
          <button type="button" aria-label="Clear batch code" onClick={() => { setCode(''); setRun(0); setPhase(0); }}><X/></button>
        </div>
        <button className="sustain-primary" type="submit" disabled={running}>{running ? 'Tracing reference…' : 'Trace batch'}<ArrowRight/></button>
        <button className="sustain-secondary" type="button" onClick={() => setScanOpen(value => !value)} aria-expanded={scanOpen} aria-controls="qr-reader"><QrCode/>Scan QR</button>
        {scanOpen && <div id="qr-reader" className="qr-reader"><label htmlFor="qr-image">Choose a QR image</label><input id="qr-image" type="file" accept="image/*" onChange={scanImage}/><p role="status">{scanMessage}</p></div>}
        <button className="text-control" type="button" onClick={() => { helpRef.current?.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' }); helpRef.current?.focus({ preventScroll: true }); }}>Where do I find this?</button>
        <p id="trace-disclosure">The pre-filled code is a reference demonstration, not a live verified batch.</p>
        {error && <p className="trace-error" role="alert">{error} <button type="button" onClick={() => setCode(REFERENCE_BATCH)}>Use reference code</button></p>}
        <span className="sr-only" role="status">{phase === 7 ? 'Reference journey displayed. This is not a live verified record.' : running ? 'Loading reference journey.' : ''}</span>
      </form>
      <aside className="batch-help sustain-panel" ref={helpRef} tabIndex={-1}>
        <p className="sustain-label">Find the batch code</p><p>Look for the code printed near the barcode on the back or bottom of your product.</p>
        <div className="batch-code-example"><PackageCheck/><span>Batch code<br/><b>{REFERENCE_BATCH}</b><small>Example placement</small></span></div>
      </aside>
    </div>
    <div className={`trace-map sustain-panel ${run ? 'is-traced' : ''}`} aria-busy={running}>
      <div className="map-stage">
        <Image src="/assets/redesign/sustainability/cinematic/world-2.webp" fill sizes="(min-width: 900px) 60vw, 100vw" alt=""/>
        <svg viewBox="0 0 760 670" aria-label="Schematic Pollachi sourcing route, not a navigational map" role="img" className="map-route">
          <g className="map-secondary-roads"><path d="M100 20 Q130 140 310 220 T414 380 T350 650 M414 380 Q490 310 750 300 M414 380 Q560 435 710 510 M80 150 Q215 200 414 380 M100 580 Q180 490 260 430"/></g>
          <motion.path key={run} d="M590 86 C558 154 610 205 527 270 S455 310 414 380 S282 390 226 455" initial={{ pathLength: run ? 0 : 1 }} animate={{ pathLength: 1 }} transition={{ duration: reduced || !run ? 0 : 1.4, ease: [.22,1,.36,1] }} className={run ? 'route-active' : 'route-idle'}/>
          <path className="farming-boundary" d="M198 300 L226 324 250 319 284 354 297 394 279 420 290 454 252 490 216 508 183 480 153 471 136 439 151 417 132 387 150 360 166 354 170 322Z"/>
          {[ [590,86], [527,270], [414,380], [226,455] ].map(([cx,cy],i) => <circle key={cx} cx={cx} cy={cy} r="4" className={phase > i ? 'map-node active' : 'map-node'}/>) }
        </svg>
        <span className="map-title">Pollachi<small>Tamil Nadu, India</small></span>
        <span className="map-label hills">Anamalai<br/>Hills</span><span className="map-label reservoir">Aliyar<br/>Reservoir</span><span className="map-label udumalpet">Udumalpet</span><span className="map-label kinathukadavu">Kinathukadavu</span><span className="map-label valparai">Valparai</span>
        <div className="farm-zone"><Sprout/><b>Our farming<br/>zone</b><Sprout/></div><span className="map-pollachi"><MapPin/> Pollachi</span><div className="map-north"><b>N</b><ArrowRight/></div>
        <aside className="batch-card sustain-panel"><span className="demo-flag">{run ? 'Reference record · illustrative' : 'Batch record preview'}</span>{fields.map(([label,value],i) => <div key={label} className={phase > i ? 'field-filled' : ''}><small>{label}</small><span>{phase > i ? value : '—'}</span></div>)}</aside>
      </div>
      <div className="journey"><p className="sustain-label">The journey of this batch</p><ol>{journey.map(([Icon,title,date],i) => <li key={title} className={phase > i ? 'active' : ''}><span><Icon/></span><b>{title}</b><small>{phase > i ? `${date}, 2025` : 'Awaiting record'}</small></li>)}</ol><p><ShieldCheck/>Every step needs evidence. Reference journey shown for demonstration.</p></div>
    </div>
  </section>;
}
