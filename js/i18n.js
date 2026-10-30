// =============================================
//  ことば（日本語・English・繁體中文・한국어）
//  ===========================================

(function () {
  var LANGS = ['ja', 'en', 'zh', 'ko'];
  var KEY = 'jibun-lang';
  var D = {
 "lang_label": [
  "ことば",
  "Language",
  "語言",
  "언어"
 ],
 "home": [
  "なすびのお庭へ",
  "Nasubi's Garden (more games)",
  "前往茄子的庭院",
  "가지의 정원으로"
 ],
 "howto": [
  "あそびかた",
  "How to play",
  "玩法",
  "플레이 방법"
 ],
 "close": [
  "とじる",
  "Close",
  "關閉",
  "닫기"
 ],
 "back": [
  "もどる",
  "Back",
  "返回",
  "돌아가기"
 ],
 "to_title": [
  "タイトルへ",
  "Back to title",
  "回到標題",
  "타이틀로"
 ],
 "again": [
  "もう一回",
  "Play again",
  "再來一局",
  "한 판 더"
 ],
 "easy": [
  "よわい",
  "Easy",
  "簡單",
  "약함"
 ],
 "normal": [
  "ふつう",
  "Normal",
  "普通",
  "보통"
 ],
 "hard": [
  "つよい",
  "Hard",
  "困難",
  "강함"
 ],
 "vs_cpu": [
  "CPUとたいせん",
  "VS CPU",
  "對戰CPU",
  "CPU와 대전"
 ],
 "online": [
  "あいことばで対戦",
  "Play with a passcode",
  "用暗號對戰",
  "암호로 대전"
 ],
 "passcode": [
  "あいことば",
  "Passcode",
  "暗號",
  "암호"
 ],
 "name": [
  "なまえ",
  "Name",
  "名字",
  "이름"
 ],
 "noname": [
  "ななし",
  "Anonymous",
  "無名氏",
  "익명"
 ],
 "online_hint": [
  "同じあいことばを入れた人と対戦。3人目からは観戦になります。",
  "Play against whoever enters the same passcode. From the 3rd person on, you watch.",
  "和輸入相同暗號的人對戰。第3個人開始為觀戰。",
  "같은 암호를 입력한 사람과 대전. 3번째 사람부터는 관전이 됩니다."
 ],
 "join": [
  "はいる",
  "Join",
  "進入",
  "입장"
 ],
 "wait_pre": [
  "あいことば「",
  "Passcode: ",
  "暗號「",
  "암호 「"
 ],
 "wait_post": [
  "」",
  "",
  "」",
  "」"
 ],
 "waiting": [
  "あいてを待っています…",
  "Waiting for an opponent…",
  "等待對手中…",
  "상대를 기다리는 중…"
 ],
 "copy_link": [
  "さそうリンクをコピー",
  "Copy invite link",
  "複製邀請連結",
  "초대 링크 복사"
 ],
 "copied": [
  "コピーしました！",
  "Copied!",
  "已複製！",
  "복사했어요!"
 ],
 "send_link": [
  "このリンクを送ってください",
  "Send this link",
  "請傳送這個連結",
  "이 링크를 보내 주세요"
 ],
 "err_code": [
  "あいことばを入れてください（. # $ / [ ] は使えません）",
  "Enter a passcode (. # $ / [ ] are not allowed)",
  "請輸入暗號（不能使用 . # $ / [ ]）",
  "암호를 입력해 주세요 (. # $ / [ ] 는 사용할 수 없어요)"
 ],
 "err_code_short": [
  "あいことばを入れてください",
  "Enter a passcode",
  "請輸入暗號",
  "암호를 입력해 주세요"
 ],
 "connecting": [
  "つないでいます…",
  "Connecting…",
  "連線中…",
  "연결 중…"
 ],
 "err_net": [
  "通信できませんでした。電波のよいところでもう一度ためしてください",
  "Couldn't connect. Please try again where the signal is better.",
  "無法連線。請在訊號好的地方再試一次。",
  "연결하지 못했어요. 신호가 좋은 곳에서 다시 시도해 주세요."
 ],
 "err_notready": [
  "オンライン対戦はまだ準備中です",
  "Online play isn't ready yet",
  "線上對戰還在準備中",
  "온라인 대전은 아직 준비 중이에요"
 ],
 "err_conn": [
  "つながりませんでした",
  "Couldn't connect",
  "無法連線",
  "연결되지 않았어요"
 ],
 "left_win": [
  "相手が抜けたので、あなたの勝ち！",
  "Your opponent left, so you win!",
  "對手離開了，你贏了！",
  "상대가 나가서 당신의 승리!"
 ],
 "left": [
  "あいてが退室しました",
  "Your opponent left",
  "對手已離開",
  "상대가 퇴장했어요"
 ],
 "watch_in": [
  "観戦で入りました。試合が始まるのを待っています…",
  "You joined as a spectator. Waiting for the game to start…",
  "已用觀戰身分進入。等待比賽開始…",
  "관전으로 입장했어요. 경기 시작을 기다리는 중…"
 ],
 "wait_next": [
  "次の試合が始まるのを待っています…",
  "Waiting for the next game…",
  "等待下一局開始…",
  "다음 경기를 기다리는 중…"
 ],
 "wait_rematch": [
  "あいての「もう一回」を待っています…",
  "Waiting for your opponent to choose \"Play again\"…",
  "等待對手按「再來一局」…",
  "상대의 '한 판 더'를 기다리는 중…"
 ],
 "you": [
  "あなた",
  "You",
  "你",
  "나"
 ],
 "cpu": [
  "CPU",
  "CPU",
  "CPU",
  "CPU"
 ],
 "your_turn": [
  "あなたの番",
  "Your turn",
  "輪到你",
  "내 차례"
 ],
 "cpu_wait_label": [
  "CPU（ふつう）と遊びながら待つ",
  "Play the CPU (Normal) while waiting",
  "一邊和CPU（普通）玩一邊等",
  "기다리는 동안 CPU(보통)와 플레이"
 ],
 "qm_btn": [
  "だれかと対戦",
  "Play someone online",
  "隨機對戰",
  "아무나와 대전"
 ],
 "qm_stat": [
  "対戦待ち <b>{w}</b>人・対戦中 <b>{p}</b>組",
  "<b>{w}</b> waiting · <b>{p}</b> playing",
  "等待中 <b>{w}</b>人・對戰中 <b>{p}</b>組",
  "대기 <b>{w}</b>명 · 대전 중 <b>{p}</b>쌍"
 ],
 "qm_prime_hot": [
  "🔥 いま対戦タイム！（22時まで）",
  "🔥 Battle time now! (until 22:00 JST)",
  "🔥 現在是對戰時間！（到日本時間22點）",
  "🔥 지금은 대전 타임! (일본 시간 22시까지)"
 ],
 "qm_prime": [
  "🌙 毎晩21時〜22時は対戦タイム",
  "🌙 Battle time every night 21:00–22:00 JST",
  "🌙 每晚日本時間21〜22點是對戰時間",
  "🌙 매일 밤 일본 시간 21~22시는 대전 타임"
 ],
 "qm_sub": [
  "いま待っている人と、自動でつながります。",
  "You'll be matched automatically with someone who's waiting.",
  "自動和正在等待的人配對。",
  "기다리고 있는 사람과 자동으로 연결돼요."
 ],
 "qm_go": [
  "さがす",
  "Find a match",
  "尋找",
  "찾기"
 ],
 "qm_badname": [
  "その名前は使えません。ほかの名前にしてね",
  "That name can't be used. Please choose another.",
  "這個名字不能使用，請換一個。",
  "그 이름은 사용할 수 없어요. 다른 이름으로 해 주세요."
 ],
 "qm_searching": [
  "相手をさがしています",
  "Looking for an opponent",
  "正在尋找對手",
  "상대를 찾는 중"
 ],
 "qm_wait_pre": [
  "いま対戦待ち ",
  "Waiting now: ",
  "目前等待中 ",
  "현재 대기 "
 ],
 "qm_wait_post": [
  "人",
  "",
  "人",
  "명"
 ],
 "qm_cpu": [
  "CPUと遊びながら待つ",
  "Play the CPU while waiting",
  "一邊和CPU玩一邊等",
  "기다리는 동안 CPU와 플레이"
 ],
 "qm_cancel": [
  "やめる",
  "Cancel",
  "取消",
  "그만두기"
 ],
 "qm_retry": [
  "もう一度さがす",
  "Search again",
  "再找一次",
  "다시 찾기"
 ],
 "qm_searching_t": [
  "相手をさがしています… {t}",
  "Looking for an opponent… {t}",
  "正在尋找對手… {t}",
  "상대를 찾는 중… {t}"
 ],
 "qm_calling": [
  "CPUと遊んでいる人に声をかけています…",
  "Inviting someone who is playing the CPU…",
  "正在邀請正在和CPU玩的人…",
  "CPU와 플레이 중인 사람에게 신청하는 중…"
 ],
 "qm_declined": [
  "相手が見送りました。ほかの人をさがします",
  "They passed. Looking for someone else.",
  "對方跳過了，改找其他人。",
  "상대가 넘겼어요. 다른 사람을 찾을게요."
 ],
 "qm_found": [
  "相手が見つかりました！",
  "Opponent found!",
  "找到對手了！",
  "상대를 찾았어요!"
 ],
 "qm_avail": [
  "対戦できる相手がいます！",
  "Someone is ready to play!",
  "有可以對戰的對手！",
  "대전할 수 있는 상대가 있어요!"
 ],
 "qm_play": [
  "対戦する",
  "Play",
  "對戰",
  "대전하기"
 ],
 "qm_pass": [
  "見送る",
  "Pass",
  "跳過",
  "넘기기"
 ],
 "qm_taken": [
  "さっきの相手は、ほかの人と対戦を始めました。もう少し待ってね",
  "That player started a match with someone else. Please wait a little longer.",
  "剛才的對手已經和別人開始對戰了。請再等一下。",
  "방금 상대는 다른 사람과 대전을 시작했어요. 조금만 더 기다려 주세요."
 ],
 "qm_fail": [
  "相手とつながりませんでした（{c}）",
  "Couldn't connect to your opponent ({c})",
  "無法和對手連線（{c}）",
  "상대와 연결되지 않았어요 ({c})"
 ],
 "qm_nojoin": [
  "入れませんでした",
  "Couldn't join",
  "無法進入",
  "들어가지 못했어요"
 ],
 "qm_next": [
  "次の相手をさがす",
  "Find next opponent",
  "尋找下一位對手",
  "다음 상대 찾기"
 ],
 "doc_title": [
  "自分 ― あなたの前世ねんぴょう",
  "Myself — Past Life Timeline",
  "自己 ― 你的前世年表",
  "나 ― 당신의 전생 연표"
 ],
 "doc_desc": [
  "名前と誕生日と生まれた市町村区を入れると、あなたの前世の一生が年表で出てくる。縄文から昭和まで、日本の歴史のどこかに生きた、だれかの一生。",
  "Enter your name, birthday and the Japanese city or town where you were born, and see the whole life of your past self as a timeline: someone who lived somewhere in Japanese history, from the Jomon period to the Showa era.",
  "輸入名字、生日和出生的日本市町村區，就會以年表呈現你前世的一生。從繩文到昭和，某個曾活在日本歷史中的人的一生。",
  "이름과 생일, 태어난 일본의 시·정·촌·구를 넣으면 당신 전생의 일생이 연표로 나온다. 조몬부터 쇼와까지, 일본 역사 어딘가를 살았던 누군가의 일생."
 ],
 "title": [
  "自分",
  "Myself",
  "自己",
  "나"
 ],
 "tagline": [
  "あなたの前世の一生が、ここにある",
  "The whole life of your past self is right here",
  "你前世的一生，就在這裡",
  "당신 전생의 일생이 여기에 있다"
 ],
 "f_name": [
  "名前",
  "Name",
  "名字",
  "이름"
 ],
 "ph_name": [
  "例：山田太郎",
  "e.g. Taro Yamada",
  "例：王小明",
  "예: 김민수"
 ],
 "f_birth": [
  "誕生日",
  "Birthday",
  "生日",
  "생일"
 ],
 "f_place": [
  "生まれた市町村区",
  "Where you were born (city or town in Japan)",
  "出生的市町村區（日本）",
  "태어난 시·정·촌·구(일본)"
 ],
 "ph_place": [
  "例：江東区、府中市、横浜市中区",
  "e.g. Koto, Fuchu, Naka Ward Yokohama",
  "例：江東區、府中市、橫濱市中區",
  "예: 고토구, 후추시, 요코하마시 나카구"
 ],
 "loading": [
  "読みこみ中…",
  "Loading…",
  "載入中…",
  "불러오는 중…"
 ],
 "go": [
  "前世を見る",
  "See my past life",
  "看我的前世",
  "전생 보기"
 ],
 "load_err": [
  "読みこめませんでした。再読みこみしてください",
  "Couldn't load. Please reload the page.",
  "無法載入，請重新整理頁面",
  "불러오지 못했어요. 새로고침해 주세요"
 ],
 "err_input": [
  "名前と誕生日を入れてください",
  "Please enter your name and birthday",
  "請輸入名字和生日",
  "이름과 생일을 입력해 주세요"
 ],
 "err_place": [
  "市町村区が見つかりませんでした（今ある市町村区の名前で入れてください）",
  "Couldn't find that place. Please enter a current Japanese city, town, village or ward.",
  "找不到這個市町村區（請輸入現有的日本市町村區名稱）",
  "시·정·촌·구를 찾지 못했어요(지금 있는 일본의 시·정·촌·구 이름으로 입력해 주세요)"
 ],
 "cand_pre": [
  "候補：",
  "Matches: ",
  "候選：",
  "후보: "
 ],
 "cand_sep": [
  "／",
  " / ",
  "／",
  " / "
 ],
 "cand_post": [
  "（都道府県から入れるとしぼれます）",
  " (add the prefecture to narrow it down)",
  "（加上都道府縣可以縮小範圍）",
  " (도도부현부터 입력하면 좁혀져요)"
 ],
 "note": [
  "人生のできごとは、時代と土地に合わせて組み立てた架空のものです。紫の行は、その時代・その土地で実際にあったできごとです。子どものうちに亡くなる人の割合も、当時に合わせています。同じ名前・誕生日・市町村区なら、いつでも同じ前世が出ます。<br>\n市町村のデータ：国土数値情報（行政区域データ）、ROIS-DS人文学オープンデータ共同利用センター「歴史的行政区域データセットβ版」（CC BY 4.0）をもとに作成",
  "The events of each life are fictional, put together to fit the era and the place. The purple rows are things that really happened in that era and region. The share of people who died as children also follows the rates of the time. The same name, birthday and place always give the same past life.<br>Municipal data: based on National Land Numerical Information (Administrative Areas) and the ROIS-DS Center for Open Data in the Humanities “Historical Administrative Area Dataset (beta)” (CC BY 4.0)",
  "人生中的事件，是配合時代與土地組合出來的虛構故事。紫色的行，是那個時代、那片土地上真實發生過的事。孩童時期就夭折的比例，也依照當時的情況。同樣的名字、生日和市町村區，永遠會出現同樣的前世。<br>市町村資料：依據國土數值資訊（行政區域資料）、ROIS-DS人文學開放資料共同利用中心「歷史行政區域資料集β版」（CC BY 4.0）製作",
  "인생의 일들은 시대와 지역에 맞춰 꾸민 가상의 이야기입니다. 보라색 줄은 그 시대, 그 지역에서 실제로 있었던 일입니다. 어린 나이에 세상을 떠나는 사람의 비율도 당시에 맞췄습니다. 같은 이름·생일·시정촌구라면 언제나 같은 전생이 나옵니다.<br>시정촌 데이터: 국토수치정보(행정구역 데이터), ROIS-DS 인문학 오픈데이터 공동이용센터 「역사적 행정구역 데이터셋 β판」(CC BY 4.0)을 바탕으로 작성"
 ],
 "back_home": [
  "🍆 なすびのお庭（ほかのゲーム）",
  "🍆 Nasubi's Garden (more games)",
  "🍆 茄子的庭院（其他遊戲）",
  "🍆 가지의 정원(다른 게임)"
 ],
 "rare": [
  "★ ごくまれな前世 ★",
  "★ An extremely rare past life ★",
  "★ 極為罕見的前世 ★",
  "★ 아주 드문 전생 ★"
 ],
 "your_past": [
  "あなたの前世",
  "Your past life",
  "你的前世",
  "당신의 전생"
 ],
 "last_words": [
  "最後の言葉",
  "Last words",
  "臨終的話",
  "마지막 말"
 ],
 "hashtag": [
  "#前世ねんぴょう",
  "#PastLifeTimeline",
  "#前世年表",
  "#전생연표"
 ],
 "whose": [
  "{n} さんの前世",
  "{n}'s past life",
  "{n}的前世",
  "{n} 님의 전생"
 ],
 "post_x": [
  "Xに投稿",
  "Post on X",
  "分享到X",
  "X에 올리기"
 ],
 "save_img": [
  "画像を保存",
  "Save image",
  "儲存圖片",
  "이미지 저장"
 ],
 "details": [
  "くわしい年表を見る（{n}件）",
  "See the full timeline ({n})",
  "查看詳細年表（{n}則）",
  "자세한 연표 보기({n}건)"
 ],
 "other": [
  "ほかの人で試す",
  "Try someone else",
  "換個人試試",
  "다른 사람으로 해 보기"
 ],
 "cv_label": [
  "あ な た の 前 世",
  "YOUR  PAST  LIFE",
  "你 的 前 世",
  "당 신 의  전 생"
 ],
 "cv_foot": [
  "#前世ねんぴょう　「自分」",
  "#PastLifeTimeline  “Myself”",
  "#前世年表　「自己」",
  "#전생연표  ‘나’"
 ]
};
  function pick() {
    try { var q = new URLSearchParams(location.search).get('lang'); if (q && LANGS.indexOf(q) >= 0) { try { localStorage.setItem(KEY, q); } catch (e) {} return q; } } catch (e) {}
    try { var s = localStorage.getItem(KEY); if (s && LANGS.indexOf(s) >= 0) return s; } catch (e) {}
    var n = (navigator.language || 'ja').toLowerCase();
    if (n.indexOf('ja') === 0) return 'ja'; if (n.indexOf('ko') === 0) return 'ko'; if (n.indexOf('zh') === 0) return 'zh'; return 'en';
  }
  var L = pick();
  function t(k, v) {
    var row = D[k]; var i = LANGS.indexOf(L);
    var s = row ? (row[i] != null ? row[i] : row[0]) : k;
    if (v) for (var x in v) s = s.split('{' + x + '}').join(v[x]);
    return s;
  }
  function apply() {
    var de = document.documentElement;
    de.lang = L === 'zh' ? 'zh-Hant' : L; de.setAttribute('data-lang', L);
    document.querySelectorAll('[data-i]').forEach(function (e) { e.textContent = t(e.dataset.i); });
    document.querySelectorAll('[data-ih]').forEach(function (e) { e.innerHTML = t(e.dataset.ih); });
    document.querySelectorAll('[data-ip]').forEach(function (e) { e.placeholder = t(e.dataset.ip); });
    document.querySelectorAll('[data-ia]').forEach(function (e) { e.setAttribute('aria-label', t(e.dataset.ia)); });
    document.querySelectorAll('.langs button').forEach(function (b) { b.setAttribute('aria-pressed', b.dataset.lang === L ? 'true' : 'false'); });
    document.title = t('doc_title');
    var md = document.querySelector('meta[name="description"]'); if (md) md.setAttribute('content', t('doc_desc'));
    try { document.dispatchEvent(new CustomEvent('langchange', { detail: L })); } catch (e) {}
  }
  function set(l) { if (LANGS.indexOf(l) < 0) return; L = l; try { localStorage.setItem(KEY, l); } catch (e) {} apply(); }
  function bind() {
    document.querySelectorAll('.langs button').forEach(function (b) { b.addEventListener('click', function () { set(b.dataset.lang); }); });
    apply();
  }
  window.I18N = { t: t, set: set, apply: apply, get lang() { return L; } };
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', bind); else bind();
})();
