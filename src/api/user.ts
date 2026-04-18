import apiClient from './apiClient'
import type { User, UpdateUserRequest } from '../types/user'

export const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>('/users/profile/')
  return response.data
}

export const updateProfile = async (data: UpdateUserRequest): Promise<User> => {
  const response = await apiClient.patch<User>('/users/profile/', data)
  return response.data
}
