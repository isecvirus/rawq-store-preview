import { products, articles, productById, variantById, categories } from './catalog.js';
import { startImages, imagePlaceholder } from './images.js';
import {
  STORAGE_KEY,
  MAX_QUANTITY,
  readState,
  saveState,
  sanitizeState,
  addToCart,
  updateQuantity,
  totals,
  cartLines,
  filterProducts,
  validateCheckout,
  escapeHTML as esc,
  itemKey,
  ORDER_KEY,
  saveReceipt,
  readReceipt,
} from './core.js';
import {
  icon,
  number,
  money,
  image,
  productCard,
  noProducts,
  homeView,
  shopView,
  productView,
  cartView,
  checkoutView,
  checkoutSummary,
  summaryRows,
  confirmationView,
  journalView,
  articleView,
  aboutView,
  helpView,
  notFound,
  quantityControl,
} from './views.js';

const main = document.querySelector('#main');
const dialogs = [...document.querySelectorAll('dialog')];
const cartDialog = document.querySelector('#cart-dialog');
const searchDialog = document.querySelector('#search-dialog');
const menuDialog = document.querySelector('#menu-dialog');
// Storage can be unavailable in private or restricted browser contexts.
let storage;
try {
  storage = window.localStorage;
} catch {
  storage = null;
}
let state = readState(storage);
let session;
try {
  session = window.sessionStorage;
} catch {
  session = null;
}
let lastOrder = readReceipt(session);
let productQuantity = 1;
let currentPath = '/';
let toastTimeout;
let storageWarningShown = false;
let submitting = false;
let searchTimer;
let catalogTimer;
let resetArmed = false;
let timer = { accumulated: 0, startedAt: null, interval: null };

