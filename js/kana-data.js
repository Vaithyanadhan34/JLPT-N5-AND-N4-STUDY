const KANA_DATA = [
  { id: 'a', romaji: 'a', hiragana: 'あ', katakana: 'ア', row: 'vowel', col: 'a', group: 'basic' },
  { id: 'i', romaji: 'i', hiragana: 'い', katakana: 'イ', row: 'vowel', col: 'i', group: 'basic' },
  { id: 'u', romaji: 'u', hiragana: 'う', katakana: 'ウ', row: 'vowel', col: 'u', group: 'basic' },
  { id: 'e', romaji: 'e', hiragana: 'え', katakana: 'エ', row: 'vowel', col: 'e', group: 'basic' },
  { id: 'o', romaji: 'o', hiragana: 'お', katakana: 'オ', row: 'vowel', col: 'o', group: 'basic' },

  { id: 'ka', romaji: 'ka', hiragana: 'か', katakana: 'カ', row: 'k', col: 'a', group: 'basic' },
  { id: 'ki', romaji: 'ki', hiragana: 'き', katakana: 'キ', row: 'k', col: 'i', group: 'basic' },
  { id: 'ku', romaji: 'ku', hiragana: 'く', katakana: 'ク', row: 'k', col: 'u', group: 'basic' },
  { id: 'ke', romaji: 'ke', hiragana: 'け', katakana: 'ケ', row: 'k', col: 'e', group: 'basic' },
  { id: 'ko', romaji: 'ko', hiragana: 'こ', katakana: 'コ', row: 'k', col: 'o', group: 'basic' },

  { id: 'sa', romaji: 'sa', hiragana: 'さ', katakana: 'サ', row: 's', col: 'a', group: 'basic' },
  { id: 'shi', romaji: 'shi', hiragana: 'し', katakana: 'シ', row: 's', col: 'i', group: 'basic' },
  { id: 'su', romaji: 'su', hiragana: 'す', katakana: 'ス', row: 's', col: 'u', group: 'basic' },
  { id: 'se', romaji: 'se', hiragana: 'せ', katakana: 'セ', row: 's', col: 'e', group: 'basic' },
  { id: 'so', romaji: 'so', hiragana: 'そ', katakana: 'ソ', row: 's', col: 'o', group: 'basic' },

  { id: 'ta', romaji: 'ta', hiragana: 'た', katakana: 'タ', row: 't', col: 'a', group: 'basic' },
  { id: 'chi', romaji: 'chi', hiragana: 'ち', katakana: 'チ', row: 't', col: 'i', group: 'basic' },
  { id: 'tsu', romaji: 'tsu', hiragana: 'つ', katakana: 'ツ', row: 't', col: 'u', group: 'basic' },
  { id: 'te', romaji: 'te', hiragana: 'て', katakana: 'テ', row: 't', col: 'e', group: 'basic' },
  { id: 'to', romaji: 'to', hiragana: 'と', katakana: 'ト', row: 't', col: 'o', group: 'basic' },

  { id: 'na', romaji: 'na', hiragana: 'な', katakana: 'ナ', row: 'n', col: 'a', group: 'basic' },
  { id: 'ni', romaji: 'ni', hiragana: 'に', katakana: 'ニ', row: 'n', col: 'i', group: 'basic' },
  { id: 'nu', romaji: 'nu', hiragana: 'ぬ', katakana: 'ヌ', row: 'n', col: 'u', group: 'basic' },
  { id: 'ne', romaji: 'ne', hiragana: 'ね', katakana: 'ネ', row: 'n', col: 'e', group: 'basic' },
  { id: 'no', romaji: 'no', hiragana: 'の', katakana: 'ノ', row: 'n', col: 'o', group: 'basic' },

  { id: 'ha', romaji: 'ha', hiragana: 'は', katakana: 'ハ', row: 'h', col: 'a', group: 'basic' },
  { id: 'hi', romaji: 'hi', hiragana: 'ひ', katakana: 'ヒ', row: 'h', col: 'i', group: 'basic' },
  { id: 'fu', romaji: 'fu', hiragana: 'ふ', katakana: 'フ', row: 'h', col: 'u', group: 'basic' },
  { id: 'he', romaji: 'he', hiragana: 'へ', katakana: 'ヘ', row: 'h', col: 'e', group: 'basic' },
  { id: 'ho', romaji: 'ho', hiragana: 'ほ', katakana: 'ホ', row: 'h', col: 'o', group: 'basic' },

  { id: 'ma', romaji: 'ma', hiragana: 'ま', katakana: 'マ', row: 'm', col: 'a', group: 'basic' },
  { id: 'mi', romaji: 'mi', hiragana: 'み', katakana: 'ミ', row: 'm', col: 'i', group: 'basic' },
  { id: 'mu', romaji: 'mu', hiragana: 'む', katakana: 'ム', row: 'm', col: 'u', group: 'basic' },
  { id: 'me', romaji: 'me', hiragana: 'め', katakana: 'メ', row: 'm', col: 'e', group: 'basic' },
  { id: 'mo', romaji: 'mo', hiragana: 'も', katakana: 'モ', row: 'm', col: 'o', group: 'basic' },

  { id: 'ya', romaji: 'ya', hiragana: 'や', katakana: 'ヤ', row: 'y', col: 'a', group: 'basic' },
  { id: 'yu', romaji: 'yu', hiragana: 'ゆ', katakana: 'ユ', row: 'y', col: 'u', group: 'basic' },
  { id: 'yo', romaji: 'yo', hiragana: 'よ', katakana: 'ヨ', row: 'y', col: 'o', group: 'basic' },

  { id: 'ra', romaji: 'ra', hiragana: 'ら', katakana: 'ラ', row: 'r', col: 'a', group: 'basic' },
  { id: 'ri', romaji: 'ri', hiragana: 'り', katakana: 'リ', row: 'r', col: 'i', group: 'basic' },
  { id: 'ru', romaji: 'ru', hiragana: 'る', katakana: 'ル', row: 'r', col: 'u', group: 'basic' },
  { id: 're', romaji: 're', hiragana: 'れ', katakana: 'レ', row: 'r', col: 'e', group: 'basic' },
  { id: 'ro', romaji: 'ro', hiragana: 'ろ', katakana: 'ロ', row: 'r', col: 'o', group: 'basic' },

  { id: 'wa', romaji: 'wa', hiragana: 'わ', katakana: 'ワ', row: 'w', col: 'a', group: 'basic' },
  { id: 'wo', romaji: 'wo', hiragana: 'を', katakana: 'ヲ', row: 'w', col: 'o', group: 'basic' },
  { id: 'n', romaji: 'n', hiragana: 'ん', katakana: 'ン', row: 'n-only', col: 'n', group: 'basic' },

  { id: 'ga', romaji: 'ga', hiragana: 'が', katakana: 'ガ', row: 'g', col: 'a', group: 'dakuten' },
  { id: 'gi', romaji: 'gi', hiragana: 'ぎ', katakana: 'ギ', row: 'g', col: 'i', group: 'dakuten' },
  { id: 'gu', romaji: 'gu', hiragana: 'ぐ', katakana: 'グ', row: 'g', col: 'u', group: 'dakuten' },
  { id: 'ge', romaji: 'ge', hiragana: 'げ', katakana: 'ゲ', row: 'g', col: 'e', group: 'dakuten' },
  { id: 'go', romaji: 'go', hiragana: 'ご', katakana: 'ゴ', row: 'g', col: 'o', group: 'dakuten' },

  { id: 'za', romaji: 'za', hiragana: 'ざ', katakana: 'ザ', row: 'z', col: 'a', group: 'dakuten' },
  { id: 'ji', romaji: 'ji', hiragana: 'じ', katakana: 'ジ', row: 'z', col: 'i', group: 'dakuten' },
  { id: 'zu', romaji: 'zu', hiragana: 'ず', katakana: 'ズ', row: 'z', col: 'u', group: 'dakuten' },
  { id: 'ze', romaji: 'ze', hiragana: 'ぜ', katakana: 'ゼ', row: 'z', col: 'e', group: 'dakuten' },
  { id: 'zo', romaji: 'zo', hiragana: 'ぞ', katakana: 'ゾ', row: 'z', col: 'o', group: 'dakuten' },

  { id: 'da', romaji: 'da', hiragana: 'だ', katakana: 'ダ', row: 'd', col: 'a', group: 'dakuten' },
  { id: 'dji', romaji: 'ji', hiragana: 'ぢ', katakana: 'ヂ', row: 'd', col: 'i', group: 'dakuten' },
  { id: 'dzu', romaji: 'zu', hiragana: 'づ', katakana: 'ヅ', row: 'd', col: 'u', group: 'dakuten' },
  { id: 'de', romaji: 'de', hiragana: 'で', katakana: 'デ', row: 'd', col: 'e', group: 'dakuten' },
  { id: 'do', romaji: 'do', hiragana: 'ど', katakana: 'ド', row: 'd', col: 'o', group: 'dakuten' },

  { id: 'ba', romaji: 'ba', hiragana: 'ば', katakana: 'バ', row: 'b', col: 'a', group: 'dakuten' },
  { id: 'bi', romaji: 'bi', hiragana: 'び', katakana: 'ビ', row: 'b', col: 'i', group: 'dakuten' },
  { id: 'bu', romaji: 'bu', hiragana: 'ぶ', katakana: 'ブ', row: 'b', col: 'u', group: 'dakuten' },
  { id: 'be', romaji: 'be', hiragana: 'べ', katakana: 'ベ', row: 'b', col: 'e', group: 'dakuten' },
  { id: 'bo', romaji: 'bo', hiragana: 'ぼ', katakana: 'ボ', row: 'b', col: 'o', group: 'dakuten' },

  { id: 'pa', romaji: 'pa', hiragana: 'ぱ', katakana: 'パ', row: 'p', col: 'a', group: 'handakuten' },
  { id: 'pi', romaji: 'pi', hiragana: 'ぴ', katakana: 'ピ', row: 'p', col: 'i', group: 'handakuten' },
  { id: 'pu', romaji: 'pu', hiragana: 'ぷ', katakana: 'プ', row: 'p', col: 'u', group: 'handakuten' },
  { id: 'pe', romaji: 'pe', hiragana: 'ぺ', katakana: 'ペ', row: 'p', col: 'e', group: 'handakuten' },
  { id: 'po', romaji: 'po', hiragana: 'ぽ', katakana: 'ポ', row: 'p', col: 'o', group: 'handakuten' },

  { id: 'kya', romaji: 'kya', hiragana: 'きゃ', katakana: 'キャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'kyu', romaji: 'kyu', hiragana: 'きゅ', katakana: 'キュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'kyo', romaji: 'kyo', hiragana: 'きょ', katakana: 'キョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'sha', romaji: 'sha', hiragana: 'しゃ', katakana: 'シャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'shu', romaji: 'shu', hiragana: 'しゅ', katakana: 'シュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'sho', romaji: 'sho', hiragana: 'しょ', katakana: 'ショ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'cha', romaji: 'cha', hiragana: 'ちゃ', katakana: 'チャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'chu', romaji: 'chu', hiragana: 'ちゅ', katakana: 'チュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'cho', romaji: 'cho', hiragana: 'ちょ', katakana: 'チョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'nya', romaji: 'nya', hiragana: 'にゃ', katakana: 'ニャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'nyu', romaji: 'nyu', hiragana: 'にゅ', katakana: 'ニュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'nyo', romaji: 'nyo', hiragana: 'にょ', katakana: 'ニョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'hya', romaji: 'hya', hiragana: 'ひゃ', katakana: 'ヒャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'hyu', romaji: 'hyu', hiragana: 'ひゅ', katakana: 'ヒュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'hyo', romaji: 'hyo', hiragana: 'ひょ', katakana: 'ヒョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'mya', romaji: 'mya', hiragana: 'みゃ', katakana: 'ミャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'myu', romaji: 'myu', hiragana: 'みゅ', katakana: 'ミュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'myo', romaji: 'myo', hiragana: 'みょ', katakana: 'ミョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'rya', romaji: 'rya', hiragana: 'りゃ', katakana: 'リャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'ryu', romaji: 'ryu', hiragana: 'りゅ', katakana: 'リュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'ryo', romaji: 'ryo', hiragana: 'りょ', katakana: 'リョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'gya', romaji: 'gya', hiragana: 'ぎゃ', katakana: 'ギャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'gyu', romaji: 'gyu', hiragana: 'ぎゅ', katakana: 'ギュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'gyo', romaji: 'gyo', hiragana: 'ぎょ', katakana: 'ギョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'ja', romaji: 'ja', hiragana: 'じゃ', katakana: 'ジャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'ju', romaji: 'ju', hiragana: 'じゅ', katakana: 'ジュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'jo', romaji: 'jo', hiragana: 'じょ', katakana: 'ジョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'bya', romaji: 'bya', hiragana: 'びゃ', katakana: 'ビャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'byu', romaji: 'byu', hiragana: 'びゅ', katakana: 'ビュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'byo', romaji: 'byo', hiragana: 'びょ', katakana: 'ビョ', row: 'combo', col: 'yo', group: 'combo' },
  { id: 'pya', romaji: 'pya', hiragana: 'ぴゃ', katakana: 'ピャ', row: 'combo', col: 'ya', group: 'combo' },
  { id: 'pyu', romaji: 'pyu', hiragana: 'ぴゅ', katakana: 'ピュ', row: 'combo', col: 'yu', group: 'combo' },
  { id: 'pyo', romaji: 'pyo', hiragana: 'ぴょ', katakana: 'ピョ', row: 'combo', col: 'yo', group: 'combo' }
];

const KANA_BY_ID = Object.freeze(
  KANA_DATA.reduce((map, item) => {
    map[item.id] = item;
    return map;
  }, {})
);

const KANA_BY_ROMAJI = Object.freeze(
  KANA_DATA.reduce((map, item) => {
    if (!map[item.romaji]) map[item.romaji] = item;
    return map;
  }, {})
);

if (typeof window !== 'undefined') {
  window.KANA_DATA = KANA_DATA;
  window.KANA_BY_ID = KANA_BY_ID;
  window.KANA_BY_ROMAJI = KANA_BY_ROMAJI;
}

if (typeof module !== 'undefined') {
  module.exports = { KANA_DATA, KANA_BY_ID, KANA_BY_ROMAJI };
}
