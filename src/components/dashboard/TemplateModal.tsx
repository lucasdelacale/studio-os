"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { LayoutTemplate, Plus } from "lucide-react"

interface Template { id: string; name: string; layout: any }

export function TemplateModal({ open, onOpenChange, onApply }: { open: boolean; onOpenChange: (v: boolean) => void; onApply: (layout: any) => void }) {
  const [templates, setTemplates] = useState<Template[]>([])
  const [newName, setNewName] = useState("")

  useEffect(() => { if (open) fetch("/api/templates").then((r) => r.json()).then(setTemplates) }, [open])

  const saveAsTemplate = async () => {
    if (!newName) return
    await fetch("/api/templates", { method: "POST", body: JSON.stringify({ name: newName, layout: {} }) })
    setNewName("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader><DialogTitle>Templates</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div className="flex gap-2">
            <Input placeholder="Nome do template" value={newName} onChange={(e) => setNewName(e.target.value)} />
            <Button onClick={saveAsTemplate}><Plus className="h-4 w-4 mr-1" /> Salvar</Button>
          </div>
          <div className="space-y-2">
            {templates.map((t) => (
              <div key={t.id} className="flex items-center justify-between p-2 border rounded">
                <div className="flex items-center gap-2">
                  <LayoutTemplate className="h-4 w-4" />
                  <span className="text-sm">{t.name}</span>
                </div>
                <Button size="sm" variant="ghost" onClick={() => { onApply(t.layout); onOpenChange(false) }}>
                  Aplicar
                </Button>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
