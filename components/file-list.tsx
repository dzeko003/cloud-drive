"use client";

import { Star, ArrowUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import { FileIcon } from "./file-icon";
import { FileContextMenuItems } from "./file-context-menu";
import type { FileItem, SortBy } from "@/lib/types";
import { formatDate, formatFileSize } from "@/lib/file-utils";
import { useFileStore } from "@/lib/file-store";

interface FileListProps {
  files: FileItem[];
  highlightQuery?: string;
}

const SortButton = ({
  column,
  children,
}: {
  column: SortBy;
  children: React.ReactNode;
}) => {
  const { sortBy, sortOrder, setSortBy, setSortOrder } = useFileStore();

  const handleSort = (column: SortBy) => {
    if (sortBy === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortBy(column);
      setSortOrder("asc");
    }
  };
  return (
    <Button
      variant="ghost"
      size="sm"
      className="-ml-3 h-8 gap-1 font-medium"
      onClick={() => handleSort(column)}
    >
      {children}
      <ArrowUpDown
        className={cn(
          "h-3.5 w-3.5 text-muted-foreground transition-transform",
          sortBy === column && sortOrder === "desc" && "rotate-180",
        )}
      />
    </Button>
  );
};

export function FileList({ files, highlightQuery }: FileListProps) {
  const { setCurrentFolder, toggleFavorite } = useFileStore();

  const handleDoubleClick = (file: FileItem) => {
    if (file.type === "folder") {
      setCurrentFolder(file.id);
    }
  };

  return (
    <div className="rounded-xl border bg-card">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-12"></TableHead>
            <TableHead>
              <SortButton column="name">Name</SortButton>
            </TableHead>
            <TableHead className="hidden md:table-cell">Owner</TableHead>
            <TableHead>
              <SortButton column="date">Modified</SortButton>
            </TableHead>
            <TableHead className="text-right">
              <SortButton column="size">Size</SortButton>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {files.map((file) => (
            <ContextMenu key={file.id}>
              <ContextMenuTrigger asChild>
                <TableRow
                  className="cursor-pointer group"
                  onDoubleClick={() => handleDoubleClick(file)}
                >
                  <TableCell>
                    <div className="flex items-center justify-center">
                      <FileIcon type={file.type} size="sm" />
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="font-medium">
                        {highlightQuery
                          ? highlightMatch(file.name, highlightQuery)
                          : file.name}
                      </span>
                      {file.isFavorite && (
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground">
                    {file.owner}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {formatDate(file.modifiedAt)}
                  </TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {formatFileSize(file.size)}
                  </TableCell>
                </TableRow>
              </ContextMenuTrigger>
              <ContextMenuContent className="w-56">
                <FileContextMenuItems file={file} />
              </ContextMenuContent>
            </ContextMenu>
          ))}
        </TableBody>
      </Table>
    </div>
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
