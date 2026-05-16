"use client";

import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFileStore } from "@/lib/file-store";
import type { SearchFilters } from "@/lib/types";
import { Badge } from "@/components/ui/badge";

export function SearchFiltersPanel() {
  const {
    searchFilters,
    setSearchFilters,
    searchQuery,
    setSearchQuery,
    setIsSearching,
  } = useFileStore();

  const updateFilter = <K extends keyof SearchFilters>(
    key: K,
    value: SearchFilters[K],
  ) => {
    setSearchFilters({ ...searchFilters, [key]: value });
  };

  const clearAllFilters = () => {
    setSearchFilters({
      fileType: "all",
      dateModified: "any",
      owner: "all",
      size: "any",
    });
  };

  const clearSearch = () => {
    setSearchQuery("");
    setIsSearching(false);
    clearAllFilters();
  };

  const hasActiveFilters =
    searchFilters.fileType !== "all" ||
    searchFilters.dateModified !== "any" ||
    searchFilters.owner !== "all" ||
    searchFilters.size !== "any";

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
        <Filter className="h-4 w-4" />
        <span>Filters</span>
      </div>

      {/* File Type */}
      <Select
        value={searchFilters.fileType}
        onValueChange={(value) =>
          updateFilter("fileType", value as SearchFilters["fileType"])
        }
      >
        <SelectTrigger className="h-9 w-[130px] rounded-lg">
          <SelectValue placeholder="Type" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Types</SelectItem>
          <SelectItem value="image">Images</SelectItem>
          <SelectItem value="video">Videos</SelectItem>
          <SelectItem value="document">Documents</SelectItem>
          <SelectItem value="pdf">PDFs</SelectItem>
          <SelectItem value="spreadsheet">Spreadsheets</SelectItem>
          <SelectItem value="audio">Audio</SelectItem>
          <SelectItem value="folder">Folders</SelectItem>
        </SelectContent>
      </Select>

      {/* Date Modified */}
      <Select
        value={searchFilters.dateModified}
        onValueChange={(value) =>
          updateFilter("dateModified", value as SearchFilters["dateModified"])
        }
      >
        <SelectTrigger className="h-9 w-[130px] rounded-lg">
          <SelectValue placeholder="Date" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Time</SelectItem>
          <SelectItem value="today">Today</SelectItem>
          <SelectItem value="week">This Week</SelectItem>
          <SelectItem value="month">This Month</SelectItem>
          <SelectItem value="year">This Year</SelectItem>
        </SelectContent>
      </Select>

      {/* Owner */}
      <Select
        value={searchFilters.owner}
        onValueChange={(value) =>
          updateFilter("owner", value as SearchFilters["owner"])
        }
      >
        <SelectTrigger className="h-9 w-[130px] rounded-lg">
          <SelectValue placeholder="Owner" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Owners</SelectItem>
          <SelectItem value="me">Me</SelectItem>
          <SelectItem value="Team">Team</SelectItem>
          <SelectItem value="John Doe">John Doe</SelectItem>
          <SelectItem value="Jane Smith">Jane Smith</SelectItem>
        </SelectContent>
      </Select>

      {/* Size */}
      <Select
        value={searchFilters.size}
        onValueChange={(value) =>
          updateFilter("size", value as SearchFilters["size"])
        }
      >
        <SelectTrigger className="h-9 w-[130px] rounded-lg">
          <SelectValue placeholder="Size" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="any">Any Size</SelectItem>
          <SelectItem value="small">{"< 1 MB"}</SelectItem>
          <SelectItem value="medium">1 - 100 MB</SelectItem>
          <SelectItem value="large">{"> 100 MB"}</SelectItem>
        </SelectContent>
      </Select>

      {/* Clear Filters */}
      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearAllFilters}
          className="h-9 gap-1 text-muted-foreground"
        >
          <X className="h-4 w-4" />
          Clear filters
        </Button>
      )}

      {/* Search Query Badge */}
      {searchQuery && (
        <div className="ml-auto flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Searching for:</span>
          <Badge variant="secondary" className="gap-1 rounded-lg px-3 py-1">
            {searchQuery}
            <button
              onClick={clearSearch}
              className="ml-1 rounded-full hover:bg-background/50"
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        </div>
      )}
    </div>
  );
}
