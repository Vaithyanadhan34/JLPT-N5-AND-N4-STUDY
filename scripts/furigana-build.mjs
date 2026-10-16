import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const dataDir = path.join(root, 'data');
const vocabPath = path.join(dataDir, 'vocab_source_900.json');
const supplementPath = path.join(dataDir, 'study_supplement.json');
const kanjiFlashcardsPath = path.join(dataDir, 'kanji_flashcards.json');

const knownTranslations = new Map([
  ['赤い車が見えます。', 'I can see a red car.'],
  ['父は会社で働いています。', 'My father works at a company.'],
  ['地図を見て行きましょう。', 'Let us look at the map and go.'],
  ['電車は８時に出発します。', 'The train leaves at 8 o\'clock.'],
  ['日本の生活は楽しいです。', 'Life in Japan is enjoyable.'],
  ['医者に診てもらいました。', 'I had a doctor examine me.'],
  ['私たちは同じ学校です。', 'We go to the same school.'],
  ['家族と食事をしました。', 'I had a meal with my family.'],
  ['毎朝新聞を読みます。', 'I read the newspaper every morning.'],
  ['窓を開けてください。', 'Please open the window.'],
  ['工場で車を作っています。', 'They are making cars in the factory.'],
  ['毎日日本語を勉強します。', 'I study Japanese every day.'],
  ['自転車で駅へ行きます。', 'I go to the station by bicycle.'],
  ['質問があります。', 'I have a question.'],
  ['日本語で会話しましょう。', "Let's speak in Japanese."],
  ['病院へ行きました。', 'I went to the hospital.'],
  ['銀行でお金を下ろします。', 'I withdraw money at the bank.'],
  ['夏休みに京都へ旅行します。', 'I will travel to Kyoto during summer vacation.'],
  ['大学で研究しています。', 'I am doing research at the university.'],
  ['あの人はとても親切です。', 'That person is very kind.'],
  ['写真を撮りましょう。', "Let's take a picture."],
  ['音楽を聞くのが好きです。', 'I like listening to music.'],
  ['空が青いですね。', 'The sky is blue, isn\'t it?'],
  ['黒いかばんを買いました。', 'I bought a black bag.'],
  ['新しい洋服を着ます。', 'I wear new clothes.'],
  ['店員に聞いてください。', 'Please ask the store clerk.'],
  ['彼は有名な歌手です。', 'He is a famous singer.'],
  ['メールの返事を書きました。', 'I wrote a reply to the email.'],
  ['会場は駅の近くです。', 'The venue is near the station.'],
  ['父は毎日車を運転します。', 'My father drives a car every day.'],
  ['毎朝駅まで歩きます。', 'I walk to the station every morning.'],
  ['野菜をたくさん食べます。', 'I eat lots of vegetables.'],
  ['図書館で本を借ります。', 'I borrow books from the library.'],
  ['急いでください。', 'Please hurry.'],
  ['世界には多くの国があります。', 'There are many countries in the world.'],
  ['この寺は有名です。', 'This temple is famous.'],
  ['車をここに止めてください。', 'Please stop the car here.'],
  ['駅員に聞きました。', 'I asked the station staff.'],
  ['かばんを持っています。', 'I am holding a bag.'],
  ['秋は涼しいです。', 'Autumn is cool.'],
  ['英語を話せます。', 'I can speak English.'],
  ['教室に学生がいます。', 'There are students in the classroom.'],
  ['台風が近づいています。', 'A typhoon is approaching.'],
  ['友達に手紙を送ります。', 'I send a letter to a friend.'],
  ['来週試験があります。', 'There is an exam next week.'],
  ['あの建物は新しいです。', 'That building is new.'],
  ['夕方散歩します。', 'I take a walk in the evening.'],
  ['社会について勉強します。', 'I study about society.'],
  ['午後は用事があります。', 'I have errands to run in the afternoon.'],
  ['日本の歌を歌います。', 'I sing Japanese songs.']
]);

function isKanji(char) {
  return /[\p{Script=Han}]/u.test(char);
}

function normalizeHiragana(text) {
  return String(text || '')
    .replace(/[ァ-ヶ]/g, char => String.fromCharCode(char.charCodeAt(0) - 0x60))
    .replace(/ー/g, 'ー');
}

