"use client";

import AppSidebar from "@/components/app-sidebar";
import AppTopbar from "@/components/app-topbar";
import { FavoritesView } from "@/components/favorites-view";
import { FileExplorer } from "@/components/file-explorer";
import { RecentView } from "@/components/recent-view";
import { SearchResults } from "@/components/search-results";
import { TrashView } from "@/components/trash-view";
import { UploadModal } from "@/components/upload-modal";
import { useIsMobile } from "@/hooks/use-mobile";
import { useFileStore } from "@/lib/file-store";
import { useState } from "react";
import { Toaster } from "sonner";

type NavItem = "files" | "recent" | "favorites" | "trash";

export default function Home() {
  const [activeNav, setActiveNav] = useState<NavItem>("files");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const { isSearching, setIsSearching, setCurrentFolder } = useFileStore();
  const isMobile = useIsMobile();

  const handleNavChange = (item: NavItem) => {
    setActiveNav(item);
    setIsSearching(false);
    if (item === "files") {
      setCurrentFolder(null);
    }
  };

  const renderContent = () => {
    if (isSearching) {
      return <SearchResults />;
    }

    switch (activeNav) {
      case "files":
        return <FileExplorer onUploadClick={() => setIsUploadOpen(true)} />;
      case "recent":
        return <RecentView />;
      case "favorites":
        return <FavoritesView />;
      case "trash":
        return <TrashView />;
      default:
        return <FileExplorer onUploadClick={() => setIsUploadOpen(true)} />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar
        activeItem={activeNav}
        onItemChange={handleNavChange}
        isCollapsed={isSidebarCollapsed}
        onToggleCollapse={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
      />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        <AppTopbar
          onUploadClick={() => setIsUploadOpen(true)}
          onMobileMenuClick={() => setIsMobileNavOpen(true)}
          showMobileMenu={isMobile}
        />

        <main className="flex-1 overflow-y-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">{renderContent()}</div>
        </main>
      </div>

      {/* Upload Modal */}
      <UploadModal open={isUploadOpen} onOpenChange={setIsUploadOpen} />

      {/* Toast Notifications */}
      <Toaster position="bottom-right" richColors />
    </div>
  );
}
