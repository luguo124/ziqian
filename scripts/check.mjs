import assert from 'node:assert/strict';
import { readFileSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dist = root;
const bundle = readFileSync(path.join(dist, 'mini-program.js'), 'utf8');
const { templates, fonts, sealStyles, drawArtwork } = vm.runInNewContext(bundle.replace(/export \{[^}]+\};/, '') + '\n({templates, fonts, sealStyles, drawArtwork})');
assert.equal(templates.length, 12);
assert.equal(fonts.length, 5);
assert.equal(sealStyles.length, 5);
assert.equal(templates.filter(t => t.direction === 'vertical').length, 6);
assert.equal(templates.filter(t => t.direction === 'horizontal').length, 6);
assert.equal(templates.filter(t => t.category === 'dark').length, 1);
assert.equal(new Set(templates.map(t => t.id)).size, templates.length);
let drawings = 0;
for (const template of templates) {
  for (const direction of ['horizontal', 'vertical']) {
    for (const reading of ['ltr', 'rtl']) {
      const text = '山'.repeat(40);
      const drawn = [];
      const ctx = new Proxy({ measureText(value) { return { width: [...value].length * 44 }; }, fillText(value,x,y) { assert.ok(Number.isFinite(x) && Number.isFinite(y)); drawn.push(value); } }, { get(target,key) { return target[key] ?? (() => {}); } });
      drawArtwork(ctx, { templateId:template.id, text, direction, reading, font:'song', fontSize:44, spacing:10, align:'center', sealStyle:'none' });
      assert.equal(drawn.slice(0,-1).join(''), text, `${template.id}/${direction}/${reading} clipped text`);
      drawings++;
    }
  }
}
const html = readFileSync(path.join(dist, 'index.html'), 'utf8');
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map(match => match[1]);
assert.equal(new Set(ids).size, ids.length, 'Duplicate HTML IDs');
for (const [, href] of html.matchAll(/(?:src|href)="([^"]+)"/g)) {
  if (href.startsWith('./')) assert.ok(existsSync(path.join(dist, href)), `Missing asset: ${href}`);
  if (href.startsWith('#') && href.length > 1) assert.ok(ids.includes(href.slice(1)), `Missing anchor: ${href}`);
}
assert.equal(html.match(/<h1\b/g).length,1);
assert.ok(!html.includes('itunes.apple.com'), 'Old iPhone download must not replace the mini-program entry');
assert.ok(!html.includes('http://'), 'No insecure external assets');
const css = readFileSync(path.join(dist, 'styles.css'), 'utf8');
const tokens = (block) => Object.fromEntries([...block.matchAll(/(--[\w-]+):\s*(#[\da-f]{6})/gi)].map(m => [m[1],m[2]]));
const light = tokens(css.match(/:root\s*\{([^}]+)\}/)[1]);
const dark = tokens(css.match(/:root\[data-theme="dark"\]\s*\{([^}]+)\}/)[1]);
assert.deepEqual(dark, tokens(css.match(/:root:not\(\[data-theme="light"\]\)\s*\{([^}]+)\}/)[1]), 'System and manual dark themes must match');
function luminance(hex) {
  const rgb = hex.match(/[\da-f]{2}/gi).map(v => parseInt(v,16)/255).map(v => v <= .04045 ? v/12.92 : ((v+.055)/1.055)**2.4);
  return rgb[0]*.2126 + rgb[1]*.7152 + rgb[2]*.0722;
}
function contrast(foreground, background) {
  const a = luminance(foreground), b = luminance(background);
  return (Math.max(a,b)+.05)/(Math.min(a,b)+.05);
}
for (const theme of [light,dark]) {
  for (const background of ['--paper','--surface','--soft']) {
    for (const foreground of ['--ink','--muted','--accent']) {
      assert.ok(contrast(theme[foreground],theme[background]) >= 4.5, `${foreground}/${background} text contrast below 4.5:1`);
    }
  }
  assert.ok(contrast(theme['--control-border'],theme['--surface']) >= 3, 'Input border contrast below 3:1');
  assert.ok(contrast(theme['--control-border'],theme['--soft']) >= 3, 'Segment border contrast below 3:1');
  assert.ok(contrast(theme['--selected-ink'],theme['--selected-bg']) >= 4.5, 'Selected direction contrast below 4.5:1');
  assert.ok(contrast(theme['--button-text'],theme['--button']) >= 4.5, 'Button contrast below 4.5:1');
}
assert.ok(contrast(dark['--muted'],dark['--soft']) >= 7, 'Dark helper text should have at least 7:1 contrast');
console.log('PASS: light/dark text, placeholder tokens, selected controls and borders meet contrast thresholds.');
console.log(`PASS: ${drawings} render-state checks; 12 templates, 5 fonts, 5 seals; IDs, local assets and anchors.`);
