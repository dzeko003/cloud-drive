"use client"

import {
  Folder,
  FileImage,
  FileVideo,
  FileText,
  FileSpreadsheet,
  FileAudio,
  FileArchive,
  File,
} from "lucide-react"
import type { FileType } from "@/lib/types"
import { getFileColor, getFileBgColor } from "@/lib/file-utils"
import { cn } from "@/lib/utils"

interface FileIconProps {
  type: FileType
  size?: "sm" | "md" | "lg" | "xl"
  className?: string
  showBackground?: boolean
}

const sizeClasses = {
  sm: "h-4 w-4",
  md: "h-6 w-6",
  lg: "h-10 w-10",
  xl: "h-16 w-16",
}

const containerSizes = {
  sm: "h-8 w-8",
  md: "h-10 w-10",
  lg: "h-16 w-16",
  xl: "h-24 w-24",
}

export function FileIcon({
  type,
  size = "md",
  className,
  showBackground = false,
}: FileIconProps) {
  const iconProps = {
    className: cn(sizeClasses[size], getFileColor(type), className),
  }

  const getIcon = () => {
    switch (type) {
      case "folder":
        return <Folder {...iconProps} />
      case "image":
        return <FileImage {...iconProps} />
      case "video":
        return <FileVideo {...iconProps} />
      case "document":
        return <FileText {...iconProps} />
      case "pdf":
        return <FileText {...iconProps} />
      case "spreadsheet":
        return <FileSpreadsheet {...iconProps} />
      case "audio":
        return <FileAudio {...iconProps} />
      case "archive":
        return <FileArchive {...iconProps} />
      default:
        return <File {...iconProps} />
    }
  }

  if (showBackground) {
    return (
      <div
        className={cn(
          "flex items-center justify-center rounded-xl",
          containerSizes[size],
          getFileBgColor(type)
        )}
      >
        {getIcon()}
      </div>
    )
  }

  return getIcon()
}
