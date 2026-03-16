import { apiClient } from '@/lib/api-client';
import {
  RegisterRequest,
  LoginRequest,
  LoginResponse,
  User,
  ApiResponse,
} from '@/types/api';

class AuthService {
  // Registro de novo usuário (secretaria)
  async register(data: RegisterRequest): Promise<ApiResponse<User>> {
    return apiClient.post('/api/register', data);
  }

  // Login de usuário (secretaria)
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    return apiClient.login('/api/login', credentials);
  }

  // Obter usuário autenticado
  async getUser(): Promise<User> {
    return apiClient.get('/api/user');
  }

  // Logout
  async logout(): Promise<void> {
    try {
      await apiClient.post('/api/logout');
    } finally {
      apiClient.removeToken();
    }
  }

  // Verificar se está autenticado
  isAuthenticated(): boolean {
    return apiClient.isAuthenticated();
  }

  // Solicitar redefinição de senha
  async forgotPassword(email: string): Promise<ApiResponse> {
    return apiClient.post('/api/forgot-password', { email });
  }

  // Redefinir senha
  async resetPassword(data: {
    token: string;
    email: string;
    password: string;
    password_confirmation: string;
  }): Promise<ApiResponse> {
    return apiClient.post('/api/reset-password', data);
  }
}

export const authService = new AuthService();
