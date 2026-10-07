(() => {
  // src/catalog.js
  var categories = [
    { id: "all", name: "كل المنتجات" },
    { id: "coffee", name: "القهوة" },
    { id: "tools", name: "أدوات التحضير" },
    { id: "cups", name: "الأكواب" },
    { id: "sets", name: "المجموعات" }
  ];
  var products = [
    {
      id: "house-blend",
      name: "خلطة رَوْق",
      category: "coffee",
      subtitle: "شوكولاتة، كراميل، وبداية هادئة",
      price: 5800,
      image: "coffee",
      tag: "قهوة كل يوم",
      stock: 12,
      description: "قهوة متوازنة بقوام ناعم وإيحاءات الشوكولاتة والكراميل. مناسبة لكوبك الصباحي، سواء كنت تفضّلها سوداء أو مع الحليب.",
      details: "تحميص متوسط يوازن الحلاوة مع الحموضة الخفيفة. اختر درجة الطحن المناسبة لأداتك، أو اطلبها حبًّا كاملًا واطحنها وقت التحضير.",
      variants: [
        { id: "beans", label: "حب كامل · 250 جم", price: 5800 },
        { id: "filter", label: "طحن للترشيح · 250 جم", price: 5800 },
        { id: "espresso", label: "طحن للإسبريسو · 250 جم", price: 5800 }
      ],
      optionLabel: "اختر الطحن",
      specs: [
        ["الوزن", "250 جم"],
        ["التحميص", "متوسط"],
        ["الإيحاءات", "شوكولاتة وكراميل"],
        ["مناسبة لـ", "الترشيح والإسبريسو"]
      ],
      care: "احفظها في مكان جاف بعيدًا عن الشمس، وأغلق الكيس جيدًا بعد كل استخدام. طحن الكمية المطلوبة وقت التحضير يحافظ على نكهتها."
    },
    {
      id: "ceramic-dripper",
      name: "طقم الترشيح الخزفي",
      category: "tools",
      subtitle: "قطّارة خزفية وإبريق زجاجي",
      price: 12900,
      image: "dripper",
      tag: "اختيار رَوْق",
      stock: 8,
      description: "قطّارة خزفية بلون عاجي، مع إبريق زجاجي يتيح لك متابعة التحضير. قطعتان بسيطتان لطقس صباحي تستمتع بكل خطوة فيه.",
      details: "تساعد الأخاديد الداخلية على تدفق القهوة، وتحافظ القطّارة الخزفية على الحرارة بعد تسخينها بالماء. مناسب لتحضير كوب إلى كوبين.",
      variants: [{ id: "ivory", label: "عاجي", price: 12900 }],
      optionLabel: "اللون",
      specs: [
        ["محتويات الطقم", "قطّارة + إبريق"],
        ["سعة الإبريق", "400 مل"],
        ["خامة القطّارة", "خزف"],
        ["المرشّح المناسب", "ورقي مخروطي مقاس 02"]
      ],
      care: "سخّن القطّارة بالماء قبل التحضير. اغسل القطعتين يدويًا بإسفنجة ناعمة، وتجنب الانتقال المفاجئ من الماء الساخن إلى البارد. الفلاتر الورقية غير مشمولة."
    },
    {
      id: "gooseneck-kettle",
      name: "إبريق الصبّ الدقيق",
      category: "tools",
      subtitle: "صبّة هادئة، وتحكّم أفضل",
      price: 18900,
      image: "kettle",
      tag: "",
      stock: 6,
      description: "إبريق بفوهة رفيعة تساعدك على توزيع الماء بالتساوي. بلون زيتوني ومقبض خشبي، ليكون عمليًا وجميلًا على ركن القهوة.",
      details: "صُمّم لصبّ الماء الساخن أثناء الترشيح اليدوي. املأه من غلّاية الماء، ثم تحكّم في سرعة الصبّ بحركة بسيطة من يدك.",
      variants: [{ id: "olive", label: "زيتوني", price: 18900 }],
      optionLabel: "اللون",
      specs: [
        ["السعة", "600 مل"],
        ["الخامة", "فولاذ مطلي"],
        ["المقبض", "خشب"],
        ["الاستخدام", "للصبّ اليدوي"]
      ],
      care: "هذا الإبريق غير كهربائي، ولا يُوضع مباشرة على النار. اغسله يدويًا وجففه بعد الاستخدام، وتجنب نقع الأجزاء الخشبية."
    },
    {
      id: "daily-cups",
      name: "كوبان لوقت رائق",
      category: "cups",
      subtitle: "خزف دافئ، وتفاصيل على مهل",
      price: 8900,
      image: "cup",
      tag: "لك ولمن تحب",
      stock: 10,
      description: "كوبان بلون عاجي منقّط وملمس مطفأ، بمقبض مريح وحجم يناسب قهوتك اليومية. قطعة بسيطة تضيف دفئًا لطاولتك.",
      details: "جدران خزفية سميكة نسبيًا تمنح الكوب إحساسًا مريحًا في اليد. التفاوت الطفيف في اللون والنقاط جزء من شكل هذه المجموعة.",
      variants: [{ id: "ivory", label: "عاجي منقّط · كوبان", price: 8900 }],
      optionLabel: "المجموعة",
      specs: [
        ["العدد", "كوبان"],
        ["سعة الكوب", "180 مل"],
        ["الخامة", "خزف حجري"],
        ["اللون", "عاجي منقّط"]
      ],
      care: "اغسل الأكواب بإسفنجة ناعمة، وتجنب المنظفات الكاشطة والصدمات الحرارية. اترك القهوة تبرد قليلًا قبل الإمساك بالكوب."
    },
    {
      id: "hand-grinder",
      name: "مطحنة الرّحلة",
      category: "tools",
      subtitle: "طحنة طازجة، أينما كنت",
      price: 21900,
      image: "grinder",
      tag: "",
      stock: 4,
      description: "مطحنة يدوية صغيرة لقهوتك في البيت أو خارج المنزل. اضبط الطحن، أضف الحبوب، واستمتع برائحتها قبل أول رشفة.",
      details: "جسم معدني ذو ملمس يساعد على ثبات اليد، وذراع بمقبض خشبي. تناسب تحضير كوب واحد في كل مرة، ولا تحتاج إلى مصدر كهرباء.",
      variants: [{ id: "olive", label: "زيتوني", price: 21900 }],
      optionLabel: "اللون",
      specs: [
        ["السعة", "20 جم من الحبوب"],
        ["التشغيل", "يدوي"],
        ["الطحن", "قابل للتعديل"],
        ["مناسبة لـ", "الترشيح اليدوي"]
      ],
      care: "نظّف الأجزاء الداخلية بفرشاة جافة. لا تغمر المطحنة في الماء. استخدم حبوب القهوة فقط، ولا تشدّ آلية الطحن وهي فارغة."
    },
    {
      id: "morning-set",
      name: "مجموعة الصباح",
      category: "sets",
      subtitle: "ركن قهوتك يبدأ من هنا",
      price: 34900,
      image: "hero",
      tag: "معًا أجمل",
      stock: 3,
      description: "مجموعة متناسقة تجمع طقم الترشيح الخزفي وإبريق الصبّ وكوبين. كل ما تحتاجه لبدء ركن قهوتك، أو هدية لمن يحب التحضير على مهل.",
      details: "اخترنا قطعًا تعمل معًا وتبدو جميلة على طاولة واحدة. أضف إليها قهوتك المفضلة، وفلاتر ورقية مقاس 02، وماءً ساخنًا لتبدأ.",
      variants: [{ id: "complete", label: "المجموعة الكاملة", price: 34900 }],
      optionLabel: "المحتويات",
      specs: [
        ["الترشيح", "قطّارة + إبريق زجاجي"],
        ["الصبّ", "إبريق 600 مل"],
        ["الأكواب", "كوبان 180 مل"],
        ["غير مشمول", "القهوة والفلاتر"]
      ],
      care: "يُنصح بغسل القطع يدويًا وتجفيفها جيدًا. إبريق الصبّ غير مخصص للنار المباشرة. راجع إرشادات كل قطعة قبل الاستخدام."
    }
  ];
  var productById = (id) => products.find((product) => product.id === id);
  var variantById = (product, id) => product?.variants.find((variant) => variant.id === id);
  var articles = [
    {
      id: "first-cup",
      title: "كوبك الأول بالترشيح",
      tag: "دليل البداية",
      time: "4 دقائق",
      image: "brew-guide",
      summary: "خطوات قليلة تجعل تحضير القهوة عادة تستمتع بها.",
      sections: [
        [
          "ابدأ بنسبة بسيطة",
          "استخدم 15 جم من القهوة مقابل 240 مل من الماء كنقطة بداية. النسبة قابلة للتعديل حسب ذوقك؛ جرّب أولًا ثم غيّر عاملًا واحدًا كل مرة."
        ],
        [
          "جهّز الأدوات",
          "ضع المرشّح الورقي داخل القطّارة واشطفه بالماء الساخن، ثم تخلّص من ماء الشطف. هذه الخطوة تسخّن الأدوات وتخفف طعم الورق."
        ],
        [
          "دع القهوة تتفتح",
          "أضف القهوة المطحونة، ثم اسكب نحو 30 مل من الماء لتبتلّ بالكامل. انتظر 30 ثانية قبل أن تتابع الصبّ."
        ],
        [
          "صبّ بهدوء",
          "أكمل كمية الماء على دفعتين أو ثلاث بحركات دائرية صغيرة. تجنب الصبّ على الورق مباشرة. إذا كان الكوب حادًا جدًا جرّب طحنًا أنعم قليلًا، وإذا كان مرًّا جرّب طحنًا أخشن."
        ]
      ]
    },
    {
      id: "grind-size",
      title: "الطحنة تصنع فرقًا",
      tag: "افهم قهوتك",
      time: "3 دقائق",
      image: "grind-guide",
      summary: "كيف تغيّر درجة الطحن مذاق الكوب، ومتى تعدّلها؟",
      sections: [
        [
          "لماذا نهتم بالطحن؟",
          "كلما صغر حجم حبيبات القهوة زادت مساحة ملامستها للماء. لهذا تتأثر سرعة الاستخلاص والطعم بدرجة الطحن، حتى عند استخدام القهوة نفسها."
        ],
        [
          "ابدأ من المنتصف",
          "للترشيح اليدوي، ابدأ بطحن متوسط قريب من ملمس السكر الخشن. تختلف إعدادات المطاحن، لذلك لا تعتمد على رقم موحّد بينها."
        ],
        [
          "غيّر شيئًا واحدًا",
          "ثبّت كمية القهوة والماء وطريقة الصبّ، ثم عدّل الطحن خطوة واحدة. سجّل ما أحببته في الكوب لتصل إلى إعداد يناسبك."
        ],
        [
          "اطحن وقت الحاجة",
          "احتفظ بالقهوة حبًّا كاملًا واطحن الكمية التي ستستخدمها فقط. نظافة المطحنة تساعد أيضًا على تجنب نكهة الزيوت القديمة."
        ]
      ]
    },
    {
      id: "coffee-corner",
      title: "ركن صغير، مزاج كبير",
      tag: "في البيت",
      time: "3 دقائق",
      image: "hero",
      summary: "جهّز ركنًا عمليًا للقهوة، بالقطع التي تستخدمها فعلًا.",
      sections: [
        [
          "ابدأ بعادتك",
          "فكّر في الكوب الذي تحب شربه كل يوم. إذا كنت تفضّل الترشيح، ابدأ بقطّارة وإبريق وميزان، وأضف بقية الأدوات تدريجيًا حسب حاجتك."
        ],
        [
          "اجعل الأشياء قريبة",
          "رتّب القهوة والفلاتر والأكواب بحيث تصل إليها بسهولة. صينية صغيرة تساعد على جمع الأدوات وحماية سطح الطاولة."
        ],
        [
          "اترك مساحة للتحضير",
          "وجود مساحة فارغة للعمل أهم من تكديس الأدوات. أبعد الأسلاك عن الماء، واترك مكانًا آمنًا للإبريق الساخن."
        ],
        [
          "اختم بالتنظيف",
          "شطف الأدوات وتجفيفها بعد كل استخدام يجعل الركن جاهزًا لليوم التالي. خزّن القهوة بعيدًا عن الحرارة والرطوبة."
        ]
      ]
    }
  ];

  // src/images.js
  var imagePlaceholder = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="1" height="1"/%3E';
  function startImages() {
    if (document.documentElement.dataset.imagesReady) return;
    document.documentElement.dataset.imagesReady = "true";
    const selector = "img[data-src]";
    const observed = /* @__PURE__ */ new WeakSet();
    const load = (img) => {
      if (img.dataset.srcset) img.setAttribute("srcset", img.dataset.srcset);
      img.setAttribute("src", img.dataset.src);
    };
    const observer = typeof IntersectionObserver === "function" ? new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting && entry.target.isConnected) {
            load(entry.target);
            observer.unobserve(entry.target);
          }
        }
      },
      { rootMargin: "240px 0px", threshold: 0 }
    ) : null;
    function visit(root, callback) {
      if (root.nodeType !== 1) return;
      if (root.matches(selector)) callback(root);
      root.querySelectorAll(selector).forEach(callback);
    }
    function observe(img) {
      if (observed.has(img) || !img.isConnected) return;
      observed.add(img);
      if (observer) observer.observe(img);
      else load(img);
    }
    visit(document.documentElement, observe);
    new MutationObserver((records) => {
      for (const record of records) {
        record.removedNodes.forEach(
          (node) => visit(node, (img) => {
            observer?.unobserve(img);
            observed.delete(img);
          })
        );
        record.addedNodes.forEach((node) => visit(node, observe));
      }
    }).observe(document.documentElement, { childList: true, subtree: true });
  }

  // src/checkout.js
  var regions = [
    "الرياض",
    "مكة المكرمة",
    "المدينة المنورة",
    "القصيم",
    "المنطقة الشرقية",
    "عسير",
    "تبوك",
    "حائل",
    "الحدود الشمالية",
    "جازان",
    "نجران",
    "الباحة",
    "الجوف"
  ];
  var checkoutDefaults = {
    name: "عميل تجريبي",
    phone: "0500000000",
    region: "الرياض",
    district: "حي تجريبي",
    street: "شارع المثال",
    building: "1234"
  };

  // src/core.js
  var STORAGE_KEY = "rawq-store:v1";
  var FREE_SHIPPING = 25e3;
  var SHIPPING_FEE = 1900;
  var MAX_QUANTITY = 10;
  var normalizeDigits = (value) => String(value).replace(/[٠-٩]/g, (char) => String("٠١٢٣٤٥٦٧٨٩".indexOf(char))).replace(/[۰-۹]/g, (char) => String("۰۱۲۳۴۵۶۷۸۹".indexOf(char)));
  var normalizeSearch = (value) => String(value).normalize("NFKD").replace(/[\u064B-\u065F\u0670\u0640]/g, "").replace(/[أإآ]/g, "ا").replace(/ى/g, "ي").toLocaleLowerCase("ar").trim();
  var escapeHTML = (value) => String(value).replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]
  );
  var itemKey = (id, variant) => `${id}:${variant}`;
  var emptyState = () => ({ cart: [], favorites: [], coupon: "" });
  function sanitizeState(input) {
    const state2 = emptyState();
    if (!input || typeof input !== "object") return state2;
    const totals2 = /* @__PURE__ */ new Map();
    for (const row of Array.isArray(input.cart) ? input.cart.slice(0, 100) : []) {
      if (!row || typeof row !== "object") continue;
      const product = productById(row.id);
      if (!product || !variantById(product, row.variant) || !Number.isSafeInteger(row.quantity) || row.quantity <= 0)
        continue;
      const remaining = Math.min(product.stock, MAX_QUANTITY) - (totals2.get(row.id) || 0);
      const quantity = Math.min(row.quantity, remaining);
      if (quantity <= 0) continue;
      const duplicate = state2.cart.find((line) => line.id === row.id && line.variant === row.variant);
      if (duplicate) duplicate.quantity += quantity;
      else state2.cart.push({ id: row.id, variant: row.variant, quantity });
      totals2.set(row.id, (totals2.get(row.id) || 0) + quantity);
    }
    state2.favorites = [
      ...new Set(
        Array.isArray(input.favorites) ? input.favorites.filter((id) => !!productById(id)) : []
      )
    ];
    state2.coupon = input.coupon === "RAWQ10" ? "RAWQ10" : "";
    return state2;
  }
  function readState(storage2) {
    try {
      return sanitizeState(JSON.parse(storage2.getItem(STORAGE_KEY)));
    } catch {
      return emptyState();
    }
  }
  function saveState(storage2, state2) {
    try {
      storage2.setItem(STORAGE_KEY, JSON.stringify(sanitizeState(state2)));
      return true;
    } catch {
      return false;
    }
  }
  function cartLines(cart) {
    return sanitizeState({ cart }).cart.map((row) => {
      const product = productById(row.id);
      const variant = variantById(product, row.variant);
      return {
        ...row,
        product,
        option: variant,
        key: itemKey(row.id, row.variant),
        total: variant.price * row.quantity
      };
    });
  }
  function totals(cart, coupon = "", delivery = "shipping") {
    const lines = cartLines(cart);
    const subtotal = lines.reduce((sum, row) => sum + row.total, 0);
    const discount = coupon === "RAWQ10" ? Math.round(subtotal * 0.1) : 0;
    const net = subtotal - discount;
    const shipping = net === 0 || delivery === "pickup" || net >= FREE_SHIPPING ? 0 : SHIPPING_FEE;
    return {
      subtotal,
      discount,
      net,
      shipping,
      total: net + shipping,
      count: lines.reduce((sum, line) => sum + line.quantity, 0),
      toFreeShipping: Math.max(0, FREE_SHIPPING - net)
    };
  }
  function addToCart(cart, id, variant, quantity = 1) {
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
  function updateQuantity(cart, key, quantity) {
    if (!Number.isSafeInteger(quantity)) return sanitizeState({ cart }).cart;
    const clean = sanitizeState({ cart }).cart;
    if (quantity <= 0) return clean.filter((row) => itemKey(row.id, row.variant) !== key);
    const current = clean.find((row) => itemKey(row.id, row.variant) === key);
    if (!current) return clean;
    const product = productById(current.id);
    const others = clean.filter((row) => row.id === current.id && row !== current).reduce((sum, row) => sum + row.quantity, 0);
    current.quantity = Math.min(quantity, Math.min(product.stock, MAX_QUANTITY) - others);
    return clean;
  }
  function filterProducts({
    category = "all",
    query = "",
    maxPrice = Infinity,
    sort = "featured",
    favorites
  } = {}) {
    const needle = normalizeSearch(query);
    let found = products.filter(
      (product) => (category === "all" || product.category === category) && product.price <= maxPrice && (!needle || normalizeSearch(`${product.name} ${product.subtitle} ${product.description}`).includes(
        needle
      )) && (!favorites || favorites.includes(product.id))
    );
    if (sort === "price-asc") found.sort((a, b) => a.price - b.price);
    if (sort === "price-desc") found.sort((a, b) => b.price - a.price);
    if (sort === "name") found.sort((a, b) => a.name.localeCompare(b.name, "ar"));
    return found;
  }
  function isSaudiPhone(phone) {
    return /^(?:05\d{8}|(?:\+966|966|00966)5\d{8})$/.test(
      normalizeDigits(phone).replace(/[\s()-]/g, "")
    );
  }
  function validateCheckout(data) {
    const errors = {};
    if (String(data.name || "").trim().length < 2) errors.name = "اكتب اسم المستلم، حرفين على الأقل.";
    if (!isSaudiPhone(data.phone || ""))
      errors.phone = "أدخل رقم جوال سعوديًا صحيحًا، مثل 05xxxxxxxx.";
    if (data.delivery !== "pickup") {
      if (!regions.includes(data.region)) errors.region = "اختر المنطقة الإدارية.";
      if (String(data.district || "").trim().length < 2) errors.district = "اكتب اسم الحي.";
      if (String(data.street || "").trim().length < 2) errors.street = "اكتب اسم الشارع.";
      if (!/^\d{1,6}$/.test(normalizeDigits(data.building || "").trim()))
        errors.building = "اكتب رقم المبنى بالأرقام.";
    }
    if (data.consent !== "on") errors.consent = "أكد معرفتك بأن هذا طلب تجريبي.";
    return errors;
  }
  var ORDER_KEY = "rawq-store:last-order:v1";
  function saveReceipt(storage2, order) {
    const snapshot = {
      id: order.id,
      date: order.date,
      cart: order.lines.map(({ id, variant, quantity }) => ({ id, variant, quantity })),
      coupon: order.summary.discount ? "RAWQ10" : "",
      delivery: order.delivery === "pickup" ? "pickup" : "shipping"
    };
    try {
      storage2.setItem(ORDER_KEY, JSON.stringify(snapshot));
      return true;
    } catch {
      return false;
    }
  }
  function readReceipt(storage2) {
    try {
      const data = JSON.parse(storage2.getItem(ORDER_KEY));
      if (!data || !/^RW-[A-Z0-9]{6,16}$/.test(data.id) || typeof data.date !== "string" || !Number.isFinite(Date.parse(data.date)))
        return null;
      const cleaned = sanitizeState(data);
      if (!cleaned.cart.length) return null;
      const delivery = data.delivery === "pickup" ? "pickup" : "shipping";
      return {
        id: data.id,
        date: data.date,
        lines: cartLines(cleaned.cart),
        summary: totals(cleaned.cart, cleaned.coupon, delivery),
        delivery
      };
    } catch {
      return null;
    }
  }

  // src/views.js
  var icon = (name, cls = "") => `<svg class="icon ${cls}" aria-hidden="true"><use href="#icon-${name}"></use></svg>`;
  var number = (value) => new Intl.NumberFormat("ar-SA-u-nu-latn").format(value);
  var money = (halalas) => `<span class="price">${new Intl.NumberFormat("ar-SA-u-nu-latn", { maximumFractionDigits: 2 }).format(halalas / 100)}<span class="currency">ر.س</span></span>`;
  var categoryName = (id) => categories.find((cat) => cat.id === id)?.name || "";
  function image(name, alt, { cls = "", sizes = "(max-width: 700px) 50vw, 30vw" } = {}) {
    const wide = ["hero", "brew-guide", "grind-guide"].includes(name);
    return `<img class="${wide ? "image-wide " : ""}${cls}" src="${escapeHTML(imagePlaceholder)}" data-src="assets/images/${name}.webp" data-srcset="assets/images/${name}-small.webp 500w, assets/images/${name}.webp ${wide ? "1536" : "1000"}w" sizes="${sizes}" alt="${escapeHTML(alt)}" width="${wide ? 1536 : 1e3}" height="${wide ? 1024 : 1e3}" loading="lazy" decoding="async">`;
  }
  var breadcrumb = (items) => `<nav class="breadcrumbs" aria-label="مسار التنقل"><a href="#/">الرئيسية</a>${items.map(([name, href]) => `${icon("chevron-left")}${href ? `<a href="${href}">${escapeHTML(name)}</a>` : `<span aria-current="page">${escapeHTML(name)}</span>`}`).join("")}</nav>`;
  function favoriteButton(product, state2) {
    const saved = state2.favorites.includes(product.id);
    return `<button class="icon-button favorite-button" data-action="favorite" data-id="${product.id}" aria-label="${saved ? "إزالة" : "حفظ"} ${escapeHTML(product.name)} ${saved ? "من" : "في"} المفضلة" aria-pressed="${saved}">${icon("heart")}</button>`;
  }
  function productCard(product, state2) {
    return `<article class="product-card" data-product-card="${product.id}">
    ${favoriteButton(product, state2)}
    <a class="product-media" href="#/product/${product.id}" aria-label="عرض ${escapeHTML(product.name)}">${product.tag ? `<span class="product-badge">${product.tag}</span>` : ""}${image(product.image, product.name)}</a>
    <div class="product-info"><div class="product-category">${categoryName(product.category)}</div><h3><a href="#/product/${product.id}">${product.name}</a></h3><p>${product.subtitle}</p>
      <div class="product-bottom">${money(product.price)}<button class="quick-add" data-action="quick-add" data-id="${product.id}" aria-label="${product.variants.length > 1 ? "اختر خيارات" : "أضف للسلة:"} ${product.name}">${product.variants.length > 1 ? "اختر الطحن" : "أضف للسلة"} ${icon("plus")}</button></div>
    </div></article>`;
  }
  function emptyState2(title, text, { symbol = "shopping-bag", href = "#/shop", label = "تصفّح المنتجات" } = {}) {
    return `<div class="empty-state">${icon(symbol)}<h2>${escapeHTML(title)}</h2><p>${escapeHTML(text)}</p><a class="btn small" href="${href}">${label} ${icon("arrow-left")}</a></div>`;
  }
  function articleCard(article) {
    return `<a class="article-card" href="#/journal/${article.id}">${image(article.image, article.title, { sizes: "(max-width:700px) 100vw, 33vw" })}<div class="article-meta"><span>${article.tag}</span><span>${article.time} قراءة</span></div><h3>${article.title}${icon("arrow-up-left")}</h3><p>${article.summary}</p></a>`;
  }
  function homeView(state2) {
    return `<div class="container">
    <section class="hero" aria-labelledby="hero-title"><div class="hero-copy"><div class="eyebrow">للتفاصيل الصغيرة، وقتها</div><h1 id="hero-title">خذ وقتك.<br><span>واضبط قهوتك.</span></h1><p>قهوة على ذوقك، وأدوات تختارها بعناية.<br>كل ما يحتاجه ركنك، في مكان واحد.</p><div class="hero-actions"><a class="btn" href="#/shop">اكتشف المجموعة ${icon("arrow-left")}</a><a class="text-link" href="#/journal/first-cup">حضّر كوبك الأول</a></div><div class="hero-footnote">${icon("coffee")}من أول طحنة، إلى آخر رشفة.</div></div>
    <div class="hero-visual">${image("hero", "ركن قهوة بضوء الصباح، يضم قطّارة خزفية وإبريق صبّ وكوبين", { sizes: "(max-width:700px) 100vw, 55vw" })}<span class="hero-number">صباح على مهل / 01</span><div class="image-label"><span>أشياء بسيطة. صباح مختلف.</span><a href="#/product/morning-set" aria-label="اكتشف مجموعة الصباح">${icon("arrow-up-left")}</a></div></div></section>
    <div class="benefits"><div class="benefit">${icon("truck")}<div><strong>الشحن علينا</strong><span>للطلبات من 250 ر.س</span></div></div><div class="benefit">${icon("coffee")}<div><strong>لروتينك اليومي</strong><span>قهوة وأدوات تتكامل معًا</span></div></div><div class="benefit">${icon("book-open")}<div><strong>معك من أول كوب</strong><span>أدلة بسيطة لتحضير أفضل</span></div></div></div>
    <section class="section" aria-labelledby="featured-title"><div class="section-head"><div><div class="eyebrow">ركنك، على ذوقك</div><h2 id="featured-title">تفاصيل تستحق مكانها.</h2><p>ابدأ بقطعة تحبها، وأكمل ركنك على مهل.</p></div><a class="text-link" href="#/shop">كل المنتجات ${icon("arrow-left")}</a></div>
      <div class="category-pills" aria-label="تصفية المنتجات المختارة">${categories.map((cat) => `<button class="pill ${cat.id === "all" ? "active" : ""}" data-action="home-category" data-category="${cat.id}" aria-pressed="${cat.id === "all"}">${cat.name}</button>`).join("")}</div>
      <div class="product-grid" id="featured-grid">${products.slice(0, 4).map((p) => productCard(p, state2)).join("")}</div><div class="sr-only" id="featured-status" role="status"></div>
    </section>
    <section class="story-strip"><div class="story-content"><div class="eyebrow">حكاية كل صباح</div><h2>ابدأ يومك،<br>على مهل.</h2><p>صوت الطحن، رائحة القهوة، وأول رشفة.<br>نحب هذه التفاصيل، ونختار لها أدوات تجعل التحضير جزءًا جميلًا من يومك.</p><a class="text-link" href="#/about">تعرّف على رَوْق ${icon("arrow-left")}</a></div><div class="story-photo">${image("cup", "كوبان من الخزف العاجي، أحدهما مملوء بالقهوة", { sizes: "(max-width:700px) 100vw, 50vw" })}</div></section>
    <section class="section" aria-labelledby="journal-heading"><div class="section-head"><div><div class="eyebrow">جرّب، وتعلّم، واستمتع</div><h2 id="journal-heading">بين القهوة والتفاصيل.</h2></div><a class="text-link" href="#/journal">دليل القهوة ${icon("arrow-left")}</a></div><div class="articles-grid">${articles.map(articleCard).join("")}</div></section>
    <div class="closing-line"><p>لكل يوم، لحظة رَوْق.</p>${icon("coffee")}</div>
  </div>`;
  }
  function shopView(state2, params = new URLSearchParams(), favoritesOnly = false) {
    const category = categories.some((c) => c.id === params.get("category")) ? params.get("category") : "all";
    const query = (params.get("q") || "").slice(0, 120);
    const sort = ["price-asc", "price-desc", "name"].includes(params.get("sort")) ? params.get("sort") : "featured";
    const rawMax = Number(params.get("max") || 400);
    const maxPrice = Number.isFinite(rawMax) ? Math.min(400, Math.max(50, rawMax)) : 400;
    const found = filterProducts({
      category,
      query,
      sort,
      maxPrice: maxPrice * 100,
      ...favoritesOnly ? { favorites: state2.favorites } : {}
    });
    if (favoritesOnly)
      return `<div class="container">${breadcrumb([["المفضلة"]])}<div class="page-heading"><div class="eyebrow">لوقت لاحق</div><h1>أشياء على ذوقك.</h1><p>القطع التي حفظتها، تجدها هنا متى ما أردت.</p></div><section class="section" style="padding-top:0">${found.length ? `<div class="product-grid">${found.map((p) => productCard(p, state2)).join("")}</div>` : emptyState2("المفضلة تنتظر اختياراتك", "اضغط على القلب بجانب أي منتج لتجده هنا.", { symbol: "heart" })}</section></div>`;
    return `<div class="container">${breadcrumb([["المتجر"]])}<div class="page-heading"><div class="eyebrow">كل ما يحتاجه ركنك</div><h1>اختر تفاصيل يومك.</h1><p>من القهوة إلى آخر قطعة في ركنك. أشياء تحب استخدامها كل يوم.</p></div>
  <div class="shop-layout"><aside class="shop-sidebar" id="shop-filters" aria-label="تصفية المنتجات"><div class="filter-search"><label class="sr-only" for="catalog-query">ابحث في المنتجات</label><input id="catalog-query" type="search" placeholder="ابحث عن منتج…" value="${escapeHTML(query)}" maxlength="120" autocomplete="off">${icon("search")}</div><div class="filter-group"><h2>تسوّق حسب القسم</h2>${categories.map((cat) => `<button class="filter-category ${category === cat.id ? "active" : ""}" data-action="category" data-category="${cat.id}" aria-pressed="${category === cat.id}"><span>${cat.name}</span><small>${number(cat.id === "all" ? products.length : products.filter((p) => p.category === cat.id).length)}</small></button>`).join("")}</div>
    <div class="filter-group"><label for="price-range">الحد الأعلى للسعر</label><input id="price-range" type="range" min="50" max="400" step="10" value="${maxPrice}" aria-valuetext="${number(maxPrice)} ريال"><div class="range-labels"><span>50 ر.س</span><output id="range-output" for="price-range">${number(maxPrice)} ر.س</output></div></div><button class="reset-filters" data-action="reset-filters">مسح التصفية</button><div class="filter-note">${icon("coffee")}<h3>أول مرة تحضّر؟</h3><p>ابدأ بخطوات بسيطة، واضبط الكوب على ذوقك.</p><a class="text-link" href="#/journal/first-cup">دليل كوبك الأول ${icon("arrow-left")}</a></div></aside>
    <section aria-label="المنتجات"><div class="shop-toolbar"><button class="mobile-filter-toggle" data-action="filter-toggle" aria-expanded="false" aria-controls="shop-filters">${icon("sliders-horizontal")}التصفية</button><span class="results-count" id="results-count" role="status">${number(found.length)} منتجات</span><label class="sort-field" for="sort-select">الترتيب حسب <select id="sort-select"><option value="featured" ${sort === "featured" ? "selected" : ""}>اختيارات رَوْق</option><option value="price-asc" ${sort === "price-asc" ? "selected" : ""}>السعر: من الأقل</option><option value="price-desc" ${sort === "price-desc" ? "selected" : ""}>السعر: من الأعلى</option><option value="name" ${sort === "name" ? "selected" : ""}>الاسم</option></select></label></div><div id="active-query">${query ? `<div class="active-query">نتائج البحث عن «${escapeHTML(query)}» <button class="icon-button" data-action="clear-query" aria-label="مسح البحث">${icon("x")}</button></div>` : ""}</div><div class="product-grid shop-grid" id="shop-grid">${found.length ? found.map((p) => productCard(p, state2)).join("") : noProducts()}</div></section>
  </div></div>`;
  }
  var noProducts = () => `<div class="empty-state">${icon("search")}<h2>ما لقينا نتيجة مطابقة.</h2><p>جرّب كلمة أقصر، أو غيّر القسم ونطاق السعر.</p><button class="btn secondary small" data-action="reset-filters">عرض كل المنتجات</button></div>`;
  function quantityControl(quantity, { key = "", product = false, max = 10 } = {}) {
    return `<div class="quantity-control" ${product ? 'aria-label="كمية المنتج"' : ""}><button type="button" data-action="${product ? "product-minus" : "cart-minus"}" data-key="${key}" aria-label="تقليل الكمية" ${quantity <= 1 ? "disabled" : ""}>${icon("minus")}</button><output ${product ? 'id="product-quantity"' : ""} aria-label="الكمية">${number(quantity)}</output><button type="button" data-action="${product ? "product-plus" : "cart-plus"}" data-key="${key}" aria-label="زيادة الكمية" ${quantity >= max ? "disabled" : ""}>${icon("plus")}</button></div>`;
  }
  function productView(product, state2) {
    if (!product) return notFound();
    const related = products.filter((p) => p.id !== product.id).sort(
      (a, b) => Number(b.category === product.category) - Number(a.category === product.category)
    ).slice(0, 4);
    return `<div class="container">${breadcrumb([["المتجر", "#/shop"], [categoryName(product.category), `#/shop?category=${product.category}`], [product.name]])}<section class="product-detail"><div class="detail-visual">${image(product.image, product.name, { sizes: "(max-width:700px) 100vw, 50vw" })}${favoriteButton(product, state2)}<span>تعرّف على التفاصيل واختر ما يناسب ركنك.</span></div><div class="detail-copy"><div class="eyebrow">${categoryName(product.category)}</div><h1>${product.name}</h1><p class="detail-subtitle">${product.subtitle}</p><div class="detail-price" id="detail-price">${money(product.price)}</div><span class="stock-note">متوفر في المجموعة</span><p class="detail-description">${product.description}</p>
    <form id="product-form" data-product="${product.id}"><fieldset class="option-field"><legend>${product.optionLabel}</legend><div class="variant-options">${product.variants.map((option, i) => `<label class="variant-option"><input type="radio" name="variant" value="${option.id}" ${i === 0 ? "checked" : ""}><span>${option.label}</span></label>`).join("")}</div></fieldset><div class="buy-row">${quantityControl(1, { product: true, max: Math.min(product.stock, MAX_QUANTITY) })}<button type="submit" class="btn">${icon("shopping-bag")} أضف للسلة</button></div></form>
    <div class="detail-perks"><span>${icon("truck")}شحن مجاني من 250 ر.س</span><span>${icon("package")}توصيل داخل السعودية</span></div><div class="accordion"><details open><summary>عن المنتج ${icon("chevron-down")}</summary><p>${product.details}</p><dl class="spec-list">${product.specs.map(([title, value]) => `<div><dt>${title}</dt><dd>${value}</dd></div>`).join("")}</dl></details><details><summary>الاستخدام والعناية ${icon("chevron-down")}</summary><p>${product.care}</p></details><details><summary>التوصيل والاستلام ${icon("chevron-down")}</summary><p>خيارات الشحن والاستلام متاحة للتجربة في صفحة الطلب. الشحن 19 ر.س، ومجاني عندما تبلغ قيمة المنتجات بعد الخصم 250 ر.س. لا يتم تنفيذ توصيل فعلي في هذه النسخة.</p></details></div>
    </div></section><section class="section related"><div class="section-head"><div><div class="eyebrow">تكمل بعض</div><h2>قد تعجبك أيضًا.</h2></div><a class="text-link" href="#/shop">كل المنتجات ${icon("arrow-left")}</a></div><div class="product-grid">${related.map((p) => productCard(p, state2)).join("")}</div></section></div>`;
  }
  function summaryRows(summary) {
    return `<div class="summary-row"><span>قيمة المنتجات</span>${money(summary.subtotal)}</div>${summary.discount ? `<div class="summary-row discount"><span>خصم 10٪</span><span>− ${money(summary.discount)}</span></div>` : ""}<div class="summary-row"><span>التوصيل</span><span>${summary.shipping ? money(summary.shipping) : "مجاني"}</span></div><div class="summary-row summary-total"><span>الإجمالي</span>${money(summary.total)}</div>`;
  }
  function cartView(state2) {
    const summary = totals(state2.cart, state2.coupon);
    const lines = cartLines(state2.cart);
    const head = `<div class="drawer-head"><h2 id="cart-title">سلة التسوق <small>${number(summary.count)} قطع</small></h2><button class="icon-button" data-action="close-dialog" aria-label="أغلق السلة">${icon("x")}</button></div>`;
    if (!lines.length)
      return `${head}${emptyState2("ركنك ينتظر أول قطعة.", "تصفّح المجموعة وأضف ما يناسب ذوقك.")}`;
    return `${head}<div class="shipping-progress"><p>${summary.toFreeShipping ? `باقي ${money(summary.toFreeShipping)} ويصير الشحن علينا.` : "وصلت للحد المطلوب، الشحن علينا!"} ${icon("truck")}</p><div class="progress-track"><div class="progress-fill" style="width:${Math.min(100, summary.net / FREE_SHIPPING * 100)}%"></div></div></div><div class="cart-items">${lines.map((row) => {
      const used = lines.filter((r) => r.id === row.id).reduce((sum, r) => sum + r.quantity, 0);
      const max = Math.min(row.product.stock, MAX_QUANTITY) - used + row.quantity;
      return `<article class="cart-item"><a href="#/product/${row.id}">${image(row.product.image, row.product.name, { sizes: "90px" })}</a><div><div class="cart-item-top"><h3><a href="#/product/${row.id}">${row.product.name}</a></h3><button class="remove-item" data-action="cart-remove" data-key="${row.key}" aria-label="إزالة ${row.product.name} من السلة">${icon("x")}</button></div><p>${row.option.label}</p><div class="cart-item-bottom">${quantityControl(row.quantity, { key: row.key, max })}${money(row.total)}</div></div></article>`;
    }).join(
      ""
    )}</div><div class="drawer-bottom">${summaryRows(summary)}<a class="btn full" href="#/checkout">إتمام الطلب ${icon("arrow-left")}</a><p>تجربة عرض · لن يُخصم أي مبلغ</p></div>`;
  }
  function checkoutSummary(state2, delivery = "shipping") {
    return `<h2>ملخص طلبك</h2><div class="order-summary-items">${cartLines(state2.cart).map(
      (row) => `<div class="cart-item">${image(row.product.image, row.product.name, { sizes: "70px" })}<div><h3>${row.product.name}</h3><p>${row.option.label} · الكمية: ${number(row.quantity)}</p>${money(row.total)}</div></div>`
    ).join(
      ""
    )}</div><form class="coupon-form" id="coupon-form"><label for="coupon">رمز الخصم</label><div class="coupon-input-row"><input id="coupon" name="coupon" type="text" dir="ltr" maxlength="30" placeholder="RAWQ10" value="${state2.coupon || "RAWQ10"}" autocomplete="off"><button class="btn small secondary" type="submit">تطبيق</button></div><div class="coupon-note" id="coupon-message" role="status">${state2.coupon ? `تم تطبيق خصم 10٪. <button type="button" class="reset-filters" data-action="remove-coupon">إزالة</button>` : "جرّب الرمز <code>RAWQ10</code> للحصول على خصم 10٪."}</div></form><div id="checkout-totals">${summaryRows(totals(state2.cart, state2.coupon, delivery))}</div><p class="coupon-note">الأسعار وخيارات التوصيل توضيحية لهذه التجربة.</p>`;
  }
  function checkoutView(state2) {
    if (!state2.cart.length)
      return `<div class="container">${breadcrumb([["إتمام الطلب"]])}${emptyState2("سلتك فارغة حاليًا.", "أضف منتجًا واحدًا على الأقل قبل الانتقال إلى الطلب.")}</div>`;
    return `<div class="container">${breadcrumb([["المتجر", "#/shop"], ["إتمام الطلب"]])}<div class="page-heading"><div class="eyebrow">الخطوة الأخيرة</div><h1>قريب من ركنك.</h1><p>راجع اختياراتك وأكمل تجربة الطلب.</p></div><div class="demo-notice">${icon("info")}<p><strong>هذا طلب تجريبي.</strong> الحقول جاهزة ببيانات تجريبية يمكنك تعديلها. لا دفع أو توصيل فعلي، ولا تُرسل بياناتك.</p></div><div class="checkout-layout"><form id="checkout-form" class="checkout-form" novalidate autocomplete="off">
    <section class="form-panel"><h2><span class="step-number">1</span> بيانات المستلم</h2><div class="form-grid"><div class="field"><label for="customer-name">اسم المستلم <span aria-hidden="true">*</span></label><input id="customer-name" name="name" value="${escapeHTML(checkoutDefaults.name)}" placeholder="اسم تجريبي" required minlength="2" maxlength="80" autocomplete="off" aria-describedby="error-name"><span class="field-error" id="error-name"></span></div><div class="field"><label for="customer-phone">رقم الجوال <span aria-hidden="true">*</span></label><input id="customer-phone" name="phone" value="${checkoutDefaults.phone}" type="tel" inputmode="tel" placeholder="05xxxxxxxx" dir="ltr" required maxlength="20" autocomplete="off" aria-describedby="error-phone"><span class="field-error" id="error-phone"></span></div></div></section>
    <section class="form-panel"><h2><span class="step-number">2</span> طريقة الاستلام</h2><fieldset class="delivery-options"><legend class="sr-only">اختر طريقة الاستلام</legend><label class="radio-card"><input type="radio" name="delivery" value="shipping" checked><span><strong>توصيل إلى عنوانك</strong><small>19 ر.س · مجاني من 250 ر.س</small></span></label><label class="radio-card"><input type="radio" name="delivery" value="pickup"><span><strong>استلام من المتجر</strong><small>مجاني · خيار تجريبي</small></span></label></fieldset><div id="address-fields" class="form-grid"><div class="field"><label for="region">المنطقة الإدارية <span aria-hidden="true">*</span></label><select id="region" name="region" required aria-describedby="error-region"><option value="">اختر المنطقة</option>${regions.map((region) => `<option value="${region}" ${region === checkoutDefaults.region ? "selected" : ""}>${region}</option>`).join("")}</select><span class="field-error" id="error-region"></span></div><div class="field"><label for="district">الحي <span aria-hidden="true">*</span></label><input id="district" name="district" value="${escapeHTML(checkoutDefaults.district)}" placeholder="اسم الحي" required minlength="2" maxlength="80" aria-describedby="error-district"><span class="field-error" id="error-district"></span></div><div class="field"><label for="street">الشارع <span aria-hidden="true">*</span></label><input id="street" name="street" value="${escapeHTML(checkoutDefaults.street)}" placeholder="اسم الشارع" required minlength="2" maxlength="80" aria-describedby="error-street"><span class="field-error" id="error-street"></span></div><div class="field"><label for="building">رقم المبنى <span aria-hidden="true">*</span></label><input id="building" name="building" value="${checkoutDefaults.building}" placeholder="1234" inputmode="numeric" dir="ltr" required maxlength="6" aria-describedby="error-building"><span class="field-error" id="error-building"></span></div></div><div id="pickup-info" class="pickup-info" hidden>الاستلام من المتجر خيار لتوضيح تجربة الطلب فقط. لا يوجد موقع استلام فعلي لهذا المشروع.</div></section>
    <section class="form-panel"><h2><span class="step-number">3</span> تأكيد الطلب</h2><div class="payment-demo">${icon("credit-card")}<div><strong>معاينة إتمام الطلب</strong><p>لا تحتاج إلى بطاقة أو أي معلومات دفع.</p></div></div><label class="checkbox-field"><input type="checkbox" name="consent" id="consent" required aria-describedby="error-consent"><span>أفهم أن هذا طلب تجريبي ولا يترتب عليه شراء أو دفع.</span></label><span class="field-error" id="error-consent"></span><div id="checkout-errors" class="sr-only" role="alert"></div><button class="btn full checkout-submit" type="submit">تأكيد الطلب التجريبي ${icon("arrow-left")}</button></section></form><aside class="order-summary" id="order-summary" aria-label="ملخص الطلب">${checkoutSummary(state2)}</aside></div></div>`;
  }
  function confirmationView(order) {
    if (!order)
      return `<div class="container">${breadcrumb([["الطلب"]])}${emptyState2("لا يوجد طلب لعرضه.", "جرّب إضافة بعض المنتجات وإتمام الطلب لمشاهدة الملخص.")}</div>`;
    return `<div class="container"><section class="confirmation"><div class="success-icon">${icon("check")}</div><div class="eyebrow" style="justify-content:center">اكتملت التجربة</div><h1>كل شيء جاهز، على ذوقك.</h1><p>هذا ملخص طلبك التجريبي. لم يُخصم أي مبلغ ولم تُرسل بياناتك.</p><div class="receipt"><div class="receipt-top"><div><span>رقم الطلب التجريبي</span><strong dir="ltr">${escapeHTML(order.id)}</strong></div><div><span>تاريخ التجربة</span><strong>${new Intl.DateTimeFormat("ar-SA-u-nu-latn", { day: "numeric", month: "long", year: "numeric", calendar: "gregory" }).format(new Date(order.date))}</strong></div></div>${order.lines.map((row) => `<div class="cart-item">${image(row.product.image, row.product.name, { sizes: "90px" })}<div><h3>${row.product.name}</h3><p>${row.option.label} · الكمية: ${number(row.quantity)}</p>${money(row.total)}</div></div>`).join("")}<div style="margin-top:24px">${summaryRows(order.summary)}</div><p class="receipt-note">طريقة الاستلام: ${order.delivery === "pickup" ? "استلام من المتجر (تجريبي)" : "توصيل إلى العنوان (تجريبي)"}. احتُفظ بملخص المنتجات لهذه الجلسة فقط، دون الاسم أو الجوال أو العنوان.</p></div><div class="receipt-actions"><a class="btn" href="#/shop">متابعة التسوّق ${icon("arrow-left")}</a><button class="btn secondary" data-action="print-order">طباعة الملخص</button></div></section></div>`;
  }
  function calculatorView() {
    return `<section class="calculator" aria-labelledby="calculator-title"><div><div class="eyebrow">اضبطها على ذوقك</div><h2 id="calculator-title">كم قهوة؟ وكم ماء؟</h2><p>ابدأ بهذه النسبة للترشيح، ثم عدّلها حسب الكوب الذي تحبه.</p></div><div class="calculator-controls"><div class="field"><label for="coffee-dose">كمية القهوة (جم)</label><input id="coffee-dose" type="number" min="5" max="60" step="1" value="15" inputmode="numeric" aria-describedby="calculator-error"></div><div class="field"><label for="brew-ratio">نسبة الماء</label><select id="brew-ratio"><option value="15">1 : 15 — قوام أعلى</option><option value="16" selected>1 : 16 — متوازن</option><option value="17">1 : 17 — أخف</option></select></div><div class="calculator-result" aria-live="polite"><span>كمية الماء المقترحة</span><output id="water-result" for="coffee-dose brew-ratio"><strong>240</strong> <small>مل</small></output></div><span id="calculator-error" class="field-error" style="grid-column:1/-1"></span></div></section>`;
  }
  function journalView() {
    return `<div class="container">${breadcrumb([["دليل القهوة"]])}<div class="journal-intro"><div><div class="eyebrow">لأن كل كوب فرصة للتجربة</div><h1>خذها خطوة،<br>وراء خطوة.</h1><p>أدلة قصيرة وأفكار بسيطة تساعدك على فهم قهوتك والاستمتاع بتحضيرها.</p></div>${image("hero", "أدوات تحضير القهوة على طاولة مضاءة بالشمس", { sizes: "(max-width:700px) 100vw, 50vw" })}</div><div class="articles-grid">${articles.map(articleCard).join("")}</div>${calculatorView()}<div class="closing-line" style="margin-top:40px"><p>أفضل وصفة، هي التي تحبها.</p>${icon("coffee")}</div></div>`;
  }
  function articleView(article) {
    if (!article) return notFound();
    return `<div class="container">${breadcrumb([["دليل القهوة", "#/journal"], [article.title]])}<div class="article-layout"><article class="article-body"><div class="eyebrow">${article.tag} · ${article.time} قراءة</div><h1>${article.title}</h1><p class="lead">${article.summary}</p>${image(article.image, article.title, { cls: "article-cover", sizes: "(max-width:700px) 100vw, 60vw" })}${article.sections.map(([title, text], i) => `<section class="article-section"><h2>${number(i + 1)}. ${title}</h2><p>${text}</p></section>`).join("")}<a class="text-link" href="#/journal">كل أدلة القهوة ${icon("arrow-left")}</a></article><aside class="article-aside"><div class="filter-note">${icon("coffee")}<h3>جاهز تجرّب؟</h3><p>اختر القطع التي تناسب طريقتك في التحضير.</p><a class="text-link" href="#/shop?category=tools">أدوات التحضير ${icon("arrow-left")}</a></div><section class="timer-card"><h2>مؤقّت التحضير</h2><output id="timer-time" class="timer-time" aria-label="الوقت المنقضي">00:00</output><div class="timer-buttons"><button class="btn small" data-action="timer-toggle" id="timer-toggle">${icon("play")}ابدأ</button><button class="icon-button" data-action="timer-reset" aria-label="تصفير المؤقت">${icon("rotate-ccw")}</button></div><p>تابع الوقت وجرّب ما يناسب قهوتك.</p></section></aside></div></div>`;
  }
  function aboutView() {
    return `<div class="container">${breadcrumb([["حكاية رَوْق"]])}<section class="about-hero"><div><div class="eyebrow">حكايتنا بسيطة</div><h1>بعض التفاصيل،<br><span>تغيّر يومك.</span></h1><p>نحب القهوة، ونحب الوقت الذي نأخذه لتحضيرها. من هنا جاءت فكرة رَوْق: مكان يجمع قهوة وأدوات بسيطة، تجعل هذه الدقائق أجمل.<br><br>قطعة ترتاح لها يدك، وكوب تحب ملمسه، وقهوة ترجع لها كل صباح. هذه هي التفاصيل التي نختارها.</p></div>${image("hero", "ركن قهوة بسيط يجمع الأدوات والأكواب", { sizes: "(max-width:700px) 100vw, 50vw" })}</section><section class="values"><div><span>01 /</span><h2>أقل، وأقرب لك.</h2><p>مجموعة صغيرة وواضحة تساعدك على الاختيار. كل قطعة لها دور في ركنك، ومساحة في يومك.</p></div><div><span>02 /</span><h2>تفاصيل مفهومة.</h2><p>نوضح ما تحتاج معرفته عن كل منتج: استخدامه، خامته، وما يشمله، لتختار وأنت تعرف ما يناسبك.</p></div><div><span>03 /</span><h2>على ذوقك أنت.</h2><p>لا توجد طريقة واحدة للاستمتاع بالقهوة. جرّب، وعدّل، واصنع عادتك الخاصة على مهل.</p></div></section><div class="about-demo"><strong>عن هذا المشروع:</strong> رَوْق علامة تصورية أنشئت لعرض تجربة متجر عربي. المنتجات والصور والأسعار توضيحية، والمتجر لا يمثّل نشاطًا تجاريًا قائمًا ولا ينفّذ طلبات حقيقية.</div></div>`;
  }
  function helpView(topic) {
    const faqs = [
      [
        "demo",
        "هل يمكن الشراء من المتجر؟",
        "رَوْق مشروع لمعرض أعمال، وليس متجرًا تجاريًا. يمكنك تجربة التصفّح والمفضلة والسلة وإتمام طلب توضيحي، دون دفع أو شراء أو شحن فعلي."
      ],
      [
        "shipping",
        "كيف تُحسب تكلفة التوصيل؟",
        "في هذه التجربة، تبلغ رسوم الشحن 19 ر.س، وتصبح مجانية عندما تبلغ قيمة المنتجات بعد الخصم 250 ر.س أو أكثر. الاستلام من المتجر مجاني، وهو خيار توضيحي فقط."
      ],
      [
        "coupon",
        "كيف أستخدم رمز الخصم؟",
        "في صفحة إتمام الطلب، أدخل RAWQ10 واضغط «تطبيق». تحصل على خصم توضيحي بنسبة 10٪ على المنتجات، قبل حساب رسوم الشحن. لا يمكن جمعه مع رمز آخر."
      ],
      [
        "coffee",
        "أي درجة طحن أختار؟",
        "اختر «حب كامل» إذا كانت لديك مطحنة. للقطّارة والفلتر اختر «طحن للترشيح»، ولآلة الإسبريسو اختر «طحن للإسبريسو». قد تحتاج إلى تعديل الطحن وفقًا لأداتك وذوقك."
      ],
      [
        "privacy",
        "ما البيانات التي يحتفظ بها الموقع؟",
        "تُحفظ السلة والمفضلة ورمز الخصم في متصفحك فقط. لا تُرسل بيانات إلى خادم ولا توجد أدوات تتبع. بيانات المستلم في النموذج مؤقتة ولا تُحفظ. ملخص آخر طلب يبقى خلال جلسة التصفح دون الاسم أو الجوال أو العنوان. استخدم بيانات تجريبية فقط."
      ],
      [
        "reset",
        "كيف أمسح بيانات التجربة؟",
        "يمكنك حذف المنتجات من السلة وإزالة المفضلة كلًّا على حدة. لمسح جميع بيانات رَوْق مرة واحدة، استخدم الزر أدناه. لا يؤثر ذلك في بيانات المواقع الأخرى."
      ]
    ];
    return `<div class="container">${breadcrumb([["المساعدة"]])}<div class="page-heading"><div class="eyebrow">إجابات واضحة</div><h1>نختصر عليك السؤال.</h1><p>كل ما تحتاج معرفته عن تجربة رَوْق.</p></div><div class="help-layout"><aside class="help-intro"><h2>من أول اختيار،<br>إلى آخر خطوة.</h2><p>تصفّح الأسئلة، أو ارجع للمتجر وجرّب بنفسك.</p><a class="text-link" href="#/shop">تصفّح المجموعة ${icon("arrow-left")}</a></aside><div class="accordion help-questions">${faqs.map(([id, title, text], i) => `<details id="faq-${id}" ${topic === id || !topic && i === 0 ? "open" : ""}><summary>${title} ${icon("chevron-down")}</summary><p>${text}</p>${id === "reset" ? '<button class="btn secondary small" style="margin-bottom:20px" data-action="reset-data">مسح بيانات التجربة</button>' : ""}</details>`).join("")}</div></div></div>`;
  }
  var notFound = () => `<div class="container">${emptyState2("هذه الصفحة غير موجودة.", "قد يكون الرابط غير صحيح. ارجع للمتجر واستكشف المجموعة.", { symbol: "search" })}</div>`;

  // src/app.js
  var main = document.querySelector("#main");
  var dialogs = [...document.querySelectorAll("dialog")];
  var cartDialog = document.querySelector("#cart-dialog");
  var searchDialog = document.querySelector("#search-dialog");
  var menuDialog = document.querySelector("#menu-dialog");
  var storage;
  try {
    storage = window.localStorage;
  } catch {
    storage = null;
  }
  var state = readState(storage);
  var session;
  try {
    session = window.sessionStorage;
  } catch {
    session = null;
  }
  var lastOrder = readReceipt(session);
  var productQuantity = 1;
  var currentPath = "/";
  var toastTimeout;
  var storageWarningShown = false;
  var submitting = false;
  var searchTimer;
  var catalogTimer;
  var resetArmed = false;
  var timer = { accumulated: 0, startedAt: null, interval: null };
  function toast(message) {
    const node = document.querySelector("#toast");
    clearTimeout(toastTimeout);
    node.textContent = message;
    node.classList.add("visible");
    toastTimeout = setTimeout(() => node.classList.remove("visible"), 3400);
  }
  function persist() {
    const saved = saveState(storage, state);
    if (!saved && !storageWarningShown) {
      storageWarningShown = true;
      toast("تعذّر حفظ الاختيارات في المتصفح. يمكنك متابعة التجربة في هذه الصفحة.");
    }
    updateHeader();
  }
  function updateHeader() {
    const summary = totals(state.cart, state.coupon);
    document.querySelector("[data-cart-count]").textContent = number(summary.count);
    document.querySelector('[data-action="cart"]').setAttribute("aria-label", `سلة التسوق، ${number(summary.count)} قطع`);
    const favoriteCount = document.querySelector("[data-favorite-count]");
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
    const target = [...cartDialog.querySelectorAll("[data-action]")].find(
      (button) => button.dataset.action === action && button.dataset.key === key && !button.disabled
    );
    (target || cartDialog.querySelector('[data-action="close-dialog"]'))?.focus({
      preventScroll: true
    });
  }
  function routeParts() {
    const raw = location.hash.startsWith("#/") ? location.hash.slice(1) : "/";
    const split = raw.indexOf("?");
    const path = (split === -1 ? raw : raw.slice(0, split)).replace(/\/$/, "") || "/";
    return { path, params: new URLSearchParams(split === -1 ? "" : raw.slice(split + 1)) };
  }
  function setShopParam(name, value) {
    const { params } = routeParts();
    if (value === "" || value === "all" || value === "featured") params.delete(name);
    else params.set(name, value);
    const hash = `#/shop${params.size ? `?${params}` : ""}`;
    history.replaceState(null, "", hash);
    refreshShop();
  }
  function refreshShop() {
    const { params } = routeParts();
    const category = categories.some((c) => c.id === params.get("category")) ? params.get("category") : "all";
    const query = (params.get("q") || "").slice(0, 120);
    const rawMax = Number(params.get("max") || 400);
    const maxPrice = Number.isFinite(rawMax) ? Math.min(400, Math.max(50, rawMax)) : 400;
    const found = filterProducts({
      category,
      query,
      sort: params.get("sort") || "featured",
      maxPrice: maxPrice * 100
    });
    document.querySelector("#shop-grid").innerHTML = found.length ? found.map((p) => productCard(p, state)).join("") : noProducts();
    document.querySelector("#results-count").textContent = `${number(found.length)} منتجات`;
    document.querySelector("#active-query").innerHTML = query ? `<div class="active-query">نتائج البحث عن «${escapeHTML(query)}»<button class="icon-button" data-action="clear-query" aria-label="مسح البحث">${icon("x")}</button></div>` : "";
    const queryInput = document.querySelector("#catalog-query");
    if (queryInput !== document.activeElement) queryInput.value = query;
    document.querySelectorAll('[data-action="category"]').forEach((button) => {
      const selected = button.dataset.category === category;
      button.classList.toggle("active", selected);
      button.setAttribute("aria-pressed", String(selected));
    });
    document.querySelector("#price-range").value = maxPrice;
    document.querySelector("#price-range").setAttribute("aria-valuetext", `${number(maxPrice)} ريال`);
    document.querySelector("#range-output").textContent = `${number(maxPrice)} ر.س`;
    const sort = ["price-asc", "price-desc", "name"].includes(params.get("sort")) ? params.get("sort") : "featured";
    document.querySelector("#sort-select").value = sort;
  }
  function resetShopFilters() {
    clearTimeout(catalogTimer);
    history.replaceState(null, "", "#/shop");
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
    document.querySelector("#toast").classList.remove("visible");
    document.querySelector("#toast").textContent = "";
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
    let title = "خذ وقتك، واضبط قهوتك";
    let nav = "";
    if (path === "/") {
      html = homeView(state);
      nav = "home";
    } else if (path === "/shop") {
      html = shopView(state, params);
      title = "المتجر";
      nav = params.get("category") === "tools" ? "tools" : "shop";
    } else if (path.startsWith("/product/")) {
      const product = productById(path.slice("/product/".length));
      html = productView(product, state);
      title = product?.name || "صفحة غير موجودة";
      nav = "shop";
    } else if (path === "/favorites") {
      html = shopView(state, params, true);
      title = "المفضلة";
    } else if (path === "/checkout") {
      html = checkoutView(state);
      title = "إتمام الطلب";
    } else if (path === "/order") {
      html = confirmationView(lastOrder);
      title = "ملخص الطلب التجريبي";
    } else if (path === "/journal") {
      html = journalView();
      title = "دليل القهوة";
      nav = "journal";
    } else if (path.startsWith("/journal/")) {
      const article = articles.find((a) => a.id === path.slice("/journal/".length));
      html = articleView(article);
      title = article?.title || "صفحة غير موجودة";
      nav = "journal";
    } else if (path === "/about") {
      html = aboutView();
      title = "حكاية رَوْق";
      nav = "about";
    } else if (path === "/help") {
      html = helpView(params.get("topic"));
      title = "المساعدة";
    } else {
      html = notFound();
      title = "صفحة غير موجودة";
    }
    const nextPage = document.createElement("template");
    nextPage.innerHTML = html;
    const currentPage = main.cloneNode(true);
    currentPage.querySelectorAll("img[data-src]").forEach((img) => {
      img.setAttribute("src", imagePlaceholder);
      img.removeAttribute("srcset");
    });
    if (currentPage.innerHTML !== nextPage.innerHTML) main.replaceChildren(nextPage.content);
    main.setAttribute("aria-busy", "false");
    main.dataset.route = path;
    main.dataset.query = params.toString();
    document.title = `رَوْق | ${title}`;
    document.querySelectorAll("[data-nav]").forEach((link) => {
      if (link.dataset.nav === nav) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    updateHeader();
    if (scroll) window.scrollTo({ top: 0, behavior: "instant" });
    if (focus) main.focus({ preventScroll: true });
  }
  function addProduct(id, variant, quantity = 1) {
    const result = addToCart(state.cart, id, variant, quantity);
    state.cart = result.cart;
    if (!result.added) {
      toast("وصلت للكمية المتاحة من هذا المنتج.");
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
      button.setAttribute("aria-pressed", String(saved));
      button.setAttribute(
        "aria-label",
        `${saved ? "إزالة" : "حفظ"} ${product.name} ${saved ? "من" : "في"} المفضلة`
      );
    });
  }
  function searchResults(query = "") {
    const found = filterProducts({ query }).slice(0, 6);
    return `<p class="search-results-label" role="status">${query ? `${number(found.length)} نتائج البحث` : "من اختيارات رَوْق"}</p>${found.length ? found.map((product) => `<a class="search-result" href="#/product/${product.id}">${image(product.image, product.name, { sizes: "65px" })}<div><strong>${product.name}</strong><p>${product.subtitle}</p></div>${money(product.price)}</a>`).join("") : '<div class="empty-state"><h2>ما لقينا نتيجة مطابقة.</h2><p>جرّب «قهوة»، «إبريق»، أو «كوب».</p></div>'}`;
  }
  function openSearch() {
    searchDialog.innerHTML = `<div class="search-top"><h2 id="search-title">وش يحتاج ركنك؟</h2><button class="icon-button" data-action="close-dialog" aria-label="أغلق البحث">${icon("x")}</button></div><form id="search-form"><div class="search-field">${icon("search")}<label for="global-search" class="sr-only">ابحث باسم المنتج أو وصفه</label><input id="global-search" name="q" type="search" placeholder="قهوة، إبريق، أو كوبك القادم…" autocomplete="off" maxlength="120" autofocus><button type="submit" class="icon-button" aria-label="عرض جميع نتائج البحث">${icon("arrow-left")}</button></div></form><div id="search-results">${searchResults()}</div>`;
    openDialog(searchDialog);
    searchDialog.querySelector("input").focus();
  }
  function openMenu() {
    menuDialog.innerHTML = `<div class="drawer-head"><a class="brand" href="#/"><span class="brand-ar">رَوْق.</span></a><button class="icon-button" data-action="close-dialog" aria-label="أغلق القائمة">${icon("x")}</button></div><nav class="menu-links" aria-label="التنقل عبر الجوال"><a href="#/">الرئيسية</a><a href="#/shop">تسوّق المجموعة</a><a href="#/shop?category=tools">أدوات التحضير</a><a href="#/journal">دليل القهوة</a><a href="#/favorites">المفضلة</a><a href="#/about">حكاية رَوْق</a><a href="#/help">المساعدة</a></nav><div class="menu-bottom">للقهوة وقتها. وللتفاصيل الصغيرة، أثرها.</div>`;
    openDialog(menuDialog);
  }
  function selectedDelivery() {
    return document.querySelector('[name="delivery"]:checked')?.value || "shipping";
  }
  function refreshCheckoutSummary() {
    const node = document.querySelector("#order-summary");
    if (node) node.innerHTML = checkoutSummary(state, selectedDelivery());
  }
  function clearValidation(field) {
    field.removeAttribute("aria-invalid");
    const error = document.querySelector(`#error-${field.name}`);
    if (error) error.textContent = "";
  }
  function updateCalculator() {
    const doseInput = document.querySelector("#coffee-dose");
    const dose = Number(doseInput.value);
    const ratio = Number(document.querySelector("#brew-ratio").value);
    const valid = Number.isFinite(dose) && Number.isInteger(dose) && dose >= 5 && dose <= 60;
    document.querySelector("#calculator-error").textContent = valid ? "" : "اختر كمية من 5 إلى 60 جم، برقم صحيح.";
    doseInput.setAttribute("aria-invalid", String(!valid));
    document.querySelector("#water-result").innerHTML = valid ? `<strong>${number(dose * ratio)}</strong> <small>مل</small>` : "—";
  }
  function paintTimer() {
    const output = document.querySelector("#timer-time");
    if (!output) {
      stopTimer();
      return;
    }
    const elapsed = Math.floor(
      (timer.accumulated + (timer.startedAt === null ? 0 : performance.now() - timer.startedAt)) / 1e3
    );
    output.textContent = `${String(Math.floor(elapsed / 60)).padStart(2, "0")}:${String(elapsed % 60).padStart(2, "0")}`;
    const button = document.querySelector("#timer-toggle");
    button.innerHTML = `${icon(timer.startedAt === null ? "play" : "pause")}${timer.startedAt === null ? timer.accumulated ? "أكمل" : "ابدأ" : "إيقاف"}`;
  }
  document.addEventListener("click", (event) => {
    if (event.target.closest(".skip-link")) {
      event.preventDefault();
      main.focus({ preventScroll: true });
      main.scrollIntoView({ block: "start", behavior: "instant" });
      return;
    }
    const link = event.target.closest('a[href^="#/"]');
    if (link && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && event.button === 0) {
      closeDialogs();
      if (link.getAttribute("href") === location.hash) {
        event.preventDefault();
        renderRoute();
      }
      return;
    }
    const button = event.target.closest("[data-action]");
    if (!button || button.disabled) return;
    const { action, id, key } = button.dataset;
    if (action === "cart") openCart();
    else if (action === "search") openSearch();
    else if (action === "menu") openMenu();
    else if (action === "close-dialog") button.closest("dialog").close();
    else if (action === "favorite") {
      state.favorites = state.favorites.includes(id) ? state.favorites.filter((value) => value !== id) : [...state.favorites, id];
      persist();
      updateFavoriteButtons(id);
      toast(state.favorites.includes(id) ? "حفظناها لك في المفضلة." : "أُزيل المنتج من المفضلة.");
      if (currentPath === "/favorites") {
        const nextCard = button.closest(".product-card")?.nextElementSibling;
        const nextId = nextCard?.dataset.productCard;
        main.innerHTML = shopView(state, new URLSearchParams(), true);
        const nextButton = [...main.querySelectorAll('[data-action="favorite"]')].find(
          (b) => b.dataset.id === nextId
        );
        (nextButton || main.querySelector('a[href="#/shop"]') || main).focus({ preventScroll: true });
      }
    } else if (action === "quick-add") {
      const product = productById(id);
      if (product.variants.length > 1) {
        location.hash = `/product/${id}`;
        return;
      }
      if (addProduct(id, product.variants[0].id)) {
        button.classList.add("added");
        button.innerHTML = `أُضيف للسلة ${icon("check")}`;
        toast(`أضفنا ${product.name} إلى سلتك.`);
        setTimeout(() => {
          if (button.isConnected) {
            button.classList.remove("added");
            button.innerHTML = `أضف للسلة ${icon("plus")}`;
          }
        }, 1700);
      }
    } else if (action === "home-category") {
      const category = button.dataset.category;
      document.querySelectorAll('[data-action="home-category"]').forEach((b) => {
        const selected = b === button;
        b.classList.toggle("active", selected);
        b.setAttribute("aria-pressed", String(selected));
      });
      const found = filterProducts({ category }).slice(0, 4);
      document.querySelector("#featured-grid").innerHTML = found.map((p) => productCard(p, state)).join("");
      document.querySelector("#featured-status").textContent = `يُعرض الآن ${number(found.length)} منتجات.`;
    } else if (action === "category") setShopParam("category", button.dataset.category);
    else if (action === "reset-filters") resetShopFilters();
    else if (action === "clear-query") {
      clearTimeout(catalogTimer);
      setShopParam("q", "");
    } else if (action === "filter-toggle") {
      const sidebar = document.querySelector("#shop-filters");
      const expanded = sidebar.classList.toggle("is-open");
      button.setAttribute("aria-expanded", String(expanded));
      if (expanded) {
        sidebar.scrollIntoView({ block: "center", behavior: "instant" });
        sidebar.querySelector("input").focus({ preventScroll: true });
      }
    } else if (action === "product-plus" || action === "product-minus") {
      const product = productById(document.querySelector("#product-form").dataset.product);
      productQuantity = Math.min(
        Math.min(product.stock, MAX_QUANTITY),
        Math.max(1, productQuantity + (action === "product-plus" ? 1 : -1))
      );
      const control = button.closest(".quantity-control");
      control.outerHTML = quantityControl(productQuantity, {
        product: true,
        max: Math.min(product.stock, MAX_QUANTITY)
      });
      const target = document.querySelector(`[data-action="${action}"]`);
      (target.disabled ? document.querySelector(
        `[data-action="${action === "product-plus" ? "product-minus" : "product-plus"}"]`
      ) : target).focus({ preventScroll: true });
    } else if (action.startsWith("cart-")) {
      const row = state.cart.find((line) => itemKey(line.id, line.variant) === key);
      if (!row) return;
      const quantity = action === "cart-remove" ? 0 : row.quantity + (action === "cart-plus" ? 1 : -1);
      state.cart = updateQuantity(state.cart, key, quantity);
      persist();
      repaintCart(action, key);
      if (action === "cart-remove") toast("أُزيل المنتج من السلة.");
      else toast(`تم تحديث الكمية إلى ${number(quantity)}.`);
      if (currentPath === "/checkout") {
        if (!state.cart.length) main.innerHTML = checkoutView(state);
        else refreshCheckoutSummary();
      }
    } else if (action === "remove-coupon") {
      state.coupon = "";
      persist();
      refreshCheckoutSummary();
      toast("أُزيل رمز الخصم.");
    } else if (action === "print-order") window.print();
    else if (action === "timer-toggle") {
      if (timer.startedAt === null) {
        timer.startedAt = performance.now();
        timer.interval = setInterval(paintTimer, 250);
      } else stopTimer();
      paintTimer();
    } else if (action === "timer-reset") {
      stopTimer();
      timer.accumulated = 0;
      paintTimer();
    } else if (action === "reset-data") {
      if (!resetArmed) {
        resetArmed = true;
        button.textContent = "تأكيد مسح السلة والمفضلة";
        toast("اضغط مرة ثانية لتأكيد مسح بيانات رَوْق فقط.");
        return;
      }
      state = sanitizeState(null);
      lastOrder = null;
      try {
        session?.removeItem(ORDER_KEY);
      } catch {
      }
      persist();
      toast("مُسحت بيانات رَوْق من هذا المتصفح.");
      button.textContent = "تم مسح بيانات التجربة";
      resetArmed = false;
    }
  });
  document.addEventListener("input", (event) => {
    const input = event.target;
    if (input.id === "global-search") {
      clearTimeout(searchTimer);
      searchTimer = setTimeout(() => {
        const node = document.querySelector("#search-results");
        if (node) node.innerHTML = searchResults(input.value);
      }, 100);
    } else if (input.id === "catalog-query") {
      clearTimeout(catalogTimer);
      catalogTimer = setTimeout(() => {
        if (currentPath === "/shop") setShopParam("q", input.value);
      }, 180);
    } else if (input.id === "price-range") {
      document.querySelector("#range-output").textContent = `${number(Number(input.value))} ر.س`;
      input.setAttribute("aria-valuetext", `${number(Number(input.value))} ريال`);
      setShopParam("max", input.value);
    } else if (input.id === "coffee-dose") updateCalculator();
    if (input.closest("#checkout-form")) clearValidation(input);
  });
  document.addEventListener("change", (event) => {
    const input = event.target;
    if (input.id === "sort-select") setShopParam("sort", input.value);
    else if (input.id === "brew-ratio") updateCalculator();
    else if (input.name === "variant") {
      const product = productById(document.querySelector("#product-form").dataset.product);
      document.querySelector("#detail-price").innerHTML = money(
        variantById(product, input.value).price
      );
    } else if (input.name === "delivery") {
      const pickup = input.value === "pickup";
      document.querySelector("#address-fields").hidden = pickup;
      document.querySelector("#pickup-info").hidden = !pickup;
      document.querySelectorAll("#address-fields input,#address-fields select").forEach((field) => {
        field.required = !pickup;
        field.disabled = pickup;
        clearValidation(field);
      });
      document.querySelector("#checkout-totals").innerHTML = summaryRows(
        totals(state.cart, state.coupon, input.value)
      );
    }
    if (input.closest("#checkout-form")) clearValidation(input);
  });
  document.addEventListener("submit", (event) => {
    const form = event.target;
    if (!["product-form", "search-form", "coupon-form", "checkout-form"].includes(form.id)) return;
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    if (form.id === "product-form") {
      if (addProduct(form.dataset.product, data.variant, productQuantity)) openCart();
    } else if (form.id === "search-form") {
      const query = String(data.q || "").trim();
      location.hash = `/shop${query ? `?q=${encodeURIComponent(query)}` : ""}`;
      closeDialogs();
    } else if (form.id === "coupon-form") {
      const coupon = String(data.coupon || "").trim().toUpperCase();
      const input = form.querySelector("input");
      if (coupon !== "RAWQ10") {
        document.querySelector("#coupon-message").textContent = coupon ? "الرمز غير صحيح. جرّب RAWQ10." : "اكتب رمز الخصم أولًا.";
        input.setAttribute("aria-invalid", "true");
        input.focus();
        return;
      }
      state.coupon = coupon;
      persist();
      refreshCheckoutSummary();
      toast("تم تطبيق خصم 10٪ على المنتجات.");
    } else if (form.id === "checkout-form") {
      if (submitting) return;
      if (!state.cart.length) {
        renderRoute();
        return;
      }
      const errors = validateCheckout(data);
      form.querySelectorAll("[aria-invalid]").forEach((field) => field.removeAttribute("aria-invalid"));
      form.querySelectorAll(".field-error").forEach((node) => node.textContent = "");
      const names = Object.keys(errors);
      if (names.length) {
        names.forEach((name) => {
          const field = form.elements.namedItem(name);
          field?.setAttribute("aria-invalid", "true");
          document.querySelector(`#error-${name}`).textContent = errors[name];
        });
        document.querySelector("#checkout-errors").textContent = `راجع ${number(names.length)} حقول مطلوبة.`;
        form.elements.namedItem(names[0])?.focus();
        return;
      }
      submitting = true;
      const token = globalThis.crypto?.randomUUID?.().replace(/-/g, "").slice(0, 8).toUpperCase() || Date.now().toString(36).toUpperCase();
      lastOrder = {
        id: `RW-${token}`,
        date: (/* @__PURE__ */ new Date()).toISOString(),
        lines: cartLines(state.cart),
        summary: totals(state.cart, state.coupon, data.delivery),
        delivery: data.delivery
      };
      saveReceipt(session, lastOrder);
      form.reset();
      state.cart = [];
      state.coupon = "";
      persist();
      location.hash = "/order";
    }
  });
  for (const dialog of dialogs) {
    dialog.addEventListener("click", (event) => {
      if (event.target !== dialog) return;
      const rect = dialog.getBoundingClientRect();
      if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom)
        dialog.close();
    });
  }
  window.addEventListener("hashchange", () => renderRoute());
  window.addEventListener("storage", (event) => {
    if (event.key !== STORAGE_KEY && event.key !== null) return;
    state = readState(storage);
    updateHeader();
    if (cartDialog.open) cartDialog.innerHTML = cartView(state);
    state.favorites.forEach(updateFavoriteButtons);
    document.querySelectorAll('[data-action="favorite"]').forEach((button) => updateFavoriteButtons(button.dataset.id));
    if (currentPath === "/checkout") {
      if (state.cart.length && document.querySelector("#checkout-form")) refreshCheckoutSummary();
      else renderRoute({ focus: false, scroll: false });
    }
    if (currentPath === "/favorites") main.innerHTML = shopView(state, new URLSearchParams(), true);
  });
  window.addEventListener("pagehide", stopTimer);
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && dialogs.some((dialog) => dialog.open)) {
      event.preventDefault();
      closeDialogs();
      return;
    }
    if (event.key === "/" && !/INPUT|TEXTAREA|SELECT/.test(document.activeElement?.tagName) && !dialogs.some((d) => d.open)) {
      event.preventDefault();
      openSearch();
    }
  });
  startImages();
  renderRoute({ focus: false, scroll: false });
  document.documentElement.dataset.appReady = "true";
  document.dispatchEvent(new Event("rawq:ready"));
  document.querySelectorAll("template[data-prerender]").forEach((template) => template.remove());
})();
