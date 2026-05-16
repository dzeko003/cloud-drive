"use client";

import { useState } from "react";
import {
  Folder,
  FileText,
  Image,
  FileSpreadsheet,
  Music,
  Archive,
  Film,
  FileIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileStore } from "@/lib/file-store";
import { toast } from "sonner";
import type { FileType } from "@/lib/types";

interface CreateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "folder" | "file";
}

const fileTypeOptions: {
  value: FileType;
  label: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "document",
    label: "Document",
    icon: <FileText className="h-4 w-4" />,
  },
  { value: "image", label: "Image", icon: <Image className="h-4 w-4" /> },
  {
    value: "spreadsheet",
    label: "Spreadsheet",
    icon: <FileSpreadsheet className="h-4 w-4" />,
  },
  { value: "pdf", label: "PDF", icon: <FileIcon className="h-4 w-4" /> },
  { value: "video", label: "Video", icon: <Film className="h-4 w-4" /> },
  { value: "audio", label: "Audio", icon: <Music className="h-4 w-4" /> },
  { value: "archive", label: "Archive", icon: <Archive className="h-4 w-4" /> },
];

export function CreateDialog({ open, onOpenChange, mode }: CreateDialogProps) {
  const [name, setName] = useState("");
  const [fileType, setFileType] = useState<FileType>("document");
  const { createFolder, createFile, currentPath } = useFileStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please enter a name");
      return;
    }

    if (mode === "folder") {
      createFolder(name.trim());
      toast.success(`Folder "${name}" created`, {
        description: `Created in ${currentPath[currentPath.length - 1]?.name || "My Files"}`,
      });
    } else {
      createFile(name.trim(), fileType);
      toast.success(`File "${name}" created`, {
        description: `Created as ${fileType} in ${currentPath[currentPath.length - 1]?.name || "My Files"}`,
      });
    }

    setName("");
    setFileType("document");
    onOpenChange(false);
  };

  const handleOpenChange = (isOpen: boolean) => {
    if (!isOpen) {
      setName("");
      setFileType("document");
    }
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {mode === "folder" ? (
                <>
                  <Folder className="h-5 w-5 text-primary" />
                  Create New Folder
                </>
              ) : (
                <>
                  <FileText className="h-5 w-5 text-primary" />
                  Create New File
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {mode === "folder"
                ? "Create a new folder to organize your files."
                : "Create a new file in the current folder."}
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">
                {mode === "folder" ? "Folder name" : "File name"}
              </Label>
              <Input
                id="name"
                placeholder={
                  mode === "folder" ? "My New Folder" : "my-file.txt"
                }
                value={name}
                onChange={(e) => setName(e.target.value)}
                autoFocus
              />
            </div>

            {mode === "file" && (
              <div className="grid gap-2">
                <Label htmlFor="type">File type</Label>
                <Select
                  value={fileType}
                  onValueChange={(v) => setFileType(v as FileType)}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select a file type" />
                  </SelectTrigger>
                  <SelectContent>
                    {fileTypeOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        <div className="flex items-center gap-2">
                          {option.icon}
                          {option.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit">
              {mode === "folder" ? "Create Folder" : "Create File"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
