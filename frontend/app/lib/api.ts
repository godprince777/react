import axios, { AxiosResponse, AxiosError } from 'axios';
import type {
    Post,
    LoginCredentials,
    RegisterData,
    CreatePostData,
    UpdatePostData,
    AuthResponse
} from '~/types';

const API_BASE_URL = 'http://localhost:8000';

const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// 요청 인터셉터 - 토큰 추가
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 에러 처리
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// 인증 API
export const authAPI = {
    login: async (credentials: LoginCredentials): Promise<AuthResponse> => {
        const response: AxiosResponse<AuthResponse> = await api.post('/auth/login', credentials);
        return response.data;
    },

    register: async (data: RegisterData): Promise<{ message: string }> => {
        const response: AxiosResponse<{ message: string }> = await api.post('/auth/register', data);
        return response.data;
    },
};

// 포스트 API
export const postsAPI = {
    getAll: async (): Promise<Post[]> => {
        const response: AxiosResponse<Post[]> = await api.get('/posts');
        return response.data;
    },

    getById: async (id: number): Promise<Post> => {
        const response: AxiosResponse<Post> = await api.get(`/posts/${id}`);
        return response.data;
    },

    create: async (data: CreatePostData): Promise<Post> => {
        const response: AxiosResponse<Post> = await api.post('/posts', data);
        return response.data;
    },

    update: async (id: number, data: UpdatePostData): Promise<Post> => {
        const response: AxiosResponse<Post> = await api.put(`/posts/${id}`, data);
        return response.data;
    },

    delete: async (id: number): Promise<void> => {
        await api.delete(`/posts/${id}`);
    },
};

export default api; 