// 검색 입력창
//
// Props
//  - value, onChange: 입력값과 값이 바뀔 때 부르는 함수 (부모가 상태를 가진다 = 제어 컴포넌트)
//  - placeholder
//
// useRef: 지우기(✕) 버튼을 누르면 입력창에 다시 포커스를 주기 위해 input 요소를 기억한다.
import { useRef } from 'react';
import styles from './SearchBar.module.css';

export default function SearchBar({ value, onChange, placeholder = '검색' }) {
  const inputRef = useRef(null);

  function handleClear() {
    onChange('');
    inputRef.current.focus();
  }

  return (
    <div className={styles.searchBar}>
      <span className={styles.icon} aria-hidden="true">
        ⌕
      </span>
      <input
        ref={inputRef}
        type="search"
        className={styles.input}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
      {value && (
        <button type="button" className={styles.clear} onClick={handleClear} aria-label="검색어 지우기">
          ✕
        </button>
      )}
    </div>
  );
}
