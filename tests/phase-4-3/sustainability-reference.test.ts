import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { calculateReferenceImpact, isReferenceBatch, REFERENCE_BATCH } from '../../lib/sustainability-reference';

test('reference impact reproduces the supplied board without claiming verification', () => {
  assert.deepEqual(calculateReferenceImpact(24), { units: 24, diverted: 8.64, biochar: 2.16, carbon: 6.48 });
  assert.deepEqual(calculateReferenceImpact(4, true), calculateReferenceImpact(24));
  assert.deepEqual(calculateReferenceImpact(1), { units: 1, diverted: .36, biochar: .09, carbon: .27 });
});

test('invalid quantities never create impact values', () => {
  for (const value of [0, -1, 1.5, 1000, NaN, Infinity]) assert.equal(calculateReferenceImpact(value), null);
  assert.equal(calculateReferenceImpact(999, true)?.units, 5994);
});

test('only the supplied demonstration batch matches', () => {
  assert.equal(isReferenceBatch(` ${REFERENCE_BATCH.toLowerCase()} `), true);
  for (const code of ['', 'CO-W-2608-9999', '<script>', `${REFERENCE_BATCH}-extra`]) assert.equal(isReferenceBatch(code), false);
});

test('locked section sequence retains a single shared newsletter and no local shell', () => {
  const page = readFileSync('components/sustainability/ReferenceSustainabilityPage.tsx', 'utf8');
  const markers = ['className="sustain-hero"', 'className="sustain-principles"', '<SustainabilityTrace/>', '<SustainabilitySeasonal/>', '<SustainabilityFlow/>', '<SustainabilityCalculator/>', 'id="people"', '<SustainabilityEvidence/>', 'className="closing-source"', '<NewsletterSection/>'];
  const positions = markers.map(marker => page.indexOf(marker));
  assert.ok(positions.every((position, i) => position >= 0 && (!i || position > positions[i-1])));
  assert.equal((page.match(/<NewsletterSection/g) || []).length, 1);
  assert.doesNotMatch(page, /<(?:header|footer|Navigation|Footer)[ >]/);
  assert.match(page, /MotionConfig reducedMotion="user"/);
  assert.match(page, /not verified operating figures/);
});

test('sustainability media is locally bundled and all prepared scenes exist', () => {
  const media = readFileSync('lib/media.ts', 'utf8');
  assert.ok(media.includes('/assets/redesign/sustainability/'));
  for (const name of ['hero-desktop', 'hero-mobile', 'people', 'closing', 'impact', 'world-1', 'world-2', 'world-3', 'world-4', 'world-5']) {
    assert.ok(existsSync(`public/assets/redesign/sustainability/cinematic/${name}.webp`), name);
  }
});

test('motion does not introduce infinite routes, scroll-measuring handlers, or hidden certification claims', () => {
  const sources = ['SustainabilityTrace', 'SustainabilityFlow', 'SustainabilityCalculator', 'SustainabilityEvidence'].map(name => readFileSync(`components/sustainability/${name}.tsx`, 'utf8')).join('\n');
  assert.doesNotMatch(sources, /repeat:\s*Infinity|addEventListener\(['"]scroll/);
  assert.match(sources, /Publication pending/);
  assert.match(sources, /if \(step === 7\) window.clearInterval\(timer\)/);
  const css = readFileSync('styles/reference-sustainability.css', 'utf8');
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.doesNotMatch(css, /infinite/);
});
