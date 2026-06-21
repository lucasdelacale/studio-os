import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const email = "corp.lucasmartins@gmail.com"
  const username = "admin"
  const password = "Brvin$up2010"

  const hashedPassword = await bcrypt.hash(password, 10)

  const user = await prisma.user.update({
    where: { email },
    data: {
      username,
      password: hashedPassword,
    },
  })

  console.log("✓ Admin atualizado:")
  console.log("  Username:", user.username)
  console.log("  Email:", user.email)
  console.log("  Role:", user.role)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
