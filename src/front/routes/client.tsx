import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/client')({
  component: NoSRR,
  ssr: false,
})

function NoSRR() {
  return <div>test</div>
}
