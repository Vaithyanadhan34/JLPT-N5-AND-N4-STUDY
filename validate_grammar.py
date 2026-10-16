# -*- coding: utf-8 -*-
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

HIRAGANA_REGEX = re.compile(r'^[\u3040-\u309Fー・…\s]+$')
KANJI_REGEX = re.compile(r'[\u4E00-\u9FFF]')
RT_REGEX = re.compile(r'<rt>(.*?)</rt>')

def validate():
    grammar_file = os.path.join('data', 'grammar.json')
    if not os.path.exists(grammar_file):
        print(f"FAIL: {grammar_file} does not exist.")
        sys.exit(1)

    with open(grammar_file, 'r', encoding='utf-8') as f:
        data = json.load(f)

    errors = []
    warnings = []

    seen_ids = set()
    book_pattern_count = 0
    lesson_pattern_map = {}

    for i, item in enumerate(data):
        item_id = item.get('id')
        if not item_id:
            errors.append(f"Item #{i} is missing an 'id'.")
        elif item_id in seen_ids:
            errors.append(f"Duplicate id found: '{item_id}'.")
        else:
            seen_ids.add(item_id)

        is_book = item.get('isBookPattern', False)
        if is_book:
            book_pattern_count += 1
            lesson = item.get('lesson')
            pattern_no = item.get('patternNo')

            # Lesson range check 1-32
            if lesson is None or not (1 <= lesson <= 32):
                errors.append(f"[{item_id}] Lesson '{lesson}' is outside valid range (1–32).")

            # Pattern range check 1-4
            if pattern_no is None or not (1 <= pattern_no <= 4):
                errors.append(f"[{item_id}] PatternNo '{pattern_no}' is outside valid range (1–4).")

            key = (lesson, pattern_no)
            if key in lesson_pattern_map:
                errors.append(f"Duplicate lesson/pattern slot: Lesson {lesson}, Pattern {pattern_no} used by both '{lesson_pattern_map[key]}' and '{item_id}'.")
            else:
                lesson_pattern_map[key] = item_id

            # Formation & meaning
            if not item.get('formation', '').strip():
                errors.append(f"[{item_id}] Missing formation.")
            if not item.get('meaning', '').strip():
                errors.append(f"[{item_id}] Missing meaning.")

            # BookRef check
            book_ref = item.get('bookRef')
            if not book_ref or not isinstance(book_ref, dict):
                errors.append(f"[{item_id}] Missing bookRef dictionary.")
            else:
                if book_ref.get('lesson') != lesson or book_ref.get('pattern') != pattern_no or not book_ref.get('page'):
                    errors.append(f"[{item_id}] Inconsistent bookRef: {book_ref}")

            # Examples check
            examples = item.get('examples', [])
            if not examples or len(examples) < 2:
                errors.append(f"[{item_id}] Book patterns must have at least 2 examples, got {len(examples)}.")

            for ex_idx, ex in enumerate(examples):
                ja = ex.get('ja', '').strip()
                en = ex.get('en', '').strip()
                furigana = ex.get('furigana', '').strip()

                if not ja:
                    errors.append(f"[{item_id}] Example #{ex_idx+1} has empty Japanese sentence.")
                if not en or 'Translating sentence' in en:
                    errors.append(f"[{item_id}] Example #{ex_idx+1} has empty or placeholder English translation.")

                # Furigana check
                if KANJI_REGEX.search(ja):
                    if '<ruby>' not in furigana or '<rt>' not in furigana:
                        errors.append(f"[{item_id}] Example #{ex_idx+1} has kanji but missing <ruby>/<rt> in furigana: '{furigana}'.")
                    
                    # Validate all <rt> contain only hiragana
                    rts = RT_REGEX.findall(furigana)
                    for rt in rts:
                        if not HIRAGANA_REGEX.match(rt):
                            errors.append(f"[{item_id}] Example #{ex_idx+1} non-hiragana found in <rt>: '{rt}'.")

    # Book pattern count check
    if book_pattern_count != 116:
        errors.append(f"Expected exactly 116 book patterns, found {book_pattern_count}.")

    print("========================================")
    print("GRAMMAR VALIDATION REPORT")
    print("========================================")
    print(f"Total entries: {len(data)}")
    print(f"Book patterns: {book_pattern_count} / 116")
    print(f"Lessons covered: {len(set(k[0] for k in lesson_pattern_map.keys()))} / 32")
    print(f"Warnings: {len(warnings)}")
    print(f"Errors: {len(errors)}")

    if errors:
        print("\nERRORS FOUND:")
        for err in errors[:30]:
            print(" -", err)
        if len(errors) > 30:
            print(f" ... and {len(errors) - 30} more errors.")
        sys.exit(1)
    else:
        print("\nPASS: All grammar validation checks passed successfully with 0 errors!")
        sys.exit(0)

if __name__ == '__main__':
    validate()
