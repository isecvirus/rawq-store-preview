import { products, productById, variantById } from './catalog.js';
import { regions } from './checkout.js';

export const STORAGE_KEY = 'rawq-store:v1';
export const FREE_SHIPPING = 25000;
export const SHIPPING_FEE = 1900;
export const MAX_QUANTITY = 10;
export const normalizeDigits = (value) =>
  String(value)
    .replace(/[٠-٩]/g, (char) => String('٠١٢٣٤٥٦٧٨٩'.indexOf(char)))
    .replace(/[۰-۹]/g, (char) => String('۰۱۲۳۴۵۶۷۸۹'.indexOf(char)));
export const normalizeSearch = (value) =>
  String(value)
    .normalize('NFKD')
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '')
    .replace(/[أإآ]/g, 'ا')
    .replace(/ى/g, 'ي')
    .toLocaleLowerCase('ar')
    .trim();
export const escapeHTML = (value) =>
  String(value).replace(
    /[&<>"']/g,
    (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c],
  );
export const itemKey = (id, variant) => `${id}:${variant}`;
export const emptyState = () => ({ cart: [], favorites: [], coupon: '' });

export function sanitizeState(input) {
  const state = emptyState();
  if (!input || typeof input !== 'object') return state;
  const totals = new Map();
  for (const row of Array.isArray(input.cart) ? input.cart.slice(0, 100) : []) {
    if (!row || typeof row !== 'object') continue;
    const product = productById(row.id);
    if (
      !product ||
      !variantById(product, row.variant) ||
      !Number.isSafeInteger(row.quantity) ||
      row.quantity <= 0
    )
      continue;
    const remaining = Math.min(product.stock, MAX_QUANTITY) - (totals.get(row.id) || 0);
    const quantity = Math.min(row.quantity, remaining);
    if (quantity <= 0) continue;
    const duplicate = state.cart.find((line) => line.id === row.id && line.variant === row.variant);
    if (duplicate) duplicate.quantity += quantity;
    else state.cart.push({ id: row.id, variant: row.variant, quantity });
    totals.set(row.id, (totals.get(row.id) || 0) + quantity);
  }
  state.favorites = [
    ...new Set(
      Array.isArray(input.favorites) ? input.favorites.filter((id) => !!productById(id)) : [],
    ),
  ];
  state.coupon = input.coupon === 'RAWQ10' ? 'RAWQ10' : '';
  return state;
}
export function readState(storage) {
  try {
    return sanitizeState(JSON.parse(storage.getItem(STORAGE_KEY)));
  } catch {
    return emptyState();
  }
}
export function saveState(storage, state) {
  try {
    storage.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state)));
    return true;
  } catch {
    return false;
  }
}
export function cartLines(cart) {
  return sanitizeState({ cart }).cart.map((row) => {
    const product = productById(row.id);
    const variant = variantById(product, row.variant);
    return {
      ...row,
      product,
      option: variant,
      key: itemKey(row.id, row.variant),
      total: variant.price * row.quantity,
    };
  });
}
export function totals(cart, coupon = '', delivery = 'shipping') {
  const lines = cartLines(cart);
  const subtotal = lines.reduce((sum, row) => sum + row.total, 0);
  const discount = coupon === 'RAWQ10' ? Math.round(subtotal * 0.1) : 0;
  const net = subtotal - discount;
  const shipping = net === 0 || delivery === 'pickup' || net >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
  return {
    subtotal,
    discount,
    net,
    shipping,
    total: net + shipping,
    count: lines.reduce((sum, line) => sum + line.quantity, 0),
    toFreeShipping: Math.max(0, FREE_SHIPPING - net),
  };
}
export function addToCart(cart, id, variant, quantity = 1) {
  const product = productById(id);
  if (!product || !variantById(product, variant) || !Number.isSafeInteger(quantity) || quantity < 1)
    return { cart, added: 0 };
  const clean = sanitizeState({ cart }).cart;
  const used = clean.filter((row) => row.id === id).reduce((sum, row) => sum + row.quantity, 0);
  const added = Math.min(quantity, Math.min(product.stock, MAX_QUANTITY) - used);
  if (added <= 0) return { cart: clean, added: 0 };
  const line = clean.find((row) => row.id === id && row.variant === variant);
  if (line) line.quantity += added;
  else clean.push({ id, variant, quantity: added });
  return { cart: clean, added };
}
export function updateQuantity(cart, key, quantity) {
  if (!Number.isSafeInteger(quantity)) return sanitizeState({ cart }).cart;
  const clean = sanitizeState({ cart }).cart;
  if (quantity <= 0) return clean.filter((row) => itemKey(row.id, row.variant) !== key);
  const current = clean.find((row) => itemKey(row.id, row.variant) === key);
  if (!current) return clean;
  const product = productById(current.id);
  const others = clean
    .filter((row) => row.id === current.id && row !== current)
    .reduce((sum, row) => sum + row.quantity, 0);
  current.quantity = Math.min(quantity, Math.min(product.stock, MAX_QUANTITY) - others);
  return clean;
}
export function filterProducts({
  category = 'all',
  query = '',
  maxPrice = Infinity,
  sort = 'featured',
  favorites,
} = {}) {
  const needle = normalizeSearch(query);
  let found = products.filter(
    (product) =>
      (category === 'all' || product.category === category) &&
      product.price <= maxPrice &&
      (!needle ||
        normalizeSearch(`${product.name} ${product.subtitle} ${product.description}`).includes(
          needle,
        )) &&
      (!favorites || favorites.includes(product.id)),
  );
  if (sort === 'price-asc') found.sort((a, b) => a.price - b.price);
  if (sort === 'price-desc') found.sort((a, b) => b.price - a.price);
  if (sort === 'name') found.sort((a, b) => a.name.localeCompare(b.name, 'ar'));
  return found;
}
export function isSaudiPhone(phone) {
  return /^(?:05\d{8}|(?:\+966|966|00966)5\d{8})$/.test(
    normalizeDigits(phone).replace(/[\s()-]/g, ''),
  );
}
export function validateCheckout(data) {
  const errors = {};
  if (String(data.name || '').trim().length < 2) errors.name = 'اكتب اسم المستلم، حرفين على الأقل.';
  if (!isSaudiPhone(data.phone || ''))
    errors.phone = 'أدخل رقم جوال سعوديًا صحيحًا، مثل 05xxxxxxxx.';
  if (data.delivery !== 'pickup') {
    if (!regions.includes(data.region)) errors.region = 'اختر المنطقة الإدارية.';
    if (String(data.district || '').trim().length < 2) errors.district = 'اكتب اسم الحي.';
    if (String(data.street || '').trim().length < 2) errors.street = 'اكتب اسم الشارع.';
    if (!/^\d{1,6}$/.test(normalizeDigits(data.building || '').trim()))
      errors.building = 'اكتب رقم المبنى بالأرقام.';
  }
  if (data.consent !== 'on') errors.consent = 'أكد معرفتك بأن هذا طلب تجريبي.';
  return errors;
}

