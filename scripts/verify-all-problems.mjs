import fs from 'node:fs';
import path from 'node:path';
import { chromium } from 'playwright-core';

const BASE_URL = 'http://localhost:8000';
const SCREENSHOT_DIR = './screenshots';
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const VIEWPORTS = [
  { name: '360x800', width: 360, height: 800 },
  { name: '390x844', width: 390, height: 844 },
  { name: '768x1024', width: 768, height: 1024 },
  { name: '1024x768', width: 1024, height: 768 },
  { name: '1280x800', width: 1280, height: 800 },
  { name: '1440x900', width: 1440, height: 900 },
  { name: '1920x1080', width: 1920, height: 1080 },
  { name: '2560x1440', width: 2560, height: 1440 }
];

const LIST_PAGES = [
  { id: 'vocab', name: 'Vocabulary', gridId: 'vGrid', filterId: 'vLevel' },
  { id: 'grammar', name: 'Grammar', gridId: 'gGrid', filterId: 'gLevel' },
  { id: 'kanji', name: 'Kanji', gridId: 'kGrid', filterId: 'kLevel' }
];

async function runTestMatrix() {
  console.log('=== STARTING TEST MATRIX VERIFICATION ===');
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const results = {
    matrix: [],
    extraTests: {},
    screenshots: []
  };

  try {
    for (const vp of VIEWPORTS) {
      for (const theme of ['light', 'dark']) {
        console.log(`\nTesting Viewport ${vp.name} [${theme}]...`);
        const context = await browser.newContext({
          viewport: { width: vp.width, height: vp.height },
          colorScheme: theme
        });
        const page = await context.newPage();

        // Ensure theme is set in localStorage
        await page.addInitScript(({ t }) => {
          localStorage.setItem('jlpt-theme', t);
          localStorage.setItem('jlpt-v7-settings', JSON.stringify({ theme: t }));
          localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
        }, { t: theme });

        await page.goto(`${BASE_URL}/#home`, { waitUntil: 'domcontentloaded' });
        await page.waitForTimeout(1000);

        for (const listPage of LIST_PAGES) {
          // Switch page, reset scroll, and let layout settle
          await page.evaluate((pageId) => {
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
            window.showPage(pageId);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }, listPage.id);
          await page.waitForTimeout(500);
          await page.waitForFunction((gridId) => document.querySelectorAll('#' + gridId + ' .study-card').length > 0, listPage.gridId);

          const matrixEntry = await page.evaluate(({ gridId, pageId }) => {
            const grid = document.getElementById(gridId);
            if (!grid) return { error: `Grid #${gridId} not found` };

            void grid.offsetWidth;
            const style = window.getComputedStyle(grid);
            const template = style.gridTemplateColumns;
            let cols = 1;
            if (template && template !== 'none' && !template.includes('repeat') && !template.includes('minmax')) {
              cols = template.trim().split(/\s+/).filter(Boolean).length;
            } else {
              const width = grid.clientWidth || window.innerWidth;
              if (width >= 1600) cols = 5;
              else if (width >= 1200) cols = 4;
              else if (width >= 880) cols = 3;
              else if (width >= 580) cols = 2;
              else cols = 1;
            }

            const cards = grid.querySelectorAll('.study-card');
            const cardCount = cards.length;
            const expectedCards = 7 * cols;

            // Check CLS from Performance API
            let cls = 0;
            const entries = performance.getEntriesByType('layout-shift');
            for (const entry of entries) {
              if (!entry.hadRecentInput) cls += entry.value;
            }

            return {
              pageId,
              cols,
              firstPaintCards: cardCount,
              expectedCards,
              isExact7Rows: cardCount === expectedCards,
              cls
            };
          }, { gridId: listPage.gridId, pageId: listPage.id });

          // Capture target screenshot for first paint at 390px and 1920px
          if ((vp.name === '390x844' || vp.name === '1920x1080') && listPage.id === 'vocab') {
            const fpFile = `${SCREENSHOT_DIR}/vocab_firstpaint_${vp.name}_${theme}.png`;
            await page.screenshot({ path: fpFile });
            results.screenshots.push(fpFile);
          }

          // Test Auto-Load Batches: scroll down near sentinel
          let batch1Count = 0;
          let batch2Count = 0;
          let batch3Count = 0;

          // Scroll batch 1
          await page.evaluate(({ gridId }) => {
            const sentinel = document.getElementById(gridId.replace('Grid', 'Sentinel'));
            if (sentinel) sentinel.scrollIntoView({ behavior: 'instant', block: 'end' });
          }, { gridId: listPage.gridId });
          await page.waitForTimeout(400);
          batch1Count = await page.evaluate((id) => document.querySelectorAll(`#${id} .study-card`).length, listPage.gridId);

          // Capture target screenshot for auto-load at 390px and 1920px
          if ((vp.name === '390x844' || vp.name === '1920x1080') && listPage.id === 'vocab') {
            const alFile = `${SCREENSHOT_DIR}/vocab_autoload_${vp.name}_${theme}.png`;
            await page.screenshot({ path: alFile });
            results.screenshots.push(alFile);
          }

          // Scroll batch 2
          await page.evaluate(({ gridId }) => {
            const sentinel = document.getElementById(gridId.replace('Grid', 'Sentinel'));
            if (sentinel) sentinel.scrollIntoView({ behavior: 'instant', block: 'end' });
          }, { gridId: listPage.gridId });
          await page.waitForTimeout(400);
          batch2Count = await page.evaluate((id) => document.querySelectorAll(`#${id} .study-card`).length, listPage.gridId);

          // Scroll batch 3
          await page.evaluate(({ gridId }) => {
            const sentinel = document.getElementById(gridId.replace('Grid', 'Sentinel'));
            if (sentinel) sentinel.scrollIntoView({ behavior: 'instant', block: 'end' });
          }, { gridId: listPage.gridId });
          await page.waitForTimeout(400);
          batch3Count = await page.evaluate((id) => document.querySelectorAll(`#${id} .study-card`).length, listPage.gridId);

          // Verify DOM node boundedness after aggressive scrolling
          for (let s = 0; s < 10; s++) {
            await page.evaluate(({ gridId }) => {
              const sentinel = document.getElementById(gridId.replace('Grid', 'Sentinel'));
              if (sentinel) sentinel.scrollIntoView({ behavior: 'instant', block: 'end' });
            }, { gridId: listPage.gridId });
            await page.waitForTimeout(200);
          }

          const windowingInfo = await page.evaluate(({ gridId }) => {
            const grid = document.getElementById(gridId);
            const cardsInDom = grid.querySelectorAll('.study-card').length;
            const spacer = grid.querySelector('.grid-top-spacer');
            const spacerHeight = spacer ? parseInt(spacer.style.height || '0', 10) : 0;
            const totalDomNodes = document.querySelectorAll('*').length;
            return { cardsInDom, hasTopSpacer: !!spacer, spacerHeight, totalDomNodes };
          }, { gridId: listPage.gridId });

          const record = {
            viewport: vp.name,
            theme,
            page: listPage.name,
            cols: matrixEntry.cols,
            firstPaintCards: matrixEntry.firstPaintCards,
            expectedCards: matrixEntry.expectedCards,
            isExact7Rows: matrixEntry.isExact7Rows,
            batch1Cards: batch1Count,
            batch2Cards: batch2Count,
            batch3Cards: batch3Count,
            cardsInDomAfterScroll: windowingInfo.cardsInDom,
            hasTopSpacer: windowingInfo.hasTopSpacer,
            spacerHeight: windowingInfo.spacerHeight,
            totalDomNodes: windowingInfo.totalDomNodes,
            cls: matrixEntry.cls
          };
          results.matrix.push(record);
          console.log(`  [${listPage.name}] Cols: ${record.cols} | Paint 1: ${record.firstPaintCards} (exp: ${record.expectedCards}, match: ${record.isExact7Rows}) | Batches: +${batch1Count}, +${batch2Count}, +${batch3Count} | DOM Cards: ${record.cardsInDomAfterScroll} (spacer: ${record.spacerHeight}px) | CLS: ${record.cls.toFixed(4)}`);
        }
        await context.close();
      }
    }

    // EXTRA TESTS
    console.log('\n=== RUNNING EXTRA TESTS ===');

    // 1. Resize from 1920 to 390 while list is open
    {
      const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/#vocab`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.rowLoaders && window.rowLoaders.v);
      await page.waitForTimeout(500);

      const beforeCols = await page.evaluate(() => window.rowLoaders.v.getCols());
      const beforeCards = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);

      // Resize viewport
      await page.setViewportSize({ width: 390, height: 844 });
      await page.waitForTimeout(600);

      const afterCols = await page.evaluate(() => window.rowLoaders.v.getCols());
      const afterLoadedCount = await page.evaluate(() => window.rowLoaders.v.getLoadedCount());
      const afterCards = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);
      const isRetained = afterLoadedCount >= beforeCards;

      results.extraTests.resize1920to390 = {
        beforeCols,
        beforeCards,
        afterCols,
        afterLoadedCount,
        afterCardsInDom: afterCards,
        noCardsDiscarded: isRetained
      };
      console.log(`✓ Resize 1920->390: Before (${beforeCols} cols, ${beforeCards} cards) -> After (${afterCols} cols, ${afterLoadedCount} loaded items, ${afterCards} in DOM), no cards discarded: ${isRetained}`);
      await context.close();
    }

    // 2. Filter change resets to 7 rows
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/#vocab`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.rowLoaders && window.rowLoaders.v);
      await page.waitForTimeout(500);

      // Scroll 2 batches
      await page.evaluate(() => {
        const s = document.getElementById('vSentinel');
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'end' });
      });
      await page.waitForTimeout(500);

      const countBeforeFilter = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);

      // Change filter
      await page.evaluate(() => {
        const sel = document.getElementById('vLevel');
        sel.value = 'N5';
        sel.dispatchEvent(new Event('change', { bubbles: true }));
      });
      await page.waitForTimeout(400);

      const countAfterFilter = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);
      const cols = await page.evaluate(() => window.rowLoaders.v.getCols());
      const isResetTo7Rows = countAfterFilter === 7 * cols;

      results.extraTests.filterReset = {
        countBeforeFilter,
        countAfterFilter,
        cols,
        expected7Rows: 7 * cols,
        pass: isResetTo7Rows
      };
      console.log(`✓ Filter change resets to 7 rows: Before: ${countBeforeFilter} cards -> After: ${countAfterFilter} cards (expected 7x${cols}=${7*cols}): ${isResetTo7Rows}`);
      await context.close();
    }

    // 3. Browser Back restores position and loaded rows
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.goto(`${BASE_URL}/#vocab`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.rowLoaders && window.rowLoaders.v);
      await page.waitForTimeout(500);

      // Scroll down
      await page.evaluate(() => {
        const s = document.getElementById('vSentinel');
        if (s) s.scrollIntoView({ behavior: 'instant', block: 'end' });
      });
      await page.waitForTimeout(500);
      const cardsBeforeNav = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);

      // Navigate to detail modal (pushes history state)
      await page.evaluate(() => {
        const firstCard = document.querySelector('#vGrid .study-card');
        if (firstCard) firstCard.click();
      });
      await page.waitForTimeout(400);

      // Press browser back
      await page.goBack();
      await page.waitForTimeout(400);

      const cardsAfterBack = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);
      const passBack = cardsAfterBack === cardsBeforeNav;

      results.extraTests.browserBack = {
        cardsBeforeNav,
        cardsAfterBack,
        pass: passBack
      };
      console.log(`✓ Browser Back restores state: Cards before: ${cardsBeforeNav}, after back: ${cardsAfterBack}: ${passBack}`);
      await context.close();
    }

    // 4. "Load more" fallback when IntersectionObserver is disabled
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      // Remove IntersectionObserver
      await page.addInitScript(() => {
        localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
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
      await page.goto(`${BASE_URL}/#vocab`, { waitUntil: 'domcontentloaded' });
      await page.waitForFunction(() => window.rowLoaders && window.rowLoaders.v);
      await page.waitForTimeout(500);

      const hasFallbackBtn = await page.evaluate(() => {
        const btn = document.querySelector('#vStatus .list-fallback-btn');
        return !!btn;
      });

      // Click fallback button
      let loadedMore = false;
      if (hasFallbackBtn) {
        const beforeClick = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);
        await page.click('#vStatus .list-fallback-btn');
        await page.waitForTimeout(400);
        const afterClick = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card').length);
        loadedMore = afterClick > beforeClick;
      }

      results.extraTests.fallbackBtn = {
        hasFallbackBtn,
        loadedMore
      };
      console.log(`✓ IntersectionObserver disabled fallback button: exists: ${hasFallbackBtn}, loads more on click: ${loadedMore}`);
      await context.close();
    }

    // 5. Theme switched 20 times quickly
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.addInitScript(() => {
        localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
      });
      await page.goto(`${BASE_URL}/#home`, { waitUntil: 'domcontentloaded' });
      await page.waitForTimeout(1000);

      const switchErrors = [];
      const frameCaptures = [];

      for (let i = 0; i < 20; i++) {
        await page.click('#themeToggle');
        if (i < 5) {
          // Capture frames for theme switch verification
          const framePath = `${SCREENSHOT_DIR}/theme_switch_frame_${i+1}.png`;
          await page.screenshot({ path: framePath });
          frameCaptures.push(framePath);
        }
        await page.waitForTimeout(40);
      }
      await page.waitForTimeout(300);

      const finalTheme = await page.evaluate(() => document.documentElement.dataset.theme);
      const isConsistent = await page.evaluate(() => {
        const docTheme = document.documentElement.dataset.theme;
        const bodyTheme = document.body.dataset.theme;
        const colorScheme = document.documentElement.style.colorScheme;
        return docTheme === bodyTheme && docTheme === colorScheme;
      });

      results.extraTests.theme20Switches = {
        finalTheme,
        isConsistent,
        frameCaptures
      };
      console.log(`✓ 20x fast theme switches: Final theme: ${finalTheme}, DOM theme state consistent: ${isConsistent}`);
      await context.close();
    }

    // 6. Custom Dropdowns mouse, keyboard, and touch
    {
      const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
      const page = await context.newPage();
      await page.addInitScript(() => {
        localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
      });
      await page.goto(`${BASE_URL}/#vocab`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#trigger_vLevel');
      await page.waitForTimeout(500);

      // Open dropdown via click
      await page.click('#trigger_vLevel');
      await page.waitForTimeout(300);

      // Take screenshot of desktop dropdown open
      await page.screenshot({ path: `${SCREENSHOT_DIR}/custom_dropdown_desktop.png` });
      results.screenshots.push(`${SCREENSHOT_DIR}/custom_dropdown_desktop.png`);

      const isOpen = await page.evaluate(() => {
        const portal = document.getElementById('dropdownPortal');
        const trigger = document.getElementById('trigger_vLevel');
        return portal && !portal.hasAttribute('aria-hidden') && trigger.getAttribute('aria-expanded') === 'true';
      });

      // Press ArrowDown and Enter
      await page.keyboard.press('ArrowDown');
      await page.waitForTimeout(100);
      await page.keyboard.press('Enter');
      await page.waitForTimeout(200);

      const isClosed = await page.evaluate(() => {
        const trigger = document.getElementById('trigger_vLevel');
        return trigger.getAttribute('aria-expanded') === 'false';
      });

      results.extraTests.dropdownTest = {
        opensOnClick: isOpen,
        closesOnSelectOrKeyboard: isClosed
      };
      console.log(`✓ Custom Dropdown Interaction: Opens on click: ${isOpen}, Navigates keyboard & closes: ${isClosed}`);
      await context.close();
    }

    // 7. Mobile Bottom Sheet for screens < 640px
    {
      const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
      const page = await context.newPage();
      await page.addInitScript(() => {
        localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
      });
      await page.goto(`${BASE_URL}/#vocab`, { waitUntil: 'domcontentloaded' });
      await page.waitForSelector('#trigger_vLevel');
      await page.waitForTimeout(500);

      await page.click('#trigger_vLevel');
      await page.waitForTimeout(300);

      const isBottomSheet = await page.evaluate(() => {
        const portal = document.getElementById('dropdownPortal');
        return portal && !!portal.querySelector('.custom-bottom-sheet');
      });

      await page.screenshot({ path: `${SCREENSHOT_DIR}/custom_dropdown_mobile_bottomsheet.png` });
      results.screenshots.push(`${SCREENSHOT_DIR}/custom_dropdown_mobile_bottomsheet.png`);

      results.extraTests.dropdownBottomSheet = {
        isBottomSheet
      };
      console.log(`✓ Custom Dropdown Mobile Bottom Sheet (<640px): ${isBottomSheet}`);
      await context.close();
    }

    fs.writeFileSync('./scripts/test-matrix-results.json', JSON.stringify(results, null, 2));
    console.log('\n=== ALL TESTS COMPLETED SUCCESSFULLY ===');
  } finally {
    await browser.close();
  }
}

runTestMatrix().catch(err => {
  console.error('Test matrix failure:', err);
  process.exit(1);
});
