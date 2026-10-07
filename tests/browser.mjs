import { spawn } from 'node:child_process';
import { once } from 'node:events';
import assert from 'node:assert/strict';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright';
const root = fileURLToPath(new URL('../', import.meta.url));
const base = 'http://127.0.0.1:4173';
const server = spawn(process.execPath, ['tools/serve.mjs'], { cwd: root });
await once(server.stdout, 'data');
const browser = await chromium.launch({
  headless: true,
  ...(process.env.BROWSER_PATH ? { executablePath: process.env.BROWSER_PATH } : {}),
  args: ['--no-sandbox'],
});
const errors = [];
const failedRequests = [];
const externalRequests = [];
const context = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
  reducedMotion: 'reduce',
});
context.on('page', (page) => {
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('requestfailed', (request) => {
    // Responsive srcset changes and route replacement can cancel an image that
    // is no longer needed. Completed image loading is checked separately.
    if (request.resourceType() === 'image' && request.failure()?.errorText === 'net::ERR_ABORTED')
      return;
    failedRequests.push({ url: request.url(), error: request.failure()?.errorText });
  });
  page.on('response', (response) => {
    if (response.status() >= 400) failedRequests.push(`${response.status()} ${response.url()}`);
  });
  page.on('request', (request) => {
    if (!request.url().startsWith(base) && !request.url().startsWith('data:'))
      externalRequests.push(request.url());
  });
});
const page = await context.newPage();
const reports = [];
const pass = (name) => {
  reports.push(name);
  console.log('PASS', name);
};
async function go(route) {
  await page.goto(`${base}/#${route}`);
  await page.waitForFunction(() => document.documentElement.dataset.appReady === 'true');
  await page.locator('main h1,main h2').first().waitFor();
  await page.evaluate(() => document.fonts.ready);
}
async function waitHash(path) {
  await page.waitForURL((url) => url.hash.startsWith('#' + path));
}
try {
  await go('/');
  assert.equal(await page.locator('[data-product-card]').count(), 4);
  await page.locator('[data-action="home-category"][data-category="cups"]').click();
  assert.equal(await page.locator('[data-product-card]').count(), 1);
  assert.equal(
    await page.locator('[data-product-card]').getAttribute('data-product-card'),
    'daily-cups',
  );
  pass('Home categories update the visible products');
  await page.locator('[data-action="favorite"]').click();
  await page.reload();
  await go('/favorites');
  assert.equal(await page.locator('[data-product-card]').count(), 1);
  await page.locator('[data-action="favorite"]').click();
  await page.getByRole('heading', { name: 'المفضلة تنتظر اختياراتك' }).waitFor();
  pass('Favorites persist across reload and can be removed');
  await go('/shop');
  await page.locator('#catalog-query').fill('إبريق');
  await page.waitForFunction(() =>
    document.querySelector('#results-count').textContent.startsWith('3'),
  );
  assert.equal(await page.locator('[data-product-card]').count(), 3);
  await page.locator('[data-action="reset-filters"]').first().click();
  assert.equal(await page.locator('[data-product-card]').count(), 6);
  await page.locator('#sort-select').selectOption('price-desc');
  assert.equal(
    await page.locator('[data-product-card]').first().getAttribute('data-product-card'),
    'morning-set',
  );
  await page.locator('[data-action="category"][data-category="cups"]').click();
  assert.equal(await page.locator('[data-product-card]').count(), 1);
  await page.locator('[data-action="reset-filters"]').first().click();
  await page.locator('#price-range').fill('50');
  await page.getByRole('heading', { name: 'ما لقينا نتيجة مطابقة.' }).waitFor();
  await page.locator('[data-action="reset-filters"]').first().click();
  pass('Search, category, price, sort and empty-result recovery');
  const searchButton = page.locator('header [data-action="search"]');
  await searchButton.click();
  assert.equal(
    await page.locator('#global-search').evaluate((el) => el === document.activeElement),
    true,
  );
  await page.locator('#global-search').fill('مطحنة');
  await page.locator('#search-results .search-result').first().waitFor();
  await page.waitForFunction(
    () => document.querySelectorAll('#search-results .search-result').length === 1,
  );
  await page.keyboard.press('Escape');
  assert.equal(await searchButton.evaluate((el) => el === document.activeElement), true);
  await searchButton.click();
  await page.locator('#global-search').fill('قهوة');
  await page.locator('#global-search').press('Enter');
  await waitHash('/shop');
  assert.ok(page.url().includes('q='));
  pass('Search dialog supports keyboard focus, Escape and results navigation');
  await go('/shop?q=' + encodeURIComponent('<img src=x onerror="window.injected=1">'));
  assert.equal(await page.evaluate(() => window.injected), undefined);
  assert.equal(await page.locator('#active-query img').count(), 0);
  pass('Search text is escaped before rendering');
  await go('/product/house-blend');
  await page.locator('[name="variant"][value="filter"]').check();
  await page.locator('#product-form button[type=submit]').click();
  await page.locator('#cart-dialog').waitFor({ state: 'visible' });
  assert.match(await page.locator('#cart-dialog').innerText(), /طحن للترشيح/);
  await page.keyboard.press('Escape');
  await go('/product/ceramic-dripper');
  await page.locator('#product-form button[type=submit]').click();
  await page.keyboard.press('Escape');
  await go('/product/daily-cups');
  await page.locator('#product-form button[type=submit]').click();
  await page.locator('#cart-dialog [data-action="cart-plus"]').last().click();
  assert.match(
    await page
      .locator('#cart-dialog .cart-count')
      .count()
      .then(() => page.locator('[data-cart-count]').textContent()),
    /4/,
  );
  await page.locator('#cart-dialog [data-action="cart-minus"]').last().click();
  await page.reload();
  await page.locator('header [data-action="cart"]').click();
  assert.equal(await page.locator('#cart-dialog .cart-item').count(), 3);
  assert.match(await page.locator('#cart-dialog .summary-total').innerText(), /276/);
  pass('Product options, cart quantity changes and cart persistence');
  await page.locator('#cart-dialog a[href="#/checkout"]').click();
  await page.waitForSelector('#checkout-form');
  assert.equal(await page.locator('#customer-name').inputValue(), 'عميل تجريبي');
  assert.equal(await page.locator('#customer-phone').inputValue(), '0500000000');
  assert.equal(await page.locator('#region').inputValue(), 'الرياض');
  assert.equal(await page.locator('#region option:not([value=""])').count(), 13);
  assert.equal(await page.locator('#district').inputValue(), 'حي تجريبي');
  assert.equal(await page.locator('#street').inputValue(), 'شارع المثال');
  assert.equal(await page.locator('#building').inputValue(), '1234');
  assert.equal(await page.locator('#coupon').inputValue(), 'RAWQ10');
  await page.locator('#consent').check();
  assert.equal(await page.locator('#checkout-form').evaluate((form) => form.checkValidity()), true);
  await page.locator('#consent').uncheck();
  pass('Checkout opens with valid editable demo values, 13 regions and a split address');
  await page.locator('#coupon').fill('WRONG');
  await page.locator('#coupon-form button[type=submit]').click();
  assert.equal(await page.locator('#coupon').getAttribute('aria-invalid'), 'true');
  await page.locator('#coupon').fill('rawq10');
  await page.locator('#coupon-form button[type=submit]').click();
  assert.match(await page.locator('#checkout-totals .summary-total').innerText(), /267.4/);
  await page.locator('[name="delivery"][value="pickup"]').check();
  assert.equal(await page.locator('#address-fields').isVisible(), false);
  assert.equal(await page.locator('#address-fields :is(input, select):disabled').count(), 4);
  assert.match(await page.locator('#checkout-totals .summary-total').innerText(), /248.4/);
  await page.locator('[name="delivery"][value="shipping"]').check();
  assert.equal(await page.locator('#address-fields :is(input, select):disabled').count(), 0);
  assert.equal(await page.locator('#building').inputValue(), '1234');
  pass('Discount applies before the free-shipping threshold; pickup recalculates totals');
  for (const id of ['customer-name', 'customer-phone', 'district', 'street', 'building'])
    await page.locator(`#${id}`).fill('');
  await page.locator('#region').selectOption('');
  await page.locator('#checkout-form button[type=submit]').click();
  assert.equal(await page.locator('#checkout-form [aria-invalid="true"]').count(), 7);
  assert.equal(
    await page.locator('#customer-name').evaluate((el) => el === document.activeElement),
    true,
  );
  await page.locator('#customer-name').fill('مستخدم تجريبي');
  await page.locator('#customer-phone').fill('٠٥٠٠٠٠٠٠٠٠');
  await page.locator('#region').selectOption('الجوف');
  await page.locator('#district').fill('حي تجريبي');
  await page.locator('#street').fill('شارع الاختبار');
  await page.locator('#building').fill('10');
  await page.locator('#consent').check();
  await page.locator('#checkout-form button[type=submit]').click();
  await waitHash('/order');
  await page.getByRole('heading', { name: 'كل شيء جاهز، على ذوقك.' }).waitFor();
  assert.match(await page.locator('.receipt .summary-total').innerText(), /267.4/);
  assert.equal(await page.locator('[data-cart-count]').textContent(), '0');
  const storage = await page.evaluate(() => JSON.stringify({ ...localStorage, ...sessionStorage }));
  assert.equal(storage.includes('مستخدم تجريبي'), false);
  assert.equal(storage.includes('الاختبار'), false);
  pass('Checkout validation, Arabic phone digits and receipt without retaining personal fields');
  await page.reload();
  await page.getByRole('heading', { name: 'كل شيء جاهز، على ذوقك.' }).waitFor();
  pass('Receipt survives reload without recipient details');
  await page.goBack();
  await page.getByRole('heading', { name: 'سلتك فارغة حاليًا.' }).waitFor();
  pass('Back after ordering cannot repeat a purchase from the emptied cart');
  await go('/journal');
  await page.locator('#coffee-dose').fill('20');
  assert.match(await page.locator('#water-result').innerText(), /320/);
  await page.locator('#brew-ratio').selectOption('15');
  assert.match(await page.locator('#water-result').innerText(), /300/);
  await page.locator('#coffee-dose').fill('-2');
  assert.equal(await page.locator('#coffee-dose').getAttribute('aria-invalid'), 'true');
  await go('/journal/first-cup');
  await page.locator('[data-action="timer-toggle"]').click();
  await page.waitForFunction(() => document.querySelector('#timer-time').textContent !== '00:00');
  await page.locator('[data-action="timer-toggle"]').click();
  await page.locator('[data-action="timer-reset"]').click();
  assert.equal(await page.locator('#timer-time').textContent(), '00:00');
  pass('Brewing calculator, timer start/pause and reset');
  await go('/not-a-page');
  await page.getByRole('heading', { name: 'هذه الصفحة غير موجودة.' }).waitFor();
  await page.getByRole('link', { name: 'تصفّح المنتجات', exact: false }).click();
  await waitHash('/shop');
  pass('Unknown routes have a useful recovery link');
  // Check every product and content route at four meaningful screen sizes.
  const routes = [
    '/',
    '/shop',
    '/product/house-blend',
    '/product/morning-set',
    '/journal',
    '/journal/first-cup',
    '/about',
    '/help',
    '/favorites',
  ];
  for (const width of [320, 390, 768, 1440]) {
    await page.setViewportSize({ width, height: 900 });
    for (const route of routes) {
      await go(route);
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth > innerWidth + 1,
      );
      assert.equal(overflow, false, `${width}: ${route}`);
    }
  }
  pass('No horizontal overflow across 36 route and viewport combinations');
  await page.setViewportSize({ width: 390, height: 844 });
  await go('/');
  await page.locator('[data-action="menu"]').click();
  await page.locator('#menu-dialog a[href="#/shop"]').click();
  await page.locator('[data-action="filter-toggle"]').click();
  assert.equal(await page.locator('#shop-filters').isVisible(), true);
  await page.locator('[data-action="category"][data-category="tools"]').click();
  assert.equal(await page.locator('[data-product-card]').count(), 3);
  await page.locator('[data-action="quick-add"][data-id="ceramic-dripper"]').click();
  await page.locator('header [data-action="cart"]').click();
  assert.equal(
    await page
      .locator('#cart-dialog')
      .evaluate((el) => el.getBoundingClientRect().width <= innerWidth),
    true,
  );
  await page.locator('#cart-dialog [data-action="cart-remove"]').click();
  await page.getByRole('heading', { name: 'ركنك ينتظر أول قطعة.' }).waitFor();
  pass('Mobile menu, filters, product action and empty-cart recovery');
  await page.keyboard.press('Escape');
  await go('/');
  const anchors = await page
    .locator('a[href^="#/"]')
    .evaluateAll((els) => [...new Set(els.map((el) => el.getAttribute('href')))]);
  for (const route of anchors) {
    await go(route.slice(1));
    assert.equal(
      await page.getByRole('heading', { name: 'هذه الصفحة غير موجودة.' }).count(),
      0,
      route,
    );
  }
  pass('Homepage links resolve to actual content');
  assert.deepEqual(errors, []);
  assert.deepEqual(failedRequests, []);
  assert.deepEqual(externalRequests, []);
  pass('No page errors, failed asset responses or third-party network requests');
  console.log(`\n${reports.length} browser scenarios passed.`);
} finally {
  await context.close();
  await browser.close();
  server.kill();
}
