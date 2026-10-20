// Generated from ../utils by scripts/sync-mini.mjs. Do not edit.
const templates = [
  { id: "plain", name: "素纸", category: "horizontal", direction: "horizontal", reading: "ltr", bg: "#f8f4ea", fg: "#20211f", previewText: "山静日长", desc: "横排 · 大留白" },
  { id: "seal", name: "朱印", category: "vertical", direction: "vertical", reading: "rtl", bg: "#f6f0e4", fg: "#20211f", previewText: "清风入怀", desc: "竖排 · 朱红点睛" },
  { id: "rule", name: "双线", category: "vertical", direction: "vertical", reading: "rtl", bg: "#f7f3e9", fg: "#20211f", previewText: "见字如面", desc: "竖排 · 克制边线" },
  { id: "grid", name: "方格", category: "vertical", direction: "vertical", reading: "rtl", bg: "#f6f1e6", fg: "#20211f", previewText: "一字一格", desc: "竖排 · 淡墨网格" },
  { id: "line", name: "远线", category: "horizontal", direction: "horizontal", reading: "ltr", bg: "#f8f5ec", fg: "#20211f", previewText: "远山如黛", desc: "横排 · 一笔远山" },
  { id: "night", name: "夜墨", category: "dark", direction: "horizontal", reading: "rtl", bg: "#272824", fg: "#eee8da", previewText: "夜深见月", desc: "横排 · 深墨反白" },
  { id: "tea", name: "茶笺", category: "horizontal", direction: "horizontal", reading: "ltr", bg: "#eee5d5", fg: "#292822", previewText: "煮茶听雨", desc: "横排 · 暖茶纸色" },
  { id: "bookmark", name: "题签", category: "vertical", direction: "vertical", reading: "rtl", bg: "#f6f1e7", fg: "#20211f", previewText: "一纸题签", desc: "竖排 · 侧边朱栏" },
  { id: "rice", name: "米格", category: "vertical", direction: "vertical", reading: "rtl", bg: "#f5efe4", fg: "#292722", previewText: "落笔成章", desc: "竖排 · 淡红米格" },
  { id: "fold", name: "对页", category: "horizontal", direction: "horizontal", reading: "ltr", bg: "#f8f4eb", fg: "#20211f", previewText: "两页相知", desc: "横排 · 中线对页" },
  { id: "frame", name: "墨框", category: "horizontal", direction: "horizontal", reading: "rtl", bg: "#f3efe5", fg: "#20211f", previewText: "方寸有言", desc: "横排 · 双层细框" },
  { id: "ash", name: "灰笺", category: "vertical", direction: "vertical", reading: "ltr", bg: "#e7e5df", fg: "#292a27", previewText: "静处生光", desc: "竖排 · 冷灰素纸" }
];

const fonts = [
  { id: "song", name: "宋体 · 清雅", family: 'serif' },
  { id: "kai", name: "楷书 · 温润", family: 'KaiTi, STKaiti, serif' },
  { id: "fang", name: "仿宋 · 古朴", family: 'FangSong, STFangsong, serif' },
  { id: "li", name: "隶书 · 厚重", family: 'LiSu, STLiti, serif' },
  { id: "xing", name: "行楷 · 洒脱", family: 'STXingkai, KaiTi, serif' }
];

const sealStyles = [
  { id: "ziqian", name: "字签", mark: "字签" },
  { id: "solid", name: "朱文", mark: "印" },
  { id: "round", name: "圆章", mark: "雅" },
  { id: "leisure", name: "闲章", mark: "清欢" },
  { id: "none", name: "无章", mark: "—" }
];

const templateMap = templates.reduce((result, item) => {
  result[item.id] = item;
  return result;
}, {});

const fontMap = fonts.reduce((result, item) => {
  result[item.id] = item;
  return result;
}, {});



