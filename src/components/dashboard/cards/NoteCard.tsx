"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TipTapEditor } from "@/components/editor/TipTapEditor"
import { Input } from "@/components/ui/input"
import { X } from "lucide-react"

export function NoteCard({ card }: { card: any }) {
  const [content, setContent] = useState(card.noteContent?.content ?? {})
  const [tags, setTags] = useState<string[]>(card.config?.tags ?? [])
  const [newTag, setNewTag] = useState("")

  const saveContent = async (newContent: any) => {
    setContent(newContent)
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ noteContent: { content: newContent } }) })
  }

  const addTag = async () => {
    if (!newTag.trim()) return
    const updated = [...tags, newTag.trim()]
    setTags(updated)
    setNewTag("")
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ config: { ...card.config, tags: updated } }) })
  }

  const removeTag = async (tag: string) => {
    const updated = tags.filter((t) => t !== tag)
    setTags(updated)
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ config: { ...card.config, tags: updated } }) })
  }

  return (
    <Card className="h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1">
            {tags.map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1 text-xs bg-muted px-1.5 py-0.5 rounded">
                {tag}
                <button onClick={() => removeTag(tag)}><X className="h-2.5 w-2.5" /></button>
              </span>
            ))}
          </div>
        )}
        <div className="flex gap-1 mt-1">
          <Input
            value={newTag}
            onChange={(e) => setNewTag(e.target.value)}
            placeholder="+ etiqueta"
            className="h-6 text-xs"
            onKeyDown={(e) => { if (e.key === "Enter") addTag() }}
          />
        </div>
        <span className="text-xs text-muted-foreground">Criado em {new Date(card.createdAt).toLocaleDateString("pt-BR")}</span>
      </CardHeader>
      <CardContent>
        <TipTapEditor content={content} onChange={saveContent} />
      </CardContent>
    </Card>
  )
}
