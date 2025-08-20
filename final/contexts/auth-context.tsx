"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { AuthState } from "@/types"
import { AuthService } from "@/lib/auth"

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>
  register: (email: string, password: string, name: string) => Promise<{ success: boolean; error?: string }>
  logout: () => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
  })

  useEffect(() => {
    const user = AuthService.getCurrentUser()
    setAuthState({
      user,
      isLoading: false,
      isAuthenticated: !!user,
    })
  }, [])

  const login = async (email: string, password: string) => {
    const result = AuthService.login(email, password)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      })
    }

    return result
  }

  const register = async (email: string, password: string, name: string) => {
    const result = AuthService.register(email, password, name)

    if (result.success && result.user) {
      setAuthState({
        user: result.user,
        isLoading: false,
        isAuthenticated: true,
      })
    }

    return result
  }

  const logout = () => {
    AuthService.logout()
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
    })
  }

  return <AuthContext.Provider value={{ ...authState, login, register, logout }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
