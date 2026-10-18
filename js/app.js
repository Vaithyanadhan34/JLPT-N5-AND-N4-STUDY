const SOURCES={
  v5:['https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n5.json','https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n5.json'],
  v4:['https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n4.json','https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n4.json'],
  k5:['https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n5.json','https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/kanji/n5.json'],
  k4:['https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n4.json','https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/kanji/n4.json'],
  g5:['https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n5.json','https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/grammar/n5.json'],
  g4:['https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n4.json','https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/grammar/n4.json']
};
const JLPTSTUDY={n5:'https://www.jlptstudy.net/N5/',n4:'https://www.jlptstudy.net/N4/'};
let vocab=[],grammar=[],kanji=[],sourceVocab=[],flashChars=[];
let lastPage='home', modalReturnFocus=null, quizState=null, compareIds=['',''];
let quizHideFurigana=false, quizPeek=false;
let kanaView='hira', kanaSet='basic', kanaPracticeMode='flash', kanaSelectedId='', searchResults=[];
const readKey='jlpt-v7-read',knownKey='jlpt-v7-known',progressKey='jlpt-v7-progress';
const readSet=new Set(JSON.parse(localStorage.getItem(readKey)||'[]'));
const knownSet=new Set(JSON.parse(localStorage.getItem(knownKey)||'[]'));
const progress=JSON.parse(localStorage.getItem(progressKey)||'{}');
const DAILY_GOAL=10;
window.DAILY_GOAL=DAILY_GOAL;

const themeKey='jlpt-theme';
let isThemeTransitioning=false;

function migrateStorage(){
  try{
    const oldSettingsRaw=localStorage.getItem('jlpt-v7-settings');
    if(oldSettingsRaw){
      try{
        const parsed=JSON.parse(oldSettingsRaw);
        if(parsed&&parsed.theme&&!localStorage.getItem(themeKey)){
          localStorage.setItem(themeKey,parsed.theme==='dark'?'dark':parsed.theme==='light'?'light':'system');
        }
      }catch(e){}
      localStorage.removeItem('jlpt-v7-settings');
    }
    const obsoleteKeys=['settings','fontSize','furigana','romaji','dailyGoal','sound','furiganaSize','soundOn','themeMode'];
    obsoleteKeys.forEach(k=>{
      try{localStorage.removeItem(k);}catch(e){}
    });
  }catch(e){}
}
migrateStorage();

function preferredTheme(){
  let saved='system';
  try{saved=localStorage.getItem(themeKey)||'system';}catch(e){}
  if(saved==='system')return window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches?'dark':'light';
  return saved==='dark'?'dark':'light';
}

function applyTheme(theme){
  const safeTheme=theme==='dark'?'dark':'light';
  document.documentElement.dataset.theme=safeTheme;
  document.documentElement.style.colorScheme=safeTheme;
  document.body.dataset.theme=safeTheme;
  const meta=document.querySelector('meta[name="theme-color"]');
  if(meta)meta.content=safeTheme==='dark'?'#0F1115':'#F7F3EC';
  const metaScheme=document.querySelector('meta[name="color-scheme"]');
  if(metaScheme)metaScheme.content=safeTheme==='dark'?'dark':'light';
  syncThemeControls();
}

function setThemeInstant(theme){
  const safeTheme=theme==='dark'?'dark':'light';
  try{localStorage.setItem(themeKey,safeTheme);}catch(e){}
  applyTheme(safeTheme);
}

async function toggleThemeWithCircularReveal(event,forcedTheme){
  if(isThemeTransitioning)return;
  const cur=(document.documentElement.dataset.theme||document.body.dataset.theme||'light')==='dark'?'dark':'light';
  const next=forcedTheme||(cur==='dark'?'light':'dark');
  if(next===cur)return;

  const btn=document.getElementById('themeToggle');
  const b=btn?btn.getBoundingClientRect():{left:window.innerWidth-60,top:20,width:40,height:40};
  const x=b.left+b.width/2;
  const y=b.top+b.height/2;

  const r=Math.hypot(Math.max(x,window.innerWidth-x),Math.max(y,window.innerHeight-y));

  const apply=()=>{
    try{localStorage.setItem(themeKey,next);}catch(e){}
    applyTheme(next);
  };

  const reduce=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Instant switch ONLY if user explicitly enabled prefers-reduced-motion in OS
  if(reduce){
    apply();
    return;
  }

  // Fallback for browsers without View Transitions (e.g. Firefox)
  if(typeof document.startViewTransition!=='function'){
    const overlay=document.createElement('div');
    overlay.className='theme-transition-overlay';
    overlay.style.cssText=`position:fixed;inset:0;width:100vw;height:100vh;background:${next==='dark'?'#0F1115':'#F7F3EC'};z-index:2147483646;pointer-events:none;clip-path:circle(0px at ${x}px ${y}px);`;
    document.body.appendChild(overlay);

    isThemeTransitioning=true;
    document.documentElement.classList.add('theme-switching');
    try{
      const anim=overlay.animate(
        [
          {clipPath:`circle(0px at ${x}px ${y}px)`},
          {clipPath:`circle(${r}px at ${x}px ${y}px)`}
        ],
        {duration:700,easing:'cubic-bezier(0.4, 0, 0.2, 1)',fill:'forwards'}
      );
      await anim.finished;
      apply();
    }catch(e){
      apply();
    }finally{
      document.documentElement.classList.remove('theme-switching');
      if(overlay.parentNode)overlay.parentNode.removeChild(overlay);
      isThemeTransitioning=false;
    }
    return;
  }

  // Native View Transitions API
  isThemeTransitioning=true;
  document.documentElement.classList.add('theme-switching');
  try{
    const transition=document.startViewTransition(()=>{
      apply();
    });
    await transition.ready;
    const anim=document.documentElement.animate(
      {
        clipPath:[
          `circle(0px at ${x}px ${y}px)`,
          `circle(${r}px at ${x}px ${y}px)`
        ]
      },
      {
        duration:700,
        easing:'cubic-bezier(0.4, 0, 0.2, 1)',
        pseudoElement:'::view-transition-new(root)'
      }
    );
    await anim.finished;
  }catch(err){
    apply();
  }finally{
    document.documentElement.classList.remove('theme-switching');
    isThemeTransitioning=false;
  }
}

function setThemeWithTransition(theme){
  return toggleThemeWithCircularReveal(null,theme);
}
window.toggleTheme = toggleThemeWithCircularReveal;
window.toggleThemeWithCircularReveal = toggleThemeWithCircularReveal;

const kanaSource=Array.isArray(window.KANA_DATA)?window.KANA_DATA:[];
const kanaCells=new Map(kanaSource.map(cell=>[cell.romaji,cell]));
const kanaRows=[
  {id:'vowel',label:'–',items:['a','i','u','e','o']},
  {id:'k',label:'k',items:['ka','ki','ku','ke','ko']},
  {id:'s',label:'s',items:['sa','shi','su','se','so']},
  {id:'t',label:'t',items:['ta','chi','tsu','te','to']},
  {id:'n',label:'n',items:['na','ni','nu','ne','no']},
  {id:'h',label:'h',items:['ha','hi','fu','he','ho']},
  {id:'m',label:'m',items:['ma','mi','mu','me','mo']},
  {id:'y',label:'y',items:['ya','yu','yo']},
  {id:'r',label:'r',items:['ra','ri','ru','re','ro']},
  {id:'w',label:'w',items:['wa','wo']},
  {id:'n-only',label:'n',items:['n']}
];
const kanaDakutenRows=[
  {label:'g',items:['ga','gi','gu','ge','go']},
  {label:'z',items:['za','ji','zu','ze','zo']},
  {label:'d',items:['da','ji','zu','de','do']},
  {label:'b',items:['ba','bi','bu','be','bo']},
  {label:'p',items:['pa','pi','pu','pe','po']}
];
const kanaComboRows=['kya','kyu','kyo','sha','shu','sho','cha','chu','cho','nya','nyu','nyo','hya','hyu','hyo','mya','myu','myo','rya','ryu','ryo','gya','gyu','gyo','ja','ju','jo','bya','byu','byo','pya','pyu','pyo'];
const kanaBasicColumns=['a','i','u','e','o'];
const kanaBasicLabels={vowel:'–',k:'k',s:'s',t:'t',n:'n',h:'h',m:'m',y:'y',r:'r',w:'w',"n-only":'n'};
let kanaState=JSON.parse(localStorage.getItem('jlpt-v7-kana-state')||'{}');
if(!kanaState.view)kanaState.view='both';
if(!kanaState.set)kanaState.set='basic';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const markKey=(type,id)=>type+':'+id;
const hasKanji=text=>/[\p{Script=Han}]/u.test(String(text||''));
const normalizeHiragana=text=>String(text||'').replace(/[ァ-ヶ]/g,ch=>String.fromCharCode(ch.charCodeAt(0)-0x60)).replace(/ー/g,'ー');
const globalLexicon=new Map([
  ['今日','きょう'],['明日','あした'],['昨日','きのう'],['大人','おとな'],['一人','ひとり'],['二人','ふたり'],
  ['上手','じょうず'],['下手','へた'],['時計','とけい'],['果物','くだもの'],['田舎','いなか'],['土産','おみやげ'],
  ['お土産','おみやげ'],['風邪','かぜ'],['何時','なんじ'],['何人','なんにん'],['何日','なんにち'],['何月','なんがつ'],
  ['何年','なんねん'],['何曜日','なんようび'],['今朝','けさ'],['今年','ことし'],['去年','きょねん'],['来年','らいねん'],
  ['今週','こんしゅう'],['先週','せんしゅう'],['来週','らいしゅう'],['今月','こんげつ'],['先月','せんげつ'],['来月','らいげつ'],
  ['見えます','みえます'],['見ます','みます'],['見て','みて'],['見た','みた'],['見ない','みない'],
  ['行きます','いきます'],['行って','いって'],['行った','いった'],['行かない','いかない'],
  ['働いて','はたらいて'],['働きます','はたらきます'],['働いた','はたらいた'],
  ['乗って','のって'],['乗ります','のります'],['作って','つくって'],['作ります','つくります'],
  ['読んで','よんで'],['読みます','よみます'],['読んだ','よんだ'],
  ['開けて','あけて'],['開けます','あけます'],['閉めて','しめて'],['閉めます','しめます'],
  ['聞いて','きいて'],['聞きます','ききます'],['書いて','かいて'],['書きます','かきます'],
  ['話して','はなして'],['話します','はなします'],['待って','まって'],['待ちます','まちます'],
  ['持って','もって'],['持っています','もっています'],['持ちます','もちます'],
  ['食べて','たべて'],['食べます','たべます'],['飲んで','のんで'],['飲みます','のみます'],
  ['入って','はいって'],['入ります','はいります'],['止めて','とめて'],['止めてください','とめてください'],
  ['急いで','いそいで'],['急いでください','いそいでください'],['教えて','おしえて'],['教えます','おしえます'],
  ['借りて','かりて'],['借ります','かります'],['貸して','かして'],['貸します','かします'],
  ['送って','おくって'],['送ります','おくります'],['着て','きて'],['着ます','きます'],
  ['買いました','かいしました'],['買います','かいます'],['図書館','としょかん'],['車','くるま'],['赤い','あかい']
]);

function renderRubyWord(word, reading) {
  const plain = String(word || '');
  const clean = normalizeHiragana(reading).replace(/[.・-]/g, '');
  if (!plain || !hasKanji(plain)) return esc(plain);
  if (!clean) return esc(plain);
  if (!/[ぁ-ゖァ-ヶ]/.test(plain)) {
    return `<ruby class="ruby-text"><rb>${esc(plain)}</rb><rp>(</rp><rt>${esc(clean)}</rt><rp>)</rp></ruby>`;
  }
  const parts = plain.split(/([\p{Script=Han}]+)/u).filter(Boolean);
  let remaining = clean;
  let out = '';
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (!hasKanji(part)) {
      out += esc(part);
      const kanaPart = normalizeHiragana(part);
      if (remaining.startsWith(kanaPart)) remaining = remaining.slice(kanaPart.length);
      continue;
    }
    const nextKana = parts.slice(i + 1).find(p => !hasKanji(p)) || '';
    if (nextKana && remaining.includes(normalizeHiragana(nextKana))) {
      const idx = remaining.indexOf(normalizeHiragana(nextKana));
      const rb = remaining.slice(0, idx);
      out += `<ruby class="ruby-text"><rb>${esc(part)}</rb><rp>(</rp><rt>${esc(rb || remaining)}</rt><rp>)</rp></ruby>`;
      remaining = remaining.slice(idx);
    } else {
      out += `<ruby class="ruby-text"><rb>${esc(part)}</rb><rp>(</rp><rt>${esc(remaining)}</rt><rp>)</rp></ruby>`;
      remaining = '';
    }
  }
  return out;
}

function renderRuby(text, reading) {
  return renderRubyWord(text, reading);
}

function rubyWord(word, reading) {
  return renderRubyWord(word, reading);
}

function renderFuriganaSegments(segments) {
  if (!Array.isArray(segments) || !segments.length) return '';
  return segments.map(segment => {
    if (!segment) return '';
    const text = segment.t != null ? segment.t : (segment.text != null ? segment.text : '');
    const reading = segment.r != null ? segment.r : (segment.reading != null ? segment.reading : '');
    if (!text) return '';
    if (reading) {
      if (hasKanji(text)) {
        return renderRubyWord(text, reading);
      }
      return `<ruby class="ruby-text"><rb>${esc(text)}</rb><rp>(</rp><rt>${esc(reading)}</rt><rp>)</rp></ruby>`;
    }
    return esc(text);
  }).join('');
}

function renderSentenceFurigana(value) {
  if (!value) return '';
  if (Array.isArray(value)) return renderFuriganaSegments(value);
  if (typeof value === 'object') {
    if (Array.isArray(value.segments) && value.segments.length) return renderFuriganaSegments(value.segments);
    if (Array.isArray(value.furigana)) return renderFuriganaSegments(value.furigana);
    if (value.ja) return renderSentenceFurigana(value.ja);
  }
  let sentence = String(value || '');
  if (!sentence) return '';
  // Strip raw HTML tags or escaped tags if passed accidentally
  if (sentence.includes('<ruby') || sentence.includes('&lt;ruby') || sentence.includes('<rt>') || sentence.includes('&lt;rt&gt;')) {
    sentence = sentence
      .replace(/<rt>[^<]*<\/rt>/gi, '')
      .replace(/&lt;rt&gt;.*?&lt;\/rt&gt;/gi, '')
      .replace(/<[^>]+>/g, '')
      .replace(/&lt;[^&]+&gt;/g, '')
      .trim();
  }
  if (!hasKanji(sentence)) return esc(sentence);

  const knownWords = [...globalLexicon.keys()].sort((a, b) => b.length - a.length);
  let out = '';
  let index = 0;
  while (index < sentence.length) {
    const char = sentence[index];
    if (!hasKanji(char)) {
      out += esc(char);
      index++;
      continue;
    }
    let matched = '';
    for (const w of knownWords) {
      if (sentence.startsWith(w, index)) { matched = w; break; }
    }
    if (matched) {
      out += renderRubyWord(matched, globalLexicon.get(matched));
      index += matched.length;
      continue;
    }
    const kReading = globalLexicon.get(char);
    if (kReading) {
      out += `<ruby class="ruby-text"><rb>${esc(char)}</rb><rp>(</rp><rt>${esc(kReading)}</rt><rp>)</rp></ruby>`;
    } else {
      out += esc(char);
    }
    index++;
  }
  return out;
}

function renderTextWithRuby(text) {
  return renderSentenceFurigana(text);
}

document.body.dataset.furigana = 'on';

