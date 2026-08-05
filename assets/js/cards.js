/* =====================================================================
 *  중여커 · 카드 렌더 공통
 * ===================================================================*/
(function () {
  const esc = ZYKUI.esc;
  const I = ZYKUI.I;

  function partnerHref(p) {
    if (p.external_url) return p.external_url;
    return 'detail.html?id=' + encodeURIComponent(p.id);
  }
  function partnerTarget(p) { return p.external_url ? (p.link_target || '_blank') : '_self'; }
  function toTags(v) {
    if (Array.isArray(v)) return v;
    try { return JSON.parse(v || '[]'); } catch (e) { return []; }
  }

  function partnerCard(p) {
    const fav = ZYKUI.favGet().includes(p.id);
    const tags = toTags(p.tags);
    const thumb = p.thumbnail_url
      ? `<img src="${esc(p.thumbnail_url)}" alt="${esc(p.name)}" loading="lazy">`
      : `<div class="ph">${I('store', 40)}</div>`;
    const href = esc(partnerHref(p));
    const tgt = esc(partnerTarget(p));
    const rel = p.external_url ? 'rel="noopener"' : '';
    return `<article class="pcard reveal">
      <a class="pcard-img" href="${href}" target="${tgt}" ${rel} aria-label="${esc(p.name)}">
        <div class="pcard-thumb">
          ${thumb}
          ${p.badge ? `<span class="pcard-badge">${esc(p.badge)}</span>` : ''}
          ${p.external_url ? `<span class="pcard-ext">${I('external', 13)}</span>` : ''}
          ${p.benefit_summary ? `<span class="pcard-benefit">${I('gift', 14)}${esc(p.benefit_summary)}</span>` : ''}
        </div>
      </a>
      <button class="pcard-like ${fav ? 'on' : ''}" data-fav="${esc(p.id)}" aria-label="찜하기" aria-pressed="${fav}">
        ${I('heart', 17, fav ? 'fill' : '')}
      </button>
      <a href="${href}" target="${tgt}" ${rel} class="pcard-body">
        <div class="pcard-meta">
          ${p.region_label ? `<span>${I('mapPin', 12)}${esc(p.region_label)}</span>` : ''}
          ${p.category_label ? `<span>${esc(p.category_label)}</span>` : ''}
          ${p.branch_count > 1 ? `<span>지점 ${p.branch_count}</span>` : ''}
        </div>
        <h4 class="pcard-title">${esc(p.name)}</h4>
        <p class="pcard-desc">${esc(p.summary || p.description || '')}</p>
        ${tags.length ? `<div class="pcard-tags">${tags.slice(0, 3).map(t => `<b>${esc(t)}</b>`).join('')}</div>` : ''}
        <span class="pcard-go">자세히 보기 ${I('chevronRight', 14)}</span>
      </a>
    </article>`;
  }

  function renderPartners(host, list, emptyMsg) {
    if (!host) return;
    if (!list || !list.length) {
      host.innerHTML = `<div class="empty" style="grid-column:1/-1"><div class="ei">${I('search', 42)}</div>
        <p>${esc(emptyMsg || '등록된 제휴업체가 없습니다.')}</p></div>`;
      return;
    }
    host.innerHTML = list.map(partnerCard).join('');
    bindFav(host);
    ZYKUI.observeReveal(host);
  }

  function bindFav(host) {
    ZYKUI.$$('[data-fav]', host).forEach(btn => {
      btn.addEventListener('click', e => {
        e.preventDefault(); e.stopPropagation();
        const on = ZYKUI.favToggle(btn.dataset.fav);
        btn.classList.toggle('on', on);
        btn.setAttribute('aria-pressed', String(on));
        btn.innerHTML = I('heart', 17, on ? 'fill' : '');
        btn.classList.remove('pop'); void btn.offsetWidth; btn.classList.add('pop');
        ZYKUI.toast(on ? '찜 목록에 추가했습니다' : '찜을 해제했습니다');
      });
    });
  }

  function mediaCard(m, partnerName) {
    const info = ZYKUI.parseMedia(m.url, m.platform);
    const thumb = m.thumbnail_url || info.thumb;
    return `<div class="mcard reveal" data-video="${esc(m.url)}" data-plat="${esc(m.platform || 'auto')}" role="button" tabindex="0" aria-label="${esc(m.title || '영상 재생')}">
      ${thumb ? `<img src="${esc(thumb)}" alt="" loading="lazy">` : `<div class="mcard-ph">${I(info.icon, 34)}</div>`}
      <span class="mcard-plat">${I(info.icon, 13)}${esc(info.label)}</span>
      <span class="mcard-play">${I('play', 24, 'fill')}</span>
      <div class="mcard-info">
        <b>${esc(m.title || partnerName || '홍보 영상')}</b>
        ${partnerName ? `<span>${esc(partnerName)}</span>` : ''}
      </div>
    </div>`;
  }

  function renderMedia(host, list, partnerMap) {
    if (!host) return;
    if (!list || !list.length) {
      host.innerHTML = `<div class="empty"><div class="ei">${I('video', 42)}</div><p>등록된 영상이 없습니다.</p></div>`;
      return;
    }
    host.innerHTML = list.map(m => mediaCard(m, partnerMap ? partnerMap[m.partner_id] : '')).join('');
    ZYKUI.$$('[data-video]', host).forEach(el => {
      const open = () => ZYKUI.openVideo(el.dataset.video, el.dataset.plat);
      el.addEventListener('click', open);
      el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
    });
    ZYKUI.observeReveal(host);
  }

  window.ZYKCards = { partnerCard, renderPartners, mediaCard, renderMedia, bindFav, partnerHref, partnerTarget, toTags };
})();
