"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/auth-context"
import { MemoryService } from "@/lib/memory-service"
import { Plus, Upload, X } from "lucide-react"

interface AddMemoryModalProps {
  onMemoryAdded: () => void
}

export function AddMemoryModal({ onMemoryAdded }: AddMemoryModalProps) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [date, setDate] = useState("")
  const [tags, setTags] = useState("")
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string>("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")

  const { user } = useAuth()

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        // 5MB limit
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
    setImagePreview("")
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setError("")
    setIsLoading(true)

    try {
      let imageUrl = "/placeholder.svg?height=400&width=600"

      if (imageFile) {
        imageUrl = await MemoryService.convertImageToBase64(imageFile)
      }

      const tagsArray = tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean)

      MemoryService.addMemory({
        userId: user.id,
        title,
        description,
        location,
        date,
        imageUrl,
        tags: tagsArray,
      })

      // Reset form
      setTitle("")
      setDescription("")
      setLocation("")
      setDate("")
      setTags("")
      setImageFile(null)
      setImagePreview("")
      setOpen(false)
      onMemoryAdded()
    } catch (err) {
      setError("Failed to add memory. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add Memory
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Memory</DialogTitle>
          <DialogDescription>
            Capture a special moment from your travels and add it to your collection.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Image Upload */}
          <div className="space-y-2">
            <Label>Photo</Label>
            {!imagePreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
                <Upload className="h-8 w-8 mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-600 mb-2">Click to upload or drag and drop</p>
                <p className="text-xs text-gray-500">PNG, JPG up to 5MB</p>
                <Input type="file" accept="image/*" onChange={handleImageChange} className="mt-2" />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={imagePreview || "/placeholder.svg"}
                  alt="Preview"
                  className="w-full h-48 object-cover rounded-lg"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={removeImage}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your memory a title"
              required
            />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Tell the story behind this memory..."
              rows={3}
            />
          </div>

          {/* Location and Date */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Where was this taken?"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="date">Date *</Label>
              <Input id="date" type="date" value={date} onChange={(e) => setDate(e.target.value)} required />
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-2">
            <Label htmlFor="tags">Tags</Label>
            <Input
              id="tags"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="beach, sunset, family (comma separated)"
            />
          </div>

          {error && <div className="text-sm text-destructive bg-destructive/10 p-3 rounded-md">{error}</div>}

          <div className="flex gap-3 pt-4">
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Adding Memory..." : "Add Memory"}
            </Button>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
