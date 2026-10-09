const SOURCES={
  v5:['https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n5.json','https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n5.json'],
  v4:['https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/vocab/n4.json','https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/vocab/n4.json'],
  k5:['https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/kanji/n5.json','https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n5.json'],
  k4:['https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/kanji/n4.json','https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/kanji/n4.json'],
  g5:['https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/grammar/n5.json','https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n5.json'],
  g4:['https://raw.githubusercontent.com/evanclan/OpenJLPT/main/data/json/grammar/n4.json','https://cdn.jsdelivr.net/gh/evanclan/OpenJLPT@main/data/json/grammar/n4.json']
};
const JLPTSTUDY={n5:'https://www.jlptstudy.net/N5/',n4:'https://www.jlptstudy.net/N4/'};
let vocab=[],grammar=[],kanji=[],sourceVocab=[],flashChars=[];
let lastPage='home', modalReturnFocus=null, vVisible=24,gVisible=24,kVisible=24,vStart=0,gStart=0,kStart=0, quizState=null, compareIds=['',''];
const readKey='jlpt-v7-read',knownKey='jlpt-v7-known',progressKey='jlpt-v7-progress',settingsKey='jlpt-v7-settings';
const readSet=new Set(JSON.parse(localStorage.getItem(readKey)||'[]'));
const knownSet=new Set(JSON.parse(localStorage.getItem(knownKey)||'[]'));
const progress=JSON.parse(localStorage.getItem(progressKey)||'{}');
const settings=Object.assign({furigana:true,romaji:false},JSON.parse(localStorage.getItem(settingsKey)||'{}'));
const KANA={
  hira:[['あ','a'],['い','i'],['う','u'],['え','e'],['お','o'],['か','ka'],['き','ki'],['く','ku'],['け','ke'],['こ','ko'],['さ','sa'],['し','shi'],['す','su'],['せ','se'],['そ','so'],['た','ta'],['ち','chi'],['つ','tsu'],['て','te'],['と','to'],['な','na'],['に','ni'],['ぬ','nu'],['ね','ne'],['の','no'],['は','ha'],['ひ','hi'],['ふ','fu'],['へ','he'],['ほ','ho'],['ま','ma'],['み','mi'],['む','mu'],['め','me'],['も','mo'],['や','ya'],['ゆ','yu'],['よ','yo'],['ら','ra'],['り','ri'],['る','ru'],['れ','re'],['ろ','ro'],['わ','wa'],['を','wo'],['ん','n'],['が','ga'],['ぎ','gi'],['ぐ','gu'],['げ','ge'],['ご','go'],['ざ','za'],['じ','ji'],['ず','zu'],['ぜ','ze'],['ぞ','zo'],['だ','da'],['ぢ','ji'],['づ','zu'],['で','de'],['ど','do'],['ば','ba'],['び','bi'],['ぶ','bu'],['べ','be'],['ぼ','bo'],['ぱ','pa'],['ぴ','pi'],['ぷ','pu'],['ぺ','pe'],['ぽ','po']],
  kata:[['ア','a'],['イ','i'],['ウ','u'],['エ','e'],['オ','o'],['カ','ka'],['キ','ki'],['ク','ku'],['ケ','ke'],['コ','ko'],['サ','sa'],['シ','shi'],['ス','su'],['セ','se'],['ソ','so'],['タ','ta'],['チ','chi'],['ツ','tsu'],['テ','te'],['ト','to'],['ナ','na'],['ニ','ni'],['ヌ','nu'],['ネ','ne'],['ノ','no'],['ハ','ha'],['ヒ','hi'],['フ','fu'],['ヘ','he'],['ホ','ho'],['マ','ma'],['ミ','mi'],['ム','mu'],['メ','me'],['モ','mo'],['ヤ','ya'],['ユ','yu'],['ヨ','yo'],['ラ','ra'],['リ','ri'],['ル','ru'],['レ','re'],['ロ','ro'],['ワ','wa'],['ヲ','wo'],['ン','n'],['ガ','ga'],['ギ','gi'],['グ','gu'],['ゲ','ge'],['ゴ','go'],['ザ','za'],['ジ','ji'],['ズ','zu'],['ゼ','ze'],['ゾ','zo'],['ダ','da'],['ヂ','ji'],['ヅ','zu'],['デ','de'],['ド','do'],['バ','ba'],['ビ','bi'],['ブ','bu'],['ベ','be'],['ボ','bo'],['パ','pa'],['ピ','pi'],['プ','pu'],['ペ','pe'],['ポ','po']]
};
let kanaMode='hira';
const $=s=>document.querySelector(s), $$=s=>document.querySelectorAll(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,m=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[m]));
const markKey=(type,id)=>type+':'+id;
function save(){localStorage.setItem(readKey,JSON.stringify([...readSet]));localStorage.setItem(knownKey,JSON.stringify([...knownSet]));localStorage.setItem(progressKey,JSON.stringify(progress));localStorage.setItem(settingsKey,JSON.stringify(settings));}
function isRead(t,id){return readSet.has(markKey(t,id))} function isKnown(t,id){return knownSet.has(markKey(t,id))}
function posLabel(pos=[]){if(pos.some(x=>/^v/.test(x)))return 'Verb';if(pos.includes('adj-i'))return 'i-Adjective';if(pos.includes('adj-na'))return 'na-Adjective';if(pos.includes('n'))return 'Noun';return 'Other'}
function furiganaHtml(s){if(!s)return '';return esc(s).replace(/\{([^|{}]+)\|([^{}]+)\}/g,'<ruby>$1<rt>$2</rt></ruby>')}
function rubyWord(word,reading){if(!word)return '';if(!settings.furigana||!reading||!/[一-龯]/.test(word))return esc(word);return `<ruby>${esc(word)}<rt>${esc(reading)}</rt></ruby>`}
function cleanMeaning(s){return String(s||'').replace(/\s+/g,' ').trim()}
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
function levelScope(level){return level==='N5'?['N5']:['N5','N4']}
function eligibleExamples(target,scope){const allowed=levelScope(scope);let out=[];for(const x of vocab.filter(v=>allowed.includes(v.level))){for(const e of x.examples||[]){if((e.ja||'').includes(target.word)||x.word===target.word)out.push({...e,sourceWord:x.word,sourceLevel:x.level});}}if(!out.length)out=(target.examples||[]).map(e=>({...e,sourceWord:target.word,sourceLevel:target.level}));return [...new Map(out.map(e=>[(e.ja||'')+'|'+(e.en||''),e])).values()].sort((a,b)=>(a.ja||'').length-(b.ja||'').length).slice(0,3)}
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
    const localPromises=await Promise.allSettled([localJson('data/vocab_source_900.json'),localJson('data/kanji_flashcards.json')]);
    sourceVocab=localPromises[0].status==='fulfilled'?localPromises[0].value:[];flashChars=localPromises[1].status==='fulfilled'?localPromises[1].value:[];
    status('PDF vocabulary',localPromises[0].status==='fulfilled',`${sourceVocab.length} records`);status('Flashcard PDF',localPromises[1].status==='fulfilled',`${flashChars.length} kanji`);
    const keys=['v5','v4','k5','k4','g5','g4'];
    const results=await Promise.allSettled(keys.map(k=>fetchJsonWithFallback(SOURCES[k],SOURCES[k][0])));
    const d={};keys.forEach((k,i)=>d[k]=results[i].status==='fulfilled'?results[i].value.data:[]);
    keys.forEach((k,i)=>status(`OpenJLPT ${k.slice(-2).toUpperCase()}`,results[i].status==='fulfilled',results[i].status==='fulfilled'?(results[i].value.cached?'cache':'network'):'unavailable'));
    const extra=sourceVocab.map((x,i)=>({id:'pdf-'+x.source_no+'-'+i,word:x.word,reading:x.reading,romaji:'',meanings:[cleanMeaning(x.meaning)],level:'SUPP',pos:[],examples:[{ja:x.example,en:'',furigana:''}],source:'PDF',sourceNo:x.source_no}));
    vocab=dedupeVocab([...(d.v5||[]),...(d.v4||[]),...extra]);
    grammar=[...(d.g5||[]),...(d.g4||[])];
    const km=new Map();for(const x of [...(d.k5||[]),...(d.k4||[])]){if(!km.has(x.character))km.set(x.character,{...x,id:'k-'+x.character,flash:false})}
    for(const c of flashChars){if(!km.has(c.character))km.set(c.character,{id:'flash-'+c.character,character:c.character,level:'FLASH',meanings:c.meanings||[],onyomi:c.onyomi||[],kunyomi:c.kunyomi||[],strokes:c.strokes,words:c.words||[],flash:true,flashSource:c.source,flashCard:c.card,flashReadingInfo:c.reading_info,flashVocabulary:c.vocabulary_text})}
    kanji=[...km.values()];
    if(!vocab.length&&!grammar.length&&!kanji.length)throw new Error('No study data was returned.');
    updateHome();renderAll();fillCompare();
    const last=localStorage.getItem('jlpt-v7-last-page');if(last&&document.getElementById(last))showPage(last,false);
  }catch(e){console.error('JLPT data load error',e);renderLoadError(e.message||'Check your connection or run the site from http://localhost:8000/.');}
}

