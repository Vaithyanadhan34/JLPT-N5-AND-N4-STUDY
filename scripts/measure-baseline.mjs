import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const MOTO_G_POWER = {
  viewport: { width: 412, height: 823 },
  deviceScaleFactor: 1.75,
  isMobile: true,
  hasTouch: true,
  userAgent: 'Mozilla/5.0 (Linux; Android 11; moto g power (2021)) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Mobile Safari/537.36'
};

const THROTTLING_SLOW_4G = {
  offline: false,
  latency: 150, // ms
  downloadThroughput: (500 * 1024) / 8, // 500 kbps = 62.5 KB/s
  uploadThroughput: (500 * 1024) / 8,
  connectionType: 'cellular4g'
};

const PAGES = [
  { name: 'Home', id: 'home', hash: '#home' },
  { name: 'Kana', id: 'kana', hash: '#kana' },
  { name: 'Vocabulary', id: 'vocab', hash: '#vocab' },
  { name: 'Kanji', id: 'kanji', hash: '#kanji' },
  { name: 'Grammar', id: 'grammar', hash: '#grammar' },
  { name: 'Quiz', id: 'quiz', hash: '#quiz' }
];

async function setupPageWithThrottling(browser, targetUrl) {
  const context = await browser.newContext(MOTO_G_POWER);
  const page = await context.newPage();
  const cdp = await page.context().newCDPSession(page);

  await cdp.send('Network.enable');
  await cdp.send('Performance.enable');
  await cdp.send('Emulation.setCPUThrottlingRate', { rate: 4 });
  await cdp.send('Network.emulateNetworkConditions', THROTTLING_SLOW_4G);

  return { context, page, cdp };
}

function attachNetworkTracker(page) {
  const resources = {
    js: { transferred: 0, decoded: 0, count: 0 },
    css: { transferred: 0, decoded: 0, count: 0 },
    json: { transferred: 0, decoded: 0, count: 0 },
    font: { transferred: 0, decoded: 0, count: 0 },
    doc: { transferred: 0, decoded: 0, count: 0 },
    other: { transferred: 0, decoded: 0, count: 0 },
    totalTransferred: 0,
    requests: []
  };

  page.on('response', async (res) => {
    try {
      const url = res.url();
      const status = res.status();
      const headers = res.headers();
      const contentType = headers['content-type'] || '';
      const contentLength = parseInt(headers['content-length'] || '0', 10);
      
      let bodySize = contentLength;
      try {
        const body = await res.body();
        bodySize = body ? body.length : contentLength;
      } catch {}

      let cat = 'other';
      if (contentType.includes('javascript') || url.endsWith('.js') || url.includes('.js?')) {
        cat = 'js';
      } else if (contentType.includes('css') || url.endsWith('.css') || url.includes('.css?')) {
        cat = 'css';
      } else if (contentType.includes('json') || url.endsWith('.json') || url.includes('.json?')) {
        cat = 'json';
      } else if (contentType.includes('font') || url.includes('fonts.gstatic') || url.endsWith('.woff2') || url.endsWith('.woff')) {
        cat = 'font';
      } else if (contentType.includes('html') || url.endsWith('.html') || url === page.url()) {
        cat = 'doc';
      }

      resources[cat].count++;
      resources[cat].transferred += bodySize;
      resources[cat].decoded += bodySize;
      resources.totalTransferred += bodySize;
      resources.requests.push({ url, cat, status, size: bodySize });
    } catch {}
  });

  return resources;
}

