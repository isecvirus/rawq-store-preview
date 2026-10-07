import { createRequire } from 'node:module';
import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert/strict';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');
const axePath = require.resolve('axe-core/axe.min.js');
const root = fileURLToPath(new URL('../', import.meta.url));
const server = spawn(process.execPath, ['tools/serve.mjs'], { cwd: root });
await once(server.stdout, 'data');
let browser;
const reports = [];
try {
  browser = await chromium.launch({
    headless: true,
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1000 },
    reducedMotion: 'reduce',
  });
  async function audit(label) {
    await page.evaluate(() => document.fonts.ready);
    await page.addScriptTag({ path: axePath });
    const violations = await page.evaluate(async () => {
      const result = await axe.run(document, {
        runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] },
      });
      return result.violations.map((v) => ({
        id: v.id,
        impact: v.impact,
        nodes: v.nodes.map((n) => ({ target: n.target, summary: n.failureSummary })),
      }));
    });
    assert.deepEqual(violations, [], JSON.stringify({ label, violations }, null, 2));
    reports.push(label);
    console.log('PASS', label);
  }
  for (const route of [
    '/',
    '/shop',
    '/product/house-blend',
    '/journal',
    '/journal/first-cup',
    '/about',
    '/help',
    '/favorites',
  ]) {
    await page.goto('http://127.0.0.1:4173/#' + route);
    await audit(route);
  }
  await page.goto('http://127.0.0.1:4173/#/product/ceramic-dripper');
  await page.locator('#product-form button[type=submit]').click();
  await audit('Cart dialog');
  await page.locator('#cart-dialog a[href="#/checkout"]').click();
  await page.waitForSelector('#checkout-form');
  await audit('Checkout');
  await page.locator('#customer-name').fill('');
  await page.locator('#checkout-form button[type=submit]').click();
  await audit('Checkout field errors');
  await page.locator('#customer-name').fill('مستخدم تجريبي');
  await page.locator('#customer-phone').fill('0500000000');
  await page.locator('[name=delivery][value=pickup]').check();
  await page.locator('#consent').check();
  await page.locator('#checkout-form button[type=submit]').click();
  await page.waitForURL('**/#/order');
  await audit('Order receipt');
  await page.locator('header [data-action=search]').click();
  await audit('Search dialog');
  await page.keyboard.press('Escape');
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://127.0.0.1:4173/#/shop');
  await audit('Mobile catalog');
  await page.locator('[data-action=menu]').click();
  await audit('Mobile menu');
  console.log(
    `\n${reports.length} accessibility states passed; no detected WCAG A/AA violations in this automated scope.`,
  );
} finally {
  await browser?.close();
  server.kill();
}
