import fs from 'node:fs';

const conjData = JSON.parse(fs.readFileSync('data/conjunctions.json', 'utf8'));

// Detailed enrichment per conjunction
const CONJ_ENRICHMENT = {
  'conj-soshite': {
    commonMistake: 'Do not use そして to link contrasting ideas (*雨が降りました。そして出かけました ❌ -> でも/しかし ⭕).',
    nuanceDiff: '「そして」simply links actions or facts chronologically or cumulatively. Unlike「それから」, it feels slightly more formal and cannot start a conversation as "And then?". Unlike「それに」, it does not argue for an added persuasive reason.',
    extraExamples: [
      {
        ja: '図書館で本を借りました。そして、家で読みました。',
        en: 'I borrowed a book from the library. And then, I read it at home.',
        segments: [{t:'図書館',r:'としょかん'},{t:'で'},{t:'本',r:'ほん'},{t:'を'},{t:'借',r:'か'},{t:'りました。そして、'},{t:'家',r:'いえ'},{t:'で'},{t:'読',r:'よ'},{t:'みました。'}]
      },
      {
        ja: '彼は親切で、そして頭がいいです。',
        en: 'He is kind, and furthermore he is smart.',
        segments: [{t:'彼',r:'かれ'},{t:'は'},{t:'親切',r:'しんせつ'},{t:'で、そして'},{t:'頭',r:'あたま'},{t:'がいいです。'}]
      },
      {
        ja: 'ベルが鳴りました。そして、授業が始まりました。',
        en: 'The bell rang. And then, the class started.',
        segments: [{t:'ベルが'},{t:'鳴',r:'な'},{t:'りました。そして、'},{t:'授業',r:'じゅぎょう'},{t:'が'},{t:'始',r:'はじ'},{t:'まりました。'}]
      }
    ],
    miniDrill: {
      question: '朝起きて顔を洗いました。（　★　）、朝ご飯を食べました。',
      options: ['そして', 'しかし', 'ところで', 'だから'],
      correct: 'そして',
      explanation: 'Actions performed in chronological sequence are connected smoothly by「そして」.'
    }
  },
  'conj-sorekara': {
    commonMistake: 'Do not use それから when you mean "in addition to an argument" (use それに instead).',
    nuanceDiff: '「それから」specifically emphasizes temporal sequence ("after that / and next") or listing items ("and also"). It is frequently used in spoken Japanese to prompt for more information ("...and then what?").',
    extraExamples: [
      {
        ja: '買い物をしました。それから、映画を見ました。',
        en: 'I did shopping. After that, I watched a movie.',
        segments: [{t:'買',r:'か'},{t:'い'},{t:'物',r:'もの'},{t:'をしました。それから、'},{t:'映画',r:'えいが'},{t:'を'},{t:'見',r:'み'},{t:'ました。'}]
      },
      {
        ja: '宿題を終わらせて、それから遊びに行きます。',
        en: 'I will finish my homework, and after that go out to play.',
        segments: [{t:'宿題',r:'しゅくだい'},{t:'を'},{t:'終',r:'お'},{t:'わらせて、それから'},{t:'遊',r:'あそ'},{t:'びに'},{t:'行',r:'い'},{t:'きます。'}]
      },
      {
        ja: 'リンゴを三つ、それからバナナをください。',
        en: 'Three apples, and also bananas please.',
        segments: [{t:'リンゴを'},{t:'三',r:'みっ'},{t:'つ、それからバナナをください。'}]
      }
    ],
    miniDrill: {
      question: 'スーパーで野菜を買いました。（　★　）、本屋へ行きました。',
      options: ['それから', 'しかし', 'すると', 'なぜなら'],
      correct: 'それから',
      explanation: '「それから」expresses "after that" in a sequence of errands.'
    }
  },
  'conj-soreni': {
    commonMistake: 'Do not use それに to introduce a contrasting or negative twist (*安いです。それに美味しくないです ❌).',
    nuanceDiff: '「それに」presents an additional supporting fact pointing in the SAME positive or negative evaluative direction ("besides / what\'s more"), reinforcing the speaker\'s recommendation or complaint.',
    extraExamples: [
      {
        ja: 'このレストランは安くて美味しいです。それに、店員も親切です。',
        en: 'This restaurant is cheap and delicious. Besides, the staff is kind.',
        segments: [{t:'このレストランは'},{t:'安',r:'やす'},{t:'くて'},{t:'美味',r:'おい'},{t:'しいです。それに、'},{t:'店員',r:'てんいん'},{t:'も'},{t:'親切',r:'しんせつ'},{t:'です。'}]
      },
      {
        ja: '雨が降っています。それに、風も強いです。',
        en: 'It is raining. In addition, the wind is strong.',
        segments: [{t:'雨',r:'あめ'},{t:'が'},{t:'降',r:'ふ'},{t:'っています。それに、'},{t:'風',r:'かぜ'},{t:'も'},{t:'強',r:'つよ'},{t:'いです。'}]
      },
      {
        ja: '今日は疲れています。それに、熱もあります。',
        en: 'I am tired today. What is more, I also have a fever.',
        segments: [{t:'今日',r:'きょう'},{t:'は'},{t:'疲',r:'つか'},{t:'れています。それに、'},{t:'熱',r:'ねつ'},{t:'もあります。'}]
      }
    ],
    miniDrill: {
      question: 'この部屋は広いです。（　★　）、家賃も安いです。',
      options: ['それに', 'しかし', 'ところで', 'だから'],
      correct: 'それに',
      explanation: 'Both qualities are positive conditions in the same direction, so「それに」(furthermore / besides) is ideal.'
    }
  },
  'conj-sonoue': {
    commonMistake: 'Do not use そのうえ for basic sequential order ("I ate and then slept" -> use それから).',
    nuanceDiff: '「そのうえ」is a formal cumulative addition ("on top of that / moreover"). It implies stacking weightier layers onto an already substantial situation.',
    extraExamples: [
      {
        ja: '道に迷って、そのうえ雨まで降ってきた。',
        en: 'I got lost, and on top of that it even started raining.',
        segments: [{t:'道',r:'みち'},{t:'に'},{t:'迷',r:'まよ'},{t:'って、そのうえ'},{t:'雨',r:'あめ'},{t:'まで'},{t:'降',r:'ふ'},{t:'ってきた。'}]
      },
      {
        ja: '彼は英語が上手で、そのうえフランス語も話せます。',
        en: 'He is proficient in English, and moreover can speak French.',
        segments: [{t:'彼',r:'かれ'},{t:'は'},{t:'英語',r:'えいご'},{t:'が'},{t:'上手',r:'じょうず'},{t:'で、そのうえフランス'},{t:'語',r:'ご'},{t:'も'},{t:'話',r:'はな'},{t:'せます。'}]
      },
      {
        ja: '仕事が多く、そのうえ残業も頼まれた。',
        en: 'I had a lot of work, and on top of that I was asked to do overtime.',
        segments: [{t:'仕事',r:'しごと'},{t:'が'},{t:'多',r:'おお'},{t:'く、そのうえ'},{t:'残業',r:'ざんぎょう'},{t:'も'},{t:'頼',r:'たの'},{t:'まれた。'}]
      }
    ],
    miniDrill: {
      question: '彼は仕事が速く、（　★　）ミスが全くない。',
      options: ['そのうえ', 'しかし', 'ところで', 'なぜなら'],
      correct: 'そのうえ',
      explanation: '「そのうえ」(on top of that / moreover) stacks an even more impressive positive attribute.'
    }
  },
  'conj-dakara': {
    commonMistake: 'Do not use だから when speaking politely to clients or bosses in formal business (use ですから or ですので).',
    nuanceDiff: '「だから」states a direct causal conclusion ("therefore / so"). The speaker feels strong personal conviction that result B follows from reason A.',
    extraExamples: [
      {
        ja: '明日は試験があります。だから、今夜は勉強します。',
        en: 'I have an exam tomorrow. Therefore, I will study tonight.',
        segments: [{t:'明日',r:'あした'},{t:'は'},{t:'試験',r:'しけん'},{t:'があります。だから、'},{t:'今夜',r:'こんや'},{t:'は'},{t:'勉強',r:'べんきょう'},{t:'します。'}]
      },
      {
        ja: '雪が降っています。だから、道が滑りやすいです。',
        en: 'It is snowing. Therefore, the roads are slippery.',
        segments: [{t:'雪',r:'ゆき'},{t:'が'},{t:'降',r:'ふ'},{t:'っています。だから、'},{t:'道',r:'みち'},{t:'が'},{t:'滑',r:'すべ'},{t:'りやすいです。'}]
      },
      {
        ja: 'この店は人気があります。だから、いつも混んでいます。',
        en: 'This shop is popular. So it is always crowded.',
        segments: [{t:'この'},{t:'店',r:'みせ'},{t:'は'},{t:'人気',r:'にんき'},{t:'があります。だから、いつも'},{t:'混',r:'こ'},{t:'んでいます。'}]
      }
    ],
    miniDrill: {
      question: '熱があります。（　★　）、今日は早く寝ます。',
      options: ['だから', 'しかし', 'ところで', 'たとえば'],
      correct: 'だから',
      explanation: 'Having a fever is the direct cause of deciding to sleep early, so「だから」is correct.'
    }
  },
  'conj-sorede': {
    commonMistake: 'Do not end the sentence after それで with a command or request (*それで、手伝ってください ❌ -> だから ⭕).',
    nuanceDiff: '「それで」presents natural, non-volitional occurrences ("and as a result / so"). In dialogue, it can also prompt a story:「それで？ (And then what happened?)」.',
    extraExamples: [
      {
        ja: '電車が止まりました。それで、会社に遅刻しました。',
        en: 'The train stopped. As a result, I was late for work.',
        segments: [{t:'電車',r:'でんしゃ'},{t:'が'},{t:'止',r:'と'},{t:'まりました。それで、'},{t:'会社',r:'かいしゃ'},{t:'に'},{t:'遅刻',r:'ちこく'},{t:'しました。'}]
      },
      {
        ja: '鍵を失くしました。それで、家に入れませんでした。',
        en: 'I lost my key. Because of that, I could not enter the house.',
        segments: [{t:'鍵',r:'かぎ'},{t:'を'},{t:'失',r:'な'},{t:'くしました。それで、'},{t:'家',r:'いえ'},{t:'に'},{t:'入',r:'はい'},{t:'れませんでした。'}]
      },
      {
        ja: '昨夜夜更かしをしました。それで、今とても眠いです。',
        en: 'I stayed up late last night. Consequently, I am very sleepy now.',
        segments: [{t:'昨夜',r:'ゆうべ'},{t:'夜更',r:'よふ'},{t:'かしをしました。それで、'},{t:'今',r:'いま'},{t:'とても'},{t:'眠',r:'ねむ'},{t:'いです。'}]
      }
    ],
    miniDrill: {
      question: '目覚まし時計が鳴りませんでした。（　★　）、寝坊しました。',
      options: ['それで', 'しかし', 'ところで', 'それに'],
      correct: 'それで',
      explanation: 'Oversleeping was the natural, direct outcome of the alarm not ringing, so「それで」is used.'
    }
  },
  'conj-suruto': {
    commonMistake: 'Never follow すると with an intentional action, invitation, or request (*ドアを開けました。すると、入りましょう ❌).',
    nuanceDiff: '「すると」expresses immediate chronological consequence or unexpected discovery ("upon doing so, suddenly / thereupon"). The second clause is an automatic or observed event.',
    extraExamples: [
      {
        ja: 'カーテンを開けました。すると、雪が積もっていました。',
        en: 'I opened the curtains. Thereupon, snow had piled up!',
        segments: [{t:'カーテンを'},{t:'開',r:'あ'},{t:'けました。すると、'},{t:'雪',r:'ゆき'},{t:'が'},{t:'積',r:'つ'},{t:'もっていました。'}]
      },
      {
        ja: 'ボタンを押しました。すると、機械が動き始めました。',
        en: 'I pressed the button. Thereupon, the machine started operating.',
        segments: [{t:'ボタンを'},{t:'押',r:'お'},{t:'しました。すると、'},{t:'機械',r:'きかい'},{t:'が'},{t:'動',r:'うご'},{t:'き'},{t:'始',r:'はじ'},{t:'めました。'}]
      },
      {
        ja: '薬を飲みました。すると、痛みが消えました。',
        en: 'I took the medicine. Soon after, the pain vanished.',
        segments: [{t:'薬',r:'くすり'},{t:'を'},{t:'飲',r:'の'},{t:'みました。すると、'},{t:'痛',r:'いた'},{t:'みが'},{t:'消',r:'き'},{t:'えました。'}]
      }
    ],
    miniDrill: {
      question: '窓を開けました。（　★　）、涼しい風が入ってきました。',
      options: ['すると', 'だから', 'しかし', 'ところで'],
      correct: 'すると',
      explanation: 'Opening the window was immediately followed by discovering cool breeze entering:「すると」captures this prompt physical discovery.'
    }
  },
  'conj-keredomo': {
    commonMistake: 'Do not confuse けれども with logical conclusion words like だから.',
    nuanceDiff: '「けれども」is a polite, thoughtful contrast ("however / although"). It sounds more courteous and softer than「でも」and is widely used in polite adult conversation.',
    extraExamples: [
      {
        ja: '値段は少し高いですけれども、とても長持ちします。',
        en: 'The price is slightly high; however, it lasts a very long time.',
        segments: [{t:'値段',r:'ねだん'},{t:'は'},{t:'少',r:'すこ'},{t:'し'},{t:'高',r:'たか'},{t:'いですけれども、とても'},{t:'長持',r:'ながも'},{t:'ちします。'}]
      },
      {
        ja: '日本語は難しいです。けれども、勉強していて楽しいです。',
        en: 'Japanese is difficult. However, studying it is fun.',
        segments: [{t:'日本語',r:'にほんご'},{t:'は'},{t:'難',r:'むずか'},{t:'しいです。けれども、'},{t:'勉強',r:'べんきょう'},{t:'していて'},{t:'楽',r:'たの'},{t:'しいです。'}]
      },
      {
        ja: '電話をかけました。けれども、誰も出ませんでした。',
        en: 'I placed a phone call. However, nobody answered.',
        segments: [{t:'電話',r:'でんわ'},{t:'をかけました。けれども、'},{t:'誰',r:'だれ'},{t:'も'},{t:'出',r:'で'},{t:'ませんでした。'}]
      }
    ],
    miniDrill: {
      question: 'この靴はデザインが良いです。（　★　）、少し重いです。',
      options: ['けれども', 'だから', 'そして', 'それに'],
      correct: 'けれども',
      explanation: 'Good design vs slightly heavy is a contrast, politely introduced by「けれども」.'
    }
  },
  'conj-demo': {
    commonMistake: 'Avoid using でも at the start of formal business documents or official written reports (use しかし instead).',
    nuanceDiff: '「でも」is the most standard and expressive casual-to-polite spoken contrast ("but / however"). It directly counters the preceding expectation.',
    extraExamples: [
      {
        ja: '寿司は好きです。でも、ワサビは苦手です。',
        en: 'I like sushi. But I am not good with wasabi.',
        segments: [{t:'寿司',r:'すし'},{t:'は'},{t:'好',r:'す'},{t:'きです。でも、ワサビは'},{t:'苦手',r:'にがて'},{t:'です。'}]
      },
      {
        ja: '行きたいです。でも、今日は時間がありません。',
        en: 'I want to go. But I don\'t have time today.',
        segments: [{t:'行',r:'い'},{t:'きたいです。でも、'},{t:'今日',r:'きょう'},{t:'は'},{t:'時間',r:'じかん'},{t:'がありません。'}]
      },
      {
        ja: '頑張りました。でも、試合に負けてしまいました。',
        en: 'I gave my best effort. But we ended up losing the match.',
        segments: [{t:'頑張',r:'がんば'},{t:'りました。でも、'},{t:'試合',r:'しあい'},{t:'に'},{t:'負',r:'ま'},{t:'けてしまいました。'}]
      }
    ],
    miniDrill: {
      question: '新しいパソコンが欲しいです。（　★　）、お金が足りません。',
      options: ['でも', 'だから', 'そして', 'すると'],
      correct: 'でも',
      explanation: 'Wanting a PC vs not having enough money is a natural conversational contrast:「でも」.'
    }
  },
  'conj-shikashi': {
    commonMistake: 'Avoid using しかし in casual chat with close friends (sounds overly formal and dramatic).',
    nuanceDiff: '「しかし」is the standard formal written adversative ("however / yet"). It appears in news, essays, speeches, and formal debates to clearly delineate two opposing positions.',
    extraExamples: [
      {
        ja: '全力を尽くしました。しかし、結果は期待通りではありませんでした。',
        en: 'We made every effort. However, the outcome was not as expected.',
        segments: [{t:'全力',r:'ぜんりょく'},{t:'を'},{t:'尽',r:'つ'},{t:'くしました。しかし、'},{t:'結果',r:'けっか'},{t:'は'},{t:'期待',r:'きたい'},{t:'通',r:'どお'},{t:'りではありませんでした。'}]
      },
      {
        ja: '調査は進んでいます。しかし、まだ原因は分かっていません。',
        en: 'The investigation is proceeding. However, the cause remains unknown.',
        segments: [{t:'調査',r:'ちょうさ'},{t:'は'},{t:'進',r:'すす'},{t:'んでいます。しかし、まだ'},{t:'原因',r:'げんいん'},{t:'は'},{t:'分',r:'わ'},{t:'かっていません。'}]
      },
      {
        ja: '理論的には可能です。しかし、実際には多くの困難があります。',
        en: 'Theoretically it is possible. However, in practice there are many difficulties.',
        segments: [{t:'理論',r:'りろん'},{t:'的',r:'てき'},{t:'には'},{t:'可能',r:'かのう'},{t:'です。しかし、'},{t:'実際',r:'じっさい'},{t:'には'},{t:'多',r:'おお'},{t:'くの'},{t:'困難',r:'こんなん'},{t:'があります。'}]
      }
    ],
    miniDrill: {
      question: '景気は回復傾向にある。（　★　）、先行きには依然として不透明感が残る。',
      options: ['しかし', 'だから', 'それに', 'ところで'],
      correct: 'しかし',
      explanation: 'Formal written prose presenting a counterpoint requires「しかし」.'
    }
  },
  'conj-tokoroga': {
    commonMistake: 'Do not use ところが for predictable contrasts (*私は肉が好きです。ところが妹は魚が好きです ❌ -> でも/一方 ⭕).',
    nuanceDiff: '「ところが」highlights an UNEXPECTED, surprising reversal ("even so / contrary to expectations, surprisingly..."). The result must defy what both speaker and listener anticipated.',
    extraExamples: [
      {
        ja: '約束の時間に行きました。ところが、誰もいませんでした。',
        en: 'I arrived at the promised time. Surprisingly, nobody was there.',
        segments: [{t:'約束',r:'やくそく'},{t:'の'},{t:'時間',r:'じかん'},{t:'に'},{t:'行',r:'い'},{t:'きました。ところが、'},{t:'誰',r:'だれ'},{t:'もいませんでした。'}]
      },
      {
        ja: '天気予報は晴れでした。ところが、突然大雨が降ってきました。',
        en: 'The forecast predicted clear skies. Contrary to expectations, sudden heavy rain poured.',
        segments: [{t:'天気',r:'てんき'},{t:'予報',r:'よほう'},{t:'は'},{t:'晴',r:'は'},{t:'れでした。ところが、'},{t:'突然',r:'とつぜん'},{t:'大雨',r:'おおあめ'},{t:'が'},{t:'降',r:'ふ'},{t:'ってきました。'}]
      },
      {
        ja: '簡単に合格すると思いました。ところが、不合格でした。',
        en: 'I thought I would pass easily. However, to my surprise, I failed.',
        segments: [{t:'簡単',r:'かんたん'},{t:'に'},{t:'合格',r:'ごうかく'},{t:'すると'},{t:'思',r:'おも'},{t:'いました。ところが、'},{t:'不合格',r:'ふごうかく'},{t:'でした。'}]
      }
    ],
    miniDrill: {
      question: '電車に乗れば間に合うと思った。（　★　）、事故で遅れてしまった。',
      options: ['ところが', 'だから', 'そして', 'たとえば'],
      correct: 'ところが',
      explanation: 'An unforeseen accident overturning the initial expectation ("thought I would make it in time") requires「ところが」.'
    }
  },
  'conj-soredewa': {
    commonMistake: 'Do not use それでは to introduce a contrast (*美味しかった。それでは高かった ❌).',
    nuanceDiff: '「それでは」(spoken short: では / じゃあ) opens an action, transitions to the next agenda item, or offers a departure closing ("well then / now then / in that case").',
    extraExamples: [
      {
        ja: '時間になりました。それでは、会議を始めましょう。',
        en: 'Time has arrived. Well then, let us begin the meeting.',
        segments: [{t:'時間',r:'じかん'},{t:'になりました。それでは、'},{t:'会議',r:'かいぎ'},{t:'を'},{t:'始',r:'はじ'},{t:'めましょう。'}]
      },
      {
        ja: '全員集まりましたね。それでは、出発します。',
        en: 'Everyone has gathered. Now then, we are departing.',
        segments: [{t:'全員',r:'ぜんいん'},{t:'集',r:'あつ'},{t:'まりましたね。それでは、'},{t:'出発',r:'しゅっぱつ'},{t:'します。'}]
      },
      {
        ja: 'それでは、また来週お会いしましょう。',
        en: 'Well then, let us meet again next week.',
        segments: [{t:'それでは、また'},{t:'来週',r:'らいしゅう'},{t:'お'},{t:'会',r:'あ'},{t:'いしましょう。'}]
      }
    ],
    miniDrill: {
      question: '準備ができました。（　★　）、試験を始めます。',
      options: ['それでは', 'しかし', 'ところが', 'なぜなら'],
      correct: 'それでは',
      explanation: 'Starting an activity after completing preparations is initiated by「それでは」(Well then / Now).'
    }
  },
  'conj-tokorode': {
    commonMistake: 'Never use ところで in the middle of developing the same topic (use そして or それに).',
    nuanceDiff: '「ところで」signals an ABRUPT change of topic ("by the way"). It pivots away from the ongoing subject to bring up something new.',
    extraExamples: [
      {
        ja: '今日の仕事は終わりました。ところで、週末の予定は？',
        en: 'Today\'s work is done. By the way, what are your plans for the weekend?',
        segments: [{t:'今日',r:'きょう'},{t:'の'},{t:'仕事',r:'しごと'},{t:'は'},{t:'終',r:'お'},{t:'わりました。ところで、'},{t:'週末',r:'しゅうまつ'},{t:'の'},{t:'予定',r:'よてい'},{t:'は？'}]
      },
      {
        ja: '試験お疲れ様でした。ところで、田中さんは元気ですか。',
        en: 'Great job on the exam. By the way, is Tanaka doing well?',
        segments: [{t:'試験',r:'しけん'},{t:'お'},{t:'疲',r:'つか'},{t:'れ'},{t:'様',r:'さま'},{t:'でした。ところで、'},{t:'田中',r:'たなか'},{t:'さんは'},{t:'元気',r:'げんき'},{t:'ですか。'}]
      },
      {
        ja: 'いい天気ですね。ところで、何時ですか。',
        en: 'It\'s nice weather, isn\'t it? By the way, what time is it?',
        segments: [{t:'いい'},{t:'天気',r:'てんき'},{t:'ですね。ところで、'},{t:'何時',r:'なんじ'},{t:'ですか。'}]
      }
    ],
    miniDrill: {
      question: 'もうすぐ夏休みですね。（　★　）、旅行の切符はもう買いましたか。',
      options: ['ところで', 'だから', 'しかし', 'すると'],
      correct: 'ところで',
      explanation: 'Pivoting from general conversation to a distinct topic ("By the way, have you bought the tickets?") requires「ところで」.'
    }
  },
  'conj-tatoeba': {
    commonMistake: 'Do not use たとえば to state a conclusion or logical consequence.',
    nuanceDiff: '「たとえば」presents concrete examples ("for example / for instance") illustrating a preceding broad statement.',
    extraExamples: [
      {
        ja: '日本には美味しい料理がたくさんあります。たとえば、寿司やラーメンです。',
        en: 'Japan has lots of delicious dishes. For example, sushi and ramen.',
        segments: [{t:'日本',r:'にほん'},{t:'には'},{t:'美味',r:'おい'},{t:'しい'},{t:'料理',r:'りょうり'},{t:'がたくさんあります。たとえば、'},{t:'寿司',r:'すし'},{t:'やラーメンです。'}]
      },
      {
        ja: '色々なスポーツをします。たとえば、サッカーや水泳です。',
        en: 'I play various sports. For instance, soccer and swimming.',
        segments: [{t:'色',r:'いろ'},{t:'々',r:'いろ'},{t:'なスポーツをします。たとえば、サッカーや'},{t:'水泳',r:'すいえい'},{t:'です。'}]
      },
      {
        ja: '休日は家でのんびりします。たとえば、映画を見たり本を読んだりします。',
        en: 'On holidays I relax at home. For example, watching movies and reading books.',
        segments: [{t:'休日',r:'きゅうじつ'},{t:'は'},{t:'家',r:'いえ'},{t:'でのんびりします。たとえば、'},{t:'映画',r:'えいが'},{t:'を'},{t:'見',r:'み'},{t:'たり'},{t:'本',r:'ほん'},{t:'を'},{t:'読',r:'よ'},{t:'んだりします。'}]
      }
    ],
    miniDrill: {
      question: '私は甘いものが大好きです。（　★　）、ケーキやチョコレートです。',
      options: ['たとえば', 'だから', 'しかし', 'ところで'],
      correct: 'たとえば',
      explanation: 'Giving specific instances (cake and chocolate) of sweet things requires「たとえば」(for example).'
    }
  }
};

conjData.items.forEach(item => {
  const enrich = CONJ_ENRICHMENT[item.id];
  if (enrich) {
    item.commonMistake = enrich.commonMistake;
    item.nuanceDiff = enrich.nuanceDiff;
    item.extraExamples = enrich.extraExamples;
    item.miniDrill = enrich.miniDrill;
  }
});

fs.writeFileSync('data/conjunctions.json', JSON.stringify(conjData, null, 2));
console.log(`Successfully enriched ${conjData.items.length} conjunction items in data/conjunctions.json!`);
