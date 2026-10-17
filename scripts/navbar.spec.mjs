import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';
import axeCore from 'axe-core';

const SCREENSHOTS_DIR = path.resolve('screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

const LOCAL_URL = 'http://localhost:8000/';

function parseColor(str) {
  if (!str) return [0, 0, 0];
  if (str.startsWith('#')) {
    let hex = str.slice(1);
    if (hex.length === 3) hex = hex.split('').map(c => c + c).join('');
    return [parseInt(hex.slice(0, 2), 16), parseInt(hex.slice(2, 4), 16), parseInt(hex.slice(4, 6), 16)];
  }
  const m = str.match(/\d+(\.\d+)?/g);
  return m ? m.slice(0, 3).map(Number) : [0, 0, 0];
}

function luminance([r, g, b]) {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
}

function contrastRatio(rgb1, rgb2) {
  const l1 = luminance(rgb1);
  const l2 = luminance(rgb2);
  const bright = Math.max(l1, l2);
  const dark = Math.min(l1, l2);
  return (bright + 0.05) / (dark + 0.05);
}

async function runRegressionSuite() {
  console.log('=====================================================');
  console.log('       NAVBAR & THEME COMPREHENSIVE REGRESSION       ');
  console.log('=====================================================');

  const browser = await chromium.launch({ channel: 'chrome', headless: true }).catch(() =>
    chromium.launch({ channel: 'msedge', headless: true })
  );

  const results = {
    consoleErrors: [],
    failedRequests: [],
    coveringLayers: [],
    navLinks: [],
    historyTest: false,
    deepLinkTest: false,
    themeToggleTest: false,
    themePersistenceTest: false,
    contrastLight: 0,
    contrastDark: 0,
    shortcutHintLabel: '',
    searchOpenViaBtn: false,
    searchCloseViaEsc: false,
    searchOpenViaKey: false,
    settingsOpenViaBtn: false,
    settingsCloseViaEsc: false,
    axeViolations: [],
    screenshots: {}
  };

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') results.consoleErrors.push(msg.text());
  });
  page.on('pageerror', err => results.consoleErrors.push(err.message));
  page.on('requestfailed', req => results.failedRequests.push(`${req.method()} ${req.url()}`));

  console.log('\n[1/7] Loading local app at', LOCAL_URL);
  await page.goto(LOCAL_URL, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  // 1. Covering-Layer elementFromPoint check
  console.log('\n[2/7] Running covering-layer elementFromPoint checks on all nav controls...');
  const navControlSelectors = [
    '#nav [data-page="home"]',
    '#nav [data-page="kana"]',
    '#nav [data-page="vocab"]',
    '#nav [data-page="kanji"]',
    '#nav [data-page="grammar"]',
    '#nav [data-page="conjunctions"]',
    '#nav [data-page="compare"]',
    '#nav [data-page="companion"]',
    '#nav [data-page="quiz"]',
    '#nav [data-page="how"]',
    '#searchToggle',
    '#themeToggle',
    '#settingsToggle'
  ];

  for (const sel of navControlSelectors) {
    const el = await page.$(sel);
    if (!el) {
      results.coveringLayers.push({ selector: sel, pass: false, error: 'Element not found' });
      continue;
    }
    const box = await el.boundingBox();
    if (!box) {
      results.coveringLayers.push({ selector: sel, pass: false, error: 'No bounding box' });
      continue;
    }
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;

    const hit = await page.evaluate(({ cx, cy, sel }) => {
      const target = document.querySelector(sel);
      const topEl = document.elementFromPoint(cx, cy);
      const isHit = target === topEl || target.contains(topEl);
      return {
        isHit,
        topTag: topEl ? topEl.tagName : 'null',
        topClass: topEl ? topEl.className : '',
        topId: topEl ? topEl.id : ''
      };
    }, { cx, cy, sel });

    console.log(`  ${sel}: hit=${hit.isHit} (top: <${hit.topTag} id="${hit.topId}" class="${hit.topClass}">)`);
    results.coveringLayers.push({ selector: sel, pass: hit.isHit, ...hit });
  }

  // 2. All 10 Nav Links Navigation Test
  console.log('\n[3/7] Testing navigation on all 10 links...');
  const navPages = [
    { name: 'Kana', page: 'kana' },
    { name: 'Vocabulary', page: 'vocab' },
    { name: 'Kanji', page: 'kanji' },
    { name: 'Grammar', page: 'grammar' },
    { name: 'Conjunctions', page: 'conjunctions' },
    { name: 'Compare', page: 'compare' },
    { name: 'Companion', page: 'companion' },
    { name: 'Quiz', page: 'quiz' },
    { name: 'Guide', page: 'how' },
    { name: 'Home', page: 'home' }
  ];

  for (const item of navPages) {
    const sel = `#nav [data-page="${item.page}"]`;
    await page.click(sel);
    await page.waitForTimeout(300);

    const check = await page.evaluate(pageId => {
      const activeSection = document.querySelector('.page.active')?.id;
      const activeNavEl = document.querySelector('#nav [data-page].active')?.getAttribute('data-page');
      const ariaCurrent = document.querySelector(`#nav [data-page="${pageId}"]`)?.getAttribute('aria-current');
      const hash = window.location.hash;
      return {
        activeSection,
        activeNavEl,
        ariaCurrent,
        hash
      };
    }, item.page);

    const pass = check.activeSection === item.page &&
                 check.activeNavEl === item.page &&
                 check.ariaCurrent === 'page' &&
                 check.hash === `#${item.page}`;

    console.log(`  Nav to ${item.name} (#${item.page}): pass=${pass} (activeSection=${check.activeSection}, hash=${check.hash})`);
    results.navLinks.push({ item, pass, check });
  }

  // Browser Back / Forward check
  console.log('\n[4/7] Testing Browser Back and Forward & Deep-link reload...');
  await page.click('#nav [data-page="grammar"]');
  await page.waitForTimeout(300);
  await page.click('#nav [data-page="quiz"]');
  await page.waitForTimeout(300);

  await page.goBack();
  await page.waitForTimeout(400);
  const backSection = await page.evaluate(() => document.querySelector('.page.active')?.id);
  const backHash = await page.evaluate(() => window.location.hash);

  await page.goForward();
  await page.waitForTimeout(400);
  const fwdSection = await page.evaluate(() => document.querySelector('.page.active')?.id);
  const fwdHash = await page.evaluate(() => window.location.hash);

  results.historyTest = backSection === 'grammar' && backHash === '#grammar' &&
                        fwdSection === 'quiz' && fwdHash === '#quiz';
  console.log(`  History Back/Forward: pass=${results.historyTest} (Back: ${backSection}, Fwd: ${fwdSection})`);

  // Deep-link reload check
  await page.goto(`${LOCAL_URL}#compare`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);
  const deepPage = await page.evaluate(() => document.querySelector('.page.active')?.id);
  const deepNav = await page.evaluate(() => document.querySelector('#nav [data-page].active')?.getAttribute('data-page'));
  results.deepLinkTest = deepPage === 'compare' && deepNav === 'compare';
  console.log(`  Deep-link reload (#compare): pass=${results.deepLinkTest} (page=${deepPage}, nav=${deepNav})`);

  // 3. Theme Toggle, Icons & Contrast
  console.log('\n[5/7] Testing Theme Toggle, Icon Rendering & Contrast...');
  // Force light mode first
  await page.evaluate(() => {
    document.documentElement.dataset.theme = 'light';
    document.body.dataset.theme = 'light';
    localStorage.setItem('jlpt-theme', 'light');
    if (typeof syncThemeControls === 'function') syncThemeControls();
  });
  await page.waitForTimeout(300);

  // Capture Light mode navbar
  const navHeader = await page.$('#siteHeader');
  const lightNavShot = path.join(SCREENSHOTS_DIR, 'navbar_desktop_light.png');
  await navHeader.screenshot({ path: lightNavShot });
  results.screenshots.navbarDesktopLight = lightNavShot;

  // Inspect light mode theme icon
  const lightIconData = await page.evaluate(() => {
    const btn = document.getElementById('themeToggle');
    const moon = btn.querySelector('.theme-icon-moon');
    const sun = btn.querySelector('.theme-icon-sun');
    const csBtn = window.getComputedStyle(btn);
    const csMoon = window.getComputedStyle(moon);
    const csSun = window.getComputedStyle(sun);
    return {
      moonDisplay: csMoon.display,
      sunDisplay: csSun.display,
      iconColor: csMoon.color,
      btnBg: csBtn.backgroundColor,
      btnColor: csBtn.color,
      ariaLabel: btn.getAttribute('aria-label')
    };
  });

  const cRatioLight = contrastRatio(parseColor(lightIconData.iconColor), parseColor(lightIconData.btnBg));
  results.contrastLight = Number(cRatioLight.toFixed(2));
  console.log(`  Light Mode Icon: Moon visible=${lightIconData.moonDisplay !== 'none'}, Sun hidden=${lightIconData.sunDisplay === 'none'}`);
  console.log(`  Light Mode Contrast: ${results.contrastLight}:1 (target >= 4.5:1)`);

  const themeBtnEl = await page.$('#themeToggle');
  const lightBtnShot = path.join(SCREENSHOTS_DIR, 'theme_btn_light.png');
  await themeBtnEl.screenshot({ path: lightBtnShot });
  results.screenshots.themeBtnLight = lightBtnShot;

  // Click theme toggle to switch to dark mode
  await page.click('#themeToggle');
  await page.waitForTimeout(400);

  const themeAfterToggle = await page.evaluate(() => ({
    theme: document.documentElement.dataset.theme,
    colorScheme: document.documentElement.style.colorScheme,
    metaColor: document.querySelector('meta[name="theme-color"]')?.content,
    stored: localStorage.getItem('jlpt-theme')
  }));

  // Capture Dark mode navbar
  const darkNavShot = path.join(SCREENSHOTS_DIR, 'navbar_desktop_dark.png');
  await navHeader.screenshot({ path: darkNavShot });
  results.screenshots.navbarDesktopDark = darkNavShot;

  // Inspect dark mode theme icon
  const darkIconData = await page.evaluate(() => {
    const btn = document.getElementById('themeToggle');
    const moon = btn.querySelector('.theme-icon-moon');
    const sun = btn.querySelector('.theme-icon-sun');
    const csBtn = window.getComputedStyle(btn);
    const csMoon = window.getComputedStyle(moon);
    const csSun = window.getComputedStyle(sun);
    return {
      moonDisplay: csMoon.display,
      sunDisplay: csSun.display,
      iconColor: csSun.color,
      btnBg: csBtn.backgroundColor,
      btnColor: csBtn.color,
      ariaLabel: btn.getAttribute('aria-label')
    };
  });

  const cRatioDark = contrastRatio(parseColor(darkIconData.iconColor), parseColor(darkIconData.btnBg));
  results.contrastDark = Number(cRatioDark.toFixed(2));
  console.log(`  Dark Mode Icon: Sun visible=${darkIconData.sunDisplay !== 'none'}, Moon hidden=${darkIconData.moonDisplay === 'none'}`);
  console.log(`  Dark Mode Contrast: ${results.contrastDark}:1 (target >= 4.5:1)`);

  const darkBtnShot = path.join(SCREENSHOTS_DIR, 'theme_btn_dark.png');
  await themeBtnEl.screenshot({ path: darkBtnShot });
  results.screenshots.themeBtnDark = darkBtnShot;

  results.themeToggleTest = themeAfterToggle.theme === 'dark' &&
                            lightIconData.moonDisplay !== 'none' &&
                            darkIconData.sunDisplay !== 'none' &&
                            results.contrastLight >= 4.5 &&
                            results.contrastDark >= 4.5;

  // Test theme persistence on reload
  await page.reload({ waitUntil: 'networkidle' });
  await page.waitForTimeout(400);
  const reloadedTheme = await page.evaluate(() => document.documentElement.dataset.theme);
  results.themePersistenceTest = reloadedTheme === 'dark';
  console.log(`  Theme persistence after reload: pass=${results.themePersistenceTest} (reloadedTheme=${reloadedTheme})`);

  // Switch back to light
  await page.click('#themeToggle');
  await page.waitForTimeout(300);

  // 4. Search and Settings Dialogs + Keyboard Shortcuts
  console.log('\n[6/7] Testing Search, Settings & Keyboard Shortcuts...');
  results.shortcutHintLabel = await page.evaluate(() => document.getElementById('kbdHint')?.textContent || '');
  console.log(`  Search shortcut hint on this OS: "${results.shortcutHintLabel}"`);

  // Click search button
  await page.click('#searchToggle');
  await page.waitForTimeout(300);
  results.searchOpenViaBtn = await page.evaluate(() => !document.getElementById('searchSheet')?.hidden);

  // Close search with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  results.searchCloseViaEsc = await page.evaluate(() => Boolean(document.getElementById('searchSheet')?.hidden));

  // Open search with Control+k
  await page.keyboard.press('Control+k');
  await page.waitForTimeout(300);
  results.searchOpenViaKey = await page.evaluate(() => !document.getElementById('searchSheet')?.hidden);
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);

  // Open settings with gear button
  await page.click('#settingsToggle');
  await page.waitForTimeout(300);
  results.settingsOpenViaBtn = await page.evaluate(() => !document.getElementById('settingsSheet')?.hidden);

  // Close settings with Escape
  await page.keyboard.press('Escape');
  await page.waitForTimeout(300);
  results.settingsCloseViaEsc = await page.evaluate(() => Boolean(document.getElementById('settingsSheet')?.hidden));

  console.log(`  Search: openViaBtn=${results.searchOpenViaBtn}, closeViaEsc=${results.searchCloseViaEsc}, openViaKey=${results.searchOpenViaKey}`);
  console.log(`  Settings: openViaBtn=${results.settingsOpenViaBtn}, closeViaEsc=${results.settingsCloseViaEsc}`);

  // 5. Mobile Viewport (390x844) Navigation
  console.log('\n[7/7] Testing Mobile Viewport (390x844)...');
  const mobContext = await browser.newContext({ viewport: { width: 390, height: 844 } });
  const mobPage = await mobContext.newPage();
  await mobPage.goto(LOCAL_URL, { waitUntil: 'networkidle' });
  await mobPage.waitForTimeout(500);

  const mobNavShotLight = path.join(SCREENSHOTS_DIR, 'navbar_mobile_390_light.png');
  await mobPage.screenshot({ path: mobNavShotLight });
  results.screenshots.navbarMobileLight = mobNavShotLight;

  // Toggle theme on mobile
  await mobPage.click('#themeToggle');
  await mobPage.waitForTimeout(400);
  const mobNavShotDark = path.join(SCREENSHOTS_DIR, 'navbar_mobile_390_dark.png');
  await mobPage.screenshot({ path: mobNavShotDark });
  results.screenshots.navbarMobileDark = mobNavShotDark;

  // Mobile bottom dock navigation check
  const mobDockPages = ['kana', 'vocab', 'kanji', 'home'];
  for (const pageId of mobDockPages) {
    await mobPage.click(`#mobileNav [data-page="${pageId}"]`);
    await mobPage.waitForTimeout(300);
    const active = await mobPage.evaluate(() => document.querySelector('.page.active')?.id);
    console.log(`  Mobile dock click [data-page="${pageId}"]: active = "${active}"`);
  }

  // 6. Accessibility Audit on #siteHeader using axe-core
  console.log('\nRunning axe-core accessibility audit on navbar...');
  await page.evaluate(axeCore.source);
  const axeReport = await page.evaluate(async () => {
    return await axe.run(document.getElementById('siteHeader'), {
      runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'] }
    });
  });

  results.axeViolations = axeReport.violations.filter(v => v.impact === 'serious' || v.impact === 'critical');
  console.log(`  axe serious/critical violations on navbar: ${results.axeViolations.length}`);

  await browser.close();

  fs.writeFileSync('scratch/navbar_regression_results.json', JSON.stringify(results, null, 2));
  console.log('\nResults written to scratch/navbar_regression_results.json');
  return results;
}

runRegressionSuite().then(results => {
  const allNavPass = results.navLinks.every(n => n.pass);
  const allCoverPass = results.coveringLayers.every(c => c.pass);
  const overallPass = allNavPass && allCoverPass && results.historyTest &&
                      results.deepLinkTest && results.themeToggleTest &&
                      results.themePersistenceTest && results.searchOpenViaBtn &&
                      results.settingsOpenViaBtn && results.consoleErrors.length === 0 &&
                      results.axeViolations.length === 0;

  console.log('\n=====================================================');
  console.log('OVERALL REGRESSION TEST STATUS:', overallPass ? 'PASS' : 'FAIL');
  console.log('=====================================================');
  process.exit(overallPass ? 0 : 1);
}).catch(err => {
  console.error('Test script crashed:', err);
  process.exit(1);
});
