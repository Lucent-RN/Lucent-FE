#!/usr/bin/env node
// Exports the v2 store-listing images (PNG, opaque) from the running site into the repo's /assets folder.
//   1) yarn build && yarn start -p 3100          (use a production build: the dev server draws a debug badge)
//   2) node scripts/export-store-shots.mjs [baseUrl] [outRoot] [locale]
// Output:  <outRoot>/store-listing-ios-ver2.0/<app>/{iphone-6.9,ipad-13}/NN-name.png
//          <outRoot>/store-listing-android-ver2.0/<app>/{phone,tablet-10}/NN-name.png  + feature-graphic.png
// Uses a local Chrome/Chromium through the DevTools protocol; `sharp` (repo root) flattens the alpha channel.
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(path.join(here, '../../package.json'));
const sharp = require('sharp');

const [, , base = 'http://localhost:3100', outRoot = path.resolve(here, '../../assets'), locale = 'en'] = process.argv;
const CHROME =
  process.env.CHROME_PATH ||
  ['/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', '/usr/bin/google-chrome', '/usr/bin/chromium'].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error('Set CHROME_PATH to a Chrome/Chromium binary');

const SHOTS = {
  lucent: ['orbit', 'focus', 'stats', 'tasks', 'lock', 'settings'],
  meet: ['agenda', 'conflict', 'suggest', 'slots', 'report', 'assistant']
};
const DEVICES = {
  iphone: { w: 1290, h: 2796, store: 'ios', dir: 'iphone-6.9' },
  ipad: { w: 2064, h: 2752, store: 'ios', dir: 'ipad-13' },
  android: { w: 1080, h: 1920, store: 'android', dir: 'phone' },
  tablet: { w: 1600, h: 2560, store: 'android', dir: 'tablet-10' }
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(CHROME, ['--headless=new', '--disable-gpu', `--remote-debugging-port=${port}`, '--hide-scrollbars', 'about:blank'], { stdio: 'ignore' });
let ws;
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });

const capture = async (url, w, h, file) => {
  await send('Emulation.setDeviceMetricsOverride', { width: w, height: h, deviceScaleFactor: 1, mobile: false });
  await send('Page.navigate', { url });
  await sleep(2500);
  await send('Runtime.evaluate', { expression: 'document.fonts && document.fonts.ready', awaitPromise: true });
  const { data } = await send('Page.captureScreenshot', { format: 'png', clip: { x: 0, y: 0, width: w, height: h, scale: 1 } });
  fs.mkdirSync(path.dirname(file), { recursive: true });
  await sharp(Buffer.from(data, 'base64')).flatten({ background: '#ffffff' }).png({ compressionLevel: 9 }).toFile(file); // opaque: stores reject alpha
  console.log('saved', path.relative(outRoot, file));
};

try {
  let targets;
  for (let i = 0; i < 40; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      if (targets.length) break;
    } catch {}
    await sleep(250);
  }
  ws = new WebSocket(targets.find((t) => t.type === 'page').webSocketDebuggerUrl);
  await new Promise((r) => (ws.onopen = r));
  ws.onmessage = (m) => {
    const d = JSON.parse(m.data);
    if (d.id && pending.has(d.id)) {
      const p = pending.get(d.id);
      pending.delete(d.id);
      d.error ? p.rej(new Error(d.error.message)) : p.res(d.result);
    }
  };
  await send('Page.enable');
  await send('Runtime.enable');

  for (const app of Object.keys(SHOTS)) {
    for (const [device, d] of Object.entries(DEVICES)) {
      for (const [i, key] of SHOTS[app].entries()) {
        const n = String(i + 1).padStart(2, '0');
        await capture(
          `${base}/${locale}/store/${app}?shot=${i + 1}&device=${device}&full=1`,
          d.w, d.h,
          path.join(outRoot, `store-listing-${d.store}-ver2.0`, app, d.dir, `${n}-${key}.png`)
        );
      }
    }
    await capture(`${base}/${locale}/store/${app}?feature=1&full=1`, 1024, 500, path.join(outRoot, 'store-listing-android-ver2.0', app, 'feature-graphic.png'));
  }
} finally {
  chrome.kill();
  process.exit(0);
}
