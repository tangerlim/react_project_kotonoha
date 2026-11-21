// 비율 막대 그래프 (차트 라이브러리 없이 CSS width로 만든다)
//
// Props
//  - title: 그래프 제목
//  - items: [{ label, count, color }, ...]
// 각 막대의 길이 = 전체 중 이 항목이 차지하는 비율(%)
import styles from './RatioBars.module.css';

export default function RatioBars({ title, items }) {
  const total = items.reduce((sum, item) => sum + item.count, 0);

  return (
    <div className={styles.box}>
      <h3 className={styles.title}>{title}</h3>
      <ul className={styles.list}>
        {items.map((item) => {
          // 전체가 0이면 0으로 나누지 않도록 0%로 처리
          const percent = total === 0 ? 0 : Math.round((item.count / total) * 100);
          return (
            <li key={item.label} className={styles.row}>
              <span className={styles.label}>{item.label}</span>
              <div className={styles.track}>
                <div className={styles.fill} style={{ width: `${percent}%`, background: item.color }} />
              </div>
              <span className={styles.value}>
                {item.count} <small>({percent}%)</small>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
