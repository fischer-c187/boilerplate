import { clientEnv } from '@/front/config/env.client'

interface ErrorFallbackProps {
  error: Error
  reset?: () => void
  size?: 'sm' | 'md' | 'lg'
}

/**
 * Composant d'erreur réutilisable pour afficher des erreurs de query
 *
 * Usage:
 * <ErrorBoundary fallback={(error, reset) => <ErrorFallback error={error} reset={reset} />}>
 *   <MyComponent />
 * </ErrorBoundary>
 */
export function ErrorFallback({ error, reset, size = 'md' }: ErrorFallbackProps) {
  const sizeClasses = {
    sm: 'p-4 text-sm',
    md: 'p-6 text-base',
    lg: 'p-8 text-lg',
  }

  return (
    <div className={`bg-red-50 border border-red-200 rounded-lg ${sizeClasses[size]}`}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-red-800 mb-1">Something went wrong</h3>
          <p className="text-red-700">{error.message}</p>

          {/* Stack trace en dev */}
          {!clientEnv.PROD && error.stack && (
            <details className="mt-2">
              <summary className="text-xs text-red-600 cursor-pointer hover:text-red-700">
                Show details
              </summary>
              <pre className="mt-2 text-xs bg-red-100 p-2 rounded overflow-auto max-h-32">
                {error.stack}
              </pre>
            </details>
          )}

          {reset && (
            <button
              type="button"
              onClick={reset}
              className="mt-3 px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 transition-colors"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
