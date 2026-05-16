"use client"

import { Clock } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"
import { FileGrid } from "./file-grid"
import { FileList } from "./file-list"
import { useFileStore } from "@/lib/file-store"

export function RecentView() {
  const { getRecent, viewMode } = useFileStore()
  const recentFiles = getRecent()

  if (recentFiles.length === 0) {
    return (
      <Empty className="min-h-[400px]">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Clock className="h-5 w-5" />
          </EmptyMedia>
          <EmptyTitle>No recent activity</EmptyTitle>
          <EmptyDescription>
            Files you open or modify will appear here
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-2">
        <Clock className="h-5 w-5 text-muted-foreground" />
        <h2 className="text-lg font-semibold">Recent</h2>
        <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
          Last 30 days
        </span>
      </div>
      
      {viewMode === "grid" ? (
        <FileGrid files={recentFiles} />
      ) : (
        <FileList files={recentFiles} />
      )}
    </div>
  )
}
