export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  wallet: string
  password: string
  confirmPassword: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface User {
  uid: string
  name: string
  email: string
}
