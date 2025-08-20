"use client"

import { useAuth } from "@/contexts/auth-context"
import { AuthPage } from "@/components/auth/auth-page"
import { Button } from "@/components/ui/button"
import { AddMemoryModal } from "@/components/memory/add-memory-modal"
import { MemoryCard } from "@/components/memory/memory-card"
import { MemoryListItem } from "@/components/memory/memory-list-item"
import { MemoryDetailModal } from "@/components/memory/memory-detail-modal"
import { EditMemoryModal } from "@/components/memory/edit-memory-modal"
import { GalleryViewToggle } from "@/components/memory/gallery-view-toggle"
import { MemoryService } from "@/lib/memory-service"
import { useState, useEffect } from "react"
import type { Memory } from "@/types"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

function DashboardPage() {
  const { user, logout } = useAuth()
  const [memories, setMemories] = useState<Memory[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null)
  const [editingMemory, setEditingMemory] = useState<Memory | null>(null)
  const [showDetailModal, setShowDetailModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "location" | "title">("newest")

  const loadMemories = () => {
    if (user) {
      let userMemories = MemoryService.getUserMemories(user.id)

      switch (sortBy) {
        case "newest":
          userMemories = userMemories.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
          break
        case "oldest":
          userMemories = userMemories.sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
          break
        case "location":
          userMemories = userMemories.sort((a, b) => a.location.localeCompare(b.location))
          break
        case "title":
          userMemories = userMemories.sort((a, b) => a.title.localeCompare(b.title))
          break
      }

      setMemories(userMemories)
    }
    setIsLoading(false)
  }

  useEffect(() => {
    loadMemories()
  }, [user, sortBy])

  const handleMemoryAdded = () => {
    loadMemories()
  }

  const handleMemoryClick = (memory: Memory) => {
    setSelectedMemory(memory)
    setShowDetailModal(true)
  }

  const handleMemoryEdit = (memory: Memory) => {
    setEditingMemory(memory)
    setShowEditModal(true)
  }

  const handleMemoryUpdated = () => {
    loadMemories()
    setEditingMemory(null)
  }

  const handleMemoryDeleted = () => {
    loadMemories()
    setSelectedMemory(null)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading your memories...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">Memory Gallery</h1>
            </div>
            <div className="flex items-center gap-4">
              <AddMemoryModal onMemoryAdded={handleMemoryAdded} />
              <span className="text-sm text-gray-600">Welcome, {user?.name}</span>
              <Button variant="outline" onClick={logout}>
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {memories.length === 0 ? (
          <div className="text-center py-12">
            <div className="max-w-md mx-auto">
              <img
                src="/placeholder.svg?height=200&width=300"
                alt="No memories yet"
                className="mx-auto mb-6 opacity-50"
              />
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Start Your Memory Collection</h2>
              <p className="text-gray-600 mb-6">
                Capture your travel moments and organize them by location and date. Your memories are waiting to be
                preserved!
              </p>
              <AddMemoryModal onMemoryAdded={handleMemoryAdded} />
            </div>
          </div>
        ) : (
          <div>
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-900">Your Travel Memories</h2>
                <p className="text-gray-600">{memories.length} memories saved</p>
              </div>

              <div className="flex items-center gap-4">
                <Select value={sortBy} onValueChange={(value: any) => setSortBy(value)}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="newest">Newest first</SelectItem>
                    <SelectItem value="oldest">Oldest first</SelectItem>
                    <SelectItem value="location">Location</SelectItem>
                    <SelectItem value="title">Title</SelectItem>
                  </SelectContent>
                </Select>

                <GalleryViewToggle view={viewMode} onViewChange={setViewMode} />
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                {memories.map((memory) => (
                  <MemoryCard key={memory.id} memory={memory} onClick={() => handleMemoryClick(memory)} />
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {memories.map((memory) => (
                  <MemoryListItem key={memory.id} memory={memory} onClick={() => handleMemoryClick(memory)} />
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      <MemoryDetailModal
        memory={selectedMemory}
        open={showDetailModal}
        onOpenChange={setShowDetailModal}
        onMemoryDeleted={handleMemoryDeleted}
        onMemoryEdit={handleMemoryEdit}
      />

      <EditMemoryModal
        memory={editingMemory}
        open={showEditModal}
        onOpenChange={setShowEditModal}
        onMemoryUpdated={handleMemoryUpdated}
      />
    </div>
  )
}

export default function HomePage() {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  return isAuthenticated ? <DashboardPage /> : <AuthPage />
}
