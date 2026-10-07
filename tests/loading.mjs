import { spawn } from 'node:child_process';
import { once } from 'node:events';
import { fileURLToPath, pathToFileURL } from 'node:url';
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { waitForRoute, waitForAssets } from '../tools/capture-ready.mjs';
import { STORAGE_KEY } from '../src/core.js';

const root = fileURLToPath(new URL('../', import.meta.url));
const port = process.env.PORT || '4175';
const base = `http://127.0.0.1:${port}/`;
const server = spawn(process.execPath, ['tools/serve.mjs'], {
  cwd: root,
  env: { ...process.env, PORT: port },
});
await once(server.stdout, 'data');
let browser;
let passed = 0;
const pass = (name) => {
  passed++;
  console.log('PASS', name);
};
try {
  browser = await chromium.launch({
    ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
    args: ['--no-sandbox'],
  });
  for (const width of [390, 1440]) {
    for (const route of ['/', '/shop', '/product/house-blend']) {
      const page = await browser.newPage({ viewport: { width, height: 950 } });
      let release;
      const pendingScript = new Promise((resolve) => {
        release = resolve;
      });
      await page.route('**/assets/store.js', async (request) => {
        await pendingScript;
        await request.continue();
      });
      try {
        await page.goto(base + '#' + route, { waitUntil: 'commit' });
        await page.locator('main h1').waitFor();
        await page.waitForFunction(() => {
          const img = document.querySelector('main img');
          return (
            img.complete &&
            img.naturalWidth > 0 &&
            img.currentSrc &&
            !img.currentSrc.startsWith('data:')
          );
        });
        const before = await page.evaluate(async () => {
          await document.fonts.ready;
          window.initialImage = document.querySelector('main img');
          await window.initialImage.decode();
          return {
            height: document.querySelector('#main').getBoundingClientRect().height,
            footerTop: document.querySelector('footer').getBoundingClientRect().top,
            viewport: innerHeight,
            ready: document.documentElement.dataset.appReady,
          };
        });
        assert.equal(before.ready, undefined, 'The app bundle must still be delayed');
        assert.ok(
          before.footerTop >= before.viewport - 1,
          'Footer must stay below the first viewport',
        );
        assert.equal(await page.locator('.loading-state, .page-placeholder').count(), 0);
        release();
        await waitForRoute(page, route);
        const after = await page.evaluate(() => ({
          sameImage: window.initialImage === document.querySelector('main img'),
          height: document.querySelector('#main').getBoundingClientRect().height,
          text: document.body.innerText,
        }));
        assert.ok(after.sameImage, 'Activation must preserve the initial image node');
        assert.ok(
          Math.abs(before.height - after.height) < 1,
          'Activation must preserve the page height',
        );
        assert.ok(!/[٠-٩]/.test(after.text), 'Displayed numbers must use 0–9');
        assert.match(await page.locator('.footer-bottom').innerText(), /مشروع تجريبي لمعرض أعمال/);
        assert.doesNotMatch(await page.locator('.footer-bottom').innerText(), /لا تُنفَّذ/);
        pass(`Delayed app: ${route} at ${width}px preserves content, images and layout`);
      } finally {
        release();
        await page.close();
      }
    }
  }
  const checkout = await browser.newPage({ viewport: { width: 1440, height: 950 } });
  let releaseCheckout;
  const pendingCheckout = new Promise((resolve) => {
    releaseCheckout = resolve;
  });
  await checkout.route('**/assets/store.js', async (request) => {
    await pendingCheckout;
    await request.continue();
  });
  await checkout.addInitScript(
    ({ key }) =>
      localStorage.setItem(
        key,
        JSON.stringify({
          cart: [{ id: 'house-blend', variant: 'beans', quantity: 2 }],
          favorites: [],
          coupon: '',
        }),
      ),
    { key: STORAGE_KEY },
  );
  try {
    await checkout.goto(base + '#/checkout', { waitUntil: 'commit' });
    await checkout.locator('.page-placeholder').waitFor();
    assert.ok(
      await checkout.evaluate(
        () => document.querySelector('footer').getBoundingClientRect().top >= innerHeight - 1,
      ),
    );
    releaseCheckout();
    await waitForRoute(checkout, '/checkout');
    await checkout.locator('#checkout-form').waitFor();
    assert.ok(
      await checkout.evaluate(
        () => document.querySelector('footer').getBoundingClientRect().top >= innerHeight - 1,
      ),
    );
    assert.equal(await checkout.locator('.page-placeholder').count(), 0);
    pass('Delayed checkout reserves space and restores the saved cart');
  } finally {
    releaseCheckout();
    await checkout.close();
  }

  const slowImages = await browser.newPage();
  let releaseImage;
  const pendingImage = new Promise((resolve) => {
    releaseImage = resolve;
  });
  await slowImages.route('**/assets/images/coffee.webp', async (request) => {
    await pendingImage;
    await request.continue();
  });
  try {
    await slowImages.goto(base + '#/product/house-blend', { waitUntil: 'domcontentloaded' });
    await waitForRoute(slowImages, '/product/house-blend');
    let ready = false;
    const captureReady = waitForAssets(slowImages).then((images) => {
      ready = true;
      return images;
    });
    await slowImages.waitForTimeout(150);
    assert.equal(ready, false, 'Capture must wait while a product image is missing');
    releaseImage();
    const images = await captureReady;
    assert.ok(images.every((image) => image.width > 0 && image.height > 0));
    assert.ok(images.some((image) => image.source === 'coffee.webp'));
    pass('Capture waits for delayed product images and verifies decoded dimensions');
  } finally {
    releaseImage();
    await slowImages.close();
  }

  // Hold image responses and compare the layout before and after decoding.
  for (const width of [390, 1440]) {
    for (const route of [
      '/',
      '/shop',
      '/product/house-blend',
      '/journal',
      '/journal/first-cup',
      '/about',
    ]) {
      const page = await browser.newPage({ viewport: { width, height: 844 } });
      let release;
      const pending = new Promise((resolve) => {
        release = resolve;
      });
      await page.route('**/assets/images/**', async (request) => {
        await pending;
        await request.continue();
      });
      try {
        await page.goto(base + '#' + route, { waitUntil: 'domcontentloaded' });
        await waitForRoute(page, route);
        await page.evaluate(() => document.fonts.ready);
        async function geometry() {
          return page.evaluate(() => {
            const box = (node) => {
              const { x, y, width, height } = node.getBoundingClientRect();
              return [x + scrollX, y + scrollY, width, height];
            };
            return {
              boxes: [
                ...document.images,
                document.querySelector('main'),
                document.querySelector('footer'),
              ].map(box),
              lazy: [...document.images].every((img) => img.loading === 'lazy'),
              loaded: [...document.images].some(
                (img) =>
                  img.naturalWidth > 0 && img.currentSrc && !img.currentSrc.startsWith('data:'),
              ),
            };
          });
        }
        const before = await geometry();
        assert.ok(before.lazy, 'All store images must use native lazy loading');
        assert.equal(before.loaded, false, 'The comparison must start before image bytes arrive');
        assert.ok(
          before.boxes.every((box) => box[2] > 0 && box[3] > 0),
          'Every image must reserve nonzero dimensions',
        );
        release();
        await waitForAssets(page);
        const after = await geometry();
        for (let index = 0; index < before.boxes.length; index++) {
          assert.ok(
            before.boxes[index].every(
              (value, axis) => Math.abs(value - after.boxes[index][axis]) < 0.5,
            ),
            `${route} at ${width}px changed box ${index}: ${before.boxes[index]} -> ${after.boxes[index]}`,
          );
        }
        pass(`Reserved image geometry: ${route} at ${width}px has no image-induced movement`);
      } finally {
        release();
        await page.close();
      }
    }
  }

  const lazy = await browser.newPage({ viewport: { width: 390, height: 844 } });
  const imageRequests = [];
  lazy.on('request', (request) => {
    if (request.resourceType() === 'image') imageRequests.push(request.url());
  });
  await lazy.goto(base + '#/');
  await waitForRoute(lazy, '/');
  await lazy.evaluate(async () => {
    await document.fonts.ready;
    await new Promise(requestAnimationFrame);
  });
  assert.ok(
    !imageRequests.some((url) => url.includes('grind-guide')),
    'An image far below the fold must not load immediately',
  );
  await lazy.locator('img[data-src="assets/images/grind-guide.webp"]').scrollIntoViewIfNeeded();
  await lazy.waitForFunction(() => {
    const img = document.querySelector('img[data-src="assets/images/grind-guide.webp"]');
    return img.complete && img.naturalWidth > 0 && !img.currentSrc.startsWith('data:');
  });
  assert.ok(imageRequests.some((url) => url.includes('grind-guide')));
  await lazy.close();
  pass('Below-the-fold images load when scrolling toward them');

  const pages = await browser.newPage();
  const prefix = base + 'rawq-store/';
  const prefixErrors = [];
  pages.on('request', (request) => {
    if (!request.url().startsWith(prefix)) prefixErrors.push(request.url());
  });
  pages.on('response', (response) => {
    if (response.status() >= 400) prefixErrors.push(response.url());
  });
  pages.on('pageerror', (error) => prefixErrors.push(error.message));
  await pages.route(prefix + '**', (request) =>
    request.continue({ url: request.request().url().replace(prefix, base) }),
  );
  await pages.goto(prefix + '#/product/house-blend');
  await waitForRoute(pages, '/product/house-blend');
  await waitForAssets(pages);
  await pages.locator('#product-form button[type=submit]').click();
  await pages.locator('#cart-dialog[open]').waitFor();
  assert.deepEqual(prefixErrors, []);
  await pages.close();
  pass('Repository subpath loads all relative assets and supports cart interaction');

  const local = await browser.newPage();
  const localErrors = [];
  local.on('pageerror', (error) => localErrors.push(error.message));
  local.on('requestfailed', (request) => localErrors.push(request.url()));
  await local.goto(pathToFileURL(root + 'index.html').href + '#/product/house-blend');
  await waitForRoute(local, '/product/house-blend');
  await waitForAssets(local);
  await local.locator('#product-form button[type=submit]').click();
  await local.locator('#cart-dialog[open]').waitFor();
  assert.deepEqual(localErrors, []);
  await local.close();
  pass('Direct file opening loads images and fonts and supports the cart');
  console.log(`\n${passed} loading and capture checks passed.`);
} finally {
  await browser?.close();
  server.kill();
}
