// 게시판 레이아웃 (중첩 라우팅의 부모)
// 위쪽의 제목과 카테고리 탭은 고정되고, 아래 <Outlet />에 글 목록/상세/작성 화면이 바뀌어 그려진다.
import { NavLink, Outlet, useParams } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import Button from '../../components/common/Button';
import { CATEGORY_LABEL } from '../../utils/format';
import styles from './BoardLayout.module.css';

// CATEGORY_LABEL = { notice: '공지', review: '감상', question: '번역 질문' } → 탭 목록으로 바꾼다.
const categories = Object.entries(CATEGORY_LABEL);

export default function BoardLayout() {
  const { isLoggedIn } = useAuth();
  const { category } = useParams();

  // 지금 보고 있는 카테고리로 글쓰기 화면을 연다. (공지 탭이면 기본값은 감상)
  const writeCategory = category && category !== 'notice' ? category : 'review';

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>게시판</h1>
          <p>좋아하는 노래의 감상을 나누고, 번역이 막히는 가사를 함께 고민해요.</p>
        </div>
        {isLoggedIn && <Button to={`/board/write?category=${writeCategory}`}>글쓰기</Button>}
      </div>

      <nav className={styles.tabs}>
        {categories.map(([key, label]) => (
          <NavLink
            key={key}
            to={`/board/${key}`}
            className={({ isActive }) => (isActive ? `${styles.tab} ${styles.active}` : styles.tab)}
          >
            {label}
          </NavLink>
        ))}
      </nav>

      {/* key에 카테고리를 주면 탭을 바꿀 때 아래 화면이 새로 만들어져서
          이전 탭에서 입력한 검색어가 남아 있지 않게 된다. */}
      <div key={category}>
        <Outlet />
      </div>
    </div>
  );
}
