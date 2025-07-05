// redux-actions 라이브러리에서 createAction(액션 생성자), handleActions(리듀서 생성 도우미) 불러옴
import { createAction, handleActions } from "redux-actions";

// immer: 불변성을 편리하게 유지해주는 라이브러리
import { produce } from "immer";

// redux-saga 이펙트 함수
import { takeLatest } from "redux-saga/effects";

// auth 관련 API 함수들
import * as authAPI from "../lib/api/auth";

// 요청 액션 타입/사가 헬퍼
import { createRequestActionTypes } from "../lib/createRequestSaga";
import createRequestSaga from "../lib/createRequestSaga";

// 액션 타입 정의
const CHANGE_FIELD = "auth/CHANGE_FIELD";         // 폼 필드 값 변경
const INITIALIZE_FORM = "auth/INITIALIZE_FORM";   // 폼 초기화

// 회원가입(register) 관련 액션 3종
// ex) REGISTER / REGISTER_SUCCESS / REGISTER_FAILURE
const [REGISTER, REGISTER_SUCCESS, REGISTER_FAILURE] = createRequestActionTypes("REGISTER");

// 로그인(login) 관련 액션 3종
const [LOGIN, LOGIN_SUCCESS, LOGIN_FAILURE] = createRequestActionTypes("LOGIN");

// 로그인 상태 검증(CHECK) 관련 액션 3종
const [CHECK, CHECK_SUCCESS, CHECK_FAILURE] = createRequestActionTypes("CHECK");

// changeField 액션 생성자
// form: register or login
// key: username, password 등
// value: 실제 변경 값
export const changeField = createAction(
    CHANGE_FIELD,
    (form, key, value) => ({
        form,
        key,
        value,
    })
);

// initializeForm 액션 생성자
// 어떤 폼(register/login)을 초기화할지 전달
export const initializeForm = createAction(INITIALIZE_FORM, (form) => form);

// 회원가입 요청 액션
export const register = createAction(
    REGISTER,
    ({ username, password }) => ({ username, password })
);

// 로그인 요청 액션
export const login = createAction(
    LOGIN,
    ({ username, password }) => ({ username, password })
);

// 로그인 유지(체크) 요청 액션
export const check = createAction(CHECK);

// registerSaga: 회원가입 API 요청을 처리
export const registerSaga = createRequestSaga(REGISTER, authAPI.register);

// loginSaga: 로그인 API 요청을 처리
export const loginSaga = createRequestSaga(LOGIN, authAPI.login);

// checkSaga: 로그인 상태 검증 API 요청을 처리
export const checkSaga = createRequestSaga(CHECK, authAPI.check);

// authSaga: auth 관련 saga 총괄 등록
// takeLatest → 같은 요청 여러 번 들어와도 마지막 것만 처리
export function* authSaga() {
    yield takeLatest(REGISTER, registerSaga);
    yield takeLatest(LOGIN, loginSaga);
    yield takeLatest(CHECK, checkSaga);
}

// 초기 상태 정의
const initialState = {
    register: {
        username: '',
        password: '',
        passwordConfirm: '',
    },
    login: {
        username: '',
        password: '',
    },
    auth: null,       // 로그인/회원가입 성공 시 사용자 정보
    authError: null,  // 로그인/회원가입 실패 시 에러 정보
};

// 리듀서 정의
const auth = handleActions(
    {
        // CHANGE_FIELD
        // 폼 입력 필드의 값 변경
        [CHANGE_FIELD]: (state, { payload: { form, key, value } }) =>
            produce(state, draft => {
                draft[form][key] = value;
            }),

        // INITIALIZE_FORM
        // 폼 상태 초기화
        [INITIALIZE_FORM]: (state, { payload: form }) => ({
            ...state,
            [form]: initialState[form],
            authError: null,  // 에러도 같이 초기화
        }),

        // 회원가입 성공
        [REGISTER_SUCCESS]: (state, { payload: auth }) => ({
            ...state,
            authError: null,
            auth,
        }),
        // 회원가입 실패
        [REGISTER_FAILURE]: (state, { payload: error }) => ({
            ...state,
            authError: {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                data: error.response?.data,
            },
            auth: null,
        }),

        // 로그인 성공
        [LOGIN_SUCCESS]: (state, { payload: auth }) => ({
            ...state,
            authError: null,
            auth,
        }),
        // 로그인 실패
        [LOGIN_FAILURE]: (state, { payload: error }) => ({
            ...state,
            authError: {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                data: error.response?.data,
            },
        }),

        // check (로그인 유지) 성공
        [CHECK_SUCCESS]: (state, { payload: auth }) => ({
            ...state,
            authError: null,
            auth,
        }),
        // check 실패
        [CHECK_FAILURE]: (state, { payload: error }) => ({
            ...state,
            authError: {
                message: error.message,
                code: error.code,
                status: error.response?.status,
                data: error.response?.data,
            },
        }),
    },
    initialState
);

// 이 auth 리듀서를 모듈에서 기본 export
export default auth;
