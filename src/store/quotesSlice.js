// 수집한 문장 데이터를 관리하는 slice
// songsSlice와 같은 구조(추가 / 수정 / 삭제)에 복습 결과 기록(recordReview)이 더해졌다.
import { createSlice } from '@reduxjs/toolkit';
import { createId } from '../utils/format';
import { seedQuotes } from '../data/seed';
import { deleteSong } from './songsSlice';

const initialState = {
  items: seedQuotes,
};

const quotesSlice = createSlice({
  name: 'quotes',
  initialState,
  reducers: {
    // 문장 추가: 복습 기록은 0에서 시작한다.
    addQuote: {
      prepare(quoteData) {
        return {
          payload: {
            ...quoteData,
            id: createId(),
            review: { known: 0, unknown: 0, lastResult: null },
            createdAt: new Date().toISOString(),
          },
        };
      },
      reducer(state, action) {
        state.items.push(action.payload);
      },
    },

    // 문장 수정: payload = { id, changes }
    updateQuote(state, action) {
      const { id, changes } = action.payload;
      const quote = state.items.find((item) => item.id === id);
      if (quote) {
        Object.assign(quote, changes);
      }
    },

    // 문장 삭제: payload = 문장 id
    deleteQuote(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },

    // 복습 결과 기록: payload = { id, result: 'known' | 'unknown' }
    // "알아요/몰라요"를 몇 번 눌렀는지와 마지막 결과를 문장에 저장한다.
    recordReview(state, action) {
      const { id, result } = action.payload;
      const quote = state.items.find((item) => item.id === id);
      if (quote) {
        quote.review[result] += 1;
        quote.review.lastResult = result;
      }
    },
  },

  // extraReducers: 다른 slice의 action에 반응할 때 쓴다.
  // 노래가 삭제되면(songsSlice의 deleteSong) 그 노래에 속한 문장도 함께 지운다.
  extraReducers: (builder) => {
    builder.addCase(deleteSong, (state, action) => {
      const deletedSongId = action.payload;
      state.items = state.items.filter((item) => item.songId !== deletedSongId);
    });
  },
});

export const { addQuote, updateQuote, deleteQuote, recordReview } = quotesSlice.actions;
export default quotesSlice.reducer;
