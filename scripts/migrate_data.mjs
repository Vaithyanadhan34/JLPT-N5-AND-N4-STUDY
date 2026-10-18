import fs from 'node:fs';
import path from 'node:path';

// 1. Helper to parse <ruby> tags into segments [{t, r}]
function parseRubyString(str) {
  if (!str) return [];
  // Regex to match <ruby>text<rt>reading</rt></ruby> or plain text
  const regex = /<ruby>([^<]+)<rt>([^<]+)<\/rt><\/ruby>|([^<]+)/g;
  const segments = [];
  let m;
  while ((m = regex.exec(str)) !== null) {
    if (m[1] && m[2]) {
      let t = m[1].replace(/\s+/g, '');
      let r = m[2].replace(/\s+/g, '');
      
      // Fix known wrong readings
      if (t === '冬休み' && r === 'なつやすみ') r = 'ふゆやすみ';
      if (r.includes('(する)') || r.includes('（する）')) {
        r = r.replace(/[\(（]する[\)）]/g, '');
      }

      // Okurigana split if text ends in kana and reading ends in the same kana
      let trailingKana = '';
      while (t.length > 1 && r.length > 1) {
        const lastT = t[t.length - 1];
        const lastR = r[r.length - 1];
        if (/[ぁ-ゖァ-ヶ]/.test(lastT) && lastT === lastR) {
          trailingKana = lastT + trailingKana;
          t = t.slice(0, -1);
          r = r.slice(0, -1);
        } else {
          break;
        }
      }

      // Compound splitting for known patterns
      if (t === '夏休' && r === 'なつやす') {
        segments.push({ t: '夏', r: 'なつ' });
        segments.push({ t: '休', r: 'やす' });
      } else if (t === '冬休' && r === 'ふゆやす') {
        segments.push({ t: '冬', r: 'ふゆ' });
        segments.push({ t: '休', r: 'やす' });
      } else if (t === '入学祝' && r === 'にゅうがくいわ') {
        segments.push({ t: '入学', r: 'にゅうがく' });
        segments.push({ t: '祝', r: 'いわ' });
      } else {
        segments.push({ t, r });
      }

      if (trailingKana) {
        segments.push({ t: trailingKana });
      }
    } else if (m[3]) {
      const cleanText = m[3].replace(/[\u200B-\u200D\uFEFF]/g, '');
      if (cleanText) {
        // Merge with previous segment if previous has no reading
        if (segments.length && !segments[segments.length - 1].r) {
          segments[segments.length - 1].t += cleanText;
        } else {
          segments.push({ t: cleanText });
        }
      }
    }
  }
  return segments;
}

// 2. Format replacement table for 語幹
const FORMULA_REPLACEMENTS = [
  ['V(ます形語幹)', 'Vます-stem (ます形 without ます)'],
  ['V(和語ます形語幹)', 'Vます-stem (和語ます形 without ます)'],
  ['V(ます語幹)', 'Vます-stem (ます形 without ます)'],
  ['V(たい語幹)', 'Vたい-stem (たい without い)'],
  ['V(ない形語幹)', 'Vない-stem (ない形 without ない)'],
  ['A(語幹)', 'い-Adj stem (without い) / な-Adj stem (without な)'],
  ['普通形(Na/N語幹)', '普通形 (な-Adj stem without だ / Noun without だ)'],
  ['A: い→がる / Na + がる / V(たい語幹) + たがる', 'い-Adj (drop い) + がる / な-Adj (drop な) + がる / Vたい-stem (たい without い) + たがる'],
  ['A(い抜き)', 'い-Adj stem (without い)'],
  ['Na/N語幹', 'な-Adj stem without だ / Noun without だ']
];

console.log('--- Migrating grammar.json ---');
const grammarPath = 'data/grammar.json';
const grammar = JSON.parse(fs.readFileSync(grammarPath, 'utf8'));

let grammarExamplesMigrated = 0;
let formulasFixed = 0;
const formulaChangelog = [];