function updateHome(){const examples=vocab.reduce((n,x)=>n+(x.examples?.length||0),0);$('#homeVocab').textContent=vocab.length.toLocaleString();$('#homeKanji').textContent=kanji.length.toLocaleString();$('#homeGrammar').textContent=grammar.length.toLocaleString();$('#homeExamples').textContent=examples.toLocaleString();$('#homeRead').textContent=readSet.size;$('#homeKnown').textContent=knownSet.size;$('#homeStreak').textContent=calcStreak();}
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
function jumpTo(type, input){
  const n=Math.max(1,Number(input?.value||1));
  if(type==='v')vStart=n-1;
  if(type==='g')gStart=n-1;
  if(type==='k')kStart=n-1;
  if(input)input.value=n;
  type==='v'?renderVocab():type==='g'?renderGrammar():renderKanji();
}

function renderAll(){renderVocab();renderGrammar();renderKanji();updateHome()}

function renderVocab(){let q=$('#vSearch').value.trim().toLowerCase(),f=$('#vLevel').value,pos=$('#vPos').value,prog=$('#vRead').value;let data=vocab.filter(x=>{if(f==='N5'&&x.level!=='N5')return false;if(f==='N4'&&x.level!=='N4')return false;if(f==='N5N4'&&!['N5','N4'].includes(x.level))return false;if(f==='SUPP'&&x.level!=='SUPP')return false;if(q&&!([x.word,x.reading,x.romaji,(x.meanings||[]).join(' ')].join(' ').toLowerCase().includes(q)))return false;const p=posLabel(x.pos);if(pos==='NOUN'&&p!=='Noun'||pos==='IADJ'&&p!=='i-Adjective'||pos==='NADJ'&&p!='na-Adjective'||pos==='VERB'&&p!=='Verb'||pos==='OTHER'&&['Noun','i-Adjective','na-Adjective','Verb'].includes(p))return false;if(prog==='READ'&&!isRead('v',x.id))return false;if(prog==='UNREAD'&&isRead('v',x.id))return false;return true});const start=Math.min(vStart,Math.max(0,data.length-1));$('#vocabCount').textContent=`${data.length.toLocaleString()} shown · starting at #${data.length?start+1:0}`;const slice=data.slice(start,start+vVisible);$('#vGrid').innerHTML=slice.map((x,i)=>`<article class="study-card" data-type="vocab" data-id="${esc(x.id)}" data-index="${start+i}"><div class="card-top"><div class="serial">#${start+i+1}</div><span class="badge">${esc(x.level)}</span></div><div class="jp">${rubyWord(x.word,x.reading)}</div><div class="reading romaji-field">${esc(x.reading||'—')}${settings.romaji&&x.romaji?' · '+esc(x.romaji):''}</div><div class="meaning">${esc((x.meanings||[x.meaning||''])[0]||'')}</div><div class="pos-tags"><span class="pos-tag">${esc(posLabel(x.pos))}</span></div><div class="card-bottom"><button class="detail-link" data-action="detail">Details →</button><button class="speak-btn card-speak" data-speak="${esc(x.word)}" aria-label="Listen to ${esc(x.word)}">🔊</button><button class="read-btn ${isRead('v',x.id)?'read':''}" data-action="read">${isRead('v',x.id)?'✓ Read':'○ Read'}</button></div></article>`).join('')||'<div class="empty-panel">No vocabulary matches.</div>';loadMore('v',data.length,start+slice.length);}
function renderGrammar(){let q=$('#gSearch').value.trim().toLowerCase(),f=$('#gLevel').value,p=$('#gProgress').value;let data=grammar.filter(x=>(f==='ALL'||f==='N5N4'&&['N5','N4'].includes(x.level)||f==='N5'&&x.level==='N5'||f==='N4'&&x.level==='N4')&&(!q||[x.pattern,x.romaji,x.meaning,x.formation,(x.tags||[]).join(' ')].join(' ').toLowerCase().includes(q))&&(p==='ALL'||p==='READ'&&isRead('g',x.id)||p==='UNREAD'&&!isRead('g',x.id)));data.sort((a,b)=>a.level.localeCompare(b.level)||a.pattern.localeCompare(b.pattern));const start=Math.min(gStart,Math.max(0,data.length-1));$('#gCount').textContent=`${data.length} shown · starting at #${data.length?start+1:0}`;const slice=data.slice(start,start+gVisible);$('#gGrid').innerHTML=slice.map((x,i)=>`<article class="study-card" data-type="grammar" data-id="${esc(x.id)}" data-index="${start+i}"><div class="card-top"><div class="serial">#${start+i+1}</div><span class="badge">${esc(x.level)}</span></div><div class="jp">${esc(x.pattern)}</div><div class="reading romaji-field">${esc(x.romaji||'')}</div><div class="meaning">${esc(x.meaning||'')}</div><div class="card-bottom"><button class="detail-link" data-action="detail">Details →</button><button class="speak-btn card-speak" data-speak="${esc(x.pattern)}" aria-label="Listen to grammar pattern">🔊</button><button class="read-btn ${isRead('g',x.id)?'read':''}" data-action="read">${isRead('g',x.id)?'✓ Read':'○ Read'}</button></div></article>`).join('')||'<div class="empty-panel">No grammar point matches.</div>';loadMore('g',data.length,start+slice.length)}
function renderKanji(){let q=$('#kSearch').value.trim().toLowerCase(),f=$('#kLevel').value,p=$('#kProgress').value;let data=kanji.filter(x=>(f==='ALL'||f==='N5'&&x.level==='N5'||f==='N4'&&x.level==='N4'||f==='N5N4'&&['N5','N4'].includes(x.level)||f==='FLASH'&&x.flash)&&(!q||[x.character,(x.onyomi||[]).join(' '),(x.kunyomi||[]).join(' '),kanjiMeaning(x),(x.words||[]).join(' ')].join(' ').toLowerCase().includes(q))&&(p==='ALL'||p==='READ'&&isRead('k',x.id)||p==='UNREAD'&&!isRead('k',x.id)));const start=Math.min(kStart,Math.max(0,data.length-1));$('#kCount').textContent=`${data.length} shown · starting at #${data.length?start+1:0}`;const slice=data.slice(start,start+kVisible);$('#kGrid').innerHTML=slice.map((x,i)=>`<article class="study-card" data-type="kanji" data-id="${esc(x.id)}" data-index="${start+i}"><div class="card-top"><div class="serial">#${start+i+1}</div><span class="badge">${esc(x.level||'Flashcard')}</span></div><div class="k-big">${x.character&&kanjiReading(x)?`<ruby>${esc(x.character)}<rt>${esc(kanjiReading(x))}</rt></ruby>`:esc(x.character||'')}</div><div class="k-meaning">${esc(kanjiMeaning(x))}</div><div class="reading romaji-field">${esc((x.onyomi||[]).slice(0,2).join(' · '))} ${(x.kunyomi||[]).slice(0,2).join(' · ')}</div><div class="card-bottom"><button class="detail-link" data-action="detail">Details →</button><button class="speak-btn card-speak" data-speak="${esc(kanjiReading(x)||x.character||'')}" aria-label="Listen to kanji reading">🔊</button><button class="read-btn ${isRead('k',x.id)?'read':''}" data-action="read">${isRead('k',x.id)?'✓ Read':'○ Read'}</button></div></article>`).join('')||'<div class="empty-panel">No kanji matches.</div>';loadMore('k',data.length,start+slice.length)}
function loadMore(type,total,shown){const el=$('#'+type+'LoadMore');if(!el)return;el.innerHTML=shown<total?`<button class="load-more" data-load="${type}">Load 24 more · ${Math.min(24,total-shown)} next</button>`:''}
function renderKana(){const rows=KANA[kanaMode];$('#kanaGrid').innerHTML=rows.map(([ch,romaji])=>`<button class="kana-card" data-kana-speak="${esc(ch)}"><span class="kana-char">${ch}</span><span class="kana-romaji">${romaji}</span><span class="kana-listen" aria-hidden="true"></span></button>`).join('')}

