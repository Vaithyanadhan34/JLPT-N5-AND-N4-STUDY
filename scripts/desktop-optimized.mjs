import fs from 'node:fs';
import { chromium } from 'playwright-core';
import { execSync } from 'node:child_process';

const DESKTOP_VIEWPORT = {
  viewport: { width: 1440, height: 900 },
  deviceScaleFactor: 1,
  isMobile: false,
  hasTouch: false
};

const PAGES = [
  { name: 'Home', hash: '#home' },
  { name: 'Vocabulary', hash: '#vocab' },
  { name: 'Kanji', hash: '#kanji' },
  { name: 'Grammar', hash: '#grammar' }
];

async function measurePageDesktop(browser, baseUrl, pageDef) {
  const context = await browser.newContext(DESKTOP_VIEWPORT);
  const page = await context.newPage();
  await page.addInitScript(() => {
    localStorage.setItem('jlpt-v7-onboarding-dismissed', '1');
  });
  const cdp = await page.context().newCDPSession(page);

  await cdp.send('Performance.enable');

  const fullUrl = `${baseUrl.replace(/\/$/, '')}/${pageDef.hash}`;
  await page.goto(fullUrl, { waitUntil: 'load', timeout: 30000 });
  await page.waitForTimeout(2000);

  const evalMetrics = await page.evaluate(() => {
    const domNodes = document.querySelectorAll('*').length;
    const paintEntries = performance.getEntriesByType('paint');
    const fcpEntry = paintEntries.find(p => p.name === 'first-contentful-paint');
    const fcp = fcpEntry ? fcpEntry.startTime : 0;

    let lcp = 0;
    try {
      const lcpEntries = performance.getEntriesByType('largest-contentful-paint');
      if (lcpEntries.length > 0) lcp = lcpEntries[lcpEntries.length - 1].startTime;
    } catch {}

    const mem = window.performance && window.performance.memory ? {
      usedJSHeap: window.performance.memory.usedJSHeapSize,
      totalJSHeap: window.performance.memory.totalJSHeapSize
    } : null;

    return { domNodes, fcp, lcp, mem };
  });

  const cdpMetricsRes = await cdp.send('Performance.getMetrics');
  const cdpMetrics = {};
  for (const m of cdpMetricsRes.metrics) {
    cdpMetrics[m.name] = m.value;
  }

  await context.close();

  return {
    name: pageDef.name,
    domNodes: evalMetrics.domNodes,
    fcpMs: evalMetrics.fcp.toFixed(0),
    lcpMs: evalMetrics.lcp ? evalMetrics.lcp.toFixed(0) : evalMetrics.fcp.toFixed(0),
    jsHeapUsedMB: ((cdpMetrics['JSHeapUsedSize'] || 0) / (1024 * 1024)).toFixed(2),
    scriptDurationMs: ((cdpMetrics['ScriptDuration'] || 0) * 1000).toFixed(0),
    layoutDurationMs: ((cdpMetrics['LayoutDuration'] || 0) * 1000).toFixed(0),
    recalcStyleDurationMs: ((cdpMetrics['RecalcStyleDuration'] || 0) * 1000).toFixed(0),
    taskDurationMs: ((cdpMetrics['TaskDuration'] || 0) * 1000).toFixed(0)
  };
}

async function runLighthouseDesktop(url, runs = 2) {
  console.log(`\n--- Running Desktop Lighthouse (${runs} runs) on ${url} ---`);
  const results = [];
  for (let i = 1; i <= runs; i++) {
    const outPath = `./scripts/lh-desk-opt-${Date.now()}-${i}.json`;
    console.log(`Desktop Lighthouse run ${i}/${runs}...`);
    try {
      execSync(`npx lighthouse ${url} --preset=desktop --output=json --output-path=${outPath} --chrome-flags="--headless=new" --only-categories=performance,accessibility --throttling-method=devtools --quiet`, { stdio: 'pipe' });
      const raw = JSON.parse(fs.readFileSync(outPath, 'utf8'));
      fs.unlinkSync(outPath);
      results.push({
        perf: Math.round((raw.categories.performance?.score || 0) * 100),
        a11y: Math.round((raw.categories.accessibility?.score || 0) * 100),
        fcp: Math.round(raw.audits['first-contentful-paint']?.numericValue || 0),
        lcp: Math.round(raw.audits['largest-contentful-paint']?.numericValue || 0),
        tbt: Math.round(raw.audits['total-blocking-time']?.numericValue || 0),
        cls: parseFloat((raw.audits['cumulative-layout-shift']?.numericValue || 0).toFixed(4)),
        speedIndex: Math.round(raw.audits['speed-index']?.numericValue || 0)
      });
    } catch (e) {
      console.error(`Desktop Lighthouse run ${i} failed:`, e.message);
    }
  }

  if (results.length === 0) return null;
  results.sort((a, b) => a.perf - b.perf);
  return results[Math.floor(results.length / 2)];
}

async function main() {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const localUrl = 'http://localhost:8000';

  console.log('Measuring desktop CDP post-optimization on Home, Vocabulary, Kanji, Grammar...');
  const pageMetrics = [];
  for (const p of PAGES) {
    const res = await measurePageDesktop(browser, localUrl, p);
    pageMetrics.push(res);
  }
  await browser.close();

  const lhHome = await runLighthouseDesktop(localUrl, 2);

  const report = {
    pages: pageMetrics,
    lighthouseHome: lhHome
  };

  fs.writeFileSync('./scripts/desktop-optimized-report.json', JSON.stringify(report, null, 2));
  console.log('\nDesktop Optimized Report:', JSON.stringify(report, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
