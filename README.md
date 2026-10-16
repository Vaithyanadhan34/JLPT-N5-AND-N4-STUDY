<<<<<<< HEAD
# JLPT N5 → N4 Study Hub — V11

Vercel-ready static JLPT study website.

## V11 fixes
- Kana is locked to a 5-column gojuon layout on mobile and desktop so あいうえお stay together and かきくけこ begin on the next row.
- Japanese speaker controls use a more reliable mobile SpeechSynthesis flow with a short post-cancel delay and Japanese voice selection.
- Speaker buttons now speak the Japanese word/reading only, never the English meaning.
- Vocabulary and flashcard speaker buttons are enabled consistently.
- Romaji is OFF by default in the HTML as well as JavaScript.
- Service-worker cache bumped to V11 to prevent stale deployed JavaScript/CSS.

## V9 fixes
- Resume + Jump-to-number for Vocabulary, Grammar and Kanji.
- Resume position is stored in browser localStorage.
- Fixed the missing `rememberResume` / `resumeIndex` functions that broke Details and Resume.
- Vocabulary, Grammar and Kanji Details modals work from every card.
- Desktop Kana grid uses five columns so あいうえお stay together and かきくけこ start on the next row.
- Refined Japanese speaker controls with consistent icon buttons.
- Service-worker cache version bumped so deployed users do not keep the broken V8 JavaScript.

## Local run
=======
# JLPT N5 → N4 Study Hub — V12 Expanded Data + Grammar UX

Static HTML/CSS/JavaScript study site. No build command is required for Vercel.

## V12 changes
- Added the uploaded `JLPT_N4_study_data.xlsx` vocabulary and kanji lists as a local supplement:
  - 1,486 workbook vocabulary rows before deduplication.
  - 245 workbook kanji rows before merging duplicates.
- Kept the existing PDF-derived 900-sentence vocabulary source and JK4B kanji flashcards.
- Vocabulary from the workbook is merged with OpenJLPT N5/N4 vocabulary; duplicate word + reading pairs are merged rather than shown twice.
- Kanji workbook rows supplement missing meanings/readings/stroke counts when the remote dataset lacks them.
- Added a step-by-step grammar learning path: meaning → formation → example → quick check.
- Grammar cards now preview sentence formation and an example; grammar detail includes a meaning check and Japanese audio buttons.
- Added persistent light/dark theme toggle.
- Improved dark-mode controls and Start Quiz button styling.
- Service-worker cache version bumped to `jlpt-study-v12`.

## Data notes
- The Excel workbook grammar sheets use Chinese meaning glosses. To avoid presenting those as English translations, the grammar lesson cards continue to use the website's OpenJLPT English grammar data.
- OpenJLPT grammar/vocabulary datasets are still fetched at runtime with a CDN fallback; internet access is needed for fresh remote data. The uploaded Excel vocabulary/kanji supplement and PDF-derived datasets are local.
- The Marugoto vocabulary PDFs and Kanji list are useful source/reference files; the structured workbook supplement is used locally here to avoid importing uncertain OCR rows.

## Run locally
>>>>>>> 25c51b3 (Updated JLPT Data and UI/UX)
```powershell
py -m http.server 8000
```
Open `http://localhost:8000`.

## Deploy
<<<<<<< HEAD
Push the folder to GitHub and import the repository into Vercel. No build command is required.

## Note
OpenJLPT N5/N4 JSON datasets are fetched at runtime with a CDN fallback. The supplied PDF-derived vocabulary and flashcard JSON files are bundled locally.
=======
```powershell
git add .
git commit -m "Expand JLPT data and improve grammar learning UX"
git push
```
>>>>>>> 25c51b3 (Updated JLPT Data and UI/UX)
