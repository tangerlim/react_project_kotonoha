// 단어 목록 입력 (동적 입력 목록)
// 버튼으로 단어 줄을 추가·삭제할 수 있고, 각 줄에 단어 / 읽기 / 뜻을 입력한다.
//
// Props
//  - words: [{ word, reading, meaning }, ...] 현재 단어 배열
//  - onChange(newWords): 배열이 바뀌면 새 배열을 부모(QuoteForm)에게 넘긴다.
//
// 배열 상태를 직접 고치지 않고 map / filter로 "새 배열"을 만들어 넘기는 것이 React의 불변성 규칙이다.
import { useEffect, useRef } from 'react';
import Button from '../../components/common/Button';
import styles from './WordInputList.module.css';

export default function WordInputList({ words, onChange }) {
  // 단어 줄을 새로 추가했을 때 그 줄의 첫 칸에 포커스를 주기 위해 사용
  const listRef = useRef(null);
  const prevLength = useRef(words.length);

  useEffect(() => {
    // 줄 수가 늘어났을 때만 (= 추가 버튼을 눌렀을 때) 마지막 줄의 단어 칸에 포커스
    if (words.length > prevLength.current) {
      const inputs = listRef.current.querySelectorAll('input[name="word"]');
      inputs[inputs.length - 1]?.focus();
    }
    prevLength.current = words.length;
  }, [words.length]);

  function handleAdd() {
    onChange([...words, { word: '', reading: '', meaning: '' }]);
  }

  function handleRemove(targetIndex) {
    onChange(words.filter((_, index) => index !== targetIndex));
  }

  function handleChange(targetIndex, field, value) {
    onChange(words.map((item, index) => (index === targetIndex ? { ...item, [field]: value } : item)));
  }

  return (
    <div className={styles.wrapper} ref={listRef}>
      {words.length > 0 && (
        <div className={styles.headRow} aria-hidden="true">
          <span>단어</span>
          <span>읽기</span>
          <span>뜻</span>
          <span />
        </div>
      )}

      {/* 단어 줄은 순서가 바뀌지 않고 추가/삭제만 하므로 index를 key로 사용했다. */}
      {words.map((item, index) => (
        <div key={index} className={styles.row}>
          <input
            name="word"
            className="input ja"
            value={item.word}
            onChange={(e) => handleChange(index, 'word', e.target.value)}
            placeholder="単語"
            aria-label={`${index + 1}번째 단어`}
          />
          <input
            className="input ja"
            value={item.reading}
            onChange={(e) => handleChange(index, 'reading', e.target.value)}
            placeholder="たんご"
            aria-label={`${index + 1}번째 읽기`}
          />
          <input
            className="input"
            value={item.meaning}
            onChange={(e) => handleChange(index, 'meaning', e.target.value)}
            placeholder="뜻"
            aria-label={`${index + 1}번째 뜻`}
          />
          <button
            type="button"
            className={styles.remove}
            onClick={() => handleRemove(index)}
            aria-label={`${index + 1}번째 단어 삭제`}
          >
            ✕
          </button>
        </div>
      ))}

      <Button variant="secondary" size="sm" onClick={handleAdd}>
        + 단어 추가
      </Button>
    </div>
  );
}
