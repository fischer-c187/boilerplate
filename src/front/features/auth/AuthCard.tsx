import { useState, type ReactNode } from 'react'

interface AuthCardProps {
  children: (mode: 'login' | 'signup') => ReactNode
}

export function AuthCard({ children }: AuthCardProps) {
  const [mode, setMode] = useState<'login' | 'signup'>('login')

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6 relative overflow-hidden">
      {/* Ambient Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/10 blur-[100px] rounded-full pointer-events-none -z-10" />

      {/* Auth Card */}
      <div className="w-full max-w-md bg-surface/50 backdrop-blur-md border border-white/5 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 pb-0 text-center">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-primary mb-6 shadow-lg shadow-primary/30">
            <span className="text-white font-bold text-xl">B</span>
          </div>
          <h1 className="text-2xl font-bold mb-2">
            {mode === 'login' ? 'Welcome back' : 'Create your account'}
          </h1>
          <p className="text-muted text-sm">
            {mode === 'login'
              ? 'Enter your credentials to access your account.'
              : 'Get started with your new account today.'}
          </p>
        </div>

        {/* Tabs */}
        <div className="px-8 mt-8">
          <div className="flex p-1 bg-surface border border-white/5 rounded-lg relative">
            {/* Sliding Background */}
            <div
              className="absolute inset-y-1 w-[calc(50%-4px)] bg-white/10 rounded-md transition-all duration-300 ease-out"
              style={{
                transform: mode === 'signup' ? 'translateX(100%) translateX(8px)' : 'translateX(0)',
              }}
            />

            <button
              onClick={() => setMode('login')}
              className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${
                mode === 'login' ? 'text-white' : 'text-muted hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setMode('signup')}
              className={`flex-1 py-2 text-sm font-medium z-10 transition-colors ${
                mode === 'signup' ? 'text-white' : 'text-muted hover:text-white'
              }`}
            >
              Sign Up
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="p-8">{children(mode)}</div>
      </div>
    </div>
  )
}