function drawBackground(ctx, templateId, width, height) {
  const template = templateMap[templateId] || templateMap.plain;
  const decorationBottom = height - 170;
  ctx.fillStyle = template.bg;
  ctx.fillRect(0, 0, width, height);

  ctx.save();
  if (templateId === "plain") {
    ctx.fillStyle = "#a9362c";
    ctx.fillRect(86, 90, 56, 4);
  } else if (templateId === "seal") {
    ctx.fillStyle = "rgba(169, 54, 44, 0.07)";
    ctx.fillRect(width / 2, 0, width / 2, height);
    ctx.fillStyle = "rgba(169, 54, 44, 0.55)";
    ctx.fillRect(width / 2 - 1, 0, 2, height);
  } else if (templateId === "rule") {
    ctx.strokeStyle = "rgba(67, 64, 58, 0.22)";
    ctx.lineWidth = 2;
    [82, width - 82].forEach((x) => {
      ctx.beginPath();
      ctx.moveTo(x, 74);
      ctx.lineTo(x, decorationBottom);
      ctx.stroke();
    });
  } else if (templateId === "grid") {
    ctx.strokeStyle = "rgba(83, 76, 64, 0.10)";
    ctx.lineWidth = 1;
    for (let x = 48; x < width; x += 48) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, decorationBottom);
      ctx.stroke();
    }
    for (let y = 42; y < decorationBottom; y += 48) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }
  } else if (templateId === "line") {
    ctx.strokeStyle = "rgba(49, 52, 47, 0.16)";
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, height * 0.76);
    ctx.lineTo(width * 0.18, height * 0.68);
    ctx.lineTo(width * 0.32, height * 0.73);
    ctx.lineTo(width * 0.53, height * 0.59);
    ctx.lineTo(width * 0.69, height * 0.71);
    ctx.lineTo(width, height * 0.64);
    ctx.stroke();
  } else if (templateId === "night") {
    ctx.strokeStyle = "rgba(238, 232, 218, 0.18)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(width - 118, 118, 42, 0, Math.PI * 2);
    ctx.stroke();
  } else if (templateId === "tea") {
    ctx.fillStyle = "rgba(111, 82, 50, 0.34)";
    ctx.fillRect(78, 82, width - 156, 2);
    ctx.fillStyle = "#a9362c";
    ctx.fillRect(78, 82, 38, 2);
    ctx.fillStyle = "rgba(111, 82, 50, 0.18)";
    ctx.fillRect(78, decorationBottom, width - 156, 2);
  } else if (templateId === "bookmark") {
    ctx.fillStyle = "rgba(169, 54, 44, 0.10)";
    ctx.fillRect(width - 92, 0, 92, height);
    ctx.fillStyle = "rgba(169, 54, 44, 0.55)";
    ctx.fillRect(width - 94, 0, 2, height);
    ctx.fillRect(width - 68, 78, 28, 4);
  } else if (templateId === "rice") {
    const cell = 72;
    ctx.strokeStyle = "rgba(122, 63, 51, 0.11)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.rect(0, 0, width, decorationBottom);
    ctx.clip();
    for (let x = 0; x < width; x += cell) {
      for (let y = 0; y < decorationBottom; y += cell) {
        ctx.strokeRect(x, y, cell, cell);
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(x + cell, y + cell);
        ctx.moveTo(x + cell, y);
        ctx.lineTo(x, y + cell);
        ctx.stroke();
      }
    }
  } else if (templateId === "fold") {
    ctx.fillStyle = "rgba(78, 72, 62, 0.035)";
    ctx.fillRect(width / 2, 0, width / 2, height);
    ctx.fillStyle = "rgba(78, 72, 62, 0.16)";
    ctx.fillRect(width / 2 - 1, 68, 2, decorationBottom - 68);
  } else if (templateId === "frame") {
    ctx.strokeStyle = "rgba(34, 35, 32, 0.36)";
    ctx.lineWidth = 3;
    ctx.strokeRect(62, 62, width - 124, height - 124);
    ctx.strokeStyle = "rgba(34, 35, 32, 0.10)";
    ctx.lineWidth = 1;
    ctx.strokeRect(74, 74, width - 148, height - 148);
  } else if (templateId === "ash") {
    ctx.fillStyle = "rgba(41, 42, 39, 0.28)";
    ctx.fillRect(76, 82, width - 152, 2);
    ctx.fillStyle = "#a9362c";
    ctx.fillRect(width - 112, 66, 36, 34);
  }
  ctx.restore();
}

function wrapLines(ctx, text, maxWidth) {
  const lines = [];
  let line = "";
  for (const char of text) {
    if (char === "\n") {
      if (line) lines.push(line);
      line = "";
      continue;
    }
    const candidate = line + char;
    if (line && ctx.measureText(candidate).width > maxWidth) {
      lines.push(line);
      line = char;
    } else {
      line = candidate;
    }
  }
  if (line) lines.push(line);
  return lines;
}

