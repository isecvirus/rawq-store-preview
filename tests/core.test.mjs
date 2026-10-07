import { test } from 'node:test';
import assert from 'node:assert/strict';
import { products } from '../src/catalog.js';
import {
  addToCart,
  cartLines,
  totals,
  sanitizeState,
  updateQuantity,
  itemKey,
  readState,
  saveState,
  filterProducts,
  isSaudiPhone,
  validateCheckout,
  escapeHTML,
  STORAGE_KEY,
  saveReceipt,
  readReceipt,
  ORDER_KEY,
} from '../src/core.js';
const cart = [
  { id: 'house-blend', variant: 'beans', quantity: 1 },
  { id: 'ceramic-dripper', variant: 'ivory', quantity: 1 },
  { id: 'daily-cups', variant: 'ivory', quantity: 1 },
];
test('uses catalog prices, integer halalas and a free-shipping boundary after discounts', () => {
  assert.deepEqual(totals(cart), {
    subtotal: 27600,
    discount: 0,
    net: 27600,
    shipping: 0,
    total: 27600,
    count: 3,
    toFreeShipping: 0,
  });
  assert.deepEqual(totals(cart, 'RAWQ10'), {
    subtotal: 27600,
    discount: 2760,
    net: 24840,
    shipping: 1900,
    total: 26740,
    count: 3,
    toFreeShipping: 160,
  });
  assert.equal(totals(cart, 'RAWQ10', 'pickup').total, 24840);
  assert.equal(totals([]).total, 0);
  assert.equal(totals(cart, 'FAKE').discount, 0);
});
test('merges identical variants and enforces stock across different grinds', () => {
  let result = addToCart([], 'house-blend', 'beans', 6);
  result = addToCart(result.cart, 'house-blend', 'filter', 6);
  assert.equal(result.added, 4);
  assert.equal(
    result.cart.reduce((sum, row) => sum + row.quantity, 0),
    10,
  );
  assert.equal(addToCart(result.cart, 'house-blend', 'espresso', 1).added, 0);
  assert.equal(addToCart(result.cart, 'unknown', 'beans', 1).added, 0);
  assert.equal(addToCart(result.cart, 'house-blend', 'beans', NaN).added, 0);
});
test('removes malformed, stale, fractional, negative and duplicate storage data', () => {
  const result = sanitizeState({
    cart: [
      null,
      { id: 'gone', variant: 'x', quantity: 1 },
      { id: 'daily-cups', variant: 'ivory', quantity: 2 },
      { id: 'daily-cups', variant: 'ivory', quantity: 3 },
      { id: 'house-blend', variant: 'beans', quantity: 1.3 },
      { id: 'hand-grinder', variant: 'olive', quantity: -1 },
    ],
    favorites: ['daily-cups', 'daily-cups', 'gone'],
    coupon: 'injected',
  });
  assert.deepEqual(result, {
    cart: [{ id: 'daily-cups', variant: 'ivory', quantity: 5 }],
    favorites: ['daily-cups'],
    coupon: '',
  });
  const tampered = cartLines([{ ...cart[0], price: 1, quantity: 2 }]);
  assert.equal(tampered[0].total, 11600);
});
test('quantity changes preserve other lines and respect shared stock', () => {
  const start = addToCart(
    addToCart([], 'house-blend', 'beans', 6).cart,
    'house-blend',
    'filter',
    3,
  ).cart;
  const changed = updateQuantity(start, itemKey('house-blend', 'filter'), 50);
  assert.equal(changed[1].quantity, 4);
  assert.equal(start[1].quantity, 3);
  assert.equal(updateQuantity(changed, itemKey('house-blend', 'beans'), 0).length, 1);
  assert.deepEqual(updateQuantity(changed, 'unknown', 2), changed);
});
test('storage errors and corrupted JSON do not prevent shopping', () => {
  const unavailable = {
    getItem() {
      throw new Error('blocked');
    },
    setItem() {
      throw new Error('full');
    },
  };
  assert.deepEqual(readState(unavailable), { cart: [], favorites: [], coupon: '' });
  assert.equal(saveState(unavailable, { cart }), false);
  assert.deepEqual(readState({ getItem: () => '{broken' }), {
    cart: [],
    favorites: [],
    coupon: '',
  });
  const values = new Map();
  const available = { getItem: (k) => values.get(k), setItem: (k, v) => values.set(k, v) };
  saveState(available, {
    cart,
    name: 'Private Name',
    phone: '0500000000',
    address: 'Private Street',
  });
  assert.equal(JSON.parse(values.get(STORAGE_KEY)).name, undefined);
  assert.equal(values.get(STORAGE_KEY).includes('Private'), false);
});
test('Arabic searches ignore diacritics and hamza variants; sorting is stable and non-mutating', () => {
  assert.ok(filterProducts({ query: 'روق' }).some((p) => p.id === 'house-blend'));
  assert.deepEqual(
    filterProducts({ query: 'ابريق' }).map((p) => p.id),
    filterProducts({ query: 'إِبْرِيق' }).map((p) => p.id),
  );
  assert.equal(filterProducts({ query: 'zzzzzz' }).length, 0);
  const ids = products.map((p) => p.id);
  const sorted = filterProducts({ sort: 'price-desc' });
  assert.equal(sorted[0].id, 'morning-set');
  assert.deepEqual(
    products.map((p) => p.id),
    ids,
  );
  assert.deepEqual(
    filterProducts({ favorites: ['daily-cups'] }).map((p) => p.id),
    ['daily-cups'],
  );
  assert.equal(filterProducts({ category: 'tools', maxPrice: 13000 }).length, 1);
});
test('Saudi mobile validation accepts Arabic numerals and common country code forms', () => {
  for (const phone of [
    '0500000000',
    '٠٥٠٠٠٠٠٠٠٠',
    '+966 50 000 0000',
    '00966500000000',
    '966500000000',
  ])
    assert.equal(isSaudiPhone(phone), true, phone);
  for (const phone of ['050000000', '0000000000', '+971500000000', '555', 'abc', '05000000000'])
    assert.equal(isSaudiPhone(phone), false, phone);
});
test('checkout requires shipping address only when shipping is selected', () => {
  const base = { name: 'مستخدم تجريبي', phone: '0500000000', consent: 'on' };
  assert.deepEqual(validateCheckout({ ...base, delivery: 'pickup' }), {});
  assert.deepEqual(Object.keys(validateCheckout({ ...base, delivery: 'shipping' })), [
    'region',
    'district',
    'street',
    'building',
  ]);
  assert.deepEqual(
    validateCheckout({
      ...base,
      delivery: 'shipping',
      region: 'الرياض',
      district: 'حي تجريبي',
      street: 'شارع المثال',
      building: '١٢٣٤',
    }),
    {},
  );
  assert.ok(validateCheckout({ ...base, consent: '' }).consent);
  assert.ok(validateCheckout({ ...base, name: ' ' }).name);
  assert.ok(validateCheckout({ ...base, region: 'منطقة غير موجودة' }).region);
  assert.ok(validateCheckout({ ...base, building: 'مبنى' }).building);
});
test('escapes text before injecting user-provided queries into HTML', () => {
  assert.equal(
    escapeHTML('<img src=x onerror="alert(1)">'),
    '&lt;img src=x onerror=&quot;alert(1)&quot;&gt;',
  );
});

test('receipt survives reload but contains no recipient fields or mutable client prices', () => {
  const values = new Map();
  const storage = { getItem: (k) => values.get(k), setItem: (k, v) => values.set(k, v) };
  const order = {
    id: 'RW-ABC12345',
    date: '2026-10-05T08:00:00Z',
    lines: cartLines(cart),
    summary: totals(cart, 'RAWQ10'),
    delivery: 'shipping',
    name: 'PRIVATE',
    address: 'SECRET',
  };
  assert.equal(saveReceipt(storage, order), true);
  assert.equal(values.get(ORDER_KEY).includes('PRIVATE'), false);
  assert.equal(values.get(ORDER_KEY).includes('SECRET'), false);
  assert.equal(readReceipt(storage).summary.total, 26740);
  values.set(ORDER_KEY, '{"id":"<img>","date":"invalid"}');
  assert.equal(readReceipt(storage), null);
});
