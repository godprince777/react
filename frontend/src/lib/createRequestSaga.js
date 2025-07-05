// redux-saga의 call, put 이펙트 함수 가져오기
// call: 비동기 함수를 실행
// put: 액션을 디스패치
import { call, put } from "redux-saga/effects";

// 로딩 상태 관리 액션
// - startLoading: 로딩 시작
// - finishLoading: 로딩 종료
import { startLoading, finishLoading } from "../modules/loading";

// createRequestActionTypes:
// 요청 액션 타입을 한번에 3종류로 만들어주는 헬퍼
// 예: "FETCH_POST" → ["FETCH_POST", "FETCH_POST_SUCCESS", "FETCH_POST_FAILURE"]
export const createRequestActionTypes = (type) => {
    const SUCCESS = `${type}_SUCCESS`;  // 성공 시 액션 타입
    const FAILURE = `${type}_FAILURE`;  // 실패 시 액션 타입
    return [type, SUCCESS, FAILURE];
};

// createRequestSaga:
// API 호출 패턴을 표준화해주는 헬퍼 함수
// type: 요청 액션 타입 (ex. FETCH_POST)
// request: 실제로 API를 호출하는 함수
export default function createRequestSaga(type, request) {
    // 성공 시 디스패치할 액션 타입
    const SUCCESS = `${type}_SUCCESS`;
    // 실패 시 디스패치할 액션 타입
    const FAILURE = `${type}_FAILURE`;

    // 실제 saga(generator 함수)를 반환
    return function* (action) {
        // 1) 로딩 시작 액션
        yield put(startLoading(type));

        try {
            // 2) API 요청
            // call(함수, 인자) → yield call(api함수, action.payload)
            const response = yield call(request, action.payload);

            // 3) 요청 성공 시
            yield put({
                type: SUCCESS,           // ex) FETCH_POST_SUCCESS
                payload: response.data,  // API 응답 데이터를 payload로 전달
            });
        } catch (error) {
            // 4) 요청 실패 시
            yield put({
                type: FAILURE,  // ex) FETCH_POST_FAILURE
                payload: error, // 에러 객체
                error: true,    // redux 에러 표준
            });
        } finally {
            // 5) 로딩 종료 액션
            yield put(finishLoading(type));
        }
    }
}
