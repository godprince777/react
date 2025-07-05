const express = require('express');
const cors = require('cors');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');

const app = express();
const PORT = 4000;

// 미들웨어 설정
app.use(cors());
app.use(bodyParser.json());

// JWT 시크릿 키 (실제 프로덕션에서는 환경변수로 관리)
const JWT_SECRET = 'your-secret-key';

// 메모리 기반 사용자 저장소 (실제로는 데이터베이스 사용)
const users = [];

// JWT 토큰 검증 미들웨어
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: '액세스 토큰이 필요합니다.' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ message: '유효하지 않은 토큰입니다.' });
    }
    req.user = user;
    next();
  });
};

// 회원가입 API
app.post('/api/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 입력 검증
    if (!username || !password) {
      return res.status(400).json({ 
        message: '사용자명과 비밀번호를 모두 입력해주세요.' 
      });
    }

    // 사용자명 중복 확인
    const existingUser = users.find(user => user.username === username);
    if (existingUser) {
      return res.status(409).json({ 
        message: '이미 존재하는 사용자명입니다.' 
      });
    }

    // 비밀번호 해시화
    const hashedPassword = await bcrypt.hash(password, 10);

    // 새 사용자 생성
    const newUser = {
      id: users.length + 1,
      username,
      password: hashedPassword,
      createdAt: new Date()
    };

    users.push(newUser);

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: newUser.id, username: newUser.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 응답 (비밀번호 제외)
    const userResponse = {
      id: newUser.id,
      username: newUser.username,
      createdAt: newUser.createdAt
    };

    res.status(201).json({
      message: '회원가입이 성공적으로 완료되었습니다.',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('회원가입 에러:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 로그인 API
app.post('/api/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // 입력 검증
    if (!username || !password) {
      return res.status(400).json({ 
        message: '사용자명과 비밀번호를 모두 입력해주세요.' 
      });
    }

    // 사용자 찾기
    const user = users.find(u => u.username === username);
    if (!user) {
      return res.status(401).json({ 
        message: '사용자명 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // 비밀번호 확인
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ 
        message: '사용자명 또는 비밀번호가 올바르지 않습니다.' 
      });
    }

    // JWT 토큰 생성
    const token = jwt.sign(
      { id: user.id, username: user.username },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    // 응답 (비밀번호 제외)
    const userResponse = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    };

    res.json({
      message: '로그인이 성공적으로 완료되었습니다.',
      user: userResponse,
      token
    });

  } catch (error) {
    console.error('로그인 에러:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 로그인 상태 확인 API
app.get('/api/auth/check', authenticateToken, (req, res) => {
  try {
    const user = users.find(u => u.id === req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        message: '사용자를 찾을 수 없습니다.' 
      });
    }

    // 응답 (비밀번호 제외)
    const userResponse = {
      id: user.id,
      username: user.username,
      createdAt: user.createdAt
    };

    res.json({
      message: '인증이 성공적으로 확인되었습니다.',
      user: userResponse
    });

  } catch (error) {
    console.error('인증 확인 에러:', error);
    res.status(500).json({ 
      message: '서버 오류가 발생했습니다.' 
    });
  }
});

// 서버 상태 확인 API
app.get('/api/health', (req, res) => {
  res.json({ 
    message: '서버가 정상적으로 실행 중입니다.',
    timestamp: new Date().toISOString()
  });
});

// 서버 시작
app.listen(PORT, () => {
  console.log(`서버가 http://localhost:${PORT}에서 실행 중입니다.`);
  console.log(`API 엔드포인트:`);
  console.log(`- POST /api/auth/register - 회원가입`);
  console.log(`- POST /api/auth/login - 로그인`);
  console.log(`- GET /api/auth/check - 인증 확인`);
  console.log(`- GET /api/health - 서버 상태 확인`);
}); 