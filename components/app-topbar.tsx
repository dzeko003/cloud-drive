import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { useFileStore } from "@/lib/file-store";
import { useTheme } from "next-themes";
import { Button } from "./ui/button";
import { Grid3X3, List, Menu, Moon, Plus, Search, Sun } from "lucide-react";
import SearchBar from "./search-bar";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";

interface AppTopbarProps {
  onUploadClick: () => void;
  onMobileMenuClick?: () => void;
  showMobileMenu?: boolean;
}

export default function AppTopbar({
  onUploadClick,
  onMobileMenuClick,
  showMobileMenu,
}: AppTopbarProps) {
  const { viewMode, setViewMode, isSearching } = useFileStore();
  const { theme, setTheme } = useTheme();

  return (
    <TooltipProvider>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between gap-4 border-b bg-background/95 px-4 md:px-6 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        {/* Mobile Menu Button */}
        {showMobileMenu && (
          <Button
            variant="ghost"
            size="icon"
            className="shrink-0 md:hidden"
            onClick={onMobileMenuClick}
          >
            <Menu className="w-5 h-5" />
          </Button>
        )}

        <div className="flex-1 flex justify-center">
          <SearchBar />
        </div>

        <div className="flex items-center gap-2">
          {!isSearching && (
            <div className="flex items-center rounded-lg border bg-muted/50 p-1">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-md",
                      viewMode === "grid" && "bg-background shadow-sm",
                    )}
                    onClick={() => setViewMode("grid")}
                  >
                    <Grid3X3 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>Grid view</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                      "h-8 w-8 rounded-md",
                      viewMode === "list" && "bg-background shadow-sm",
                    )}
                    onClick={() => setViewMode("list")}
                  >
                    <List className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>List view</TooltipContent>
              </Tooltip>
            </div>
          )}

          {/* Theme Toggle */}
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="h-9 w-9"
              >
                <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>Toggle theme</TooltipContent>
          </Tooltip>

          {/* Upload Button */}
          <Button onClick={onUploadClick} className="gap-2 rounded-xl">
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">Upload</span>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="relative h-9 w-9 rounded-full"
              >
                <Avatar className="h-9 w-9">
                  <AvatarImage src="/placeholder-avatar.jpg" alt="User" />
                  <AvatarFallback className="bg-primary text-primary-foreground">
                    JD
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuLabel>
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-medium">John Doe</p>
                  <p className="text-xs text-muted-foreground">
                    john@example.com
                  </p>
                </div>
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Profile</DropdownMenuItem>
              <DropdownMenuItem>Settings</DropdownMenuItem>
              <DropdownMenuItem>Upgrade Plan</DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem>Sign out</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
    </TooltipProvider>
  );
}
