export type FileType = "image" | "video" | "document" | "pdf" | "folder" | "spreadsheet" | "audio" | "archive"

export interface FileItem {
  id: string
  name: string
  type: FileType
  size: number // in bytes
  modifiedAt: Date
  createdAt: Date
  owner: string
  parentId: string | null
  path: string[]
  isFavorite: boolean
  isDeleted: boolean
  thumbnail?: string
}

export interface Folder extends FileItem {
  type: "folder"
}

export interface SearchFilters {
  fileType: FileType | "all"
  dateModified: "any" | "today" | "week" | "month" | "year"
  owner: string | "all"
  size: "any" | "small" | "medium" | "large"
}

export interface UploadingFile {
  id: string
  name: string
  progress: number
  status: "uploading" | "success" | "error"
  size: number
}

export type ViewMode = "grid" | "list"
export type SortBy = "name" | "date" | "size"
export type SortOrder = "asc" | "desc"
