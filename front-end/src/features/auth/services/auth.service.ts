import api from '../../../shared/services/api';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  access_token: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

export const authService = {
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    const response = await api.post<LoginResponse>(
      '/api/auth/login',
      credentials
    );
    return response.data;
  },

  logout: () => {
    localStorage.removeItem('access_token');
  },

  getToken: (): string | null => {
    return localStorage.getItem('access_token');
  },

  setToken: (token: string): void => {
    localStorage.setItem('access_token', token);
  },
};
