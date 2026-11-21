// 글쓰기 페이지 (/board/write?category=review) 🔒
// 주소의 ?category= 값으로 카테고리를 미리 골라 둔다.
// 공지(notice)는 운영진(admin)만 고를 수 있다.
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addPost } from '../../store/boardSlice';
import useAuth from '../../hooks/useAuth';
import PostForm from '../../features/board/PostForm';
import { CATEGORY_LABEL } from '../../utils/format';

export default function PostWritePage() {
  const { user, isAdmin } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 운영진이 아니면 공지 카테고리를 목록에서 뺀다.
  const categoryOptions = Object.entries(CATEGORY_LABEL).filter(([key]) => isAdmin || key !== 'notice');
  const availableKeys = categoryOptions.map(([key]) => key);

  // 주소의 카테고리가 고를 수 있는 값이면 사용, 아니면 감상
  const paramCategory = searchParams.get('category');
  const startCategory = availableKeys.includes(paramCategory) ? paramCategory : 'review';

  function handleSubmit(values) {
    // dispatch는 보낸 action을 돌려주므로, prepare에서 만든 새 글 id를 알 수 있다.
    const action = dispatch(addPost({ ...values, authorId: user.id }));
    navigate(`/board/${values.category}/${action.payload.id}`);
  }

  return (
    <PostForm
      initialValues={{ category: startCategory, title: '', content: '' }}
      categoryOptions={categoryOptions}
      submitText="등록하기"
      onSubmit={handleSubmit}
      onCancel={() => navigate(-1)}
    />
  );
}
