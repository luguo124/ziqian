export const webFonts = [
  { id:'song', name:'小薇宋 · 清雅', family:'ZiqianXiaoWei', file:'zcoolxiaowei.woff2' },
  { id:'kai', name:'马善政 · 毛笔', family:'ZiqianMaShanZheng', file:'mashanzheng.woff2' },
  { id:'fang', name:'志莽行书 · 洒脱', family:'ZiqianZhiMangXing', file:'zhimangxing.woff2' },
  { id:'li', name:'刘建毛草 · 草书', family:'ZiqianLiuJianMaoCao', file:'liujianmaocao.woff2' },
  { id:'xing', name:'龙藏 · 手写', family:'ZiqianLongCang', file:'longcang.woff2' }
];

const pending = new Map();
export function loadWebFont(id) {
  const font = webFonts.find(item => item.id === id);
  if (!font) return Promise.reject(new Error('Unknown font'));
  if (!pending.has(id)) {
    const url = new URL(`./assets/fonts/${font.file}`, import.meta.url);
    const face = new FontFace(font.family, `url("${url}")`, { style:'normal', weight:'400' });
    let timeout;
    const promise = Promise.race([face.load(),new Promise((resolve,reject) => { timeout = setTimeout(() => reject(new Error('Font load timed out')),20000); })]).then(loaded => { document.fonts.add(loaded); return font; }).catch(error => {
      pending.delete(id);
      throw error;
    }).finally(() => clearTimeout(timeout));
    pending.set(id,promise);
  }
  return pending.get(id);
}
