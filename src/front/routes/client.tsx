import { authClient } from '@/shared/api-client/auth/auth.api'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client')({
  component: NoSSR,
  ssr: false,
})

function NoSSR() {
  const session = authClient.useSession()

  if (session.isPending) {
    return <div>Loading...</div>
  }
  if (session.error) {
    return <div>Error: {session.error.message}</div>
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen h-4xl bg-red-500">
      <p>hello world</p>
    </div>
  )
}
