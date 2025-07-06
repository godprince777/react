# Blog App - Remix + FastAPI

모던한 블로그 플랫폼으로, Remix 프론트엔드와 FastAPI 백엔드로 구축되었습니다.

## 기술 스택

### 프론트엔드
- **Remix** - 풀스택 React 프레임워크
- **TypeScript** - 타입 안전성
- **Tailwind CSS** - 스타일링
- **Axios** - HTTP 클라이언트

### 백엔드
- **FastAPI** - 고성능 Python 웹 프레임워크
- **Pydantic** - 데이터 검증
- **JWT** - 인증
- **SQLAlchemy** - ORM (향후 데이터베이스 연동 시)

## 기능

- ✅ 사용자 인증 (회원가입/로그인)
- ✅ JWT 토큰 기반 인증
- ✅ 블로그 포스트 CRUD
- ✅ 반응형 디자인
- ✅ 서버 사이드 렌더링

## 시작하기

### 개발 환경 설정

1. **저장소 클론**
   ```bash
   git clone <repository-url>
   cd blog-app
   ```

2. **Docker Compose로 실행**
   ```bash
   docker-compose up --build
   ```

3. **개별 실행 (선택사항)**

   **백엔드 (FastAPI)**
   ```bash
   cd backend
   pip install -r requirements.txt
   uvicorn main:app --reload --host 0.0.0.0 --port 8000
   ```

   **프론트엔드 (Remix)**
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

### 접속 URL

- **프론트엔드**: http://localhost:3000
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## API 엔드포인트

### 인증
- `POST /auth/register` - 회원가입
- `POST /auth/login` - 로그인

### 포스트
- `GET /posts` - 포스트 목록
- `GET /posts/{id}` - 포스트 상세
- `POST /posts` - 포스트 작성 (인증 필요)
- `PUT /posts/{id}` - 포스트 수정 (인증 필요)
- `DELETE /posts/{id}` - 포스트 삭제 (인증 필요)

## 프로젝트 구조

```
├── frontend/                 # Remix 프론트엔드
│   ├── app/
│   │   ├── routes/          # 페이지 라우트
│   │   ├── lib/             # 유틸리티 및 API 클라이언트
│   │   └── root.tsx         # 루트 레이아웃
│   ├── package.json
│   └── Dockerfile
├── backend/                  # FastAPI 백엔드
│   ├── main.py              # 메인 애플리케이션
│   ├── requirements.txt     # Python 의존성
│   └── Dockerfile
└── docker-compose.yml       # Docker Compose 설정
```

## 개발 가이드

### 새로운 페이지 추가
1. `frontend/app/routes/` 디렉토리에 새 파일 생성
2. Remix의 파일 기반 라우팅 규칙에 따라 파일명 설정
3. `loader` 함수로 서버 사이드 데이터 로딩
4. `action` 함수로 폼 처리

### 새로운 API 엔드포인트 추가
1. `backend/main.py`에 새 라우트 추가
2. Pydantic 모델로 요청/응답 스키마 정의
3. 필요한 경우 인증 미들웨어 적용

## 배포

### 프로덕션 환경
1. 환경 변수 설정 (SECRET_KEY 등)
2. 데이터베이스 연결 설정
3. 정적 파일 서빙 설정
4. HTTPS 설정

### Docker 배포
```bash
docker-compose -f docker-compose.prod.yml up -d
```

## 라이선스

MIT License

## 기여하기

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request 