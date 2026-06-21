"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

export function CalendarCard({ card }: { card: any }) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay()

  const days = useMemo(() => {
    const result = []
    for (let i = 0; i < firstDayOfMonth; i++) {
      result.push({ day: 0, isCurrentMonth: false })
    }
    for (let i = 1; i <= daysInMonth; i++) {
      result.push({ day: i, isCurrentMonth: true })
    }
    return result
  }, [daysInMonth, firstDayOfMonth])

  const monthName = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" })

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))

  const isToday = (day: number) => {
    const today = new Date()
    return day === today.getDate() && currentDate.getMonth() === today.getMonth() && currentDate.getFullYear() === today.getFullYear()
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={prevMonth}>
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <span className="text-xs capitalize">{monthName}</span>
            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={nextMonth}>
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-1 text-center">
          {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
            <div key={d} className="text-xs text-muted-foreground font-medium">{d}</div>
          ))}
          {days.map((d, i) => (
            <div
              key={i}
              className={`aspect-square flex items-center justify-center text-xs rounded ${
                d.day === 0 ? "" : isToday(d.day) ? "bg-primary text-primary-foreground" : "hover:bg-muted"
              }`}
            >
              {d.day > 0 ? d.day : ""}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