function toast(message) {
  const node = document.querySelector('#toast');
  clearTimeout(toastTimeout);
  node.textContent = message;
  node.classList.add('visible');
  toastTimeout = setTimeout(() => node.classList.remove('visible'), 3400);
}
function persist() {
  const saved = saveState(storage, state);
  if (!saved && !storageWarningShown) {
    storageWarningShown = true;
    toast('تعذّر حفظ الاختيارات في المتصفح. يمكنك متابعة التجربة في هذه الصفحة.');
  }
  updateHeader();
}
function updateHeader() {
  const summary = totals(state.cart, state.coupon);
  document.querySelector('[data-cart-count]').textContent = number(summary.count);
  document
    .querySelector('[data-action="cart"]')
    .setAttribute('aria-label', `سلة التسوق، ${number(summary.count)} قطع`);
  const favoriteCount = document.querySelector('[data-favorite-count]');
  favoriteCount.textContent = number(state.favorites.length);
  favoriteCount.hidden = state.favorites.length === 0;
}
function closeDialogs() {
  dialogs.forEach((dialog) => {
    if (dialog.open) dialog.close();
  });
}
function openDialog(dialog) {
  closeDialogs();
  dialog.showModal();
}
function openCart() {
  cartDialog.innerHTML = cartView(state);
  openDialog(cartDialog);
}
function repaintCart(action, key) {
  cartDialog.innerHTML = cartView(state);
  const target = [...cartDialog.querySelectorAll('[data-action]')].find(
    (button) => button.dataset.action === action && button.dataset.key === key && !button.disabled,
  );
  (target || cartDialog.querySelector('[data-action="close-dialog"]'))?.focus({
    preventScroll: true,
  });
}
function routeParts() {
  const raw = location.hash.startsWith('#/') ? location.hash.slice(1) : '/';
  const split = raw.indexOf('?');
  const path = (split === -1 ? raw : raw.slice(0, split)).replace(/\/$/, '') || '/';
  return { path, params: new URLSearchParams(split === -1 ? '' : raw.slice(split + 1)) };
}
function setShopParam(name, value) {
  const { params } = routeParts();
  if (value === '' || value === 'all' || value === 'featured') params.delete(name);
  else params.set(name, value);
  const hash = `#/shop${params.size ? `?${params}` : ''}`;
  // Updating filters should preserve scroll and the focused control.
  history.replaceState(null, '', hash);
  refreshShop();
}
function refreshShop() {
  const { params } = routeParts();
  const category = categories.some((c) => c.id === params.get('category'))
    ? params.get('category')
    : 'all';
  const query = (params.get('q') || '').slice(0, 120);
  const rawMax = Number(params.get('max') || 400);
  const maxPrice = Number.isFinite(rawMax) ? Math.min(400, Math.max(50, rawMax)) : 400;
  const found = filterProducts({
    category,
    query,
    sort: params.get('sort') || 'featured',
    maxPrice: maxPrice * 100,
  });
  document.querySelector('#shop-grid').innerHTML = found.length
    ? found.map((p) => productCard(p, state)).join('')
    : noProducts();
  document.querySelector('#results-count').textContent = `${number(found.length)} منتجات`;
  document.querySelector('#active-query').innerHTML = query
    ? `<div class="active-query">نتائج البحث عن «${esc(query)}»<button class="icon-button" data-action="clear-query" aria-label="مسح البحث">${icon('x')}</button></div>`
    : '';
  const queryInput = document.querySelector('#catalog-query');
  if (queryInput !== document.activeElement) queryInput.value = query;
  document.querySelectorAll('[data-action="category"]').forEach((button) => {
    const selected = button.dataset.category === category;
    button.classList.toggle('active', selected);
    button.setAttribute('aria-pressed', String(selected));
  });
  document.querySelector('#price-range').value = maxPrice;
  document.querySelector('#price-range').setAttribute('aria-valuetext', `${number(maxPrice)} ريال`);
  document.querySelector('#range-output').textContent = `${number(maxPrice)} ر.س`;
  const sort = ['price-asc', 'price-desc', 'name'].includes(params.get('sort'))
    ? params.get('sort')
    : 'featured';
  document.querySelector('#sort-select').value = sort;
}
function resetShopFilters() {
  clearTimeout(catalogTimer);
  history.replaceState(null, '', '#/shop');
  refreshShop();
}
function stopTimer() {
  if (timer.startedAt !== null) timer.accumulated += performance.now() - timer.startedAt;
  timer.startedAt = null;
  clearInterval(timer.interval);
  timer.interval = null;
}
function renderRoute({ focus = true, scroll = true } = {}) {
  clearTimeout(catalogTimer);
  clearTimeout(searchTimer);
  clearTimeout(toastTimeout);
  document.querySelector('#toast').classList.remove('visible');
  document.querySelector('#toast').textContent = '';
  const { path, params } = routeParts();
  if (path !== currentPath) {
    stopTimer();
    timer.accumulated = 0;
  }
  currentPath = path;
  closeDialogs();
  productQuantity = 1;
  submitting = false;
  resetArmed = false;
  let html;
  let title = 'خذ وقتك، واضبط قهوتك';
  let nav = '';
  if (path === '/') {
    html = homeView(state);
    nav = 'home';
  } else if (path === '/shop') {
    html = shopView(state, params);
    title = 'المتجر';
    nav = params.get('category') === 'tools' ? 'tools' : 'shop';
  } else if (path.startsWith('/product/')) {
    const product = productById(path.slice('/product/'.length));
    html = productView(product, state);
    title = product?.name || 'صفحة غير موجودة';
    nav = 'shop';
  } else if (path === '/favorites') {
    html = shopView(state, params, true);
    title = 'المفضلة';
  } else if (path === '/checkout') {
    html = checkoutView(state);
    title = 'إتمام الطلب';
  } else if (path === '/order') {
    html = confirmationView(lastOrder);
    title = 'ملخص الطلب التجريبي';
  } else if (path === '/journal') {
    html = journalView();
    title = 'دليل القهوة';
    nav = 'journal';
  } else if (path.startsWith('/journal/')) {
    const article = articles.find((a) => a.id === path.slice('/journal/'.length));
    html = articleView(article);
    title = article?.title || 'صفحة غير موجودة';
    nav = 'journal';
  } else if (path === '/about') {
    html = aboutView();
    title = 'حكاية رَوْق';
    nav = 'about';
  } else if (path === '/help') {
    html = helpView(params.get('topic'));
    title = 'المساعدة';
  } else {
    html = notFound();
    title = 'صفحة غير موجودة';
  }
  // Keep a matching prerendered page in place, including images already loading.
  const nextPage = document.createElement('template');
  nextPage.innerHTML = html;
  const currentPage = main.cloneNode(true);
  currentPage.querySelectorAll('img[data-src]').forEach((img) => {
    img.setAttribute('src', imagePlaceholder);
    img.removeAttribute('srcset');
  });
  if (currentPage.innerHTML !== nextPage.innerHTML) main.replaceChildren(nextPage.content);
  main.setAttribute('aria-busy', 'false');
  main.dataset.route = path;
  main.dataset.query = params.toString();
  document.title = `رَوْق | ${title}`;
  document.querySelectorAll('[data-nav]').forEach((link) => {
    if (link.dataset.nav === nav) link.setAttribute('aria-current', 'page');
    else link.removeAttribute('aria-current');
  });
  updateHeader();
  if (scroll) window.scrollTo({ top: 0, behavior: 'instant' });
  if (focus) main.focus({ preventScroll: true });
}
function addProduct(id, variant, quantity = 1) {
  const result = addToCart(state.cart, id, variant, quantity);
  state.cart = result.cart;
  if (!result.added) {
    toast('وصلت للكمية المتاحة من هذا المنتج.');
    return false;
  }
  persist();
  return true;
}
function updateFavoriteButtons(id) {
  const product = productById(id);
  const saved = state.favorites.includes(id);
  document.querySelectorAll('[data-action="favorite"]').forEach((button) => {
    if (button.dataset.id !== id) return;
    button.setAttribute('aria-pressed', String(saved));
    button.setAttribute(
      'aria-label',
      `${saved ? 'إزالة' : 'حفظ'} ${product.name} ${saved ? 'من' : 'في'} المفضلة`,
    );
  });
}
function searchResults(query = '') {
  const found = filterProducts({ query }).slice(0, 6);
  return `<p class="search-results-label" role="status">${query ? `${number(found.length)} نتائج البحث` : 'من اختيارات رَوْق'}</p>${found.length ? found.map((product) => `<a class="search-result" href="#/product/${product.id}">${image(product.image, product.name, { sizes: '65px' })}<div><strong>${product.name}</strong><p>${product.subtitle}</p></div>${money(product.price)}</a>`).join('') : '<div class="empty-state"><h2>ما لقينا نتيجة مطابقة.</h2><p>جرّب «قهوة»، «إبريق»، أو «كوب».</p></div>'}`;
}
function openSearch() {
  searchDialog.innerHTML = `<div class="search-top"><h2 id="search-title">وش يحتاج ركنك؟</h2><button class="icon-button" data-action="close-dialog" aria-label="أغلق البحث">${icon('x')}</button></div><form id="search-form"><div class="search-field">${icon('search')}<label for="global-search" class="sr-only">ابحث باسم المنتج أو وصفه</label><input id="global-search" name="q" type="search" placeholder="قهوة، إبريق، أو كوبك القادم…" autocomplete="off" maxlength="120" autofocus><button type="submit" class="icon-button" aria-label="عرض جميع نتائج البحث">${icon('arrow-left')}</button></div></form><div id="search-results">${searchResults()}</div>`;
  openDialog(searchDialog);
  searchDialog.querySelector('input').focus();
}
function openMenu() {
  menuDialog.innerHTML = `<div class="drawer-head"><a class="brand" href="#/"><span class="brand-ar">رَوْق.</span></a><button class="icon-button" data-action="close-dialog" aria-label="أغلق القائمة">${icon('x')}</button></div><nav class="menu-links" aria-label="التنقل عبر الجوال"><a href="#/">الرئيسية</a><a href="#/shop">تسوّق المجموعة</a><a href="#/shop?category=tools">أدوات التحضير</a><a href="#/journal">دليل القهوة</a><a href="#/favorites">المفضلة</a><a href="#/about">حكاية رَوْق</a><a href="#/help">المساعدة</a></nav><div class="menu-bottom">للقهوة وقتها. وللتفاصيل الصغيرة، أثرها.</div>`;
  openDialog(menuDialog);
}
function selectedDelivery() {
  return document.querySelector('[name="delivery"]:checked')?.value || 'shipping';
}
function refreshCheckoutSummary() {
  const node = document.querySelector('#order-summary');
  if (node) node.innerHTML = checkoutSummary(state, selectedDelivery());
}
function clearValidation(field) {
  field.removeAttribute('aria-invalid');
  const error = document.querySelector(`#error-${field.name}`);
  if (error) error.textContent = '';
}
function updateCalculator() {
  const doseInput = document.querySelector('#coffee-dose');
  const dose = Number(doseInput.value);
  const ratio = Number(document.querySelector('#brew-ratio').value);
  const valid = Number.isFinite(dose) && Number.isInteger(dose) && dose >= 5 && dose <= 60;
  document.querySelector('#calculator-error').textContent = valid
    ? ''
    : 'اختر كمية من 5 إلى 60 جم، برقم صحيح.';
  doseInput.setAttribute('aria-invalid', String(!valid));
  document.querySelector('#water-result').innerHTML = valid
    ? `<strong>${number(dose * ratio)}</strong> <small>مل</small>`
    : '—';
}
function paintTimer() {
  const output = document.querySelector('#timer-time');
  if (!output) {
    stopTimer();
    return;
  }
  const elapsed = Math.floor(
    (timer.accumulated + (timer.startedAt === null ? 0 : performance.now() - timer.startedAt)) /
      1000,
  );
  output.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, '0')}:${String(elapsed % 60).padStart(2, '0')}`;
  const button = document.querySelector('#timer-toggle');
  button.innerHTML = `${icon(timer.startedAt === null ? 'play' : 'pause')}${timer.startedAt === null ? (timer.accumulated ? 'أكمل' : 'ابدأ') : 'إيقاف'}`;
}

document.addEventListener('click', (event) => {
  if (event.target.closest('.skip-link')) {
    event.preventDefault();
    main.focus({ preventScroll: true });
    main.scrollIntoView({ block: 'start', behavior: 'instant' });
    return;
  }
  const link = event.target.closest('a[href^="#/"]');
  if (
    link &&
    !event.ctrlKey &&
    !event.metaKey &&
    !event.shiftKey &&
    !event.altKey &&
    event.button === 0
  ) {
    closeDialogs();
    if (link.getAttribute('href') === location.hash) {
      event.preventDefault();
      renderRoute();
    }
    return;
  }
  const button = event.target.closest('[data-action]');
  if (!button || button.disabled) return;
  const { action, id, key } = button.dataset;
  if (action === 'cart') openCart();
  else if (action === 'search') openSearch();
  else if (action === 'menu') openMenu();
  else if (action === 'close-dialog') button.closest('dialog').close();
  else if (action === 'favorite') {
    state.favorites = state.favorites.includes(id)
      ? state.favorites.filter((value) => value !== id)
      : [...state.favorites, id];
    persist();
    updateFavoriteButtons(id);
    toast(state.favorites.includes(id) ? 'حفظناها لك في المفضلة.' : 'أُزيل المنتج من المفضلة.');
    if (currentPath === '/favorites') {
      const nextCard = button.closest('.product-card')?.nextElementSibling;
      const nextId = nextCard?.dataset.productCard;
      main.innerHTML = shopView(state, new URLSearchParams(), true);
      const nextButton = [...main.querySelectorAll('[data-action="favorite"]')].find(
        (b) => b.dataset.id === nextId,
      );
      (nextButton || main.querySelector('a[href="#/shop"]') || main).focus({ preventScroll: true });
    }
  } else if (action === 'quick-add') {
    const product = productById(id);
    if (product.variants.length > 1) {
      location.hash = `/product/${id}`;
      return;
    }
    if (addProduct(id, product.variants[0].id)) {
      button.classList.add('added');
      button.innerHTML = `أُضيف للسلة ${icon('check')}`;
      toast(`أضفنا ${product.name} إلى سلتك.`);
      setTimeout(() => {
        if (button.isConnected) {
          button.classList.remove('added');
          button.innerHTML = `أضف للسلة ${icon('plus')}`;
        }
      }, 1700);
    }
  } else if (action === 'home-category') {
    const category = button.dataset.category;
    document.querySelectorAll('[data-action="home-category"]').forEach((b) => {
      const selected = b === button;
      b.classList.toggle('active', selected);
      b.setAttribute('aria-pressed', String(selected));
    });
    const found = filterProducts({ category }).slice(0, 4);
    document.querySelector('#featured-grid').innerHTML = found
      .map((p) => productCard(p, state))
      .join('');
    document.querySelector('#featured-status').textContent =
      `يُعرض الآن ${number(found.length)} منتجات.`;
  } else if (action === 'category') setShopParam('category', button.dataset.category);
  else if (action === 'reset-filters') resetShopFilters();
  else if (action === 'clear-query') {
    clearTimeout(catalogTimer);
    setShopParam('q', '');
  } else if (action === 'filter-toggle') {
    const sidebar = document.querySelector('#shop-filters');
    const expanded = sidebar.classList.toggle('is-open');
    button.setAttribute('aria-expanded', String(expanded));
    if (expanded) {
      sidebar.scrollIntoView({ block: 'center', behavior: 'instant' });
      sidebar.querySelector('input').focus({ preventScroll: true });
    }
  } else if (action === 'product-plus' || action === 'product-minus') {
    const product = productById(document.querySelector('#product-form').dataset.product);
    productQuantity = Math.min(
      Math.min(product.stock, MAX_QUANTITY),
      Math.max(1, productQuantity + (action === 'product-plus' ? 1 : -1)),
    );
    const control = button.closest('.quantity-control');
    control.outerHTML = quantityControl(productQuantity, {
      product: true,
      max: Math.min(product.stock, MAX_QUANTITY),
    });
    const target = document.querySelector(`[data-action="${action}"]`);
    (target.disabled
      ? document.querySelector(
          `[data-action="${action === 'product-plus' ? 'product-minus' : 'product-plus'}"]`,
        )
      : target
    ).focus({ preventScroll: true });
  } else if (action.startsWith('cart-')) {
    const row = state.cart.find((line) => itemKey(line.id, line.variant) === key);
    if (!row) return;
    const quantity =
      action === 'cart-remove' ? 0 : row.quantity + (action === 'cart-plus' ? 1 : -1);
    state.cart = updateQuantity(state.cart, key, quantity);
    persist();
    repaintCart(action, key);
    if (action === 'cart-remove') toast('أُزيل المنتج من السلة.');
    else toast(`تم تحديث الكمية إلى ${number(quantity)}.`);
    if (currentPath === '/checkout') {
      if (!state.cart.length) main.innerHTML = checkoutView(state);
      else refreshCheckoutSummary();
    }
  } else if (action === 'remove-coupon') {
    state.coupon = '';
    persist();
    refreshCheckoutSummary();
    toast('أُزيل رمز الخصم.');
  } else if (action === 'print-order') window.print();
  else if (action === 'timer-toggle') {
    if (timer.startedAt === null) {
      timer.startedAt = performance.now();
      timer.interval = setInterval(paintTimer, 250);
    } else stopTimer();
    paintTimer();
  } else if (action === 'timer-reset') {
    stopTimer();
    timer.accumulated = 0;
    paintTimer();
  } else if (action === 'reset-data') {
    if (!resetArmed) {
      resetArmed = true;
      button.textContent = 'تأكيد مسح السلة والمفضلة';
      toast('اضغط مرة ثانية لتأكيد مسح بيانات رَوْق فقط.');
      return;
    }
    state = sanitizeState(null);
    lastOrder = null;
    try {
      session?.removeItem(ORDER_KEY);
    } catch {}
    persist();
    toast('مُسحت بيانات رَوْق من هذا المتصفح.');
    button.textContent = 'تم مسح بيانات التجربة';
    resetArmed = false;
  }
});

document.addEventListener('input', (event) => {
  const input = event.target;
  if (input.id === 'global-search') {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => {
      const node = document.querySelector('#search-results');
      if (node) node.innerHTML = searchResults(input.value);
    }, 100);
  } else if (input.id === 'catalog-query') {
    clearTimeout(catalogTimer);
    catalogTimer = setTimeout(() => {
      if (currentPath === '/shop') setShopParam('q', input.value);
    }, 180);
  } else if (input.id === 'price-range') {
    document.querySelector('#range-output').textContent = `${number(Number(input.value))} ر.س`;
    input.setAttribute('aria-valuetext', `${number(Number(input.value))} ريال`);
    setShopParam('max', input.value);
  } else if (input.id === 'coffee-dose') updateCalculator();
  if (input.closest('#checkout-form')) clearValidation(input);
});
document.addEventListener('change', (event) => {
  const input = event.target;
  if (input.id === 'sort-select') setShopParam('sort', input.value);
  else if (input.id === 'brew-ratio') updateCalculator();
  else if (input.name === 'variant') {
    const product = productById(document.querySelector('#product-form').dataset.product);
    document.querySelector('#detail-price').innerHTML = money(
      variantById(product, input.value).price,
    );
  } else if (input.name === 'delivery') {
    const pickup = input.value === 'pickup';
    document.querySelector('#address-fields').hidden = pickup;
    document.querySelector('#pickup-info').hidden = !pickup;
    document.querySelectorAll('#address-fields input,#address-fields select').forEach((field) => {
      field.required = !pickup;
      field.disabled = pickup;
      clearValidation(field);
    });
    document.querySelector('#checkout-totals').innerHTML = summaryRows(
      totals(state.cart, state.coupon, input.value),
    );
  }
  if (input.closest('#checkout-form')) clearValidation(input);
});
document.addEventListener('submit', (event) => {
  const form = event.target;
  if (!['product-form', 'search-form', 'coupon-form', 'checkout-form'].includes(form.id)) return;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form));
  if (form.id === 'product-form') {
    if (addProduct(form.dataset.product, data.variant, productQuantity)) openCart();
  } else if (form.id === 'search-form') {
    const query = String(data.q || '').trim();
    location.hash = `/shop${query ? `?q=${encodeURIComponent(query)}` : ''}`;
    closeDialogs();
  } else if (form.id === 'coupon-form') {
    const coupon = String(data.coupon || '')
      .trim()
      .toUpperCase();
    const input = form.querySelector('input');
    if (coupon !== 'RAWQ10') {
      document.querySelector('#coupon-message').textContent = coupon
        ? 'الرمز غير صحيح. جرّب RAWQ10.'
        : 'اكتب رمز الخصم أولًا.';
      input.setAttribute('aria-invalid', 'true');
      input.focus();
      return;
    }
    state.coupon = coupon;
    persist();
    refreshCheckoutSummary();
    toast('تم تطبيق خصم 10٪ على المنتجات.');
  } else if (form.id === 'checkout-form') {
    if (submitting) return;
    if (!state.cart.length) {
      renderRoute();
      return;
    }
    const errors = validateCheckout(data);
    form
      .querySelectorAll('[aria-invalid]')
      .forEach((field) => field.removeAttribute('aria-invalid'));
    form.querySelectorAll('.field-error').forEach((node) => (node.textContent = ''));
    const names = Object.keys(errors);
    if (names.length) {
      names.forEach((name) => {
        const field = form.elements.namedItem(name);
        field?.setAttribute('aria-invalid', 'true');
        document.querySelector(`#error-${name}`).textContent = errors[name];
      });
      document.querySelector('#checkout-errors').textContent =
        `راجع ${number(names.length)} حقول مطلوبة.`;
      form.elements.namedItem(names[0])?.focus();
      return;
    }
    submitting = true;
    const token =
      globalThis.crypto?.randomUUID?.().replace(/-/g, '').slice(0, 8).toUpperCase() ||
      Date.now().toString(36).toUpperCase();
    // Only product selections are retained in memory. Recipient details are intentionally excluded.
    lastOrder = {
      id: `RW-${token}`,
      date: new Date().toISOString(),
      lines: cartLines(state.cart),
      summary: totals(state.cart, state.coupon, data.delivery),
      delivery: data.delivery,
    };
    saveReceipt(session, lastOrder);
    form.reset();
    state.cart = [];
    state.coupon = '';
    persist();
    location.hash = '/order';
  }
});
for (const dialog of dialogs) {
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const rect = dialog.getBoundingClientRect();
    if (
      event.clientX < rect.left ||
      event.clientX > rect.right ||
      event.clientY < rect.top ||
      event.clientY > rect.bottom
    )
      dialog.close();
  });
}
window.addEventListener('hashchange', () => renderRoute());
window.addEventListener('storage', (event) => {
  if (event.key !== STORAGE_KEY && event.key !== null) return;
  state = readState(storage);
  updateHeader();
  if (cartDialog.open) cartDialog.innerHTML = cartView(state);
  state.favorites.forEach(updateFavoriteButtons);
  document
    .querySelectorAll('[data-action="favorite"]')
    .forEach((button) => updateFavoriteButtons(button.dataset.id));
  if (currentPath === '/checkout') {
    if (state.cart.length && document.querySelector('#checkout-form')) refreshCheckoutSummary();
    else renderRoute({ focus: false, scroll: false });
  }
  if (currentPath === '/favorites') main.innerHTML = shopView(state, new URLSearchParams(), true);
});
window.addEventListener('pagehide', stopTimer);
document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && dialogs.some((dialog) => dialog.open)) {
    event.preventDefault();
    closeDialogs();
    return;
  }
  if (
    event.key === '/' &&
    !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) &&
    !dialogs.some((d) => d.open)
  ) {
    event.preventDefault();
    openSearch();
  }
});
startImages();
renderRoute({ focus: false, scroll: false });
document.documentElement.dataset.appReady = 'true';
document.dispatchEvent(new Event('rawq:ready'));
document.querySelectorAll('template[data-prerender]').forEach((template) => template.remove());
