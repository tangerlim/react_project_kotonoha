// 404 페이지: 정의되지 않은 주소로 들어왔을 때 보여준다.
import Button from '../components/common/Button';
import styles from './NotFoundPage.module.css';

export default function NotFoundPage() {
  return (
    <div className={styles.page}>
      <p className={`ja ${styles.code}`}>迷子</p>
      <h1 className={styles.title}>페이지를 찾을 수 없습니다 (404)</h1>
      <p className={styles.desc}>
        <span className="ja">{'まいご'}</span>가 되어 버렸네요. 주소를 다시 확인해 주세요.
      </p>
      <Button to="/">홈으로 돌아가기</Button>
    </div>
  );
}
