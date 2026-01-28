import { DashboardPage } from '@/front/features/dashboard/DashboardPage'
import { buildSeoMeta } from '@/front/lib/seo'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_auth/dashboard')({
  head: () => ({
    meta: buildSeoMeta({
      title: 'Dashboard',
      url: '/dashboard',
      indexable: false,
    }),
  }),
  component: DashRoute,
})

function DashRoute() {
  return <DashboardPage />
}
