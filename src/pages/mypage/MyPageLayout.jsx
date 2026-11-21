// 마이페이지 레이아웃 (/mypage) 🔒 — 중첩 라우팅의 부모
// 위쪽의 프로필과 탭 메뉴(단어장/복습/통계)는 고정되고, 아래 <Outlet />만 바뀐다.
import { NavLink, Outlet } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import styles from './MyPageLayout.module.css';

const tabs = [
  { to: 'vocab', label: '단어장' },
  { to: 'review', label: '복습 카드' },
  { to: 'stats', label: '통계' },
];

export default function MyPageLayout() {
  const { user } = useAuth();
  const quotes = useSelector((state) => state.quotes.items);

  // 프로필에 보여줄 간단한 숫자
  const myQuotes = quotes.filter((quote) => quote.ownerId === user.id);
  const wordCount = myQuotes.reduce((sum, quote) => sum + quote.words.length, 0);

  return (
    <div>
      <section className={styles.profile}>
        <div className={styles.avatar}>{user.nickname.slice(0, 1)}</div>
        <div>
          <h1 className={styles.name}>
            {user.nickname}
            <span className="badge">목표 {user.jlptLevel}</span>
            {user.role === 'admin' && <span className="badge notice">운영진</span>}
          </h1>
          <p className={styles.summary}>
            지금까지 문장 {myQuotes.length}개, 단어 {wordCount}개를 모았어요.
          </p>
        </div>
      </section>

      <nav className={styles.tabs}>
        {tabs.map((tab) => (
          <NavLink
            key={tab.to}
            to={tab.to}
            className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
          >
            {tab.label}
          </NavLink>
        ))}
      </nav>

      <Outlet />
    </div>
  );
}
