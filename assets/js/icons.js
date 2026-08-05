/* =====================================================================
 *  중여커 · 아이콘 세트 (인라인 SVG, 선 아이콘)
 *  사용법:  ZYKIcon('search')            → 기본 24px
 *          ZYKIcon('heart', 20)          → 크기 지정
 *          ZYKIcon('play', 20, 'fill')   → 채움형
 *  관리자에서 업종 아이콘 지정 시 아래 이름을 그대로 입력하면 됩니다.
 * ===================================================================*/
(function () {
  const P = {
    /* 기본 UI */
    search: '<circle cx="11" cy="11" r="7"/><path d="M20.5 20.5 16.2 16.2"/>',
    menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
    close: '<path d="M6 6l12 12M18 6L6 18"/>',
    plus: '<path d="M12 5v14M5 12h14"/>',
    minus: '<path d="M5 12h14"/>',
    check: '<path d="M4 12.5 9.5 18 20 6.5"/>',
    chevronDown: '<path d="M6 9.5l6 6 6-6"/>',
    chevronRight: '<path d="M9.5 5.5l6.5 6.5-6.5 6.5"/>',
    chevronLeft: '<path d="M14.5 5.5 8 12l6.5 6.5"/>',
    arrowUp: '<path d="M12 20V4.5"/><path d="M5 11.5 12 4.5l7 7"/>',
    arrowRight: '<path d="M4 12h15"/><path d="M13 6l6 6-6 6"/>',
    external: '<path d="M14 4h6v6"/><path d="M20 4 11 13"/><path d="M18 14v5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1h5"/>',

    /* 액션 */
    heart: '<path d="M12 20.6 4.2 13a4.8 4.8 0 0 1 6.8-6.8l1 1 1-1A4.8 4.8 0 1 1 19.8 13z"/>',
    share: '<path d="M4 12.5V19a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6.5"/><path d="M12 3v13"/><path d="M8 7l4-4 4 4"/>',
    copy: '<rect x="9" y="9" width="12" height="12" rx="2.2"/><path d="M5.5 15H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v.5"/>',
    filter: '<path d="M4 5h16l-6.4 7.7V19l-3.2 1.6v-7.9z"/>',
    download: '<path d="M12 3.5v11"/><path d="M7.5 10 12 14.5 16.5 10"/><path d="M4 17v2.5a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1V17"/>',
    upload: '<path d="M12 20.5v-11"/><path d="M7.5 14 12 9.5 16.5 14"/><path d="M4 7V4.5a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1V7"/>',
    refresh: '<path d="M20 11a8 8 0 1 0-.7 4.5"/><path d="M20 4.5V11h-6.5"/>',

    /* 미디어 */
    play: '<path d="M8 5.2 19 12 8 18.8z"/>',
    video: '<rect x="2.5" y="5.5" width="13.5" height="13" rx="3"/><path d="M16 11 22 7.5v9L16 13z"/>',
    camera: '<path d="M3 8.5a2 2 0 0 1 2-2h2.2l1.3-2h7l1.3 2H19a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><circle cx="12" cy="13" r="3.6"/>',
    image: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><circle cx="8.5" cy="10" r="1.8"/><path d="M4 17l5-5 4.5 4.5L16.5 13 20 16.5"/>',

    /* 정보 */
    mapPin: '<path d="M20 10.2c0 5.8-8 11.8-8 11.8S4 16 4 10.2a8 8 0 1 1 16 0z"/><circle cx="12" cy="10" r="2.8"/>',
    clock: '<circle cx="12" cy="12" r="8.8"/><path d="M12 6.8V12l3.6 2.2"/>',
    phone: '<path d="M20.8 16.9v2.5a2 2 0 0 1-2.2 2A19.4 19.4 0 0 1 3.6 5.4 2 2 0 0 1 5.6 3.2h2.5a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L9.2 11a15.7 15.7 0 0 0 5.8 5.8l1.2-1.1a2 2 0 0 1 2.1-.5c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z"/>',
    mail: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3.6 6.8 12 13l8.4-6.2"/>',
    chat: '<path d="M20.8 11.6a8.2 8.2 0 0 1-8.8 8.2 9 9 0 0 1-3.4-.7L3.4 21l1.9-4.6a8.1 8.1 0 0 1-1.1-4.8A8.2 8.2 0 0 1 12.4 3.4a8.2 8.2 0 0 1 8.4 8.2z"/>',
    qr: '<rect x="3.5" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="14" y="3.5" width="6.5" height="6.5" rx="1.2"/><rect x="3.5" y="14" width="6.5" height="6.5" rx="1.2"/><path d="M14 14h3v3h-3zM20.5 14v3M14 20.5h6.5"/>',
    pin: '<path d="M9 3h6l-1 6 4 3v2H6v-2l4-3z"/><path d="M12 14v7"/>',
    bell: '<path d="M18 9a6 6 0 1 0-12 0c0 5-2 6.5-2 6.5h16S18 14 18 9z"/><path d="M10.3 19.5a2 2 0 0 0 3.4 0"/>',
    info: '<circle cx="12" cy="12" r="8.8"/><path d="M12 11v5.5"/><circle cx="12" cy="7.9" r=".9" fill="currentColor" stroke="none"/>',

    /* 커머스 */
    gift: '<rect x="3.2" y="8" width="17.6" height="4.2" rx="1.2"/><path d="M5 12.2V19a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6.8"/><path d="M12 8v13"/><path d="M12 8S10.6 3.2 8.2 3.2a2.4 2.4 0 0 0 0 4.8zM12 8s1.4-4.8 3.8-4.8a2.4 2.4 0 0 1 0 4.8z"/>',
    ticket: '<path d="M3.2 8.2a2 2 0 0 1 2-2h13.6a2 2 0 0 1 2 2V10a2 2 0 0 0 0 4v1.8a2 2 0 0 1-2 2H5.2a2 2 0 0 1-2-2V14a2 2 0 0 0 0-4z"/><path d="M13.5 6.2v11.6"/>',
    store: '<path d="M4.2 9.5h15.6V20a1 1 0 0 1-1 1H5.2a1 1 0 0 1-1-1z"/><path d="M3 9.5 4.6 4h14.8L21 9.5"/><path d="M9.3 21v-5.5h5.4V21"/>',
    tag: '<path d="M11 3.5H20V12.5L12 20.5a1.5 1.5 0 0 1-2.1 0L3.5 14.1a1.5 1.5 0 0 1 0-2.1z"/><circle cx="16.3" cy="7.7" r="1.3"/>',
    star: '<path d="M12 3.8l2.6 5.4 5.9.8-4.3 4.1 1 5.9-5.2-2.8-5.2 2.8 1-5.9L3.5 10l5.9-.8z"/>',

    /* 내비 */
    home: '<path d="M3.2 10.6 12 3.4l8.8 7.2"/><path d="M5.4 9.4V20a1 1 0 0 0 1 1h11.2a1 1 0 0 0 1-1V9.4"/><path d="M9.8 21v-6h4.4v6"/>',
    grid: '<rect x="3.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="3.5" width="7" height="7" rx="1.6"/><rect x="3.5" y="13.5" width="7" height="7" rx="1.6"/><rect x="13.5" y="13.5" width="7" height="7" rx="1.6"/>',
    list: '<path d="M8 6h13M8 12h13M8 18h13"/><circle cx="4" cy="6" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="12" r="1.2" fill="currentColor" stroke="none"/><circle cx="4" cy="18" r="1.2" fill="currentColor" stroke="none"/>',
    user: '<circle cx="12" cy="8" r="4.2"/><path d="M4.5 21a7.5 7.5 0 0 1 15 0"/>',
    settings: '<circle cx="12" cy="12" r="3.2"/><path d="M19.4 14.4a1.6 1.6 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.6 1.6 0 0 0-2.7 1.1V20a2 2 0 1 1-4 0v-.1a1.6 1.6 0 0 0-2.8-1.1l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.6 1.6 0 0 0-1.1-2.7H4a2 2 0 1 1 0-4h.1a1.6 1.6 0 0 0 1.1-2.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.6 1.6 0 0 0 2.8-1.1V4a2 2 0 1 1 4 0v.1a1.6 1.6 0 0 0 2.7 1.1l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.6 1.6 0 0 0 1.1 2.7h.1a2 2 0 1 1 0 4h-.1a1.6 1.6 0 0 0-1.1 1.1z"/>',
    chart: '<path d="M4 20h16"/><rect x="5" y="11" width="3.6" height="7" rx="1"/><rect x="10.2" y="6.5" width="3.6" height="11.5" rx="1"/><rect x="15.4" y="14" width="3.6" height="4" rx="1"/>',
    layout: '<rect x="3" y="4" width="18" height="16" rx="2.5"/><path d="M3 9.5h18M9 9.5V20"/>',
    file: '<path d="M14 3.5H7a2 2 0 0 0-2 2v13a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8.5z"/><path d="M14 3.5V8.5h5"/>',
    megaphone: '<path d="M4 10v4a1.5 1.5 0 0 0 1.5 1.5H8l8 4.5V5.5L8 10H5.5A1.5 1.5 0 0 0 4 11.5z"/><path d="M19 9.5a3.5 3.5 0 0 1 0 5"/>',
    window: '<rect x="3" y="4.5" width="18" height="15" rx="2.5"/><path d="M3 8.8h18"/><circle cx="6.4" cy="6.6" r=".8" fill="currentColor" stroke="none"/>',
    film: '<rect x="3" y="5" width="18" height="14" rx="2.5"/><path d="M3 9.5h18M3 14.5h18M8 5v14M16 5v14"/>',
    bookmark: '<path d="M6.5 3.5h11a1 1 0 0 1 1 1V21l-6.5-4-6.5 4V4.5a1 1 0 0 1 1-1z"/>',
    link: '<path d="M10.5 13.5a4.5 4.5 0 0 0 6.4 0l2.6-2.6a4.5 4.5 0 0 0-6.4-6.4l-1.5 1.5"/><path d="M13.5 10.5a4.5 4.5 0 0 0-6.4 0l-2.6 2.6a4.5 4.5 0 0 0 6.4 6.4l1.5-1.5"/>',
    map: '<path d="M9 4.5 3.5 6.8V20l5.5-2.3 6 2.3 5.5-2.3V4.5L15 6.8z"/><path d="M9 4.5v13M15 6.8v13"/>',
    globe: '<circle cx="12" cy="12" r="8.8"/><path d="M3.5 12h17"/><path d="M12 3.2a13 13 0 0 1 0 17.6 13 13 0 0 1 0-17.6z"/>',

    /* SNS */
    instagram: '<rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17" cy="7" r="1.1" fill="currentColor" stroke="none"/>',
    youtube: '<rect x="2.5" y="5.5" width="19" height="13" rx="4.2"/><path d="M10.3 9.2v5.6L15.4 12z"/>',
    music: '<circle cx="7.5" cy="17.5" r="3"/><path d="M10.5 17.5V4.5c1.8 3 3.6 4.2 6 4.5"/>',
    book: '<path d="M4 5.2A2.2 2.2 0 0 1 6.2 3H20v14.6H6.2A2.2 2.2 0 0 0 4 19.8z"/><path d="M4 19.8A2.2 2.2 0 0 1 6.2 17.6H20V21H6.2A2.2 2.2 0 0 1 4 18.8z"/>',
    pencil: '<path d="M4 20h4.2L20.2 8a2 2 0 0 0 0-2.8l-1.4-1.4a2 2 0 0 0-2.8 0L4 15.8z"/><path d="M15 5.5 18.5 9"/>',

    /* 업종 */
    beauty: '<circle cx="6.2" cy="6.2" r="2.6"/><circle cx="6.2" cy="17.8" r="2.6"/><path d="M8.4 7.6 20 18M8.4 16.4 20 6"/>',
    wellness: '<path d="M12 21c0-5 3.6-8.8 8.8-8.8C20.8 17.2 17.2 21 12 21z"/><path d="M12 21c0-5-3.6-8.8-8.8-8.8C3.2 17.2 6.8 21 12 21z"/><path d="M12 21c-2.2-4-2.2-8.4 0-12.4 2.2 4 2.2 8.4 0 12.4z"/>',
    activity: '<path d="M11 3l1.9 5L18 9.9l-5.1 1.9L11 17l-1.9-5.2L4 9.9 9.1 8z"/><path d="M18.2 14.4l.9 2.3 2.3.9-2.3.9-.9 2.3-.9-2.3-2.3-.9 2.3-.9z"/>',
    food: '<path d="M3.4 11.2h17.2a8.6 8.6 0 0 1-17.2 0z"/><path d="M2.4 20.2h19.2"/><path d="M9 7.8c0-1.6 1-2.2 1-3.4M13.4 7.8c0-1.6 1-2.2 1-3.4"/>',
    shopping: '<path d="M5 7.5h14l1 12.5a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1z"/><path d="M9 10.5v-4a3 3 0 0 1 6 0v4"/>',
    stay: '<rect x="4.2" y="3.2" width="15.6" height="17.6" rx="2"/><path d="M8.6 7.4h2M13.4 7.4h2M8.6 11.4h2M13.4 11.4h2M10.4 20.8v-4.4h3.2v4.4"/>',
    tour: '<rect x="3.2" y="4.2" width="17.6" height="11.6" rx="2.4"/><path d="M3.2 10.2h17.6"/><circle cx="7.6" cy="18.6" r="1.9"/><circle cx="16.4" cy="18.6" r="1.9"/>'
  };

  /* 이모지 → 아이콘 이름 자동 매핑 (기존 데이터 호환) */
  const EMOJI = {
    '💄': 'beauty', '💆': 'wellness', '✨': 'activity', '🍜': 'food', '🛍️': 'shopping',
    '🛍': 'shopping', '🏨': 'stay', '🚐': 'tour', '🏬': 'store', '🎁': 'gift', '🎫': 'ticket',
    '📍': 'mapPin', '🔍': 'search', '🤍': 'heart', '❤️': 'heart', '▶️': 'play', '💬': 'chat',
    '📱': 'video', '📷': 'camera', '📕': 'book', '🎵': 'music', '📝': 'pencil', '🏠': 'home',
    '🗂️': 'grid', '📊': 'chart', '⚙️': 'settings', '📢': 'megaphone', '📣': 'megaphone',
    '🖼️': 'image', '🪟': 'window', '🎞️': 'film', '🔖': 'bookmark', '🔗': 'link',
    '📄': 'file', '📑': 'list', '📲': 'qr', '🗺️': 'map', '📋': 'copy', '📌': 'pin', '🏷️': 'tag'
  };

  function icon(name, size, mode) {
    const key = P[name] ? name : (EMOJI[name] || null);
    const d = key ? P[key] : null;
    const s = size || 24;
    if (!d) {
      // 알 수 없는 값 → 원문 그대로 (관리자가 직접 넣은 이미지 URL 등)
      if (/^https?:|^\//.test(String(name || ''))) return `<img src="${name}" alt="" style="width:${s}px;height:${s}px;object-fit:contain">`;
      return `<span class="zi-txt">${name == null ? '' : name}</span>`;
    }
    const fill = mode === 'fill' ? 'currentColor' : 'none';
    const stroke = mode === 'fill' ? 'none' : 'currentColor';
    return `<svg class="zi" viewBox="0 0 24 24" width="${s}" height="${s}" fill="${fill}" stroke="${stroke}"
      stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">${d}</svg>`;
  }

  icon.names = Object.keys(P);
  icon.has = n => !!(P[n] || EMOJI[n]);
  window.ZYKIcon = icon;
})();