async function capturePageMetrics(page, cdp) {
  await page.waitForTimeout(1000);

  const evalMetrics = await page.evaluate(() => {
    const domNodes = document.querySelectorAll('*').length;
    const navEntries = performance.getEntriesByType('navigation');
    const nav = navEntries[0] || {};
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(p => p.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : (nav.domContentLoadedEventEnd || 0);

    const mem = window.performance && window.performance.memory ? {
      usedJSHeap: window.performance.memory.usedJSHeapSize,
      totalJSHeap: window.performance.memory.totalJSHeapSize
    } : null;

    return { domNodes, fcp, mem };
  });

  const cdpMetricsRes = await cdp.send('Performance.getMetrics');
  const cdpMetrics = {};
  for (const m of cdpMetricsRes.metrics) {
    cdpMetrics[m.name] = m.value;
  }

  let runtimeHeap = {};
  try {
    runtimeHeap = await cdp.send('Runtime.getHeapUsage');
  } catch {}

  return {
    domNodes: evalMetrics.domNodes,
    fcp: evalMetrics.fcp,
    jsHeapUsedMB: ((runtimeHeap.usedSize || cdpMetrics['JSHeapUsedSize'] || (evalMetrics.mem ? evalMetrics.mem.usedJSHeap : 0)) / (1024 * 1024)),
    jsHeapTotalMB: ((runtimeHeap.totalSize || cdpMetrics['JSHeapTotalSize'] || (evalMetrics.mem ? evalMetrics.mem.totalJSHeap : 0)) / (1024 * 1024)),
    layoutCount: cdpMetrics['LayoutCount'] || 0,
    recalcStyleCount: cdpMetrics['RecalcStyleCount'] || 0,
    scriptDuration: cdpMetrics['ScriptDuration'] || 0,
    taskDuration: cdpMetrics['TaskDuration'] || 0
  };
}

async function runSessionTest(browser, baseUrl) {
  console.log(`\n--- Running Scripted Session & Memory Leak Test on ${baseUrl} ---`);
  const { context, page, cdp } = await setupPageWithThrottling(browser, baseUrl);
  
  await page.evaluate(() => {
    window.__longTasks = [];
    try {
      const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          window.__longTasks.push({
            name: entry.name,
            startTime: entry.startTime,
            duration: entry.duration
          });
        }
      });
      observer.observe({ type: 'longtask', buffered: true });
    } catch {}
  });

  // 1. Open Home
  await page.goto(baseUrl, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000); // allow data loading
  
  const heapStart = await cdp.send('Runtime.getHeapUsage');
  const domStart = await page.evaluate(() => document.querySelectorAll('*').length);
  console.log(`[Home initial] Heap: ${(heapStart.usedSize / 1048576).toFixed(2)} MB, DOM: ${domStart}`);

  let peakHeap = heapStart.usedSize;

  // 2. Kana
  await page.evaluate(() => { if (typeof showPage === 'function') showPage('kana', false); else location.hash = '#kana'; });
  await page.waitForTimeout(1500);

  // 3. Vocabulary scroll 200 cards
  await page.evaluate(() => { if (typeof showPage === 'function') showPage('vocab', false); else location.hash = '#vocab'; });
  await page.waitForTimeout(2000);

  // Click load more button until we have ~200 cards
  for (let i = 0; i < 8; i++) {
    const hasMore = await page.evaluate(() => {
      const btn = document.querySelector('[data-load="v"], .load-more');
      if (btn) { btn.click(); return true; }
      return false;
    });
    if (hasMore) {
      await page.waitForTimeout(300);
    } else {
      break;
    }
  }

  let curHeap = (await cdp.send('Runtime.getHeapUsage')).usedSize;
  if (curHeap > peakHeap) peakHeap = curHeap;
  const vocabCardsCount = await page.evaluate(() => document.querySelectorAll('#vGrid .study-card, #vGrid .card').length);
  const domAfterVocab = await page.evaluate(() => document.querySelectorAll('*').length);
  console.log(`[Vocab ~200] Cards in DOM: ${vocabCardsCount}, Total DOM: ${domAfterVocab}, Heap: ${(curHeap / 1048576).toFixed(2)} MB`);

  // 4. Open/close 20 modals
  console.log('Opening and closing 20 vocabulary modals...');
  for (let i = 0; i < 20; i++) {
    await page.evaluate((idx) => {
      const cards = document.querySelectorAll('#vGrid .study-card, #vGrid .card');
      if (cards[idx]) {
        const detailBtn = cards[idx].querySelector('[data-action="detail"]') || cards[idx];
        detailBtn.click();
      }
    }, i);
    await page.waitForTimeout(100);

    await page.evaluate(() => {
      const closeBtn = document.querySelector('#closeModal, .close');
      if (closeBtn) closeBtn.click();
      else if (typeof closeModal === 'function') closeModal();
    });
    await page.waitForTimeout(80);

    if (i % 5 === 0) {
      curHeap = (await cdp.send('Runtime.getHeapUsage')).usedSize;
      if (curHeap > peakHeap) peakHeap = curHeap;
    }
  }

  // 5. Quiz
  await page.evaluate(() => { if (typeof showPage === 'function') showPage('quiz', false); else location.hash = '#quiz'; });
  await page.waitForTimeout(1500);

  // 6. Back to Home
  await page.evaluate(() => { if (typeof showPage === 'function') showPage('home', false); else location.hash = '#home'; });
  await page.waitForTimeout(2000);

  const heapAfterSession = (await cdp.send('Runtime.getHeapUsage')).usedSize;
  const domAfterSession = await page.evaluate(() => document.querySelectorAll('*').length);
  const longTasks = await page.evaluate(() => window.__longTasks || []);
  const longTasksCount = longTasks.length;
  const longTasksTotalTime = longTasks.reduce((s, t) => s + t.duration, 0);

  console.log(`[Session Completed] Heap: ${(heapAfterSession / 1048576).toFixed(2)} MB (Peak: ${(peakHeap / 1048576).toFixed(2)} MB), DOM: ${domAfterSession}, Long Tasks: ${longTasksCount} (${longTasksTotalTime.toFixed(0)} ms)`);

  // 7. 5 Repeated open/close cycles for Leak Test
  console.log('\n--- 5 Repeated Open/Close Cycles Leak Test ---');
  const cycleHeaps = [];
  for (let cycle = 1; cycle <= 5; cycle++) {
    // Open Vocab
    await page.evaluate(() => { if (typeof showPage === 'function') showPage('vocab', false); else location.hash = '#vocab'; });
    await page.waitForTimeout(400);

    // Open and close 5 modals
    for (let m = 0; m < 5; m++) {
      await page.evaluate((idx) => {
        const cards = document.querySelectorAll('#vGrid .study-card, #vGrid .card');
        if (cards[idx]) {
          const detailBtn = cards[idx].querySelector('[data-action="detail"]') || cards[idx];
          detailBtn.click();
        }
      }, m);
      await page.waitForTimeout(80);
      await page.evaluate(() => {
        const closeBtn = document.querySelector('#closeModal, .close');
        if (closeBtn) closeBtn.click();
        else if (typeof closeModal === 'function') closeModal();
      });
      await page.waitForTimeout(60);
    }

    // Return to Home
    await page.evaluate(() => { if (typeof showPage === 'function') showPage('home', false); else location.hash = '#home'; });
    await page.waitForTimeout(400);
    
    // Check heap
    const cycleHeap = (await cdp.send('Runtime.getHeapUsage')).usedSize;
    cycleHeaps.push((cycleHeap / 1048576).toFixed(2));
    console.log(`  Cycle ${cycle}: ${(cycleHeap / 1048576).toFixed(2)} MB`);
  }

  await context.close();

  return {
    heapStartMB: (heapStart.usedSize / 1048576).toFixed(2),
    heapPeakMB: (peakHeap / 1048576).toFixed(2),
    heapAfterSessionMB: (heapAfterSession / 1048576).toFixed(2),
    domStart,
    domAfterVocab,
    domAfterSession,
    vocabCardsCount,
    longTasksCount,
    longTasksTotalTime: longTasksTotalTime.toFixed(0),
    cycleHeaps
  };
}