export const ORDER_KEY = 'rawq-store:last-order:v1';
/** Store a receipt selection in session storage, never recipient or payment data. */
export function saveReceipt(storage, order) {
  const snapshot = {
    id: order.id,
    date: order.date,
    cart: order.lines.map(({ id, variant, quantity }) => ({ id, variant, quantity })),
    coupon: order.summary.discount ? 'RAWQ10' : '',
    delivery: order.delivery === 'pickup' ? 'pickup' : 'shipping',
  };
  try {
    storage.setItem(ORDER_KEY, JSON.stringify(snapshot));
    return true;
  } catch {
    return false;
  }
}
export function readReceipt(storage) {
  try {
    const data = JSON.parse(storage.getItem(ORDER_KEY));
    if (
      !data ||
      !/^RW-[A-Z0-9]{6,16}$/.test(data.id) ||
      typeof data.date !== 'string' ||
      !Number.isFinite(Date.parse(data.date))
    )
      return null;
    const cleaned = sanitizeState(data);
    if (!cleaned.cart.length) return null;
    const delivery = data.delivery === 'pickup' ? 'pickup' : 'shipping';
    return {
      id: data.id,
      date: data.date,
      lines: cartLines(cleaned.cart),
      summary: totals(cleaned.cart, cleaned.coupon, delivery),
      delivery,
    };
  } catch {
    return null;
  }
}