function vocabDetail(x){const scope=x.level==='N5'?'N5':'N4';const ex=eligibleExamples(x,scope);return `<span class="eyebrow">VOCABULARY · ${esc(x.level)}</span><h2 id="modalTitle">${rubyWord(x.word,x.reading)} <button class="speak-btn inline-speak" data-speak="${esc(x.word)}" aria-label="Listen to Japanese word">🔊</button></h2><div class="reading">${esc(x.reading||'')}${settings.romaji&&x.romaji?' · '+esc(x.romaji):''}</div><div class="detail-grid"><div><div class="detail-section"><h3>English meanings</h3><div>${(x.meanings||[]).map(esc).join(' · ')||'—'}</div></div><div class="detail-section"><h3>Part of speech</h3><div>${esc(posLabel(x.pos))}</div></div><div class="detail-section"><h3>Study scope</h3><div>${scope==='N5'?'N5 vocabulary only':'N5 + N4 vocabulary'}</div></div></div><div><div class="detail-section"><h3>Examples</h3>${ex.length?ex.map((e,i)=>exampleHtml(e,i,scope,x)).join(''):'<div class="subtle">No example sentence is available in the current source.</div>'}</div></div></div><div class="card-bottom"><span class="subtle">Progress is saved on this device.</span><button class="read-btn ${isRead('v',x.id)?'read':''}" data-modal-action="read-vocab" data-id="${esc(x.id)}">${isRead('v',x.id)?'✓ Read':'○ Mark as read'}</button></div>`}
function exampleHtml(e,i,scope,x){const needsTranslation=!e.en&&e.ja;const rid='tr-'+Math.random().toString(36).slice(2,8);return `<div class="example-box"><span class="difficulty">${difficulty(e,i)} · ${esc(e.sourceLevel||scope)}</span><div class="example-ja">${e.furigana?furiganaHtml(e.furigana):esc(e.ja||'')}</div>${e.furigana&&settings.furigana?`<div class="example-reading">Furigana shown above the kanji</div>`:''}<div class="example-en" id="${rid}">${e.en?esc(e.en):needsTranslation?'<span class="translation-loading">Translating sentence…</span>':''}</div>${needsTranslation?`<button class="detail-link translate-btn" data-ja="${esc(e.ja)}" data-target="${rid}">Translate to English</button>`:''}<button class="detail-link speak-btn" data-speak="${esc(e.ja||'')}" aria-label="Listen to Japanese example" title="Listen to Japanese example">🔊</button></div>`}
async function translateSentence(ja,target){try{const u='https://translate.googleapis.com/translate_a/single?client=gtx&sl=ja&tl=en&dt=t&q='+encodeURIComponent(ja);const r=await fetch(u);if(!r.ok)throw new Error('Translation request failed');const d=await r.json();const t=(d[0]||[]).map(a=>a[0]||'').join('').trim();if(target)target.textContent=t||'Translation unavailable.';localStorage.setItem('tr:'+ja,t||'');}catch{const cached=localStorage.getItem('tr:'+ja);if(target)target.textContent=cached||'Translation unavailable offline.'}}

