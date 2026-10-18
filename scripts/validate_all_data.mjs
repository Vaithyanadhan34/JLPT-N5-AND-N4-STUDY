import fs from 'node:fs';

let failed = false;
function assert(condition, message) {
  if (!condition) {
    console.error('❌ VALIDATION FAILED: ' + message);
    failed = true;
  }
}

console.log('=====================================================');
console.log('       DATA INTEGRITY & RUBY SEGMENTS VALIDATOR      ');
console.log('=====================================================');

// 1. Validate grammar.json
console.log('\n[1/4] Validating data/grammar.json...');
const grammar = JSON.parse(fs.readFileSync('data/grammar.json', 'utf8'));
assert(grammar.length > 0, 'Grammar list is empty');

let grammarExCount = 0;
grammar.forEach((item, idx) => {
  assert(!item.formation.includes('語幹'), `Grammar item ${item.id} still contains 語幹 in formation: ${item.formation}`);
  assert(item.summary && item.summary.trim().length > 0, `Grammar item ${item.id} missing summary`);
  
  (item.examples || []).forEach((ex, eIdx) => {
    grammarExCount++;
    assert(ex.ja && !/[<>&]/.test(ex.ja), `Grammar ${item.id}[${eIdx}].ja contains markup/brackets: ${ex.ja}`);
    assert(!ex.ja.includes('　') && !/\s{2,}/.test(ex.ja), `Grammar ${item.id}[${eIdx}].ja contains stray inner spaces: ${ex.ja}`);
    assert(ex.en && ex.en.trim().length > 0, `Grammar ${item.id}[${eIdx}] missing English translation`);
    assert(Array.isArray(ex.segments) && ex.segments.length > 0, `Grammar ${item.id}[${eIdx}] missing segments`);
    
    ex.segments.forEach((seg, sIdx) => {
      assert(!/[<>&]/.test(seg.t), `Grammar ${item.id}[${eIdx}].segments[${sIdx}].t contains markup: ${seg.t}`);
      assert(!/\s/.test(seg.t), `Grammar ${item.id}[${eIdx}].segments[${sIdx}].t contains spaces: ${seg.t}`);
      if (seg.r) {
        assert(!/[<>&]/.test(seg.r), `Grammar ${item.id}[${eIdx}].segments[${sIdx}].r contains markup: ${seg.r}`);
        assert(!/\s/.test(seg.r), `Grammar ${item.id}[${eIdx}].segments[${sIdx}].r contains spaces: ${seg.r}`);
        assert(/^[ぁ-ゖー]+$/.test(seg.r), `Grammar ${item.id}[${eIdx}].segments[${sIdx}].r is not pure hiragana: "${seg.r}" (text: ${seg.t})`);
      }
    });
  });
});
console.log(`  Checked ${grammar.length} grammar patterns and ${grammarExCount} examples: OK`);

// 2. Validate conjunctions.json
console.log('\n[2/4] Validating data/conjunctions.json...');
const conjunctions = JSON.parse(fs.readFileSync('data/conjunctions.json', 'utf8'));
assert(conjunctions.items && conjunctions.items.length === 14, `Expected 14 conjunction items, got ${conjunctions.items?.length}`);

let conjExCount = 0;
conjunctions.items.forEach(item => {
  assert(item.commonMistake && item.commonMistake.length > 0, `Conjunction ${item.id} missing commonMistake`);
  assert(item.nuanceDiff && item.nuanceDiff.length > 0, `Conjunction ${item.id} missing nuanceDiff`);
  assert(item.miniDrill && item.miniDrill.options.length === 4, `Conjunction ${item.id} missing valid miniDrill`);

  const allExamples = [...(item.examples || []), ...(item.extraExamples || [])];
  allExamples.forEach((ex, eIdx) => {
    conjExCount++;
    assert(ex.ja && !/[<>&]/.test(ex.ja), `Conjunction ${item.id}[${eIdx}].ja contains markup: ${ex.ja}`);
    assert(!ex.ja.includes('　') && !/\s{2,}/.test(ex.ja), `Conjunction ${item.id}[${eIdx}].ja contains stray spaces: ${ex.ja}`);
    assert(ex.en && ex.en.trim().length > 0, `Conjunction ${item.id}[${eIdx}] missing English translation`);
    assert(Array.isArray(ex.segments) && ex.segments.length > 0, `Conjunction ${item.id}[${eIdx}] missing segments`);

    ex.segments.forEach((seg, sIdx) => {
      assert(!/[<>&]/.test(seg.t), `Conjunction ${item.id}[${eIdx}].segments[${sIdx}].t contains markup: ${seg.t}`);
      if (seg.r) {
        assert(/^[ぁ-ゖー]+$/.test(seg.r), `Conjunction ${item.id}[${eIdx}].segments[${sIdx}].r is not pure hiragana: "${seg.r}" (text: ${seg.t})`);
      }
    });
  });
});
console.log(`  Checked 14 conjunctions and ${conjExCount} total examples: OK`);

// 3. Validate vocab_source_900.json
console.log('\n[3/4] Validating data/vocab_source_900.json...');
const vocab900 = JSON.parse(fs.readFileSync('data/vocab_source_900.json', 'utf8'));
assert(vocab900.length === 896, `Expected 896 vocab items, got ${vocab900.length}`);

vocab900.forEach((item, idx) => {
  assert(item.word && !/[<>&]/.test(item.word), `Vocab ${item.source_no} word contains markup: ${item.word}`);
  assert(item.reading && /^[ぁ-ゖァ-ヶー]+$/.test(item.reading), `Vocab ${item.source_no} reading is not pure kana: ${item.reading}`);
  assert(item.level === 'N5' || item.level === 'N4', `Vocab ${item.source_no} invalid JLPT level: ${item.level}`);
  assert(Array.isArray(item.pos) && item.pos.length > 0, `Vocab ${item.source_no} missing POS`);
  assert(item.meaning && item.meaning.trim().length > 0, `Vocab ${item.source_no} missing meaning`);
  assert((item.translation || item.example_en) && !item.translation?.includes('Translation not available'), `Vocab ${item.source_no} missing example translation`);
});
console.log(`  Checked ${vocab900.length} vocabulary entries (100% translations, valid POS & level): OK`);

// 4. Validate comparisons.json
console.log('\n[4/4] Validating data/comparisons.json...');
const comparisons = JSON.parse(fs.readFileSync('data/comparisons.json', 'utf8'));
assert(comparisons.length === 12, `Expected 12 contrast groups, got ${comparisons.length}`);

comparisons.forEach(grp => {
  assert(grp.title && grp.title.length > 0, `Group ${grp.id} missing title`);
  assert(grp.keyDifference && grp.keyDifference.length > 0, `Group ${grp.id} missing keyDifference`);
  assert(Array.isArray(grp.rows) && grp.rows.length === 9, `Group ${grp.id} expected 9 rows, got ${grp.rows?.length}`);
  assert(Array.isArray(grp.quizItems) && grp.quizItems.length > 0, `Group ${grp.id} missing quiz items`);
});
console.log(`  Checked ${comparisons.length} comparison groups (all 9 rows and quiz items complete): OK`);

if (failed) {
  console.error('\n❌ DATA VALIDATION FAILED!');
  process.exit(1);
} else {
  console.log('\n=====================================================');
  console.log('✅ ALL DATA INTEGRITY CHECKS PASSED (0 ERRORS)');
  console.log('=====================================================');
}
