// 플레이리스트 목록에 보이는 노래 카드
//
// Props
//  - song: 노래 데이터
//  - quoteCount: 이 노래에서 수집한 문장 수
//  - ownerName: 노래를 등록한 동아리원 닉네임
import { Link } from 'react-router-dom';
import Card from '../../components/common/Card';
import { SONG_STATUS_LABEL, SONG_GENRE_LABEL } from '../../utils/format';
import styles from './SongCard.module.css';

export default function SongCard({ song, quoteCount, ownerName }) {
  return (
    <Link to={`/songs/${song.id}`} className={styles.link}>
      <Card hoverable className={styles.card}>
        {/* 왼쪽 색 띠: 장르마다 색이 다르다. */}
        <div className={`${styles.spine} ${styles[song.genre]}`} />

        <div className={styles.badges}>
          <span className="badge muted">{SONG_GENRE_LABEL[song.genre]}</span>
          <span className={`badge ${song.status === 'done' ? 'done' : ''}`}>{SONG_STATUS_LABEL[song.status]}</span>
        </div>

        <h3 className={`ja ${styles.titleJa}`}>{song.titleJa}</h3>
        {song.titleKo && <p className={styles.titleKo}>{song.titleKo}</p>}
        <p className={styles.artist}>{song.artist}</p>

        <div className={styles.progress}>
          <div className={styles.progressBar}>
            <div className={styles.progressFill} style={{ width: `${song.progress}%` }} />
          </div>
          <span>{song.progress}%</span>
        </div>

        <div className={styles.footer}>
          <span>문장 {quoteCount}개</span>
          <span>{ownerName}의 플레이리스트</span>
        </div>
      </Card>
    </Link>
  );
}
