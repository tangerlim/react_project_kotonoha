// 회원가입 페이지
// SignupForm이 입력 검증을 하고, 이 페이지는 Redux에 회원을 추가한 뒤 홈으로 이동한다.
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { signup } from '../store/authSlice';
import useAuth from '../hooks/useAuth';
import SignupForm from '../features/auth/SignupForm';
import Card from '../components/common/Card';
import styles from './AuthPage.module.css';

export default function SignupPage() {
  const users = useSelector((state) => state.auth.users);
  const { isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 중복 검사를 위해 이미 있는 아이디만 뽑아서 폼에 넘긴다.
  const existingUsernames = users.map((user) => user.username);

  function handleSignup(values) {
    // signup reducer가 회원을 추가하고 바로 로그인 상태로 만든다.
    dispatch(signup(values));
    navigate('/', { replace: true });
  }

  if (isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className={styles.page}>
      <Card className={styles.card}>
        <h1 className={styles.title}>
          <span className="ja">はじめまして</span>
          <small>회원가입</small>
        </h1>
        <SignupForm onSubmit={handleSignup} existingUsernames={existingUsernames} />
        <p className={styles.footer}>
          이미 회원이신가요? <Link to="/login">로그인</Link>
        </p>
      </Card>
    </div>
  );
}
