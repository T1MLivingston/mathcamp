import { Link } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'

export default function BadgePreviewCard() {
  const { earnedBadges } = useStudent()
  const badges = earnedBadges()
  const earned = badges.filter(b => b.earned)
  const locked = badges.filter(b => !b.earned)

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-sunshine-300 p-5">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-black text-forest-800">My Badges</h3>
        <span className="text-sm font-bold text-gray-500">{earned.length}/{badges.length}</span>
      </div>

      {earned.length > 0 && (
        <div className="grid grid-cols-3 gap-2 mb-3">
          {earned.map(b => (
            <div key={b.id} className={`${b.color} rounded-2xl p-2 text-center shadow-sm`}>
              <div className="text-2xl">{b.icon}</div>
              <p className="text-xs font-bold leading-tight mt-1">{b.name}</p>
            </div>
          ))}
        </div>
      )}

      {locked.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {locked.slice(0, 3).map(b => (
            <div key={b.id} className="bg-gray-100 rounded-2xl p-2 text-center opacity-50">
              <div className="text-2xl">🔒</div>
              <p className="text-xs font-bold text-gray-400 leading-tight mt-1">{b.name}</p>
            </div>
          ))}
        </div>
      )}

      <Link to="/badges" className="block text-center text-sm font-bold text-forest-600 hover:text-forest-800 mt-3">
        View all badges →
      </Link>
    </div>
  )
}
