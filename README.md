# 중여커 제휴 혜택 가이드 (benefits.zhongyouke.com)

노랑풍선(ybtour.co.kr) 구조를 그대로 옮긴 제휴업체 포털 + 관리자 페이지입니다.
Supabase(데이터·이미지·로그인) + Vercel(정적 호스팅) 조합으로 동작하며, 빌드 과정이 필요 없습니다.

---

## 1. 파일 구조

```
zhongyouke-benefits/
├── index.html            메인 (히어로 슬라이더 / 퀵카테고리 / 추천 / 영상 / 지역 / 기획전 / 공지)
├── list.html             제휴업체 목록 (업종·지역·검색·정렬·찜)
├── detail.html           제휴업체 상세 (갤러리 / 혜택 / 위챗QR / 릴스·쇼츠 / 관련업체)
├── media.html            영상 모아보기 (플랫폼별 필터)
├── notice.html           공지사항 · 문의
├── page.html             자유 페이지 (?slug=about 형태, 외부 URL 리다이렉트 지원)
├── admin.html            관리자 (배포 시 /admin 으로 접속)
├── assets/
│   ├── css/style.css     사이트 스타일 (PC·모바일 반응형)
│   ├── css/admin.css     관리자 스타일
│   ├── img/logo.png      로고
│   └── js/
│       ├── config.js         ★ Supabase 키 입력 파일
│       ├── db.js             데이터 레이어 (+ 데모 폴백)
│       ├── common.js         헤더·메가메뉴·드로어·푸터·광고·팝업·영상모달
│       ├── cards.js          카드 렌더 공통
│       ├── main.js / list.js / detail.js
│       ├── admin-schema.js   ★ 관리자 입력 항목 정의
│       └── admin.js          관리자 엔진
├── supabase/schema.sql   테이블 · RLS · Storage (필수 실행)
├── supabase/seed.sql     예시 데이터 (선택)
├── vercel.json           /admin 라우팅 · 캐시 헤더
└── robots.txt
```

---

## 2. 설치 (약 10분)

### 2-1. Supabase

1. https://supabase.com 에서 프로젝트 생성 (리전은 **Singapore / Tokyo** 권장 — 중국 접속 속도)
2. **SQL Editor** → `supabase/schema.sql` 전체 붙여넣기 → **Run**
3. (선택) `supabase/seed.sql` 도 같은 방법으로 Run → 예시 데이터가 채워집니다
4. **Authentication → Users → Add user** 로 관리자 계정 생성
   - 이메일 / 비밀번호 입력, **Auto Confirm User 체크**
5. **Settings → API** 에서 `Project URL` 과 `anon public` 키 복사

### 2-2. 키 입력

`assets/js/config.js` 를 열어 두 줄을 수정합니다.

```js
SUPABASE_URL: 'https://xxxxxxxx.supabase.co',
SUPABASE_ANON_KEY: 'eyJhbGciOi...',
```

> anon 키는 공개되어도 안전합니다. 쓰기 권한은 RLS로 로그인 사용자에게만 열려 있습니다.

### 2-3. Vercel 배포

**방법 A — 드래그 앤 드롭**
1. https://vercel.com/new 접속
2. `zhongyouke-benefits` 폴더를 그대로 드래그
3. Framework Preset: **Other** → Deploy

**방법 B — GitHub 연동 (권장)**
```bash
cd zhongyouke-benefits
git init && git add . && git commit -m "init"
git remote add origin <내 저장소 주소>
git push -u origin main
```
Vercel → Add New Project → 저장소 선택 → Deploy

### 2-4. 도메인 연결

Vercel 프로젝트 → **Settings → Domains** → `benefits.zhongyouke.com` 추가 후
안내된 CNAME 레코드를 도메인 DNS에 등록합니다.

접속 주소
- 사이트: `https://benefits.zhongyouke.com`
- 관리자: `https://benefits.zhongyouke.com/admin`

---

## 3. 관리자에서 할 수 있는 것

