/* =====================================================================
 *  중여커 · 제휴업체 목록
 *  ?cat= (대분류/세부업종) &region= (도시/세부지역) &q= &tag=
 *  &featured=1 &fav=1 &sort=new|name|view
 * ===================================================================*/
(async function () {
  const { $, $$, esc, qs, I } = ZYKUI;
  const st = await ZYKUI.init('list', { cat: qs.get('cat') || '' });
  const partners = await ZYK.selectAll('partners', { orderBy: 'sort' });

  const f = {
    cat: qs.get('cat') || '',
    region: qs.get('region') || '',
    q: (qs.get('q') || '').trim(),
    tag: qs.get('tag') || '',
    featured: qs.get('featured') === '1',
    fav: qs.get('fav') === '1',
    sort: qs.get('sort') || 'sort'
  };

  const catOf = s => st.cats.find(c => c.slug === s);
  const regOf = s => st.regions.find(r => r.slug === s);

  /* --------- 필터 UI --------- */
  function renderFilters() {
    const rootSlug = f.cat ? ZYKUI.rootCatSlug(f.cat) : '';
    const rootCat = catOf(rootSlug);
    const subs = rootCat ? ZYKUI.subCats(rootCat.id) : [];

    const regObj = regOf(f.region);
    const cityObj = regObj ? (regObj.parent_id ? st.regions.find(r => r.id === regObj.parent_id) : regObj) : null;
    const areas = cityObj ? ZYKUI.areasOf(cityObj.id) : [];

    $('#catFilter').innerHTML = [`<button class="tab ${!f.cat ? 'on' : ''}" data-v="">전체</button>`]
      .concat(ZYKUI.topCats().map(c =>
        `<button class="tab ${rootSlug === c.slug ? 'on' : ''}" data-v="${esc(c.slug)}">${esc(c.name)}</button>`)).join('');

    const subRow = $('#subCatRow');
    if (subs.length) {
      subRow.classList.remove('hide');
      $('#subCatFilter').innerHTML = [`<button class="tab sm ${f.cat === rootSlug ? 'on' : ''}" data-v="${esc(rootSlug)}">전체</button>`]
        .concat(subs.map(s2 => `<button class="tab sm ${f.cat === s2.slug ? 'on' : ''}" data-v="${esc(s2.slug)}">${esc(s2.name)}</button>`)).join('');
    } else subRow.classList.add('hide');

    $('#regFilter').innerHTML = [`<button class="tab ${!f.region ? 'on' : ''}" data-v="">전체</button>`]
      .concat(ZYKUI.cities().map(r =>
        `<button class="tab ${cityObj && cityObj.slug === r.slug ? 'on' : ''}" data-v="${esc(r.slug)}">${esc(r.name)}</button>`)).join('');

    const areaRow = $('#subRegRow');
    if (areas.length) {
      areaRow.classList.remove('hide');
      $('#subRegFilter').innerHTML = [`<button class="tab sm ${f.region === cityObj.slug ? 'on' : ''}" data-v="${esc(cityObj.slug)}">전체</button>`]
        .concat(areas.map(a => `<button class="tab sm ${f.region === a.slug ? 'on' : ''}" data-v="${esc(a.slug)}">${esc(a.name)}</button>`)).join('');
    } else areaRow.classList.add('hide');

    $$('#catFilter .tab').forEach(b => b.onclick = () => { f.cat = b.dataset.v; sync(); });
    $$('#subCatFilter .tab').forEach(b => b.onclick = () => { f.cat = b.dataset.v; sync(); });
    $$('#regFilter .tab').forEach(b => b.onclick = () => { f.region = b.dataset.v; sync(); });
    $$('#subRegFilter .tab').forEach(b => b.onclick = () => { f.region = b.dataset.v; sync(); });
  }

  $('#sortSel').value = ['sort', 'new', 'name', 'view'].includes(f.sort) ? f.sort : 'sort';
  $('#sortSel').addEventListener('change', e => { f.sort = e.target.value; sync(); });

  function sync() {
    const p = new URLSearchParams();
    if (f.cat) p.set('cat', f.cat);
    if (f.region) p.set('region', f.region);
    if (f.q) p.set('q', f.q);
    if (f.tag) p.set('tag', f.tag);
    if (f.featured) p.set('featured', '1');
    if (f.fav) p.set('fav', '1');
    if (f.sort && f.sort !== 'sort') p.set('sort', f.sort);
    history.replaceState(null, '', 'list.html' + (p.toString() ? '?' + p : ''));
    ZYKUI.state.activeCat = f.cat;
    ZYKUI.setActiveCat(f.cat);
    renderFilters();
    draw();
  }

  /* --------- 렌더 --------- */
  function draw() {
    const catObj = catOf(f.cat);
    const regObj = regOf(f.region);
    const favIds = ZYKUI.favGet();

    let list = partners.slice();
    if (catObj) { const ids = ZYKUI.catIds(f.cat); list = list.filter(p => ids.includes(p.category_id)); }
    if (regObj) { const ids = ZYKUI.regionIds(f.region); list = list.filter(p => ids.includes(p.region_id)); }
    if (f.featured) list = list.filter(p => p.is_featured);
    if (f.fav) list = list.filter(p => favIds.includes(p.id));
    if (f.tag) {
      const t = f.tag.toLowerCase();
      const tagName = { photo: '인생샷', healing: '힐링', exclusive: '단독', new: '신규', korean: '한국어', late: '심야' }[t] || t;
      list = list.filter(p => {
        const tags = (Array.isArray(p.tags) ? p.tags : []).join(' ');
        const benefit = (p.benefit_summary || '') + ' ' + (p.benefit_detail || '');
        return tags.includes(tagName) ||
          (t === 'exclusive' && /단독/.test(benefit)) ||
          (t === 'new' && String(p.badge || '').toUpperCase() === 'NEW');
      });
    }
    if (f.q) {
      const q = f.q.toLowerCase();
      list = list.filter(p => [p.name, p.name_cn, p.summary, p.description, p.region_label,
        p.category_label, p.benefit_summary, p.benefit_detail, p.address,
        (Array.isArray(p.tags) ? p.tags.join(' ') : '')]
        .filter(Boolean).join(' ').toLowerCase().includes(q));
    }

    if (f.sort === 'new') list.sort((a, b) => String(b.created_at || '').localeCompare(String(a.created_at || '')));
    else if (f.sort === 'name') list.sort((a, b) => String(a.name).localeCompare(String(b.name), 'ko'));
    else if (f.sort === 'view') list.sort((a, b) => (b.view_count || 0) - (a.view_count || 0));

    let title = '전체 제휴업체';
    if (f.fav) title = '찜한 제휴업체';
    else if (f.featured) title = '중여커 추천 업체';
    else if (catObj && regObj) title = `${regObj.name} ${catObj.name}`;
    else if (catObj) title = catObj.name;
    else if (regObj) title = regObj.name;
    if (f.q) title = `'${f.q}' 검색 결과`;
    $('#pageTitle').textContent = title;

    const rootCat = f.cat ? catOf(ZYKUI.rootCatSlug(f.cat)) : null;
    const cityObj = regObj ? (regObj.parent_id ? st.regions.find(r => r.id === regObj.parent_id) : regObj) : null;
    const crumbs = [`<a href="index.html">${I('home', 13)}</a>`];
    if (rootCat) crumbs.push(`<a href="list.html?cat=${esc(rootCat.slug)}">${esc(rootCat.name)}</a>`);
    if (catObj && rootCat && catObj.slug !== rootCat.slug) crumbs.push(`<a href="list.html?cat=${esc(catObj.slug)}">${esc(catObj.name)}</a>`);
    if (cityObj) crumbs.push(`<a href="list.html?region=${esc(cityObj.slug)}">${esc(cityObj.name)}</a>`);
    if (regObj && cityObj && regObj.slug !== cityObj.slug) crumbs.push(`<span>${esc(regObj.name)}</span>`);
    if (crumbs.length === 1) crumbs.push('<span>제휴업체</span>');
    $('#bc').innerHTML = crumbs.join(I('chevronRight', 12));

    document.title = title + ' - 중여커';
    $('#cnt').textContent = list.length;

    const S = st.settings || {};
    ZYKCards.renderPartners($('#grid'), list,
      f.fav ? (S.fav_empty_text || '아직 찜한 제휴업체가 없습니다.')
            : (S.list_empty_text || '조건에 맞는 제휴업체가 없습니다.'));
  }

  renderFilters();
  draw();
})();
