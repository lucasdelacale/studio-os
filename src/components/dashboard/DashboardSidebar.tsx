"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Plus, Star, LayoutDashboard } from "lucide-react"
import Link from "next/link"

interface Dashboard { id: string; name: string; isDefault: boolean; isFavorite: boolean }

export function DashboardSidebar({ currentDashboardId }: { currentDashboardId: string }) {
  const [dashboards, setDashboards] = useState<Dashboard[]>([])

  useEffect(() => { fetch("/api/dashboards").then((r) => r.json()).then(setDashboards) }, [])

  const createDashboard = async () => {
    const res = await fetch("/api/dashboards", { method: "POST", body: JSON.stringify({ name: "Novo Dashboard" }) })
    const dashboard = await res.json()
    setDashboards((prev) => [...prev, dashboard])
  }

  return (
    <aside className="w-48 border-r p-2 space-y-1">
      <div className="flex items-center justify-between px-2 py-1">
        <span className="text-xs font-medium text-muted-foreground">Dashboards</span>
        <Button variant="ghost" size="icon" className="h-6 w-6" onClick={createDashboard}>
          <Plus className="h-3 w-3" />
        </Button>
      </div>
      {dashboards.map((d) => (
        <Link
          key={d.id}
          href={`/dashboard?d=${d.id}`}
          className={`flex items-center gap-2 px-2 py-1 rounded text-sm ${
            d.id === currentDashboardId ? "bg-primary text-primary-foreground" : "hover:bg-muted"
          }`}
        >
          <LayoutDashboard className="h-4 w-4" />
          <span className="truncate">{d.name}</span>
          {d.isDefault && <Star className="h-3 w-3 ml-auto fill-current" />}
        </Link>
      ))}
    </aside>
  )
}