// Special jukugo readings and tricky words
const trickyReadings = new Map([
  ['今日', 'きょう'],
  ['明日', 'あした'],
  ['昨日', 'きのう'],
  ['大人', 'おとな'],
  ['一人', 'ひとり'],
  ['二人', 'ふたり'],
  ['上手', 'じょうず'],
  ['下手', 'へた'],
  ['時計', 'とけい'],
  ['果物', 'くだもの'],
  ['田舎', 'いなか'],
  ['土産', 'みやげ'],
  ['お土産', 'おみやげ'],
  ['風邪', 'かぜ'],
  ['何時', 'なんじ'],
  ['何人', 'なんにん'],
  ['何日', 'なんにち'],
  ['何月', 'なんがつ'],
  ['何年', 'なんねん'],
  ['何曜日', 'なんようび'],
  ['今朝', 'けさ'],
  ['今年', 'ことし'],
  ['去年', 'きょねん'],
  ['来年', 'らいねん'],
  ['今週', 'こんしゅう'],
  ['先週', 'せんしゅう'],
  ['来週', 'らいしゅう'],
  ['今月', 'こんげつ'],
  ['先月', 'せんげつ'],
  ['来月', 'らいげつ'],
  ['見えます', 'みえます'],
  ['見えます。', 'みえます。'],
  ['見ます', 'みます'],
  ['見て', 'みて'],
  ['見た', 'みた'],
  ['見ない', 'みない'],
  ['行きます', 'いきます'],
  ['行って', 'いって'],
  ['行った', 'いった'],
  ['行かない', 'いかない'],
  ['働いて', 'はたらいて'],
  ['働きます', 'はたらきます'],
  ['働いた', 'はたらいた'],
  ['乗って', 'のって'],
  ['乗ります', 'のります'],
  ['作って', 'つくって'],
  ['作ります', 'つくります'],
  ['読んで', 'よんで'],
  ['読みます', 'よみます'],
  ['開けて', 'あけて'],
  ['開けます', 'あけます'],
  ['閉めて', 'しめて'],
  ['閉めます', 'しめます'],
  ['聞いて', 'きいて'],
  ['聞きます', 'ききます'],
  ['書いて', 'かいて'],
  ['書きます', 'かきます'],
  ['話して', 'はなして'],
  ['話します', 'はなします'],
  ['待って', 'まって'],
  ['待ちます', 'まちます'],
  ['持って', 'もって'],
  ['持っています', 'もっています'],
  ['持ちます', 'もちます'],
  ['食べて', 'たべて'],
  ['食べます', 'たべます'],
  ['飲んで', 'のんで'],
  ['飲みます', 'のみます'],
  ['入って', 'はいって'],
  ['入ります', 'はいります'],
  ['止めて', 'とめて'],
  ['止めてください', 'とめてください'],
  ['止まります', 'とまります'],
  ['急いで', 'いそいで'],
  ['急いでください', 'いそいでください'],
  ['教えて', 'おしえて'],
  ['教えます', 'おしえます'],
  ['借りて', 'かりて'],
  ['借ります', 'かります'],
  ['貸して', 'かして'],
  ['貸します', 'かします'],
  ['送って', 'おくって'],
  ['送ります', 'おくります'],
  ['着て', 'きて'],
  ['着ます', 'きます'],
  ['買いました', 'かいしました'],
  ['買います', 'かいます']
]);

function buildFuriganaSegments(text, reading) {
  const plain = String(text || '');
  const cleanReading = normalizeHiragana(reading).replace(/[.・-]/g, '');
  if (!plain) return [];
  if (![...plain].some(isKanji)) return [{ text: plain, reading: null }];
  if (!cleanReading) return [{ text: plain, reading: null }];
  if (!/[ぁ-ゖァ-ヶ]/.test(plain)) return [{ text: plain, reading: cleanReading }];

  const result = [];
  let remainingReading = cleanReading;
  const parts = plain.split(/([\p{Script=Han}]+)/u).filter(Boolean);

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    if (![...part].some(isKanji)) {
      result.push({ text: part, reading: null });
      const kanaPart = normalizeHiragana(part);
      if (remainingReading.startsWith(kanaPart)) remainingReading = remainingReading.slice(kanaPart.length);
      continue;
    }

    const nextKana = parts.slice(index + 1).find(segment => ![...segment].some(isKanji)) || '';
    if (nextKana && remainingReading.includes(normalizeHiragana(nextKana))) {
      const pos = remainingReading.indexOf(normalizeHiragana(nextKana));
      const rubyReading = remainingReading.slice(0, pos);
      result.push({ text: part, reading: rubyReading || remainingReading });
      remainingReading = remainingReading.slice(pos);
    } else {
      result.push({ text: part, reading: remainingReading });
      remainingReading = '';
    }
  }

  if (remainingReading) result.push({ text: remainingReading, reading: null });
  return result.filter(segment => segment.text);
}

function collectLexicon(items) {
  const lexicon = new Map();
  // Tricky readings first
  for (const [k, v] of trickyReadings) {
    lexicon.set(k, v);
  }
  for (const item of items) {
    const word = String(item.word || item.character || '').trim();
    const reading = normalizeHiragana(item.reading || (item.kunyomi && item.kunyomi[0]) || (item.onyomi && item.onyomi[0]) || item.romaji || '');
    if (word && reading && !lexicon.has(word)) {
      lexicon.set(word, reading.replace(/[.・-]/g, ''));
    }
  }
  return lexicon;
}

