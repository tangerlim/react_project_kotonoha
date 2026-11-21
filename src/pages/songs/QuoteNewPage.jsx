// 문장 추가 페이지 (/songs/:songId/quotes/new) 🔒
// 노래를 등록한 본인만 문장을 추가할 수 있다.
import { Navigate, useNavigate, useOutletContext } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addQuote } from '../../store/quotesSlice';
import useAuth from '../../hooks/useAuth';
import QuoteForm from '../../features/quotes/QuoteForm';

export default function QuoteNewPage() {
  const { song, isOwner } = useOutletContext();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // 다른 사람의 노래라면 문장 목록으로 돌려보낸다.
  if (!isOwner) {
    return <Navigate to={`/songs/${song.id}`} replace />;
  }

  function handleSubmit(values) {
    const action = dispatch(addQuote({ ...values, songId: song.id, ownerId: user.id }));
    navigate(`/songs/${song.id}/quotes/${action.payload.id}`, { replace: true });
  }

  return (
    <section>
      <h2 className="section-title">새 문장 수집</h2>
      <QuoteForm submitText="저장하기" onSubmit={handleSubmit} onCancel={() => navigate(`/songs/${song.id}`)} />
    </section>
  );
}
