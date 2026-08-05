-- =====================================================================
--  중여커 초기 데이터 (schema.sql 실행 후 Run)
--  ※ 예시입니다. 관리자 페이지(/admin)에서 자유롭게 수정·추가하세요.
--  ※ 도시/세부지역/업종/세부업종은 계속 추가할 수 있고,
--     지역은 메뉴에 자동 반영되므로 업종마다 다시 넣을 필요가 없습니다.
-- =====================================================================

-- ---------- 1) 도시 (대지역) ----------
insert into regions (name, slug, name_cn, sort) values
  ('상하이', 'shanghai',  '上海', 1),
  ('베이징', 'beijing',   '北京', 2),
  ('광저우', 'guangzhou', '广州', 3),
  ('선전',   'shenzhen',  '深圳', 4),
  ('항저우', 'hangzhou',  '杭州', 5),
  ('칭다오', 'qingdao',   '青岛', 6),
  ('청두',   'chengdu',   '成都', 7),
  ('시안',   'xian',      '西安', 8),
  ('충칭',   'chongqing', '重庆', 9),
  ('홍콩',   'hongkong',  '香港', 10)
on conflict (slug) do nothing;

-- ---------- 2) 세부 지역 (도시 하위) ----------
insert into regions (name, slug, name_cn, parent_id, sort)
select v.name, v.slug, v.cn, (select id from regions where slug = v.p), v.sort
from (values
  ('징안구',   'sh-jingan',    '静安区',   'shanghai', 1),
  ('황푸구',   'sh-huangpu',   '黄浦区',   'shanghai', 2),
  ('푸둥',     'sh-pudong',    '浦东新区', 'shanghai', 3),
  ('홍차오',   'sh-hongqiao',  '虹桥',     'shanghai', 4),
  ('구베이',   'sh-gubei',     '古北',     'shanghai', 5),
  ('왕푸징',   'bj-wangfujing','王府井',   'beijing', 1),
  ('산리툰',   'bj-sanlitun',  '三里屯',   'beijing', 2),
  ('왕징',     'bj-wangjing',  '望京',     'beijing', 3),
  ('첸먼',     'bj-qianmen',   '前门',     'beijing', 4),
  ('톈허구',   'gz-tianhe',    '天河区',   'guangzhou', 1),
  ('웨슈구',   'gz-yuexiu',    '越秀区',   'guangzhou', 2),
  ('푸톈구',   'sz-futian',    '福田区',   'shenzhen', 1),
  ('난산구',   'sz-nanshan',   '南山区',   'shenzhen', 2),
  ('시후',     'hz-xihu',      '西湖区',   'hangzhou', 1),
  ('라오산',   'qd-laoshan',   '崂山区',   'qingdao', 1)
) as v(name, slug, cn, p, sort)
on conflict (slug) do nothing;

-- ---------- 3) 업종 대분류 (GNB) ----------
insert into nav_categories (name, slug, icon, sort, show_in_quick, auto_regions) values
  ('뷰티',        'beauty',   'beauty',   1, true, true),
  ('웰빙·마사지', 'wellness', 'wellness', 2, true, true),
  ('체험',        'activity', 'activity', 3, true, true),
  ('미식',        'food',     'food',     4, true, true),
  ('쇼핑',        'shopping', 'shopping', 5, true, true),
  ('숙박',        'stay',     'stay',     6, true, true),
  ('교통·투어',   'tour',     'tour',     7, true, true)
on conflict (slug) do nothing;

