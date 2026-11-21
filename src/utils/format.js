// 화면 표시와 id 생성에 쓰는 작은 도우미 함수 모음

// 간단한 id 생성 함수
// 현재 시간(36진수) + 랜덤 문자열을 붙여서 겹치지 않는 id를 만든다.
// 예: "m3k9x2a-4f7q"
export function createId() {
  const time = Date.now().toString(36);
  const random = Math.random().toString(36).slice(2, 6);
  return `${time}-${random}`;
}

// ISO 날짜 문자열을 "2026.11.17" 형태로 바꾼다.
export function formatDate(isoString) {
  const date = new Date(isoString);
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}.${m}.${d}`;
}

// "방금 전", "3분 전", "2일 전"처럼 상대 시간으로 보여준다.
// 7일이 넘으면 날짜 그대로 보여준다.
export function formatRelative(isoString) {
  const diff = Date.now() - new Date(isoString).getTime();
  const minutes = Math.floor(diff / 1000 / 60);
  if (minutes < 1) return '방금 전';
  if (minutes < 60) return `${minutes}분 전`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}시간 전`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}일 전`;
  return formatDate(isoString);
}

// 코드 값(영어)을 화면용 한국어 이름으로 바꾸는 표
export const SONG_GENRE_LABEL = {
  jpop: 'J-POP',
  anime: '애니송',
  vocaloid: '보컬로이드',
};

export const SONG_STATUS_LABEL = {
  listening: '듣는 중',
  done: '완창',
  wish: '들어볼 곡',
};

export const CATEGORY_LABEL = {
  notice: '공지',
  review: '감상',
  question: '번역 질문',
};

// 회원 목록에서 id로 닉네임을 찾는다. (탈퇴 등으로 없으면 "알 수 없음")
export function findNickname(users, userId) {
  const user = users.find((item) => item.id === userId);
  return user ? user.nickname : '알 수 없음';
}

// 히라가나 표기 {漢字|かんじ} 를 지우고 한자만 남긴다.
// 미리보기나 검색처럼 순수한 글자만 필요할 때 사용한다.
export function stripRuby(text) {
  return text.replace(/\{([^|{}]+)\|([^|{}]+)\}/g, '$1');
}
