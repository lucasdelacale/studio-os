"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { Plus, Trash2 } from "lucide-react"

interface TaskItem { id: string; text: string; checked: boolean; statusId?: string; order: number; parentId?: string }
interface Status { id: string; name: string; color: string }

export function TaskCard({ card }: { card: any }) {
  const [items, setItems] = useState<TaskItem[]>(card.taskContent?.items ?? [])
  const [statuses, setStatuses] = useState<Status[]>([])
  const [filterStatus, setFilterStatus] = useState<string>("all")

  useEffect(() => { fetch("/api/statuses").then(r => r.json()).then(setStatuses) }, [])

  const save = async (newItems: TaskItem[]) => {
    setItems(newItems)
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ taskContent: { items: newItems } }) })
  }

  const addItem = (parentId?: string) => {
    const newItem: TaskItem = { id: crypto.randomUUID(), text: "", checked: false, statusId: statuses[0]?.id, order: items.length, parentId }
    save([...items, newItem])
  }

  const toggleItem = (id: string) => save(items.map((i) => (i.id === id ? { ...i, checked: !i.checked } : i)))
  const updateText = (id: string, text: string) => save(items.map((i) => (i.id === id ? { ...i, text } : i)))
  const updateStatus = (id: string, statusId: string) => save(items.map((i) => (i.id === id ? { ...i, statusId } : i)))
  const removeItem = (id: string) => save(items.filter((i) => i.id !== id))

  const filtered = filterStatus === "all" ? items : items.filter((i) => i.statusId === filterStatus)
  const rootItems = filtered.filter(i => !i.parentId)
  const getChildItems = (parentId: string) => filtered.filter(i => i.parentId === parentId)
  const statusCounts = statuses.map((s) => ({ ...s, count: items.filter((i) => i.statusId === s.id).length }))
  const progress = items.length > 0 ? Math.round((items.filter(i => i.checked).length / items.length) * 100) : 0

  const renderItem = (item: TaskItem, depth: number = 0) => {
    const children = getChildItems(item.id)
    return (
      <div key={item.id}>
        <div className="flex items-center gap-2 group py-0.5" style={{ paddingLeft: `${depth * 16}px` }}>
          <Checkbox checked={item.checked} onCheckedChange={() => toggleItem(item.id)} />
          <input
            className={`flex-1 bg-transparent border-none outline-none text-sm ${item.checked ? "line-through text-muted-foreground" : ""}`}
            value={item.text}
            onChange={(e) => updateText(item.id, e.target.value)}
            placeholder="Nova tarefa..."
          />
          <select
            value={item.statusId ?? ""}
            onChange={(e) => updateStatus(item.id, e.target.value)}
            className="text-xs bg-muted rounded px-1 border-none opacity-0 group-hover:opacity-100"
          >
            {statuses.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <button onClick={() => addItem(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground">
            <Plus className="h-3 w-3" />
          </button>
          <button onClick={() => removeItem(item.id)} className="opacity-0 group-hover:opacity-100 text-muted-foreground">
            <Trash2 className="h-3 w-3" />
          </button>
        </div>
        {children.map(child => renderItem(child, depth + 1))}
      </div>
    )
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2 space-y-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          <span className="text-xs text-muted-foreground">{items.filter((i) => i.checked).length}/{items.length}</span>
        </div>
        {card.taskContent?.showProgress !== false && (
          <div className="w-full bg-muted rounded-full h-1.5">
            <div className="bg-primary h-1.5 rounded-full transition-all" style={{ width: `${progress}%` }} />
          </div>
        )}
        <div className="flex gap-1">
          {statusCounts.map((s) => (
            <button
              key={s.id}
              onClick={() => setFilterStatus(filterStatus === s.id ? "all" : s.id)}
              className="h-1.5 rounded-full flex-1"
              style={{ backgroundColor: s.color, opacity: filterStatus === "all" || filterStatus === s.id ? 1 : 0.3 }}
              title={`${s.name}: ${s.count}`}
            />
          ))}
        </div>
      </CardHeader>
      <CardContent className="space-y-1">
        {rootItems.sort((a, b) => a.order - b.order).map((item) => renderItem(item))}
        <Button variant="ghost" size="sm" onClick={() => addItem()} className="w-full text-xs mt-1">
          <Plus className="h-3 w-3 mr-1" /> Adicionar tarefa
        </Button>
      </CardContent>
    </Card>
  )
}
