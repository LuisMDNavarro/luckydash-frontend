import axios from 'axios'
import { updateAuthState } from './authStore'

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/refresh/')
    ) {
      originalRequest._retry = true

      try {
        await apiClient.post('/users/refresh/')
        updateAuthState(true)
        return apiClient(originalRequest)
      } catch (refreshError) {
        updateAuthState(false)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default apiClient
