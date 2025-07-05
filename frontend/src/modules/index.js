import { combineReducers } from "redux"; 
// 여러 개의 리듀서를 하나로 합치는 Redux 함수

import { all } from "redux-saga/effects";
import auth, { authSaga } from "./auth";
// auth 리듀서와 authSaga 불러오기

import loading from "./loading";
import user, { userSaga } from "./user";

// 루트 리듀서 정의
const rootReducer = combineReducers({
    auth, 
    loading,
    user,
    // auth라는 이름의 state 영역을 auth 리듀서가 담당
    // → store.auth 로 접근 가능
});

export function* rootSaga() {
    yield all([authSaga(), userSaga()]);
}

export default rootReducer; 
// 루트 리듀서를 기본으로 export
// configureStore/createStore 등에 등록해서 쓴다