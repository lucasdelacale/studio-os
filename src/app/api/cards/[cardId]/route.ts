import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function PUT(req: Request, { params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const card = await prisma.card.findFirst({ where: { id: cardId, userId: session.user.id } })
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 })
  const body = await req.json()
  const updated = await prisma.card.update({
    where: { id: cardId },
    data: {
      title: body.title,
      positionX: body.positionX,
      positionY: body.positionY,
      width: body.width,
      height: body.height,
      config: body.config,
      dashboardId: body.dashboardId,
      ...(body.taskContent && { taskContent: { update: { items: JSON.stringify(body.taskContent.items), viewMode: body.taskContent.viewMode, showProgress: body.taskContent.showProgress } } }),
      ...(body.noteContent && { noteContent: { update: { content: body.noteContent.content, folderId: body.noteContent.folderId } } }),
      ...(body.habitContent && { habitContent: { update: { logs: JSON.stringify(body.habitContent.logs), goalPerWeek: body.habitContent.goalPerWeek } } }),
      ...(body.chartContent && { chartContent: { update: { sourceCardId: body.chartContent.sourceCardId, chartType: body.chartContent.chartType, config: body.chartContent.config } } }),
      ...(body.timerContent && { timerContent: { update: { sessions: JSON.stringify(body.timerContent.sessions), totalMinutes: body.timerContent.totalMinutes, linkedTaskId: body.timerContent.linkedTaskId } } }),
      ...(body.financeContent && { financeContent: { update: { entries: JSON.stringify(body.financeContent.entries), currency: body.financeContent.currency, goals: JSON.stringify(body.financeContent.goals) } } }),
      ...(body.moodContent && { moodContent: { update: { entries: JSON.stringify(body.moodContent.entries) } } }),
    },
    include: { taskContent: true, noteContent: true, habitContent: true, chartContent: true, timerContent: true, financeContent: true, moodContent: true },
  })
  return NextResponse.json(updated)
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const card = await prisma.card.findFirst({ where: { id: cardId, userId: session.user.id } })
  if (!card) return NextResponse.json({ error: "Not found" }, { status: 404 })
  await prisma.card.delete({ where: { id: cardId } })
  return NextResponse.json({ success: true })
}
