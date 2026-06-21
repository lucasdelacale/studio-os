"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Settings2 } from "lucide-react"

const PRESET_COLORS = ["#3b82f6", "#ef4444", "#22c55e", "#f59e0b", "#8b5cf6", "#ec4899", "#06b6d4", "#84cc16"]

export function CardConfigDialog({ card, onSave }: { card: any; onSave: (config: any) => void }) {
  const [config, setConfig] = useState(card.config ?? {})

  return (
    <Dialog>
      <DialogTrigger render={<Button variant="ghost" size="icon" className="h-6 w-6" />}>
        <Settings2 className="h-3 w-3" />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader><DialogTitle>Personalizar Card</DialogTitle></DialogHeader>
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium">Cor</label>
            <div className="flex gap-2 mt-1">
              {PRESET_COLORS.map((color) => (
                <button key={color} className="w-8 h-8 rounded-full border-2"
                  style={{ backgroundColor: color, borderColor: config.color === color ? "#000" : "transparent" }}
                  onClick={() => setConfig({ ...config, color })}
                />
              ))}
            </div>
          </div>
          <div className="flex items-center gap-2">
            <input type="checkbox" id="showHeader" checked={config.showHeader !== false}
              onChange={(e) => setConfig({ ...config, showHeader: e.target.checked })} />
            <label htmlFor="showHeader" className="text-sm">Mostrar header</label>
          </div>
          <Button onClick={() => onSave(config)} className="w-full">Salvar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
