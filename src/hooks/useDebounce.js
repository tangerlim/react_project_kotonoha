// 값이 바뀐 뒤 일정 시간(delay) 동안 더 바뀌지 않을 때만 새 값을 돌려주는 커스텀 Hook
//
// 검색창에 글자를 입력할 때마다 바로 검색하면 주소(URL)와 목록이 너무 자주 바뀐다.
// 입력이 잠깐 멈췄을 때(예: 300ms) 한 번만 검색하도록 하기 위해 사용한다.
import { useEffect, useState } from 'react';

export default function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    // delay 뒤에 값을 반영하는 타이머를 건다.
    const timer = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    // delay가 지나기 전에 value가 또 바뀌면 이전 타이머를 취소한다. (cleanup 함수)
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
