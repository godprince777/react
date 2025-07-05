// redux-actions 라이브러리에서 createAction과 handleActions 가져옴
import { createAction, handleActions } from "redux-actions";

// 액션 타입 정의
const START_LOADING = "loading/START_LOADING";    // 로딩 시작
const FINISH_LOADING = "loading/FINISH_LOADING";  // 로딩 종료

// 액션 생성자
// payload로 requestType(예: 'LOGIN', 'FETCH_POSTS' 같은 요청 이름)을 넘긴다
export const startLoading = createAction(
  START_LOADING, 
  requestType => requestType
);

export const finishLoading = createAction(
  FINISH_LOADING, 
  requestType => requestType
);

// 초기 상태
// 비어있는 객체이지만, 동적으로
// { LOGIN: true, FETCH_POSTS: false } 처럼 키가 추가된다
const initialState = {};

// 리듀서 정의
// handleActions를 사용하면 switch문 없이도 액션별로 처리 가능
const loading = handleActions(
    {
        // START_LOADING 액션이 들어오면
        // 해당 requestType을 키로 true 설정
        [START_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: true,
        }),
        // FINISH_LOADING 액션이 들어오면
        // 해당 requestType을 키로 false 설정
        [FINISH_LOADING]: (state, action) => ({
            ...state,
            [action.payload]: false,
        }),
    },
    initialState
);

// 이 리듀서를 디폴트 export
export default loading;
