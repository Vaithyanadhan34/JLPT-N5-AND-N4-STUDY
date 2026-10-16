// ====================================================
// Book Features Module: Textbook Backbone, Conjunctions & Companion
// References: "Nihongo Challenge N4 文法と読む練習" (ASK Publishing)
// ====================================================

let grammarViewMode = 'book'; // 'book' or 'all'
let companionUnlocked = false;
let companionData = null;

// Preset Contrast Groups
const CONTRAST_PRESETS = {
  'ba-tara-to-nara': ['g-l12-1', 'g-l13-2', 'g-l13-1', 'g-l12-2'], // ば, たら, と, なら
  'souda-sou-youda-rashii': ['g-l18-1', 'g-l15-1', 'g-l21-3', 'g-l28-1'], // そうだ(伝聞), そう(様態), ようだ(推量), らしい(推量)
  'node-kara': ['g-l25-2', 'g-l4-4'], // ので, から
  'youni-tameni': ['g-l14-1', 'g-l23-4'], // ように(目標), ため(に)
  'kotonisuru-kotoninaru': ['g-l21-1', 'g-l5-1'], // ことにする, ことになる
  'temorau-tekureru-teageru': ['g-l6-1', 'g-l6-2', 'g-l6-3'], // てもらう, てくれる, てあげる
  'ageru-kureru-morau': ['g-l4-3', 'g-l4-2', 'g-l4-1'], // あげる, くれる, もらう
  'ukemi-saseru-saserareru': ['g-l25-1', 'g-l27-3', 'g-l27-4'] // 受身, 使役, 使役受身
};

// ----------------------------------------------------
// HOME PAGE: Today's Lesson & 32-Lesson Roadmap
// ----------------------------------------------------
function updateHomeRoadmap() {
  if (!grammar || !grammar.length) return;

  const bookPatterns = grammar.filter(g => g.isBookPattern);
  const lessonsMap = new Map();

  for (let l = 1; l <= 32; l++) {
    lessonsMap.set(l, { lesson: l, patterns: [], readCount: 0, title: '', page: 0 });
  }

  for (const p of bookPatterns) {
    const l = p.lesson;
    if (lessonsMap.has(l)) {
      const info = lessonsMap.get(l);
      info.patterns.push(p);
      if (!info.title && p.lessonTitle) info.title = p.lessonTitle;
      if (!info.page && p.bookRef?.page) info.page = p.bookRef.page;
      if (isRead('g', p.id)) info.readCount++;
    }
  }

  // Find next unlearned lesson for "Today's Lesson"
  let todayLesson = null;
  for (let l = 1; l <= 32; l++) {
    const info = lessonsMap.get(l);
    if (info && info.readCount < info.patterns.length) {
      todayLesson = info;
      break;
    }
  }
  if (!todayLesson) todayLesson = lessonsMap.get(1);

  if (todayLesson) {
    const badge = document.getElementById('todayLessonBadge');
    const title = document.getElementById('todayLessonTitle');
    const desc = document.getElementById('todayLessonDesc');
    const btn = document.getElementById('todayLessonBtn');

    if (badge) badge.textContent = `第${todayLesson.lesson}話`;
    if (title) title.textContent = todayLesson.title || `Lesson ${todayLesson.lesson}`;
    if (desc) desc.textContent = `${todayLesson.patterns.length} core patterns · ${todayLesson.readCount}/${todayLesson.patterns.length} learned · Book p.${todayLesson.page}`;
    if (btn) {
      btn.onclick = () => {
        showPage('grammar');
        setTimeout(() => openLessonAccordion(todayLesson.lesson), 100);
      };
    }
  }

  // Render 32-Lesson Roadmap
  const track = document.getElementById('roadmapTrack');
  const summary = document.getElementById('roadmapSummary');
  if (!track) return;

  let completedLessons = 0;
  let trackHtml = '';

  for (let l = 1; l <= 32; l++) {
    const info = lessonsMap.get(l);
    if (!info) continue;
    const isDone = info.patterns.length > 0 && info.readCount === info.patterns.length;
    const isActive = todayLesson && todayLesson.lesson === l;
    if (isDone) completedLessons++;

    trackHtml += `
      <div class="roadmap-step-pill ${isDone ? 'is-done' : ''} ${isActive ? 'is-active' : ''}" data-roadmap-lesson="${l}">
        <span class="roadmap-step-num">第${l}話</span>
        <span class="roadmap-step-title" title="${esc(info.title)}">${esc(info.title || `L${l}`)}</span>
        <span class="roadmap-step-status">${isDone ? '✓ Done' : `${info.readCount}/${info.patterns.length}`}</span>
      </div>
    `;
  }

  track.innerHTML = trackHtml;
  if (summary) summary.textContent = `${completedLessons} / 32 Lessons Completed`;

  track.querySelectorAll('[data-roadmap-lesson]').forEach(pill => {
    pill.onclick = () => {
      const l = Number(pill.dataset.roadmapLesson);
      showPage('grammar');
      setTimeout(() => openLessonAccordion(l), 100);
    };
  });
}

