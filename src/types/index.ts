export type CardType = "task" | "note" | "habit" | "chart" | "timer" | "finance" | "calendar" | "kanban" | "mood" | "bookmark"
export type ChartType = "count" | "percentage" | "category"
export type ViewMode = "list" | "kanban" | "calendar"

export interface TaskItem {
  id: string
  text: string
  checked: boolean
  statusId?: string
  order: number
  parentId?: string
}

export interface HabitLog {
  date: string
  done: boolean
}

export interface CardConfig {
  color?: string
  showHeader?: boolean
  icon?: string
  tags?: string[]
}

export interface TimerSession {
  id: string
  start: string
  end?: string
  duration: number
  linkedTaskId?: string
}

export interface FinanceEntry {
  id: string
  type: "income" | "expense"
  amount: number
  description: string
  date: string
  category: string
}

export interface MoodEntry {
  date: string
  score: number
  note?: string
  triggers?: string[]
}

export interface BookmarkLink {
  id: string
  url: string
  title: string
  description?: string
  tags: string[]
  image?: string
}
