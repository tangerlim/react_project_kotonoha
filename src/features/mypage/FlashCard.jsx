// 복습용 뒤집기 카드
// 앞면: 해석(한국어) → "원문이 떠오르나요?"  /  뒷면: 일본어 원문(히라가나) + 단어
//
// Props
//  - quote: 문장 데이터
//  - songTitle: 노래 제목
//  - flipped: true면 뒷면을 보여준다. (상태는 부모 ReviewPage가 가진다)
//  - onFlip(): 카드를 누르면 부모에게 알린다.
//
// 뒤집기 효과는 CSS의 transform: rotateY(180deg)로 만든다. (FlashCard.module.css 참고)
import RubyText from '../../components/common/RubyText';
import styles from './FlashCard.module.css';

export default function FlashCard({ quote, songTitle, flipped, onFlip }) {
  return (
    <button
      type="button"
      className={styles.scene}
      onClick={onFlip}
      aria-label={flipped ? '앞면 보기' : '뒷면(원문) 보기'}
    >
      <div className={`${styles.card} ${flipped ? styles.flipped : ''}`}>
        {/* 앞면 */}
        <div className={`${styles.face} ${styles.front}`}>
          <span className={styles.label}>해석</span>
          <p className={styles.translation}>{quote.translation}</p>
          <span className={styles.hint}>원문이 떠오르나요? 눌러서 확인 (Space)</span>
        </div>

        {/* 뒷면 */}
        <div className={`${styles.face} ${styles.back}`}>
          <span className={styles.label}>원문</span>
          <p className={styles.text}>
            <RubyText text={quote.text} />
          </p>
          {quote.words.length > 0 && (
            <ul className={styles.words}>
              {quote.words.map((item, index) => (
                <li key={index}>
                  <span className="ja">{item.word}</span> {item.meaning}
                </li>
              ))}
            </ul>
          )}
          <span className={`ja ${styles.source}`}>
            「{songTitle}」 {quote.location}
          </span>
        </div>
      </div>
    </button>
  );
}