async function runPageAudit(browser, baseUrl, pageDef) {
  console.log(`Auditing page: ${pageDef.name} (${pageDef.hash})...`);
  const { context, page, cdp } = await setupPageWithThrottling(browser, baseUrl);
  const tracker = attachNetworkTracker(page);

  const fullUrl = `${baseUrl.replace(/\/$/, '')}/${pageDef.hash}`;
  await page.goto(fullUrl, { waitUntil: 'load', timeout: 60000 });
  await page.waitForTimeout(3000); // allow async fetches and rendering

  const metrics = await capturePageMetrics(page, cdp);
  
  const webVitals = await page.evaluate(() => {
    let lcp = 0;
    let cls = 0;
    try {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) lcp = lcpEntries[lcpEntries.length - 1].startTime;
    } catch {}

    try {
      const shiftEntries = performance.getEntriesByType('layout-shift');
      for (const entry of shiftEntries) {
        if (!entry.hadRecentInput) cls += entry.value;
      }
    } catch {}

    return { lcp, cls };
  });

  await context.close();

  return {
    name: pageDef.name,
    id: pageDef.id,
    hash: pageDef.hash,
    requestsCount: tracker.requests.length,
    totalTransferredKB: (tracker.totalTransferred / 1024).toFixed(1),
    jsTransferredKB: (tracker.js.transferred / 1024).toFixed(1),
    jsDecodedKB: (tracker.js.decoded / 1024).toFixed(1),
    cssTransferredKB: (tracker.css.transferred / 1024).toFixed(1),
    jsonTransferredKB: (tracker.json.transferred / 1024).toFixed(1),
    fontTransferredKB: (tracker.font.transferred / 1024).toFixed(1),
    fcpMs: metrics.fcp.toFixed(0),
    lcpMs: webVitals.lcp ? webVitals.lcp.toFixed(0) : metrics.fcp.toFixed(0),
    cls: webVitals.cls.toFixed(4),
    domNodes: metrics.domNodes,
    jsHeapUsedMB: metrics.jsHeapUsedMB.toFixed(2),
    requests: tracker.requests
  };
}

