import { CardConfigDialog } from "./CardConfigDialog"
import { TaskCard } from "./cards/TaskCard"
import { NoteCard } from "./cards/NoteCard"
import { HabitCard } from "./cards/HabitCard"
import { ChartCard } from "./cards/ChartCard"
import { TimerCard } from "./cards/TimerCard"
import { FinanceCard } from "./cards/FinanceCard"
import { MoodCard } from "./cards/MoodCard"

type CardData = { id: string; type: string; title: string; config: any; taskContent?: any; noteContent?: any; habitContent?: any; chartContent?: any; timerContent?: any; financeContent?: any; moodContent?: any }

export function DashboardCard({ card }: { card: CardData }) {
  const config = card.config ?? {}

  const getInnerCard = () => {
    switch (card.type) {
      case "task":  return <TaskCard card={card} />
      case "note":  return <NoteCard card={card} />
      case "habit": return <HabitCard card={card} />
      case "chart": return <ChartCard card={card} />
      case "timer": return <TimerCard card={card} />
      case "finance": return <FinanceCard card={card} />
      case "mood": return <MoodCard card={card} />
      default: return <div>Card desconhecido</div>
    }
  }

  return (
    <div style={config.color ? { borderColor: config.color, borderWidth: 2, borderRadius: 8 } : {}} className="relative">
      {config.showHeader !== false && (
        <div className="flex items-center justify-between px-3 py-1 border-b" style={{ backgroundColor: config.color ? `${config.color}15` : "transparent" }}>
          <span className="text-xs font-medium">{card.title}</span>
          <CardConfigDialog card={card} onSave={async (newConfig) => {
            await fetch(`/api/cards/${card.id}`, { method: "PUT", body: JSON.stringify({ config: newConfig }) })
          }} />
        </div>
      )}
      {getInnerCard()}
    </div>
  )
}
