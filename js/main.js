// =============================================
//  自分（前世ねんぴょう）  画面と、投稿用の画像
// =============================================
(function () {
  const T = (k, v) => I18N.t(k, v);
  const LG = () => I18N.lang;
  const URL_GAME = 'https://nasubi-no-oniwa.github.io/jibun/';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ys = y => Z.ys(y, LG()) || (y < 0 ? '前' + (-y) : (y < 600 ? y + '頃' : String(y)));
  const ageT = a => Z.age(a, LG()) || a + '歳';
  const ic = x => x.ic || Z.icon(x.t, x.kind);
  // 中国語・韓国語は題字のフォントに字がないので、そのときだけ読みこむ
  const FONT_URL = { zh: 'https://fonts.googleapis.com/css2?family=Noto+Serif+TC:wght@500;700;900&display=swap', ko: 'https://fonts.googleapis.com/css2?family=Nanum+Myeongjo:wght@400;700;800&display=swap' };
  function needFont(l) { if (!FONT_URL[l] || document.getElementById('font-' + l)) return; const k = document.createElement('link'); k.id = 'font-' + l; k.rel = 'stylesheet'; k.href = FONT_URL[l]; document.head.appendChild(k); }
  const FAM = { ja: '"Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif', en: '"Shippori Mincho",Georgia,"Times New Roman",serif', zh: '"Noto Serif TC","Shippori Mincho","PMingLiU",serif', ko: '"Nanum Myeongjo","Noto Serif KR","Batang",serif' };
  let PL = null, last = null;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  fetch('data/places.json').then(r => r.json()).then(d => {
    PL = d; Z.init(d); $('go').disabled = false; $('go').textContent = T('go');
    const s = store.get('jibun_in'); if (s) { try { const o = JSON.parse(s); $('nm').value = o.n || ''; $('bd').value = o.b || '2000-01-01'; $('pl').value = o.p || ''; } catch (e) {} }
  }).catch(() => { $('go').textContent = T('load_err'); });
  $('go').textContent = T('loading');

  const findP = q => LG() === 'ja' ? Z.findPlace(q) : Z.findPlaceL(q, LG());
  function candT() {
    if (!PL) return; const r = findP($('pl').value);
    $('cand').textContent = r.length > 1 ? T('cand_pre') + r.slice(0, 6).map(i => Z.placeName(i, LG())).join(T('cand_sep')) + T('cand_post') : '';
  }
  $('pl').addEventListener('input', candT);

  // カードに出すのは大事なできごと6つまで（生まれ・最期・本当のできごと・家族を優先）
  function rows(L) {
    const rank = x => (x.kind === 'birth' || x.kind === 'death') ? 0 : x.kind === 'hist' ? 1 : x.kind === 'love' ? 2 : 3;
    return L.table.map((x, i) => i).sort((a, b) => rank(L.table[a]) - rank(L.table[b]) || a - b).slice(0, 6).sort((a, b) => a - b).map(i => L.table[i]);
  }
  const clean = t => t.replace(/。最後の言葉は「.+?」$/, '');
  const cleanX = x => x.short || clean(x.t);

  function show(quiet, again) {
    if (!PL) return;
    const nm = again ? again.nm : $('nm').value.trim(), bd = again ? again.bd : $('bd').value, r = again ? [again.ci] : findP($('pl').value);
    if (!nm || !bd) { $('err').textContent = T('err_input'); return; }
    if (!r.length) { $('err').textContent = T('err_place'); return; }
    $('err').textContent = '';
    if (!again) store.set('jibun_in', JSON.stringify({ n: nm, b: bd, p: $('pl').value }));
    const L0 = Z.make(nm, bd, r[0]), L = LG() === 'ja' ? L0 : Z.loc(L0, LG()); last = { L, nm, bd, ci: r[0] };
    let h = '<div class="card' + (L.early ? ' early' : '') + '">' + (L.famous ? '<div class="fam">' + esc(T('rare')) + '</div>' : '');
    h += '<div class="seal">' + L.jicon + '<small>' + esc(L.eraShort || L.era.replace('時代', '')) + '</small></div>';
    h += '<span class="era">' + esc(L.era) + '</span><div class="lbl">' + esc(T('your_past')) + '</div>';
    h += '<div class="name">' + esc(L.name) + '</div><div class="alias">' + esc(L.alias) + '</div>';
    h += '<div class="chips">' + L.chips.map(c => '<span>' + esc(c) + '</span>').join('') + '</div>';
    h += '<div class="mood">' + esc(L.mood) + '</div><div class="sum">' + esc(L.summary) + '</div>';
    h += '<ul class="ev">' + rows(L).map(x => '<li class="' + x.kind + '"><span class="y">' + ys(x.y) + '</span><span class="i">' + ic(x) + '</span><span>' + esc(cleanX(x)) + '</span></li>').join('') + '</ul>';
    if (L.last) h += '<div class="last"><small>' + esc(T('last_words')) + '</small>' + (LG() === 'en' || LG() === 'ko' ? '“' + esc(L.last) + '”' : '「' + esc(L.last) + '」') + '</div>';
    h += '<div class="after">' + esc(L.after) + '</div>';
    h += '<div class="foot"><span>' + esc(T('hashtag')) + '</span><span>' + esc(T('whose', { n: nm })) + '</span></div></div>';
    h += '<div class="more"><div class="share-row"><button type="button" class="x" id="b-x">' + esc(T('post_x')) + '</button><button type="button" id="b-save">' + esc(T('save_img')) + '</button></div>';
    h += '<details><summary>' + esc(T('details', { n: L.table.length })) + '</summary><table>' + L.prof.map(p => '<tr><th>' + esc(p[0]) + '</th><td>' + esc(p[1]) + '</td></tr>').join('') + '</table><br><table>' + L.table.map(x => '<tr><td class="y">' + esc(ys(x.y)) + '</td><td class="a">' + esc(ageT(x.age)) + '</td><td>' + ic(x) + ' ' + esc(x.t) + '</td></tr>').join('') + '</table></details>';
    h += '<button type="button" id="other">' + esc(T('other')) + '</button></div>';
    $('out').innerHTML = h; if (!quiet) $('out').scrollIntoView({ behavior: 'smooth' });
    $('other').onclick = () => { $('nm').value = ''; $('nm').focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    $('b-x').onclick = () => share(); $('b-save').onclick = () => save();
  }
  $('f').addEventListener('submit', e => { e.preventDefault(); show(); });
  // ことばを切りかえたら、出ている前世もその言葉で出しなおす
  function onLang() { needFont(LG()); $('go').textContent = PL ? T('go') : T('loading'); candT(); if (last && $('out').innerHTML) { $('err').textContent = ''; show(true, last); } }
  document.addEventListener('langchange', onLang); needFont(LG());

  // ---------- 投稿用の画像（1080×1350） ----------
  function wrap(c, text, x, y, w, lh, max) {
    if (LG() === 'en' || LG() === 'ko') return wrapW(c, text, x, y, w, lh, max);
    const out = []; let line = '';
    // 行頭に「、。」などが来ないようにする（禁則）
    for (const ch of text) { if (c.measureText(line + ch).width > w && line && !'、。，．」』）)ーぁぃぅぇぉっゃゅょ'.includes(ch)) { out.push(line); line = ch; if (max && out.length >= max) break; } else line += ch; }
    if (line && (!max || out.length < max)) out.push(line);
    if (max && out.length === max && text.length > out.join('').length) out[max - 1] = out[max - 1].slice(0, -1) + '…';
    out.forEach((l, i) => c.fillText(l, x, y + i * lh)); return out.length;
  }
  // 英語・韓国語は語の切れ目で折り返す
  function wrapW(c, text, x, y, w, lh, max) {
    const words = text.split(' '), out = []; let line = '', cut = false;
    for (let i = 0; i < words.length; i++) {
      const t = line ? line + ' ' + words[i] : words[i];
      if (c.measureText(t).width > w && line) { out.push(line); line = words[i]; if (max && out.length >= max) { cut = true; break; } } else line = t;
    }
    if (!cut && line) { if (max && out.length >= max) cut = true; else out.push(line); }
    if (cut && out.length) { let l = out[out.length - 1]; while (l && c.measureText(l + '…').width > w) l = l.slice(0, -1); out[out.length - 1] = l.replace(/[\s,.;:]+$/, '') + '…'; }
    out.forEach((l, i) => c.fillText(l, x, y + i * lh)); return out.length;
  }
  async function draw() {
    const { L, nm } = last; const cv = $('cv'), c = cv.getContext('2d'), W = 1080, H = 1350;
    const lg = LG(), fam = FAM[lg] || FAM.ja, f0 = fam.split(',')[0];
    try { await document.fonts.load('700 40px ' + f0); await document.fonts.load('500 30px ' + f0); await document.fonts.load('800 40px ' + f0); } catch (e) {}
    const F = (w, s) => w + ' ' + s + 'px ' + fam;
    c.fillStyle = '#2a211b'; c.fillRect(0, 0, W, H);
    c.fillStyle = L.early ? '#eef0f2' : '#f6eedd'; c.fillRect(30, 30, W - 60, H - 60);
    c.strokeStyle = '#b49c78'; c.lineWidth = 3; c.strokeRect(44, 44, W - 88, H - 88);
    c.fillStyle = 'rgba(120,90,50,.06)'; for (let y = 50; y < H - 50; y += 9) for (let x = 50 + (y % 18); x < W - 50; x += 18) c.fillRect(x, y, 2, 2);
    // はんこ
    c.save(); c.translate(925, 150); c.rotate(0.14); c.strokeStyle = '#b03a24'; c.lineWidth = 6; c.strokeRect(-70, -70, 140, 140);
    c.font = '64px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(L.jicon, 0, -14);
    c.fillStyle = '#b03a24'; c.font = F('800', 24); { const sh = L.eraShort || L.era.replace('時代', ''); let fs = 24; while (fs > 14 && c.measureText(sh).width > 126) { fs--; c.font = F('800', fs); } c.fillText(sh, 0, 44); } c.restore();
    c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    if (L.famous) { c.fillStyle = '#b03a24'; c.fillRect(30, 30, W - 60, 46); c.fillStyle = '#fff'; c.font = F('800', 28); c.textAlign = 'center'; c.fillText(T('rare'), W / 2, 63); c.textAlign = 'left'; }
    c.font = F('700', 26); const ew = lg === 'ja' ? 170 : Math.max(170, Math.ceil(c.measureText(L.era).width) + 32);
    c.fillStyle = '#2a211b'; c.fillRect(80, 98, ew, 40); c.fillStyle = '#f3e6cc'; c.font = F('700', 26); c.fillText(L.era, 96, 127);
    c.fillStyle = '#7d6b57'; c.font = F('500', 26); c.fillText(T('cv_label'), 80, 185);
    let nfs = L.name.length > 9 ? 58 : 72; c.font = F('800', nfs);
    if (lg !== 'ja') { nfs = 72; c.font = F('800', nfs); while (nfs > 40 && c.measureText(L.name).width > 760) { nfs -= 2; c.font = F('800', nfs); } }
    c.fillStyle = '#2b2118'; wrap(c, L.name, 80, 262, 760, 76, 1);
    c.fillStyle = '#b03a24'; c.font = F('800', 32); let y = 312 + (wrap(c, L.alias, 80, 312, 900, 42, 2) - 1) * 42;
    c.fillStyle = '#7d6b57'; c.font = F('500', 26); c.fillText(L.chips.join(lg === 'en' || lg === 'ko' ? '  /  ' : '　／　'), 80, y + 50);
    c.fillStyle = '#8a7a66'; c.font = F('500', 26); y += 100; y += wrap(c, L.mood, 80, y, 920, 36, 2) * 36;
    c.fillStyle = '#2b2118'; c.font = F('800', 34); y += 18; y += wrap(c, L.summary, 80, y, 920, 46, 3) * 46;
    c.strokeStyle = '#dccdb0'; c.lineWidth = 2; c.beginPath(); c.moveTo(80, y); c.lineTo(W - 80, y); c.stroke(); y += 46;
    for (const x of rows(L)) {
      if (y > 1110) break;
      c.fillStyle = '#7d6b57'; c.font = F('500', 24); c.fillText(ys(x.y), 80, y);
      c.font = '28px serif'; c.fillStyle = '#000'; c.fillText(ic(x), 190, y + 2);
      c.fillStyle = x.kind === 'hist' ? '#4c3f86' : '#2b2118'; c.font = F(x.kind === 'death' ? '800' : '500', 28);
      const n = wrap(c, cleanX(x), 236, y, 764, 36, 2); y += n * 36 + 14;
    }
    if (L.last && y < 1160) { c.textAlign = 'center'; c.fillStyle = '#7d6b57'; c.font = F('500', 22); c.fillText(T('last_words'), W / 2, y + 14); c.fillStyle = '#2b2118'; const lw = (lg === 'en' || lg === 'ko') ? '“' + L.last + '”' : '「' + L.last + '」'; let lfs = 38; c.font = F('800', lfs); while (lg !== 'ja' && lfs > 24 && c.measureText(lw).width > 920) { lfs -= 2; c.font = F('800', lfs); } c.fillText(lw, W / 2, y + 62); c.textAlign = 'left'; y += 80; }
    c.textAlign = 'center'; c.fillStyle = '#7d6b57'; c.font = F('500', 26); wrap(c, L.after, W / 2, Math.min(y + 40, 1205), 900, 34, 2);
    c.fillStyle = '#2a211b'; c.font = F('800', 24); c.textAlign = 'left'; c.fillText(T('cv_foot'), 80, H - 70);
    c.textAlign = 'right'; c.fillText(URL_GAME.replace('https://', ''), W - 80, H - 70); c.textAlign = 'left';
    return new Promise(res => cv.toBlob(res, 'image/png'));
  }
  const shareText = () => last.L.share + '\n' + T('hashtag') + '\n' + URL_GAME + (LG() === 'ja' ? '' : '?lang=' + LG());
  async function share() {
    const blob = await draw(); const file = new File([blob], 'zense.png', { type: 'image/png' });
    try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: shareText() }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    download(blob); window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText()), '_blank');
  }
  async function save() { download(await draw()); }
  function download(b) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'zense.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
})();
