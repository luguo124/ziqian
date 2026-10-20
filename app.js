import { templates, fonts, sealStyles, drawArtwork } from './mini-program.js';
import { webFonts, loadWebFont } from './web-fonts.js';
import { initHeroCards } from './hero-cards.js';

const $ = (selector) => document.querySelector(selector);
const state = { templateId:'plain', text:'山静日长，清风入怀。', author:'', direction:'horizontal', reading:'ltr', font:'song', fontSize:44, spacing:10, align:'center', sealStyle:'ziqian' };
const preview = $('#preview');
let filter = 'all';
let expanded = false;
let fontLoading = false;
let fontRequest = 0;
let requestedFont = 'song';
fonts.forEach(font => { font.name = webFonts.find(item => item.id === font.id).name; });

function updateDownloadState() {
  $('.download-button').disabled = fontLoading || state.text.split('\n').length > 4;
}

async function selectFont(id) {
  const request = ++fontRequest;
  requestedFont = id;
  fontLoading = true;
  updateDownloadState();
  $('#fontRetry').hidden = true;
  $('#fontStatus').textContent = `正在加载${webFonts.find(font => font.id === id).name}，首次使用请稍候…`;
  $('#fontSelect').setAttribute('aria-busy','true');
  try {
    const loaded = await loadWebFont(id);
    if (request !== fontRequest) return;
    fonts.find(font => font.id === id).family = `"${loaded.family}", serif`;
    $('#fontSample').style.fontFamily = `"${loaded.family}", serif`;
    state.font = id;
    updatePreview();
    $('#fontStatus').textContent = `${loaded.name}已应用`;
  } catch {
    if (request !== fontRequest) return;
    $('#fontSelect').value = state.font;
    $('#fontStatus').textContent = '字体加载失败，已保留当前字形或系统备用字体，请重试。';
    $('#fontRetry').hidden = false;
  } finally {
    if (request === fontRequest) {
      fontLoading = false;
      $('#fontSelect').removeAttribute('aria-busy');
      updateDownloadState();
    }
  }
}

function paint(canvas, artwork) {
  const context = canvas.getContext('2d');
  if (!context) throw new Error('当前浏览器不支持画布预览，请使用微信小程序。');
  drawArtwork(context, artwork);
}

function updatePreview() {
  paint(preview, state);
  const template = templates.find((item) => item.id === state.templateId);
  $('#previewName').textContent = template.name;
  $('#textCount').value = `${[...state.text].length} / 40`;
  $('#fontSample').textContent = state.text.trim().slice(0,18) || '山静日长，清风入怀。';
  preview.setAttribute('aria-label', `${template.name}模板作品预览：${state.text || '还没有输入文字'}`);
  $('#readingField').hidden = state.direction !== 'vertical';
  document.querySelectorAll('[data-direction]').forEach((button) => {
    const active = button.dataset.direction === state.direction;
    button.classList.toggle('active', active);
    button.setAttribute('aria-pressed', String(active));
  });
  $('#readingSelect').value = state.reading;
  const tooManyLines = state.text.split('\n').length > 4;
  $('#textInput').setCustomValidity(tooManyLines ? '网页试写最多支持 4 行，请减少换行。' : '');
  updateDownloadState();
  $('#studioStatus').textContent = tooManyLines ? '网页试写最多支持 4 行，请减少换行后再下载。' : '';
}

function selectTemplate(id) {
  const template = templates.find((item) => item.id === id);
  if (!template) return;
  Object.assign(state, { templateId:id, direction:template.direction, reading:template.reading });
  $('#templateSelect').value = id;
  updatePreview();
}

