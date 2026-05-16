import type { FileType } from "./types"

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return "—"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB", "TB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`
}

export function formatDate(date: Date): string {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))

  if (days === 0) {
    return "Today"
  } else if (days === 1) {
    return "Yesterday"
  } else if (days < 7) {
    return `${days} days ago`
  } else {
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: date.getFullYear() !== now.getFullYear() ? "numeric" : undefined,
    })
  }
}

export function getFileTypeLabel(type: FileType): string {
  const labels: Record<FileType, string> = {
    folder: "Folder",
    image: "Image",
    video: "Video",
    document: "Document",
    pdf: "PDF",
    spreadsheet: "Spreadsheet",
    audio: "Audio",
    archive: "Archive",
  }
  return labels[type] || type
}

export function getFileColor(type: FileType): string {
  const colors: Record<FileType, string> = {
    folder: "text-blue-500",
    image: "text-green-500",
    video: "text-red-500",
    document: "text-blue-600",
    pdf: "text-red-600",
    spreadsheet: "text-emerald-600",
    audio: "text-purple-500",
    archive: "text-amber-600",
  }
  return colors[type] || "text-muted-foreground"
}

export function getFileBgColor(type: FileType): string {
  const colors: Record<FileType, string> = {
    folder: "bg-blue-50 dark:bg-blue-950",
    image: "bg-green-50 dark:bg-green-950",
    video: "bg-red-50 dark:bg-red-950",
    document: "bg-blue-50 dark:bg-blue-950",
    pdf: "bg-red-50 dark:bg-red-950",
    spreadsheet: "bg-emerald-50 dark:bg-emerald-950",
    audio: "bg-purple-50 dark:bg-purple-950",
    archive: "bg-amber-50 dark:bg-amber-950",
  }
  return colors[type] || "bg-muted"
}
