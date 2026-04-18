export interface LoginRequest {
  username: string
  password: string
}

export interface RegisterRequest {
  username: string
  wallet: string
  password: string
  confirm_password: string
}

export interface LoginResponse {
  refresh: string
  access: string
  detail?: string
}

export interface RegisterResponse {
  message?: string
  errors?: {
    [field: string]: string[]
  }
}

export interface RefreshResponse {
  message?: string
  detail?: string
  code?: string
}

export interface LogoutResponse {
  message?: string
  detail?: string
}
