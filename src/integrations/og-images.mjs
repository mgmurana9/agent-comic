// Build-time social share images: one 1200×630 PNG per published strip, at
// /og/<slug>.png. The handoff allows a flat PNG per comic for OG only (§3, the art).
// Runs after the build, in Node, so the Worker never touches an image library.
// Why build-time and not committed: the daily run doesn't have to draw it, and
// the merge gate's allowed paths stay as they are.
import { readdir, readFile, mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import path from 'node:path';
import sharp from 'sharp';

const W = 1200;
const H = 630;
const BAND = 196;
const INK = '#000000';
const FONT = fileURLToPath(new URL('../assets/fonts/archivo-latin-standard-normal.woff2', import.meta.url));

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

async function text(markup, size, maxWidth) {
  const { data, info } = await sharp({
    text: { text: markup, font: `Archivo ${size}`, fontfile: FONT, rgba: true, dpi: 72, width: maxWidth, wrap: 'word' },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  return { data, width: info.width, height: info.height };
}

// Panels are drawn with the top ~35% left for HTML lettering and a floor at the
// bottom, so the share image crops to the band where the characters stand.
const CROP = { top: 110, height: 440 };

async function panel(file, width) {
  const scale = width / 800;
  const top = Math.round(CROP.top * scale);
  const height = Math.round(CROP.height * scale);
  return sharp(file, { density: 72 * scale * 2 })
    .resize({ width })
    .extract({ left: 0, top, width, height })
    .png()
    .toBuffer();
}

function frame(slots) {
  const borders = slots
    .map((s) => `<rect x="${s.x - 2}" y="${s.y - 2}" width="${s.w + 4}" height="${s.h + 4}" fill="#fff" stroke="${INK}" stroke-width="4"/>`)
    .join('');
  return Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
  <defs>
    <pattern id="dots" width="16" height="16" patternUnits="userSpaceOnUse"><circle cx="8" cy="8" r="4.4" fill="#00a3e0"/></pattern>
    <radialGradient id="fade" cx="1" cy="0" r="0.75" gradientTransform="scale(0.6 1)" gradientUnits="objectBoundingBox">
      <stop offset="0.1" stop-color="#fff"/><stop offset="1" stop-color="#000"/>
    </radialGradient>
    <mask id="m"><rect width="${W}" height="${BAND}" fill="url(#fade)"/></mask>
  </defs>
  <rect width="${W}" height="${H}" fill="#fff"/>
  <rect width="${W}" height="${BAND}" fill="#ffd500"/>
  <rect x="${W * 0.45}" width="${W * 0.55}" height="${BAND}" fill="url(#dots)" mask="url(#m)" opacity="0.9"/>
  <rect y="${BAND}" width="${W}" height="5" fill="${INK}"/>
  ${borders}
  <rect y="${H - 10}" width="${W}" height="10" fill="#e5007d"/>
</svg>`);
}

export async function renderOg(comic, publicDir) {
  const files = comic.panels.slice(0, 2).map((p) => path.join(publicDir, p.art));
  const gap = 28;
  const pw = files.length === 1 ? 760 : Math.floor((W - 2 * 48 - gap) / 2);
  const ph = Math.round(pw * (CROP.height / 800));
  const y = BAND + 5 + Math.round((H - 10 - BAND - 5 - ph) / 2);
  const total = files.length * pw + (files.length - 1) * gap;
  const x0 = Math.round((W - total) / 2);
  const slots = files.map((_, i) => ({ x: x0 + i * (pw + gap), y, w: pw, h: ph }));

  const n = /^(\d+)-/.exec(comic.slug)?.[1];
  const date = new Date(comic.date).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric', timeZone: 'UTC' });
  const kicker = await text(`<span font_weight="800">STOP SEQUENCE</span><span font_weight="500">   Strip ${Number(n)}, ${esc(date)}</span>`, 26, W - 96);
  const title = await text(`<span font_weight="900" letter_spacing="-1024">${esc(comic.title)}</span>`, 84, W - 96);

  const layers = [
    { input: kicker.data, left: 48, top: 34 },
    { input: title.data, left: 46, top: Math.min(78, BAND - 24 - title.height) },
    ...(await Promise.all(files.map(async (f, i) => ({ input: await panel(f, pw), left: slots[i].x, top: slots[i].y })))),
  ];
  return sharp(frame(slots)).composite(layers).png({ compressionLevel: 9, palette: true, quality: 90 }).toBuffer();
}

export default function ogImages() {
  return {
    name: 'stop-sequence-og-images',
    hooks: {
      'astro:build:done': async ({ dir, logger }) => {
        const root = fileURLToPath(new URL('../../', import.meta.url));
        const comicsDir = path.join(root, 'src/content/comics');
        const publicDir = path.join(root, 'public');
        const out = path.join(fileURLToPath(dir), 'og');
        await mkdir(out, { recursive: true });
        const now = new Date();
        let made = 0;
        for (const f of (await readdir(comicsDir)).filter((f) => f.endsWith('.json'))) {
          const comic = { slug: f.replace(/\.json$/, ''), ...JSON.parse(await readFile(path.join(comicsDir, f), 'utf8')) };
          // Same date gate as getPublished(): a future strip's image doesn't exist yet.
          if (new Date(comic.date) > now) continue;
          const png = await renderOg(comic, publicDir);
          await sharp(png).toFile(path.join(out, `${comic.slug}.png`));
          made++;
        }
        logger.info(`${made} share images in /og/`);
      },
    },
  };
}
