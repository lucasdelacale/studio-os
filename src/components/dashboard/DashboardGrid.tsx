"use client"

import { useState, useCallback } from "react"
import { DndContext, DragEndEvent, PointerSensor, useSensor, useSensors } from "@dnd-kit/core"
import { SortableContext, rectSortingStrategy } from "@dnd-kit/sortable"
import { DashboardCard } from "./DashboardCard"
import { DraggableCardWrapper } from "./DraggableCardWrapper"

type CardData = { id: string; type: string; title: string; positionX: number; positionY: number; width: number; height: number; config: any; taskContent?: any; noteContent?: any; habitContent?: any; chartContent?: any; timerContent?: any; financeContent?: any; moodContent?: any }

export function DashboardGrid({ cards: initialCards, dashboardId }: { cards: CardData[]; dashboardId: string }) {
  const [cards, setCards] = useState(initialCards)
  const [editing, setEditing] = useState(false)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))

  const handleDragEnd = useCallback(async (event: DragEndEvent) => {
    if (!editing) return
    const { active, over } = event
    if (!over || active.id === over.id) return
    setCards((prev) => {
      const oldIndex = prev.findIndex((c) => c.id === active.id)
      const newIndex = prev.findIndex((c) => c.id === over.id)
      const updated = [...prev]
      const [moved] = updated.splice(oldIndex, 1)
      updated.splice(newIndex, 0, moved)
      const reindexed = updated.map((card, i) => ({ ...card, positionX: i % 4, positionY: Math.floor(i / 4) }))
      reindexed.forEach((card) => {
        fetch(`/api/cards/${card.id}`, {
          method: "PUT", body: JSON.stringify({ positionX: card.positionX, positionY: card.positionY }),
        })
      })
      return reindexed
    })
  }, [editing])

  const removeCard = async (id: string) => {
    await fetch(`/api/cards/${id}`, { method: "DELETE" })
    setCards((prev) => prev.filter((c) => c.id !== id))
  }

  return (
    <div>
      <button
        onClick={() => setEditing(!editing)}
        className={`mb-4 px-4 py-2 rounded text-sm ${editing ? "bg-primary text-primary-foreground" : "bg-muted"}`}
      >
        {editing ? "Finalizar Edição" : "Editar Dashboard"}
      </button>
      <DndContext sensors={sensors} onDragEnd={handleDragEnd}>
        <SortableContext items={cards.map((c) => c.id)} strategy={rectSortingStrategy}>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <DraggableCardWrapper key={card.id} id={card.id} editing={editing} onRemove={() => removeCard(card.id)}>
                <DashboardCard card={card} />
              </DraggableCardWrapper>
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  )
}
