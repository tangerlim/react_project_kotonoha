// 노래 등록 페이지 (/songs/new) 🔒
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { addSong } from '../../store/songsSlice';
import useAuth from '../../hooks/useAuth';
import SongForm from '../../features/songs/SongForm';

export default function SongNewPage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  function handleSubmit(values) {
    // 등록한 사람(ownerId)을 붙여서 저장하고, 새 노래의 상세 페이지로 이동한다.
    const action = dispatch(addSong({ ...values, ownerId: user.id }));
    navigate(`/songs/${action.payload.id}`, { replace: true });
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>노래 등록</h1>
          <p>좋아하는 J-POP, 애니송, 보컬로이드 곡을 플레이리스트에 추가하세요.</p>
        </div>
      </div>
      <SongForm submitText="등록하기" onSubmit={handleSubmit} onCancel={() => navigate(-1)} />
    </div>
  );
}
