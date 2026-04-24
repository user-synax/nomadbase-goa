"use client"

import { useState } from "react"
import { useSession, signOut } from "next-auth/react"
import Link from "next/link"
import { motion, AnimatePresence } from "framer-motion"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Menu, LogOut, X, ChevronDown } from "lucide-react"
import { SearchBar } from "./SearchBar"

const navLinks = [
  { href: "/spaces", label: "Spaces" },
  { href: "/colivings", label: "Colivings" },
  { href: "/assistant", label: "Assistant" },
  { href: "/community", label: "Community" },
]

export function Navbar() {
  const { data: session, status } = useSession()
  const [isOpen, setIsOpen] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 h-15" style={{ backgroundColor: "#171717", borderBottom: "1px solid #242424" }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-14">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-1">
            <span className="text-[18px] font-medium text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              NomadBase
            </span>
            <span className="text-[18px] font-medium text-[#3ecf8e]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
              .goa
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[14px] font-medium transition-colors text-[#fafafa] hover:text-[#3ecf8e]"
                style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Right Side - Search + Auth */}
          <div className="flex items-center space-x-2">
            {/* Search Bar - Desktop & Mobile */}
            <SearchBar />

            {status === "loading" ? (
              <div className="w-8 h-8 rounded-full bg-[#2e2e2e] animate-pulse" />
            ) : session ? (
              <div className="hidden md:flex items-center space-x-3">
                <div className="relative">
                  <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
                  >
                    <Avatar size="sm">
                      <AvatarFallback className="text-xs font-semibold bg-[#3ecf8e] text-[#fafafa]">
                        {session.user?.name?.[0] || "U"}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                      {session.user?.name}
                    </span>
                    <ChevronDown size={14} className="text-[#fafafa]" />
                  </button>
                  
                  {/* Dropdown Menu */}
                  {isDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-48 bg-[#0f0f0f] border border-[#2e2e2e] rounded-[8px] shadow-lg py-1 z-50">
                      <button
                        onClick={() => {
                          signOut()
                          setIsDropdownOpen(false)
                        }}
                        className="flex items-center w-full px-4 py-2 text-sm text-[#fafafa] hover:bg-[#171717] transition-colors"
                        style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                      >
                        <LogOut size={16} className="mr-2" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="hidden md:block">
                <Button
                  asChild
                  className="px-8 py-2 text-[14px] leading-[1.14] font-medium text-[#fafafa] border border-[#fafafa] rounded-[9999px] hover:text-[#fafafa]"
                  style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", backgroundColor: "#0f0f0f" }}
                >
                  <Link href="/signin">Sign In</Link>
                </Button>
              </div>
            )}

            {/* Mobile Menu */}
            <Sheet open={isOpen} onOpenChange={setIsOpen}>
              <SheetTrigger asChild className="md:hidden ml-2">
                <Button variant="ghost" size="icon-sm" className="text-[#fafafa]">
                  <Menu size={20} strokeWidth={2} />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[320px] bg-[#171717] border-none" style={{ padding: "24px" }}>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex flex-col space-y-6 mt-8"
                    >
                      {/* Mobile Search Trigger */}
                      <button
                        onClick={() => {
                          setIsOpen(false)
                          // Trigger search via custom event
                          window.dispatchEvent(new CustomEvent("openSearch"))
                        }}
                        className="flex items-center space-x-3 text-[18px] font-medium transition-colors text-[#fafafa] hover:text-[#00c573]"
                        style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                      >
                        <span>Search</span>
                        <kbd className="px-2 py-1 text-[12px] bg-[#0f0f0f] rounded border border-[#2e2e2e]">
                          ⌘K
                        </kbd>
                      </button>

                      {/* Mobile Nav Links */}
                      <div className="flex flex-col space-y-4">
                        {navLinks.map((link) => (
                          <Link
                            key={link.href}
                            href={link.href}
                            onClick={() => setIsOpen(false)}
                            className="text-[18px] font-medium transition-colors text-[#fafafa] hover:text-[#00c573]"
                            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}
                          >
                            {link.label}
                          </Link>
                        ))}
                      </div>

                      {/* Mobile Auth */}
                      <div className="pt-4 border-t border-[#242424]">
                        {session ? (
                          <div className="flex flex-col space-y-4">
                            <div className="flex items-center space-x-3">
                              <Avatar size="default">
                                <AvatarFallback className="font-semibold bg-[#3ecf8e] text-[#fafafa]">
                                  {session.user?.name?.[0] || "U"}
                                </AvatarFallback>
                              </Avatar>
                              <div className="flex flex-col">
                                <span className="text-[16px] font-medium text-[#fafafa]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                                  {session.user?.name}
                                </span>
                                <span className="text-[12px] text-[#898989]" style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif" }}>
                                  {session.user?.email}
                                </span>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              onClick={() => {
                                signOut()
                                setIsOpen(false)
                              }}
                              className="justify-start text-[#fafafa]"
                            >
                              <LogOut size={18} strokeWidth={2} className="mr-2" />
                              Sign Out
                            </Button>
                          </div>
                        ) : (
                          <Button
                            asChild
                            className="w-full px-8 py-2 text-[14px] leading-[1.14] font-medium text-[#fafafa] border border-[#fafafa] rounded-[9999px] hover:text-[#fafafa]"
                            style={{ fontFamily: "Circular, custom-font, Helvetica Neue, Helvetica, Arial, sans-serif", backgroundColor: "#0f0f0f" }}
                          >
                            <Link href="/signin" onClick={() => setIsOpen(false)}>
                              Sign In
                            </Link>
                          </Button>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
