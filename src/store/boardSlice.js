// 게시판(게시글 + 댓글) 데이터를 관리하는 slice
// 게시글과 댓글을 한 slice에 두어서, 글을 지울 때 댓글도 같은 reducer 안에서 함께 지울 수 있게 했다.
import { createSlice } from '@reduxjs/toolkit';
import { createId } from '../utils/format';
import { seedPosts, seedComments } from '../data/seed';

const initialState = {
  posts: seedPosts,
  comments: seedComments,
};

const boardSlice = createSlice({
  name: 'board',
  initialState,
  reducers: {
    // 글 작성: 조회수 0, 작성/수정 시간을 붙인다.
    addPost: {
      prepare(postData) {
        const now = new Date().toISOString();
        return {
          payload: {
            ...postData,
            id: createId(),
            views: 0,
            createdAt: now,
            updatedAt: now,
          },
        };
      },
      reducer(state, action) {
        state.posts.push(action.payload);
      },
    },

    // 글 수정: payload = { id, changes }. 수정 시간도 함께 바꾼다.
    updatePost: {
      prepare({ id, changes }) {
        return {
          payload: { id, changes: { ...changes, updatedAt: new Date().toISOString() } },
        };
      },
      reducer(state, action) {
        const { id, changes } = action.payload;
        const post = state.posts.find((item) => item.id === id);
        if (post) {
          Object.assign(post, changes);
        }
      },
    },

    // 글 삭제: payload = 글 id. 그 글의 댓글도 함께 삭제한다.
    deletePost(state, action) {
      const postId = action.payload;
      state.posts = state.posts.filter((item) => item.id !== postId);
      state.comments = state.comments.filter((item) => item.postId !== postId);
    },

    // 조회수 1 증가: payload = 글 id
    increaseViews(state, action) {
      const post = state.posts.find((item) => item.id === action.payload);
      if (post) {
        post.views += 1;
      }
    },

    // 댓글 작성
    addComment: {
      prepare(commentData) {
        return {
          payload: {
            ...commentData,
            id: createId(),
            createdAt: new Date().toISOString(),
          },
        };
      },
      reducer(state, action) {
        state.comments.push(action.payload);
      },
    },

    // 댓글 삭제: payload = 댓글 id
    deleteComment(state, action) {
      state.comments = state.comments.filter((item) => item.id !== action.payload);
    },
  },
});

export const { addPost, updatePost, deletePost, increaseViews, addComment, deleteComment } =
  boardSlice.actions;
export default boardSlice.reducer;
