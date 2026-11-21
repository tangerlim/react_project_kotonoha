// 노래 상세 레이아웃 (/songs/:songId) — 중첩 라우팅의 부모
//
// 위쪽의 노래 정보는 고정되고, 아래 <Outlet />에 "문장 목록 / 문장 추가 / 문장 상세"가 바뀌어 그려진다.
// <Outlet context={...}>로 자식 페이지에 노래 정보와 히라가나 표시 여부를 넘겨준다.
// (자식 페이지는 useOutletContext()로 꺼내 쓴다. → 같은 데이터를 자식마다 다시 찾을 필요가 없다)
import { useState } from 'react';
import { Link, Outlet, useNavigate, useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteSong, updateSong } from '../../store/songsSlice';
import useAuth from '../../hooks/useAuth';
import SongForm from '../../features/songs/SongForm';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { SONG_STATUS_LABEL, SONG_GENRE_LABEL, findNickname } from '../../utils/format';
import styles from './SongDetailLayout.module.css';

export default function SongDetailLayout() {
  const { songId } = useParams();
  const { user } = useAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const song = useSelector((state) => state.songs.items.find((item) => item.id === songId));
  const quotes = useSelector((state) => state.quotes.items);
  const users = useSelector((state) => state.auth.users);

  const [showRuby, setShowRuby] = useState(true); // 히라가나 켜기/끄기
  const [isEditing, setIsEditing] = useState(false); // 노래 정보 수정 모드
  const [isDeleteOpen, setIsDeleteOpen] = useState(false); // 삭제 확인 모달

  if (!song) {
    return (
      <EmptyState icon="無" title="노래를 찾을 수 없습니다." description="삭제되었거나 잘못된 주소입니다.">
        <Button variant="secondary" to="/songs">
          플레이리스트로
        </Button>
      </EmptyState>
    );
  }

  const isOwner = user?.id === song.ownerId;
  const quoteCount = quotes.filter((quote) => quote.songId === song.id).length;

  function handleUpdate(values) {
    dispatch(updateSong({ id: song.id, changes: values }));
    setIsEditing(false);
  }

  function handleDelete() {
    dispatch(deleteSong(song.id)); // 이 노래의 문장도 함께 삭제된다. (quotesSlice의 extraReducers)
    navigate('/songs', { replace: true });
  }

  return (
    <div>
      <Link to="/songs" className="text-link">
        ← 플레이리스트
      </Link>

      {isEditing ? (
        <div className={styles.editArea}>
          <h2 className={styles.editTitle}>노래 정보 수정</h2>
          <SongForm
            initialValues={song}
            submitText="저장하기"
            onSubmit={handleUpdate}
            onCancel={() => setIsEditing(false)}
          />
        </div>
      ) : (
        <section className={styles.info}>
          <div className={styles.cover}>
            <span className="ja">{song.titleJa.slice(0, 1)}</span>
          </div>

          <div className={styles.detail}>
            <div className={styles.badges}>
              <span className="badge muted">{SONG_GENRE_LABEL[song.genre]}</span>
              <span className={`badge ${song.status === 'done' ? 'done' : ''}`}>
                {SONG_STATUS_LABEL[song.status]}
              </span>
            </div>
            <h1 className={`ja ${styles.titleJa}`}>{song.titleJa}</h1>
            {song.titleKo && <p className={styles.titleKo}>{song.titleKo}</p>}
            <p className={styles.meta}>
              {song.artist} · {findNickname(users, song.ownerId)}의 플레이리스트 · 문장 {quoteCount}개
            </p>

            <div className={styles.progress}>
              <div className={styles.progressBar}>
                <div className={styles.progressFill} style={{ width: `${song.progress}%` }} />
              </div>
              <span>가사 {song.progress}% 외움</span>
            </div>
          </div>

          <div className={styles.actions}>
            <Button variant="secondary" size="sm" onClick={() => setShowRuby(!showRuby)}>
              히라가나 {showRuby ? '끄기' : '켜기'}
            </Button>
            {isOwner && (
              <>
                <Button size="sm" to={`/songs/${song.id}/quotes/new`}>
                  + 문장 추가
                </Button>
                <Button variant="ghost" size="sm" onClick={() => setIsEditing(true)}>
                  수정
                </Button>
                <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)}>
                  삭제
                </Button>
              </>
            )}
          </div>
        </section>
      )}

      {/* 자식 라우트(문장 목록/추가/상세)가 여기에 그려진다. */}
      <div className={styles.outlet}>
        <Outlet context={{ song, isOwner, showRuby }} />
      </div>

      <Modal
        isOpen={isDeleteOpen}
        title="노래를 삭제할까요?"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      >
        「{song.titleJa}」와 수집한 문장 {quoteCount}개가 모두 삭제되며 되돌릴 수 없습니다.
      </Modal>
    </div>
  );
}