function save(){
  try{
    localStorage.setItem(readKey,JSON.stringify([...readSet]));
    localStorage.setItem(knownKey,JSON.stringify([...knownSet]));
    localStorage.setItem(progressKey,JSON.stringify(progress));
    localStorage.setItem('jlpt-v7-kana-state',JSON.stringify(kanaState));
  }catch(e){}
}
function isRead(t,id){return readSet.has(markKey(t,id))} function isKnown(t,id){return knownSet.has(markKey(t,id))}
function posLabel(pos=[]){if(pos.some(x=>/^v/.test(x)))return 'Verb';if(pos.includes('adj-i'))return 'i-Adjective';if(pos.includes('adj-na'))return 'na-Adjective';if(pos.includes('n'))return 'Noun';return 'Other'}
function furiganaHtml(s){if(!s)return '';return esc(s).replace(/\{([^|{}]+)\|([^{}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>')}
function cleanMeaning(s){return String(s||'').replace(/\s+/g,' ').trim()}

function syncThemeControls(){
  const isDark=(document.documentElement.dataset.theme||document.body.dataset.theme)==='dark';
  const btn=document.getElementById('themeToggle');
  if(btn){
    btn.setAttribute('aria-label',isDark?'Switch to light theme':'Switch to dark theme');
    btn.title=isDark?'Switch to light theme':'Switch to dark theme';
    btn.setAttribute('aria-pressed',String(isDark));
  }
}
function initShortcutHint(){
  const kbd=document.getElementById('kbdHint');
  const btn=document.getElementById('searchToggle');
  const isMac=typeof navigator!=='undefined'&&/(Mac|iPhone|iPod|iPad)/i.test(navigator.platform||navigator.userAgent||'');
  const label=isMac?'⌘K':'Ctrl K';
  if(kbd)kbd.textContent=label;
  if(btn){
    btn.title=`Search (${label})`;
    btn.setAttribute('aria-label',`${label} - Search across the app`);
  }
}
function kanjiReading(x){
  if(!x)return '';
  if(x.reading)return String(x.reading);
  const kana=(s)=>{const m=String(s||'').match(/[ぁ-ゖー]+/g);return m&&m.length?m[0]:''};
  const fromText=kana(x.vocabulary_text)||kana(x.flashVocabulary);
  if(fromText)return fromText;
  if(Array.isArray(x.kunyomi)&&x.kunyomi.length)return String(x.kunyomi[0]).replace(/[.・]/g,'').replace(/^-|-$/g,'');
  if(Array.isArray(x.onyomi)&&x.onyomi.length)return String(x.onyomi[0]);
  const info=String(x.reading_info||x.flashReadingInfo||'');
  const hiragana=info.match(/[ぁ-ゖー]{1,12}/);if(hiragana)return hiragana[0];
  const katakana=info.match(/[ァ-ヺー]{1,12}/);return katakana?katakana[0]:'';
}
function relatedVocabForKanji(x){
  if(!x)return [];
  const ch=String(x.character||'');
  const wanted=Array.isArray(x.words)?x.words.map(String):[];
  const exact=[];
  const contains=[];
  for(const v of vocab){
    const w=String(v.word||'');
    if(wanted.includes(w))exact.push(v);
    else if(ch&&w.includes(ch))contains.push(v);
  }
  const out=[...exact,...contains];
  return [...new Map(out.map(v=>[v.word+'|'+(v.reading||''),v])).values()].slice(0,8);
}
function kanjiMeaning(x){
  if(!x)return 'Meaning unavailable';
  const direct=Array.isArray(x.meanings)?x.meanings.filter(Boolean):[];
  if(direct.length)return direct.slice(0,4).join(' · ');
  const related=relatedVocabForKanji(x);
  const meanings=[...new Set(related.flatMap(v=>Array.isArray(v.meanings)?v.meanings:[]).filter(Boolean))];
  if(meanings.length)return meanings.slice(0,4).join(' · ');
  const text=String(x.vocabulary_text||'');
  const parts=text.split('/').map(s=>s.trim()).filter(Boolean);
  const english=parts.find(s=>/^[A-Za-z][A-Za-z0-9 ,.'()\-]*$/.test(s));
  return english||'Meaning unavailable in supplied sources';
}
function dedupeVocab(arr){const map=new Map();for(const x of arr){const key=(x.word||'')+'|'+(x.reading||'');if(!map.has(key))map.set(key,{...x,meanings:[...(x.meanings||[])],examples:[...(x.examples||[])]});else{const old=map.get(key);old.meanings=[...new Set([...old.meanings,...(x.meanings||[])])].slice(0,5);old.examples=[...new Map([...old.examples,...(x.examples||[])].map(e=>[(e.ja||'')+'|'+(e.en||''),e])).values()].slice(0,6);if(old.level==='SUPP'&&x.level!=='SUPP')old.level=x.level;}}return [...map.values()]}
function exampleTranslation(text){
  const trimmed=String(text||'').trim();
  if(!trimmed)return '';
  const known={
    '赤い車が見えます。':'I can see a red car.',
    '父は会社で働いています。':'My father works at a company.',
    '地図を見て行きましょう。':'Let us look at the map and go.',
    '電車は８時に出発します。':'The train leaves at 8 o\'clock.',
    '日本の生活は楽しいです。':'Life in Japan is enjoyable.',
    '医者に診てもらいました。':'I had a doctor examine me.',
    '私たちは同じ学校です。':'We go to the same school.',
    '家族と食事をしました。':'I had a meal with my family.',
    '毎朝新聞を読みます。':'I read the newspaper every morning.',
    '窓を開けてください。':'Please open the window.',
    '工場で車を作っています。':'They are making cars in the factory.',
    '毎日日本語を勉強します。':'I study Japanese every day.',
    '自転車で駅へ行きます。':'I go to the station by bicycle.',
    '質問があります。':'I have a question.',
    '日本語で会話しましょう。':'Let\'s speak in Japanese.',
    '病院へ行きました。':'I went to the hospital.',
    '銀行でお金を下ろします。':'I withdraw money at the bank.',
    '夏休みに京都へ旅行します。':'I will travel to Kyoto during summer vacation.'
  };
  return known[trimmed]||'';
}
function splitFuriganaSegments(text, reading) {
  const plain = String(text || '');
  const cleanReading = normalizeHiragana(reading).replace(/[.・-]/g, '');
  if (!plain) return [];
  if (!hasKanji(plain)) return [{ text: plain, reading: null }];
  if (!cleanReading) return [{ text: plain, reading: null }];
  if (!/[ぁ-ゖァ-ヶ]/.test(plain)) return [{ text: plain, reading: cleanReading }];

  const result = [];
  let remainingReading = cleanReading;
  const parts = plain.split(/([\p{Script=Han}]+)/u).filter(Boolean);

  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    if (!hasKanji(part)) {
      result.push({ text: part, reading: null });
      const kanaPart = normalizeHiragana(part);
      if (remainingReading.startsWith(kanaPart)) remainingReading = remainingReading.slice(kanaPart.length);
      continue;
    }

    const nextKana = parts.slice(index + 1).find(segment => !hasKanji(segment)) || '';
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

function buildFuriganaForWord(word,reading){
  const parts=splitFuriganaSegments(word,reading);
  if(parts.length===1&&parts[0]&&parts[0].text===word&&parts[0].reading===reading){
    return [{text:word,reading:hasKanji(word)?normalizeHiragana(reading):null}];
  }
  return parts.map(segment=>segment.reading?{text:segment.text,reading:normalizeHiragana(segment.reading)}:{text:segment.text,reading:null});
}
async function enrichStudyText(){
  for(const item of vocab){
    const reading=normalizeHiragana(item.reading||item.romaji||'');
    if(item.word&&reading)globalLexicon.set(item.word,reading);
  }
  for(const item of kanji){
    const reading=normalizeHiragana(kanjiReading(item));
    if(item.character&&reading)globalLexicon.set(item.character,reading);
    for(const word of item.words||[]){
      const value=normalizeHiragana(word.reading||'');
      if(word.word&&value)globalLexicon.set(word.word,value);
    }
  }
  await new Promise(r => setTimeout(r, 0));
  for(const item of vocab){
    if(item.word&&item.reading)item.furigana=buildFuriganaForWord(item.word,item.reading);
    item.examples=(item.examples||[]).map(example=>{
      const ja=String(example.ja||'').trim();
      const translation=String(example.en||example.translation||exampleTranslation(ja)||'').trim();
      const furigana=(example.segments&&example.segments.length)?example.segments:(example.furigana||buildSentenceFurigana(ja,globalLexicon));
      return {...example,en:translation,translation,furigana};
    });
  }
  await new Promise(r => setTimeout(r, 0));
  for(const item of grammar){
    item.examples=(item.examples||[]).map(example=>{
      const ja=String(example.ja||'').trim();
      const translation=String(example.en||example.translation||exampleTranslation(ja)||'').trim();
      const furigana=(example.segments&&example.segments.length)?example.segments:(example.furigana||buildSentenceFurigana(ja,globalLexicon));
      return {...example,en:translation,translation,furigana};
    });
  }
  await new Promise(r => setTimeout(r, 0));
  for(const item of kanji){
    if(item.character&&kanjiReading(item))item.furigana=[{text:item.character,reading:normalizeHiragana(kanjiReading(item))}];
    item.words=(item.words||[]).map(word=>{
      const reading=normalizeHiragana(word.reading||'');
      return {...word,furigana:buildFuriganaForWord(word.word||'',reading)};
    });
  }
}
function buildSentenceFurigana(text,lexicon){
  const sentence=String(text||'');
  if(!sentence)return [];
  const knownWords=[...lexicon.keys()].sort((a,b)=>b.length-a.length);
  const segments=[];
  let index=0;
  while(index<sentence.length){
    const char=sentence[index];
    if(!hasKanji(char)){
      segments.push({text:char,reading:null});
      index++;
      continue;
    }
    let matched='';
    for(const word of knownWords){
      if(sentence.startsWith(word,index)){matched=word;break;}
    }
    if(matched){
      segments.push({text:matched,reading:lexicon.get(matched)});
      index+=matched.length;
      continue;
    }
    const nextBreak=sentence.slice(index).search(/[^\p{Script=Han}ぁ-ゖァ-ヶー]/u);
    const chunk=nextBreak===-1?sentence.slice(index):sentence.slice(index,index+nextBreak);
    const fallbackReading=normalizeHiragana(chunk.replace(/[\p{Script=Han}]/gu,''))||null;
    segments.push({text:chunk,reading:fallbackReading||null});
    index+=chunk.length;
  }
  return segments;
}
function levelScope(level){return level==='N5'?['N5']:['N5','N4']}
function eligibleExamples(target,scope){
  let out=[];
  if(target.examples&&target.examples.length){
    out.push(...target.examples.map(e=>({...e,sourceWord:target.word,sourceLevel:target.level})));
  }
  const allowed=levelScope(scope);
  for(const x of vocab.filter(v=>allowed.includes(v.level))){
    if(x===target)continue;
    for(const e of x.examples||[]){
      if((e.ja||'').includes(target.word)){
        out.push({...e,sourceWord:x.word,sourceLevel:x.level});
      }
    }
  }
  const deduped=[...new Map(out.filter(e=>e.ja).map(e=>[(e.ja||'')+'|'+(e.en||''),e])).values()];
  return deduped.sort((a,b)=>{
    const aHasEn=a.en&&a.en!=='Translation not available'?1:0;
    const bHasEn=b.en&&b.en!=='Translation not available'?1:0;
    if(aHasEn!==bHasEn)return bHasEn-aHasEn;
    return (a.ja||'').length-(b.ja||'').length;
  }).slice(0,3);
}
function difficulty(ex,i){return i===0?'Easy':i===1?'Medium':'Hard'}
function escapeId(id){return String(id).replace(/[^a-zA-Z0-9_-]/g,'_')}

async function fetchJsonWithFallback(urls,cacheKey){
  const cacheName='jlpt-data-v7';
  try{const c=await caches.open(cacheName);const cached=await c.match(cacheKey);if(cached){const data=await cached.json();return {data,cached:true};}}catch{}
  let lastError;
  for(const url of urls){try{const r=await fetch(url,{cache:'no-store'});if(!r.ok)throw new Error(`${r.status} ${r.statusText}`);const data=await r.json();try{const c=await caches.open(cacheName);await c.put(cacheKey,new Response(JSON.stringify(data),{headers:{'Content-Type':'application/json'}}));}catch{}return {data,cached:false,url};}catch(e){lastError=e}}
  throw lastError||new Error('Data source unavailable');
}
async function localJson(path){const r=await fetch(path);if(!r.ok)throw new Error(`${path}: ${r.status}`);return r.json()}
function status(name,ok,detail=''){const el=$('#sourceStatus');if(!el)return;const span=document.createElement('span');span.className='status-pill '+(ok?'ok':'bad');span.textContent=`${name}: ${ok?'OK':'Failed'}${detail?' · '+detail:''}`;el.appendChild(span)}
function renderLoadError(message){for(const id of ['vGrid','gGrid','kGrid']){const el=$('#'+id);if(el)el.innerHTML=`<div class="error-box"><b>Could not load data.</b><div>${esc(message)}</div><button class="retry-btn" onclick="loadData()">Retry</button></div>`}}

async function loadData(){
  $('#sourceStatus').innerHTML='';
  try{
    const localPromises=await Promise.allSettled([
      localJson('data/vocab_source_900.json'),
      localJson('data/kanji_flashcards.json'),
      localJson('data/study_supplement.json'),
      localJson('data/grammar.json'),
      localJson('data/conjunctions.json'),
      localJson('data/comparisons.json')
    ]);
    sourceVocab=localPromises[0].status==='fulfilled'?localPromises[0].value:[];
    flashChars=localPromises[1].status==='fulfilled'?localPromises[1].value:[];
    const workbookData=localPromises[2].status==='fulfilled'?localPromises[2].value:{vocabulary:[],kanji:[]};
    if(localPromises[3].status==='fulfilled') grammar=localPromises[3].value;
    if(localPromises[4].status==='fulfilled') window.conjunctionsData=localPromises[4].value;
    if(localPromises[5].status==='fulfilled') window.comparisonsData=localPromises[5].value;

    status('900 Sentences PDF',localPromises[0].status==='fulfilled',`${sourceVocab.length} records`);
    status('JK4B flashcards',localPromises[1].status==='fulfilled',`${flashChars.length} kanji`);
    status('Excel N5/N4 lists',localPromises[2].status==='fulfilled',`${(workbookData.vocabulary||[]).length} words · ${(workbookData.kanji||[]).length} kanji`);
    status('Grammar (Book N4 & N5)',localPromises[3].status==='fulfilled',`${grammar.length} patterns`);
    status('Conjunctions (14 points)',localPromises[4].status==='fulfilled',`${(window.conjunctionsData?.items||[]).length} items`);
    status('Contrast Groups (12 sets)',localPromises[5].status==='fulfilled',`${(window.comparisonsData||[]).length} groups`);

    const mapExtra = (x, i) => ({
      id: 'pdf-' + x.source_no + '-' + i,
      word: x.word,
      reading: x.reading,
      romaji: '',
      meanings: [cleanMeaning(x.meaning)],
      level: x.level || 'SUPP',
      pos: Array.isArray(x.pos) ? x.pos : (x.pos ? [x.pos] : []),
      forms: x.forms || [],
      examples: (x.examples && x.examples.length) ? x.examples : (x.example ? [{ ja: x.example, en: x.translation || x.example_en || '', furigana: x.segments || '' }] : []),
      source: 'PDF',
      sourceNo: x.source_no
    });

    if(sourceVocab.length||flashChars.length){
      const quickExtra=sourceVocab.map(mapExtra);
      vocab=dedupeVocab([...quickExtra,...(workbookData.vocabulary||[])]);
      const quickKm=new Map();
      for(const x of (workbookData.kanji||[])) quickKm.set(x.character,{...x,id:'k-'+x.character,flash:false});
      for(const c of flashChars) quickKm.set(c.character,{id:'flash-'+c.character,character:c.character,level:'FLASH',meanings:c.meanings||[],onyomi:c.onyomi||[],kunyomi:c.kunyomi||[],strokes:c.strokes,words:c.words||[],flash:true});
      kanji=[...quickKm.values()];
      updateHome();
    }
    const keys=['v5','v4','k5','k4','g5','g4'];
    const results=await Promise.allSettled(keys.map(k=>fetchJsonWithFallback(SOURCES[k],SOURCES[k][0])));
    const d={};keys.forEach((k,i)=>d[k]=results[i].status==='fulfilled'?results[i].value.data:[]);
    keys.forEach((k,i)=>status(`OpenJLPT ${k.slice(-2).toUpperCase()}`,results[i].status==='fulfilled',results[i].status==='fulfilled'?(results[i].value.cached?'cache':'network'):'unavailable'));
    const extra=sourceVocab.map(mapExtra);
    vocab=dedupeVocab([...(d.v5||[]),...(d.v4||[]),...extra,...(workbookData.vocabulary||[])]);
    if(!grammar.length) grammar=[...(d.g5||[]),...(d.g4||[])];
    const km=new Map();for(const x of [...(d.k5||[]),...(d.k4||[])]){if(!km.has(x.character))km.set(x.character,{...x,id:'k-'+x.character,flash:false})}
    for(const x of (workbookData.kanji||[])){if(!km.has(x.character))km.set(x.character,{...x,id:'k-'+x.character,flash:false});else{const old=km.get(x.character);if(!old.meanings?.length)old.meanings=x.meanings||[];if(!old.onyomi?.length)old.onyomi=x.onyomi||[];if(!old.kunyomi?.length)old.kunyomi=x.kunyomi||[];if(!old.strokes)old.strokes=x.strokes;}}
    for(const c of flashChars){if(!km.has(c.character))km.set(c.character,{id:'flash-'+c.character,character:c.character,level:'FLASH',meanings:c.meanings||[],onyomi:c.onyomi||[],kunyomi:c.kunyomi||[],strokes:c.strokes,words:c.words||[],flash:true,flashSource:c.source,flashCard:c.card,flashReadingInfo:c.reading_info,flashVocabulary:c.vocabulary_text})}
    kanji=[...km.values()];
    if(!vocab.length&&!grammar.length&&!kanji.length)throw new Error('No study data was returned.');
    await enrichStudyText();
    updateHome();renderAll();syncCompareTray();fillCompare();
    if(typeof initGrammarViewControls==='function') initGrammarViewControls();
    if(typeof initComparePresets==='function') initComparePresets();
    if(typeof initBookCompanion==='function') initBookCompanion();
    const last=localStorage.getItem('jlpt-v7-last-page');if(last&&document.getElementById(last))showPage(last,false);
  }catch(e){console.error('JLPT data load error',e);renderLoadError(e.message||'Check your connection or run the site from http://localhost:8000/.');}
}

function updateHome(){
  const examples=vocab.reduce((n,x)=>n+(x.examples?.length||0),0);
  const goal=DAILY_GOAL;
  const done=Math.min(goal,readSet.size+knownSet.size);
  if($('#homeVocab'))$('#homeVocab').textContent=vocab.length.toLocaleString();
  if($('#homeKanji'))$('#homeKanji').textContent=kanji.length.toLocaleString();
  if($('#homeGrammar'))$('#homeGrammar').textContent=grammar.length.toLocaleString();
  if($('#homeExamples'))$('#homeExamples').textContent=examples.toLocaleString();
  if($('#homeRead'))$('#homeRead').textContent=readSet.size;
  if($('#homeKnown'))$('#homeKnown').textContent=knownSet.size;
  if($('#homeStreak'))$('#homeStreak').textContent=calcStreak();
  if($('#goalDone'))$('#goalDone').textContent=String(done);
  if($('#goalTotal'))$('#goalTotal').textContent=`/ ${goal}`;
  if($('#goalBadge'))$('#goalBadge').textContent=done>=goal?'Nice pace':'Keep going';
  const pct=Math.round(done/goal*100);
  const ring=$('#goalRing');
  if(ring)ring.style.setProperty('--pct',String(Math.min(100,pct)));
  const last=progress.lastType==='g'?'Grammar':progress.lastType==='k'?'Kanji':'Vocabulary';
  if($('#continueTitle'))$('#continueTitle').textContent=`Continue ${last}`;
  if($('#continueText'))$('#continueText').textContent=`Resume at item ${Math.max(1,Number(progress.resume?.[progress.lastType||'v']||1))} in your last section.`;
  $('#homeStreak')?.closest('.goal-card')?.setAttribute('data-streak',String(calcStreak()));
  const heroResumeWrap=$('#heroResumeWrap');
  const heroResumeBtn=$('#heroResumeBtn');
  if(heroResumeWrap&&(readSet.size>0||progress.lastType)){
    heroResumeWrap.style.display='block';
    if(heroResumeBtn)heroResumeBtn.onclick=()=>showPage(progress.lastType==='g'?'grammar':progress.lastType==='k'?'kanji':'vocab');
  }
  updateKanaProgress();
  if(typeof updateHomeRoadmap==='function') updateHomeRoadmap();
}
function calcStreak(){const dates=progress.dates||[];if(!dates.length)return 0;const set=new Set(dates);let n=0,d=new Date();d.setHours(0,0,0,0);while(set.has(d.toISOString().slice(0,10))){n++;d.setDate(d.getDate()-1)}return n}
function touchStudy(){const today=new Date().toISOString().slice(0,10);progress.dates=[...new Set([...(progress.dates||[]),today])];save();updateHome()}
function rememberResume(type, oneBased){
  progress.resume=progress.resume||{};
  progress.resume[type]=Math.max(1,Number(oneBased)||1);
  save();
}
function resumeIndex(type){
  const n=Number(progress.resume?.[type]||1);
  return Math.max(0,n-1);
}
/**
 * Unified Row Windowing / Auto-Loader Helper (Problem 1 & 2)
 * Ensures exact 7 rows on first paint (7 * live computed cols),
 * auto-loads next 4 rows on scroll via IntersectionObserver,
 * keeps DOM bounded via top spacer windowing (<= 40 rows in DOM),
 * reserves space via skeletons (zero CLS).
 */
function createRowLoader({
  gridId,
  sentinelId,
  statusId,
  getData,
  renderItem,
  itemType = 'items',
  minHeight = 200,
  onReset
}) {
  let loadedRows = 7;

  let activeData = [];
  let cols = 1;
  let observer = null;
  let resizeObserver = null;
  let isAppending = false;
  let topUnmountedRows = 0;

  const getGrid = () => typeof gridId === 'string' ? document.getElementById(gridId) : gridId;
  const getSentinel = () => typeof sentinelId === 'string' ? document.getElementById(sentinelId) : sentinelId;
  const getStatus = () => typeof statusId === 'string' ? document.getElementById(statusId) : statusId;

  function getComputedCols() {
    const grid = getGrid();
    if (!grid) return 1;
    const style = window.getComputedStyle(grid);
    const template = style.gridTemplateColumns;
    if (template && template !== 'none' && !template.includes('repeat') && !template.includes('minmax')) {
      const tracks = template.trim().split(/\s+/).filter(Boolean);
      if (tracks.length > 0) return tracks.length;
    }
    const width = grid.clientWidth || window.innerWidth;
    if (width >= 1600) return 5;
    if (width >= 1200) return 4;
    if (width >= 880) return 3;
    if (width >= 580) return 2;
    return 1;
  }

  function renderSkeletons() {
    const grid = getGrid();
    if (!grid) return;
    cols = getComputedCols();
    const count = cols * 7;
    grid.innerHTML = Array.from({ length: count }, () => `<div class="card-skeleton" aria-hidden="true"></div>`).join('');
  }

  function update() {
    const grid = getGrid();
    if (!grid) return;
    cols = getComputedCols();
    activeData = getData();
    const total = activeData.length;

    if (total === 0) {
      grid.innerHTML = '<div class="empty-panel">No items match your criteria.</div>';
      const statusEl = getStatus();
      if (statusEl) statusEl.innerHTML = '';
      return;
    }

    const targetCount = Math.min(total, loadedRows * cols);
    const visibleData = activeData.slice(0, targetCount);

    // Bounded windowing: When loaded rows > 20, unmount rows far above viewport
    let topSpacerHeight = 0;
    let sliceToRender = visibleData;
    let startIndex = 0;

    if (loadedRows > 20) {
      topUnmountedRows = loadedRows - 16;
      startIndex = topUnmountedRows * cols;
      const sample = grid.querySelector('.study-card');
      const measuredHeight = sample && sample.offsetHeight > 50 ? sample.offsetHeight : minHeight;
      topSpacerHeight = topUnmountedRows * (measuredHeight + 18);
      sliceToRender = visibleData.slice(startIndex);
    } else {
      topUnmountedRows = 0;
    }

    let html = '';
    if (topSpacerHeight > 0) {
      html += `<div class="grid-top-spacer" style="height:${topSpacerHeight}px;" aria-hidden="true"></div>`;
    }
    html += sliceToRender.map((item, i) => renderItem(item, startIndex + i, total)).join('');

    // Preserve focus across DOM updates
    const activeEl = document.activeElement;
    const activeCard = activeEl ? activeEl.closest('.study-card') : null;
    const focusedCardIndex = activeCard ? activeCard.dataset.index : null;
    const focusedAction = activeEl && activeEl.dataset.action ? activeEl.dataset.action : null;
    const focusedSpeak = activeEl && activeEl.classList.contains('card-speak');

    grid.innerHTML = html;

    if (focusedCardIndex !== null) {
      const restoredCard = grid.querySelector(`.study-card[data-index="${focusedCardIndex}"]`);
      if (restoredCard) {
        if (focusedAction) {
          const btn = restoredCard.querySelector(`[data-action="${focusedAction}"]`);
          if (btn) btn.focus();
        } else if (focusedSpeak) {
          const speak = restoredCard.querySelector('.card-speak');
          if (speak) speak.focus();
        } else {
          restoredCard.focus();
        }
      }
    }

    try {
      sessionStorage.setItem('jlpt_rows_' + gridId, String(loadedRows));
    } catch (e) {}

    updateStatus(targetCount, total);
  }

  function showLoadingIndicator() {
    const statusEl = getStatus();
    if (!statusEl) return;
    statusEl.innerHTML = `<div class="list-loading-indicator" aria-hidden="true"><span class="loading-spinner"></span><span>Loading next rows…</span></div>`;
  }

  function updateStatus(shown, total) {
    const statusEl = getStatus();
    if (!statusEl) return;
    if (shown >= total) {
      statusEl.innerHTML = `<div class="list-end-banner" role="status">End of list · ${total.toLocaleString()} ${itemType}</div>`;
    } else {
      const reduceData = window.matchMedia && window.matchMedia('(prefers-reduced-data: reduce)').matches;
      if (typeof window.IntersectionObserver !== 'function' || reduceData) {
        statusEl.innerHTML = `<button class="list-fallback-btn" type="button">Load 4 more rows (${Math.min(cols * 4, total - shown)} next)</button>`;
        const btn = statusEl.querySelector('.list-fallback-btn');
        if (btn) btn.onclick = () => loadNextBatch();
      } else {
        statusEl.innerHTML = '';
      }
    }
  }

  function loadNextBatch() {
    if (isAppending) return;
    if (loadedRows === 7 && window.scrollY < 80 && !userHasScrolled) return;
    cols = getComputedCols();
    const total = activeData.length;
    const currentCount = Math.min(total, loadedRows * cols);
    if (currentCount >= total) return;

    isAppending = true;
    showLoadingIndicator();
    loadedRows += 4;
    const newTarget = Math.min(total, loadedRows * cols);
    const addedCount = newTarget - currentCount;

    requestAnimationFrame(() => {
      update();
      isAppending = false;
      const announcer = document.getElementById('listLiveAnnouncer');
      if (announcer) {
        announcer.textContent = `Loaded ${addedCount} more ${itemType}. Showing ${newTarget} of ${total}.`;
      }
    });
  }

  function setupObservers() {
    const grid = getGrid();
    if (grid && 'ResizeObserver' in window && !resizeObserver) {
      resizeObserver = new ResizeObserver(() => {
        const newCols = getComputedCols();
        if (newCols !== cols && newCols > 0) {
          const currentlyLoaded = Math.min(activeData.length, loadedRows * cols);
          cols = newCols;
          loadedRows = Math.max(7, Math.ceil(currentlyLoaded / newCols));
          update();
        }
      });
      resizeObserver.observe(grid);
    }

    let userHasScrolled = false;
    const markScrolled = () => {
      if (window.scrollY > 80) userHasScrolled = true;
    };
    window.addEventListener('scroll', markScrolled, { passive: true });
    window.addEventListener('wheel', (e) => {
      if (e.deltaY > 0) userHasScrolled = true;
    }, { passive: true });
    window.addEventListener('touchmove', markScrolled, { passive: true });
    window.addEventListener('keydown', (e) => {
      if (['ArrowDown', 'PageDown', 'Space'].includes(e.key)) userHasScrolled = true;
    }, { passive: true });

    const sentinel = getSentinel();
    if (sentinel && typeof window.IntersectionObserver === 'function' && !observer) {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0] && entries[0].isIntersecting) {
            if (loadedRows > 7 || window.scrollY > 80 || userHasScrolled) {
              loadNextBatch();
            }
          }
        },
        { rootMargin: '600px 0px', threshold: 0.01 }
      );
      observer.observe(sentinel);
    }

    window.addEventListener('popstate', () => {
      try {
        const saved = sessionStorage.getItem('jlpt_rows_' + gridId);
        if (saved && Number(saved) >= 7) {
          loadedRows = Number(saved);
          update();
        }
      } catch (e) {}
    });
  }

  function reset() {
    loadedRows = 7;
    topUnmountedRows = 0;
    userHasScrolled = false;
    try { sessionStorage.setItem('jlpt_rows_' + gridId, '7'); } catch (e) {}
    update();
    window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    if (onReset) onReset();
  }

  function jumpToIndex(idx) {
    cols = getComputedCols();
    const row = Math.floor(idx / cols);
    loadedRows = Math.max(7, row + 7);
    update();
    requestAnimationFrame(() => {
      const grid = getGrid();
      const card = grid?.querySelector(`[data-index="${idx}"]`);
      if (card) card.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }

  setupObservers();

  return {
    update,
    reset,
    renderSkeletons,
    jumpToIndex,
    getLoadedCount: () => Math.min(activeData.length, loadedRows * cols),
    getTotalCount: () => activeData.length,
    getCols: () => cols
  };
}

function getFilteredVocab(){
  const q=$('#vSearch')?.value.trim().toLowerCase()||'',f=$('#vLevel')?.value||'ALL',pos=$('#vPos')?.value||'ALL',prog=$('#vRead')?.value||'ALL';
  return vocab.filter(x=>{
    if(f==='N5'&&x.level!=='N5')return false;
    if(f==='N4'&&x.level!=='N4')return false;
    if(f==='N5N4'&&!['N5','N4'].includes(x.level))return false;
    if(f==='SUPP'&&x.level!=='SUPP')return false;
    if(q&&!([x.word,x.reading,x.romaji,(x.meanings||[]).join(' ')].join(' ').toLowerCase().includes(q)))return false;
    const p=posLabel(x.pos);
    if(pos==='NOUN'&&p!=='Noun'||pos==='IADJ'&&p!=='i-Adjective'||pos==='NADJ'&&p!='na-Adjective'||pos==='VERB'&&p!=='Verb'||pos==='OTHER'&&['Noun','i-Adjective','na-Adjective','Verb'].includes(p))return false;
    if(prog==='READ'&&!isRead('v',x.id))return false;
    if(prog==='UNREAD'&&isRead('v',x.id))return false;
    return true;
  });
}

function vocabCardMarkup(x, i) {
  const posDisplay = Array.isArray(x.pos) && x.pos.length ? x.pos.join(', ') : posLabel(x.pos);
  return `<article class="study-card" data-type="vocab" data-id="${esc(x.id)}" data-index="${i}">
    <div class="card-top"><div class="serial">#${i+1}</div><span class="badge">${esc(x.level)}</span></div>
    <div class="jp">${rubyWord(x.word,x.reading)}</div>
    <div class="reading romaji-field">${esc(x.reading||'—')}</div>
    <div class="meaning">${esc((x.meanings||[x.meaning||''])[0]||'')}</div>
    <div class="pos-tags"><span class="pos-tag">${esc(posDisplay)}</span></div>
    <div class="card-bottom">
      <button class="detail-link" data-action="detail">Details →</button>
      <button class="speak-btn card-speak" data-speak="${esc(x.word)}" aria-label="Listen to ${esc(x.word)}">
        <svg class="btn-icon" width="16" height="16"><use href="#icon-speaker"/></svg>
      </button>
      <button class="read-btn ${isRead('v',x.id)?'read':''}" data-action="read">${isRead('v',x.id)?'✓ Read':'○ Read'}</button>
    </div>
  </article>`;
}

function getFilteredGrammar(){
  const q=$('#gSearch')?.value.trim().toLowerCase()||'',f=$('#gLevel')?.value||'ALL',p=$('#gProgress')?.value||'ALL';
  let data=grammar.filter(x=>(f==='ALL'||f==='N5N4'&&['N5','N4'].includes(x.level)||f==='N5'&&x.level==='N5'||f==='N4'&&x.level==='N4')&&(!q||[x.pattern,x.romaji,x.meaning,x.formation,(x.tags||[]).join(' ')].join(' ').toLowerCase().includes(q))&&(p==='ALL'||p==='READ'&&isRead('g',x.id)||p==='UNREAD'&&!isRead('g',x.id)));
  return data.sort((a,b)=>a.level.localeCompare(b.level)||a.pattern.localeCompare(b.pattern));
}

function grammarCardMarkup(x, i) {
  const isBook = Boolean(x.isBookPattern);
  const badgeText = isBook ? `第${x.lesson}話 · 文型${x.patternNo}` : `#${i+1}`;
  const pageBadge = isBook && x.bookRef?.page ? `<span class="book-ref-badge">Book p.${x.bookRef.page}</span>` : '';
  const isComparing = compareIds.includes(x.id);
  return `<article class="study-card" data-type="grammar" data-id="${esc(x.id)}" data-index="${i}">
    <div class="card-top">
      <div class="serial">${badgeText}</div>
      ${pageBadge}
      <span class="badge">${esc(x.level)}</span>
    </div>
    <div class="jp">${renderSentenceFurigana(x.furigana || x.pattern)}</div>
    <div class="reading romaji-field">${esc(x.romaji||'')}</div>
    <div class="meaning">${esc(x.meaning||'')}</div>
    ${x.formation?`<div class="grammar-formula-preview"><span>BUILD IT</span><code>${esc(x.formation)}</code></div>`:''}
    ${x.examples?.[0]?.ja?`<div class="grammar-example-preview"><span>EXAMPLE</span><div>${renderSentenceFurigana(x.examples[0].furigana||x.examples[0].segments||x.examples[0].ja||'')}</div>${x.examples[0].en?`<small>${esc(x.examples[0].en)}</small>`:''}</div>`:''}
    <div class="card-bottom">
      <button class="detail-link" data-action="detail">Learn this →</button>
      <button class="tool-btn compare-toggle-btn ${isComparing ? 'active' : ''}" data-action="toggle-compare" data-id="${esc(x.id)}" title="Add or remove from Compare Tray">${isComparing ? '✓ In Compare' : '⚖️ Compare'}</button>
      <button class="speak-btn card-speak" data-speak="${esc(x.pattern)}" aria-label="Listen to grammar pattern">
        <svg class="btn-icon" width="16" height="16"><use href="#icon-speaker"/></svg>
      </button>
      <button class="read-btn ${isRead('g',x.id)?'read':''}" data-action="read">${isRead('g',x.id)?'✓ Read':'○ Read'}</button>
    </div>
  </article>`;
}

function getFilteredKanji(){
  const q=$('#kSearch')?.value.trim().toLowerCase()||'',f=$('#kLevel')?.value||'ALL',p=$('#kProgress')?.value||'ALL';
  return kanji.filter(x=>(f==='ALL'||f==='N5'&&x.level==='N5'||f==='N4'&&x.level==='N4'||f==='N5N4'&&['N5','N4'].includes(x.level)||f==='FLASH'&&x.flash)&&(!q||[x.character,(x.onyomi||[]).join(' '),(x.kunyomi||[]).join(' '),kanjiMeaning(x),(x.words||[]).join(' ')].join(' ').toLowerCase().includes(q))&&(p==='ALL'||p==='READ'&&isRead('k',x.id)||p==='UNREAD'&&!isRead('k',x.id)));
}

function kanjiCardMarkup(x, i) {
  return `<article class="study-card" data-type="kanji" data-id="${esc(x.id)}" data-index="${i}">
    <div class="card-top"><div class="serial">#${i+1}</div><span class="badge">${esc(x.level||'Flashcard')}</span></div>
    <div class="k-big">${x.character&&kanjiReading(x)?`<ruby>${esc(x.character)}<rt>${esc(kanjiReading(x))}</rt></ruby>`:esc(x.character||'')}</div>
    <div class="k-meaning">${esc(kanjiMeaning(x))}</div>
    <div class="reading romaji-field">${esc((x.onyomi||[]).slice(0,2).join(' · '))} ${(x.kunyomi||[]).slice(0,2).join(' · ')}</div>
    <div class="card-bottom">
      <button class="detail-link" data-action="detail">Details →</button>
      <button class="speak-btn card-speak" data-speak="${esc(kanjiReading(x)||x.character||'')}" aria-label="Listen to kanji reading">
        <svg class="btn-icon" width="16" height="16"><use href="#icon-speaker"/></svg>
      </button>
      <button class="read-btn ${isRead('k',x.id)?'read':''}" data-action="read">${isRead('k',x.id)?'✓ Read':'○ Read'}</button>
    </div>
  </article>`;
}

const rowLoaders = {};
function initRowLoaders() {
  if (!rowLoaders.v) {
    rowLoaders.v = createRowLoader({
      gridId: 'vGrid',
      sentinelId: 'vSentinel',
      statusId: 'vStatus',
      getData: getFilteredVocab,
      renderItem: vocabCardMarkup,
      itemType: 'words',
      minHeight: 200,
      onReset: () => {
        const el = $('#vocabCount');
        if (el) el.textContent = `${getFilteredVocab().length.toLocaleString()} words`;
      }
    });
    $('#vGrid')?.addEventListener('click', e => handleGridCardAction(e, 'v'));
  }

  if (!rowLoaders.g) {
    rowLoaders.g = createRowLoader({
      gridId: 'gGrid',
      sentinelId: 'gSentinel',
      statusId: 'gStatus',
      getData: getFilteredGrammar,
      renderItem: grammarCardMarkup,
      itemType: 'grammar patterns',
      minHeight: 220,
      onReset: () => {
        const el = $('#gCount');
        if (el) el.textContent = `${getFilteredGrammar().length.toLocaleString()} points`;
      }
    });
    $('#gGrid')?.addEventListener('click', e => handleGridCardAction(e, 'g'));
  }

  if (!rowLoaders.k) {
    rowLoaders.k = createRowLoader({
      gridId: 'kGrid',
      sentinelId: 'kSentinel',
      statusId: 'kStatus',
      getData: getFilteredKanji,
      renderItem: kanjiCardMarkup,
      itemType: 'kanji characters',
      minHeight: 180,
      onReset: () => {
        const el = $('#kCount');
        if (el) el.textContent = `${getFilteredKanji().length.toLocaleString()} kanji`;
      }
    });
    $('#kGrid')?.addEventListener('click', e => handleGridCardAction(e, 'k'));
  }
  window.rowLoaders = rowLoaders;
  window.createRowLoader = createRowLoader;
}

function handleGridCardAction(e, type) {
  const speakBtn = e.target.closest('.speak-btn');
  if (speakBtn) {
    e.preventDefault();
    e.stopPropagation();
    speakJapanese(speakBtn.dataset.speak);
    return;
  }
  const readBtn = e.target.closest('.read-btn');
  if (readBtn) {
    e.preventDefault();
    e.stopPropagation();
    const card = readBtn.closest('.study-card');
    if (card) {
      const id = card.dataset.id;
      const k = markKey(type, id);
      const isNowRead = !readSet.has(k);
      if (isNowRead) readSet.add(k); else readSet.delete(k);
      touchStudy();
      readBtn.classList.toggle('read', isNowRead);
      readBtn.textContent = isNowRead ? '✓ Read' : '○ Read';
      save();
      updateHome();
    }
    return;
  }
  const detailBtn = e.target.closest('[data-action="detail"]');
  const card = e.target.closest('.study-card');
  if (detailBtn || (card && !e.target.closest('button'))) {
    const targetCard = detailBtn ? detailBtn.closest('.study-card') : card;
    if (!targetCard) return;
    const id = targetCard.dataset.id;
    rememberResume(type, Number(targetCard.dataset.index || 0) + 1);
    touchStudy();
    if (type === 'v') openVocab(id);
    else if (type === 'g') openGrammar(id);
    else if (type === 'k') openKanji(id);
  }
}

function renderVocab(){
  initRowLoaders();
  if (rowLoaders.v) rowLoaders.v.update();
  const total = getFilteredVocab().length;
  const countEl = $('#vocabCount');
  if (countEl) countEl.textContent = `${total.toLocaleString()} words`;
}

function renderGrammar(){
  initRowLoaders();
  if (rowLoaders.g) rowLoaders.g.update();
  const total = getFilteredGrammar().length;
  const countEl = $('#gCount');
  if (countEl) countEl.textContent = `${total.toLocaleString()} points`;
}

function renderKanji(){
  initRowLoaders();
  if (rowLoaders.k) rowLoaders.k.update();
  const total = getFilteredKanji().length;
  const countEl = $('#kCount');
  if (countEl) countEl.textContent = `${total.toLocaleString()} kanji`;
}

function jumpTo(type, input){
  const n = Math.max(1, Number(input?.value || 1));
  initRowLoaders();
  const loader = rowLoaders[type];
  if (loader) {
    loader.jumpToIndex(n - 1);
  }
}

function renderAll(){
  initRowLoaders();
  if (lastPage === 'vocab') renderVocab();
  else if (lastPage === 'grammar') renderGrammar();
  else if (lastPage === 'kanji') renderKanji();
  else if (lastPage === 'kana') renderKana();
  updateHome();
  if (typeof syncCustomSelects === 'function') syncCustomSelects();
}
function kanaItem(romaji){return kanaCells.get(romaji)||null}
function kanaItemsForSet(set){
  if(set==='dakuten')return kanaSource.filter(item=>item.group==='dakuten'||item.group==='handakuten');
  if(set==='combo')return kanaSource.filter(item=>item.group==='combo');
  return kanaSource.filter(item=>item.group==='basic');
}
function kanaExamples(item){
  if(!item)return [];
  const targetChars=[item.hiragana,item.katakana].filter(Boolean);
  const matches=vocab.filter(v=>targetChars.some(ch=>String(v.word||'').includes(ch)||String(v.reading||'').includes(ch))).slice(0,3);
  if(matches.length)return matches;
  return vocab.filter(v=>String(v.reading||'').includes(item.hiragana.slice(0,1))).slice(0,3);
}
function kanaColumnForRomaji(romaji){return kanaCells.get(romaji)?.col||'a'}
function kanaCellMarkup(item,script='hira'){
  if(!item||!item.hiragana)return `<button class="kana-cell empty" type="button" aria-disabled="true"><span class="kana-main"><span class="kana-char">·</span></span></button>`;
  const learned=(kanaState.learned||[]).includes(item.romaji);
  const content=script==='both'
    ? `<span class="kana-characters"><span class="kana-char">${esc(item.hiragana)}</span><span class="kana-char">${esc(item.katakana)}</span></span>`
    : `<span class="kana-char">${esc(script==='kata'?item.katakana:item.hiragana)}</span>`;
  const label=`${item.romaji}, hiragana ${item.hiragana}, katakana ${item.katakana}`;
  return `<button class="kana-cell ${learned?'learned':''}" type="button" data-kana-id="${esc(item.romaji)}" data-col="${esc(item.col||kanaColumnForRomaji(item.romaji))}" data-group="${esc(item.group)}" aria-label="${esc(label)}"><span class="kana-romaji">${esc(item.romaji)}</span>${learned?'<span class="kana-check">✓</span>':''}<span class="kana-main">${content}</span></button>`;
}
function kanaRowMarkup(row,script,set){
  const rowItems=row.items.map(romaji=>kanaItem(romaji)).filter(Boolean);
  const rowClass=set==='basic'?'kana-row basic-row':'kana-row';
  return `<div class="${rowClass}"><div class="kana-row-label">${esc(kanaBasicLabels[row.id]||row.label)}</div>${rowItems.map(item=>kanaCellMarkup(item,script)).join('')}</div>`;
}
function renderKanaBoard(title,script,set){
  const rows=set==='basic'?kanaRows:set==='dakuten'?kanaDakutenRows:[];
  const boardBody=set==='basic'
    ? rows.map(row=>kanaRowMarkup(row,script,set)).join('')
    : `<div class="kana-chip-grid ${set==='combo'?'combo-grid':'dakuten-grid'}">${kanaItemsForSet(set).map(item=>kanaCellMarkup(item,script)).join('')}</div>`;
  const subtitle=script==='hira'?'Hiragana ひらがな':script==='kata'?'Katakana カタカナ':'Both scripts';
  return `<section class="kana-board"><div class="kana-board-title"><h3>${title}</h3><span class="subtle">${subtitle}</span></div>${boardBody}</section>`;
}
function renderKana(){
  kanaView=kanaState.view||kanaView;
  kanaSet=kanaState.set||kanaSet;
  const wrap=$('#kanaGrid');
  if(!wrap)return;
  const desktop=window.matchMedia('(min-width: 768px)').matches;
  if(kanaSet==='basic'){
    if(desktop){
      const left=renderKanaBoard('Hiragana', 'hira', 'basic');
      const right=renderKanaBoard('Katakana', 'kata', 'basic');
      wrap.innerHTML=kanaView==='both'?`<div class="kana-dual-grid">${left}${right}</div>`:kanaView==='kata'?right:left;
    }else{
      const active=kanaView==='kata'?'kata':'hira';
      wrap.innerHTML=kanaView==='both'
        ? `<div class="kana-both-stack">${renderKanaBoard('Hiragana', 'hira', 'basic')}${renderKanaBoard('Katakana', 'kata', 'basic')}</div>`
        : renderKanaBoard(active==='kata'?'Katakana':'Hiragana', active, 'basic');
    }
  }else if(kanaSet==='dakuten'){
    wrap.innerHTML=renderKanaBoard('Dakuten & Handakuten', kanaView==='kata'?'kata':'hira', 'dakuten');
  }else{
    wrap.innerHTML=renderKanaBoard('Combinations (yōon)', kanaView==='kata'?'kata':'hira', 'combo');
  }
  syncKanaControls();
  updateKanaProgress();
}
function renderSingleKanaGrid(title,view,set){return renderKanaBoard(title,view,set)}
function updateKanaProgress(){
  const learned=(kanaState.learned||[]).length;
  const total=kanaSequence().length;
  const el=$('#kanaProgressText');
  if(el)el.textContent=`${learned} / ${total} learned`;
  const bar=$('#kanaProgressBar');
  if(bar)bar.style.width=`${Math.min(100,Math.round((learned/total)*100))}%`;
  const hint=$('#kanaProgressHint');
  if(hint)hint.textContent=learned?`${Math.max(0,total-learned)} more to go`:'Start with the basic sounds';
}
function kanaSequence(){return [...kanaCells.values()].filter(item=>item&&item.romaji)}
function kanaByIndex(index){const seq=kanaSequence();return seq[(index+seq.length)%seq.length]}
function kanaIndexOf(romaji){return kanaSequence().findIndex(item=>item.romaji===romaji)}
function kanaMarkLearned(romaji){kanaState.learned=[...new Set([...(kanaState.learned||[]),romaji])];save();renderKana();}
function kanaUnmarkLearned(romaji){kanaState.learned=(kanaState.learned||[]).filter(x=>x!==romaji);save();renderKana();}
function kanaExamplesHtml(item){
  const examples=kanaExamples(item);
  if(!examples.length)return '<div class="subtle">Examples will appear when matching vocabulary is available.</div>';
  return examples.map(ex=>`<div class="example-box"><div class="example-ja">${renderRuby(ex.word,ex.reading)} <button class="speak-btn inline-speak" data-speak="${esc(ex.word)}" aria-label="Listen to Japanese word">🔊</button></div><div class="example-en">${esc((ex.meanings||[]).join(' · ')||ex.meaning||'')}</div></div>`).join('');
}
function openKanaDetail(romaji){
  const item=kanaCells.get(romaji);if(!item)return;
  kanaSelectedId=romaji;
  const learned=(kanaState.learned||[]).includes(romaji);
  const next=()=>kanaByIndex(kanaIndexOf(romaji)+1);
  const prev=()=>kanaByIndex(kanaIndexOf(romaji)-1);
  openModal(`<div class="kana-detail-shell"><span class="eyebrow">KANA DETAIL</span><h2 id="modalTitle" class="kana-big">${esc(item.hiragana)} <span class="subtle">/</span> ${esc(item.katakana)} <button class="speak-btn inline-speak" data-speak="${esc(item.hiragana)}" aria-label="Listen to kana">🔊</button></h2><div class="reading">${esc(item.romaji)}</div><div class="settings-actions"><button class="tool-btn" data-kana-nav="prev">← Previous</button><button class="tool-btn" data-kana-nav="next">Next →</button><button class="tool-btn" data-kana-mark="${learned?'unlearn':'learn'}">${learned?'✓ Learned':'Mark as learned'}</button></div><div class="detail-grid"><div><div class="detail-section"><h3>Sounds</h3><div class="formula">Hiragana ${esc(item.hiragana)} · Katakana ${esc(item.katakana)} · Romaji ${esc(item.romaji)}</div></div><div class="detail-section"><h3>Examples</h3>${kanaExamplesHtml(item)}</div></div><div><div class="detail-section"><h3>Practice</h3><p class="subtle">Use the practice buttons on the Kana page for flash, quiz, typing, and review mode.</p></div><div class="detail-section"><h3>Learned state</h3><p>${learned?'This kana is marked as learned.':'This kana is not marked as learned yet.'}</p></div></div></div><div class="card-bottom"><span class="subtle">Swipe left or right on mobile. Use arrow keys on desktop.</span><span></span></div></div>`);
  window.__kanaNav={prev,next};
}
let kanaPracticeState=null;
function kanaPracticePool(){
  const set=kanaState.set||'basic';
  const seq=kanaSequence();
  if(set==='basic')return seq.filter(x=>x.group==='basic');
  if(set==='dakuten')return seq.filter(x=>x.group==='dakuten'||x.group==='handakuten');
  return seq.filter(x=>x.group==='combo');
}
function kanaPracticeRestart(mode){
  const pool=kanaPracticePool();
  kanaPracticeState={mode,pool,index:0,score:0,mistakes:[],flipped:false,typed:''};
  renderKanaPractice();
}
function kanaPracticeAnswer(item){
  const pool=kanaPracticeState.pool;
  kanaPracticeState.index+=1;
  if(kanaPracticeState.index>=Math.min(pool.length,20)){
    kanaPracticeState.finished=true;
  }
  save();
  renderKanaPractice();
}
function kanaPracticeRenderOptions(item){
  const pool=kanaPracticePool().filter(x=>x.romaji!==item.romaji).sort(()=>Math.random()-.5).slice(0,3);
  const opts=[item,...pool].sort(()=>Math.random()-.5);
  return opts.map(o=>`<button class="quiz-option" data-kana-answer="${esc(o.romaji)}">${kanaPracticeState.mode==='romaji'?esc(o.hiragana):esc(o.romaji)}</button>`).join('');
}
function renderKanaPractice(){
  if(!kanaPracticeState){$('#modalContent').innerHTML='<div class="empty-panel">No practice mode selected.</div>';return;}
  const current=kanaPracticeState.pool[kanaPracticeState.index%kanaPracticeState.pool.length];
  if(!current){$('#modalContent').innerHTML='<div class="empty-panel">No kana available for practice.</div>';return;}
  const title={flash:'Flash',quiz:'Quiz',type:'Type the romaji',review:'Review mistakes'}[kanaPracticeState.mode]||'Practice';
  if(kanaPracticeState.mode==='flash'){
    $('#modalContent').innerHTML=`<div class="flash-wrap"><span class="eyebrow">KANA PRACTICE</span><h2 id="modalTitle">${title}</h2><div class="flash-card ${kanaPracticeState.flipped?'flipped':''}" id="kanaFlashCard"><div class="flash-front"><div class="kana-big">${esc(current.hiragana)}</div><div class="subtle">Tap to reveal the romaji</div></div><div class="flash-back"><strong>${esc(current.romaji)}</strong><div class="subtle">${esc(current.katakana)}</div></div></div><div class="flash-actions"><button class="tool-btn" data-kana-flip="1">Reveal / hide</button><button class="read-btn" data-kana-next="1">Next</button></div></div>`;
  }else if(kanaPracticeState.mode==='quiz'){
    $('#modalContent').innerHTML=`<div class="flash-wrap"><span class="eyebrow">KANA PRACTICE</span><h2 id="modalTitle">${title}</h2><div class="quiz-progress">Question ${kanaPracticeState.index+1} / ${Math.min(kanaPracticeState.pool.length,20)}</div><div class="quiz-question">What is the romaji for <b>${esc(current.hiragana)}</b>?</div><div class="quiz-options">${kanaPracticeRenderOptions(current)}</div></div>`;
  }else if(kanaPracticeState.mode==='type'){
    $('#modalContent').innerHTML=`<div class="flash-wrap"><span class="eyebrow">KANA PRACTICE</span><h2 id="modalTitle">${title}</h2><div class="quiz-question">Type the romaji for <b>${esc(current.hiragana)}</b></div><div class="settings-actions"><input id="kanaTypeInput" type="text" autocomplete="off" placeholder="romaji" style="min-width:180px;flex:1"><button class="primary" data-kana-check="1">Check</button></div><p id="kanaTypeFeedback" class="subtle" aria-live="polite"></p><div class="flash-actions"><button class="read-btn" data-kana-next="1">Skip</button></div></div>`;
  }else{
    const mistakes=(kanaState.mistakes||[]).slice(-12);
    $('#modalContent').innerHTML=`<div class="flash-wrap"><span class="eyebrow">KANA PRACTICE</span><h2 id="modalTitle">Review mistakes</h2><div class="empty-panel">${mistakes.length?mistakes.map(x=>`<div><b>${esc(x.hiragana)}</b> → ${esc(x.romaji)}</div>`).join(''):'No mistakes yet. Keep going.'}</div><div class="flash-actions"><button class="primary" data-kana-practice-start="flash">Flash again</button><button class="tool-btn" data-kana-practice-start="quiz">Quiz again</button></div></div>`;
  }
}
function exportKanaChart(){
  const blob=new Blob([JSON.stringify(kanaSource,null,2)],{type:'application/json'});
  const url=URL.createObjectURL(blob);
  const a=document.createElement('a');
  a.href=url;
  a.download='kana-chart.json';
  a.click();
  setTimeout(()=>URL.revokeObjectURL(url),0);
}
function openKanaPractice(mode){
  if(mode==='export'){exportKanaChart();return;}
  kanaPracticeRestart(mode);
  openModal('<h2 id="modalTitle">Kana practice</h2>');
  renderKanaPractice();
}
function syncKanaControls(){
  document.querySelectorAll('[data-kana-view]').forEach(btn=>btn.classList.toggle('active',btn.dataset.kanaView===kanaView));
  document.querySelectorAll('[data-kana-set]').forEach(btn=>btn.classList.toggle('active',btn.dataset.kanaSet===kanaSet));
}

function vocabDetail(x){
  const scope = x.level === 'N5' ? 'N5' : 'N4';
  const ex = eligibleExamples(x, scope);
  const posArray = Array.isArray(x.pos) && x.pos.length ? x.pos : [posLabel(x.pos)];
  const posTags = posArray.map(p => `<span class="vocab-pos-chip">${esc(p)}</span>`).join(' ');
  const formsTags = (x.forms || []).map(f => `<span class="vocab-forms-chip">${esc(f)}</span>`).join(' ');

  return `
    <span class="eyebrow">VOCABULARY</span>
    <h2 class="ruby-word vocab-modal-title" style="font-size:28px;margin-bottom:4px;">
      ${renderSentenceFurigana(x.furigana || x.word)}
      <button class="speak-btn inline-speak" data-speak="${esc(x.word)}" aria-label="Listen to Japanese word" title="Listen">🔊</button>
    </h2>
    <div class="reading">${x.reading ? esc(x.reading) : ''}</div>

    <div class="vocab-meta-row">
      <span class="vocab-level-chip">${esc(x.level || 'N5')}</span>
      ${posTags}
      ${formsTags}
      <span class="subtle" style="margin-left:auto;font-size:12px;">Scope: ${scope === 'N5' ? 'N5 Core' : 'N5 + N4'}</span>
    </div>

    <div class="detail-section">
      <h3>English Meanings</h3>
      <div style="font-size:15px;color:var(--ink);font-weight:600;line-height:1.5;">${(x.meanings || []).map(esc).join(' · ') || '—'}</div>
    </div>

    <div class="detail-section" style="margin-top:16px;">
      <h3>Example Sentences</h3>
      <div class="grammar-examples-grid">
        ${ex.length ? ex.map((e, i) => `
          <div class="grammar-example-card">
            <span class="ex-num-badge">Example ${i + 1} · ${esc(e.sourceLevel || scope)}</span>
            <div class="example-ja">${renderSentenceFurigana(e.segments || e.furigana || e.ja)}</div>
            <div class="example-en">${esc(e.en || e.translation || '')}</div>
            <button class="detail-link speak-btn inline-speak" data-speak="${esc(e.ja || '')}" aria-label="Listen to Japanese example" title="Listen" style="align-self:flex-start;margin-top:4px;">🔊 Listen</button>
          </div>
        `).join('') : '<div class="subtle">No example sentence is available in the current source.</div>'}
      </div>
    </div>

    <div class="card-bottom" style="margin-top:20px;">
      <span class="subtle">Progress is saved on this device</span>
      <button class="read-btn ${isRead('v', x.id) ? 'read' : ''}" data-modal-action="read-vocab" data-id="${esc(x.id)}">${isRead('v', x.id) ? '✓ Read' : '○ Mark as read'}</button>
    </div>
  `;
}
function exampleHtml(e,i,scope,x){const translation=e.translation||e.en||exampleTranslation(e.ja)||'';return `<div class="example-box"><span class="difficulty">${difficulty(e,i)} · ${esc(e.sourceLevel||scope)}</span><div class="example-ja">${renderSentenceFurigana(e.furigana||e.ja||'')}</div><div class="example-en">${esc(translation)}</div><button class="detail-link speak-btn" data-speak="${esc(e.ja||'')}" aria-label="Listen to Japanese example" title="Listen to Japanese example">🔊</button></div>`}
function openVocab(id){
  const x=vocab.find(v=>v.id===id);if(!x)return;
  const card=document.getElementById('modalCard');
  if(card)card.classList.remove('modal-large');
  openModal(vocabDetail(x));
  const tEl=document.getElementById('modalTitle');
  if(tEl)tEl.textContent=x.word;
}

function grammarQuickCheck(x){
  const correct=String(x.meaning||'').trim();
  if(!correct)return '<div class="quick-check"><h3>Quick check</h3><p>This source does not provide a meaning for a quiz question.</p></div>';
  const distractors=[...new Set(grammar.filter(g=>g.id!==x.id&&g.meaning&&g.meaning.trim()!==correct).map(g=>g.meaning.trim()))].sort(()=>Math.random()-.5).slice(0,3);
  const options=[...new Set([correct,...distractors])].sort(()=>Math.random()-.5);
  return `<div class="quick-check"><span class="eyebrow">CHECK YOUR UNDERSTANDING</span><h3>What does this pattern mean?</h3><div class="grammar-check-options">${options.map(o=>`<button type="button" class="grammar-check-option" data-grammar-check="${o===correct?'correct':'wrong'}">${esc(o)}</button>`).join('')}</div><p id="grammarCheckFeedback" class="grammar-check-feedback" aria-live="polite">Choose an answer to check yourself.</p></div>`;
}
function openGrammar(id){
  const x=grammar.find(g=>g.id===id);if(!x)return;
  const ex=(x.examples||[]).slice(0,4);
  const isBook=Boolean(x.isBookPattern);
  const bookInfo=isBook?`<span class="book-ref-badge">第${x.lesson}話 · 文型${x.patternNo} · Book p.${x.bookRef?.page||''}</span>`:'';
  const isComparing=compareIds.includes(x.id);

  let prevId=null,nextId=null;
  if(isBook&&x.lesson){
    const lessonPatterns=grammar.filter(g=>g.lesson===x.lesson);
    const currIdx=lessonPatterns.findIndex(g=>g.id===x.id);
    if(currIdx>0)prevId=lessonPatterns[currIdx-1].id;
    if(currIdx>=0&&currIdx<lessonPatterns.length-1)nextId=lessonPatterns[currIdx+1].id;
  }

  const cautionsHtml=x.cautions?`<div class="grammar-cautions-box"><h4>⚠️ Caution / Don't use when…</h4><p>${esc(x.cautions)}</p></div>`:'';
  const contrastHtml=(x.contrastWith||[]).length?`<div class="detail-section" style="margin-top:16px;"><h3>Compare with similar patterns</h3><div class="contrast-chips-wrap">${x.contrastWith.map(cw=>{const match=grammar.find(g=>g.pattern===cw||g.pattern.replace(/^[～~]/,'')===cw.replace(/^[～~]/,''));const targetId=match?match.id:'';return `<button type="button" class="contrast-chip" data-contrast-target="${esc(cw)}" data-target-id="${esc(targetId)}">${esc(cw)} ↗ Compare</button>`;}).join('')}</div></div>`:'';
  const practiceHtml=`<div class="detail-section" style="text-align:center;margin:20px 0;"><button type="button" class="practice-pattern-btn" data-action="practice-pattern" data-id="${esc(x.id)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><path d="m4.93 4.93 4.24 4.24M14.83 14.83l4.24 4.24M14.83 9.17l4.24-4.24M4.93 19.07l4.24-4.24"/><circle cx="12" cy="12" r="4"/></svg> Practice this pattern</button></div>`;

  const summaryText=x.summary||x.meaning||'Core Japanese grammar pattern.';

  const examplesHtml=ex.length?`<div class="detail-section" style="margin-top:16px;"><h3>Examples — read, listen, understand</h3><div class="grammar-examples-grid">${ex.map((e,i)=>`<div class="grammar-example-card"><span class="ex-num-badge">Example ${i+1}</span><div class="example-ja">${renderSentenceFurigana(e.segments||e.furigana||e.ja)}</div><div class="example-en">${esc(e.translation||e.en||'')}</div><button class="detail-link speak-btn inline-speak" data-speak="${esc(e.ja||'')}" aria-label="Listen to Japanese example" title="Listen" style="align-self:flex-start;margin-top:4px;">🔊 Listen</button></div>`).join('')}</div></div>`:'<div class="subtle">No examples supplied by this source.</div>';

  const modalHtml=`
    <div class="modal-header-left" style="margin-bottom:12px;">
      <span class="eyebrow" style="margin:0;">GRAMMAR · ${esc(x.level)}</span>
      ${bookInfo}
      <button type="button" class="tool-btn compare-toggle-btn ${isComparing?'active':''}" data-action="toggle-compare" data-id="${esc(x.id)}" style="font-size:12px;padding:3px 9px;">
        ${isComparing?'✓ In Compare Tray':'⚖️ Add to Compare'}
      </button>
    </div>

    <h2 class="ruby-word grammar-modal-title" style="font-size:30px;margin-bottom:8px;">
      ${renderTextWithRuby(x.pattern)}
      <button class="speak-btn inline-speak" data-speak="${esc(x.pattern)}" aria-label="Listen to grammar pattern" title="Listen">🔊</button>
    </h2>

    <div class="grammar-summary-bar">${esc(summaryText)}</div>

    <div class="grammar-trio-grid">
      <div class="grammar-trio-card">
        <span class="trio-step-num">1</span>
        <h3>Meaning & Usage</h3>
        <p>${esc(x.meaning||'Meaning not supplied.')}</p>
        ${x.notes?`<p class="subtle" style="margin-top:6px;font-size:12px;">${esc(x.notes)}</p>`:''}
      </div>

      <div class="grammar-trio-card">
        <span class="trio-step-num">2</span>
        <h3>Build the Sentence</h3>
        <p class="subtle" style="font-size:12px;margin-bottom:6px;">Standard conjugation formula:</p>
        <div class="formula">${esc(x.formation||'Formation not supplied.')}</div>
      </div>

      <div class="grammar-trio-card">
        <span class="trio-step-num">3</span>
        <h3>Key Signals & Collocations</h3>
        <p style="font-size:13px;line-height:1.45;">Notice the words immediately before and after the pattern. Repeat the Japanese aloud, then substitute one word.</p>
        <div style="margin-top:8px;display:flex;flex-wrap:wrap;gap:4px;">
          ${(x.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join('')}
        </div>
      </div>
    </div>

    ${cautionsHtml}
    ${examplesHtml}
    ${contrastHtml}
    ${practiceHtml}
    ${grammarQuickCheck(x)}

    <div class="grammar-nav-row">
      <button type="button" class="grammar-nav-btn" data-nav-id="${esc(prevId||'')}" ${prevId?'':'disabled'}>
        ← Prev (${prevId?'Lesson pattern':'None'})
      </button>
      <span class="grammar-keyboard-hint">Use ← and → arrow keys to navigate</span>
      <button type="button" class="grammar-nav-btn" data-nav-id="${esc(nextId||'')}" ${nextId?'':'disabled'}>
        Next (${nextId?'Lesson pattern':'None'}) →
      </button>
    </div>

    <div class="card-bottom" style="margin-top:16px;">
      <span class="subtle">Progress is saved on this device</span>
      <button class="read-btn ${isRead('g',x.id)?'read':''}" data-modal-action="read-grammar" data-id="${esc(x.id)}">
        ${isRead('g',x.id)?'✓ Read':'○ Mark as read'}
      </button>
    </div>
  `;

  const card = document.getElementById('modalCard');
  if (card) card.classList.add('modal-large');

  openModal(modalHtml);
  const tEl = document.getElementById('modalTitle');
  if (tEl) tEl.textContent = x.pattern;

  window.__activeGrammarNav = { prevId, nextId };
}

function openKanji(id){const x=kanji.find(k=>k.id===id);if(!x)return;const reading=kanjiReading(x);const related=relatedVocabForKanji(x);const words=related.length?related:(x.words||[]).map(w=>({word:w,reading:'',meanings:[]}));const wordHtml=words.slice(0,12).map(v=>`<div class="kanji-vocab-row"><div><b>${renderRuby(v.word,v.reading)}</b> <span class="reading">${esc(v.reading||'')}</span></div><div class="subtle">${esc((v.meanings||[]).join(' · ')||'Meaning not available in supplied vocabulary data')}</div><button class="speak-btn" data-speak="${esc(v.word)}">🔊</button></div>`).join('');openModal(`<span class="eyebrow">KANJI · ${esc(x.level||'Flashcard')}</span><h2 id="modalTitle" class="ruby-word">${reading?renderRuby(x.character,reading):esc(x.character)} <button class="speak-btn inline-speak" data-speak="${esc((x.character||'')+' '+reading)}" aria-label="Listen to kanji reading">🔊</button></h2><div class="reading">${reading?'Hiragana: '+esc(reading):'Reading not available in this source'}</div><div class="detail-grid"><div><div class="detail-section"><h3>English meanings</h3><div>${esc(kanjiMeaning(x))}</div></div><div class="detail-section"><h3>Tamil meaning</h3><div id="kTamil" class="tamil-box">Loading…</div></div><div class="detail-section"><h3>On’yomi</h3><div>${esc((x.onyomi||[]).join(' · ')||'—')}</div></div></div><div><div class="detail-section"><h3>Kun’yomi</h3><div>${esc((x.kunyomi||[]).join(' · ')||'—')}</div></div><div class="detail-section"><h3>Kanji data</h3><div>${x.strokes?esc(x.strokes)+' strokes · ':''}${x.grade?'Grade '+esc(x.grade)+' · ':''}${x.radical?'Radical '+esc(x.radical):''}</div></div><div class="detail-section"><h3>Useful vocabulary</h3>${wordHtml||'<div class="subtle">No matching vocabulary is available in the loaded sources.</div>'}</div></div></div><div class="card-bottom"><span></span><button class="read-btn ${isRead('k',x.id)?'read':''}" data-modal-action="read-kanji" data-id="${esc(x.id)}">${isRead('k',x.id)?'✓ Read':'○ Mark as read'}</button></div>`);loadTamilKanji(kanjiMeaning(x))}
async function loadTamilKanji(text){const el=$('#kTamil');if(!el)return;try{const u='https://translate.googleapis.com/translate_a/single?client=gtx&sl=en&tl=ta&dt=t&q='+encodeURIComponent(text);const r=await fetch(u);if(!r.ok)throw 0;const d=await r.json();const t=(d[0]||[]).map(a=>a[0]||'').join('').trim();el.textContent=t||'—';}catch{el.textContent='Tamil meaning unavailable offline.'}}

let speechRequest=0;
let speechTimer=0;
function clearSpeechButtons(){document.querySelectorAll('.speak-btn.speaking').forEach(b=>b.classList.remove('speaking'));}
function pickJapaneseVoice(){const voices=window.speechSynthesis?.getVoices?.()||[];return voices.find(v=>/^ja(?:-|_)/i.test(v.lang))||voices.find(v=>/japanese|日本語/i.test(v.name))||null;}
function speakJapanese(text){
  const synth=window.speechSynthesis;
  const clean=String(text||'').replace(/\s+/g,' ').trim();
  if(!synth||typeof SpeechSynthesisUtterance==='undefined'||!clean)return false;
  const request=++speechRequest;
  window.clearTimeout(speechTimer);
  synth.cancel();
  clearSpeechButtons();
  const speak=()=>{
    if(request!==speechRequest)return;
    const u=new SpeechSynthesisUtterance(clean);
    u.lang='ja-JP';u.rate=.88;u.pitch=1;u.volume=1;
    const ja=pickJapaneseVoice();
    if(ja)u.voice=ja;
    const buttons=[...document.querySelectorAll('.speak-btn')].filter(b=>b.dataset.speak===clean);
    const clear=()=>buttons.forEach(b=>b.classList.remove('speaking'));
    u.onstart=()=>buttons.forEach(b=>b.classList.add('speaking'));
    u.onend=clear;
    u.onerror=clear;
    try{synth.resume();synth.speak(u);}catch{clear();}
  };
  speechTimer=window.setTimeout(speak,80);
  return true;
}

let modalHistoryArmed=false;
function modalFocusableElements(){return [...$('#modal')?.querySelectorAll('button,[href],input,select,textarea,[tabindex]:not([tabindex="-1"])')||[]].filter(el=>!el.disabled&&el.offsetParent!==null)}
function openModal(html){
  const modal=$('#modal');
  const card=$('#modalCard');
  if(!modal||!card)return;
  modalReturnFocus=document.activeElement instanceof HTMLElement?document.activeElement:null;
  $('#modalContent').innerHTML=html;
  modal.hidden=false;
  document.body.classList.add('modal-open');
  if(!modalHistoryArmed){try{history.pushState({modal:'open'},'');}catch{}modalHistoryArmed=true;}
  requestAnimationFrame(()=>card.focus());
}
function closeModal(options={}){
  const modal=$('#modal');
  if(!modal||modal.hidden)return;
  modal.hidden=true;
  document.body.classList.remove('modal-open');
  const card=document.getElementById('modalCard');
  if(card)card.classList.remove('modal-large');
  window.__activeGrammarNav=null;
  if(modalHistoryArmed&&!options.fromPopState){
    modalHistoryArmed=false;
    try{history.back();}catch{}
  }else{
    modalHistoryArmed=false;
  }
  if(lastPage){
    try{history.replaceState(null,'','#'+lastPage);}catch{}
  }
  if(modalReturnFocus&&typeof modalReturnFocus.focus==='function'){
    try{modalReturnFocus.focus();}catch{}
  }
}
function toggleRead(t,id){const k=markKey(t,id);readSet.has(k)?readSet.delete(k):readSet.add(k);touchStudy();renderAll();}
function toggleKnown(t,id){const k=markKey(t,id);knownSet.has(k)?knownSet.delete(k):knownSet.add(k);touchStudy();renderAll();}

function showToast(msg){
  let toast=document.getElementById('appToast');
  if(!toast){
    toast=document.createElement('div');
    toast.id='appToast';
    toast.style.cssText='position:fixed;bottom:24px;left:50%;transform:translateX(-50%);z-index:var(--z-toast,80);background:var(--paper-elev);border:1px solid var(--line);border-radius:var(--radius-full);padding:10px 20px;box-shadow:var(--shadow-lg);font-size:13px;font-weight:600;color:var(--ink);transition:opacity 200ms ease;pointer-events:none;';
    document.body.appendChild(toast);
  }
  toast.textContent=msg;
  toast.style.opacity='1';
  clearTimeout(toast.__timer);
  toast.__timer=setTimeout(()=>{toast.style.opacity='0';},2400);
}

function syncCompareTray(){
  try{
    sessionStorage.setItem('jlpt-compare-ids',JSON.stringify(compareIds));
  }catch(e){}

  const tray=document.getElementById('compareTray');
  const countEl=document.getElementById('compareTrayCount');
  const chipsContainer=document.getElementById('compareTrayChips');
  const navBadge=document.getElementById('navCompareBadge');

  const count=compareIds.length;
  if(countEl)countEl.textContent=count;

  if(navBadge){
    if(count>0){
      navBadge.style.display='inline-flex';
      navBadge.textContent=count;
    }else{
      navBadge.style.display='none';
    }
  }

  if(tray){
    if(count===0){
      tray.hidden=true;
      if(chipsContainer)chipsContainer.innerHTML='';
    }else{
      tray.hidden=false;
      if(chipsContainer){
        chipsContainer.innerHTML=compareIds.map(id=>{
          const item=grammar.find(g=>g.id===id);
          const name=item?item.pattern:id;
          return `
            <span class="compare-tray-chip">
              <span>${esc(name)}</span>
              <button type="button" data-tray-remove="${esc(id)}" aria-label="Remove ${esc(name)}">×</button>
            </span>
          `;
        }).join('');

        chipsContainer.querySelectorAll('[data-tray-remove]').forEach(btn=>{
          btn.onclick=(e)=>{
            e.stopPropagation();
            toggleCompare(btn.dataset.trayRemove);
          };
        });
      }
    }
  }

  document.querySelectorAll('[data-action="toggle-compare"]').forEach(btn=>{
    const id=btn.dataset.id;
    const isComp=compareIds.includes(id);
    btn.classList.toggle('active',isComp);
    if(btn.classList.contains('compare-toggle-btn')){
      btn.textContent=isComp?'✓ In Compare':'⚖️ Compare';
    }else{
      btn.textContent=isComp?'✓ In Compare Tray':'⚖️ Add to Compare';
    }
  });
}

function clearCompareTray(){
  compareIds=[];
  syncCompareTray();
  if($('#compare')?.classList.contains('active')){
    fillCompare();
  }
}

function toggleCompare(id){
  if(!id)return;
  const idx=compareIds.indexOf(id);
  if(idx>=0){
    compareIds.splice(idx,1);
  }else{
    if(compareIds.length>=6){
      showToast('Maximum 6 grammar points can be compared at once.');
      return;
    }
    compareIds.push(id);
  }
  syncCompareTray();
  if($('#compare')?.classList.contains('active')){
    fillCompare();
  }
}

function selectComparisonGroup(groupKey){
  if(!window.comparisonsData)return;
  const group=(window.comparisonsData||[]).find(g=>g.id===groupKey);
  if(group&&group.patternIds){
    compareIds=[...group.patternIds];
    syncCompareTray();
    showPage('compare');
    renderComparisonGroup(group);
  }
}
window.selectComparisonGroup=selectComparisonGroup;

function renderComparisonGroup(group){
  const diffBox=document.getElementById('compareKeyDiff');
  const result=document.getElementById('compareResult');
  const quizBox=document.getElementById('compareQuizBox');
  const diffToggleLabel=document.getElementById('diffToggleLabel');

  if(diffToggleLabel)diffToggleLabel.style.display='inline-flex';

  if(diffBox){
    diffBox.style.display='block';
    diffBox.innerHTML=`
      <div style="font-weight:700;color:var(--vermilion);margin-bottom:4px;letter-spacing:0.02em;">KEY DIFFERENCE · ${esc(group.title)}</div>
      <p style="margin:0;font-size:14px;color:var(--ink);">${esc(group.keyDifference)}</p>
    `;
  }

  const columns=group.patterns||[];
  const rows=group.rows||[];

  const tableHtml=`
    <div class="compare-table-wrap" id="compareTableWrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Contrast Dimension</th>
            ${columns.map((p,i)=>{
              const pid=group.patternIds?.[i];
              return `
                <th>
                  <div style="font-size:16px;font-family:var(--font-display-jp);color:var(--vermilion);">${esc(p)}</div>
                  ${pid?`<button type="button" class="tool-btn" style="font-size:11px;padding:2px 8px;margin-top:4px;" onclick="openGrammar('${esc(pid)}')">Details →</button>`:''}
                </th>
              `;
            }).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r=>{
            const cells=r.cells||[];
            const isSame=cells.length>1&&cells.every(c=>c.trim().toLowerCase()===cells[0].trim().toLowerCase());
            return `
              <tr class="${isSame?'is-same':''}">
                <th>${esc(r.label)}</th>
                ${cells.map(c=>`
                  <td>
                    ${renderSentenceFurigana(c)}
                  </td>
                `).join('')}
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;

  if(result){
    result.className='compare-result';
    result.innerHTML=tableHtml;
  }

  const drills=group.quizItems||group.drills||(group.quiz?[group.quiz]:[]);
  if(quizBox&&drills.length){
    const d=drills[0];
    quizBox.style.display='block';
    quizBox.innerHTML=`
      <span class="eyebrow">CONTRAST DRILL · TEST YOUR RECALL</span>
      <h3 style="margin:8px 0;">${esc(d.question)}</h3>
      <div class="grammar-check-options" id="compareDrillOptions">
        ${d.options.map(opt=>`<button type="button" class="grammar-check-option" data-ans="${esc(opt)}">${esc(opt)}</button>`).join('')}
      </div>
      <p id="compareDrillFeedback" class="grammar-check-feedback" aria-live="polite">Select the right pattern based on nuance and context restrictions.</p>
    `;
    const opts=quizBox.querySelectorAll('#compareDrillOptions [data-ans]');
    const fb=document.getElementById('compareDrillFeedback');
    opts.forEach(btn=>{
      btn.onclick=()=>{
        opts.forEach(b=>b.disabled=true);
        if(btn.dataset.ans===d.correct){
          btn.classList.add('is-correct');
          if(fb)fb.textContent=`✓ Correct! ${d.explanation}`;
        }else{
          btn.classList.add('is-wrong');
          if(fb)fb.textContent=`× Incorrect. The correct choice is "${d.correct}". ${d.explanation}`;
        }
      };
    });
  }else if(quizBox){
    quizBox.style.display='none';
  }
}

function fillCompare(){
  const opts=grammar.map(x=>`<option value="${esc(x.id)}">${esc(x.level)} · ${esc(x.pattern)} — ${esc(x.meaning||'')}</option>`).join('');
  const selectorsContainer=$('#compareSelectors');
  if(selectorsContainer){
    selectorsContainer.innerHTML=compareIds.map((id,i)=>`
      <div class="selector-box">
        <label>Grammar point ${i+1}</label>
        <select data-compare="${i}">
          <option value="">Select a grammar point</option>
          ${opts}
        </select>
        ${compareIds.length>2?`<button class="remove-selector" data-remove-compare="${i}">Remove</button>`:''}
      </div>
    `).join('');
    compareIds.forEach((id,i)=>{
      const s=$(`[data-compare="${i}"]`);
      if(s)s.value=id;
    });
  }
  if(typeof initCustomSelects==='function')initCustomSelects();
  renderCompare();
}

function renderCompare(){
  const diffBox=document.getElementById('compareKeyDiff');
  const quizBox=document.getElementById('compareQuizBox');
  const diffToggleLabel=document.getElementById('diffToggleLabel');

  if(window.comparisonsData&&window.comparisonsData.length){
    const matchedGroup=window.comparisonsData.find(g=>{
      if(!g.patternIds||g.patternIds.length!==compareIds.length)return false;
      return g.patternIds.every(id=>compareIds.includes(id));
    });
    if(matchedGroup){
      renderComparisonGroup(matchedGroup);
      return;
    }
  }

  const xs=compareIds.map(id=>grammar.find(g=>g.id===id)).filter(Boolean);
  if(xs.length<2){
    if(diffBox)diffBox.style.display='none';
    if(quizBox)quizBox.style.display='none';
    if(diffToggleLabel)diffToggleLabel.style.display='none';
    $('#compareResult').className='compare-result empty-panel';
    $('#compareResult').innerHTML='<div class="empty-panel">Select at least 2 grammar points to compare.</div>';
    return;
  }

  if(diffToggleLabel)diffToggleLabel.style.display='inline-flex';
  if(diffBox)diffBox.style.display='none';
  if(quizBox)quizBox.style.display='none';

  const rows=[
    ['Level',...xs.map(x=>x.level)],
    ['Pattern',...xs.map(x=>x.pattern)],
    ['English meaning',...xs.map(x=>x.meaning||'—')],
    ['Formation',...xs.map(x=>x.formation||'—')],
    ['Tags',...xs.map(x=>(x.tags||[]).join(', ')||'—')],
    ['Caution / Note',...xs.map(x=>x.cautions||x.notes||'—')],
    ['Example Sentence',...xs.map(x=>(x.examples?.[0]?.ja||'')+(x.examples?.[0]?.en?' — '+x.examples[0].en:''))]
  ];

  $('#compareResult').className='compare-result';
  $('#compareResult').innerHTML=`
    <div class="compare-table-wrap" id="compareTableWrap">
      <table class="compare-table">
        <thead>
          <tr>
            <th>Feature</th>
            ${xs.map(x=>`
              <th>
                <div style="font-size:16px;font-family:var(--font-display-jp);color:var(--vermilion);">${esc(x.pattern)}</div>
                <button type="button" class="tool-btn" style="font-size:11px;padding:2px 8px;margin-top:4px;" onclick="openGrammar('${esc(x.id)}')">Details →</button>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          ${rows.map(r=>{
            const vals=r.slice(1);
            const isSame=vals.length>1&&vals.every(v=>v===vals[0]);
            return `
              <tr class="${isSame?'is-same':''}">
                <th>${esc(r[0])}</th>
                ${vals.map(c=>`<td>${renderSentenceFurigana(c)}</td>`).join('')}
              </tr>
            `;
          }).join('')}
        </tbody>
      </table>
    </div>
  `;
}

function openFlash(type){
  const pool=type==='vocab'?vocab.filter(x=>x.level==='N5'||x.level==='N4'):kanji.filter(x=>x.level==='N5'||x.level==='N4'||x.flash);
  if(!pool.length){openModal('<h2 id="modalTitle">Flashcards unavailable</h2><p>No data is loaded for this section.</p>');return;}
  let index=0,current=pool[Math.floor(Math.random()*pool.length)];
  const render=()=>{
    const front=type==='vocab'?`${renderSentenceFurigana(current.furigana||buildFuriganaForWord(current.word,current.reading))}<button class="speak-btn" data-speak="${esc(current.word||'')}" aria-label="Listen to Japanese word">🔊</button>`:`${current.character&&kanjiReading(current)?renderRuby(current.character,kanjiReading(current)):esc(current.character||'')}<button class="speak-btn" data-speak="${esc(kanjiReading(current)||current.character||'')}" aria-label="Listen to kanji reading">🔊</button>`;
    const back=type==='vocab'?`<strong>${esc(current.meanings?.join(' · ')||'—')}</strong><div class="reading">${esc(current.reading||'')}</div>`:`<strong>${esc(kanjiMeaning(current))}</strong><div class="reading">${esc((current.onyomi||[]).join(' · '))} ${(current.kunyomi||[]).join(' · ')}</div><div class="flash-related">${relatedVocabForKanji(current).slice(0,5).map(v=>`<div><b>${esc(v.word)}</b> ${esc(v.reading||'')} — ${esc((v.meanings||[])[0]||'')} <button class="speak-btn inline-speak" data-speak="${esc(v.word)}" aria-label="Listen to Japanese word">🔊</button></div>`).join('')}</div>`;
    $('#modalContent').innerHTML=`<div class="flash-wrap"><span class="eyebrow">FLASHCARD · ${index+1}/${Math.min(pool.length,100)}</span><div class="flash-card" id="flashCard" data-type="${type}"><div class="flash-front">${front}</div><div class="flash-back">${back}</div></div><div class="flash-actions"><button class="read-btn" data-flash="still">× Still learning</button><button class="read-btn read" data-flash="know">✓ Know it</button></div><p class="subtle" style="text-align:center">Tap the card to flip. Swipe left/right on mobile.</p></div>`;
  };
  window.__flashNext=()=>{index=(index+1)%Math.min(pool.length,100);current=pool[Math.floor(Math.random()*pool.length)];render();};
  openModal('<h2 id="modalTitle">Flashcards</h2>');
  render();
}
function quizConfig(){
  const topic=$('#quizTopic')?.value||'mixed';
  const level=$('#quizLevel')?.value||'ALL';
  const count=Math.max(5,Number($('#quizCount')?.value||10));
  return {topic,level,count};
}
function quizLevelMatch(x,level){if(level==='ALL')return true;if(level==='N5N4')return ['N5','N4'].includes(x.level);return x.level===level;}
function startQuiz(){
  const cfg=quizConfig();
  const vocabPool=vocab.filter(x=>quizLevelMatch(x,cfg.level));
  const kanjiPool=kanji.filter(x=>quizLevelMatch(x,cfg.level));
  const grammarPool=grammar.filter(x=>quizLevelMatch(x,cfg.level));
  let pool=[];
  const includeTopic=t=>cfg.topic==='mixed'||cfg.topic===t;
  if(includeTopic('vocab'))pool.push(...vocabPool.map(x=>({type:'vocab',x})));
  if(includeTopic('kanji'))pool.push(...kanjiPool.map(x=>({type:'kanji',x})));
  if(includeTopic('grammar'))pool.push(...grammarPool.map(x=>({type:'grammar',x})));
  if(!pool.length){$('#quizBox').innerHTML='<div class="error-box">Not enough quiz data loaded.</div>';return;}
  pool.sort(()=>Math.random()-.5);
  quizPeek=false;
  quizState={items:pool.slice(0,cfg.count),i:0,score:0,mistakes:[],cfg};
  renderQuizQuestion();
}
function grammarPrompt(x){
  const fill=String(x.formation||x.pattern||x.meaning||'').split(' ');
  const snippet=fill.length>2?fill.slice(0,2).join(' ')+' ___':(x.formation||x.pattern||'');
  return {question:`Complete the pattern: ${snippet}`,correct:x.pattern||x.meaning||'',answer:x.pattern||x.meaning||''};
}
function renderQuizQuestion(){
  const q=quizState.items[quizState.i];
  let correct='';
  let prompt='';
  if(q.type==='vocab'){
    correct=(q.x.meanings||[])[0]||'';
    const shown=quizHideFurigana&&!quizPeek?esc(q.x.word):renderSentenceFurigana(q.x.furigana||buildFuriganaForWord(q.x.word,q.x.reading));
    prompt=`<span data-quiz-peek="1">${shown}</span>`;
  }else if(q.type==='kanji'){
    correct=((q.x.kunyomi||[])[0]||(q.x.onyomi||[])[0]||'');
    const shown=quizHideFurigana&&!quizPeek?esc(q.x.character):renderRuby(q.x.character,kanjiReading(q.x));
    prompt=`What is the reading of <b data-quiz-peek="1">${shown}</b>?`;
  }else{
    const g=grammarPrompt(q.x);
    correct=g.correct;
    prompt=quizHideFurigana&&!quizPeek?`Complete the pattern: ${esc(String(q.x.pattern||g.correct||''))}`:g.question;
  }
  const candidates=[];const same=quizState.items.filter(a=>a!==q);
  for(const a of same){const v=a.type==='vocab'?(a.x.meanings||[])[0]:a.type==='kanji'?((a.x.kunyomi||[])[0]||(a.x.onyomi||[])[0]||''):(a.x.pattern||a.x.meaning||'');if(v&&v!==correct)candidates.push(v);if(candidates.length>=3)break;}
  while(candidates.length<3)candidates.push(q.type==='kanji'?'こう':q.type==='grammar'?'N4 grammar':'to learn');
  const opts=[correct,...candidates].filter(Boolean).sort(()=>Math.random()-.5);
  quizState.currentCorrect=correct;
  $('#quizBox').innerHTML=`<div class="quiz-progress">Question ${quizState.i+1} / ${quizState.items.length}</div><div class="quiz-question" data-quiz-peek="1">${prompt}</div><div class="quiz-options">${opts.map(o=>`<button class="quiz-option" data-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div>`;
}
function answerQuiz(answer){
  const q=quizState.items[quizState.i];
  const correct=quizState.currentCorrect;
  if(answer===correct)quizState.score++;else quizState.mistakes.push({question:q.type==='vocab'?q.x.word:q.type==='kanji'?q.x.character:q.x.pattern,correct});
  quizPeek=false;
  quizState.i++;
  if(quizState.i>=quizState.items.length)finishQuiz();else renderQuizQuestion();
}
function finishQuiz(){touchStudy();const total=quizState.items.length;$('#quizBox').innerHTML=`<div class="quiz-score">${quizState.score}/${total}</div><p>${quizState.score>=Math.ceil(total*0.8)?'Great work — keep reviewing your weak points.':quizState.score>=Math.ceil(total*0.5)?'Good start — review the mistakes below.':'Keep practising — repeat the quiz after reviewing.'}</p><h3>Mistakes</h3>${quizState.mistakes.length?'<ul>'+quizState.mistakes.map(m=>`<li><b>${esc(m.question)}</b> → ${esc(m.correct)}</li>`).join('')+'</ul>':'<p>Perfect — no mistakes.</p>'}<button id="startQuizAgain" class="primary">Try Again</button>`}

function updateNavIndicators(pageId){
  const navBtn=document.querySelector(`#nav [data-page="${pageId}"]`);
  const pill=document.getElementById('navActivePill');
  if(navBtn&&pill){
    pill.style.width=`${navBtn.offsetWidth}px`;
    pill.style.transform=`translateX(${navBtn.offsetLeft - 4}px)`;
  }
  const dockBtn=document.querySelector(`#mobileNav [data-page="${pageId}"]`);
  const dockPill=document.getElementById('dockActivePill');
  if(dockBtn&&dockPill){
    dockPill.style.width=`${dockBtn.offsetWidth}px`;
    dockPill.style.transform=`translateX(${dockBtn.offsetLeft}px)`;
  }
}
window.addEventListener('resize',()=>updateNavIndicators(lastPage||'home'));

function showPage(rawId,scroll=true){
  let id=(rawId||'home').split('?')[0];
  if(id==='settings'){
    id='home';
    rawId='home';
  }
  if(scroll) window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
  document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));
  document.querySelectorAll('#nav [data-page],#mobileNav [data-page]').forEach(b=>{
    const isActive=b.dataset.page===id;
    b.classList.toggle('active',isActive);
    if(isActive)b.setAttribute('aria-current','page');else b.removeAttribute('aria-current');
  });
  lastPage=id;
  try{localStorage.setItem('jlpt-v7-last-page',id);}catch(e){}
  const targetHash = '#' + (rawId || id);
  if(window.location.hash !== targetHash){
    try{
      history.pushState({ page: id }, '', targetHash);
    }catch(e){}
  }
  updateNavIndicators(id);

  initRowLoaders();
  if(id==='vocab'){if(rowLoaders.v)rowLoaders.v.reset();else renderVocab();}
  else if(id==='grammar'){if(typeof renderGrammarSection==='function')renderGrammarSection();else if(rowLoaders.g)rowLoaders.g.reset();}
  else if(id==='kanji'){if(rowLoaders.k)rowLoaders.k.reset();else renderKanji();}
  else if(id==='kana')renderKana();
  else if(id==='compare'){
    const searchSrc = window.location.hash + '&' + (rawId || '');
    if(searchSrc.includes('ids=')){
      const match=searchSrc.match(/ids=([^&]+)/);
      if(match&&match[1]){
        compareIds=decodeURIComponent(match[1]).split(',').filter(Boolean);
        syncCompareTray();
      }
    }
    fillCompare();
  }
  else if(id==='conjunctions'){if(typeof renderConjunctions==='function')renderConjunctions();}
  else if(id==='companion'){if(typeof initBookCompanion==='function')initBookCompanion();}

  if(typeof initCustomSelects==='function')initCustomSelects();
}
function updateCountdown(){const target=new Date('2026-12-05T00:00:00+05:30');let ms=target-Date.now();if(ms<=0){$('#countdown').textContent='EXAM DAY';return}const sec=Math.floor(ms/1000),months=Math.floor(sec/(30.436875*86400)),rest1=sec-Math.floor(months*30.436875*86400),days=Math.floor(rest1/86400),rest2=rest1-days*86400,h=Math.floor(rest2/3600),m=Math.floor((rest2%3600)/60),s=rest2%60;$('#countdown').textContent=`${months} months : ${days} days : ${String(h).padStart(2,'0')} hours : ${String(m).padStart(2,'0')} min : ${String(s).padStart(2,'0')} sec`}

function openSheet(id){['moreSheet','searchSheet','onboardingSheet'].forEach(sheet=>{const el=$('#'+sheet);if(el)el.hidden=sheet!==id;});document.body.classList.add('modal-open');}
function closeSheets(){['moreSheet','searchSheet','onboardingSheet'].forEach(sheet=>{const el=$('#'+sheet);if(el)el.hidden=true;});document.body.classList.remove('modal-open');}
function renderMoreSheet(){
  $('#moreSheetTitle').textContent='More';
  $('#moreSheetContent').innerHTML=`<div class="settings-grid"><button class="tool-btn" data-page="grammar">Grammar</button><button class="tool-btn" data-page="conjunctions">Conjunctions</button><button class="tool-btn" data-page="compare">Compare</button><button class="tool-btn" data-page="companion">Companion</button><button class="tool-btn" data-page="quiz">Quiz</button><button class="tool-btn" data-page="how">Guide</button></div>`;
}
function renderSearchSheet(){
  $('#searchTitle').textContent='Search';
  $('#searchContent').innerHTML=`<div class="search-shell"><input id="globalSearchInput" type="search" placeholder="Search vocabulary, grammar, kanji or kana"><div class="search-results" id="searchResults"><div class="empty-panel">Type to search across the app.</div></div></div>`;
  $('#globalSearchInput').focus();
}
function renderOnboardingSheet(){
  $('#onboardingTitle').textContent='Welcome';
  $('#onboardingContent').innerHTML=`<div class="onboarding-shell"><div class="settings-grid"><div class="settings-item"><b>1. Kana</b><small>Start with the sound chart. Tap a cell to see details.</small></div><div class="settings-item"><b>2. Vocabulary</b><small>Use the search bar and flashcards to build word memory.</small></div><div class="settings-item"><b>3. Quiz</b><small>Check what you know, then review the mistakes.</small></div></div><div class="onboarding-actions"><button class="primary" data-onboarding-close="1">Start studying</button><button class="tool-btn" data-onboarding-skip="1">Skip forever</button></div></div>`;
}
function maybeShowOnboarding(){if(localStorage.getItem('jlpt-v7-onboarding-dismissed')==='1')return;openSheet('onboardingSheet');renderOnboardingSheet();}
const themeToggle=document.getElementById('themeToggle');
applyTheme(preferredTheme());
initShortcutHint();
if(themeToggle){
  themeToggle.addEventListener('click',e=>{
    toggleThemeWithCircularReveal(e);
  });
}

if(window.matchMedia){
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{
    try{
      if(!localStorage.getItem(themeKey)||localStorage.getItem(themeKey)==='system'){
        setThemeInstant(e.matches?'dark':'light');
      }
    }catch(err){}
  });
}
window.addEventListener('storage',e=>{
  if(e.key===themeKey){
    const target=preferredTheme();
    if((document.documentElement.dataset.theme||document.body.dataset.theme)!==target){
      setThemeInstant(target);
    }
  }
});
const sheetIds=['moreSheet','searchSheet','onboardingSheet'];
sheetIds.forEach(id=>{const el=$('#'+id);if(el)el.addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))closeSheets();});});
$('#closeMoreSheet')?.addEventListener('click',closeSheets);$('#closeSearchSheet')?.addEventListener('click',closeSheets);$('#closeOnboardingSheet')?.addEventListener('click',()=>{localStorage.setItem('jlpt-v7-onboarding-dismissed','1');closeSheets();});
document.addEventListener('keydown',e=>{
  if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==='k'){e.preventDefault();openSheet('searchSheet');renderSearchSheet();return;}
  if(e.key==='Escape'){closeModal();closeSheets();return;}
  const modal=$('#modal');
  if(modal&&!modal.hidden){
    if(e.key==='Tab'){
      const focusables=modalFocusableElements();
      if(!focusables.length)return;
      const first=focusables[0];
      const last=focusables[focusables.length-1];
      if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();return;}
      if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();return;}
    }
    if(window.__kanaNav){if(e.key==='ArrowLeft'){e.preventDefault();window.__kanaNav.prev();return;}if(e.key==='ArrowRight'){e.preventDefault();window.__kanaNav.next();return;}}
    if(window.__activeGrammarNav){
      if(e.key==='ArrowLeft'&&window.__activeGrammarNav.prevId){e.preventDefault();openGrammar(window.__activeGrammarNav.prevId);return;}
      if(e.key==='ArrowRight'&&window.__activeGrammarNav.nextId){e.preventDefault();openGrammar(window.__activeGrammarNav.nextId);return;}
    }
  }
});
window.addEventListener('popstate',()=>{
  const modal=$('#modal');
  if(modal&&!modal.hidden){closeModal({fromPopState:true});return;}
  const hash=(window.location.hash||'').replace(/^#/,'');
  const page=hash||'home';
  if(page&&page!==lastPage){
    showPage(page,false);
  }
});
setInterval(updateCountdown,1000);updateCountdown();
document.addEventListener('click', e => {
  const pageBtn=e.target.closest('[data-page]');
  if(pageBtn){
    if(pageBtn.tagName==='A')e.preventDefault();
    closeSheets();
    closeModal();
    showPage(pageBtn.dataset.page);
    return;
  }
  const searchToggle=e.target.closest('#searchToggle');if(searchToggle){openSheet('searchSheet');renderSearchSheet();return;}
  const mobileMore=e.target.closest('#mobileMoreBtn');if(mobileMore){openSheet('moreSheet');renderMoreSheet();return;}
  const onboardingClose=e.target.closest('[data-onboarding-close]');if(onboardingClose){localStorage.setItem('jlpt-v7-onboarding-dismissed','1');closeSheets();return;}
  const onboardingSkip=e.target.closest('[data-onboarding-skip]');if(onboardingSkip){localStorage.setItem('jlpt-v7-onboarding-dismissed','1');closeSheets();return;}
  const closeModalBtn=e.target.closest('#closeModal');if(closeModalBtn){closeModal();return;}
  const modalBackdrop=e.target.closest('#modal .modal-backdrop');if(modalBackdrop){closeModal();return;}
  const grammarLevel=e.target.closest('[data-grammar-level]');if(grammarLevel){const select=$('#gLevel');if(select)select.value=grammarLevel.dataset.grammarLevel;resetG();return;}
  const grammarAnswer=e.target.closest('[data-grammar-check]');if(grammarAnswer){const feedback=$('#grammarCheckFeedback');const options=$$('.grammar-check-option');options.forEach(b=>{b.disabled=true;if(b.dataset.grammarCheck==='correct')b.classList.add('is-correct');});if(grammarAnswer.dataset.grammarCheck==='correct'){feedback.textContent='Correct! Now read one example aloud and try to make your own sentence.';feedback.classList.add('is-correct');}else{grammarAnswer.classList.add('is-wrong');feedback.textContent='Not quite. The correct meaning is highlighted above. Read the pattern and example once more.';feedback.classList.add('is-wrong');}return;}
  const quizFuriganaToggle=e.target.closest('#quizFuriganaToggle');if(quizFuriganaToggle){quizHideFurigana=!quizHideFurigana;quizPeek=false;quizFuriganaToggle.textContent=quizHideFurigana?'Hide furigana (test mode)':'Show furigana';if(quizState)renderQuizQuestion();return;}
  const toggleComp=e.target.closest('[data-action="toggle-compare"]');
  if(toggleComp){
    e.stopPropagation();
    toggleCompare(toggleComp.dataset.id);
    return;
  }
  const navGrammarBtn=e.target.closest('.grammar-nav-btn');
  if(navGrammarBtn&&navGrammarBtn.dataset.navId){
    e.preventDefault();
    openGrammar(navGrammarBtn.dataset.navId);
    return;
  }
  const contrastTarget=e.target.closest('[data-contrast-target]');
  if(contrastTarget){
    const target=contrastTarget.dataset.contrastTarget.trim();
    const targetId=contrastTarget.dataset.targetId;
    const found=targetId ? grammar.find(g=>g.id===targetId) : grammar.find(g=>g.pattern===target||g.title===target||g.pattern.includes(target)||(target.includes(g.pattern)&&g.pattern.length>1));
    closeModal();
    if(found&&!compareIds.includes(found.id)){
      if(compareIds.length<6)compareIds.push(found.id);
      syncCompareTray();
    }
    showPage('compare');
    return;
  }
  const practicePattern=e.target.closest('[data-action="practice-pattern"]');if(practicePattern){closeModal();if(typeof startGrammarPractice==='function')startGrammarPractice();return;}
  const card=e.target.closest('.study-card');if(card){const action=e.target.closest('[data-action]')?.dataset.action,id=card.dataset.id,type=card.dataset.type;if(action==='read'){e.stopPropagation();rememberResume(type==='vocab'?'v':type==='grammar'?'g':'k',Number(card.dataset.index||0)+1);toggleRead(type==='vocab'?'v':type==='grammar'?'g':'k',id)}else if(action==='detail'){rememberResume(type==='vocab'?'v':type==='grammar'?'g':'k',Number(card.dataset.index||0)+1);touchStudy();type==='vocab'?openVocab(id):type==='grammar'?openGrammar(id):openKanji(id)}return;}
  const load=e.target.closest('[data-load]');if(load){const t=load.dataset.load;if(rowLoaders[t])rowLoaders[t].jumpToIndex?.(rowLoaders[t].getLoadedCount());return;}
  const modalRead=e.target.closest('[data-modal-action]');if(modalRead){const action=modalRead.dataset.modalAction;const t=action==='read-vocab'?'v':action==='read-grammar'?'g':'k';toggleRead(t,modalRead.dataset.id);closeModal();return;}
  const flash=e.target.closest('[data-flash]');if(flash){const id=flash.dataset.flash;if(id==='know')knownSet.add(markKey('flash',Date.now()));touchStudy();if(window.__flashNext)window.__flashNext(id);return;}
  const flashCard=e.target.closest('#flashCard');if(flashCard){flashCard.classList.toggle('flipped');return;}
  if(e.target.id==='startQuiz'||e.target.id==='startQuizAgain'){startQuiz();return;}
  const quizPeekTarget=e.target.closest('[data-quiz-peek]');if(quizPeekTarget&&quizHideFurigana&&!quizPeek&&quizState){quizPeek=true;renderQuizQuestion();return;}
  const ans=e.target.closest('[data-answer]');if(ans&&quizState){answerQuiz(ans.dataset.answer);return;}
  if(e.target.id==='compareTrayClear'||e.target.closest('#compareTrayClear')){
    clearCompareTray();
    return;
  }
  if(e.target.id==='compareTrayGo'||e.target.closest('#compareTrayGo')){
    showPage('compare');
    const tableWrap=document.getElementById('compareTableWrap');
    if(tableWrap)tableWrap.scrollIntoView({behavior:'smooth',block:'start'});
    return;
  }
  if(e.target.id==='addCompare'){if(compareIds.length<6){compareIds.push('');fillCompare()}return;}
  const sel=e.target.closest('[data-compare]');if(sel){compareIds[Number(sel.dataset.compare)]=sel.value;renderCompare();return;}
  const rem=e.target.closest('[data-remove-compare]');if(rem){compareIds.splice(Number(rem.dataset.removeCompare),1);fillCompare();return;}
  if(e.target.id==='continueBtn'){showPage(progress.lastType==='g'?'grammar':progress.lastType==='k'?'kanji':'vocab');return;}
  if(e.target.id==='vFlash'){openFlash('vocab');return;}
  if(e.target.id==='kFlash'){openFlash('kanji');return;}
  const kanaCell=e.target.closest('[data-kana-id]');if(kanaCell){openKanaDetail(kanaCell.dataset.kanaId);return;}
  const kanaViewBtn=e.target.closest('[data-kana-view]');if(kanaViewBtn){kanaView=kanaViewBtn.dataset.kanaView;kanaState.view=kanaView;save();renderKana();return;}
  const kanaSetBtn=e.target.closest('[data-kana-set]');if(kanaSetBtn){kanaSet=kanaSetBtn.dataset.kanaSet;kanaState.set=kanaSet;save();renderKana();return;}
  const kanaModeBtn=e.target.closest('[data-kana-mode]');if(kanaModeBtn){openKanaPractice(kanaModeBtn.dataset.kanaMode);return;}
  const kanaNav=e.target.closest('[data-kana-nav]');if(kanaNav&&window.__kanaNav){window.__kanaNav[kanaNav.dataset.kanaNav]();return;}
  const kanaMark=e.target.closest('[data-kana-mark]');if(kanaMark&&kanaSelectedId){if(kanaMark.dataset.kanaMark==='learn')kanaMarkLearned(kanaSelectedId);else kanaUnmarkLearned(kanaSelectedId);openKanaDetail(kanaSelectedId);return;}
  const kanaFlip=e.target.closest('[data-kana-flip]');if(kanaFlip&&kanaPracticeState){kanaPracticeState.flipped=!kanaPracticeState.flipped;renderKanaPractice();return;}
  const kanaNext=e.target.closest('[data-kana-next]');if(kanaNext&&kanaPracticeState){kanaPracticeState.index=(kanaPracticeState.index+1)%Math.min(kanaPracticeState.pool.length,20);kanaPracticeState.flipped=false;renderKanaPractice();return;}
  const kanaPracticeStart=e.target.closest('[data-kana-practice-start]');if(kanaPracticeStart){openKanaPractice(kanaPracticeStart.dataset.kanaPracticeStart);return;}
  const kanaCheck=e.target.closest('[data-kana-check]');if(kanaCheck&&kanaPracticeState){const input=$('#kanaTypeInput');const feedback=$('#kanaTypeFeedback');const current=kanaPracticeState.pool[kanaPracticeState.index%kanaPracticeState.pool.length];const value=String(input?.value||'').trim().toLowerCase();if(value===current.romaji){feedback.textContent='Correct.';kanaPracticeState.score++;}else{feedback.textContent=`Not quite. It is ${current.romaji}.`;kanaPracticeState.mistakes.push({hiragana:current.hiragana,romaji:current.romaji});}kanaPracticeState.index+=1;renderKanaPractice();return;}
  const kanaAnswer=e.target.closest('[data-kana-answer]');if(kanaAnswer&&kanaPracticeState){const current=kanaPracticeState.pool[kanaPracticeState.index%kanaPracticeState.pool.length];if(kanaAnswer.dataset.kanaAnswer===current.romaji)kanaPracticeState.score++;else kanaPracticeState.mistakes.push({hiragana:current.hiragana,romaji:current.romaji});kanaPracticeState.index+=1;renderKanaPractice();return;}
});

document.addEventListener('change',e=>{
  if(e.target.id==='compareDiffOnly'){
    const tableWrap=document.getElementById('compareTableWrap');
    if(tableWrap)tableWrap.classList.toggle('compare-diff-only',e.target.checked);
    return;
  }
});

function openVocab(id){const x=vocab.find(v=>v.id===id);if(x){progress.lastType='v';save();openModal(vocabDetail(x))}}
let searchTimer;
function resetV(){ if (rowLoaders.v) rowLoaders.v.reset(); else renderVocab(); }
function resetG(){ if (rowLoaders.g) rowLoaders.g.reset(); else renderGrammar(); }
function resetK(){ if (rowLoaders.k) rowLoaders.k.reset(); else renderKanji(); }

$('#vSearch').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(resetV,150)};
$('#vLevel').onchange=resetV;
$('#vPos').onchange=resetV;
$('#vRead').onchange=resetV;
$('#vJump').onchange=e=>jumpTo('v',e.target);
$('#vJump').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();jumpTo('v',e.target)}};
$('#vResume').onclick=()=>{jumpTo('v',{value:resumeIndex('v')+1})};

