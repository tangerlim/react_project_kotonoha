// 게시글 작성/수정 폼 (글쓰기와 수정 페이지가 함께 사용)
//
// Props
//  - initialValues: 처음 채워 둘 값 { category, title, content }
//  - categoryOptions: 선택할 수 있는 카테고리 목록 [['review', '감상'], ...]
//  - submitText: 제출 버튼 글자
//  - onSubmit(values), onCancel()
import { useEffect, useRef, useState } from 'react';
import Button from '../../components/common/Button';
import styles from './PostForm.module.css';

export default function PostForm({ initialValues, categoryOptions, submitText, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // 폼이 열리면 제목 입력칸에 포커스
  const titleRef = useRef(null);
  useEffect(() => {
    titleRef.current.focus();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = {};
    if (values.title.trim() === '') newErrors.title = '제목을 입력해 주세요.';
    if (values.content.trim() === '') newErrors.content = '내용을 입력해 주세요.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({ ...values, title: values.title.trim(), content: values.content.trim() });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="category">카테고리</label>
        <select id="category" name="category" className="input" value={values.category} onChange={handleChange}>
          {categoryOptions.map(([key, label]) => (
            <option key={key} value={key}>
              {label}
            </option>
          ))}
        </select>
      </div>

      <div className="field">
        <label htmlFor="title">제목</label>
        <input
          id="title"
          name="title"
          ref={titleRef}
          className={`input ${errors.title ? 'invalid' : ''}`}
          value={values.title}
          onChange={handleChange}
          maxLength={80}
        />
        {errors.title && <span className="error">{errors.title}</span>}
      </div>

      <div className="field">
        <label htmlFor="content">내용</label>
        <textarea
          id="content"
          name="content"
          rows={10}
          className={`input ${errors.content ? 'invalid' : ''}`}
          value={values.content}
          onChange={handleChange}
        />
        {errors.content && <span className="error">{errors.content}</span>}
      </div>

      <div className={styles.actions}>
        <Button variant="secondary" onClick={onCancel}>
          취소
        </Button>
        <Button type="submit">{submitText}</Button>
      </div>
    </form>
  );
}
