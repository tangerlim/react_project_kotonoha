// 로그인이 필요한 페이지를 감싸는 컴포넌트
//
// 로그인하지 않았으면 로그인 페이지로 보낸다.
// 이때 state에 "원래 가려던 주소(location)"를 함께 넘겨서,
// 로그인에 성공하면 LoginPage가 그 주소로 다시 돌려보낸다.
import { Navigate, useLocation } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth();
  const location = useLocation();

  if (!isLoggedIn) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // 로그인했으면 감싼 페이지(children)를 그대로 보여준다.
  return children;
}
