#!/usr/bin/env python3
"""
validate_data.py — Data verification and QA validator for JLPT N5→N4 Study Hub.
Can be executed standalone after every deployment:
    python validate_data.py
"""

import json
import os
import re
import sys

def check_vocab(vocab):
    print("--- 1. VOCABULARY AUDIT ---")
    defects = []
    seen = {}
    duplicates = []
    empty_fields = 0
    reading_non_kana = []
    meaning_with_jp = []

    specific_checks = {
        '駐車場': {'expected_reading': 'ちゅうしゃじょう', 'expected_meaning': 'parking lot'},
        '工場長': {'expected_reading': 'こうじょうちょう', 'expected_meaning': 'factory manager'},
        '練習場': {'expected_reading': 'れんしゅうじょう'},
        '練習問題': {'expected_reading': 'れんしゅうもんだい'},
        '写真撮影': {'expected_reading': 'しゃしんさつえい'},
        '航空会社': {'expected_reading': 'こうくうがいしゃ'},
        '旅行会社': {'expected_reading': 'りょこうがいしゃ'},
        '洗面所': {'expected_meaning': 'washroom'},
        '国語': {'expected_meaning': 'Japanese language (school subject)'},
        '何度': {'expected_meaning': 'how many times; how many degrees'},
        '教わる': {},
        '学生': {'expected_reading': 'がくせい'},
        '切符売り場': {'expected_reading': 'きっぷうりば'},
        '必要になる': {'expected_reading': 'ひつようになる'},
        '取る': {'must_not_contain': '写真を取ります'},
        '低い': {'must_contain': '低い'}
    }

    found_specific = {}

    for item in vocab:
        w = item.get('word', '').strip()
        r = item.get('reading', '').strip()
        meanings = item.get('meanings') or ([item.get('meaning')] if item.get('meaning') else [])

        if not w or not r:
            empty_fields += 1

        # Check non-kana in reading (allow punctuation/dots, but flag latin or kanji)
        if re.search(r'[^\u3040-\u309F\u30A0-\u30FF\u30FC\s・.・-]', r):
            reading_non_kana.append((w, r))

        # Check meaning with Japanese
        meaning_str = " ".join(meanings)
        if re.search(r'[\u3040-\u309F\u30A0-\u30FF\u4E00-\u9FAF]', meaning_str):
            meaning_with_jp.append((w, meaning_str))

        # Check duplicates
        key = f"{w}|{r}"
        if key in seen:
            duplicates.append(key)
        else:
            seen[key] = True

        # Check specific words
        if w in specific_checks:
            found_specific[w] = item

    print(f"Total vocabulary items checked: {len(vocab)}")
    print(f"Duplicates found: {len(duplicates)}")
    print(f"Readings with non-kana: {len(reading_non_kana)}")
    print(f"Meanings containing Japanese characters: {len(meaning_with_jp)}")

    for w, spec in specific_checks.items():
        if w not in found_specific:
            defects.append(f"MISSING: Word '{w}' was not found in vocabulary dataset.")
            continue
        item = found_specific[w]
        actual_r = item.get('reading', '')
        actual_m = " ".join(item.get('meanings') or [item.get('meaning', '')])
        examples = [e.get('ja', '') for e in (item.get('examples') or [])]

        if 'expected_reading' in spec and actual_r != spec['expected_reading']:
            defects.append(f"DEFECT [{w}]: Reading is '{actual_r}', expected '{spec['expected_reading']}'.")
        if 'expected_meaning' in spec and spec['expected_meaning'] not in actual_m:
            defects.append(f"DEFECT [{w}]: Meaning is '{actual_m}', expected to contain '{spec['expected_meaning']}'.")
        if 'must_not_contain' in spec:
            for ex in examples:
                if spec['must_not_contain'] in ex:
                    defects.append(f"DEFECT [{w}]: Example contains forbidden string '{spec['must_not_contain']}'.")
        if 'must_contain' in spec:
            has_word = any(spec['must_contain'] in ex or '低' in ex for ex in examples)
            if not has_word:
                defects.append(f"DEFECT [{w}]: Examples do not contain '{spec['must_contain']}'.")

    return defects

