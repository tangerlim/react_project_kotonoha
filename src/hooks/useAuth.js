// 현재 로그인한 사용자 정보를 꺼내 주는 커스텀 Hook
//
// 여러 컴포넌트에서 "로그인했나? 누구인가? 운영진인가?"를 자주 확인하기 때문에
// useSelector 코드를 매번 쓰지 않도록 Hook 하나로 묶었다.
import { useSelector } from 'react-redux';

export default function useAuth() {
  const users = useSelector((state) => state.auth.users);
  const currentUserId = useSelector((state) => state.auth.currentUserId);

  // 로그인하지 않았으면 user는 null
  const user = users.find((item) => item.id === currentUserId) ?? null;

  return {
    user,
    isLoggedIn: user !== null,
    isAdmin: user?.role === 'admin',
  };
}
