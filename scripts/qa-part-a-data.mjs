import fs from 'node:fs';
import crypto from 'node:crypto';
import { chromium } from 'playwright-core';

function hashBuffer(buf) {
  return crypto.createHash('sha256').update(buf).digest('hex').slice(0, 16);
}

async function runDataAudit() {
  console.log('====================================================');
  console.log('PART A: AUTOMATED DATA AUDIT');
  console.log('====================================================\n');

  // Step A0: Local file inspection
  const localFiles = [
    'data/vocab_source_900.json',
    'data/kanji_flashcards.json',
    'data/study_supplement.json',
    'data/kana.json',
    'js/app.js',
    'js/kana-data.js',
    'css/style.css',
    'index.html'
  ];

  console.log('--- Step A0: Local File Hashes & Sizes ---');
  const fileHashes = {};
  for (const f of localFiles) {
    if (fs.existsSync(f)) {
      const buf = fs.readFileSync(f);
      const h = hashBuffer(buf);
      fileHashes[f] = { size: buf.length, hash: h };
      console.log(`[FILE] ${f}: ${buf.length} bytes, sha256:${h}`);
    } else {
      console.log(`[FILE] ${f}: NOT FOUND`);
    }
  }

  // Launch headless browser to audit both targets
  const browser = await chromium.launch({ channel: 'msedge', headless: true });

  const targets = [
    { name: 'LOCAL', url: 'http://localhost:8000/' },
    { name: 'DEPLOYED', url: 'https://jlpt-n5-and-n4-study.vercel.app/' }
  ];

  const results = {};

  for (const target of targets) {
    console.log(`\n====================================================`);
    console.log(`AUDITING TARGET: ${target.name} (${target.url})`);
    console.log(`====================================================`);
    const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
    const consoleLogs = [];
    page.on('console', msg => consoleLogs.push({ type: msg.type(), text: msg.text() }));

    const networkResponses = [];
    page.on('response', res => {
      networkResponses.push({ url: res.url(), status: res.status() });
    });

    try {
      await page.goto(target.url, { waitUntil: 'networkidle', timeout: 35000 });
      await page.waitForTimeout(4000);

      const targetData = await page.evaluate(async () => {
        // Collect global data from the page scope
        const vocabData = typeof vocab !== 'undefined' ? vocab : (window.vocab || []);
        const kanjiData = typeof kanji !== 'undefined' ? kanji : (window.kanji || []);
        const grammarData = typeof grammar !== 'undefined' ? grammar : (window.grammar || []);
        const kanaData = typeof KANA_DATA !== 'undefined' ? KANA_DATA : (window.KANA_DATA || window.kanaSource || []);

        // Check A0 UI counts
        const uiCounts = {
          words: document.getElementById('homeVocab')?.textContent?.trim() || '',
          kanji: document.getElementById('homeKanji')?.textContent?.trim() || '',
          grammar: document.getElementById('homeGrammar')?.textContent?.trim() || '',
          sentences: document.getElementById('homeExamples')?.textContent?.trim() || ''
        };

        // Check A1: Vocabulary checks
        let emptyFields = 0;
        let readingNonKana = [];
        let meaningWithJp = [];
        let exWithWhitespace = [];
        const pairMap = new Map();
        const duplicates = [];

        // Specific test words
        const specificWords = [
          '駐車場', '工場長', '練習場', '練習問題', '写真撮影',
          '航空会社', '旅行会社', '洗面所', '国語', '何度', '教わる',
          '学生', '切符売り場', '必要になる', '取る', '低い'
        ];
        const specificFound = {};

        for (const item of vocabData) {
          const w = item.word || '';
          const r = item.reading || '';
          if (!w || !r) emptyFields++;
          
          // non-kana in reading (allow punctuation/middle dot optionally, but check for latin/kanji)
          if (/[^\u3040-\u309F\u30A0-\u30FF\u30FC\s・.・-]/.test(r)) {
            readingNonKana.push({ word: w, reading: r });
          }

          // meaning containing Japanese kanji or kana
          const meaningStr = (item.meanings || [item.meaning || '']).join(' ');
          if (/[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]/.test(meaningStr)) {
            meaningWithJp.push({ word: w, meaning: meaningStr });
          }

          // duplicates
          const key = `${w}|${r}`;
          if (pairMap.has(key)) {
            duplicates.push({ word: w, reading: r });
          } else {
            pairMap.set(key, true);
          }

          // specific words
          if (specificWords.includes(w)) {
            specificFound[w] = {
              word: w,
              reading: r,
              meanings: item.meanings || [item.meaning],
              examples: item.examples
            };
          }
        }

        // Check A2: Kanji checks
        const targetKanji = ['草', '部', '教', '授', '口', '一', '二', '三'];
        const targetKanjiData = {};
        for (const k of kanjiData) {
          if (targetKanji.includes(k.character)) {
            targetKanjiData[k.character] = {
              character: k.character,
              strokes: k.strokes,
              onyomi: k.onyomi,
              kunyomi: k.kunyomi,
              meanings: k.meanings,
              flash: k.flash
            };
          }
        }

        // Check 七, 大, 下, 分, 生, 早, 洋, 合, 着, 付, 親, 地, 通, 向, 然, 歳
        const readingsRequired = ['七', '大', '下', '分', '生', '早', '洋', '合', '着', '付', '親', '地', '通', '向', '然', '歳'];
        const missingReadings = [];
        for (const ch of readingsRequired) {
          const found = kanjiData.find(k => k.character === ch);
          if (!found || ((!found.onyomi || !found.onyomi.length) && (!found.kunyomi || !found.kunyomi.length) && !found.reading)) {
            missingReadings.push(ch);
          }
        }

        // Check ligatures
        const rawJson = JSON.stringify(kanjiData);
        const ligatureMatches = rawJson.match(/(\uFB01|\uFB02|ﬁ|ﬂ|ﬁ\s*ve|sufﬁ\s*x)/g) || [];

        // Check N3+ filter counts
        const n5Count = kanjiData.filter(k => k.level === 'N5').length;
        const n4Count = kanjiData.filter(k => k.level === 'N4').length;
        const n3Plus = kanjiData.filter(k => k.level && !['N5', 'N4'].includes(k.level)).length;

        // Check A3: Kana checks
        let kataInvalid = 0;
        let hiraInvalid = 0;
        const kataGrid = document.querySelector('#kanaGrid .kana-board:nth-child(2)') || document.querySelector('#kanaGrid');
        // Check data source directly
        for (const cell of kanaData) {
          if (cell.katakana && !/^[\u30A0-\u30FFー]+$/.test(cell.katakana)) kataInvalid++;
          if (cell.hiragana && !/^[\u3040-\u309Fー]+$/.test(cell.hiragana)) hiraInvalid++;
        }

        // Check A5: Translations check
        let translatingPlaceholders = 0;
        let missingTranslations = 0;
        for (const item of vocabData) {
          for (const ex of item.examples || []) {
            const en = String(ex.en || ex.translation || '');
            if (en.includes('Translating sentence')) translatingPlaceholders++;
            if (!en) missingTranslations++;
          }
        }

        return {
          uiCounts,
          vocabTotal: vocabData.length,
          kanjiTotal: kanjiData.length,
          grammarTotal: grammarData.length,
          kanaTotal: kanaData.length,
          emptyFields,
          readingNonKana: readingNonKana.slice(0, 10),
          meaningWithJp: meaningWithJp.slice(0, 10),
          duplicatesCount: duplicates.length,
          duplicateSamples: duplicates.slice(0, 10),
          specificFound,
          targetKanjiData,
          missingReadings,
          ligatureMatches,
          kanjiFilterCounts: { n5: n5Count, n4: n4Count, n3Plus },
          kanaValidation: { kataInvalid, hiraInvalid },
          translationValidation: { translatingPlaceholders, missingTranslations }
        };
      });

      results[target.name] = { success: true, data: targetData, networkResponses, consoleLogs };
      console.log(`[PASS] Evaluated ${target.name} successfully.`);
    } catch (e) {
      results[target.name] = { success: false, error: e.message, consoleLogs };
      console.log(`[FAIL] Evaluated ${target.name} failed: ${e.message}`);
    } finally {
      await page.close();
    }
  }

  await browser.close();

  fs.writeFileSync('scripts/part-a-audit-results.json', JSON.stringify(results, null, 2));
  console.log('\nAudit completed. Saved detailed log to scripts/part-a-audit-results.json');
}

runDataAudit().catch(console.error);
