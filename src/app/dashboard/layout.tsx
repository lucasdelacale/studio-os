"use client"

import { useState, useEffect } from "react"
import { DashboardHeader } from "@/components/dashboard/DashboardHeader"
import { DashboardSidebar } from "@/components/dashboard/DashboardSidebar"
import { SearchModal } from "@/components/dashboard/SearchModal"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [searchOpen, setSearchOpen] = useState(false)
  const [currentDashboardId, setCurrentDashboardId] = useState("")

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault()
        setSearchOpen(true)
      }
    }
    document.addEventListener("keydown", handleKeyDown)
    return () => document.removeEventListener("keydown", handleKeyDown)
  }, [])

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <DashboardHeader user={{ name: null, image: null }} />
      <div className="flex flex-1">
        <DashboardSidebar currentDashboardId={currentDashboardId} />
        <main className="flex-1 p-6 overflow-auto">{children}</main>
      </div>
      <SearchModal open={searchOpen} onOpenChange={setSearchOpen} />
    </div>
  )
}
