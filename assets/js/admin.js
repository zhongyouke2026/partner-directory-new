/* =====================================================================
 *  중여커 관리자 · 엔진
 * ===================================================================*/
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const S = window.ADMIN_SCHEMA, NAV = window.ADMIN_NAV;
  const ic = (n, s) => window.ZYKIcon ? window.ZYKIcon(n, s || 18) : '';
  const sb = ZYK.sb;

  let current = 'dashboard';
  let cache = {};          // table -> rows
  let refCache = {};       // table -> rows (참조용)
  let editing = null;      // { key, row }

  /* 관리자 전용 영상 URL 파서 (프론트 common.js 없이 동작) */
  function parseVideo(u) {
    u = String(u || '').trim(); let m;
    m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (m) return { label: 'YouTube', icon: 'youtube', embed: true, thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg` };
    if (/instagram\.com\/(?:[A-Za-z0-9._]+\/)?(reels?|p|tv)\//.test(u)) return { label: 'Instagram', icon: 'instagram', embed: true, thumb: null };
    if (/tiktok\.com/.test(u)) return { label: 'TikTok', icon: 'music', embed: !/(vm|vt)\.tiktok/.test(u), thumb: null };
    if (/bilibili\.com|b23\.tv/.test(u)) return { label: '빌리빌리', icon: 'video', embed: true, thumb: null };
    if (/vimeo\.com/.test(u)) return { label: 'Vimeo', icon: 'video', embed: true, thumb: null };
    if (/kuaishou\.com/.test(u)) return { label: '콰이쇼우', icon: 'music', embed: false, thumb: null };
    if (/douyin\.com/.test(u)) return { label: '더우인', icon: 'music', embed: false, thumb: null };
    if (/xiaohongshu\.com|xhslink\.com/.test(u)) return { label: '샤오홍슈', icon: 'book', embed: false, thumb: null };
    if (/\.(mp4|webm|mov)(\?|$)/i.test(u)) return { label: '직접 업로드 영상', icon: 'video', embed: true, thumb: null };
    return { label: '인식되지 않는 링크', icon: 'link', embed: false, thumb: null };
  }

  /* ---------------- 토스트 ---------------- */
  function toast(msg, isErr) {
    const t = $('#aToast');
    t.textContent = msg;
    t.classList.toggle('err', !!isErr);
    t.classList.add('on');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('on'), 2600);
  }

  /* ---------------- 인증 ---------------- */
  /* 데모 모드 : Supabase 미연결 시 화면만 둘러보기 (저장 불가) */
  const DEMO_MODE = !ZYK.configured || !sb;

  async function boot() {
    if (DEMO_MODE) {
      showAdmin({ email: '데모 모드 (읽기 전용)' });
      return;
    }
    const { data } = await sb.auth.getSession();
    if (data && data.session) showAdmin(data.session.user);
    else showLogin();

    sb.auth.onAuthStateChange((ev, sess) => {
      if (ev === 'SIGNED_OUT') location.reload();
    });
  }

  function showLogin() {
    $('#loginWrap').style.display = '';
    $('#adminWrap').style.display = 'none';
    $('#loginForm').addEventListener('submit', async e => {
      e.preventDefault();
      $('#loginMsg').textContent = '';
      const { data, error } = await sb.auth.signInWithPassword({
        email: $('#loginEmail').value.trim(), password: $('#loginPw').value
      });
      if (error) { $('#loginMsg').textContent = '로그인 실패: ' + error.message; return; }
      showAdmin(data.user);
    });
  }

  async function showAdmin(user) {
    $('#loginWrap').style.display = 'none';
    $('#adminWrap').style.display = '';
    $('#whoAmI').textContent = user.email || '';
    if (DEMO_MODE) {
      $('#logoutBtn').style.display = 'none';
      document.body.classList.add('demo-mode');
    }
    $('#logoutBtn').addEventListener('click', async () => { await sb.auth.signOut(); location.reload(); });
    $('#sideToggle').addEventListener('click', () => $('#side').classList.toggle('open'));
    $('#modalX').addEventListener('click', closeModal);
    $('#modalCancel').addEventListener('click', closeModal);
    $('#modalSave').addEventListener('click', saveModal);
    renderNav();
    window.addEventListener('hashchange', route);
    route();
  }

  /* ---------------- 사이드 네비 ---------------- */
  function renderNav() {
    $('#sideNav').innerHTML = NAV.map(g => `
      <h5>${esc(g.title)}</h5>
      ${g.items.map(k => {
      const d = k === 'dashboard' ? { icon: 'chart', label: '대시보드' } : S[k];
      return `<a href="#${k}" data-k="${k}"><i>${ic(d.icon)}</i>${esc(d.label)}</a>`;
    }).join('')}`).join('');
  }

  function demoBanner() {
    return `<div class="alert warn"><b>데모 모드입니다.</b> Supabase 연결 전이라 예시 데이터가 보이며 저장·삭제는 되지 않습니다.
      <code>assets/js/config.js</code> 에 <code>SUPABASE_URL</code> / <code>SUPABASE_ANON_KEY</code> 를 입력하면 실제 데이터로 전환됩니다.</div>`;
  }

  function route() {
    const k = (location.hash || '#dashboard').slice(1);
    current = (k === 'dashboard' || S[k]) ? k : 'dashboard';
    $$('#sideNav a').forEach(a => a.classList.toggle('on', a.dataset.k === current));
    $('#side').classList.remove('open');
    $('#pageH').textContent = current === 'dashboard' ? '대시보드' : S[current].label;
    if (current === 'dashboard') renderDashboard();
    else if (S[current].single) renderSingle(current);
    else renderList(current);
  }

  /* ---------------- 데이터 ---------------- */
  function demoBlock() {
    toast('데모 모드에서는 저장되지 않습니다. Supabase 연결 후 사용하세요.', true);
    return true;
  }

  async function load(table, opts) {
    opts = opts || {};
    if (DEMO_MODE) {
      cache[table] = await ZYK.selectAll(table, { activeOnly: false, orderBy: opts.orderBy || 'sort', asc: opts.asc });
      return cache[table];
    }
    let q = sb.from(table).select('*');
    q = q.order(opts.orderBy || 'sort', { ascending: opts.asc !== false });
    const { data, error } = await q;
    if (error) { toast(table + ' 조회 실패: ' + error.message, true); return []; }
    cache[table] = data || [];
    return cache[table];
  }
  async function loadRef(table) {
    if (refCache[table]) return refCache[table];
    if (DEMO_MODE) { refCache[table] = await ZYK.selectAll(table, { activeOnly: false }); return refCache[table]; }
    const { data } = await sb.from(table).select('*').order('sort', { ascending: true });
    refCache[table] = data || [];
    return refCache[table];
  }
  function refLabel(table, id) {
    const rows = refCache[table] || [];
    const r = rows.find(x => x.id === id);
    return r ? (r.name || r.title || r.label || '') : '';
  }

  /* ---------------- 대시보드 ---------------- */
  async function renderDashboard() {
    $('#content').innerHTML = `${DEMO_MODE ? demoBanner() : ''}<div class="stats" id="stats"></div>
      <div class="card"><h3>빠른 작업</h3>
        <div style="display:flex;gap:8px;flex-wrap:wrap">
          <a class="btn primary" href="#partners">${ic('store',16)}제휴업체 추가</a>
          <a class="btn" href="#media">${ic('video',16)}홍보 영상 추가</a>
          <a class="btn" href="#banners">${ic('image',16)}배너 등록</a>
          <a class="btn" href="#ads">${ic('megaphone',16)}광고 등록</a>
          <a class="btn" href="#settings">${ic('settings',16)}사이트 설정</a>
        </div>
      </div>
      <div class="card"><h3>등록 상태 점검</h3><div class="desc">아래 항목이 비어 있으면 화면에서 빈 칸으로 보입니다.</div><div id="health"></div></div>
      <div class="card"><h3>최근 등록된 제휴업체</h3><div id="recent"></div></div>
      <div class="card"><h3>데이터 백업 · 복원</h3>
        <div class="desc">정기적으로 백업해 두면 실수로 지웠을 때 되돌릴 수 있습니다.</div>
        <div style="display:flex;gap:8px;flex-wrap:wrap;align-items:center">
          <button class="btn" id="backupAll">${ic('download', 16)}전체 백업 내려받기</button>
          <label class="btn" style="cursor:pointer">${ic('upload', 16)}백업 파일로 복원
            <input type="file" accept="application/json" id="restoreFile" hidden></label>
        </div>
      </div>`;

    const tables = ['partners', 'partner_media', 'banners', 'ads', 'notices', 'nav_categories'];
    const counts = {};
    await Promise.all(tables.map(async t => {
      if (DEMO_MODE) { counts[t] = (ZYK.DEMO[t] || []).length; return; }
      const { count } = await sb.from(t).select('*', { count: 'exact', head: true });
      counts[t] = count || 0;
    }));
    $('#stats').innerHTML = `
      <div class="stat"><b>${counts.partners}</b><span>제휴업체</span></div>
      <div class="stat"><b>${counts.partner_media}</b><span>홍보 영상</span></div>
      <div class="stat"><b>${counts.banners}</b><span>배너</span></div>
      <div class="stat"><b>${counts.ads}</b><span>광고</span></div>
      <div class="stat"><b>${counts.nav_categories}</b><span>업종 분류</span></div>
      <div class="stat"><b>${counts.notices}</b><span>공지</span></div>`;

    const data = DEMO_MODE
      ? await ZYK.selectAll('partners', { activeOnly: false, orderBy: 'created_at', asc: false, limit: 5 })
      : (await sb.from('partners').select('*').order('created_at', { ascending: false }).limit(5)).data;
    $('#recent').innerHTML = (data && data.length) ? `<div class="tbl-wrap"><table class="tbl"><tbody>${data.map(p => `
      <tr><td style="width:60px">${p.thumbnail_url ? `<img class="td-thumb" src="${esc(p.thumbnail_url)}">` : '<div class="td-thumb"></div>'}</td>
      <td><b>${esc(p.name)}</b><div style="font-size:12px;color:#7a8592">${esc(p.region_label || '')} · ${esc(p.category_label || '')}</div></td>
      <td>${esc(p.benefit_summary || '')}</td>
      <td style="text-align:right"><button class="btn sm" data-edit-partner="${esc(p.id)}">수정</button></td></tr>`).join('')}
      </tbody></table></div>` : '<div class="empty-row">등록된 제휴업체가 없습니다.</div>';
    $$('[data-edit-partner]').forEach(b => b.addEventListener('click', () => { location.hash = '#partners'; }));
    $('#backupAll').addEventListener('click', exportAll);
    $('#restoreFile').addEventListener('change', e => { if (e.target.files[0]) importAll(e.target.files[0]); e.target.value = ''; });

    /* 상태 점검 */
    const all = DEMO_MODE ? (ZYK.DEMO.partners || []) : ((await sb.from('partners').select('*')).data || []);
    const medias = DEMO_MODE ? (ZYK.DEMO.partner_media || []) : ((await sb.from('partner_media').select('partner_id')).data || []);
    const withMedia = new Set(medias.map(m => m.partner_id));
    const checks = [
      ['대표 이미지 없음', all.filter(p => !p.thumbnail_url)],
      ['혜택 요약 없음', all.filter(p => !p.benefit_summary)],
      ['카드 소개 문구 없음', all.filter(p => !p.summary)],
      ['예약 방법 없음', all.filter(p => !p.booking_method && !p.booking_url)],
      ['홍보 영상 없음', all.filter(p => !withMedia.has(p.id))],
      ['노출 꺼짐', all.filter(p => p.is_active === false)]
    ];
    $('#health').innerHTML = `<div class="health">${checks.map(([label, arr]) => `
      <div class="hc ${arr.length ? 'warn' : 'ok'}">
        ${ic(arr.length ? 'info' : 'check', 17)}
        <div><b>${arr.length}</b><span>${esc(label)}</span></div>
        ${arr.length ? `<em>${esc(arr.slice(0, 3).map(x => x.name).join(', '))}${arr.length > 3 ? ` 외 ${arr.length - 3}곳` : ''}</em>` : ''}
      </div>`).join('')}</div>`;
  }

  /* ---------------- 단일 레코드 (사이트 설정) ---------------- */
  async function renderSingle(key) {
    const d = S[key];
    const data = DEMO_MODE ? await ZYK.selectOne(d.table, { id: 1 })
      : (await sb.from(d.table).select('*').eq('id', 1).maybeSingle()).data;
    const row = data || { id: 1 };
    $('#content').innerHTML =
      `${DEMO_MODE ? demoBanner() : ''}${d.desc ? `<div class="alert info">${esc(d.desc)}</div>` : ''}
       <form id="singleForm">
        ${d.groups.map(g => `<div class="card"><h3>${esc(g.title)}</h3>
          <div class="form-grid">${g.fields.map(f => fieldHtml(f, row[f.key])).join('')}</div></div>`).join('')}
        <div style="display:flex;gap:8px;position:sticky;bottom:0;background:var(--a-bg);padding:12px 0">
          <button type="submit" class="btn primary">저장하기</button>
          <a class="btn" href="../index.html" target="_blank">사이트에서 확인 ↗</a>
        </div>
      </form>`;
    bindFields($('#singleForm'));
    $('#singleForm').addEventListener('submit', async e => {
      e.preventDefault();
      if (DEMO_MODE) return demoBlock();
      const payload = collect(d.groups.flatMap(g => g.fields), $('#singleForm'));
      payload.id = 1; payload.updated_at = new Date().toISOString();
      const { error } = await sb.from(d.table).upsert(payload);
      if (error) toast('저장 실패: ' + error.message, true);
      else toast('저장했습니다');
    });
  }

  /* ---------------- 목록 ---------------- */
  const listState = {};
  async function renderList(key) {
    const d = S[key];
    listState[key] = listState[key] || { q: '', filters: {}, page: 1, sel: new Set() };
    listState[key].sel = listState[key].sel || new Set();
    const ls = listState[key];

    // 참조 테이블 미리 로드
    const refs = new Set();
    (d.columns || []).forEach(c => c.type === 'ref' && refs.add(c.ref));
    (d.groups || []).forEach(g => g.fields.forEach(f => f.type === 'ref' && refs.add(f.ref)));
    await Promise.all([...refs].map(loadRef));

    const rows = await load(d.table, { orderBy: d.orderBy || 'sort', asc: d.asc !== false });

    $('#content').innerHTML = `
      ${DEMO_MODE ? demoBanner() : ''}
      ${d.desc ? `<div class="alert info">${esc(d.desc)}</div>` : ''}
      <div class="card">
        <h3>${esc(d.label)} <span class="hd-btns">
          <button class="btn sm" id="exportBtn" title="이 목록을 JSON 파일로 저장">${ic('download', 15)}백업</button>
          <button class="btn primary" id="addBtn">${ic('plus', 15)}새로 추가</button>
        </span></h3>
        <div class="toolbar">
          <div class="tb-search">${ic('search', 16)}
            <input id="searchIn" placeholder="이름·URL 검색" value="${esc(ls.q)}"></div>
          ${(d.filters || []).map(f => `<select data-filter="${esc(f.key)}">
            ${f.options.map(o => `<option value="${esc(o[0])}" ${ls.filters[f.key] === o[0] ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}
          </select>`).join('')}
        </div>
        <div class="bulkbar hide" id="bulkBar">
          <b><span id="bulkN">0</span>개 선택됨</b>
          <button class="btn sm" data-bulk="show">노출 켜기</button>
          <button class="btn sm" data-bulk="hide">노출 끄기</button>
          <button class="btn sm danger" data-bulk="del">삭제</button>
          <button class="btn sm" data-bulk="clear">선택 해제</button>
        </div>
        <div class="tbl-wrap" id="tblWrap"></div>
        <div class="pager" id="pager"></div>
      </div>`;

    $('#addBtn').addEventListener('click', () => openModal(key, null));
    $('#exportBtn').addEventListener('click', () => exportJson(d.table, rows));
    $('#searchIn').addEventListener('input', e => { ls.q = e.target.value; ls.page = 1; drawTable(key, rows); });
    $$('[data-filter]').forEach(sel => sel.addEventListener('change', e => {
      ls.filters[sel.dataset.filter] = e.target.value; ls.page = 1; drawTable(key, rows);
    }));
    $$('[data-bulk]').forEach(b => b.addEventListener('click', () => bulk(key, b.dataset.bulk)));
    drawTable(key, rows);
  }

  function drawTable(key, rows) {
    const d = S[key], ls = listState[key];
    let list = rows.slice();
    Object.keys(ls.filters).forEach(k => { if (ls.filters[k]) list = list.filter(r => r[k] === ls.filters[k]); });
    if (ls.q) {
      const q = ls.q.toLowerCase();
      list = list.filter(r => (d.search || ['name', 'title', 'label']).some(k => String(r[k] || '').toLowerCase().includes(q)));
    }

    if (!list.length) { $('#tblWrap').innerHTML = '<div class="empty-row">데이터가 없습니다. [+ 새로 추가] 를 눌러 등록하세요.</div>'; return; }

    /* 계층 정렬: 부모 → 자식 순으로 묶기 */
    if (d.tree) {
      const byS = (a, b) => (a.sort || 0) - (b.sort || 0);
      const roots = list.filter(r => !r.parent_id).sort(byS);
      const out = [];
      roots.forEach(r => {
        out.push(r);
        list.filter(x => x.parent_id === r.id).sort(byS).forEach(c => { c.__child = true; out.push(c); });
      });
      list.filter(r => r.parent_id && !out.includes(r)).forEach(r => { r.__child = true; out.push(r); });
      list = out;
    }

    /* 페이지네이션 */
    const PER = 50;
    const total = list.length;
    const pages = Math.max(1, Math.ceil(total / PER));
    if (ls.page > pages) ls.page = 1;
    const paged = total > PER ? list.slice((ls.page - 1) * PER, ls.page * PER) : list;

    const cols = d.columns;
    const canPreview = d.table === 'partners';
    $('#tblWrap').innerHTML = `<table class="tbl">
      <thead><tr>
        <th class="ck"><input type="checkbox" id="ckAll"></th>
        ${cols.map(c => `<th>${esc(c.label)}</th>`).join('')}<th style="width:190px"></th></tr></thead>
      <tbody>${paged.map(r => `<tr data-id="${esc(r.id)}">
        <td class="ck"><input type="checkbox" class="row-ck" ${ls.sel.has(String(r.id)) ? 'checked' : ''}></td>
        ${cols.map(c => `<td>${cellHtml(c, r)}</td>`).join('')}
        <td><div class="td-actions">
          <button class="ibtn" data-act="up" title="위로">${ic('chevronDown', 15)}</button>
          <button class="ibtn" data-act="down" title="아래로">${ic('chevronDown', 15)}</button>
          ${canPreview ? `<a class="ibtn" href="../detail.html?id=${esc(r.id)}" target="_blank" title="실제 화면 보기">${ic('external', 15)}</a>` : ''}
          <button class="ibtn" data-act="copy" title="복제">${ic('copy', 15)}</button>
          <button class="btn sm" data-act="edit">수정</button>
          <button class="btn sm danger" data-act="del">삭제</button>
        </div></td></tr>`).join('')}</tbody></table>`;

    $('#pager').innerHTML = total > PER
      ? `<button class="btn sm" ${ls.page <= 1 ? 'disabled' : ''} data-pg="${ls.page - 1}">이전</button>
         <span>${ls.page} / ${pages} · 총 ${total.toLocaleString()}건</span>
         <button class="btn sm" ${ls.page >= pages ? 'disabled' : ''} data-pg="${ls.page + 1}">다음</button>`
      : `<span class="pg-total">총 ${total.toLocaleString()}건</span>`;
    $$('#pager [data-pg]').forEach(b => b.addEventListener('click', () => { ls.page = +b.dataset.pg; drawTable(key, rows); }));

    /* 선택 */
    const syncBulk = () => {
      const n = ls.sel.size;
      $('#bulkN').textContent = n;
      $('#bulkBar').classList.toggle('hide', !n);
    };
    $('#ckAll').addEventListener('change', e => {
      paged.forEach(r => e.target.checked ? ls.sel.add(String(r.id)) : ls.sel.delete(String(r.id)));
      $$('.row-ck').forEach(c => c.checked = e.target.checked);
      syncBulk();
    });
    $$('#tblWrap tr[data-id]').forEach(tr => {
      const ck = $('.row-ck', tr);
      ck.addEventListener('change', () => {
        ck.checked ? ls.sel.add(tr.dataset.id) : ls.sel.delete(tr.dataset.id);
        syncBulk();
      });
    });
    syncBulk();

    $$('#tblWrap tr[data-id]').forEach(tr => {
      const id = tr.dataset.id;
      const row = list.find(r => String(r.id) === id);
      $('[data-act=edit]', tr).addEventListener('click', () => openModal(key, row));
      $('[data-act=copy]', tr).addEventListener('click', () => {
        const c = JSON.parse(JSON.stringify(row));
        delete c.id; delete c.created_at; delete c.__child;
        if (c.slug) c.slug = '';
        if (c.name) c.name += ' (복사본)';
        else if (c.title) c.title += ' (복사본)';
        else if (c.label) c.label += ' (복사본)';
        openModal(key, null, c);
      });
      $('[data-act=up]', tr).addEventListener('click', () => move(key, list, row, -1));
      $('[data-act=down]', tr).addEventListener('click', () => move(key, list, row, 1));
      $('[data-act=del]', tr).addEventListener('click', async () => {
        if (DEMO_MODE) return demoBlock();
        const nm = row.name || row.title || row.label || '';
        if (!confirm(`"${nm}" 항목을 삭제할까요? 되돌릴 수 없습니다.`)) return;
        const { error } = await sb.from(d.table).delete().eq('id', id);
        if (error) return toast('삭제 실패: ' + error.message, true);
        toast('삭제했습니다'); refCache = {}; renderList(key);
      });
      const act = $('[data-toggle-active]', tr);
      act && act.addEventListener('click', async () => {
        if (DEMO_MODE) return demoBlock();
        const { error } = await sb.from(d.table).update({ is_active: !row.is_active }).eq('id', id);
        if (error) return toast('변경 실패: ' + error.message, true);
        toast(row.is_active ? '노출을 껐습니다' : '노출을 켰습니다'); renderList(key);
      });
      const sortIn = $('[data-sort-input]', tr);
      sortIn && sortIn.addEventListener('change', async () => {
        if (DEMO_MODE) return demoBlock();
        const { error } = await sb.from(d.table).update({ sort: Number(sortIn.value) || 0 }).eq('id', id);
        if (error) return toast('변경 실패: ' + error.message, true);
        toast('순서를 변경했습니다'); renderList(key);
      });
    });
  }

  /* 순서 위/아래 */
  async function move(key, list, row, dir) {
    if (DEMO_MODE) return demoBlock();
    const d = S[key];
    const sibs = list.filter(x => (x.parent_id || null) === (row.parent_id || null));
    const i = sibs.findIndex(x => x.id === row.id);
    const j = i + dir;
    if (i < 0 || j < 0 || j >= sibs.length) return;
    const a = sibs[i], b = sibs[j];
    const av = a.sort || 0, bv = b.sort || 0;
    const [na, nb] = av === bv ? [j, i] : [bv, av];
    const e1 = await sb.from(d.table).update({ sort: na }).eq('id', a.id);
    const e2 = await sb.from(d.table).update({ sort: nb }).eq('id', b.id);
    if (e1.error || e2.error) return toast('순서 변경 실패', true);
    toast('순서를 변경했습니다');
    renderList(key);
  }

  /* 일괄 처리 */
  async function bulk(key, action) {
    const ls = listState[key], d = S[key];
    if (action === 'clear') { ls.sel.clear(); renderList(key); return; }
    if (DEMO_MODE) return demoBlock();
    const ids = [...ls.sel];
    if (!ids.length) return;
    if (action === 'del' && !confirm(`선택한 ${ids.length}건을 삭제할까요? 되돌릴 수 없습니다.`)) return;
    let error;
    if (action === 'del') ({ error } = await sb.from(d.table).delete().in('id', ids));
    else ({ error } = await sb.from(d.table).update({ is_active: action === 'show' }).in('id', ids));
    if (error) return toast('처리 실패: ' + error.message, true);
    toast(`${ids.length}건을 처리했습니다`);
    ls.sel.clear();
    renderList(key);
  }

  /* JSON 백업 / 복원 */
  function download(name, text) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: 'application/json' }));
    a.download = name; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 1000);
  }
  function exportJson(table, rows) {
    download(`zyk-${table}-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(rows, null, 2));
    toast('백업 파일을 저장했습니다');
  }
  async function exportAll() {
    const tables = Object.values(S).map(x => x.table);
    const out = {};
    for (const t of [...new Set(tables)]) {
      out[t] = DEMO_MODE ? (ZYK.DEMO[t] || []) : ((await sb.from(t).select('*')).data || []);
    }
    download(`zyk-backup-${new Date().toISOString().slice(0, 10)}.json`, JSON.stringify(out, null, 2));
    toast('전체 백업을 저장했습니다');
  }
  async function importAll(file) {
    if (DEMO_MODE) return demoBlock();
    let data;
    try { data = JSON.parse(await file.text()); } catch (e) { return toast('JSON 파일을 읽을 수 없습니다', true); }
    const tables = Object.keys(data);
    if (!confirm(`${tables.length}개 테이블을 복원합니다.\n같은 id의 기존 데이터는 덮어씁니다. 계속할까요?`)) return;
    let ok = 0, fail = 0;
    for (const t of tables) {
      if (!Array.isArray(data[t]) || !data[t].length) continue;
      const { error } = await sb.from(t).upsert(data[t]);
      error ? fail++ : ok++;
    }
    toast(`복원 완료 · 성공 ${ok} / 실패 ${fail}`, fail > 0);
    refCache = {}; route();
  }

  function cellHtml(c, r) {
    const v = r[c.key];
    switch (c.type) {
      case 'thumb': return v ? `<img class="td-thumb" src="${esc(v)}">` : `<div class="td-thumb"></div>`;
      case 'main': return `<b>${r.__child ? '<span class="tree-i">└</span>' : ''}${esc(v || '(제목 없음)')}</b>${c.sub && r[c.sub] ? `<div style="font-size:11.5px;color:#8a95a1;max-width:280px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${esc(r[c.sub])}</div>` : ''}`;
      case 'badge': return v ? `<span class="badge on">Y</span>` : `<span class="badge off">–</span>`;
      case 'badge-text': return v ? `<span class="badge tag">${esc(v)}</span>` : '';
      case 'emoji': return `<span class="td-ico">${ic(v, 20)}</span>`;
      case 'ref': return esc(refLabel(c.ref, v));
      case 'date': return esc(String(v || '').slice(0, 10));
      case 'sort': return `<div class="sort-cell"><input type="number" data-sort-input value="${v == null ? 0 : v}"></div>`;
      case 'active': return `<button data-toggle-active class="badge ${v ? 'on' : 'off'}">${v ? '노출중' : '숨김'}</button>`;
      default: {
        const t = String(v == null ? '' : v);
        return `<span style="display:inline-block;max-width:260px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;vertical-align:middle">${esc(t)}</span>`;
      }
    }
  }

  /* ---------------- 필드 렌더 ---------------- */
  function fieldHtml(f, v) {
    const id = 'fld_' + f.key;
    const label = `<label for="${id}">${esc(f.label)}${f.required ? ' *' : ''}${f.hint ? `<span class="hint">${esc(f.hint)}</span>` : ''}</label>`;
    let input = '';
    switch (f.type) {
      case 'textarea':
        input = `<textarea id="${id}" data-k="${f.key}">${esc(v || '')}</textarea>`; break;
      case 'html':
        input = `<textarea id="${id}" class="big" data-k="${f.key}">${esc(v || '')}</textarea>`; break;
      case 'number':
        input = `<input type="number" id="${id}" data-k="${f.key}" data-type="number" value="${v == null ? '' : esc(v)}">`; break;
      case 'bool':
        input = `<label class="switch"><input type="checkbox" id="${id}" data-k="${f.key}" data-type="bool" ${v ? 'checked' : ''}> 사용</label>`; break;
      case 'select':
        input = `<select id="${id}" data-k="${f.key}">${f.options.map(o => `<option value="${esc(o[0])}" ${String(v) === String(o[0]) ? 'selected' : ''}>${esc(o[1])}</option>`).join('')}</select>`; break;
      case 'ref': {
        const rows = refCache[f.ref] || [];
        const nameOf = r => r.name || r.title || r.label || r.id;
        const roots = rows.filter(r => !r.parent_id);
        const hasTree = rows.some(r => r.parent_id);
        const opt = (r, indent) => `<option value="${esc(r.id)}" ${v === r.id ? 'selected' : ''}>${indent}${esc(nameOf(r))}</option>`;
        let body;
        if (hasTree) {
          body = roots.map(r => {
            const kids = rows.filter(x => x.parent_id === r.id);
            return opt(r, '') + kids.map(k => opt(k, '\u00A0\u00A0└ ')).join('');
          }).join('') + rows.filter(r => r.parent_id && !roots.some(x => x.id === r.parent_id)).map(r => opt(r, '')).join('');
        } else body = rows.map(r => opt(r, '')).join('');
        const af = f.autofill ? ` data-autofill="${f.autofill}" data-ref="${f.ref}" data-autofill-full="${f.autofillFull ? 1 : 0}"` : '';
        input = `<select id="${id}" data-k="${f.key}"${af}><option value="">— 선택 안 함 —</option>${body}</select>`; break;
      }
      case 'color':
        input = `<div class="color-row"><input type="color" data-color-for="${f.key}" value="${esc(v || '#4A92BD')}">
          <input type="text" id="${id}" data-k="${f.key}" value="${esc(v || '')}" placeholder="#4A92BD"></div>`; break;
      case 'iconpick': {
        const names = (window.ZYKIcon && window.ZYKIcon.names) || [];
        input = `<div class="icon-pick">
          <div class="icon-prev" data-icon-prev="${f.key}">${ic(v, 22)}</div>
          <input type="hidden" id="${id}" data-k="${f.key}" value="${esc(v || '')}">
          <div class="icon-grid" data-icon-grid="${f.key}">
            ${names.map(n => `<button type="button" class="ib ${n === v ? 'on' : ''}" data-n="${esc(n)}" title="${esc(n)}">${ic(n, 19)}</button>`).join('')}
          </div>
        </div>`; break;
      }
      case 'datetime': {
        const dv = v ? new Date(v).toISOString().slice(0, 16) : '';
        input = `<input type="datetime-local" id="${id}" data-k="${f.key}" data-type="datetime" value="${esc(dv)}">`; break;
      }
      case 'videourl':
        input = `<div class="vid-field">
          <input type="text" id="${id}" data-k="${f.key}" data-videourl value="${esc(v || '')}" placeholder="영상 URL을 붙여넣으세요">
          <div class="vid-prev" data-vid-prev></div>
        </div>`; break;
      case 'image':
        input = `<div class="img-field">
          <img class="img-prev" data-prev-for="${f.key}" ${v ? `src="${esc(v)}"` : ''}>
          <div class="img-ctl">
            <input type="text" id="${id}" data-k="${f.key}" value="${esc(v || '')}" placeholder="이미지 URL 직접 입력 또는 파일 업로드">
            <label class="drop" data-drop-for="${f.key}">
              ${ic('upload', 15)}<span>이미지를 끌어다 놓거나 클릭해서 선택</span>
              <input type="file" accept="image/*" data-upload-for="${f.key}" hidden>
            </label>
            <button type="button" class="btn sm" data-clear-for="${f.key}">지우기</button>
          </div></div>`; break;
      case 'images': {
        const arr = Array.isArray(v) ? v : (function () { try { return JSON.parse(v || '[]'); } catch (e) { return []; } })();
        input = `<div data-images-for="${f.key}">
          <div class="chip-list" data-imgs-list>${arr.map(u => imgChip(u)).join('')}</div>
          <div class="row" style="margin-top:8px;display:flex;gap:6px">
            <input type="text" data-imgs-url placeholder="이미지 URL 입력 후 추가" style="flex:1">
            <button type="button" class="btn sm" data-imgs-add>추가</button>
          </div>
          <label class="drop" data-imgs-drop>
            ${ic('upload', 15)}<span>여러 장을 끌어다 놓거나 클릭해서 선택</span>
            <input type="file" accept="image/*" multiple data-imgs-file hidden>
          </label>
          <input type="hidden" id="${id}" data-k="${f.key}" data-type="json" value='${esc(JSON.stringify(arr))}'>
        </div>`; break;
      }
      case 'tags': {
        const arr = Array.isArray(v) ? v : (function () { try { return JSON.parse(v || '[]'); } catch (e) { return []; } })();
        input = `<div data-tags-for="${f.key}">
          <div class="chip-list" data-tags-list>${arr.map(t => tagChip(t)).join('')}</div>
          <div class="row" style="margin-top:8px;display:flex;gap:6px">
            <input type="text" data-tags-input placeholder="태그 입력 후 Enter" style="flex:1">
            <button type="button" class="btn sm" data-tags-add>추가</button>
          </div>
          <input type="hidden" id="${id}" data-k="${f.key}" data-type="json" value='${esc(JSON.stringify(arr))}'>
        </div>`; break;
      }
      default:
        input = `<input type="${f.type === 'url' ? 'text' : 'text'}" id="${id}" data-k="${f.key}" value="${esc(v == null ? '' : v)}" ${f.required ? 'required' : ''}>`;
    }
    return `<div class="f ${f.full || ['textarea', 'html', 'images', 'tags', 'image'].includes(f.type) ? 'full' : ''}">${label}${input}</div>`;
  }

  const imgChip = u => `<span class="chip img" data-u="${esc(u)}">
    <button type="button" data-mv="-1" title="앞으로">‹</button>
    <img src="${esc(u)}" alt=""><button type="button" data-mv="1" title="뒤로">›</button>
    <button type="button" data-rm title="삭제">✕</button></span>`;
  const tagChip = t => `<span class="chip" data-t="${esc(t)}">${esc(t)}<button type="button" data-rm>✕</button></span>`;

  /* ---------------- 필드 이벤트 바인딩 ---------------- */
  function bindFields(root) {
    // 컬러 동기화
    $$('[data-color-for]', root).forEach(c => {
      const txt = $(`[data-k="${c.dataset.colorFor}"]`, root);
      c.addEventListener('input', () => { txt.value = c.value; });
      txt.addEventListener('input', () => { if (/^#[0-9a-f]{6}$/i.test(txt.value)) c.value = txt.value; });
    });

    // 단일 이미지 업로드
    $$('[data-upload-for]', root).forEach(inp => {
      inp.addEventListener('change', async () => {
        const file = inp.files[0]; if (!file) return;
        const k = inp.dataset.uploadFor;
        toast('업로드 중...');
        try {
          const url = await ZYK.uploadImage(file, k);
          $(`[data-k="${k}"]`, root).value = url;
          const prev = $(`[data-prev-for="${k}"]`, root); prev.src = url;
          toast('업로드 완료');
        } catch (e) { toast('업로드 실패: ' + e.message, true); }
        inp.value = '';
      });
    });
    $$('[data-clear-for]', root).forEach(b => b.addEventListener('click', () => {
      const k = b.dataset.clearFor;
      $(`[data-k="${k}"]`, root).value = '';
      const p = $(`[data-prev-for="${k}"]`, root); p.removeAttribute('src');
    }));
    $$('.img-ctl input[type=text]', root).forEach(t => t.addEventListener('input', () => {
      const p = $(`[data-prev-for="${t.dataset.k}"]`, root);
      if (p) { if (t.value) p.src = t.value; else p.removeAttribute('src'); }
    }));

    // 갤러리
    $$('[data-images-for]', root).forEach(box => {
      const hidden = $('input[type=hidden]', box);
      const list = $('[data-imgs-list]', box);
      const sync = () => { hidden.value = JSON.stringify($$('[data-u]', list).map(c => c.dataset.u)); };
      const add = u => { if (!u) return; list.insertAdjacentHTML('beforeend', imgChip(u)); bindRm(); sync(); };
      const bindRm = () => {
        $$('[data-rm]', list).forEach(b => b.onclick = () => { b.parentElement.remove(); sync(); });
        $$('[data-mv]', list).forEach(b => b.onclick = () => {
          const el = b.parentElement, d2 = +b.dataset.mv;
          const sib = d2 < 0 ? el.previousElementSibling : el.nextElementSibling;
          if (!sib) return;
          d2 < 0 ? list.insertBefore(el, sib) : list.insertBefore(sib, el);
          sync();
        });
      };
      bindRm();
      $('[data-imgs-add]', box).addEventListener('click', () => { add($('[data-imgs-url]', box).value.trim()); $('[data-imgs-url]', box).value = ''; });
      const upMany = async files => {
        toast('업로드 중...');
        for (const f of files) {
          try { add(await ZYK.uploadImage(f, 'gallery')); } catch (err) { toast('업로드 실패: ' + err.message, true); }
        }
        toast('업로드 완료');
      };
      $('[data-imgs-file]', box).addEventListener('change', async e => { await upMany(e.target.files); e.target.value = ''; });
      const dz = $('[data-imgs-drop]', box);
      if (dz) {
        ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
        ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
        dz.addEventListener('drop', e => upMany(e.dataTransfer.files));
      }
    });

    // 단일 이미지 드래그앤드롭
    $$('[data-drop-for]', root).forEach(dz => {
      const k = dz.dataset.dropFor;
      ['dragenter', 'dragover'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.add('over'); }));
      ['dragleave', 'drop'].forEach(ev => dz.addEventListener(ev, e => { e.preventDefault(); dz.classList.remove('over'); }));
      dz.addEventListener('drop', async e => {
        const file = e.dataTransfer.files[0]; if (!file) return;
        toast('업로드 중...');
        try {
          const url = await ZYK.uploadImage(file, k);
          $(`[data-k="${k}"]`, root).value = url;
          $(`[data-prev-for="${k}"]`, root).src = url;
          toast('업로드 완료');
        } catch (err) { toast('업로드 실패: ' + err.message, true); }
      });
    });

    // 영상 URL 미리보기
    $$('[data-videourl]', root).forEach(inp => {
      const box = inp.parentElement.querySelector('[data-vid-prev]');
      const draw = () => {
        const u = inp.value.trim();
        if (!u) { box.innerHTML = '<span class="vp-empty">URL을 입력하면 여기에 미리보기가 나옵니다</span>'; return; }
        const info = window.ZYKUI ? window.ZYKUI.parseMedia(u) : null;
        const m = info || parseVideo(u);
        box.innerHTML = `<div class="vp">
          ${m.thumb ? `<img src="${esc(m.thumb)}" alt="">` : `<div class="vp-ph">${ic(m.icon || 'video', 26)}</div>`}
          <div class="vp-t"><b>${esc(m.label)}</b><span>${m.embed ? '사이트 안에서 바로 재생됩니다' : '새 창으로 열립니다 — 썸네일을 직접 등록하면 보기 좋습니다'}</span></div>
        </div>`;
      };
      inp.addEventListener('input', draw);
      inp.addEventListener('paste', () => setTimeout(draw, 30));
      draw();
    });

    // 참조 선택 시 표시명 자동 채움
    $$('[data-autofill]', root).forEach(sel => {
      const target = sel.dataset.autofill;
      const refT = sel.dataset.ref;
      const full = sel.dataset.autofillFull === '1';
      sel.addEventListener('change', () => {
        const el = $(`[data-k="${target}"]`, root); if (!el) return;
        const rows = refCache[refT] || [];
        const r = rows.find(x => String(x.id) === sel.value);
        if (!r) return;
        let label = r.name || r.title || r.label || '';
        if (full && r.parent_id) {
          const par = rows.find(x => x.id === r.parent_id);
          if (par) label = (par.name || '') + ' ' + label;
        }
        el.value = label;
        el.classList.add('auto-filled');
        setTimeout(() => el.classList.remove('auto-filled'), 900);
      });
    });

    // 아이콘 선택
    $$('[data-icon-grid]', root).forEach(grid => {
      const k = grid.dataset.iconGrid;
      const hidden = $(`[data-k="${k}"]`, root);
      const prev = $(`[data-icon-prev="${k}"]`, root);
      $$('.ib', grid).forEach(b => b.addEventListener('click', () => {
        $$('.ib', grid).forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        hidden.value = b.dataset.n;
        prev.innerHTML = ic(b.dataset.n, 22);
      }));
    });

    // 태그
    $$('[data-tags-for]', root).forEach(box => {
      const hidden = $('input[type=hidden]', box);
      const list = $('[data-tags-list]', box);
      const inp = $('[data-tags-input]', box);
      const sync = () => { hidden.value = JSON.stringify($$('[data-t]', list).map(c => c.dataset.t)); };
      const bindRm = () => $$('[data-rm]', list).forEach(b => b.onclick = () => { b.parentElement.remove(); sync(); });
      const add = () => {
        const v = inp.value.trim(); if (!v) return;
        list.insertAdjacentHTML('beforeend', tagChip(v)); inp.value = ''; bindRm(); sync();
      };
      bindRm();
      $('[data-tags-add]', box).addEventListener('click', add);
      inp.addEventListener('keydown', e => { if (e.key === 'Enter') { e.preventDefault(); add(); } });
    });
  }

  /* ---------------- 값 수집 ---------------- */
  function collect(fields, root) {
    const out = {};
    fields.forEach(f => {
      const el = $(`[data-k="${f.key}"]`, root);
      if (!el) return;
      const t = el.dataset.type;
      if (t === 'bool') out[f.key] = el.checked;
      else if (t === 'number') out[f.key] = el.value === '' ? null : Number(el.value);
      else if (t === 'json') { try { out[f.key] = JSON.parse(el.value || '[]'); } catch (e) { out[f.key] = []; } }
      else if (t === 'datetime') out[f.key] = el.value ? new Date(el.value).toISOString() : null;
      else {
        const v = el.value.trim();
        out[f.key] = v === '' ? (f.type === 'ref' ? null : (f.keepEmpty === false ? null : v)) : v;
        if (f.type === 'ref' && v === '') out[f.key] = null;
      }
    });
    return out;
  }

  /* ---------------- 모달 ---------------- */
  function openModal(key, row) {
    const d = S[key];
    editing = { key, row };
    $('#modalTitle').textContent = (row ? '수정' : '새로 추가') + ' · ' + d.label;
    $('#modalFields').innerHTML = d.groups.map(g => `
      <div class="full" style="border-top:1px solid var(--a-line);margin-top:6px;padding-top:14px">
        <h4 style="font-size:13.5px;color:var(--a-brand-dark);margin-bottom:12px">${esc(g.title)}</h4>
        <div class="form-grid">${g.fields.map(f => fieldHtml(f, row ? row[f.key] : defaultOf(f))).join('')}</div>
      </div>`).join('');
    bindFields($('#modalFields'));
    $('#modal').classList.add('open');
    document.body.style.overflow = 'hidden';
    dirty = false;
    $('#modalFields').addEventListener('input', () => { dirty = true; }, { once: true });
    $('#modalFields').addEventListener('change', () => { dirty = true; }, { once: true });
    const first = $('#modalFields input[data-k]');
    if (first) setTimeout(() => first.focus(), 60);
  }
  let dirty = false;
  function defaultOf(f) {
    if (f.key === 'is_active') return true;
    if (f.type === 'bool') return false;
    if (f.type === 'number') return 0;
    if (f.type === 'select') return f.options[0][0];
    if (f.key === 'branch_count') return 1;
    return '';
  }
  function closeModal(force) {
    if (dirty && force !== true && !confirm('저장하지 않은 내용이 있습니다. 닫을까요?')) return;
    dirty = false;
    $('#modal').classList.remove('open');
    document.body.style.overflow = '';
    editing = null;
  }

  async function saveModal() {
    if (!editing) return;
    if (DEMO_MODE) return demoBlock();
    const { key, row } = editing;
    const d = S[key];
    const fields = d.groups.flatMap(g => g.fields);
    const payload = collect(fields, $('#modalFields'));

    // 필수값 확인
    $$('#modalFields .f').forEach(el => el.classList.remove('err'));
    const miss = fields.filter(f => f.required && !payload[f.key]);
    if (miss.length) {
      miss.forEach(f => {
        const el = $(`[data-k="${f.key}"]`, $('#modalFields'));
        if (el) el.closest('.f').classList.add('err');
      });
      const firstEl = $(`[data-k="${miss[0].key}"]`, $('#modalFields'));
      if (firstEl) { firstEl.scrollIntoView({ block: 'center', behavior: 'smooth' }); firstEl.focus(); }
      return toast('필수 항목을 입력하세요: ' + miss.map(m => m.label).join(', '), true);
    }

    // slug 자동 생성
    if ('slug' in payload && !payload.slug) {
      const base = String(payload.name || payload.title || payload.label || 'item')
        .toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      payload.slug = (base || 'item') + '-' + Date.now().toString(36).slice(-5);
    }
    if (d.table === 'partners') payload.updated_at = new Date().toISOString();

    let error;
    if (row) ({ error } = await sb.from(d.table).update(payload).eq('id', row.id));
    else ({ error } = await sb.from(d.table).insert(payload));

    if (error) return toast('저장 실패: ' + error.message, true);
    toast('저장했습니다');
    closeModal(true);
    refCache = {};
    renderList(key);
  }

  boot();
})();
