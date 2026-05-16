"use client";

import { useState } from "react";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FileIcon } from "./file-icon";
import { FileContextMenuItems } from "./file-context-menu";
import type { FileItem } from "@/lib/types";
import { formatDate, formatFileSize } from "@/lib/file-utils";
import { useFileStore } from "@/lib/file-store";

interface FileGridProps {
  files: FileItem[];
  highlightQuery?: string;
}

export function FileGrid({ files, highlightQuery }: FileGridProps) {
  const { setCurrentFolder, toggleFavorite } = useFileStore();

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === "folder") {
      setCurrentFolder(file.id);
    }
  };

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
      {files.map((file) => (
        <FileGridItem
          key={file.id}
          file={file}
          highlightQuery={highlightQuery}
          onDoubleClick={() => handleDoubleClick(file)}
          onToggleFavorite={() => toggleFavorite(file.id)}
        />
      ))}
    </div>
  );
}

interface FileGridItemProps {
  file: FileItem;
  highlightQuery?: string;
  onDoubleClick: () => void;
  onToggleFavorite: () => void;
}

function FileGridItem({
  file,
  highlightQuery,
  onDoubleClick,
  onToggleFavorite,
}: FileGridItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <ContextMenu>
      <ContextMenuTrigger>
        <div
          className={cn(
            "group relative flex flex-col items-center rounded-2xl border bg-card p-4 transition-all duration-200 cursor-pointer",
            "hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5",
            "focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
          )}
          onDoubleClick={onDoubleClick}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === "Enter") onDoubleClick();
          }}
        >
          {/* Favorite Indicator */}
          {file.isFavorite && (
            <Star className="absolute right-2 top-2 h-4 w-4 fill-amber-400 text-amber-400" />
          )}

          {/* Quick Actions */}
          {isHovered && !file.isFavorite && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onToggleFavorite();
              }}
              className="absolute right-2 top-2 rounded-full p-1 opacity-0 transition-opacity group-hover:opacity-100 hover:bg-accent"
            >
              <Star className="h-4 w-4 text-muted-foreground" />
            </button>
          )}

          {/* File Icon / Preview */}
          <div className="mb-3 flex h-20 w-20 items-center justify-center">
            <FileIcon type={file.type} size="xl" showBackground />
          </div>

          {/* File Name */}
          <p className="w-full truncate text-center text-sm font-medium">
            {highlightQuery
              ? highlightMatch(file.name, highlightQuery)
              : file.name}
          </p>

          {/* Metadata */}
          <p className="mt-1 text-xs text-muted-foreground">
            {file.type === "folder"
              ? formatDate(file.modifiedAt)
              : formatFileSize(file.size)}
          </p>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-56">
        <FileContextMenuItems file={file} />
      </ContextMenuContent>
    </ContextMenu>
  );
}

function highlightMatch(text: string, query: string) {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query})`, "gi"));
  return (
    <>
      {parts.map((part, i) =>
        part.toLowerCase() === query.toLowerCase() ? (
          <mark key={i} className="bg-primary/20 text-foreground rounded-sm">
            {part}
          </mark>
        ) : (
          part
        ),
      )}
    </>
  );
}