function renderGallery() {
  const matching = templates.filter((item) => filter === 'all' || (filter === 'dark' ? item.category === 'dark' : item.direction === filter));
  const visible = expanded || filter !== 'all' ? matching : matching.slice(0,6);
  const grid = $('#templateGrid');
  grid.replaceChildren();
  for (const template of visible) {
    const button = document.createElement('button');
    button.className = 'template-card';
    button.type = 'button';
    button.setAttribute('aria-label', `试写${template.name}模板，${template.desc}`);
    const canvas = document.createElement('canvas');
    canvas.width = 720;
    canvas.height = 900;
    canvas.setAttribute('aria-hidden', 'true');
    const info = document.createElement('span');
    info.className = 'template-info';
    const words = document.createElement('span');
    const title = document.createElement('strong');
    title.textContent = template.name;
    const description = document.createElement('small');
    description.textContent = template.desc;
    words.append(title, description);
    const arrow = document.createElement('span');
    arrow.className = 'template-arrow';
    arrow.textContent = '↗';
    arrow.setAttribute('aria-hidden', 'true');
    info.append(words, arrow);
    button.append(canvas, info);
    paint(canvas, { ...state, templateId:template.id, text:template.previewText, author:'字签', direction:template.direction, reading:template.reading, font:'song', sealStyle:'ziqian' });
    button.addEventListener('click', () => {
      selectTemplate(template.id);
      $('#studio').scrollIntoView({ behavior:matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' });
      $('#textInput').focus({ preventScroll:true });
    });
    grid.append(button);
  }
  $('#templateCount').textContent = `${matching.length} 款模板`;
  $('#expandTemplates').hidden = filter !== 'all';
  $('#expandTemplates').setAttribute('aria-expanded', String(expanded));
  $('#expandTemplates').textContent = expanded ? '收起模板 ↑' : '展开全部 12 款 ↓';
}

for (const [selector, items] of [['#templateSelect', templates], ['#fontSelect', fonts], ['#sealSelect', sealStyles]]) {
  for (const item of items) $(selector).add(new Option(item.name, item.id));
}
$('#studioForm').addEventListener('input', (event) => {
  if (!['textInput', 'authorInput'].includes(event.target.id)) return;
  if (event.target.id === 'textInput') state.text = event.target.value;
  if (event.target.id === 'authorInput') state.author = event.target.value;
  updatePreview();
});
$('#templateSelect').addEventListener('change', (event) => selectTemplate(event.target.value));
$('#fontSelect').addEventListener('change', (event) => selectFont(event.target.value));
$('#fontRetry').addEventListener('click',() => { $('#fontSelect').value = requestedFont; selectFont(requestedFont); });
$('#sealSelect').addEventListener('change', (event) => { state.sealStyle = event.target.value; updatePreview(); });
$('#readingSelect').addEventListener('change', (event) => { state.reading = event.target.value; updatePreview(); });
document.querySelectorAll('[data-direction]').forEach((button) => button.addEventListener('click', () => { state.direction = button.dataset.direction; updatePreview(); }));
document.querySelectorAll('[data-sample]').forEach((button) => button.addEventListener('click', () => {
  state.text = button.dataset.sample;
  $('#textInput').value = state.text;
  updatePreview();
}));
document.querySelectorAll('[data-filter]').forEach((button) => button.addEventListener('click', () => {
  filter = button.dataset.filter;
  document.querySelectorAll('[data-filter]').forEach((item) => {
    const active = item === button;
    item.classList.toggle('active', active);
    item.setAttribute('aria-pressed', String(active));
  });
  renderGallery();
}));
$('#expandTemplates').addEventListener('click', () => { expanded = !expanded; renderGallery(); });

$('#studioForm').addEventListener('submit', (event) => {
  event.preventDefault();
  if (fontLoading) return;
  if (!state.text.trim()) {
    $('#studioStatus').textContent = '先写下一句话，再留下这一页。';
    $('#textInput').focus();
    return;
  }
  // shortcut: short website demo only; full draft and collection workflows stay in the mini-program.
  const button = $('.download-button');
  button.disabled = true;
  preview.toBlob((blob) => {
    updateDownloadState();
    if (!blob) { $('#studioStatus').textContent = '图片生成失败，请重试或在小程序中保存。'; return; }
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `字签-${state.templateId}.jpg`;
    document.body.append(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 30000);
    $('#studioStatus').textContent = '已发起图片下载，请在浏览器下载记录中查看。';
  }, 'image/jpeg', .9);
});

const dialog = $('#codeDialog');
document.querySelectorAll('[data-open-code]').forEach((button) => button.addEventListener('click', () => dialog.showModal()));
$('#closeDialog').addEventListener('click', () => dialog.close());
dialog.addEventListener('click', (event) => {
  const rect = dialog.getBoundingClientRect();
  if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) dialog.close();
});
const systemDark = matchMedia('(prefers-color-scheme: dark)');
let themeOverride = null;
function updateThemeLabel() {
  const dark = themeOverride ? themeOverride === 'dark' : systemDark.matches;
  $('#themeToggle').setAttribute('aria-label', dark ? '切换为浅色模式' : '切换为深色模式');
  $('#themeToggle').title = dark ? '切换为浅色模式' : '切换为深色模式';
}
$('#themeToggle').addEventListener('click', () => {
  const dark = themeOverride ? themeOverride === 'dark' : systemDark.matches;
  themeOverride = dark ? 'light' : 'dark';
  document.documentElement.dataset.theme = themeOverride;
  updateThemeLabel();
});
systemDark.addEventListener('change', updateThemeLabel);
updateThemeLabel();
try {
  paint($('#heroBack'), { ...state, templateId:'night', text:'夜深见月，心静见山。', direction:'vertical', reading:'rtl', fontSize:48, sealStyle:'round' });
  paint($('#heroFront'), { ...state, templateId:'seal', text:'山静日长\n清风入怀', direction:'vertical', reading:'rtl', fontSize:52 });
  renderGallery();
  updatePreview();
  initHeroCards($('.hero-art'));
  selectFont('song');
} catch (error) {
  $('#studioStatus').textContent = error.message;
  $('.download-button').disabled = true;
}
