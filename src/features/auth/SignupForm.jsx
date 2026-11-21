// 회원가입 입력 폼
//
// Props
//  - onSubmit(values): 검증을 통과하면 입력값 객체를 부모(SignupPage)에게 넘긴다.
//  - existingUsernames: 이미 가입된 아이디 목록 (중복 검사용)
//
// 입력값 여러 개를 하나의 객체 상태(values)로 관리하고,
// 칸마다 에러 메시지를 errors 객체에 담아서 해당 칸 아래에 보여준다.
import { useState } from 'react';
import Button from '../../components/common/Button';
import styles from './AuthForm.module.css';

const JLPT_LEVELS = ['N5', 'N4', 'N3', 'N2', 'N1'];

const initialValues = {
  username: '',
  nickname: '',
  password: '',
  passwordConfirm: '',
  jlptLevel: 'N3',
};

// 입력값을 검사해서 { 칸이름: 에러문구 } 객체를 돌려준다. 문제가 없으면 빈 객체.
function validate(values, existingUsernames) {
  const errors = {};
  const username = values.username.trim();

  if (username === '') {
    errors.username = '아이디를 입력해 주세요.';
  } else if (!/^[a-zA-Z0-9]{3,12}$/.test(username)) {
    errors.username = '아이디는 영문과 숫자 3~12자로 입력해 주세요.';
  } else if (existingUsernames.includes(username)) {
    errors.username = '이미 사용 중인 아이디입니다.';
  }

  if (values.nickname.trim() === '') {
    errors.nickname = '닉네임을 입력해 주세요.';
  }

  if (values.password === '') {
    errors.password = '비밀번호를 입력해 주세요.';
  } else if (values.password.length < 4) {
    errors.password = '비밀번호는 4자 이상이어야 합니다.';
  }

  if (values.passwordConfirm !== values.password) {
    errors.passwordConfirm = '비밀번호가 일치하지 않습니다.';
  }

  return errors;
}

export default function SignupForm({ onSubmit, existingUsernames }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  // 모든 입력칸이 이 함수 하나를 같이 쓴다. input의 name으로 어떤 칸인지 구분한다.
  function handleChange(event) {
    const { name, value } = event.target;
    setValues({ ...values, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();
    const newErrors = validate(values, existingUsernames);
    setErrors(newErrors);

    // 에러가 하나도 없을 때만 부모에게 넘긴다.
    if (Object.keys(newErrors).length === 0) {
      onSubmit({
        username: values.username.trim(),
        nickname: values.nickname.trim(),
        password: values.password,
        jlptLevel: values.jlptLevel,
      });
    }
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit} noValidate>
      <div className="field">
        <label htmlFor="username">아이디</label>
        <input
          id="username"
          name="username"
          className={`input ${errors.username ? 'invalid' : ''}`}
          value={values.username}
          onChange={handleChange}
          placeholder="영문, 숫자 3~12자"
        />
        {errors.username && <span className="error">{errors.username}</span>}
      </div>

      <div className="field">
        <label htmlFor="nickname">닉네임</label>
        <input
          id="nickname"
          name="nickname"
          className={`input ${errors.nickname ? 'invalid' : ''}`}
          value={values.nickname}
          onChange={handleChange}
          placeholder="게시판과 피드에 보이는 이름"
        />
        {errors.nickname && <span className="error">{errors.nickname}</span>}
      </div>

      <div className="field">
        <label htmlFor="password">비밀번호</label>
        <input
          id="password"
          name="password"
          type="password"
          className={`input ${errors.password ? 'invalid' : ''}`}
          value={values.password}
          onChange={handleChange}
        />
        {errors.password && <span className="error">{errors.password}</span>}
      </div>

      <div className="field">
        <label htmlFor="passwordConfirm">비밀번호 확인</label>
        <input
          id="passwordConfirm"
          name="passwordConfirm"
          type="password"
          className={`input ${errors.passwordConfirm ? 'invalid' : ''}`}
          value={values.passwordConfirm}
          onChange={handleChange}
        />
        {errors.passwordConfirm && <span className="error">{errors.passwordConfirm}</span>}
      </div>

      <div className="field">
        <label>목표 JLPT 레벨</label>
        <div className={styles.levelGroup}>
          {JLPT_LEVELS.map((level) => (
            <label
              key={level}
              className={`${styles.levelOption} ${values.jlptLevel === level ? styles.levelSelected : ''}`}
            >
              <input
                type="radio"
                name="jlptLevel"
                value={level}
                checked={values.jlptLevel === level}
                onChange={handleChange}
              />
              {level}
            </label>
          ))}
        </div>
      </div>

      <Button type="submit" className={styles.submit}>
        가입하기
      </Button>
    </form>
  );
}