function openGrammar(id){const x=grammar.find(g=>g.id===id);if(!x)return;const ex=(x.examples||[]).slice(0,3);openModal(`<span class="eyebrow">GRAMMAR · ${esc(x.level)}</span><h2 id="modalTitle">${esc(x.pattern)}</h2><div class="reading">${esc(x.romaji||'')}</div><div class="detail-grid"><div><div class="detail-section"><h3>English meaning</h3><div>${esc(x.meaning||'')}</div></div><div class="detail-section"><h3>English explanation</h3><div>${esc(x.notes||'')}</div></div></div><div><div class="detail-section"><h3>Formation</h3><div class="formula">${esc(x.formation||'')}</div></div><div class="detail-section"><h3>Tags</h3><div>${(x.tags||[]).map(t=>`<span class="tag">${esc(t)}</span>`).join(' ')||'—'}</div></div></div></div><div class="detail-section"><h3>Examples</h3>${ex.length?ex.map((e,i)=>`<div class="example-box"><div class="example-ja">${e.furigana?furiganaHtml(e.furigana):esc(e.ja||'')}</div><div class="example-en">${esc(e.en||'')}</div><button class="detail-link speak-btn" data-speak="${esc(e.ja||'')}" aria-label="Listen to Japanese example" title="Listen to Japanese example">🔊</button></div>`).join(''):'<div class="subtle">No examples supplied.</div>'}</div><div class="card-bottom"><span></span><button class="read-btn ${isRead('g',x.id)?'read':''}" data-modal-action="read-grammar" data-id="${esc(x.id)}">${isRead('g',x.id)?'✓ Read':'○ Mark as read'}</button></div>`)}
function openKanji(id){const x=kanji.find(k=>k.id===id);if(!x)return;const reading=kanjiReading(x);const related=relatedVocabForKanji(x);const words=related.length?related:(x.words||[]).map(w=>({word:w,reading:'',meanings:[]}));const wordHtml=words.slice(0,12).map(v=>`<div class="kanji-vocab-row"><div><b>${esc(v.word)}</b> <span class="reading">${esc(v.reading||'')}</span></div><div class="subtle">${esc((v.meanings||[]).join(' · ')||'Meaning not available in supplied vocabulary data')}</div><button class="speak-btn" data-speak="${esc(v.word)}">🔊</button></div>`).join('');openModal(`<span class="eyebrow">KANJI · ${esc(x.level||'Flashcard')}</span><h2 id="modalTitle" class="ruby-word">${reading?`<ruby>${esc(x.character)}<rt>${esc(reading)}</rt></ruby>`:esc(x.character)} <button class="speak-btn inline-speak" data-speak="${esc((x.character||'')+' '+reading)}" aria-label="Listen to kanji reading">🔊</button></h2><div class="reading">${reading?'Hiragana: '+esc(reading):'Reading not available in this source'}</div><div class="detail-grid"><div><div class="detail-section"><h3>English meanings</h3><div>${esc(kanjiMeaning(x))}</div></div><div class="detail-section"><h3>Tamil meaning</h3><div id="kTamil" class="tamil-box">Loading…</div></div><div class="detail-section"><h3>On’yomi</h3><div>${esc((x.onyomi||[]).join(' · ')||'—')}</div></div></div><div><div class="detail-section"><h3>Kun’yomi</h3><div>${esc((x.kunyomi||[]).join(' · ')||'—')}</div></div><div class="detail-section"><h3>Kanji data</h3><div>${x.strokes?esc(x.strokes)+' strokes · ':''}${x.grade?'Grade '+esc(x.grade)+' · ':''}${x.radical?'Radical '+esc(x.radical):''}</div></div><div class="detail-section"><h3>Useful vocabulary</h3>${wordHtml||'<div class="subtle">No matching vocabulary is available in the loaded sources.</div>'}</div></div></div><div class="card-bottom"><span></span><button class="read-btn ${isRead('k',x.id)?'read':''}" data-modal-action="read-kanji" data-id="${esc(x.id)}">${isRead('k',x.id)?'✓ Read':'○ Mark as read'}</button></div>`);loadTamilKanji(kanjiMeaning(x))}
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