grammar.forEach(item => {
  // Fix formation formula wording
  let formation = item.formation || '';
  const origFormation = formation;
  for (const [search, replace] of FORMULA_REPLACEMENTS) {
    if (formation.includes(search)) {
      formation = formation.replaceAll(search, replace);
    }
  }
  if (formation !== origFormation) {
    formulasFixed++;
    formulaChangelog.push({
      id: item.id,
      pattern: item.pattern,
      before: origFormation,
      after: formation
    });
    item.formation = formation;
  }

  // Provide pattern-specific summary if missing or generic
  if (!item.summary) {
    item.summary = `${item.pattern}: ${item.meaning}${item.notes ? ' (' + item.notes.replace(/\.$/, '') + ')' : ''}`;
  }

  // Migrate examples
  if (Array.isArray(item.examples)) {
    item.examples = item.examples.map(ex => {
      grammarExamplesMigrated++;
      let segments = [];
      let cleanJa = ex.ja || '';

      if (ex.furigana && ex.furigana.includes('<ruby')) {
        segments = parseRubyString(ex.furigana);
        cleanJa = segments.map(s => s.t).join('');
      } else if (ex.segments) {
        segments = ex.segments;
      } else {
        segments = [{ t: cleanJa }];
      }

      return {
        ja: cleanJa,
        segments: segments,
        en: ex.en || ex.translation || ''
      };
    });
  }
});

fs.writeFileSync(grammarPath, JSON.stringify(grammar, null, 2));
console.log(`Migrated ${grammarExamplesMigrated} grammar examples and fixed ${formulasFixed} formula wordings.`);

console.log('\n--- Migrating conjunctions.json ---');
const conjPath = 'data/conjunctions.json';
const conjunctions = JSON.parse(fs.readFileSync(conjPath, 'utf8'));

let conjExamplesMigrated = 0;
conjunctions.items.forEach(item => {
  if (Array.isArray(item.examples)) {
    item.examples = item.examples.map(ex => {
      conjExamplesMigrated++;
      let segments = [];
      let cleanJa = ex.ja || '';

      if (ex.furigana && ex.furigana.includes('<ruby')) {
        segments = parseRubyString(ex.furigana);
        cleanJa = segments.map(s => s.t).join('');
      } else if (ex.segments) {
        segments = ex.segments;
      } else {
        segments = [{ t: cleanJa }];
      }

      return {
        ja: cleanJa,
        segments: segments,
        en: ex.en || ex.translation || ''
      };
    });
  }
});

fs.writeFileSync(conjPath, JSON.stringify(conjunctions, null, 2));
console.log(`Migrated ${conjExamplesMigrated} conjunction examples.`);

console.log('\n--- Cleaning study_supplement.json readings ---');
const suppPath = 'data/study_supplement.json';
const supp = JSON.parse(fs.readFileSync(suppPath, 'utf8'));

let readingsCleaned = 0;
(supp.vocabulary || []).forEach(v => {
  if (v.reading) {
    const orig = v.reading;
    let r = v.reading.trim();
    // Remove (する) or （する）
    r = r.replace(/[\(（]する[\)）]/g, '').trim();
    // Remove leading/trailing tildes
    r = r.replace(/^[～~〜]+|[～~〜]+$/g, '').trim();
    // Remove (〜を)
    r = r.replace(/[\(（][～~〜]?を[\)）]/g, '').trim();
    // In multi-readings like 'いい; よい' take first
    if (r.includes(';')) {
      r = r.split(';')[0].trim();
    }
    // Clean spaces
    r = r.replace(/\s+/g, '');
    if (r !== orig) {
      readingsCleaned++;
      v.reading = r;
    }
  }
});

fs.writeFileSync(suppPath, JSON.stringify(supp, null, 2));
console.log(`Cleaned ${readingsCleaned} non-kana readings in study_supplement.json.`);

fs.writeFileSync('scratch/formula_changelog.json', JSON.stringify(formulaChangelog, null, 2));
console.log('Saved formula changelog to scratch/formula_changelog.json.');