$('#gSearch').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(resetG,150)};
$('#gLevel').onchange=resetG;
$('#gProgress').onchange=resetG;
$('#gJump').onchange=e=>jumpTo('g',e.target);
$('#gJump').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();jumpTo('g',e.target)}};
$('#gResume').onclick=()=>{jumpTo('g',{value:resumeIndex('g')+1})};

$('#kSearch').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(resetK,150)};
$('#kLevel').onchange=resetK;
$('#kProgress').onchange=resetK;
$('#kJump').onchange=e=>jumpTo('k',e.target);
$('#kJump').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();jumpTo('k',e.target)}};
$('#kResume').onclick=()=>{jumpTo('k',{value:resumeIndex('k')+1})};

$('#addCompare').onclick=()=>{if(compareIds.length<6){compareIds.push('');fillCompare()}};
$('#startQuiz').onclick=startQuiz;
renderKana();

const quizFuriganaToggleButton=$('#quizFuriganaToggle');
if(quizFuriganaToggleButton)quizFuriganaToggleButton.textContent='Hide furigana (test mode)';

if($('#globalSearchInput'))$('#globalSearchInput').addEventListener('input',e=>{
  const q=e.target.value.trim().toLowerCase();
  const out=$('#searchResults');
  if(!out)return;
  if(!q){out.innerHTML='<div class="empty-panel">Type to search across the app.</div>';return;}
  const vocabHits=vocab.filter(x=>[x.word,x.reading,x.romaji,(x.meanings||[]).join(' ')].join(' ').toLowerCase().includes(q)).slice(0,5);
  const grammarHits=grammar.filter(x=>[x.pattern,x.meaning,x.formation].join(' ').toLowerCase().includes(q)).slice(0,5);
  const kanjiHits=kanji.filter(x=>[x.character,(x.onyomi||[]).join(' '),(x.kunyomi||[]).join(' '),kanjiMeaning(x)].join(' ').toLowerCase().includes(q)).slice(0,5);
  out.innerHTML=`${vocabHits.map(x=>`<button class="tool-btn" data-page="vocab">Vocab: ${renderSentenceFurigana(x.furigana||buildFuriganaForWord(x.word,x.reading))}</button>`).join('')}${grammarHits.map(x=>`<button class="tool-btn" data-page="grammar">Grammar: ${esc(x.pattern)}</button>`).join('')}${kanjiHits.map(x=>`<button class="tool-btn" data-page="kanji">Kanji: ${renderRuby(x.character,kanjiReading(x))}</button>`).join('')||'<div class="empty-panel">No matches found.</div>'}`;
});

