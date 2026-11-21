// 앱의 시작점
// Provider: 모든 컴포넌트가 Redux store를 쓸 수 있게 감싼다.
// BrowserRouter: 주소(URL)에 따라 화면을 바꾸는 라우터를 켠다.
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { store } from './store';
import App from './App';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </StrictMode>,
);
