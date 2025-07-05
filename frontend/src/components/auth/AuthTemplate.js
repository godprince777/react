import styled from "styled-components";
// styled-components 라이브러리 import
// → CSS-in-JS 스타일을 작성할 수 있게 함

import WhiteBox from "../common/WhiteBox";
// 재사용 가능한 흰색 박스 UI 컴포넌트 import

import { Link } from 'react-router-dom';
// SPA 라우팅을 위한 Link 컴포넌트 import

import palette from "../../lib/styles/palette";
// 색상 팔레트 → 프로젝트 전반의 색상 일관성을 유지

const AuthTemplateBlock = styled.div`
    position: absolute; /* 화면을 꽉 채우도록 고정 배치 */
    left: 0; /* 왼쪽 끝부터 */
    top: 0;  /* 위쪽 끝부터 */
    bottom: 0; /* 아래쪽 끝까지 */
    right: 0;  /* 오른쪽 끝까지 */
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); /* 아름다운 그라데이션 배경 */
    display: flex; /* flex 레이아웃 사용 */
    flex-direction: column; /* 세로로 쌓는 방향 */
    justify-content: center; /* 세로축 가운데 정렬 */
    align-items: center; /* 가로축 가운데 정렬 */
    
    /* 배경에 미묘한 패턴 추가 */
    &::before {
        content: '';
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-image: 
            radial-gradient(circle at 25% 25%, rgba(255,255,255,0.1) 0%, transparent 50%),
            radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 0%, transparent 50%);
        pointer-events: none;
    }
`;
// → 즉, 화면 전체를 중앙 정렬된 flex 컨테이너로 구성

const AuthTemplate = ({ children }) => {
    // AuthTemplate 컴포넌트
    // children → 내부에 들어올 컴포넌트나 JSX를 props로 받음

    return (
        <AuthTemplateBlock>
            {/* WhiteBox 안에 로고영역 + children을 감싸도록 배치 */}
            <WhiteBox>
                <div className="logo-area">
                    <Link to="/">REACTERS</Link>
                    {/* 메인 페이지로 이동할 수 있는 로고 링크 */}
                </div>
                {children}
                {/* 로그인/회원가입 폼 등 자식 컴포넌트를 렌더링 */}
            </WhiteBox>
        </AuthTemplateBlock>
    );
};
// → AuthTemplateBlock 안에 WhiteBox를 두고
//    그 안에 children과 로고를 표시하는 구조

export default AuthTemplate;
// 다른 곳에서 AuthTemplate를 import 해서 재사용할 수 있도록 export