function openModal(html){modalReturnFocus=document.activeElement;$('#modalContent').innerHTML=html;$('#modal').hidden=false;document.body.classList.add('modal-open');setTimeout(()=>$('#modalCard')?.focus(),0);$('.modal-card').focus();}
function closeModal(){if($('#modal').hidden)return;$('#modal').hidden=true;document.body.classList.remove('modal-open');if(modalReturnFocus&&modalReturnFocus.focus)modalReturnFocus.focus();}
function toggleRead(t,id){const k=markKey(t,id);readSet.has(k)?readSet.delete(k):readSet.add(k);touchStudy();renderAll();}
function toggleKnown(t,id){const k=markKey(t,id);knownSet.has(k)?knownSet.delete(k):knownSet.add(k);touchStudy();renderAll();}

function fillCompare(){const opts=grammar.map(x=>`<option value="${esc(x.id)}">${esc(x.level)} · ${esc(x.pattern)} — ${esc(x.meaning||'')}</option>`).join('');$('#compareSelectors').innerHTML=compareIds.map((id,i)=>`<div class="selector-box"><label>Grammar point ${i+1}</label><select data-compare="${i}"><option value="">Select a grammar point</option>${opts}</select>${i>1?`<button class="remove-selector" data-remove-compare="${i}">Remove</button>`:''}</div>`).join('');compareIds.forEach((id,i)=>{const s=$(`[data-compare="${i}"]`);if(s)s.value=id});renderCompare()}
function renderCompare(){const xs=compareIds.map(id=>grammar.find(g=>g.id===id)).filter(Boolean);if(xs.length<2){$('#compareResult').innerHTML='<div class="empty-panel">Select at least 2 grammar points.</div>';return}let rows=[['Level',...xs.map(x=>x.level)],['Pattern',...xs.map(x=>x.pattern)],['English meaning',...xs.map(x=>x.meaning||'')],['Formation',...xs.map(x=>x.formation||'')],['Tags',...xs.map(x=>(x.tags||[]).join(', '))],['Example',...xs.map(x=>(x.examples?.[0]?.ja||'')+' — '+(x.examples?.[0]?.en||''))]];$('#compareResult').innerHTML='<table class="compare-table"><thead><tr><th>Feature</th>'+xs.map(x=>`<th>${esc(x.pattern)}</th>`).join('')+'</tr></thead><tbody>'+rows.map(r=>`<tr><th>${esc(r[0])}</th>${r.slice(1).map(c=>`<td>${esc(c)}</td>`).join('')}</tr>`).join('')+'</tbody></table>'}

