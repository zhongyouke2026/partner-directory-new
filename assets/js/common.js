/* =====================================================================
 *  중여커 · 공통 UI
 *  헤더 / 메가메뉴 / 2뎁스 서브내비 / 드로어 / 광고 / 팝업 / 푸터 / 인터랙션
 * ===================================================================*/
(function () {
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const esc = (s) => String(s == null ? '' : s).replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[m]));
  const qs = new URLSearchParams(location.search);
  const I = (n, s, m) => window.ZYKIcon ? window.ZYKIcon(n, s, m) : '';

  const state = { settings: null, cats: [], items: [], regions: [], quick: [], keywords: [], footer: [], menus: [], activeCat: '' };
  const menuAt = pos => state.menus.filter(m => m.position === pos);

  /* ================= 유틸 ================= */
  function toast(msg) {
    let t = $('#zykToast');
    if (!t) { t = document.createElement('div'); t.id = 'zykToast'; t.className = 'toast'; document.body.appendChild(t); }
    t.textContent = msg; t.classList.add('on');
    clearTimeout(t._tm); t._tm = setTimeout(() => t.classList.remove('on'), 2000);
  }

  function favGet() { try { return JSON.parse(localStorage.getItem('zyk_fav') || '[]'); } catch (e) { return []; } }
  function favToggle(id) {
    const list = favGet(); const i = list.indexOf(id);
    if (i > -1) list.splice(i, 1); else list.push(id);
    localStorage.setItem('zyk_fav', JSON.stringify(list));
    updateFavCount();
    return i === -1;
  }
  function updateFavCount() {
    const n = favGet().length;
    $$('.js-fav-count').forEach(el => { el.textContent = n; el.style.display = n ? '' : 'none'; });
  }

  /* 최근 본 업체 */
  function recentGet() { try { return JSON.parse(localStorage.getItem('zyk_recent') || '[]'); } catch (e) { return []; } }
  function recentAdd(id) {
    const l = recentGet().filter(x => x !== id); l.unshift(id);
    localStorage.setItem('zyk_recent', JSON.stringify(l.slice(0, 12)));
  }

  /* ================= 영상 URL 파서 ================= */
  function parseMedia(url, forced) {
    const u = String(url || '').trim();
    const R = o => Object.assign({ platform: 'link', embed: null, file: null, thumb: null, label: '링크', icon: 'link', url: u }, o);
    let m;

    /* 관리자가 플랫폼을 직접 지정한 경우 우선 적용 */
    if (forced && forced !== 'auto') {
      if (forced === 'video') return R({ platform: 'video', file: u, label: '영상', icon: 'video' });
      if (forced === 'douyin') return R({ platform: 'douyin', label: '더우인', icon: 'music' });
      if (forced === 'xiaohongshu') return R({ platform: 'xiaohongshu', label: '샤오홍슈', icon: 'book' });
    }

    /* YouTube (shorts / watch / youtu.be / embed / live / m.) */
    m = u.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/|embed\/|live\/|v\/)|youtu\.be\/)([A-Za-z0-9_-]{6,})/);
    if (m) return R({
      platform: 'youtube', id: m[1], label: 'YouTube', icon: 'youtube',
      embed: `https://www.youtube.com/embed/${m[1]}?autoplay=1&rel=0&playsinline=1`,
      thumb: `https://i.ytimg.com/vi/${m[1]}/hqdefault.jpg`
    });

    /* Instagram (계정 경로가 끼어 있어도 인식) */
    m = u.match(/instagram\.com\/(?:[A-Za-z0-9._]+\/)?(reels?|p|tv)\/([A-Za-z0-9_-]+)/);
    if (m) {
      const kind = m[1] === 'p' ? 'p' : (m[1] === 'tv' ? 'tv' : 'reel');
      return R({
        platform: 'instagram', id: m[2], label: 'Instagram', icon: 'instagram',
        embed: `https://www.instagram.com/${kind}/${m[2]}/embed/`
      });
    }

    /* TikTok */
    m = u.match(/tiktok\.com\/.*\/video\/(\d+)/);
    if (m) return R({ platform: 'tiktok', id: m[1], label: 'TikTok', icon: 'music', embed: `https://www.tiktok.com/embed/v2/${m[1]}` });
    if (/(vm|vt)\.tiktok\.com/.test(u)) return R({ platform: 'tiktok', label: 'TikTok', icon: 'music' });

    /* 빌리빌리 */
    m = u.match(/bilibili\.com\/video\/(BV[0-9A-Za-z]+)/);
    if (m) return R({ platform: 'bilibili', id: m[1], label: '빌리빌리', icon: 'video', embed: `https://player.bilibili.com/player.html?bvid=${m[1]}&autoplay=1&high_quality=1` });
    m = u.match(/bilibili\.com\/video\/av(\d+)/i);
    if (m) return R({ platform: 'bilibili', id: m[1], label: '빌리빌리', icon: 'video', embed: `https://player.bilibili.com/player.html?aid=${m[1]}&autoplay=1` });
    if (/b23\.tv/.test(u)) return R({ platform: 'bilibili', label: '빌리빌리', icon: 'video' });

    /* Vimeo */
    m = u.match(/vimeo\.com\/(?:video\/)?(\d+)/);
    if (m) return R({ platform: 'vimeo', id: m[1], label: 'Vimeo', icon: 'video', embed: `https://player.vimeo.com/video/${m[1]}?autoplay=1` });

    /* 임베드 불가 (앱에서 재생) */
    if (/douyin\.com/.test(u)) return R({ platform: 'douyin', label: '더우인', icon: 'music' });
    if (/xiaohongshu\.com|xhslink\.com/.test(u)) return R({ platform: 'xiaohongshu', label: '샤오홍슈', icon: 'book' });
    if (/kuaishou\.com|chenzhongtech\.com/.test(u)) return R({ platform: 'kuaishou', label: '콰이쇼우', icon: 'music' });
    if (/weibo\.com|weibo\.cn/.test(u)) return R({ platform: 'weibo', label: '웨이보', icon: 'chat' });

    /* 직접 업로드 파일 */
    if (/\.(mp4|webm|mov|m4v)(\?|$)/i.test(u)) return R({ platform: 'video', file: u, label: '영상', icon: 'video' });

    return R();
  }

  /* ================= 영상 모달 ================= */
  function openVideo(url, forced) {
    const info = parseMedia(url, forced);
    let m = $('#zykVModal');
    if (!m) {
      m = document.createElement('div');
      m.id = 'zykVModal'; m.className = 'vmodal';
      m.innerHTML = `<div class="vmodal-box"><button class="vmodal-close" aria-label="닫기">${I('close', 26)}</button><div class="vmodal-body"></div></div>`;
      document.body.appendChild(m);
      m.addEventListener('click', e => { if (e.target === m || e.target.closest('.vmodal-close')) closeVideo(); });
    }
    const body = $('.vmodal-body', m);
    if (info.embed) {
      body.innerHTML = `<iframe src="${esc(info.embed)}" allow="autoplay; encrypted-media; picture-in-picture" allowfullscreen scrolling="no"></iframe>`;
    } else if (info.file) {
      body.innerHTML = `<video src="${esc(info.file)}" controls autoplay playsinline></video>`;
    } else {
      body.innerHTML = `<div class="vmodal-fallback">${I(info.icon, 40)}<b>${esc(info.label)} 영상은 해당 앱에서 재생됩니다</b>
        <a href="${esc(info.url)}" target="_blank" rel="noopener">새 창에서 보기 ${I('external', 16)}</a></div>`;
    }
    m.classList.add('open');
    document.body.style.overflow = 'hidden';
  }
  function closeVideo() {
    const m = $('#zykVModal'); if (!m) return;
    $('.vmodal-body', m).innerHTML = '';
    m.classList.remove('open');
    document.body.style.overflow = '';
  }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeVideo(); toggleDrawer(false); } });

  /* ================= 테마 ================= */
  function applyTheme(s) {
    if (!s) return;
    const r = document.documentElement.style;
    if (s.color_primary) r.setProperty('--brand', s.color_primary);
    if (s.color_primary_dark) r.setProperty('--brand-dark', s.color_primary_dark);
    if (s.color_primary_light) r.setProperty('--brand-light', s.color_primary_light);
    if (s.color_point) r.setProperty('--point', s.color_point);
    if (s.site_title && document.title.indexOf('관리자') < 0) {
      document.title = (document.body.dataset.pageTitle ? document.body.dataset.pageTitle + ' | ' : '') + s.site_title;
    }
    const md = document.querySelector('meta[name="description"]');
    if (md && s.site_description) md.setAttribute('content', s.site_description);
    if (s.favicon_url) { const f = document.querySelector('link[rel=icon]'); if (f) f.href = s.favicon_url; }
    setOG({ title: document.title, desc: s.site_description, image: s.og_image_url });
    if (s.analytics_id) loadAnalytics(s.analytics_id);
  }

  /* 공유 미리보기(OG/트위터) 메타 태그 세팅 */
  function setOG(o) {
    const put = (attr, key, val) => {
      if (!val) return;
      let el = document.querySelector(`meta[${attr}="${key}"]`);
      if (!el) { el = document.createElement('meta'); el.setAttribute(attr, key); document.head.appendChild(el); }
      el.setAttribute('content', val);
    };
    put('property', 'og:type', 'website');
    put('property', 'og:url', location.href);
    put('property', 'og:title', o.title);
    put('property', 'og:description', o.desc);
    put('property', 'og:image', o.image ? new URL(o.image, location.href).href : '');
    put('name', 'twitter:card', o.image ? 'summary_large_image' : 'summary');
    put('name', 'twitter:title', o.title);
    put('name', 'twitter:description', o.desc);
    put('name', 'twitter:image', o.image ? new URL(o.image, location.href).href : '');
  }

  /* Google Analytics (GA4) */
  function loadAnalytics(id) {
    if (window._zykGA) return; window._zykGA = true;
    const s1 = document.createElement('script');
    s1.async = true; s1.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
    document.head.appendChild(s1);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date()); window.gtag('config', id);
  }

  /* ================= 헤더 ================= */
  function catLink(c) { return c.link || `list.html?cat=${encodeURIComponent(c.slug)}`; }
  const isExt = u => /^https?:/.test(u || '');
  const extAttr = u => isExt(u) ? 'target="_blank" rel="noopener"' : '';

  /* ---------- 계층 헬퍼 ---------- */
  const topCats = () => state.cats.filter(c => !c.parent_id);
  const subCats = id => state.cats.filter(c => c.parent_id === id);
  const cities = () => state.regions.filter(r => !r.parent_id);
  const areasOf = id => state.regions.filter(r => r.parent_id === id);

  /* slug 로 자기 자신 + 하위 전체 id 목록 */
  function catIds(slug) {
    const c = state.cats.find(x => x.slug === slug); if (!c) return [];
    return [c.id, ...subCats(c.id).map(x => x.id)];
  }
  function regionIds(slug) {
    const r = state.regions.find(x => x.slug === slug); if (!r) return [];
    return [r.id, ...areasOf(r.id).map(x => x.id)];
  }
  /* 최상위 업종 slug 구하기 (세부업종이면 부모 slug) */
  function rootCatSlug(slug) {
    const c = state.cats.find(x => x.slug === slug); if (!c) return '';
    if (!c.parent_id) return c.slug;
    const p = state.cats.find(x => x.id === c.parent_id);
    return p ? p.slug : c.slug;
  }

  /* ---------- 메가메뉴 1개 ---------- */
  function buildGnbItem(c) {
    const its = state.items.filter(i => i.category_id === c.id);
    const customReg = its.filter(i => i.group_type === 'region');
    const thm = its.filter(i => i.group_type === 'theme');
    const pro = its.filter(i => i.group_type === 'promo');
    const subs = subCats(c.id);
    const useAutoRegion = c.auto_regions !== false;
    const cityList = useAutoRegion ? cities() : [];

    const li = arr => arr.map(i =>
      `<li><a href="${esc(i.link || '#')}" ${extAttr(i.link)}>${esc(i.label)}${i.badge ? `<span class="bd">${esc(i.badge)}</span>` : ''}</a></li>`).join('');

    const colSub = subs.length ? `<div class="mega-col">
      <h4>세부 업종</h4>
      <ul class="mc-sub">${subs.map(s2 =>
      `<li><a href="list.html?cat=${esc(s2.slug)}">${esc(s2.name)}</a></li>`).join('')}</ul>
    </div>` : '';

    const colRegion = (cityList.length || customReg.length) ? `<div class="mega-col region">
      <h4>지역</h4>
      <div class="reg-groups">
        ${cityList.map(city => {
      const ar = areasOf(city.id);
      return `<div class="reg-g">
            <a class="rg-t" href="list.html?cat=${esc(c.slug)}&region=${esc(city.slug)}">${esc(city.name)}</a>
            ${ar.length ? `<div class="rg-c">${ar.map(a =>
        `<a href="list.html?cat=${esc(c.slug)}&region=${esc(a.slug)}">${esc(a.name)}</a>`).join('')}</div>` : ''}
          </div>`;
    }).join('')}
      </div>
      ${customReg.length ? `<ul class="mc-extra">${li(customReg)}</ul>` : ''}
    </div>` : '';

    const colTheme = thm.length ? `<div class="mega-col"><h4>테마</h4><ul>${li(thm)}</ul></div>` : '';

    const colPromo = `<div class="mega-col mega-promo"><h4>프로모션</h4>
      ${(pro.length ? pro : [{ link: catLink(c), label: c.name + ' 제휴처 전체보기' }]).map(p =>
      `<a href="${esc(p.link || '#')}" ${extAttr(p.link)}>
          <span class="thumb">${I(ZYKIcon.has(c.icon) ? c.icon : 'tag', 22)}</span>
          <span class="tt">${esc(p.label)}${p.badge ? `<span class="bd">${esc(p.badge)}</span>` : ''}</span>
          ${I('chevronRight', 16)}</a>`).join('')}
    </div>`;

    const cols = [colSub, colRegion, colTheme, colPromo].filter(Boolean);

    return `<li class="${state.activeCat && rootCatSlug(state.activeCat) === c.slug ? 'on' : ''}">
      <a href="${esc(catLink(c))}">${esc(c.name)}</a>
      <div class="mega"><div class="mega-inner cols-${cols.length}">${cols.join('')}</div></div>
    </li>`;
  }

  function renderHeader() {
    const host = $('#siteHeader'); if (!host) return;
    const s = state.settings || {};

    const quickHtml = state.quick.map(q =>
      `<a href="${esc(q.link || '#')}" ${extAttr(q.link)} class="${q.emphasis ? 'em' : ''}">${esc(q.label)}</a>`).join('');

    const gnbHtml = topCats().map(c => buildGnbItem(c)).join('');

    host.innerHTML = `
      <div class="utility-bar">
        <div class="container">
          <div class="utility-notice">${I('ticket', 15)}<span>${esc(s.header_notice || '')}</span></div>
          <nav class="utility-links">${menuAt('utility').map(m =>
            `<a href="${esc(m.link || '#')}" target="${esc(m.link_target || '_self')}" ${extAttr(m.link)}>${esc(m.label)}</a>`).join('')}</nav>
        </div>
      </div>

      <div class="header-main">
        <div class="container">
          <a href="index.html" class="logo">
            <img src="${esc(s.logo_url || 'assets/img/logo.png')}" alt="${esc(s.site_name || '중여커')}" onerror="this.style.display='none'">
            <span class="logo-text"><b>${esc(s.site_name || '중여커')}</b><span>중국 현지 제휴 혜택 가이드</span></span>
          </a>
          <form class="search-box" role="search" onsubmit="return ZYKUI.doSearch(event)">
            <input type="search" id="gSearch" placeholder="${esc(s.search_placeholder || '검색어를 입력하세요')}" value="${esc(qs.get('q') || '')}" autocomplete="off">
            <button type="submit" aria-label="검색">${I('search', 19)}</button>
          </form>
          <div class="header-actions">${menuAt('header_action').map(m => {
            const fav = /fav=1/.test(m.link || '');
            return `<a class="ha" href="${esc(m.link || '#')}" target="${esc(m.link_target || '_self')}" ${extAttr(m.link)}>
              <i class="${fav ? 'ha-badge' : ''}">${I(m.icon || 'link', 21, m.icon === 'play' ? 'fill' : '')}${fav ? '<b class="js-fav-count">0</b>' : ''}</i>
              <span>${esc(m.label)}</span></a>`; }).join('')}</div>
        </div>
      </div>

      ${quickHtml ? `<div class="quick-line"><div class="container">${quickHtml}</div></div>` : ''}

      <div class="gnb-bar"><div class="container"><ul class="gnb">
        ${menuAt('gnb_left').map(m => `<li><a href="${esc(m.link || '#')}" ${extAttr(m.link)}>${esc(m.label)}</a></li>`).join('')}
        ${gnbHtml}
        ${menuAt('gnb_right').map(m => `<li><a href="${esc(m.link || '#')}" ${extAttr(m.link)}>${esc(m.label)}</a></li>`).join('')}
      </ul></div></div>

      <div id="subNavHost"></div>

      <div class="container m-header">
        <button class="m-btn" id="mMenuBtn" aria-label="전체 메뉴">${I('menu', 23)}</button>
        <a href="index.html" class="m-logo">
          <img src="${esc(s.logo_url || 'assets/img/logo.png')}" alt="" onerror="this.style.display='none'">
          <b>${esc(s.site_name || '중여커')}</b>
        </a>
        <button class="m-btn" id="mSearchBtn" aria-label="검색">${I('search', 21)}</button>
      </div>
      <div class="m-search" id="mSearchBox">
        <form onsubmit="return ZYKUI.doSearch(event,'mSearch')">
          <input type="search" id="mSearch" placeholder="${esc(s.search_placeholder || '검색')}" value="${esc(qs.get('q') || '')}">
          <button type="submit" aria-label="검색">${I('search', 19)}</button>
        </form>
      </div>`;

    renderSubNav();
    renderDrawer();
    renderTabbar();
    updateFavCount();
    const mb = $('#mMenuBtn'); mb && mb.addEventListener('click', () => toggleDrawer(true));
    const sb2 = $('#mSearchBtn'); sb2 && sb2.addEventListener('click', () => {
      const b = $('#mSearchBox'); b.classList.toggle('open');
      if (b.classList.contains('open')) $('#mSearch').focus();
    });
  }

  /* ================= 2뎁스 서브내비 ================= */
  function renderSubNav() {
    const host = $('#subNavHost'); if (!host) return;
    const active = state.cats.find(x => x.slug === state.activeCat);
    if (!active) { host.innerHTML = ''; return; }
    const rootSlug = rootCatSlug(active.slug);
    const c = state.cats.find(x => x.slug === rootSlug) || active;

    const subs = subCats(c.id);
    const cityList = c.auto_regions !== false ? cities() : [];
    const thm = state.items.filter(i => i.category_id === c.id && i.group_type === 'theme');
    const pro = state.items.filter(i => i.category_id === c.id && i.group_type === 'promo');

    const curCat = state.activeCat !== c.slug ? state.activeCat : '';
    const curReg = qs.get('region') || '';
    const curTag = qs.get('tag') || '';
    const base = `list.html?cat=${encodeURIComponent(c.slug)}`;

    const grp = (label, items) => items.length
      ? `<span class="subnav-g">${esc(label)}</span>` + items.join('') : '';

    host.innerHTML = `<div class="subnav-bar"><div class="container">
      <a class="subnav-home" href="${esc(catLink(c))}" title="${esc(c.name)} 전체">
        ${I(ZYKIcon.has(c.icon) ? c.icon : 'grid', 17)}<b>${esc(c.name)}</b></a>
      <div class="subnav-wrap" id="subnavWrap">
        <button class="subnav-arw prev" aria-label="이전 항목">${I('chevronLeft', 16)}</button>
        <div class="subnav-scroll" id="subnavScroll">
          <a class="subnav-i ${!curCat && !curReg && !curTag ? 'on' : ''}" href="${esc(catLink(c))}">전체</a>
          ${grp('업종', subs.map(s2 =>
      `<a class="subnav-i ${curCat === s2.slug ? 'on' : ''}" href="list.html?cat=${esc(s2.slug)}">${esc(s2.name)}</a>`))}
          ${grp('지역', cityList.map(r =>
        `<a class="subnav-i ${curReg === r.slug ? 'on' : ''}" href="${base}&region=${esc(r.slug)}">${esc(r.name)}</a>`))}
          ${grp('테마', thm.map(t => {
          const tag = (String(t.link || '').split('tag=')[1] || '');
          return `<a class="subnav-i ${curTag && curTag === tag ? 'on' : ''}" href="${esc(t.link || '#')}" ${extAttr(t.link)}>${esc(t.label)}</a>`;
        }))}
        </div>
        <button class="subnav-arw next" aria-label="다음 항목">${I('chevronRight', 16)}</button>
      </div>
      <div class="subnav-right">
        ${pro.slice(0, 1).map(i => `<a href="${esc(i.link || '#')}" ${extAttr(i.link)}>${esc(i.label)}</a>`).join('')}
        ${menuAt('subnav_right').map(m => `<a href="${esc(m.link || '#')}" ${extAttr(m.link)}>${esc(m.label)}</a>`).join('')}
      </div>
    </div></div>`;

    bindSubNavScroll();
  }

  /* 서브내비 가로 스크롤 (화살표 + 좌우 페이드) */
  function bindSubNavScroll() {
    const wrap = $('#subnavWrap'), sc = $('#subnavScroll');
    if (!wrap || !sc) return;
    const prev = $('.subnav-arw.prev', wrap), next = $('.subnav-arw.next', wrap);
    const update = () => {
      const over = sc.scrollWidth - sc.clientWidth;
      wrap.classList.remove('at-start', 'at-mid', 'at-end');
      if (over <= 4) { prev.classList.remove('on'); next.classList.remove('on'); return; }
      const x = sc.scrollLeft;
      prev.classList.toggle('on', x > 4);
      next.classList.toggle('on', x < over - 4);
      wrap.classList.add(x <= 4 ? 'at-start' : (x >= over - 4 ? 'at-end' : 'at-mid'));
    };
    const step = () => Math.max(160, sc.clientWidth * 0.7);
    prev.addEventListener('click', () => { sc.scrollLeft -= step(); });
    next.addEventListener('click', () => { sc.scrollLeft += step(); });
    sc.addEventListener('scroll', update, { passive: true });
    window.addEventListener('resize', update);
    /* 선택된 항목이 보이도록 스크롤 */
    const on = $('.subnav-i.on', sc);
    if (on && on.offsetLeft > sc.clientWidth * 0.6) sc.scrollLeft = on.offsetLeft - sc.clientWidth / 2 + on.offsetWidth / 2;
    setTimeout(update, 0);
  }

  /* ================= 모바일 드로어 ================= */
  function renderDrawer() {
    if ($('#zykDrawer')) return;
    const s = state.settings || {};
    const dim = document.createElement('div'); dim.className = 'drawer-dim'; dim.id = 'zykDim';
    const dr = document.createElement('aside'); dr.className = 'drawer'; dr.id = 'zykDrawer';

    const cats = topCats().map(c => {
      const thm = state.items.filter(i => i.category_id === c.id && i.group_type === 'theme');
      const subs = subCats(c.id);
      const cityList = c.auto_regions !== false ? cities() : [];
      const open = state.activeCat && rootCatSlug(state.activeCat) === c.slug;
      return `<div class="drawer-cat ${open ? 'open' : ''}">
        <button type="button"><span class="dc-l">${I(ZYKIcon.has(c.icon) ? c.icon : 'tag', 20)}${esc(c.name)}</span>${I('chevronDown', 18)}</button>
        <div class="drawer-sub">
          <a class="all" href="${esc(catLink(c))}">${esc(c.name)} 전체보기</a>
          ${subs.length ? `<h5>세부 업종</h5>${subs.map(s2 => `<a href="list.html?cat=${esc(s2.slug)}">${esc(s2.name)}</a>`).join('')}` : ''}
          ${cityList.length ? `<h5>지역</h5>${cityList.map(r => `<a href="list.html?cat=${esc(c.slug)}&region=${esc(r.slug)}">${esc(r.name)}</a>`).join('')}` : ''}
          ${thm.length ? `<h5>테마</h5>${thm.map(i => `<a href="${esc(i.link || '#')}">${esc(i.label)}</a>`).join('')}` : ''}
        </div>
      </div>`;
    }).join('');

    dr.innerHTML = `
      <div class="drawer-head">
        <button class="drawer-close" aria-label="닫기">${I('close', 24)}</button>
        <b>${esc(s.site_name || '중여커')}</b>
        <p>${esc(s.header_notice || '중국 현지 제휴 혜택 가이드')}</p>
      </div>
      <div class="drawer-sec">${cats}</div>
      <div class="drawer-sec drawer-etc">${menuAt('drawer_etc').map(m =>
        `<a href="${esc(m.link || '#')}" target="${esc(m.link_target || '_self')}" ${extAttr(m.link)}>${I(m.icon || 'link', 19)}${esc(m.label)}</a>`).join('')}</div>`;

    document.body.appendChild(dim); document.body.appendChild(dr);
    dim.addEventListener('click', () => toggleDrawer(false));
    $('.drawer-close', dr).addEventListener('click', () => toggleDrawer(false));
    $$('.drawer-cat > button', dr).forEach(b =>
      b.addEventListener('click', () => b.parentElement.classList.toggle('open')));
  }
  function toggleDrawer(open) {
    const d = $('#zykDrawer'), m = $('#zykDim');
    if (!d) return;
    d.classList.toggle('open', open);
    m.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  }

  /* ================= 모바일 하단 탭 ================= */
  function renderTabbar() {
    if ($('#zykTabbar')) return;
    const p = location.pathname;
    const tabs = menuAt('mobile_tab');
    if (!tabs.length) return;
    const isOn = link => {
      const f = String(link || '').split('?')[0];
      if (/index\.html$/.test(f)) return p === '/' || p.endsWith('index.html');
      return !!f && p.endsWith(f) && !/fav=1/.test(link || '');
    };
    const nav = document.createElement('nav');
    nav.id = 'zykTabbar'; nav.className = 'm-tabbar';
    nav.style.setProperty('--tabs', tabs.length);
    nav.innerHTML = `<ul>${tabs.map(m =>
      `<li><a class="${isOn(m.link) ? 'on' : ''}" href="${esc(m.link || '#')}" ${extAttr(m.link)}>${I(m.icon || 'link', 21)}<span>${esc(m.label)}</span></a></li>`).join('')}</ul>`;
    document.body.appendChild(nav);
  }

  /* ================= 푸터 ================= */
  function renderFooter() {
    const host = $('#siteFooter'); if (!host) return;
    const s = state.settings || {};
    const links = state.footer.map(f =>
      `<a href="${esc(f.link || '#')}" ${extAttr(f.link)} class="${f.emphasis ? 'em' : ''}">${esc(f.label)}</a>`).join('');
    const sns = [
      ['sns_instagram', 'instagram', '인스타그램'], ['sns_youtube', 'youtube', '유튜브'],
      ['sns_naver_blog', 'pencil', '블로그'], ['sns_kakao', 'chat', '카카오채널'],
      ['sns_xiaohongshu', 'book', '샤오홍슈'], ['sns_douyin', 'music', '더우인']
    ].filter(x => s[x[0]]).map(x =>
      `<a href="${esc(s[x[0]])}" target="_blank" rel="noopener" title="${x[2]}" aria-label="${x[2]}">${I(x[1], 18)}</a>`).join('');

    host.innerHTML = `<div class="container">
      <div class="footer-links">${links}</div>
      <div class="footer-body">
        <div class="footer-company">
          <b>${esc(s.company_name || '중여커')}</b>
          ${s.company_ceo ? `<p>대표 ${esc(s.company_ceo)}</p>` : ''}
          ${s.company_address ? `<p>${esc(s.company_address)}</p>` : ''}
          ${s.company_reg_no ? `<p>사업자등록번호 ${esc(s.company_reg_no)}</p>` : ''}
          ${s.cs_wechat_id ? `<p>위챗 ${esc(s.cs_wechat_id)}</p>` : ''}
          ${s.cs_email ? `<p>이메일 <a href="mailto:${esc(s.cs_email)}">${esc(s.cs_email)}</a></p>` : ''}
          ${s.company_extra ? `<p>${esc(s.company_extra)}</p>` : ''}
        </div>
        ${sns ? `<div class="footer-sns">${sns}</div>` : ''}
      </div>
      ${s.footer_notice ? `<div class="footer-notice">${esc(s.footer_notice)}</div>` : ''}
      <div class="footer-copy">${esc(s.copyright_text || '')}</div>
    </div>`;
  }

  /* ================= 플로팅 ================= */
  function renderFloating() {
    if ($('#zykFloat')) return;
    const s = state.settings || {};
    const d = document.createElement('div');
    d.id = 'zykFloat'; d.className = 'floating';
    d.innerHTML = `
      ${s.cs_kakao_url ? `<a class="brand" href="${esc(s.cs_kakao_url)}" target="_blank" rel="noopener" title="문의">${I('chat', 19)}<span>문의</span></a>` : ''}
      <a href="list.html?fav=1" title="찜한 곳">${I('heart', 19)}<span>찜</span></a>
      <button type="button" id="zykTop" title="맨 위로">${I('arrowUp', 19)}<span>TOP</span></button>`;
    document.body.appendChild(d);
    $('#zykTop').addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));
  }

  /* ================= 광고 ================= */
  function adActive(a) {
    const now = Date.now();
    if (a.start_at && new Date(a.start_at).getTime() > now) return false;
    if (a.end_at && new Date(a.end_at).getTime() < now) return false;
    return a.is_active !== false;
  }
  function adHtml(a) {
    if (a.html_code) return `<div class="ad-html">${a.html_code}</div>`;
    const mob = window.innerWidth <= 768;
    const img = (mob && a.image_url_mobile) ? a.image_url_mobile : a.image_url;
    const inner = img
      ? `<img src="${esc(img)}" alt="${esc(a.title || '광고')}">`
      : `<div class="ad-text"><b>${esc(a.title || '')}</b>${a.subtitle ? `<span>${esc(a.subtitle)}</span>` : ''}<em>자세히 보기 ${I('chevronRight', 14)}</em></div>`;
    return `<a class="ad-link" href="${esc(a.link || '#')}" target="${esc(a.link_target || '_blank')}" rel="noopener"
              data-ad-id="${esc(a.id)}" style="background:${esc(a.bg_color || '#f4f7f9')};color:${esc(a.text_color || '#2F6C91')}">
              ${inner}<span class="ad-mark">AD</span></a>`;
  }
  async function renderAds() {
    const slots = $$('[data-ad-slot]');
    if (!slots.length) return;
    const ads = (await ZYK.selectAll('ads', { orderBy: 'sort' })).filter(adActive);
    slots.forEach(host => {
      const slot = host.dataset.adSlot;
      const list = ads.filter(a => a.slot === slot);
      if (!list.length) { host.innerHTML = ''; return; }
      if (slot === 'top_strip') {
        const a = list[0];
        if (sessionStorage.getItem('zyk_ad_close_' + a.id)) { host.innerHTML = ''; return; }
        host.innerHTML = `<div class="ad-strip" style="background:${esc(a.bg_color || '#FDEBF3')};color:${esc(a.text_color || '#8A2C56')}">
          <div class="container">
            <a href="${esc(a.link || '#')}" target="${esc(a.link_target || '_blank')}" rel="noopener" data-ad-id="${esc(a.id)}">
              <b>${esc(a.title || '')}</b><span>${esc(a.subtitle || '')}</span>${I('chevronRight', 15)}</a>
            ${a.is_closable !== false ? `<button class="ad-strip-x" aria-label="광고 닫기">${I('close', 18)}</button>` : ''}
          </div></div>`;
        const x = $('.ad-strip-x', host);
        x && x.addEventListener('click', () => { sessionStorage.setItem('zyk_ad_close_' + a.id, '1'); host.style.height = host.offsetHeight + 'px'; host.classList.add('closing'); setTimeout(() => host.innerHTML = '', 220); });
      } else {
        host.innerHTML = `<div class="ad-box ad-${esc(slot)}">${list.map(adHtml).join('')}</div>`;
      }
    });
    if (!renderAds._bound) {
      renderAds._bound = true;
      document.addEventListener('click', e => {
        const a = e.target.closest('[data-ad-id]');
        if (a) ZYK.rpc('increment_ad_click', { p_id: a.dataset.adId });
      });
    }
  }

  /* ================= 팝업 ================= */
  async function renderPopups(pageKey) {
    const pops = (await ZYK.selectAll('popups', { orderBy: 'sort' })).filter(p => {
      if (!adActive(p)) return false;
      if (p.show_on !== 'all' && p.show_on !== pageKey) return false;
      const mob = window.innerWidth <= 768;
      if (p.device === 'pc' && mob) return false;
      if (p.device === 'mobile' && !mob) return false;
      const until = localStorage.getItem('zyk_pop_' + p.id);
      if (until && Date.now() < Number(until)) return false;
      return true;
    });
    if (!pops.length) return;
    const wrap = document.createElement('div');
    wrap.className = 'popup-layer-wrap';
    wrap.innerHTML = pops.map((p, i) => {
      const pos = p.position === 'center' ? 'left:50%;transform:translateX(-50%);' :
        p.position === 'right' ? `right:${p.offset_x || 24}px;` : `left:${(p.offset_x || 24) + i * 20}px;`;
      const body = p.html_code ? p.html_code
        : p.image_url ? `<img src="${esc(p.image_url)}" alt="${esc(p.title || '')}">`
          : `<div class="popup-txt"><b>${esc(p.title || '')}</b></div>`;
      const inner = p.link ? `<a href="${esc(p.link)}" target="${esc(p.link_target || '_blank')}" rel="noopener">${body}</a>` : body;
      return `<div class="popup-layer" data-pop="${esc(p.id)}" data-days="${p.hide_days || 1}"
                style="${pos}top:${p.offset_y || 90}px;width:${p.width || 380}px">
        ${inner}
        <div class="popup-foot">
          <button class="pf-today">오늘 하루 그만보기</button>
          <button class="pf-close">닫기 ${I('close', 15)}</button>
        </div></div>`;
    }).join('');
    document.body.appendChild(wrap);
    $$('.popup-layer', wrap).forEach(el => {
      const kill = () => { el.classList.add('out'); setTimeout(() => el.remove(), 200); };
      $('.pf-close', el).addEventListener('click', kill);
      $('.pf-today', el).addEventListener('click', () => {
        localStorage.setItem('zyk_pop_' + el.dataset.pop, String(Date.now() + Number(el.dataset.days || 1) * 86400000));
        kill();
      });
    });
  }

  /* ================= 검색 ================= */
  function doSearch(e, id) {
    e.preventDefault();
    const el = $('#' + (id || 'gSearch'));
    const v = el ? el.value : '';
    location.href = 'list.html?q=' + encodeURIComponent(String(v).trim());
    return false;
  }

  /* ================= 인터랙션 ================= */
  function bindInteractions() {
    /* 리플 */
    document.addEventListener('pointerdown', e => {
      const t = e.target.closest('.btn-primary, .tab, .btn-hero, .subnav-i, .quick-cat a, .cs-btns a');
      if (!t) return;
      const r = t.getBoundingClientRect();
      const s = document.createElement('span');
      s.className = 'ripple';
      const d = Math.max(r.width, r.height);
      s.style.width = s.style.height = d + 'px';
      s.style.left = (e.clientX - r.left - d / 2) + 'px';
      s.style.top = (e.clientY - r.top - d / 2) + 'px';
      if (getComputedStyle(t).position === 'static') t.style.position = 'relative';
      t.appendChild(s);
      setTimeout(() => s.remove(), 520);
    });

    /* 스크롤 상태 */
    let last = 0;
    const onScroll = () => {
      const y = window.scrollY;
      document.body.classList.toggle('scrolled', y > 12);
      document.body.classList.toggle('show-float', y > 320);
      last = y;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    /* 진입 페이드인 */
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver(es => es.forEach(x => {
        if (x.isIntersecting) { x.target.classList.add('in'); io.unobserve(x.target); }
      }), { rootMargin: '0px 0px -8% 0px' });
      window.ZYKUI._io = io;
      observeReveal();
    }
  }
  function observeReveal(root) {
    const io = window.ZYKUI && window.ZYKUI._io;
    if (!io) return;
    $$('.reveal:not(.in)', root || document).forEach(el => io.observe(el));
  }

  /* ================= 초기화 ================= */
  async function init(pageKey, opts) {
    opts = opts || {};
    const [settings, cats, items, regions, quick, keywords, footer, menus] = await Promise.all([
      ZYK.selectOne('site_settings', { id: 1 }),
      ZYK.selectAll('nav_categories', { orderBy: 'sort' }),
      ZYK.selectAll('nav_items', { orderBy: 'sort' }),
      ZYK.selectAll('regions', { orderBy: 'sort' }),
      ZYK.selectAll('quick_links', { orderBy: 'sort' }),
      ZYK.selectAll('keywords', { orderBy: 'sort' }),
      ZYK.selectAll('footer_links', { orderBy: 'sort' }),
      ZYK.selectAll('menus', { orderBy: 'sort' })
    ]);
    Object.assign(state, { settings, cats, items, regions, quick, keywords, footer, menus });
    state.activeCat = opts.cat || qs.get('cat') || '';
    applyTheme(settings);
    renderHeader();
    renderFooter();
    renderFloating();
    renderAds();
    renderPopups(pageKey || 'main');
    bindInteractions();
    if (!ZYK.configured) showSetupAlert();
    return state;
  }

  function setActiveCat(slug) {
    state.activeCat = slug || '';
    $$('.gnb > li').forEach(li => {
      const a = li.querySelector('a');
      li.classList.toggle('on', !!slug && a && a.textContent.trim() === (state.cats.find(c => c.slug === slug) || {}).name);
    });
    renderSubNav();
  }

  function showSetupAlert() {
    const host = $('#setupAlert'); if (!host) return;
    host.innerHTML = `<div class="setup-alert">${I('info', 18)}<div>
      <b>데모 모드로 표시 중입니다.</b> Supabase 연결 전이라 예시 데이터가 보입니다.
      <code>assets/js/config.js</code> 의 <code>SUPABASE_URL</code> / <code>SUPABASE_ANON_KEY</code> 를 입력하면 실제 데이터로 전환됩니다.
    </div></div>`;
  }

  window.ZYKUI = {
    $, $$, esc, qs, state, init, toast, favGet, favToggle, updateFavCount,
    recentGet, recentAdd, parseMedia, openVideo, closeVideo, doSearch,
    renderAds, applyTheme, setActiveCat, observeReveal, isExt, extAttr, I,
    topCats, subCats, cities, areasOf, catIds, regionIds, rootCatSlug, catLink, menuAt, setOG
  };
})();
