"use client"

import { useState, useCallback } from "react"
import { useSortable } from "@dnd-kit/sortable"
import { CSS } from "@dnd-kit/utilities"
import { X, GripVertical, Maximize2 } from "lucide-react"

export function DraggableCardWrapper({ id, editing, onRemove, children }: { id: string; editing: boolean; onRemove: () => void; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled: !editing })
  const [size, setSize] = useState({ width: 2, height: 2 })

  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    const startX = e.clientX
    const startY = e.clientY
    const startSize = { ...size }

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      const newWidth = Math.max(1, Math.min(4, startSize.width + Math.round(deltaX / 200)))
      const newHeight = Math.max(1, Math.min(4, startSize.height + Math.round(deltaY / 100)))
      if (newWidth !== size.width || newHeight !== size.height) {
        setSize({ width: newWidth, height: newHeight })
      }
    }

    const handleMouseUp = () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
      fetch(`/api/cards/${id}`, { method: "PUT", body: JSON.stringify({ width: size.width, height: size.height }) })
    }

    document.addEventListener("mousemove", handleMouseMove)
    document.addEventListener("mouseup", handleMouseUp)
  }, [id, size])

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    position: "relative" as const,
  }

  return (
    <div ref={setNodeRef} style={style} className={editing ? "ring-2 ring-primary/20 rounded-lg" : ""}>
      {editing && (
        <>
          <div className="absolute -top-2 -left-2 z-10 flex gap-1">
            <button {...attributes} {...listeners} className="bg-primary text-primary-foreground rounded p-1 cursor-grab">
              <GripVertical className="h-3 w-3" />
            </button>
            <button onClick={onRemove} className="bg-destructive text-destructive-foreground rounded p-1">
              <X className="h-3 w-3" />
            </button>
          </div>
          <div
            onMouseDown={handleMouseDown}
            className="absolute bottom-0 right-0 w-4 h-4 cursor-se-resize z-10"
          >
            <Maximize2 className="h-3 w-3 text-muted-foreground" />
          </div>
        </>
      )}
      {children}
    </div>
  )
}
