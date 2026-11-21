// 로그인 페이지
//
// 1. LoginForm에서 아이디/비밀번호를 받는다.
// 2. Redux에 저장된 회원 목록에서 일치하는 회원을 찾는다.
// 3. 찾으면 login 액션을 보내고, 원래 가려던 페이지(location.state.from)로 이동한다.
import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { login } from '../store/authSlice';
import useAuth from '../hooks/useAuth';
import { demoAccounts } from '../data/seed';
import LoginForm from '../features/auth/LoginForm';
import Card from '../components/common/Card';
import styles from './AuthPage.module.css';

export default function LoginPage() {
  const users = useSelector((state) => state.auth.users);
  const { isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const [error, setError] = useState('');

  // ProtectedRoute가 넘겨준 "원래 가려던 주소". 없으면 홈으로.
  const from = location.state?.from?.pathname ?? '/';

  function handleLogin(username, password) {
    // ※ 학습용 모의 로그인: 실제로는 서버가 비밀번호를 확인해야 한다.
    const user = users.find((item) => item.username === username && item.password === password);

    if (!user) {
      setError('아이디 또는 비밀번호가 올바르지 않습니다.');
      return;
    }
    dispatch(login(user.id));
    // replace: 뒤로 가기를 눌렀을 때 로그인 페이지로 다시 돌아오지 않게 한다.
    navigate(from, { replace: true });
  }

  // 이미 로그인한 상태로 이 페이지에 오면 홈으로 보낸다.
  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <h1 className={styles.title}>
          <span className="ja">おかえり</span>
          <small>로그인</small>
        </h1>
        {from !== '/' && <p className={styles.notice}>로그인이 필요한 페이지입니다. 로그인 후 이동합니다.</p>}
        <LoginForm onSubmit={handleLogin} error={error} demoAccounts={demoAccounts} />
        <p className={styles.footer}>
          아직 회원이 아니신가요? <Link to="/signup">회원가입</Link>
        </p>
      </Card>
    </div>
  );
}
