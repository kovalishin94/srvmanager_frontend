export interface User {
  isAuthenticated: boolean
  accessToken: string | null
  refreshToken: string | null
  id: number | null
  username: string | null
  first_name: string | null
  last_name: string | null
  email: string | null
  is_active: boolean
  is_staff: boolean
  is_superuser: boolean
}

