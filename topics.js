// 呑み助ビンゴ - お題データベース
// 120個のお題（かんたん40 + ふつう40 + むずかしい40）

// お題ID → アイコン画像（画像ある場合のみ、なければ絵文字を使用）
const topicIconMap = {};

function getTopicIcon(topic) {
  const iconFile = topic.id && topicIconMap[topic.id];
  if (iconFile) {
    return `<span class="cell-icon cell-icon-img-wrap"><img src="assets/icons/${iconFile}" alt="" class="cell-icon-img"></span>`;
  }
  return `<span class="cell-icon">${topic.icon}</span>`;
}

const topicDatabase = {
  // かんたん（40個） - よくある居酒屋の定番
  easy: [
    {id: 1, text: '枝豆', icon: '🫘', category: '料理'},
    {id: 2, text: 'ビール', icon: '🍺', category: '飲み物'},
    {id: 3, text: '焼き鳥', icon: '🍗', category: '料理'},
    {id: 4, text: '唐揚げ', icon: '🍗', category: '料理'},
    {id: 5, text: 'お通し', icon: '🍽️', category: '料理'},
    {id: 6, text: '刺身', icon: '🐟', category: '料理'},
    {id: 7, text: '冷奴', icon: '🧊', category: '料理'},
    {id: 8, text: 'ポテトサラダ', icon: '🥗', category: '料理'},
    {id: 9, text: '漬物', icon: '🥒', category: '料理'},
    {id: 10, text: '生ビール', icon: '🍻', category: '飲み物'},
    {id: 11, text: 'ハイボール', icon: '🥃', category: '飲み物'},
    {id: 12, text: '焼酎', icon: '🍶', category: '飲み物'},
    {id: 13, text: '日本酒', icon: '🍶', category: '飲み物'},
    {id: 14, text: '串カツ', icon: '🍢', category: '料理'},
    {id: 15, text: 'サラダ', icon: '🥗', category: '料理'},
    {id: 16, text: 'チューハイ', icon: '🍹', category: '飲み物'},
    {id: 17, text: '梅干し', icon: '🔴', category: '料理'},
    {id: 18, text: '卵焼き', icon: '🥚', category: '料理'},
    {id: 19, text: 'ウインナー', icon: '🌭', category: '料理'},
    {id: 20, text: 'フライドポテト', icon: '🍟', category: '料理'},
    {id: 21, text: 'おにぎり', icon: '🍙', category: '料理'},
    {id: 22, text: '味噌汁', icon: '🍲', category: '料理'},
    {id: 23, text: '茶碗蒸し', icon: '🍮', category: '料理'},
    {id: 24, text: '豆腐', icon: '🧈', category: '料理'},
    {id: 25, text: 'たこわさ', icon: '🐙', category: '料理'},
    {id: 26, text: 'もろきゅう', icon: '🥒', category: '料理'},
    {id: 27, text: '出汁巻き', icon: '🥚', category: '料理'},
    {id: 28, text: 'おでん', icon: '🍢', category: '料理'},
    {id: 29, text: '焼きそば', icon: '🍜', category: '料理'},
    {id: 30, text: 'ぎょうざ', icon: '🥟', category: '料理'},
    {id: 31, text: 'しゅうまい', icon: '🥟', category: '料理'},
    {id: 32, text: 'コロッケ', icon: '🥔', category: '料理'},
    {id: 33, text: '天ぷら', icon: '🍤', category: '料理'},
    {id: 34, text: '南蛮漬け', icon: '🐟', category: '料理'},
    {id: 35, text: '角煮', icon: '🍖', category: '料理'},
    {id: 36, text: 'もつ煮', icon: '🍲', category: '料理'},
    {id: 37, text: '肉じゃが', icon: '🥩', category: '料理'},
    {id: 38, text: 'お新香', icon: '🥬', category: '料理'},
    {id: 39, text: '冷やし中華', icon: '🍜', category: '料理'},
    {id: 40, text: 'やきとん', icon: '🐷', category: '料理'},
  ],
  
  // ふつう（40個） - 少し探す必要のあるもの
  medium: [
    {id: 41, text: 'ホッピー', icon: '🍺', category: '飲み物'},
    {id: 42, text: '瓶ビール', icon: '🍾', category: '飲み物'},
    {id: 43, text: '日本酒の徳利', icon: '🍶', category: '店の雰囲気'},
    {id: 44, text: '赤ちょうちん', icon: '🏮', category: '店の雰囲気'},
    {id: 45, text: 'のれん', icon: '🚪', category: '店の雰囲気'},
    {id: 46, text: '常連さん', icon: '👤', category: '人'},
    {id: 47, text: '店主のこだわりメニュー', icon: '📋', category: '店の雰囲気'},
    {id: 48, text: '手書きメニュー', icon: '✍️', category: '店の雰囲気'},
    {id: 49, text: '壁のサイン色紙', icon: '🖼️', category: '店の雰囲気'},
    {id: 50, text: '焼酎のボトルキープ', icon: '🍾', category: '店の雰囲気'},
    {id: 51, text: 'カウンター席', icon: '🪑', category: '店の雰囲気'},
    {id: 52, text: '座敷席', icon: '🧎', category: '店の雰囲気'},
    {id: 53, text: '大将/マスター', icon: '👨‍🍳', category: '人'},
    {id: 54, text: 'お品書き', icon: '📜', category: '店の雰囲気'},
    {id: 55, text: '瓶ビールの栓抜き', icon: '🔧', category: '店の雰囲気'},
    {id: 56, text: '割り箸', icon: '🥢', category: '店の雰囲気'},
    {id: 57, text: 'おしぼり', icon: '🧻', category: '店の雰囲気'},
    {id: 58, text: '小鉢', icon: '🍲', category: '料理'},
    {id: 59, text: '突き出し', icon: '🍽️', category: '料理'},
    {id: 60, text: 'レモンサワー', icon: '🍋', category: '飲み物'},
    {id: 61, text: '梅酒', icon: '🍑', category: '飲み物'},
    {id: 62, text: '角ハイ', icon: '🥃', category: '飲み物'},
    {id: 63, text: '日本酒メニュー3種以上', icon: '🍶', category: '飲み物'},
    {id: 64, text: '焼き物メニュー', icon: '🔥', category: '料理'},
    {id: 65, text: '煮物メニュー', icon: '🍲', category: '料理'},
    {id: 66, text: '揚げ物メニュー', icon: '🍤', category: '料理'},
    {id: 67, text: '〆のご飯もの', icon: '🍚', category: '料理'},
    {id: 68, text: '〆の麺類', icon: '🍜', category: '料理'},
    {id: 69, text: 'デザートメニュー', icon: '🍨', category: '料理'},
    {id: 70, text: '飲み放題メニュー', icon: '🍻', category: '飲み物'},
    {id: 71, text: 'コース料理', icon: '🍽️', category: '料理'},
    {id: 72, text: '名物料理', icon: '⭐', category: '料理'},
    {id: 73, text: '地酒', icon: '🍶', category: '飲み物'},
    {id: 74, text: '地ビール', icon: '🍺', category: '飲み物'},
    {id: 75, text: '季節限定メニュー', icon: '🌸', category: '料理'},
    {id: 76, text: 'ランチメニュー看板', icon: '🪧', category: '店の雰囲気'},
    {id: 77, text: 'テイクアウトメニュー', icon: '🥡', category: '料理'},
    {id: 78, text: 'Wi-Fiあり表示', icon: '📶', category: '店の雰囲気'},
    {id: 79, text: '喫煙所', icon: '🚬', category: '店の雰囲気'},
    {id: 80, text: '灰皿', icon: '🫙', category: '店の雰囲気'},
  ],
  
  // むずかしい（40個） - レアなもの
  hard: [
    {id: 81, text: '幻の焼酎', icon: '🍶', category: '珍品'},
    {id: 82, text: '珍味メニュー', icon: '🦑', category: '珍品'},
    {id: 83, text: 'くじら料理', icon: '🐋', category: '珍品'},
    {id: 84, text: '馬刺し', icon: '🐴', category: '珍品'},
    {id: 85, text: 'すっぽん', icon: '🐢', category: '珍品'},
    {id: 86, text: 'フグ', icon: '🐡', category: '珍品'},
    {id: 87, text: 'ジビエ料理', icon: '🦌', category: '珍品'},
    {id: 88, text: '燻製メニュー', icon: '🔥', category: '珍品'},
    {id: 89, text: '自家製果実酒', icon: '🍷', category: '飲み物'},
    {id: 90, text: '店主手作りの逸品', icon: '👨‍🍳', category: '料理'},
    {id: 91, text: '20年以上の老舗', icon: '🏚️', category: '店の雰囲気'},
    {id: 92, text: 'ミシュランビブグルマン', icon: '⭐', category: '店の雰囲気'},
    {id: 93, text: '外国人常連客', icon: '🌍', category: '人'},
    {id: 94, text: '店の猫', icon: '🐱', category: '店の雰囲気'},
    {id: 95, text: 'カラオケ設備', icon: '🎤', category: 'イベント'},
    {id: 96, text: 'ダーツ', icon: '🎯', category: 'イベント'},
    {id: 97, text: '日本酒飲み比べセット', icon: '🍶', category: '飲み物'},
    {id: 98, text: '利き酒セット', icon: '🏆', category: '飲み物'},
    {id: 99, text: '焼酎飲み比べ', icon: '🥃', category: '飲み物'},
    {id: 100, text: 'クラフトビール5種以上', icon: '🍺', category: '飲み物'},
    {id: 101, text: 'ビールサーバー見える席', icon: '🍻', category: '店の雰囲気'},
    {id: 102, text: '樽生ビール', icon: '🛢️', category: '飲み物'},
    {id: 103, text: '角打ち形式', icon: '🏪', category: '店の雰囲気'},
    {id: 104, text: '立ち飲みスタイル', icon: '🧍', category: '店の雰囲気'},
    {id: 105, text: '看板のない隠れ家', icon: '🔍', category: '店の雰囲気'},
    {id: 106, text: '地下にある店', icon: '⬇️', category: '店の雰囲気'},
    {id: 107, text: '2階以上にある穴場', icon: '⬆️', category: '店の雰囲気'},
    {id: 108, text: '路地裏の名店', icon: '🏘️', category: '店の雰囲気'},
    {id: 109, text: '昭和レトロな内装', icon: '📺', category: '店の雰囲気'},
    {id: 110, text: 'ジャズが流れる店', icon: '🎷', category: '店の雰囲気'},
    {id: 111, text: 'マスターの武勇伝', icon: '💬', category: 'イベント'},
    {id: 112, text: 'お客同士の乾杯', icon: '🥂', category: 'イベント'},
    {id: 113, text: '隣の席と仲良くなる', icon: '🤝', category: 'イベント'},
    {id: 114, text: '名物おかみさん', icon: '👩', category: '人'},
    {id: 115, text: 'メニューにない裏メニュー', icon: '🤫', category: '珍品'},
    {id: 116, text: '閉店間際のサービス', icon: '🎁', category: 'イベント'},
    {id: 117, text: '常連だけが知る注文', icon: '🔒', category: '珍品'},
    {id: 118, text: 'シメのラーメン屋発見', icon: '🍜', category: 'イベント'},
    {id: 119, text: 'はしご酒3軒目', icon: '🏃', category: 'イベント'},
    {id: 120, text: '酔い覚ましの水', icon: '💧', category: '飲み物'},
  ]
};

