import client from "./client";

//로그인
export const login = ({ username, password }) => {
    return client.post('/api/auth/login', { username, password });
};

//회원가입
export const register = ({ username, password }) => {
    return client.post('/api/auth/register', { username, password });
};

//로그인 상태확인
export const check = () => {
    return client.get('/api/auth/check');
};