function openFlash(type){const pool=type==='vocab'?vocab.filter(x=>x.level==='N5'||x.level==='N4'):kanji.filter(x=>x.level==='N5'||x.level==='N4'||x.flash);if(!pool.length){openModal('<h2 id="modalTitle">Flashcards unavailable</h2><p>No data is loaded for this section.</p>');return}let index=0,current=pool[Math.floor(Math.random()*pool.length)];const render=()=>{const front=type==='vocab'?`${rubyWord(current.word,current.reading)}<button class="speak-btn" data-speak="${esc(current.word||'')}" aria-label="Listen to Japanese word">🔊</button>`:`${current.character&&kanjiReading(current)?`<ruby>${esc(current.character)}<rt>${esc(kanjiReading(current))}</rt></ruby>`:esc(current.character||'')}<button class="speak-btn" data-speak="${esc(kanjiReading(current)||current.character||'')}" aria-label="Listen to kanji reading">🔊</button>`;const back=type==='vocab'?`<strong>${esc(current.meanings?.join(' · ')||'—')}</strong><div class="reading">${esc(current.reading||'')}</div>`:`<strong>${esc(kanjiMeaning(current))}</strong><div class="reading">${esc((current.onyomi||[]).join(' · '))} ${(current.kunyomi||[]).join(' · ')}</div><div class="flash-related">${relatedVocabForKanji(current).slice(0,5).map(v=>`<div><b>${esc(v.word)}</b> ${esc(v.reading||'')} — ${esc((v.meanings||[])[0]||'')} <button class="speak-btn inline-speak" data-speak="${esc(v.word)}" aria-label="Listen to Japanese word">🔊</button></div>`).join('')}</div>`;$('#modalContent').innerHTML=`<div class="flash-wrap"><span class="eyebrow">FLASHCARD · ${index+1}/${Math.min(pool.length,100)}</span><div class="flash-card" id="flashCard" data-type="${type}"><div class="flash-front">${front}</div><div class="flash-back">${back}</div></div><div class="flash-actions"><button class="read-btn" data-flash="still">× Still learning</button><button class="read-btn read" data-flash="know">✓ Know it</button></div><p class="subtle" style="text-align:center">Tap the card to flip. Swipe left/right on mobile.</p></div>`};window.__flashNext=()=>{index=(index+1)%Math.min(pool.length,100);current=pool[Math.floor(Math.random()*pool.length)];render()};openModal('<h2 id="modalTitle">Flashcards</h2>');render()}
function startQuiz(){const pool=[...vocab.filter(x=>x.level==='N5'||x.level==='N4').map(x=>({type:'v',x})),...kanji.filter(x=>x.level==='N5'||x.level==='N4').map(x=>({type:'k',x}))];if(pool.length<4){$('#quizBox').innerHTML='<div class="error-box">Not enough quiz data loaded.</div>';return}pool.sort(()=>Math.random()-.5);quizState={items:pool.slice(0,10),i:0,score:0,mistakes:[]};renderQuizQuestion()}
function renderQuizQuestion(){const q=quizState.items[quizState.i];let correct=q.type==='v'?(q.x.meanings||[])[0]:((q.x.kunyomi||[])[0]||(q.x.onyomi||[])[0]||'');let candidates=[];const same=quizState.items.filter(a=>a!==q);for(const a of same){const v=a.type==='v'?(a.x.meanings||[])[0]:((a.x.kunyomi||[])[0]||(a.x.onyomi||[])[0]||'');if(v&&v!==correct)candidates.push(v);if(candidates.length>=3)break}while(candidates.length<3)candidates.push(q.type==='v'?'to learn':'こう');const opts=[correct,...candidates].sort(()=>Math.random()-.5);$('#quizBox').innerHTML=`<div class="quiz-progress">Question ${quizState.i+1} / ${quizState.items.length}</div><div class="quiz-question">${q.type==='v'?rubyWord(q.x.word,q.x.reading):`What is the reading of <b>${esc(q.x.character)}</b>?`}</div><div class="quiz-options">${opts.map(o=>`<button class="quiz-option" data-answer="${esc(o)}">${esc(o)}</button>`).join('')}</div>`}
function answerQuiz(answer){const q=quizState.items[quizState.i];const correct=q.type==='v'?(q.x.meanings||[])[0]:((q.x.kunyomi||[])[0]||(q.x.onyomi||[])[0]||'');if(answer===correct)quizState.score++;else quizState.mistakes.push({question:q.type==='v'?q.x.word:q.x.character,correct});quizState.i++;if(quizState.i>=quizState.items.length)finishQuiz();else renderQuizQuestion()}
function finishQuiz(){touchStudy();$('#quizBox').innerHTML=`<div class="quiz-score">${quizState.score}/10</div><p>${quizState.score>=8?'Great work — keep reviewing your weak points.':quizState.score>=5?'Good start — review the mistakes below.':'Keep practising — repeat the quiz after reviewing.'}</p><h3>Mistakes</h3>${quizState.mistakes.length?'<ul>'+quizState.mistakes.map(m=>`<li><b>${esc(m.question)}</b> → ${esc(m.correct)}</li>`).join('')+'</ul>':'<p>Perfect — no mistakes.</p>'}<button id="startQuizAgain" class="primary">Try Again</button>`}