setInterval(updateCountdown,1000);
updateCountdown();
syncThemeControls();
syncKanaControls();

/* ==========================================================================
   Universal Custom Dropdown Component
   ========================================================================== */
let activeCustomDropdown = null;

function initCustomSelects(){
  document.querySelectorAll('select:not(.has-custom-select)').forEach(select=>{
    select.classList.add('has-custom-select');

    const wrap=document.createElement('div');
    wrap.className='custom-select-wrap';
    if(select.id) wrap.id='wrap_'+select.id;

    const trigger=document.createElement('button');
    trigger.type='button';
    trigger.className='custom-select-trigger';
    trigger.setAttribute('aria-haspopup','listbox');
    trigger.setAttribute('aria-expanded','false');
    if(select.id) trigger.id='trigger_'+select.id;

    const labelSpan=document.createElement('span');
    labelSpan.className='custom-select-label';
    const selOpt=select.options[select.selectedIndex];
    const prefix=select.dataset.label||select.getAttribute('aria-label');
    if(prefix){
      labelSpan.innerHTML=`<span class="custom-select-prefix">${esc(prefix)}:</span> <span class="custom-select-label-val">${esc(selOpt?selOpt.text:'Select')}</span>`;
    }else{
      labelSpan.innerHTML=`<span class="custom-select-label-val">${esc(selOpt?selOpt.text:'Select')}</span>`;
    }

    const chevronSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    chevronSvg.setAttribute('class','chevron-icon');
    chevronSvg.setAttribute('viewBox','0 0 24 24');
    chevronSvg.setAttribute('width','16');
    chevronSvg.setAttribute('height','16');
    chevronSvg.setAttribute('fill','none');
    chevronSvg.setAttribute('stroke','currentColor');
    chevronSvg.setAttribute('stroke-width','2');
    chevronSvg.innerHTML='<polyline points="6 9 12 15 18 9"></polyline>';

    trigger.appendChild(labelSpan);
    trigger.appendChild(chevronSvg);
    wrap.appendChild(trigger);

    select.parentNode.insertBefore(wrap,select);

    trigger.addEventListener('click',e=>{
      e.stopPropagation();
      if(activeCustomDropdown&&activeCustomDropdown.select===select){
        closeCustomDropdown();
      }else{
        openCustomDropdown(select,trigger,wrap);
      }
    });

    trigger.addEventListener('keydown',e=>{
      if(['Enter',' ','ArrowDown','ArrowUp'].includes(e.key)){
        e.preventDefault();
        openCustomDropdown(select,trigger,wrap);
      }
    });
  });
}
initCustomSelects();

