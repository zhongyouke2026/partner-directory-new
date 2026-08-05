/* =====================================================================
 *  중여커 · 메인 페이지
 * ===================================================================*/
(async function () {
  const { $, $$, esc, I, extAttr } = ZYKUI;
  const st = await ZYKUI.init('main');
  const s = st.settings || {};

  const [banners, partners, media, notices, series] = await Promise.all([
    ZYK.selectAll('banners', { orderBy: 'sort' }),
    ZYK.selectAll('partners', { orderBy: 'sort' }),
    ZYK.selectAll('partner_media', { orderBy: 'sort' }),
    ZYK.selectAll('notices', { orderBy: 'created_at', asc: false, limit: 5 }),
    ZYK.selectAll('series_cards', { orderBy: 'sort' })
  ]);

  const pMap = {}; partners.forEach(p => pMap[p.id] = p.name);

  const setText = (id, v) => { const el = $('#' + id); if (el && v) el.textContent = v; };
  setText('secFeaturedTitle', s.sec_featured_title); setText('secFeaturedSub', s.sec_featured_sub);
  setText('secMediaTitle', s.sec_media_title); setText('secMediaSub', s.sec_media_sub);
  setText('secRegionTitle', s.sec_region_title); setText('secRegionSub', s.sec_region_sub);
  setText('secEventTitle', s.sec_event_title); setText('secEventSub', s.sec_event_sub);
  $$('.sec-more').forEach(a => { if (!a.querySelector('svg')) a.innerHTML = a.textContent.replace('›', '').trim() + I('chevronRight', 14); });

  /* ---------------- 히어로 ---------------- */
  const heroes = banners.filter(b => b.type === 'hero');
  const track = $('#heroTrack'), dots = $('#heroDots');
  $('#heroPrev').innerHTML = I('chevronLeft', 22);
  $('#heroNext').innerHTML = I('chevronRight', 22);

  if (!heroes.length) {
    $('#hero').style.display = 'none';
  } else {
    const mob = window.innerWidth <= 768;
    track.innerHTML = heroes.map(b => {
      const img = (mob && b.image_url_mobile) ? b.image_url_mobile : b.image_url;
      const style = `background-color:${esc(b.bg_color || '#4A92BD')};${img ? `background-image:url('${esc(img)}');` : ''}`;
      return `<a class="hero-slide" style="${style}" href="${esc(b.link || '#')}" ${extAttr(b.link)}>
        <div class="container">
          ${b.label ? `<span class="hero-label">${esc(b.label)}</span>` : ''}
          <h2>${esc(b.title || '')}</h2>
          ${b.subtitle ? `<p>${esc(b.subtitle)}</p>` : ''}
          <span class="btn-hero">자세히 보기 ${I('chevronRight', 15)}</span>
        </div></a>`;
    }).join('');
    dots.innerHTML = `<div class="hero-dots">${heroes.map((_, i) =>
      `<button class="hero-dot ${i === 0 ? 'on' : ''}" data-i="${i}" aria-label="${i + 1}번 배너"></button>`).join('')}</div>
      <button class="hero-pause" id="heroPause" aria-label="자동재생 정지">${I('minus', 15)}</button>
      <span class="hero-num"><b id="heroNum">1</b> / ${heroes.length}</span>`;

    let idx = 0, timer = null, playing = true;
    const go = i => {
      idx = (i + heroes.length) % heroes.length;
      track.style.transform = `translateX(-${idx * 100}%)`;
      $$('.hero-dot').forEach((d, k) => d.classList.toggle('on', k === idx));
      $$('.hero-slide').forEach((el, k) => el.classList.toggle('on', k === idx));
      $('#heroNum').textContent = idx + 1;
    };
    const play = () => { clearInterval(timer); if (heroes.length > 1 && playing) timer = setInterval(() => go(idx + 1), 5000); };
    $('#heroPrev').addEventListener('click', e => { e.preventDefault(); go(idx - 1); play(); });
    $('#heroNext').addEventListener('click', e => { e.preventDefault(); go(idx + 1); play(); });
    $$('.hero-dot').forEach(d => d.addEventListener('click', () => { go(+d.dataset.i); play(); }));
    $('#heroPause').addEventListener('click', () => {
      playing = !playing;
      $('#heroPause').innerHTML = I(playing ? 'minus' : 'play', 15, playing ? '' : 'fill');
      $('#heroPause').setAttribute('aria-label', playing ? '자동재생 정지' : '자동재생 시작');
      play();
    });
    $('#hero').addEventListener('mouseenter', () => clearInterval(timer));
    $('#hero').addEventListener('mouseleave', play);
    let sx = 0;
    track.addEventListener('touchstart', e => { sx = e.touches[0].clientX; clearInterval(timer); }, { passive: true });
    track.addEventListener('touchend', e => {
      const dx = e.changedTouches[0].clientX - sx;
      if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
      play();
    });
    go(0); play();
  }

  /* ---------------- 퀵 카테고리 ---------------- */
  $('#quickCat').innerHTML = ZYKUI.topCats().filter(c => c.show_in_quick !== false).map(c => `
    <li class="reveal"><a href="${esc(c.link || 'list.html?cat=' + c.slug)}">
      <span class="ci">${c.image_url ? `<img src="${esc(c.image_url)}" alt="">` : I(ZYKIcon.has(c.icon) ? c.icon : 'tag', 26)}</span>
      <span class="cn">${esc(c.name)}</span></a></li>`).join('');

  /* ---------------- 인기 키워드 ---------------- */
  $('#keywordList').innerHTML = st.keywords.length
    ? `<span class="kw-label">${I('search', 15)}인기 키워드</span>` +
    st.keywords.map(k => `<a class="tab" href="${esc(k.link || '#')}">${esc(k.label)}</a>`).join('')
    : '';

  /* ---------------- 추천 업체 ---------------- */
  const featured = partners.filter(p => p.is_featured);
  const featBase = featured.length ? featured : partners;
  const featCats = ZYKUI.topCats().filter(c =>
    featBase.some(p => ZYKUI.catIds(c.slug).includes(p.category_id)));
  $('#featTabs').innerHTML = [`<button class="tab on" data-cat="">전체</button>`]
    .concat(featCats.map(c => `<button class="tab" data-cat="${esc(c.slug)}">${esc(c.name)}</button>`)).join('');
  const drawFeat = slug => {
    const ids = slug ? ZYKUI.catIds(slug) : null;
    const list = (ids ? featBase.filter(p => ids.includes(p.category_id)) : featBase).slice(0, 8);
    ZYKCards.renderPartners($('#featGrid'), list, '추천 업체를 등록해 주세요.');
  };
  drawFeat('');
  $$('#featTabs .tab').forEach(t => t.addEventListener('click', () => {
    $$('#featTabs .tab').forEach(x => x.classList.remove('on'));
    t.classList.add('on'); drawFeat(t.dataset.cat);
  }));

  /* ---------------- 영상 ---------------- */
  const mainMedia = media.filter(m => m.show_on_main);
  const mediaList = (mainMedia.length ? mainMedia : media).slice(0, 12);
  if (!mediaList.length) $('#mediaSection').style.display = 'none';
  else ZYKCards.renderMedia($('#mediaScroll'), mediaList, pMap);

  /* ---------------- 지역별 ---------------- */
  const allCities = ZYKUI.cities();
  const regs = allCities.filter(r => partners.some(p => ZYKUI.regionIds(r.slug).includes(p.region_id)));
  const regTabs = regs.length ? regs : allCities.slice(0, 8);
  $('#regionTabs').innerHTML = [`<button class="tab on" data-reg="">전체</button>`]
    .concat(regTabs.map(r => `<button class="tab" data-reg="${esc(r.slug)}">${esc(r.name)}</button>`)).join('');
  const drawReg = slug => {
    const ids = slug ? ZYKUI.regionIds(slug) : null;
    const list = (ids ? partners.filter(p => ids.includes(p.region_id)) : partners).slice(0, 8);
    ZYKCards.renderPartners($('#regionGrid'), list, '해당 지역에 등록된 제휴업체가 없습니다.');
  };
  drawReg('');
  $$('#regionTabs .tab').forEach(t => t.addEventListener('click', () => {
    $$('#regionTabs .tab').forEach(x => x.classList.remove('on'));
    t.classList.add('on'); drawReg(t.dataset.reg);
  }));

  /* ---------------- 기획전 ---------------- */
  const events = banners.filter(b => b.type === 'event');
  $('#eventGrid').innerHTML = events.length ? events.map(b =>
    `<a class="ecard reveal" style="background-color:${esc(b.bg_color || '#4A92BD')};${b.image_url ? `background-image:url('${esc(b.image_url)}');` : ''}"
      href="${esc(b.link || '#')}" ${extAttr(b.link)}>
      <div><h4>${esc(b.title || '')}</h4>${b.subtitle ? `<p>${esc(b.subtitle)}</p>` : ''}</div>
      <div class="ecard-foot">${b.period_text ? `<span class="period">${esc(b.period_text)}</span>` : '<span></span>'}${I('arrowRight', 18)}</div></a>`
  ).join('') : `<div class="empty" style="grid-column:1/-1">등록된 기획전이 없습니다.</div>`;

  /* ---------------- 시리즈 ---------------- */
  if (series.length) {
    $('#seriesSection').style.display = '';
    $('#seriesTitle').textContent = series[0].section_title || '중여커 시리즈';
    $('#seriesList').innerHTML = series.map(x =>
      `<a class="scard reveal" href="${esc(x.link || '#')}" target="${esc(x.link_target || '_self')}" ${extAttr(x.link)}
        style="${x.image_url ? `background-image:url('${esc(x.image_url)}')` : ''}">
        <b>${esc(x.title || '')}</b>
        ${x.subtitle ? `<p>${esc(x.subtitle)}</p>` : ''}
        <span class="cap">${esc(x.caption || '')}${I('chevronRight', 14)}</span></a>`).join('');
  }

  /* ---------------- 공지 ---------------- */
  $('#noticeList').innerHTML = notices.length ? notices.map(n => `
    <li>
      <span class="cat">${esc(n.category || '공지')}</span>
      <a class="tt" href="notice.html#n-${esc(n.id)}">${n.is_pinned ? I('pin', 13) : ''}${esc(n.title)}</a>
      <span class="dt">${(n.created_at || '').slice(0, 10)}</span>
    </li>`).join('') : `<li><span class="tt">등록된 공지가 없습니다.</span></li>`;

  /* ---------------- 고객센터 ---------------- */
  $('#csBox').innerHTML = `
    <h4>${esc(s.cs_title || '중여커 고객센터')}</h4>
    ${s.cs_phone ? `<div class="cs-tel">${I('phone', 22)}${esc(s.cs_phone)}</div>` : ''}
    ${s.cs_wechat_id ? `<div class="cs-tel sm">${I('chat', 20)}${esc(s.cs_wechat_id)}</div>` : ''}
    <div class="cs-meta">${I('clock', 14)}${esc(s.cs_hours || '')}</div>
    <div class="cs-btns">
      ${s.cs_kakao_url ? `<a href="${esc(s.cs_kakao_url)}" target="_blank" rel="noopener">${I('chat', 16)}카카오 문의</a>` : ''}
      ${s.cs_email ? `<a href="mailto:${esc(s.cs_email)}">${I('mail', 16)}이메일 문의</a>` : ''}
      <a href="page.html?slug=partner">${I('gift', 16)}${esc(s.partner_cta_text || '제휴 신청')}</a>
    </div>`;

  ZYKUI.observeReveal();
})();
