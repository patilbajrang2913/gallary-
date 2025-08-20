import type { User } from "@/types"

const USERS_KEY = "memory_gallery_users"
const CURRENT_USER_KEY = "memory_gallery_current_user"

export class AuthService {
  static getUsers(): User[] {
    if (typeof window === "undefined") return []
    const users = localStorage.getItem(USERS_KEY)
    return users ? JSON.parse(users) : []
  }

  static saveUsers(users: User[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  static getCurrentUser(): User | null {
    if (typeof window === "undefined") return null
    const user = localStorage.getItem(CURRENT_USER_KEY)
    return user ? JSON.parse(user) : null
  }

  static setCurrentUser(user: User | null): void {
    if (typeof window === "undefined") return
    if (user) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }

  static register(email: string, password: string, name: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers()

    if (users.find((u) => u.email === email)) {
      return { success: false, error: "Email already exists" }
    }

    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      createdAt: new Date().toISOString(),
    }

    users.push(newUser)
    this.saveUsers(users)
    this.setCurrentUser(newUser)

    return { success: true, user: newUser }
  }

  static login(email: string, password: string): { success: boolean; user?: User; error?: string } {
    const users = this.getUsers()
    const user = users.find((u) => u.email === email)

    if (!user) {
      return { success: false, error: "Invalid email or password" }
    }

    this.setCurrentUser(user)
    return { success: true, user }
  }

  static logout(): void {
    this.setCurrentUser(null)
  }
}
