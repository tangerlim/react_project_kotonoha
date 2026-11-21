# 코토노하 (ことのは) — 프로젝트 안내

이 파일은 이 프로젝트의 기획과 설계 결정을 정리한 문서다. 코드를 작성하거나 수정하기 전에 반드시 이 내용을 따른다.

## 1. 프로젝트 개요

- 과목: 고급웹프로그래밍 (React 수업) 개인 포트폴리오 프로젝트
- 한 줄 소개: 일본어 동아리원들이 각자 좋아하는 일본 노래(J-POP, 애니송, 보컬로이드)에서 마음에 든 가사를 모으고, 그 문장으로 공부하고, 게시판에서 감상을 나누는 커뮤니티 웹앱
- 핵심 흐름: 노래 등록 → 들으면서 가사(문장) 수집 → 내 단어장에 자동으로 모임 → 복습 카드 → 게시판에서 감상 공유
- 기획 배경: 제작자는 실제로 일본어 동아리에서 활동하고 있고, 일본어·영어 공부를 하면서 좋아하는 일본 노래를 듣고 있다. 단어만 따로 외우는 단어장이 아니라 "좋아하는 노래의 가사째로" 저장하고 노래별로 모이게 하는 것이 이 프로젝트의 차별점이다.

## 2. 일정과 제작자 상황

- 오늘(2026-11-17) 소스코드 제출, 이후 약 한 달 동안 코드를 이해하고 보고서를 작성한다.
- 제작자가 이 코드를 직접 이해하고 설명해야 하므로 **난이도가 너무 높으면 안 된다.**
  - 읽기 쉬운 코드를 우선한다. 지나치게 압축하거나 영리한 코드는 쓰지 않는다.
  - 주요 컴포넌트, slice, Hook에는 **한국어 주석**으로 "무엇을, 왜" 하는지 설명한다.
  - 같은 역할의 코드는 같은 패턴으로 작성한다 (예: 4개 slice가 같은 구조).

## 3. 평가 기준

1. 코드 구현 능력: React 문법, Hooks, 이벤트 처리, 상태 관리, 코드 난이도
2. 컴포넌트 설계: 컴포넌트 분리, Props 전달, 코드 구조
3. UI/UX 디자인: CSS 활용, 화면 구성, 디자인 완성도, 사용 편의성
4. 독창성 및 발전 정도: 아이디어의 창의성, 기존 예제와의 차별성, 기능 확장 및 개선

## 4. 교수님 필수 요구사항

- 중첩 라우팅
- 로그인
- 게시판
- 리덕스 (Redux)

## 5. 기술 스택

- Vite + React (JavaScript, 함수형 컴포넌트만 사용)
- `react-router-dom` (v6 이상, 중첩 라우팅과 `<Outlet />` 사용)
- `@reduxjs/toolkit`, `react-redux`
- 스타일: CSS Modules (`Component.module.css`) + 전역 `index.css`의 CSS 변수(색상, 간격, 폰트)
- **위 3개 외의 외부 라이브러리는 추가하지 않는다.** (UI 라이브러리, 차트 라이브러리, axios 등 사용 금지)
- 서버 없음. 데이터는 Redux 상태를 localStorage에 저장해서 유지한다.

## 6. 로그인 방식 (모의 로그인)

- 서버 없이 회원 정보를 localStorage에 저장하는 모의 로그인으로 구현한다.
- 회원가입, 로그인, 로그아웃, 새로고침 후 로그인 유지, 로그인 필요 페이지 보호(ProtectedRoute)를 구현한다.
- 비밀번호를 평문으로 저장하는 것은 학습용 데모이기 때문이며, 실제 서비스에서는 서버와 암호화가 필요하다는 점을 코드 주석에 남긴다. (보고서의 "향후 개선 과제"로 쓸 예정)
- 역할: `admin`(운영진)과 `member`(일반 동아리원). 공지사항은 admin만 작성할 수 있다.

## 7. 기능 상세

### 7-1. 회원
- 회원가입: 아이디, 닉네임, 비밀번호, 비밀번호 확인, 목표 JLPT 레벨(N5~N1)
- 입력 검증: 빈 값, 아이디 중복, 비밀번호 불일치 시 에러 메시지 표시
- 로그인하지 않은 상태로 보호된 페이지에 들어가면 로그인 페이지로 이동하고, 로그인 후 원래 가려던 페이지로 돌아간다.

