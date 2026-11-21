// 노래 목록 페이지 (/songs) — 플레이리스트
//
// 검색어(q), 상태(status), 보기 범위(scope)를 모두 주소(?q=&status=&scope=)에 저장한다. (useSearchParams)
// → 뒤로 가기, 새로고침, 링크 공유를 해도 같은 필터 화면이 나온다.
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import useDebounce from '../../hooks/useDebounce';
import SongCard from '../../features/songs/SongCard';
import SongFilter from '../../features/songs/SongFilter';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import Button from '../../components/common/Button';
import { findNickname } from '../../utils/format';
import styles from './SongListPage.module.css';

export default function SongListPage() {
  const { user, isLoggedIn } = useAuth();
  const songs = useSelector((state) => state.songs.items);
  const quotes = useSelector((state) => state.quotes.items);
  const users = useSelector((state) => state.auth.users);
  const [searchParams, setSearchParams] = useSearchParams();

  // 주소에서 현재 필터 값 읽기 (없으면 기본값)
  const status = searchParams.get('status') ?? 'all';
  // 로그인했으면 기본은 "내 노래", 로그인 안 했으면 항상 "전체"
  const scope = isLoggedIn ? (searchParams.get('scope') ?? 'mine') : 'all';
  const query = (searchParams.get('q') ?? '').toLowerCase();

  // 주소의 값 하나를 바꾸는 함수 (기본값이면 주소에서 지운다)
  function updateParam(key, value, defaultValue) {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (value === defaultValue) next.delete(key);
        else next.set(key, value);
        return next;
      },
      { replace: true },
    );
  }

  // 검색어 입력 → 0.3초 멈추면 주소에 반영
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '');
  const debouncedKeyword = useDebounce(keyword, 300);
  useEffect(() => {
    setSearchParams(
      (prev) => {
        const next = new URLSearchParams(prev);
        if (debouncedKeyword) next.set('q', debouncedKeyword);
        else next.delete('q');
        return next;
      },
      { replace: true },
    );
  }, [debouncedKeyword, setSearchParams]);

  // 1단계: 보기 범위(내 노래/전체) + 제목 검색
  const scopedSongs = useMemo(() => {
    return songs
      .filter((song) => scope === 'all' || song.ownerId === user?.id)
      .filter(
        (song) => song.titleJa.toLowerCase().includes(query) || song.titleKo.toLowerCase().includes(query),
      );
  }, [songs, scope, user, query]);

  // 상태 탭에 보여줄 개수
  const counts = {
    all: scopedSongs.length,
    listening: scopedSongs.filter((song) => song.status === 'listening').length,
    done: scopedSongs.filter((song) => song.status === 'done').length,
    wish: scopedSongs.filter((song) => song.status === 'wish').length,
  };

  // 2단계: 상태 필터 + 최신 등록순
  const visibleSongs = useMemo(() => {
    return scopedSongs
      .filter((song) => status === 'all' || song.status === status)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [scopedSongs, status]);

  // 노래별 문장 수 { 노래id: 개수 }
  const quoteCounts = useMemo(() => {
    const result = {};
    quotes.forEach((quote) => {
      result[quote.songId] = (result[quote.songId] ?? 0) + 1;
    });
    return result;
  }, [quotes]);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1>플레이리스트</h1>
          <p>{scope === 'mine' ? '내가 좋아하는 노래들' : '동아리원들이 좋아하는 노래들'}</p>
        </div>
        {isLoggedIn && <Button to="/songs/new">+ 노래 등록</Button>}
      </div>

      <div className={styles.toolbar}>
        <SongFilter
          status={status}
          onStatusChange={(value) => updateParam('status', value, 'all')}
          scope={scope}
          onScopeChange={(value) => updateParam('scope', value, 'mine')}
          showScope={isLoggedIn}
          counts={counts}
        />
        <SearchBar value={keyword} onChange={setKeyword} placeholder="노래 제목 검색 (일본어/한국어)" />
      </div>

      {visibleSongs.length > 0 ? (
        <div className={styles.grid}>
          {visibleSongs.map((song) => (
            <SongCard
              key={song.id}
              song={song}
              quoteCount={quoteCounts[song.id] ?? 0}
              ownerName={findNickname(users, song.ownerId)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon="曲"
          title={query || status !== 'all' ? '조건에 맞는 노래가 없습니다.' : '플레이리스트가 비어 있습니다.'}
          description={
            query || status !== 'all' ? '검색어나 필터를 바꿔 보세요.' : '좋아하는 노래를 등록하고 가사를 모아 보세요.'
          }
        >
          {isLoggedIn && !query && status === 'all' && <Button to="/songs/new">첫 노래 등록하기</Button>}
        </EmptyState>
      )}
    </div>
  );
}
