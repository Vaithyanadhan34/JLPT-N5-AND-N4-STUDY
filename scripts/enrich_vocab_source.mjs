import fs from 'node:fs';

const v900 = JSON.parse(fs.readFileSync('data/vocab_source_900.json', 'utf8'));
const n5 = JSON.parse(fs.readFileSync('data/openjlpt_n5.json', 'utf8'));
const n4 = JSON.parse(fs.readFileSync('data/openjlpt_n4.json', 'utf8'));

// Map JMdict tag to clean English name
function mapJmdictPos(tags) {
  if (!Array.isArray(tags) || !tags.length) return ['Noun'];
  const res = [];
  tags.forEach(t => {
    if (t === 'n') res.push('Noun');
    else if (t === 'adj-i') res.push('い-Adjective');
    else if (t === 'adj-na') res.push('な-Adjective');
    else if (t === 'adj-no') res.push('Noun (no-adj)');
    else if (t === 'v1') res.push('Verb (Ichidan)');
    else if (t.startsWith('v5')) res.push('Verb (Godan)');
    else if (t === 'vs' || t === 'vs-i') res.push('Suru Verb');
    else if (t === 'adv' || t === 'adv-to') res.push('Adverb');
    else if (t === 'prt') res.push('Particle');
    else if (t === 'conj') res.push('Conjunction');
    else if (t === 'pn') res.push('Pronoun');
    else if (t === 'num') res.push('Number');
    else if (t === 'ctr') res.push('Counter');
    else if (t === 'exp') res.push('Expression');
  });
  return res.length ? [...new Set(res)] : ['Noun'];
}

// Build JMdict map
const jmdictMap = new Map();
n5.forEach(x => {
  jmdictMap.set(x.word + '|' + x.reading, { ...x, level: 'N5' });
  if (!jmdictMap.has(x.word)) jmdictMap.set(x.word, { ...x, level: 'N5' });
});
n4.forEach(x => {
  if (!jmdictMap.has(x.word + '|' + x.reading)) jmdictMap.set(x.word + '|' + x.reading, { ...x, level: 'N4' });
  if (!jmdictMap.has(x.word)) jmdictMap.set(x.word, { ...x, level: 'N4' });
});

// Infer POS for words not in OpenJLPT
function inferPosAndLevel(item) {
  const m = (item.meaning || '').toLowerCase();
  const w = item.word || '';
  const r = item.reading || '';

  let pos = ['Noun'];
  let level = 'N4'; // default for unlisted extended vocabulary

  if (m.startsWith('to ')) {
    if (w.endsWith('る') && (r.endsWith('いる') || r.endsWith('える') || r.endsWith('きめる') || r.endsWith('しめる') || r.endsWith('でる') || r.endsWith('れる') || r.endsWith('める'))) {
      pos = ['Verb (Ichidan)'];
    } else if (w.endsWith('する') || r.endsWith('する')) {
      pos = ['Suru Verb'];
    } else {
      pos = ['Verb (Godan)'];
    }
  } else if (w.endsWith('い') && (m.includes('adjective') || /^(hot|cold|warm|cool|new|old|big|small|good|bad|sweet|bitter|sour|spicy|red|blue|white|black|yellow|heavy|light|fast|slow|busy|early|late|near|far|wide|narrow|bright|dark|tall|short|expensive|cheap|high|low|deep|shallow|thick|thin|painful|happy|sad|lonely|fun|interesting|difficult|easy|dangerous|correct|wrong|strong|weak|young|soft|hard|dirty|clean|gentle|kind|quiet|busy)/i.test(m))) {
    pos = ['い-Adjective'];
  } else if (w.endsWith('な') || m.includes('(na-adj)') || /^(convenient|inconvenient|famous|quiet|lively|healthy|safe|important|necessary|free|serious|strange|polite|rude|various|simple|special|wonderful)/i.test(m)) {
    pos = ['な-Adjective'];
  } else if (m.includes('adverb') || /^(very|quite|always|often|sometimes|never|already|yet|soon|gradually|clearly|together|slowly|well|much|little|first|finally)/i.test(m)) {
    pos = ['Adverb'];
  }

  // Common N5 words
  if (/^(日本語|朝食|新年|黒板|駅員|歌手)$/.test(w)) level = 'N5';

  return { pos, level };
}

let posFixedCount = 0;
let formExtractedCount = 0;

v900.forEach(item => {
  const match = jmdictMap.get(item.word + '|' + item.reading) || jmdictMap.get(item.word);
  if (match) {
    item.level = match.level;
    item.pos = mapJmdictPos(match.pos);
  } else {
    const inferred = inferPosAndLevel(item);
    item.level = inferred.level;
    item.pos = inferred.pos;
  }
  posFixedCount++;

  // Detect conjugated form in example
  const ex = item.example || '';
  const w = item.word || '';
  const forms = [w];
  if (ex && !ex.includes(w)) {
    // Try to extract verb/adj stem and match in example
    let stem = w.slice(0, -1);
    if (stem.length >= 1) {
      const regex = new RegExp(stem + '[ぁ-ゖ]{1,5}', 'g');
      const found = ex.match(regex);
      if (found && found.length) {
        forms.push(found[0]);
        formExtractedCount++;
      }
    }
  }
  item.forms = forms;

  // Ensure clean examples structure
  if (!item.examples || !item.examples.length) {
    item.examples = [{
      ja: item.example,
      en: item.translation || item.example_en || '',
      segments: (item.furigana || []).map(f => ({
        t: f.text || '',
        r: f.reading || undefined
      })).filter(s => s.t)
    }];
  }
});

fs.writeFileSync('data/vocab_source_900.json', JSON.stringify(v900, null, 2));
console.log(`Enriched ${v900.length} vocabulary entries in data/vocab_source_900.json`);
console.log(`Assigned POS & level to ${posFixedCount} entries; detected ${formExtractedCount} inflected forms.`);
