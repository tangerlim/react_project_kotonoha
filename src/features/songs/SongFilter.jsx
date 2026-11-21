// 플레이리스트 필터: 상태 탭(전체/듣는 중/완창/들어볼 곡) + 보기 범위(내 노래/전체 동아리원)
//
// Props
//  - status, onStatusChange: 현재 선택한 상태와 바꿀 때 부르는 함수
//  - scope, onScopeChange: 'mine' | 'all'
//  - showScope: 로그인했을 때만 "내 노래" 보기가 의미가 있으므로 true일 때만 범위 버튼을 보여준다.
//  - counts: { all, reading, done, wish } 상태별 노래 수
import { SONG_STATUS_LABEL } from '../../utils/format';
import styles from './SongFilter.module.css';

const statusTabs = [['all', '전체'], ...Object.entries(SONG_STATUS_LABEL)];

export default function SongFilter({ status, onStatusChange, scope, onScopeChange, showScope, counts }) {
  return (
    <div className={styles.filter}>
      <div className={styles.tabs}>
        {statusTabs.map(([key, label]) => (
          <button
            key={key}
            type="button"
            className={`${styles.tab} ${status === key ? styles.active : ''}`}
            onClick={() => onStatusChange(key)}
          >
            {label}
            <span className={styles.count}>{counts[key]}</span>
          </button>
        ))}
      </div>

      {showScope && (
        <div className={styles.scope}>
          <button
            type="button"
            className={scope === 'mine' ? styles.scopeActive : ''}
            onClick={() => onScopeChange('mine')}
          >
            내 노래
          </button>
          <button
            type="button"
            className={scope === 'all' ? styles.scopeActive : ''}
            onClick={() => onScopeChange('all')}
          >
            전체 동아리원
          </button>
        </div>
      )}
    </div>
  );
}