| 메뉴 | 내용 |
|---|---|
| 대시보드 | 등록 현황 요약, 빠른 이동 |
| 제휴업체 | 상호명·지역·업종·혜택·영업정보·갤러리·태그·위챗QR·외부링크·추천/노출/순서 |
| 홍보 영상 | **URL만 붙여넣으면 자동 인식** — 유튜브 쇼츠 / 인스타 릴스 / 틱톡 / 더우인 / 샤오홍슈 / mp4 |
| 공지사항 | 제목·분류·내용·상단고정 |
| 페이지 관리 | 소개·약관 등 자유 페이지(HTML) 또는 외부 URL 리다이렉트 |
| 배너·기획전 | 메인 슬라이더 / 기획전 카드 (PC·모바일 이미지 분리, 배경색) |
| 시리즈 카드 | 메인 하단 가로형 카드 |
| **광고 관리** | 위치(상단 띠 / 메인 와이드 / 목록 중간 / 상세 하단 / 사이드 / 모바일 하단), 이미지, **외부 URL**, 노출 기간, 클릭수, 애드센스 등 **HTML 직접 삽입** |
| 팝업 레이어 | 위치·크기·기기·기간·"오늘 하루 그만보기" 유지일수 |
| 메뉴(업종) | 메가메뉴 대분류 = 메인 퀵카테고리. **상위 업종을 지정하면 세부 업종**이 됩니다 (뷰티 › 헤어/네일/…) |
| 메가메뉴 하위항목 | 대분류별 테마 / 프로모션 링크 (외부 URL 가능). 지역은 자동 반영이라 넣지 않아도 됩니다 |
| 지역 관리 | **도시를 추가하면 모든 업종 메뉴에 자동 반영**. 상위 도시를 지정하면 세부 지역(구·상권)이 됩니다 |
| **메뉴 관리** | 헤더 최상단 유틸 / 헤더 우측 아이콘 / GNB 좌우 부가메뉴 / 모바일 하단 탭 / 모바일 전체메뉴 / 서브내비 우측 — **사이트에 보이는 모든 메뉴** |
| 헤더 퀵링크 / 인기 키워드 / 푸터 링크 | 문구 + 링크 자유 설정 |
| 사이트 설정 | 사이트명·로고·파비콘·**브랜드 컬러**·헤더 문구·검색 안내문·메인 섹션 제목·**상세페이지 전 섹션 제목**·예약 단계 안내·빈 결과 문구·고객센터·SNS·회사정보·푸터 문구 |

> 사이트에 보이는 텍스트·링크·이미지 중 관리자에서 못 바꾸는 곳은 없습니다.
> 브랜드명이 바뀌어도 코드를 고칠 필요가 없습니다.

### 운영 편의 기능

| 기능 | 설명 |
|---|---|
| 업종·지역 자동 채움 | 드롭다운에서 고르면 표시명이 자동 입력됩니다 (`상하이 황푸구` 처럼 도시+세부지역으로) |
| 순서 위/아래 버튼 | 숫자를 직접 안 고쳐도 화살표로 순서 변경 |
| 항목 복제 | 비슷한 업체를 등록할 때 복제 후 이름만 수정 |
| 실제 화면 보기 | 제휴업체 행의 ↗ 버튼으로 실제 상세페이지 새 창 확인 |
| 이미지 드래그앤드롭 | 파일을 끌어다 놓으면 업로드. 갤러리는 여러 장 동시 + 순서 이동 |
| 영상 URL 즉시 확인 | 붙여넣는 순간 플랫폼·썸네일·사이트 내 재생 가능 여부 표시 |
| 일괄 처리 | 체크박스로 여러 건 선택 → 노출 켜기/끄기/삭제 |
| 검색 · 필터 · 페이지네이션 | 50건씩 페이징, 업체가 수백 개여도 느려지지 않음 |
| 등록 상태 점검 | 대시보드에서 대표 이미지·혜택·예약방법·영상 누락 건수를 한눈에 |
| 백업 · 복원 | 목록별 JSON 백업, 대시보드에서 전체 백업/복원 |
| 실수 방지 | 필수값 미입력 시 해당 칸 강조, 저장 안 하고 닫으면 확인창 |

### 공유 · 검색 노출
- 제휴업체 상세페이지를 카카오톡·위챗으로 공유하면 **업체명 + 혜택 + 대표 이미지**가 미리보기로 뜹니다 (OG 태그 자동 생성).
- 사이트 설정에서 `Google Analytics 측정 ID`(G-XXXXXXXXXX)를 넣으면 방문 통계가 자동 연결됩니다. 비워두면 아무것도 로드하지 않습니다.
- `sitemap.xml` / `robots.txt` 포함. 관리자 페이지는 검색엔진에서 제외되도록 설정돼 있습니다.

### 링크 규칙
- 내부 이동: `/list.html?cat=beauty&region=shanghai`
- 외부 이동: `https://...` (자동으로 새 창)
- 제휴업체에 `카드 클릭 시 외부 URL` 을 넣으면 상세페이지 대신 그 주소로 바로 이동합니다.

### 영상 URL — 지원 형태 (검증 완료)

