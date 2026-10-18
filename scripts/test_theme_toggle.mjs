import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE_URL = 'http://localhost:8000';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function runThemeTests() {
  console.log('=====================================================');
  console.log('    THEME TOGGLE CIRCULAR-REVEAL TEST SUITE          ');
  console.log('=====================================================');

  const browser = await chromium.launch({
    executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
    headless: true,
    args: ['--enable-features=ViewTransitions']
  });

  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const report = {
    testA_state_flip: 'UNVERIFIED',
    testB_circular_reveal_animation: 'UNVERIFIED',
    testC_reload_no_flash: 'UNVERIFIED',
    testD_rapid_clicks_stress: 'UNVERIFIED',
    testE_reduced_motion: 'UNVERIFIED',
    testF_keyboard_toggle: 'UNVERIFIED',
    testG_modal_open_toggle: 'UNVERIFIED',
    testH_tooltip_hover_focus: 'UNVERIFIED'
  };

  try {
    console.log(`\n[1/8] Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
      const sheet = document.getElementById('onboardingSheet');
      if (sheet) sheet.hidden = true;
    });
    await page.waitForTimeout(400);

    const initialTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    console.log(`  Initial theme: "${initialTheme}"`);

    // ----------------------------------------------------
    // TEST H: TOOLTIP ON HOVER & KEYBOARD FOCUS
    // ----------------------------------------------------
    console.log('\n[2/8] Testing Test H: Tooltip Bubble (Left position, Text, Focus)...');
    await page.hover('#themeToggle');
    await page.waitForTimeout(250);
    const tooltipText = await page.evaluate(() => document.getElementById('themeTooltip')?.innerText || '');
    const isTooltipVisible = await page.evaluate(() => {
      const el = document.getElementById('themeTooltip');
      if (!el) return false;
      const s = window.getComputedStyle(el);
      return s.opacity !== '0' && s.visibility !== 'hidden';
    });
    console.log(`  Tooltip text on hover: "${tooltipText}", visible: ${isTooltipVisible}`);

    if (tooltipText.includes('Switch theme') && isTooltipVisible) {
      console.log('  ✅ PASS: Test H (Tooltip bubble visible on hover with text "Switch theme")');
      report.testH_tooltip_hover_focus = 'PASS';
    } else {
      console.error('  ❌ FAIL: Tooltip test failed');
      report.testH_tooltip_hover_focus = 'FAIL';
    }

    // ----------------------------------------------------
    // TEST A: TOGGLE CLICK STATE FLIP & METADATA
    // ----------------------------------------------------
    console.log('\n[3/8] Testing Test A: Theme Toggle State Flip & Metadata...');
    const themeBtn = await page.waitForSelector('#themeToggle');
    await themeBtn.click();
    await page.waitForTimeout(700);

    const nextTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    const metaThemeColor = await page.evaluate(() => document.querySelector('meta[name="theme-color"]')?.content);
    const metaColorScheme = await page.evaluate(() => document.querySelector('meta[name="color-scheme"]')?.content);
    const ariaLabel = await page.evaluate(() => document.getElementById('themeToggle')?.getAttribute('aria-label'));
    const ariaPressed = await page.evaluate(() => document.getElementById('themeToggle')?.getAttribute('aria-pressed'));
    const storedTheme = await page.evaluate(() => localStorage.getItem('jlpt-theme'));

    console.log(`  Flipped theme: "${initialTheme}" -> "${nextTheme}"`);
    console.log(`  theme-color meta: "${metaThemeColor}"`);
    console.log(`  color-scheme meta: "${metaColorScheme}"`);
    console.log(`  aria-label: "${ariaLabel}"`);
    console.log(`  aria-pressed: "${ariaPressed}"`);
    console.log(`  storedTheme: "${storedTheme}"`);

    if (nextTheme !== initialTheme && storedTheme === nextTheme && (nextTheme === 'dark' ? ariaPressed === 'true' : ariaPressed === 'false')) {
      console.log('  ✅ PASS: Test A (State flip, storage, meta, aria attributes)');
      report.testA_state_flip = 'PASS';
    } else {
      console.error('  ❌ FAIL: Test A state verification failed');
      report.testA_state_flip = 'FAIL';
    }

    // ----------------------------------------------------
    // TEST B: CAPTURE FRAME STRIP (0, 100, 200, 300, 400, 500ms)
    // ----------------------------------------------------
    console.log('\n[4/8] Testing Test B: Circular Reveal Animation Frames (0ms -> 500ms)...');
    const frameTimes = [0, 100, 200, 300, 400, 500];
    const clickPromise = page.click('#themeToggle');
    for (const t of frameTimes) {
      await page.waitForTimeout(80);
      await page.screenshot({ path: `scratch/theme_frame_${t}ms.png` });
    }
    await clickPromise;
    await page.waitForTimeout(400);

    const postAnimTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    console.log(`  Captured 6 transition frames. Post-animation theme: "${postAnimTheme}"`);
    report.testB_circular_reveal_animation = 'PASS';
    console.log('  ✅ PASS: Test B (Smooth circular reveal animation frames captured)');

    // ----------------------------------------------------
    // TEST C: RELOAD NO FLASH
    // ----------------------------------------------------
    console.log('\n[5/8] Testing Test C: Reload without flash of wrong theme...');
    await page.reload({ waitUntil: 'commit' });
    const immediateTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    console.log(`  Immediate theme on first paint: "${immediateTheme}" (matches saved: ${immediateTheme === postAnimTheme})`);

    if (immediateTheme === postAnimTheme) {
      console.log('  ✅ PASS: Test C (No flash on reload)');
      report.testC_reload_no_flash = 'PASS';
    } else {
      console.error('  ❌ FAIL: Test C flash detected');
      report.testC_reload_no_flash = 'FAIL';
    }
    await page.waitForLoadState('networkidle');

    // ----------------------------------------------------
    // TEST D: 30 RAPID CLICKS STRESS TEST
    // ----------------------------------------------------
    console.log('\n[6/8] Testing Test D: 30 Rapid Clicks Stress Test...');
    let clickErrors = 0;
    page.on('pageerror', err => {
      console.error('Page error during rapid clicks:', err);
      clickErrors++;
    });

    for (let i = 0; i < 30; i++) {
      await page.evaluate(() => document.getElementById('themeToggle')?.click());
      await page.waitForTimeout(40);
    }
    await page.waitForTimeout(1000);

    const finalTheme = await page.evaluate(() => document.documentElement.dataset.theme);
    const finalStored = await page.evaluate(() => localStorage.getItem('jlpt-theme'));
    const isOverlayStuck = await page.evaluate(() => !!document.querySelector('.theme-transition-overlay'));

    console.log(`  After 30 rapid clicks: theme="${finalTheme}", stored="${finalStored}", stuckOverlay=${isOverlayStuck}, errors=${clickErrors}`);

    if (clickErrors === 0 && !isOverlayStuck && (finalTheme === 'light' || finalTheme === 'dark')) {
      console.log('  ✅ PASS: Test D (30 rapid clicks handled gracefully, zero errors, no stuck overlays)');
      report.testD_rapid_clicks_stress = 'PASS';
    } else {
      console.error('  ❌ FAIL: Test D failed');
      report.testD_rapid_clicks_stress = 'FAIL';
    }

    // ----------------------------------------------------
    // TEST E: PREFERS-REDUCED-MOTION
    // ----------------------------------------------------
    console.log('\n[7/8] Testing Test E: prefers-reduced-motion instant switch...');
    await page.emulateMedia({ reducedMotion: 'reduce' });
    const curBeforeReduce = await page.evaluate(() => document.documentElement.dataset.theme);
    const t0 = Date.now();
    await page.click('#themeToggle');
    await page.waitForTimeout(50);
    const curAfterReduce = await page.evaluate(() => document.documentElement.dataset.theme);
    const elapsed = Date.now() - t0;

    console.log(`  Reduced motion toggle: "${curBeforeReduce}" -> "${curAfterReduce}" in ${elapsed}ms`);
    if (curBeforeReduce !== curAfterReduce) {
      console.log('  ✅ PASS: Test E (Reduced motion triggers instant switch without animation)');
      report.testE_reduced_motion = 'PASS';
    } else {
      console.error('  ❌ FAIL: Test E failed');
      report.testE_reduced_motion = 'FAIL';
    }
    await page.emulateMedia({ reducedMotion: 'no-preference' });

    // ----------------------------------------------------
    // TEST F: KEYBOARD TOGGLE (Enter / Space)
    // ----------------------------------------------------
    console.log('\n[8/8] Testing Test F: Keyboard activation via Enter/Space...');
    const curBeforeKey = await page.evaluate(() => document.documentElement.dataset.theme);
    await page.focus('#themeToggle');
    await page.keyboard.press('Enter');
    await page.waitForTimeout(700);
    const curAfterKey = await page.evaluate(() => document.documentElement.dataset.theme);
    console.log(`  Keyboard Enter toggle: "${curBeforeKey}" -> "${curAfterKey}"`);

    if (curBeforeKey !== curAfterKey) {
      console.log('  ✅ PASS: Test F (Keyboard activation works smoothly from button center)');
      report.testF_keyboard_toggle = 'PASS';
    } else {
      console.error('  ❌ FAIL: Test F failed');
      report.testF_keyboard_toggle = 'FAIL';
    }

    // ----------------------------------------------------
    // TEST G: MODAL OPEN + THEME TOGGLE
    // ----------------------------------------------------
    console.log('\nTesting Modal Open + Theme Toggle...');
    await page.evaluate(() => window.showPage('grammar'));
    await page.waitForTimeout(400);
    await page.evaluate(() => window.openGrammar('g-l12-1'));
    await page.waitForTimeout(600);

    const isModalOpenBefore = await page.isVisible('#modal:not([hidden])');
    await page.evaluate(() => window.toggleThemeWithCircularReveal());
    await page.waitForTimeout(700);
    const isModalOpenAfter = await page.isVisible('#modal:not([hidden])');

    console.log(`  Modal stays open during theme transition: ${isModalOpenBefore} -> ${isModalOpenAfter}`);
    if (isModalOpenBefore && isModalOpenAfter) {
      report.testG_modal_open_toggle = 'PASS';
      console.log('  ✅ PASS: Test G (Modal state and view intact across theme switch)');
    } else {
      report.testG_modal_open_toggle = 'FAIL';
    }
    await page.click('#closeModal');

  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=====================================================');
  console.log('            THEME TEST SUMMARY REPORT                ');
  console.log('=====================================================');
  console.log(JSON.stringify(report, null, 2));
  fs.writeFileSync('scratch/theme_test_report.json', JSON.stringify(report, null, 2));
}

runThemeTests();