function drawSeal(ctx, x, y, style, color, paperColor) {
  if (style === "none") return;
  ctx.save();
  ctx.strokeStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (style === "solid") {
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 46, 46);
    ctx.fillStyle = paperColor;
    ctx.font = '600 24px serif';
    ctx.fillText("印", x + 23, y + 24);
  } else if (style === "round") {
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(x + 23, y + 23, 22, 0, Math.PI * 2);
    ctx.stroke();
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(x + 23, y + 23, 17, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = color;
    ctx.font = '600 20px serif';
    ctx.fillText("雅", x + 23, y + 24);
  } else if (style === "leisure") {
    ctx.lineWidth = 3;
    ctx.strokeRect(x + 7, y - 3, 32, 52);
    ctx.fillStyle = color;
    ctx.font = '600 14px serif';
    ctx.fillText("清", x + 23, y + 12);
    ctx.fillText("欢", x + 23, y + 32);
  } else {
    ctx.lineWidth = 3;
    ctx.strokeRect(x, y, 46, 46);
    ctx.fillStyle = color;
    ctx.font = '600 17px serif';
    ctx.fillText("字", x + 23, y + 15);
    ctx.fillText("签", x + 23, y + 32);
  }
  ctx.restore();
}

function drawArtwork(ctx, state, width = 720, height = 900) {
  const template = templateMap[state.templateId] || templateMap.plain;
  const font = fontMap[state.font] || fontMap.song;
  const fontSize = Number(state.fontSize) || 44;
  const spacingValue = Number(state.spacing);
  const spacing = Number.isFinite(spacingValue) ? spacingValue : 10;
  const sealStyle = state.sealStyle || "ziqian";

  ctx.clearRect(0, 0, width, height);
  drawBackground(ctx, state.templateId, width, height);
  ctx.fillStyle = template.fg;
  ctx.font = `500 ${fontSize}px ${font.family}`;
  ctx.textBaseline = "top";

  const text = (state.text || "").trim();
  if (text && state.direction === "vertical") {
    const chars = [...text];
    const stepY = fontSize + spacing;
    const columnStep = fontSize + Math.max(22, spacing * 1.6);
    const stepX = state.reading === "rtl" ? -columnStep : columnStep;
    const maxY = height - 180;
    let x = state.reading === "rtl" ? width - 150 : 150;
    let y = 132;
    ctx.textAlign = "center";
    for (const char of chars) {
      if (char === "\n" || y + stepY > maxY) {
        x += stepX;
        y = 132;
        if (char === "\n") continue;
      }
      if ((state.reading === "rtl" && x < 110) || (state.reading === "ltr" && x > width - 110)) break;
      ctx.fillText(char, x, y);
      y += stepY;
    }
  } else if (text) {
    const lines = wrapLines(ctx, text, width - 180).slice(0, 8);
    const lineHeight = fontSize + spacing + 12;
    const totalHeight = lines.length * lineHeight;
    let y = Math.max(146, (height - totalHeight) / 2 - 10);
    const startAligned = state.align === "left";
    ctx.textAlign = startAligned ? (state.reading === "rtl" ? "right" : "left") : "center";
    const x = startAligned ? (state.reading === "rtl" ? width - 90 : 90) : width / 2;
    lines.forEach((line) => {
      ctx.fillText(line, x, y);
      y += lineHeight;
    });
  }

  const signatureColor = state.templateId === "night" ? "rgba(238,232,218,.65)" : "rgba(44,44,40,.58)";
  const sealColor = state.templateId === "night" ? "#d67668" : "#a9362c";
  const signatureX = state.templateId === "rule" || state.templateId === "frame" ? 104 : 88;
  const sealX = state.templateId === "bookmark" ? width - 176 : width - 132;
  ctx.fillStyle = signatureColor;
  ctx.font = `400 24px ${font.family}`;
  ctx.textAlign = "left";
  ctx.fillText(state.author || "字签", signatureX, height - 106);
  drawSeal(ctx, sealX, height - 136, sealStyle, sealColor, template.bg);
}



export { templates, fonts, sealStyles, drawArtwork };
