import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const cards = await prisma.card.findMany({
    where: { userId: session.user.id },
    include: { taskContent: true, noteContent: true, habitContent: true, chartContent: true, timerContent: true, financeContent: true, moodContent: true },
    orderBy: [{ positionY: "asc" }, { positionX: "asc" }],
  })
  return NextResponse.json(cards)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const { type, title, positionX, positionY, width, height, dashboardId } = body

  const dashboard = await prisma.dashboard.findFirst({ where: { id: dashboardId, userId: session.user.id } })
  if (!dashboard) return NextResponse.json({ error: "Dashboard not found" }, { status: 404 })

  const card = await prisma.card.create({
    data: {
      userId: session.user.id,
      dashboardId,
      type: type ?? "task",
      title: title ?? "Novo Card",
      positionX: positionX ?? 0,
      positionY: positionY ?? 0,
      width: width ?? 2,
      height: height ?? 2,
      ...(type === "task" && { taskContent: { create: { items: "[]" } } }),
      ...(type === "note" && { noteContent: { create: { content: "{}" } } }),
      ...(type === "habit" && { habitContent: { create: { logs: "[]" } } }),
      ...(type === "chart" && { chartContent: { create: { sourceCardId: body.sourceCardId, chartType: body.chartType ?? "count" } } }),
      ...(type === "timer" && { timerContent: { create: {} } }),
      ...(type === "finance" && { financeContent: { create: {} } }),
      ...(type === "mood" && { moodContent: { create: {} } }),
    },
    include: { taskContent: true, noteContent: true, habitContent: true, chartContent: true, timerContent: true, financeContent: true, moodContent: true },
  })
  return NextResponse.json(card, { status: 201 })
}
