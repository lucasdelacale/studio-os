import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { notFound } from "next/navigation"
import { CardDetail } from "./card-detail"

export default async function CardDetailPage({ params }: { params: { cardId: string } }) {
  const session = await auth()
  const card = await prisma.card.findFirst({
    where: { id: params.cardId, userId: session!.user!.id },
    include: { taskContent: true, noteContent: true, habitContent: true, chartContent: true, timerContent: true, financeContent: true, moodContent: true },
  })
  if (!card) notFound()
  return <CardDetail card={card} />
}
