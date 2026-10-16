# -*- coding: utf-8 -*-
import json
import re
import sys

sys.stdout.reconfigure(encoding='utf-8')

# 1. Fix vocab_source_900.json
with open('data/vocab_source_900.json', 'r', encoding='utf-8') as f:
    vocab_data = json.load(f)

new_vocab = []
for item in vocab_data:
    # Remove ligatures in all string fields
    for k, v in item.items():
        if isinstance(v, str):
            item[k] = v.replace('ﬁ', 'fi').replace('ﬂ', 'fl')

    s_no = item.get('source_no')

    # Item 330: 教わる & 学生
    if s_no == 330 or item.get('word') == '教わる':
        item['word'] = '教わる'
        item['reading'] = 'おそわる'
        item['meaning'] = 'to be taught / to learn'
        item['example'] = '先生に漢字を教わりました。'
        item['translation'] = 'I was taught kanji by the teacher.'
        item['example_en'] = 'I was taught kanji by the teacher.'
        item['furigana'] = [{'text': '先生', 'reading': 'せんせい'}, {'text': 'に', 'reading': None}, {'text': '漢字', 'reading': 'かんじ'}, {'text': 'を', 'reading': None}, {'text': '教', 'reading': 'おそ'}, {'text': 'わりました。', 'reading': None}]
        new_vocab.append(item)

        # Insert restored 学生
        student_item = {
            'source_no': 331,
            'word': '学生',
            'reading': 'がくせい',
            'meaning': 'student',
            'example': '私は日本語の学生です。',
            'translation': 'I am a student of Japanese.',
            'example_en': 'I am a student of Japanese.',
            'furigana': [{'text': '私', 'reading': 'わたし'}, {'text': 'は', 'reading': None}, {'text': '日本語', 'reading': 'にほんご'}, {'text': 'の', 'reading': None}, {'text': '学生', 'reading': 'がくせい'}, {'text': 'です。', 'reading': None}]
        }
        new_vocab.append(student_item)

    # Item 658: 旅行会社 & 切符売り場
    elif s_no == 658 or item.get('word') == '旅行会社':
        item['word'] = '旅行会社'
        item['reading'] = 'りょこうがいしゃ'
        item['meaning'] = 'travel agency'
        item['example'] = '旅行会社で予約しました。'
        item['translation'] = 'I made a reservation at a travel agency.'
        item['example_en'] = 'I made a reservation at a travel agency.'
        item['furigana'] = [{'text': '旅行会社', 'reading': 'りょこうがいしゃ'}, {'text': 'で', 'reading': None}, {'text': '予約', 'reading': 'よやく'}, {'text': 'しました。', 'reading': None}]
        new_vocab.append(item)

        # Insert restored 切符売り場
        ticket_item = {
            'source_no': 659,
            'word': '切符売り場',
            'reading': 'きっぷうりば',
            'meaning': 'ticket counter / ticket office',
            'example': '切符売り場はあそこです。',
            'translation': 'The ticket counter is over there.',
            'example_en': 'The ticket counter is over there.',
            'furigana': [{'text': '切符', 'reading': 'きっぷ'}, {'text': '売', 'reading': 'う'}, {'text': 'り', 'reading': None}, {'text': '場', 'reading': 'ば'}, {'text': 'はあそこです。', 'reading': None}]
        }
        new_vocab.append(ticket_item)

    # Item 744: 信じる & 必要になる
    elif s_no == 744 or (item.get('word') == '信じる' and '必要になる' in item.get('example', '')):
        item['word'] = '信じる'
        item['reading'] = 'しんじる'
        item['meaning'] = 'to believe'
        item['example'] = '友達を信じています。'
        item['translation'] = 'I believe in my friend.'
        item['example_en'] = 'I believe in my friend.'
        item['furigana'] = [{'text': '友達', 'reading': 'ともだち'}, {'text': 'を', 'reading': None}, {'text': '信', 'reading': 'しん'}, {'text': 'じています。', 'reading': None}]
        new_vocab.append(item)

        # Insert restored 必要になる
        become_nec_item = {
            'source_no': 745,
            'word': '必要になる',
            'reading': 'ひつようになる',
            'meaning': 'to become necessary',
            'example': '旅行ではお金が必要になります。',
            'translation': 'Money becomes necessary when traveling.',
            'example_en': 'Money becomes necessary when traveling.',
            'furigana': [{'text': '旅行', 'reading': 'りょこう'}, {'text': 'ではお', 'reading': None}, {'text': '金', 'reading': 'かね'}, {'text': 'が', 'reading': None}, {'text': '必要', 'reading': 'ひつよう'}, {'text': 'になります。', 'reading': None}]
        }
        new_vocab.append(become_nec_item)

    # Item 171: 取る
    elif item.get('word') == '取る' and '写真' in item.get('example', ''):
        item['meaning'] = 'to take / to pass'
        item['example'] = '机の上からペンを取ります。'
        item['translation'] = 'I take a pen from the desk.'
        item['example_en'] = 'I take a pen from the desk.'
        item['furigana'] = [{'text': '机', 'reading': 'つくえ'}, {'text': 'の', 'reading': None}, {'text': '上', 'reading': 'うえ'}, {'text': 'からペンを', 'reading': None}, {'text': '取', 'reading': 'と'}, {'text': 'ります。', 'reading': None}]
        new_vocab.append(item)

    else:
        new_vocab.append(item)

with open('data/vocab_source_900.json', 'w', encoding='utf-8') as f:
    json.dump(new_vocab, f, ensure_ascii=False, indent=2)

print(f"Updated vocab_source_900.json: {len(new_vocab)} entries (restored 学生, 切符売り場, 必要になる; fixed 取る, 旅行会社, 教わる).")

# 2. Fix kanji_flashcards.json
with open('data/kanji_flashcards.json', 'r', encoding='utf-8') as f:
    kanji_data = json.load(f)

for item in kanji_data:
    # Remove ligatures
    for k, v in item.items():
        if isinstance(v, str):
            item[k] = v.replace('ﬁ', 'fi').replace('ﬂ', 'fl')

    ch = item.get('character')
    # Strokes KANJIDIC2 alignment: 草9, 部11, 教11, 授11
    if ch == '草':
        item['strokes'] = 9
    elif ch == '部':
        item['strokes'] = 11
    elif ch == '教':
        item['strokes'] = 11
    elif ch == '授':
        item['strokes'] = 11
    elif ch == '口':
        # Remove stray 'モク' from 口
        if 'reading_info' in item:
            item['reading_info'] = item['reading_info'].replace('/ モク moku', '').replace('モク moku', '').strip()

with open('data/kanji_flashcards.json', 'w', encoding='utf-8') as f:
    json.dump(kanji_data, f, ensure_ascii=False, indent=2)

print("Updated kanji_flashcards.json (草9, 部11, 教11, 授11, 口 has no モク, ligatures cleaned).")
