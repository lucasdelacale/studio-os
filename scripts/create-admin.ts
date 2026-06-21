import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = "corp.lucasmartins@gmail.com"
  
  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    console.log("Usuário já existe:", email)
    return
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: "Lucas Martins",
      role: "admin",
    },
  })
  console.log("✓ Usuário criado como admin:", user.email)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