**사이트 안에서 바로 재생 (세로 모달)**
```
https://www.youtube.com/shorts/XXXXXXXXXXX      쇼츠
https://www.youtube.com/watch?v=XXXXXXXXXXX     일반 (&t=30s 붙어도 OK)
https://youtu.be/XXXXXXXXXXX?si=AbC123          단축 링크
https://m.youtube.com/watch?v=XXXXXXXXXXX       모바일 주소
https://www.instagram.com/reel/XXXXXXXXXXX/     릴스
https://www.instagram.com/reels/XXXXXXXXXXX/    릴스 (복수형)
https://www.instagram.com/계정명/reel/XXXXX/     계정 경로가 끼어 있어도 OK
https://www.instagram.com/p/XXXXXXXXXXX/?igsh=  게시물 (공유 파라미터 OK)
https://www.tiktok.com/@user/video/1234567890   틱톡
https://www.bilibili.com/video/BV1xx411c7mD     빌리빌리
https://vimeo.com/123456789                     Vimeo
https://내CDN/video.mp4                          직접 업로드
```

**새 창으로 열림 (해당 플랫폼이 임베드를 막아둠)**
```
https://v.douyin.com/XXXXXX/          더우인
https://www.xiaohongshu.com/...       샤오홍슈 (xhslink.com 단축도 OK)
https://www.kuaishou.com/...          콰이쇼우
https://vm.tiktok.com/XXXXXX/         틱톡 단축 링크
```

> **유튜브는 썸네일이 자동 생성**됩니다. 나머지는 관리자에서 썸네일 이미지를 직접 올리면 카드가 훨씬 보기 좋습니다.
> 관리자에서 URL을 붙여넣는 즉시 플랫폼·썸네일·재생 방식이 표시되므로 저장 전에 확인할 수 있습니다.

---

## 4. 자주 하는 작업

**새 제휴업체 추가**
관리자 → 제휴업체 → `+ 새로 추가` → 상호명·지역·업종·혜택 입력 → 대표 이미지 업로드 → 저장

**메인 추천에 올리기**
제휴업체 수정 → 노출 설정 → `메인 추천 업체` 켜기 → 정렬 순서 지정

**광고 붙이기**
관리자 → 광고 관리 → 위치 선택 → 이미지 업로드 + 클릭 시 이동 URL 입력 → 노출 기간 지정

**색상 바꾸기**
관리자 → 사이트 설정 → 브랜드 컬러 4가지 변경 → 저장 (전 페이지에 즉시 반영)

---

## 5. 분류 체계 (2단계)

```
업종 대분류 (상단 GNB)        지역 도시 (자동 반영)
 └ 세부 업종                   └ 세부 지역
   뷰티 › 헤어 / 네일 / …        상하이 › 징안구 / 황푸구 / 푸둥 / …
   미식 › 훠궈 / 딤섬 / …        베이징 › 왕푸징 / 산리툰 / …
```

- **도시는 계속 추가할 수 있습니다.** 관리자 → 지역 관리 → `+ 새로 추가` → 상위 도시를 비워두면 도시, 지정하면 그 도시의 세부 지역이 됩니다.
- 도시를 하나 추가하면 **7개 업종 메뉴 전부에 자동으로 나타납니다.** 업종마다 다시 넣을 필요가 없습니다.
- 세부 업종도 같은 방식입니다. 관리자 → 메뉴(업종) 관리에서 `상위 업종`을 지정하면 메가메뉴·서브내비·목록 2차 필터에 자동으로 붙습니다.
- 목록 페이지에서 도시를 고르면 그 도시의 세부 지역 업체까지 모두 함께 나옵니다. (대분류 업종도 동일)

---

## 6. 로컬에서 미리보기

`index.html` 을 **더블클릭**하면 바로 열립니다. Supabase 키를 넣기 전이라도 데모 데이터로 전체가 동작합니다.
관리자는 같은 폴더의 `admin.html` 을 더블클릭하면 **읽기 전용 데모 모드**로 열립니다. (저장·삭제는 Supabase 연결 후)

> ⚠️ HTML 파일은 반드시 `zhongyouke-benefits` 폴더 안에서 여세요. 파일 하나만 따로 복사해 열면 CSS·JS를 못 찾아 흰 화면이 나옵니다.

로컬 서버로 띄우고 싶다면:

```bash
cd zhongyouke-benefits
python3 -m http.server 8080
```
→ `http://localhost:8080`, 관리자는 `http://localhost:8080/admin.html`

---

## 7. 문제 해결

| 증상 | 확인할 것 |
|---|---|
| 화면이 비어 있음 | 브라우저 콘솔(F12) 확인 · `config.js` 키 오타 |
| 관리자 로그인 실패 | Supabase → Authentication → Users 에 계정이 있고 Confirmed 상태인지 |
| 저장 시 권한 오류 | `schema.sql` 의 RLS 블록이 정상 실행됐는지 (SQL Editor 재실행) |
| 이미지 업로드 실패 | Storage → `media` 버킷이 있고 Public 인지 |
| 인스타 영상이 안 보임 | 비공개 계정이거나 릴스 URL 형식이 다름 (`/reel/코드/` 형태여야 함) |
