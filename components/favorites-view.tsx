"use client"

import { Star } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { FileGrid } from "./file-grid"
import { FileList } from "./file-list"
import { useFileStore } from "@/lib/file-store"

export function FavoritesView() {
  const { getFavorites, viewMode } = useFileStore()
  const favorites = getFavorites()

  if (favorites.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Star className="h-5 w-5" />
          </EmptyMedia>
          <EmptyTitle>No favorites yet</EmptyTitle>
          <EmptyDescription>
            Star files and folders to quickly access them here
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Star className="h-5 w-5 text-amber-500" />
        <h2 className="text-lg font-semibold">Favorites</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          {favorites.length}
        </span>
      </div>
      
      {viewMode === "grid" ? (
        <FileGrid files={favorites} />
      ) : (
        <FileList files={favorites} />
      )}
    </div>
  )
}