-- ---------- 4) 세부 업종 ----------
insert into nav_categories (name, slug, parent_id, sort, show_in_quick, is_active)
select v.name, v.slug, (select id from nav_categories where slug = v.p), v.sort, false, true
from (values
  ('헤어',          'beauty-hair',      'beauty', 1),
  ('네일',          'beauty-nail',      'beauty', 2),
  ('속눈썹·왁싱',   'beauty-lash',      'beauty', 3),
  ('피부관리',      'beauty-skin',      'beauty', 4),
  ('메이크업',      'beauty-makeup',    'beauty', 5),

  ('발마사지',      'wellness-foot',    'wellness', 1),
  ('전신마사지',    'wellness-body',    'wellness', 2),
  ('스파·사우나',   'wellness-spa',     'wellness', 3),
  ('한방·부항',     'wellness-herbal',  'wellness', 4),

  ('전통복 촬영',   'activity-hanfu',   'activity', 1),
  ('사진 스튜디오', 'activity-studio',  'activity', 2),
  ('공방·클래스',   'activity-class',   'activity', 3),
  ('야경 투어',     'activity-night',   'activity', 4),

  ('훠궈',          'food-hotpot',      'food', 1),
  ('딤섬·광둥',     'food-dimsum',      'food', 2),
  ('마라·촨촨',     'food-mala',        'food', 3),
  ('한식',          'food-korean',      'food', 4),
  ('카페·디저트',   'food-cafe',        'food', 5),

  ('잡화·기념품',   'shopping-goods',   'shopping', 1),
  ('차·건강식품',   'shopping-tea',     'shopping', 2),
  ('안경·시계',     'shopping-optic',   'shopping', 3),
  ('전자기기',      'shopping-digital', 'shopping', 4),

  ('호텔',          'stay-hotel',       'stay', 1),
  ('레지던스',      'stay-residence',   'stay', 2),
  ('게스트하우스',  'stay-guesthouse',  'stay', 3),

  ('공항 픽업',     'tour-pickup',      'tour', 1),
  ('전용 차량',     'tour-charter',     'tour', 2),
  ('가이드 투어',   'tour-guide',       'tour', 3),
  ('티켓·입장권',   'tour-ticket',      'tour', 4)
) as v(name, slug, p, sort)
on conflict (slug) do nothing;

-- ---------- 5) 테마 (업종별 공통 테마) ----------
--  ※ 지역은 자동 반영되므로 여기에 넣지 않습니다.
insert into nav_items (category_id, group_type, label, link, sort)
select c.id, 'theme', t.label, 'list.html?cat=' || c.slug || '&tag=' || t.slug, t.sort
from nav_categories c
cross join (values
  ('인생샷 명소',   'photo',     1),
  ('힐링 추천',     'healing',   2),
  ('단독 혜택',     'exclusive', 3),
  ('신규 오픈',     'new',       4),
  ('한국어 가능',   'korean',    5),
  ('심야 영업',     'late',      6)
) as t(label, slug, sort)
where c.parent_id is null;

-- ---------- 6) 프로모션 (메가메뉴 우측) ----------
insert into nav_items (category_id, group_type, label, link, sort)
select c.id, 'promo', c.name || ' 제휴처 전체보기', 'list.html?cat=' || c.slug, 1
from nav_categories c where c.parent_id is null;

insert into nav_items (category_id, group_type, label, link, badge, sort)
select c.id, 'promo', '이달의 ' || c.name || ' 혜택', 'list.html?cat=' || c.slug || '&featured=1', 'HOT', 2
from nav_categories c where c.parent_id is null;

-- ---------- 7) 헤더 퀵링크 ----------
insert into quick_links (label, link, emphasis, sort) values
  ('중여커PICK',    'list.html?featured=1',     true,  1),
  ('신규 제휴',     'list.html?sort=new',       false, 2),
  ('단독 혜택',     'list.html?tag=exclusive',  false, 3),
  ('영상 모아보기', 'media.html',               false, 4),
  ('제휴 문의',     'page.html?slug=partner',   false, 5);

-- ---------- 8) 인기 키워드 ----------
insert into keywords (label, link, sort) values
  ('#인생샷',   'list.html?q=인생샷',   1),
  ('#힐링',     'list.html?q=힐링',     2),
  ('#피로회복', 'list.html?q=마사지',   3),
  ('#메이크업', 'list.html?q=메이크업', 4),
  ('#이색체험', 'list.html?q=체험',     5),
  ('#훠궈',     'list.html?q=훠궈',     6);

