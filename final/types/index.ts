export interface User {
  id: string
  email: string
  name: string
  createdAt: string
}

export interface Memory {
  id: string
  userId: string
  title: string
  description: string
  location: string
  date: string
  imageUrl: string
  tags: string[]
  createdAt: string
}

export interface AuthState {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
}
