# -*- coding: utf-8 -*-
# Lessons 1 to 16 specifications for "Nihongo Challenge N4 文法と読む練習" (ASK Publishing)

LESSONS_1_TO_16 = [
    {
        "lesson": 1,
        "title": "日本のお正月",
        "page": 26,
        "patterns": [
            {
                "no": 1,
                "title": "～ます／～ません",
                "pattern": "～ます／～ません",
                "formation": "V(ます形語幹) + ます／ません",
                "meaning": "Polite present or future tense (affirmative & negative)",
                "notes": "Used for polite everyday conversation. ～ませんか is also used for invitations or polite offers.",
                "cautions": "Basic polite form; do not use with intimate family or close friends where plain form (辞書形/ない形) is expected.",
                "level": "N5",
                "tags": ["verb-form", "politeness", "present-tense"],
                "contrastWith": ["～ました／～ませんでした", "～たい"],
                "examples": [
                    {
                        "ja": "私は毎朝七時に起きます。",
                        "furigana": "<ruby>私<rt>わたし</rt></ruby>は<ruby>毎朝<rt>まいあさ</rt></ruby><ruby>七時<rt>しちじ</rt></ruby>に<ruby>起<rt>お</rt></ruby>きます。",
                        "en": "I wake up at seven o'clock every morning.",
                        "level": "N5"
                    },
                    {
                        "ja": "夜はお酒を飲みません。",
                        "furigana": "<ruby>夜<rt>よる</rt></ruby>はお<ruby>酒<rt>さけ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みません。",
                        "en": "I do not drink alcohol in the evening.",
                        "level": "N5"
                    },
                    {
                        "ja": "いっしょにお茶を飲みませんか。",
                        "furigana": "いっしょにお<ruby>茶<rt>ちゃ</rt></ruby>を<ruby>飲<rt>の</rt></ruby>みませんか。",
                        "en": "Would you like to drink tea together?",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～ました／～ませんでした",
                "pattern": "～ました／～ませんでした",
                "formation": "V(ます形語幹) + ました／ませんでした",
                "meaning": "Polite past tense (affirmative & negative)",
                "notes": "Used to describe completed actions or states in polite speech.",
                "cautions": "For past continuous action, use ～ていました instead of simple ～ました.",
                "level": "N5",
                "tags": ["verb-form", "politeness", "past-tense"],
                "contrastWith": ["～ます／～ません", "～たことがある"],
                "examples": [
                    {
                        "ja": "昨日、日本語の辞書を買いました。",
                        "furigana": "<ruby>昨日<rt>きのう</rt></ruby>、<ruby>日本語<rt>にほんご</rt></ruby>の<ruby>辞書<rt>じしょ</rt></ruby>を<ruby>買<rt>か</rt></ruby>いました。",
                        "en": "Yesterday, I bought a Japanese dictionary.",
                        "level": "N5"
                    },
                    {
                        "ja": "昨夜はあまりよく眠れませんでした。",
                        "furigana": "<ruby>昨夜<rt>ゆうべ</rt></ruby>はあまりよく<ruby>眠<rt>ねむ</rt></ruby>れませんでした。",
                        "en": "I could not sleep very well last night.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～から～まで",
                "pattern": "～から～まで",
                "formation": "N(時間・場所) + から + N(時間・場所) + まで",
                "meaning": "From ~ to ~ (time or location limits)",
                "notes": "Can be used with time (時間), days (曜日), dates (日付), or places (場所).",
                "cautions": "When stating only the starting time or ending time, use ～からです or ～までです.",
                "level": "N5",
                "tags": ["particles", "time", "location"],
                "contrastWith": ["～までに"],
                "examples": [
                    {
                        "ja": "郵便局は朝九時から夕方五時まで開いています。",
                        "furigana": "<ruby>郵便局<rt>ゆうびんきょく</rt></ruby>は<ruby>朝<rt>あさ</rt></ruby><ruby>九時<rt>くじ</rt></ruby>から<ruby>夕方<rt>ゆうがた</rt></ruby><ruby>五時<rt>ごじ</rt></ruby>まで<ruby>開<rt>あ</rt></ruby>いています。",
                        "en": "The post office is open from 9:00 in the morning until 5:00 in the evening.",
                        "level": "N5"
                    },
                    {
                        "ja": "家から駅まで歩いて十分かかります。",
                        "furigana": "<ruby>家<rt>いえ</rt></ruby>から<ruby>駅<rt>えき</rt></ruby>まで<ruby>歩<rt>ある</rt></ruby>いて<ruby>十分<rt>じゅっぷん</rt></ruby>かかります。",
                        "en": "It takes ten minutes on foot from my house to the station.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 4,
                "title": "【場所】で",
                "pattern": "【場所】で",
                "formation": "N(場所) + で + V(動作動詞)",
                "meaning": "Action taking place at a location",
                "notes": "Indicates the physical place where an active event or dynamic action occurs.",
                "cautions": "Do not confuse with に, which marks the location of existence (いる/ある) or destination (行く/着く).",
                "level": "N5",
                "tags": ["particles", "location"],
                "contrastWith": ["【場所】に"],
                "examples": [
                    {
                        "ja": "静かな図書館で本を読みます。",
                        "furigana": "<ruby>静<rt>しず</rt></ruby>かな<ruby>図書館<rt>としょかん</rt></ruby>で<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みます。",
                        "en": "I read books at the quiet library.",
                        "level": "N5"
                    },
                    {
                        "ja": "駅の前の店で友達と昼ご飯を食べました。",
                        "furigana": "<ruby>駅<rt>えき</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>の<ruby>店<rt>みせ</rt></ruby>で<ruby>友達<rt>ともだち</rt></ruby>と<ruby>昼<rt>ひる</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べました。",
                        "en": "I ate lunch with a friend at a restaurant in front of the station.",
                        "level": "N5"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 2,
        "title": "雪が降りました",
        "page": 30,
        "patterns": [
            {
                "no": 1,
                "title": "～ながら",
                "pattern": "～ながら",
                "formation": "V(ます形語幹) + ながら、[主動作]",
                "meaning": "While doing A, doing B (simultaneous actions by the same person)",
                "notes": "The primary action (主動作) comes after ながら. The same subject must perform both actions.",
                "cautions": "Both actions must be performed by the same person; cannot be used when two different people are doing different things.",
                "level": "N4",
                "tags": ["simultaneous", "verb-form"],
                "contrastWith": ["～間に", "～とき"],
                "examples": [
                    {
                        "ja": "音楽を聞きながら部屋を掃除しました。",
                        "furigana": "<ruby>音楽<rt>おんがく</rt></ruby>を<ruby>聞<rt>き</rt></ruby>きながら<ruby>部屋<rt>へや</rt></ruby>を<ruby>掃除<rt>そうじ</rt></ruby>しました。",
                        "en": "I cleaned the room while listening to music.",
                        "level": "N4"
                    },
                    {
                        "ja": "毎朝、新聞を読みながら朝ご飯を食べます。",
                        "furigana": "<ruby>毎朝<rt>まいあさ</rt></ruby>、<ruby>新聞<rt>しんぶん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みながら<ruby>朝<rt>あさ</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べます。",
                        "en": "Every morning, I eat breakfast while reading the newspaper.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～たい／～たくない",
                "pattern": "～たい／～たくない",
                "formation": "V(ます形語幹) + たい／たくない",
                "meaning": "Want to / do not want to (first person desire)",
                "notes": "Expresses the speaker's own desire. The object can take either を or が.",
                "cautions": "Do NOT use directly toward superiors (目上の人) to ask their wishes. For a third person, use ～たがっている instead.",
                "level": "N5",
                "tags": ["desire", "speaker-intent"],
                "contrastWith": ["～がっている／～がる", "～ほしい"],
                "examples": [
                    {
                        "ja": "来年の夏休みに京都へ旅行に行きたいです。",
                        "furigana": "<ruby>来年<rt>らいねん</rt></ruby>の<ruby>夏休み<rt>なつやすみ</rt></ruby>に<ruby>京都<rt>きょうと</rt></ruby>へ<ruby>旅行<rt>りょこう</rt></ruby>に<ruby>行<rt>い</rt></ruby>きたいです。",
                        "en": "I want to go on a trip to Kyoto during next year's summer vacation.",
                        "level": "N5"
                    },
                    {
                        "ja": "今日は疲れたので、何もしたくないです。",
                        "furigana": "<ruby>今日<rt>きょう</rt></ruby>は<ruby>疲<rt>つか</rt></ruby>れたので、<ruby>何<rt>なに</rt></ruby>もしたくないです。",
                        "en": "Since I am tired today, I do not want to do anything.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～ことがある／～ないことがある",
                "pattern": "～ことがある／～ないことがある",
                "formation": "V(辞書形／ない形) + ことがある",
                "meaning": "Sometimes do / there are times when (occasional recurrence)",
                "notes": "Describes occasional occurrences or habits. Frequently paired with ときどき or たまに.",
                "cautions": "Do not confuse with ～たことがある (past experience). V辞書形/ない形 indicates occasional occurrence, while Vた形 indicates past experience.",
                "level": "N4",
                "tags": ["frequency", "habit"],
                "contrastWith": ["～たことがある／～たことがない"],
                "examples": [
                    {
                        "ja": "夜遅くまで仕事をして、終電に乗り遅れることがあります。",
                        "furigana": "<ruby>夜遅<rt>よるおそ</rt></ruby>くまで<ruby>仕事<rt>しごと</rt></ruby>をして、<ruby>終電<rt>しゅうでん</rt></ruby>に<ruby>乗<rt>の</rt></ruby>り<ruby>遅<rt>おく</rt></ruby>れることがあります。",
                        "en": "There are times when I work late into the night and miss the last train.",
                        "level": "N4"
                    },
                    {
                        "ja": "朝は忙しくて、朝ご飯を食べないことがあります。",
                        "furigana": "<ruby>朝<rt>あさ</rt></ruby>は<ruby>忙<rt>いそが</rt></ruby>しくて、<ruby>朝<rt>あさ</rt></ruby>ご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べないことがあります。",
                        "en": "Mornings are busy, so there are times when I do not eat breakfast.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 3,
        "title": "ボランティア教室へ",
        "page": 34,
        "patterns": [
            {
                "no": 1,
                "title": "～てください／～ないでください",
                "pattern": "～てください／～ないでください",
                "formation": "Vて形 + ください ／ Vない形 + でください",
                "meaning": "Please do ~ / please do not do ~ (polite request)",
                "notes": "Used to make a polite instruction, invitation, or request.",
                "cautions": "Not polite enough for senior executives or clients; in business honorific context, use ～てくださいませ or ～ていただけませんか.",
                "level": "N5",
                "tags": ["request", "politeness"],
                "contrastWith": ["～なさい", "～てはいけない／～てはだめ"],
                "examples": [
                    {
                        "ja": "名前をここに黒いペンで書いてください。",
                        "furigana": "<ruby>名前<rt>なまえ</rt></ruby>をここに<ruby>黒<rt>くろ</rt></ruby>いペンで<ruby>書<rt>か</rt></ruby>いてください。",
                        "en": "Please write your name here with a black pen.",
                        "level": "N5"
                    },
                    {
                        "ja": "危ないですから、ここで遊ばないでください。",
                        "furigana": "<ruby>危<rt>あぶ</rt></ruby>ないですから、ここで<ruby>遊<rt>あそ</rt></ruby>ばないでください。",
                        "en": "Because it is dangerous, please do not play here.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～てから",
                "pattern": "～てから",
                "formation": "Vて形 + から、[動作]",
                "meaning": "After doing A, then B (sequential action)",
                "notes": "Emphasizes that action A must be finished before action B can take place.",
                "cautions": "Do not confuse with ～から (reason/cause). Vて + から indicates temporal order.",
                "level": "N5",
                "tags": ["sequence", "time"],
                "contrastWith": ["～まえに", "～あと(で)"],
                "examples": [
                    {
                        "ja": "手をよく洗ってから、ご飯を食べましょう。",
                        "furigana": "<ruby>手<rt>て</rt></ruby>をよく<ruby>洗<rt>あら</rt></ruby>ってから、ご<ruby>飯<rt>はん</rt></ruby>を<ruby>食<rt>た</rt></ruby>べましょう。",
                        "en": "Let's wash our hands thoroughly before eating a meal.",
                        "level": "N5"
                    },
                    {
                        "ja": "仕事が終わってから、ジムへ運動に行きます。",
                        "furigana": "<ruby>仕事<rt>しごと</rt></ruby>が<ruby>終<rt>お</rt></ruby>わってから、ジムへ<ruby>運動<rt>うんどう</rt></ruby>に<ruby>行<rt>い</rt></ruby>きます。",
                        "en": "After work finishes, I go to the gym to exercise.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～たことがある／～たことがない",
                "pattern": "～たことがある／～たことがない",
                "formation": "Vた形 + ことがある／ない",
                "meaning": "Have done before / have never done before (past experience)",
                "notes": "Indicates whether the speaker has had the experience of doing something in their life.",
                "cautions": "Used for lifetime experiences, not for yesterday or immediate routines.",
                "level": "N5",
                "tags": ["experience", "verb-form"],
                "contrastWith": ["～ことがある／～ないことがある"],
                "examples": [
                    {
                        "ja": "富士山に一度登ったことがあります。",
                        "furigana": "<ruby>富士山<rt>ふじさん</rt></ruby>に<ruby>一度<rt>いちど</rt></ruby><ruby>登<rt>のぼ</rt></ruby>ったことがあります。",
                        "en": "I have climbed Mt. Fuji once before.",
                        "level": "N5"
                    },
                    {
                        "ja": "歌舞伎をまだ見たことがありません。",
                        "furigana": "<ruby>歌舞伎<rt>かぶき</rt></ruby>をまだ<ruby>見<rt>み</rt></ruby>たことがありません。",
                        "en": "I have not yet seen Kabuki.",
                        "level": "N5"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 4,
        "title": "好きな人にチョコレートを！",
        "page": 38,
        "patterns": [
            {
                "no": 1,
                "title": "もらう",
                "pattern": "もらう",
                "formation": "受取手(私) は／が + 送り手 に／から + 物 を + もらう",
                "meaning": "Receive something from someone",
                "notes": "The recipient is typically the speaker or in-group member.",
                "cautions": "From a superior, use いただく instead of もらう.",
                "level": "N5",
                "tags": ["giving-receiving", "verbs"],
                "contrastWith": ["くれる", "あげる／やる", "いただく／くださる／さしあげる"],
                "examples": [
                    {
                        "ja": "誕生日に姉からきれいなスカーフをもらいました。",
                        "furigana": "<ruby>誕生日<rt>たんじょうび</rt></ruby>に<ruby>姉<rt>あね</rt></ruby>からきれいなスカーフをもらいました。",
                        "en": "I received a pretty scarf from my older sister on my birthday.",
                        "level": "N5"
                    },
                    {
                        "ja": "友達に珍しい切手をもらいました。",
                        "furigana": "<ruby>友達<rt>ともだち</rt></ruby>に<ruby>珍<rt>めずら</rt></ruby>しい<ruby>切手<rt>きって</rt></ruby>をもらいました。",
                        "en": "I received rare postage stamps from a friend.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 2,
                "title": "くれる",
                "pattern": "くれる",
                "formation": "送り手 は／が + 受取手(私) に + 物 を + くれる",
                "meaning": "Someone gives something to me / my in-group",
                "notes": "The recipient must be the speaker or someone in the speaker's family/in-group.",
                "cautions": "The giver can never be 'I'. To say 'I give to someone', use あげる.",
                "level": "N5",
                "tags": ["giving-receiving", "verbs"],
                "contrastWith": ["あげる／やる", "もらう", "いただく／くださる／さしあげる"],
                "examples": [
                    {
                        "ja": "田中さんが私に美味しいお菓子をくれました。",
                        "furigana": "<ruby>田中<rt>たなか</rt></ruby>さんが<ruby>私<rt>わたし</rt></ruby>にお<ruby>い<rt>い</rt></ruby>しいお<ruby>菓子<rt>かし</rt></ruby>をくれました。",
                        "en": "Mr. Tanaka gave me delicious sweets.",
                        "level": "N5"
                    },
                    {
                        "ja": "母が暖かいセーターを編んでくれました。",
                        "furigana": "<ruby>母<rt>はは</rt></ruby>が<ruby>暖<rt>あたた</rt></ruby>かいセーターを<ruby>編<rt>あ</rt></ruby>んでくれました。",
                        "en": "My mother knitted a warm sweater for me.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 3,
                "title": "あげる／やる",
                "pattern": "あげる／やる",
                "formation": "私 は／が + 相手 に + 物 を + あげる／やる",
                "meaning": "Give something to someone / pets or plants",
                "notes": "あげる is used for peers or subordinates. やる is used for animals, plants, or small children.",
                "cautions": "To superiors, use さしあげる. Do not use あげる toward your boss or teacher directly.",
                "level": "N5",
                "tags": ["giving-receiving", "verbs"],
                "contrastWith": ["くれる", "もらう", "いただく／くださる／さしあげる"],
                "examples": [
                    {
                        "ja": "弟の入学祝いに時計をあげました。",
                        "furigana": "<ruby>弟<rt>おとうと</rt></ruby>の<ruby>入学祝い<rt>にゅうがくいわい</rt></ruby>に<ruby>時計<rt>とけい</rt></ruby>をあげました。",
                        "en": "I gave a watch to my younger brother for his school admission gift.",
                        "level": "N5"
                    },
                    {
                        "ja": "毎朝、庭の花に水をやります。",
                        "furigana": "<ruby>毎朝<rt>まいあさ</rt></ruby>、<ruby>庭<rt>にわ</rt></ruby>の<ruby>花<rt>はな</rt></ruby>に<ruby>水<rt>みず</rt></ruby>をやります。",
                        "en": "Every morning, I give water to the flowers in the garden.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～から (理由)",
                "pattern": "～から (理由)",
                "formation": "普／丁寧形 + から、[文]",
                "meaning": "Because / since (reason or cause)",
                "notes": "States a subjective reason or personal justification.",
                "cautions": "～から can sound direct or subjective; in formal polite correspondence, ～ので is preferred.",
                "level": "N5",
                "tags": ["reason", "cause"],
                "contrastWith": ["～ので", "～て (理由)"],
                "examples": [
                    {
                        "ja": "明日は早く出かけますから、今夜は早く寝ます。",
                        "furigana": "<ruby>明日<rt>あした</rt></ruby>は<ruby>早<rt>はや</rt></ruby>く<ruby>出<rt>で</rt></ruby>かけますから、<ruby>今夜<rt>こんや</rt></ruby>は<ruby>早<rt>はや</rt></ruby>く<ruby>寝<rt>ね</rt></ruby>ます。",
                        "en": "Because I will go out early tomorrow, I will go to bed early tonight.",
                        "level": "N5"
                    },
                    {
                        "ja": "雨が降っていますから、傘を持って行きましょう。",
                        "furigana": "<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>っていますから、<ruby>傘<rt>かさ</rt></ruby>を<ruby>持<rt>も</rt></ruby>って<ruby>行<rt>い</rt></ruby>きましょう。",
                        "en": "Since it is raining, let's take an umbrella with us.",
                        "level": "N5"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 5,
        "title": "フットサルのチームに入る",
        "page": 44,
        "patterns": [
            {
                "no": 1,
                "title": "～ことになる／～ないことになる",
                "pattern": "～ことになる／～ないことになる",
                "formation": "V(辞書形／ない形) + ことになる",
                "meaning": "It has been decided that ~ / turns out that ~ (external decision / rule)",
                "notes": "Indicates a decision made by an organization, external circumstances, or rules, not purely personal will.",
                "cautions": "Contrast with ～ことにする (which is a personal subjective decision).",
                "level": "N4",
                "tags": ["decision", "external-rules"],
                "contrastWith": ["～ことにする／～ないことにする"],
                "examples": [
                    {
                        "ja": "来月から大阪の支店へ転勤することになりました。",
                        "furigana": "<ruby>来月<rt>らいげつ</rt></ruby>から<ruby>大阪<rt>おおさか</rt></ruby>の<ruby>支店<rt>してん</rt></ruby>へ<ruby>転勤<rt>てんきん</rt></ruby>することになりました。",
                        "en": "It has been decided that I will transfer to the Osaka branch from next month.",
                        "level": "N4"
                    },
                    {
                        "ja": "工場の規則で、敷地内ではタバコを吸わないことになっています。",
                        "furigana": "<ruby>工場<rt>こうじょう</rt></ruby>の<ruby>規則<rt>きそく</rt></ruby>で、<ruby>敷地内<rt>しきちない</rt></ruby>ではタバコを<ruby>吸<rt>す</rt></ruby>わないことになっています。",
                        "en": "According to factory rules, smoking is not permitted on the premises.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～かどうか",
                "pattern": "～かどうか",
                "formation": "普通形(Aな/Nだは無) + かどうか、[文]",
                "meaning": "Whether or not ~",
                "notes": "Embeds a yes/no question clause inside a longer sentence.",
                "cautions": "For interrogative clauses with a question word (誰、何、どこ), use [疑問詞]～か instead of かどうか.",
                "level": "N4",
                "tags": ["embedded-clause", "questions"],
                "contrastWith": ["【疑問詞】～か"],
                "examples": [
                    {
                        "ja": "明日雨が降るかどうか、天気予報を確かめます。",
                        "furigana": "<ruby>明日<rt>あした</rt></ruby><ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>るかどうか、<ruby>天気予報<rt>てんきよほう</rt></ruby>を<ruby>確<rt>たし</rt></ruby>かめます。",
                        "en": "I will check the weather forecast to see whether or not it will rain tomorrow.",
                        "level": "N4"
                    },
                    {
                        "ja": "その計画が成功するかどうか、まだ分かりません。",
                        "furigana": "その<ruby>計画<rt>けいかく</rt></ruby>が<ruby>成功<rt>せいこう</rt></ruby>するかどうか、まだ<ruby>分<rt>わ</rt></ruby>かりません。",
                        "en": "I do not know yet whether or not that plan will succeed.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～ようになる",
                "pattern": "～ようになる",
                "formation": "V(辞書形／可能形／ない形) + ようになる",
                "meaning": "Come to be able to / reach the point where (gradual change in capacity or habit)",
                "notes": "Indicates a gradual transition from not being able to do something to being able to do it, or adopting a new habit.",
                "cautions": "Usually paired with potential verbs (可能動詞) or non-volitional verbs.",
                "level": "N4",
                "tags": ["change", "capacity", "habit"],
                "contrastWith": ["～ようにする／～ようにしている", "～になる／～くなる"],
                "examples": [
                    {
                        "ja": "練習を重ねて、日本語の新聞が読めるようになりました。",
                        "furigana": "<ruby>練習<rt>れんしゅう</rt></ruby>を<ruby>重<rt>かさ</rt></ruby>ねて、<ruby>日本語<rt>にほんご</rt></ruby>の<ruby>新聞<rt>しんぶん</rt></ruby>が<ruby>読<rt>よ</rt></ruby>めるようになりました。",
                        "en": "Through repeated practice, I have come to be able to read Japanese newspapers.",
                        "level": "N4"
                    },
                    {
                        "ja": "健康のために、毎日野菜をたくさん食べるようになりました。",
                        "furigana": "<ruby>健康<rt>けんこう</rt></ruby>のために、<ruby>毎日<rt>まいにち</rt></ruby><ruby>野菜<rt>やさい</rt></ruby>をたくさん<ruby>食<rt>た</rt></ruby>べるようになりました。",
                        "en": "For the sake of my health, I have started eating a lot of vegetables every day.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～だす",
                "pattern": "～だす",
                "formation": "V(ます形語幹) + だす",
                "meaning": "Suddenly begin to ~ / burst out ~",
                "notes": "Indicates a sudden, unexpected start of an action or natural phenomenon from within.",
                "cautions": "Contrast with ～はじめる (deliberate or standard starting). ～だす emphasizes suddenness or spontaneity.",
                "level": "N4",
                "tags": ["aspect", "sudden-action"],
                "contrastWith": ["～はじめる／～おわる"],
                "examples": [
                    {
                        "ja": "急に空が暗くなって、強い雨が降りだしました。",
                        "furigana": "<ruby>急<rt>きゅう</rt></ruby>に<ruby>空<rt>そら</rt></ruby>が<ruby>暗<rt>くら</rt></ruby>くなって、<ruby>強<rt>つよ</rt></ruby>い<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>りだしました。",
                        "en": "Suddenly the sky grew dark, and heavy rain began to fall.",
                        "level": "N4"
                    },
                    {
                        "ja": "赤ちゃんが突然大きな声で泣きだしました。",
                        "furigana": "<ruby>赤<rt>あか</rt></ruby>ちゃんが<ruby>突然<rt>とつぜん</rt></ruby><ruby>大<rt>おお</rt></ruby>きな<ruby>声<rt>こえ</rt></ruby>で<ruby>泣<rt>な</rt></ruby>きだしました。",
                        "en": "The baby suddenly burst into tears with a loud voice.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 6,
        "title": "日本料理を作りたい！",
        "page": 48,
        "patterns": [
            {
                "no": 1,
                "title": "～てもらう",
                "pattern": "～てもらう",
                "formation": "受取手(私) は／が + 行為者 に + Vて形 + もらう",
                "meaning": "Have someone do an action for me / receive a favor",
                "notes": "Expresses gratitude for receiving an action or service done by someone else.",
                "cautions": "From a superior or elder, use ～ていただく.",
                "level": "N4",
                "tags": ["favor", "giving-receiving"],
                "contrastWith": ["～てくれる", "～てあげる／～てやる"],
                "examples": [
                    {
                        "ja": "先生に作文の文法を直してもらいました。",
                        "furigana": "<ruby>先生<rt>せんせい</rt></ruby>に<ruby>作文<rt>さくぶん</rt></ruby>の<ruby>文法<rt>ぶんぽう</rt></ruby>を<ruby>直<rt>なお</rt></ruby>してもらいました。",
                        "en": "I had the teacher correct the grammar in my essay.",
                        "level": "N4"
                    },
                    {
                        "ja": "友達に引っ越しを手伝ってもらいました。",
                        "furigana": "<ruby>友達<rt>ともだち</rt></ruby>に<ruby>引<rt>ひ</rt></ruby>っ<ruby>越<rt>こ</rt></ruby>しを<ruby>手伝<rt>てつだ</rt></ruby>ってもらいました。",
                        "en": "I had a friend help me with moving house.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～てくれる",
                "pattern": "～てくれる",
                "formation": "行為者 は／が + 受取手(私) に + Vて形 + くれる",
                "meaning": "Someone does a favor for me / my in-group",
                "notes": "The focus is on the goodwill and kindness of the doer toward the speaker.",
                "cautions": "The giver cannot be 'I'. The recipient must be the speaker or speaker's family.",
                "level": "N4",
                "tags": ["favor", "giving-receiving"],
                "contrastWith": ["～てもらう", "～てあげる／～てやる"],
                "examples": [
                    {
                        "ja": "駅までの道を親切な人が教えてくれました。",
                        "furigana": "<ruby>駅<rt>えき</rt></ruby>までの<ruby>道<rt>みち</rt></ruby>を<ruby>親切<rt>しんせつ</rt></ruby>な<ruby>人<rt>ひと</rt></ruby>が<ruby>教<rt>おし</rt></ruby>えてくれました。",
                        "en": "A kind person showed me the way to the station.",
                        "level": "N4"
                    },
                    {
                        "ja": "重い荷物を持ってくれて、本当に助かりました。",
                        "furigana": "<ruby>重<rt>おも</rt></ruby>い<ruby>荷物<rt>にもつ</rt></ruby>を<ruby>持<rt>も</rt></ruby>ってくれて、<ruby>本当<rt>ほんとう</rt></ruby>に<ruby>助<rt>たす</rt></ruby>かりました。",
                        "en": "You carried the heavy luggage for me, which was a huge help.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～てあげる／～てやる",
                "pattern": "～てあげる／～てやる",
                "formation": "私 は／が + 相手 に + Vて形 + あげる／やる",
                "meaning": "Do a favor for someone / pets or plants",
                "notes": "Doing a beneficial action for another person. ～てやる is used for animals or younger children.",
                "cautions": "Saying ～てあげます directly to someone can sound patronizing or boastful. To superiors, use ～てさしあげる or rephrase.",
                "level": "N4",
                "tags": ["favor", "giving-receiving"],
                "contrastWith": ["～てもらう", "～てくれる"],
                "examples": [
                    {
                        "ja": "道に迷っていた旅行者に英語で案内してあげました。",
                        "furigana": "<ruby>道<rt>みち</rt></ruby>に<ruby>迷<rt>まよ</rt></ruby>っていた<ruby>旅行者<rt>りょこうしゃ</rt></ruby>に<ruby>英語<rt>えいご</rt></ruby>で<ruby>案内<rt>あんない</rt></ruby>してあげました。",
                        "en": "I guided a lost traveler in English.",
                        "level": "N4"
                    },
                    {
                        "ja": "犬を公園へ連れて行って散歩させてやりました。",
                        "furigana": "<ruby>犬<rt>いぬ</rt></ruby>を<ruby>公園<rt>こうえん</rt></ruby>へ<ruby>連<rt>つ</rt></ruby>れて<ruby>行<rt>い</rt></ruby>って<ruby>散歩<rt>さんぽ</rt></ruby>させてやりました。",
                        "en": "I took the dog to the park and let it go for a walk.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～はじめる／～おわる",
                "pattern": "～はじめる／～おわる",
                "formation": "V(ます形語幹) + はじめる／おわる",
                "meaning": "Begin doing ~ / finish doing ~",
                "notes": "Compound verbs describing the initiation or completion of a sustained activity.",
                "cautions": "Contrast with ～だす (sudden spontaneous start). ～はじめる is used for scheduled or deliberate starts.",
                "level": "N4",
                "tags": ["aspect", "compound-verbs"],
                "contrastWith": ["～だす", "～つづける"],
                "examples": [
                    {
                        "ja": "先週から新しい小説を読みはじめました。",
                        "furigana": "<ruby>先週<rt>せんしゅう</rt></ruby>から<ruby>新<rt>あたら</rt></ruby>しい<ruby>小説<rt>しょうせつ</rt></ruby>を<ruby>読<rt>よ</rt></ruby>みはじめました。",
                        "en": "I began reading a new novel last week.",
                        "level": "N4"
                    },
                    {
                        "ja": "レポートを書きおわったら、先生に提出します。",
                        "furigana": "レポートを<ruby>書<rt>か</rt></ruby>きおわったら、<ruby>先生<rt>せんせい</rt></ruby>に<ruby>提出<rt>ていしゅつ</rt></ruby>します。",
                        "en": "When I finish writing the report, I will submit it to the teacher.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 7,
        "title": "けがをした！",
        "page": 52,
        "patterns": [
            {
                "no": 1,
                "title": "～たり(…たり)する",
                "pattern": "～たり(…たり)する",
                "formation": "Vたり + Vたり + する",
                "meaning": "Do things like A and B (non-exhaustive examples of actions)",
                "notes": "Lists representative activities among many possibilities.",
                "cautions": "Always conclude the sentence with する (します, しました, etc.).",
                "level": "N5",
                "tags": ["listing", "verbs"],
                "contrastWith": ["～とか…とか", "～し"],
                "examples": [
                    {
                        "ja": "休日は本を読んだり散歩をしたりして過ごします。",
                        "furigana": "<ruby>休日<rt>きゅうじつ</rt></ruby>は<ruby>本<rt>ほん</rt></ruby>を<ruby>読<rt>よ</rt></ruby>んだり<ruby>散歩<rt>さんぽ</rt></ruby>をしたりして<ruby>過<rt>す</rt></ruby>ごします。",
                        "en": "On holidays, I spend time reading books, taking walks, and doing such things.",
                        "level": "N5"
                    },
                    {
                        "ja": "昨日の天気は雨が降ったり止んだりでした。",
                        "furigana": "<ruby>昨日<rt>きのう</rt></ruby>の<ruby>天気<rt>てんき</rt></ruby>は<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>ったり<ruby>止<rt>や</rt></ruby>んだりでした。",
                        "en": "Yesterday's weather was raining and stopping alternately.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～たまま",
                "pattern": "～たまま",
                "formation": "Vた形 / Nの + まま、[文]",
                "meaning": "With ~ left unchanged / while remaining in the state of ~",
                "notes": "Describes performing another action while keeping a preceding state unchanged, often contrary to expectation.",
                "cautions": "Usually implies something that is normally undone or turned off was left as is.",
                "level": "N4",
                "tags": ["state", "unchanged"],
                "contrastWith": ["～ながら", "～っぱなし"],
                "examples": [
                    {
                        "ja": "昨夜は電気をつけたまま寝てしまいました。",
                        "furigana": "<ruby>昨夜<rt>ゆうべ</rt></ruby>は<ruby>電気<rt>でんき</rt></ruby>をつけたまま<ruby>寝<rt>ね</rt></ruby>てしまいました。",
                        "en": "Last night I fell asleep with the lights left on.",
                        "level": "N4"
                    },
                    {
                        "ja": "靴をはいたまま部屋に入らないでください。",
                        "furigana": "<ruby>靴<rt>くつ</rt></ruby>をはいたまま<ruby>部屋<rt>へや</rt></ruby>に<ruby>入<rt>はい</rt></ruby>らないでください。",
                        "en": "Please do not enter the room with your shoes on.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～たらどう？",
                "pattern": "～たらどう？",
                "formation": "Vたら + どう(ですか)",
                "meaning": "Why don't you ~? / How about ~? (suggestion or advice)",
                "notes": "Gently suggests a course of action to the listener.",
                "cautions": "Can sound intrusive if directed upward to superiors; for seniors, use ～てはいかがでしょうか.",
                "level": "N4",
                "tags": ["suggestion", "advice"],
                "contrastWith": ["～たほうがいい／～ないほうがいい"],
                "examples": [
                    {
                        "ja": "熱があるなら、今日は早く帰って休んだらどうですか。",
                        "furigana": "<ruby>熱<rt>ねつ</rt></ruby>があるなら、<ruby>今日<rt>きょう</rt></ruby>は<ruby>早<rt>はや</rt></ruby>く<ruby>帰<rt>かえ</rt></ruby>って<ruby>休<rt>やす</rt></ruby>んだらどうですか。",
                        "en": "If you have a fever, why don't you go home early and rest today?",
                        "level": "N4"
                    },
                    {
                        "ja": "分からない言葉があれば、先生に聞いたらどう？",
                        "furigana": "<ruby>分<rt>わ</rt></ruby>からない<ruby>言葉<rt>ことば</rt></ruby>があれば、<ruby>先生<rt>せんせい</rt></ruby>に<ruby>聞<rt>き</rt></ruby>いたらどう？",
                        "en": "If there are words you don't understand, why don't you ask the teacher?",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～ても",
                "pattern": "～ても",
                "formation": "Vても / Aくても / Na・Nでも",
                "meaning": "Even if ~ / even though ~ (concessive condition)",
                "notes": "Introduces a condition that does not stop the following outcome from taking place.",
                "cautions": "Opposite of ～たら/～ば, which state that outcome B depends on condition A.",
                "level": "N4",
                "tags": ["condition", "concession"],
                "contrastWith": ["～たら", "～ば", "～のに (逆接)"],
                "examples": [
                    {
                        "ja": "雨が降っても、明日の試合は行われます。",
                        "furigana": "<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>っても、<ruby>明日<rt>あした</rt></ruby>の<ruby>試合<rt>しあい</rt></ruby>は<ruby>行<rt>おこな</rt></ruby>われます。",
                        "en": "Even if it rains, tomorrow's match will be held.",
                        "level": "N4"
                    },
                    {
                        "ja": "何度練習しても、この漢字がなかなか覚えられません。",
                        "furigana": "<ruby>何度<rt>なんど</rt></ruby><ruby>練習<rt>れんしゅう</rt></ruby>しても、この<ruby>漢字<rt>かんじ</rt></ruby>がなかなか<ruby>覚<rt>おぼ</rt></ruby>えられません。",
                        "en": "No matter how many times I practice, I can hardly memorize this kanji.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 8,
        "title": "日本人は桜が大好き",
        "page": 56,
        "patterns": [
            {
                "no": 1,
                "title": "～ておく",
                "pattern": "～ておく",
                "formation": "Vて形 + おく (会話では ～とく)",
                "meaning": "Do something in advance / leave in a state for the future",
                "notes": "Indicates preparation for a future event or leaving something as it is for convenience.",
                "cautions": "In casual spoken Japanese, ～ておく contracts to ～とく (買っとく, 読んどく).",
                "level": "N4",
                "tags": ["preparation", "aspect"],
                "contrastWith": ["～てある", "～たまま"],
                "examples": [
                    {
                        "ja": "旅行に行く前に、ホテルの予約をしておきます。",
                        "furigana": "<ruby>旅行<rt>りょこう</rt></ruby>に<ruby>行<rt>い</rt></ruby>く<ruby>前<rt>まえ</rt></ruby>に、ホテルの<ruby>予約<rt>よやく</rt></ruby>をしておきます。",
                        "en": "Before going on the trip, I will make a hotel reservation in advance.",
                        "level": "N4"
                    },
                    {
                        "ja": "授業の前に新しい単語を調べておきました。",
                        "furigana": "<ruby>授業<rt>じゅぎょう</rt></ruby>の<ruby>前<rt>まえ</rt></ruby>に<ruby>新<rt>あたら</rt></ruby>しい<ruby>単語<rt>たんご</rt></ruby>を<ruby>調<rt>しら</rt></ruby>べておきました。",
                        "en": "I looked up the new vocabulary words in advance before the class.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～てもいい／～てもかまわない",
                "pattern": "～てもいい／～てもかまわない",
                "formation": "Vても + いい／かまわない",
                "meaning": "May do ~ / it is alright to ~ (permission)",
                "notes": "Grants or requests permission. ～てもかまわない is slightly more formal.",
                "cautions": "When asking permission, end with か (～てもいいですか).",
                "level": "N5",
                "tags": ["permission", "politeness"],
                "contrastWith": ["～てはいけない／～てはだめ", "～なくてもいい／～なくてもかまわない"],
                "examples": [
                    {
                        "ja": "この辞書を少しの間借りてもいいですか。",
                        "furigana": "この<ruby>辞書<rt>じしょ</rt></ruby>を<ruby>少<rt>すこ</rt></ruby>しの<ruby>間<rt>あいだ</rt></ruby><ruby>借<rt>か</rt></ruby>りてもいいですか。",
                        "en": "May I borrow this dictionary for a little while?",
                        "level": "N5"
                    },
                    {
                        "ja": "用事が終わったら、先に帰ってもかまいません。",
                        "furigana": "<ruby>用事<rt>ようじ</rt></ruby>が<ruby>終<rt>お</rt></ruby>わったら、<ruby>先<rt>さき</rt></ruby>に<ruby>帰<rt>かえ</rt></ruby>ってもかまいません。",
                        "en": "Once your errands are finished, it doesn't matter if you go home ahead.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～つづける",
                "pattern": "～つづける",
                "formation": "V(ます形語幹) + つづける",
                "meaning": "Continue doing ~ without stopping",
                "notes": "Indicates the uninterrupted continuation or persistent recurrence of an action.",
                "cautions": "Attaches to dynamic continuous verbs, not to punctual change verbs (like 死ぬ or 届く).",
                "level": "N4",
                "tags": ["aspect", "continuation"],
                "contrastWith": ["～はじめる／～おわる"],
                "examples": [
                    {
                        "ja": "雨が三日間降りつづけています。",
                        "furigana": "<ruby>雨<rt>あめ</rt></ruby>が<ruby>三日間<rt>みっかかん</rt></ruby><ruby>降<rt>ふ</rt></ruby>りつづけています。",
                        "en": "Rain has been continuing to fall for three days.",
                        "level": "N4"
                    },
                    {
                        "ja": "諦めずに毎日漢字の練習をつづけました。",
                        "furigana": "<ruby>諦<rt>あきら</rt></ruby>めずに<ruby>毎日<rt>まいにち</rt></ruby><ruby>漢字<rt>かんじ</rt></ruby>の<ruby>練習<rt>れんしゅう</rt></ruby>をつづけました。",
                        "en": "Without giving up, I continued practicing kanji every day.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～という",
                "pattern": "～という",
                "formation": "N1 + という + N2",
                "meaning": "N2 called N1 / N2 named N1",
                "notes": "Used to introduce an unfamiliar name, title, or concept to the listener.",
                "cautions": "In casual conversation, frequently contracted to ～っていう.",
                "level": "N4",
                "tags": ["definition", "naming"],
                "contrastWith": ["～と言う (引用・伝達)"],
                "examples": [
                    {
                        "ja": "「桜」という日本の伝統的な花を知っていますか。",
                        "furigana": "「<ruby>桜<rt>さくら</rt></ruby>」という<ruby>日本<rt>にほん</rt></ruby>の<ruby>伝統的<rt>でんとうてき</rt></ruby>な<ruby>花<rt>はな</rt></ruby>を<ruby>知<rt>し</rt></ruby>っていますか。",
                        "en": "Do you know the traditional Japanese flower called 'sakura'?",
                        "level": "N4"
                    },
                    {
                        "ja": "木村さんという方から電話がありました。",
                        "furigana": "<ruby>木村<rt>きむら</rt></ruby>さんという<ruby>方<rt>かた</rt></ruby>から<ruby>電話<rt>でんわ</rt></ruby>がありました。",
                        "en": "There was a phone call from a person called Mr. Kimura.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 9,
        "title": "自転車に乗りたい！",
        "page": 62,
        "patterns": [
            {
                "no": 1,
                "title": "～かた",
                "pattern": "～かた",
                "formation": "V(ます形語幹) + かた",
                "meaning": "Way of doing ~ / how to do ~",
                "notes": "Creates a noun indicating method or technique. The direct object particle を becomes の (漢字の書き方).",
                "cautions": "Particles like を change to の before the verb stem + かた.",
                "level": "N4",
                "tags": ["method", "nominalization"],
                "contrastWith": ["～の (名詞化)"],
                "examples": [
                    {
                        "ja": "すみませんが、この機械の使い方を教えてください。",
                        "furigana": "すみませんが、この<ruby>機械<rt>きかい</rt></ruby>の<ruby>使<rt>つか</rt></ruby>い<ruby>方<rt>かた</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えてください。",
                        "en": "Excuse me, but please teach me how to use this machine.",
                        "level": "N4"
                    },
                    {
                        "ja": "難しい漢字の正しい読み方を辞書で調べました。",
                        "furigana": "<ruby>難<rt>むずか</rt></ruby>しい<ruby>漢字<rt>かんじ</rt></ruby>の<ruby>正<rt>ただ</rt></ruby>しい<ruby>読<rt>よ</rt></ruby>み<ruby>方<rt>かた</rt></ruby>を<ruby>辞書<rt>じしょ</rt></ruby>で<ruby>調<rt>しら</rt></ruby>べました。",
                        "en": "I checked the correct way of reading the difficult kanji in a dictionary.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～てみる",
                "pattern": "～てみる",
                "formation": "Vて形 + みる",
                "meaning": "Try doing ~ to see what it is like",
                "notes": "Indicates testing out an action to experience or evaluate the result.",
                "cautions": "Written in hiragana (みる), not with kanji 見る.",
                "level": "N4",
                "tags": ["attempt", "experience"],
                "contrastWith": ["～(よ)うとする"],
                "examples": [
                    {
                        "ja": "日本の納豆を初めて食べてみました。",
                        "furigana": "<ruby>日本<rt>にほん</rt></ruby>の<ruby>納豆<rt>なっとう</rt></ruby>を<ruby>初<rt>はじ</rt></ruby>めて<ruby>食<rt>た</rt></ruby>べてみました。",
                        "en": "I tried eating Japanese natto for the first time.",
                        "level": "N4"
                    },
                    {
                        "ja": "サイズが合うかどうか、一度着てみてください。",
                        "furigana": "サイズが<ruby>合<rt>あ</rt></ruby>うかどうか、<ruby>一度<rt>いちど</rt></ruby><ruby>着<rt>き</rt></ruby>てみてください。",
                        "en": "Please try putting it on once to see if the size fits.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～やすい／～にくい",
                "pattern": "～やすい／～にくい",
                "formation": "V(ます形語幹) + やすい／にくい",
                "meaning": "Easy to do ~ / hard to do ~",
                "notes": "Creates an い-adjective indicating ease or difficulty of performing an action.",
                "cautions": "Inflects like an い-adjective (やすかった, にくくない).",
                "level": "N4",
                "tags": ["ease", "difficulty", "adjectives"],
                "contrastWith": ["～ことができる", "～られる (かのう形)"],
                "examples": [
                    {
                        "ja": "このペンは軽くてとても書きやすいです。",
                        "furigana": "このペンは<ruby>軽<rt>かる</rt></ruby>くてとても<ruby>書<rt>か</rt></ruby>きやすいです。",
                        "en": "This pen is light and very easy to write with.",
                        "level": "N4"
                    },
                    {
                        "ja": "暗い道は足元が見えにくくて危ないです。",
                        "furigana": "<ruby>暗<rt>くら</rt></ruby>い<ruby>道<rt>みち</rt></ruby>は<ruby>足元<rt>あしもと</rt></ruby>が<ruby>見<rt>み</rt></ruby>えにくくて<ruby>危<rt>あぶ</rt></ruby>ないです。",
                        "en": "Dark roads are hard to see your step on and dangerous.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 10,
        "title": "自転車がない！",
        "page": 66,
        "patterns": [
            {
                "no": 1,
                "title": "～ている (状態・結果)",
                "pattern": "～ている (状態・結果)",
                "formation": "自動詞て形 + いる",
                "meaning": "Be in a state resulting from an action (intransitive)",
                "notes": "Describes the continuing state of an intransitive verb after an event occurred naturally.",
                "cautions": "Contrast with ～てある (which requires a transitive verb and intentional human preparation).",
                "level": "N4",
                "tags": ["state", "intransitive"],
                "contrastWith": ["～てある"],
                "examples": [
                    {
                        "ja": "窓が開いていますから、風が入ってきます。",
                        "furigana": "<ruby>窓<rt>まど</rt></ruby>が<ruby>開<rt>あ</rt></ruby>いていますから、<ruby>風<rt>かぜ</rt></ruby>が<ruby>入<rt>はい</rt></ruby>ってきます。",
                        "en": "Because the window is open, the wind is coming in.",
                        "level": "N4"
                    },
                    {
                        "ja": "教室の電気が消えています。",
                        "furigana": "<ruby>教室<rt>きょうしつ</rt></ruby>の<ruby>電気<rt>でんき</rt></ruby>が<ruby>消<rt>き</rt></ruby>えています。",
                        "en": "The lights in the classroom are turned off.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～てある",
                "pattern": "～てある",
                "formation": "他動詞て形 + ある",
                "meaning": "Has been done (purposeful resultant state)",
                "notes": "Describes a state that exists because someone intentionally did it in advance for a purpose.",
                "cautions": "Always uses transitive verbs (他動詞). The object takes が (壁に地図が貼ってある).",
                "level": "N4",
                "tags": ["state", "transitive", "preparation"],
                "contrastWith": ["～ている (状態・結果)", "～ておく"],
                "examples": [
                    {
                        "ja": "壁に新しいカレンダーが掛けてあります。",
                        "furigana": "<ruby>壁<rt>かべ</rt></ruby>に<ruby>新<rt>あたら</rt></ruby>しいカレンダーが<ruby>掛<rt>か</rt></ruby>けてあります。",
                        "en": "A new calendar has been hung on the wall.",
                        "level": "N4"
                    },
                    {
                        "ja": "机の上に明日の資料が準備してあります。",
                        "furigana": "<ruby>机<rt>つくえ</rt></ruby>の<ruby>上<rt>うえ</rt></ruby>に<ruby>明日<rt>あした</rt></ruby>の<ruby>資料<rt>しりょう</rt></ruby>が<ruby>準備<rt>じゅんび</rt></ruby>してあります。",
                        "en": "Tomorrow's materials have been prepared and placed on the desk.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～のに (逆接)",
                "pattern": "～のに (逆接)",
                "formation": "普(Aな・Nな) + のに、[文]",
                "meaning": "Even though ~ / despite the fact that ~ (frustration or surprise)",
                "notes": "Expresses that the outcome contradicts what was naturally expected, often carrying dissatisfaction.",
                "cautions": "Cannot be followed by requests, orders, or volitional intentions (unlike ～ても or ～が).",
                "level": "N4",
                "tags": ["contrast", "complaint"],
                "contrastWith": ["～ても", "～けれど／～けど"],
                "examples": [
                    {
                        "ja": "一生懸命勉強したのに、試験に合格できませんでした。",
                        "furigana": "<ruby>一生懸命<rt>いっしょうけんめい</rt></ruby><ruby>勉強<rt>べんきょう</rt></ruby>したのに、<ruby>試験<rt>しけん</rt></ruby>に<ruby>合格<rt>ごうかく</rt></ruby>できませんでした。",
                        "en": "Even though I studied with all my might, I could not pass the exam.",
                        "level": "N4"
                    },
                    {
                        "ja": "約束したのに、彼は時間通りに来ませんでした。",
                        "furigana": "<ruby>約束<rt>やくそく</rt></ruby>したのに、<ruby>彼<rt>かれ</rt></ruby>は<ruby>時間通<rt>じかんどお</rt></ruby>りに<ruby>来<rt>き</rt></ruby>ませんでした。",
                        "en": "Even though he promised, he did not come on time.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 11,
        "title": "日本人の家を訪ねる",
        "page": 70,
        "patterns": [
            {
                "no": 1,
                "title": "いただく／くださる／さしあげる",
                "pattern": "いただく／くださる／さしあげる",
                "formation": "いただく (謙譲) ／ くださる (尊敬) ／ さしあげる (謙譲)",
                "meaning": "Honorific verbs of giving and receiving",
                "notes": "いただく is humble for もらう; くださる is honorific for くれる; さしあげる is humble for あげる.",
                "cautions": "Use strictly when interacting with superiors, teachers, or clients outside your in-group.",
                "level": "N4",
                "tags": ["keigo", "giving-receiving"],
                "contrastWith": ["もらう", "くれる", "あげる／やる"],
                "examples": [
                    {
                        "ja": "先生から素敵な本をいただきました。",
                        "furigana": "<ruby>先生<rt>せんせい</rt></ruby>から<ruby>素敵<rt>すてき</rt></ruby>な<ruby>本<rt>ほん</rt></ruby>をいただきました。",
                        "en": "I humbly received a wonderful book from the teacher.",
                        "level": "N4"
                    },
                    {
                        "ja": "部長がお土産をくださいました。",
                        "furigana": "<ruby>部長<rt>ぶちょう</rt></ruby>がお<ruby>土産<rt>みやげ</rt></ruby>をくださいました。",
                        "en": "The department manager kindly gave me a souvenir.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "お～になる／ご～になる",
                "pattern": "お～になる／ご～になる",
                "formation": "お + V(和語ます形語幹) + になる ／ ご + N(漢語名詞) + になる",
                "meaning": "Honorific verb formula (尊敬語)",
                "notes": "Elevates the action of a respected person or customer.",
                "cautions": "Cannot be used with one-syllable verb stems like 見ます or 来ます (use special honorifics ご覧になる, いらっしゃる).",
                "level": "N4",
                "tags": ["keigo", "sonkeigo"],
                "contrastWith": ["そんけい語の特別な形", "お～する／ご～する"],
                "examples": [
                    {
                        "ja": "社長はすでに新しい資料をお読みになりました。",
                        "furigana": "<ruby>社長<rt>しゃちょう</rt></ruby>はすでに<ruby>新<rt>あたら</rt></ruby>しい<ruby>資料<rt>しりょう</rt></ruby>をお<ruby>読<rt>よ</rt></ruby>みになりました。",
                        "en": "The company president has already read the new materials.",
                        "level": "N4"
                    },
                    {
                        "ja": "先生、こちらのニュースをご存知ですか。",
                        "furigana": "<ruby>先生<rt>せんせい</rt></ruby>、こちらのニュースをご<ruby>存知<rt>ぞんじ</rt></ruby>ですか。",
                        "en": "Professor, are you aware of this news?",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "そんけい語の特別な形",
                "pattern": "そんけい語の特別な形",
                "formation": "Special verbs: いらっしゃる, おっしゃる, なさる, 召し上がる, ご覧になる",
                "meaning": "Special honorific verbs (尊敬語)",
                "notes": "Replaces standard verbs to show high respect to the subject's action.",
                "cautions": "Never use special sonkeigo for your own action (use kenjougo instead).",
                "level": "N4",
                "tags": ["keigo", "sonkeigo"],
                "contrastWith": ["けんじょう語の特別な形", "お～になる／ご～になる"],
                "examples": [
                    {
                        "ja": "先生は何時ごろ研究室にいらっしゃいますか。",
                        "furigana": "<ruby>先生<rt>せんせい</rt></ruby>は<ruby>何時<rt>なんじ</rt></ruby>ごろ<ruby>研究室<rt>けんきゅうしつ</rt></ruby>にいらっしゃいますか。",
                        "en": "Around what time will the professor be in the laboratory?",
                        "level": "N4"
                    },
                    {
                        "ja": "どうぞ温かいお茶を召し上がってください。",
                        "furigana": "どうぞ<ruby>温<rt>あたた</rt></ruby>かいお<ruby>茶<rt>ちゃ</rt></ruby>を<ruby>召<rt>め</rt></ruby>し<ruby>上<rt>あ</rt></ruby>がってください。",
                        "en": "Please enjoy the warm green tea.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "お～する／ご～する",
                "pattern": "お～する／ご～する",
                "formation": "お + V(和語ます形語幹) + する ／ ご + N(漢語名詞) + する",
                "meaning": "Humble verb formula (謙譲語)",
                "notes": "Lowers the speaker's own action to elevate the person receiving the benefit.",
                "cautions": "Only used when the speaker's action is directed toward or involves the other person.",
                "level": "N4",
                "tags": ["keigo", "kenjougo"],
                "contrastWith": ["お～になる／ご～になる", "けんじょう語の特別な形"],
                "examples": [
                    {
                        "ja": "重いお荷物をお持ちしましょうか。",
                        "furigana": "<ruby>重<rt>おも</rt></ruby>いお<ruby>荷物<rt>にもつ</rt></ruby>をお<ruby>持<rt>も</rt></ruby>ちしましょうか。",
                        "en": "Shall I carry your heavy luggage for you?",
                        "level": "N4"
                    },
                    {
                        "ja": "明日の午後に改めてご連絡いたします。",
                        "furigana": "<ruby>明日<rt>あした</rt></ruby>の<ruby>午後<rt>ごご</rt></ruby>に<ruby>改<rt>あらた</rt></ruby>めてご<ruby>連絡<rt>れんらく</rt></ruby>いたします。",
                        "en": "I will contact you again tomorrow afternoon.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 12,
        "title": "どんな人が好き？",
        "page": 74,
        "patterns": [
            {
                "no": 1,
                "title": "～ば",
                "pattern": "～ば",
                "formation": "V(え段) + ば ／ Aければ ／ Na・Nなら(ば)",
                "meaning": "If ~ (hypothetical condition)",
                "notes": "Focuses on the logical or natural precondition needed for the outcome to follow.",
                "cautions": "When the condition is an intentional action, the main clause cannot be an order or request unless condition is non-volitional.",
                "level": "N4",
                "tags": ["conditional"],
                "contrastWith": ["～たら", "～と (条件)", "～なら"],
                "examples": [
                    {
                        "ja": "春になれば、桜の花が美しく咲きます。",
                        "furigana": "<ruby>春<rt>はる</rt></ruby>になれば、<ruby>桜<rt>さくら</rt></ruby>の<ruby>花<rt>はな</rt></ruby>が<ruby>美<rt>うつく</rt></ruby>しく<ruby>咲<rt>さ</rt></ruby>きます。",
                        "en": "If spring comes, the cherry blossoms bloom beautifully.",
                        "level": "N4"
                    },
                    {
                        "ja": "安ければ、新しいパソコンを買いたいです。",
                        "furigana": "<ruby>安<rt>やす</rt></ruby>ければ、<ruby>新<rt>あたら</rt></ruby>しいパソコンを<ruby>買<rt>か</rt></ruby>いたいです。",
                        "en": "If it is inexpensive, I want to buy a new computer.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～なら",
                "pattern": "～なら",
                "formation": "N / 普通形(Aな/Nだは無) + なら",
                "meaning": "If it is the case that ~ / as for ~ (contextual condition)",
                "notes": "Takes up a topic raised by the other person and gives advice, suggestions, or conditions based on it.",
                "cautions": "Action B can occur before action A in time (日本へ行くならカメラを買いなさい).",
                "level": "N4",
                "tags": ["conditional", "topic"],
                "contrastWith": ["～ば", "～たら", "～と (条件)"],
                "examples": [
                    {
                        "ja": "日本料理を食べるなら、あの寿司屋が一番美味しいですよ。",
                        "furigana": "<ruby>日本料理<rt>にほんりょうり</rt></ruby>を<ruby>食<rt>た</rt></ruby>べるなら、あの<ruby>寿司屋<rt>すしや</rt></ruby>が<ruby>一番<rt>いちばん</rt></ruby>お<ruby>い<rt>い</rt></ruby>しいですよ。",
                        "en": "If you are going to eat Japanese food, that sushi restaurant is the most delicious.",
                        "level": "N4"
                    },
                    {
                        "ja": "山田さんなら、さっき図書館へ行きましたよ。",
                        "furigana": "<ruby>山田<rt>やまだ</rt></ruby>さんなら、さっき<ruby>図書館<rt>としょかん</rt></ruby>へ<ruby>行<rt>い</rt></ruby>きましたよ。",
                        "en": "If you are looking for Mr. Yamada, he went to the library just a moment ago.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～とか…とか",
                "pattern": "～とか…とか",
                "formation": "N1 とか N2 とか / V1 とか V2 とか",
                "meaning": "Things like A and B (casual spoken listing)",
                "notes": "Lists examples informally in conversation.",
                "cautions": "More casual than ～や or ～たり; avoid in formal written documents.",
                "level": "N4",
                "tags": ["listing", "spoken"],
                "contrastWith": ["～たり(…たり)する", "～し"],
                "examples": [
                    {
                        "ja": "週末は映画を見るとか買い物するとかしてリフレッシュします。",
                        "furigana": "<ruby>週末<rt>しゅうまつ</rt></ruby>は<ruby>映画<rt>えいが</rt></ruby>を<ruby>見<rt>み</rt></ruby>るとか<ruby>買<rt>か</rt></ruby>い<ruby>物<rt>もの</rt></ruby>するとかしてリフレッシュします。",
                        "en": "On weekends, I refresh myself by doing things like watching movies or shopping.",
                        "level": "N4"
                    },
                    {
                        "ja": "りんごとかみかんとか、果物をたくさん買いました。",
                        "furigana": "りんごとかみかんとか、<ruby>果物<rt>くだもの</rt></ruby>をたくさん<ruby>買<rt>か</rt></ruby>いました。",
                        "en": "I bought lots of fruit, such as apples and mandarin oranges.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～し",
                "pattern": "～し",
                "formation": "普通形 + し、[文]",
                "meaning": "And ~ and ~ (listing multiple reasons or traits)",
                "notes": "Gives two or more reasons leading up to a conclusion or impression.",
                "cautions": "Can end on a reason clause implying further unsaid reasons (～し。).",
                "level": "N4",
                "tags": ["reason", "listing"],
                "contrastWith": ["～から (理由)", "～ので"],
                "examples": [
                    {
                        "ja": "このアパートは駅から近いし、家賃も安いので気に入っています。",
                        "furigana": "このアパートは<ruby>駅<rt>えき</rt></ruby>から<ruby>近<rt>ちか</rt></ruby>いし、<ruby>家賃<rt>やちん</rt></ruby>も<ruby>安<rt>やす</rt></ruby>いので<ruby>気<rt>き</rt></ruby>に<ruby>入<rt>い</rt></ruby>っています。",
                        "en": "This apartment is close to the station, and the rent is low too, so I like it.",
                        "level": "N4"
                    },
                    {
                        "ja": "今日は頭も痛いし、熱もあるから早く寝ます。",
                        "furigana": "<ruby>今日<rt>きょう</rt></ruby>は<ruby>頭<rt>あたま</rt></ruby>も<ruby>痛<rt>いた</rt></ruby>いし、<ruby>熱<rt>ねつ</rt></ruby>もあるから<ruby>早<rt>はや</rt></ruby>く<ruby>寝<rt>ね</rt></ruby>ます。",
                        "en": "Today I have a headache, and I also have a fever, so I will go to bed early.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 13,
        "title": "パンにカビが！",
        "page": 80,
        "patterns": [
            {
                "no": 1,
                "title": "～と (条件)",
                "pattern": "～と (条件)",
                "formation": "V辞書形／ない形 + と、[文]",
                "meaning": "When / if (natural consequence / inevitable result)",
                "notes": "Indicates an inevitable, natural law, machine operation, or route direction result.",
                "cautions": "The main clause cannot express the speaker's intention, request, or command (e.g. cannot end in ～てください or ～たい).",
                "level": "N4",
                "tags": ["conditional", "natural-result"],
                "contrastWith": ["～たら", "～ば", "～なら"],
                "examples": [
                    {
                        "ja": "このボタンを押すと、切符が出ます。",
                        "furigana": "このボタンを<ruby>押<rt>お</rt></ruby>すと、<ruby>切符<rt>きっぷ</rt></ruby>が<ruby>出<rt>で</rt></ruby>ます。",
                        "en": "When you press this button, the ticket comes out.",
                        "level": "N4"
                    },
                    {
                        "ja": "この道をまっすぐ行くと、右側に郵便局があります。",
                        "furigana": "この<ruby>道<rt>みち</rt></ruby>をまっすぐ<ruby>行<rt>い</rt></ruby>くと、<ruby>右側<rt>みぎがわ</rt></ruby>に<ruby>郵便局<rt>ゆうびんきょく</rt></ruby>があります。",
                        "en": "If you go straight along this road, the post office is on the right side.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～たら",
                "pattern": "～たら",
                "formation": "Vたら / Aかったら / Na・Nだったら",
                "meaning": "If / when (versatile conditional)",
                "notes": "The most versatile Japanese conditional. Can be used for unexpected discoveries (～たら…た) or hypothetical conditions.",
                "cautions": "Can be followed by requests, offers, or personal will (unlike ～と).",
                "level": "N4",
                "tags": ["conditional"],
                "contrastWith": ["～と (条件)", "～ば", "～なら"],
                "examples": [
                    {
                        "ja": "駅に着いたら、電話をかけてください。",
                        "furigana": "<ruby>駅<rt>えき</rt></ruby>に<ruby>着<rt>つ</rt></ruby>いたら、<ruby>電話<rt>でんわ</rt></ruby>をかけてください。",
                        "en": "When you arrive at the station, please give me a call.",
                        "level": "N4"
                    },
                    {
                        "ja": "時間が余ったら、ゆっくりお茶でも飲みましょう。",
                        "furigana": "<ruby>時間<rt>じかん</rt></ruby>が<ruby>余<rt>あま</rt></ruby>ったら、ゆっくりお<ruby>茶<rt>ちゃ</rt></ruby>でも<ruby>飲<rt>の</rt></ruby>みましょう。",
                        "en": "If we have spare time, let's have some tea at our leisure.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～たほうがいい／～ないほうがいい",
                "pattern": "～たほうがいい／～ないほうがいい",
                "formation": "Vた形 + ほうがいい ／ Vない形 + ほうがいい",
                "meaning": "It is better to ~ / had better not ~ (advice)",
                "notes": "Offers strong direct advice on which alternative is better.",
                "cautions": "Take care with affirmative: use Vた形 (not V辞書形) for standard past-stem advice (行ったほうがいい).",
                "level": "N5",
                "tags": ["advice", "suggestion"],
                "contrastWith": ["～たらどう？"],
                "examples": [
                    {
                        "ja": "熱が高いですから、今日は病院に行ったほうがいいですよ。",
                        "furigana": "<ruby>熱<rt>ねつ</rt></ruby>が<ruby>高<rt>たか</rt></ruby>いですから、<ruby>今日<rt>きょう</rt></ruby>は<ruby>病院<rt>びょういん</rt></ruby>に<ruby>行<rt>い</rt></ruby>ったほうがいいですよ。",
                        "en": "Because your fever is high, you had better go to the hospital today.",
                        "level": "N5"
                    },
                    {
                        "ja": "夜遅くに甘いものをたくさん食べないほうがいいです。",
                        "furigana": "<ruby>夜遅<rt>よるおそ</rt></ruby>くに<ruby>甘<rt>あま</rt></ruby>いものをたくさん<ruby>食<rt>た</rt></ruby>べないほうがいいです。",
                        "en": "You had better not eat lots of sweets late at night.",
                        "level": "N5"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 14,
        "title": "待ち合わせはだいじょうぶ？",
        "page": 84,
        "patterns": [
            {
                "no": 1,
                "title": "～ように (目標・目的)",
                "pattern": "～ように (目標・目的)",
                "formation": "V(可能形／ない形／無意志動詞辞書形) + ように",
                "meaning": "In order that ~ / so that ~ (aiming for a state)",
                "notes": "Expresses an objective or intended state. Attaches to non-volitional verbs, potential verbs, or negative forms.",
                "cautions": "Contrast with ～ために (which attaches to volitional action verbs done by the same subject).",
                "level": "N4",
                "tags": ["purpose", "potential"],
                "contrastWith": ["～ため(に) (目的・原因)"],
                "examples": [
                    {
                        "ja": "後ろの席の人にもよく聞こえるように、大きな声で話しました。",
                        "furigana": "<ruby>後<rt>うし</rt></ruby>ろの<ruby>席<rt>せき</rt></ruby>の<ruby>人<rt>ひと</rt></ruby>にもよく<ruby>聞<rt>き</rt></ruby>こえるように、<ruby>大<rt>おお</rt></ruby>きな<ruby>声<rt>こえ</rt></ruby>で<ruby>話<rt>はな</rt></ruby>しました。",
                        "en": "I spoke in a loud voice so that people in the back seats could hear well too.",
                        "level": "N4"
                    },
                    {
                        "ja": "大切な約束を忘れないように、手帳にメモしておきます。",
                        "furigana": "<ruby>大切<rt>たいせつ</rt></ruby>な<ruby>約束<rt>やくそく</rt></ruby>を<ruby>忘<rt>わす</rt></ruby>れないように、<ruby>手帳<rt>てちょう</rt></ruby>にメモしておきます。",
                        "en": "So that I won't forget the important appointment, I'll take a note in my planner.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～はずだ",
                "pattern": "～はずだ",
                "formation": "普(Aな・Nの) + はずだ",
                "meaning": "Should be / expected to be (confident expectation)",
                "notes": "Expresses strong logical certainty based on firm grounds or objective facts.",
                "cautions": "Cannot be used for pure guesswork without clear factual backing.",
                "level": "N4",
                "tags": ["expectation", "certainty"],
                "contrastWith": ["～はずがない", "～かもしれない", "～だろう／～だろうと思う"],
                "examples": [
                    {
                        "ja": "彼は日本に十年住んでいたから、日本語が上手なはずです。",
                        "furigana": "<ruby>彼<rt>かれ</rt></ruby>は<ruby>日本<rt>にほん</rt></ruby>に<ruby>十年<rt>じゅうねん</rt></ruby><ruby>住<rt>す</rt></ruby>んでいたから、<ruby>日本語<rt>にほんご</rt></ruby>が<ruby>上手<rt>じょうず</rt></ruby>なはずです。",
                        "en": "Because he lived in Japan for ten years, he should be good at Japanese.",
                        "level": "N4"
                    },
                    {
                        "ja": "荷物は昨日発送したから、今日届くはずです。",
                        "furigana": "<ruby>荷物<rt>にもつ</rt></ruby>は<ruby>昨日<rt>きのう</rt></ruby><ruby>発送<rt>はっそう</rt></ruby>したから、<ruby>今日<rt>きょう</rt></ruby><ruby>届<rt>とど</rt></ruby>くはずです。",
                        "en": "Because the parcel was shipped yesterday, it should arrive today.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～はずがない",
                "pattern": "～はずがない",
                "formation": "普(Aな・Nの) + はずがない",
                "meaning": "Cannot be / impossible that ~ (strong negative conviction)",
                "notes": "Expresses strong conviction that something is completely impossible.",
                "cautions": "Stronger conviction of impossibility than ～ないはずだ.",
                "level": "N4",
                "tags": ["impossibility", "conviction"],
                "contrastWith": ["～はずだ", "～かもしれない"],
                "examples": [
                    {
                        "ja": "真面目な田中さんが約束を破るはずがありません。",
                        "furigana": "<ruby>真面目<rt>まじめ</rt></ruby>な<ruby>田中<rt>たなか</rt></ruby>さんが<ruby>約束<rt>やくそく</rt></ruby>を<ruby>破<rt>やぶ</rt></ruby>るはずがありません。",
                        "en": "It is impossible that the diligent Mr. Tanaka would break his promise.",
                        "level": "N4"
                    },
                    {
                        "ja": "鍵をポケットに入れたのだから、失くすはずがない。",
                        "furigana": "<ruby>鍵<rt>かぎ</rt></ruby>をポケットに<ruby>入<rt>い</rt></ruby>れたのだから、<ruby>失<rt>な</rt></ruby>くすはずがない。",
                        "en": "Since I put the key in my pocket, there's no way I could have lost it.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～かもしれない",
                "pattern": "～かもしれない",
                "formation": "普(Aな/Nだは無) + かもしれない",
                "meaning": "Might / may be (possibility ~50% or less)",
                "notes": "Expresses an uncertain possibility without firm conviction.",
                "cautions": "In casual speech, often shortened to ～かも.",
                "level": "N4",
                "tags": ["conjecture", "possibility"],
                "contrastWith": ["～はずだ", "～だろう／～だろうと思う"],
                "examples": [
                    {
                        "ja": "午後は天気が急変して、雷雨になるかもしれません。",
                        "furigana": "<ruby>午後<rt>ごご</rt></ruby>は<ruby>天気<rt>てんき</rt></ruby>が<ruby>急変<rt>きゅうへん</rt></ruby>して、<ruby>雷雨<rt>らいう</rt></ruby>になるかもしれません。",
                        "en": "The weather might change suddenly in the afternoon and turn into a thunderstorm.",
                        "level": "N4"
                    },
                    {
                        "ja": "道が渋滞しているから、集合時間に遅れるかもしれません。",
                        "furigana": "<ruby>道<rt>みち</rt></ruby>が<ruby>渋滞<rt>じゅうたい</rt></ruby>しているから、<ruby>集合時間<rt>しゅうごうじかん</rt></ruby>に<ruby>遅<rt>おく</rt></ruby>れるかもしれません。",
                        "en": "Because the road is congested, we might be late for the meeting time.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 15,
        "title": "日本の大学",
        "page": 88,
        "patterns": [
            {
                "no": 1,
                "title": "～そう (様態)",
                "pattern": "～そう (様態)",
                "formation": "V(ます語幹) / A(語幹) + そうだ (Aいい→よさそう, ない→なさそう)",
                "meaning": "Looks like ~ / appears to ~ (visual impression / imminent action)",
                "notes": "Expresses an immediate visual conjecture based on appearance.",
                "cautions": "Contrast with ～そうだ (伝聞 / hearsay) which takes plain form (降るそうだ).",
                "level": "N4",
                "tags": ["appearance", "conjecture"],
                "contrastWith": ["～そうだ (伝聞)", "～ようだ (比ゆ・例え)", "～らしい (推量)"],
                "examples": [
                    {
                        "ja": "今にも雨が降りそうな空模様ですね。",
                        "furigana": "<ruby>今<rt>いま</rt></ruby>にも<ruby>雨<rt>あめ</rt></ruby>が<ruby>降<rt>ふ</rt></ruby>りそうな<ruby>空模様<rt>そらもよう</rt></ruby>ですね。",
                        "en": "It looks like rain could fall at any moment.",
                        "level": "N4"
                    },
                    {
                        "ja": "このリンゴはとても甘くて美味しそうに見えます。",
                        "furigana": "このリンゴはとても<ruby>甘<rt>あま</rt></ruby>くてお<ruby>い<rt>い</rt></ruby>しそうに<ruby>見<rt>み</rt></ruby>えます。",
                        "en": "This apple looks very sweet and delicious.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "【疑問詞】＋か",
                "pattern": "【疑問詞】＋か",
                "formation": "疑問詞 (いつ, どこ, だれ, なに) + か",
                "meaning": "Someone, somewhere, sometime, something (indefinite pronoun)",
                "notes": "Creates an indefinite reference (誰か = someone, どこか = somewhere, 何か = something, いつか = sometime).",
                "cautions": "Particles like が and を can be omitted after 何か and 誰か.",
                "level": "N5",
                "tags": ["particles", "interrogatives"],
                "contrastWith": ["【疑問詞】＋でも", "【疑問詞】～か"],
                "examples": [
                    {
                        "ja": "休日にどこか遠くの温泉へ出かけたいです。",
                        "furigana": "<ruby>休日<rt>きゅうじつ</rt></ruby>にどこか<ruby>遠<rt>とお</rt></ruby>くの<ruby>温泉<rt>おんせん</rt></ruby>へ<ruby>出<rt>で</rt></ruby>かけたいです。",
                        "en": "I want to go somewhere distant to a hot spring on my holiday.",
                        "level": "N5"
                    },
                    {
                        "ja": "机の下に何かが落ちていますよ。",
                        "furigana": "<ruby>机<rt>つくえ</rt></ruby>の<ruby>下<rt>した</rt></ruby>に<ruby>何<rt>なに</rt></ruby>かが<ruby>落<rt>お</rt></ruby>ちていますよ。",
                        "en": "Something has fallen under the desk.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 3,
                "title": "【疑問詞】＋でも",
                "pattern": "【疑問詞】＋でも",
                "formation": "疑問詞 (だれ, どこ, いつ, なん) + でも",
                "meaning": "Anyone, anywhere, anytime, anything (all-inclusive)",
                "notes": "Expresses an all-inclusive affirmative (誰でも = anyone, 何でも = anything, いつでも = anytime, どこでも = anywhere).",
                "cautions": "In negative sentences, 【疑問詞】+ も + negative is used instead (誰もいません).",
                "level": "N4",
                "tags": ["particles", "interrogatives", "inclusiveness"],
                "contrastWith": ["【疑問詞】＋か"],
                "examples": [
                    {
                        "ja": "このスマートフォンは簡単なので、誰でも使えます。",
                        "furigana": "このスマートフォンは<ruby>簡単<rt>かんたん</rt></ruby>なので、<ruby>誰<rt>だれ</rt></ruby>でも<ruby>使<rt>つか</rt></ruby>えます。",
                        "en": "Because this smartphone is simple, anyone can use it.",
                        "level": "N4"
                    },
                    {
                        "ja": "困ったことがあれば、いつでも遠慮なく相談してください。",
                        "furigana": "<ruby>困<rt>こま</rt></ruby>ったことがあれば、いつでも<ruby>遠慮<rt>えんりょ</rt></ruby>なく<ruby>相談<rt>そうだん</rt></ruby>してください。",
                        "en": "If you have any troubles, please consult me anytime without hesitation.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～ようにする／～ようにしている",
                "pattern": "～ようにする／～ようにしている",
                "formation": "V(辞書形／ない形) + ようにする／ようにしている",
                "meaning": "Make an effort to ~ / make it a rule to ~ (conscious habit)",
                "notes": "～ようにする indicates making an effort in a given situation; ～ようにしている indicates an established conscious habit.",
                "cautions": "Contrast with ～ようになる, which indicates an automatic/unconscious capacity change.",
                "level": "N4",
                "tags": ["habit", "effort"],
                "contrastWith": ["～ようになる"],
                "examples": [
                    {
                        "ja": "健康のために、毎日階段を使うようにしています。",
                        "furigana": "<ruby>健康<rt>けんこう</rt></ruby>のために、<ruby>毎日<rt>まいにち</rt></ruby><ruby>階段<rt>かいだん</rt></ruby>を<ruby>使<rt>つか</rt></ruby>うようにしています。",
                        "en": "For the sake of health, I make it a rule to use the stairs every day.",
                        "level": "N4"
                    },
                    {
                        "ja": "夜遅くには油っこいものを食べないようにしましょう。",
                        "furigana": "<ruby>夜遅<rt>よるおそ</rt></ruby>くには<ruby>油<rt>あぶら</rt></ruby>っこいものを<ruby>食<rt>た</rt></ruby>べないようにしましょう。",
                        "en": "Let's make an effort not to eat oily food late at night.",
                        "level": "N4"
                    }
                ]
            }
        ]
    },
    {
        "lesson": 16,
        "title": "アルバイトの面接",
        "page": 92,
        "patterns": [
            {
                "no": 1,
                "title": "～られる (かのう形)",
                "pattern": "～られる (かのう形)",
                "formation": "G1: 書く→書ける / G2: 食べる→食べられる / G3: する→できる, 来る→こられる",
                "meaning": "Potential verb form (can do / able to do)",
                "notes": "Expresses ability or situational possibility.",
                "cautions": "The direct object particle を frequently shifts to が (日本語が話せる).",
                "level": "N4",
                "tags": ["potential", "verb-form"],
                "contrastWith": ["～ことができる", "～(ら)れる (うけみ形)"],
                "examples": [
                    {
                        "ja": "漢字を五百字くらい覚えることができました。",
                        "furigana": "<ruby>漢字<rt>かんじ</rt></ruby>を<ruby>五百字<rt>ごひゃくじ</rt></ruby>くらい<ruby>覚<rt>おぼ</rt></ruby>えることができました。",
                        "en": "I was able to memorize about 500 kanji characters.",
                        "level": "N4"
                    },
                    {
                        "ja": "一人で着物をきれいに着られます。",
                        "furigana": "<ruby>一人<rt>ひとり</rt></ruby>で<ruby>着物<rt>きもの</rt></ruby>をきれいに<ruby>着<rt>き</rt></ruby>られます。",
                        "en": "I can put on a kimono neatly by myself.",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 2,
                "title": "～ことができる",
                "pattern": "～ことができる",
                "formation": "V辞書形 + ことができる",
                "meaning": "Can do ~ / it is possible to ~",
                "notes": "Expresses general ability or permission in formal written and spoken contexts.",
                "cautions": "More formal and explicit than the simple potential verb form (かのう形).",
                "level": "N5",
                "tags": ["potential", "ability"],
                "contrastWith": ["～られる (かのう形)"],
                "examples": [
                    {
                        "ja": "この図書館ではインターネットを無料で使うことができます。",
                        "furigana": "この<ruby>図書館<rt>としょかん</rt></ruby>ではインターネットを<ruby>無料<rt>むりょう</rt></ruby>で<ruby>使<rt>つか</rt></ruby>うことができます。",
                        "en": "In this library, you can use the internet free of charge.",
                        "level": "N5"
                    },
                    {
                        "ja": "私は少しピアノを弾くことができます。",
                        "furigana": "<ruby>私<rt>わたし</rt></ruby>は<ruby>少<rt>すこ</rt></ruby>しピアノを<ruby>弾<rt>ひ</rt></ruby>くことができます。",
                        "en": "I can play the piano a little bit.",
                        "level": "N5"
                    }
                ]
            },
            {
                "no": 3,
                "title": "～んです／～んですか",
                "pattern": "～んです／～んですか",
                "formation": "普(Aな/Nな) + んです (書面では ～のです)",
                "meaning": "It is that ~ / explaining reasons or seeking explanation",
                "notes": "Used to give explanations, clarify background context, or show warm curiosity.",
                "cautions": "Overusing ～んですか when questioning strangers can sound overly inquisitive.",
                "level": "N4",
                "tags": ["explanation", "modality"],
                "contrastWith": ["～んですが (前置き)"],
                "examples": [
                    {
                        "ja": "どうして昨日遅刻したんですか。目覚ましが鳴らなかったんです。",
                        "furigana": "どうして<ruby>昨日<rt>きのう</rt></ruby><ruby>遅刻<rt>ちこく</rt></ruby>したんですか。<ruby>目覚<rt>めざ</rt></ruby>ましが<ruby>鳴<rt>な</rt></ruby>らなかったんです。",
                        "en": "Why were you late yesterday? It's that my alarm didn't ring.",
                        "level": "N4"
                    },
                    {
                        "ja": "頭が痛いんですが、少し休んでもいいですか。",
                        "furigana": "<ruby>頭<rt>あたま</rt></ruby>が<ruby>痛<rt>いた</rt></ruby>いんですが、<ruby>少<rt>すこ</rt></ruby>し<ruby>休<rt>やす</rt></ruby>んでもいいですか。",
                        "en": "I have a headache; is it alright if I rest for a little while?",
                        "level": "N4"
                    }
                ]
            },
            {
                "no": 4,
                "title": "～んですが (前置き)",
                "pattern": "～んですが (前置き)",
                "formation": "普(Aな/Nな) + んですが、[依頼・質問]",
                "meaning": "It's that ~, but... (soft introductory buffer)",
                "notes": "Provides background information before asking a question, making a request, or declining.",
                "cautions": "Softens the conversational approach; very natural in Japanese customer service and requests.",
                "level": "N4",
                "tags": ["cushion-phrase", "politeness"],
                "contrastWith": ["～んです／～んですか"],
                "examples": [
                    {
                        "ja": "市役所の場所を教えていただきたいんですが、よろしいでしょうか。",
                        "furigana": "<ruby>市役所<rt>しやくしょ</rt></ruby>の<ruby>場所<rt>ばしょ</rt></ruby>を<ruby>教<rt>おし</rt></ruby>えていただきたいんですが、よろしいでしょうか。",
                        "en": "I would like you to tell me the location of the city hall; would that be alright?",
                        "level": "N4"
                    },
                    {
                        "ja": "新幹線を予約したいんですが、どこで買えますか。",
                        "furigana": "<ruby>新幹線<rt>しんかんせん</rt></ruby>を<ruby>予約<rt>よやく</rt></ruby>したいんですが、どこで<ruby>買<rt>か</rt></ruby>えますか。",
                        "en": "I'd like to reserve a bullet train ticket, but where can I purchase one?",
                        "level": "N4"
                    }
                ]
            }
        ]
    }
]
