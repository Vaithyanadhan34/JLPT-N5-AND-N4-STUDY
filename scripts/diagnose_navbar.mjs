import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const LOCAL_URL = 'http://localhost:8000/';
const PROD_URL = 'https://jlpt-n5-and-n4-study.vercel.app/';

const SCREENSHOTS_DIR = path.resolve('screenshots/diagnosis');
if (!fs.existsSync(SCREENSHOTS_DIR)) fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });

async function diagnoseTarget(name, url, browser) {
  console.log(`\n======================================================`);
  console.log(`DIAGNOSING TARGET: ${name} (${url})`);
  console.log(`======================================================`);

  const results = {
    target: name,
    url,
    consoleErrors: [],
    consoleWarnings: [],
    networkFailures: [],
    networkRequests: [],
    firstError: null,
    coveringLayerChecks: [],
    navPointerEvents: {},
    themeButtonDom: {},
    eventWiring: {},
    routingChecks: [],
    themeLogic: {},
    swCheck: {},
    keyboardShortcut: {},
    buttonClickTests: []
  };

  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      results.consoleErrors.push({ text: msg.text(), location: msg.location() });
      if (!results.firstError) results.firstError = msg.text();
    } else if (msg.type() === 'warning') {
      results.consoleWarnings.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    results.consoleErrors.push({ text: err.message, stack: err.stack });
    if (!results.firstError) results.firstError = err.message;
  });

  page.on('response', resp => {
    const req = resp.request();
    const entry = {
      url: resp.url(),
      status: resp.status(),
      contentType: resp.headers()['content-type'] || '',
      ok: resp.ok()
    };
    results.networkRequests.push(entry);
    if (!resp.ok() && resp.status() !== 304) {
      results.networkFailures.push(entry);
    }
  });

  // Navigate to target
  await page.goto(url, { waitUntil: 'networkidle' }).catch(err => {
    results.consoleErrors.push({ text: 'Navigation failed: ' + err.message });
  });
  await page.waitForTimeout(1000);

  // Take screenshot of navbar in current state
  const navBarEl = await page.$('.site-header, header');
  if (navBarEl) {
    await navBarEl.screenshot({ path: path.join(SCREENSHOTS_DIR, `${name}_navbar_initial.png`) });
  }

  // 1 & 2: Console & Network already collected.

  // 4: Covering-layer test on every nav button, theme button, search, and settings
  const targetSelectors = [
    '#nav button[data-page="home"]',
    '#nav button[data-page="kana"]',
    '#nav button[data-page="vocab"]',
    '#nav button[data-page="kanji"]',
    '#nav button[data-page="grammar"]',
    '#nav button[data-page="conjunctions"]',
    '#nav button[data-page="compare"]',
    '#nav button[data-page="companion"]',
    '#nav button[data-page="quiz"]',
    '#nav button[data-page="how"]',
    '#searchToggle',
    '#themeToggle'
  ];

  for (const sel of targetSelectors) {
    const check = await page.evaluate((selector) => {
      const el = document.querySelector(selector);
      if (!el) return { selector, found: false };
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const topEl = document.elementFromPoint(cx, cy);
      const isSelfOrChild = topEl === el || el.contains(topEl);
      return {
        selector,
        found: true,
        rect: { left: rect.left, top: rect.top, width: rect.width, height: rect.height },
        center: { cx, cy },
        topElementTag: topEl ? topEl.tagName : null,
        topElementId: topEl ? topEl.id : null,
        topElementClass: topEl ? topEl.className : null,
        isSelfOrChild,
        computedZIndex: topEl ? window.getComputedStyle(topEl).zIndex : null,
        computedPointerEvents: topEl ? window.getComputedStyle(topEl).pointerEvents : null
      };
    }, sel);
    results.coveringLayerChecks.push(check);
  }

  // 5: Check pointer-events, inert, aria-hidden, hidden, open modals
  results.navPointerEvents = await page.evaluate(() => {
    const nav = document.getElementById('nav');
    const header = document.querySelector('.site-header');
    const modals = Array.from(document.querySelectorAll('.modal, .sheet, [role="dialog"]')).map(m => ({
      id: m.id,
      className: m.className,
      hidden: m.hidden,
      display: window.getComputedStyle(m).display,
      pointerEvents: window.getComputedStyle(m).pointerEvents,
      zIndex: window.getComputedStyle(m).zIndex
    }));
    return {
      headerPointerEvents: header ? window.getComputedStyle(header).pointerEvents : null,
      headerZIndex: header ? window.getComputedStyle(header).zIndex : null,
      navPointerEvents: nav ? window.getComputedStyle(nav).pointerEvents : null,
      bodyModalOpenClass: document.body.classList.contains('modal-open'),
      modals
    };
  });

  // 6: Theme button inspection
  results.themeButtonDom = await page.evaluate(() => {
    const btn = document.getElementById('themeToggle');
    if (!btn) return { exists: false };
    const slot = document.getElementById('themeIconSlot');
    const rect = btn.getBoundingClientRect();
    const btnCs = window.getComputedStyle(btn);
    const svg = btn.querySelector('svg');
    const svgCs = svg ? window.getComputedStyle(svg) : null;
    return {
      exists: true,
      innerHTML: btn.innerHTML,
      slotInnerHTML: slot ? slot.innerHTML : null,
      hasSvg: Boolean(svg),
      buttonDimensions: { width: rect.width, height: rect.height },
      buttonBg: btnCs.backgroundColor,
      buttonColor: btnCs.color,
      buttonDisplay: btnCs.display,
      ariaLabel: btn.getAttribute('aria-label'),
      ariaPressed: btn.getAttribute('aria-pressed'),
      svgDisplay: svgCs ? svgCs.display : null,
      svgWidth: svgCs ? svgCs.width : null,
      svgHeight: svgCs ? svgCs.height : null,
      svgFill: svgCs ? svgCs.fill : null,
      svgStroke: svgCs ? svgCs.stroke : null,
      svgColor: svgCs ? svgCs.color : null
    };
  });

  // 7: Event wiring inspection
  results.eventWiring = await page.evaluate(() => {
    const nav = document.getElementById('nav');
    const themeToggle = document.getElementById('themeToggle');
    return {
      navExists: Boolean(nav),
      navItemCount: nav ? nav.querySelectorAll('button').length : 0,
      themeToggleExists: Boolean(themeToggle),
      scriptTags: Array.from(document.querySelectorAll('script')).map(s => ({
        src: s.src,
        type: s.type,
        defer: s.defer,
        async: s.async
      }))
    };
  });

  // 8: Routing checks & link click responsiveness
  for (const pageName of ['home', 'kana', 'vocab', 'kanji', 'grammar', 'conjunctions', 'compare', 'companion', 'quiz', 'how']) {
    const sel = `#nav button[data-page="${pageName}"]`;
    const beforePage = await page.evaluate(() => document.querySelector('.page.active')?.id);
    
    let clicked = false;
    let urlChanged = false;
    let newActivePage = null;

    try {
      await page.click(sel, { timeout: 2000 });
      clicked = true;
      await page.waitForTimeout(300);
      newActivePage = await page.evaluate(() => document.querySelector('.page.active')?.id);
      urlChanged = (newActivePage === pageName);
    } catch (e) {
      clicked = false;
    }

    results.buttonClickTests.push({
      item: pageName,
      selector: sel,
      clicked,
      beforePage,
      afterPage: newActivePage,
      viewChanged: urlChanged
    });
  }

  // Click test on Theme Toggle
  const themeBefore = await page.evaluate(() => document.documentElement.dataset.theme || document.body.dataset.theme);
  let themeClicked = false;
  let themeAfter = null;
  try {
    await page.click('#themeToggle', { timeout: 2000 });
    themeClicked = true;
    await page.waitForTimeout(300);
    themeAfter = await page.evaluate(() => document.documentElement.dataset.theme || document.body.dataset.theme);
  } catch (e) {
    themeClicked = false;
  }
  results.buttonClickTests.push({
    item: 'themeToggle',
    clicked: themeClicked,
    beforeTheme: themeBefore,
    afterTheme: themeAfter,
    themeChanged: themeBefore !== themeAfter
  });

  // 11: Keyboard shortcut check
  const shortcutHint = await page.evaluate(() => {
    const hint = document.querySelector('.kbd-hint');
    return hint ? hint.textContent.trim() : null;
  });
  results.keyboardShortcut.hintText = shortcutHint;

  await page.close();
  await context.close();

  return results;
}

async function runDiagnosis() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const localResults = await diagnoseTarget('LOCAL', LOCAL_URL, browser);
  const prodResults = await diagnoseTarget('PROD', PROD_URL, browser);

  await browser.close();

  const report = { local: localResults, prod: prodResults };
  fs.writeFileSync('scratch/diagnosis_report.json', JSON.stringify(report, null, 2), 'utf-8');
  console.log('\nDiagnostic complete. Report saved to scratch/diagnosis_report.json');
}

runDiagnosis().catch(err => {
  console.error('Diagnosis failed:', err);
  process.exit(1);
});
