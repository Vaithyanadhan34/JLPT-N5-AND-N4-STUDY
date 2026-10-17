import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const SCREENSHOTS_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const LOCAL_URL = 'http://localhost:8000/';

async function verify() {
  console.log('--- Launching browser to verify Navbar & Theme Toggle ---');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });
  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  await page.addInitScript(() => localStorage.setItem('jlpt-v7-onboarding-dismissed', '1'));
  await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  console.log('Console errors on load:', consoleErrors);
  if (consoleErrors.length > 0) {
    throw new Error('Page had console errors on load: ' + consoleErrors.join('; '));
  }

  // 1. Check Theme Toggle & Icon
  console.log('\n--- 1. Testing Theme Toggle & Theme Icon Visibility ---');
  const themeIconSvg = await page.$('#themeIconSlot svg');
  console.log('Theme icon SVG exists on load:', Boolean(themeIconSvg));
  if (!themeIconSvg) throw new Error('Theme icon SVG is NOT visible in #themeIconSlot on initial load!');

  const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme || document.body.dataset.theme);
  console.log('Initial theme:', initialTheme);

  // Click theme toggle
  await page.click('#themeToggle');
  await page.waitForTimeout(500);

  const themeAfterFirstClick = await page.evaluate(() => document.documentElement.dataset.theme || document.body.dataset.theme);
  console.log('Theme after 1st click:', themeAfterFirstClick);
  if (themeAfterFirstClick === initialTheme) throw new Error('Theme did not change after clicking #themeToggle!');

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'verify_theme_dark.png') });

  // Click theme toggle again
  await page.click('#themeToggle');
  await page.waitForTimeout(500);

  const themeAfterSecondClick = await page.evaluate(() => document.documentElement.dataset.theme || document.body.dataset.theme);
  console.log('Theme after 2nd click:', themeAfterSecondClick);
  if (themeAfterSecondClick !== initialTheme) throw new Error('Theme did not toggle back on 2nd click!');

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'verify_theme_light.png') });

  // 2. Check Desktop Navbar Navigation
  console.log('\n--- 2. Testing Desktop Navbar Navigation ---');
  const navPages = ['kana', 'vocab', 'kanji', 'grammar', 'conjunctions', 'compare', 'companion', 'quiz', 'how', 'home'];
  
  for (const pageName of navPages) {
    const navBtn = await page.$(`#nav button[data-page="${pageName}"]`);
    if (!navBtn) throw new Error(`Nav button for page "${pageName}" not found in #nav!`);

    await navBtn.click();
    await page.waitForTimeout(400);

    const activePage = await page.evaluate(() => document.querySelector('.page.active')?.id);
    const activeNav = await page.evaluate(() => document.querySelector('#nav button.active')?.dataset.page);

    console.log(`Navigated to "${pageName}": active page = "${activePage}", active nav = "${activeNav}"`);
    if (activePage !== pageName || activeNav !== pageName) {
      throw new Error(`Navigation failed for page "${pageName}": page="${activePage}", nav="${activeNav}"`);
    }
  }

  await page.screenshot({ path: path.join(SCREENSHOTS_DIR, 'verify_desktop_nav_home.png') });

  // 3. Test Mobile Navigation Dock (390x844)
  console.log('\n--- 3. Testing Mobile Bottom Dock Navigation ---');
  const pageMob = await context.newPage();
  await pageMob.setViewportSize({ width: 390, height: 844 });
  await pageMob.goto(LOCAL_URL, { waitUntil: 'networkidle' });
  await pageMob.waitForTimeout(1000);

  const mobileNavPages = ['kana', 'vocab', 'kanji', 'home'];
  for (const pageName of mobileNavPages) {
    const dockBtn = await pageMob.$(`#mobileNav button[data-page="${pageName}"]`);
    if (!dockBtn) throw new Error(`Mobile dock button for "${pageName}" not found!`);

    await dockBtn.click();
    await pageMob.waitForTimeout(400);

    const activePage = await pageMob.evaluate(() => document.querySelector('.page.active')?.id);
    console.log(`Mobile navigated to "${pageName}": active page = "${activePage}"`);
    if (activePage !== pageName) {
      throw new Error(`Mobile navigation failed for page "${pageName}": got "${activePage}"`);
    }
  }

  // Test mobile "More" button
  const moreBtn = await pageMob.$('#mobileMoreBtn');
  if (moreBtn) {
    await moreBtn.click();
    await pageMob.waitForTimeout(400);
    const moreSheetVisible = await pageMob.evaluate(() => {
      const s = document.getElementById('moreSheet');
      return s && !s.hidden;
    });
    console.log('Mobile "More" sheet opened:', moreSheetVisible);
    if (!moreSheetVisible) throw new Error('Mobile More sheet did not open!');
    await pageMob.screenshot({ path: path.join(SCREENSHOTS_DIR, 'verify_mobile_more_sheet.png') });
  }

  await page.close();
  await pageMob.close();
  await browser.close();

  console.log('\n=============================================');
  console.log('ALL VERIFICATIONS PASSED WITH 0 ERRORS!');
  console.log('=============================================');
}

verify().catch(err => {
  console.error('\nVerification FAILED:', err);
  process.exit(1);
});
