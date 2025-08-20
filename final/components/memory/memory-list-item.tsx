"use client"

import type { Memory } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"

interface MemoryListItemProps {
  memory: Memory
  onClick?: () => void
}

export function MemoryListItem({ memory, onClick }: MemoryListItemProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card className="overflow-hidden hover:shadow-md transition-all cursor-pointer" onClick={onClick}>
      <CardContent className="p-4">
        <div className="flex gap-4">
          <div className="w-24 h-24 flex-shrink-0 overflow-hidden rounded-lg">
            <img
              src={memory.imageUrl || "/placeholder.svg"}
              alt={memory.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-lg mb-1 line-clamp-1">{memory.title}</h3>

            <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
              <div className="flex items-center gap-1">
                <MapPin className="h-4 w-4" />
                <span className="line-clamp-1">{memory.location}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{formatDate(memory.date)}</span>
              </div>
            </div>

            {memory.description && (
              <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{memory.description}</p>
            )}

            {memory.tags.length > 0 && (
              <div className="flex flex-wrap gap-1">
                {memory.tags.slice(0, 5).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
                {memory.tags.length > 5 && (
                  <Badge variant="outline" className="text-xs">
                    +{memory.tags.length - 5}
                  </Badge>
                )}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