// ----------------------------------------------------
// GRAMMAR PAGE: Book Order vs All Cards
// ----------------------------------------------------
function initGrammarViewControls() {
  const btnBook = document.getElementById('gViewBook');
  const btnAll = document.getElementById('gViewAll');
  const rangeSelect = document.getElementById('gLessonRange');
  const practiceBtn = document.getElementById('gPracticeBtn');

  if (btnBook && btnAll) {
    btnBook.onclick = () => {
      grammarViewMode = 'book';
      btnBook.classList.add('active');
      btnAll.classList.remove('active');
      renderGrammarSection();
    };
    btnAll.onclick = () => {
      grammarViewMode = 'all';
      btnAll.classList.add('active');
      btnBook.classList.remove('active');
      renderGrammarSection();
    };
  }

  if (rangeSelect) {
    rangeSelect.onchange = () => renderGrammarSection();
  }

  if (practiceBtn) {
    practiceBtn.onclick = () => startGrammarPractice();
  }
}

function renderGrammarSection() {
  const bookContainer = document.getElementById('gBookLessons');
  const gridWrap = document.getElementById('gGridWrap');

  if (grammarViewMode === 'book') {
    if (bookContainer) bookContainer.style.display = 'flex';
    if (gridWrap) gridWrap.style.display = 'none';
    renderBookLessons();
  } else {
    if (bookContainer) bookContainer.style.display = 'none';
    if (gridWrap) gridWrap.style.display = 'block';
    if (rowLoaders.g) rowLoaders.g.reset();
  }
}

