// =============================================
//  自分（前世ねんぴょう）  画面と、投稿用の画像
// =============================================
(function () {
  const URL_GAME = 'https://nasubi-no-oniwa.github.io/jibun/';
  const $ = id => document.getElementById(id);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const ys = y => y < 0 ? '前' + (-y) : (y < 600 ? y + '頃' : String(y));
  let PL = null, last = null;
  const store = { get(k) { try { return localStorage.getItem(k); } catch (e) { return null; } }, set(k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  fetch('data/places.json').then(r => r.json()).then(d => {
    PL = d; Z.init(d); $('go').disabled = false; $('go').textContent = '前世を見る';
    const s = store.get('jibun_in'); if (s) { try { const o = JSON.parse(s); $('nm').value = o.n || ''; $('bd').value = o.b || '2000-01-01'; $('pl').value = o.p || ''; } catch (e) {} }
  }).catch(() => { $('go').textContent = '読みこめませんでした。再読みこみしてください'; });

  $('pl').addEventListener('input', () => {
    if (!PL) return; const r = Z.findPlace($('pl').value);
    $('cand').textContent = r.length > 1 ? '候補：' + r.slice(0, 6).map(i => PL.pref[PL.cur[i][1] - 1] + PL.cur[i][0]).join('／') + '（都道府県から入れるとしぼれます）' : '';
  });

  // カードに出すのは大事なできごと6つまで（生まれ・最期・本当のできごと・家族を優先）
  function rows(L) {
    const rank = x => (x.kind === 'birth' || x.kind === 'death') ? 0 : x.kind === 'hist' ? 1 : x.kind === 'love' ? 2 : 3;
    return L.table.map((x, i) => i).sort((a, b) => rank(L.table[a]) - rank(L.table[b]) || a - b).slice(0, 6).sort((a, b) => a - b).map(i => L.table[i]);
  }
  const clean = t => t.replace(/。最後の言葉は「.+?」$/, '');

  function show() {
    if (!PL) return;
    const nm = $('nm').value.trim(), bd = $('bd').value, r = Z.findPlace($('pl').value);
    if (!nm || !bd) { $('err').textContent = '名前と誕生日を入れてください'; return; }
    if (!r.length) { $('err').textContent = '市町村区が見つかりませんでした（今ある市町村区の名前で入れてください）'; return; }
    $('err').textContent = '';
    store.set('jibun_in', JSON.stringify({ n: nm, b: bd, p: $('pl').value }));
    const L = Z.make(nm, bd, r[0]); last = { L, nm };
    let h = '<div class="card' + (L.early ? ' early' : '') + '">' + (L.famous ? '<div class="fam">★ ごくまれな前世 ★</div>' : '');
    h += '<div class="seal">' + L.jicon + '<small>' + esc(L.era.replace('時代', '')) + '</small></div>';
    h += '<span class="era">' + esc(L.era) + '</span><div class="lbl">あなたの前世</div>';
    h += '<div class="name">' + esc(L.name) + '</div><div class="alias">' + esc(L.alias) + '</div>';
    h += '<div class="chips">' + L.chips.map(c => '<span>' + esc(c) + '</span>').join('') + '</div>';
    h += '<div class="mood">' + esc(L.mood) + '</div><div class="sum">' + esc(L.summary) + '</div>';
    h += '<ul class="ev">' + rows(L).map(x => '<li class="' + x.kind + '"><span class="y">' + ys(x.y) + '</span><span class="i">' + Z.icon(x.t, x.kind) + '</span><span>' + esc(clean(x.t)) + '</span></li>').join('') + '</ul>';
    if (L.last) h += '<div class="last"><small>最後の言葉</small>「' + esc(L.last) + '」</div>';
    h += '<div class="after">' + esc(L.after) + '</div>';
    h += '<div class="foot"><span>#前世ねんぴょう</span><span>' + esc(nm) + ' さんの前世</span></div></div>';
    h += '<div class="more"><div class="share-row"><button type="button" class="x" id="b-x">Xに投稿</button><button type="button" id="b-save">画像を保存</button></div>';
    h += '<details><summary>くわしい年表を見る（' + L.table.length + '件）</summary><table>' + L.prof.map(p => '<tr><th>' + esc(p[0]) + '</th><td>' + esc(p[1]) + '</td></tr>').join('') + '</table><br><table>' + L.table.map(x => '<tr><td class="y">' + esc(ys(x.y)) + '</td><td class="a">' + x.age + '歳</td><td>' + Z.icon(x.t, x.kind) + ' ' + esc(x.t) + '</td></tr>').join('') + '</table></details>';
    h += '<button type="button" id="other">ほかの人で試す</button></div>';
    $('out').innerHTML = h; $('out').scrollIntoView({ behavior: 'smooth' });
    $('other').onclick = () => { $('nm').value = ''; $('nm').focus(); window.scrollTo({ top: 0, behavior: 'smooth' }); };
    $('b-x').onclick = () => share(); $('b-save').onclick = () => save();
  }
  $('f').addEventListener('submit', e => { e.preventDefault(); show(); });

  // ---------- 投稿用の画像（1080×1350） ----------
  function wrap(c, text, x, y, w, lh, max) {
    const out = []; let line = '';
    // 行頭に「、。」などが来ないようにする（禁則）
    for (const ch of text) { if (c.measureText(line + ch).width > w && line && !'、。，．」』）)ーぁぃぅぇぉっゃゅょ'.includes(ch)) { out.push(line); line = ch; if (max && out.length >= max) break; } else line += ch; }
    if (line && (!max || out.length < max)) out.push(line);
    if (max && out.length === max && text.length > out.join('').length) out[max - 1] = out[max - 1].slice(0, -1) + '…';
    out.forEach((l, i) => c.fillText(l, x, y + i * lh)); return out.length;
  }
  async function draw() {
    const { L, nm } = last; const cv = $('cv'), c = cv.getContext('2d'), W = 1080, H = 1350;
    try { await document.fonts.load('700 40px "Shippori Mincho"'); await document.fonts.load('500 30px "Shippori Mincho"'); } catch (e) {}
    const F = (w, s) => w + ' ' + s + 'px "Shippori Mincho","Hiragino Mincho ProN","Yu Mincho",serif';
    c.fillStyle = '#2a211b'; c.fillRect(0, 0, W, H);
    c.fillStyle = L.early ? '#eef0f2' : '#f6eedd'; c.fillRect(30, 30, W - 60, H - 60);
    c.strokeStyle = '#b49c78'; c.lineWidth = 3; c.strokeRect(44, 44, W - 88, H - 88);
    c.fillStyle = 'rgba(120,90,50,.06)'; for (let y = 50; y < H - 50; y += 9) for (let x = 50 + (y % 18); x < W - 50; x += 18) c.fillRect(x, y, 2, 2);
    // はんこ
    c.save(); c.translate(925, 150); c.rotate(0.14); c.strokeStyle = '#b03a24'; c.lineWidth = 6; c.strokeRect(-70, -70, 140, 140);
    c.font = '64px serif'; c.textAlign = 'center'; c.textBaseline = 'middle'; c.fillStyle = '#000'; c.fillText(L.jicon, 0, -14);
    c.fillStyle = '#b03a24'; c.font = F('800', 24); c.fillText(L.era.replace('時代', ''), 0, 44); c.restore();
    c.textBaseline = 'alphabetic'; c.textAlign = 'left';
    if (L.famous) { c.fillStyle = '#b03a24'; c.fillRect(30, 30, W - 60, 46); c.fillStyle = '#fff'; c.font = F('800', 28); c.textAlign = 'center'; c.fillText('★ ごくまれな前世 ★', W / 2, 63); c.textAlign = 'left'; }
    c.fillStyle = '#2a211b'; c.fillRect(80, 98, c.measureText ? 170 : 170, 40); c.fillStyle = '#f3e6cc'; c.font = F('700', 26); c.fillText(L.era, 96, 127);
    c.fillStyle = '#7d6b57'; c.font = F('500', 26); c.fillText('あ な た の 前 世', 80, 185);
    c.fillStyle = '#2b2118'; c.font = F('800', L.name.length > 9 ? 58 : 72); wrap(c, L.name, 80, 262, 760, 76, 1);
    c.fillStyle = '#b03a24'; c.font = F('800', 32); let y = 312 + (wrap(c, L.alias, 80, 312, 900, 42, 2) - 1) * 42;
    c.fillStyle = '#7d6b57'; c.font = F('500', 26); c.fillText(L.chips.join('　／　'), 80, y + 50);
    c.fillStyle = '#8a7a66'; c.font = F('500', 26); y += 100; y += wrap(c, L.mood, 80, y, 920, 36, 2) * 36;
    c.fillStyle = '#2b2118'; c.font = F('800', 34); y += 18; y += wrap(c, L.summary, 80, y, 920, 46, 3) * 46;
    c.strokeStyle = '#dccdb0'; c.lineWidth = 2; c.beginPath(); c.moveTo(80, y); c.lineTo(W - 80, y); c.stroke(); y += 46;
    for (const x of rows(L)) {
      if (y > 1110) break;
      c.fillStyle = '#7d6b57'; c.font = F('500', 24); c.fillText(ys(x.y), 80, y);
      c.font = '28px serif'; c.fillStyle = '#000'; c.fillText(Z.icon(x.t, x.kind), 190, y + 2);
      c.fillStyle = x.kind === 'hist' ? '#4c3f86' : '#2b2118'; c.font = F(x.kind === 'death' ? '800' : '500', 28);
      const n = wrap(c, clean(x.t), 236, y, 764, 36, 2); y += n * 36 + 14;
    }
    if (L.last && y < 1160) { c.textAlign = 'center'; c.fillStyle = '#7d6b57'; c.font = F('500', 22); c.fillText('最後の言葉', W / 2, y + 14); c.fillStyle = '#2b2118'; c.font = F('800', 38); c.fillText('「' + L.last + '」', W / 2, y + 62); c.textAlign = 'left'; y += 80; }
    c.textAlign = 'center'; c.fillStyle = '#7d6b57'; c.font = F('500', 26); wrap(c, L.after, W / 2, Math.min(y + 40, 1205), 900, 34, 2);
    c.fillStyle = '#2a211b'; c.font = F('800', 24); c.textAlign = 'left'; c.fillText('#前世ねんぴょう　「自分」', 80, H - 70);
    c.textAlign = 'right'; c.fillText(URL_GAME.replace('https://', ''), W - 80, H - 70); c.textAlign = 'left';
    return new Promise(res => cv.toBlob(res, 'image/png'));
  }
  const shareText = () => last.L.share + '\n#前世ねんぴょう\n' + URL_GAME;
  async function share() {
    const blob = await draw(); const file = new File([blob], 'zense.png', { type: 'image/png' });
    try { if (navigator.canShare && navigator.canShare({ files: [file] })) { await navigator.share({ files: [file], text: shareText() }); return; } } catch (e) { if (e && e.name === 'AbortError') return; }
    download(blob); window.open('https://twitter.com/intent/tweet?text=' + encodeURIComponent(shareText()), '_blank');
  }
  async function save() { download(await draw()); }
  function download(b) { const a = document.createElement('a'); a.href = URL.createObjectURL(b); a.download = 'zense.png'; document.body.appendChild(a); a.click(); setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 500); }
})();
