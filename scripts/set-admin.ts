import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

async function main() {
  const email = process.argv[2]
  if (!email) {
    console.log("Uso: npx tsx scripts/set-admin.ts <email>")
    process.exit(1)
  }

  const user = await prisma.user.findUnique({ where: { email } })
  if (!user) {
    console.log("Usuário não encontrado:", email)
    process.exit(1)
  }

  await prisma.user.update({ where: { id: user.id }, data: { role: "admin" } })
  console.log(`✓ ${email} agora é admin`)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