function renderBookLessons() {
  const container = document.getElementById('gBookLessons');
  if (!container) return;

  const q = $('#gSearch')?.value.trim().toLowerCase() || '';
  const range = $('#gLessonRange')?.value || 'ALL';
  const levelFilter = $('#gLevel')?.value || 'ALL';
  const progressFilter = $('#gProgress')?.value || 'ALL';

  let minL = 1, maxL = 32;
  if (range === '1-8') { minL = 1; maxL = 8; }
  else if (range === '9-16') { minL = 9; maxL = 16; }
  else if (range === '17-24') { minL = 17; maxL = 24; }
  else if (range === '25-32') { minL = 25; maxL = 32; }

  const bookPatterns = grammar.filter(g => g.isBookPattern);
  const lessonsMap = new Map();

  for (let l = minL; l <= maxL; l++) {
    lessonsMap.set(l, { lesson: l, patterns: [], title: '', page: 0 });
  }

  for (const p of bookPatterns) {
    const l = p.lesson;
    if (l >= minL && l <= maxL) {
      const info = lessonsMap.get(l);
      if (info) {
        if (!info.title && p.lessonTitle) info.title = p.lessonTitle;
        if (!info.page && p.bookRef?.page) info.page = p.bookRef.page;

        // Apply filters
        const matchesQuery = !q || [p.pattern, p.meaning, p.formation, (p.tags||[]).join(' ')].join(' ').toLowerCase().includes(q);
        const matchesLevel = levelFilter === 'ALL' || (levelFilter === 'N5N4' && ['N5','N4'].includes(p.level)) || p.level === levelFilter;
        const matchesProgress = progressFilter === 'ALL' || (progressFilter === 'READ' && isRead('g', p.id)) || (progressFilter === 'UNREAD' && !isRead('g', p.id));

        if (matchesQuery && matchesLevel && matchesProgress) {
          info.patterns.push(p);
        }
      }
    }
  }

  let html = '';
  let totalMatchingPoints = 0;

  for (let l = minL; l <= maxL; l++) {
    const info = lessonsMap.get(l);
    if (!info) continue;

    // Count read patterns in this lesson overall
    const allLessonPatterns = bookPatterns.filter(p => p.lesson === l);
    const readCount = allLessonPatterns.filter(p => isRead('g', p.id)).length;
    const isComplete = allLessonPatterns.length > 0 && readCount === allLessonPatterns.length;

    // If search active and no patterns match, hide lesson
    if (q && info.patterns.length === 0) continue;

    totalMatchingPoints += info.patterns.length;
    const isOpen = (l === 1 || q.length > 0 || info.patterns.length > 0 && l === minL);

    html += `
      <div class="lesson-accordion ${isOpen ? 'is-open' : ''}" id="lessonAcc-${l}" data-lesson="${l}">
        <button type="button" class="lesson-acc-header" data-toggle-lesson="${l}">
          <div class="lesson-acc-left">
            <div class="lesson-ring-mini ${isComplete ? 'is-complete' : ''}" aria-label="${readCount} of ${allLessonPatterns.length} learned">
              ${isComplete ? '✓' : `${readCount}/${allLessonPatterns.length}`}
            </div>
            <div class="lesson-acc-info">
              <h3>第${l}話: ${esc(info.title)}</h3>
              <small>${info.patterns.length} pattern${info.patterns.length === 1 ? '' : 's'} · Book p.${info.page}</small>
            </div>
          </div>
          <svg class="lesson-acc-chevron" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </button>
        <div class="lesson-acc-body" ${isOpen ? '' : 'style="display:none"'}>
          <div class="lesson-patterns-grid">
            ${info.patterns.map((p, idx) => grammarCardMarkup(p, idx)).join('')}
          </div>
        </div>
      </div>
    `;
  }

  if (!html) {
    html = `<div class="empty-panel">No grammar patterns match your current filters.</div>`;
  }

  container.innerHTML = html;
  const countEl = document.getElementById('gCount');
  if (countEl) countEl.textContent = `${totalMatchingPoints} patterns in view`;

  // Toggle Accordion Listener
  container.querySelectorAll('[data-toggle-lesson]').forEach(btn => {
    btn.onclick = () => {
      const l = btn.dataset.toggleLesson;
      const acc = document.getElementById(`lessonAcc-${l}`);
      if (!acc) return;
      const body = acc.querySelector('.lesson-acc-body');
      const isOpen = acc.classList.toggle('is-open');
      if (body) body.style.display = isOpen ? 'block' : 'none';
    };
  });
}

