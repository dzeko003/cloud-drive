"use client"

import {
  FolderOpen,
  Pencil,
  FolderInput,
  Trash2,
  Download,
  Share2,
  Star,
  Copy,
  Info,
  RotateCcw,
} from "lucide-react"
import {
  ContextMenuItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
} from "@/components/ui/context-menu"
import type { FileItem } from "@/lib/types"
import { useFileStore } from "@/lib/file-store"
import { toast } from "sonner"

interface FileContextMenuItemsProps {
  file: FileItem
}

export function FileContextMenuItems({ file }: FileContextMenuItemsProps) {
  const {
    setCurrentFolder,
    toggleFavorite,
    deleteFile,
    restoreFile,
    permanentlyDelete,
  } = useFileStore()

  const handleOpen = () => {
    if (file.type === "folder") {
      setCurrentFolder(file.id)
    } else {
      toast.info(`Opening ${file.name}...`)
    }
  }

  const handleRename = () => {
    toast.info("Rename dialog would open here")
  }

  const handleMove = () => {
    toast.info("Move dialog would open here")
  }

  const handleDelete = () => {
    deleteFile(file.id)
    toast.success(`${file.name} moved to trash`)
  }

  const handleRestore = () => {
    restoreFile(file.id)
    toast.success(`${file.name} restored`)
  }

  const handlePermanentDelete = () => {
    permanentlyDelete(file.id)
    toast.success(`${file.name} permanently deleted`)
  }

  const handleDownload = () => {
    toast.success(`Downloading ${file.name}...`)
  }

  const handleShare = () => {
    toast.info("Share dialog would open here")
  }

  const handleCopyLink = () => {
    toast.success("Link copied to clipboard")
  }

  const handleToggleFavorite = () => {
    toggleFavorite(file.id)
    toast.success(
      file.isFavorite ? "Removed from favorites" : "Added to favorites"
    )
  }

  const handleInfo = () => {
    toast.info("File details panel would open here")
  }

  // If file is in trash, show different options
  if (file.isDeleted) {
    return (
      <>
        <ContextMenuItem onClick={handleRestore}>
          <RotateCcw className="mr-2 h-4 w-4" />
          Restore
        </ContextMenuItem>
        <ContextMenuSeparator />
        <ContextMenuItem
          onClick={handlePermanentDelete}
          className="text-destructive focus:text-destructive"
        >
          <Trash2 className="mr-2 h-4 w-4" />
          Delete permanently
        </ContextMenuItem>
      </>
    )
  }

  return (
    <>
      <ContextMenuItem onClick={handleOpen}>
        <FolderOpen className="mr-2 h-4 w-4" />
        Open
        <ContextMenuShortcut>↵</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleRename}>
        <Pencil className="mr-2 h-4 w-4" />
        Rename
        <ContextMenuShortcut>F2</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={handleMove}>
        <FolderInput className="mr-2 h-4 w-4" />
        Move to...
      </ContextMenuItem>
      <ContextMenuItem onClick={handleToggleFavorite}>
        <Star
          className={`mr-2 h-4 w-4 ${
            file.isFavorite ? "fill-amber-400 text-amber-400" : ""
          }`}
        />
        {file.isFavorite ? "Remove from favorites" : "Add to favorites"}
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleDownload}>
        <Download className="mr-2 h-4 w-4" />
        Download
        <ContextMenuShortcut>⌘D</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuItem onClick={handleShare}>
        <Share2 className="mr-2 h-4 w-4" />
        Share
      </ContextMenuItem>
      <ContextMenuItem onClick={handleCopyLink}>
        <Copy className="mr-2 h-4 w-4" />
        Copy link
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem onClick={handleInfo}>
        <Info className="mr-2 h-4 w-4" />
        File details
        <ContextMenuShortcut>⌘I</ContextMenuShortcut>
      </ContextMenuItem>
      <ContextMenuSeparator />
      <ContextMenuItem
        onClick={handleDelete}
        className="text-destructive focus:text-destructive"
      >
        <Trash2 className="mr-2 h-4 w-4" />
        Move to trash
        <ContextMenuShortcut>⌫</ContextMenuShortcut>
      </ContextMenuItem>
    </>
  )
}
