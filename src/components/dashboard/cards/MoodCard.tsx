"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface MoodEntry { date: string; score: number; note?: string; triggers?: string[] }

const MOOD_EMOJIS = ["😫", "😟", "😐", "🙂", "😄"]
const TRIGGERS = ["Sono", "Exercício", "Estresse", "Alimentação", "Social", "Trabalho", "Lazer"]

export function MoodCard({ card }: { card: any }) {
  const [entries, setEntries] = useState<MoodEntry[]>(card.moodContent?.entries ?? [])
  const [selectedScore, setSelectedScore] = useState<number | null>(null)
  const [selectedTriggers, setSelectedTriggers] = useState<string[]>([])
  const [note, setNote] = useState("")

  const save = async (updated: MoodEntry[]) => {
    setEntries(updated)
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ moodContent: { entries: updated } }) })
  }

  const saveMood = () => {
    if (selectedScore === null) return
    const today = new Date().toISOString().split("T")[0]
    const entry: MoodEntry = { date: today, score: selectedScore, note, triggers: selectedTriggers }
    const existing = entries.findIndex((e) => e.date === today)
    let updated: MoodEntry[]
    if (existing >= 0) {
      updated = entries.map((e, i) => i === existing ? entry : e)
    } else {
      updated = [...entries, entry]
    }
    save(updated)
    setSelectedScore(null)
    setSelectedTriggers([])
    setNote("")
  }

  const todayEntry = entries.find((e) => e.date === new Date().toISOString().split("T")[0])

  const last7Days = useMemo(() => {
    const days = []
    for (let i = 6; i >= 0; i--) {
      const date = new Date()
      date.setDate(date.getDate() - i)
      const dateStr = date.toISOString().split("T")[0]
      const entry = entries.find((e) => e.date === dateStr)
      days.push({ date: dateStr, score: entry?.score ?? null })
    }
    return days
  }, [entries])

  const averageScore = useMemo(() => {
    const scores = entries.filter((e) => e.score).map((e) => e.score)
    return scores.length > 0 ? (scores.reduce((a, b) => a + b, 0) / scores.length).toFixed(1) : "-"
  }, [entries])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
      </CardHeader>
      <CardContent>
        {todayEntry ? (
          <div className="text-center mb-4">
            <div className="text-3xl mb-1">{MOOD_EMOJIS[todayEntry.score - 1]}</div>
            <div className="text-xs text-muted-foreground">Humor registrado hoje</div>
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex justify-center gap-2">
              {MOOD_EMOJIS.map((emoji, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedScore(i + 1)}
                  className={`text-2xl p-1 rounded ${selectedScore === i + 1 ? "bg-primary/20" : "hover:bg-muted"}`}
                >
                  {emoji}
                </button>
              ))}
            </div>
            {selectedScore && (
              <>
                <div className="flex flex-wrap gap-1 justify-center">
                  {TRIGGERS.map((trigger) => (
                    <button
                      key={trigger}
                      onClick={() => setSelectedTriggers((prev) => prev.includes(trigger) ? prev.filter((t) => t !== trigger) : [...prev, trigger])}
                      className={`text-xs px-2 py-1 rounded ${selectedTriggers.includes(trigger) ? "bg-primary text-primary-foreground" : "bg-muted"}`}
                    >
                      {trigger}
                    </button>
                  ))}
                </div>
                <Button size="sm" className="w-full" onClick={saveMood}>Salvar</Button>
              </>
            )}
          </div>
        )}

        <div className="mt-4">
          <div className="flex justify-between text-xs text-muted-foreground mb-1">
            <span>Últimos 7 dias</span>
            <span>Média: {averageScore}</span>
          </div>
          <div className="flex gap-1">
            {last7Days.map((day) => (
              <div
                key={day.date}
                className="flex-1 aspect-square flex items-center justify-center text-xs rounded"
                style={{ backgroundColor: day.score ? `hsl(${(day.score - 1) * 30}, 70%, 90%)` : undefined }}
              >
                {day.score ? MOOD_EMOJIS[day.score - 1] : "-"}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
