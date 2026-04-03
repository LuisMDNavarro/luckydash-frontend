import apiClient from './apiClient'
import type {
  RegisterRequest,
  RegisterResponse,
  LoginRequest,
  LoginResponse,
  RefreshRequest,
  RefreshResponse,
} from '../types/auth'

export const register = async (
  data: RegisterRequest,
): Promise<RegisterResponse> => {
  const response = await apiClient.post<RegisterResponse>(
    '/users/register/',
    data,
  )
  return response.data
}

export const login = async (data: LoginRequest): Promise<LoginResponse> => {
  const request = await apiClient.post<LoginResponse>('/users/login/', data)
  return request.data
}

export const refresh = async (
  data: RefreshRequest,
): Promise<RefreshResponse> => {
  const request = await apiClient.post<RefreshResponse>('/users/login/', data)
  return request.data
}

export const getMe = async () => {
  return apiClient.get('/users/')
}

export const logout = async (): Promise<void> => {
  await apiClient.post('/users/logout/')
}