async function runLighthouseMedian(url, runs = 3) {
  console.log(`\n--- Running Lighthouse (${runs} runs) on ${url} ---`);
  const results = [];
  for (let i = 1; i <= runs; i++) {
    const outPath = `./scripts/lh-${Date.now()}-${i}.json`;
    console.log(`Lighthouse run ${i}/${runs}...`);
    try {
      execSync(`npx lighthouse ${url} --output=json --output-path=${outPath} --chrome-flags="--headless=new" --only-categories=performance,accessibility --throttling-method=devtools --quiet`, { stdio: 'pipe' });
      const raw = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      fs.unlinkSync(outPath);
      results.push({
        perf: Math.round((raw.categories.performance?.score || 0) * 100),
        a11y: Math.round((raw.categories.accessibility?.score || 0) * 100),
        fcp: (raw.audits['first-contentful-paint']?.numericValue || 0) / 1000,
        lcp: (raw.audits['largest-contentful-paint']?.numericValue || 0) / 1000,
        tbt: Math.round(raw.audits['total-blocking-time']?.numericValue || 0),
        cls: parseFloat((raw.audits['cumulative-layout-shift']?.numericValue || 0).toFixed(4)),
        speedIndex: (raw.audits['speed-index']?.numericValue || 0) / 1000
      });
    } catch (e) {
      console.error(`Lighthouse run ${i} failed:`, e.message);
    }
  }

  if (results.length === 0) return null;
  results.sort((a, b) => a.perf - b.perf);
  const mid = Math.floor(results.length / 2);
  return results[mid];
}

async function main() {
  console.log('====================================================');
  console.log('STEP 0: BASELINE PROFILER (PLAYWRIGHT CDP + LIGHTHOUSE)');
  console.log('====================================================\n');

  const localUrl = 'http://localhost:8000';
  const deployedUrl = 'https://jlpt-n5-and-n4-study.vercel.app';

  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  console.log('>>> Profiling LOCAL Target:', localUrl);
  const localPages = [];
  for (const pageDef of PAGES) {
    const res = await runPageAudit(browser, localUrl, pageDef);
    localPages.push(res);
  }
  const localSession = await runSessionTest(browser, localUrl);

  console.log('\n>>> Profiling DEPLOYED Target:', deployedUrl);
  const deployedPages = [];
  for (const pageDef of PAGES) {
    const res = await runPageAudit(browser, deployedUrl, pageDef);
    deployedPages.push(res);
  }
  const deployedSession = await runSessionTest(browser, deployedUrl);

  await browser.close();

  // Run Lighthouse on both
  const localLh = await runLighthouseMedian(localUrl, 3);
  const deployedLh = await runLighthouseMedian(deployedUrl, 3);

  const baselineReport = {
    timestamp: new Date().toISOString(),
    profile: 'Moto G Power (412x823, DPR 1.75, Slow 4G 500kbps/150ms RTT, 4x CPU throttle)',
    local: {
      pages: localPages,
      session: localSession,
      lighthouse: localLh
    },
    deployed: {
      pages: deployedPages,
      session: deployedSession,
      lighthouse: deployedLh
    }
  };

  fs.writeFileSync('./scripts/baseline-report.json', JSON.stringify(baselineReport, null, 2));
  console.log('\n====================================================');
  console.log('Baseline profiling completed successfully!');
  console.log('Report saved to ./scripts/baseline-report.json');
  console.log('====================================================');
}

main().catch(err => {
  console.error('Baseline profiler fatal error:', err);
  process.exit(1);
});
