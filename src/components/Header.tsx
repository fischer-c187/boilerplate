import { Link } from '@tanstack/react-router'

export default function Header() {
  return (
    <header className="p-2 flex gap-2 bg-white text-black justify-between">
      <nav className="flex flex-row relative">
        <div className="px-2 font-bold">
          <Link to="/" className="relative z-10">
            Home
          </Link>
        </div>
        <div className="px-2 font-bold">
          <Link to="/client" className="relative z-10">
            Client
          </Link>
        </div>
        <div
          className="absolute bottom-0 h-0.5 bg-blue-600 transition-opacity"
          style={{
            transform: 'translateX(0px)',
            width: '0px',
          }}
        />
      </nav>
    </header>
  )
}
