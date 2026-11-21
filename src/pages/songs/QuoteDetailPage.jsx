// 문장 상세 페이지 (/songs/:songId/quotes/:quoteId)
//
// - 원문(히라가나), 해석, 위치, 메모, 단어 표, 복습 기록을 보여준다.
// - 본인 문장이면 수정(같은 화면에서 폼으로 전환)과 삭제를 할 수 있다.
// - 단어장에서 단어를 누르고 오면 주소에 ?word=단어 가 붙어 있고, 그 단어 줄을 강조한다.
import { useState } from 'react';
import { Link, useNavigate, useOutletContext, useParams, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { deleteQuote, updateQuote } from '../../store/quotesSlice';
import QuoteForm from '../../features/quotes/QuoteForm';
import RubyText from '../../components/common/RubyText';
import Button from '../../components/common/Button';
import Modal from '../../components/common/Modal';
import EmptyState from '../../components/common/EmptyState';
import { formatDate } from '../../utils/format';
import styles from './QuoteDetailPage.module.css';

export default function QuoteDetailPage() {
  const { song, isOwner, showRuby } = useOutletContext();
  const { quoteId } = useParams();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const quote = useSelector((state) => state.quotes.items.find((item) => item.id === quoteId));
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);

  // 단어장에서 넘어온 단어 (없으면 null)
  const highlightWord = searchParams.get('word');

  // 주소의 노래와 문장의 노래가 다르면(잘못된 주소) 없는 문장으로 처리
  if (!quote || quote.songId !== song.id) {
    return (
      <EmptyState icon="無" title="문장을 찾을 수 없습니다.">
        <Button variant="secondary" to={`/songs/${song.id}`}>
          문장 목록으로
        </Button>
      </EmptyState>
    );
  }

  function handleUpdate(values) {
    dispatch(updateQuote({ id: quote.id, changes: values }));
    setIsEditing(false);
  }

  function handleDelete() {
    dispatch(deleteQuote(quote.id));
    navigate(`/songs/${song.id}`, { replace: true });
  }

  // 수정 모드: 기존 값을 채운 폼을 보여준다.
  if (isEditing) {
    return (
      <section>
        <h2 className="section-title">문장 수정</h2>
        <QuoteForm
          initialValues={quote}
          submitText="저장하기"
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      </section>
    );
  }

  const { known, unknown } = quote.review;

  return (
    <section>
      <Link to={`/songs/${song.id}`} className="text-link">
        ← 문장 목록
      </Link>

      <article className={styles.sheet}>
        <p className={styles.text}>
          <RubyText text={quote.text} showRuby={showRuby} />
        </p>
        <p className={styles.translation}>{quote.translation}</p>

        <dl className={styles.meta}>
          {quote.location && (
            <div>
              <dt>위치</dt>
              <dd>{quote.location}</dd>
            </div>
          )}
          <div>
            <dt>수집일</dt>
            <dd>{formatDate(quote.createdAt)}</dd>
          </div>
          <div>
            <dt>복습</dt>
            <dd>
              {known + unknown === 0 ? '아직 안 함' : `알아요 ${known} · 몰라요 ${unknown}`}
            </dd>
          </div>
        </dl>

        {quote.memo && <p className={styles.memo}>✎ {quote.memo}</p>}
      </article>

      <section className={styles.words}>
        <h3 className={styles.wordsTitle}>단어 {quote.words.length}</h3>
        {quote.words.length === 0 ? (
          <p className={styles.noWords}>저장한 단어가 없습니다.</p>
        ) : (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>단어</th>
                <th>읽기</th>
                <th>뜻</th>
              </tr>
            </thead>
            <tbody>
              {quote.words.map((item, index) => (
                <tr key={index} className={item.word === highlightWord ? styles.highlight : ''}>
                  <td className="ja">{item.word}</td>
                  <td className="ja">{item.reading || '-'}</td>
                  <td>{item.meaning}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      {isOwner && (
        <div className={styles.actions}>
          <Button variant="secondary" size="sm" onClick={() => setIsEditing(true)}>
            수정
          </Button>
          <Button variant="danger" size="sm" onClick={() => setIsDeleteOpen(true)}>
            삭제
          </Button>
        </div>
      )}

      <Modal
        isOpen={isDeleteOpen}
        title="문장을 삭제할까요?"
        onConfirm={handleDelete}
        onCancel={() => setIsDeleteOpen(false)}
      >
        삭제한 문장과 단어, 복습 기록은 되돌릴 수 없습니다.
      </Modal>
    </section>
  );
}
