"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

interface HabitLog { date: string; done: boolean }

export function HabitCard({ card }: { card: any }) {
  const [logs, setLogs] = useState<HabitLog[]>(card.habitContent?.logs ?? [])

  const save = async (newLogs: HabitLog[]) => {
    setLogs(newLogs)
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ habitContent: { logs: newLogs } }) })
  }

  const last30Days = useMemo(() => {
    const days: { date: string; done: boolean }[] = []
    for (let i = 29; i >= 0; i--) {
      const date = new Date(); date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const log = logs.find((l) => l.date === dateStr)
      days.push({ date: dateStr, done: log?.done ?? false })
    }
    return days
  }, [logs])

  const toggleDay = (dateStr: string) => {
    const exists = logs.find((l) => l.date === dateStr)
    if (exists) {
      save(logs.map((l) => (l.date === dateStr ? { ...l, done: !l.done } : l)))
    } else {
      save([...logs, { date: dateStr, done: true }])
    }
  }

  const streak = useMemo(() => {
    let count = 0
    const today = new Date().toISOString().split("T")[0]
    for (let i = 0; i < 30; i++) {
      const date = new Date(); date.setDate(date.getDate() - i)
      const log = logs.find((l) => l.date === date.toISOString().split("T")[0])
      if (log?.done) count++
      else if (date.toISOString().split("T")[0] !== today) break
    }
    return count
  }, [logs])

  const rate30 = useMemo(() => Math.round((last30Days.filter((d) => d.done).length / 30) * 100), [last30Days])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl font-bold">{streak}</span>
          <span className="text-sm text-muted-foreground">dias seguidos</span>
          <span className="ml-auto text-sm text-muted-foreground">{rate30}%</span>
        </div>
        <div className="grid grid-cols-10 gap-1">
          {last30Days.map((day) => (
            <button
              key={day.date}
              onClick={() => toggleDay(day.date)}
              className={`aspect-square rounded-sm text-[8px] ${day.done ? "bg-green-500" : "bg-muted"}`}
              title={new Date(day.date).toLocaleDateString("pt-BR")}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