-- ---------- 9) 히어로 배너 ----------
insert into banners (type, label, title, subtitle, link, bg_color, sort) values
  ('hero', '중여커 회원 전용', '중국 여행, 아는 사람만 받는 혜택', '현지 제휴업체 할인·서비스를 한 곳에서', 'list.html', '#4A92BD', 1),
  ('hero', 'NEW', '상하이 신규 제휴처 오픈', '지금 예약하면 첫 방문 추가 할인', 'list.html?region=shanghai', '#2F6C91', 2),
  ('hero', 'HOT', '피로회복 마사지 BEST', '중여커 회원 10~20% 할인', 'list.html?cat=wellness', '#FF6B35', 3);

-- ---------- 10) 기획전 배너 ----------
insert into banners (type, title, subtitle, link, period_text, bg_color, sort) values
  ('event', '여름 뷰티 기획전', '헤어·네일·메이크업 최대 30%', 'list.html?cat=beauty', '~ 상시', '#4A92BD', 1),
  ('event', '상하이 이색체험 모음', '중여커 단독 예약 혜택', 'list.html?region=shanghai&cat=activity', '~ 상시', '#2F6C91', 2),
  ('event', '신규 제휴사 모집', '중여커와 함께할 파트너를 찾습니다', 'page.html?slug=partner', '상시 접수', '#FF6B35', 3);

-- ---------- 11) 푸터 링크 ----------
insert into footer_links (label, link, emphasis, sort) values
  ('중여커 소개',       'page.html?slug=about',   false, 1),
  ('개인정보처리방침',  'page.html?slug=privacy', true,  2),
  ('이용약관',          'page.html?slug=terms',   false, 3),
  ('제휴 문의',         'page.html?slug=partner', false, 4);

-- ---------- 12) 공지 ----------
insert into notices (title, content, category, is_pinned) values
  ('중여커 제휴 혜택 가이드 개편 안내',
   '더 보기 편한 구조로 새단장했습니다. 지역·업종별 제휴처와 홍보 영상을 한 곳에서 확인하세요.',
   '공지', true),
  ('제휴업체 상시 모집 안내',
   '중국 현지 사업자님의 제휴 신청을 상시 접수하고 있습니다.',
   '안내', false);

-- ---------- 13) 광고 (외부 URL) ----------
insert into ads (slot, title, subtitle, advertiser, link, link_target, bg_color, text_color, sort) values
  ('top_strip', 'NEW! 이달의 신규 제휴처', '새로 합류한 제휴업체와 혜택 모아보기', '중여커', 'list.html?sort=new', '_self', '#FDEBF3', '#8A2C56', 1);

insert into ads (slot, title, subtitle, advertiser, link, link_target, bg_color, sort) values
  ('main_wide',   '중여커 제휴 파트너 모집', '중국 현지 사업자 상시 접수 · 클릭하여 신청', '중여커', 'https://benefits.zhongyouke.com', '_blank', '#4A92BD', 1),
  ('list_inline', '광고 문의 배너 자리', '관리자 > 광고 관리에서 이미지와 외부 URL을 설정하세요', '중여커', 'https://benefits.zhongyouke.com', '_blank', '#F1F5F8', 2);

-- ---------- 14) 팝업 ----------
insert into popups (title, link, link_target, position, width, show_on, hide_days, is_active) values
  ('중여커 제휴 혜택 가이드 오픈', 'list.html', '_self', 'left', 380, 'main', 1, false);

-- ---------- 15) 시리즈 카드 ----------
insert into series_cards (section_title, title, subtitle, caption, link, sort) values
  ('중여커 시리즈', '중국 첫 방문이라면?', '꼭 알아야 할 현지 이용 팁', '초보 여행자 필수 가이드', 'page.html?slug=about', 1),
  ('중여커 시리즈', '상하이 3박4일 혜택 코스', '제휴처만 돌아도 알찬 일정', '중여커 추천 코스', 'list.html?region=shanghai', 2),
  ('중여커 시리즈', '현지에서 바로 쓰는 위챗 예약법', '캡처 한 장으로 끝내기', '이용 가이드', 'notice.html', 3);

