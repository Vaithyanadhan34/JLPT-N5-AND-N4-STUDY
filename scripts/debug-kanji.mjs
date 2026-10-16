import { chromium } from 'playwright-core';

async function test() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 360, height: 800 } });
  const page = await context.newPage();

  page.on('console', msg => console.log('PAGE LOG:', msg.text()));

  await page.goto('http://localhost:8000/#home');
  await page.waitForTimeout(1000);

  console.log('\nNavigating to kanji...');
  await page.evaluate(() => {
    window.showPage('kanji', true);
  });
  await page.waitForTimeout(500);

  const info = await page.evaluate(() => {
    const loader = window.rowLoaders.k;
    const cards = document.querySelectorAll('#kGrid .study-card').length;
    const scrollY = window.scrollY;
    return {
      loadedRows: loader ? loader.getLoadedCount() : null,
      cards,
      scrollY,
      cols: loader ? loader.getCols() : null
    };
  });

  console.log('Kanji debug info:', info);
  await browser.close();
}

test().catch(console.error);
