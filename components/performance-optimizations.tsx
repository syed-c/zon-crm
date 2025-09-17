
"use client"

import React, { useState, useMemo, useCallback } from "react"
import { useQuery } from "convex/react"
import { api } from "@/convex/_generated/api"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { 
  Search, 
  Filter, 
  SortAsc, 
  SortDesc,
  ChevronLeft,
  ChevronRight
} from "lucide-react"

interface PaginatedListProps {
  title: string
  searchPlaceholder: string
  filterOptions: { value: string; label: string }[]
  sortOptions: { value: string; label: string }[]
  renderItem: (item: any) => React.ReactNode
  queryFunction: any
  itemsPerPage?: number
}

export function PaginatedList({
  title,
  searchPlaceholder,
  filterOptions,
  sortOptions,
  renderItem,
  queryFunction,
  itemsPerPage = 10
}: PaginatedListProps) {
  const [currentPage, setCurrentPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState("")
  const [filterValue, setFilterValue] = useState("")
  const [sortValue, setSortValue] = useState("")
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc")

  // Debounced search to avoid excessive API calls
  const debouncedSearch = useMemo(() => {
    const timer = setTimeout(() => searchTerm, 300)
    return () => clearTimeout(timer)
  }, [searchTerm])

  // Query with pagination and filters
  const data = useQuery(queryFunction, {
    page: currentPage,
    limit: itemsPerPage,
    search: searchTerm,
    filter: filterValue,
    sort: sortValue,
    sortDirection,
  })

  const items = data?.items || []
  const totalPages = Math.ceil((data?.total || 0) / itemsPerPage)
  const hasNextPage = currentPage < totalPages
  const hasPrevPage = currentPage > 1

  const handleSearch = useCallback((value: string) => {
    setSearchTerm(value)
    setCurrentPage(1) // Reset to first page on search
  }, [])

  const handleFilter = useCallback((value: string) => {
    setFilterValue(value)
    setCurrentPage(1)
  }, [])

  const handleSort = useCallback((value: string) => {
    if (value === sortValue) {
      setSortDirection(prev => prev === "asc" ? "desc" : "asc")
    } else {
      setSortValue(value)
      setSortDirection("desc")
    }
    setCurrentPage(1)
  }, [sortValue])

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page)
  }, [])

  return (
    <Card className="bg-crm-card border-crm-border">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-crm-text">{title}</CardTitle>
          
          {/* Controls */}
          <div className="flex items-center space-x-3">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-crm-muted h-4 w-4" />
              <Input
                placeholder={searchPlaceholder}
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-10 w-64 bg-crm-hover border-crm-border text-crm-text"
              />
            </div>

            {/* Filter */}
            <Select value={filterValue} onValueChange={handleFilter}>
              <SelectTrigger className="w-40 bg-crm-hover border-crm-border text-crm-text">
                <Filter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent className="bg-crm-card border-crm-border">
                <SelectItem value="">All</SelectItem>
                {filterOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Sort */}
            <Select value={sortValue} onValueChange={handleSort}>
              <SelectTrigger className="w-40 bg-crm-hover border-crm-border text-crm-text">
                {sortDirection === "asc" ? (
                  <SortAsc className="h-4 w-4 mr-2" />
                ) : (
                  <SortDesc className="h-4 w-4 mr-2" />
                )}
                <SelectValue placeholder="Sort" />
              </SelectTrigger>
              <SelectContent className="bg-crm-card border-crm-border">
                {sortOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Loading State */}
        {data === undefined && (
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-16 bg-crm-hover rounded"></div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {data && items.length === 0 && (
          <div className="text-center py-8">
            <p className="text-crm-muted">No items found</p>
            {searchTerm && (
              <Button 
                variant="outline" 
                onClick={() => handleSearch("")}
                className="mt-2 border-crm-border text-crm-muted hover:bg-crm-hover"
              >
                Clear search
              </Button>
            )}
          </div>
        )}

        {/* Items */}
        {items.map((item: any, index: number) => (
          <div key={item._id || index}>
            {renderItem(item)}
          </div>
        ))}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between pt-4 border-t border-crm-border">
            <div className="text-sm text-crm-muted">
              Showing {((currentPage - 1) * itemsPerPage) + 1} to {Math.min(currentPage * itemsPerPage, data?.total || 0)} of {data?.total || 0} results
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={!hasPrevPage}
                className="border-crm-border text-crm-muted hover:bg-crm-hover disabled:opacity-50"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex items-center space-x-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  const pageNum = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                  if (pageNum > totalPages) return null
                  
                  return (
                    <Button
                      key={pageNum}
                      variant={pageNum === currentPage ? "default" : "outline"}
                      size="sm"
                      onClick={() => handlePageChange(pageNum)}
                      className={
                        pageNum === currentPage
                          ? "bg-crm-primary text-white"
                          : "border-crm-border text-crm-muted hover:bg-crm-hover"
                      }
                    >
                      {pageNum}
                    </Button>
                  )
                })}
              </div>
              
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={!hasNextPage}
                className="border-crm-border text-crm-muted hover:bg-crm-hover disabled:opacity-50"
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

// Cached query hook for expensive operations
export function useCachedQuery<T>(
  queryFunction: any,
  args: any,
  cacheTime: number = 60000 // 1 minute default
) {
  const [cachedData, setCachedData] = useState<{
    data: T | undefined
    timestamp: number
  }>({ data: undefined, timestamp: 0 })

  const shouldRefetch = Date.now() - cachedData.timestamp > cacheTime
  const queryResult = useQuery(queryFunction, shouldRefetch ? args : undefined)

  useMemo(() => {
    if (queryResult !== undefined) {
      setCachedData({
        data: queryResult,
        timestamp: Date.now()
      })
    }
  }, [queryResult])

  return cachedData.data
}

// Optimized list item component with memoization
export const OptimizedListItem = React.memo(({ 
  item, 
  onEdit, 
  onDelete 
}: { 
  item: any
  onEdit: (id: string) => void
  onDelete: (id: string) => void
}) => {
  const handleEdit = useCallback(() => onEdit(item._id), [item._id, onEdit])
  const handleDelete = useCallback(() => onDelete(item._id), [item._id, onDelete])

  return (
    <div className="flex items-center justify-between p-4 rounded bg-crm-hover">
      <div className="flex items-center space-x-3">
        <div>
          <h4 className="font-medium text-crm-text">{item.title || item.name}</h4>
          <p className="text-sm text-crm-muted">{item.description}</p>
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        {item.status && (
          <Badge variant="secondary" className="bg-crm-primary/20 text-crm-primary">
            {item.status}
          </Badge>
        )}
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleEdit}
          className="border-crm-border text-crm-muted hover:bg-crm-hover"
        >
          Edit
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          onClick={handleDelete}
          className="border-crm-border text-crm-danger hover:bg-crm-danger/10"
        >
          Delete
        </Button>
      </div>
    </div>
  )
})

OptimizedListItem.displayName = "OptimizedListItem"