-- ---------- 16) 커스텀 페이지 ----------
insert into pages (slug, title, content, sort) values
  ('about',   '중여커 소개',        '<p>중여커는 중국 여행자 커뮤니티입니다.</p>', 1),
  ('partner', '제휴 문의',          '<p>제휴를 원하시는 사업자님은 위챗으로 문의해 주세요.</p>', 2),
  ('privacy', '개인정보처리방침',   '<p>내용을 관리자 페이지에서 입력하세요.</p>', 3),
  ('terms',   '이용약관',           '<p>내용을 관리자 페이지에서 입력하세요.</p>', 4)
on conflict (slug) do nothing;

-- ---------- 17) 제휴업체 예시 ----------
insert into partners
  (name, name_cn, slug, category_id, category_label, region_id, region_label,
   branch_count, summary, description, benefit_summary, benefit_detail,
   booking_method, business_hours, price_info, address, wechat_id,
   tags, badge, is_featured, sort)
values
  ('상하이 헤어살롱 예시', '上海美发沙龙', 'sample-hair-shanghai',
   (select id from nav_categories where slug='beauty-hair'), '헤어',
   (select id from regions where slug='sh-jingan'), '상하이 징안구', 2,
   '한국인 디자이너가 상주하는 상하이 대표 헤어살롱',
   E'한국에서 경력을 쌓은 디자이너가 직접 시술합니다.\n의사소통 걱정 없이 원하는 스타일을 요청하세요.',
   '10% 할인',
   E'· 중여커 회원 전 시술 10% 할인\n· 첫 방문 시 트리트먼트 1회 무료\n· 예약 시 "중여커" 언급 필수',
   '위챗으로 사전 예약 (당일 예약 불가)', '10:00 ~ 20:00 (월요일 휴무)', '커트 150元 ~',
   '上海市静安区南京西路', 'zhongyouke_demo',
   '["#인생샷","#메이크업","#한국어 가능"]'::jsonb, 'BEST', true, 1),

  ('상하이 발마사지 예시', '上海足疗', 'sample-massage-shanghai',
   (select id from nav_categories where slug='wellness-foot'), '발마사지',
   (select id from regions where slug='sh-huangpu'), '상하이 황푸구', 1,
   '여행 마지막 날 피로를 풀기 좋은 프리미엄 마사지숍',
   '깔끔한 시설과 숙련된 관리사로 한국인 여행자에게 인기 있는 곳입니다.',
   '15% 할인',
   E'· 전 코스 15% 할인\n· 90분 이상 코스 예약 시 차 서비스 제공',
   '위챗 예약 또는 현장 방문', '11:00 ~ 24:00 (연중무휴)', '60분 128元 ~',
   '上海市黄浦区', 'zhongyouke_demo',
   '["#피로회복","#힐링","#심야 영업"]'::jsonb, null, true, 2),

  ('베이징 전통복 체험 예시', '北京汉服体验', 'sample-hanfu-beijing',
   (select id from nav_categories where slug='activity-hanfu'), '전통복 촬영',
   (select id from regions where slug='bj-qianmen'), '베이징 첸먼', 1,
   '고궁 앞에서 즐기는 전통 의상 촬영 체험',
   '의상 대여부터 헤어·메이크업, 야외 촬영까지 한 번에 해결됩니다.',
   '20% 할인 + 원본 사진 제공',
   E'· 촬영 패키지 20% 할인\n· 보정본 5장 + 원본 전체 제공\n· 평일 방문 시 소품 무료 대여',
   '위챗 사전 예약 (3일 전까지)', '09:00 ~ 18:00', '패키지 480元 ~',
   '北京市东城区前门大街', 'zhongyouke_demo',
   '["#인생샷","#이색체험"]'::jsonb, 'NEW', true, 3),

  ('광저우 딤섬 노포 예시', '广州点心老店', 'sample-dimsum-guangzhou',
   (select id from nav_categories where slug='food-dimsum'), '딤섬·광둥',
   (select id from regions where slug='gz-yuexiu'), '광저우 웨슈구', 1,
   '현지인이 줄 서는 30년 전통 딤섬 노포',
   '아침 6시부터 문을 여는 광저우식 얌차 문화를 그대로 경험할 수 있습니다.',
   '음료 무료 제공',
   E'· 중여커 회원 차(茶) 무료\n· 2인 이상 방문 시 대표 메뉴 1종 서비스',
   '현장 방문 (예약 불가)', '06:00 ~ 15:00', '1인 60元 ~',
   '广州市越秀区', 'zhongyouke_demo',
   '["#미식","#한국어 가능"]'::jsonb, null, true, 4),

  ('선전 공항 픽업 예시', '深圳机场接送', 'sample-pickup-shenzhen',
   (select id from nav_categories where slug='tour-pickup'), '공항 픽업',
   (select id from regions where slug='sz-futian'), '선전 푸톈구', 1,
   '한국어 가능 기사님이 배정되는 공항 픽업 서비스',
   '항공편 지연 시 대기 요금 없이 무료로 기다려 드립니다.',
   '10% 할인',
   E'· 편도 요금 10% 할인\n· 유아 카시트 무료 제공\n· 항공편 지연 무료 대기',
   '위챗으로 항공편명 전달 후 예약', '24시간 운영', '편도 280元 ~',
   '深圳宝安国际机场', 'zhongyouke_demo',
   '["#한국어 가능","#심야 영업"]'::jsonb, null, false, 5);