function openCustomDropdown(select,trigger,wrap){
  closeCustomDropdown();
  let portal=document.getElementById('dropdownPortal');
  if(!portal){
    portal=document.createElement('div');
    portal.id='dropdownPortal';
    portal.className='dropdown-portal';
    document.body.appendChild(portal);
  }

  const isMobileSheet=window.innerWidth<640 && select.options.length>4;
  trigger.setAttribute('aria-expanded','true');
  portal.removeAttribute('aria-hidden');
  portal.innerHTML='';

  let panel;
  if(isMobileSheet){
    const backdrop=document.createElement('div');
    backdrop.className='sheet-backdrop';
    backdrop.onclick=closeCustomDropdown;
    portal.appendChild(backdrop);

    panel=document.createElement('div');
    panel.className='custom-bottom-sheet';
    panel.innerHTML='<div class="sheet-drag-handle" aria-hidden="true"></div>';
    portal.appendChild(panel);
  }else{
    panel=document.createElement('div');
    panel.className='custom-dropdown-panel';
    portal.appendChild(panel);

    const rect=trigger.getBoundingClientRect();
    const spaceBelow=window.innerHeight-rect.bottom;
    const spaceAbove=rect.top;
    const panelWidth=Math.max(rect.width,180);
    panel.style.minWidth=`${panelWidth}px`;
    panel.style.maxHeight='320px';
    panel.style.left=`${Math.max(8,Math.min(rect.left,window.innerWidth-panelWidth-8))}px`;

    if(spaceBelow<260&&spaceAbove>spaceBelow){
      panel.style.bottom=`${window.innerHeight-rect.top+8}px`;
      panel.style.top='auto';
    }else{
      panel.style.top=`${rect.bottom+8}px`;
      panel.style.bottom='auto';
    }
  }

  const listbox=document.createElement('div');
  listbox.setAttribute('role','listbox');
  listbox.setAttribute('tabindex','-1');
  if(select.id){
    listbox.id='listbox_'+select.id;
    trigger.setAttribute('aria-controls','listbox_'+select.id);
  }

  let activeIndex=Math.max(0,select.selectedIndex);

  Array.from(select.options).forEach((opt,idx)=>{
    const optionEl=document.createElement('div');
    optionEl.className='custom-select-option'+(idx===select.selectedIndex?' is-selected':'');
    optionEl.setAttribute('role','option');
    optionEl.setAttribute('aria-selected',idx===select.selectedIndex?'true':'false');
    optionEl.dataset.value=opt.value;

    const optSpan=document.createElement('span');
    optSpan.textContent=opt.text;
    optionEl.appendChild(optSpan);

    const checkSvg=document.createElementNS('http://www.w3.org/2000/svg','svg');
    checkSvg.setAttribute('class','check-icon');
    checkSvg.setAttribute('viewBox','0 0 24 24');
    checkSvg.setAttribute('width','16');
    checkSvg.setAttribute('height','16');
    checkSvg.setAttribute('fill','none');
    checkSvg.setAttribute('stroke','currentColor');
    checkSvg.setAttribute('stroke-width','2.5');
    checkSvg.innerHTML='<polyline points="20 6 9 17 4 12"></polyline>';
    optionEl.appendChild(checkSvg);

    optionEl.addEventListener('click',e=>{
      e.stopPropagation();
      select.value=opt.value;
      const valEl=wrap.querySelector('.custom-select-label-val')||wrap.querySelector('.custom-select-label');
      if(valEl) valEl.textContent=opt.text;
      select.dispatchEvent(new Event('change',{bubbles:true}));
      closeCustomDropdown();
      trigger.focus();
    });

    listbox.appendChild(optionEl);
  });

  panel.appendChild(listbox);
  activeCustomDropdown={select,trigger,wrap,panel};

  const options=panel.querySelectorAll('.custom-select-option');
  function highlightOption(index){
    options.forEach((o,i)=>o.classList.toggle('is-highlighted',i===index));
    if(options[index]) options[index].scrollIntoView({block:'nearest'});
  }

  let typeaheadBuffer='';
  let typeaheadTimer=null;

  const handleKeydown=e=>{
    if(e.key==='Escape'){
      e.preventDefault();
      closeCustomDropdown();
      trigger.focus();
    }else if(e.key==='ArrowDown'){
      e.preventDefault();
      activeIndex=(activeIndex+1)%options.length;
      highlightOption(activeIndex);
    }else if(e.key==='ArrowUp'){
      e.preventDefault();
      activeIndex=(activeIndex-1+options.length)%options.length;
      highlightOption(activeIndex);
    }else if(e.key==='Home'){
      e.preventDefault();
      activeIndex=0;
      highlightOption(activeIndex);
    }else if(e.key==='End'){
      e.preventDefault();
      activeIndex=options.length-1;
      highlightOption(activeIndex);
    }else if(e.key==='Enter'||e.key===' '){
      e.preventDefault();
      if(options[activeIndex]) options[activeIndex].click();
    }else if(e.key.length===1&&!e.ctrlKey&&!e.metaKey&&!e.altKey){
      clearTimeout(typeaheadTimer);
      typeaheadBuffer+=e.key.toLowerCase();
      typeaheadTimer=setTimeout(()=>{typeaheadBuffer='';},600);
      const matchIdx=Array.from(select.options).findIndex(opt=>
        opt.text.toLowerCase().trim().startsWith(typeaheadBuffer)
      );
      if(matchIdx!==-1){
        activeIndex=matchIdx;
        highlightOption(activeIndex);
      }
    }
  };

  document.addEventListener('keydown',handleKeydown);
  activeCustomDropdown.cleanupKey=()=>document.removeEventListener('keydown',handleKeydown);
}

