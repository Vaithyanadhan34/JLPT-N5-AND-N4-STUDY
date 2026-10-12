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
```powershell
py -m http.server 8000
```
Open `http://localhost:8000`.

## Deploy
```powershell
git add .
git commit -m "Expand JLPT data and improve grammar learning UX"
git push
```
