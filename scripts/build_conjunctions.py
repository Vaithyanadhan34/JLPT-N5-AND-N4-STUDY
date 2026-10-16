# -*- coding: utf-8 -*-
import json
import os
import sys

sys.stdout.reconfigure(encoding='utf-8')

conjunctions_data = {
    "credit": "Lesson/page references follow 'Nihongo Challenge N4 文法と読む練習' (ASK Publishing). Content is for personal study.",
    "groups": [
        {
            "id": "group-1",
            "no": 1,
            "titleJa": "情報を付け加える",
            "titleEn": "Adding Information (Addition)",
            "description": "Used to add further details, sequential steps, or extra reasons."
        },
        {
            "id": "group-2",
            "no": 2,
            "titleJa": "原因・理由と結果をつなぐ",
            "titleEn": "Cause, Reason and Result",
            "description": "Connects a cause or reason in the first clause to the result or consequence."
        },
        {
            "id": "group-3",
            "no": 3,
            "titleJa": "前のことと反対・予想と違うことをつなぐ",
            "titleEn": "Contrast and Unexpected Outcome",
            "description": "Contrasts two opposing facts or shows an outcome contrary to expectation."
        },
        {
            "id": "group-4",
            "no": 4,
            "titleJa": "例をあげる・話題を変える・話を始める",
            "titleEn": "Examples, Transition and Topic Change",
            "description": "Used to give examples, initiate conversation, or introduce a new topic."
        }
    ],
    "items": [
        {
            "id": "conj-soshite",
            "group": "group-1",
            "word": "そして",
            "meaning": "And / and then",
            "notes": "Connects sentences smoothly to add facts, actions, or descriptions.",
            "examples": [
                {
                    "ja": "朝起きてシャワーを浴びました。そして、朝ご飯を食べました。",
                    "furigana": "<ruby>朝<rt>あさ</rt></ruby><ruby>起<rt>お</rt></ruby>きてシャワーを<ruby>浴<rt>あ</rt></ruby>びました。そして、<ruby>朝<rt>あさ</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べました。",
                    "en": "I got up in the morning and took a shower. And then, I ate breakfast."
                },
                {
                    "ja": "彼女は親切で、そしてとても仕事が速いです。",
                    "furigana": "<ruby>彼女<rt>かのじょ</rt></ruby>は<ruby>親切<rt>しんせつ</rt></ruby>で、そしてとても<ruby>仕事<rt>しごと</rt></ruby>が<ruby>速<rt>はや</rt></ruby>いです。",
                    "en": "She is kind, and furthermore her work is very fast."
                }
            ]
        },
        {
            "id": "conj-sorekara",
            "group": "group-1",
            "word": "それから",
            "meaning": "And then / after that",
            "notes": "Emphasizes chronological time sequence of events.",
            "examples": [
                {
                    "ja": "図書館で本を借りました。それから、友達の家へ行きました。",
                    "furigana": "<ruby>図書館<rt>としょかん</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>を<ruby>借<rt>か</rt></ruby>りました。それから、<ruby>友達<rt>ともだち</rt></ruby>の<ruby>家<rt>いえ</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きました。",
                    "en": "I borrowed a book at the library. After that, I went to my friend's house."
                },
                {
                    "ja": "ノートを一冊買いました。それから、消しゴムも一つ買いました。",
                    "furigana": "ノートを<ruby>一冊<rt>いっさつ</rt></ruby><ruby>買<rt>か</rt></ruby>いました。それから、<ruby>消<rt>け</rt></ruby>しゴムも<ruby>一<rt>ひと</rt></ruby>つ<ruby>買<rt>か</rt></ruby>いました。",
                    "en": "I bought one notebook. And also, I bought one eraser."
                }
            ]
        },
        {
            "id": "conj-soreni",
            "group": "group-1",
            "word": "それに",
            "meaning": "Moreover / in addition / besides",
            "notes": "Adds another parallel positive or negative factor to reinforce a point.",
            "examples": [
                {
                    "ja": "このレストランの料理は美味しいです。それに、値段も安いです。",
                    "furigana": "このレストランの<ruby>料理<rt>りょうり</rt></ruby>は<ruby>美味<rt>おい</rt></ruby>しいです。それに、<ruby>値段<rt>ねだん</rt></ruby>も<ruby>安<rt>やす</rt></ruby>いです。",
                    "en": "The food at this restaurant is delicious. Besides, the prices are cheap."
                },
                {
                    "ja": "今日は雨が降っています。それに、風も強いです。",
                    "furigana": "<ruby>今日<rt>きょう</rt></ruby>は<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>っています。それに、<ruby>風<rt>かぜ</rt></ruby>も<ruby>強<rt>つよ</rt></ruby>いです。",
                    "en": "It is raining today. In addition, the wind is also strong."
                }
            ]
        },
        {
            "id": "conj-sonoue",
            "group": "group-1",
            "word": "そのうえ",
            "meaning": "On top of that / furthermore",
            "notes": "Adds an even stronger additional condition in the same positive or negative direction.",
            "examples": [
                {
                    "ja": "彼は英語が上手です。そのうえ、中国語も話せます。",
                    "furigana": "<ruby>彼<rt>かれ</rt></ruby>は<ruby>英語<rt>えいご</rt></ruby>が<ruby>上手<rt>じょうず</rt></ruby>です。そのうえ、<ruby>中国語<rt>ちゅうごくご</rt></ruby>も<ruby>話<rt>はな</rt></ruby>せます。",
                    "en": "He is skilled in English. On top of that, he can also speak Chinese."
                },
                {
                    "ja": "道に迷ってしまいました。そのうえ、財布も落としました。",
                    "furigana": "<ruby>道<rt>みち</rt></ruby>に<ruby>迷<rt>まよ</rt></ruby>ってしまいました。そのうえ、<ruby>財布<rt>さいふ</rt></ruby>も<ruby>落<rt>お</rt></ruby>としました。",
                    "en": "I got lost on the road. On top of that, I dropped my wallet too."
                }
            ]
        },
        {
            "id": "conj-dakara",
            "group": "group-2",
            "word": "だから",
            "meaning": "So / therefore",
            "notes": "Directly introduces a natural decision, consequence, or advice based on preceding reason.",
            "examples": [
                {
                    "ja": "明日は大事な試験があります。だから、今夜は早く寝ます。",
                    "furigana": "<ruby>明日<rt>あした</rt></ruby>は<ruby>大事<rt>だいじ</rt></ruby>な<ruby>試験<rt>しけん</rt></ruby>があります。だから、<ruby>今夜<rt>こんや</rt></ruby>は<ruby>早<rt>はや</rt></ruby>く<ruby>寝<rt>ね</rt></ruby>ます。",
                    "en": "There is an important exam tomorrow. Therefore, I will sleep early tonight."
                },
                {
                    "ja": "外はとても寒いです。だから、コートを着て出かけましょう。",
                    "furigana": "<ruby>外<rt>そと</rt></ruby>はとても<ruby>寒<rt>さむ</rt></ruby>いです。だから、コートを<ruby>着<rt>き</rt></ruby>て<ruby>出<rt>で</rt></ruby>かけましょう。",
                    "en": "It is very cold outside. So let's put on a coat and go out."
                }
            ]
        },
        {
            "id": "conj-sorede",
            "group": "group-2",
            "word": "それで",
            "meaning": "Because of that / and so",
            "notes": "Introduces a spontaneous result or consequence that naturally happened.",
            "examples": [
                {
                    "ja": "目覚まし時計が鳴りませんでした。それで、遅刻してしまいました。",
                    "furigana": "<ruby>目覚<rt>めざ</rt></ruby>まし<ruby>時計<rt>どけい</rt></ruby>が<ruby>鳴<rt>な</rt></ruby>りませんでした。それで、<ruby>遅刻<rt>ちこく</rt></ruby>してしまいました。",
                    "en": "The alarm clock did not ring. Because of that, I ended up being late."
                },
                {
                    "ja": "昨日たくさん歩きました。それで、今日は足が痛いです。",
                    "furigana": "<ruby>昨日<rt>きのう</rt></ruby>たくさん<ruby>歩<rt>ある</rt></ruby>きました。それで、<ruby>今日<rt>きょう</rt></ruby>は<ruby>足<rt>あし</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いです。",
                    "en": "I walked a lot yesterday. And so, my legs hurt today."
                }
            ]
        },
        {
            "id": "conj-suruto",
            "group": "group-2",
            "word": "すると",
            "meaning": "Then / thereupon",
            "notes": "Indicates that as an immediate consequence of the first action, an unexpected or noticeable event occurred.",
            "examples": [
                {
                    "ja": "カーテンを開けました。すると、外一面に雪が積もっていました。",
                    "furigana": "カーテンを<ruby>開<rt>あ</rt></ruby>けました。すると、<ruby>外<rt>そと</rt></ruby><ruby>一面<rt>いちめん</rt></ruby>に<ruby>雪<rt>ゆき</rt></ruby>が<ruby>積<rt>つ</rt></ruby>もっていました。",
                    "en": "I opened the curtains. Thereupon, snow had accumulated all over outside."
                },
                {
                    "ja": "薬を飲みました。すると、すぐに頭痛がおさまりました。",
                    "furigana": "<ruby>薬<rt>くすり</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みました。すると、すぐに<ruby>頭痛<rt>ずつう</rt></ruby>がおさまりました。",
                    "en": "I took the medicine. Then, my headache calmed down immediately."
                }
            ]
        },
        {
            "id": "conj-keredomo",
            "group": "group-3",
            "word": "けれども／けれど",
            "meaning": "Although / but",
            "notes": "Soft, polite contrast between two opposing clauses.",
            "examples": [
                {
                    "ja": "一生懸命勉強しました。けれども、試験は難しかったです。",
                    "furigana": "<ruby>一生懸命<rt>いっしょうけんめい</rt></ruby><ruby>勉強<rt>べんきょう</rt></ruby>しました。けれども、<ruby>試験<rt>しけん</rt></ruby>は<ruby>難<rt>むずか</rt></ruby>しかったです。",
                    "en": "I studied hard. However, the exam was difficult."
                },
                {
                    "ja": "このカメラは高いです。けれど、とても綺麗に撮れます。",
                    "furigana": "このカメラは<ruby>高<rt>たか</rt></ruby>いです。けれど、とても<ruby>綺麗<rt>きれい</rt></ruby>に<ruby>撮<rt>と</rt></ruby>れます。",
                    "en": "This camera is expensive. But, it takes very beautiful pictures."
                }
            ]
        },
        {
            "id": "conj-demo",
            "group": "group-3",
            "word": "でも",
            "meaning": "But / however",
            "notes": "Standard conversational conjunction introducing a counterpoint or contrast.",
            "examples": [
                {
                    "ja": "日本料理が好きです。でも、納豆はまだ食べられません。",
                    "furigana": "<ruby>日本料理<rt>にほんりょうり</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。でも、<ruby>納豆<rt>なっとう</rt></ruby>はまだ<ruby>食<rt>た</rt></ruby>べられません。",
                    "en": "I like Japanese food. But, I cannot eat natto yet."
                },
                {
                    "ja": "行きたいです。でも、明日は用事があります。",
                    "furigana": "<ruby>行<rt>い</rt></ruby>きたいです。でも、<ruby>明日<rt>あした</rt></ruby>は<ruby>用事<rt>ようじ</rt></ruby>があります。",
                    "en": "I want to go. But, I have errands tomorrow."
                }
            ]
        },
        {
            "id": "conj-shikashi",
            "group": "group-3",
            "word": "しかし",
            "meaning": "However / nevertheless",
            "notes": "Formal and clear contrast, often used in written language, speeches, or news.",
            "examples": [
                {
                    "ja": "雨が強く降っていました。しかし、試合は中止になりませんでした。",
                    "furigana": "<ruby>雨<rt>あめ</rt></ruby>が<ruby>強<rt>つよ</rt></ruby>く<ruby>降<rt>ふ</rt></ruby>っていました。しかし、<ruby>試合<rt>しあい</rt></ruby>は<ruby>中止<rt>ちゅうし</rt></ruby>になりませんでした。",
                    "en": "It was raining heavily. However, the match was not cancelled."
                },
                {
                    "ja": "彼は若いです。しかし、とても頼りになるリーダーです。",
                    "furigana": "<ruby>彼<rt>かれ</rt></ruby>は<ruby>若<rt>わか</rt></ruby>いです。しかし、とても<ruby>頼<rt>たよ</rt></ruby>りになるリーダーです。",
                    "en": "He is young. Nevertheless, he is a very dependable leader."
                }
            ]
        },
        {
            "id": "conj-tokoroga",
            "group": "group-3",
            "word": "ところが",
            "meaning": "Even so / but surprisingly / contrary to expectation",
            "notes": "Introduces an unexpected or surprising fact that directly contradicts what was anticipated.",
            "examples": [
                {
                    "ja": "天気予報では晴れると言っていました。ところが、午後から大雨になりました。",
                    "furigana": "<ruby>天気予報<rt>てんきよほう</rt></ruby>では<ruby>晴<rt>は</rt></ruby>れると<ruby>言<rt>い</rt></ruby>っていました。ところが、<ruby>午後<rt>ごご</rt></ruby>から<ruby>大雨<rt>おおあめ</rt></ruby>になりました。",
                    "en": "The weather forecast said it would be clear. But surprisingly, it started raining heavily in the afternoon."
                },
                {
                    "ja": "駅へ急いで行きました。ところが、電車はすでに出発していました。",
                    "furigana": "<ruby>駅<rt>えき</rt></ruby>へ<ruby>急<rt>いそ</rt></ruby>いで<ruby>行<rt>い</rt></ruby>きました。ところが、<ruby>電車<rt>でんしゃ</rt></ruby>はすでに出発していました。",
                    "en": "I hurried to the station. However, the train had already departed."
                }
            ]
        },
        {
            "id": "conj-tatoeba",
            "group": "group-4",
            "word": "たとえば",
            "meaning": "For example",
            "notes": "Introduces a concrete example illustrating a preceding general statement.",
            "examples": [
                {
                    "ja": "私は日本の伝統文化が好きです。たとえば、茶道や着物です。",
                    "furigana": "<ruby>私<rt>わたし</rt></ruby>は<ruby>日本<rt>にほん</rt></ruby>の<ruby>伝統文化<rt>でんとうぶんか</rt></ruby>が<ruby>好<rt>す</rt></ruby>きです。たとえば、<ruby>茶道<rt>さどう</rt></ruby>や<ruby>着物<rt>きもの</rt></ruby>です。",
                    "en": "I like Japanese traditional culture. For example, tea ceremony and kimono."
                },
                {
                    "ja": "スポーツなら何でも好きです。たとえば、水泳やテニスです。",
                    "furigana": "スポーツなら<ruby>何<rt>なん</rt></ruby>でも<ruby>好<rt>す</rt></ruby>きです。たとえば、<ruby>水泳<rt>すいえい</rt></ruby>やテニスです。",
                    "en": "I like any kind of sports. For example, swimming and tennis."
                }
            ]
        },
        {
            "id": "conj-soredewa",
            "group": "group-4",
            "word": "それでは／では／じゃあ",
            "meaning": "Well then / in that case",
            "notes": "それでは is formal, では is standard, and じゃあ is casual. Used to transition or begin an activity.",
            "examples": [
                {
                    "ja": "時間になりました。それでは、今日の授業を始めましょう。",
                    "furigana": "<ruby>時間<rt>じかん</rt></ruby>になりました。それでは、<ruby>今日<rt>きょう</rt></ruby>の<ruby>授業<rt>じゅぎょう</rt></ruby>を<ruby>始<rt>はじ</rt></ruby>めましょう。",
                    "en": "It is time. Well then, let's begin today's lesson."
                },
                {
                    "ja": "みんな揃いましたね。じゃあ、出発しましょう！",
                    "furigana": "みんな<ruby>揃<rt>そろ</rt></ruby>いましたね。じゃあ、<ruby>出発<rt>しゅっぱつ</rt></ruby>しましょう！",
                    "en": "Everyone is gathered. Well then, let's depart!"
                }
            ]
        },
        {
            "id": "conj-tokorode",
            "group": "group-4",
            "word": "ところで",
            "meaning": "By the way",
            "notes": "Shifts the conversation to a completely different topic.",
            "examples": [
                {
                    "ja": "明日の会議の準備は終わりました。ところで、田中さんの風邪はどうですか。",
                    "furigana": "<ruby>明日<rt>あした</rt></ruby>の<ruby>会議<rt>かいぎ</rt></ruby>の<ruby>準備<rt>じゅんび</rt></ruby>は<ruby>終<rt>お</rt></ruby>わりました。ところで、<ruby>田中<rt>たなか</rt></ruby>さんの<ruby>風邪<rt>かぜ</rt></ruby>はどうですか。",
                    "en": "The preparations for tomorrow's meeting are finished. By the way, how is Mr. Tanaka's cold?"
                },
                {
                    "ja": "今日はとても楽しかったです。ところで、今何時ですか。",
                    "furigana": "<ruby>今日<rt>きょう</rt></ruby>はとても<ruby>楽<rt>たの</rt></ruby>しかったです。ところで、<ruby>今<rt>いま</rt></ruby><ruby>何時<rt>なんじ</rt></ruby>ですか。",
                    "en": "Today was very enjoyable. By the way, what time is it now?"
                }
            ]
        }
    ],
    "drills": [
        {
            "id": "drill-1",
            "sentence": "朝起きてシャワーを浴びました。（　★　）、朝ご飯を食べました。",
            "options": ["そして", "しかし", "ところで", "たとえば"],
            "correct": "そして",
            "explanation": "時間的な順序で動作をつなげる「そして」が適切です。"
        },
        {
            "id": "drill-2",
            "sentence": "この店は美味しいです。（　★　）、値段も安いです。",
            "options": ["それに", "ところが", "それで", "ところで"],
            "correct": "それに",
            "explanation": "同じ方向の良い条件を付け加える「それに」が適切です。"
        },
        {
            "id": "drill-3",
            "sentence": "目覚ましが鳴りませんでした。（　★　）、遅刻してしまいました。",
            "options": ["それで", "ところが", "それでは", "たとえば"],
            "correct": "それで",
            "explanation": "原因から自然に起きた結果を導く「それで」が適切です。"
        },
        {
            "id": "drill-4",
            "sentence": "天気予報では晴れると言っていました。（　★　）、大雨が降ってきました。",
            "options": ["ところが", "だから", "そして", "そのうえ"],
            "correct": "ところが",
            "explanation": "予想と反対の意外な事態を導く「ところが」が適切です。"
        },
        {
            "id": "drill-5",
            "sentence": "私は日本の伝統文化が好きです。（　★　）、茶道や着物です。",
            "options": ["たとえば", "でも", "だから", "すると"],
            "correct": "たとえば",
            "explanation": "具体例を挙げる「たとえば」が適切です。"
        },
        {
            "id": "drill-6",
            "sentence": "準備は終わりました。（　★　）、田中さんの体調はどうですか。",
            "options": ["ところで", "だから", "そのうえ", "そして"],
            "correct": "ところで",
            "explanation": "話題を別のことに切り替える「ところで」が適切です。"
        }
    ]
}

os.makedirs('data', exist_ok=True)
with open('data/conjunctions.json', 'w', encoding='utf-8') as f:
    json.dump(conjunctions_data, f, ensure_ascii=False, indent=2)

print('Generated data/conjunctions.json with', len(conjunctions_data['items']), 'items and', len(conjunctions_data['drills']), 'drills.')
