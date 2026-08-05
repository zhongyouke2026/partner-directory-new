/* =====================================================================
 *  중여커 관리자 · 화면 정의
 *  여기에 필드를 추가하면 관리자 화면에 자동으로 입력칸이 생깁니다.
 *  type: text | url | textarea | html | number | bool | select | color
 *        | image | images | tags | datetime | ref
 * ===================================================================*/
window.ADMIN_SCHEMA = {

  /* ---------------- 사이트 전역 설정 (단일 레코드) ---------------- */
  settings: {
    icon: 'settings', label: '사이트 설정', table: 'site_settings', single: true,
    desc: '사이트 전반에 적용되는 이름·로고·색상·연락처·푸터 문구를 관리합니다.',
    groups: [
      {
        title: '기본 정보', fields: [
          { key: 'site_name', label: '사이트명', type: 'text' },
          { key: 'site_title', label: '브라우저 탭 제목', type: 'text' },
          { key: 'site_description', label: '사이트 설명(SEO)', type: 'textarea', full: true },
          { key: 'logo_url', label: '로고 이미지', type: 'image' },
          { key: 'favicon_url', label: '파비콘', type: 'image' },
          { key: 'og_image_url', label: '공유 썸네일(OG)', type: 'image', hint: '카카오톡·위챗 공유 시 보이는 이미지' },
          { key: 'analytics_id', label: 'Google Analytics 측정 ID', type: 'text', hint: 'G-XXXXXXXXXX · 비우면 미사용' }
        ]
      },
      {
        title: '브랜드 컬러', fields: [
          { key: 'color_primary', label: '메인 컬러', type: 'color' },
          { key: 'color_primary_dark', label: '진한 컬러', type: 'color' },
          { key: 'color_primary_light', label: '연한 배경 컬러', type: 'color' },
          { key: 'color_point', label: '포인트 컬러', type: 'color' }
        ]
      },
      {
        title: '헤더 / 히어로', fields: [
          { key: 'header_notice', label: '헤더 상단 안내 문구', type: 'text' },
          { key: 'search_placeholder', label: '검색창 안내 문구', type: 'text' },
          { key: 'hero_title', label: '히어로 기본 제목', type: 'text' },
          { key: 'hero_subtitle', label: '히어로 기본 부제', type: 'text' }
        ]
      },
      {
        title: '메인 섹션 문구', fields: [
          { key: 'sec_featured_title', label: '추천 섹션 제목', type: 'text' },
          { key: 'sec_featured_sub', label: '추천 섹션 부제', type: 'text' },
          { key: 'sec_media_title', label: '영상 섹션 제목', type: 'text' },
          { key: 'sec_media_sub', label: '영상 섹션 부제', type: 'text' },
          { key: 'sec_region_title', label: '지역 섹션 제목', type: 'text' },
          { key: 'sec_region_sub', label: '지역 섹션 부제', type: 'text' },
          { key: 'sec_event_title', label: '기획전 섹션 제목', type: 'text' },
          { key: 'sec_event_sub', label: '기획전 섹션 부제', type: 'text' }
        ]
      },
      {
        title: '고객센터 / 문의', fields: [
          { key: 'cs_title', label: '고객센터 제목', type: 'text' },
          { key: 'cs_hours', label: '상담 시간', type: 'text' },
          { key: 'cs_phone', label: '전화번호', type: 'text' },
          { key: 'cs_wechat_id', label: '위챗 ID', type: 'text' },
          { key: 'cs_kakao_url', label: '카카오 채널 URL', type: 'url' },
          { key: 'cs_email', label: '이메일', type: 'text' }
        ]
      },
      {
        title: 'SNS 링크', fields: [
          { key: 'sns_instagram', label: '인스타그램', type: 'url' },
          { key: 'sns_youtube', label: '유튜브', type: 'url' },
          { key: 'sns_naver_blog', label: '네이버 블로그', type: 'url' },
          { key: 'sns_kakao', label: '카카오채널', type: 'url' },
          { key: 'sns_xiaohongshu', label: '샤오홍슈', type: 'url' },
          { key: 'sns_douyin', label: '더우인', type: 'url' }
        ]
      },
      {
        title: '상세페이지 문구', fields: [
          { key: 'detail_benefit_title', label: '혜택 강조 박스 제목', type: 'text' },
          { key: 'detail_benefit_sec', label: '혜택 섹션 제목', type: 'text' },
          { key: 'detail_intro_sec', label: '소개 섹션 제목', type: 'text' },
          { key: 'detail_media_sec', label: '영상 섹션 제목', type: 'text' },
          { key: 'detail_guide_sec', label: '이용안내 섹션 제목', type: 'text' },
          { key: 'detail_book_sec', label: '예약 섹션 제목', type: 'text' },
          { key: 'detail_loc_sec', label: '위치 섹션 제목', type: 'text' },
          { key: 'detail_related_title', label: '관련 업체 섹션 제목', type: 'text' },
          { key: 'partner_cta_text', label: '제휴 신청 버튼 문구', type: 'text' },
          { key: 'detail_member_notice', label: '회원 확인 안내 문구', type: 'textarea', full: true },
          { key: 'detail_booking_steps', label: '예약 단계 안내', type: 'textarea', full: true, hint: '한 줄에 한 단계씩 입력하면 1·2·3 번호가 붙습니다' }
        ]
      },
      {
        title: '목록 · 기타 문구', fields: [
          { key: 'list_empty_text', label: '검색 결과 없음 문구', type: 'text', full: true },
          { key: 'fav_empty_text', label: '찜 목록 비었을 때 문구', type: 'text', full: true },
          { key: 'media_page_title', label: '영상 페이지 제목', type: 'text' },
          { key: 'notice_page_title', label: '공지 페이지 제목', type: 'text' }
        ]
      },
      {
        title: '푸터 / 회사 정보', fields: [
          { key: 'company_name', label: '회사(서비스)명', type: 'text' },
          { key: 'company_ceo', label: '대표자', type: 'text' },
          { key: 'company_address', label: '주소', type: 'text', full: true },
          { key: 'company_reg_no', label: '사업자등록번호', type: 'text' },
          { key: 'company_extra', label: '추가 표기', type: 'text' },
          { key: 'footer_notice', label: '하단 안내 문구', type: 'textarea', full: true },
          { key: 'copyright_text', label: '저작권 표기', type: 'text', full: true }
        ]
      }
    ]
  },

  /* ---------------- 제휴업체 ---------------- */
  partners: {
    icon: 'store', label: '제휴업체', table: 'partners',
    desc: '메인·목록·상세에 노출되는 제휴업체 정보입니다.',
    columns: [
      { key: 'thumbnail_url', label: '', type: 'thumb' },
      { key: 'name', label: '상호명', type: 'main', sub: 'name_cn' },
      { key: 'region_label', label: '지역' },
      { key: 'category_label', label: '업종' },
      { key: 'benefit_summary', label: '혜택' },
      { key: 'is_featured', label: '추천', type: 'badge' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['name', 'name_cn', 'region_label', 'category_label', 'benefit_summary'],
    groups: [
      {
        title: '기본 정보', fields: [
          { key: 'name', label: '상호명 (한글)', type: 'text', required: true },
          { key: 'name_cn', label: '현지 상호명 (중문)', type: 'text' },
          { key: 'slug', label: 'URL 주소용 slug', type: 'text', hint: '영문/숫자/하이픈. 비우면 자동 생성' },
          { key: 'category_id', label: '업종 (세부업종까지 선택)', type: 'ref', ref: 'nav_categories', required: true, autofill: 'category_label' },
          { key: 'category_label', label: '업종 표시명', type: 'text', hint: '선택하면 자동 입력됩니다' },
          { key: 'region_id', label: '지역 (세부지역까지 선택)', type: 'ref', ref: 'regions', required: true, autofill: 'region_label', autofillFull: true },
          { key: 'region_label', label: '지역 표시명', type: 'text', hint: '선택하면 자동 입력됩니다' },
          { key: 'branch_count', label: '지점 수', type: 'number' },
          { key: 'badge', label: '배지', type: 'text', hint: 'BEST / NEW / 단독 등' },
          { key: 'summary', label: '카드 한 줄 소개', type: 'text', full: true },
          { key: 'description', label: '업체 소개', type: 'textarea', full: true }
        ]
      },
      {
        title: '혜택', fields: [
          { key: 'benefit_summary', label: '혜택 요약', type: 'text', hint: '예) 10% 할인' },
          { key: 'price_info', label: '가격대', type: 'text' },
          { key: 'benefit_detail', label: '혜택 상세', type: 'textarea', full: true, hint: '줄바꿈으로 여러 항목 입력' },
          { key: 'notice', label: '이용 시 유의사항', type: 'textarea', full: true }
        ]
      },
      {
        title: '이용 정보', fields: [
          { key: 'business_hours', label: '영업시간', type: 'text' },
          { key: 'booking_method', label: '예약 방법', type: 'text' },
          { key: 'phone', label: '전화번호', type: 'text' },
          { key: 'wechat_id', label: '위챗 ID', type: 'text' },
          { key: 'address', label: '주소', type: 'text', full: true },
          { key: 'map_url', label: '지도 URL', type: 'url', full: true },
          { key: 'qr_image_url', label: '위챗 예약 QR 이미지', type: 'image', full: true }
        ]
      },
      {
        title: '이미지 / 태그', fields: [
          { key: 'thumbnail_url', label: '대표 이미지', type: 'image', full: true },
          { key: 'images', label: '갤러리 이미지', type: 'images', full: true },
          { key: 'tags', label: '태그', type: 'tags', full: true, hint: '예) #인생샷' }
        ]
      },
      {
        title: '외부 링크', fields: [
          { key: 'booking_url', label: '예약 페이지 URL', type: 'url' },
          { key: 'homepage_url', label: '홈페이지 URL', type: 'url' },
          { key: 'instagram_url', label: '인스타그램 URL', type: 'url' },
          { key: 'xiaohongshu_url', label: '샤오홍슈 URL', type: 'url' },
          { key: 'external_url', label: '카드 클릭 시 외부 URL', type: 'url', full: true, hint: '입력하면 상세페이지 대신 이 주소로 이동합니다' },
          { key: 'link_target', label: '외부 링크 열기', type: 'select', options: [['_self', '현재 창'], ['_blank', '새 창']] }
        ]
      },
      {
        title: '노출 설정', fields: [
          { key: 'is_featured', label: '메인 추천 업체', type: 'bool' },
          { key: 'is_active', label: '노출', type: 'bool' },
          { key: 'sort', label: '정렬 순서', type: 'number' }
        ]
      }
    ]
  },

  /* ---------------- 홍보 영상 ---------------- */
  media: {
    icon: 'video', label: '홍보 영상', table: 'partner_media',
    desc: '인스타 릴스 · 유튜브 쇼츠 · 틱톡 · 더우인 · 샤오홍슈 URL만 붙여넣으면 자동으로 재생 형태를 인식합니다.',
    columns: [
      { key: 'thumbnail_url', label: '', type: 'thumb' },
      { key: 'title', label: '제목', type: 'main', sub: 'url' },
      { key: 'partner_id', label: '업체', type: 'ref', ref: 'partners' },
      { key: 'show_on_main', label: '메인노출', type: 'badge' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['title', 'url'],
    groups: [{
      title: '영상 정보', fields: [
        { key: 'url', label: '영상 URL', type: 'videourl', required: true, full: true, hint: 'YouTube Shorts / Instagram Reels / TikTok / 더우인 / 샤오홍슈 / mp4 — 붙여넣으면 바로 미리보기' },
        { key: 'title', label: '영상 제목', type: 'text' },
        { key: 'partner_id', label: '연결할 제휴업체', type: 'ref', ref: 'partners' },
        { key: 'thumbnail_url', label: '썸네일 이미지', type: 'image', full: true, hint: '비우면 유튜브는 자동 생성. 인스타는 직접 등록 권장' },
        { key: 'platform', label: '플랫폼', type: 'select', options: [['auto', '자동 인식 (권장)'], ['youtube', 'YouTube'], ['instagram', 'Instagram'], ['tiktok', 'TikTok'], ['bilibili', '빌리빌리'], ['douyin', '더우인'], ['xiaohongshu', '샤오홍슈'], ['kuaishou', '콰이쇼우'], ['video', '직접 업로드(mp4)']] },
        { key: 'show_on_main', label: '메인 영상 섹션에 노출', type: 'bool' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 배너 ---------------- */
  banners: {
    icon: 'image', label: '배너 · 기획전', table: 'banners',
    desc: '메인 상단 슬라이더(hero)와 기획전 카드(event)를 관리합니다.',
    columns: [
      { key: 'image_url', label: '', type: 'thumb' },
      { key: 'title', label: '제목', type: 'main', sub: 'subtitle' },
      { key: 'type', label: '위치', type: 'badge-text' },
      { key: 'link', label: '연결 URL' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['title', 'subtitle', 'link'],
    filters: [{ key: 'type', label: '위치', options: [['', '전체'], ['hero', '메인 슬라이더'], ['event', '기획전 카드'], ['strip', '띠배너']] }],
    groups: [{
      title: '배너 정보', fields: [
        { key: 'type', label: '노출 위치', type: 'select', options: [['hero', '메인 슬라이더'], ['event', '기획전 카드'], ['strip', '띠배너']] },
        { key: 'label', label: '작은 라벨', type: 'text', hint: '예) NEW, HOT' },
        { key: 'title', label: '제목', type: 'text', full: true },
        { key: 'subtitle', label: '부제', type: 'text', full: true },
        { key: 'period_text', label: '기간 표기', type: 'text' },
        { key: 'link', label: '연결 URL', type: 'url', hint: 'https://... 또는 /list.html?cat=beauty' },
        { key: 'image_url', label: 'PC 배경 이미지', type: 'image', full: true, hint: '권장 1920×520' },
        { key: 'image_url_mobile', label: '모바일 배경 이미지', type: 'image', full: true, hint: '권장 800×500' },
        { key: 'bg_color', label: '배경 컬러', type: 'color' },
        { key: 'text_color', label: '글자 컬러', type: 'color' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 광고 ---------------- */
  ads: {
    icon: 'megaphone', label: '광고 관리', table: 'ads',
    desc: '외부 광고주 배너를 위치별로 등록합니다. 이미지·외부 URL·직접 HTML(애드센스 등) 모두 지원하며 노출 기간을 지정할 수 있습니다.',
    columns: [
      { key: 'image_url', label: '', type: 'thumb' },
      { key: 'title', label: '광고명', type: 'main', sub: 'advertiser' },
      { key: 'slot', label: '위치', type: 'badge-text' },
      { key: 'link', label: '연결 URL' },
      { key: 'click_count', label: '클릭' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['title', 'advertiser', 'link'],
    filters: [{
      key: 'slot', label: '위치', options: [['', '전체'], ['top_strip', '상단 띠광고'], ['main_wide', '메인 와이드'],
      ['list_inline', '목록 중간'], ['detail_bottom', '상세 하단'], ['side', '사이드'], ['mobile_bottom', '모바일 하단']]
    }],
    groups: [
      {
        title: '광고 기본', fields: [
          {
            key: 'slot', label: '노출 위치', type: 'select', required: true,
            options: [['top_strip', '상단 띠광고 (전체 페이지 최상단)'], ['main_wide', '메인 와이드 (히어로 아래)'],
            ['list_inline', '목록·공지 중간'], ['detail_bottom', '상세페이지 하단'], ['side', '사이드'], ['mobile_bottom', '모바일 하단']]
          },
          { key: 'advertiser', label: '광고주명', type: 'text' },
          { key: 'title', label: '광고 제목', type: 'text', full: true },
          { key: 'subtitle', label: '광고 부제', type: 'text', full: true },
          { key: 'link', label: '클릭 시 이동 URL', type: 'url', full: true, required: true },
          { key: 'link_target', label: '링크 열기', type: 'select', options: [['_blank', '새 창'], ['_self', '현재 창']] }
        ]
      },
      {
        title: '디자인', fields: [
          { key: 'image_url', label: 'PC 이미지', type: 'image', full: true },
          { key: 'image_url_mobile', label: '모바일 이미지', type: 'image', full: true },
          { key: 'bg_color', label: '배경 컬러', type: 'color' },
          { key: 'text_color', label: '글자 컬러', type: 'color' },
          { key: 'is_closable', label: '닫기 버튼 표시 (띠광고)', type: 'bool' },
          { key: 'html_code', label: '직접 HTML 코드', type: 'html', full: true, hint: '구글 애드센스 등 스크립트를 넣으면 위 이미지/문구 대신 이 코드가 표시됩니다' }
        ]
      },
      {
        title: '노출 기간', fields: [
          { key: 'start_at', label: '노출 시작', type: 'datetime', hint: '비우면 즉시' },
          { key: 'end_at', label: '노출 종료', type: 'datetime', hint: '비우면 무기한' },
          { key: 'is_active', label: '노출', type: 'bool' },
          { key: 'sort', label: '정렬 순서', type: 'number' }
        ]
      }
    ]
  },

  /* ---------------- 팝업 ---------------- */
  popups: {
    icon: 'window', label: '팝업 레이어', table: 'popups',
    desc: '"오늘 하루 그만보기"가 포함된 레이어 팝업입니다.',
    columns: [
      { key: 'image_url', label: '', type: 'thumb' },
      { key: 'title', label: '제목', type: 'main', sub: 'link' },
      { key: 'position', label: '위치', type: 'badge-text' },
      { key: 'device', label: '기기', type: 'badge-text' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['title', 'link'],
    groups: [{
      title: '팝업 설정', fields: [
        { key: 'title', label: '팝업 제목', type: 'text', full: true },
        { key: 'image_url', label: '팝업 이미지', type: 'image', full: true },
        { key: 'link', label: '클릭 시 이동 URL', type: 'url', full: true },
        { key: 'link_target', label: '링크 열기', type: 'select', options: [['_blank', '새 창'], ['_self', '현재 창']] },
        { key: 'html_code', label: '직접 HTML', type: 'html', full: true },
        { key: 'position', label: '가로 위치', type: 'select', options: [['left', '왼쪽'], ['center', '가운데'], ['right', '오른쪽']] },
        { key: 'width', label: '가로 크기(px)', type: 'number' },
        { key: 'offset_x', label: '좌우 여백(px)', type: 'number' },
        { key: 'offset_y', label: '상단 여백(px)', type: 'number' },
        { key: 'show_on', label: '노출 페이지', type: 'select', options: [['main', '메인만'], ['all', '전체 페이지']] },
        { key: 'device', label: '노출 기기', type: 'select', options: [['all', '전체'], ['pc', 'PC만'], ['mobile', '모바일만']] },
        { key: 'hide_days', label: '그만보기 유지일수', type: 'number' },
        { key: 'start_at', label: '노출 시작', type: 'datetime' },
        { key: 'end_at', label: '노출 종료', type: 'datetime' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- GNB 대분류 ---------------- */
  nav_categories: {
    icon: 'grid', label: '메뉴(업종) 관리', table: 'nav_categories', tree: true,
    desc: '상단 메가메뉴의 대분류이자 메인 퀵카테고리입니다. 상위 업종을 지정하면 세부 업종이 됩니다.',
    columns: [
      { key: 'icon', label: '아이콘', type: 'emoji' },
      { key: 'name', label: '이름', type: 'main', sub: 'slug' },
      { key: 'parent_id', label: '상위 업종', type: 'ref', ref: 'nav_categories' },
      { key: 'show_in_quick', label: '퀵노출', type: 'badge' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['name', 'slug'],
    groups: [{
      title: '분류 정보', fields: [
        { key: 'name', label: '이름', type: 'text', required: true },
        { key: 'slug', label: 'slug', type: 'text', hint: '영문 소문자. 비우면 자동 생성' },
        { key: 'parent_id', label: '상위 업종', type: 'ref', ref: 'nav_categories', hint: '비우면 대분류(상단 메뉴)가 됩니다' },
        { key: 'auto_regions', label: '메뉴에 지역 자동 표시', type: 'bool', hint: '지역 관리에 등록한 도시가 자동으로 나옵니다' },
        { key: 'icon', label: '아이콘', type: 'iconpick', hint: '대분류에만 사용됩니다' },
        { key: 'image_url', label: '아이콘 이미지', type: 'image' },
        { key: 'link', label: '연결 URL', type: 'url', full: true, hint: '비우면 /list.html?cat=slug 로 자동 연결' },
        { key: 'description', label: '설명', type: 'text', full: true },
        { key: 'show_in_quick', label: '메인 퀵카테고리 노출', type: 'bool' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 메가메뉴 하위 ---------------- */
  nav_items: {
    icon: 'list', label: '메가메뉴 하위항목', table: 'nav_items',
    desc: '각 대분류 아래의 테마 / 프로모션 링크입니다. 지역은 [지역 관리]에서 자동 반영되므로 여기 넣지 않아도 됩니다. 외부 URL도 연결할 수 있습니다.',
    columns: [
      { key: 'label', label: '이름', type: 'main', sub: 'link' },
      { key: 'category_id', label: '대분류', type: 'ref', ref: 'nav_categories' },
      { key: 'group_type', label: '그룹', type: 'badge-text' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['label', 'link'],
    filters: [{ key: 'group_type', label: '그룹', options: [['', '전체'], ['region', '지역'], ['theme', '테마'], ['promo', '프로모션']] }],
    groups: [{
      title: '항목 정보', fields: [
        { key: 'category_id', label: '대분류', type: 'ref', ref: 'nav_categories', required: true },
        { key: 'group_type', label: '그룹', type: 'select', options: [['theme', '테마'], ['promo', '프로모션'], ['region', '지역(수동 추가)']] },
        { key: 'label', label: '표시 이름', type: 'text', required: true },
        { key: 'badge', label: '배지', type: 'text', hint: 'NEW / HOT' },
        { key: 'link', label: '연결 URL', type: 'url', full: true, hint: '내부: /list.html?cat=beauty · 외부: https://...' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 지역 ---------------- */
  regions: {
    icon: 'mapPin', label: '지역 관리', table: 'regions', tree: true,
    desc: '도시를 추가하면 모든 업종 메뉴에 자동으로 반영됩니다. 상위 지역을 지정하면 그 도시의 세부 지역(구·상권)이 됩니다.',
    columns: [
      { key: 'image_url', label: '', type: 'thumb' },
      { key: 'name', label: '지역명', type: 'main', sub: 'name_cn' },
      { key: 'parent_id', label: '상위 도시', type: 'ref', ref: 'regions' },
      { key: 'slug', label: 'slug' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['name', 'name_cn', 'slug'],
    groups: [{
      title: '지역 정보', fields: [
        { key: 'name', label: '지역명 (한글)', type: 'text', required: true },
        { key: 'name_cn', label: '지역명 (중문)', type: 'text' },
        { key: 'slug', label: 'slug', type: 'text', hint: '영문 소문자. 비우면 자동 생성' },
        { key: 'parent_id', label: '상위 도시', type: 'ref', ref: 'regions', hint: '비우면 도시(대지역)로 등록됩니다' },
        { key: 'image_url', label: '대표 이미지', type: 'image', full: true },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 시리즈 카드 ---------------- */
  series_cards: {
    icon: 'film', label: '시리즈 카드', table: 'series_cards',
    desc: '메인 하단의 큰 가로형 카드 영역입니다.',
    columns: [
      { key: 'image_url', label: '', type: 'thumb' },
      { key: 'title', label: '제목', type: 'main', sub: 'subtitle' },
      { key: 'link', label: '연결 URL' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['title', 'subtitle'],
    groups: [{
      title: '카드 정보', fields: [
        { key: 'section_title', label: '섹션 제목', type: 'text', hint: '첫 번째 카드의 값이 섹션 제목으로 쓰입니다' },
        { key: 'title', label: '카드 제목', type: 'text', required: true },
        { key: 'subtitle', label: '부제', type: 'text', full: true },
        { key: 'caption', label: '하단 설명', type: 'text', full: true },
        { key: 'image_url', label: '배경 이미지', type: 'image', full: true },
        { key: 'link', label: '연결 URL', type: 'url', full: true },
        { key: 'link_target', label: '링크 열기', type: 'select', options: [['_self', '현재 창'], ['_blank', '새 창']] },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 메뉴 관리 ---------------- */
  menus: {
    icon: 'list', label: '메뉴 관리', table: 'menus',
    desc: '헤더 상단 유틸 메뉴, 헤더 아이콘, GNB 좌우 부가 메뉴, 모바일 하단 탭, 모바일 전체메뉴, 서브내비 우측 링크를 모두 여기서 수정합니다.',
    columns: [
      { key: 'icon', label: '아이콘', type: 'emoji' },
      { key: 'label', label: '이름', type: 'main', sub: 'link' },
      { key: 'position', label: '위치', type: 'badge-text' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['label', 'link'],
    filters: [{
      key: 'position', label: '위치', options: [['', '전체'], ['utility', '헤더 최상단 유틸'], ['header_action', '헤더 우측 아이콘'],
      ['gnb_left', 'GNB 왼쪽'], ['gnb_right', 'GNB 오른쪽'], ['mobile_tab', '모바일 하단 탭'],
      ['drawer_etc', '모바일 전체메뉴'], ['subnav_right', '서브내비 우측']]
    }],
    groups: [{
      title: '메뉴 항목', fields: [
        {
          key: 'position', label: '노출 위치', type: 'select', required: true,
          options: [['utility', '헤더 최상단 유틸'], ['header_action', '헤더 우측 아이콘'],
          ['gnb_left', 'GNB 왼쪽 (전체보기 자리)'], ['gnb_right', 'GNB 오른쪽'],
          ['mobile_tab', '모바일 하단 탭 (4~5개 권장)'], ['drawer_etc', '모바일 전체메뉴 하단'],
          ['subnav_right', '서브내비 우측']]
        },
        { key: 'label', label: '표시 이름', type: 'text', required: true },
        { key: 'link', label: '연결 URL', type: 'url', full: true, hint: '내부: list.html?cat=beauty · 외부: https://...' },
        { key: 'link_target', label: '링크 열기', type: 'select', options: [['_self', '현재 창'], ['_blank', '새 창']] },
        { key: 'icon', label: '아이콘', type: 'iconpick', hint: '헤더 아이콘·모바일 탭·전체메뉴에 사용됩니다' },
        { key: 'badge', label: '배지', type: 'text', hint: 'NEW / HOT' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 퀵링크 ---------------- */
  quick_links: {
    icon: 'bookmark', label: '헤더 퀵링크', table: 'quick_links',
    desc: '헤더 검색창 아래의 프로모션 링크 줄입니다.',
    columns: [
      { key: 'label', label: '이름', type: 'main', sub: 'link' },
      { key: 'emphasis', label: '강조', type: 'badge' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['label', 'link'],
    groups: [{
      title: '링크', fields: [
        { key: 'label', label: '표시 이름', type: 'text', required: true },
        { key: 'link', label: '연결 URL', type: 'url', full: true },
        { key: 'emphasis', label: '포인트 컬러로 강조', type: 'bool' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 키워드 ---------------- */
  keywords: {
    icon: 'search', label: '인기 키워드', table: 'keywords',
    columns: [
      { key: 'label', label: '키워드', type: 'main', sub: 'link' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['label'],
    groups: [{
      title: '키워드', fields: [
        { key: 'label', label: '표시 문구', type: 'text', required: true, hint: '예) #인생샷 📸' },
        { key: 'link', label: '연결 URL', type: 'url', full: true },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 푸터 링크 ---------------- */
  footer_links: {
    icon: 'link', label: '푸터 링크', table: 'footer_links',
    columns: [
      { key: 'label', label: '이름', type: 'main', sub: 'link' },
      { key: 'emphasis', label: '강조', type: 'badge' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['label', 'link'],
    groups: [{
      title: '링크', fields: [
        { key: 'label', label: '표시 이름', type: 'text', required: true },
        { key: 'link', label: '연결 URL', type: 'url', full: true },
        { key: 'emphasis', label: '굵게 강조', type: 'bool' },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  },

  /* ---------------- 공지 ---------------- */
  notices: {
    icon: 'megaphone', label: '공지사항', table: 'notices', orderBy: 'created_at', asc: false,
    columns: [
      { key: 'title', label: '제목', type: 'main', sub: 'category' },
      { key: 'is_pinned', label: '고정', type: 'badge' },
      { key: 'created_at', label: '등록일', type: 'date' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['title', 'content'],
    groups: [{
      title: '공지 내용', fields: [
        { key: 'title', label: '제목', type: 'text', required: true, full: true },
        { key: 'category', label: '분류', type: 'text', hint: '공지 / 안내 / 이벤트' },
        { key: 'is_pinned', label: '상단 고정', type: 'bool' },
        { key: 'content', label: '내용', type: 'textarea', full: true },
        { key: 'is_active', label: '노출', type: 'bool' }
      ]
    }]
  },

  /* ---------------- 커스텀 페이지 ---------------- */
  pages: {
    icon: 'file', label: '페이지 관리', table: 'pages',
    desc: '이용약관·소개 등 자유 페이지입니다. /page.html?slug=주소 로 열립니다. 외부 URL을 넣으면 해당 주소로 이동합니다.',
    columns: [
      { key: 'title', label: '제목', type: 'main', sub: 'slug' },
      { key: 'external_url', label: '외부 URL' },
      { key: 'sort', label: '순서', type: 'sort' },
      { key: 'is_active', label: '노출', type: 'active' }
    ],
    search: ['title', 'slug'],
    groups: [{
      title: '페이지', fields: [
        { key: 'title', label: '제목', type: 'text', required: true },
        { key: 'slug', label: 'slug', type: 'text', required: true, hint: '예) about → /page.html?slug=about' },
        { key: 'external_url', label: '외부 URL로 대체', type: 'url', full: true, hint: '입력하면 내용 대신 이 주소로 이동합니다' },
        { key: 'content', label: '내용 (HTML 사용 가능)', type: 'html', full: true },
        { key: 'is_active', label: '노출', type: 'bool' },
        { key: 'sort', label: '정렬 순서', type: 'number' }
      ]
    }]
  }
};

/* 사이드바 그룹 구성 */
window.ADMIN_NAV = [
  { title: '현황', items: ['dashboard'] },
  { title: '콘텐츠', items: ['partners', 'media', 'notices', 'pages'] },
  { title: '노출 영역', items: ['banners', 'series_cards', 'ads', 'popups'] },
  { title: '메뉴 · 분류', items: ['menus', 'nav_categories', 'nav_items', 'regions', 'quick_links', 'keywords', 'footer_links'] },
  { title: '설정', items: ['settings'] }
];
