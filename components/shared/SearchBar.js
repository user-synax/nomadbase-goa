"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Building2, Home, MessageSquare, Loader2, MapPin } from "lucide-react"

export function SearchBar() {
  const [isOpen, setIsOpen] = useState(false)
  const [query, setQuery] = useState("")
  const [results, setResults] = useState({ spaces: [], colivings: [], threads: [] })
  const [isLoading, setIsLoading] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const [hasSearched, setHasSearched] = useState(false)
  const inputRef = useRef(null)
  const debounceRef = useRef(null)
  const router = useRouter()

  // Flatten all results for keyboard navigation
  const allResults = [
    ...results.spaces.map(s => ({ ...s, category: "Co-working Spaces" })),
    ...results.colivings.map(c => ({ ...c, category: "Colivings" })),
    ...results.threads.map(t => ({ ...t, category: "Community", name: t.title }))
  ]

  // Debounced search
  const performSearch = useCallback(async (searchQuery) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults({ spaces: [], colivings: [], threads: [] })
      setHasSearched(false)
      setIsLoading(false)
      return
    }

    setIsLoading(true)
    setHasSearched(true)

    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`)
      if (response.ok) {
        const data = await response.json()
        setResults(data)
      } else {
        setResults({ spaces: [], colivings: [], threads: [] })
      }
    } catch (error) {
      console.error("Search error:", error)
      setResults({ spaces: [], colivings: [], threads: [] })
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Handle input change with debounce
  const handleInputChange = (e) => {
    const value = e.target.value
    setQuery(value)
    setSelectedIndex(-1)

    if (debounceRef.current) {
      clearTimeout(debounceRef.current)
    }

    debounceRef.current = setTimeout(() => {
      performSearch(value)
    }, 300)
  }

  // Keyboard shortcut: Cmd/Ctrl+K to open
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setIsOpen(true)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  // Listen for custom event to open search from mobile menu
  useEffect(() => {
    const handleOpenSearch = () => {
      setIsOpen(true)
    }

    window.addEventListener("openSearch", handleOpenSearch)
    return () => window.removeEventListener("openSearch", handleOpenSearch)
  }, [])

  // Focus input when dialog opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
    }
  }, [isOpen])

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current)
      }
    }
  }, [])

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      setIsOpen(false)
      return
    }

    if (e.key === "ArrowDown") {
      e.preventDefault()
      setSelectedIndex(prev => 
        prev < allResults.length - 1 ? prev + 1 : prev
      )
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      setSelectedIndex(prev => prev > 0 ? prev - 1 : -1)
    } else if (e.key === "Enter" && selectedIndex >= 0) {
      e.preventDefault()
      const selected = allResults[selectedIndex]
      if (selected) {
        navigateToResult(selected)
      }
    }
  }

  const navigateToResult = (result) => {
    setIsOpen(false)
    setQuery("")
    setResults({ spaces: [], colivings: [], threads: [] })
    setSelectedIndex(-1)
    setHasSearched(false)

    switch (result.type) {
      case "space":
        router.push(`/spaces/${result.slug}`)
        break
      case "coliving":
        router.push(`/colivings/${result.slug}`)
        break
      case "thread":
        router.push(`/community/${result.slug}`)
        break
    }
  }

  const getIcon = (type) => {
    switch (type) {
      case "space":
        return <Building2 size={18} className="text-[#3ecf8e]" />
      case "coliving":
        return <Home size={18} className="text-[#3ecf8e]" />
      case "thread":
        return <MessageSquare size={18} className="text-[#3ecf8e]" />
      default:
        return <Search size={18} className="text-[#3ecf8e]" />
    }
  }

  const hasResults = results.spaces.length > 0 || results.colivings.length > 0 || results.threads.length > 0

  return (
    <>
      {/* Search Trigger Button */}
      <Button
        variant="ghost"
        size="icon-sm"
        onClick={() => setIsOpen(true)}
        className="text-[#fafafa] hover:text-[#3ecf8e] hover:bg-transparent"
        aria-label="Search"
      >
        <Search size={20} strokeWidth={2} />
      </Button>

      {/* Search Dialog */}
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent 
          className="max-w-2xl w-full p-0 gap-0 bg-[#171717] border-[#2e2e2e] rounded-[12px] overflow-hidden"
          showCloseButton={false}
          onKeyDown={handleKeyDown}
        >
          <DialogTitle className="sr-only">Search NomadBase Goa</DialogTitle>
          
          {/* Search Input Header */}
          <div className="flex items-center px-4 py-3 border-b border-[#2e2e2e]">
            <Search size={20} className="text-[#898989] mr-3 flex-shrink-0" />
            <Input
              ref={inputRef}
              type="text"
              placeholder="Search spaces, colivings, or community..."
              value={query}
              onChange={handleInputChange}
              className="flex-1 border-0 bg-transparent text-[#fafafa] placeholder:text-[#898989] focus-visible:ring-0 focus-visible:ring-offset-0 text-[16px]"
            />
            {isLoading && (
              <Loader2 size={18} className="text-[#898989] animate-spin ml-3 flex-shrink-0" />
            )}
            {!isLoading && query && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => {
                  setQuery("")
                  setResults({ spaces: [], colivings: [], threads: [] })
                  setHasSearched(false)
                  inputRef.current?.focus()
                }}
                className="ml-2 text-[#898989] hover:text-[#fafafa] hover:bg-[#2e2e2e]"
              >
                <X size={16} />
              </Button>
            )}
            <kbd className="hidden sm:inline-flex ml-3 px-2 py-1 text-[12px] font-mono text-[#898989] bg-[#0f0f0f] rounded border border-[#2e2e2e]">
              ESC
            </kbd>
          </div>

          {/* Results Area */}
          <div className="max-h-[60vh] overflow-y-auto">
            {!hasResults && hasSearched && query.length >= 2 && !isLoading && (
              <div className="px-4 py-8 text-center">
                <p className="text-[#b4b4b4] text-[14px]">
                  No results for &quot;<span className="text-[#fafafa]">{query}</span>&quot;
                </p>
              </div>
            )}

            {!hasSearched && query.length < 2 && (
              <div className="px-4 py-8 text-center">
                <p className="text-[#898989] text-[14px]">
                  Type at least 2 characters to search
                </p>
              </div>
            )}

            {/* Co-working Spaces */}
            {results.spaces.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-[12px] font-medium text-[#898989] uppercase tracking-wider">
                  Co-working Spaces
                </div>
                {results.spaces.map((space, index) => {
                  const globalIndex = index
                  return (
                    <button
                      key={space._id}
                      onClick={() => navigateToResult(space)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        selectedIndex === globalIndex
                          ? "bg-[#242424]"
                          : "hover:bg-[#1f1f1f]"
                      }`}
                    >
                      {getIcon("space")}
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="text-[14px] text-[#fafafa] truncate">
                          {space.name}
                        </div>
                        <div className="flex items-center text-[12px] text-[#898989]">
                          <MapPin size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{space.area}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Colivings */}
            {results.colivings.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-[12px] font-medium text-[#898989] uppercase tracking-wider">
                  Colivings
                </div>
                {results.colivings.map((coliving, index) => {
                  const globalIndex = results.spaces.length + index
                  return (
                    <button
                      key={coliving._id}
                      onClick={() => navigateToResult(coliving)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        selectedIndex === globalIndex
                          ? "bg-[#242424]"
                          : "hover:bg-[#1f1f1f]"
                      }`}
                    >
                      {getIcon("coliving")}
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="text-[14px] text-[#fafafa] truncate">
                          {coliving.name}
                        </div>
                        <div className="flex items-center text-[12px] text-[#898989]">
                          <MapPin size={12} className="mr-1 flex-shrink-0" />
                          <span className="truncate">{coliving.area}</span>
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}

            {/* Community */}
            {results.threads.length > 0 && (
              <div className="py-2">
                <div className="px-4 py-2 text-[12px] font-medium text-[#898989] uppercase tracking-wider">
                  Community
                </div>
                {results.threads.map((thread, index) => {
                  const globalIndex = results.spaces.length + results.colivings.length + index
                  return (
                    <button
                      key={thread._id}
                      onClick={() => navigateToResult(thread)}
                      onMouseEnter={() => setSelectedIndex(globalIndex)}
                      className={`w-full flex items-center px-4 py-3 text-left transition-colors ${
                        selectedIndex === globalIndex
                          ? "bg-[#242424]"
                          : "hover:bg-[#1f1f1f]"
                      }`}
                    >
                      {getIcon("thread")}
                      <div className="ml-3 flex-1 min-w-0">
                        <div className="text-[14px] text-[#fafafa] truncate">
                          {thread.title}
                        </div>
                        <div className="text-[12px] text-[#898989]">
                          Discussion
                        </div>
                      </div>
                    </button>
                  )
                })}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 bg-[#0f0f0f] border-t border-[#2e2e2e] flex items-center justify-between text-[12px] text-[#898989]">
            <div className="flex items-center space-x-4">
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-[#171717] rounded border border-[#2e2e2e] mr-1">↑</kbd>
                <kbd className="px-1.5 py-0.5 bg-[#171717] rounded border border-[#2e2e2e] mr-1">↓</kbd>
                <span>to navigate</span>
              </span>
              <span className="flex items-center">
                <kbd className="px-1.5 py-0.5 bg-[#171717] rounded border border-[#2e2e2e] mr-1">↵</kbd>
                <span>to select</span>
              </span>
            </div>
            <span className="flex items-center">
              <kbd className="px-1.5 py-0.5 bg-[#171717] rounded border border-[#2e2e2e] mr-1">esc</kbd>
              <span>to close</span>
            </span>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
