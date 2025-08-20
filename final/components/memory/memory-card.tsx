"use client"

import type { Memory } from "@/types"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar } from "lucide-react"

interface MemoryCardProps {
  memory: Memory
  onClick?: () => void
}

export function MemoryCard({ memory, onClick }: MemoryCardProps) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <Card
      className="overflow-hidden hover:shadow-lg transition-all cursor-pointer hover:scale-[1.02]"
      onClick={onClick}
    >
      <div className="aspect-video relative overflow-hidden">
        <img
          src={memory.imageUrl || "/placeholder.svg"}
          alt={memory.title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <h3 className="font-semibold text-lg mb-2 line-clamp-1">{memory.title}</h3>

        {memory.description && <p className="text-sm text-muted-foreground mb-3 line-clamp-2">{memory.description}</p>}

        <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
          <div className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            <span className="line-clamp-1">{memory.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            <span>{formatDate(memory.date)}</span>
          </div>
        </div>

        {memory.tags.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {memory.tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {memory.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{memory.tags.length - 3}
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
