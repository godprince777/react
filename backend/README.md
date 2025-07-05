# Blog Backend API Server

블로그 프론트엔드를 위한 백엔드 API 서버입니다.

## 설치 및 실행

### 1. 의존성 설치
```bash
npm install
```

### 2. 서버 실행
```bash
# 개발 모드 (nodemon 사용)
npm run dev

# 프로덕션 모드
npm start
```

서버는 `http://localhost:4000`에서 실행됩니다.

## API 엔드포인트

### 인증 관련 API

#### 1. 회원가입
- **URL**: `POST /api/auth/register`
- **Body**:
  ```json
  {
    "username": "사용자명",
    "password": "비밀번호"
  }
  ```
- **응답**:
  ```json
  {
    "message": "회원가입이 성공적으로 완료되었습니다.",
    "user": {
      "id": 1,
      "username": "사용자명",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "JWT_TOKEN"
  }
  ```

#### 2. 로그인
- **URL**: `POST /api/auth/login`
- **Body**:
  ```json
  {
    "username": "사용자명",
    "password": "비밀번호"
  }
  ```
- **응답**:
  ```json
  {
    "message": "로그인이 성공적으로 완료되었습니다.",
    "user": {
      "id": 1,
      "username": "사용자명",
      "createdAt": "2024-01-01T00:00:00.000Z"
    },
    "token": "JWT_TOKEN"
  }
  ```

#### 3. 인증 확인
- **URL**: `GET /api/auth/check`
- **Headers**: `Authorization: Bearer JWT_TOKEN`
- **응답**:
  ```json
  {
    "message": "인증이 성공적으로 확인되었습니다.",
    "user": {
      "id": 1,
      "username": "사용자명",
      "createdAt": "2024-01-01T00:00:00.000Z"
    }
  }
  ```

#### 4. 서버 상태 확인
- **URL**: `GET /api/health`
- **응답**:
  ```json
  {
    "message": "서버가 정상적으로 실행 중입니다.",
    "timestamp": "2024-01-01T00:00:00.000Z"
  }
  ```

## 주요 기능

- **JWT 인증**: 로그인 시 JWT 토큰 발급
- **비밀번호 해시화**: bcrypt를 사용한 안전한 비밀번호 저장
- **CORS 지원**: 프론트엔드와의 통신 허용
- **입력 검증**: 사용자 입력 데이터 검증
- **에러 처리**: 적절한 HTTP 상태 코드와 에러 메시지

## 주의사항

- 현재 메모리 기반으로 사용자 데이터를 저장합니다 (서버 재시작 시 데이터 손실)
- 실제 프로덕션에서는 데이터베이스 사용을 권장합니다
- JWT 시크릿 키는 환경변수로 관리하는 것을 권장합니다 