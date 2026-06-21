"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Save } from "lucide-react"
import Link from "next/link"
import { DashboardCard } from "@/components/dashboard/DashboardCard"

export function CardDetail({ card: initialCard }: { card: any }) {
  const [card, setCard] = useState(initialCard)
  const [title, setTitle] = useState(card.title)
  const router = useRouter()

  const save = async () => {
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ title }) })
    router.refresh()
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/dashboard"><Button variant="ghost" size="icon"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <Input value={title} onChange={(e) => setTitle(e.target.value)} className="text-xl font-bold" />
        <Button onClick={save}><Save className="h-4 w-4 mr-1" /> Salvar</Button>
      </div>
      <DashboardCard card={{ ...card, title }} />
    </div>
  )
}