function showPage(id,scroll=true){document.querySelectorAll('.page').forEach(p=>p.classList.toggle('active',p.id===id));document.querySelectorAll('#nav button,#mobileNav button').forEach(b=>b.classList.toggle('active',b.dataset.page===id));lastPage=id;localStorage.setItem('jlpt-v7-last-page',id);if(scroll)window.scrollTo({top:0,behavior:'smooth'})}
function updateCountdown(){const target=new Date('2026-12-05T00:00:00+05:30');let ms=target-Date.now();if(ms<=0){$('#countdown').textContent='EXAM DAY';return}const sec=Math.floor(ms/1000),months=Math.floor(sec/(30.436875*86400)),rest1=sec-Math.floor(months*30.436875*86400),days=Math.floor(rest1/86400),rest2=rest1-days*86400,h=Math.floor(rest2/3600),m=Math.floor((rest2%3600)/60),s=rest2%60;$('#countdown').textContent=`${months} months : ${days} days : ${String(h).padStart(2,'0')} hours : ${String(m).padStart(2,'0')} min : ${String(s).padStart(2,'0')} sec`}

$('#modal').addEventListener('click',e=>{if(e.target.classList.contains('modal-backdrop'))closeModal()});$('#closeModal').onclick=closeModal;document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal()});
document.addEventListener('click',e=>{
const pageBtn=e.target.closest('[data-page]');if(pageBtn){showPage(pageBtn.dataset.page);return}
const speak=e.target.closest('.speak-btn');
if(speak){e.preventDefault();e.stopPropagation();speakJapanese(speak.dataset.speak);return}
const card=e.target.closest('.study-card');if(card){const action=e.target.closest('[data-action]')?.dataset.action,id=card.dataset.id,type=card.dataset.type;if(action==='read'){e.stopPropagation();rememberResume(type==='vocab'?'v':type==='grammar'?'g':'k',Number(card.dataset.index||0)+1);toggleRead(type==='vocab'?'v':type==='grammar'?'g':'k',id)}else if(action==='detail'){rememberResume(type==='vocab'?'v':type==='grammar'?'g':'k',Number(card.dataset.index||0)+1);touchStudy();type==='vocab'?openVocab(id):type==='grammar'?openGrammar(id):openKanji(id)}return}const load=e.target.closest('[data-load]');if(load){const t=load.dataset.load;if(t==='v')vVisible+=24;if(t==='g')gVisible+=24;if(t==='k')kVisible+=24;renderAll();return}const modalRead=e.target.closest('[data-modal-action]');if(modalRead){const action=modalRead.dataset.modalAction;const t=action==='read-vocab'?'v':action==='read-grammar'?'g':'k';toggleRead(t,modalRead.dataset.id);closeModal();return}const translate=e.target.closest('.translate-btn');if(translate){const ja=translate.dataset.ja,target=$('#'+translate.dataset.target);const cached=localStorage.getItem('tr:'+ja);if(cached){target.textContent=cached;translate.remove()}else{translateSentence(ja,target).then(()=>translate.remove())}return}const flash=e.target.closest('[data-flash]');if(flash){const id=flash.dataset.flash;const card=$('#flashCard');if(id==='know')knownSet.add(markKey('flash',Date.now()));touchStudy();if(card){const poolType=$('.flash-wrap')?.querySelector('.flash-card')?.dataset?.type;card.classList.remove('flipped');if(window.__flashNext)window.__flashNext(id); }return}const flashCard=e.target.closest('#flashCard');if(flashCard){flashCard.classList.toggle('flipped');return}if(e.target.id==='startQuiz'||e.target.id==='startQuizAgain'){startQuiz();return}const ans=e.target.closest('[data-answer]');if(ans&&quizState){answerQuiz(ans.dataset.answer);return}if(e.target.id==='addCompare'){if(compareIds.length<6){compareIds.push('');fillCompare()}return}const sel=e.target.closest('[data-compare]');if(sel){compareIds[Number(sel.dataset.compare)]=sel.value;renderCompare();return}const rem=e.target.closest('[data-remove-compare]');if(rem){compareIds.splice(Number(rem.dataset.removeCompare),1);fillCompare();return}if(e.target.id==='continueBtn'){showPage(progress.lastType==='g'?'grammar':progress.lastType==='k'?'kanji':'vocab');return}if(e.target.id==='vFlash'){openFlash('vocab');return}if(e.target.id==='kFlash'){openFlash('kanji');return}const kana=e.target.closest('[data-kana-speak]');if(kana){speakJapanese(kana.dataset.kanaSpeak);return}const kt=e.target.closest('[data-kana]');if(kt&&kt.classList.contains('kana-tab')){kanaMode=kt.dataset.kana;document.querySelectorAll('.kana-tab').forEach(b=>b.classList.toggle('active',b===kt));renderKana();return}});

