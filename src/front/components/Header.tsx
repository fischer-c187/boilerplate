import { authClient } from '@/shared/api-client/auth/auth.api'
import { useTranslation } from '@/front/hooks/useTranslation'
import LanguageSwitcher from '@/front/components/LanguageSwitcher'
import { Link, useNavigate } from '@tanstack/react-router'

export default function Header() {
  const { t } = useTranslation('common')
  const session = authClient.useSession()
  const isLoggedIn = session.data?.user != null
  const navigate = useNavigate()

  const handleLogout = async () => {
    await authClient.signOut()
    await navigate({ to: '/' })
  }

  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row relative">
        <div className="px-2 font-bold">
          <Link to="/" className="relative z-10">
            {t('nav.home')}
          </Link>
        </div>
        <div className="px-2 font-bold">
          <Link to="/client" className="relative z-10">
            Client
          </Link>
        </div>
        {!isLoggedIn && !session.isPending && (
          <>
            <div className="px-2 font-bold">
              <Link to="/signup" className="relative z-10">
                Sign Up
              </Link>
            </div>
            <div className="px-2 font-bold">
              <Link to="/login" className="relative z-10">
                {t('nav.login')}
              </Link>
            </div>
          </>
        )}

        <>
          <div className="px-2 font-bold">
            <Link to="/secret" className="relative z-10 text-purple-600 hover:text-purple-800">
              🔒 {t('nav.profile')}
            </Link>
          </div>
          <div className="px-2 font-bold">
            <button
              onClick={() => void handleLogout()}
              className="relative z-10 hover:text-red-600 transition-colors cursor-pointer"
            >
              {t('nav.logout')}
            </button>
          </div>
        </>

        <div
          className="absolute bottom-0 h-0.5 bg-blue-600 transition-opacity"
          style={{
            transform: 'translateX(0px)',
            width: '0px',
          }}
        />
      </nav>
      <LanguageSwitcher />
    </header>
  )
}
