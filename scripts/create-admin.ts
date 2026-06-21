import { PrismaClient } from "@prisma/client"
import bcrypt from "bcryptjs"

const prisma = new PrismaClient()

async function main() {
  const hashedPassword = await bcrypt.hash("Brvin$up2010", 10)

  const user = await prisma.user.create({
    data: {
      name: "Lucas Martins",
      username: "admin",
      email: "corp.lucasmartins@gmail.com",
      password: hashedPassword,
      role: "admin",
    },
  })

  console.log("✓ Admin criado:", user.username)
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect())
