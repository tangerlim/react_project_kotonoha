// 단어장 페이지 (/mypage/vocab)
//
// 내가 수집한 모든 문장의 단어를 하나의 표로 모은다.
// → 단어를 따로 입력할 필요 없이, 문장을 수집하면 단어장이 저절로 채워진다. (이 앱의 핵심 아이디어)
import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import VocabTable from '../../features/mypage/VocabTable';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import styles from './VocabPage.module.css';

export default function VocabPage() {
  const { user } = useAuth();
  const quotes = useSelector((state) => state.quotes.items);
  const songs = useSelector((state) => state.songs.items);
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();

  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '');
  const debouncedKeyword = useDebounce(keyword, 300);

  useEffect(() => {
    setSearchParams(debouncedKeyword ? { q: debouncedKeyword } : {}, { replace: true });
  }, [debouncedKeyword, setSearchParams]);

  // 내 문장들의 단어를 한 줄씩 펼친다. (문장 1개에 단어 3개 → 표 3줄)
  const allRows = useMemo(() => {
    const rows = [];
    quotes
      .filter((quote) => quote.ownerId === user.id)
      .forEach((quote) => {
        const song = songs.find((item) => item.id === quote.songId);
        quote.words.forEach((item, index) => {
          rows.push({
            key: `${quote.id}-${index}`,
            word: item.word,
            reading: item.reading,
            meaning: item.meaning,
            songTitle: song ? song.titleJa : '',
            quoteLink: `/songs/${quote.songId}/quotes/${quote.id}`,
          });
        });
      });
    // 읽기(없으면 단어) 기준 가나다(あいう)순 정렬
    return rows.sort((a, b) => (a.reading || a.word).localeCompare(b.reading || b.word, 'ja'));
  }, [quotes, songs, user.id]);

  // 단어, 읽기, 뜻 어느 것으로든 검색할 수 있다.
  const query = (searchParams.get('q') ?? '').toLowerCase();
  const visibleRows = useMemo(() => {
    if (!query) return allRows;
    return allRows.filter(
      (row) =>
        row.word.toLowerCase().includes(query) ||
        row.reading.toLowerCase().includes(query) ||
        row.meaning.toLowerCase().includes(query),
    );
  }, [allRows, query]);

  // 단어를 누르면 그 단어가 나온 문장 상세로 이동하고, ?word= 로 어떤 단어인지 알려준다.
  function handleRowClick(row) {
    navigate(`${row.quoteLink}?word=${encodeURIComponent(row.word)}`);
  }

  if (allRows.length === 0) {
    return (
      <EmptyState icon="単" title="단어장이 비어 있습니다." description="문장을 수집할 때 단어를 함께 적으면 여기에 모여요.">
        <Button to="/songs">플레이리스트로 가기</Button>
      </EmptyState>
    );
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <span className={styles.count}>
          단어 {visibleRows.length}
          {query && ` / ${allRows.length}`}개
        </span>
        <SearchBar value={keyword} onChange={setKeyword} placeholder="단어, 읽기, 뜻 검색" />
      </div>

      {visibleRows.length > 0 ? (
        <VocabTable rows={visibleRows} onRowClick={handleRowClick} />
      ) : (
        <EmptyState icon="空" title="검색 결과가 없습니다." />
      )}
      <p className={styles.hint}>단어를 누르면 그 단어가 나온 문장으로 이동합니다.</p>
    </div>
  );
}
