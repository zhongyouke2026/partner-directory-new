/* =====================================================================
 *  중여커 · Supabase 데이터 레이어
 *  - Supabase 미설정 시 데모 데이터로 자동 폴백 (로컬에서 바로 확인 가능)
 * ===================================================================*/
(function () {
  const CFG = window.ZYK_CONFIG || {};
  const configured =
    CFG.SUPABASE_URL &&
    CFG.SUPABASE_ANON_KEY &&
    !CFG.SUPABASE_URL.includes('YOUR-PROJECT-REF') &&
    !CFG.SUPABASE_ANON_KEY.includes('YOUR-ANON-KEY');

  let sb = null;
  if (configured && window.supabase) {
    sb = window.supabase.createClient(CFG.SUPABASE_URL, CFG.SUPABASE_ANON_KEY);
  }

  /* ================= 데모 데이터 ================= */

  /* 도시 */
  const CITIES = [
    ['상하이', 'shanghai', '上海'], ['베이징', 'beijing', '北京'], ['광저우', 'guangzhou', '广州'],
    ['선전', 'shenzhen', '深圳'], ['항저우', 'hangzhou', '杭州'], ['칭다오', 'qingdao', '青岛'],
    ['청두', 'chengdu', '成都'], ['시안', 'xian', '西安'], ['충칭', 'chongqing', '重庆'],
    ['홍콩', 'hongkong', '香港']
  ];
  /* 세부 지역 [이름, slug, 중문, 상위도시slug] */
  const AREAS = [
    ['징안구', 'sh-jingan', '静安区', 'shanghai'], ['황푸구', 'sh-huangpu', '黄浦区', 'shanghai'],
    ['푸둥', 'sh-pudong', '浦东新区', 'shanghai'], ['홍차오', 'sh-hongqiao', '虹桥', 'shanghai'],
    ['구베이', 'sh-gubei', '古北', 'shanghai'],
    ['왕푸징', 'bj-wangfujing', '王府井', 'beijing'], ['산리툰', 'bj-sanlitun', '三里屯', 'beijing'],
    ['왕징', 'bj-wangjing', '望京', 'beijing'], ['첸먼', 'bj-qianmen', '前门', 'beijing'],
    ['톈허구', 'gz-tianhe', '天河区', 'guangzhou'], ['웨슈구', 'gz-yuexiu', '越秀区', 'guangzhou'],
    ['푸톈구', 'sz-futian', '福田区', 'shenzhen'], ['난산구', 'sz-nanshan', '南山区', 'shenzhen'],
    ['시후', 'hz-xihu', '西湖区', 'hangzhou'], ['라오산', 'qd-laoshan', '崂山区', 'qingdao']
  ];

  const regions = [];
  CITIES.forEach((c, i) => regions.push({
    id: 'r-' + c[1], name: c[0], slug: c[1], name_cn: c[2],
    parent_id: null, sort: i + 1, is_active: true
  }));
  AREAS.forEach((a, i) => regions.push({
    id: 'r-' + a[1], name: a[0], slug: a[1], name_cn: a[2],
    parent_id: 'r-' + a[3], sort: i + 1, is_active: true
  }));

  /* 업종 [이름, slug, 아이콘] */
  const CATS = [
    ['뷰티', 'beauty', 'beauty'], ['웰빙·마사지', 'wellness', 'wellness'], ['체험', 'activity', 'activity'],
    ['미식', 'food', 'food'], ['쇼핑', 'shopping', 'shopping'], ['숙박', 'stay', 'stay'],
    ['교통·투어', 'tour', 'tour']
  ];
  /* 세부업종 [이름, slug, 상위slug] */
  const SUBCATS = [
    ['헤어', 'beauty-hair', 'beauty'], ['네일', 'beauty-nail', 'beauty'], ['속눈썹·왁싱', 'beauty-lash', 'beauty'],
    ['피부관리', 'beauty-skin', 'beauty'], ['메이크업', 'beauty-makeup', 'beauty'],
    ['발마사지', 'wellness-foot', 'wellness'], ['전신마사지', 'wellness-body', 'wellness'],
    ['스파·사우나', 'wellness-spa', 'wellness'], ['한방·부항', 'wellness-herbal', 'wellness'],
    ['전통복 촬영', 'activity-hanfu', 'activity'], ['사진 스튜디오', 'activity-studio', 'activity'],
    ['공방·클래스', 'activity-class', 'activity'], ['야경 투어', 'activity-night', 'activity'],
    ['훠궈', 'food-hotpot', 'food'], ['딤섬·광둥', 'food-dimsum', 'food'], ['마라·촨촨', 'food-mala', 'food'],
    ['한식', 'food-korean', 'food'], ['카페·디저트', 'food-cafe', 'food'],
    ['잡화·기념품', 'shopping-goods', 'shopping'], ['차·건강식품', 'shopping-tea', 'shopping'],
    ['안경·시계', 'shopping-optic', 'shopping'], ['전자기기', 'shopping-digital', 'shopping'],
    ['호텔', 'stay-hotel', 'stay'], ['레지던스', 'stay-residence', 'stay'], ['게스트하우스', 'stay-guesthouse', 'stay'],
    ['공항 픽업', 'tour-pickup', 'tour'], ['전용 차량', 'tour-charter', 'tour'],
    ['가이드 투어', 'tour-guide', 'tour'], ['티켓·입장권', 'tour-ticket', 'tour']
  ];

  const nav_categories = [];
  CATS.forEach((c, i) => nav_categories.push({
    id: 'c-' + c[1], name: c[0], slug: c[1], icon: c[2], parent_id: null,
    sort: i + 1, is_active: true, show_in_quick: true, auto_regions: true
  }));
  SUBCATS.forEach((c, i) => nav_categories.push({
    id: 'c-' + c[1], name: c[0], slug: c[1], icon: null, parent_id: 'c-' + c[2],
    sort: (i % 6) + 1, is_active: true, show_in_quick: false, auto_regions: true
  }));

  const THEMES = [
    ['인생샷 명소', 'photo'], ['힐링 추천', 'healing'], ['단독 혜택', 'exclusive'],
    ['신규 오픈', 'new'], ['한국어 가능', 'korean'], ['심야 영업', 'late']
  ];
  const nav_items = [];
  let ni = 0;
  CATS.forEach(c => {
    THEMES.forEach((t, i) => nav_items.push({
      id: 'n' + (++ni), category_id: 'c-' + c[1], group_type: 'theme',
      label: t[0], link: `list.html?cat=${c[1]}&tag=${t[1]}`, sort: i + 1, is_active: true
    }));
    nav_items.push({
      id: 'n' + (++ni), category_id: 'c-' + c[1], group_type: 'promo',
      label: `${c[0]} 제휴처 전체보기`, link: `list.html?cat=${c[1]}`, sort: 1, is_active: true
    });
    nav_items.push({
      id: 'n' + (++ni), category_id: 'c-' + c[1], group_type: 'promo',
      label: `이달의 ${c[0]} 혜택`, link: `list.html?cat=${c[1]}&featured=1`, badge: 'HOT', sort: 2, is_active: true
    });
  });

  const DEMO = {
    site_settings: [{
      id: 1,
      site_name: '중여커',
      site_title: '중여커 중국 현지 제휴 혜택 가이드',
      site_description: '중국 주요 제휴업체의 상호명, 지역, 업종, 혜택 현황을 한눈에 파악할 수 있는 가이드입니다.',
      logo_url: 'assets/img/logo.png',
      color_primary: '#4A92BD', color_primary_dark: '#2F6C91',
      color_primary_light: '#EAF3F9', color_point: '#FF6B35',
      header_notice: '중여커 회원 전용 · 중국 현지 제휴 혜택',
      search_placeholder: '업체명, 지역, 혜택을 검색해 보세요',
      cs_title: '중여커 고객센터',
      cs_hours: '평일 오전 10시 ~ 오후 7시 (토·일, 공휴일 휴무)',
      cs_wechat_id: 'zhongyouke',
      cs_email: 'help@zhongyouke.com',
      company_name: '중여커 (중국 여행자 커뮤니티)',
      copyright_text: '© ZhongYouKe. All Rights Reserved.',
      footer_notice: '중여커는 제휴업체와 이용자를 연결하는 정보 제공 플랫폼이며, 통신판매의 당사자가 아닙니다.',
      sec_featured_title: '중여커 추천 업체', sec_featured_sub: '회원들이 가장 많이 찾은 제휴처',
      sec_media_title: '영상으로 먼저 보기', sec_media_sub: '인스타 릴스 · 유튜브 쇼츠로 만나는 제휴업체',
      sec_region_title: '지역별 제휴업체', sec_region_sub: '가고 싶은 도시를 선택하세요',
      sec_event_title: '기획전 · 이벤트', sec_event_sub: '지금 진행 중인 혜택',
      sns_instagram: '', sns_youtube: '', sns_naver_blog: '', sns_kakao: '',
      detail_benefit_title: '중여커 회원 전용 혜택', detail_benefit_sec: '제휴 혜택 상세',
      detail_intro_sec: '업체 소개', detail_media_sec: '홍보 영상', detail_guide_sec: '이용 안내',
      detail_book_sec: '예약 방법', detail_loc_sec: '위치', detail_related_title: '이런 곳은 어떠세요?',
      detail_member_notice: '방문 시 "중여커 회원" 이라고 말씀하셔야 혜택이 적용됩니다.',
      detail_booking_steps: '위챗 스캔으로 QR을 읽거나 아래 ID를 검색합니다.\n희망 날짜·시간과 인원을 알려 주세요.\n예약 시 "중여커 회원" 이라고 꼭 말씀해 주세요.',
      list_empty_text: '조건에 맞는 제휴업체가 없습니다.', fav_empty_text: '아직 찜한 제휴업체가 없습니다.',
      media_page_title: '영상으로 보는 제휴업체', notice_page_title: '공지사항 · 문의',
      partner_cta_text: '제휴 신청', analytics_id: ''
    }],

    menus: [
      ['utility', '영상 모아보기', 'media.html', null], ['utility', '공지사항', 'notice.html', null],
      ['utility', '제휴 문의', 'page.html?slug=partner', null], ['utility', '관리자', 'admin.html', null],
      ['gnb_left', '전체보기', 'list.html', null],
      ['gnb_right', '영상', 'media.html', null], ['gnb_right', '공지·문의', 'notice.html', null],
      ['header_action', '찜한 곳', 'list.html?fav=1', 'heart'], ['header_action', '영상', 'media.html', 'play'],
      ['header_action', '문의', 'notice.html', 'chat'],
      ['mobile_tab', '홈', 'index.html', 'home'], ['mobile_tab', '제휴처', 'list.html', 'grid'],
      ['mobile_tab', '영상', 'media.html', 'video'], ['mobile_tab', '찜', 'list.html?fav=1', 'heart'],
      ['mobile_tab', '문의', 'notice.html', 'chat'],
      ['drawer_etc', '전체 제휴업체', 'list.html', 'grid'], ['drawer_etc', '영상 모아보기', 'media.html', 'video'],
      ['drawer_etc', '찜한 곳', 'list.html?fav=1', 'heart'], ['drawer_etc', '공지사항 · 문의', 'notice.html', 'chat'],
      ['drawer_etc', '제휴 신청', 'page.html?slug=partner', 'gift'], ['drawer_etc', '관리자', 'admin.html', 'settings'],
      ['subnav_right', '영상', 'media.html', null], ['subnav_right', '제휴 문의', 'page.html?slug=partner', null]
    ].map((m, i) => ({ id: 'mn' + i, position: m[0], label: m[1], link: m[2], icon: m[3], link_target: '_self', sort: i, is_active: true })),
    regions, nav_categories, nav_items,

    quick_links: [
      { id: 'q1', label: '중여커PICK', link: 'list.html?featured=1', emphasis: true, sort: 1, is_active: true },
      { id: 'q2', label: '신규 제휴', link: 'list.html?sort=new', sort: 2, is_active: true },
      { id: 'q3', label: '단독 혜택', link: 'list.html?tag=exclusive', sort: 3, is_active: true },
      { id: 'q4', label: '영상 모아보기', link: 'media.html', sort: 4, is_active: true },
      { id: 'q5', label: '제휴 문의', link: 'page.html?slug=partner', sort: 5, is_active: true }
    ],
    keywords: [
      { id: 'k1', label: '#인생샷', link: 'list.html?q=인생샷', sort: 1, is_active: true },
      { id: 'k2', label: '#힐링', link: 'list.html?q=힐링', sort: 2, is_active: true },
      { id: 'k3', label: '#피로회복', link: 'list.html?q=마사지', sort: 3, is_active: true },
      { id: 'k4', label: '#메이크업', link: 'list.html?q=메이크업', sort: 4, is_active: true },
      { id: 'k5', label: '#이색체험', link: 'list.html?q=체험', sort: 5, is_active: true },
      { id: 'k6', label: '#훠궈', link: 'list.html?q=훠궈', sort: 6, is_active: true }
    ],
    banners: [
      { id: 'b1', type: 'hero', label: '중여커 회원 전용', title: '중국 여행, 아는 사람만 받는 혜택', subtitle: '현지 제휴업체 할인·서비스를 한 곳에서', link: 'list.html', bg_color: '#4A92BD', sort: 1, is_active: true },
      { id: 'b2', type: 'hero', label: 'NEW', title: '상하이 신규 제휴처 오픈', subtitle: '지금 예약하면 첫 방문 추가 할인', link: 'list.html?region=shanghai', bg_color: '#2F6C91', sort: 2, is_active: true },
      { id: 'b3', type: 'hero', label: 'HOT', title: '피로회복 마사지 BEST', subtitle: '중여커 회원 10~20% 할인', link: 'list.html?cat=wellness', bg_color: '#FF6B35', sort: 3, is_active: true },
      { id: 'b4', type: 'event', title: '여름 뷰티 기획전', subtitle: '헤어·네일·메이크업 최대 30%', link: 'list.html?cat=beauty', period_text: '~ 상시', bg_color: '#4A92BD', sort: 1, is_active: true },
      { id: 'b5', type: 'event', title: '상하이 이색체험 모음', subtitle: '중여커 단독 예약 혜택', link: 'list.html?region=shanghai', period_text: '~ 상시', bg_color: '#2F6C91', sort: 2, is_active: true },
      { id: 'b6', type: 'event', title: '신규 제휴사 모집', subtitle: '중여커와 함께할 파트너를 찾습니다', link: 'page.html?slug=partner', period_text: '상시 접수', bg_color: '#FF6B35', sort: 3, is_active: true }
    ],
    ads: [
      { id: 'a1', slot: 'top_strip', title: 'NEW! 이달의 신규 제휴처', subtitle: '새로 합류한 제휴업체와 혜택 모아보기', link: 'list.html?sort=new', link_target: '_self', bg_color: '#FDEBF3', text_color: '#8A2C56', is_closable: true, sort: 1, is_active: true },
      { id: 'a2', slot: 'main_wide', title: '중여커 제휴 파트너 모집', subtitle: '중국 현지 사업자 상시 접수 · 클릭하여 신청', link: 'https://benefits.zhongyouke.com', link_target: '_blank', bg_color: '#4A92BD', text_color: '#ffffff', sort: 1, is_active: true },
      { id: 'a3', slot: 'list_inline', title: '광고 문의 배너 자리', subtitle: '관리자 > 광고 관리에서 이미지와 외부 URL을 설정하세요', link: 'https://benefits.zhongyouke.com', link_target: '_blank', bg_color: '#F1F5F8', text_color: '#2F6C91', sort: 2, is_active: true }
    ],
    popups: [],
    series_cards: [
      { id: 's1', section_title: '중여커 시리즈', title: '중국 첫 방문이라면?', subtitle: '꼭 알아야 할 현지 이용 팁', caption: '초보 여행자 필수 가이드', link: 'page.html?slug=about', sort: 1, is_active: true },
      { id: 's2', section_title: '중여커 시리즈', title: '상하이 3박4일 혜택 코스', subtitle: '제휴처만 돌아도 알찬 일정', caption: '중여커 추천 코스', link: 'list.html?region=shanghai', sort: 2, is_active: true },
      { id: 's3', section_title: '중여커 시리즈', title: '현지에서 바로 쓰는 위챗 예약법', subtitle: '캡처 한 장으로 끝내기', caption: '이용 가이드', link: 'notice.html', sort: 3, is_active: true }
    ],
    footer_links: [
      { id: 'f1', label: '중여커 소개', link: 'page.html?slug=about', sort: 1, is_active: true },
      { id: 'f2', label: '개인정보처리방침', link: 'page.html?slug=privacy', emphasis: true, sort: 2, is_active: true },
      { id: 'f3', label: '이용약관', link: 'page.html?slug=terms', sort: 3, is_active: true },
      { id: 'f4', label: '제휴 문의', link: 'page.html?slug=partner', sort: 4, is_active: true }
    ],
    notices: [
      { id: 'no1', title: '중여커 제휴 혜택 가이드 개편 안내', content: '더 보기 편한 구조로 새단장했습니다.', category: '공지', is_pinned: true, is_active: true, created_at: '2026-08-01T00:00:00Z' },
      { id: 'no2', title: '제휴업체 상시 모집 안내', content: '중국 현지 사업자님의 제휴 신청을 상시 접수합니다.', category: '안내', is_active: true, created_at: '2026-07-20T00:00:00Z' }
    ],
    pages: [
      { id: 'p1', slug: 'about', title: '중여커 소개', content: '<p>중여커는 중국 여행자 커뮤니티입니다.</p>', is_active: true, sort: 1 },
      { id: 'p2', slug: 'partner', title: '제휴 문의', content: '<p>제휴를 원하시는 사업자님은 위챗으로 문의해 주세요.</p>', is_active: true, sort: 2 },
      { id: 'p3', slug: 'privacy', title: '개인정보처리방침', content: '<p>내용을 관리자 페이지에서 입력하세요.</p>', is_active: true, sort: 3 },
      { id: 'p4', slug: 'terms', title: '이용약관', content: '<p>내용을 관리자 페이지에서 입력하세요.</p>', is_active: true, sort: 4 }
    ],
    partners: [
      {
        id: 'pt1', name: '상하이 헤어살롱 예시', name_cn: '上海美发沙龙', slug: 'sample-hair-shanghai',
        category_id: 'c-beauty-hair', category_label: '헤어', region_id: 'r-sh-jingan', region_label: '상하이 징안구',
        branch_count: 2, summary: '한국인 디자이너가 상주하는 상하이 대표 헤어살롱',
        description: '한국에서 경력을 쌓은 디자이너가 직접 시술합니다.\n의사소통 걱정 없이 원하는 스타일을 요청하세요.',
        benefit_summary: '10% 할인',
        benefit_detail: '· 중여커 회원 전 시술 10% 할인\n· 첫 방문 시 트리트먼트 1회 무료\n· 예약 시 "중여커" 언급 필수',
        booking_method: '위챗으로 사전 예약 (당일 예약 불가)', business_hours: '10:00 ~ 20:00 (월요일 휴무)',
        price_info: '커트 150元 ~', address: '上海市静安区南京西路',
        wechat_id: 'zhongyouke_demo', tags: ['#인생샷', '#메이크업', '#한국어 가능'], badge: 'BEST',
        is_featured: true, is_active: true, sort: 1, images: [], view_count: 128, created_at: '2026-07-28T00:00:00Z'
      },
      {
        id: 'pt2', name: '상하이 발마사지 예시', name_cn: '上海足疗', slug: 'sample-massage-shanghai',
        category_id: 'c-wellness-foot', category_label: '발마사지', region_id: 'r-sh-huangpu', region_label: '상하이 황푸구',
        branch_count: 1, summary: '여행 마지막 날 피로를 풀기 좋은 프리미엄 마사지숍',
        description: '깔끔한 시설과 숙련된 관리사로 한국인 여행자에게 인기 있는 곳입니다.',
        benefit_summary: '15% 할인',
        benefit_detail: '· 전 코스 15% 할인\n· 90분 이상 코스 예약 시 차 서비스 제공',
        booking_method: '위챗 예약 또는 현장 방문', business_hours: '11:00 ~ 24:00 (연중무휴)',
        price_info: '60분 128元 ~', address: '上海市黄浦区',
        wechat_id: 'zhongyouke_demo', tags: ['#피로회복', '#힐링', '#심야 영업'],
        is_featured: true, is_active: true, sort: 2, images: [], view_count: 96, created_at: '2026-07-20T00:00:00Z'
      },
      {
        id: 'pt3', name: '베이징 전통복 체험 예시', name_cn: '北京汉服体验', slug: 'sample-hanfu-beijing',
        category_id: 'c-activity-hanfu', category_label: '전통복 촬영', region_id: 'r-bj-qianmen', region_label: '베이징 첸먼',
        branch_count: 1, summary: '고궁 앞에서 즐기는 전통 의상 촬영 체험',
        description: '의상 대여부터 헤어·메이크업, 야외 촬영까지 한 번에 해결됩니다.',
        benefit_summary: '20% 할인 + 원본 사진 제공',
        benefit_detail: '· 촬영 패키지 20% 할인\n· 보정본 5장 + 원본 전체 제공\n· 평일 방문 시 소품 무료 대여',
        booking_method: '위챗 사전 예약 (3일 전까지)', business_hours: '09:00 ~ 18:00',
        price_info: '패키지 480元 ~', address: '北京市东城区前门大街',
        wechat_id: 'zhongyouke_demo', tags: ['#인생샷', '#이색체험'], badge: 'NEW',
        is_featured: true, is_active: true, sort: 3, images: [], view_count: 74, created_at: '2026-08-01T00:00:00Z'
      },
      {
        id: 'pt4', name: '광저우 딤섬 노포 예시', name_cn: '广州点心老店', slug: 'sample-dimsum-guangzhou',
        category_id: 'c-food-dimsum', category_label: '딤섬·광둥', region_id: 'r-gz-yuexiu', region_label: '광저우 웨슈구',
        branch_count: 1, summary: '현지인이 줄 서는 30년 전통 딤섬 노포',
        description: '아침 6시부터 문을 여는 광저우식 얌차 문화를 그대로 경험할 수 있습니다.',
        benefit_summary: '음료 무료 제공',
        benefit_detail: '· 중여커 회원 차(茶) 무료\n· 2인 이상 방문 시 대표 메뉴 1종 서비스',
        booking_method: '현장 방문 (예약 불가)', business_hours: '06:00 ~ 15:00',
        price_info: '1인 60元 ~', address: '广州市越秀区',
        wechat_id: 'zhongyouke_demo', tags: ['#미식', '#한국어 가능'],
        is_featured: true, is_active: true, sort: 4, images: [], view_count: 51, created_at: '2026-07-11T00:00:00Z'
      },
      {
        id: 'pt5', name: '선전 공항 픽업 예시', name_cn: '深圳机场接送', slug: 'sample-pickup-shenzhen',
        category_id: 'c-tour-pickup', category_label: '공항 픽업', region_id: 'r-sz-futian', region_label: '선전 푸톈구',
        branch_count: 1, summary: '한국어 가능 기사님이 배정되는 공항 픽업 서비스',
        description: '항공편 지연 시 대기 요금 없이 무료로 기다려 드립니다.',
        benefit_summary: '10% 할인',
        benefit_detail: '· 편도 요금 10% 할인\n· 유아 카시트 무료 제공\n· 항공편 지연 무료 대기',
        booking_method: '위챗으로 항공편명 전달 후 예약', business_hours: '24시간 운영',
        price_info: '편도 280元 ~', address: '深圳宝安国际机场',
        wechat_id: 'zhongyouke_demo', tags: ['#한국어 가능', '#심야 영업'],
        is_featured: false, is_active: true, sort: 5, images: [], view_count: 33, created_at: '2026-06-30T00:00:00Z'
      }
    ],
    partner_media: [
      { id: 'm1', partner_id: 'pt1', platform: 'auto', url: 'https://www.youtube.com/shorts/aqz-KE-bpKQ', title: '상하이 헤어살롱 둘러보기', show_on_main: true, is_active: true, sort: 1 },
      { id: 'm2', partner_id: 'pt2', platform: 'auto', url: 'https://www.instagram.com/reel/CxIlBDNxxxx/', title: '발마사지 후기 릴스', show_on_main: true, is_active: true, sort: 2 },
      { id: 'm3', partner_id: 'pt3', platform: 'auto', url: 'https://www.youtube.com/shorts/aqz-KE-bpKQ', title: '베이징 전통복 촬영 브이로그', show_on_main: true, is_active: true, sort: 3 }
    ]
  };

  /* ================= 조회 API ================= */
  function demoTable(name) { return JSON.parse(JSON.stringify(DEMO[name] || [])); }

  async function selectAll(table, opts) {
    opts = opts || {};
    if (!sb) {
      let rows = demoTable(table);
      if (opts.activeOnly !== false) rows = rows.filter(r => r.is_active !== false);
      if (opts.eq) Object.keys(opts.eq).forEach(k => { rows = rows.filter(r => r[k] === opts.eq[k]); });
      const col = opts.orderBy || 'sort';
      rows.sort((a, b) => {
        const av = a[col], bv = b[col];
        if (av == null) return 1; if (bv == null) return -1;
        if (av === bv) return 0;
        return opts.asc === false ? (av < bv ? 1 : -1) : (av > bv ? 1 : -1);
      });
      if (opts.limit) rows = rows.slice(0, opts.limit);
      return rows;
    }
    let q = sb.from(table).select('*');
    if (opts.activeOnly !== false) q = q.eq('is_active', true);
    if (opts.eq) Object.keys(opts.eq).forEach(k => { q = q.eq(k, opts.eq[k]); });
    q = q.order(opts.orderBy || 'sort', { ascending: opts.asc !== false });
    if (opts.limit) q = q.limit(opts.limit);
    const { data, error } = await q;
    if (error) { console.warn('[ZYK] select ' + table, error.message); return []; }
    return data || [];
  }

  async function selectOne(table, matchObj) {
    if (!sb) {
      const rows = demoTable(table);
      return rows.find(r => Object.keys(matchObj).every(k => String(r[k]) === String(matchObj[k]))) || null;
    }
    const { data, error } = await sb.from(table).select('*').match(matchObj).limit(1).maybeSingle();
    if (error) { console.warn('[ZYK] selectOne ' + table, error.message); return null; }
    return data;
  }

  /* ================= 쓰기 API (관리자) ================= */
  const NOT_CONFIGURED = 'Supabase가 설정되지 않았습니다. assets/js/config.js를 확인하세요.';
  async function upsert(table, row) {
    if (!sb) throw new Error(NOT_CONFIGURED);
    const { data, error } = await sb.from(table).upsert(row).select();
    if (error) throw error; return data;
  }
  async function insert(table, row) {
    if (!sb) throw new Error(NOT_CONFIGURED);
    const { data, error } = await sb.from(table).insert(row).select();
    if (error) throw error; return data;
  }
  async function update(table, id, row) {
    if (!sb) throw new Error(NOT_CONFIGURED);
    const { data, error } = await sb.from(table).update(row).eq('id', id).select();
    if (error) throw error; return data;
  }
  async function remove(table, id) {
    if (!sb) throw new Error(NOT_CONFIGURED);
    const { error } = await sb.from(table).delete().eq('id', id);
    if (error) throw error;
  }
  async function uploadImage(file, folder) {
    if (!sb) throw new Error(NOT_CONFIGURED);
    const bucket = CFG.STORAGE_BUCKET || 'media';
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase();
    const path = `${folder || 'upload'}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
    const { error } = await sb.storage.from(bucket).upload(path, file, { cacheControl: '3600', upsert: false });
    if (error) throw error;
    return sb.storage.from(bucket).getPublicUrl(path).data.publicUrl;
  }
  async function rpc(fn, args) {
    if (!sb) return;
    try { await sb.rpc(fn, args); } catch (e) { /* silent */ }
  }

  window.ZYK = { sb, configured, DEMO, selectAll, selectOne, upsert, insert, update, remove, uploadImage, rpc };
})();
