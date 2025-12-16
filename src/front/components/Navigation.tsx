import { authClient } from '@/shared/api-client/auth/auth.api'
import { Link } from '@tanstack/react-router'
import { LayoutDashboard, LogOut } from 'lucide-react'

export function Navigation() {
  const session = authClient.useSession()
  const isLoggedIn = session.data?.user != null

  const handleLogout = async () => {
    await authClient.signOut()
    window.location.href = '/'
  }

  return (
    <nav className="sticky top-0 z-50 glass border-b border-white/5">
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-bold shadow-lg">
            B
          </div>
          <span className="font-bold text-lg tracking-tight">Drsky</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-muted">
          <a href="#features" className="hover:text-foreground transition-colors">
            Features
          </a>
          <a href="#stack" className="hover:text-foreground transition-colors">
            Tech Stack
          </a>
          <a href="#pricing" className="hover:text-foreground transition-colors">
            Pricing
          </a>
          <a href="#faq" className="hover:text-foreground transition-colors">
            FAQ
          </a>
          <Link
            to="/dashboard"
            className="hover:text-foreground transition-colors flex items-center gap-1"
          >
            <span>Dashboard</span>
            <LayoutDashboard className="w-3 h-3" />
          </Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn && !session.isPending && (
            <button
              onClick={() => void handleLogout()}
              className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          )}
          {!isLoggedIn && !session.isPending && (
            <>
              <Link
                to="/login"
                className="hidden md:block text-sm font-medium text-muted hover:text-foreground transition-colors"
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="bg-foreground text-background px-4 py-2 rounded-md text-sm font-medium hover:bg-white/90 transition-colors"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  )
}
