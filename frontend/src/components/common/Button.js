import styled, { css } from "styled-components"; 
// styled-components 불러오기 → CSS-in-JS 스타일 작성 가능
// css 헬퍼 → 조건부 스타일에 활용

import palette from "../../lib/styles/palette"; 
// 프로젝트 공통 색상 모음

// 실제 버튼 스타일 정의
const StyledButton = styled.button`
    border: none;                 // 테두리 제거
    border-radius: 4px;           // 모서리 둥글게
    font-size: 1rem;              // 기본 글자 크기
    font-weight: bold;            // 글자 두껍게
    padding: 0.25rem 1rem;        // 상하 0.25rem, 좌우 1rem
    color: white;                 // 글자색 흰색
    outline: none;                // 포커스 시 외곽선 제거
    cursor: pointer;              // 마우스 손가락 모양
    background: ${palette.gray[8]}; // 기본 배경색
    &:hover {
        background: ${palette.gray[6]}; // hover 시 조금 밝게
    }

    // $fullWidth prop이 true일 때 스타일
    ${props =>
        props.$fullWidth &&
        css`
            padding-top: 0.75rem;
            padding-bottom: 0.75rem;
            width: 100%;
            font-size: 1.125rem;
        `}

    // $cyan prop이 true일 때 스타일
    ${props =>
        props.$cyan &&
        css`
            background: ${palette.cyan[5]};
            &:hover {
                background: ${palette.cyan[4]};
            }
        `}
`;

// 실제 Button 컴포넌트
// children: 버튼 안에 들어갈 내용
// cyan, fullWidth: 스타일링용 transient props
// ...rest: onClick, type 등 일반 props
const Button = ({ children, cyan, fullWidth, ...rest }) => {
    return (
        <StyledButton
            $cyan={cyan}                 // transient prop → DOM에 전달되지 않음
            $fullWidth={fullWidth}       // transient prop
            {...rest}
        >
            {children}
        </StyledButton>
    );
};

export default Button; 
// 다른 컴포넌트에서 import 해서 사용 가능
