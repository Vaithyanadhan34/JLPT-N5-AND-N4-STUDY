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
```powershell
py -m http.server 8000
```
Open `http://localhost:8000`.

## Deploy
Push the folder to GitHub and import the repository into Vercel. No build command is required.

## Note
OpenJLPT N5/N4 JSON datasets are fetched at runtime with a CDN fallback. The supplied PDF-derived vocabulary and flashcard JSON files are bundled locally.
