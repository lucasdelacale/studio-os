"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, ShieldOff, Users } from "lucide-react"

interface User { id: string; name: string; email: string; role: string; createdAt: string }

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch("/api/admin").then((r) => r.json()).then(setUsers).finally(() => setLoading(false))
  }, [])

  const toggleAdmin = async (userId: string, currentRole: string) => {
    const newRole = currentRole === "admin" ? "user" : "admin"
    await fetch("/api/admin", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, role: newRole }),
    })
    setUsers(users.map((u) => (u.id === userId ? { ...u, role: newRole } : u)))
  }

  if (loading) return <div className="p-8">Carregando...</div>

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <Shield className="h-6 w-6" />
        <h1 className="text-2xl font-bold">Administração</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Usuários ({users.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {users.map((user) => (
              <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <p className="font-medium">{user.name || "Sem nome"}</p>
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                    {user.role}
                  </Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleAdmin(user.id, user.role)}
                  >
                    {user.role === "admin" ? (
                      <ShieldOff className="h-4 w-4 mr-1" />
                    ) : (
                      <Shield className="h-4 w-4 mr-1" />
                    )}
                    {user.role === "admin" ? "Remover" : "Tornar Admin"}
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
