// Redux store 생성
//
// 왜 Redux를 썼나?
//  - 노래, 문장, 게시글, 회원 정보는 여러 페이지(홈, 플레이리스트, 게시판, 마이페이지)에서 함께 쓰인다.
//  - Props로 계속 내려 주면 코드가 복잡해지므로, 앱 전체가 공유하는 "하나의 저장소"에 모아 두었다.
//
// 데이터 유지 방법:
//  1. 시작할 때 localStorage에 저장된 상태가 있으면 그것으로 시작하고, 없으면 seed.js 샘플 데이터로 시작한다.
//  2. store.subscribe로 상태가 바뀔 때마다 localStorage에 저장한다.
import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice';
import songsReducer from './songsSlice';
import quotesReducer from './quotesSlice';
import boardReducer from './boardSlice';
import { loadState, saveState } from '../utils/storage';

// 저장된 상태 (없으면 undefined → 각 slice의 initialState(샘플 데이터)가 사용된다)
const preloadedState = loadState();

export const store = configureStore({
  reducer: {
    auth: authReducer,
    songs: songsReducer,
    quotes: quotesReducer,
    board: boardReducer,
  },
  preloadedState,
});

// 상태가 바뀔 때마다 localStorage에 저장
store.subscribe(() => {
  saveState(store.getState());
});
