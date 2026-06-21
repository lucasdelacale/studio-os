import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">Studio Os</h1>
      <p className="text-xl text-muted-foreground mb-8">Seu dashboard personalizável</p>
      <Link href="/dashboard">
        <Button>Ir para o Dashboard</Button>
      </Link>
    </main>
  )
}
