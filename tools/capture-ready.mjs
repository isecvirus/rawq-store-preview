// Wait for the requested route, not a heading left over from the previous page.
export async function waitForRoute(page, route) {
  const [path, query = ''] = route.split('?');
  await page.waitForFunction(
    ({ path, query }) =>
      document.documentElement.dataset.appReady === 'true' &&
      document.querySelector('#main').dataset.route === path &&
      document.querySelector('#main').dataset.query === query,
    { path: path.replace(/\/$/, '') || '/', query: new URLSearchParams(query).toString() },
  );
}

export async function waitForAssets(page) {
  // Scroll through lazy images as a visitor would, then restore the capture
  // position. Keep loading="lazy" and let the store's observer request each image.
  const scrollState = await page.evaluateHandle(() =>
    [document.scrollingElement, ...document.querySelectorAll('dialog[open], dialog[open] *')]
      .filter((node) => node instanceof HTMLElement)
      .map((node) => ({ node, top: node.scrollTop, left: node.scrollLeft })),
  );
  try {
    const images = page.locator('img');
    for (let index = 0; index < (await images.count()); index++) {
      const img = images.nth(index);
      if (!(await img.evaluate((node) => node.getClientRects().length > 0))) continue;
      await img.evaluate((node) => node.scrollIntoView({ block: 'center', behavior: 'instant' }));
      await page.waitForFunction((index) => {
        const img = document.images[index];
        return (
          img.complete &&
          img.naturalWidth > 0 &&
          img.currentSrc &&
          !img.currentSrc.startsWith('data:')
        );
      }, index);
      await img.evaluate((node) => node.decode());
    }
  } finally {
    await scrollState.evaluate((positions) =>
      positions.forEach(({ node, top, left }) => node.scrollTo({ top, left, behavior: 'instant' })),
    );
    await scrollState.dispose();
  }
  return page.evaluate(async () => {
    const images = [...document.images].filter((img) => img.getClientRects().length);
    await Promise.all(images.map((img) => img.decode()));
    await document.fonts.ready;
    let previous = '';
    let stable = 0;
    for (let frame = 0; frame < 60; frame++) {
      await new Promise(requestAnimationFrame);
      const boxes = [document.querySelector('#main'), ...images].map((node) => {
        const { x, y, width, height } = node.getBoundingClientRect();
        return [x, y, width, height];
      });
      const current = JSON.stringify(boxes);
      stable = current === previous ? stable + 1 : 0;
      previous = current;
      if (stable >= 3)
        return images.map((img) => ({
          source: img.currentSrc.split('/').at(-1),
          width: img.naturalWidth,
          height: img.naturalHeight,
        }));
    }
    throw new Error('The page layout did not settle before capture.');
  });
}
