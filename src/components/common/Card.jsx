// 흰 종이 느낌의 카드 상자
// children으로 받은 내용을 카드 안에 그린다.
// hoverable이 true면 마우스를 올렸을 때 살짝 떠오르는 효과를 준다. (클릭할 수 있는 카드용)
import styles from './Card.module.css';

export default function Card({ children, hoverable = false, className = '' }) {
  return (
    <div className={`${styles.card} ${hoverable ? styles.hoverable : ''} ${className}`}>
      {children}
    </div>
  );
}
