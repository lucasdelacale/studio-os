"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { AddCardModal } from "./AddCardModal"

export function AddCardButton({ dashboardId }: { dashboardId: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button onClick={() => setOpen(true)}><Plus className="h-4 w-4 mr-1" /> Adicionar Card</Button>
      <AddCardModal open={open} onOpenChange={setOpen} dashboardId={dashboardId} />
    </>
  )
}
