"use client"

import { Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { FileGrid } from "./file-grid"
import { FileList } from "./file-list"
import { useFileStore } from "@/lib/file-store"
import { toast } from "sonner"

export function TrashView() {
  const { getTrash, viewMode, files } = useFileStore()
  const trashFiles = getTrash()

  const handleEmptyTrash = () => {
    toast.info("Empty trash functionality would be implemented here")
  }

  if (trashFiles.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Trash2 className="h-5 w-5" />
          </EmptyMedia>
          <EmptyTitle>Trash is empty</EmptyTitle>
          <EmptyDescription>
            Items you delete will appear here for 30 days before being permanently removed
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Trash2 className="h-5 w-5 text-muted-foreground" />
          <h2 className="text-lg font-semibold">Trash</h2>
          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
            {trashFiles.length} items
          </span>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleEmptyTrash}
          className="gap-2 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
          Empty trash
        </Button>
      </div>
      
      {viewMode === "grid" ? (
        <FileGrid files={trashFiles} />
      ) : (
        <FileList files={trashFiles} />
      )}
    </div>
  )
}
