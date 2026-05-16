"use client"

import { useState, useCallback } from "react"
import { Upload, X, File, CheckCircle2, AlertCircle, Cloud } from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"
import { useFileStore } from "@/lib/file-store"
import { formatFileSize } from "@/lib/file-utils"
import type { UploadingFile } from "@/lib/types"

interface UploadModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UploadModal({ open, onOpenChange }: UploadModalProps) {
  const [isDragging, setIsDragging] = useState(false)
  const { uploadingFiles, addUploadingFile, updateUploadProgress, removeUploadingFile } = useFileStore()

  const simulateUpload = useCallback((file: File) => {
    const uploadId = `upload-${Date.now()}-${Math.random()}`
    const uploadingFile: UploadingFile = {
      id: uploadId,
      name: file.name,
      progress: 0,
      status: "uploading",
      size: file.size,
    }
    
    addUploadingFile(uploadingFile)

    // Simulate upload progress
    let progress = 0
    const interval = setInterval(() => {
      progress += Math.random() * 15
      if (progress >= 100) {
        progress = 100
        clearInterval(interval)
        updateUploadProgress(uploadId, 100, "success")
        setTimeout(() => removeUploadingFile(uploadId), 3000)
      } else {
        updateUploadProgress(uploadId, Math.round(progress))
      }
    }, 200)
  }, [addUploadingFile, updateUploadProgress, removeUploadingFile])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = Array.from(e.dataTransfer.files)
    files.forEach(simulateUpload)
  }, [simulateUpload])

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(simulateUpload)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Upload Files
          </DialogTitle>
          <DialogDescription>
            Drag and drop files here or click to browse
          </DialogDescription>
        </DialogHeader>

        {/* Drop Zone */}
        <div
          className={cn(
            "relative flex min-h-[200px] flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all duration-200",
            isDragging
              ? "border-primary bg-primary/5 scale-[1.02]"
              : "border-muted-foreground/25 hover:border-primary/50 hover:bg-muted/50"
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            type="file"
            multiple
            className="absolute inset-0 cursor-pointer opacity-0"
            onChange={handleFileSelect}
          />
          <Cloud className={cn(
            "mb-4 h-12 w-12 transition-colors",
            isDragging ? "text-primary" : "text-muted-foreground/50"
          )} />
          <p className="text-center font-medium">
            {isDragging ? "Drop files here" : "Drop files here to upload"}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            or click to browse from your computer
          </p>
        </div>

        {/* Upload Progress */}
        {uploadingFiles.length > 0 && (
          <div className="mt-4 max-h-[200px] space-y-3 overflow-y-auto">
            {uploadingFiles.map((file) => (
              <UploadProgressItem key={file.id} file={file} />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

function UploadProgressItem({ file }: { file: UploadingFile }) {
  const getStatusIcon = () => {
    switch (file.status) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-destructive" />
      default:
        return <File className="h-5 w-5 text-muted-foreground" />
    }
  }

  return (
    <div className="flex items-center gap-3 rounded-xl border bg-muted/30 p-3">
      {getStatusIcon()}
      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between">
          <p className="truncate text-sm font-medium">{file.name}</p>
          <span className="ml-2 text-xs text-muted-foreground shrink-0">
            {file.status === "uploading"
              ? `${file.progress}%`
              : file.status === "success"
              ? "Complete"
              : "Failed"}
          </span>
        </div>
        {file.status === "uploading" && (
          <Progress value={file.progress} className="mt-2 h-1.5" />
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          {formatFileSize(file.size)}
        </p>
      </div>
    </div>
  )
}
