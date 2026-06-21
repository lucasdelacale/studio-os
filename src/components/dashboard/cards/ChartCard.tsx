"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts"

export function ChartCard({ card }: { card: any }) {
  const [sourceCard, setSourceCard] = useState<any>(null)
  const chartConfig = card.chartContent
  const chartType = chartConfig?.chartType ?? "count"

  useEffect(() => {
    if (chartConfig?.sourceCardId) {
      fetch("/api/cards").then((r) => r.json()).then((cards) => {
        setSourceCard(cards.find((c: any) => c.id === chartConfig.sourceCardId) ?? null)
      })
    }
  }, [chartConfig?.sourceCardId])

  if (!sourceCard) {
    return (
      <Card className="h-full">
        <CardHeader><CardTitle className="text-sm">{card.title}</CardTitle></CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Selecione um card-fonte nas configurações</p>
        </CardContent>
      </Card>
    )
  }

  const items = sourceCard.taskContent?.items ?? sourceCard.habitContent?.logs ?? []

  if (chartType === "count") {
    return (
      <Card className="h-full">
        <CardHeader><CardTitle className="text-sm">{card.title}</CardTitle></CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-center">{items.length}</div>
          <p className="text-sm text-muted-foreground text-center">itens</p>
        </CardContent>
      </Card>
    )
  }

  if (chartType === "percentage") {
    const done = items.filter((i: any) => i.checked ?? i.done).length
    const data = [{ name: "Concluído", value: done }, { name: "Pendente", value: items.length - done }]
    const COLORS = ["#22c55e", "#e5e7eb"]
    return (
      <Card className="h-full">
        <CardHeader><CardTitle className="text-sm">{card.title}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart><Pie data={data} dataKey="value" innerRadius={50} outerRadius={80}>
              {data.map((_, i) => <Cell key={i} fill={COLORS[i]} />)}
            </Pie><Tooltip /></PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  if (chartType === "category") {
    const statusMap: Record<string, number> = {}
    items.forEach((item: any) => {
      const key = item.statusId ?? "sem status"
      statusMap[key] = (statusMap[key] ?? 0) + 1
    })
    const data = Object.entries(statusMap).map(([name, value]) => ({ name, value }))
    return (
      <Card className="h-full">
        <CardHeader><CardTitle className="text-sm">{card.title}</CardTitle></CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={data}>
              <XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="value" fill="#3b82f6" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    )
  }

  return null
}
