// 댓글 목록
//
// Props
//  - comments: 댓글 배열
//  - users: 닉네임을 찾기 위한 회원 목록
//  - currentUserId: 로그인한 사용자 id (본인 댓글에만 삭제 버튼을 보여주기 위해)
//  - onDelete(commentId): 삭제 버튼을 누르면 부모에게 알린다. (실제 삭제와 확인 모달은 부모가 처리)
import { findNickname, formatRelative } from '../../utils/format';
import styles from './Comment.module.css';

export default function CommentList({ comments, users, currentUserId, onDelete }) {
  if (comments.length === 0) {
    return <p className={styles.empty}>첫 댓글을 남겨 보세요.</p>;
  }

  return (
    <ul className={styles.list}>
      {comments.map((comment) => (
        <li key={comment.id} className={styles.item}>
          <div className={styles.head}>
            <strong>{findNickname(users, comment.authorId)}</strong>
            <span className={styles.date}>{formatRelative(comment.createdAt)}</span>
            {comment.authorId === currentUserId && (
              <button type="button" className={styles.deleteButton} onClick={() => onDelete(comment.id)}>
                삭제
              </button>
            )}
          </div>
          <p className={styles.content}>{comment.content}</p>
        </li>
      ))}
    </ul>
  );
}
