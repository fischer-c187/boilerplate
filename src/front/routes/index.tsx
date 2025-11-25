import { testQueryOptions, useGetTest } from '@/front/api/example.query'
import Counter from '@/front/components/Counter'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  // ✅ Loader : Pre-fetch les données côté serveur
  loader: ({ context }) => {
    return context.queryClient.ensureQueryData(testQueryOptions)
  },
  component: App,
})

function App() {
  // ✅ useSuspenseQuery : data est garanti (pas de undefined possible)
  const { data } = useGetTest()

  console.log(data.message)
  return (
    <div className="text-center">
      <header className="min-h-screen flex flex-col items-center justify-center bg-[#282c34] text-white text-[calc(10px+2vmin)]">
        <h1 className="text-4xl font-bold mb-6 text-red-500">Welcome to TanStack + Hono</h1>
        <h2>SSR page</h2>
        <p>{data.message}</p>
        <p className="max-w-2xl mx-auto mb-8 text-lg leading-relaxed">
          Edit <code className="bg-gray-800 px-2 py-1 rounded">src/routes/index.tsx</code> and save
          to reload. Built with{' '}
          <span className="text-[#61dafb] font-semibold">TanStack Router</span> and{' '}
          <span className="text-[#61dafb] font-semibold">Hono</span> for blazing-fast server-side
          rendering.
        </p>
        <Counter />

        <div className="flex gap-6 flex-wrap justify-center">
          <a
            className="text-[#61dafb] hover:underline hover:text-white transition-colors"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <a
            className="text-[#61dafb] hover:underline hover:text-white transition-colors"
            href="https://tanstack.com/router"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn TanStack Router
          </a>
          <a
            className="text-[#61dafb] hover:underline hover:text-white transition-colors"
            href="https://hono.dev"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn Hono
          </a>
        </div>
      </header>
    </div>
  )
}
