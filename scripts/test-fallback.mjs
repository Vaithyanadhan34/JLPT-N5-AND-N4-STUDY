import { chromium } from 'playwright-core';

async function test() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE CONSOLE:', msg.type(), msg.text()));
  page.on('pageerror', err => console.log('PAGE ERROR:', err.message, err.stack));

  await page.addInitScript(() => {
    try {
      delete window.IntersectionObserver;
      delete window.IntersectionObserverEntry;
    } catch (e) {}
    Object.defineProperty(window, 'IntersectionObserver', {
      configurable: true,
      writable: true,
      value: undefined
    });
  });

  console.log('Navigating to http://localhost:8000/#vocab...');
  await page.goto('http://localhost:8000/#vocab', { waitUntil: 'domcontentloaded' });
  console.log('Waiting 3s...');
  await page.waitForTimeout(3000);

  const state = await page.evaluate(() => {
    return {
      hasRowLoaders: !!window.rowLoaders,
      hasVLoader: !!(window.rowLoaders && window.rowLoaders.v),
      cards: document.querySelectorAll('#vGrid .study-card').length,
      fallbackBtn: !!document.querySelector('.list-fallback-btn')
    };
  });
  console.log('Page state:', state);
  await browser.close();
}

test().catch(console.error);
