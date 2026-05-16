import React from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import { cn } from "@/lib/utils";
import {
  ChevronLeft,
  Clock,
  FolderOpen,
  HardDrive,
  Menu,
  Star,
  Trash2,
} from "lucide-react";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import { Progress } from "./ui/progress";

type NavItem = "files" | "recent" | "favorites" | "trash";

interface AppSidebarProps {
  activeItem: NavItem;
  onItemChange: (item: NavItem) => void;
  isCollapsed: boolean;
  onToggleCollapse: () => void;
}

const navItems = [
  { id: "files" as const, icon: FolderOpen, label: "My Files" },
  { id: "recent" as const, icon: Clock, label: "Recent" },
  { id: "favorites" as const, icon: Star, label: "Favorites" },
  { id: "trash" as const, icon: Trash2, label: "Trash" },
];

export default function AppSidebar({
  activeItem,
  onItemChange,
  isCollapsed,
  onToggleCollapse,
}: AppSidebarProps) {
  const usedStorage = 4.2; // GB
  const totalStorage = 15; // GB
  const storagePercent = (usedStorage / totalStorage) * 100;

  return (
    <TooltipProvider>
      <aside
        className={cn(
          "h-full flex flex-col bg-sidebar border-r border-border transition-all duration-300 ease-in-out",
          isCollapsed ? "w-16" : "w-64",
        )}
      >
        {/* Header */}
        <div className="flex h-16 items-center justify-between px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
                <HardDrive className="h-4 w-4 text-primary-foreground" />
              </div>
              <span className="font-semibold text-sidebar-foreground">
                CloudDrive
              </span>
            </div>
          )}
          <Button
            variant="ghost"
            size="icon"
            onClick={onToggleCollapse}
            className="h-8 w-8 text-sidebar-foreground"
          >
            {isCollapsed ? (
              <Menu className="h-4 w-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </Button>
        </div>

        <Separator className="bg-sidebar-border" />

        {/* Navigation */}
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => {
            const isActive = activeItem === item.id;
            const NavButton = (
              <Button
                key={item.id}
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start gap-3 text-sidebar-foreground transition-all",
                  isActive &&
                    "bg-sidebar-accent text-sidebar-accent-foreground",
                  isCollapsed && "justify-center px-2",
                )}
                onClick={() => onItemChange(item.id)}
              >
                <item.icon className="h-5 w-5 shrink-0" />
                {!isCollapsed && <span>{item.label}</span>}
              </Button>
            );

            if (isCollapsed) {
              return (
                <Tooltip key={item.id}>
                  <TooltipTrigger asChild>{NavButton}</TooltipTrigger>
                  <TooltipContent side="right" className="font-medium">
                    {item.label}
                  </TooltipContent>
                </Tooltip>
              );
            }

            return NavButton;
          })}
        </nav>

        {/* Storage Usage */}
        <div className="p-4">
          <Separator className="mb-4 bg-sidebar-border" />
          {isCollapsed ? (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex justify-center">
                  <div className="relative h-8 w-8">
                    <svg className="h-8 w-8 -rotate-90">
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        className="text-sidebar-accent"
                      />
                      <circle
                        cx="16"
                        cy="16"
                        r="14"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="3"
                        strokeDasharray={`${storagePercent * 0.88} 88`}
                        className="text-primary"
                      />
                    </svg>
                  </div>
                </div>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p className="font-medium">
                  {usedStorage} GB of {totalStorage} GB used
                </p>
              </TooltipContent>
            </Tooltip>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-sidebar-foreground/70">Storage</span>
                <span className="font-medium text-sidebar-foreground">
                  {usedStorage} GB / {totalStorage} GB
                </span>
              </div>
              <Progress value={storagePercent} className="h-2" />
              <p className="text-xs text-sidebar-foreground/60">
                {(totalStorage - usedStorage).toFixed(1)} GB free
              </p>
            </div>
          )}
        </div>
      </aside>
    </TooltipProvider>
  );
}
