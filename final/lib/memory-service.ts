import type { Memory } from "@/types"

const MEMORIES_KEY = "memory_gallery_memories"

export class MemoryService {
  static getMemories(): Memory[] {
    if (typeof window === "undefined") return []
    const memories = localStorage.getItem(MEMORIES_KEY)
    return memories ? JSON.parse(memories) : []
  }

  static saveMemories(memories: Memory[]): void {
    if (typeof window === "undefined") return
    localStorage.setItem(MEMORIES_KEY, JSON.stringify(memories))
  }

  static getUserMemories(userId: string): Memory[] {
    return this.getMemories().filter((memory) => memory.userId === userId)
  }

  static addMemory(memory: Omit<Memory, "id" | "createdAt">): Memory {
    const memories = this.getMemories()
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }

    memories.push(newMemory)
    this.saveMemories(memories)
    return newMemory
  }

  static updateMemory(id: string, updates: Partial<Memory>): Memory | null {
    const memories = this.getMemories()
    const index = memories.findIndex((m) => m.id === id)

    if (index === -1) return null

    memories[index] = { ...memories[index], ...updates }
    this.saveMemories(memories)
    return memories[index]
  }

  static deleteMemory(id: string): boolean {
    const memories = this.getMemories()
    const filteredMemories = memories.filter((m) => m.id !== id)

    if (filteredMemories.length === memories.length) return false

    this.saveMemories(filteredMemories)
    return true
  }

  static convertImageToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result as string)
      reader.onerror = reject
      reader.readAsDataURL(file)
    })
  }
}
