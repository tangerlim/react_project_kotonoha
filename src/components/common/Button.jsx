// 앱 전체에서 같은 모양으로 쓰는 버튼
//
// Props
//  - variant: 'primary'(남색) | 'secondary'(테두리) | 'danger'(삭제) | 'ghost'(배경 없음)
//  - size: 'md' | 'sm'
//  - to: 값이 있으면 <button> 대신 react-router의 <Link>로 그린다. (페이지 이동용 버튼)
//  - children: 버튼 안에 들어갈 글자
//  - 나머지 props(onClick, type, disabled 등)는 그대로 전달한다.
import { Link } from 'react-router-dom';
import styles from './Button.module.css';

export default function Button({
  variant = 'primary',
  size = 'md',
  to,
  className = '',
  children,
  ...rest
}) {
  const classNames = `${styles.button} ${styles[variant]} ${styles[size]} ${className}`;

  if (to) {
    return (
      <Link to={to} className={classNames} {...rest}>
        {children}
      </Link>
    );
  }

  return (
    <button type="button" className={classNames} {...rest}>
      {children}
    </button>
  );
}
