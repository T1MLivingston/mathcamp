import BadgeCard from '../components/BadgeCard'
import { useStudent } from '../context/StudentContext'
import { Link } from 'react-router-dom'

export default function BadgesPage() {
  const { earnedBadges, student } = useStudent()
  const badges = earnedBadges()
  const earned = badges.filter(b => b.earned)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-forest-800 mb-2">🏅 Badges</h1>
      <p className="text-gray-600 font-semibold mb-6">
        Earn badges by completing activities and checking in every day!
      </p>

      {/* Progress bar */}
      <div className="bg-white rounded-3xl border-2 border-sunshine-300 p-5 mb-6 shadow-sm">
        <div className="flex items-center justify-between mb-2">
          <span className="font-black text-forest-800">Badge Progress</span>
          <span className="font-black text-sunshine-500">{earned.length} / {badges.length}</span>
        </div>
        <div className="h-4 bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-sunshine-400 to-campfire-500 rounded-full transition-all"
            style={{ width: `${(earned.length / badges.length) * 100}%` }}
          />
        </div>
      </div>

      {!student && (
        <div className="bg-sunshine-100 border-2 border-sunshine-400 rounded-3xl p-4 mb-6 flex items-center justify-between gap-4">
          <p className="font-bold text-sunshine-600 text-sm">
            ⭐ Join camp to start earning badges!
          </p>
          <Link to="/login" className="shrink-0 bg-campfire-500 text-white font-black text-sm px-4 py-2 rounded-2xl hover:bg-campfire-600 transition-colors">
            Join Camp!
          </Link>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {badges.map(b => <BadgeCard key={b.id} badge={b} />)}
      </div>
    </div>
  )
}
