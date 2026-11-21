// 글 상세 + 댓글 페이지 (/board/:category/:postId)
//
// - 페이지에 들어오면 조회수를 1 올린다. (useEffect)
// - 본인 글이면 수정/삭제 버튼을 보여준다.
// - 글이나 댓글을 지우기 전에 확인 모달을 띄운다.
import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { addComment, deleteComment, deletePost, increaseViews } from '../../store/boardSlice';
import useAuth from '../../hooks/useAuth';
import CommentList from '../../features/board/CommentList';
import CommentForm from '../../features/board/CommentForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { CATEGORY_LABEL, findNickname, formatDate } from '../../utils/format';
import styles from './PostDetailPage.module.css';

export default function PostDetailPage() {
  const { category, postId } = useParams();
  const { user, isLoggedIn } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const post = useSelector((state) => state.board.posts.find((item) => item.id === postId));
  const allComments = useSelector((state) => state.board.comments);
  const users = useSelector((state) => state.auth.users);
  const comments = allComments.filter((comment) => comment.postId === postId);

  // 삭제 확인 모달 상태: null이면 닫힘, { type: 'post' } 또는 { type: 'comment', id }이면 열림
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 조회수 증가
  // 개발 모드의 StrictMode는 effect를 두 번 실행하기 때문에, 같은 글을 두 번 세지 않도록
  // useRef로 "이미 센 글 id"를 기억해 둔다. (ref 값은 다시 그려져도 유지된다)
  const countedPostId = useRef(null);
  useEffect(() => {
    if (countedPostId.current !== postId) {
      countedPostId.current = postId;
      dispatch(increaseViews(postId));
    }
  }, [postId, dispatch]);

  if (!post) {
    return (
      <EmptyState icon="無" title="글을 찾을 수 없습니다." description="삭제되었거나 잘못된 주소입니다.">
        <Button variant="secondary" to="/board">
          게시판으로
        </Button>
      </EmptyState>
    );
  }

  // 주소의 카테고리와 글의 카테고리가 다르면 올바른 주소로 바꿔 준다.
  if (post.category !== category) {
    return <Navigate to={`/board/${post.category}/${post.id}`} replace />;
  }

  const isAuthor = user?.id === post.authorId;

  function handleAddComment(content) {
    dispatch(addComment({ postId: post.id, authorId: user.id, content }));
  }

  function handleConfirmDelete() {
    if (deleteTarget.type === 'post') {
      dispatch(deletePost(post.id)); // 댓글도 함께 삭제된다. (boardSlice 참고)
      navigate(`/board/${post.category}`, { replace: true });
    } else {
      dispatch(deleteComment(deleteTarget.id));
      setDeleteTarget(null);
    }
  }

  return (
    <div className={styles.page}>
      <article className={styles.article}>
        <header className={styles.header}>
          <span className={`badge ${post.category === 'notice' ? 'notice' : ''}`}>
            {CATEGORY_LABEL[post.category]}
          </span>
          <h2 className={styles.title}>{post.title}</h2>
          <div className={styles.meta}>
            <span>{findNickname(users, post.authorId)}</span>
            <span>{formatDate(post.createdAt)}</span>
            {post.updatedAt !== post.createdAt && <span>(수정됨)</span>}
            <span>조회 {post.views}</span>
          </div>
        </header>

        <div className={styles.content}>{post.content}</div>

        {isAuthor && (
          <div className={styles.actions}>
            <Button variant="secondary" size="sm" to={`/board/${post.category}/${post.id}/edit`}>
              수정
            </Button>
            <Button variant="danger" size="sm" onClick={() => setDeleteTarget({ type: 'post' })}>
              삭제
            </Button>
          </div>
        )}
      </article>

      <section className={styles.comments}>
        <h3 className={styles.commentTitle}>댓글 {comments.length}</h3>
        <CommentList
          comments={comments}
          users={users}
          currentUserId={user?.id}
          onDelete={(commentId) => setDeleteTarget({ type: 'comment', id: commentId })}
        />
        {isLoggedIn ? (
          <CommentForm onSubmit={handleAddComment} />
        ) : (
          <p className={styles.loginHint}>
            댓글을 쓰려면{' '}
            <Link to="/login" state={{ from: location }}>
              로그인
            </Link>
            해 주세요.
          </p>
        )}
      </section>

      <div className={styles.back}>
        <Link to={`/board/${post.category}`} className="text-link">
          ← 목록으로
        </Link>
      </div>

      <Modal
        isOpen={deleteTarget !== null}
        title={deleteTarget?.type === 'post' ? '글을 삭제할까요?' : '댓글을 삭제할까요?'}
        onConfirm={handleConfirmDelete}
        onCancel={() => setDeleteTarget(null)}
      >
        {deleteTarget?.type === 'post'
          ? '글과 달린 댓글이 모두 삭제되며 되돌릴 수 없습니다.'
          : '삭제한 댓글은 되돌릴 수 없습니다.'}
      </Modal>
    </div>
  );
}
