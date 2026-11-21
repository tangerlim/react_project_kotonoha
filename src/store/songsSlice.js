// 노래(내 플레이리스트) 데이터를 관리하는 slice
// 추가 / 수정 / 삭제 세 가지 reducer를 가진다. (다른 slice도 같은 구조)
import { createSlice } from '@reduxjs/toolkit';
import { createId } from '../utils/format';
import { seedSongs } from '../data/seed';

const initialState = {
  items: seedSongs,
};

const songsSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    // 노래 추가: prepare에서 id와 등록 시간을 붙인다.
    addSong: {
      prepare(songData) {
        return {
          payload: {
            ...songData,
            id: createId(),
            createdAt: new Date().toISOString(),
          },
        };
      },
      reducer(state, action) {
        state.items.push(action.payload);
      },
    },

    // 노래 수정: payload = { id, changes }
    // Redux Toolkit은 내부적으로 Immer를 쓰기 때문에 객체를 직접 고치는 것처럼 써도 불변성이 지켜진다.
    updateSong(state, action) {
      const { id, changes } = action.payload;
      const song = state.items.find((item) => item.id === id);
      if (song) {
        Object.assign(song, changes);
      }
    },

    // 노래 삭제: payload = 노래 id
    // 이 노래의 문장들은 quotesSlice가 이 action을 듣고 함께 지운다. (quotesSlice의 extraReducers 참고)
    deleteSong(state, action) {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addSong, updateSong, deleteSong } = songsSlice.actions;
export default songsSlice.reducer;
