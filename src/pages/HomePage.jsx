// 홈 페이지 (/)
//
// 1. 오늘의 문장: 동아리원 전체 문장 중 하나. 날짜로 고르기 때문에 하루 동안은 같은 문장이 나온다.
//    "다른 문장" 버튼을 누르면 무작위로 바꿀 수 있다.
// 2. 이용 흐름 소개 (노래 등록 → 문장 수집 → 단어장 → 복습 → 감상 공유)
// 3. 동아리원들이 최근 수집한 문장 피드
// 4. 최근 게시글
import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useAuth from '../hooks/useAuth';
import QuoteCard from '../features/quotes/QuoteCard';
import RubyText from '../components/common/RubyText';
import Button from '../components/common/Button';
import EmptyState from '../components/common/EmptyState';
import { CATEGORY_LABEL, findNickname, formatRelative } from '../utils/format';
import styles from './HomePage.module.css';

const steps = [
  { mark: '曲', title: '노래 등록', text: '좋아하는 노래를 플레이리스트에 담아요' },
  { mark: '詞', title: '가사 수집', text: '마음에 든 가사를 히라가나와 함께' },
  { mark: '単', title: '단어장', text: '문장 속 단어가 자동으로 모여요' },
  { mark: '札', title: '복습 카드', text: '해석을 보고 원문 떠올리기' },
  { mark: '話', title: '감상 공유', text: '게시판에서 함께 이야기해요' },
];

// 오늘 날짜를 숫자로 바꿔서(1970년부터 며칠째인지) 문장 번호를 고른다.
function getTodayIndex(length) {
  const dayNumber = Math.floor(Date.now() / (1000 * 60 * 60 * 24));
  return dayNumber % length;
}

export default function HomePage() {
  const { user, isLoggedIn } = useAuth();
  const quotes = useSelector((state) => state.quotes.items);
  const songs = useSelector((state) => state.songs.items);
  const posts = useSelector((state) => state.board.posts);
  const users = useSelector((state) => state.auth.users);

  // 오늘의 문장 번호 (처음에는 날짜로 정하고, 버튼을 누르면 무작위로 바꾼다)
  const [todayIndex, setTodayIndex] = useState(() => (quotes.length > 0 ? getTodayIndex(quotes.length) : 0));
  const todayQuote = quotes[todayIndex] ?? quotes[0];
  const todaySong = songs.find((song) => song.id === todayQuote?.songId);

  function handleShuffle() {
    if (quotes.length < 2) return;
    let next = todayIndex;
    // 같은 문장이 다시 나오지 않도록 다른 번호가 나올 때까지 뽑는다.
    while (next === todayIndex) {
      next = Math.floor(Math.random() * quotes.length);
    }
    setTodayIndex(next);
  }

  // 최근 수집 문장 6개
  const recentQuotes = useMemo(() => {
    return [...quotes].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 6);
  }, [quotes]);

  // 최근 게시글 5개
  const recentPosts = useMemo(() => {
    return [...posts].sort((a, b) => b.createdAt.localeCompare(a.createdAt)).slice(0, 5);
  }, [posts]);

  return (
    <div className={styles.home}>
      {/* 오늘의 문장 */}
      <section className={styles.hero}>
        <div className={styles.heroHead}>
          <span className={styles.heroLabel}>
            <span className="ja">今日の一文</span> · 오늘의 문장
          </span>
          {quotes.length > 1 && (
            <button type="button" className={styles.shuffle} onClick={handleShuffle}>
              ↻ 다른 문장
            </button>
          )}
        </div>

        {todayQuote ? (
          <Link to={`/songs/${todayQuote.songId}/quotes/${todayQuote.id}`} className={styles.heroQuote}>
            <p className={styles.heroText}>
              <RubyText text={todayQuote.text} />
            </p>
            <p className={styles.heroTranslation}>{todayQuote.translation}</p>
            <p className={styles.heroSource}>
              <span className="ja">「{todaySong?.titleJa}」</span> · {findNickname(users, todayQuote.ownerId)}님이 수집
            </p>
          </Link>
        ) : (
          <p className={styles.heroTranslation}>아직 수집된 문장이 없어요. 첫 문장을 모아 보세요!</p>
        )}

        <div className={styles.heroActions}>
          {isLoggedIn ? (
            <>
              <span className={styles.welcome}>{user.nickname}님, 오늘은 어떤 문장을 만났나요?</span>
              <Button to="/songs">내 플레이리스트 열기</Button>
              <Button variant="secondary" to="/mypage/review">
                복습하기
              </Button>
            </>
          ) : (
            <>
              <span className={styles.welcome}>좋아하는 노래 가사째로 모으는 일본어 동아리 노트</span>
              <Button to="/signup">시작하기</Button>
              <Button variant="secondary" to="/login">
                로그인
              </Button>
            </>
          )}
        </div>
      </section>

      {/* 이용 흐름 */}
      <ol className={styles.steps}>
        {steps.map((step) => (
          <li key={step.title} className={styles.step}>
            <span className={`ja ${styles.stepMark}`}>{step.mark}</span>
            <strong>{step.title}</strong>
            <span>{step.text}</span>
          </li>
        ))}
      </ol>

      <div className={styles.columns}>
        {/* 최근 수집 문장 피드 */}
        <section>
          <div className={styles.sectionHead}>
            <h2>동아리원들의 최근 문장</h2>
            <Link to="/songs?scope=all" className="text-link">
              전체 플레이리스트 →
            </Link>
          </div>
          {recentQuotes.length > 0 ? (
            <div className={styles.feed}>
              {recentQuotes.map((quote) => {
                const song = songs.find((item) => item.id === quote.songId);
                return (
                  <QuoteCard
                    key={quote.id}
                    quote={quote}
                    to={`/songs/${quote.songId}/quotes/${quote.id}`}
                    subtitle={`${findNickname(users, quote.ownerId)} · ${song?.titleKo || song?.titleJa || ''}`}
                  />
                );
              })}
            </div>
          ) : (
            <EmptyState title="아직 수집된 문장이 없습니다." />
          )}
        </section>

        {/* 최근 게시글 */}
        <section>
          <div className={styles.sectionHead}>
            <h2>최근 게시글</h2>
            <Link to="/board" className="text-link">
              게시판 →
            </Link>
          </div>
          {recentPosts.length > 0 ? (
            <ul className={styles.posts}>
              {recentPosts.map((post) => (
                <li key={post.id}>
                  <Link to={`/board/${post.category}/${post.id}`} className={styles.postItem}>
                    <span className={`badge ${post.category === 'notice' ? 'notice' : 'muted'}`}>
                      {CATEGORY_LABEL[post.category]}
                    </span>
                    <span className={styles.postTitle}>{post.title}</span>
                    <span className={styles.postMeta}>
                      {findNickname(users, post.authorId)} · {formatRelative(post.createdAt)}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <EmptyState title="아직 게시글이 없습니다." />
          )}
        </section>
      </div>
    </div>
  );
}