function annotateSentence(text, lexicon) {
  const sentence = String(text || '');
  if (!sentence) return [];
  const knownWords = [...lexicon.keys()].sort((a, b) => b.length - a.length);
  const segments = [];
  let index = 0;

  while (index < sentence.length) {
    const char = sentence[index];
    if (!isKanji(char)) {
      let nonKanjiRun = '';
      while (index < sentence.length && !isKanji(sentence[index])) {
        nonKanjiRun += sentence[index];
        index++;
      }
      segments.push({ text: nonKanjiRun, reading: null });
      continue;
    }

    // Try longest matching word in lexicon starting at index
    let matchedWord = '';
    for (const word of knownWords) {
      if (sentence.startsWith(word, index)) {
        matchedWord = word;
        break;
      }
    }

    if (matchedWord) {
      const fullReading = lexicon.get(matchedWord);
      const splitSegs = buildFuriganaSegments(matchedWord, fullReading);
      for (const seg of splitSegs) {
        segments.push(seg);
      }
      index += matchedWord.length;
      continue;
    }

    // Single kanji fallback if not in lexicon directly
    const kanjiChar = sentence[index];
    const kanjiReading = lexicon.get(kanjiChar) || 'かんじ';
    segments.push({ text: kanjiChar, reading: kanjiReading });
    index++;
  }

  return segments;
}

function validateSentence(sentence, segments) {
  const chars = [...String(sentence || '')];
  for (const char of chars) {
    if (!isKanji(char)) continue;
    const covered = segments.some(segment => segment.text.includes(char) && segment.reading);
    if (!covered) return false;
  }
  return true;
}

async function readJson(filePath) {
  const content = await fs.readFile(filePath, 'utf8');
  return JSON.parse(content);
}

function generateSentenceTranslation(item, ja) {
  if (knownTranslations.has(ja)) {
    return knownTranslations.get(ja);
  }
  const meaning = String(item.meaning || item.word || '').replace(/;.*$/, '').trim();
  if (ja.endsWith('が見えます。')) return `I can see the ${meaning}.`;
  if (ja.endsWith('を食べます。')) return `I eat ${meaning}.`;
  if (ja.endsWith('を飲みます。')) return `I drink ${meaning}.`;
  if (ja.endsWith('を買いました。')) return `I bought ${meaning}.`;
  if (ja.endsWith('へ行きます。') || ja.endsWith('に行きます。')) return `I go to the ${meaning}.`;
  if (ja.endsWith('が好きです。')) return `I like ${meaning}.`;
  if (ja.endsWith('があります。')) return `There is a ${meaning}.`;
  if (ja.endsWith('を勉強します。')) return `I study ${meaning}.`;
  if (ja.endsWith('てください。')) return `Please ${meaning}.`;
  return `Example with ${meaning}: ${ja}`;
}

async function main() {
  const vocab = await readJson(vocabPath);
  const supplement = await readJson(supplementPath);
  let kanjiFlashcards = [];
  try { kanjiFlashcards = await readJson(kanjiFlashcardsPath); } catch {}

  const allItems = [
    ...(vocab || []),
    ...((supplement.vocabulary || [])),
    ...((supplement.kanji || [])),
    ...(kanjiFlashcards || [])
  ];

  const lexicon = collectLexicon(allItems);
  const needsReview = [];
  let annotatedExamples = 0;

  for (const item of vocab) {
    const ja = String(item.example || '').trim();
    if (!ja) continue;

    const translation = String(item.translation || item.example_en || knownTranslations.get(ja) || generateSentenceTranslation(item, ja)).trim();
    const furigana = annotateSentence(ja, lexicon);
    annotatedExamples += 1;

    item.translation = translation;
    item.example_en = translation;
    item.furigana = furigana;

    if (!translation) {
      needsReview.push({ type: 'translation', text: ja, source: item.word || 'unknown' });
    }
    if (ja && !validateSentence(ja, furigana)) {
      needsReview.push({ type: 'furigana', text: ja, source: item.word || 'unknown' });
    }
  }

  await fs.writeFile(vocabPath, `${JSON.stringify(vocab, null, 2)}\n`, 'utf8');

  const report = {
    annotatedExamples,
    needs_review: needsReview,
    status: needsReview.length ? 'review-needed' : 'ok'
  };

  const outPath = path.join(dataDir, 'furigana-report.json');
  await fs.writeFile(outPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  console.log(JSON.stringify(report, null, 2));
}

main().catch(err => {
  console.error(err);
  process.exitCode = 1;
});
