import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CardDetail } from "./card-detail"

export default async function CardDetailPage({ params }: { params: Promise<{ cardId: string }> }) {
  const { cardId } = await params
  const session = await auth()
  const card = await prisma.card.findFirst({
    where: { id: cardId, userId: session!.user!.id },
    include: { taskContent: true, noteContent: true, habitContent: true, chartContent: true, timerContent: true, financeContent: true, moodContent: true },
  })
  if (!card) notFound()
  return <CardDetail card={card} />
}
