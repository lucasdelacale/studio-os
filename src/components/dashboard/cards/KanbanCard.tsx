"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface TaskItem { id: string; text: string; checked: boolean; statusId?: string; order: number }
interface Status { id: string; name: string; color: string }

export function KanbanCard({ card }: { card: any }) {
  const [items, setItems] = useState<TaskItem[]>(card.taskContent?.items ?? [])
  const [statuses, setStatuses] = useState<Status[]>([])

  useEffect(() => { fetch("/api/statuses").then(r => r.json()).then(setStatuses) }, [])

  const columns = statuses.map((status) => ({
    ...status,
    items: items.filter((item) => item.statusId === status.id),
  }))

  const unassigned = items.filter((item) => !item.statusId || !statuses.find((s) => s.id === item.statusId))

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 overflow-x-auto">
          {columns.map((column) => (
            <div key={column.id} className="min-w-[120px] flex-1">
              <div className="flex items-center gap-1 mb-2">
                <div className="w-2 h-2 rounded-full" style={{ backgroundColor: column.color }} />
                <span className="text-xs font-medium">{column.name}</span>
                <Badge variant="secondary" className="ml-auto text-[10px] h-4">{column.items.length}</Badge>
              </div>
              <div className="space-y-1">
                {column.items.map((item) => (
                  <div key={item.id} className="p-2 bg-muted rounded text-xs">
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          ))}
          {unassigned.length > 0 && (
            <div className="min-w-[120px] flex-1">
              <div className="flex items-center gap-1 mb-2">
                <span className="text-xs font-medium text-muted-foreground">Sem status</span>
                <Badge variant="secondary" className="ml-auto text-[10px] h-4">{unassigned.length}</Badge>
              </div>
              <div className="space-y-1">
                {unassigned.map((item) => (
                  <div key={item.id} className="p-2 bg-muted rounded text-xs">
                    {item.text}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
