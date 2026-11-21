// 전체 라우트(주소와 화면의 연결) 정의
//
// 중첩 라우팅 구조:
//  - Layout(헤더 + 푸터)이 가장 바깥 부모이고, 모든 페이지가 그 안의 <Outlet />에 그려진다.
//  - /songs/:songId, /board, /mypage 는 다시 각자의 Layout을 가지고 있어서
//    "고정된 부분(노래 정보, 카테고리 탭, 마이페이지 탭)"은 그대로 두고 아래 내용만 바뀐다.
//  - ProtectedRoute로 감싼 페이지는 로그인해야 들어갈 수 있다.
import { Navigate, Route, Routes } from 'react-router-dom';

import Layout from './components/layout/Layout';
import ProtectedRoute from './components/layout/ProtectedRoute';

import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import NotFoundPage from './pages/NotFoundPage';

import SongListPage from './pages/songs/SongListPage';
import SongNewPage from './pages/songs/SongNewPage';
import SongDetailLayout from './pages/songs/SongDetailLayout';
import QuoteListPage from './pages/songs/QuoteListPage';
import QuoteNewPage from './pages/songs/QuoteNewPage';
import QuoteDetailPage from './pages/songs/QuoteDetailPage';

import BoardLayout from './pages/board/BoardLayout';
import PostListPage from './pages/board/PostListPage';
import PostDetailPage from './pages/board/PostDetailPage';
import PostWritePage from './pages/board/PostWritePage';
import PostEditPage from './pages/board/PostEditPage';

import MyPageLayout from './pages/mypage/MyPageLayout';
import VocabPage from './pages/mypage/VocabPage';
import ReviewPage from './pages/mypage/ReviewPage';
import StatsPage from './pages/mypage/StatsPage';

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="signup" element={<SignupPage />} />

        {/* 노래 (내 플레이리스트) */}
        <Route path="songs" element={<SongListPage />} />
        <Route
          path="songs/new"
          element={
            <ProtectedRoute>
              <SongNewPage />
            </ProtectedRoute>
          }
        />
        <Route path="songs/:songId" element={<SongDetailLayout />}>
          <Route index element={<QuoteListPage />} />
          <Route
            path="quotes/new"
            element={
              <ProtectedRoute>
                <QuoteNewPage />
              </ProtectedRoute>
            }
          />
          <Route path="quotes/:quoteId" element={<QuoteDetailPage />} />
        </Route>

        {/* 게시판 */}
        <Route path="board" element={<BoardLayout />}>
          <Route index element={<Navigate to="review" replace />} />
          {/* "write"는 고정 경로라서 :category보다 먼저 맞춰진다. */}
          <Route
            path="write"
            element={
              <ProtectedRoute>
                <PostWritePage />
              </ProtectedRoute>
            }
          />
          <Route path=":category" element={<PostListPage />} />
          <Route path=":category/:postId" element={<PostDetailPage />} />
          <Route
            path=":category/:postId/edit"
            element={
              <ProtectedRoute>
                <PostEditPage />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* 마이페이지: 레이아웃 전체를 ProtectedRoute로 감싸서 하위 페이지가 모두 보호된다. */}
        <Route
          path="mypage"
          element={
            <ProtectedRoute>
              <MyPageLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="vocab" replace />} />
          <Route path="vocab" element={<VocabPage />} />
          <Route path="review" element={<ReviewPage />} />
          <Route path="stats" element={<StatsPage />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}
