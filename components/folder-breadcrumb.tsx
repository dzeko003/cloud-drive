"use client"

import { ChevronRight, Home } from "lucide-react"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { useFileStore } from "@/lib/file-store"
import { Fragment } from "react"

export function FolderBreadcrumb() {
  const { currentPath, navigateToPath } = useFileStore()

  return (
    <Breadcrumb>
      <BreadcrumbList>
        {currentPath.map((item, index) => {
          const isLast = index === currentPath.length - 1
          
          return (
            <Fragment key={item.id ?? "root"}>
              {index > 0 && (
                <BreadcrumbSeparator>
                  <ChevronRight className="h-4 w-4" />
                </BreadcrumbSeparator>
              )}
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="flex items-center gap-1.5 font-medium">
                    {index === 0 && <Home className="h-4 w-4" />}
                    {item.name}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink
                    onClick={() => navigateToPath(index)}
                    className="flex cursor-pointer items-center gap-1.5 hover:text-foreground"
                  >
                    {index === 0 && <Home className="h-4 w-4" />}
                    {item.name}
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
            </Fragment>
          )
        })}
      </BreadcrumbList>
    </Breadcrumb>
  )
}
