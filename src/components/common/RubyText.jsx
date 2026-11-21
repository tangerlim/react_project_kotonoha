// 히라가나 표시 컴포넌트
//
// 원문에 {漢字|かんじ} 형식으로 쓰면, HTML <ruby> 태그로 바꿔서 한자 위에 읽는 법을 작게 보여준다.
//   입력: "{夜空|よぞら}を見る"
//   출력: <ruby>夜空<rt>よぞら</rt></ruby>を見る
//
// Props
//  - text: 원문 문자열
//  - showRuby: false면 읽는 법을 숨기고 한자만 보여준다.
import { Fragment } from 'react';

// { 와 | 사이 = 한자, | 와 } 사이 = 읽는 법
const RUBY_PATTERN = /\{([^|{}]+)\|([^|{}]+)\}/g;

// 문자열을 [일반 글자, 히라가나 조각, 일반 글자, ...] 배열로 나눈다.
function parseRuby(text) {
  const parts = [];
  let lastIndex = 0;

  for (const match of text.matchAll(RUBY_PATTERN)) {
    // 이번 {…} 앞까지의 일반 글자
    if (match.index > lastIndex) {
      parts.push({ type: 'text', value: text.slice(lastIndex, match.index) });
    }
    parts.push({ type: 'ruby', base: match[1], reading: match[2] });
    lastIndex = match.index + match[0].length;
  }

  // 마지막 {…} 뒤에 남은 글자
  if (lastIndex < text.length) {
    parts.push({ type: 'text', value: text.slice(lastIndex) });
  }
  return parts;
}

export default function RubyText({ text, showRuby = true }) {
  const parts = parseRuby(text);

  return (
    <span className="ja">
      {parts.map((part, index) => {
        if (part.type === 'text') {
          return <Fragment key={index}>{part.value}</Fragment>;
        }
        if (!showRuby) {
          return <Fragment key={index}>{part.base}</Fragment>;
        }
        return (
          <ruby key={index}>
            {part.base}
            <rt>{part.reading}</rt>
          </ruby>
        );
      })}
    </span>
  );
}
