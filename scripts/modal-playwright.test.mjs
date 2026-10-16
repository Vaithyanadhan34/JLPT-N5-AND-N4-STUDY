import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const url = 'http://127.0.0.1:8000/';

async function openDetails(page) {
  await page.click('#vocab .study-card .detail-link');
  await page.waitForSelector('#modal:not([hidden])');
}

async function ensureClosed(page) {
  await page.waitForSelector('#modal[hidden]');
  const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflow);
  assert.notEqual(bodyOverflow, 'hidden', 'body scroll should restore after closing modal');
}

const browser = await chromium.launch({ headless: true });
try {
  const page = await browser.newPage({ viewport: { width: 390, height: 844 } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await page.waitForSelector('#vGrid .study-card');

  await openDetails(page);
  await page.click('#closeModal');
  await ensureClosed(page);

  await openDetails(page);
  await page.keyboard.press('Escape');
  await ensureClosed(page);

  await openDetails(page);
  await page.click('#modal .modal-backdrop');
  await ensureClosed(page);

  await openDetails(page);
  await page.goBack();
  await ensureClosed(page);

  console.log('modal regression test passed');
} finally {
  await browser.close();
}
