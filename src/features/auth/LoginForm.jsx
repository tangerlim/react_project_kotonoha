// 로그인 입력 폼
//
// Props
//  - onSubmit(username, password): 로그인 버튼을 누르면 부모(LoginPage)에게 입력값을 알린다.
//  - error: 부모가 확인한 결과 에러가 있으면 보여줄 문구
//  - demoAccounts: 데모 계정 목록. 누르면 입력칸을 자동으로 채운다.
//
// 이 컴포넌트는 Redux를 모른다. 입력과 화면만 담당하고, 실제 로그인 처리는 부모가 한다.
import { useEffect, useRef, useState } from 'react';
import Button from '../../components/common/Button';
import styles from './AuthForm.module.css';

export default function LoginForm({ onSubmit, error, demoAccounts = [] }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [emptyError, setEmptyError] = useState('');

  // 페이지에 들어오면 아이디 입력칸에 바로 커서가 가도록 한다. (useRef + useEffect)
  const usernameRef = useRef(null);
  useEffect(() => {
    usernameRef.current.focus();
  }, []);

  function handleSubmit(event) {
    event.preventDefault(); // 폼 제출 시 페이지가 새로고침되는 기본 동작을 막는다.

    if (username.trim() === '' || password === '') {
      setEmptyError('아이디와 비밀번호를 모두 입력해 주세요.');
      return;
    }
    setEmptyError('');
    onSubmit(username.trim(), password);
  }

  function fillDemo(account) {
    setUsername(account.username);
    setPassword(account.password);
  }

  const message = emptyError || error;

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="username">아이디</label>
        <input
          id="username"
          ref={usernameRef}
          className="input"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
        />
      </div>
      <div className="field">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          type="password"
          className="input"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
        />
      </div>

      {message && <p className={`error ${styles.formError}`}>{message}</p>}

      <Button type="submit" className={styles.submit}>
        로그인
      </Button>

      {demoAccounts.length > 0 && (
        <div className={styles.demo}>
          <p className={styles.demoTitle}>데모 계정 (누르면 자동 입력)</p>
          <ul className={styles.demoList}>
            {demoAccounts.map((account) => (
              <li key={account.username}>
                <button type="button" className={styles.demoButton} onClick={() => fillDemo(account)}>
                  <strong>{account.label}</strong>
                  <span>
                    {account.username} / {account.password}
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </form>
  );
}
