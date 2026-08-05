-- =====================================================================
--  중여커 제휴 혜택 가이드 · Supabase 스키마
--  Supabase Dashboard > SQL Editor 에 붙여넣고 Run 하세요.
--  (재실행 가능하도록 IF NOT EXISTS / DROP POLICY IF EXISTS 사용)
-- =====================================================================

-- ---------------------------------------------------------------------
-- 0. 확장
-- ---------------------------------------------------------------------
create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------
-- 1. 사이트 전역 설정 (단일 행, id = 1)
--    관리자 페이지 > 사이트 설정 에서 전부 수정 가능
-- ---------------------------------------------------------------------
create table if not exists site_settings (
  id                int primary key default 1,
  site_name         text default '중여커',
  site_title        text default '중여커 중국 현지 제휴 혜택 가이드',
  site_description  text default '중국 주요 제휴업체의 상호명, 지역, 업종, 혜택 현황을 한눈에 파악할 수 있는 가이드입니다.',
  logo_url          text default '/assets/img/logo.png',
  favicon_url       text,
  og_image_url      text,

  -- 브랜드 컬러 (CSS 변수로 주입)
  color_primary     text default '#4A92BD',
  color_primary_dark text default '#2F6C91',
  color_primary_light text default '#EAF3F9',
  color_point       text default '#FF6B35',

  -- 헤더
  header_notice     text default '중여커 회원 전용 · 중국 현지 제휴 혜택',
  search_placeholder text default '업체명, 지역, 혜택을 검색해 보세요',

  -- 히어로 카피
  hero_title        text default '중국 여행, 중여커 회원이면 더 저렴하게',
  hero_subtitle     text default '현지 제휴업체 혜택을 한 곳에서',

  -- 고객센터 / 문의
  cs_title          text default '중여커 고객센터',
  cs_hours          text default '평일 오전 10시 ~ 오후 7시 (토·일, 공휴일 휴무)',
  cs_phone          text default '',
  cs_kakao_url      text default '',
  cs_wechat_id      text default '',
  cs_email          text default '',

  -- 푸터 회사 정보
  company_name      text default '중여커 (중국 여행자 커뮤니티)',
  company_ceo       text default '',
  company_address   text default '',
  company_reg_no    text default '',
  company_extra     text default '',
  copyright_text    text default '© ZhongYouKe. All Rights Reserved.',

  -- SNS
  sns_instagram     text default '',
  sns_youtube       text default '',
  sns_naver_blog    text default '',
  sns_kakao         text default '',
  sns_xiaohongshu   text default '',
  sns_douyin        text default '',

  -- 하단 안내 문구 (여러 줄)
  footer_notice     text default '중여커는 제휴업체와 이용자를 연결하는 정보 제공 플랫폼이며, 통신판매의 당사자가 아닙니다.',

  -- 메인 섹션 제목 (관리자에서 문구 변경 가능)
  sec_featured_title    text default '중여커 추천 업체',
  sec_featured_sub      text default '회원들이 가장 많이 찾은 제휴처',
  sec_media_title       text default '영상으로 먼저 보기',
  sec_media_sub         text default '인스타 릴스 · 유튜브 쇼츠로 만나는 제휴업체',
  sec_region_title      text default '지역별 제휴업체',
  sec_region_sub        text default '가고 싶은 도시를 선택하세요',
  sec_event_title       text default '기획전 · 이벤트',
  sec_event_sub         text default '지금 진행 중인 혜택',

  updated_at        timestamptz default now()
);

insert into site_settings (id) values (1) on conflict (id) do nothing;

