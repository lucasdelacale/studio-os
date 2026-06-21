"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"
import { ListChecks, FileText, Target, BarChart3, Timer, DollarSign, Smile, Bookmark } from "lucide-react"

const CARD_TYPES = [
  { type: "task", label: "Tarefas", icon: ListChecks, desc: "Lista de tarefas com status" },
  { type: "note", label: "Notas", icon: FileText, desc: "Anotações rich-text" },
  { type: "habit", label: "Hábitos", icon: Target, desc: "Tracker diário" },
  { type: "chart", label: "Gráfico", icon: BarChart3, desc: "Gráfico conectado a outro card" },
  { type: "timer", label: "Timer", icon: Timer, desc: "Pomodoro e foco" },
  { type: "finance", label: "Finanças", icon: DollarSign, desc: "Controle financeiro" },
  { type: "mood", label: "Humor", icon: Smile, desc: "Registro de humor" },
  { type: "bookmark", label: "Bookmark", icon: Bookmark, desc: "Salvar links" },
]

export function AddCardModal({ open, onOpenChange, dashboardId }: { open: boolean; onOpenChange: (v: boolean) => void; dashboardId: string }) {
  const router = useRouter()
  const [step, setStep] = useState<"type" | "chart">("type")
  const [selectedType, setSelectedType] = useState("")
  const [cards, setCards] = useState<any[]>([])
  const [sourceCardId, setSourceCardId] = useState("")
  const [chartType, setChartType] = useState("count")

  useEffect(() => { if (step === "chart") fetch("/api/cards").then((r) => r.json()).then(setCards) }, [step])

  const reset = () => { setStep("type"); setSelectedType(""); setSourceCardId(""); setChartType("count") }

  const createCard = async (type: string, extra?: any) => {
    await fetch("/api/cards", { method: "POST", body: JSON.stringify({ type, dashboardId, ...extra }) })
    reset(); onOpenChange(false); router.refresh()
  }

  return (
    <Dialog open={open} onOpenChange={(v) => { if (!v) reset(); onOpenChange(v) }}>
      <DialogContent>
        {step === "type" && (
          <>
            <DialogHeader><DialogTitle>Adicionar Card</DialogTitle>
            <DialogDescription>Escolha o tipo de card</DialogDescription></DialogHeader>
            <div className="grid grid-cols-2 gap-3">
              {CARD_TYPES.map((t) => (
                <Button key={t.type} variant="outline" className="justify-start h-16"
                  onClick={() => t.type === "chart" ? (setSelectedType(t.type), setStep("chart")) : createCard(t.type)}
                >
                  <t.icon className="h-5 w-5 mr-3" />
                  <div className="text-left"><div className="font-medium">{t.label}</div>
                  <div className="text-xs text-muted-foreground">{t.desc}</div></div>
                </Button>
              ))}
            </div>
          </>
        )}
        {step === "chart" && (
          <>
            <DialogHeader><DialogTitle>Configurar Gráfico</DialogTitle>
            <DialogDescription>Conecte seu gráfico a um card existente</DialogDescription></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Card-fonte</label>
                <select className="w-full border rounded p-2" value={sourceCardId}
                  onChange={(e) => setSourceCardId(e.target.value)}>
                  <option value="">Selecione...</option>
                  {cards.filter((c) => c.id !== selectedType).map((c) => (
                    <option key={c.id} value={c.id}>{c.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="text-sm font-medium">Tipo de gráfico</label>
                <select className="w-full border rounded p-2" value={chartType}
                  onChange={(e) => setChartType(e.target.value)}>
                  <option value="count">Contagem</option>
                  <option value="percentage">Percentual</option>
                  <option value="category">Por categoria</option>
                </select>
              </div>
              <Button className="w-full" disabled={!sourceCardId}
                onClick={() => createCard("chart", { sourceCardId, chartType })}>
                Criar Gráfico
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  )
}
