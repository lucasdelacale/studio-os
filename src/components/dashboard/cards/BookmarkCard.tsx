"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, ExternalLink, Trash2 } from "lucide-react"

interface BookmarkLink { id: string; url: string; title: string; description?: string; tags: string[] }

export function BookmarkCard({ card }: { card: any }) {
  const [links, setLinks] = useState<BookmarkLink[]>(card.bookmarkContent?.links ?? [])
  const [showForm, setShowForm] = useState(false)
  const [newLink, setNewLink] = useState({ url: "", title: "", tags: "" })

  const save = async (updated: BookmarkLink[]) => {
    setLinks(updated)
    await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ bookmarkContent: { links: updated } }) })
  }

  const addLink = () => {
    if (!newLink.url || !newLink.title) return
    const link: BookmarkLink = {
      id: crypto.randomUUID(),
      url: newLink.url,
      title: newLink.title,
      tags: newLink.tags.split(",").map((t) => t.trim()).filter(Boolean),
    }
    save([...links, link])
    setNewLink({ url: "", title: "", tags: "" })
    setShowForm(false)
  }

  const removeLink = (id: string) => save(links.filter((l) => l.id !== id))

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
        {showForm && (
          <div className="space-y-2 mb-4 p-2 border rounded">
            <Input placeholder="URL" value={newLink.url} onChange={(e) => setNewLink({ ...newLink, url: e.target.value })} />
            <Input placeholder="Título" value={newLink.title} onChange={(e) => setNewLink({ ...newLink, title: e.target.value })} />
            <Input placeholder="Tags (separadas por vírgula)" value={newLink.tags} onChange={(e) => setNewLink({ ...newLink, tags: e.target.value })} />
            <Button size="sm" className="w-full" onClick={addLink}>Adicionar</Button>
          </div>
        )}

        <div className="space-y-2 max-h-64 overflow-y-auto">
          {links.map((link) => (
            <div key={link.id} className="flex items-start gap-2 p-2 bg-muted rounded">
              <div className="flex-1 min-w-0">
                <a href={link.url} target="_blank" rel="noopener noreferrer" className="text-sm font-medium hover:underline flex items-center gap-1">
                  {link.title} <ExternalLink className="h-3 w-3" />
                </a>
                {link.description && <p className="text-xs text-muted-foreground truncate">{link.description}</p>}
                {link.tags.length > 0 && (
                  <div className="flex gap-1 mt-1">
                    {link.tags.map((tag) => (
                      <span key={tag} className="text-[10px] bg-background px-1 rounded">{tag}</span>
                    ))}
                  </div>
                )}
              </div>
              <button onClick={() => removeLink(link.id)} className="text-muted-foreground hover:text-destructive">
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
