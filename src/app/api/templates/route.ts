import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

export async function GET() {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const templates = await prisma.template.findMany({ where: { userId: session.user.id } })
  return NextResponse.json(templates)
}

export async function POST(req: Request) {
  const session = await auth()
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  const body = await req.json()
  const template = await prisma.template.create({
    data: { userId: session.user.id, name: body.name, layout: body.layout },
  })
  return NextResponse.json(template, { status: 201 })
}