def check_kanji(kanji_list):
    print("\n--- 2. KANJI AUDIT ---")
    defects = []
    raw_str = json.dumps(kanji_list)

    # Stroke count checks
    expected_strokes = {'草': 9, '部': 11, '教': 11, '授': 11}
    for k in kanji_list:
        ch = k.get('character')
        strokes = k.get('strokes')
        if ch in expected_strokes:
            if strokes != expected_strokes[ch]:
                defects.append(f"DEFECT [Kanji {ch}]: Has {strokes} strokes, expected {expected_strokes[ch]}.")

        # 口 check
        if ch == '口':
            onyomi = k.get('onyomi') or []
            if any('モク' in o for o in onyomi):
                defects.append(f"DEFECT [Kanji 口]: Lists onyomi 'モク' (belonging to 目).")

    # Ligature artifacts check
    ligatures = re.findall(r'(\uFB01|\uFB02|ﬁ|ﬂ|ﬁ\s*ve|sufﬁ\s*x)', raw_str)
    if ligatures:
        defects.append(f"DEFECT [Kanji]: Found {len(ligatures)} ligature artifacts ('ﬁ', 'ﬂ', 'sufﬁ x').")

    # Missing readings check
    required_readings = ['七', '大', '下', '分', '生', '早', '洋', '合', '着', '付', '親', '地', '通', '向', '然', '歳']
    for ch in required_readings:
        found = next((k for k in kanji_list if k.get('character') == ch), None)
        if not found:
            defects.append(f"MISSING: Kanji '{ch}' not found.")
        else:
            on = found.get('onyomi') or []
            kun = found.get('kunyomi') or []
            rd = found.get('reading') or ''
            if not on and not kun and not rd:
                defects.append(f"DEFECT [Kanji {ch}]: Has no on'yomi or kun'yomi reading.")

    return defects

def check_kana(kana_data):
    print("\n--- 3. KANA AUDIT ---")
    defects = []
    for cell in kana_data:
        hira = cell.get('hiragana', '')
        kata = cell.get('katakana', '')
        romaji = cell.get('romaji', '')
        if hira and not re.match(r'^[\u3040-\u309Fー]+$', hira):
            defects.append(f"DEFECT [Kana {romaji}]: Hiragana '{hira}' contains invalid characters.")
        if kata and not re.match(r'^[\u30A0-\u30FFー]+$', kata):
            defects.append(f"DEFECT [Kana {romaji}]: Katakana '{kata}' contains invalid characters.")
        if hira and kata and hira == kata:
            defects.append(f"DEFECT [Kana {romaji}]: Hiragana and Katakana are identical ('{hira}').")

    print(f"Total kana cells audited: {len(kana_data)}")
    return defects

def main():
    if sys.stdout.encoding != 'utf-8':
        try:
            sys.stdout.reconfigure(encoding='utf-8')
        except Exception:
            pass

    print("====================================================")
    print("JLPT STUDY HUB — OFFLINE DATA VALIDATION SUITE")
    print("====================================================\n")

    base_dir = os.path.dirname(os.path.abspath(__file__))
    workspace = base_dir

    vocab_file = os.path.join(workspace, 'data', 'vocab_source_900.json')
    supp_file = os.path.join(workspace, 'data', 'study_supplement.json')
    kanji_file = os.path.join(workspace, 'data', 'kanji_flashcards.json')
    kana_file = os.path.join(workspace, 'data', 'kana.json')

    all_defects = []

    # 1. Load Vocab
    vocab_data = []
    if os.path.exists(vocab_file):
        with open(vocab_file, 'r', encoding='utf-8') as f:
            vocab_data.extend(json.load(f))
    if os.path.exists(supp_file):
        with open(supp_file, 'r', encoding='utf-8') as f:
            supp = json.load(f)
            vocab_data.extend(supp.get('vocabulary', []))

    all_defects.extend(check_vocab(vocab_data))

    # 2. Load Kanji
    kanji_data = []
    if os.path.exists(kanji_file):
        with open(kanji_file, 'r', encoding='utf-8') as f:
            kanji_data.extend(json.load(f))
    all_defects.extend(check_kanji(kanji_data))

    # 3. Load Kana
    kana_data = []
    if os.path.exists(kana_file):
        with open(kana_file, 'r', encoding='utf-8') as f:
            kana_data = json.load(f)
    all_defects.extend(check_kana(kana_data))

    print("\n====================================================")
    print(f"AUDIT SUMMARY: {len(all_defects)} DEFECTS DETECTED")
    print("====================================================")
    for i, d in enumerate(all_defects, 1):
        print(f"[{i:02d}] {d}")

    if all_defects:
        print("\nSTATUS: FAIL (Data issues must be addressed)")
        sys.exit(1)
    else:
        print("\nSTATUS: PASS (All data checks satisfied)")
        sys.exit(0)

if __name__ == '__main__':
    main()
