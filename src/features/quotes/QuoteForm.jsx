// 문장 추가/수정 폼
//
// Props
//  - initialValues: 처음 채워 둘 값 (수정할 때는 기존 문장)
//  - submitText: 제출 버튼 글자
//  - onSubmit(values), onCancel()
//
// 원문을 입력하는 동안 아래에 히라가나 미리보기(RubyText)를 바로 보여준다.
import { useState } from 'react';
import Button from '../../components/common/Button';
import RubyText from '../../components/common/RubyText';
import WordInputList from './WordInputList';
import styles from './QuoteForm.module.css';

export const emptyQuote = {
  text: '',
  translation: '',
  location: '',
  memo: '',
  words: [],
};

export default function QuoteForm({ initialValues = emptyQuote, submitText, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  // 단어 목록은 WordInputList가 새 배열을 만들어 넘겨준다.
  function handleWordsChange(newWords) {
    setValues({ ...values, words: newWords });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = {};
    if (values.text.trim() === '') newErrors.text = '원문을 입력해 주세요.';
    if (values.translation.trim() === '') newErrors.translation = '해석을 입력해 주세요.';
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        text: values.text.trim(),
        translation: values.translation.trim(),
        location: values.location.trim(),
        memo: values.memo.trim(),
        // 단어 칸이 비어 있는 줄은 저장하지 않는다.
        words: values.words
          .filter((item) => item.word.trim() !== '')
          .map((item) => ({
            word: item.word.trim(),
            reading: item.reading.trim(),
            meaning: item.meaning.trim(),
          })),
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="text">원문 *</label>
        <textarea
          id="text"
          name="text"
          rows={3}
          className={`input ja ${styles.textInput} ${errors.text ? 'invalid' : ''}`}
          value={values.text}
          onChange={handleChange}
          placeholder="{夜空|よぞら}を{見上|みあ}げた。"
        />
        <span className="hint">
          한자 뒤에 읽는 법을 붙이려면 <code>{'{漢字|かんじ}'}</code> 형식으로 입력하세요.
        </span>
        {errors.text && <span className="error">{errors.text}</span>}

        {/* 입력한 원문을 실시간으로 미리 보여준다. */}
        {values.text && (
          <div className={styles.preview}>
            <span className={styles.previewLabel}>미리보기</span>
            <RubyText text={values.text} />
          </div>
        )}
      </div>

      <div className="field">
        <label htmlFor="translation">해석 *</label>
        <textarea
          id="translation"
          name="translation"
          rows={2}
          className={`input ${errors.translation ? 'invalid' : ''}`}
          value={values.translation}
          onChange={handleChange}
        />
        {errors.translation && <span className="error">{errors.translation}</span>}
      </div>

      <div className={styles.row}>
        <div className="field">
          <label htmlFor="location">위치</label>
          <input
            id="location"
            name="location"
            className="input"
            value={values.location}
            onChange={handleChange}
            placeholder="예: 1절, 후렴"
          />
        </div>
        <div className="field">
          <label htmlFor="memo">메모</label>
          <input
            id="memo"
            name="memo"
            className="input"
            value={values.memo}
            onChange={handleChange}
            placeholder="문법 포인트, 느낀 점 등"
          />
        </div>
      </div>

      <div className="field">
        <label>단어</label>
        <WordInputList words={values.words} onChange={handleWordsChange} />
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