### 7-2. 노래 (내 플레이리스트)
- 노래 등록, 수정, 삭제: 일본어 제목, 한국어 제목, 가수, 장르(J-POP, 애니송, 보컬로이드), 상태(듣는 중, 완창, 들어볼 곡), 가사 외운 정도(0~100)
- 상태별 필터, 제목 검색
- "내 노래"와 "전체 동아리원 노래" 보기 전환

### 7-3. 문장 수집 (핵심 차별 기능)
- 노래 안에서 문장(가사 한 줄) 추가, 수정, 삭제
- 항목: 원문, 해석, 위치(1절, 후렴 등), 메모, 단어 목록(단어, 읽기, 뜻을 여러 개 추가·삭제)
- 히라가나 표기: 원문에 `{漢字|かんじ}` 형식으로 입력하면 `RubyText` 컴포넌트가 HTML `<ruby>` 태그로 바꿔서 한자 위에 읽는 법을 표시한다.
- 히라가나 표시 켜기/끄기 버튼 제공

### 7-4. 마이페이지 (로그인 필요)
- 단어장: 내가 수집한 모든 문장의 단어를 한곳에 모아 표로 보여준다. 검색 가능, 단어를 누르면 그 단어가 나온 문장으로 이동.
- 복습: 수집한 문장으로 카드를 만든다. 앞면은 해석, 뒷면은 원문. 클릭이나 스페이스바로 뒤집고, "알아요/몰라요"로 체크한다. "몰라요"인 카드는 이번 회차 끝에 다시 나온다. 결과는 문장 데이터에 기록한다.
- 통계: 등록한 노래 수, 완창 수, 수집 문장 수, 단어 수, 장르별 비율(CSS로 만든 막대)

### 7-5. 게시판
- 카테고리: 공지(notice), 감상(review), 번역 질문(question)
- 글 작성, 조회(조회수 증가), 수정, 삭제, 댓글 작성·삭제, 제목 검색
- 본인 글과 댓글만 수정·삭제 가능. 공지는 admin만 작성 가능.
- 삭제 전 확인 모달

### 7-6. 홈
- 최근 게시글, 동아리원들이 최근 수집한 문장 피드, "오늘의 문장"(랜덤 1개)

### 7-7. 기타
- 404 페이지
- 데이터가 없을 때 안내 화면(EmptyState)
- 반응형 레이아웃 (모바일 너비에서도 깨지지 않게)

## 8. 라우트 구조 (중첩 라우팅)

```
/                                  홈
/login                             로그인
/signup                            회원가입

/songs                             노래 목록 (플레이리스트)
/songs/new                         노래 등록 🔒
/songs/:songId                     노래 상세 레이아웃 (노래 정보 고정 + Outlet)
  (index)                          수집 문장 목록
  quotes/new                       문장 추가 🔒
  quotes/:quoteId                  문장 상세

/board                             게시판 레이아웃 (카테고리 탭 고정 + Outlet)
  (index)                          /board/review 로 이동
  :category                        카테고리별 글 목록
  :category/:postId                글 상세 + 댓글
  write                            글쓰기 🔒
  :category/:postId/edit           글 수정 🔒

/mypage                            마이페이지 레이아웃 (탭 메뉴 고정 + Outlet) 🔒
  (index)                          /mypage/vocab 으로 이동
  vocab                            단어장
  review                           복습 카드
  stats                            통계

*                                  404
```

🔒 = 로그인 필요 (`ProtectedRoute`로 감싼다)

## 9. Redux 상태 구조

Redux Toolkit의 `createSlice`로 4개 slice를 만든다. 모든 slice는 같은 패턴(추가, 수정, 삭제 reducer)을 따른다.

| Slice | 데이터 | 주요 reducer |
|---|---|---|
| `authSlice` | `users`, `currentUserId` | signup, login, logout |
| `songsSlice` | `items` (노래 배열) | addSong, updateSong, deleteSong |
| `quotesSlice` | `items` (문장 배열) | addQuote, updateQuote, deleteQuote, recordReview |
| `boardSlice` | `posts`, `comments` | addPost, updatePost, deletePost, increaseViews, addComment, deleteComment |

