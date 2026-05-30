import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'

const links = [
  { to: '/',           label: '🏠 Home' },
  { to: '/activities', label: '📚 Activities' },
  { to: '/badges',     label: '🏅 Badges' },
  { to: '/dashboard',  label: '📊 Dashboard' },
  { to: '/about',      label: 'ℹ️ About' },
]

export default function Navbar() {
  const { pathname } = useLocation()
  const { student, logout } = useStudent()
  const [open, setOpen] = useState(false)

  return (
    <nav className="bg-forest-800 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 font-black text-xl text-sunshine-300 hover:text-sunshine-400 transition-colors">
          ⛺ Math Camp
        </Link>

        {/* Desktop links */}
        <div className="hidden md:flex items-center gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              className={`px-3 py-2 rounded-xl text-sm font-bold transition-all ${
                pathname === l.to
                  ? 'bg-forest-600 text-sunshine-300'
                  : 'hover:bg-forest-700 text-white'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {student && (
            <button
              onClick={logout}
              className="ml-2 px-3 py-2 rounded-xl text-sm font-bold bg-campfire-600 hover:bg-campfire-700 transition-colors"
            >
              👋 Log Out
            </button>
          )}
        </div>

        {/* Mobile burger */}
        <button
          className="md:hidden p-2 rounded-xl hover:bg-forest-700"
          onClick={() => setOpen(o => !o)}
        >
          {open ? '✕' : '☰'}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-forest-900 px-4 pb-4 flex flex-col gap-1">
          {links.map(l => (
            <Link
              key={l.to}
              to={l.to}
              onClick={() => setOpen(false)}
              className={`px-3 py-2 rounded-xl font-bold transition-all ${
                pathname === l.to ? 'bg-forest-600 text-sunshine-300' : 'text-white hover:bg-forest-700'
              }`}
            >
              {l.label}
            </Link>
          ))}
          {student && (
            <button onClick={() => { logout(); setOpen(false) }} className="px-3 py-2 rounded-xl font-bold bg-campfire-600 text-white text-left">
              👋 Log Out
            </button>
          )}
        </div>
      )}
    </nav>
  )
}
