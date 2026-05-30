import { Link } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'

export default function BadgePreviewCard({ wide = false }) {
  const { earnedBadges } = useStudent()
  const badges = earnedBadges()
  const earned = badges.filter(b => b.earned)
  const locked = badges.filter(b => !b.earned)
  const displayBadges = wide ? badges : [...earned, ...locked.slice(0, 3 - earned.length)]

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-sunshine-300 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-black text-forest-800">My Badges</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-gray-500">{earned.length}/{badges.length}</span>
          <Link to="/badges" className="text-sm font-bold text-forest-600 hover:text-forest-800">
            View all →
          </Link>
        </div>
      </div>

      <div className={`grid gap-3 ${wide ? 'grid-cols-4 sm:grid-cols-8' : 'grid-cols-3'}`}>
        {(wide ? badges : displayBadges).map(b => (
          <div
            key={b.id}
            className={`rounded-2xl p-2 text-center shadow-sm transition-all ${
              b.earned ? b.color : 'bg-gray-100 opacity-50 grayscale'
            }`}
          >
            <div className="text-2xl">{b.earned ? b.icon : '🔒'}</div>
            <p className="text-xs font-bold leading-tight mt-1">{b.name}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
