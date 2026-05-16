"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";

import type {
  FileItem,
  ViewMode,
  SortBy,
  SortOrder,
  SearchFilters,
  UploadingFile,
} from "./types";

import { mockFiles } from "./mock-data";

interface FileStore {
  files: FileItem[];
  currentFolderId: string | null;
  currentPath: { id: string | null; name: string }[];
  viewMode: ViewMode;
  sortBy: SortBy;
  sortOrder: SortOrder;
  searchQuery: string;
  searchFilters: SearchFilters;
  isSearching: boolean;
  uploadingFiles: UploadingFile[];

  // Actions
  setCurrentFolder: (folderId: string | null) => void;
  navigateToPath: (index: number) => void;
  setViewMode: (mode: ViewMode) => void;
  setSortBy: (sort: SortBy) => void;
  setSortOrder: (order: SortOrder) => void;
  setSearchQuery: (query: string) => void;
  setSearchFilters: (filters: SearchFilters) => void;
  setIsSearching: (searching: boolean) => void;
  toggleFavorite: (fileId: string) => void;
  deleteFile: (fileId: string) => void;
  restoreFile: (fileId: string) => void;
  permanentlyDelete: (fileId: string) => void;
  renameFile: (fileId: string, newName: string) => void;
  createFolder: (name: string) => void;
  createFile: (name: string, type: FileItem["type"]) => void;
  addUploadingFile: (file: UploadingFile) => void;
  updateUploadProgress: (
    fileId: string,
    progress: number,
    status?: UploadingFile["status"],
  ) => void;
  removeUploadingFile: (fileId: string) => void;
  getCurrentFiles: () => FileItem[];
  getSearchResults: () => FileItem[];
  getFavorites: () => FileItem[];
  getRecent: () => FileItem[];
  getTrash: () => FileItem[];
}

const FileStoreContext = createContext<FileStore | null>(null);