function closeCustomDropdown(){
  if(!activeCustomDropdown) return;
  activeCustomDropdown.trigger.setAttribute('aria-expanded','false');
  if(activeCustomDropdown.cleanupKey) activeCustomDropdown.cleanupKey();
  const portal=document.getElementById('dropdownPortal');
  if(portal){
    portal.innerHTML='';
    portal.setAttribute('aria-hidden','true');
  }
  activeCustomDropdown=null;
}

function syncCustomSelects(){
  document.querySelectorAll('.custom-select-wrap').forEach(wrap=>{
    const nextSelect=wrap.nextElementSibling;
    if(nextSelect&&nextSelect.tagName==='SELECT'){
      const selectedOpt=nextSelect.options[nextSelect.selectedIndex];
      const valEl=wrap.querySelector('.custom-select-label-val')||wrap.querySelector('.custom-select-label');
      if(valEl&&selectedOpt) valEl.textContent=selectedOpt.text;
    }
  });
}

document.addEventListener('click',e=>{
  if(activeCustomDropdown&&!e.target.closest('.custom-dropdown-panel')&&!e.target.closest('.custom-select-trigger')){
    closeCustomDropdown();
  }
});

/* ==========================================================================
   Hero Interactive Features: 3D Flip, Recall Quiz, Word of Day & Marquee
   ========================================================================== */
