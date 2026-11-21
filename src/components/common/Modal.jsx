// 확인 모달 (삭제 전에 "정말 삭제할까요?" 묻기)
//
// Props
//  - isOpen: true일 때만 화면에 보인다. (조건부 렌더링)
//  - title, children: 모달 제목과 내용
//  - confirmText: 확인 버튼 글자 (기본 "삭제")
//  - onConfirm, onCancel: 버튼을 눌렀을 때 부모에게 알리는 함수
import { useEffect } from 'react';
import Button from './Button';
import styles from './Modal.module.css';

export default function Modal({ isOpen, title, children, confirmText = '삭제', onConfirm, onCancel }) {
  // 모달이 열려 있을 때 ESC 키를 누르면 닫는다.
  useEffect(() => {
    if (!isOpen) return;

    function handleKeyDown(event) {
      if (event.key === 'Escape') onCancel();
    }
    window.addEventListener('keydown', handleKeyDown);
    // 모달이 닫히거나 사라질 때 이벤트를 정리한다.
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onCancel]);

  if (!isOpen) return null;

  return (
    // 바깥 어두운 배경을 누르면 닫힌다.
    <div className={styles.backdrop} onClick={onCancel}>
      {/* 모달 안쪽을 누를 때는 닫히지 않도록 이벤트 전파를 막는다. */}
      <div className={styles.modal} role="dialog" aria-modal="true" onClick={(e) => e.stopPropagation()}>
        <h2 className={styles.title}>{title}</h2>
        <div className={styles.body}>{children}</div>
        <div className={styles.actions}>
          <Button variant="secondary" onClick={onCancel}>
            취소
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            {confirmText}
          </Button>
        </div>
      </div>
    </div>
  );
}
