"use client"

import { signOut } from "@/lib/auth"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Moon, Sun } from "lucide-react"
import { useTheme } from "next-themes"

export function DashboardHeader({ user }: { user: { name?: string | null; image?: string | null } }) {
  const { theme, setTheme } = useTheme()

  return (
    <header className="flex items-center justify-between border-b px-6 py-3">
      <h1 className="text-xl font-bold">Studio Os</h1>
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => setTheme(theme === "dark" ? "light" : "dark")}>
          <Sun className="h-4 w-4 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          <Moon className="absolute h-4 w-4 rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
        </Button>
        <Avatar className="h-8 w-8">
          <AvatarImage src={user.image ?? undefined} />
          <AvatarFallback>{user.name?.charAt(0) ?? "U"}</AvatarFallback>
        </Avatar>
        <form action={async () => { "use server"; await signOut() }}>
          <Button variant="outline" size="sm" type="submit">Sair</Button>
        </form>
      </div>
    </header>
  )
}
