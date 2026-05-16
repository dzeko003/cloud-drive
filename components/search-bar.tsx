import { Search } from "lucide-react";
import React, { useRef, useState } from "react";
import { Input } from "./ui/input";
import { useFileStore } from "@/lib/file-store";
import { cn } from "@/lib/utils";

export default function SearchBar() {
  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const { setSearchQuery, setIsSearching, files } = useFileStore();

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setIsSearching(true);
    setIsFocused(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && localQuery) {
      handleSearch(localQuery);
    }
    if (e.key === "Escape") {
      setIsFocused(false);
      inputRef.current?.blur();
    }
  };

  return (
    <div ref={containerRef} className="relative w-full max-w-2xl">
      {/* Search Input */}
      <div
        className={cn(
          "relative flex items-center rounded-xl border bg-background transition-all duration-200",
          isFocused
            ? "border-primary shadow-lg ring-4 ring-primary/10"
            : "border-input hover:border-primary/50",
        )}
      >
        <Search className="h-5 w-5 text-muted-foreground ml-4" />
        <Input
          ref={inputRef}
          type="text"
          placeholder="Search files and folders..."
          value={localQuery}
          onChange={(e) => setLocalQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          onKeyDown={handleKeyDown}
          className="border-0 bg-transparent text-base shadow-none placeholder:text-muted-foreground/60 focus-visible:ring-0"
        />
      </div>
    </div>
  );
}
