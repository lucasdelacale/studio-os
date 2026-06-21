"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, TrendingUp, TrendingDown } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"

interface FinanceEntry { id: string; type: "income" | "expense"; amount: number; description: string; date: string; category: string }

const CATEGORIES = ["Alimentação", "Transporte", "Moradia", "Lazer", "Saúde", "Educação", "Outros"]

export function FinanceCard({ card }: { card: any }) {
  const [entries, setEntries] = useState<FinanceEntry[]>(card.financeContent?.entries ?? [])
  const [showForm, setShowForm] = useState(false)
  const [newEntry, setNewEntry] = useState({ type: "expense" as "income" | "expense", amount: "", description: "", category: "Outros" })

  const save = async (updated: FinanceEntry[]) => {
    setEntries(updated)
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ financeContent: { entries: updated } }) })
  }

  const addEntry = () => {
    if (!newEntry.amount) return
    const entry: FinanceEntry = {
      id: crypto.randomUUID(),
      type: newEntry.type,
      amount: parseFloat(newEntry.amount),
      description: newEntry.description,
      date: new Date().toISOString(),
      category: newEntry.category,
    }
    save([...entries, entry])
    setNewEntry({ type: "expense", amount: "", description: "", category: "Outros" })
    setShowForm(false)
  }

  const removeEntry = (id: string) => save(entries.filter((e) => e.id !== id))

  const balance = entries.reduce((acc, e) => e.type === "income" ? acc + e.amount : acc - e.amount, 0)
  const income = entries.filter((e) => e.type === "income").reduce((acc, e) => acc + e.amount, 0)
  const expense = entries.filter((e) => e.type === "expense").reduce((acc, e) => acc + e.amount, 0)

  const chartData = entries.reduce((acc, e) => {
    const month = new Date(e.date).toLocaleDateString("pt-BR", { month: "short" })
    const existing = acc.find((d) => d.name === month)
    if (existing) {
      if (e.type === "income") existing.receita += e.amount
      else existing.despesa += e.amount
    } else {
      acc.push({ name: month, receita: e.type === "income" ? e.amount : 0, despesa: e.type === "expense" ? e.amount : 0 })
    }
    return acc
  }, [] as { name: string; receita: number; despesa: number }[])

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
          <Button size="sm" variant="ghost" onClick={() => setShowForm(!showForm)}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-2 mb-4 text-center">
          <div>
            <TrendingUp className="h-4 w-4 mx-auto text-green-500" />
            <div className="text-sm font-bold text-green-500">R$ {income.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Receita</div>
          </div>
          <div>
            <TrendingDown className="h-4 w-4 mx-auto text-red-500" />
            <div className="text-sm font-bold text-red-500">R$ {expense.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Despesa</div>
          </div>
          <div>
            <div className="text-sm font-bold">R$ {balance.toFixed(2)}</div>
            <div className="text-xs text-muted-foreground">Saldo</div>
          </div>
        </div>

        {showForm && (
          <div className="space-y-2 mb-4 p-2 border rounded">
            <div className="flex gap-2">
              <Button size="sm" variant={newEntry.type === "income" ? "default" : "outline"} onClick={() => setNewEntry({ ...newEntry, type: "income" })}>Entrada</Button>
              <Button size="sm" variant={newEntry.type === "expense" ? "default" : "outline"} onClick={() => setNewEntry({ ...newEntry, type: "expense" })}>Saída</Button>
            </div>
            <Input placeholder="Valor" type="number" value={newEntry.amount} onChange={(e) => setNewEntry({ ...newEntry, amount: e.target.value })} />
            <Input placeholder="Descrição" value={newEntry.description} onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })} />
            <select className="w-full border rounded p-1 text-sm" value={newEntry.category} onChange={(e) => setNewEntry({ ...newEntry, category: e.target.value })}>
              {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
            <Button size="sm" className="w-full" onClick={addEntry}>Adicionar</Button>
          </div>
        )}

        {chartData.length > 0 && (
          <ResponsiveContainer width="100%" height={100}>
            <BarChart data={chartData}>
              <XAxis dataKey="name" fontSize={10} />
              <Tooltip />
              <Bar dataKey="receita" fill="#22c55e" />
              <Bar dataKey="despesa" fill="#ef4444" />
            </BarChart>
          </ResponsiveContainer>
        )}

        <div className="space-y-1 mt-2 max-h-32 overflow-y-auto">
          {entries.slice(-5).reverse().map((entry) => (
            <div key={entry.id} className="flex items-center justify-between text-xs py-1">
              <span>{entry.description}</span>
              <span className={entry.type === "income" ? "text-green-500" : "text-red-500"}>
                {entry.type === "income" ? "+" : "-"}R$ {entry.amount.toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
