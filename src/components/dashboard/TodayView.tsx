"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Calendar, Target, Smile } from "lucide-react"

interface Card { id: string; type: string; title: string; taskContent?: any; habitContent?: any; moodContent?: any }

export function TodayView() {
  const [cards, setCards] = useState<Card[]>([])

  useEffect(() => { fetch("/api/cards").then((r) => r.json()).then(setCards) }, [])

  const today = new Date().toISOString().split("T")[0]
  const taskCards = cards.filter((c) => c.type === "task")
  const habitCards = cards.filter((c) => c.type === "habit")
  const moodCard = cards.find((c) => c.type === "mood")

  const todayMood = moodCard?.moodContent?.entries?.find((e: any) => e.date === today)
  const MOOD_EMOJIS = ["😫", "😟", "😐", "🙂", "😄"]

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Hoje</h2>

      {todayMood && (
        <Card>
          <CardContent className="pt-4">
            <div className="flex items-center gap-2">
              <Smile className="h-4 w-4" />
              <span className="text-sm">Humor de hoje: {MOOD_EMOJIS[todayMood.score - 1]}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {taskCards.map((card) => {
        const items = card.taskContent?.items ?? []
        const todayTasks = items.filter((item: any) => !item.checked).slice(0, 3)
        if (todayTasks.length === 0) return null
        return (
          <Card key={card.id}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                {card.title}
              </CardTitle>
            </CardHeader>
            <CardContent>
              {todayTasks.map((task: any) => (
                <div key={task.id} className="flex items-center gap-2 py-1">
                  <Checkbox />
                  <span className="text-sm">{task.text}</span>
                </div>
              ))}
            </CardContent>
          </Card>
        )
      })}

      {habitCards.map((card) => {
        const logs = card.habitContent?.logs ?? []
        const todayLog = logs.find((l: any) => l.date === today)
        return (
          <Card key={card.id}>
            <CardContent className="pt-4">
              <div className="flex items-center gap-2">
                <Target className="h-4 w-4" />
                <span className="text-sm">{card.title}</span>
                <span className={`ml-auto text-xs ${todayLog?.done ? "text-green-500" : "text-muted-foreground"}`}>
                  {todayLog?.done ? "Feito" : "Pendente"}
                </span>
              </div>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
