"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Plus, ListChecks, FileText, Target, Smile } from "lucide-react"
import { useRouter } from "next/navigation"

const QUICK_TYPES = [
  { type: "task", label: "Tarefa", icon: ListChecks },
  { type: "note", label: "Nota", icon: FileText },
  { type: "habit", label: "Hábito", icon: Target },
  { type: "mood", label: "Humor", icon: Smile },
]

export function QuickCapture({ dashboardId }: { dashboardId: string }) {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState("")
  const [selectedType, setSelectedType] = useState("task")
  const router = useRouter()

  const createCard = async () => {
    if (!title) return
    await fetch("/api/cards", { method: "POST", body: JSON.stringify({ type: selectedType, title, dashboardId }) })
    setTitle("")
    setOpen(false)
    router.refresh()
  }

  return (
    <>
      <Button
        className="fixed bottom-6 right-6 rounded-full h-14 w-14 shadow-lg"
        onClick={() => setOpen(true)}
      >
        <Plus className="h-6 w-6" />
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Captura Rápida</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Título do card..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              autoFocus
              onKeyDown={(e) => { if (e.key === "Enter") createCard() }}
            />
            <div className="flex gap-2">
              {QUICK_TYPES.map((t) => (
                <Button
                  key={t.type}
                  variant={selectedType === t.type ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedType(t.type)}
                >
                  <t.icon className="h-4 w-4 mr-1" />
                  {t.label}
                </Button>
              ))}
            </div>
            <Button className="w-full" onClick={createCard}>Criar Card</Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
