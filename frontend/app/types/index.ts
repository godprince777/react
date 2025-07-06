// API 응답 타입들
export interface ApiResponse<T = any> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

// 인증 관련 타입들
export interface LoginCredentials {
    username: string;
    password: string;
}

export interface RegisterData {
    username: string;
    email: string;
    password: string;
}

export interface AuthResponse {
    access_token: string;
    token_type: string;
    user: User;
}

// 사용자 타입
export interface User {
    id: number;
    username: string;
    email: string;
    is_active: boolean;
    created_at?: string | undefined;
    updated_at?: string | undefined;
}

// 포스트 관련 타입들
export interface Post {
    id: number;
    title: string;
    content: string;
    author_id: number;
    author?: User | undefined;
    created_at: string;
    updated_at: string;
}

export interface CreatePostData {
    title: string;
    content: string;
}

export interface UpdatePostData extends CreatePostData { }

// 폼 액션 응답 타입들
export interface ActionResponse {
    success: boolean;
    error?: string | undefined;
    message?: string | undefined;
    postId?: number | undefined;
    post?: Post | undefined;
    token?: string | undefined;
}

// 로더 응답 타입들
export interface LoaderResponse {
    posts?: Post[] | undefined;
    post?: Post | undefined;
    error?: string | undefined;
}

// 네비게이션 상태 타입
export type NavigationState = 'idle' | 'submitting' | 'loading';

// 에러 타입
export interface ApiError {
    response?: {
        data?: {
            detail?: string | undefined;
        } | undefined;
        status?: number | undefined;
    } | undefined;
    message?: string | undefined;
} 