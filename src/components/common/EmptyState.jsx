// 데이터가 없을 때 보여주는 안내 화면
//
// Props
//  - icon: 위에 크게 보여줄 글자 (기본: 栞 = 책갈피)
//  - title, description: 안내 문구
//  - children: 아래에 놓을 버튼 등 (선택)
import styles from './EmptyState.module.css';

export default function EmptyState({ icon = '栞', title, description, children }) {
  return (
    <div className={styles.empty}>
      <div className={styles.icon}>{icon}</div>
      <p className={styles.title}>{title}</p>
      {description && <p className={styles.description}>{description}</p>}
      {children && <div className={styles.action}>{children}</div>}
    </div>
  );
}