- `store/index.js`에서 store를 만들 때 localStorage에 저장된 상태가 있으면 불러오고, 없으면 `data/seed.js`의 샘플 데이터로 시작한다.
- `store.subscribe`로 상태가 바뀔 때마다 localStorage에 저장한다.
- 노래를 삭제하면 그 노래의 문장도 함께 삭제한다. 글을 삭제하면 그 글의 댓글도 함께 삭제한다.

## 10. 데이터 모델

```js
User    { id, username, nickname, password, jlptLevel, role: 'admin' | 'member', createdAt }
Song    { id, ownerId, titleJa, titleKo, artist, genre: 'jpop' | 'anime' | 'vocaloid',
          status: 'listening' | 'done' | 'wish', progress, createdAt }   // progress = 가사 외운 정도
Quote   { id, songId, ownerId, text, translation, location, memo,
          words: [{ word, reading, meaning }],
          review: { known, unknown, lastResult }, createdAt }
Post    { id, category: 'notice' | 'review' | 'question', title, content,
          authorId, views, createdAt, updatedAt }
Comment { id, postId, authorId, content, createdAt }
```

- `id`는 `utils/format.js`의 간단한 id 생성 함수로 만든다.
- 날짜는 ISO 문자열로 저장하고 화면에는 보기 좋게 바꿔서 보여준다.

## 11. 샘플 데이터 (`data/seed.js`)

- 회원 3명 정도 (운영진 1명 포함). 데모 계정 아이디와 비밀번호를 로그인 화면에 안내 문구로 보여준다.
- 노래 4~5개, 문장 8~10개, 게시글 6개 정도, 댓글 몇 개
- **샘플 가사와 노래는 실제 노래에서 가져오지 말고 직접 지어낸 가사와 가상의 노래·가수로 만든다.** (저작권 문제 방지)

## 12. 폴더 구조

```
src/
├── main.jsx                    # Redux Provider, Router로 감싸기
├── App.jsx                     # 전체 라우트 정의
├── index.css                   # 전역 스타일, CSS 변수
├── store/
│   ├── index.js
│   ├── authSlice.js
│   ├── songsSlice.js
│   ├── quotesSlice.js
│   └── boardSlice.js
├── data/
│   └── seed.js
├── hooks/
│   ├── useAuth.js              # 현재 로그인 사용자 꺼내기
│   └── useDebounce.js          # 검색어 입력 지연
├── utils/
│   ├── storage.js
│   └── format.js
├── components/
│   ├── layout/
│   │   ├── Layout.jsx
│   │   ├── Header.jsx
│   │   └── ProtectedRoute.jsx
│   └── common/
│       ├── Button.jsx
│       ├── Card.jsx
│       ├── Modal.jsx
│       ├── SearchBar.jsx
│       ├── EmptyState.jsx
│       └── RubyText.jsx
├── features/
│   ├── auth/       LoginForm.jsx, SignupForm.jsx
│   ├── songs/      SongCard.jsx, SongForm.jsx, SongFilter.jsx
│   ├── quotes/     QuoteCard.jsx, QuoteForm.jsx, WordInputList.jsx
│   ├── board/      PostList.jsx, PostForm.jsx, CommentList.jsx, CommentForm.jsx
│   └── mypage/     VocabTable.jsx, FlashCard.jsx, StatsCard.jsx, RatioBars.jsx
└── pages/
    ├── HomePage.jsx, LoginPage.jsx, SignupPage.jsx, NotFoundPage.jsx
    ├── songs/      SongListPage.jsx, SongNewPage.jsx, SongDetailLayout.jsx,
    │               QuoteListPage.jsx, QuoteNewPage.jsx, QuoteDetailPage.jsx
    ├── board/      BoardLayout.jsx, PostListPage.jsx, PostDetailPage.jsx,
    │               PostWritePage.jsx, PostEditPage.jsx
    └── mypage/     MyPageLayout.jsx, VocabPage.jsx, ReviewPage.jsx, StatsPage.jsx
```

폴더 역할:
- `pages`: 라우트 하나에 파일 하나. 이름이 `Layout`으로 끝나는 파일이 중첩 라우팅의 부모이며 `<Outlet />`을 가진다.
- `features`: 실제 기능 UI. 데이터는 Props로 받고, 이벤트는 Props로 받은 함수(onSubmit, onDelete 등)로 부모에게 알린다. 가능하면 features 컴포넌트는 Redux에 직접 접근하지 않고, pages에서 Redux와 연결한다.
- `components/common`: 디자인을 통일하는 재사용 부품.
- `store`: 앱 전체 데이터 관리.

