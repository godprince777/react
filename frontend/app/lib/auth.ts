/**
 * 인증 관련 유틸리티 함수들
 */

export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
};

export const getToken = (): string | null => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('token');
};

export const setToken = (token: string): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem('token', token);
};

export const removeToken = (): void => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem('token');
};

export const logout = (): void => {
    removeToken();
    window.location.href = '/login';
};

/**
 * 토큰 유효성 검사 (기본적인 형식 검사)
 */
export const isValidToken = (token: string): boolean => {
    if (!token || typeof token !== 'string') return false;

    // JWT 토큰은 3개의 파트로 구성되어야 함 (header.payload.signature)
    const parts = token.split('.');
    return parts.length === 3;
};

/**
 * 토큰 만료 시간 확인 (JWT 토큰의 경우)
 */
export const isTokenExpired = (token: string): boolean => {
    try {
        const parts = token.split('.');
        if (parts.length !== 3) return true;

        const payloadPart = parts[1];
        if (!payloadPart) return true;

        const payload = JSON.parse(atob(payloadPart));
        const currentTime = Math.floor(Date.now() / 1000);
        return payload.exp < currentTime;
    } catch {
        return true; // 파싱 실패 시 만료된 것으로 간주
    }
}; 