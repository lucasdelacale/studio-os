import { NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: Request) {
  const body = await req.json()
  const { username, password } = body

  if (!username || !password) {
    return NextResponse.json({ error: "Username e senha são obrigatórios" }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { username } })
  if (!user || !user.password) {
    return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 })
  }

  const valid = await bcrypt.compare(password, user.password)
  if (!valid) {
    return NextResponse.json({ error: "Usuário ou senha inválidos" }, { status: 401 })
  }

  return NextResponse.json({ user: { id: user.id, name: user.name, username: user.username } })
}
