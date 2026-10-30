// =============================================
//  前世ねんぴょう（試作）  人生をつくる仕組み
//  名前＋誕生日＋生まれた市町村区 → いつも同じ前世
// =============================================
(function () {
  const Z = window.Z = {};
  // ---------- 乱数（同じ入力なら同じ結果） ----------
  function xmur3(s) { let h = 1779033703 ^ s.length; for (let i = 0; i < s.length; i++) { h = Math.imul(h ^ s.charCodeAt(i), 3432918353); h = h << 13 | h >>> 19; } return () => { h = Math.imul(h ^ h >>> 16, 2246822507); h = Math.imul(h ^ h >>> 13, 3266489909); return (h ^= h >>> 16) >>> 0; }; }
  function mulberry(a) { return () => { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
  let R = Math.random;
  const rnd = () => R();
  const ri = (a, b) => a + Math.floor(rnd() * (b - a + 1));
  const pick = a => a[Math.floor(rnd() * a.length)];
  const chance = p => rnd() < p;
  function wpick(list, wf) { let s = 0; const ws = list.map(x => { const w = Math.max(0, wf(x)); s += w; return w; }); let r = rnd() * s; for (let i = 0; i < list.length; i++) { r -= ws[i]; if (r <= 0) return list[i]; } return list[list.length - 1]; }
  const gauss = () => { let u = 0, v = 0; while (!u) u = rnd(); while (!v) v = rnd(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); };
  const fill = (t, o) => t.replace(/\{(\w+)\}/g, (m, k) => (o[k] != null ? o[k] : m));

  // ---------- 時代（人口はおおよその目安：百万人） ----------
  const ERAS = [
    { k: 'jomon', n: '縄文時代', a: -10000, b: -400, pop: 0.15 },
    { k: 'yayoi', n: '弥生時代', a: -400, b: 250, pop: 0.6 },
    { k: 'kofun', n: '古墳時代', a: 250, b: 592, pop: 2.5 },
    { k: 'asuka', n: '飛鳥時代', a: 592, b: 710, pop: 4.5 },
    { k: 'nara', n: '奈良時代', a: 710, b: 794, pop: 5 },
    { k: 'heian', n: '平安時代', a: 794, b: 1185, pop: 6 },
    { k: 'kamakura', n: '鎌倉時代', a: 1185, b: 1333, pop: 7 },
    { k: 'muromachi', n: '室町時代', a: 1333, b: 1467, pop: 9 },
    { k: 'sengoku', n: '戦国時代', a: 1467, b: 1603, pop: 12 },
    { k: 'edo', n: '江戸時代', a: 1603, b: 1868, pop: 27 },
    { k: 'meiji', n: '明治時代', a: 1868, b: 1912, pop: 40 },
    { k: 'taisho', n: '大正時代', a: 1912, b: 1926, pop: 55 },
    { k: 'showa', n: '昭和時代', a: 1926, b: 1989, pop: 85 },
  ];
  const eraOf = y => ERAS.find(e => y >= e.a && y < e.b) || ERAS[ERAS.length - 1];
  const G = { jomon: 'old', yayoi: 'old', kofun: 'kodai', asuka: 'kodai', nara: 'kodai', heian: 'heian', kamakura: 'chusei', muromachi: 'chusei', sengoku: 'chusei', edo: 'edo', meiji: 'kindai', taisho: 'kindai', showa: 'showa' };
  const yearText = y => y < 0 ? '紀元前' + (-y) + '年ごろ' : (y < 600 ? y + '年ごろ' : y + '年');

  // ---------- 身分・仕事 ----------
  const JOBS = {
    jomon: [['hunt', 'ムラの狩人', 40, 'm'], ['gather', '木の実とりと土器づくり', 40, 'f'], ['fish', '海辺のムラの漁師', 20]],
    yayoi: [['farm', '稲を育てるムラの民', 70], ['fish', '漁をするムラの民', 10], ['craft', '機織りと土器づくり', 12], ['chief', 'ムラの長の一族', 8]],
    kofun: [['farm', '田を耕す民', 70], ['labor', '古墳づくりに駆り出された民', 12], ['craft', '埴輪をつくる職人', 8], ['servant', '豪族に仕える者', 10]],
    asuka: [['farm', '口分田を耕す農民', 78], ['craft', '寺をつくる工人', 8], ['monk', '寺の僧', 4], ['official', '国府の下級役人', 10]],
    nara: [['farm', '口分田を耕す農民', 76], ['sakimori', '防人に出た農民', 8, 'm'], ['monk', '寺の僧', 4], ['official', '国府の下級役人', 7], ['craft', '都の職人', 5]],
    heian: [['farm', '荘園で働く農民', 72], ['servant', '貴族の屋敷の下働き', 8], ['monk', '寺の僧', 5], ['bushi', '地方の武者', 7, 'm'], ['noble', '下級貴族', 3], ['merchant', '市の商人', 5]],
    kamakura: [['farm', '荘園の農民', 70], ['bushi', '御家人に仕える武士', 9, 'm'], ['craft', '鍛冶職人', 6], ['merchant', '市の商人', 8], ['monk', '寺の僧', 7]],
    muromachi: [['farm', '惣村の百姓', 68], ['bashaku', '馬借（荷を運ぶ人）', 8, 'm'], ['craft', '職人', 8], ['merchant', '座の商人', 9], ['bushi', '国人に仕える武士', 7, 'm']],
    sengoku: [['farm', '百姓', 66], ['ashigaru', '足軽', 14, 'm'], ['craft', '鉄砲鍛冶', 4], ['merchant', '城下の商人', 9], ['monk', '寺の僧', 4], ['bushi', '武士', 3, 'm']],
    edo: [['farm', '百姓', 78], ['merchant', '町人（商人）', 8], ['craft', '町人（職人）', 6], ['samurai', '武士', 5, 'm'], ['fish', '漁師', 3]],
    meiji: [['farm', '農家', 70], ['factory', '製糸工場の工女', 8, 'f'], ['merchant', '商店', 8], ['craft', '職人', 6], ['teacher', '小学校の先生', 3], ['soldier', '軍人', 3, 'm'], ['pioneer', '北海道の開拓民', 2]],
    taisho: [['farm', '農家', 55], ['factory', '工場の工員', 15], ['merchant', '商店', 10], ['office', '会社員', 8], ['teacher', '小学校の先生', 4], ['mine', '炭鉱夫', 4, 'm'], ['fish', '漁師', 4]],
    showa: [['farm', '農家', 35], ['factory', '工場の工員', 18], ['office', '会社員', 18], ['merchant', '商店', 12], ['teacher', '学校の先生', 5], ['mine', '炭鉱夫', 4, 'm'], ['fish', '漁師', 4], ['craft', '職人', 4]],
  };

  // ---------- 名前 ----------
  const NAMES = {
    old: { m: [], f: [] },
    kodai: { m: ['広麻呂', '黒麻呂', '石麻呂', '小麻呂', '真人', '大人', '乙麻呂', '犬養', '鳥麻呂', '赤麻呂'], f: ['刀自売', '広売', '小刀自', '乙売', '黒売', '真刀自', '若売', '稲売'] },
    heian: { m: ['犬丸', '藤太', '太郎丸', '次郎丸', '鶴丸', '小太郎', '石丸', '牛丸', '千代丸'], f: ['宮子', '乙女', '鶴女', '若女', '千代女', '小藤', '亀女'] },
    chusei: { m: ['太郎', '次郎', '三郎', '彦四郎', '弥五郎', '孫七', '又六', '源太', '藤次', '与一', '平内'], f: ['とら', 'かめ', 'つる', 'ちよ', 'ふく', 'まつ', 'いね', 'さい'] },
    edo: { m: ['与吉', '吉兵衛', '喜助', '長太郎', '庄助', '伊之助', '茂平', '半次郎', '権八', '佐七', '彦三郎', '久蔵', '平助', '留吉'], f: ['ふさ', 'きく', 'とよ', 'まつ', 'せん', 'はる', 'みよ', 'ゆき', 'いと', 'たけ', 'うめ'] },
    kindai: { m: ['清', '正一', '勇', '茂', '三郎', '金次郎', '寅吉', '松太郎', '重雄', '辰雄', '義一', '亀吉'], f: ['ハル', 'キヨ', 'ウメ', 'トメ', 'マツ', 'ヨシ', 'フミ', 'タケ', 'ツル', 'ミツ'] },
    showa: { m: ['博', '実', '清', '進', '茂', '昭', '和夫', '勝利', '稔', '武', '正男', '一郎'], f: ['和子', '幸子', '節子', '洋子', '恵子', '久子', '美代子', '照子', '静子', '春子'] },
  };
  const SURNAMES = ['佐藤', '鈴木', '高橋', '田中', '渡辺', '伊藤', '山本', '中村', '小林', '加藤', '吉田', '山田', '佐々木', '山口', '松本', '井上', '木村', '林', '清水', '山崎', '森', '池田', '橋本', '石川', '小川', '岡田', '長谷川', '村上', '近藤', '石井'];
  const SAMURAI_M = ['惣右衛門', '新之丞', '平左衛門', '甚五郎', '源之進', '弥兵衛', '伝蔵', '数馬'];
  const JOMON_NICK = ['どんぐり拾いのうまい子', '笑い声の大きな子', '火をおこすのが早い子', '泳ぎの得意な子', '星をよく見ていた子', '犬とよく遊ぶ子', '土器の模様を描くのがうまい子'];

  // ---------- 体・人がら ----------
  const HEIGHT = { jomon: [158, 148], yayoi: [162, 151], kofun: [163, 152], asuka: [162, 151], nara: [162, 151], heian: [160, 149], kamakura: [159, 147], muromachi: [157, 146], sengoku: [157, 146], edo: [155, 144], meiji: [157, 146], taisho: [160, 148], showa: [163, 151] };
  const BUILD = ['やせ型', 'がっしり型', 'ずんぐり型', 'ひょろりと細長い', 'ふつうの体つき', '肩幅が広い', '小柄で身軽', '色白でふっくら', '日に焼けて筋ばった体'];
  const MARKS = ['右の頬に小さなほくろ', '左手の甲に古い傷あと', 'くせ毛', '八重歯', 'よく通る声', '大きな手', 'たれ目', '太い眉', 'えくぼ', '歩くのがやたら速い'];
  const PERS = ['せっかちだが面倒見がいい', 'のんびり屋で、怒ったところを誰も見たことがない', 'がんこで、言い出したら聞かない', '人見知りだが、慣れるとよくしゃべる', '世話好きで、村じゅうの事情を知っている', 'まじめで、約束は必ず守る', '冗談ばかり言って人を笑わせる', '涙もろい', '負けず嫌い', '物知りで、子どもによく話をしてやった', '気が小さいが、いざというときは度胸がある', 'お人よしで、よく人にだまされた', '口は悪いが根はやさしい', 'きれい好き', '酒好き', '甘いもの好き'];
  const FOOD = {
    old: ['どんぐりのだんご', '焼いた鹿の肉', '貝のむき身', 'クリの実', '干した魚'],
    kodai: ['あわのかゆ', '干しあわび', '蘇（そ）', '焼いたアユ', 'ひえのめし'],
    heian: ['干し柿', '焼いたアユ', '唐菓子', 'あずきがゆ', '瓜'],
    chusei: ['焼き味噌', '干し柿', 'ぞうすい', '焼いたイワシ', '餅'],
    edo: ['焼き味噌', 'そば', '寿司', '天ぷら', 'うなぎ', '豆腐の田楽', '大福'],
    kindai: ['あんぱん', '牛鍋', 'ラムネ', 'いもの煮っころがし', 'きな粉餅'],
    showa: ['カレーライス', 'コロッケ', 'ラーメン', 'すき焼き', 'あんみつ', 'たまご焼き'],
  };
  const PHRASE = ['まあ、なんとかなるさ', 'ありがたい、ありがたい', 'そりゃあ、たいしたもんだ', 'あとでな', 'しかたねえなあ', 'よし、やるか', 'ほう、そうかね', '腹がへっては何もできん', '天気がいいな', 'あわてるな', '昔はなあ', 'ばちが当たるぞ'];
  const SKILL = {
    old: ['石の矢じりづくり', '土器の模様つけ', '魚とり', '木登り', '火おこし', 'ドングリのあく抜き'],
    kodai: ['機織り', '田植え', '舟こぎ', '歌（和歌）を口ずさむこと', '馬の世話'],
    heian: ['笛', '機織り', '馬の世話', '薬草さがし', '字を読むこと'],
    chusei: ['わらじづくり', '刀研ぎ', '馬の世話', '薬草さがし', '囲碁'],
    edo: ['そろばん', '習字', 'わらじづくり', '三味線', '将棋', '大根を育てること', '釣り'],
    kindai: ['そろばん', '習字', '尺八', '将棋', '裁縫', '花札'],
    showa: ['そろばん', 'ラジオの修理', '自転車', '裁縫', '野球', '将棋', '歌謡曲'],
  };
  const LAST = ['いい人生だったよ', '腹いっぱい食べたかったなあ', 'あの人によろしく', 'みんな、ありがとうな', 'もう一度、海が見たかった', 'ちょっと、ひと眠りする', 'まだまだ、これからだ', '先に行ってるぞ', 'ああ、よく晴れた', 'ありがとう', 'もう少し寝る', '腹がへったなあ', 'みんな、仲良くな', '畑を頼む', 'いい一生だった', '母さん', '茶を一杯', 'あの川の音が聞きたい', 'また会おう', '春はまだかね'];

  // ---------- 本当にあった、できごと（年・地域） ----------
  // r: 都道府県番号の一覧（空なら全国）。j: 関係する仕事（空なら全員）
  const HIST = [
    { y: -5300, r: [46, 45, 43], t: '南の海で大きな噴火（鬼界カルデラ）が起き、空が灰でおおわれた（言い伝え）' },
    { y: 663, t: '白村江の戦い。倭の兵が朝鮮半島で大敗したと伝わってきた' },
    { y: 672, t: '壬申の乱。大きな争いが起き、都の主が変わった' },
    { y: 710, t: '都が平城京にうつった' },
    { y: 743, t: '墾田永年私財法。新しく開いた田は自分のものにできるようになった' },
    { y: 752, t: '奈良の大仏ができあがり、開眼の儀式が行われたとうわさが届く' },
    { y: 794, t: '都が平安京にうつった' },
    { y: 864, r: [19, 22], t: '富士山が大噴火し、溶岩が湖を埋めた（貞観の噴火）' },
    { y: 869, r: [4, 3, 7], t: '大地震と大津波（貞観地震）。海沿いの村が流された' },
    { y: 1180, t: '源氏と平氏の戦いが始まった（治承・寿永の乱）' },
    { y: 1181, t: '大飢饉（養和の飢饉）。食べるものがなく、多くの人が亡くなった' },
    { y: 1192, t: '源頼朝が征夷大将軍になったとうわさが広がる' },
    { y: 1274, r: [40, 41, 42], t: '元の大軍が攻めてきた（文永の役）' },
    { y: 1281, r: [40, 41, 42], t: '元の大軍がふたたび攻めてきた（弘安の役）。嵐で多くの船が沈んだ' },
    { y: 1333, t: '鎌倉の幕府がほろびた' },
    { y: 1428, r: [26, 27, 25, 29], t: '正長の土一揆。百姓たちが借金の帳消しを求めて立ち上がった' },
    { y: 1467, r: [26], t: '応仁の乱。都が焼け野原になった' },
    { y: 1467, t: '都で大きな戦（応仁の乱）が始まり、世の中が乱れはじめた' },
    { y: 1498, r: [22, 23, 24, 30], t: '大地震と大津波（明応地震）' },
    { y: 1543, r: [46], t: '種子島に鉄砲が伝わった' },
    { y: 1560, r: [23], t: '桶狭間の戦い。織田信長が今川義元を討った' },
    { y: 1575, r: [23], t: '長篠の戦い。鉄砲の音が山に響いた' },
    { y: 1582, t: '本能寺の変。織田信長が討たれたと伝わってきた' },
    { y: 1600, t: '関ヶ原の戦い。天下分け目の戦があったとうわさが広がる' },
    { y: 1657, r: [13], t: '明暦の大火。江戸の町の大半が焼けた' },
    { y: 1707, r: [22, 19, 14, 13], t: '富士山が噴火し（宝永の噴火）、灰が降りつもった' },
    { y: 1732, r: [34, 35, 37, 38, 39, 40, 41, 42, 43, 44, 45, 46, 31, 32, 33, 36], t: '享保の飢饉。虫が稲を食い荒らし、米がとれなかった' },
    { y: 1783, r: [10, 20], t: '浅間山が大噴火し、村が土石流にのまれた' },
    { y: 1783, r: [2, 3, 4, 5, 6, 7], t: '天明の大飢饉。冷たい夏で米がとれず、村の人がたくさん亡くなった' },
    { y: 1833, t: '天保の飢饉が始まる。米の値段がはね上がった' },
    { y: 1837, r: [27], t: '大塩平八郎の乱。大坂の町が燃えた' },
    { y: 1853, t: '黒船が浦賀に来たとうわさが広がる' },
    { y: 1854, r: [22, 23, 24, 30, 36, 37, 38, 39], t: '大地震（安政東海・南海地震）。津波が来た' },
    { y: 1855, r: [13, 11, 12, 14], t: '安政江戸地震。江戸の町がゆれ、火事が起きた' },
    { y: 1858, t: 'コロリ（コレラ）が流行した' },
    { y: 1868, t: '戊辰戦争。世の中が江戸から明治に変わった' },
    { y: 1868, r: [7], t: '会津の戦。お城が攻められた' },
    { y: 1871, t: '廃藩置県。殿様がいなくなり、県ができた' },
    { y: 1873, t: '徴兵令。男は兵隊にとられるようになった' },
    { y: 1877, r: [46, 43, 45], t: '西南戦争。西郷隆盛の軍が戦った' },
    { y: 1891, r: [21, 23], t: '濃尾地震。たくさんの家がたおれた' },
    { y: 1894, t: '日清戦争が始まった' },
    { y: 1896, r: [3, 4, 2], t: '明治三陸大津波。海沿いの村がのみこまれた' },
    { y: 1904, t: '日露戦争が始まった' },
    { y: 1918, t: 'スペインかぜが流行した' },
    { y: 1923, r: [13, 14, 12, 11, 22, 19], t: '関東大震災。大きなゆれと火事で町が焼けた' },
    { y: 1930, t: '昭和恐慌。生糸や米の値段が下がり、暮らしが苦しくなった' },
    { y: 1933, r: [3, 4], t: '昭和三陸津波' },
    { y: 1934, r: [27, 39, 28], t: '室戸台風。大きな風で家や学校がこわれた' },
    { y: 1937, t: '日中戦争が始まった' },
    { y: 1941, t: '太平洋戦争が始まった' },
    { y: 1945, r: [34], t: '原子爆弾が広島に落とされた' },
    { y: 1945, r: [42], t: '原子爆弾が長崎に落とされた' },
    { y: 1945, r: [13, 27, 23, 14, 28, 40, 22, 26], t: '空襲で町が焼けた' },
    { y: 1945, t: '戦争が終わった' },
    { y: 1946, r: [30, 36, 37, 39, 38, 27, 24], t: '昭和南海地震' },
    { y: 1959, r: [23, 24], t: '伊勢湾台風。大きな高潮が来た' },
    { y: 1964, t: '東京オリンピック。テレビの前に人が集まった' },
    { y: 1970, t: '大阪で万国博覧会が開かれた' },
  ];

  // ---------- 人生のできごと（年代・仕事で選ぶ文） ----------
  // g: 時代のまとまり, j: 仕事, s: 男女
  const CHILD = [
    { g: ['old'], t: '雷の音におびえて、母にしがみついた' },
    { g: ['old'], t: '貝塚で、きれいな貝がらを見つけて宝物にした' },
    { g: ['old'], t: '冬ごもりの竪穴住居で、年寄りの昔話を聞いた' },
    { g: ['kodai', 'heian'], t: '村の子どもたちと、田のあぜで蛙をつかまえて遊んだ' },
    { g: ['kodai', 'heian', 'chusei'], t: '都から来た役人の行列を、木の上からのぞいた' },
    { g: ['heian', 'chusei'], t: 'はやり病で村が静まりかえった年を、なんとか生きのびた' },
    { g: ['chusei'], t: '戦の落ち武者が村を通るのを、草むらに隠れて見ていた' },
    { g: ['chusei', 'edo'], t: 'お地蔵さまに団子を供えては、こっそり食べてしかられた' },
    { g: ['edo'], t: '凧あげで、村でいちばん高く上げた' },
    { g: ['edo'], t: '旅の芝居一座が村に来て、夢中で見た' },
    { g: ['edo'], t: 'はしかにかかり、三日三晩うなされたが助かった' },
    { g: ['edo'], t: '手習いの師匠に、字の筋がいいとほめられた' },
    { g: ['kindai'], yr: [1890, 1930], t: 'はじめて汽車を見て、走って追いかけた' },
    { g: ['kindai'], t: '学校の帰り道、道草をして日が暮れた' },
    { g: ['kindai', 'showa'], t: '赤痢がはやった年、近所の友だちを亡くした' },
    { g: ['showa'], yr: [1926, 1944], t: '紙芝居屋の拍子木の音を聞くと、走って集まった' },
    { g: ['showa'], yr: [1944, 1946], t: '空襲をさけて、田舎へ集団疎開した' },
    { g: ['showa'], yr: [1950, 1988], t: '給食の脱脂粉乳が苦手だった' },
    { g: ['showa'], yr: [1955, 1988], t: '駄菓子屋に通いつめた' },
    { g: ['all'], t: '{pet}をかわいがった' },
    { g: ['old'], t: 'ムラのまわりの森でドングリを拾い、大人にほめられた' },
    { g: ['old'], t: 'はじめて自分で魚をつかまえた' },
    { g: ['old', 'kodai'], t: '冬の寒さで高い熱を出したが、なんとか助かった' },
    { g: ['kodai', 'heian'], t: '田植えの手伝いを始めた' },
    { g: ['heian', 'chusei'], t: '寺の和尚に字を少し教わった' },
    { g: ['chusei'], t: '村祭りで太鼓をたたいた' },
    { g: ['edo'], t: '疱瘡（ほうそう）にかかるが助かる。顔に少しあとが残った' },
    { g: ['edo'], t: '寺子屋に通いはじめた' },
    { g: ['edo'], t: '近くの川でおぼれかけ、{rescuer}に助けられた' },
    { g: ['kindai', 'showa'], yr: [1886, 1940], t: '尋常小学校に入学した' },
    { g: ['kindai', 'showa'], t: '村の運動会のかけっこで一等になった' },
    { g: ['showa'], yr: [1941, 1946], t: '国民学校に入学した' },
    { g: ['showa'], yr: [1928, 1955], t: 'はじめてラジオで相撲を聞いた' },
    { g: ['all'], t: '{sibtxt}' },
  ];
  const YOUTH = [
    { g: ['old'], t: '遠くのムラとの、黒曜石の交換について行った' },
    { g: ['old'], t: '丸木舟で、はじめて沖へこぎ出した' },
    { g: ['kodai'], j: ['farm'], t: '税の布を背負って、都まで何日も歩いた' },
    { g: ['kodai'], t: '村の歌垣（うたがき）で、歌を交わした' },
    { g: ['heian'], j: ['servant'], t: '貴族の屋敷で、はじめて牛車を間近で見た' },
    { g: ['heian'], j: ['noble'], t: 'はじめて宮中の行事にお供した' },
    { g: ['chusei'], j: ['bashaku'], t: '馬に荷を積んで、峠をいくつも越えた' },
    { g: ['chusei'], j: ['monk'], t: '修行のため、山の寺にこもった' },
    { g: ['edo'], j: ['merchant'], t: '丁稚として、朝から晩までそろばんをはじいた' },
    { g: ['edo'], j: ['craft'], t: '親方に弟子入りし、道具の手入れから始めた' },
    { g: ['edo'], j: ['samurai'], t: '剣術の道場に通い、師範代に一本取った' },
    { g: ['edo'], j: ['farm'], t: '若衆組に入り、祭りの神輿をかついだ' },
    { g: ['edo'], s: 'f', t: '武家屋敷へ奉公に上がり、行儀を習った' },
    { g: ['kindai'], s: 'm', yr: [1873, 1944], t: '兵役についた。はじめて故郷を長く離れた' },
    { g: ['kindai', 'showa'], t: 'はじめて{city}の町に出て、人の多さに目を回した' },
    { g: ['showa'], yr: [1950, 1975], t: '集団就職の列車で、{city}へ向かった' },
    { g: ['showa'], yr: [1946, 1988], t: 'ダンスホールで、はじめて踊った' },
    { g: ['edo', 'kindai', 'showa'], t: '{city}で見たものの話を、村に帰って得意げにした' },
    { g: ['old'], j: ['hunt'], t: 'はじめて大きな鹿をしとめ、ムラで祝ってもらった' },
    { g: ['old'], j: ['gather'], t: '土器の模様つけをまかされるようになった' },
    { g: ['old', 'kodai', 'heian', 'chusei', 'edo', 'kindai'], j: ['farm'], t: '一人前に田んぼをまかされるようになった' },
    { g: ['kodai'], j: ['sakimori'], t: '防人として九州へ送られた。三年間、故郷に帰れなかった' },
    { g: ['kodai'], j: ['labor'], t: '豪族の古墳づくりに呼び出され、土を運び続けた' },
    { g: ['kodai', 'heian', 'chusei'], j: ['monk'], t: '寺に入り、修行を始めた' },
    { g: ['heian', 'chusei'], j: ['bushi'], t: '弓の腕を見こまれ、武者に取り立てられた' },
    { g: ['chusei'], j: ['ashigaru'], t: '足軽として戦に出た。槍をにぎる手がふるえた' },
    { g: ['chusei'], j: ['merchant'], t: '市で塩と布を商いはじめた' },
    { g: ['edo'], j: ['merchant', 'craft'], t: '{city}の店へ奉公に出た' },
    { g: ['edo'], j: ['farm'], t: '冬のあいだ、{city}へ出かせぎに行った' },
    { g: ['edo'], j: ['samurai'], t: '元服し、藩のお勤めを始めた' },
    { g: ['edo'], j: ['fish'], t: '父の舟に乗って、沖に出るようになった' },
    { g: ['edo', 'chusei'], t: '伊勢参りに出かけ、生まれてはじめて海の向こうの山を見た' },
    { g: ['kindai', 'showa'], j: ['factory'], s: 'f', yr: [1872, 1940], t: '製糸工場に働きに出た。朝から晩まで糸をくり続けた' },
    { g: ['kindai'], j: ['pioneer'], yr: [1869, 1940], t: '北海道へ渡り、森を切りひらいて畑をつくった' },
    { g: ['kindai', 'showa'], j: ['office'], t: '{city}の会社に勤めはじめた' },
    { g: ['kindai', 'showa'], j: ['teacher'], yr: [1872, 1949], t: '師範学校を出て、小学校の先生になった' },
    { g: ['kindai', 'showa'], j: ['mine'], t: '炭鉱で働きはじめた。真っ黒になって帰る毎日だった' },
    { g: ['kindai', 'showa'], s: 'm', yr: [1873, 1944], t: '徴兵検査を受けた' },
    { g: ['showa'], j: ['factory'], t: '{city}の工場で働きはじめた' },
    { g: ['all'], t: 'はじめての{pay}で、母に{food}を{gift}' },
  ];
  const ADULT = [
    { g: ['old'], t: 'ムラのまつりで、土偶を作る役をまかされた' },
    { g: ['old', 'kodai'], t: '大きな獣に襲われかけ、仲間に助けられた' },
    { g: ['kodai'], j: ['farm'], t: '口分田の割り当てが減り、暮らしが苦しくなった' },
    { g: ['heian', 'chusei'], t: '盗賊に家の米を奪われた' },
    { g: ['chusei'], j: ['farm'], t: '村の寄り合いで、用水の取り決めをまとめた' },
    { g: ['chusei'], t: '戦で田を荒らされ、一から耕しなおした' },
    { g: ['edo'], j: ['farm'], t: '新田の開墾に加わった' },
    { g: ['edo'], j: ['merchant'], t: '大口の取引をまとめ、主人にほめられた' },
    { g: ['edo'], t: '火事で家を失い、建てなおした' },
    { g: ['edo'], t: '村の名主の手伝いで、帳面づけをした' },
    { g: ['kindai'], t: '村に電灯がつき、夜が明るくなった' },
    { g: ['kindai', 'showa'], j: ['factory'], t: '工場長に、仕事ぶりを認められた' },
    { g: ['showa'], yr: [1946, 1955], t: '闇市で食べものを手に入れた' },
    { g: ['showa'], yr: [1960, 1988], t: '団地に引っ越した' },
    { g: ['showa'], yr: [1963, 1988], t: '家族で海水浴に出かけた' },
    { g: ['all'], t: '隣の家とけんかをしたが、のちに仲直りした' },
    { g: ['all'], t: '友だちの借金の保証人になり、苦労した' },
    { g: ['all'], t: '{pet}を飼いはじめた' },
    { g: ['all'], t: '{spousetxt}' },
    { g: ['all'], t: '{childtxt}' },
    { g: ['old', 'kodai'], t: 'ムラの新しい竪穴住居づくりを手伝った' },
    { g: ['kodai', 'heian', 'chusei', 'edo'], j: ['farm'], t: '日照りの年。みんなで雨ごいをした' },
    { g: ['heian', 'chusei', 'edo'], t: '大雨で川があふれ、田が流された' },
    { g: ['chusei', 'edo'], j: ['farm'], t: '年貢の取り立てが厳しく、村で寄り合いを開いた' },
    { g: ['edo'], j: ['merchant'], t: '番頭に取り立てられた' },
    { g: ['edo'], j: ['craft'], t: '親方から独り立ちを許され、自分の店を持った' },
    { g: ['edo'], j: ['samurai'], t: '藩の財政が苦しく、俸禄が減らされた' },
    { g: ['edo'], t: '村の祭りの世話役をまかされた' },
    { g: ['kindai', 'showa'], j: ['merchant'], t: '店を少し大きくした' },
    { g: ['kindai', 'showa'], j: ['farm'], t: '牛を一頭買った。家族みんなで喜んだ' },
    { g: ['showa'], yr: [1955, 1988], t: '家にテレビが来た' },
    { g: ['showa'], yr: [1955, 1988], t: '洗濯機を買った' },
    { g: ['all'], t: '{skill}の腕前が近所で評判になった' },
    { g: ['all'], t: '大きな病気をしたが、なんとか持ち直した' },
  ];
  const LATE = [
    { g: ['old'], t: 'ムラの子どもたちに、狩りのこつを教えた' },
    { g: ['heian', 'chusei'], t: '寺に参り、来世を祈るようになった' },
    { g: ['edo'], t: '念願の伊勢参りに出かけた' },
    { g: ['edo'], t: '村の古老として、もめごとの相談を受けるようになった' },
    { g: ['kindai'], t: '息子が兵隊にとられ、無事を祈る毎日だった' },
    { g: ['showa'], yr: [1955, 1988], t: '老人会で旅行に行った' },
    { g: ['showa'], yr: [1960, 1988], t: 'テレビの時代劇を見るのが楽しみだった' },
    { g: ['all'], t: '若いころの話をすると、止まらなくなった' },
    { g: ['all'], t: '{pet}が亡くなり、しばらく元気がなかった' },
    { g: ['all'], t: '{grandtxt}' },
    { g: ['all'], t: '若い者に{skill}を教えるようになった' },
    { g: ['all'], t: '{fireside}で昔話をするのが楽しみになった' },
    { g: ['edo', 'chusei'], t: '隠居して、家を子にゆずった' },
    { g: ['kindai', 'showa'], yr: [1900, 1988], t: '孫と一緒に写真をとった' },
    { g: ['showa'], yr: [1964, 1988], t: '新幹線にはじめて乗った' },
    { g: ['all'], t: '生まれた{home}のまわりを、久しぶりに歩いた' },
  ];
  const DEATH = {
    old: ['冬の寒さ', '流行り病', 'けが', '年をとって'],
    kodai: ['流行り病（もがさ）', '冬の寒さ', '年をとって', '熱の病'],
    heian: ['流行り病', '年をとって', '熱の病', '腹の病'],
    chusei: ['流行り病', '年をとって', '戦のけが', '腹の病'],
    edo: ['年をとって', '流行り病', '中風（脳卒中）', '腹の病', '咳の病'],
    kindai: ['結核', '年をとって', '脳卒中', '肺炎', '腹の病'],
    showa: ['脳卒中', '年をとって', 'がん', '心臓の病', '肺炎'],
  };
  const LIFE = { old: 34, kodai: 40, heian: 44, chusei: 46, edo: 52, kindai: 56, showa: 68 };

  // ---------- 有名人（とてもまれ。年・場所は確認済みの範囲で） ----------
  const FAMOUS = [
    { n: '松尾芭蕉', b: 1644, d: 1694, at: '伊賀国（今の三重県伊賀市）', job: '俳人', ev: [[1680, '江戸の深川に住む。のちの芭蕉庵'], [1689, '弟子の曾良と「おくのほそ道」の旅に出る'], [1694, '旅の途中、大坂で亡くなる']] },
    { n: '伊能忠敬', b: 1745, d: 1818, at: '上総国（今の千葉県九十九里町）', job: '測量家', ev: [[1762, '佐原（今の香取市）の伊能家の婿になる'], [1795, '50歳で江戸に出て、天文学を学ぶ'], [1800, '蝦夷地（北海道）の測量に出発'], [1818, '日本地図の完成を見ずに江戸で亡くなる']] },
    { n: '葛飾北斎', b: 1760, d: 1849, at: '江戸本所（今の東京都墨田区）', job: '浮世絵師', ev: [[1779, '浮世絵師としてデビュー'], [1831, '「富嶽三十六景」が評判になる'], [1849, '江戸の浅草で亡くなる']] },
    { n: '二宮尊徳（金次郎）', b: 1787, d: 1856, at: '相模国（今の神奈川県小田原市）', job: '農政家', ev: [[1800, '父を亡くし、苦しい暮らしの中で学ぶ'], [1856, '今市（今の栃木県日光市）で亡くなる']] },
    { n: '坂本龍馬', b: 1836, d: 1867, at: '土佐国（今の高知県高知市）', job: '志士', ev: [[1853, '江戸で剣術修行中に黒船を見る'], [1862, '土佐藩を抜け出す'], [1866, '薩長同盟の仲立ちをする'], [1867, '京都の近江屋で亡くなる']] },
    { n: '樋口一葉', b: 1872, d: 1896, at: '東京府（今の東京都千代田区）', job: '小説家', ev: [[1886, '歌の塾「萩の舎」に入る'], [1895, '「たけくらべ」を発表する'], [1896, '結核のため24歳で亡くなる']] },
    { n: '野口英世', b: 1876, d: 1928, at: '福島県（今の猪苗代町）', job: '医学者', ev: [[1878, 'いろりに落ちて左手に大やけどを負う'], [1900, 'アメリカへ渡る'], [1928, 'アフリカのアクラで黄熱病のため亡くなる']] },
    { n: '宮沢賢治', b: 1896, d: 1933, at: '岩手県（今の花巻市）', job: '詩人・童話作家', ev: [[1921, '稗貫農学校の先生になる'], [1924, '「注文の多い料理店」を出す'], [1933, '花巻で亡くなる。37歳']] },
  ];

  // ---------- 味つけ ----------
  const MOOD = {
    jomon: '森で木の実を拾い、土器を焼く煙があちこちから上がっていたころ。', yayoi: 'ムラに水田が広がり、稲の実りを祈っていたころ。',
    kofun: '豪族の大きな古墳が、あちこちで築かれていたころ。', asuka: '都に大きな寺が建ち、国のしくみが作られていったころ。',
    nara: '都に大仏が建ち、村からは税の布や米が運ばれていったころ。', heian: '都では貴族が歌をよみ、村には荘園の田が広がっていたころ。',
    kamakura: '鎌倉に武士の政府ができ、村には新しい仏の教えが広まっていたころ。', muromachi: '村人が寄り合って、自分たちで村を守っていたころ。',
    sengoku: 'あちこちで戦が起き、明日がどうなるかわからなかったころ。', edo: '戦のない世が長く続き、江戸には百万の人が暮らしていたころ。',
    meiji: '汽車が走りはじめ、村にも学校ができていったころ。', taisho: '町に電灯がともり、活動写真が人気だったころ。',
    showa1: '戦争の足音が、少しずつ近づいていたころ。', showa2: '町が立ち直り、テレビや冷蔵庫が家にやってきたころ。',
  };
  const moodOf = (k, y) => k === 'showa' ? (y < 1946 ? MOOD.showa1 : MOOD.showa2) : MOOD[k];
  const PERS_S = { 'せっかちだが面倒見がいい': 'せっかちな', 'のんびり屋で、怒ったところを誰も見たことがない': 'のんびり屋の', 'がんこで、言い出したら聞かない': 'がんこな', '人見知りだが、慣れるとよくしゃべる': '人見知りの', '世話好きで、村じゅうの事情を知っている': '世話好きの', 'まじめで、約束は必ず守る': 'まじめな', '冗談ばかり言って人を笑わせる': 'おどけ者の', '涙もろい': '涙もろい', '負けず嫌い': '負けず嫌いの', '物知りで、子どもによく話をしてやった': '物知りの', '気が小さいが、いざというときは度胸がある': 'いざという時に強い', 'お人よしで、よく人にだまされた': 'お人よしの', '口は悪いが根はやさしい': '口の悪い', 'きれい好き': 'きれい好きの', '酒好き': '酒好きの', '甘いもの好き': '甘党の' };
  function icon(t, kind) {
    if (kind === 'birth') return '👶'; if (kind === 'death') return '🕯️'; if (kind === 'love') return '💞';
    if (/地震|津波|高潮|台風|噴火|大火|焼け|空襲|原子爆弾/.test(t)) return '🔥';
    if (/飢饉|不作|恐慌|日照り/.test(t)) return '🍂';
    if (/戦|乱|兵|召集|元の大軍/.test(t)) return '⚔️';
    if (/病|疱瘡|コロリ|かぜ|熱/.test(t)) return '🤒';
    if (/孫|子が/.test(t)) return '🎎';
    if (/奉公|働き|勤め|商い|工場|炭鉱|先生|出かせぎ/.test(t)) return '🧺';
    if (/祭|伊勢|旅|新幹線|オリンピック|博覧会/.test(t)) return '🏮';
    return '・';
  }
  Z.icon = icon;
  const JOB_ICON = { hunt: '🏹', gather: '🌰', fish: '🐟', farm: '🌾', craft: '🔨', chief: '🔥', labor: '⛏️', servant: '🏯', monk: '📿', official: '📜', sakimori: '🛡️', noble: '🎐', bushi: '🏹', merchant: '🪙', bashaku: '🐴', ashigaru: '🗡️', samurai: '⚔️', factory: '🧵', teacher: '📖', soldier: '🎖️', pioneer: '🪓', office: '💼', mine: '⛏️' };
  // 幼くして亡くなった子
  const EARLY_CAUSE = { old: ['冬の寒さ', '高い熱'], kodai: ['はやり病', '高い熱', '冬の寒さ'], heian: ['はやり病', '高い熱'], chusei: ['はやり病', '高い熱', '腹の病'], edo: ['疱瘡（ほうそう）', 'はしか', '高い熱', '腹の病'], kindai: ['はしか', '赤痢', '肺炎', 'ジフテリア'], showa: ['肺炎', '疫痢', 'はしか'] };
  const SEASON = ['春の朝', '夏の夜', '秋の夕暮れ', '冬の朝', '雪の降る晩', '梅雨の晴れ間', '稲刈りのころ', '桜の散るころ'];
  const KID_MEMO = ['はじめて立ち上がった日、家じゅうが笑った', 'きょうだいの背中におぶわれるのが好きだった', '{food}を少し食べさせてもらい、目を丸くした', '犬のあとをよちよちと追いかけた', '母の子守唄でよく眠った', '川べりで小石を集めるのが好きだった', '祭りの太鼓の音に、手をたたいて喜んだ', '父のひざの上で、いろりの火を見つめていた'];
  const KID_MEMO2 = ['近所の子と、日が暮れるまで遊んだ', '{skill}をまねして、大人を笑わせた', '弟（妹）の子守をよくした', '「大きくなったら{dream}になる」と言っていた', '字を少しだけ覚えた', '畑仕事の手伝いを始めた'];

  // ---------- 場所 ----------
  let P = null;
  Z.init = data => { P = data; };
  Z.findPlace = function (q) {
    q = String(q || '').replace(/\s/g, '');
    if (!q) return [];
    const out = [];
    const exact = [];
    P.cur.forEach((c, i) => { const full = P.pref[c[1] - 1] + c[0]; if (c[0] === q || full === q) exact.push(i); else if (full.endsWith(q) && q.length >= 2) out.push(i); });
    return exact.length ? exact : out;
  };
  const CITY_BY_ERA = { edo: ['江戸', '大坂', '京'], kindai: ['東京', '大阪', '横浜'], showa: ['東京', '大阪', '名古屋'] };
  // できごとの年に合った町の呼び名（1868年からは江戸ではなく東京）
  const cityAt = y => { const c = CITY_BY_ERA[G[eraOf(y).k]]; return c ? c[Math.abs(y * 7) % c.length] : '都'; };
  function placeAt(ci, y) {
    const c = P.cur[ci], pn = P.pref[c[1] - 1];
    const now = pn + c[0];
    if (y >= 1889) {
      if (y >= c[4]) return { txt: now, now, sp: { ci, k: 'now' } };
      const cand = P.old.filter(o => o[4] === ci && o[2] <= y && y < o[3]);
      if (cand.length) { const o = cand[0]; return { txt: pn + (o[1] || '') + o[0], now, old: o[0], sp: { ci, k: 'old', oi: P.old.indexOf(o) } }; }
      return { txt: now + 'のあたり', now, sp: { ci, k: 'near' } };
    }
    return { txt: '今の' + now + 'のあたり', now, sp: { ci, k: 'nownear' } };
  }

  // 訳す側（js/life_i18n.js）が使う中身
  Z._ = { ERAS, eraOf, G, yearText, get P() { return P; }, FAMOUS, NAMES, SURNAMES, SAMURAI_M, JOMON_NICK, BUILD, MARKS, PERS, PERS_S, FOOD, PHRASE, SKILL, LAST, HIST, CHILD, YOUTH, ADULT, LATE, DEATH, EARLY_CAUSE, SEASON, KID_MEMO, KID_MEMO2, MOOD, JOBS, CITY_BY_ERA };
  // ---------- 前世をつくる ----------
  Z.make = function (name, birth, ci) {
    const by = +String(birth).slice(0, 4) || 2000;
    const seed = xmur3(name.trim() + '|' + birth + '|' + ci)();
    R = mulberry(seed);
    // 有名人（とてもまれ）
    if (chance(0.005)) {
      const f = pick(FAMOUS.filter(x => x.d < by));
      if (f) return famous(f, by);
    }
    // 時代：その時代を生きた人の多さで選ぶ（あなたが生まれる前に亡くなっている人だけ）
    let era, y0, sex, life, early = 0, earlyDays = 0;
    for (let k = 0; k < 80; k++) {
      // 北海道は明治（1869年）より前は蝦夷地、沖縄は1879年より前は琉球王国。どちらも縄文か、それ以降だけにする
      const pr0 = P.cur[ci][1], minY = pr0 === 1 ? 1869 : pr0 === 47 ? 1879 : -99999;
      const lo = e => e.k === 'jomon' ? e.a : Math.max(e.a, minY);
      era = wpick(ERAS, e => e.pop * Math.max(0, Math.min(e.b, by - 2) - lo(e)));
      y0 = Math.floor(lo(era) + rnd() * (Math.min(era.b, by - 2) - lo(era)));
      const gg = G[era.k];
      // 子どものうちに亡くなる割合（1歳まで, 1〜14歳）
      const M = gg === 'old' ? [0.25, 0.25] : gg === 'edo' ? [0.18, 0.15] : gg === 'kindai' ? [0.15, 0.08] : gg === 'showa' ? (y0 < 1946 ? [0.10, 0.04] : [0.03, 0.01]) : [0.22, 0.20];
      const r = rnd();
      if (r < M[0]) { early = 1; life = 0; earlyDays = chance(0.45) ? ri(1, 30) : ri(31, 360); }
      else if (r < M[0] + M[1]) { early = 2; life = chance(0.7) ? ri(1, 5) : ri(6, 14); }
      else {
        life = Math.round(LIFE[gg] + gauss() * 14 + (chance(0.15) ? 18 : 0));
        life = Math.max(15, Math.min(96, life));
      }
      if (y0 + life < by) break;
      if (!early && by - y0 - 1 >= 40) { life = by - y0 - 1 - ri(0, 6); break; }
    }
    const e = eraOf(y0), g = G[e.k];
    const jobs = JOBS[e.k];
    let job = wpick(jobs, j => j[2]);
    sex = job[3] || (chance(0.5) ? 'm' : 'f');
    const jk = job[0];
    // 名前
    let nm, sur = '';
    if (g === 'old') nm = '（名前は残っていない）';
    else if (jk === 'samurai' && sex === 'm') nm = pick(SAMURAI_M);
    else nm = pick(NAMES[g][sex]);
    if (y0 >= 1870 || jk === 'samurai') sur = pick(SURNAMES);
    const nick = g === 'old' ? pick(JOMON_NICK) : '';
    // 体・人がら
    const h0 = HEIGHT[e.k][sex === 'm' ? 0 : 1];
    const height = Math.round(h0 + gauss() * 5);
    const hnote = height >= h0 + 7 ? '（当時としてはかなり高い）' : height >= h0 + 3 ? '（当時としては高め）' : height <= h0 - 6 ? '（当時としても小柄）' : '（当時としてはふつう）';
    const pers = pick(PERS), food = pick(FOOD[g]), phrase = pick(PHRASE), skill = pick(SKILL[g]), build = pick(BUILD), mark = pick(MARKS);
    // 家族
    const sib = ri(0, 6), order = ri(1, sib + 1);
    const ordTxt = sex === 'm' ? ['長男', '次男', '三男', '四男', '五男', '六男', '七男'][Math.min(6, order - 1)] : ['長女', '次女', '三女', '四女', '五女', '六女', '七女'][Math.min(6, order - 1)];
    const married = chance(g === 'showa' ? 0.92 : 0.85) && life >= 20;
    const marryAge = ri(sex === 'm' ? 19 : 15, sex === 'm' ? 30 : 24) + (g === 'showa' ? 4 : 0);
    const spouse = married ? (g === 'old' ? '隣のムラから来た' + (sex === 'm' ? '娘' : '若者') : pick(NAMES[g === 'old' ? 'kodai' : g][sex === 'm' ? 'f' : 'm'])) : '';
    const kids = married ? (g === 'showa' ? ri(1, 4) : ri(2, 8)) : 0;
    const kidDeath = { old: 0.4, kodai: 0.4, heian: 0.38, chusei: 0.35, edo: 0.3, kindai: 0.2, showa: 0.04 }[g];
    let lost = 0; for (let i = 0; i < kids; i++) if (chance(kidDeath)) lost++;
    const city = pick(CITY_BY_ERA[g] || ['都']);
    const persS = PERS_S[pers] || '';
    if (early) {
      const parents = g === 'old' ? ['ムラの男', 'ムラの女'] : [pick(NAMES[g === 'old' ? 'kodai' : g].m), pick(NAMES[g === 'old' ? 'kodai' : g].f)];
      if (parents.includes(nm)) parents[sex === 'm' ? 0 : 1] = (NAMES[g][sex].find(x => x !== nm) || parents[1]);   // 親と子が同じ名前にならないように
      const cause = pick(g === 'showa' && y0 >= 1950 ? ['肺炎', '生まれつきの心臓の病', '高い熱'] : EARLY_CAUSE[g]), when = pick(SEASON);
      const dreams = ['父のような' + job[1].replace(/の.*$/, ''), '{city}の商人'.replace('{city}', city), '強い人', '母のような人'];
      const ctx2 = { food, skill, dream: pick(dreams) };
      const rec = { type: 'early', ci, by, y0, life, early, earlyDays, eraK: e.k, g, jk, job: job[1], sex, nm, parents, cause, when, food, skill, city, dreamI: dreams.indexOf(ctx2.dream), bp: placeAt(ci, y0).sp };
      const T = [];
      const named = !(early === 1 && earlyDays < 7) && g !== 'old'; rec.named = named;
      T.push({ y: y0, age: 0, t: placeAt(ci, y0).txt + 'で、' + job[1] + 'の家に生まれる。父は' + parents[0] + '、母は' + parents[1], kind: 'birth', s: ['ebirth'] });
      if (early === 1) {
        if (earlyDays >= 7 && g !== 'old') T.push({ y: y0, age: 0, t: '生まれて七日目、「' + nm + '」と名づけられた', kind: '', s: ['ename'] });
        if (earlyDays > 60) { const km = pick(KID_MEMO.slice(1)); T.push({ y: y0, age: 0, t: fill(km, ctx2), kind: '', s: ['etpl', km] }); }
        const ends1 = ['母は、その子のために小さな着物を縫っていた', '父は、小さな墓に野の花をそなえた', 'きょうだいたちは、しばらくその子の話をした', '家の者は、その年の' + when.replace(/の.*$/, '') + 'を忘れなかった'];
        const e1 = pick(ends1);
        T.push({ y: y0, age: 0, t: '生まれて' + (earlyDays <= 30 ? earlyDays + '日目' : Math.round(earlyDays / 30) + 'か月') + '、' + when + '、' + cause + 'で息をひきとった。' + (named ? '' : '名前はまだつけられていなかった。') + e1, kind: 'death', s: ['edeath1', ends1.indexOf(e1)] });
      } else {
        const km1 = pick(KID_MEMO);
        T.push({ y: y0 + Math.min(1, life), age: Math.min(1, life), t: fill(km1, ctx2), kind: '', s: ['etpl', km1] });
        if (life >= 5) { const yy = y0 + ri(4, life), km2 = pick(KID_MEMO2); T.push({ y: yy, age: 0, t: fill(km2, ctx2), kind: '', s: ['etpl', km2] }); }
        const hs = HIST.filter(h => h.y >= y0 && h.y <= y0 + life && (!h.r || h.r.includes(P.cur[ci][1])));
        if (hs.length) { const h = hs[0]; T.push({ y: h.y, age: h.y - y0, t: h.t, kind: 'hist', s: ['hist', h.t] }); }
        const ends2 = ['最後に「かあちゃん」と小さく呼んだ', '最後まで、好きだった' + food + 'の話をしていた', '母の腕の中で眠るように息をひきとった', 'きょうだいが手をにぎっていた'];
        const e2 = pick(ends2);
        T.push({ y: y0 + life, age: life, t: when + '、' + cause + 'のため亡くなる。' + life + '歳。' + e2, kind: 'death', s: ['edeath2', ends2.indexOf(e2)] });
      }
      T.forEach(x => { x.age = x.y - y0; });
      T.sort((a, b) => a.y - b.y || (a.kind === 'death') - (b.kind === 'death'));
      const nowPlace = P.pref[P.cur[ci][1] - 1] + P.cur[ci][0];
      const lifeTxt = early === 1 ? (earlyDays <= 30 ? earlyDays + '日' : Math.round(earlyDays / 30) + 'か月') : life + '年';
      return {
        famous: false, early: true, era: e.n, name: named ? nm : '（名前がつく前に亡くなった）', nick: '', job: job[1] + 'の家の子', jicon: '🕊️', born: y0, life,
        alias: lifeTxt + 'だけ、この世にいた子', mood: moodOf(e.k, y0),
        summary: placeAt(ci, y0).txt.replace(/^今の/, '') + 'に生まれ、' + lifeTxt + 'の短い一生を終えた。それでも、たしかにここにいた。',
        chips: [yearText(y0) + '生まれ', '享年 ' + lifeTxt, nowPlace],
        prof: [['時代', e.n], ['生まれ', yearText(y0) + '、' + placeAt(ci, y0).txt], ['家', job[1] + 'の家。父は' + parents[0] + '、母は' + parents[1]], ['生きた時間', lifeTxt], ['亡くなった理由', cause]],
        table: T, last: '', after: (by - y0 - life) + '年後、同じ土地（' + nowPlace + '）で、あなたが生まれた。',
        share: '私の前世は、' + e.n + 'に' + lifeTxt + 'だけ生きた子どもでした。', rec,
      };
    }
    // 年表
    const T = [];
    const add = (age, t, kind, s) => { if (age <= life && t) T.push({ y: y0 + age, age, t, kind: kind || '', s }); };
    const ctx = { pet: pick(g === 'old' ? ['子犬', '子犬'] : ['犬', '猫', '犬', '小鳥', '猫']), pay: ['old','kodai','heian','chusei'].includes(g) ? '取り分' : '給金', gift: ['old','kodai','heian','chusei'].includes(g) ? '持って帰った' : '買って帰った', fireside: ['old','kodai'].includes(g) ? '火のそば' : '縁側', home: g === 'old' ? 'ムラ' : (['kindai','showa'].includes(g) ? '町' : '村'), rescuer: order > 1 ? (chance(0.5) ? '兄' : '姉') : '通りかかった大人', city, food, skill, place: placeAt(ci, y0).txt.replace(/^今の/, '') };
    const gAt = a => G[eraOf(y0 + a).k];
    const fillAt = (t, a) => fill(t, Object.assign({}, ctx, { city: cityAt(y0 + a) }));
    const choose = (list, n, ay) => { const ga = gAt(ay); const ok = list.filter(x => (x.g.includes('all') || x.g.includes(ga)) && (!x.j || x.j.includes(jk)) && (!x.s || x.s === sex) && (!x.yr || (y0 + ay >= x.yr[0] - 3 && y0 + ay <= x.yr[1]))); const out = []; for (let k = 0; k < n && ok.length; k++) { const i = Math.floor(rnd() * ok.length); out.push(ok.splice(i, 1)[0]); } return out; };
    const birthPlace = placeAt(ci, y0);
    add(0, birthPlace.txt + 'で、' + job[1] + 'の家の' + (g === 'old' ? '子' : ordTxt) + 'として生まれる', 'birth', ['birth']);
    ctx.sibtxt = sib ? 'きょうだいは' + (sib + 1) + '人。いつも' + (order > 1 ? '上の子のあとをついて歩いた' : '下の子の面倒を見ていた') : 'ひとりっ子で、母にかわいがられた';
    choose(CHILD, 2, 7).forEach((x, i) => { const a = /入学|通いはじめ/.test(x.t) ? ri(6, 7) : x.yr ? Math.max(x.yr[0] - y0, 3) : ri(3 + i * 4, 6 + i * 5); if (x.yr && y0 + a < x.yr[0]) return; if (!x.yr || y0 + a <= x.yr[1]) add(a, fillAt(x.t, a), '', ['tpl', x.t, cityAt(y0 + a)]); });
    choose(YOUTH, 2, 16).forEach((x, i) => { const a = ri(13 + i * 4, 17 + i * 4); if (!x.yr || (y0 + a >= x.yr[0] && y0 + a <= x.yr[1])) add(a, fillAt(x.t, a), '', ['tpl', x.t, cityAt(y0 + a)]); });
    if (married) add(marryAge, (g === 'old' ? spouse + 'と夫婦になる' : spouse + 'と夫婦になる'), 'love', ['marry']);
    if (kids) {
      const a = marryAge + ri(1, 3);
      add(a, 'はじめての子が生まれる' + (kids > 1 ? '。このあと、子は全部で' + kids + '人' + (lost ? '（うち' + lost + '人は幼くして亡くなった）' : '') : ''), 'love', ['kid1']);
    }
    ctx.spousetxt = ''; ctx.childtxt = '';
    choose(ADULT.filter(x => !/\{(spousetxt|childtxt)\}/.test(x.t)), 3, 35).forEach((x, i) => { const a = x.yr ? Math.max(x.yr[0] - y0 + ri(0, 3), 25) : ri(25 + i * 7, 31 + i * 8); if (!x.yr || y0 + a <= x.yr[1]) add(a, fillAt(x.t, a), '', ['tpl', x.t, cityAt(y0 + a)]); });
    if (life >= 55) {
      ctx.grandtxt = kids ? 'はじめての孫が生まれた' : '近所の子どもたちに慕われた';
      choose(LATE, 2, 60).forEach((x, i) => { const a = x.yr ? Math.max(x.yr[0] - y0 + ri(0, 3), 52) : ri(52 + i * 5, Math.max(53 + i * 5, Math.min(life - 1, 70 + i * 6))); if (!x.yr || y0 + a <= x.yr[1]) add(a, fillAt(x.t, a), '', ['tpl', x.t, cityAt(y0 + a)]); });
    }
    // 本当にあったできごと（生きていた間に、その土地や全国で）
    const pr = P.cur[ci][1];
    const hs = HIST.filter(h => h.y > y0 + 4 && h.y <= y0 + life && (!h.r || h.r.includes(pr)));
    // 地域のできごとを先に、多すぎるときはしぼる
    hs.sort((a, b) => (b.r ? 1 : 0) - (a.r ? 1 : 0));
    hs.slice(0, 5).forEach(h => add(h.y - y0, h.t, 'hist', ['hist', h.t]));
    // 戦争（昭和の男）
    let warDeath = false;
    if (sex === 'm' && y0 >= 1890 && y0 <= 1927 && y0 + 18 <= 1945) {
      const ay = Math.max(1937, y0 + 20) - y0;
      if (ay <= life && chance(0.5)) {
        add(ay, '召集され、戦地へ向かった', 'hist', ['call']);
        if (chance(0.25) && y0 + ay + 2 <= 1945) { life = ay + ri(1, Math.min(4, 1945 - y0 - ay)); warDeath = true; }
        else if (y0 + life > 1946) add(1946 - y0, '戦地から帰ってきた', 'hist', ['back']);
      }
    }
    // 明治の合併（場所の名前が変わる）
    if (y0 < 1889 && y0 + life >= 1889) { const p2 = placeAt(ci, 1889); if (p2.old || p2.txt !== birthPlace.txt) add(1889 - y0, '町村制が始まり、村は「' + p2.txt + '」になった', 'hist', ['merge', p2.sp]); }
    // 最期
    const cause = warDeath ? '戦地で' : pick(DEATH[g]);
    const lastPick = warDeath ? '' : pick(LAST);
    const deathTxt = warDeath ? '戦地で亡くなった。' + life + '歳' : (cause === '年をとって' ? '年をとって、静かに亡くなる。' : cause + 'のため亡くなる。') + life + '歳。最後の言葉は「' + lastPick + '」';
    T.push({ y: y0 + life, age: life, t: deathTxt, kind: 'death', s: ['death'] });
    T.sort((a, b) => a.y - b.y || (a.kind === 'death') - (b.kind === 'death'));
    // 同じ年の重なりをへらす
    const T2 = []; T.forEach(x => { if (!T2.some(z => z.t === x.t)) T2.push(x); });
    const after = by - (y0 + life);
    const nowPlace = P.pref[P.cur[ci][1] - 1] + P.cur[ci][0];
    const lastWord = (deathTxt.match(/「(.+?)」/) || [])[1] || '';
    const tags = [];
    if (T2.some(x => /奉公|出かせぎ|会社|工場で働|製糸|北海道/.test(x.t))) tags.push(pick(['ふるさとを出て働き', '遠くへ働きに出て']));
    const hz = T2.filter(x => x.kind === 'hist' && /地震|津波|噴火|大火|飢饉|空襲|台風|戦/.test(x.t));
    if (hz.length) tags.push(hz.length > 1 ? 'いくつもの災いをくぐり抜け' : pick(['大きな災いをくぐり抜け', 'つらい年を生きのび']));
    if (kids >= 5) tags.push(kids + '人の子を育て'); else if (kids) tags.push('子を育て');
    if (!married) tags.push('ひとりで生き');
    const end = warDeath ? life + '年の一生を戦地で終えた' : life >= 75 ? life + '年の長い一生を終えた' : life < 35 ? life + '年の短い一生を駆け抜けた' : life + '年の一生を静かに終えた';
    const moved = tags.length && /ふるさと|遠く/.test(tags[0]);
    const summary = (g === 'old' ? 'ムラで生まれ、' : moved ? '' : '生まれた土地で') + (tags.length ? tags.join('、') + '、' : '') + end + '。';
    const aliasA = [food + '好きの、' + persS + job[1].replace(/（.*）/, ''), persS + job[1].replace(/（.*）/, '') + '、' + skill + 'の名人', '「' + phrase + '」が口ぐせの' + job[1].replace(/（.*）/, '')];
    const alias = pick(aliasA);
    const rec = { type: 'normal', ci, by, y0, life, eraK: e.k, g, jk, job: job[1], sex, nm, sur, nick, height, hnote, pers, persS, food, phrase, skill, build, mark, sib, order, ordTxt, married, marryAge, spouse, kids, lost, city, ctx, warDeath, cause, lastPick, tags, moved, aliasI: aliasA.indexOf(alias), bp: birthPlace.sp, after };
    return {
      famous: false, early: false, alias, mood: moodOf(e.k, y0), summary, last: warDeath ? '' : lastWord, jicon: JOB_ICON[jk] || '🌾',
      chips: [yearText(y0) + '生まれ', '享年 ' + life, nowPlace],
      era: e.n, name: (sur ? sur + ' ' : '') + nm, nick, sex, job: job[1], born: y0, life,
      prof: [
        ['時代', e.n + (G[e.k] === 'old' ? '' : '')],
        ['生まれ', yearText(y0) + '、' + birthPlace.txt],
        ['家', job[1] + 'の家の' + (g === 'old' ? '子' : ordTxt) + '（きょうだい' + (sib + 1) + '人）'],
        ['体', '身長' + height + 'cm' + hnote + '、' + build + '。' + mark],
        ['性格', pers],
        ['好物', food],
        ['口ぐせ', '「' + phrase + '」'],
        ['得意なこと', skill],
        ['家族', married ? spouse + 'と結婚。子' + kids + '人' : '生涯ひとり身'],
        ['亡くなった年', yearText(y0 + life) + '、' + life + '歳'],
      ],
      table: T2,
      after: '亡くなってから' + after + '年後、同じ土地（' + nowPlace + '）で、あなたが生まれた。',
      share: '私の前世は、' + e.n + 'の' + nowPlace.replace(/^.+?[都道府県]/, '') + 'あたりに生まれた' + job[1] + (nm.startsWith('（') ? '' : '「' + nm + '」') + '。' + life + '歳まで生きた。', rec,
    };
  };
  function famous(f, by) {
    const T = [{ y: f.b, age: 0, t: f.at + 'に生まれる', kind: 'birth', s: ['fbirth'] }].concat(f.ev.map(([y, t]) => ({ y, age: y - f.b, t, kind: y === f.d ? 'death' : 'hist', s: ['hist', t] })));
    return {
      famous: true, early: false, alias: 'まさかの、あの人', mood: moodOf(eraOf(f.b).k, f.b), summary: f.at + 'に生まれた、' + f.job + '。', last: '', jicon: '⭐', chips: [f.b + '年生まれ', '享年 ' + (f.d - f.b), f.at],
      era: eraOf(f.b).n, name: f.n, job: f.job, born: f.b, life: f.d - f.b,
      prof: [['時代', eraOf(f.b).n], ['生まれ', f.b + '年、' + f.at], ['仕事', f.job], ['亡くなった年', f.d + '年']],
      table: T, after: f.n + 'が亡くなってから' + (by - f.d) + '年後、あなたが生まれた。',
      share: '私の前世は……まさかの「' + f.n + '」でした。', rec: { type: 'famous', f, by },
    };
  }
})();
