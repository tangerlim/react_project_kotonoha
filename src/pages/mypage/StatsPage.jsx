// 통계 페이지 (/mypage/stats)
// 내 노래와 문장 데이터를 세어서 숫자 카드와 비율 막대로 보여준다.
// 계산이 여러 단계라 useMemo로 묶어서, 데이터가 바뀔 때만 다시 계산한다.
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import StatsCard from '../../features/mypage/StatsCard';
import RatioBars from '../../features/mypage/RatioBars';
import { SONG_STATUS_LABEL, SONG_GENRE_LABEL } from '../../utils/format';
import styles from './StatsPage.module.css';

// 막대 색 (노래 카드의 왼쪽 색 띠와 맞췄다)
const GENRE_COLORS = { jpop: '#7a9a8a', anime: '#c8553d', vocaloid: '#2b3a67' };
const STATUS_COLORS = { listening: '#2b3a67', done: '#4d7c5b', wish: '#b8ad98' };

export default function StatsPage() {
  const { user } = useAuth();
  const songs = useSelector((state) => state.songs.items);
  const quotes = useSelector((state) => state.quotes.items);

  const stats = useMemo(() => {
    const mySongs = songs.filter((song) => song.ownerId === user.id);
    const myQuotes = quotes.filter((quote) => quote.ownerId === user.id);

    const wordCount = myQuotes.reduce((sum, quote) => sum + quote.words.length, 0);
    const knownCount = myQuotes.reduce((sum, quote) => sum + quote.review.known, 0);
    const unknownCount = myQuotes.reduce((sum, quote) => sum + quote.review.unknown, 0);
    const reviewTotal = knownCount + unknownCount;

    // 문장을 가장 많이 모은 노래
    let topSong = null;
    let topCount = 0;
    mySongs.forEach((song) => {
      const count = myQuotes.filter((quote) => quote.songId === song.id).length;
      if (count > topCount) {
        topSong = song;
        topCount = count;
      }
    });

    return {
      songCount: mySongs.length,
      doneCount: mySongs.filter((song) => song.status === 'done').length,
      quoteCount: myQuotes.length,
      wordCount,
      reviewTotal,
      accuracy: reviewTotal === 0 ? null : Math.round((knownCount / reviewTotal) * 100),
      topSong,
      topCount,
      // 장르별·상태별 개수 → RatioBars에 넘길 형태로 만든다.
      genreItems: Object.entries(SONG_GENRE_LABEL).map(([key, label]) => ({
        label,
        count: mySongs.filter((song) => song.genre === key).length,
        color: GENRE_COLORS[key],
      })),
      statusItems: Object.entries(SONG_STATUS_LABEL).map(([key, label]) => ({
        label,
        count: mySongs.filter((song) => song.status === key).length,
        color: STATUS_COLORS[key],
      })),
    };
  }, [songs, quotes, user.id]);

  return (
    <div>
      <div className={styles.cards}>
        <StatsCard label="등록한 노래" value={stats.songCount} unit="곡" sub={`완창 ${stats.doneCount}곡`} />
        <StatsCard label="수집 문장" value={stats.quoteCount} unit="개" />
        <StatsCard label="모은 단어" value={stats.wordCount} unit="개" />
        <StatsCard
          label="복습 정답률"
          value={stats.accuracy ?? '-'}
          unit={stats.accuracy === null ? '' : '%'}
          sub={`총 ${stats.reviewTotal}번 복습`}
        />
      </div>

      <div className={styles.charts}>
        <RatioBars title="장르별 비율" items={stats.genreItems} />
        <RatioBars title="듣기 상태별 비율" items={stats.statusItems} />
      </div>

      {stats.topSong && (
        <p className={styles.top}>
          가장 많은 문장을 모은 노래는 <strong className="ja">「{stats.topSong.titleJa}」</strong>(
          {stats.topCount}개)예요.
        </p>
      )}
    </div>
  );
}
