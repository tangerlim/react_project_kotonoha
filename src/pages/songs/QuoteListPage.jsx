// 노래의 수집 문장 목록 (/songs/:songId 의 index 자식 라우트)
// 부모(SongDetailLayout)가 넘겨준 노래 정보와 히라가나 설정을 useOutletContext로 받는다.
import { useMemo } from 'react';
import { useOutletContext } from 'react-router-dom';
import { useSelector } from 'react-redux';
import QuoteCard from '../../features/quotes/QuoteCard';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import styles from './QuoteListPage.module.css';

export default function QuoteListPage() {
  const { song, isOwner, showRuby } = useOutletContext();
  const quotes = useSelector((state) => state.quotes.items);

  // 이 노래의 문장만, 최근에 수집한 순서로
  const songQuotes = useMemo(() => {
    return quotes
      .filter((quote) => quote.songId === song.id)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [quotes, song.id]);

  if (songQuotes.length === 0) {
    return (
      <EmptyState
        icon="詞"
        title="아직 수집한 문장이 없습니다."
        description={isOwner ? '듣다가 마음에 든 가사를 저장해 보세요.' : '등록한 동아리원이 아직 문장을 모으지 않았어요.'}
      >
        {isOwner && <Button to={`/songs/${song.id}/quotes/new`}>첫 문장 수집하기</Button>}
      </EmptyState>
    );
  }

  return (
    <section>
      <h2 className={styles.title}>수집한 문장 {songQuotes.length}</h2>
      <div className={styles.list}>
        {songQuotes.map((quote) => (
          <QuoteCard
            key={quote.id}
            quote={quote}
            showRuby={showRuby}
            to={`/songs/${song.id}/quotes/${quote.id}`}
          />
        ))}
      </div>
    </section>
  );
}
