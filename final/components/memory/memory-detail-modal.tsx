"use client"
import { useState } from "react"
import type { Memory } from "@/types"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { MapPin, Calendar, Edit, Trash2 } from "lucide-react"
import { MemoryService } from "@/lib/memory-service"

interface MemoryDetailModalProps {
  memory: Memory | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onMemoryDeleted: () => void
  onMemoryEdit: (memory: Memory) => void
}

export function MemoryDetailModal({
  memory,
  open,
  onOpenChange,
  onMemoryDeleted,
  onMemoryEdit,
}: MemoryDetailModalProps) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  if (!memory) return null

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  const handleDelete = () => {
    MemoryService.deleteMemory(memory.id)
    onMemoryDeleted()
    setShowDeleteDialog(false)
    onOpenChange(false)
  }

  const handleEdit = () => {
    onMemoryEdit(memory)
    onOpenChange(false)
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <div className="flex justify-between items-start">
              <div>
                <DialogTitle className="text-2xl">{memory.title}</DialogTitle>
                <DialogDescription className="flex items-center gap-4 mt-2">
                  <div className="flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    <span>{memory.location}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    <span>{formatDate(memory.date)}</span>
                  </div>
                </DialogDescription>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleEdit}>
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => setShowDeleteDialog(true)}>
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          <div className="space-y-6">
            {/* Image */}
            <div className="aspect-video overflow-hidden rounded-lg">
              <img
                src={memory.imageUrl || "/placeholder.svg"}
                alt={memory.title}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Description */}
            {memory.description && (
              <div>
                <h3 className="font-semibold mb-2">About this memory</h3>
                <p className="text-muted-foreground leading-relaxed">{memory.description}</p>
              </div>
            )}

            {/* Tags */}
            {memory.tags.length > 0 && (
              <div>
                <h3 className="font-semibold mb-2">Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {memory.tags.map((tag) => (
                    <Badge key={tag} variant="secondary">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            {/* Metadata */}
            <div className="text-sm text-muted-foreground">
              <p>Added on {formatDate(memory.createdAt)}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Memory</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{memory.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
