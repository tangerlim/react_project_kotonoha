// 복습 카드 페이지 (/mypage/review)
//
// 진행 순서 (phase 상태로 화면을 바꾼다 = 조건부 렌더링)
//   'ready'   : 복습할 범위(노래) 선택 → 시작
//   'playing' : 카드를 한 장씩 보여준다. 뒤집은 뒤 "알아요/몰라요" 선택
//               "몰라요"를 누른 카드는 이번 회차 맨 뒤에 다시 넣는다.
//   'done'    : 결과 화면
//
// 키보드: Space = 뒤집기,  ← 또는 1 = 몰라요,  → 또는 2 = 알아요
// 결과는 recordReview 액션으로 문장 데이터(review)에 기록된다.
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { recordReview } from '../../store/quotesSlice';
import useAuth from '../../hooks/useAuth';
import FlashCard from '../../features/mypage/FlashCard';
import Button from '../../components/common/Button';
import EmptyState from '../../components/common/EmptyState';
import styles from './ReviewPage.module.css';

// 배열을 무작위로 섞은 "새 배열"을 돌려준다. (피셔-예이츠 셔플)
function shuffle(array) {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export default function ReviewPage() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const quotes = useSelector((state) => state.quotes.items);
  const songs = useSelector((state) => state.songs.items);

  const myQuotes = quotes.filter((quote) => quote.ownerId === user.id);
  // 내 문장이 있는 노래만 선택지로 보여준다.
  const mySongs = songs.filter((song) => myQuotes.some((quote) => quote.songId === song.id));

  const [phase, setPhase] = useState('ready');
  const [songFilter, setSongFilter] = useState('all'); // 'all' 또는 노래 id
  const [onlyWeak, setOnlyWeak] = useState(false); // 지난번에 "몰라요"였던 문장만
  const [queue, setQueue] = useState([]); // 이번 회차에 볼 문장 id 순서
  const [position, setPosition] = useState(0); // 지금 보고 있는 카드 번호
  const [flipped, setFlipped] = useState(false);
  const [result, setResult] = useState({ known: 0, unknown: 0 });

  // 시작 화면에서 고른 조건에 맞는 문장들
  const candidates = myQuotes.filter(
    (quote) =>
      (songFilter === 'all' || quote.songId === songFilter) &&
      (!onlyWeak || quote.review.lastResult === 'unknown'),
  );

  const currentQuote = myQuotes.find((quote) => quote.id === queue[position]);
  const currentSong = songs.find((song) => song.id === currentQuote?.songId);

  function handleStart() {
    setQueue(shuffle(candidates.map((quote) => quote.id)));
    setPosition(0);
    setFlipped(false);
    setResult({ known: 0, unknown: 0 });
    setPhase('playing');
  }

  function handleAnswer(answer) {
    dispatch(recordReview({ id: currentQuote.id, result: answer }));
    setResult({ ...result, [answer]: result[answer] + 1 });

    // 몰라요 → 이번 회차 맨 뒤에 다시 넣는다.
    const nextQueue = answer === 'unknown' ? [...queue, currentQuote.id] : queue;
    setQueue(nextQueue);

    if (position + 1 >= nextQueue.length) {
      setPhase('done');
    } else {
      setPosition(position + 1);
      setFlipped(false);
    }
  }

  // 키보드 이벤트: 복습 중일 때만 등록하고, 끝나면(cleanup) 해제한다.
  useEffect(() => {
    if (phase !== 'playing') return;

    function handleKeyDown(event) {
      if (event.code === 'Space') {
        event.preventDefault(); // 스페이스바로 화면이 스크롤되거나 버튼이 눌리는 것을 막는다.
        setFlipped((prev) => !prev);
      } else if (flipped && (event.key === 'ArrowLeft' || event.key === '1')) {
        handleAnswer('unknown');
      } else if (flipped && (event.key === 'ArrowRight' || event.key === '2')) {
        handleAnswer('known');
      }
    }

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });
  // ↑ 의존성 배열을 비워 두지 않고 생략했다. 매번 다시 그려질 때마다 최신 상태(flipped, queue 등)를 쓰는
  //   handleKeyDown으로 다시 등록하기 위해서다. (이전 이벤트는 cleanup에서 지워진다)

  // 1) 문장이 하나도 없을 때
  if (myQuotes.length === 0) {
    return (
      <EmptyState icon="札" title="복습할 문장이 없습니다." description="플레이리스트에서 노래를 열고 문장을 수집해 보세요.">
        <Button to="/songs">플레이리스트로 가기</Button>
      </EmptyState>
    );
  }

  // 2) 시작 화면
  if (phase === 'ready') {
    return (
      <div className={styles.panel}>
        <h2 className={styles.title}>복습 카드</h2>
        <p className={styles.desc}>해석을 보고 원문을 떠올려 보세요. 모르는 카드는 이번 회차 끝에 다시 나옵니다.</p>

        <div className="field">
          <label htmlFor="songFilter">복습할 노래</label>
          <select
            id="songFilter"
            className="input"
            value={songFilter}
            onChange={(e) => setSongFilter(e.target.value)}
          >
            <option value="all">전체 노래</option>
            {mySongs.map((song) => (
              <option key={song.id} value={song.id}>
                {song.titleJa}
              </option>
            ))}
          </select>
        </div>

        <label className={styles.checkbox}>
          <input type="checkbox" checked={onlyWeak} onChange={(e) => setOnlyWeak(e.target.checked)} />
          지난번에 &quot;몰라요&quot;였던 문장만
        </label>

        <Button onClick={handleStart} disabled={candidates.length === 0} className={styles.startButton}>
          {candidates.length > 0 ? `${candidates.length}장 복습 시작` : '조건에 맞는 문장이 없어요'}
        </Button>
      </div>
    );
  }

  // 3) 결과 화면
  if (phase === 'done') {
    const total = result.known + result.unknown;
    return (
      <div className={`${styles.panel} ${styles.center}`}>
        <div className={styles.doneMark}>
          <span className="ja">お疲れさま!</span>
        </div>
        <p className={styles.desc}>
          총 {total}번 답했어요. 알아요 {result.known} · 몰라요 {result.unknown}
        </p>
        <div className={styles.doneActions}>
          <Button onClick={handleStart}>같은 조건으로 다시</Button>
          <Button variant="secondary" onClick={() => setPhase('ready')}>
            처음으로
          </Button>
        </div>
      </div>
    );
  }

  // 4) 복습 중
  return (
    <div>
      <div className={styles.progressRow}>
        <span>
          {position + 1} / {queue.length}
        </span>
        <div className={styles.progressBar}>
          <div className={styles.progressFill} style={{ width: `${(position / queue.length) * 100}%` }} />
        </div>
        <button type="button" className={styles.quit} onClick={() => setPhase('done')}>
          그만하기
        </button>
      </div>

      {/* key를 주면 다음 카드로 넘어갈 때 카드가 새로 만들어져서 뒤집힌 채로 보이지 않는다. */}
      <FlashCard
        key={position}
        quote={currentQuote}
        songTitle={currentSong?.titleJa ?? ''}
        flipped={flipped}
        onFlip={() => setFlipped(!flipped)}
      />

      {/* 뒷면을 확인한 뒤에만 답할 수 있다. */}
      <div className={styles.answers}>
        {flipped ? (
          <>
            <Button variant="danger" onClick={() => handleAnswer('unknown')}>
              몰라요 (←)
            </Button>
            <Button onClick={() => handleAnswer('known')}>알아요 (→)</Button>
          </>
        ) : (
          <p className={styles.keyHint}>카드를 누르거나 Space를 눌러 뒤집으세요.</p>
        )}
      </div>
    </div>
  );
}
