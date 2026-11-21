// 게시글 목록
//
// Props
//  - posts: 보여줄 게시글 배열 (이미 정렬·검색된 상태로 받는다)
//  - users: 작성자 닉네임을 찾기 위한 회원 목록
//  - commentCounts: { 글id: 댓글 수 } 객체
import { Link } from 'react-router-dom';
import { findNickname, formatRelative } from '../../utils/format';
import styles from './PostList.module.css';

export default function PostList({ posts, users, commentCounts }) {
  return (
    <ul className={styles.list}>
      {posts.map((post) => (
        <li key={post.id}>
          <Link to={`/board/${post.category}/${post.id}`} className={styles.item}>
            <div className={styles.main}>
              <span className={styles.title}>
                {post.category === 'notice' && <span className="badge notice">공지</span>}
                {post.title}
                {commentCounts[post.id] > 0 && (
                  <span className={styles.commentCount}>[{commentCounts[post.id]}]</span>
                )}
              </span>
              <span className={styles.meta}>
                {findNickname(users, post.authorId)} · {formatRelative(post.createdAt)}
              </span>
            </div>
            <span className={styles.views}>조회 {post.views}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