-- ---------- 18) 홍보 영상 (URL만 넣으면 자동 인식) ----------
insert into partner_media (partner_id, platform, url, title, show_on_main, sort)
values
  ((select id from partners where slug='sample-hair-shanghai'),
   'auto', 'https://www.youtube.com/shorts/aqz-KE-bpKQ', '상하이 헤어살롱 둘러보기', true, 1),
  ((select id from partners where slug='sample-massage-shanghai'),
   'auto', 'https://www.instagram.com/reel/CxIlBDNxxxx/', '발마사지 후기 릴스', true, 2),
  ((select id from partners where slug='sample-hanfu-beijing'),
   'auto', 'https://www.youtube.com/shorts/aqz-KE-bpKQ', '베이징 전통복 촬영 브이로그', true, 3);

-- ---------- 19) 메뉴 (헤더 유틸 / GNB 부가 / 헤더 아이콘 / 모바일 탭 / 드로어 / 서브내비 우측) ----------
insert into menus (position, label, link, icon, sort) values
  ('utility',       '영상 모아보기', 'media.html',              null, 1),
  ('utility',       '공지사항',      'notice.html',             null, 2),
  ('utility',       '제휴 문의',     'page.html?slug=partner',  null, 3),
  ('utility',       '관리자',        'admin.html',        null, 4),

  ('gnb_left',      '전체보기',      'list.html',               null, 1),
  ('gnb_right',     '영상',          'media.html',              null, 1),
  ('gnb_right',     '공지·문의',     'notice.html',             null, 2),

  ('header_action', '찜한 곳',       'list.html?fav=1',         'heart', 1),
  ('header_action', '영상',          'media.html',              'play',  2),
  ('header_action', '문의',          'notice.html',             'chat',  3),

  ('mobile_tab',    '홈',            'index.html',              'home',  1),
  ('mobile_tab',    '제휴처',        'list.html',               'grid',  2),
  ('mobile_tab',    '영상',          'media.html',              'video', 3),
  ('mobile_tab',    '찜',            'list.html?fav=1',         'heart', 4),
  ('mobile_tab',    '문의',          'notice.html',             'chat',  5),

  ('drawer_etc',    '전체 제휴업체', 'list.html',               'grid',     1),
  ('drawer_etc',    '영상 모아보기', 'media.html',              'video',    2),
  ('drawer_etc',    '찜한 곳',       'list.html?fav=1',         'heart',    3),
  ('drawer_etc',    '공지사항 · 문의','notice.html',            'chat',     4),
  ('drawer_etc',    '제휴 신청',     'page.html?slug=partner',  'gift',     5),
  ('drawer_etc',    '관리자',        'admin.html',        'settings', 6),

  ('subnav_right',  '영상',          'media.html',              null, 1),
  ('subnav_right',  '제휴 문의',     'page.html?slug=partner',  null, 2);
