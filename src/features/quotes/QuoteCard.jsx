// 수집한 문장 카드 (노래 상세의 문장 목록, 홈 피드에서 사용)
//
// Props
//  - quote: 문장 데이터
//  - showRuby: 히라가나 표시 여부
//  - to: 카드를 누르면 이동할 주소
//  - subtitle: 카드 아래에 보여줄 추가 정보 (예: "미나 · 별이 내리는 도서관의 사서") — 선택
import { Link } from 'react-router-dom';
import RubyText from '../../components/common/RubyText';
import Card from '../../components/common/Card';
import styles from './QuoteCard.module.css';

export default function QuoteCard({ quote, showRuby = true, to, subtitle }) {
  return (
    <Link to={to} className={styles.link}>
      <Card hoverable className={styles.card}>
        <p className={styles.text}>
          <RubyText text={quote.text} showRuby={showRuby} />
        </p>
        <p className={styles.translation}>{quote.translation}</p>

        <div className={styles.footer}>
          {quote.location && <span className={styles.location}>{quote.location}</span>}
          {quote.words.length > 0 && <span className="badge muted">단어 {quote.words.length}</span>}
          {quote.review.lastResult === 'unknown' && <span className="badge notice">복습 필요</span>}
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      </Card>
    </Link>
  );
}
