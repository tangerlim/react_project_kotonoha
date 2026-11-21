// 통계 숫자 카드
//
// Props
//  - label: 항목 이름 (예: "수집 문장")
//  - value: 크게 보여줄 숫자
//  - unit: 단위 (예: "개", "곡")
//  - sub: 아래에 작게 보여줄 설명 (선택)
import styles from './StatsCard.module.css';

export default function StatsCard({ label, value, unit, sub }) {
  return (
    <div className={styles.card}>
      <span className={styles.label}>{label}</span>
      <span className={styles.value}>
        {value}
        <small>{unit}</small>
      </span>
      {sub && <span className={styles.sub}>{sub}</span>}
    </div>
  );
}
