/* =====================================================================
 *  중여커 · 제휴업체 상세
 *  갤러리 / 탭 네비 / 혜택 / 소개 / 영상 / 이용안내 / 위치 / 스티키 CTA
 * ===================================================================*/
(async function () {
  const { $, $$, esc, qs, I } = ZYKUI;
  const root = $('#detailRoot');

  const id = qs.get('id');
  const slug = qs.get('slug');

  const all = await ZYK.selectAll('partners', { orderBy: 'sort' });
  const p = all.find(x => (id && String(x.id) === id) || (slug && x.slug === slug));

  const st = await ZYKUI.init('detail', { cat: '' });

  if (!p) {
    root.innerHTML = `<div class="container"><div class="empty" style="padding:90px 20px">
      <div class="ei">${I('search', 46)}</div>
      <p>존재하지 않거나 노출이 중지된 제휴업체입니다.</p>
      <a class="btn btn-primary" href="list.html" style="display:inline-flex;margin-top:18px">제휴업체 전체보기</a>
    </div></div>`;
    return;
  }

  const cat = st.cats.find(c => c.id === p.category_id);
  if (cat) ZYKUI.setActiveCat(cat.slug);

  document.title = p.name + (p.benefit_summary ? ' · ' + p.benefit_summary : '') + ' - ' + ((st.settings || {}).site_name || '중여커');
  ZYKUI.setOG({
    title: p.name + (p.benefit_summary ? ' · ' + p.benefit_summary : ''),
    desc: p.summary || p.benefit_detail || p.description || '',
    image: p.thumbnail_url || (st.settings || {}).og_image_url
  });
  ZYK.rpc('increment_partner_view', { p_id: p.id });
  ZYKUI.recentAdd(p.id);

  const media = (await ZYK.selectAll('partner_media', { orderBy: 'sort' })).filter(m => m.partner_id === p.id);
  const tags = ZYKCards.toTags(p.tags);
  const images = Array.isArray(p.images) ? p.images : ZYKCards.toTags(p.images);
  const gallery = [p.thumbnail_url, ...images].filter(Boolean);
  const isFav = ZYKUI.favGet().includes(p.id);
  const S = st.settings || {};
  const T = (k, d) => S[k] || d;

  const row = (icon, label, value) => value
    ? `<tr><th>${I(icon, 15)}${esc(label)}</th><td>${esc(value)}</td></tr>` : '';

  const benefitLines = String(p.benefit_detail || '').split('\n').map(s => s.replace(/^[·•\-\s]+/, '').trim()).filter(Boolean);

  const tabs = [
    p.benefit_detail && ['benefit', T('detail_benefit_sec', '제휴 혜택 상세')],
    p.description && ['intro', T('detail_intro_sec', '업체 소개')],
    media.length && ['media', T('detail_media_sec', '홍보 영상')],
    (p.business_hours || p.booking_method || p.notice) && ['guide', T('detail_guide_sec', '이용 안내')],
    (p.qr_image_url || p.wechat_id) && ['book', T('detail_book_sec', '예약 방법')],
    (p.address || p.map_url) && ['loc', T('detail_loc_sec', '위치')]
  ].filter(Boolean);

  root.innerHTML = `
  <nav class="crumb"><div class="container">
    <a href="index.html">${I('home', 14)}</a>${I('chevronRight', 13)}
    ${cat ? `<a href="list.html?cat=${esc(cat.slug)}">${esc(cat.name)}</a>${I('chevronRight', 13)}` : ''}
    ${p.region_label ? `<a href="list.html?region=${esc((st.regions.find(r => r.id === p.region_id) || {}).slug || '')}">${esc(p.region_label)}</a>${I('chevronRight', 13)}` : ''}
    <span>${esc(p.name)}</span>
  </div></nav>

  <div class="container">
    <div id="setupAlert"></div>
    <div class="detail-hero">
      <div class="gal">
        <div class="gallery-main" id="galMain">
          ${gallery.length ? `<img src="${esc(gallery[0])}" alt="${esc(p.name)}">` : `<div class="ph">${I('store', 56)}</div>`}
          ${gallery.length > 1 ? `
            <button class="gal-arw prev" aria-label="이전 사진">${I('chevronLeft', 22)}</button>
            <button class="gal-arw next" aria-label="다음 사진">${I('chevronRight', 22)}</button>
            <span class="gal-count"><b id="galIdx">1</b> / ${gallery.length}</span>` : ''}
          ${p.badge ? `<span class="pcard-badge" style="top:14px;left:14px">${esc(p.badge)}</span>` : ''}
        </div>
        ${gallery.length > 1 ? `<div class="gallery-thumbs" id="galThumbs">
          ${gallery.map((g, i) => `<img src="${esc(g)}" class="${i === 0 ? 'on' : ''}" data-i="${i}" alt="">`).join('')}
        </div>` : ''}
      </div>

      <div class="detail-summary">
        <div class="pcard-meta">
          ${p.region_label ? `<span>${I('mapPin', 12)}${esc(p.region_label)}</span>` : ''}
          ${p.category_label ? `<span>${esc(p.category_label)}</span>` : ''}
          ${p.branch_count > 1 ? `<span>지점 ${p.branch_count}개</span>` : ''}
          ${p.view_count ? `<span>조회 ${Number(p.view_count).toLocaleString()}</span>` : ''}
        </div>
        <h1>${esc(p.name)}</h1>
        ${p.name_cn ? `<div class="cn">${esc(p.name_cn)}</div>` : ''}
        ${p.summary ? `<p class="lead">${esc(p.summary)}</p>` : ''}
        ${tags.length ? `<div class="detail-chips">${tags.map(t => `<a href="list.html?q=${encodeURIComponent(String(t).replace('#', ''))}">${esc(t)}</a>`).join('')}</div>` : ''}

        ${p.benefit_summary ? `<div class="benefit-hl">
          <span>${I('gift', 16)}${esc(T('detail_benefit_title', '중여커 회원 전용 혜택'))}</span>
          <b>${esc(p.benefit_summary)}</b>
          ${benefitLines.length ? `<em>${esc(benefitLines[0])}${benefitLines.length > 1 ? ` 외 ${benefitLines.length - 1}건` : ''}</em>` : ''}
        </div>` : ''}

        <table class="spec-table">
          ${row('clock', '영업시간', p.business_hours)}
          ${row('check', '예약 방법', p.booking_method)}
          ${row('tag', '가격대', p.price_info)}
          ${row('mapPin', '주소', p.address)}
          ${row('phone', '전화', p.phone)}
          ${row('chat', '위챗 ID', p.wechat_id)}
        </table>

        <div class="detail-cta">
          ${p.booking_url
      ? `<a class="btn btn-primary" href="${esc(p.booking_url)}" target="_blank" rel="noopener">${I('check', 18)}예약하기</a>`
      : `<a class="btn btn-primary" href="#sec-book">${I('qr', 18)}예약 방법 보기</a>`}
          <button class="btn btn-ghost ic" id="favBtn" aria-label="찜하기" aria-pressed="${isFav}">${I('heart', 18, isFav ? 'fill' : '')}<span>${isFav ? '찜함' : '찜하기'}</span></button>
          <button class="btn btn-ghost ic" id="shareBtn" aria-label="공유">${I('share', 18)}<span>공유</span></button>
        </div>

        <div class="detail-links">
          ${p.map_url ? `<a href="${esc(p.map_url)}" target="_blank" rel="noopener">${I('map', 16)}지도</a>` : ''}
          ${p.homepage_url ? `<a href="${esc(p.homepage_url)}" target="_blank" rel="noopener">${I('globe', 16)}홈페이지</a>` : ''}
          ${p.instagram_url ? `<a href="${esc(p.instagram_url)}" target="_blank" rel="noopener">${I('instagram', 16)}인스타그램</a>` : ''}
          ${p.xiaohongshu_url ? `<a href="${esc(p.xiaohongshu_url)}" target="_blank" rel="noopener">${I('book', 16)}샤오홍슈</a>` : ''}
          ${p.external_url ? `<a href="${esc(p.external_url)}" target="_blank" rel="noopener">${I('external', 16)}공식 페이지</a>` : ''}
        </div>
      </div>
    </div>
  </div>

  ${tabs.length > 1 ? `<div class="detail-tabs" id="dTabs"><div class="container">
    ${tabs.map((t, i) => `<a class="${i === 0 ? 'on' : ''}" href="#sec-${t[0]}" data-t="sec-${t[0]}">${esc(t[1])}</a>`).join('')}
  </div></div>` : ''}

  ${p.benefit_detail ? `<section class="detail-sec" id="sec-benefit"><div class="container">
    <h3>${I('gift', 21)}${esc(T('detail_benefit_sec', '제휴 혜택 상세'))}</h3>
    <ul class="benefit-list">${benefitLines.map(l => `<li>${I('check', 16)}<span>${esc(l)}</span></li>`).join('')}</ul>
    ${p.notice ? `<div class="notice-box">${I('info', 17)}<div>${esc(p.notice)}</div></div>` : ''}
  </div></section>` : ''}

  ${p.description ? `<section class="detail-sec" id="sec-intro"><div class="container">
    <h3>${I('store', 21)}${esc(T('detail_intro_sec', '업체 소개'))}</h3><div class="rich">${esc(p.description)}</div>
  </div></section>` : ''}

  ${media.length ? `<section class="detail-sec" id="sec-media"><div class="container">
    <h3>${I('video', 21)}${esc(T('detail_media_sec', '홍보 영상'))} <small>릴스 · 쇼츠</small></h3>
    <div class="media-scroll" id="pMedia"></div>
  </div></section>` : ''}

  ${(p.business_hours || p.booking_method || p.notice) ? `<section class="detail-sec" id="sec-guide"><div class="container">
    <h3>${I('info', 21)}${esc(T('detail_guide_sec', '이용 안내'))}</h3>
    <div class="guide-grid">
      ${p.business_hours ? `<div class="guide-card">${I('clock', 20)}<b>영업시간</b><p>${esc(p.business_hours)}</p></div>` : ''}
      ${p.booking_method ? `<div class="guide-card">${I('check', 20)}<b>예약 방법</b><p>${esc(p.booking_method)}</p></div>` : ''}
      ${p.price_info ? `<div class="guide-card">${I('tag', 20)}<b>가격대</b><p>${esc(p.price_info)}</p></div>` : ''}
      ${p.phone ? `<div class="guide-card">${I('phone', 20)}<b>전화</b><p>${esc(p.phone)}</p></div>` : ''}
    </div>
    <div class="notice-box">${I('info', 17)}<div>${esc(T('detail_member_notice', '방문 시 "중여커 회원" 이라고 말씀하셔야 혜택이 적용됩니다.'))}${p.notice ? '<br>' + esc(p.notice) : ''}</div></div>
  </div></section>` : ''}

  ${(p.qr_image_url || p.wechat_id) ? `<section class="detail-sec" id="sec-book"><div class="container">
    <h3>${I('qr', 21)}${esc(T('detail_book_sec', '예약 방법'))}</h3>
    <div class="qr-box">
      ${p.qr_image_url ? `<img src="${esc(p.qr_image_url)}" alt="예약 QR코드">` : `<div class="qr-ph">${I('qr', 46)}</div>`}
      <div class="qt">
        <b>${esc(p.booking_method || '위챗으로 예약해 주세요')}</b>
        <ol class="qr-steps">${String(T('detail_booking_steps', '')).split('\n').filter(Boolean)
            .map((line, i) => `<li><i>${i + 1}</i>${esc(line.trim())}</li>`).join('')}</ol>
        ${p.wechat_id ? `<div class="copy-row"><code id="wxId">${esc(p.wechat_id)}</code>
          <button id="copyWx">${I('copy', 15)}복사</button></div>` : ''}
      </div>
    </div>
  </div></section>` : ''}

  ${(p.address || p.map_url) ? `<section class="detail-sec" id="sec-loc"><div class="container">
    <h3>${I('mapPin', 21)}${esc(T('detail_loc_sec', '위치'))}</h3>
    <div class="loc-box">
      <div class="loc-txt">
        <b>${esc(p.address || p.name)}</b>
        ${p.branch_count > 1 ? `<p>이 업체는 ${p.branch_count}개 지점을 운영합니다.</p>` : ''}
        <div class="loc-btns">
          ${p.map_url ? `<a class="btn btn-ghost" href="${esc(p.map_url)}" target="_blank" rel="noopener">${I('map', 16)}지도에서 열기</a>` : ''}
          ${p.address ? `<button class="btn btn-ghost" id="copyAddr">${I('copy', 16)}주소 복사</button>` : ''}
        </div>
      </div>
    </div>
  </div></section>` : ''}

  <div class="container ad-wrap" style="margin:26px 0"><div data-ad-slot="detail_bottom"></div></div>

  <section class="detail-sec"><div class="container">
    <div class="sec-head"><div><h3 style="margin:0">${esc(T('detail_related_title', '이런 곳은 어떠세요?'))}</h3></div>
      <a class="sec-more" href="list.html${cat ? '?cat=' + esc(cat.slug) : ''}">전체보기 ${I('chevronRight', 14)}</a></div>
    <div class="card-grid" id="relGrid"></div>
  </div></section>

  <div class="sticky-cta" id="stickyCta">
    <div class="container">
      <div class="sc-info">
        <b>${esc(p.name)}</b>
        ${p.benefit_summary ? `<span>${I('gift', 13)}${esc(p.benefit_summary)}</span>` : ''}
      </div>
      <button class="sc-fav" id="scFav" aria-label="찜하기">${I('heart', 19, isFav ? 'fill' : '')}</button>
      ${p.booking_url
      ? `<a class="btn btn-primary" href="${esc(p.booking_url)}" target="_blank" rel="noopener">예약하기</a>`
      : `<a class="btn btn-primary" href="#sec-book">예약 방법 보기</a>`}
    </div>
  </div>`;

  /* ---------- 갤러리 ---------- */
  let gi = 0;
  function showImg(i) {
    if (!gallery.length) return;
    gi = (i + gallery.length) % gallery.length;
    const img = $('#galMain img');
    if (img) { img.style.opacity = '0'; setTimeout(() => { img.src = gallery[gi]; img.style.opacity = '1'; }, 120); }
    const c = $('#galIdx'); if (c) c.textContent = gi + 1;
    $$('#galThumbs img').forEach((t, k) => t.classList.toggle('on', k === gi));
  }
  $$('#galThumbs img').forEach(t => t.addEventListener('click', () => showImg(+t.dataset.i)));
  const gp = $('.gal-arw.prev'), gn = $('.gal-arw.next');
  gp && gp.addEventListener('click', () => showImg(gi - 1));
  gn && gn.addEventListener('click', () => showImg(gi + 1));

  /* ---------- 탭 ---------- */
  const tabEls = $$('#dTabs a');
  tabEls.forEach(a => a.addEventListener('click', e => {
    e.preventDefault();
    const el = document.getElementById(a.dataset.t);
    if (!el) return;
    const off = ($('#dTabs') || {}).offsetHeight || 0;
    window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - off - 12, behavior: 'smooth' });
  }));
  if (tabEls.length && 'IntersectionObserver' in window) {
    const secs = tabEls.map(a => document.getElementById(a.dataset.t)).filter(Boolean);
    const io = new IntersectionObserver(es => {
      es.forEach(x => {
        if (!x.isIntersecting) return;
        tabEls.forEach(a => a.classList.toggle('on', a.dataset.t === x.target.id));
      });
    }, { rootMargin: '-120px 0px -70% 0px' });
    secs.forEach(s => io.observe(s));
  }

  /* ---------- 영상 ---------- */
  if (media.length) ZYKCards.renderMedia($('#pMedia'), media, { [p.id]: p.name });

  /* ---------- 찜 ---------- */
  function syncFav(on) {
    const b = $('#favBtn');
    b.setAttribute('aria-pressed', String(on));
    b.innerHTML = I('heart', 18, on ? 'fill' : '') + `<span>${on ? '찜함' : '찜하기'}</span>`;
    b.classList.toggle('on', on);
    const s = $('#scFav');
    s.innerHTML = I('heart', 19, on ? 'fill' : '');
    s.classList.toggle('on', on);
  }
  $('#favBtn').addEventListener('click', () => {
    const on = ZYKUI.favToggle(p.id); syncFav(on);
    ZYKUI.toast(on ? '찜 목록에 추가했습니다' : '찜을 해제했습니다');
  });
  $('#scFav').addEventListener('click', () => {
    const on = ZYKUI.favToggle(p.id); syncFav(on);
    ZYKUI.toast(on ? '찜 목록에 추가했습니다' : '찜을 해제했습니다');
  });

  /* ---------- 공유 / 복사 ---------- */
  async function copy(text, msg) {
    try { await navigator.clipboard.writeText(text); ZYKUI.toast(msg); }
    catch (e) { prompt(msg, text); }
  }
  $('#shareBtn').addEventListener('click', async () => {
    if (navigator.share) { try { await navigator.share({ title: p.name, url: location.href }); return; } catch (e) { } }
    copy(location.href, '링크를 복사했습니다');
  });
  const cw = $('#copyWx'); cw && cw.addEventListener('click', () => copy(p.wechat_id, '위챗 ID를 복사했습니다'));
  const ca = $('#copyAddr'); ca && ca.addEventListener('click', () => copy(p.address, '주소를 복사했습니다'));

  /* ---------- 스티키 CTA ---------- */
  const cta = $('#stickyCta');
  const hero = $('.detail-cta');
  if ('IntersectionObserver' in window && hero) {
    new IntersectionObserver(es => {
      cta.classList.toggle('on', !es[0].isIntersecting && es[0].boundingClientRect.top < 0);
    }, { threshold: 0 }).observe(hero);
  }

  /* ---------- 관련 업체 ---------- */
  const rel = all.filter(x => x.id !== p.id &&
    (x.category_id === p.category_id || x.region_id === p.region_id)).slice(0, 4);
  ZYKCards.renderPartners($('#relGrid'), rel.length ? rel : all.filter(x => x.id !== p.id).slice(0, 4));

  ZYKUI.renderAds();
})();
