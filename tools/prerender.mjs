import { products, articles, categories } from '../src/catalog.js';
import { emptyState } from '../src/core.js';
import { startImages } from '../src/images.js';
import {
  homeView,
  shopView,
  productView,
  journalView,
  articleView,
  aboutView,
  helpView,
  notFound,
} from '../src/views.js';

// Public pages use the same templates as the app. Inert <template> elements do not
// download their images; only the page selected below is inserted into the DOM.
export function prerender() {
  const state = emptyState();
  const pages = [];
  const routes = {};
  function add(route, html, title, nav = '') {
    const id = `prerender-${pages.length}`;
    pages.push(`<template data-prerender id="${id}">${html}</template>`);
    routes[route] = { id, title, nav };
  }
  add('/', homeView(state), 'خذ وقتك، واضبط قهوتك', 'home');
  add('/shop', shopView(state), 'المتجر', 'shop');
  for (const category of categories) {
    add(
      `/shop?category=${category.id}`,
      shopView(state, new URLSearchParams({ category: category.id })),
      'المتجر',
      category.id === 'tools' ? 'tools' : 'shop',
    );
  }
  for (const product of products)
    add(`/product/${product.id}`, productView(product, state), product.name, 'shop');
  add('/journal', journalView(), 'دليل القهوة', 'journal');
  for (const article of articles)
    add(`/journal/${article.id}`, articleView(article), article.title, 'journal');
  add('/about', aboutView(), 'حكاية رَوْق', 'about');
  add('/help', helpView(null), 'المساعدة');
  for (const topic of ['demo', 'shipping', 'coupon', 'coffee', 'privacy', 'reset']) {
    add(`/help?topic=${topic}`, helpView(topic), 'المساعدة');
  }
  add('not-found', notFound(), 'صفحة غير موجودة');
  const placeholder =
    '<div class="container page-placeholder" role="status"><span class="sr-only">جارٍ تجهيز الصفحة</span><div class="placeholder-heading" aria-hidden="true"></div><div class="placeholder-panels" aria-hidden="true"><span></span><span></span></div></div>';
  add('pending', placeholder, 'رَوْق');
  return {
    templates: pages.join('\n'),
    placeholder,
    bootstrap: `<script>(${startImages.toString()})();(${showInitialPage.toString()})(${JSON.stringify(routes).replaceAll('<', '\\u003c')});</script>`,
  };
}

function showInitialPage(routes) {
  const main = document.querySelector('#main');
  function show() {
    const raw = location.hash.startsWith('#/') ? location.hash.slice(1) : '/';
    const split = raw.indexOf('?');
    const path = (split === -1 ? raw : raw.slice(0, split)).replace(/\/$/, '') || '/';
    const params = new URLSearchParams(split === -1 ? '' : raw.slice(split + 1));
    let key = path;
    if (['/favorites', '/checkout', '/order'].includes(path)) key = 'pending';
    else if (path === '/shop' && params.size) {
      key =
        params.size === 1 && params.has('category')
          ? `/shop?category=${params.get('category')}`
          : 'pending';
      if (!routes[key]) key = '/shop';
    } else if (path === '/help' && params.get('topic')) {
      key = `/help?topic=${params.get('topic')}`;
      if (!routes[key]) key = 'pending';
    }
    const page = routes[key] || routes['not-found'];
    const template = document.getElementById(page.id);
    if (!template) return;
    main.replaceChildren(template.content.cloneNode(true));
    document.title = `رَوْق | ${page.title}`;
    document.querySelectorAll('[data-nav]').forEach((link) => {
      if (link.dataset.nav === page.nav) link.setAttribute('aria-current', 'page');
      else link.removeAttribute('aria-current');
    });
  }
  show();
  window.addEventListener('hashchange', show);
  document.addEventListener('rawq:ready', () => window.removeEventListener('hashchange', show), {
    once: true,
  });
}
