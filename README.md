# JLPT N5 → N4 Study Hub — Japanese Stationery Study Desk

Static HTML/CSS/JavaScript study site for JLPT N5 and N4 preparation. Deployed on Vercel.

## Features
- **Authoritative Grammar Backbone**: 32 lessons (116 patterns) aligned with *"Nihongo Challenge N4 文法と読む練習"* (ASK Publishing) plus 126 supplementary patterns (242 total).
- **Interactive Conjunctions**: 14 key JLPT N4 conjunctions with categorization and interactive drill questions.
- **Book Companion Self-Checker**: Passphrase-gated companion answer verification for all 32 lessons and review exercises.
- **Kana Master**: Interactive 5-column gojuon chart with audio pronunciation and stroke order guides.
- **Vocabulary & Kanji**: Over 1,790 vocabulary words with furigana toggle and 440+ kanji with stroke order and flashcards.
- **Stationery Study Desk Design**: Authentic Japanese washi paper aesthetics with light and dark mode toggling.

## Local Development
```powershell
py -m http.server 8000
```
Open `http://localhost:8000`.

## Deployment
Push to GitHub `main` branch to trigger automatic deployment on Vercel:
```powershell
git add .
git commit -m "Update JLPT study website"
git push origin main
```
