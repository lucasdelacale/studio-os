"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Play, Pause, RotateCcw } from "lucide-react"

interface TimerSession { id: string; start: string; end?: string; duration: number }

export function TimerCard({ card }: { card: any }) {
  const [sessions, setSessions] = useState<TimerSession[]>(card.timerContent?.sessions ?? [])
  const [totalMinutes, setTotalMinutes] = useState(card.timerContent?.totalMinutes ?? 0)
  const [isRunning, setIsRunning] = useState(false)
  const [timeLeft, setTimeLeft] = useState(25 * 60)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<string>("")

  const focusDuration = 25 * 60

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && isRunning) {
      handleSessionEnd()
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [isRunning, timeLeft])

  const startTimer = () => {
    startTimeRef.current = new Date().toISOString()
    setIsRunning(true)
  }

  const pauseTimer = () => {
    setIsRunning(false)
  }

  const resetTimer = () => {
    setIsRunning(false)
    setTimeLeft(focusDuration)
  }

  const handleSessionEnd = async () => {
    setIsRunning(false)
    const newSession: TimerSession = {
      id: crypto.randomUUID(),
      start: startTimeRef.current,
      end: new Date().toISOString(),
      duration: focusDuration / 60,
    }
    const updatedSessions = [...sessions, newSession]
    setSessions(updatedSessions)
    setTotalMinutes((prev: number) => prev + focusDuration / 60)
    setTimeLeft(focusDuration)

    await fetch(`/api/cards/${card.id}`, {
      method: "PUT",
      body: JSON.stringify({ timerContent: { sessions: updatedSessions, totalMinutes: totalMinutes + focusDuration / 60 } }),
    })
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const todaySessions = sessions.filter(s => {
    const sessionDate = new Date(s.start).toDateString()
    return sessionDate === new Date().toDateString()
  })

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="text-4xl font-mono font-bold mb-4">{formatTime(timeLeft)}</div>
        <div className="flex gap-2 mb-4">
          {!isRunning ? (
            <Button onClick={startTimer} size="sm"><Play className="h-4 w-4 mr-1" /> Iniciar</Button>
          ) : (
            <Button onClick={pauseTimer} size="sm" variant="outline"><Pause className="h-4 w-4 mr-1" /> Pausar</Button>
          )}
          <Button onClick={resetTimer} size="sm" variant="ghost"><RotateCcw className="h-4 w-4" /></Button>
        </div>
        <div className="text-xs text-muted-foreground">
          {todaySessions.length} sessões hoje · {totalMinutes} min total
        </div>
      </CardContent>
    </Card>
  )
}
