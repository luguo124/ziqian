import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import vm from 'node:vm';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)),'..');
const dist = root;
let attempts = 0, failNext = false;
const registered = [];
const fontCode = readFileSync(path.join(dist,'web-fonts.js'),'utf8').replace(/export /g,'').replace('import.meta.url',JSON.stringify(pathToFileURL(path.join(dist,'web-fonts.js')).href));
const { webFonts, loadWebFont } = vm.runInNewContext(fontCode+'\n({webFonts,loadWebFont})',{
  URL, setTimeout, clearTimeout, document:{fonts:{add:font=>registered.push(font)}},
  FontFace:class { constructor(family,source) { this.family=family; this.source=source; } load() { attempts++; if (failNext) { failNext=false; return Promise.reject(new Error('Test network failure')); } return Promise.resolve(this); } }
});
const first = loadWebFont('kai');
assert.equal(first,loadWebFont('kai'),'Font requests must be deduplicated');
assert.equal((await first).id,'kai');
assert.equal(attempts,1);
assert.equal(registered.length,1);
failNext = true;
await assert.rejects(loadWebFont('fang'));
await loadWebFont('fang');
assert.equal(attempts,3,'Failed fonts must be retryable');
await assert.rejects(loadWebFont('missing'));
assert.equal(webFonts.length,5);
assert.equal(new Set(webFonts.map(font=>font.family)).size,5);
for (const font of webFonts) {
  const binary = readFileSync(path.join(dist,'assets/fonts',font.file));
  assert.equal(binary.toString('ascii',0,4),'wOF2',`${font.file}: invalid compressed font`);
  assert.ok(binary.length>10000,`${font.file}: unexpected tiny font`);
  assert.ok(readFileSync(path.join(dist,'assets/fonts',font.file.replace('.woff2','-OFL.txt')),'utf8').includes('SIL OPEN FONT LICENSE'));
}

let now = 1000;
function card(id) {
  return {dataset:{card:id},events:{},attrs:{},captured:false,style:{setProperty(){},removeProperty(){}},classList:{add(){},remove(){}},
    addEventListener(event,fn){this.events[event]=fn;},setAttribute(key,value){this.attrs[key]=value;},
    setPointerCapture(){this.captured=true;},hasPointerCapture(){return this.captured;},releasePointerCapture(){this.captured=false;},
    getBoundingClientRect(){return {left:400,right:700};}};
}
const night = card('night'), seal = card('seal'), status = {}, swapButton = card('swap');
const container = {dataset:{front:'seal'},querySelectorAll(){return [night,seal];},querySelector(selector){return selector.includes('status')?status:swapButton;}};
const { initHeroCards, clampCardDrag } = vm.runInNewContext(readFileSync(path.join(dist,'hero-cards.js'),'utf8').replace(/export /g,'')+'\n({initHeroCards,clampCardDrag})',{
  performance:{now:()=>now},document:{documentElement:{clientWidth:1280}}
});
initHeroCards(container);
swapButton.events.click();
assert.equal(container.dataset.front,'night');
assert.equal(night.attrs['aria-pressed'],'true');
seal.events.keydown({key:'Enter',preventDefault(){}});
assert.equal(container.dataset.front,'seal');
const pointer = {isPrimary:true,button:0,pointerId:1,clientX:500,clientY:200,pointerType:'mouse'};
seal.events.pointerdown(pointer);
seal.events.pointermove({...pointer,clientX:570,clientY:210});
seal.events.pointerup();
assert.equal(container.dataset.front,'night','Drag must exchange stacking');
seal.events.click();
assert.equal(container.dataset.front,'night','Post-drag click must not swap twice');
now += 500;
night.events.pointerdown(pointer);
night.events.pointermove({...pointer,clientX:600});
night.events.pointercancel();
assert.equal(container.dataset.front,'night','Cancelled drags must keep stacking');
night.events.pointerdown({...pointer,pointerType:'touch'});
night.events.pointermove({...pointer,pointerType:'touch',clientX:502,clientY:290});
night.events.pointercancel();
assert.equal(container.dataset.front,'night','Vertical touch scrolling must not exchange cards');
const offset = clampCardDrag(500,-200,{left:400,right:700},800);
assert.equal(offset.x,84);
assert.equal(offset.y,-65);
assert.ok(status.textContent.includes('夜墨'));
console.log('PASS: five licensed WOFF2 assets; font loading cache/failure/retry; card click/keyboard/drag/cancel/bounds.');
