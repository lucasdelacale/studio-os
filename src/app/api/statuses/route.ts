import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const statuses = await prisma.cardStatus.findMany({ where: { userId: session.user.id }, orderBy: { order: "asc" } })
  return NextResponse.json(statuses)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const status = await prisma.cardStatus.create({
    data: { userId: session.user.id, name: body.name, color: body.color, order: body.order ?? 0 },
  })
  return NextResponse.json(status, { status: 201 })
}
