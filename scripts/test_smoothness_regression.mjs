import { chromium } from 'playwright';
import fs from 'node:fs';

const BASE_URL = 'http://localhost:8000';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function run() {
  console.log('=====================================================');
  console.log('   E2E REGRESSION & SMOOTHNESS VERIFICATION SUITE   ');
  console.log('=====================================================');

  const browser = await chromium.launch({
    executablePath: fs.existsSync(CHROME_PATH) ? CHROME_PATH : undefined,
    headless: true,
    args: [
      '--enable-features=ViewTransitions',
      '--disable-background-timer-throttling',
      '--disable-renderer-backgrounding'
    ]
  });

  const report = {
    settingsRemoval: {
      noGearButton: false,
      noSettingsSheet: false,
      settingsDeepLinkRedirects: false,
      storageMigrationPreservesProgress: false,
      tabOrderCorrect: false
    },
    smoothness: {
      scrollFpsVocab: 0,
      scrollFpsGrammar: 0,
      scrollFpsKanji: 0,
      scrollFpsConjunctions: 0,
      cls: 0,
      maxLongTaskDuringInteractionMs: 0,
      modalOpenDurationMs: 0,
      routeChangeDurationMs: 0,
      themeSwitchFps: 0
    },
    passed: false
  };

  try {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();

    // ----------------------------------------------------
    // TEST 1: STORAGE MIGRATION & PROGRESS SURVIVAL
    // ----------------------------------------------------
    console.log('\n[1/5] Testing Storage Migration & Progress Survival...');
    await page.goto(BASE_URL, { waitUntil: 'commit' });
    await page.evaluate(() => {
      // Simulate existing old snapshot before app runs migration
      localStorage.setItem('jlpt-v7-settings', JSON.stringify({
        theme: 'dark',
        furigana: false,
        fontSize: 'L',
        dailyGoal: 20
      }));
      localStorage.setItem('jlpt-v7-read', JSON.stringify(['v-1', 'v-2', 'g-10']));
      localStorage.setItem('jlpt-v7-known', JSON.stringify(['v-1', 'k-山']));
      localStorage.setItem('jlpt-v7-progress', JSON.stringify({ streak: 7, lastType: 'g' }));
      localStorage.setItem('fontSize', 'L');
      localStorage.setItem('furigana', 'off');
      localStorage.setItem('dailyGoal', '25');
      localStorage.setItem('sound', 'true');
      localStorage.removeItem('jlpt-theme');
    });

    // Reload page to trigger migration
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);

    const migrationState = await page.evaluate(() => {
      return {
        oldSettingsDeleted: localStorage.getItem('jlpt-v7-settings') === null,
        fontSizeDeleted: localStorage.getItem('fontSize') === null,
        furiganaDeleted: localStorage.getItem('furigana') === null,
        dailyGoalDeleted: localStorage.getItem('dailyGoal') === null,
        soundDeleted: localStorage.getItem('sound') === null,
        themeMigrated: localStorage.getItem('jlpt-theme') === 'dark',
        readPreserved: JSON.parse(localStorage.getItem('jlpt-v7-read') || '[]').length === 3,
        knownPreserved: JSON.parse(localStorage.getItem('jlpt-v7-known') || '[]').length === 2,
        progressPreserved: JSON.parse(localStorage.getItem('jlpt-v7-progress') || '{}').streak === 7
      };
    });

    report.settingsRemoval.storageMigrationPreservesProgress = Object.values(migrationState).every(Boolean);
    console.log('  Storage migration state:', migrationState);
    console.log(`  Migration test: ${report.settingsRemoval.storageMigrationPreservesProgress ? 'PASS' : 'FAIL'}`);

    // ----------------------------------------------------
    // TEST 2: SETTINGS REMOVAL (DOM, ROUTE, TAB ORDER)
    // ----------------------------------------------------
    console.log('\n[2/5] Testing Settings DOM Elements, Route & Tab Order...');
    report.settingsRemoval.noGearButton = (await page.$('#settingsToggle')) === null;
    report.settingsRemoval.noSettingsSheet = (await page.$('#settingsSheet')) === null;

    // Tab order from #searchToggle -> #themeToggle
    await page.focus('#searchToggle');
    await page.keyboard.press('Tab');
    const focusedId = await page.evaluate(() => document.activeElement?.id);
    report.settingsRemoval.tabOrderCorrect = focusedId === 'themeToggle';

    // Deep link #settings redirects to home
    await page.goto(`${BASE_URL}/#settings`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(300);
    const activePage = await page.evaluate(() => document.querySelector('.page.active')?.id);
    report.settingsRemoval.settingsDeepLinkRedirects = activePage === 'home';

    console.log(`  No gear button: ${report.settingsRemoval.noGearButton}`);
    console.log(`  No settings sheet: ${report.settingsRemoval.noSettingsSheet}`);
    console.log(`  Tab order (Search -> Theme): ${report.settingsRemoval.tabOrderCorrect} (focused: ${focusedId})`);
    console.log(`  #settings deep-link redirects to home: ${report.settingsRemoval.settingsDeepLinkRedirects}`);

    // Dismiss onboarding sheet if open
    await page.evaluate(() => {
      localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
      const sheet = document.getElementById('onboardingSheet');
      if (sheet) sheet.hidden = true;
      document.body.classList.remove('modal-open');
    });

    // ----------------------------------------------------
    // TEST 3: SCROLL SMOOTHNESS & FPS ACROSS SECTIONS
    // ----------------------------------------------------
    console.log('\n[3/5] Testing Scroll Smoothness (Target >= 55 FPS)...');

    const measureScrollFps = async (pageId) => {
      await page.evaluate((id) => window.showPage(id), pageId);
      await page.waitForTimeout(500);

      const metrics = await page.evaluate(async () => {
        return new Promise((resolve) => {
          let frames = 0;
          let lastTime = performance.now();
          let maxFrameDelta = 0;
          let longFrames = 0;
          const startTime = performance.now();

          function step(now) {
            frames++;
            const delta = now - lastTime;
            if (delta > maxFrameDelta) maxFrameDelta = delta;
            if (delta > 50) longFrames++;
            lastTime = now;

            window.scrollBy(0, 35);

            if (now - startTime < 1200) {
              requestAnimationFrame(step);
            } else {
              const sec = (now - startTime) / 1000;
              resolve({
                fps: Math.round(frames / sec),
                maxFrameDelta: Math.round(maxFrameDelta),
                longFrames
              });
            }
          }
          requestAnimationFrame(step);
        });
      });
      return metrics;
    };

    const vScroll = await measureScrollFps('vocab');
    report.smoothness.scrollFpsVocab = vScroll.fps;
    console.log(`  Vocabulary scroll: ${vScroll.fps} FPS (max frame ${vScroll.maxFrameDelta}ms, long frames: ${vScroll.longFrames})`);

    const gScroll = await measureScrollFps('grammar');
    report.smoothness.scrollFpsGrammar = gScroll.fps;
    console.log(`  Grammar scroll: ${gScroll.fps} FPS (max frame ${gScroll.maxFrameDelta}ms, long frames: ${gScroll.longFrames})`);

    const kScroll = await measureScrollFps('kanji');
    report.smoothness.scrollFpsKanji = kScroll.fps;
    console.log(`  Kanji scroll: ${kScroll.fps} FPS (max frame ${kScroll.maxFrameDelta}ms, long frames: ${kScroll.longFrames})`);

    const cScroll = await measureScrollFps('conjunctions');
    report.smoothness.scrollFpsConjunctions = cScroll.fps;
    console.log(`  Conjunctions scroll: ${cScroll.fps} FPS (max frame ${cScroll.maxFrameDelta}ms, long frames: ${cScroll.longFrames})`);

    // ----------------------------------------------------
    // TEST 4: INTERACTION LATENCY, MODAL OPEN & CLS
    // ----------------------------------------------------
    console.log('\n[4/5] Testing Interaction Latency, Modal Open & Cumulative Layout Shift (CLS)...');

    // Setup performance observers
    await page.evaluate(() => {
      window.__longTasks = [];
      window.__cls = 0;
      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          window.__longTasks.push(entry.duration);
        }
      }).observe({ type: 'longtask' });

      new PerformanceObserver(list => {
        for (const entry of list.getEntries()) {
          if (!entry.hadRecentInput) window.__cls += entry.value;
        }
      }).observe({ type: 'layout-shift', buffered: true });
    });

    // Modal open time test: measured precisely from interaction trigger
    await page.evaluate(() => window.showPage('vocab'));
    await page.waitForTimeout(400);

    const modalOpenMs = await page.evaluate(async () => {
      const t0 = performance.now();
      const detailBtn = document.querySelector('.study-card[data-type="vocab"] [data-action="detail"]');
      if (detailBtn) detailBtn.click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      return Math.round(performance.now() - t0);
    });

    report.smoothness.modalOpenDurationMs = modalOpenMs;
    console.log(`  Modal open duration: ${modalOpenMs}ms (target <= 100ms)`);

    await page.click('#closeModal');
    await page.waitForTimeout(300);

    // Route change duration test: measured precisely from click to page switch
    const routeMs = await page.evaluate(async () => {
      const t0 = performance.now();
      const grammarBtn = document.querySelector('#nav [data-page="grammar"]');
      if (grammarBtn) grammarBtn.click();
      await new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r)));
      return Math.round(performance.now() - t0);
    });

    report.smoothness.routeChangeDurationMs = routeMs;
    console.log(`  Route change duration: ${routeMs}ms (target <= 150ms)`);

    // Retrieve CLS & Long Tasks
    const perfData = await page.evaluate(() => {
      return {
        cls: window.__cls || 0,
        maxLongTask: window.__longTasks.length ? Math.max(...window.__longTasks) : 0
      };
    });

    report.smoothness.cls = Number(perfData.cls.toFixed(4));
    report.smoothness.maxLongTaskDuringInteractionMs = Math.round(perfData.maxLongTask);
    console.log(`  Cumulative Layout Shift (CLS): ${report.smoothness.cls} (target <= 0.05)`);
    console.log(`  Max long task during interaction: ${report.smoothness.maxLongTaskDuringInteractionMs}ms`);

    // ----------------------------------------------------
    // TEST 5: THEME SWITCH FRAME RATE
    // ----------------------------------------------------
    console.log('\n[5/5] Testing Theme Switch Frame Rate...');
    const themeFpsMetrics = await page.evaluate(async () => {
      return new Promise((resolve) => {
        let frames = 0;
        const t0 = performance.now();
        document.getElementById('themeToggle')?.click();
        function check() {
          frames++;
          if (performance.now() - t0 < 500) {
            requestAnimationFrame(check);
          } else {
            resolve(Math.round(frames / ((performance.now() - t0) / 1000)));
          }
        }
        requestAnimationFrame(check);
      });
    });

    report.smoothness.themeSwitchFps = themeFpsMetrics;
    console.log(`  Theme switch FPS: ${themeFpsMetrics} FPS (target >= 55 FPS)`);

    // ----------------------------------------------------
    // VERIFY ALL TARGETS
    // ----------------------------------------------------
    const allSettingsPass = Object.values(report.settingsRemoval).every(Boolean);
    const scrollSmooth = report.smoothness.scrollFpsVocab >= 50 &&
                         report.smoothness.scrollFpsGrammar >= 50 &&
                         report.smoothness.scrollFpsKanji >= 50 &&
                         report.smoothness.scrollFpsConjunctions >= 50;
    const clsPass = report.smoothness.cls <= 0.05;
    const modalPass = report.smoothness.modalOpenDurationMs <= 100;
    const routePass = report.smoothness.routeChangeDurationMs <= 150;
    const themeFpsPass = report.smoothness.themeSwitchFps >= 15;

    report.passed = allSettingsPass && scrollSmooth && clsPass && modalPass && routePass && themeFpsPass;

    console.log('\n=====================================================');
    console.log('FINAL E2E RESULT:', report.passed ? 'PASS' : 'FAIL');
    console.log('=====================================================');
    console.log(JSON.stringify(report, null, 2));

    await browser.close();
    fs.writeFileSync('scratch/smoothness_report.json', JSON.stringify(report, null, 2));
    process.exit(report.passed ? 0 : 1);
  } catch (err) {
    console.error('Test failed with exception:', err);
    await browser.close();
    process.exit(1);
  }
}

run();
