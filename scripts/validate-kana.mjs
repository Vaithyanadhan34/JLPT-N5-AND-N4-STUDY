import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { KANA_DATA } = require('../js/kana-data.js');

function isHiragana(str) {
  return /^[\u3041-\u3096]+$/.test(str);
}

function isKatakana(str) {
  return /^[\u30A1-\u30FA\u30FC]+$/.test(str);
}

assert.ok(Array.isArray(KANA_DATA), 'KANA_DATA must be an array');
assert.equal(KANA_DATA.length, 104, 'KANA_DATA must contain exactly 104 kana items');

const seenIds = new Set();
for (const cell of KANA_DATA) {
  assert.equal(typeof cell.romaji, 'string', 'kana cell requires romaji');
  assert.equal(typeof cell.hiragana, 'string', `kana cell ${cell.romaji} requires hiragana`);
  assert.equal(typeof cell.katakana, 'string', `kana cell ${cell.romaji} requires katakana`);
  assert.ok(cell.row, `kana cell ${cell.romaji} requires row`);
  assert.ok(cell.col, `kana cell ${cell.romaji} requires col`);
  assert.ok(cell.group, `kana cell ${cell.romaji} requires group`);
  assert.ok(isHiragana(cell.hiragana), `hiragana must stay in U+3041-U+3096 for ${cell.romaji} (got: ${cell.hiragana})`);
  assert.ok(isKatakana(cell.katakana), `katakana must stay in U+30A1-U+30FA or long mark for ${cell.romaji} (got: ${cell.katakana})`);
  assert.notStrictEqual(cell.hiragana, cell.katakana, `hiragana and katakana must differ for ${cell.romaji}`);

  const id = cell.id || cell.romaji;
  assert.ok(!seenIds.has(id), `Duplicate kana id: ${id}`);
  seenIds.add(id);
}

// Verify grid rendering text outputs differ
const hiraganaRendered = KANA_DATA.map(c => c.hiragana).join('');
const katakanaRendered = KANA_DATA.map(c => c.katakana).join('');
assert.notEqual(hiraganaRendered, katakanaRendered, 'Hiragana and Katakana grids must never render identical text');

console.log(JSON.stringify({ cells: KANA_DATA.length, status: 'ok' }, null, 2));
