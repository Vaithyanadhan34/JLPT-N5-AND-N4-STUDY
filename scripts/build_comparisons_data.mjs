import fs from 'node:fs';

const CONTRAST_GROUPS = [
  {
    id: 'group-conditionals',
    title: 'ば · たら · と · なら',
    hint: 'Four ways to say "if" and "when" in Japanese',
    patternIds: ['g-l22-1', 'g-l21-1', 'g-l14-2', 'g-l22-2'],
    patterns: ['～ば', '～たら', '～と', '～なら'],
    keyDifference: '「と」marks automatic, natural results or discoveries (never commands/requests).「ば」expresses general conditional logic (cannot end in requests for action verbs).「たら」is the most versatile colloquial conditional allowing personal intentions and requests.「なら」takes another speaker\'s topic as a premise to give contextual advice.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'If / when (logical, general condition)',
          'If / once / when (after completing or under condition)',
          'Whenever / once / upon (inevitable or immediate consequence)',
          'If it is the case that / as for (contextual topic condition)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          'Vば形 / Aければ / Na・Nなら(ば)',
          'V・A・Na・N た形 + ら',
          'V辞書形 / Vない形 + と',
          'N / Na / 普通形 (no だ) + なら'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Neutral to formal; common in proverbs and written guides',
          'Conversational, natural in everyday spoken Japanese',
          'Neutral to formal; objective description',
          'Conversational; dialogue responding to previous comment'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Logical guidelines, recipes, machine operation tips',
          'Future plans ("once we arrive"), hypothetical daily situations',
          'Natural laws ("spring comes -> flowers bloom"), street directions',
          'Giving recommendations or opinions after hearing someone else'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot end in requests (~てください) or will (~ましょう) if main clause verb is an action',
          'Rarely used for scientific invariable truths',
          'Cannot end in speaker\'s intention, hope, permission, or request (~てください / ~たい)',
          'Cannot be used for pure chronological sequence without contextual topic premise'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '安ければ買います。(If it is cheap, I will buy it.)',
          '家に着いたら電話してください。(Once you get home, please call me.)',
          'このボタンを押すと切符が出ます。(When you press this button, the ticket comes out.)',
          '京都へ行くなら新幹線が便利です。(If you are going to Kyoto, the Shinkansen is convenient.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '春になれば桜が咲きます。(If/when spring arrives, cherry blossoms bloom.)',
          '雨が降ったら行きません。(If it rains, I will not go.)',
          '右へ曲がると郵便局があります。(Turn right and the post office is right there.)',
          '寿司ならあの店が一番美味しいです。(If it is sushi, that restaurant is the most delicious.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Using ～ば with a command at the end for an active verb (*時間が読めば来てください ❌ -> 読んだら⭕)',
          'Confusing ～たら with ～と for automatic machinery reactions',
          'Ending ～と with a request (*春になると会いましょう ❌ -> 会いたいです/会えません⭕)',
          'Using ～なら when the premise was not previously mentioned by the listener'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'JLPT tests whether the main clause contains a request (~てください) -> only たら and なら allow it!',
          'Look for sequence: event A finishes first before event B starts -> use たら',
          'Look for natural laws, directions, or sudden discovery -> use と',
          'Look for conversation partner asking for advice -> use なら'
        ]
      }
    ],
    quizItems: [
      {
        question: '日本へ（　★　）、富士山に登りたいです。',
        options: ['行くと', '行ったら', '行けば', '行くなら'],
        correct: '行ったら',
        explanation: 'Because the sentence ends with a personal intention/wish (~たい),「と」is grammatically forbidden. Since the trip happens first before climbing,「行ったら」is correct.'
      },
      {
        question: '「京都へ旅行したいです。」「京都へ（　★　）、秋が一番綺麗ですよ。」',
        options: ['行くと', '行ったら', '行くなら', '行けば'],
        correct: '行くなら',
        explanation: 'The speaker picks up the listener\'s stated plan as a premise to give recommendation, so「なら」is natural.'
      }
    ]
  },
  {
    id: 'group-hearsay-conjecture',
    title: 'そうだ(伝聞) · そう(様態) · ようだ · らしい',
    hint: 'Reporting hearsay vs visual impression vs personal conjecture',
    patternIds: ['g-l15-2', 'g-l15-1', 'g-l25-1', 'g-l28-1'],
    patterns: ['～そうだ (伝聞)', '～そう (様態)', '～ようだ (推量)', '～らしい (推量)'],
    keyDifference: '「～そうだ(伝聞)」reports third-party hearsay with zero personal judgment.「～そう(様態)」is immediate visual intuition ("it looks like...").「～ようだ」is thoughtful inference based on sensory clues or evidence.「～らしい」is conjecture based on external rumors, reports, or secondhand signs.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'I heard that / they say (hearsay)',
          'Looks like / appears about to (immediate visual impression)',
          'Seems like / appears to be (evidence-based inference / simile)',
          'Apparently / seems like (hearsay-based deduction / typical trait)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          '普通形 + そうだ (Naだ, Nだ retained)',
          'Vます-stem / Aい抜き / Na + そうだ (Aいい→よさそう)',
          '普通形 + ようだ (Naな, Nの + ようだ)',
          '普通形 + らしい (Na, N drop だ)'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Neutral to formal; frequently quotes news or peers',
          'Neutral to casual; instantaneous physical reaction',
          'Polite to formal; written or considerate spoken Japanese',
          'Informal to neutral; widespread conversational conjecture'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Quoting weather reports, announcements, books, rumors',
          'Looking at food ("looks tasty"), dark clouds ("looks like rain")',
          'Inferring from sounds, smells, or observed facts ("the light is off")',
          'Hearing neighborhood talk or media buzz about someone'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot describe something you directly witnessed firsthand',
          'Cannot use for colors or obvious facts (*赤いそうだ ❌ -> 赤い)',
          'Cannot use when there is zero physical or contextual evidence',
          'Cannot use when you are 100% certain from direct eyewitness'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '明日は雨が降るそうです。(I heard it will rain tomorrow.)',
          '今にも雨が降りそうです。(It looks like it is about to rain right now.)',
          '外は雨が降っているようです。(It seems that it is raining outside - hearing raindrops.)',
          '明日は雨らしいです。(Apparently it is going to rain tomorrow.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '田中さんは来月結婚するそうです。(I heard Tanaka is getting married next month.)',
          'この料理はとても美味しそうです。(This dish looks very delicious.)',
          '彼はもう帰ったようです。(It appears he has already gone home - coat is gone.)',
          '田中さんは仕事を辞めるらしい。(Tanaka is apparently quitting his job - word on the street.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Confusing 雨が降るそうだ (hearsay) with 雨が降りそうだ (visual prediction)',
          'Saying *きれいそうだ (visual) for someone who is clearly pretty -> just say きれいだ',
          'Forgetting の after nouns before ようだ (雨のようだ ⭕, *雨ようだ ❌)',
          'Putting だ before らしい (*学生だらしい ❌ -> 学生らしい ⭕)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Check the verb form:辞書形+そうだ = Hearsay; ます抜き+そう = Visual appearance!',
          'いい becomes よさそう and ない becomes なさそう in visual appearance',
          'Look for sensory clue (音、匂い) -> ようだ is the standard choice',
          'Look for Nらしい meaning "acting true to its nature" (男らしい, 子どもらしい)'
        ]
      }
    ],
    quizItems: [
      {
        question: '空が暗くなって、今にも雨が（　★　）。',
        options: ['降るそうです', '降りそうです', '降るようです', '降るらしいです'],
        correct: '降りそうです',
        explanation: '「今にも」expresses imminent visual expectation ("about to"), requiring Vます-stem + そうだ: 降りそうです.'
      }
    ]
  },
  {
    id: 'group-kara-node',
    title: 'ので · から',
    hint: 'Polite objective reason vs subjective personal justification',
    patternIds: ['g-l13-2', 'g-l13-1'],
    patterns: ['～ので', '～から'],
    keyDifference: '「ので」presents cause-and-effect as an objective, gentle circumstance, making it polite and suitable for requests or apologies.「から」emphasizes the speaker\'s personal reasoning or conviction and can directly precede commands, prohibitions, and invitations.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Because / since (gentle, objective circumstance)',
          'Because / since (subjective reason, personal justification)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          '普通形 + ので (Naな, Nな + ので)',
          '普通形 / 丁寧形 + から (Naだ, Nだ + から)'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Polite, considerate, softer impact; preferred in business and apologies',
          'Direct, expressive, assertive; common in everyday conversations'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Asking for favors, reporting train delays, making excuses politely',
          'Giving strong advice, expressing personal resolve, stating urgent reasons'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot directly connect to strong commands (*危ないので、触るな ❌ -> から ⭕)',
          'Avoid in formal letters when apologizing to senior clients'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '頭が痛いので、先に失礼します。(Because I have a headache, please excuse me for leaving early.)',
          '危ないから、触ってはいけません。(Because it is dangerous, you must not touch it!)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '電車が遅れたので、遅刻しました。(Because the train was delayed, I was late.)',
          '時間がないから、早く急ぎましょう。(Because we have no time, let\'s hurry up!)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Using だ before ので (*病気だので ❌ -> 病気なので ⭕)',
          'Using から when trying to be extremely courteous in a formal request'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Check the noun connector: N + なので vs N + だから!',
          'If the end of sentence is an order or invitation (~なさい, ~てください, ~ましょう), から is more natural.'
        ]
      }
    ],
    quizItems: [
      {
        question: '今日は雨（　★　）、傘を持っていってください。',
        options: ['なので', 'だから', 'なから', 'で'],
        correct: 'だから',
        explanation: 'Because the sentence ends in a recommendation/imperative (~持っていってください),「だから」is standard.'
      }
    ]
  },
  {
    id: 'group-youni-tameni',
    title: 'ように · ために',
    hint: 'Goal state beyond direct control vs volitional purposeful action',
    patternIds: ['g-l18-1', 'g-l18-2'],
    patterns: ['～ように', '～ために'],
    keyDifference: '「ために」marks a deliberate action by a single subject aiming at a controllable goal.「ように」marks a desired state, condition, or circumstance that is outside immediate muscular control (attaches to potential, negative, or non-volitional verbs).',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'So that / in order that (aiming for a condition or state)',
          'In order to / for the purpose of (volitional objective)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          'V可能形 / Vない形 / 無意志動詞 辞書形 + ように',
          'V意志動詞 辞書形 + ために / N + のために'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Neutral to formal spoken and written Japanese',
          'Neutral to formal; strong purposeful tone'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Enabling an ability ("so I can speak"), preventing an accident ("so I don\'t forget")',
          'Major investments ("to buy a car"), saving money, working for family'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot attach directly to simple volitional action verbs (*車を買うように貯金する ❌)',
          'Cannot take non-volitional or potential verbs (*合格できるために勉強する ❌)'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '日本語が上手に話せるように、毎日練習しています。(I practice every day so that I can speak Japanese well.)',
          '日本へ留学するために、お金を貯めています。(I am saving money in order to study abroad in Japan.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '忘れないように、メモを取ってください。(Please take notes so that you don\'t forget.)',
          '健康のために、毎朝走っています。(For the sake of health, I run every morning.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Pairing 可能形 with ために (*話せるために ❌ -> 話せるように ⭕)',
          'Pairing ない形 with ために (*忘れないために is less natural than 忘れないように)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Rule of thumb: Potential verb (話せる, 見える, 聞こえる) or ない形 -> choose ように!',
          'Rule of thumb: Simple dictionary verb with volitional intention -> choose ために!'
        ]
      }
    ],
    quizItems: [
      {
        question: '後ろの人にもよく（　★　）、大きな字で書きました。',
        options: ['見えるように', '見るために', '見えるために', '見るように'],
        correct: '見えるように',
        explanation: '「見える」is a non-volitional potential perception verb ("can see / visible"), so it must take「ように」.'
      }
    ]
  },
  {
    id: 'group-koto-ni-suru-naru',
    title: 'ことにする · ことになる',
    hint: 'Own conscious decision vs external arrangement or natural outcome',
    patternIds: ['g-l16-1', 'g-l16-2'],
    patterns: ['～ことにする', '～ことになる'],
    keyDifference: '「ことにする」expresses a choice decided consciously by the speaker.「ことになる」describes an outcome, rule, or arrangement settled externally or by collective agreement, downplaying individual responsibility.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Decide to / make it a personal rule to',
          'It has been decided that / it is arranged that'
        ]
      },
      {
        label: 'Formation',
        cells: [
          'V辞書形 / Vない形 + ことにする',
          'V辞書形 / Vない形 + ことになる'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Everyday conversational and self-commitment speech',
          'Polite, official, or organizational communication'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Personal resolutions ("I decided to quit smoking", "I decided to buy this")',
          'Company transfers, school rules, schedule changes decided by others'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot describe events decided by company management without speaker choice',
          'Cannot express personal spontaneous ego-driven resolutions'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '健康のために、毎日野菜を食べることにしました。(I decided to eat vegetables every day for my health.)',
          '来月から東京本社へ転勤することになりました。(It has been decided that I will transfer to Tokyo HQ next month.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          'たばこをやめることにしました。(I have decided to quit smoking.)',
          '法律でこの場所での駐車は禁止されることになりました。(It was arranged by law that parking here is prohibited.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Saying 転勤することにしました when your boss forced the transfer (sounds like you chose it yourself)',
          'Using ことになる for personal shopping decisions'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Look for personal will ("I decided") -> ことにする',
          'Look for official announcements ("It was decided by the committee") -> ことになる'
        ]
      }
    ],
    quizItems: [
      {
        question: '会社からの指示で、来年アメリカ支社へ（　★　）。',
        options: ['行くことにしました', '行くことになりました', '行くようにしました', '行くようになりました'],
        correct: '行くことになりました',
        explanation: 'Because the decision originated from company directives (会社からの指示),「ことになる」expresses external corporate determination.'
      }
    ]
  },
  {
    id: 'group-te-morau-kureru-ageru',
    title: 'てもらう · てくれる · てあげる',
    hint: 'Direction of benefactive actions: receiving vs giving favors',
    patternIds: ['g-l10-1', 'g-l10-2', 'g-l10-3'],
    patterns: ['～てもらう', '～てくれる', '～てあげる'],
    keyDifference: '「～てあげる」= speaker performs favor for someone (can sound patronizing to superiors).「～てくれる」= someone performs favor for speaker or speaker\'s in-group.「～てもらう」= speaker receives benefit or initiates request for someone to do a favor.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Receive the favor of someone doing ... (got someone to do)',
          'Someone kindly does ... for me / my in-group',
          'Do ... as a favor for someone (give a favor)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          '[receiver] は [giver] に + Vて形 + もらう',
          '[giver] は [receiver (私)] に + Vて形 + くれる',
          '[giver (私)] は [receiver] に + Vて形 + あげる'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Humble / polite; respectful version is ～ていただく',
          'Appreciative / warm; respectful version is ～てくださる',
          'Warm towards equals/children; rude towards superiors (use ～てさしあげる)'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Asking someone to help or being grateful for requested assistance',
          'Someone spontaneously helping you when you were in trouble',
          'Helping friends, younger siblings, pets with tasks'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot have [私] as the person marked by に doing the action',
          'Cannot have [私] as the grammatical subject performing the action',
          'Never use directly to teachers, bosses, or clients (*手伝ってあげます ❌)'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '私は先生に日本語を教えてもらいました。(I had the teacher teach me Japanese.)',
          '田中さんが駅まで車で送ってくれました。(Tanaka kindly gave me a ride to the station.)',
          '私は弟の宿題を手伝ってあげました。(I helped my younger brother with his homework.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '友達に荷物を持ってもらいました。(I got my friend to hold my luggage.)',
          '母が美味しいお弁当を作ってくれた。(My mother kindly made me a delicious bento.)',
          '友達に傘を貸してあげました。(I lent an umbrella to my friend.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Confusing subject particle: 私は田中さんに～てもらった vs 田中さんは私に～てくれた',
          'Offering assistance to a teacher saying 手伝ってあげましょうか (sounds arrogant)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Look at the subject: If subject is [私] receiving help -> もらう',
          'If subject is [another person] helping me -> くれる',
          'If subject is [私] helping someone else -> あげる'
        ]
      }
    ],
    quizItems: [
      {
        question: '道に迷ったとき、親切な人が交番まで案内して（　★　）。',
        options: ['あげました', 'くれました', 'もらいました', 'やりました'],
        correct: 'くれました',
        explanation: 'The kind person (親切な人) is the subject performing the helpful action towards the speaker, so「くれました」is correct.'
      }
    ]
  },
  {
    id: 'group-ageru-kureru-morau',
    title: 'あげる · くれる · もらう',
    hint: 'Physical gifts: direction of giving and receiving objects',
    patternIds: ['g-l3-1', 'g-l3-2', 'g-l3-3'],
    patterns: ['あげる', 'くれる', 'もらう'],
    keyDifference: '「あげる」= give outward (I give to you / someone).「くれる」= give inward (someone gives to me / my family).「もらう」= receive from someone.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'To give (outward from speaker)',
          'To give (inward towards speaker)',
          'To receive (from someone)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          '[giver] は [receiver] に [item] を あげる',
          '[giver] は [私] に [item] を くれる',
          '[receiver] は [giver] に/から [item] を もらう'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Plain/polite; honorific is さしあげる',
          'Plain/polite; honorific is くださる',
          'Plain/polite; humble is いただく'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Giving birthday presents, flowers, souvenirs to others',
          'Receiving unexpected gifts or kindness from others to yourself',
          'Receiving awards, allowances, presents from someone'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot use when someone gives an item to [私]',
          'Cannot use when [私] is giving to another person',
          'Cannot be used when the action involves no transfer'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '私は誕生日に妹に本をあげました。(I gave a book to my younger sister on her birthday.)',
          '誕生日に友達が花をくれました。(A friend gave me flowers on my birthday.)',
          '私は父から時計をもらいました。(I received a watch from my father.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '猫にご飯をあげました。(I gave food to the cat.)',
          '先生がこの辞書をくださいました。(The teacher gave me this dictionary.)',
          '母にお小遣いをもらいました。(I received pocket money from my mother.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Saying *友達は私に本をあげました ❌ (must be くれました ⭕)',
          'Confusing から and に with もらう (both are valid for people)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Remember: くれる ALWAYS directs toward [私] or speaker\'s family!',
          'あげる ALWAYS directs away from [私] toward another party.'
        ]
      }
    ],
    quizItems: [
      {
        question: '誕生日に友達が素敵なプレゼントを（　★　）。',
        options: ['あげました', 'くれました', 'もらいました', 'やりました'],
        correct: 'くれました',
        explanation: 'Friend (友達) is the subject who gave the gift to me, so「くれました」is required.'
      }
    ]
  },
  {
    id: 'group-passive-causative',
    title: '受身 · 使役 · 使役受身',
    hint: 'Passive vs Causative vs Causative-Passive voice dynamics',
    patternIds: ['g-l23-1', 'g-l26-1', 'g-l26-2'],
    patterns: ['～れる／～られる (受身)', '～せる／～させる (使役)', '～させられる (使役受身)'],
    keyDifference: '「受身(Passive)」= action is received, often with grievance or respect.「使役(Causative)」= making or letting someone do something.「使役受身(Causative-Passive)」= being forced or made to do something against one\'s initial willingness.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Be done (passive voice; often suffering/inconvenience)',
          'Make / let someone do (causative voice)',
          'Be forced / made to do (causative-passive voice)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          'V1: あ段 + れる / V2: られる / する→される / くる→こられる',
          'V1: あ段 + せる / V2: させる / する→させる / くる→こさせる',
          'V1: あ段 + せられる (短縮: される) / V2: させられる / する→させられる'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Standard Japanese grammar across all registers',
          'Standard; can be authoritative ("make") or permissive ("let")',
          'Conversational and expressive of reluctance'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Being praised, stepped on, rained on, or having items stolen',
          'Parents making kids study, teachers letting students speak',
          'Being made to sing at karaoke, drink alcohol, or wait for hours'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot use when the subject performed the action voluntarily',
          'Avoid using towards social superiors without permission request (~させていただけませんか)',
          'Cannot use when you happily and voluntarily chose the task'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '電車の中で足を踏まれました。(My foot was stepped on in the train - suffering passive.)',
          '先生は学生に宿題をたくさんさせました。(The teacher made the students do a lot of homework.)',
          '嫌いな野菜を無理やり食べさせられました。(I was forced to eat vegetables I disliked.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '先生に褒められました。(I was praised by the teacher.)',
          '子どもに好きな本を読ませました。(I let my child read their favorite book.)',
          'カラオケで歌を歌わされた。(I was forced to sing a song at karaoke.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Confusing short causative-passive 歌わされた (from 歌う) with plain passive 歌われた',
          'Using causative-passive when you did the task gladly'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Look for reluctance clues (無理やり, 嫌だった) -> Causative-Passive (~させられた)',
          'Look for permissive context (自由に, 好きなように) -> Permissive Causative (~させた)'
        ]
      }
    ],
    quizItems: [
      {
        question: '子どものころ、母にピアノを毎日（　★　）。本当は嫌でした。',
        options: ['練習させました', '練習されました', '練習させられました', '練習してもらいました'],
        correct: '練習させられました',
        explanation: 'Because the speaker disliked it and was forced by mother (本当は嫌でした), the causative-passive「練習させられました」is correct.'
      }
    ]
  },
  {
    id: 'group-younisuru-naruni',
    title: 'ようにする · ようになる',
    hint: 'Conscious habit-forming effort vs natural gradual transformation',
    patternIds: ['g-l18-4', 'g-l18-5'],
    patterns: ['～ようにする', '～ようになる'],
    keyDifference: '「ようにする」is conscious discipline and deliberate habit-building.「ようになる」is a natural, gradual shift in ability or habitual state over time.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Make an ongoing effort to / make sure to',
          'Come to / reach the point where / gradually become able to'
        ]
      },
      {
        label: 'Formation',
        cells: [
          'V辞書形 / Vない形 + ようにする',
          'V可能形 / V辞書形 / Vない形 + ようになる'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Standard conversational advice and habit statement',
          'Standard descriptive statement of growth or change'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Dietary discipline, reminders, health routines',
          'Language learning progress ("I can now read kanji"), technological adoption'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot describe involuntary physical developments',
          'Cannot describe intentional short-term personal discipline'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '毎日野菜を食べるようにしています。(I make sure to eat vegetables every day.)',
          '日本のアニメを見て、日本語が少し分かるようになりました。(Watching Japanese anime, I have come to understand Japanese a little.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '夜更かしをしないようにしてください。(Please make sure not to stay up late.)',
          '練習して、自転車に乗れるようになりました。(Practicing, I became able to ride a bicycle.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Using ようにする for ability transformation (*話せるようにしました ❌ -> 話せるようになりました ⭕)',
          'Using ようになる when ordering someone to do something (*食べるようになってください ❌)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'If paired with 可能形 (話せる, 乗れる, 読める) describing acquired skill -> choose ようになる!',
          'If paired with ongoing advice or habits (~ています, ~てください) -> choose ようにする!'
        ]
      }
    ],
    quizItems: [
      {
        question: '毎日練習したおかげで、５キロ（　★　）。',
        options: ['走るようにしました', '走れるようになりました', '走ることにしました', '走るようにしてください'],
        correct: '走れるようになりました',
        explanation: 'Acquiring the capability to run 5km through continuous practice is an ability transformation:「走れるようになりました」.'
      }
    ]
  },
  {
    id: 'group-hazu-kamoshirenai',
    title: 'はず · はずがない · かもしれない',
    hint: 'High rational confidence vs absolute denial vs modest possibility',
    patternIds: ['g-l27-2', 'g-l27-3', 'g-l14-1'],
    patterns: ['～はずだ', '～はずがない', '～かもしれない'],
    keyDifference: '「～はずだ」= speaker possesses strong logical grounds to expect something (90%+ confidence).「～はずがない」= emphatic logical conviction that something is impossible.「～かもしれない」= modest speculation with low to moderate certainty (~50% or less).',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Should be / bound to be (strong logical expectation)',
          'Cannot possibly be / no way that (strong logical impossibility)',
          'Might / maybe / could be (modest speculation)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          '普通形 + はずだ (Naな, Nの + はずだ)',
          '普通形 + はずがない (Naな, Nの + はずがない)',
          '普通形 + かもしれない (Na, N drop だ)'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Neutral to conversational; based on known facts',
          'Strong, persuasive denial based on clear facts',
          'Modest, cautious conversational tone'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Assuming package arrived based on tracking info; timetable deductions',
          'Rejecting an accusation ("He is honest, he would never lie!")',
          'Tentative warnings ("it might rain", "he might be busy")'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot use when you have zero objective grounds',
          'Cannot use if there is any plausible suspicion of truth',
          'Cannot use if you are 100% certain from firsthand sight'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '田中さんは昨日チケットを買ったから、今日来るはずです。(Tanaka bought a ticket yesterday, so he should come today.)',
          'そんな難しいこと、子どもに分かるはずがありません。(There is no way a child could understand such a difficult thing.)',
          '明日は午後から雪が降るかもしれません。(It might snow tomorrow afternoon.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          'この薬を飲めば、すぐに熱が下がるはずです。(If you take this medicine, your fever should go down soon.)',
          '真面目な彼が嘘をつくはずがない。(There is no way that serious guy would tell a lie.)',
          '鍵をどこかに落としたかもしれない。(I might have dropped my key somewhere.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Using だ after noun before はず (*学生だはず ❌ -> 学生のはず ⭕)',
          'Using だ before かもしれない (*雨だかもしれない ❌ -> 雨かもしれない ⭕)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Notice noun connector: N + のはず vs N + かもしれない (drop だ)!',
          'Look for negative polarity: はずがない = わけがない (cannot possibly be).'
        ]
      }
    ],
    quizItems: [
      {
        question: '今日は日曜日だから、銀行は（　★　）。',
        options: ['休みのはずです', '休みのようです', '休むらしいです', '休んだそうです'],
        correct: '休みのはずです',
        explanation: 'Because it is Sunday, rational deduction dictates the bank should be closed: Noun + のはずです.'
      }
    ]
  },
  {
    id: 'group-teiru-tearu',
    title: 'ている · てある',
    hint: 'Resulting state of an intransitive verb vs purposeful state of a transitive verb',
    patternIds: ['g-l8-1', 'g-l8-2'],
    patterns: ['～ている (結果状態)', '～てある (結果状態)'],
    keyDifference: '「～ている」with intransitive verbs describes a continuing natural state resulting from a past change (e.g. 窓が開いている = window is open).「～てある」with transitive verbs emphasizes that someone deliberately created and left that state for a purpose (e.g. 窓が開けてある = window was opened intentionally for ventilation).',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Is [in state of] (resulting state of spontaneous or intransitive action)',
          'Has been done and remains so (purposeful completed state of transitive action)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          '自動詞 Vて形 + いる',
          '他動詞 Vて形 + ある (usually marks object with が)'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Standard descriptive speech across all registers',
          'Standard speech highlighting preparation or intentional arrangement'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Noticing an open door, a dropped wallet, a broken glass',
          'Noticing calendar entries, reserved tickets, cooked meals ready on table'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot express that someone deliberately prepared the condition for a goal',
          'Cannot attach to intransitive verbs (*ドアが開いてある ❌)'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '窓が開いています。(The window is open - observing simple state.)',
          '部屋の空気を換えるために、窓が開けてあります。(The window has been opened to air out the room - purposeful.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '電気がついています。(The light is on.)',
          'カレンダーに来週の予定が書いてあります。(Next week\'s schedule is written on the calendar.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Pairing transitive 開ける with ている to describe state (*窓が開けています ❌ -> 開いています ⭕)',
          'Pairing intransitive 開く with てある (*窓が開いてある ❌ -> 開けてある ⭕)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Pairing rule: 自動詞 + ている (開いている, 落ちている, 壊れている)',
          'Pairing rule: 他動詞 + てある (開けてある, 並べてある, 準備してある)'
        ]
      }
    ],
    quizItems: [
      {
        question: 'パーティーの準備はどうですか。料理はテーブルに（　★　）。',
        options: ['並んでいます', '並べてあります', '並んであります', '並べています'],
        correct: '並べてあります',
        explanation: 'The food was intentionally arranged on the table by someone in preparation for the party: 他動詞 (並べる) + てある.'
      }
    ]
  },
  {
    id: 'group-ni-suru-naru',
    title: 'にする · になる',
    hint: 'Personal selection from options vs natural change or arrival of state',
    patternIds: ['g-l4-1', 'g-l4-2'],
    patterns: ['～にする', '～になる'],
    keyDifference: '「～にする」expresses an active choice selected from menu options or alternatives.「～になる」expresses a transformation, natural passage of time, or state change occurring on its own.',
    rows: [
      {
        label: 'Meaning',
        cells: [
          'Decide on / choose / pick (an option)',
          'Become / turn into / reach (a state)'
        ]
      },
      {
        label: 'Formation',
        cells: [
          'N + にする / Aくする / Naにする',
          'N + になる / Aくなる / Naになる'
        ]
      },
      {
        label: 'Politeness / Register',
        cells: [
          'Everyday conversational choice statement (restaurant orders)',
          'Standard descriptive statement of transformation'
        ]
      },
      {
        label: 'Typical situation',
        cells: [
          'Ordering at a cafe ("I\'ll have coffee"), choosing a travel destination',
          'Changing seasons ("it turned cold"), age ("turned 20"), growing up'
        ]
      },
      {
        label: "Can't be used when",
        cells: [
          'Cannot describe natural aging or weather changes without conscious intervention',
          'Cannot describe an active consumer ordering choice at a restaurant'
        ]
      },
      {
        label: 'Example 1',
        cells: [
          '私はコーヒーにします。(I will have coffee - ordering choice.)',
          '来月二十歳になります。(I will turn twenty years old next month.)'
        ]
      },
      {
        label: 'Example 2',
        cells: [
          '旅行の行き先は北海道にしました。(I decided on Hokkaido as the trip destination.)',
          '暖かくなって、春らしくなりました。(It has become warm and spring-like.)'
        ]
      },
      {
        label: 'Common trap',
        cells: [
          'Ordering at a restaurant saying 私はコーヒーになります (sounds like "I will turn into a coffee")',
          'Using にする for natural weather shifts (*春にしました ❌ -> 春になりました ⭕)'
        ]
      },
      {
        label: 'Exam tip',
        cells: [
          'Ordering food or picking alternatives -> ALWAYS use「～にする」!',
          'Weather, age, becoming a doctor/teacher -> ALWAYS use「～になる」!'
        ]
      }
    ],
    quizItems: [
      {
        question: '店員：「ご注文はお決まりですか。」客：「私はカレー（　★　）。」',
        options: ['になります', 'にします', 'であります', 'がします'],
        correct: 'にします',
        explanation: 'When ordering food or selecting a menu choice, the standard expression is Noun + にする.'
      }
    ]
  }
];

fs.writeFileSync('data/comparisons.json', JSON.stringify(CONTRAST_GROUPS, null, 2));
console.log(`Successfully generated data/comparisons.json with all ${CONTRAST_GROUPS.length} contrast groups!`);
