// src/lib/api/user.js
// 실제로는 axios 등으로 API 요청을 해야 하지만, 임시로 Promise를 반환합니다.

export const check = () => {
  // 예시: 실제로는 서버에 요청
  return Promise.resolve({ data: { username: 'testuser', id: 1 } });
}; 