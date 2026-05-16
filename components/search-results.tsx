"use client"

import { useState } from "react"
import { Search, FileSearch } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useFileStore } from "@/lib/file-store"
import { FileGrid } from "./file-grid"
import { FileList } from "./file-list"
import { SearchFiltersPanel } from "./search-filters"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription } from "@/components/ui/empty"

export function SearchResults() {
  const [activeTab, setActiveTab] = useState<"all" | "files" | "folders">("all")
  const { getSearchResults, viewMode, searchQuery } = useFileStore()

  const results = getSearchResults()
  const files = results.filter((f) => f.type !== "folder")
  const folders = results.filter((f) => f.type === "folder")

  const displayedResults =
    activeTab === "all"
      ? results
      : activeTab === "files"
      ? files
      : folders

  return (
    <div className="flex flex-col gap-6">
      <SearchFiltersPanel />

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as typeof activeTab)}>
        <div className="flex items-center justify-between">
          <TabsList className="rounded-lg">
            <TabsTrigger value="all" className="gap-2 rounded-md">
              All
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {results.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="files" className="gap-2 rounded-md">
              Files
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {files.length}
              </span>
            </TabsTrigger>
            <TabsTrigger value="folders" className="gap-2 rounded-md">
              Folders
              <span className="rounded-full bg-muted px-2 py-0.5 text-xs">
                {folders.length}
              </span>
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={activeTab} className="mt-6">
          {displayedResults.length > 0 ? (
            viewMode === "grid" ? (
              <FileGrid files={displayedResults} highlightQuery={searchQuery} />
            ) : (
              <FileList files={displayedResults} highlightQuery={searchQuery} />
            )
          ) : (
            <Empty className="min-h-[400px]">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <FileSearch className="h-5 w-5" />
                </EmptyMedia>
                <EmptyTitle>No results found</EmptyTitle>
                <EmptyDescription>
                  {`We couldn't find any ${activeTab === "folders" ? "folders" : activeTab === "files" ? "files" : "items"} matching "${searchQuery}". Try adjusting your search or filters.`}
                </EmptyDescription>
              </EmptyHeader>
            </Empty>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
