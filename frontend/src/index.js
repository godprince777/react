import React from 'react'; 
// 리액트 기본 import → JSX 문법을 해석하기 위해 필요

import ReactDOM from 'react-dom/client'; 
// React 18 이상에서 권장되는 createRoot API를 쓰기 위해 react-dom/client 사용

import './index.css'; 
// 프로젝트의 전역 CSS 적용

import App from './App'; 
// 최상위 컴포넌트(App)를 import

import reportWebVitals from './reportWebVitals'; 
// 웹 성능 측정 함수 (옵션)
// 콘솔이나 분석툴에 성능 데이터를 전송 가능

import { BrowserRouter } from 'react-router-dom'; 
// SPA(싱글 페이지 앱)에서 라우팅을 구현하기 위해 BrowserRouter 컴포넌트 import

import { Provider } from "react-redux"; 
// Redux store를 리액트 컴포넌트에 연결해주는 Provider import

import store, { sagaMiddleware } from "./modules/store"; 
// Redux의 store와 sagaMiddleware 불러오기

import { rootSaga } from "./modules";
sagaMiddleware.run(rootSaga);

// DOM 에서 id="root"인 요소를 찾아서
// 거기에 리액트 앱을 붙일 수 있는 'root'를 생성
const root = ReactDOM.createRoot(document.getElementById('root'));

// React 앱을 렌더링
root.render(
  <Provider store={store}>
    {/* Redux Provider로 App을 감싸야 모든 컴포넌트가 store에 접근 가능 */}
    <BrowserRouter>
      {/* BrowserRouter로 감싸서 SPA 라우팅을 사용할 수 있게 함 */}
      <App />
      {/* 실제 우리 애플리케이션 컴포넌트 */}
    </BrowserRouter>
  </Provider>
);

// 웹 성능 측정을 위한 함수 호출
// 기본적으로 아무 것도 기록하지 않지만,
// reportWebVitals(console.log) 형태로 전달하면
// 콘솔에 성능 정보를 출력해볼 수 있음
reportWebVitals();