function setupHeroInteractions(){
  const cardVocab=document.getElementById('heroCardVocab');
  if(cardVocab){
    cardVocab.onclick=()=>cardVocab.classList.toggle('flipped');
    cardVocab.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cardVocab.classList.toggle('flipped');}};
  }
  const cardKana=document.getElementById('heroCardKana');
  if(cardKana){
    cardKana.onclick=()=>cardKana.classList.toggle('flipped');
    cardKana.onkeydown=e=>{if(e.key==='Enter'||e.key===' '){e.preventDefault();cardKana.classList.toggle('flipped');}};
  }
  const quizOptions=document.querySelectorAll('#heroQuizOptions .quiz-mini-btn');
  const feedback=document.getElementById('heroQuizFeedback');
  quizOptions.forEach(btn=>{
    btn.onclick=()=>{
      quizOptions.forEach(b=>{b.disabled=true;b.classList.remove('correct-picked','wrong-picked');});
      if(btn.dataset.heroAnswer==='correct'){
        btn.classList.add('correct-picked');
        if(feedback) feedback.textContent='Correct! 何時 (なんじ · what time).';
      }else{
        btn.classList.add('wrong-picked');
        const target=document.querySelector('.is-correct-target');
        if(target) target.classList.add('correct-picked');
        if(feedback) feedback.textContent='Correct reading is 何時 (なんじ).';
      }
    };
  });
  const collage=document.getElementById('heroCollage');
  if(collage&&window.innerWidth>=1024){
    collage.addEventListener('mousemove',e=>{
      const rect=collage.getBoundingClientRect();
      const x=(e.clientX-rect.left)/rect.width-0.5;
      const y=(e.clientY-rect.top)/rect.height-0.5;
      collage.style.transform=`perspective(1000px) rotateY(${x*6}deg) rotateX(${-y*6}deg)`;
    });
    collage.addEventListener('mouseleave',()=>{
      collage.style.transform='perspective(1000px) rotateY(0deg) rotateX(0deg)';
    });
  }
}

