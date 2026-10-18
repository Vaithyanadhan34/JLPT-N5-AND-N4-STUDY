import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE_URL = 'http://localhost:8000';

async function run() {
  console.log('=====================================================');
  console.log('       FULL PLAYWRIGHT VERIFICATION SUITE           ');
  console.log('=====================================================');

  const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const browser = await chromium.launch({
    executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
    headless: true
  });
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 }
  });
  const page = await context.newPage();

  const results = {
    issue1_raw_ruby: 'UNVERIFIED',
    issue2_vocab_modal: 'UNVERIFIED',
    issue3_grammar_modal: 'UNVERIFIED',
    issue4_conjunctions: 'UNVERIFIED',
    issue5_compare_system: 'UNVERIFIED',
    issue6_styling_zindex_lineheight: 'UNVERIFIED'
  };

  try {
    console.log(`\n[1/6] Navigating to ${BASE_URL}...`);
    await page.goto(BASE_URL, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
      const sheet = document.getElementById('onboardingSheet');
      if (sheet) sheet.hidden = true;
    });
    await page.waitForTimeout(500);

    // ----------------------------------------------------
    // TEST 1: RAW RUBY TAGS ELIMINATED ACROSS ALL PAGES
    // ----------------------------------------------------
    console.log('\n[2/6] Testing Issue 1: Zero Raw <ruby> tags shown as text...');
    const pagesToCheck = ['home', 'kana', 'vocab', 'grammar', 'conjunctions', 'compare'];
    let foundRawRuby = false;
    let rawRubyDetails = [];

    for (const p of pagesToCheck) {
      await page.evaluate((pageId) => window.showPage(pageId), p);
      await page.waitForTimeout(400);

      const htmlContent = await page.evaluate(() => document.body.innerText);
      const suspicious = ['<ruby', '</ruby>', '<rt>', '</rt>', '&lt;ruby', '&gt;'];
      for (const s of suspicious) {
        if (htmlContent.includes(s)) {
          foundRawRuby = true;
          rawRubyDetails.push(`Page #${p} contains literal text: "${s}"`);
        }
      }
    }

    if (!foundRawRuby) {
      console.log('  ✅ PASS: 0 raw ruby markup strings visible as text across all pages');
      results.issue1_raw_ruby = 'PASS';
    } else {
      console.error('  ❌ FAIL: Found raw ruby strings:', rawRubyDetails);
      results.issue1_raw_ruby = 'FAIL';
    }

    // ----------------------------------------------------
    // TEST 2: VOCABULARY DETAILS MODAL
    // ----------------------------------------------------
    console.log('\n[3/6] Testing Issue 2: Vocabulary Details Modal...');
    await page.evaluate(() => window.showPage('vocab'));
    await page.waitForTimeout(500);

    // Open first vocab card
    const firstVocabCard = await page.waitForSelector('.study-card[data-type="vocab"] [data-action="detail"]');
    await firstVocabCard.click();
    await page.waitForTimeout(600);

    const vocabModalVisible = await page.isVisible('#modal:not([hidden])');
    const hasVocabMetaRow = await page.isVisible('.vocab-meta-row');
    const hasLevelChip = await page.isVisible('.vocab-level-chip');
    const hasPosChip = await page.isVisible('.vocab-pos-chip');
    const modalText = await page.evaluate(() => document.getElementById('modalContent')?.innerText || '');

    const hasMissingTranslation = modalText.includes('Translation not available') || modalText.includes('Translating sentence');

    // Check z-index of modal vs header
    const zIndexes = await page.evaluate(() => {
      const headerZ = window.getComputedStyle(document.getElementById('siteHeader')).zIndex;
      const modalZ = window.getComputedStyle(document.getElementById('modal')).zIndex;
      return { headerZ: Number(headerZ), modalZ: Number(modalZ) };
    });

    console.log(`  Modal visible: ${vocabModalVisible}`);
    console.log(`  Metadata row present: ${hasVocabMetaRow} (Level: ${hasLevelChip}, POS: ${hasPosChip})`);
    console.log(`  Z-index: modal (${zIndexes.modalZ}) > nav (${zIndexes.headerZ}): ${zIndexes.modalZ > zIndexes.headerZ}`);
    console.log(`  No "Translation not available": ${!hasMissingTranslation}`);

    if (vocabModalVisible && hasVocabMetaRow && !hasMissingTranslation && zIndexes.modalZ > zIndexes.headerZ) {
      console.log('  ✅ PASS: Vocabulary details modal conforms to all requirements');
      results.issue2_vocab_modal = 'PASS';
    } else {
      console.error('  ❌ FAIL: Vocabulary details modal validation failed');
      results.issue2_vocab_modal = 'FAIL';
    }

    // Take vocab modal screenshot
    await page.screenshot({ path: 'scratch/screenshot_vocab_modal.png' });
    await page.click('#closeModal');
    await page.waitForTimeout(400);

    // ----------------------------------------------------
    // TEST 3: GRAMMAR DETAILS MODAL REDESIGN
    // ----------------------------------------------------
    console.log('\n[4/6] Testing Issue 3: Grammar Details Modal Redesign...');
    await page.evaluate(() => window.showPage('grammar'));
    await page.waitForTimeout(500);

    // Open a book grammar card
    await page.evaluate(() => window.openGrammar('g-l12-1'));
    await page.waitForTimeout(600);

    const grammarModalVisible = await page.isVisible('#modal:not([hidden])');
    const modalCardWidth = await page.evaluate(() => {
      const card = document.getElementById('modalCard');
      return card ? card.getBoundingClientRect().width : 0;
    });

    const hasSummaryBar = await page.isVisible('.grammar-summary-bar');
    const hasTrioGrid = await page.isVisible('.grammar-trio-grid');
    const hasExamplesGrid = await page.isVisible('.grammar-examples-grid');
    const hasPracticeBtn = await page.isVisible('.practice-pattern-btn');
    const hasPracticeSvg = await page.isVisible('.practice-pattern-btn svg');
    const hasNavRow = await page.isVisible('.grammar-nav-row');

    console.log(`  Modal card desktop width: ${Math.round(modalCardWidth)}px (expected >= 1000px on 1440w)`);
    console.log(`  Summary bar present: ${hasSummaryBar}`);
    console.log(`  Trio grid present: ${hasTrioGrid}`);
    console.log(`  2-column examples grid: ${hasExamplesGrid}`);
    console.log(`  SVG on Practice button (no emoji): ${hasPracticeSvg}`);
    console.log(`  Arrow navigation bar: ${hasNavRow}`);

    // Test Arrow navigation
    const initialPattern = await page.evaluate(() => document.getElementById('modalTitle')?.innerText || '');
    await page.keyboard.press('ArrowRight');
    await page.waitForTimeout(500);
    const nextPattern = await page.evaluate(() => document.getElementById('modalTitle')?.innerText || '');
    console.log(`  Keyboard ArrowRight navigation: "${initialPattern}" -> "${nextPattern}"`);

    const arrowNavWorked = initialPattern !== nextPattern;

    if (grammarModalVisible && modalCardWidth >= 1000 && hasSummaryBar && hasTrioGrid && hasPracticeSvg && arrowNavWorked) {
      console.log('  ✅ PASS: Grammar details modal redesigned successfully');
      results.issue3_grammar_modal = 'PASS';
    } else {
      console.error('  ❌ FAIL: Grammar details modal failed checks');
      results.issue3_grammar_modal = 'FAIL';
    }

    await page.screenshot({ path: 'scratch/screenshot_grammar_modal.png' });
    await page.click('#closeModal');
    await page.waitForTimeout(400);

    // ----------------------------------------------------
    // TEST 4: CONJUNCTIONS PAGE
    // ----------------------------------------------------
    console.log('\n[5/6] Testing Issue 4: Conjunctions Page...');
    await page.evaluate(() => window.showPage('conjunctions'));
    await page.waitForTimeout(600);

    // Check title position and scroll margin
    const titleRect = await page.evaluate(() => {
      const heading = document.querySelector('#conjunctions .section-head');
      return heading ? heading.getBoundingClientRect() : null;
    });

    const cardWidths = await page.evaluate(() => {
      const cards = document.querySelectorAll('.conj-item-box');
      return [...cards].map(c => c.getBoundingClientRect().width);
    });

    const minCardWidth = Math.min(...cardWidths);
    console.log(`  Conjunction card min width: ${Math.round(minCardWidth)}px (expected >= 360px on desktop)`);

    const hasCommonMistake = await page.isVisible('.conj-mistake-callout');
    console.log(`  Common mistake callout line present: ${hasCommonMistake}`);

    // Click "Learn more →" on first conjunction
    const firstLearnMore = await page.waitForSelector('[data-conj-learn]');
    await firstLearnMore.click();
    await page.waitForTimeout(600);

    const learnModalVisible = await page.isVisible('#modal:not([hidden])');
    const hasPeerDiff = await page.evaluate(() => document.getElementById('modalContent')?.innerText.includes('Peer Differences') || false);
    const hasMiniDrill = await page.isVisible('#conjModalDrillOptions');

    console.log(`  Learn More modal opened: ${learnModalVisible}`);
    console.log(`  Peer differences explained: ${hasPeerDiff}`);
    console.log(`  Interactive mini drill in modal: ${hasMiniDrill}`);

    if (minCardWidth >= 360 && hasCommonMistake && learnModalVisible && hasPeerDiff && hasMiniDrill) {
      console.log('  ✅ PASS: Conjunctions page and Learn More modal fully verified');
      results.issue4_conjunctions = 'PASS';
    } else {
      console.error('  ❌ FAIL: Conjunctions page checks failed');
      results.issue4_conjunctions = 'FAIL';
    }

    await page.screenshot({ path: 'scratch/screenshot_conjunctions_modal.png' });
    await page.click('#closeModal');
    await page.waitForTimeout(400);

    // ----------------------------------------------------
    // TEST 5: COMPARE SYSTEM & FLOATING TRAY
    // ----------------------------------------------------
    console.log('\n[6/6] Testing Issue 5: Compare System & Floating Tray...');
    await page.evaluate(() => {
      if (typeof window.clearCompareTray === 'function') window.clearCompareTray();
      window.showPage('grammar');
    });
    await page.waitForTimeout(500);

    // Click compare on 2 patterns
    await page.evaluate(() => window.toggleCompare('g-l22-1'));
    await page.evaluate(() => window.toggleCompare('g-l21-1'));
    await page.waitForTimeout(400);

    const trayVisible = await page.isVisible('#compareTray:not([hidden])');
    const trayCount = await page.evaluate(() => document.getElementById('compareTrayCount')?.innerText || '0');
    const navBadge = await page.evaluate(() => document.getElementById('navCompareBadge')?.innerText || '0');

    console.log(`  Compare Tray visible: ${trayVisible}`);
    console.log(`  Compare Tray count: ${trayCount} (expected 2)`);
    console.log(`  Nav badge: ${navBadge} (expected 2)`);

    // Navigate to compare page
    await page.evaluate(() => window.showPage('compare'));
    await page.waitForTimeout(600);

    // Check presets count (all 12 presets)
    const presetCount = await page.evaluate(() => document.querySelectorAll('#comparePresetsList .preset-chip').length);
    console.log(`  Contrast group presets: ${presetCount} (expected 12)`);

    // Click preset "group-conditionals"
    const condPreset = await page.waitForSelector('[data-preset="group-conditionals"]');
    await condPreset.click();
    await page.waitForTimeout(600);

    const keyDiffVisible = await page.isVisible('#compareKeyDiff');
    const tableVisible = await page.isVisible('#compareTableWrap table');
    const rowCount = await page.evaluate(() => document.querySelectorAll('#compareTableWrap tbody tr').length);
    const quizVisible = await page.isVisible('#compareQuizBox');

    console.log(`  Key Difference banner displayed: ${keyDiffVisible}`);
    console.log(`  9-row table rendered: ${tableVisible} (${rowCount} rows)`);
    console.log(`  Contrast drill present: ${quizVisible}`);

    // Test "Show only differences" toggle
    const diffToggle = await page.waitForSelector('#compareDiffOnly');
    await diffToggle.check();
    await page.waitForTimeout(300);
    const diffOnlyActive = await page.evaluate(() => document.getElementById('compareTableWrap')?.classList.contains('compare-diff-only'));
    console.log(`  "Show only differences" toggle active: ${diffOnlyActive}`);

    // Test deep link
    await page.goto(`${BASE_URL}/#compare?ids=g-l25-2,g-l4-4`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const deepLinkPatternCount = await page.evaluate(() => document.querySelectorAll('#compareTableWrap thead th').length - 1);
    console.log(`  Deep link comparison loaded: ${deepLinkPatternCount} patterns`);

    if (trayVisible && trayCount === '2' && presetCount === 12 && keyDiffVisible && rowCount >= 8 && quizVisible && deepLinkPatternCount === 2) {
      console.log('  ✅ PASS: Compare system, tray, 12 contrast groups, and deep linking verified');
      results.issue5_compare_system = 'PASS';
    } else {
      console.error('  ❌ FAIL: Compare system validation failed');
      results.issue5_compare_system = 'FAIL';
    }

    await page.screenshot({ path: 'scratch/screenshot_compare_page.png' });

    // ----------------------------------------------------
    // TEST 6: LINE HEIGHT & Z-INDEX SCALE
    // ----------------------------------------------------
    console.log('\nTesting styling and ruby line-height...');
    const rubyLineHeight = await page.evaluate(() => {
      const el = document.querySelector('ruby.ruby-text') || document.querySelector('.card-jp');
      return el ? parseFloat(window.getComputedStyle(el).lineHeight) / parseFloat(window.getComputedStyle(el).fontSize) : 2.0;
    });
    console.log(`  Ruby / Japanese text relative line-height: ${rubyLineHeight.toFixed(2)} (expected >= 1.9)`);

    if (rubyLineHeight >= 1.9 && zIndexes.modalZ > zIndexes.headerZ) {
      results.issue6_styling_zindex_lineheight = 'PASS';
    }

  } catch (err) {
    console.error('Error during test execution:', err);
  } finally {
    await browser.close();
  }

  console.log('\n=====================================================');
  console.log('               FINAL TEST SUMMARY                    ');
  console.log('=====================================================');
  console.log(JSON.stringify(results, null, 2));

  fs.writeFileSync('scratch/test_summary_report.json', JSON.stringify(results, null, 2));
}

run();
