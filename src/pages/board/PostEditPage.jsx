// 글 수정 페이지 (/board/:category/:postId/edit) 🔒
// 본인이 쓴 글만 수정할 수 있다.
import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { updatePost } from '../../store/boardSlice';
import useAuth from '../../hooks/useAuth';
import PostForm from '../../features/board/PostForm';
import EmptyState from '../../components/common/EmptyState';
import { CATEGORY_LABEL } from '../../utils/format';

export default function PostEditPage() {
  const { postId } = useParams();
  const { user, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const post = useSelector((state) => state.board.posts.find((item) => item.id === postId));

  if (!post) {
    return <EmptyState icon="無" title="글을 찾을 수 없습니다." />;
  }

  // 작성자가 아니면 상세 페이지로 돌려보낸다.
  if (post.authorId !== user.id) {
    return <Navigate to={`/board/${post.category}/${post.id}`} replace />;
  }

  const categoryOptions = Object.entries(CATEGORY_LABEL).filter(([key]) => isAdmin || key !== 'notice');

  function handleSubmit(values) {
    dispatch(updatePost({ id: post.id, changes: values }));
    navigate(`/board/${values.category}/${post.id}`, { replace: true });
  }

  return (
    <PostForm
      initialValues={{ category: post.category, title: post.title, content: post.content }}
      categoryOptions={categoryOptions}
      submitText="수정하기"
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
}
