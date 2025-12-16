import { authClient } from '@/shared/api-client/auth/auth.api'
import { createFileRoute, Outlet, redirect } from '@tanstack/react-router'

// Définir le type du context
export type AuthContext = {
  session: Awaited<ReturnType<typeof authClient.getSession>>['data']
}

export const Route = createFileRoute('/_auth')({
  component: RouteComponent,
  ssr: false,
  beforeLoad: async ({ location }) => {
    const { data } = await authClient.getSession()
    if (!data?.user) {
      throw redirect({ to: '/login', search: { redirectTo: location.pathname } })
    }
    return { session: data }
  },
  pendingComponent: () => <div>Loading...</div>,
})

function RouteComponent() {
  return (
    <main>
      <Outlet />
    </main>
  )
}
