// 댓글 입력 폼
//
// Props
//  - onSubmit(content): 등록 버튼을 누르면 입력한 내용을 부모에게 넘긴다.
// 등록 후에는 입력칸을 비운다.
import { useState } from 'react';
import Button from '../../components/common/Button';
import styles from './Comment.module.css';

export default function CommentForm({ onSubmit }) {
  const [content, setContent] = useState('');

  function handleSubmit(event) {
    event.preventDefault();
    if (content.trim() === '') return; // 빈 댓글은 등록하지 않는다.
    onSubmit(content.trim());
    setContent('');
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <textarea
        className="input"
        rows={3}
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="댓글을 입력하세요"
      />
      <Button type="submit" disabled={content.trim() === ''}>
        등록
      </Button>
    </form>
  );
}
