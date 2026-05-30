import { Link, useLocation } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'

const links = [
  { to: '/',           label: 'Home' },
  { to: '/activities', label: 'Activities' },
  { to: '/badges',     label: 'Badges' },
  { to: '/dashboard',  label: 'Dashboard' },
  { to: '/about',      label: 'About' },
]

export default function Footer() {
  const { pathname } = useLocation()
  const { student, logout } = useStudent()

  return (
    <footer className="bg-forest-800 text-forest-200 mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col items-center gap-4">
          <p className="font-black text-sunshine-300 text-xl">⛺ Math Camp</p>

          {/* Nav links */}
          <nav className="flex flex-wrap justify-center gap-2">
            {links.map(l => (
              <Link
                key={l.to}
                to={l.to}
                className={`px-4 py-2 rounded-2xl text-sm font-bold transition-all ${
                  pathname === l.to
                    ? 'bg-forest-600 text-sunshine-300'
                    : 'text-forest-200 hover:bg-forest-700 hover:text-white'
                }`}
              >
                {l.label}
              </Link>
            ))}
            {student && (
              <button
                onClick={logout}
                className="px-4 py-2 rounded-2xl text-sm font-bold bg-campfire-700 hover:bg-campfire-600 text-white transition-colors"
              >
                Log Out
              </button>
            )}
          </nav>

          <p className="text-xs text-forest-400">
            Practice math, earn badges, and keep your brain sharp all summer!
          </p>
        </div>
      </div>
    </footer>
  )
}
