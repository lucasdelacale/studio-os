import { prisma } from "./prisma"

export async function isAdmin(userId: string): Promise<boolean> {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  return user?.role === "admin"
}

export async function makeAdmin(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { role: "admin" } })
}

export async function removeAdmin(userId: string): Promise<void> {
  await prisma.user.update({ where: { id: userId }, data: { role: "user" } })
}
