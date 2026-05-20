import axios from 'axios'

export interface AuthResponse {
  token: string
  userId: string
  username: string
  role: string
}

export const loginUser = (username: string, password: string): Promise<AuthResponse> =>
  axios.post<AuthResponse>('/api/auth/login', { username, password }).then(r => r.data)

export const registerUser = (username: string, password: string): Promise<AuthResponse> =>
  axios.post<AuthResponse>('/api/auth/register', { username, password }).then(r => r.data)
