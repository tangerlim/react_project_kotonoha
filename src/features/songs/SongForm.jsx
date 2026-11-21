// 노래 등록/수정 폼
//
// Props
//  - initialValues: 처음 채워 둘 값 (수정할 때는 기존 노래 정보)
//  - submitText: 제출 버튼 글자
//  - onSubmit(values), onCancel()
//
// progress(0~100)는 가사를 얼마나 외웠는지(따라 부를 수 있는지)를 나타낸다.
import { useState } from 'react';
import Button from '../../components/common/Button';
import { SONG_STATUS_LABEL, SONG_GENRE_LABEL } from '../../utils/format';
import styles from './SongForm.module.css';

export const emptySong = {
  titleJa: '',
  titleKo: '',
  artist: '',
  genre: 'jpop',
  status: 'listening',
  progress: 0,
};

export default function SongForm({ initialValues = emptySong, submitText, onSubmit, onCancel }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    const next = { ...values, [name]: value };

    // 편의 기능: 상태를 "완창"으로 바꾸면 외운 정도를 100으로, "들어볼 곡"이면 0으로 맞춘다.
    if (name === 'status' && value === 'done') next.progress = 100;
    if (name === 'status' && value === 'wish') next.progress = 0;

    setValues(next);
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = {};
    const progress = Number(values.progress);

    if (values.titleJa.trim() === '') newErrors.titleJa = '일본어 제목을 입력해 주세요.';
    if (values.artist.trim() === '') newErrors.artist = '가수를 입력해 주세요.';
    if (Number.isNaN(progress) || progress < 0 || progress > 100) {
      newErrors.progress = '외운 정도는 0~100 사이 숫자로 입력해 주세요.';
    }
    setErrors(newErrors);

    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        titleJa: values.titleJa.trim(),
        titleKo: values.titleKo.trim(),
        artist: values.artist.trim(),
        genre: values.genre,
        status: values.status,
        progress,
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className={styles.grid}>
        <div className="field">
          <label htmlFor="titleJa">일본어 제목 *</label>
          <input
            id="titleJa"
            name="titleJa"
            className={`input ja ${errors.titleJa ? 'invalid' : ''}`}
            value={values.titleJa}
            onChange={handleChange}
            placeholder="例: 夜明けのメロディー"
          />
          {errors.titleJa && <span className="error">{errors.titleJa}</span>}
        </div>

        <div className="field">
          <label htmlFor="titleKo">한국어 제목</label>
          <input id="titleKo" name="titleKo" className="input" value={values.titleKo} onChange={handleChange} />
        </div>

        <div className="field">
          <label htmlFor="artist">가수 *</label>
          <input
            id="artist"
            name="artist"
            className={`input ${errors.artist ? 'invalid' : ''}`}
            value={values.artist}
            onChange={handleChange}
          />
          {errors.artist && <span className="error">{errors.artist}</span>}
        </div>

        <div className="field">
          <label htmlFor="genre">장르</label>
          <select id="genre" name="genre" className="input" value={values.genre} onChange={handleChange}>
            {Object.entries(SONG_GENRE_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="status">상태</label>
          <select id="status" name="status" className="input" value={values.status} onChange={handleChange}>
            {Object.entries(SONG_STATUS_LABEL).map(([key, label]) => (
              <option key={key} value={key}>
                {label}
              </option>
            ))}
          </select>
        </div>

        <div className="field">
          <label htmlFor="progress">가사 외운 정도 {values.progress}%</label>
          {/* 슬라이더와 숫자 입력이 같은 상태(values.progress)를 함께 바꾼다. */}
          <div className={styles.progressRow}>
            <input
              type="range"
              name="progress"
              min="0"
              max="100"
              step="5"
              value={values.progress}
              onChange={handleChange}
              className={styles.range}
              aria-label="가사 외운 정도 슬라이더"
            />
            <input
              id="progress"
              type="number"
              name="progress"
              min="0"
              max="100"
              className={`input ${styles.progressInput} ${errors.progress ? 'invalid' : ''}`}
              value={values.progress}
              onChange={handleChange}
            />
          </div>
          {errors.progress && <span className="error">{errors.progress}</span>}
        </div>
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
