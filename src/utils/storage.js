// localStorage 읽기/쓰기를 담당한다.
// 서버가 없기 때문에 Redux 상태 전체를 브라우저에 저장해서 새로고침해도 데이터가 남게 한다.

// 주제를 책 → 노래로 바꾸면서 데이터 구조가 달라져서 키 이름에 버전(v2)을 붙였다.
// (예전 책 데이터가 남아 있어도 섞이지 않고 새 샘플 데이터로 시작한다)
const STORAGE_KEY = 'kotonoha-state-v2';

// 저장된 상태를 불러온다. 없거나 깨져 있으면 undefined를 돌려준다.
export function loadState() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === null) return undefined;
    return JSON.parse(saved);
  } catch (error) {
    // 시크릿 모드 등으로 localStorage를 못 쓰는 경우에도 앱이 멈추지 않게 한다.
    console.warn('저장된 데이터를 불러오지 못했습니다.', error);
    return undefined;
  }
}

// 상태를 JSON 문자열로 바꿔서 저장한다.
export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.warn('데이터를 저장하지 못했습니다.', error);
  }
}

// 저장된 데이터를 지운다. (샘플 데이터로 초기화할 때 사용)
export function clearState() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn('데이터를 지우지 못했습니다.', error);
  }
}