## 13. 반드시 보여줄 React 기능

- Hooks: useState, useEffect, useMemo(검색·필터 결과), useRef(입력창 포커스), 커스텀 Hook 2개(useAuth, useDebounce)
- 라우터: useParams, useNavigate, useLocation(로그인 후 원래 페이지로), useSearchParams(검색어를 주소에 저장), NavLink(현재 메뉴 강조), Navigate
- Redux: useSelector, useDispatch
- 이벤트: 폼 제출과 검증, 클릭, 키보드(복습 카드 스페이스바), 동적 입력 목록(단어 추가·삭제)
- 조건부 렌더링, 리스트 렌더링(key 사용), Props 전달, children

## 14. 디자인 방향

- 일본 문구·음반 가사집 느낌의 차분한 디자인: 따뜻한 종이색 배경, 먹색 글자, 포인트 색 하나(예: 남색이나 주홍색)
- 일본어 원문은 명조 계열 폰트로 크게 보여주고, 해석은 작게
- 카드 기반 레이아웃, 부드러운 hover 효과, 복습 카드 뒤집기 애니메이션(CSS transform)
- 색상과 간격은 `index.css`의 CSS 변수로 관리한다.

## 15. 작업 순서

1. Vite 프로젝트 생성, 패키지 설치, 폴더 구조 만들기
2. Redux store와 4개 slice, 샘플 데이터, localStorage 저장
3. 라우트 전체 뼈대 (빈 페이지라도 모든 경로가 열리게)
4. 공통 컴포넌트와 Layout, Header, 전역 스타일
5. 로그인, 회원가입, ProtectedRoute
6. 게시판
7. 노래와 문장 수집 (RubyText 포함)
8. 마이페이지 (단어장, 복습, 통계)
9. 홈
10. 전체 동작 확인, `npm run build`로 오류 없는지 확인
11. README.md 작성 (실행 방법, 데모 계정, 기능 목록)

## 16. 보고서 대비

- 보고서는 제작자가 한 달 동안 작성한다. 구현하면서 중요한 설계 결정(왜 Redux를 썼는지, 왜 이렇게 컴포넌트를 나눴는지 등)은 코드 주석이나 README에 짧게 남겨 둔다.
- 향후 개선 과제 후보: 실제 서버와 데이터베이스 연동, 비밀번호 암호화, 이미지(앨범 재킷) 업로드, 문장 좋아요·공유, 간격 반복 학습 알고리즘

## 17. 구현하면서 정한 것 (기획서에서 달라지거나 추가된 부분)

- 노래 수정과 문장 수정은 별도 라우트 없이, 상세 화면에서 폼으로 바꿔 보여주는 방식(isEditing 상태)으로 구현했다.
- 노래 상세 레이아웃은 `<Outlet context={{ song, isOwner, showRuby }}>`로 자식 페이지에 데이터를 넘기고, 자식은 `useOutletContext()`로 받는다.
- 문장 추가·수정·삭제는 노래를 등록한 본인만 할 수 있다. 다른 사람의 노래는 보기만 가능하다.
- 통계의 비율 막대는 `features/mypage/RatioBars.jsx`로 분리했다.
- 폼 공통 스타일(`.field`, `.input`, `.error`, `.badge` 등)은 `index.css`에 전역 클래스로 두었다. LoginForm과 SignupForm은 `AuthForm.module.css`를, CommentList와 CommentForm은 `Comment.module.css`를 함께 쓴다.
- 주제를 책(독서)에서 노래로 바꿨다 (2026-11-17). 수집 단위는 그대로 "문장(Quote)"이고, 노래의 가사 한 줄을 뜻한다. localStorage 키는 `kotonoha-state-v2`로 바꿔서 예전 책 데이터와 섞이지 않게 했다.
- 푸터에 "샘플 데이터로 초기화" 버튼을 두어 시연할 때 localStorage를 지우고 처음 상태로 돌릴 수 있다.
- slice에서 id와 날짜처럼 매번 달라지는 값은 `prepare` 콜백에서 만든다. 페이지는 `dispatch()`가 돌려주는 action의 `payload.id`로 새 항목 주소로 이동한다.
- 노래 삭제 시 문장을 함께 지우는 것은 quotesSlice의 `extraReducers`가 songsSlice의 `deleteSong` action을 듣는 방식이다.
