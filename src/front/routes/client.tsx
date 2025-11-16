import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client')({
  component: NoSSR,
  ssr: false,
})

function NoSSR() {
  // const session = authClient.getSession()

  // console.log(session)

  return (
    <div className="flex flex-col items-center justify-center h-screen h-4xl bg-red-500">
      <p>hello world</p>
    </div>
  )
}