// 難易度に応じてお題を選択する関数
// shuffleSalt: 作り直し時に毎回異なるシャッフルにするため（省略時は合言葉で固定）
function selectTopicsByDifficulty(difficulty, roomCode = '', userId = '', shuffleSalt = '') {
  let selectedTopics = [];
  
  switch(difficulty) {
    case 'easy':
      // かんたん: easy のみから24個
      selectedTopics = [...topicDatabase.easy];
      break;
      
    case 'medium':
      // ふつう: easy 12個 + medium 12個
      selectedTopics = [
        ...topicDatabase.easy.slice(0, 12),
        ...topicDatabase.medium.slice(0, 12)
      ];
      break;
      
    case 'hard':
      // むずかしい: easy 8個 + medium 8個 + hard 8個
      selectedTopics = [
        ...topicDatabase.easy.slice(0, 8),
        ...topicDatabase.medium.slice(0, 8),
        ...topicDatabase.hard.slice(0, 8)
      ];
      break;
      
    default:
      selectedTopics = [...topicDatabase.easy];
  }
  
  // シャッフル（合言葉・ユーザーID・塩でシード生成。塩があれば毎回異なる並びに）
  const seedStr = [roomCode, userId, shuffleSalt].filter(Boolean).join('-');
  if (seedStr) {
    const seed = stringToSeed(seedStr);
    selectedTopics = shuffleWithSeed(selectedTopics, seed);
  } else {
    selectedTopics = shuffle(selectedTopics);
  }
  
  return selectedTopics.slice(0, 24); // FREE分を除いて24個
}

// 文字列からシード値を生成
function stringToSeed(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // 32bit整数に変換
  }
  return Math.abs(hash);
}

// シード付きシャッフル（決定論的）
function shuffleWithSeed(array, seed) {
  const arr = [...array];
  let currentSeed = seed;
  
  // Mulberry32 アルゴリズム（高速な疑似乱数生成）
  const random = () => {
    currentSeed = (currentSeed + 0x6D2B79F5) | 0;
    let t = Math.imul(currentSeed ^ (currentSeed >>> 15), 1 | currentSeed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  
  // Fisher-Yates シャッフル
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  
  return arr;
}

// 通常のシャッフル（ランダム）
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ユーザーIDを生成・取得
function getUserId() {
  let userId = localStorage.getItem('nomisuke_userId');
  if (!userId) {
    userId = 'user_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    localStorage.setItem('nomisuke_userId', userId);
  }
  return userId;
}
