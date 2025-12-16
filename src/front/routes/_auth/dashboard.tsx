import { DashboardPage } from '@/front/features/dashboard/DashboardPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard')({
  component: DashRoute,
})

function DashRoute() {
  return <DashboardPage />
}
