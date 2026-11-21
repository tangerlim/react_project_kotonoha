// 모든 페이지의 공통 틀: 위에 Header, 가운데 페이지 내용(Outlet), 아래 푸터
// App.jsx에서 가장 바깥 Route의 element로 쓰인다.
import { Outlet } from 'react-router-dom';
import Header from './Header';
import { clearState } from '../../utils/storage';
import styles from './Layout.module.css';

export default function Layout() {
  // 시연할 때 데이터를 처음 상태로 되돌리는 기능
  function handleReset() {
    if (window.confirm('모든 데이터를 지우고 샘플 데이터로 되돌릴까요?')) {
      clearState();
      window.location.href = '/';
    }
  }

  return (
    <div className={styles.wrapper}>
      <Header />
      <main className={styles.main}>
        {/* 현재 주소에 맞는 자식 페이지가 여기에 그려진다. */}
        <Outlet />
      </main>
      <footer className={styles.footer}>
        <span>
          <span className="ja">ことのは</span> · 일본어 동아리 문장 수집 노트
        </span>
        <button type="button" className={styles.resetButton} onClick={handleReset}>
          샘플 데이터로 초기화
        </button>
      </footer>
    </div>
  );
}
