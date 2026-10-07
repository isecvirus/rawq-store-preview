import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { mkdir, writeFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
import { waitForRoute, waitForAssets } from './capture-ready.mjs';

const root = fileURLToPath(new URL('../', import.meta.url));
const output = new URL('../screenshots/', import.meta.url);
const port = process.env.PORT || '4174';
const base = `http://127.0.0.1:${port}/#`;
const server = spawn(process.execPath, ['tools/serve.mjs'], {
  cwd: root,
  env: { ...process.env, PORT: port },
});
await once(server.stdout, 'data');
let browser;
const report = [];
try {
  await mkdir(output, { recursive: true });
  browser = await chromium.launch({
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
    args: ['--no-sandbox'],
  });
  const page = await browser.newPage({
    viewport: { width: 1440, height: 1050 },
    deviceScaleFactor: 1,
    reducedMotion: 'reduce',
  });
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) =>
    errors.push(`${request.url()}: ${request.failure()?.errorText}`),
  );
  page.on('response', (response) => {
    if (response.status() >= 400) errors.push(`${response.status()} ${response.url()}`);
  });
  async function load(route) {
    await page.goto(base + route);
    await waitForRoute(page, route);
  }
  async function shot(name, fullPage = false) {
    await page.waitForFunction(
      () => !document.querySelector('#toast').classList.contains('visible'),
    );
    // Clear capture-only focus/hover states without changing keyboard accessibility.
    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await page.mouse.move(1, 1);
    const images = await waitForAssets(page);
    if (errors.length) throw new Error(errors.join('\n'));
    await page.screenshot({
      path: fileURLToPath(new URL(`${name}.png`, output)),
      fullPage,
      animations: 'disabled',
    });
    report.push({ file: `${name}.png`, viewport: page.viewportSize(), fullPage, images });
    console.log(`CAPTURED ${name}: ${images.length} images loaded and decoded`);
  }
  await load('/');
  await shot('00-preview');
  await shot('01-home-desktop', true);
  await load('/shop');
  await shot('02-catalog-desktop', true);
  await load('/product/house-blend');
  await shot('03-product-desktop');
  await page.locator('[name=variant][value=filter]').check();
  await page.locator('#product-form button[type=submit]').click();
  await page.keyboard.press('Escape');
  await load('/product/ceramic-dripper');
  await page.locator('#product-form button[type=submit]').click();
  await page.keyboard.press('Escape');
  await load('/product/daily-cups');
  await page.locator('#product-form button[type=submit]').click();
  await shot('04-cart-desktop');
  await page.locator('#cart-dialog a[href="#/checkout"]').click();
  await waitForRoute(page, '/checkout');
  await page.locator('#coupon').fill('RAWQ10');
  await page.locator('#coupon-form button[type=submit]').click();
  await shot('05-checkout-desktop', true);
  await page.setViewportSize({ width: 390, height: 844 });
  await shot('12-mobile-checkout', true);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await page.locator('#consent').check();
  await page.locator('#checkout-form button[type=submit]').click();
  await waitForRoute(page, '/order');
  await shot('08-confirmation', true);
  await page.setViewportSize({ width: 390, height: 844 });
  await load('/');
  await shot('06-mobile-home');
  await shot('09-mobile-home-full', true);
  await load('/product/ceramic-dripper');
  await shot('07-mobile-product', true);
  await load('/journal');
  await shot('10-mobile-guide', true);
  await page.setViewportSize({ width: 1440, height: 1050 });
  await load('/journal');
  await shot('11-guide-desktop', true);
  await mkdir(new URL('../test-results/', import.meta.url), { recursive: true });
  await writeFile(
    new URL('../test-results/capture-report.json', import.meta.url),
    JSON.stringify({ version: '1.1.0', captures: report }, null, 2) + '\n',
  );
  console.log(`\n${report.length} screenshots saved to screenshots/.`);
} finally {
  await browser?.close();
  server.kill();
}
