import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { DashboardGrid } from "@/components/dashboard/DashboardGrid"
import { AddCardButton } from "@/components/dashboard/AddCardButton"
import { TodayView } from "@/components/dashboard/TodayView"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
  const session = await auth()
  const userId = session?.user?.id
  if (!userId) redirect("/login")

  const dashboards = await prisma.dashboard.findMany({ where: { userId } })
  if (dashboards.length === 0) {
    const dashboard = await prisma.dashboard.create({ data: { userId, name: "Meu Dashboard", isDefault: true } })
    return (
      <Tabs defaultValue="dashboard">
        <TabsList>
          <TabsTrigger value="today">Hoje</TabsTrigger>
          <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
        </TabsList>
        <TabsContent value="today"><TodayView /></TabsContent>
        <TabsContent value="dashboard">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-semibold">{dashboard.name}</h2>
            <AddCardButton dashboardId={dashboard.id} />
          </div>
          <DashboardGrid cards={[]} dashboardId={dashboard.id} />
        </TabsContent>
      </Tabs>
    )
  }
  const defaultDashboard = dashboards.find(d => d.isDefault) ?? dashboards[0]
  const cards = await prisma.card.findMany({
    where: { userId, dashboardId: defaultDashboard.id },
    include: { taskContent: true, noteContent: true, habitContent: true, chartContent: true, timerContent: true, financeContent: true, moodContent: true },
    orderBy: [{ positionY: "asc" }, { positionX: "asc" }],
  })
  return (
    <Tabs defaultValue="dashboard">
      <TabsList>
        <TabsTrigger value="today">Hoje</TabsTrigger>
        <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
      </TabsList>
      <TabsContent value="today"><TodayView /></TabsContent>
      <TabsContent value="dashboard">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">{defaultDashboard.name}</h2>
          <AddCardButton dashboardId={defaultDashboard.id} />
        </div>
        <DashboardGrid cards={cards} dashboardId={defaultDashboard.id} />
      </TabsContent>
    </Tabs>
  )
}
