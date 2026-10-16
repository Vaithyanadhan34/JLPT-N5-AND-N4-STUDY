# -*- coding: utf-8 -*-
import json
import os
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# Import the 116 book pattern definitions
import book_grammar_spec1
import book_grammar_spec2

def normalize_pattern(p):
    if not p:
        return ''
    s = p.replace('～', '').replace('〜', '').replace('・', '').replace('/', '').replace('／', '')
    s = re.sub(r'［.*?］', '', s)
    s = re.sub(r'【.*?】', '', s)
    s = re.sub(r'（.*?）', '', s)
    s = re.sub(r'\(.*?\)', '', s)
    return s.strip()

def build():
    book_lessons = book_grammar_spec1.LESSONS_1_TO_16 + book_grammar_spec2.LESSONS_17_TO_32
    print(f"Loaded {len(book_lessons)} lessons.")

    # Load OpenJLPT datasets
    g5_path = os.path.join('scratch', 'g5.json')
    g4_path = os.path.join('scratch', 'g4.json')
    open_items = []
    if os.path.exists(g5_path):
        with open(g5_path, 'r', encoding='utf-8') as f:
            open_items.extend(json.load(f))
    if os.path.exists(g4_path):
        with open(g4_path, 'r', encoding='utf-8') as f:
            open_items.extend(json.load(f))
    print(f"Loaded {len(open_items)} OpenJLPT items.")

    # Track matches
    used_open_ids = set()
    coverage_table = []
    final_grammar = []

    for l in book_lessons:
        lesson_num = l['lesson']
        lesson_title = l['title']
        lesson_page = l['page']

        for p in l['patterns']:
            p_no = p['no']
            site_id = f"g-l{lesson_num}-{p_no}"
            norm_b = normalize_pattern(p['pattern'])

            matched_open = None
            best_score = 0

            # Match against OpenJLPT
            for o in open_items:
                if o['id'] in used_open_ids:
                    continue
                norm_o = normalize_pattern(o.get('pattern', ''))
                if not norm_o or not norm_b:
                    continue
                # Exact or high match
                if norm_b == norm_o:
                    matched_open = o
                    best_score = 100
                    break
                elif norm_b in norm_o or norm_o in norm_b:
                    score = min(len(norm_b), len(norm_o)) / max(len(norm_b), len(norm_o))
                    if score > best_score and score >= 0.6:
                        best_score = score
                        matched_open = o

            status = "MATCHED" if matched_open else "ADDED_NEW"
            open_id = matched_open['id'] if matched_open else "-"
            if matched_open:
                used_open_ids.add(matched_open['id'])

            coverage_table.append({
                "lesson": lesson_num,
                "lessonTitle": lesson_title,
                "patternNo": p_no,
                "pattern": p['pattern'],
                "page": lesson_page,
                "siteId": site_id,
                "status": status,
                "openJlptId": open_id
            })

            # Construct final entry
            entry = {
                "id": site_id,
                "lesson": lesson_num,
                "lessonTitle": lesson_title,
                "patternNo": p_no,
                "pattern": p['pattern'],
                "title": p.get('title', p['pattern']),
                "formation": p.get('formation', ''),
                "meaning": p.get('meaning', ''),
                "notes": p.get('notes', ''),
                "cautions": p.get('cautions', ''),
                "level": p.get('level', 'N4'),
                "tags": p.get('tags', []),
                "contrastWith": p.get('contrastWith', []),
                "examples": p.get('examples', []),
                "bookRef": {
                    "lesson": lesson_num,
                    "pattern": p_no,
                    "page": lesson_page,
                    "bookTitle": "Nihongo Challenge N4 文法と読む練習"
                },
                "isBookPattern": True,
                "isExtra": False,
                "openJlptId": open_id if open_id != '-' else None
            }
            final_grammar.append(entry)

    # Now add remaining OpenJLPT items as supplementary / extra entries
    extra_count = 0
    for o in open_items:
        if o['id'] not in used_open_ids:
            extra_count += 1
            # Ensure examples have valid furigana fallback
            examples = []
            for ex in o.get('examples', []):
                examples.append({
                    "ja": ex.get('ja', ''),
                    "furigana": ex.get('furigana') or ex.get('ja', ''),
                    "en": ex.get('en', ''),
                    "level": o.get('level', 'N5')
                })
            entry = {
                "id": o['id'],
                "lesson": None,
                "lessonTitle": None,
                "patternNo": None,
                "pattern": o.get('pattern', ''),
                "title": o.get('pattern', ''),
                "formation": o.get('formation', ''),
                "meaning": o.get('meaning', ''),
                "notes": o.get('notes', ''),
                "cautions": "",
                "level": o.get('level', 'N5'),
                "tags": o.get('tags', []) + ["supplementary"],
                "contrastWith": [],
                "examples": examples,
                "bookRef": None,
                "isBookPattern": False,
                "isExtra": True,
                "openJlptId": o['id']
            }
            final_grammar.append(entry)

    print(f"Total book patterns: {len(coverage_table)}")
    print(f"Matched with OpenJLPT: {sum(1 for c in coverage_table if c['status'] == 'MATCHED')}")
    print(f"Added as new book patterns: {sum(1 for c in coverage_table if c['status'] == 'ADDED_NEW')}")
    print(f"Extra OpenJLPT items retained: {extra_count}")
    print(f"Total entries in final_grammar: {len(final_grammar)}")

    # Write data/grammar.json
    os.makedirs('data', exist_ok=True)
    with open('data/grammar.json', 'w', encoding='utf-8') as f:
        json.dump(final_grammar, f, ensure_ascii=False, indent=2)
    print("Wrote data/grammar.json successfully.")

    # Write coverage report
    os.makedirs('scratch', exist_ok=True)
    with open('scratch/grammar_coverage.json', 'w', encoding='utf-8') as f:
        json.dump(coverage_table, f, ensure_ascii=False, indent=2)
    print("Wrote scratch/grammar_coverage.json successfully.")

if __name__ == '__main__':
    build()
