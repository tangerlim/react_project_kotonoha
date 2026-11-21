// 단어장 표
//
// Props
//  - rows: [{ key, word, reading, meaning, songTitle, quoteLink }, ...]
//  - onRowClick(row): 줄을 누르면 부모에게 알린다. (부모가 그 단어가 나온 문장으로 이동시킨다)
import styles from './VocabTable.module.css';

export default function VocabTable({ rows, onRowClick }) {
  return (
    <div className={styles.wrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>단어</th>
            <th>읽기</th>
            <th>뜻</th>
            <th className={styles.sourceHead}>나온 노래</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.key} onClick={() => onRowClick(row)} className={styles.row} title="이 단어가 나온 문장 보기">
              <td className={`ja ${styles.word}`}>{row.word}</td>
              <td className="ja">{row.reading || '-'}</td>
              <td>{row.meaning}</td>
              <td className={`ja ${styles.source}`}>{row.songTitle}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
