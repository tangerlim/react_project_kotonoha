// 카테고리별 게시글 목록 페이지 (/board/:category)
//
// - useParams로 주소의 카테고리를 읽는다.
// - 검색어는 useSearchParams로 주소(?q=...)에 저장한다. → 새로고침하거나 링크를 공유해도 검색 결과가 유지된다.
// - useDebounce로 입력이 멈췄을 때만 주소를 바꾼다.
// - useMemo로 "검색 + 정렬" 결과를 기억해서, 관련 값이 바뀔 때만 다시 계산한다.
import { useEffect, useMemo, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import useDebounce from '../../hooks/useDebounce';
import PostList from '../../features/board/PostList';
import SearchBar from '../../components/common/SearchBar';
import EmptyState from '../../components/common/EmptyState';
import NotFoundPage from '../NotFoundPage';
import { CATEGORY_LABEL } from '../../utils/format';
import styles from './PostListPage.module.css';

export default function PostListPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const posts = useSelector((state) => state.board.posts);
  const comments = useSelector((state) => state.board.comments);
  const users = useSelector((state) => state.auth.users);

  // 입력창의 값 (주소에 검색어가 있으면 그것으로 시작)
  const [keyword, setKeyword] = useState(searchParams.get('q') ?? '');
  const debouncedKeyword = useDebounce(keyword, 300);

  // 입력이 멈추면 주소의 ?q= 값을 바꾼다.
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

  const query = (searchParams.get('q') ?? '').toLowerCase();

  // 이 카테고리의 글만 골라서, 제목 검색 후 최신순 정렬
  const filteredPosts = useMemo(() => {
    return posts
      .filter((post) => post.category === category)
      .filter((post) => post.title.toLowerCase().includes(query))
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }, [posts, category, query]);

  // 글마다 댓글 수 세기: { 글id: 개수 }
  const commentCounts = useMemo(() => {
    const counts = {};
    comments.forEach((comment) => {
      counts[comment.postId] = (counts[comment.postId] ?? 0) + 1;
    });
    return counts;
  }, [comments]);

  // 없는 카테고리 주소(/board/abc)로 들어오면 404
  if (!CATEGORY_LABEL[category]) {
    return <NotFoundPage />;
  }

  return (
    <div>
      <div className={styles.toolbar}>
        <span className={styles.count}>
          {CATEGORY_LABEL[category]} · {filteredPosts.length}개
        </span>
        <SearchBar value={keyword} onChange={setKeyword} placeholder="제목 검색" />
      </div>

      {filteredPosts.length > 0 ? (
        <PostList posts={filteredPosts} users={users} commentCounts={commentCounts} />
      ) : (
        <EmptyState
          icon="空"
          title={query ? '검색 결과가 없습니다.' : '아직 글이 없습니다.'}
          description={query ? '다른 검색어로 찾아보세요.' : '첫 번째 글을 남겨 보세요!'}
        />
      )}
    </div>
  );
}