-- ---------------------------------------------------------------------
-- 2. GNB 대분류 (업종) — 노랑풍선의 '해외패키지 / 에어텔 / 허니문' 위치
-- ---------------------------------------------------------------------
create table if not exists nav_categories (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  icon        text default '🏷️',          -- 퀵카테고리 아이콘(이모지 또는 이미지 URL)
  image_url   text,                        -- 아이콘 이미지 사용 시
  link        text,                        -- 비우면 /list.html?cat=slug 로 자동 연결
  description text,
  sort        int  default 0,
  is_active   boolean default true,
  show_in_quick boolean default true,      -- 메인 퀵카테고리 노출 여부
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 3. GNB 하위 항목 — 노랑풍선 메가메뉴의 '지역 / 테마 / 프로모션' 3컬럼
--    group_type: region | theme | promo
-- ---------------------------------------------------------------------
create table if not exists nav_items (
  id            uuid primary key default gen_random_uuid(),
  category_id   uuid references nav_categories(id) on delete cascade,
  group_type    text not null default 'region',
  label         text not null,
  link          text,
  badge         text,                      -- NEW / HOT 등
  sort          int default 0,
  is_active     boolean default true
);

-- ---------------------------------------------------------------------
-- 4. 지역 마스터
-- ---------------------------------------------------------------------
create table if not exists regions (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  slug        text not null unique,
  name_cn     text,
  image_url   text,
  sort        int default 0,
  is_active   boolean default true
);

-- ---------------------------------------------------------------------
-- 5. 제휴업체
-- ---------------------------------------------------------------------
create table if not exists partners (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,                 -- 상호명
  name_cn         text,                          -- 현지 상호명
  slug            text unique,
  category_id     uuid references nav_categories(id) on delete set null,
  category_label  text,                          -- 업종 표시용 (자유 입력)
  region_id       uuid references regions(id) on delete set null,
  region_label    text,                          -- 지역 표시용
  branch_count    int default 1,
  address         text,
  map_url         text,

  summary         text,                          -- 카드 한 줄 소개
  description     text,                          -- 상세 소개 (여러 줄)

  benefit_summary text,                          -- 예: 10% 할인
  benefit_detail  text,                          -- 혜택 상세 (여러 줄)
  booking_method  text,                          -- 예약 방법
  price_info      text,                          -- 가격대
  business_hours  text,                          -- 영업시간
  phone           text,
  wechat_id       text,
  qr_image_url    text,                          -- 위챗 예약 QR
  notice          text,                          -- 이용 시 유의사항

  thumbnail_url   text,                          -- 대표 이미지
  images          jsonb default '[]'::jsonb,     -- 갤러리 이미지 URL 배열
  tags            jsonb default '[]'::jsonb,     -- ["#인생샷","#힐링"]

  rating          numeric(2,1) default 0,
  badge           text,                          -- BEST / NEW / 단독
  is_featured     boolean default false,         -- 추천 업체
  is_active       boolean default true,
  sort            int default 0,
  view_count      int default 0,
  created_at      timestamptz default now(),
  updated_at      timestamptz default now()
);

create index if not exists idx_partners_category on partners(category_id);
create index if not exists idx_partners_region   on partners(region_id);

-- ---------------------------------------------------------------------
-- 6. 제휴업체 홍보 영상 (인스타 릴스 / 유튜브 쇼츠 / 도우인 / 샤오홍슈)
--    URL만 넣으면 프론트에서 자동으로 임베드 형태를 판별합니다.
-- ---------------------------------------------------------------------
create table if not exists partner_media (
  id          uuid primary key default gen_random_uuid(),
  partner_id  uuid references partners(id) on delete cascade,
  platform    text default 'auto',    -- auto | youtube | instagram | tiktok | bilibili | douyin | xiaohongshu | kuaishou | video
  url         text not null,
  title       text,
  thumbnail_url text,                 -- 비우면 유튜브는 자동 생성
  sort        int default 0,
  is_active   boolean default true,
  show_on_main boolean default false, -- 메인 '영상으로 먼저 보기' 섹션 노출
  created_at  timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 7. 배너 (히어로 슬라이더 / 띠배너 / 기획전)
--    type: hero | strip | event
-- ---------------------------------------------------------------------
create table if not exists banners (
  id          uuid primary key default gen_random_uuid(),
  type        text not null default 'hero',
  title       text,
  subtitle    text,
  label       text,                  -- 상단 작은 라벨
  image_url   text,
  image_url_mobile text,             -- 모바일 전용 이미지(선택)
  link        text,
  bg_color    text default '#4A92BD',
  text_color  text default '#FFFFFF',
  period_text text,                  -- 기간 표기
  sort        int default 0,
  is_active   boolean default true
);

-- ---------------------------------------------------------------------
-- 8. 헤더 상단 프로모션 퀵링크 (노랑풍선 '옐로Pick/긴급특가' 라인)
-- ---------------------------------------------------------------------
create table if not exists quick_links (
  id        uuid primary key default gen_random_uuid(),
  label     text not null,
  link      text,
  emphasis  boolean default false,   -- 강조(포인트 컬러)
  sort      int default 0,
  is_active boolean default true
);

-- ---------------------------------------------------------------------
-- 9. 인기 검색 키워드
-- ---------------------------------------------------------------------
create table if not exists keywords (
  id        uuid primary key default gen_random_uuid(),
  label     text not null,           -- 예: #인생샷 📸
  link      text,
  sort      int default 0,
  is_active boolean default true
);

-- ---------------------------------------------------------------------
-- 10. 공지사항 / 이용안내
-- ---------------------------------------------------------------------
create table if not exists notices (
  id         uuid primary key default gen_random_uuid(),
  title      text not null,
  content    text,
  category   text default '공지',
  is_pinned  boolean default false,
  is_active  boolean default true,
  created_at timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 11. 푸터 링크 (약관/정책 등)
-- ---------------------------------------------------------------------
create table if not exists footer_links (
  id        uuid primary key default gen_random_uuid(),
  label     text not null,
  link      text,
  emphasis  boolean default false,
  sort      int default 0,
  is_active boolean default true
);

-- ---------------------------------------------------------------------
-- 12. 광고 (외부 URL 연결)
--     slot: top_strip | main_wide | list_inline | detail_bottom | side | mobile_bottom
-- ---------------------------------------------------------------------
create table if not exists ads (
  id            uuid primary key default gen_random_uuid(),
  slot          text not null default 'main_wide',
  title         text,
  subtitle      text,
  advertiser    text,                       -- 광고주명
  image_url     text,
  image_url_mobile text,
  html_code     text,                       -- 직접 HTML/스크립트(애드센스 등) 삽입
  link          text,                       -- 외부 URL
  link_target   text default '_blank',      -- _blank | _self
  bg_color      text default '#FFF3E6',
  text_color    text default '#7A4A16',
  is_closable   boolean default true,       -- 닫기 버튼 노출(top_strip)
  start_at      timestamptz,                -- 노출 시작 (비우면 즉시)
  end_at        timestamptz,                -- 노출 종료 (비우면 무기한)
  sort          int default 0,
  is_active     boolean default true,
  click_count   int default 0,
  created_at    timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 13. 팝업 레이어 ("오늘 하루 그만보기")
-- ---------------------------------------------------------------------
create table if not exists popups (
  id            uuid primary key default gen_random_uuid(),
  title         text,
  image_url     text,
  html_code     text,
  link          text,
  link_target   text default '_blank',
  position      text default 'left',        -- left | center | right
  width         int default 380,
  offset_x      int default 24,
  offset_y      int default 90,
  show_on       text default 'main',        -- main | all
  device        text default 'all',         -- all | pc | mobile
  hide_days     int default 1,              -- '오늘 하루 그만보기' 유지 일수
  start_at      timestamptz,
  end_at        timestamptz,
  sort          int default 0,
  is_active     boolean default true
);

-- ---------------------------------------------------------------------
-- 14. 커스텀 페이지 (제휴안내/이용약관 등, 외부 URL 리다이렉트도 가능)
-- ---------------------------------------------------------------------
create table if not exists pages (
  id            uuid primary key default gen_random_uuid(),
  slug          text unique not null,
  title         text not null,
  content       text,                       -- HTML 허용
  external_url  text,                       -- 값이 있으면 해당 URL로 이동
  is_active     boolean default true,
  sort          int default 0,
  created_at    timestamptz default now()
);

-- ---------------------------------------------------------------------
-- 15. 기획전 시리즈 카드 (노랑풍선 'Yellow Series' 형태)
-- ---------------------------------------------------------------------
create table if not exists series_cards (
  id            uuid primary key default gen_random_uuid(),
  section_title text default '중여커 시리즈',
  title         text,
  subtitle      text,
  caption       text,
  image_url     text,
  link          text,
  link_target   text default '_self',
  sort          int default 0,
  is_active     boolean default true
);

-- 제휴업체 외부 링크 컬럼 (기존 테이블에도 안전하게 추가)
alter table partners add column if not exists external_url text;
alter table partners add column if not exists link_target  text default '_self';
alter table partners add column if not exists booking_url  text;   -- 예약 페이지 외부 URL
alter table partners add column if not exists homepage_url text;
alter table partners add column if not exists instagram_url text;
alter table partners add column if not exists xiaohongshu_url text;


-- ---------------------------------------------------------------------
-- 16. 계층 구조 (도시 > 세부지역, 업종 > 세부업종)
-- ---------------------------------------------------------------------
alter table regions        add column if not exists parent_id uuid references regions(id) on delete set null;
alter table nav_categories add column if not exists parent_id uuid references nav_categories(id) on delete set null;
-- 지역 컬럼을 지역 마스터에서 자동 생성할지 (끄면 메가메뉴 하위항목만 사용)
alter table nav_categories add column if not exists auto_regions boolean default true;

create index if not exists idx_regions_parent on regions(parent_id);
create index if not exists idx_navcat_parent  on nav_categories(parent_id);


-- ---------------------------------------------------------------------
-- 17. 메뉴 (하드코딩 없이 관리자에서 전부 편집)
--     position: utility | gnb_left | gnb_right | header_action
--               | mobile_tab | drawer_etc | subnav_right
-- ---------------------------------------------------------------------
create table if not exists menus (
  id          uuid primary key default gen_random_uuid(),
  position    text not null default 'utility',
  label       text not null,
  link        text,
  link_target text default '_self',
  icon        text,
  badge       text,
  sort        int default 0,
  is_active   boolean default true
);

-- ---------------------------------------------------------------------
-- 18. 사이트 설정 추가 문구 (상세·목록 고정 문구를 편집 가능하게)
-- ---------------------------------------------------------------------
alter table site_settings add column if not exists detail_benefit_title  text default '중여커 회원 전용 혜택';
alter table site_settings add column if not exists detail_benefit_sec    text default '제휴 혜택 상세';
alter table site_settings add column if not exists detail_intro_sec      text default '업체 소개';
alter table site_settings add column if not exists detail_media_sec      text default '홍보 영상';
alter table site_settings add column if not exists detail_guide_sec      text default '이용 안내';
alter table site_settings add column if not exists detail_book_sec       text default '예약 방법';
alter table site_settings add column if not exists detail_loc_sec        text default '위치';
alter table site_settings add column if not exists detail_related_title  text default '이런 곳은 어떠세요?';
alter table site_settings add column if not exists detail_member_notice  text default '방문 시 "중여커 회원" 이라고 말씀하셔야 혜택이 적용됩니다.';
alter table site_settings add column if not exists detail_booking_steps  text default E'위챗 스캔으로 QR을 읽거나 아래 ID를 검색합니다.\n희망 날짜·시간과 인원을 알려 주세요.\n예약 시 "중여커 회원" 이라고 꼭 말씀해 주세요.';
alter table site_settings add column if not exists list_empty_text       text default '조건에 맞는 제휴업체가 없습니다.';
alter table site_settings add column if not exists fav_empty_text        text default '아직 찜한 제휴업체가 없습니다.';
alter table site_settings add column if not exists media_page_title      text default '영상으로 보는 제휴업체';
alter table site_settings add column if not exists notice_page_title     text default '공지사항 · 문의';
alter table site_settings add column if not exists partner_cta_text      text default '제휴 신청';
alter table site_settings add column if not exists analytics_id          text;  -- Google Analytics(GA4) 측정 ID: G-XXXXXXX

-- =====================================================================
--  RLS : 공개 읽기 / 로그인 사용자만 쓰기
-- =====================================================================
do $$
declare t text;
begin
  foreach t in array array[
    'site_settings','nav_categories','nav_items','regions','partners',
    'partner_media','banners','quick_links','keywords','notices','footer_links',
    'ads','popups','pages','series_cards','menus'
  ] loop
    execute format('alter table %I enable row level security', t);

    execute format('drop policy if exists "public read %s" on %I', t, t);
    execute format('create policy "public read %s" on %I for select using (true)', t, t);

    execute format('drop policy if exists "auth write %s" on %I', t, t);
    execute format('create policy "auth write %s" on %I for all to authenticated using (true) with check (true)', t, t);
  end loop;
end $$;

-- =====================================================================
--  Storage : 이미지 업로드 버킷
-- =====================================================================
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists "media public read" on storage.objects;
create policy "media public read" on storage.objects
  for select using (bucket_id = 'media');

drop policy if exists "media auth write" on storage.objects;
create policy "media auth write" on storage.objects
  for insert to authenticated with check (bucket_id = 'media');

drop policy if exists "media auth update" on storage.objects;
create policy "media auth update" on storage.objects
  for update to authenticated using (bucket_id = 'media');

drop policy if exists "media auth delete" on storage.objects;
create policy "media auth delete" on storage.objects
  for delete to authenticated using (bucket_id = 'media');

-- =====================================================================
--  조회수 증가 RPC (비로그인도 호출 가능)
-- =====================================================================
create or replace function increment_partner_view(p_id uuid)
returns void language sql security definer as $$
  update partners set view_count = coalesce(view_count,0) + 1 where id = p_id;
$$;

grant execute on function increment_partner_view(uuid) to anon, authenticated;

create or replace function increment_ad_click(p_id uuid)
returns void language sql security definer as $$
  update ads set click_count = coalesce(click_count,0) + 1 where id = p_id;
$$;

grant execute on function increment_ad_click(uuid) to anon, authenticated;
