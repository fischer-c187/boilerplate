import { authClient } from '@/shared/api-client/auth/auth.api'
import { createFileRoute, Navigate } from '@tanstack/react-router'

export const Route = createFileRoute('/secret')({
  component: SecretPage,
  ssr: false,
  beforeLoad: () => {
    console.log('beforeLoad')
  },
})

function SecretPage() {
  const session = authClient.useSession()

  // Show loading state while checking authentication
  if (session.isPending) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!session.data?.user) {
    return <Navigate to="/login" />
  }

  // Show secret content for authenticated users
  return (
    <div className="min-h-screen bg-linear-to-br from-purple-600 to-blue-600 flex items-center justify-center p-4">
      <div className="max-w-2xl w-full bg-white rounded-lg shadow-2xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">🔒 Secret Page</h1>
          <p className="text-gray-600">This page is only accessible to authenticated users</p>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 mb-6">
          <h2 className="text-xl font-semibold text-blue-900 mb-2">
            Welcome, {session.data.user.name || session.data.user.email}!
          </h2>
          <p className="text-blue-800">
            You have successfully accessed the secret area. Only authenticated users can see this
            content.
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="font-semibold text-gray-700 mb-2">User Information</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>
                <span className="font-medium">Email:</span> {session.data.user.email}
              </li>
              {session.data.user.name && (
                <li>
                  <span className="font-medium">Name:</span> {session.data.user.name}
                </li>
              )}
              <li>
                <span className="font-medium">User ID:</span> {session.data.user.id}
              </li>
            </ul>
          </div>

          <div className="bg-green-50 p-4 rounded-lg">
            <h3 className="font-semibold text-green-900 mb-2">🎉 Exclusive Content</h3>
            <p className="text-green-800 text-sm">
              This is secret information that only logged-in users can access. You could put premium
              features, private data, or protected resources here.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
