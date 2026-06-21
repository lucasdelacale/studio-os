"use client"

import { signIn } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <Card className="w-96">
        <CardHeader>
          <CardTitle>Entrar no Studio Os</CardTitle>
        </CardHeader>
        <CardContent>
          <Button className="w-full" onClick={() => signIn("google")}>
            Continuar com Google
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
