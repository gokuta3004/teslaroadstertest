(function () {
  'use strict';

  /* ---------- 1. Trạng thái MOD (lưu vào localStorage) ---------- */
  var MOD = { god: 0, nc: 0, inf: 0, time: 0, aw: 0 };
  try { Object.assign(MOD, JSON.parse(localStorage.getItem('hrr3d_mod') || '{}')); } catch (e) {}
  window.MOD = MOD; // code đã vá trong update() đọc biến này

  /* ---------- 2. Tự thắng ---------- */
  window.autoWin = function () {
    if (state !== 'play') return;
    P.s = Math.max(P.s, 10000);
    end(true);
  };

  /* ---------- 3. Vá hàm của game ---------- */
  // 3a. update(): vá 2 chỗ giới hạn (kẹp ngã tư + kẹp mép đường) để No clip hoạt động
  var src = update.toString(), patched = 0;
  var A1 = 'if(a!=xq[0]||b!=xq[1]){P.x=cx(s0)';
  var A2 = 'else if(!xq&&(lat<-44||lat>44)){';
  if (src.indexOf(A1) >= 0) { src = src.replace(A1, 'if(!MOD.nc&&(a!=xq[0]||b!=xq[1])){P.x=cx(s0)'); patched++; }
  if (src.indexOf(A2) >= 0) { src = src.replace(A2, 'else if(!MOD.nc&&!xq&&(lat<-44||lat>44)){'); patched++; }
  var baseUpdate = update;
  if (patched === 2) {
    try { baseUpdate = (0, eval)('(' + src + ')'); } catch (e) { console.warn('[MOD] Không vá được update():', e); }
  } else {
    console.warn('[MOD] Không tìm thấy đoạn cần vá trong update() — No clip có thể không xuyên được mép đường/ngã tư.');
  }

  // 3b. Bọc update(): năng lượng vô hạn, bất tử/no clip (không bị CSGT), dừng đồng hồ, tự thắng
  update = function (dt) {
    if (MOD.nc) { en.f = 100; }
    if (MOD.inf) { en.b = en.f = en.w = en.l = 100; }
    if ((MOD.god || MOD.nc) && P.pol) { P.pol = 0; P.polCd = 60; relCop(); }
    if (MOD.time && simT + dt >= TL - 1) simT = TL - 1 - dt; // sau simT+=dt thì còn đúng 1 giây
    if (MOD.aw && simT > 1.5) { autoWin(); return; }
    return baseUpdate(dt);
  };

  // 3c. Bọc hitCheck(): bất tử / no clip => không va chạm gì cả
  var baseHit = hitCheck;
  hitCheck = function (lat) { if (MOD.god || MOD.nc) return; return baseHit(lat); };

  // 3d. Bọc viol(): bất tử => không bị CSGT gọi dừng/phạt
  var baseViol = viol;
  viol = function (why) { if (MOD.god) return; return baseViol(why); };

  /* ---------- 4. Giao diện MOD (nút kéo thả được) ---------- */
  var st = document.createElement('style');
  st.textContent =
    '#modb{position:fixed;right:6px;top:42%;touch-action:none;user-select:none;-webkit-user-select:none;z-index:9999;padding:8px 10px;font:bold 12px "Courier New",monospace;background:#9945ff;color:#fff;border:1px solid #fff;border-radius:8px;opacity:.85}' +
    '#modp{position:fixed;right:6px;top:calc(42% + 38px);z-index:9999;display:none;width:220px;padding:10px;background:rgba(10,10,25,.94);color:#fff;border:1px solid #9945ff;border-radius:10px;font:12px "Courier New",monospace}' +
    '#modp label{display:flex;justify-content:space-between;align-items:center;margin:7px 0}' +
    '#modp input{width:20px;height:20px}' +
    '#modp button{width:100%;margin-top:8px;padding:10px;font:bold 13px "Courier New",monospace;background:#fc0;color:#000;border:0;border-radius:8px}';
  document.head.appendChild(st);

  var b = document.createElement('button'); b.id = 'modb'; b.textContent = 'MOD';
  var p = document.createElement('div'); p.id = 'modp';
  var items = [
    ['god', '🛡 Bất tử (không va chạm, không bị CSGT)'],
    ['nc', '👻 No clip (xuyên tường, rào, xe cộ, ra ngoài đường)'],
    ['inf', '⚡ Năng lượng vô hạn'],
    ['time', '⏱ Không bị hết giờ'],
    ['aw', '🏆 Tự thắng khi vào game']
  ];
  p.innerHTML = '<b style="color:#0ff">BẢN MOD</b>' +
    items.map(function (i) { return '<label>' + i[1] + '<input type="checkbox" data-m="' + i[0] + '"' + (MOD[i[0]] ? ' checked' : '') + '></label>'; }).join('') +
    '<button id="modw">🏆 AUTO WIN NGAY</button>';
  document.body.appendChild(b); document.body.appendChild(p);

  // Không cho sự kiện của nút/bảng lọt xuống điều khiển game
  ['touchstart', 'touchend', 'mousedown', 'pointerdown', 'click'].forEach(function (t) {
    b.addEventListener(t, function (e) { e.stopPropagation(); });
    p.addEventListener(t, function (e) { e.stopPropagation(); });
  });

  function clampN(v, a, c) { return Math.max(a, Math.min(c, v)); }
  function place() { // đặt bảng ngay dưới nút (hoặc phía trên nếu sát đáy)
    var r = b.getBoundingClientRect(), pw = p.offsetWidth || 220, ph = p.offsetHeight || 200;
    p.style.right = 'auto';
    p.style.left = clampN(r.right - pw, 4, innerWidth - pw - 4) + 'px';
    var t = r.bottom + 6; if (t + ph > innerHeight - 4) t = Math.max(4, r.top - ph - 6);
    p.style.top = t + 'px';
  }
  function setPos(x, y) {
    x = clampN(x, 0, innerWidth - b.offsetWidth); y = clampN(y, 0, innerHeight - b.offsetHeight);
    b.style.right = 'auto'; b.style.left = x + 'px'; b.style.top = y + 'px';
  }
  try { var sp = JSON.parse(localStorage.getItem('hrr3d_modpos') || 'null'); if (sp) setPos(sp[0], sp[1]); } catch (e) {}

  var dr = null; // kéo thả
  b.addEventListener('pointerdown', function (e) {
    var r = b.getBoundingClientRect();
    dr = { ox: e.clientX - r.left, oy: e.clientY - r.top, sx: e.clientX, sy: e.clientY, mv: false };
    try { b.setPointerCapture(e.pointerId); } catch (x) {}
  });
  b.addEventListener('pointermove', function (e) {
    if (!dr) return;
    if (!dr.mv && Math.hypot(e.clientX - dr.sx, e.clientY - dr.sy) > 6) dr.mv = true;
    if (dr.mv) { setPos(e.clientX - dr.ox, e.clientY - dr.oy); if (p.style.display === 'block') place(); }
  });
  b.addEventListener('pointerup', function () {
    if (!dr) return;
    var mv = dr.mv; dr = null;
    if (mv) { var r = b.getBoundingClientRect(); try { localStorage.setItem('hrr3d_modpos', JSON.stringify([r.left, r.top])); } catch (x) {} }
    else if (p.style.display === 'block') p.style.display = 'none';
    else { p.style.display = 'block'; place(); }
  });
  b.addEventListener('pointercancel', function () { dr = null; });
  addEventListener('resize', function () {
    var r = b.getBoundingClientRect(); setPos(r.left, r.top);
    if (p.style.display === 'block') place();
  });

  Array.prototype.forEach.call(p.querySelectorAll('input'), function (e) {
    e.onchange = function () {
      MOD[e.dataset.m] = e.checked ? 1 : 0;
      try { localStorage.setItem('hrr3d_mod', JSON.stringify(MOD)); } catch (x) {}
    };
  });
  p.querySelector('#modw').onclick = function () { p.style.display = 'none'; autoWin(); };
})();
