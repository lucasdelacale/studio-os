"use client"

import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export default function LoginPage() {
  const [email, setEmail] = useState("")

  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Entrar no Studio Os</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button className="w-full" onClick={() => signIn("google")}>
            Continuar com Google
          </Button>
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">ou</span>
            </div>
          </div>
          <form action={async (formData) => {
            "use server"
            await signIn("resend", { email: formData.get("email") as string })
          }}>
            <Input
              name="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Button type="submit" className="w-full mt-2">
              Enviar magic link
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
