"use client"

import { Button } from "@/components/ui/button"
import { Grid3X3, List } from "lucide-react"

interface GalleryViewToggleProps {
  view: "grid" | "list"
  onViewChange: (view: "grid" | "list") => void
}

export function GalleryViewToggle({ view, onViewChange }: GalleryViewToggleProps) {
  return (
    <div className="flex gap-1 border rounded-lg p-1">
      <Button
        variant={view === "grid" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("grid")}
        className="gap-2"
      >
        <Grid3X3 className="h-4 w-4" />
        Grid
      </Button>
      <Button
        variant={view === "list" ? "default" : "ghost"}
        size="sm"
        onClick={() => onViewChange("list")}
        className="gap-2"
      >
        <List className="h-4 w-4" />
        List
      </Button>
    </div>
  )
}
