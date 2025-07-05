// src/components/common/WhiteBox.js
// WhiteBox: 배경이 흰색이고 살짝 둥근 테두리와
// 그림자가 있는 박스 레이아웃을 재사용하기 위해 만든 컴포넌트

import styled from "styled-components";
// styled-components 라이브러리 import
// → CSS-in-JS 방식으로 컴포넌트 내부에 스타일을 작성할 수 있게 함

import palette from "../../lib/styles/palette";
// 프로젝트에서 정의한 색상 팔레트 불러오기
// → 테마 색상을 일관되게 적용

const WhiteBox = styled.div`
  .logo-area {
        display: block; // 블록 요소
        padding-bottom: 2rem; // 아래쪽 여백
        text-align: center; // 중앙 정렬
        font-weight: bold; // 글자 굵게
        letter-spacing: 2px; // 글자 사이 간격
        font-size: 1.5rem; // 로고 크기 증가
        color: ${palette.cyan[6]}; // 로고 색상 변경
  }
  box-sizing: border-box; // padding, border를 width 안에 포함
  background: rgba(255, 255, 255, 0.95); // 반투명 흰색 배경
  backdrop-filter: blur(10px); // 블러 효과
  padding: 2.5rem; // 내부 여백 증가
  border-radius: 20px; // 더 둥근 모서리
  width: 400px; // 가로폭 증가
  border: 1px solid rgba(255, 255, 255, 0.2); // 반투명 테두리
  box-shadow: 
    0 20px 40px rgba(0, 0, 0, 0.1),
    0 8px 16px rgba(0, 0, 0, 0.1),
    inset 0 1px 0 rgba(255, 255, 255, 0.2); // 다층 그림자와 내부 하이라이트
  position: relative; // 상대 위치
  z-index: 1; // z-index 설정
  
  /* 호버 효과 */
  transition: all 0.3s ease;
  &:hover {
    transform: translateY(-5px);
    box-shadow: 
      0 25px 50px rgba(0, 0, 0, 0.15),
      0 12px 24px rgba(0, 0, 0, 0.15),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
  }
`;
// styled.div → styled-components 문법
// WhiteBox 라는 이름의 재사용 가능한 스타일 컴포넌트를 정의

export default WhiteBox;
// 다른 파일에서 import 할 수 있도록 WhiteBox를 기본 export
