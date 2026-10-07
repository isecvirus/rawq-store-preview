import { products, categories, articles, productById } from './catalog.js';
import { regions, checkoutDefaults } from './checkout.js';
import { imagePlaceholder } from './images.js';
import {
  escapeHTML as esc,
  totals,
  cartLines,
  itemKey,
  FREE_SHIPPING,
  MAX_QUANTITY,
  filterProducts,
} from './core.js';

export const icon = (name, cls = '') =>
  `<svg class="icon ${cls}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
export const number = (value) => new Intl.NumberFormat('ar-SA-u-nu-latn').format(value);
export const money = (halalas) =>
  `<span class="price">${new Intl.NumberFormat('ar-SA-u-nu-latn', { maximumFractionDigits: 2 }).format(halalas / 100)}<span class="currency">ر.س</span></span>`;
export const categoryName = (id) => categories.find((cat) => cat.id === id)?.name || '';
export function image(name, alt, { cls = '', sizes = '(max-width: 700px) 50vw, 30vw' } = {}) {
  const wide = ['hero', 'brew-guide', 'grind-guide'].includes(name);
  return `<img class="${wide ? 'image-wide ' : ''}${cls}" src="${esc(imagePlaceholder)}" data-src="assets/images/${name}.webp" data-srcset="assets/images/${name}-small.webp 500w, assets/images/${name}.webp ${wide ? '1536' : '1000'}w" sizes="${sizes}" alt="${esc(alt)}" width="${wide ? 1536 : 1000}" height="${wide ? 1024 : 1000}" loading="lazy" decoding="async">`;
}
export const breadcrumb = (items) =>
  `<nav class="breadcrumbs" aria-label="مسار التنقل"><a href="#/">الرئيسية</a>${items.map(([name, href]) => `${icon('chevron-left')}${href ? `<a href="${href}">${esc(name)}</a>` : `<span aria-current="page">${esc(name)}</span>`}`).join('')}</nav>`;
export function favoriteButton(product, state) {
  const saved = state.favorites.includes(product.id);
  return `<button class="icon-button favorite-button" data-action="favorite" data-id="${product.id}" aria-label="${saved ? 'إزالة' : 'حفظ'} ${esc(product.name)} ${saved ? 'من' : 'في'} المفضلة" aria-pressed="${saved}">${icon('heart')}</button>`;
}
export function productCard(product, state) {
  return `<article class="product-card" data-product-card="${product.id}">
    ${favoriteButton(product, state)}
    <a class="product-media" href="#/product/${product.id}" aria-label="عرض ${esc(product.name)}">${product.tag ? `<span class="product-badge">${product.tag}</span>` : ''}${image(product.image, product.name)}</a>
    <div class="product-info"><div class="product-category">${categoryName(product.category)}</div><h3><a href="#/product/${product.id}">${product.name}</a></h3><p>${product.subtitle}</p>
      <div class="product-bottom">${money(product.price)}<button class="quick-add" data-action="quick-add" data-id="${product.id}" aria-label="${product.variants.length > 1 ? 'اختر خيارات' : 'أضف للسلة:'} ${product.name}">${product.variants.length > 1 ? 'اختر الطحن' : 'أضف للسلة'} ${icon('plus')}</button></div>
    </div></article>`;
}
export function emptyState(
  title,
  text,
  { symbol = 'shopping-bag', href = '#/shop', label = 'تصفّح المنتجات' } = {},
) {
  return `<div class="empty-state">${icon(symbol)}<h2>${esc(title)}</h2><p>${esc(text)}</p><a class="btn small" href="${href}">${label} ${icon('arrow-left')}</a></div>`;
}
export function articleCard(article) {
  return `<a class="article-card" href="#/journal/${article.id}">${image(article.image, article.title, { sizes: '(max-width:700px) 100vw, 33vw' })}<div class="article-meta"><span>${article.tag}</span><span>${article.time} قراءة</span></div><h3>${article.title}${icon('arrow-up-left')}</h3><p>${article.summary}</p></a>`;
}
export function homeView(state) {
  return `<div class="container">
    <section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="eyebrow">للتفاصيل الصغيرة، وقتها</div><h1 id="hero-title">خذ وقتك.<br><span>واضبط قهوتك.</span></h1><p>قهوة على ذوقك، وأدوات تختارها بعناية.<br>كل ما يحتاجه ركنك، في مكان واحد.</p><div class="hero-actions"><a class="btn" href="#/shop">اكتشف المجموعة ${icon('arrow-left')}</a><a class="text-link" href="#/journal/first-cup">حضّر كوبك الأول</a></div><div class="hero-footnote">${icon('coffee')}من أول طحنة، إلى آخر رشفة.</div></div>
    <div class="hero-visual">${image('hero', 'ركن قهوة بضوء الصباح، يضم قطّارة خزفية وإبريق صبّ وكوبين', { sizes: '(max-width:700px) 100vw, 55vw' })}<span class="hero-number">صباح على مهل / 01</span><div class="image-label"><span>أشياء بسيطة. صباح مختلف.</span><a href="#/product/morning-set" aria-label="اكتشف مجموعة الصباح">${icon('arrow-up-left')}</a></div></div></section>
    <div class="benefits"><div class="benefit">${icon('truck')}<div><strong>الشحن علينا</strong><span>للطلبات من 250 ر.س</span></div></div><div class="benefit">${icon('coffee')}<div><strong>لروتينك اليومي</strong><span>قهوة وأدوات تتكامل معًا</span></div></div><div class="benefit">${icon('book-open')}<div><strong>معك من أول كوب</strong><span>أدلة بسيطة لتحضير أفضل</span></div></div></div>
    <section class="section" aria-labelledby="featured-title"><div class="section-head"><div><div class="eyebrow">ركنك، على ذوقك</div><h2 id="featured-title">تفاصيل تستحق مكانها.</h2><p>ابدأ بقطعة تحبها، وأكمل ركنك على مهل.</p></div><a class="text-link" href="#/shop">كل المنتجات ${icon('arrow-left')}</a></div>
      <div class="category-pills" aria-label="تصفية المنتجات المختارة">${categories.map((cat) => `<button class="pill ${cat.id === 'all' ? 'active' : ''}" data-action="home-category" data-category="${cat.id}" aria-pressed="${cat.id === 'all'}">${cat.name}</button>`).join('')}</div>
      <div class="product-grid" id="featured-grid">${products
        .slice(0, 4)
        .map((p) => productCard(p, state))
        .join('')}</div><div class="sr-only" id="featured-status" role="status"></div>
    </section>
    <section class="story-strip"><div class="story-content"><div class="eyebrow">حكاية كل صباح</div><h2>ابدأ يومك،<br>على مهل.</h2><p>صوت الطحن، رائحة القهوة، وأول رشفة.<br>نحب هذه التفاصيل، ونختار لها أدوات تجعل التحضير جزءًا جميلًا من يومك.</p><a class="text-link" href="#/about">تعرّف على رَوْق ${icon('arrow-left')}</a></div><div class="story-photo">${image('cup', 'كوبان من الخزف العاجي، أحدهما مملوء بالقهوة', { sizes: '(max-width:700px) 100vw, 50vw' })}</div></section>
    <section class="section" aria-labelledby="journal-heading"><div class="section-head"><div><div class="eyebrow">جرّب، وتعلّم، واستمتع</div><h2 id="journal-heading">بين القهوة والتفاصيل.</h2></div><a class="text-link" href="#/journal">دليل القهوة ${icon('arrow-left')}</a></div><div class="articles-grid">${articles.map(articleCard).join('')}</div></section>
    <div class="closing-line"><p>لكل يوم، لحظة رَوْق.</p>${icon('coffee')}</div>
  </div>`;
}
export function shopView(state, params = new URLSearchParams(), favoritesOnly = false) {
  const category = categories.some((c) => c.id === params.get('category'))
    ? params.get('category')
    : 'all';
  const query = (params.get('q') || '').slice(0, 120);
  const sort = ['price-asc', 'price-desc', 'name'].includes(params.get('sort'))
    ? params.get('sort')
    : 'featured';
  const rawMax = Number(params.get('max') || 400);
  const maxPrice = Number.isFinite(rawMax) ? Math.min(400, Math.max(50, rawMax)) : 400;
  const found = filterProducts({
    category,
    query,
    sort,
    maxPrice: maxPrice * 100,
    ...(favoritesOnly ? { favorites: state.favorites } : {}),
  });
  if (favoritesOnly)
    return `<div class="container">${breadcrumb([['المفضلة']])}<div class="page-heading"><div class="eyebrow">لوقت لاحق</div><h1>أشياء على ذوقك.</h1><p>القطع التي حفظتها، تجدها هنا متى ما أردت.</p></div><section class="section" style="padding-top:0">${found.length ? `<div class="product-grid">${found.map((p) => productCard(p, state)).join('')}</div>` : emptyState('المفضلة تنتظر اختياراتك', 'اضغط على القلب بجانب أي منتج لتجده هنا.', { symbol: 'heart' })}</section></div>`;
  return `<div class="container">${breadcrumb([['المتجر']])}<div class="page-heading"><div class="eyebrow">كل ما يحتاجه ركنك</div><h1>اختر تفاصيل يومك.</h1><p>من القهوة إلى آخر قطعة في ركنك. أشياء تحب استخدامها كل يوم.</p></div>
  <div class="shop-layout"><aside class="shop-sidebar" id="shop-filters" aria-label="تصفية المنتجات"><div class="filter-search"><label class="sr-only" for="catalog-query">ابحث في المنتجات</label><input id="catalog-query" type="search" placeholder="ابحث عن منتج…" value="${esc(query)}" maxlength="120" autocomplete="off">${icon('search')}</div><div class="filter-group"><h2>تسوّق حسب القسم</h2>${categories.map((cat) => `<button class="filter-category ${category === cat.id ? 'active' : ''}" data-action="category" data-category="${cat.id}" aria-pressed="${category === cat.id}"><span>${cat.name}</span><small>${number(cat.id === 'all' ? products.length : products.filter((p) => p.category === cat.id).length)}</small></button>`).join('')}</div>
    <div class="filter-group"><label for="price-range">الحد الأعلى للسعر</label><input id="price-range" type="range" min="50" max="400" step="10" value="${maxPrice}" aria-valuetext="${number(maxPrice)} ريال"><div class="range-labels"><span>50 ر.س</span><output id="range-output" for="price-range">${number(maxPrice)} ر.س</output></div></div><button class="reset-filters" data-action="reset-filters">مسح التصفية</button><div class="filter-note">${icon('coffee')}<h3>أول مرة تحضّر؟</h3><p>ابدأ بخطوات بسيطة، واضبط الكوب على ذوقك.</p><a class="text-link" href="#/journal/first-cup">دليل كوبك الأول ${icon('arrow-left')}</a></div></aside>
    <section aria-label="المنتجات"><div class="shop-toolbar"><button class="mobile-filter-toggle" data-action="filter-toggle" aria-expanded="false" aria-controls="shop-filters">${icon('sliders-horizontal')}التصفية</button><span class="results-count" id="results-count" role="status">${number(found.length)} منتجات</span><label class="sort-field" for="sort-select">الترتيب حسب <select id="sort-select"><option value="featured" ${sort === 'featured' ? 'selected' : ''}>اختيارات رَوْق</option><option value="price-asc" ${sort === 'price-asc' ? 'selected' : ''}>السعر: من الأقل</option><option value="price-desc" ${sort === 'price-desc' ? 'selected' : ''}>السعر: من الأعلى</option><option value="name" ${sort === 'name' ? 'selected' : ''}>الاسم</option></select></label></div><div id="active-query">${query ? `<div class="active-query">نتائج البحث عن «${esc(query)}» <button class="icon-button" data-action="clear-query" aria-label="مسح البحث">${icon('x')}</button></div>` : ''}</div><div class="product-grid shop-grid" id="shop-grid">${found.length ? found.map((p) => productCard(p, state)).join('') : noProducts()}</div></section>
  </div></div>`;
}
export const noProducts = () =>
  `<div class="empty-state">${icon('search')}<h2>ما لقينا نتيجة مطابقة.</h2><p>جرّب كلمة أقصر، أو غيّر القسم ونطاق السعر.</p><button class="btn secondary small" data-action="reset-filters">عرض كل المنتجات</button></div>`;
export function quantityControl(quantity, { key = '', product = false, max = 10 } = {}) {
  return `<div class="quantity-control" ${product ? 'aria-label="كمية المنتج"' : ''}><button type="button" data-action="${product ? 'product-minus' : 'cart-minus'}" data-key="${key}" aria-label="تقليل الكمية" ${quantity <= 1 ? 'disabled' : ''}>${icon('minus')}</button><output ${product ? 'id="product-quantity"' : ''} aria-label="الكمية">${number(quantity)}</output><button type="button" data-action="${product ? 'product-plus' : 'cart-plus'}" data-key="${key}" aria-label="زيادة الكمية" ${quantity >= max ? 'disabled' : ''}>${icon('plus')}</button></div>`;
}
export function productView(product, state) {
  if (!product) return notFound();
  const related = products
    .filter((p) => p.id !== product.id)
    .sort(
      (a, b) => Number(b.category === product.category) - Number(a.category === product.category),
    )
    .slice(0, 4);
  return `<div class="container">${breadcrumb([['المتجر', '#/shop'], [categoryName(product.category), `#/shop?category=${product.category}`], [product.name]])}<section class="product-detail"><div class="detail-visual">${image(product.image, product.name, { sizes: '(max-width:700px) 100vw, 50vw' })}${favoriteButton(product, state)}<span>تعرّف على التفاصيل واختر ما يناسب ركنك.</span></div><div class="detail-copy"><div class="eyebrow">${categoryName(product.category)}</div><h1>${product.name}</h1><p class="detail-subtitle">${product.subtitle}</p><div class="detail-price" id="detail-price">${money(product.price)}</div><span class="stock-note">متوفر في المجموعة</span><p class="detail-description">${product.description}</p>
    <form id="product-form" data-product="${product.id}"><fieldset class="option-field"><legend>${product.optionLabel}</legend><div class="variant-options">${product.variants.map((option, i) => `<label class="variant-option"><input type="radio" name="variant" value="${option.id}" ${i === 0 ? 'checked' : ''}><span>${option.label}</span></label>`).join('')}</div></fieldset><div class="buy-row">${quantityControl(1, { product: true, max: Math.min(product.stock, MAX_QUANTITY) })}<button type="submit" class="btn">${icon('shopping-bag')} أضف للسلة</button></div></form>
    <div class="detail-perks"><span>${icon('truck')}شحن مجاني من 250 ر.س</span><span>${icon('package')}توصيل داخل السعودية</span></div><div class="accordion"><details open><summary>عن المنتج ${icon('chevron-down')}</summary><p>${product.details}</p><dl class="spec-list">${product.specs.map(([title, value]) => `<div><dt>${title}</dt><dd>${value}</dd></div>`).join('')}</dl></details><details><summary>الاستخدام والعناية ${icon('chevron-down')}</summary><p>${product.care}</p></details><details><summary>التوصيل والاستلام ${icon('chevron-down')}</summary><p>خيارات الشحن والاستلام متاحة للتجربة في صفحة الطلب. الشحن 19 ر.س، ومجاني عندما تبلغ قيمة المنتجات بعد الخصم 250 ر.س. لا يتم تنفيذ توصيل فعلي في هذه النسخة.</p></details></div>
    </div></section><section class="section related"><div class="section-head"><div><div class="eyebrow">تكمل بعض</div><h2>قد تعجبك أيضًا.</h2></div><a class="text-link" href="#/shop">كل المنتجات ${icon('arrow-left')}</a></div><div class="product-grid">${related.map((p) => productCard(p, state)).join('')}</div></section></div>`;
}
export function summaryRows(summary) {
  return `<div class="summary-row"><span>قيمة المنتجات</span>${money(summary.subtotal)}</div>${summary.discount ? `<div class="summary-row discount"><span>خصم 10٪</span><span>− ${money(summary.discount)}</span></div>` : ''}<div class="summary-row"><span>التوصيل</span><span>${summary.shipping ? money(summary.shipping) : 'مجاني'}</span></div><div class="summary-row summary-total"><span>الإجمالي</span>${money(summary.total)}</div>`;
}
export function cartView(state) {
  const summary = totals(state.cart, state.coupon);
  const lines = cartLines(state.cart);
  const head = `<div class="drawer-head"><h2 id="cart-title">سلة التسوق <small>${number(summary.count)} قطع</small></h2><button class="icon-button" data-action="close-dialog" aria-label="أغلق السلة">${icon('x')}</button></div>`;
  if (!lines.length)
    return `${head}${emptyState('ركنك ينتظر أول قطعة.', 'تصفّح المجموعة وأضف ما يناسب ذوقك.')}`;
  return `${head}<div class="shipping-progress"><p>${summary.toFreeShipping ? `باقي ${money(summary.toFreeShipping)} ويصير الشحن علينا.` : 'وصلت للحد المطلوب، الشحن علينا!'} ${icon('truck')}</p><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, (summary.net / FREE_SHIPPING) * 100)}%"></div></div></div><div class="cart-items">${lines
    .map((row) => {
      const used = lines.filter((r) => r.id === row.id).reduce((sum, r) => sum + r.quantity, 0);
      const max = Math.min(row.product.stock, MAX_QUANTITY) - used + row.quantity;
      return `<article class="cart-item"><a href="#/product/${row.id}">${image(row.product.image, row.product.name, { sizes: '90px' })}</a><div><div class="cart-item-top"><h3><a href="#/product/${row.id}">${row.product.name}</a></h3><button class="remove-item" data-action="cart-remove" data-key="${row.key}" aria-label="إزالة ${row.product.name} من السلة">${icon('x')}</button></div><p>${row.option.label}</p><div class="cart-item-bottom">${quantityControl(row.quantity, { key: row.key, max })}${money(row.total)}</div></div></article>`;
    })
    .join(
      '',
    )}</div><div class="drawer-bottom">${summaryRows(summary)}<a class="btn full" href="#/checkout">إتمام الطلب ${icon('arrow-left')}</a><p>تجربة عرض · لن يُخصم أي مبلغ</p></div>`;
}
export function checkoutSummary(state, delivery = 'shipping') {
  return `<h2>ملخص طلبك</h2><div class="order-summary-items">${cartLines(state.cart)
    .map(
      (row) =>
        `<div class="cart-item">${image(row.product.image, row.product.name, { sizes: '70px' })}<div><h3>${row.product.name}</h3><p>${row.option.label} · الكمية: ${number(row.quantity)}</p>${money(row.total)}</div></div>`,
    )
    .join(
      '',
    )}</div><form class="coupon-form" id="coupon-form"><label for="coupon">رمز الخصم</label><div class="coupon-input-row"><input id="coupon" name="coupon" type="text" dir="ltr" maxlength="30" placeholder="RAWQ10" value="${state.coupon || 'RAWQ10'}" autocomplete="off"><button class="btn small secondary" type="submit">تطبيق</button></div><div class="coupon-note" id="coupon-message" role="status">${state.coupon ? `تم تطبيق خصم 10٪. <button type="button" class="reset-filters" data-action="remove-coupon">إزالة</button>` : 'جرّب الرمز <code>RAWQ10</code> للحصول على خصم 10٪.'}</div></form><div id="checkout-totals">${summaryRows(totals(state.cart, state.coupon, delivery))}</div><p class="coupon-note">الأسعار وخيارات التوصيل توضيحية لهذه التجربة.</p>`;
}
export function checkoutView(state) {
  if (!state.cart.length)
    return `<div class="container">${breadcrumb([['إتمام الطلب']])}${emptyState('سلتك فارغة حاليًا.', 'أضف منتجًا واحدًا على الأقل قبل الانتقال إلى الطلب.')}</div>`;
  return `<div class="container">${breadcrumb([['المتجر', '#/shop'], ['إتمام الطلب']])}<div class="page-heading"><div class="eyebrow">الخطوة الأخيرة</div><h1>قريب من ركنك.</h1><p>راجع اختياراتك وأكمل تجربة الطلب.</p></div><div class="demo-notice">${icon('info')}<p><strong>هذا طلب تجريبي.</strong> الحقول جاهزة ببيانات تجريبية يمكنك تعديلها. لا دفع أو توصيل فعلي، ولا تُرسل بياناتك.</p></div><div class="checkout-layout"><form id="checkout-form" class="checkout-form" novalidate autocomplete="off">
    <section class="form-panel"><h2><span class="step-number">1</span> بيانات المستلم</h2><div class="form-grid"><div class="field"><label for="customer-name">اسم المستلم <span aria-hidden="true">*</span></label><input id="customer-name" name="name" value="${esc(checkoutDefaults.name)}" placeholder="اسم تجريبي" required minlength="2" maxlength="80" autocomplete="off" aria-describedby="error-name"><span class="field-error" id="error-name"></span></div><div class="field"><label for="customer-phone">رقم الجوال <span aria-hidden="true">*</span></label><input id="customer-phone" name="phone" value="${checkoutDefaults.phone}" type="tel" inputmode="tel" placeholder="05xxxxxxxx" dir="ltr" required maxlength="20" autocomplete="off" aria-describedby="error-phone"><span class="field-error" id="error-phone"></span></div></div></section>
    <section class="form-panel"><h2><span class="step-number">2</span> طريقة الاستلام</h2><fieldset class="delivery-options"><legend class="sr-only">اختر طريقة الاستلام</legend><label class="radio-card"><input type="radio" name="delivery" value="shipping" checked><span><strong>توصيل إلى عنوانك</strong><small>19 ر.س · مجاني من 250 ر.س</small></span></label><label class="radio-card"><input type="radio" name="delivery" value="pickup"><span><strong>استلام من المتجر</strong><small>مجاني · خيار تجريبي</small></span></label></fieldset><div id="address-fields" class="form-grid"><div class="field"><label for="region">المنطقة الإدارية <span aria-hidden="true">*</span></label><select id="region" name="region" required aria-describedby="error-region"><option value="">اختر المنطقة</option>${regions.map((region) => `<option value="${region}" ${region === checkoutDefaults.region ? 'selected' : ''}>${region}</option>`).join('')}</select><span class="field-error" id="error-region"></span></div><div class="field"><label for="district">الحي <span aria-hidden="true">*</span></label><input id="district" name="district" value="${esc(checkoutDefaults.district)}" placeholder="اسم الحي" required minlength="2" maxlength="80" aria-describedby="error-district"><span class="field-error" id="error-district"></span></div><div class="field"><label for="street">الشارع <span aria-hidden="true">*</span></label><input id="street" name="street" value="${esc(checkoutDefaults.street)}" placeholder="اسم الشارع" required minlength="2" maxlength="80" aria-describedby="error-street"><span class="field-error" id="error-street"></span></div><div class="field"><label for="building">رقم المبنى <span aria-hidden="true">*</span></label><input id="building" name="building" value="${checkoutDefaults.building}" placeholder="1234" inputmode="numeric" dir="ltr" required maxlength="6" aria-describedby="error-building"><span class="field-error" id="error-building"></span></div></div><div id="pickup-info" class="pickup-info" hidden>الاستلام من المتجر خيار لتوضيح تجربة الطلب فقط. لا يوجد موقع استلام فعلي لهذا المشروع.</div></section>
    <section class="form-panel"><h2><span class="step-number">3</span> تأكيد الطلب</h2><div class="payment-demo">${icon('credit-card')}<div><strong>معاينة إتمام الطلب</strong><p>لا تحتاج إلى بطاقة أو أي معلومات دفع.</p></div></div><label class="checkbox-field"><input type="checkbox" name="consent" id="consent" required aria-describedby="error-consent"><span>أفهم أن هذا طلب تجريبي ولا يترتب عليه شراء أو دفع.</span></label><span class="field-error" id="error-consent"></span><div id="checkout-errors" class="sr-only" role="alert"></div><button class="btn full checkout-submit" type="submit">تأكيد الطلب التجريبي ${icon('arrow-left')}</button></section></form><aside class="order-summary" id="order-summary" aria-label="ملخص الطلب">${checkoutSummary(state)}</aside></div></div>`;
}
export function confirmationView(order) {
  if (!order)
    return `<div class="container">${breadcrumb([['الطلب']])}${emptyState('لا يوجد طلب لعرضه.', 'جرّب إضافة بعض المنتجات وإتمام الطلب لمشاهدة الملخص.')}</div>`;
  return `<div class="container"><section class="confirmation"><div class="success-icon">${icon('check')}</div><div class="eyebrow" style="justify-content:center">اكتملت التجربة</div><h1>كل شيء جاهز، على ذوقك.</h1><p>هذا ملخص طلبك التجريبي. لم يُخصم أي مبلغ ولم تُرسل بياناتك.</p><div class="receipt"><div class="receipt-top"><div><span>رقم الطلب التجريبي</span><strong dir="ltr">${esc(order.id)}</strong></div><div><span>تاريخ التجربة</span><strong>${new Intl.DateTimeFormat('ar-SA-u-nu-latn', { day: 'numeric', month: 'long', year: 'numeric', calendar: 'gregory' }).format(new Date(order.date))}</strong></div></div>${order.lines.map((row) => `<div class="cart-item">${image(row.product.image, row.product.name, { sizes: '90px' })}<div><h3>${row.product.name}</h3><p>${row.option.label} · الكمية: ${number(row.quantity)}</p>${money(row.total)}</div></div>`).join('')}<div style="margin-top:24px">${summaryRows(order.summary)}</div><p class="receipt-note">طريقة الاستلام: ${order.delivery === 'pickup' ? 'استلام من المتجر (تجريبي)' : 'توصيل إلى العنوان (تجريبي)'}. احتُفظ بملخص المنتجات لهذه الجلسة فقط، دون الاسم أو الجوال أو العنوان.</p></div><div class="receipt-actions"><a class="btn" href="#/shop">متابعة التسوّق ${icon('arrow-left')}</a><button class="btn secondary" data-action="print-order">طباعة الملخص</button></div></section></div>`;
}
export function calculatorView() {
  return `<section class="calculator" aria-labelledby="calculator-title"><div><div class="eyebrow">اضبطها على ذوقك</div><h2 id="calculator-title">كم قهوة؟ وكم ماء؟</h2><p>ابدأ بهذه النسبة للترشيح، ثم عدّلها حسب الكوب الذي تحبه.</p></div><div class="calculator-controls"><div class="field"><label for="coffee-dose">كمية القهوة (جم)</label><input id="coffee-dose" type="number" min="5" max="60" step="1" value="15" inputmode="numeric" aria-describedby="calculator-error"></div><div class="field"><label for="brew-ratio">نسبة الماء</label><select id="brew-ratio"><option value="15">1 : 15 — قوام أعلى</option><option value="16" selected>1 : 16 — متوازن</option><option value="17">1 : 17 — أخف</option></select></div><div class="calculator-result" aria-live="polite"><span>كمية الماء المقترحة</span><output id="water-result" for="coffee-dose brew-ratio"><strong>240</strong> <small>مل</small></output></div><span id="calculator-error" class="field-error" style="grid-column:1/-1"></span></div></section>`;
}
export function journalView() {
  return `<div class="container">${breadcrumb([['دليل القهوة']])}<div class="journal-intro"><div><div class="eyebrow">لأن كل كوب فرصة للتجربة</div><h1>خذها خطوة،<br>وراء خطوة.</h1><p>أدلة قصيرة وأفكار بسيطة تساعدك على فهم قهوتك والاستمتاع بتحضيرها.</p></div>${image('hero', 'أدوات تحضير القهوة على طاولة مضاءة بالشمس', { sizes: '(max-width:700px) 100vw, 50vw' })}</div><div class="articles-grid">${articles.map(articleCard).join('')}</div>${calculatorView()}<div class="closing-line" style="margin-top:40px"><p>أفضل وصفة، هي التي تحبها.</p>${icon('coffee')}</div></div>`;
}
export function articleView(article) {
  if (!article) return notFound();
  return `<div class="container">${breadcrumb([['دليل القهوة', '#/journal'], [article.title]])}<div class="article-layout"><article class="article-body"><div class="eyebrow">${article.tag} · ${article.time} قراءة</div><h1>${article.title}</h1><p class="lead">${article.summary}</p>${image(article.image, article.title, { cls: 'article-cover', sizes: '(max-width:700px) 100vw, 60vw' })}${article.sections.map(([title, text], i) => `<section class="article-section"><h2>${number(i + 1)}. ${title}</h2><p>${text}</p></section>`).join('')}<a class="text-link" href="#/journal">كل أدلة القهوة ${icon('arrow-left')}</a></article><aside class="article-aside"><div class="filter-note">${icon('coffee')}<h3>جاهز تجرّب؟</h3><p>اختر القطع التي تناسب طريقتك في التحضير.</p><a class="text-link" href="#/shop?category=tools">أدوات التحضير ${icon('arrow-left')}</a></div><section class="timer-card"><h2>مؤقّت التحضير</h2><output id="timer-time" class="timer-time" aria-label="الوقت المنقضي">00:00</output><div class="timer-buttons"><button class="btn small" data-action="timer-toggle" id="timer-toggle">${icon('play')}ابدأ</button><button class="icon-button" data-action="timer-reset" aria-label="تصفير المؤقت">${icon('rotate-ccw')}</button></div><p>تابع الوقت وجرّب ما يناسب قهوتك.</p></section></aside></div></div>`;
}
export function aboutView() {
  return `<div class="container">${breadcrumb([['حكاية رَوْق']])}<section class="about-hero"><div><div class="eyebrow">حكايتنا بسيطة</div><h1>بعض التفاصيل،<br><span>تغيّر يومك.</span></h1><p>نحب القهوة، ونحب الوقت الذي نأخذه لتحضيرها. من هنا جاءت فكرة رَوْق: مكان يجمع قهوة وأدوات بسيطة، تجعل هذه الدقائق أجمل.<br><br>قطعة ترتاح لها يدك، وكوب تحب ملمسه، وقهوة ترجع لها كل صباح. هذه هي التفاصيل التي نختارها.</p></div>${image('hero', 'ركن قهوة بسيط يجمع الأدوات والأكواب', { sizes: '(max-width:700px) 100vw, 50vw' })}</section><section class="values"><div><span>01 /</span><h2>أقل، وأقرب لك.</h2><p>مجموعة صغيرة وواضحة تساعدك على الاختيار. كل قطعة لها دور في ركنك، ومساحة في يومك.</p></div><div><span>02 /</span><h2>تفاصيل مفهومة.</h2><p>نوضح ما تحتاج معرفته عن كل منتج: استخدامه، خامته، وما يشمله، لتختار وأنت تعرف ما يناسبك.</p></div><div><span>03 /</span><h2>على ذوقك أنت.</h2><p>لا توجد طريقة واحدة للاستمتاع بالقهوة. جرّب، وعدّل، واصنع عادتك الخاصة على مهل.</p></div></section><div class="about-demo"><strong>عن هذا المشروع:</strong> رَوْق علامة تصورية أنشئت لعرض تجربة متجر عربي. المنتجات والصور والأسعار توضيحية، والمتجر لا يمثّل نشاطًا تجاريًا قائمًا ولا ينفّذ طلبات حقيقية.</div></div>`;
}
export function helpView(topic) {
  const faqs = [
    [
      'demo',
      'هل يمكن الشراء من المتجر؟',
      'رَوْق مشروع لمعرض أعمال، وليس متجرًا تجاريًا. يمكنك تجربة التصفّح والمفضلة والسلة وإتمام طلب توضيحي، دون دفع أو شراء أو شحن فعلي.',
    ],
    [
      'shipping',
      'كيف تُحسب تكلفة التوصيل؟',
      'في هذه التجربة، تبلغ رسوم الشحن 19 ر.س، وتصبح مجانية عندما تبلغ قيمة المنتجات بعد الخصم 250 ر.س أو أكثر. الاستلام من المتجر مجاني، وهو خيار توضيحي فقط.',
    ],
    [
      'coupon',
      'كيف أستخدم رمز الخصم؟',
      'في صفحة إتمام الطلب، أدخل RAWQ10 واضغط «تطبيق». تحصل على خصم توضيحي بنسبة 10٪ على المنتجات، قبل حساب رسوم الشحن. لا يمكن جمعه مع رمز آخر.',
    ],
    [
      'coffee',
      'أي درجة طحن أختار؟',
      'اختر «حب كامل» إذا كانت لديك مطحنة. للقطّارة والفلتر اختر «طحن للترشيح»، ولآلة الإسبريسو اختر «طحن للإسبريسو». قد تحتاج إلى تعديل الطحن وفقًا لأداتك وذوقك.',
    ],
    [
      'privacy',
      'ما البيانات التي يحتفظ بها الموقع؟',
      'تُحفظ السلة والمفضلة ورمز الخصم في متصفحك فقط. لا تُرسل بيانات إلى خادم ولا توجد أدوات تتبع. بيانات المستلم في النموذج مؤقتة ولا تُحفظ. ملخص آخر طلب يبقى خلال جلسة التصفح دون الاسم أو الجوال أو العنوان. استخدم بيانات تجريبية فقط.',
    ],
    [
      'reset',
      'كيف أمسح بيانات التجربة؟',
      'يمكنك حذف المنتجات من السلة وإزالة المفضلة كلًّا على حدة. لمسح جميع بيانات رَوْق مرة واحدة، استخدم الزر أدناه. لا يؤثر ذلك في بيانات المواقع الأخرى.',
    ],
  ];
  return `<div class="container">${breadcrumb([['المساعدة']])}<div class="page-heading"><div class="eyebrow">إجابات واضحة</div><h1>نختصر عليك السؤال.</h1><p>كل ما تحتاج معرفته عن تجربة رَوْق.</p></div><div class="help-layout"><aside class="help-intro"><h2>من أول اختيار،<br>إلى آخر خطوة.</h2><p>تصفّح الأسئلة، أو ارجع للمتجر وجرّب بنفسك.</p><a class="text-link" href="#/shop">تصفّح المجموعة ${icon('arrow-left')}</a></aside><div class="accordion help-questions">${faqs.map(([id, title, text], i) => `<details id="faq-${id}" ${topic === id || (!topic && i === 0) ? 'open' : ''}><summary>${title} ${icon('chevron-down')}</summary><p>${text}</p>${id === 'reset' ? '<button class="btn secondary small" style="margin-bottom:20px" data-action="reset-data">مسح بيانات التجربة</button>' : ''}</details>`).join('')}</div></div></div>`;
}
export const notFound = () =>
  `<div class="container">${emptyState('هذه الصفحة غير موجودة.', 'قد يكون الرابط غير صحيح. ارجع للمتجر واستكشف المجموعة.', { symbol: 'search' })}</div>`;
