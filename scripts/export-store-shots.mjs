#!/usr/bin/env node
// Exports the store-listing screenshots (1290×2796, App Store 6.9") from the running site.
//   1) run the site:  yarn workspace next-shadcn-dashboard-starter dev   (or: next start)
//   2) node scripts/export-store-shots.mjs [baseUrl] [outDir] [locale]
// Uses a local Chrome/Chromium through the DevTools protocol (no extra dependencies).
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

const [, , base = 'http://localhost:3000', out = 'store-shots', locale = 'en'] =
  process.argv;
const CHROME =
  process.env.CHROME_PATH ||
  [
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome',
    '/usr/bin/chromium'
  ].find((p) => fs.existsSync(p));
if (!CHROME) throw new Error('Set CHROME_PATH to a Chrome/Chromium binary');

const W = 1290;
const H = 2796;
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const port = 9400 + Math.floor(Math.random() * 400);
const chrome = spawn(
  CHROME,
  [
    '--headless=new',
    '--disable-gpu',
    `--remote-debugging-port=${port}`,
    `--window-size=${W},${H}`,
    '--hide-scrollbars',
    'about:blank'
  ],
  { stdio: 'ignore' }
);

let ws;
let id = 0;
const pending = new Map();
const send = (method, params = {}) =>
  new Promise((res, rej) => {
    const i = ++id;
    pending.set(i, { res, rej });
    ws.send(JSON.stringify({ id: i, method, params }));
  });

try {
  let targets;
  for (let i = 0; i < 40; i++) {
    try {
      targets = await (await fetch(`http://127.0.0.1:${port}/json`)).json();
      if (targets.length) break;
    } catch {}
    await sleep(250);
  }
  ws = new WebSocket(
    targets.find((t) => t.type === 'page').webSocketDebuggerUrl
  );
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
  await send('Emulation.setDeviceMetricsOverride', {
    width: W,
    height: H,
    deviceScaleFactor: 1,
    mobile: false
  });
  fs.mkdirSync(out, { recursive: true });

  for (const product of ['lucent', 'meet']) {
    for (const shot of [1, 2, 3]) {
      await send('Page.navigate', {
        url: `${base}/${locale}/store/${product}?shot=${shot}&full=1`
      });
      await sleep(2500);
      const { data } = await send('Page.captureScreenshot', {
        format: 'png',
        clip: { x: 0, y: 0, width: W, height: H, scale: 1 }
      });
      const file = path.join(out, `${product}-${locale}-${shot}.png`);
      fs.writeFileSync(file, Buffer.from(data, 'base64'));
      console.log('saved', file);
    }
  }
} finally {
  chrome.kill();
  process.exit(0);
}