function openVocab(id){const x=vocab.find(v=>v.id===id);if(x){progress.lastType='v';save();openModal(vocabDetail(x))}}
let searchTimer;
function resetV(){vStart=0;vVisible=24;renderVocab()} function resetG(){gStart=0;gVisible=24;renderGrammar()} function resetK(){kStart=0;kVisible=24;renderKanji()}
$('#vSearch').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(resetV,200)};$('#vLevel').onchange=resetV;$('#vPos').onchange=resetV;$('#vRead').onchange=resetV;$('#vJump').onchange=e=>jumpTo('v',e.target);$('#vJump').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();jumpTo('v',e.target)}};$('#vResume').onclick=()=>{vStart=resumeIndex('v');vVisible=24;renderVocab()};
$('#gSearch').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(resetG,200)};$('#gLevel').onchange=resetG;$('#gProgress').onchange=resetG;
$('#gJump').onchange=e=>jumpTo('g',e.target);$('#gJump').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();jumpTo('g',e.target)}};$('#gResume').onclick=()=>{gStart=resumeIndex('g');gVisible=24;renderGrammar()};
$('#kSearch').oninput=()=>{clearTimeout(searchTimer);searchTimer=setTimeout(resetK,200)};$('#kLevel').onchange=resetK;$('#kProgress').onchange=resetK;
$('#kJump').onchange=e=>jumpTo('k',e.target);$('#kJump').onkeydown=e=>{if(e.key==='Enter'){e.preventDefault();jumpTo('k',e.target)}};$('#kResume').onclick=()=>{kStart=resumeIndex('k');kVisible=24;renderKanji()};
$('#addCompare').onclick=()=>{if(compareIds.length<6){compareIds.push('');fillCompare()}};$('#startQuiz').onclick=startQuiz;renderKana();

/* ===== LIGHT / DARK THEME TOGGLE ===== */
const themeToggle = document.getElementById('themeToggle');
const savedTheme = localStorage.getItem('jlpt-theme') || 'light';

function applyTheme(theme) {
  document.body.dataset.theme = theme;

  if (themeToggle) {
    const dark = theme === 'dark';
    themeToggle.textContent = dark ? '☀️ Light mode' : '🌙 Dark mode';
    themeToggle.setAttribute(
      'aria-label',
      dark ? 'Switch to light mode' : 'Switch to dark mode'
    );
    themeToggle.setAttribute(
      'aria-pressed',
      String(dark)
    );
  }

  const themeColor = document.querySelector('meta[name="theme-color"]');
  if (themeColor) {
    themeColor.setAttribute(
      'content',
      theme === 'dark' ? '#0b1120' : '#15284b'
    );
  }
}

applyTheme(savedTheme);

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const nextTheme =
      document.body.dataset.theme === 'dark' ? 'light' : 'dark';

    applyTheme(nextTheme);
    localStorage.setItem('jlpt-theme', nextTheme);
  });
}

$('#furiganaToggle').checked=settings.furigana;$('#romajiToggle').checked=settings.romaji;$('#furiganaToggle').onchange=e=>{settings.furigana=e.target.checked;save();renderAll()};$('#romajiToggle').onchange=e=>{settings.romaji=e.target.checked;save();renderAll()};
setInterval(updateCountdown,1000);updateCountdown();
if('serviceWorker' in navigator)window.addEventListener('load',()=>navigator.serviceWorker.register('./sw.js').catch(()=>{}));
loadData();
