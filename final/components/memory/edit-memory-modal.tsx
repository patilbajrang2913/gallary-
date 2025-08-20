"use client"

import type React from "react"
import { useState, useEffect } from "react"
import type { Memory } from "@/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { MemoryService } from "@/lib/memory-service"
import { Upload, X } from "lucide-react"

interface EditMemoryModalProps {
  memory: Memory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemoryUpdated: () => void
}

export function EditMemoryModal({ memory, open, onOpenChange, onMemoryUpdated }: EditMemoryModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [tags, setTags] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  useEffect(() => {
    if (memory && open) {
      setTitle(memory.title)
      setDescription(memory.description)
      setLocation(memory.location)
      setDate(memory.date)
      setTags(memory.tags.join(", "))
      setImagePreview(memory.imageUrl)
      setImageFile(null)
      setError("")
    }
  }, [memory, open])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size must be less than 5MB")
        return
      }

      setImageFile(file)
      const reader = new FileReader()
      reader.onload = () => setImagePreview(reader.result as string)
      reader.readAsDataURL(file)
      setError("")
    }
  }

  const removeImage = () => {
    setImageFile(null)
    setImagePreview(memory?.imageUrl || "")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!memory) return

    setError("")
    setIsLoading(true)

    try {
      let imageUrl = memory.imageUrl

      if (imageFile) {
        imageUrl = await MemoryService.convertImageToBase64(imageFile)
      }

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      MemoryService.updateMemory(memory.id, {
        title,
        description,
        location,
        date,
        imageUrl,
        tags: tagsArray,
      })

      onOpenChange(false)
      onMemoryUpdated()
    } catch (err) {
      setError("Failed to update memory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  if (!memory) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Memory</DialogTitle>
          <DialogDescription>Update your travel memory details.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            <div className="relative">
              <img
                src={imagePreview || "/placeholder.svg"}
                alt="Preview"
                className="w-full h-48 object-cover rounded-lg"
              />
              <div className="absolute inset-0 bg-black/50 opacity-0 hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                <Button type="button" size="sm" onClick={() => document.getElementById("edit-image-input")?.click()}>
                  <Upload className="h-4 w-4 mr-1" />
                  Change
                </Button>
                {imageFile && (
                  <Button type="button" variant="destructive" size="sm" onClick={removeImage}>
                    <X className="h-4 w-4 mr-1" />
                    Remove
                  </Button>
                )}
              </div>
              <Input
                id="edit-image-input"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="edit-title">Title *</Label>
            <Input
              id="edit-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story behind this memory..."
              rows={3}
            />
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="edit-location">Location *</Label>
              <Input
                id="edit-location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was this taken?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-date">Date *</Label>
              <Input id="edit-date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="edit-tags">Tags</Label>
            <Input
              id="edit-tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="beach, sunset, family (comma separated)"
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Updating..." : "Update Memory"}
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
