// 회원 정보와 현재 로그인한 사용자를 관리하는 slice
//
// 서버가 없으므로 회원 목록(users)을 Redux 상태에 두고 localStorage에 저장한다.
// ※ 비밀번호를 평문으로 저장하는 것은 학습용 데모이기 때문이다.
//    실제 서비스에서는 서버에서 비밀번호를 암호화(해시)해서 저장하고,
//    로그인 확인도 서버에서 해야 한다. (보고서 "향후 개선 과제")
import { createSlice } from '@reduxjs/toolkit';
import { createId } from '../utils/format';
import { seedUsers } from '../data/seed';

const initialState = {
  users: seedUsers,
  currentUserId: null, // 로그인하지 않았으면 null
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 회원가입: 새 회원을 추가하고 바로 로그인 상태로 만든다.
    // prepare는 reducer가 실행되기 전에 action.payload를 만들어 주는 함수다.
    // id와 가입 시간처럼 "매번 달라지는 값"은 reducer 밖(prepare)에서 만드는 것이 Redux 규칙이다.
    signup: {
      prepare(userData) {
        return {
          payload: {
            ...userData,
            id: createId(),
            role: 'member', // 새로 가입하면 항상 일반 동아리원
            createdAt: new Date().toISOString(),
          },
        };
      },
      reducer(state, action) {
        state.users.push(action.payload);
        state.currentUserId = action.payload.id;
      },
    },

    // 로그인: 아이디/비밀번호 확인은 LoginPage에서 하고, 여기서는 로그인한 사용자 id만 기억한다.
    login(state, action) {
      state.currentUserId = action.payload; // payload = 사용자 id
    },

    // 로그아웃: 현재 사용자 id를 비운다.
    logout(state) {
      state.currentUserId = null;
    },
  },
});

export const { signup, login, logout } = authSlice.actions;
export default authSlice.reducer;
