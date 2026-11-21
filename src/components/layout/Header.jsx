// 상단 메뉴
// NavLink는 현재 주소와 링크가 맞으면 isActive가 true가 되어, 현재 메뉴를 강조할 수 있다.
// 모바일 너비에서는 햄버거 버튼으로 메뉴를 열고 닫는다.
import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout } from '../../store/authSlice';
import useAuth from '../../hooks/useAuth';
import styles from './Header.module.css';

const menus = [
  { to: '/', label: '홈', end: true },
  { to: '/songs', label: '플레이리스트' },
  { to: '/board', label: '게시판' },
  { to: '/mypage', label: '마이페이지' },
];

export default function Header() {
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  function handleLogout() {
    dispatch(logout());
    setIsMenuOpen(false);
    navigate('/');
  }

  // 메뉴를 누르면 모바일 메뉴를 닫는다.
  function closeMenu() {
    setIsMenuOpen(false);
  }

  return (
    <header className={styles.header}>
      <div className={styles.inner}>
        <Link to="/" className={styles.logo} onClick={closeMenu}>
          <span className={styles.logoMark}>言</span>
          <span>
            <span className={styles.logoJa}>ことのは</span>
            <span className={styles.logoKo}>코토노하</span>
          </span>
        </Link>

        <button
          type="button"
          className={styles.menuButton}
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label="메뉴 열기"
          aria-expanded={isMenuOpen}
        >
          {isMenuOpen ? '✕' : '☰'}
        </button>

        {/* isMenuOpen일 때 open 클래스를 붙여서 모바일에서 메뉴가 보이게 한다. */}
        <div className={`${styles.menuArea} ${isMenuOpen ? styles.open : ''}`}>
          <nav className={styles.nav}>
            {menus.map((menu) => (
              <NavLink
                key={menu.to}
                to={menu.to}
                end={menu.end}
                onClick={closeMenu}
                className={({ isActive }) => (isActive ? `${styles.link} ${styles.active}` : styles.link)}
              >
                {menu.label}
              </NavLink>
            ))}
          </nav>

          <div className={styles.userArea}>
            {isLoggedIn ? (
              <>
                <span className={styles.userName}>
                  {user.role === 'admin' && <span className="badge notice">운영진</span>}
                  {user.nickname}님
                </span>
                <button type="button" className={styles.textButton} onClick={handleLogout}>
                  로그아웃
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className={styles.textButton} onClick={closeMenu}>
                  로그인
                </Link>
                <Link to="/signup" className={styles.signupLink} onClick={closeMenu}>
                  회원가입
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
