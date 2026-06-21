"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import { Search } from "lucide-react"

export function SearchModal({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<any[]>([])
  const router = useRouter()

  useEffect(() => {
    if (query.length >= 2) {
      fetch(`/api/search?q=${encodeURIComponent(query)}`)
        .then((r) => r.json())
        .then(setResults)
    } else {
      setResults([])
    }
  }, [query])

  const goToCard = (cardId: string) => {
    router.push(`/dashboard/${cardId}`)
    onOpenChange(false)
    setQuery("")
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <div className="flex items-center gap-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cards..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        {results.length > 0 && (
          <div className="space-y-1 max-h-64 overflow-y-auto">
            {results.map((result) => (
              <button
                key={result.id}
                onClick={() => goToCard(result.id)}
                className="w-full text-left p-2 rounded hover:bg-muted"
              >
                <div className="text-sm font-medium">{result.title}</div>
                <div className="text-xs text-muted-foreground">{result.type}</div>
                {result.preview && <div className="text-xs text-muted-foreground truncate">{result.preview}</div>}
              </button>
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