export function FileStoreProvider({ children }: { children: ReactNode }) {
  const [files, setFiles] = useState<FileItem[]>(mockFiles);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [currentPath, setCurrentPath] = useState<
    { id: string | null; name: string }[]
  >([{ id: null, name: "My Files" }]);
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchFilters, setSearchFilters] = useState<SearchFilters>({
    fileType: "all",
    dateModified: "any",
    owner: "all",
    size: "any",
  });
  const [isSearching, setIsSearching] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFile[]>([]);

  const setCurrentFolder = useCallback(
    (folderId: string | null) => {
      setCurrentFolderId(folderId);
      if (folderId === null) {
        setCurrentPath([{ id: null, name: "My Files" }]);
      } else {
        const folder = files.find((f) => f.id === folderId);
        if (folder) {
          const newPath = [{ id: null, name: "My Files" }];
          folder.path.forEach((pathName, index) => {
            const pathFolder = files.find(
              (f) => f.name === pathName && f.type === "folder",
            );
            if (pathFolder) {
              newPath.push({ id: pathFolder.id, name: pathFolder.name });
            }
          });
          newPath.push({ id: folderId, name: folder.name });
          setCurrentPath(newPath);
        }
      }
    },
    [files],
  );

  const navigateToPath = useCallback(
    (index: number) => {
      const pathItem = currentPath[index];
      if (pathItem) {
        setCurrentFolderId(pathItem.id);
        setCurrentPath(currentPath.slice(0, index + 1));
      }
    },
    [currentPath],
  );

  const toggleFavorite = useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, isFavorite: !f.isFavorite } : f,
      ),
    );
  }, []);

  const deleteFile = useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isDeleted: true } : f)),
    );
  }, []);

  const restoreFile = useCallback((fileId: string) => {
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f, isDeleted: false } : f)),
    );
  }, []);

  const permanentlyDelete = useCallback((fileId: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const renameFile = useCallback((fileId: string, newName: string) => {
    setFiles((prev) =>
      prev.map((f) =>
        f.id === fileId ? { ...f, name: newName, modifiedAt: new Date() } : f,
      ),
    );
  }, []);

  const createFolder = useCallback(
    (name: string) => {
      const newFolder: FileItem = {
        id: `folder-${Date.now()}`,
        name,
        type: "folder",
        size: 0,
        modifiedAt: new Date(),
        createdAt: new Date(),
        owner: "You",
        parentId: currentFolderId,
        path: currentPath.slice(1).map((p) => p.name),
        isFavorite: false,
        isDeleted: false,
      };
      setFiles((prev) => [...prev, newFolder]);
    },
    [currentFolderId, currentPath],
  );

  const createFile = useCallback(
    (name: string, type: FileItem["type"]) => {
      const newFile: FileItem = {
        id: `file-${Date.now()}`,
        name,
        type,
        size: Math.floor(Math.random() * 1000000) + 1000, // Random size for simulation
        modifiedAt: new Date(),
        createdAt: new Date(),
        owner: "You",
        parentId: currentFolderId,
        path: currentPath.slice(1).map((p) => p.name),
        isFavorite: false,
        isDeleted: false,
      };
      setFiles((prev) => [...prev, newFile]);
    },
    [currentFolderId, currentPath],
  );

  const addUploadingFile = useCallback((file: UploadingFile) => {
    setUploadingFiles((prev) => [...prev, file]);
  }, []);

  const updateUploadProgress = useCallback(
    (fileId: string, progress: number, status?: UploadingFile["status"]) => {
      setUploadingFiles((prev) =>
        prev.map((f) =>
          f.id === fileId ? { ...f, progress, status: status || f.status } : f,
        ),
      );
    },
    [],
  );

  const removeUploadingFile = useCallback((fileId: string) => {
    setUploadingFiles((prev) => prev.filter((f) => f.id !== fileId));
  }, []);

  const sortFiles = useCallback(
    (filesToSort: FileItem[]) => {
      return [...filesToSort].sort((a, b) => {
        // Folders always come first
        if (a.type === "folder" && b.type !== "folder") return -1;
        if (a.type !== "folder" && b.type === "folder") return 1;

        let comparison = 0;
        switch (sortBy) {
          case "name":
            comparison = a.name.localeCompare(b.name);
            break;
          case "date":
            comparison = a.modifiedAt.getTime() - b.modifiedAt.getTime();
            break;
          case "size":
            comparison = a.size - b.size;
            break;
        }
        return sortOrder === "asc" ? comparison : -comparison;
      });
    },
    [sortBy, sortOrder],
  );

  const getCurrentFiles = useCallback(() => {
    const filtered = files.filter(
      (f) => f.parentId === currentFolderId && !f.isDeleted,
    );
    return sortFiles(filtered);
  }, [files, currentFolderId, sortFiles]);

  const getSearchResults = useCallback(() => {
    if (!searchQuery.trim()) return [];

    let results = files.filter((f) => {
      if (f.isDeleted) return false;
      const matchesQuery = f.name
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      if (!matchesQuery) return false;

      // Apply filters
      if (
        searchFilters.fileType !== "all" &&
        f.type !== searchFilters.fileType
      ) {
        return false;
      }

      if (searchFilters.dateModified !== "any") {
        const now = new Date();
        const fileDate = new Date(f.modifiedAt);
        switch (searchFilters.dateModified) {
          case "today":
            if (fileDate.toDateString() !== now.toDateString()) return false;
            break;
          case "week":
            const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
            if (fileDate < weekAgo) return false;
            break;
          case "month":
            const monthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
            if (fileDate < monthAgo) return false;
            break;
          case "year":
            const yearAgo = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
            if (fileDate < yearAgo) return false;
            break;
        }
      }

      if (searchFilters.owner !== "all" && f.owner !== searchFilters.owner) {
        return false;
      }

      if (searchFilters.size !== "any") {
        switch (searchFilters.size) {
          case "small":
            if (f.size > 1000000) return false; // < 1MB
            break;
          case "medium":
            if (f.size <= 1000000 || f.size > 100000000) return false; // 1MB - 100MB
            break;
          case "large":
            if (f.size <= 100000000) return false; // > 100MB
            break;
        }
      }

      return true;
    });

    return sortFiles(results);
  }, [files, searchQuery, searchFilters, sortFiles]);

  const getFavorites = useCallback(() => {
    const filtered = files.filter((f) => f.isFavorite && !f.isDeleted);
    return sortFiles(filtered);
  }, [files, sortFiles]);

  const getRecent = useCallback(() => {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
    const filtered = files.filter(
      (f) => !f.isDeleted && new Date(f.modifiedAt) >= thirtyDaysAgo,
    );
    return filtered.sort(
      (a, b) =>
        new Date(b.modifiedAt).getTime() - new Date(a.modifiedAt).getTime(),
    );
  }, [files]);

  const getTrash = useCallback(() => {
    return files.filter((f) => f.isDeleted);
  }, [files]);

  const value: FileStore = {
    files,
    currentFolderId,
    currentPath,
    viewMode,
    sortBy,
    sortOrder,
    searchQuery,
    searchFilters,
    isSearching,
    uploadingFiles,
    setCurrentFolder,
    navigateToPath,
    setViewMode,
    setSortBy,
    setSortOrder,
    setSearchQuery,
    setSearchFilters,
    setIsSearching,
    toggleFavorite,
    deleteFile,
    restoreFile,
    permanentlyDelete,
    renameFile,
    createFolder,
    createFile,
    addUploadingFile,
    updateUploadProgress,
    removeUploadingFile,
    getCurrentFiles,
    getSearchResults,
    getFavorites,
    getRecent,
    getTrash,
  };

  return (
    <FileStoreContext.Provider value={value}>
      {children}
    </FileStoreContext.Provider>
  );
}

export function useFileStore() {
  const context = useContext(FileStoreContext);
  if (!context) {
    throw new Error("useFileStore must be used within a FileStoreProvider");
  }
  return context;
}
