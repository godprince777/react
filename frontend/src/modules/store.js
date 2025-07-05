import { configureStore } from "@reduxjs/toolkit";
// Redux Toolkit에서 제공하는 configureStore 함수 import
// → createStore를 대체하며, DevTools, thunk, etc를 기본 내장

import createSagaMiddleware from "redux-saga";
import rootReducer from "./index";
// 우리가 만든 rootReducer 불러오기

const sagaMiddleware = createSagaMiddleware();

const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }).concat(sagaMiddleware),
  // 루트 리듀서를 reducer 항목에 등록
  // saga 미들웨어 추가
});

export { sagaMiddleware };
export default store;
// store를 export 해서 Provider가 앱 최상단에서 사용할 수 있게 함
