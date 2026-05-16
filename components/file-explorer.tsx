"use client";

import { useState } from "react";
import { FolderOpen, Plus, FolderPlus, FilePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Empty,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
  EmptyDescription,
  EmptyContent,
} from "@/components/ui/empty";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileGrid } from "./file-grid";
import { FileList } from "./file-list";
import { FolderBreadcrumb } from "./folder-breadcrumb";
import { CreateDialog } from "./create-dialog";
import { useFileStore } from "@/lib/file-store";

interface FileExplorerProps {
  onUploadClick: () => void;
}

export function FileExplorer({ onUploadClick }: FileExplorerProps) {
  const { getCurrentFiles, viewMode } = useFileStore();
  const files = getCurrentFiles();
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [createMode, setCreateMode] = useState<"folder" | "file">("folder");

  const handleCreateFolder = () => {
    setCreateMode("folder");
    setCreateDialogOpen(true);
  };

  const handleCreateFile = () => {
    setCreateMode("file");
    setCreateDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Breadcrumb */}
      <div className="flex items-center justify-between">
        <FolderBreadcrumb />
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 rounded-lg">
              <Plus className="h-4 w-4" />
              New
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleCreateFolder} className="gap-2">
              <FolderPlus className="h-4 w-4" />
              New Folder
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleCreateFile} className="gap-2">
              <FilePlus className="h-4 w-4" />
              New File
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Create Dialog */}
      <CreateDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        mode={createMode}
      />

      {/* Files Content */}
      {files.length > 0 ? (
        viewMode === "grid" ? (
          <FileGrid files={files} />
        ) : (
          <FileList files={files} />
        )
      ) : (
        <Empty className="min-h-[400px]">
          <EmptyHeader>
            <EmptyMedia variant="icon">
              <FolderOpen className="h-5 w-5" />
            </EmptyMedia>
            <EmptyTitle>This folder is empty</EmptyTitle>
            <EmptyDescription>
              Upload files or create a new folder to get started
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent>
            <Button onClick={onUploadClick} className="gap-2 rounded-xl">
              <Plus className="h-4 w-4" />
              Upload files
            </Button>
          </EmptyContent>
        </Empty>
      )}
    </div>
  );
}

// Loading skeleton
export function FileExplorerSkeleton() {
  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <Skeleton className="h-6 w-48" />
        <Skeleton className="h-9 w-28" />
      </div>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {Array.from({ length: 12 }).map((_, i) => (
          <div
            key={i}
            className="flex flex-col items-center rounded-2xl border p-4"
          >
            <Skeleton className="mb-3 h-20 w-20 rounded-xl" />
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-1 h-3 w-16" />
          </div>
        ))}
      </div>
    </div>
  );
}