function setupWordOfTheDay(){
  if(!vocab||!vocab.length) return;
  const dayOfYear=Math.floor((Date.now()-new Date(new Date().getFullYear(),0,0))/86400000);
  const wordItem=vocab[dayOfYear%vocab.length];
  if(!wordItem) return;
  const wWord=document.getElementById('heroWotdWord');
  const wMeta=document.getElementById('heroWotdMeta');
  const wSpeak=document.getElementById('heroWotdSpeak');
  if(wWord) wWord.innerHTML=rubyWord(wordItem.word,wordItem.reading);
  if(wMeta) wMeta.textContent=`${(wordItem.meanings||[])[0]||''} · ${posLabel(wordItem.pos)}`;
  if(wSpeak) wSpeak.onclick=e=>{e.stopPropagation();speakJapanese(wordItem.word);};
}

function setupMarqueeTicker(){
  const track=document.getElementById('marqueeTrack');
  if(!track||!vocab||!vocab.length) return;
  const sample=vocab.filter(v=>v.word&&v.reading).slice(0,25);
  const itemsHtml=sample.map(v=>`
    <span class="marquee-item">
      <span lang="ja">${esc(v.word)}</span> · ${esc(v.reading)} · ${esc((v.meanings||[])[0]||'')}
    </span>
  `).join('');
  track.innerHTML=itemsHtml+itemsHtml;
}

/* Scroll Observer for Glass Header & Mobile Dock */
let lastScrollY=window.scrollY;
window.addEventListener('scroll',()=>{
  const header=document.getElementById('siteHeader');
  const mobileNav=document.getElementById('mobileNav');
  const y=window.scrollY;
  if(header){
    header.classList.toggle('scrolled',y>8);
  }
  if(mobileNav&&window.innerWidth<960){
    if(y>lastScrollY&&y>70){
      mobileNav.style.transform='translateY(130%)';
    }else{
      mobileNav.style.transform='translateY(0)';
    }
  }
  lastScrollY=y;
},{passive:true});

if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));

loadData().then(()=>{
  initCustomSelects();
  setupHeroInteractions();
  setupWordOfTheDay();
  setupMarqueeTicker();
  const initialHash = (window.location.hash || '').replace(/^#/, '');
  const targetPage = initialHash || lastPage || 'home';
  showPage(targetPage, false);
  if(!localStorage.getItem('jlpt-v7-onboarding-dismissed'))maybeShowOnboarding();
});

window.addEventListener('hashchange', () => {
  const hash = (window.location.hash || '').replace(/^#/, '');
  if (hash && hash !== lastPage) {
    showPage(hash);
  }
});