function openLessonAccordion(lessonNum) {
  const acc = document.getElementById(`lessonAcc-${lessonNum}`);
  if (!acc) return;
  acc.classList.add('is-open');
  const body = acc.querySelector('.lesson-acc-body');
  if (body) body.style.display = 'block';
  acc.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// ----------------------------------------------------
// COMPARE PRESETS HANDLER
// ----------------------------------------------------
function initComparePresets() {
  const list = document.getElementById('comparePresetsList');
  if (!list) return;

  list.querySelectorAll('[data-preset]').forEach(btn => {
    btn.onclick = () => {
      const key = btn.dataset.preset;
      const ids = CONTRAST_PRESETS[key];
      if (ids && ids.length) {
        compareIds = [...ids];
        fillCompare();
      }
    };
  });
}

// ----------------------------------------------------
// CONJUNCTIONS PAGE
// ----------------------------------------------------
function renderConjunctions() {
  const container = document.getElementById('conjGroupsContainer');
  if (!container) return;

  if (!window.conjunctionsData || !window.conjunctionsData.groups) {
    container.innerHTML = `<div class="empty-panel">Conjunctions data loading...</div>`;
    return;
  }

  const { groups, items } = window.conjunctionsData;

  const html = groups.map(g => {
    const groupItems = items.filter(it => it.group === g.id);
    return `
      <div class="conj-group-card">
        <div class="conj-group-head">
          <span class="eyebrow">GROUP ${g.no}</span>
          <h3>${esc(g.titleJa)} · ${esc(g.titleEn)}</h3>
          <p>${esc(g.description)}</p>
        </div>
        <div class="conj-items-grid">
          ${groupItems.map(item => `
            <div class="conj-item-box">
              <div class="conj-word-head">
                <span class="conj-word">${esc(item.word)}</span>
                <span class="conj-meaning">${esc(item.meaning)}</span>
              </div>
              <p class="conj-notes">${esc(item.notes)}</p>
              <div class="conj-ex-list">
                ${(item.examples || []).map(ex => `
                  <div class="conj-ex-item">
                    <div class="conj-ex-ja">${renderSentenceFurigana(ex.furigana || ex.ja)}</div>
                    <div class="conj-ex-en">${esc(ex.en)}</div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }).join('');

  container.innerHTML = html;
  renderConjunctionDrills();
}

let conjDrillIndex = 0;
let conjDrillScore = 0;

function renderConjunctionDrills() {
  const box = document.getElementById('conjDrillBox');
  if (!box || !window.conjunctionsData || !window.conjunctionsData.drills) return;

  const drills = window.conjunctionsData.drills;
  if (!drills.length) return;

  const d = drills[conjDrillIndex % drills.length];

  box.innerHTML = `
    <div class="drill-card">
      <div class="quiz-mini-head">
        <span class="card-badge">DRILL ${conjDrillIndex + 1} / ${drills.length}</span>
        <span class="score-badge">Score: ${conjDrillScore}</span>
      </div>
      <div class="quiz-prompt" style="font-size:18px;margin:16px 0;line-height:1.6;" lang="ja">
        ${esc(d.sentence)}
      </div>
      <div class="grammar-check-options" id="conjDrillOptions">
        ${d.options.map(opt => `
          <button type="button" class="grammar-check-option" data-conj-ans="${esc(opt)}">${esc(opt)}</button>
        `).join('')}
      </div>
      <div id="conjDrillFeedback" class="grammar-check-feedback" aria-live="polite">Choose the conjunction that best completes the sentence.</div>
      <div style="margin-top:16px;text-align:right;">
        <button id="nextConjDrill" class="tool-btn" style="display:none">Next Question →</button>
      </div>
    </div>
  `;

  box.querySelectorAll('[data-conj-ans]').forEach(btn => {
    btn.onclick = () => {
      const ans = btn.dataset.conjAns;
      const fb = document.getElementById('conjDrillFeedback');
      const nextBtn = document.getElementById('nextConjDrill');

      box.querySelectorAll('[data-conj-ans]').forEach(b => {
        b.disabled = true;
        if (b.dataset.conjAns === d.correct) b.classList.add('is-correct');
      });

      if (ans === d.correct) {
        btn.classList.add('is-correct');
        conjDrillScore++;
        if (fb) fb.textContent = `Correct! ${d.explanation}`;
      } else {
        btn.classList.add('is-wrong');
        if (fb) fb.textContent = `Incorrect. The correct conjunction is "${d.correct}". ${d.explanation}`;
      }

      if (nextBtn) {
        nextBtn.style.display = 'inline-block';
        nextBtn.onclick = () => {
          conjDrillIndex = (conjDrillIndex + 1) % drills.length;
          renderConjunctionDrills();
        };
      }
    };
  });
}

// ----------------------------------------------------
// BOOK COMPANION: Private Self-Checker
// ----------------------------------------------------
function initBookCompanion() {
  const form = document.getElementById('companionGateForm');
  const input = document.getElementById('companionPassphrase');
  const errorMsg = document.getElementById('gateError');
  const lockBtn = document.getElementById('companionLockBtn');
  const clearBtn = document.getElementById('companionClearBtn');
  const gradeBtn = document.getElementById('companionGradeBtn');
  const select = document.getElementById('companionSectionSelect');

  // Check saved unlocked state in session
  if (sessionStorage.getItem('jlpt-companion-unlocked') === 'true') {
    unlockCompanion();
  }

  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const val = input.value.trim();
      // Passphrase check (default "password")
      if (val === 'password') {
        sessionStorage.setItem('jlpt-companion-unlocked', 'true');
        unlockCompanion();
      } else {
        if (errorMsg) errorMsg.hidden = false;
      }
    };
  }

  if (lockBtn) {
    lockBtn.onclick = () => {
      sessionStorage.removeItem('jlpt-companion-unlocked');
      companionUnlocked = false;
      const gate = document.getElementById('companionGate');
      const app = document.getElementById('companionApp');
      if (gate) gate.hidden = false;
      if (app) app.hidden = true;
    };
  }

  if (select) {
    select.onchange = () => loadCompanionSection(select.value);
  }

  if (clearBtn) {
    clearBtn.onclick = () => clearCompanionInputs();
  }

  if (gradeBtn) {
    gradeBtn.onclick = () => gradeCompanionAnswers();
  }
}

async function unlockCompanion() {
  companionUnlocked = true;
  const gate = document.getElementById('companionGate');
  const app = document.getElementById('companionApp');
  if (gate) gate.hidden = true;
  if (app) app.hidden = false;

  if (!companionData) {
    try {
      companionData = await localJson('data/private-book-companion.json');
      populateCompanionSections();
    } catch (e) {
      console.error('Failed to load private companion data', e);
    }
  } else {
    populateCompanionSections();
  }
}

function populateCompanionSections() {
  const select = document.getElementById('companionSectionSelect');
  if (!select || !companionData) return;

  let opts = '<optgroup label="Lessons 1–32 (10 questions each)">';
  for (let l = 1; l <= 32; l++) {
    const info = companionData.lessons[String(l)];
    if (info) {
      opts += `<option value="lesson-${l}">第${l}話: ${esc(info.title)} (p.${info.page})</option>`;
    }
  }
  opts += '</optgroup>';

  if (companionData.reviews) {
    opts += '<optgroup label="Review Exercises (ふくしゅう問題 1–8)">';
    for (const [k, v] of Object.entries(companionData.reviews)) {
      opts += `<option value="review-${k}">ふくしゅう問題 ${k} (p.${v.page})</option>`;
    }
    opts += '</optgroup>';
  }

  select.innerHTML = opts;
  loadCompanionSection(select.value);
}

let currentCompanionAnswers = [];

function loadCompanionSection(key) {
  if (!companionData) return;

  let section = null;
  let title = '';
  let page = '';

  if (key.startsWith('lesson-')) {
    const l = key.replace('lesson-', '');
    section = companionData.lessons[l];
    title = `第${l}話: ${section.title}`;
    page = `Book p.${section.page}`;
  } else if (key.startsWith('review-')) {
    const r = key.replace('review-', '');
    section = companionData.reviews[r];
    title = `ふくしゅう問題 ${r}`;
    page = `Book p.${section.page}`;
  }

  if (!section) return;

  const tEl = document.getElementById('compLessonTitle');
  const pEl = document.getElementById('compLessonPage');
  const grid = document.getElementById('companionGrid');
  const scoreBox = document.getElementById('companionScoreBox');

  if (tEl) tEl.textContent = title;
  if (pEl) pEl.textContent = page;
  if (scoreBox) scoreBox.hidden = true;

  currentCompanionAnswers = section.answers || [];

  let cellsHtml = '';
  for (let i = 0; i < currentCompanionAnswers.length; i++) {
    cellsHtml += `
      <div class="comp-q-cell" id="compQCell-${i}">
        <span class="comp-q-label">Q${i + 1}</span>
        <input type="number" min="1" max="4" class="comp-q-input" id="compQInput-${i}" placeholder="1–4" aria-label="Question ${i+1} answer">
        <span class="comp-q-result" id="compQResult-${i}"></span>
      </div>
    `;
  }

  if (grid) grid.innerHTML = cellsHtml;
}

function clearCompanionInputs() {
  for (let i = 0; i < currentCompanionAnswers.length; i++) {
    const input = document.getElementById(`compQInput-${i}`);
    const cell = document.getElementById(`compQCell-${i}`);
    const res = document.getElementById(`compQResult-${i}`);
    if (input) input.value = '';
    if (cell) {
      cell.classList.remove('is-correct', 'is-wrong');
    }
    if (res) res.textContent = '';
  }
  const scoreBox = document.getElementById('companionScoreBox');
  if (scoreBox) scoreBox.hidden = true;
}

function gradeCompanionAnswers() {
  if (!currentCompanionAnswers.length) return;

  let correctCount = 0;
  for (let i = 0; i < currentCompanionAnswers.length; i++) {
    const input = document.getElementById(`compQInput-${i}`);
    const cell = document.getElementById(`compQCell-${i}`);
    const res = document.getElementById(`compQResult-${i}`);
    const expected = currentCompanionAnswers[i];
    const userVal = Number(input?.value);

    if (cell) cell.classList.remove('is-correct', 'is-wrong');

    if (userVal === expected) {
      correctCount++;
      if (cell) cell.classList.add('is-correct');
      if (res) res.textContent = `✓ Correct (${expected})`;
    } else {
      if (cell) cell.classList.add('is-wrong');
      if (res) res.textContent = `× Key: ${expected}`;
    }
  }

  const scoreBox = document.getElementById('companionScoreBox');
  if (scoreBox) {
    scoreBox.hidden = false;
    const pct = Math.round((correctCount / currentCompanionAnswers.length) * 100);
    scoreBox.className = `companion-score-box ${pct >= 80 ? 'is-good' : ''}`;
    scoreBox.innerHTML = `
      <h4>Your Score: ${correctCount} / ${currentCompanionAnswers.length} (${pct}%)</h4>
      <p>${pct === 100 ? '🎉 Perfect score! Lesson mastered.' : pct >= 70 ? '👍 Good progress! Review any incorrect items in your textbook.' : '⚠️ Needs review. Revisit the grammar explanations and retry.'}</p>
    `;
  }
}

// ----------------------------------------------------
// PRACTICE QUIZ FOR GRAMMAR
// ----------------------------------------------------
function startGrammarPractice(targetLesson = null) {
  showPage('quiz');
  const topic = document.getElementById('quizTopic');
  if (topic) topic.value = 'grammar';
  startQuiz();
}

// Expose functions globally for app.js and HTML
window.initGrammarViewControls = initGrammarViewControls;
window.renderGrammarSection = renderGrammarSection;
window.renderBookLessons = renderBookLessons;
window.openLessonAccordion = openLessonAccordion;
window.updateHomeRoadmap = updateHomeRoadmap;
window.initComparePresets = initComparePresets;
window.renderConjunctions = renderConjunctions;
window.initBookCompanion = initBookCompanion;
window.startGrammarPractice = startGrammarPractice;
