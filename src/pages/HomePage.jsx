import { useNavigate } from 'react-router-dom'
import HeroBanner from '../components/HeroBanner'
import GradeGrid from '../components/GradeGrid'
import { useCampProgress } from '../context/CampProgressContext'
import { GRADES } from '../api/mockData'
import { GRADE_ACTIVITIES } from '../api/mathContent'

const ALL_GRADE_IDS = Object.keys(GRADE_ACTIVITIES)

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Desktop: hero + stat card same height. Mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 lg:items-stretch">
        <div className="flex-1 min-w-0">
          <HeroBanner />
        </div>
        <div className="hidden lg:block lg:w-72 shrink-0">
          <PlayerStatCard />
        </div>
      </div>

      {/* Grade grid */}
      <GradeGrid />

      {/* Badge strip */}
      <BadgeStrip />

      {/* Mobile stat card */}
      <div className="mt-6 lg:hidden">
        <PlayerStatCard />
      </div>
    </div>
  )
}

function PlayerStatCard() {
  const navigate = useNavigate()
  const { points, streak, getTotalActivities, getBadgeCount, lastGrade } = useCampProgress()
  const gradeInfo = lastGrade ? GRADES.find(g => g.id === lastGrade) : null
  const pfp = gradeInfo?.pfp || GRADES[0].pfp

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-forest-200 p-5 h-full flex flex-col">
      <div className="flex flex-col items-center mb-4">
        <div className="w-20 h-20 rounded-full overflow-hidden border-4 border-sunshine-300 shadow-md bg-sunshine-100">
          <img src={pfp} alt="Player avatar" className="w-full h-full object-cover" />
        </div>
        <p className="font-black text-lg text-forest-800 mt-3">Math Camper</p>
        <p className="text-sm font-semibold text-gray-500">
          {gradeInfo ? gradeInfo.name : 'Pick a grade to start!'}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-2 mb-4">
        <StatTile value={points} label="Points" bg="bg-sunshine-100" color="text-sunshine-500" />
        <StatTile value={`${streak}🔥`} label="Streak" bg="bg-campfire-50" color="text-campfire-600" />
        <StatTile value={getTotalActivities()} label="Activities" bg="bg-sky-100" color="text-sky-600" />
        <StatTile value={getBadgeCount()} label="Badges" bg="bg-forest-100" color="text-forest-700" />
      </div>

      <button
        onClick={() => navigate('/badges')}
        className="w-full bg-sunshine-400 hover:bg-sunshine-500 text-forest-900 font-black py-2.5 rounded-2xl transition-colors shadow-sm"
      >
        My Badges
      </button>
    </div>
  )
}

function StatTile({ value, label, bg, color }) {
  return (
    <div className={`${bg} rounded-2xl p-3 text-center`}>
      <p className={`text-2xl font-black ${color}`}>{value}</p>
      <p className="text-xs font-bold text-gray-600">{label}</p>
    </div>
  )
}

function BadgeStrip() {
  const navigate = useNavigate()
  const { hasBadge } = useCampProgress()

  return (
    <div className="mt-8">
      <h2 className="text-xl font-black text-forest-800 mb-3 text-center tracking-wide uppercase">
        Grade Badges
      </h2>
      <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-4">
        <div className="flex justify-center gap-4 flex-wrap">
          {ALL_GRADE_IDS.map(gId => {
            const grade = GRADES.find(g => g.id === gId)
            const earned = hasBadge(gId)
            const color = GRADE_ACTIVITIES[gId]?.color || '#888'
            return (
              <button
                key={gId}
                onClick={() => navigate(`/grade/${gId}`)}
                className="flex flex-col items-center gap-1 group"
                title={`${grade?.name} badge`}
              >
                <div
                  className="w-14 h-14 rounded-full overflow-hidden border-4 transition-all duration-200"
                  style={{
                    borderColor: earned ? color : '#e5e7eb',
                    boxShadow: earned ? `0 0 12px 2px ${color}66` : 'none',
                    opacity: earned ? 1 : 0.4,
                  }}
                >
                  <img src={grade?.pfp} alt={grade?.name} className="w-full h-full object-cover" />
                </div>
                <span className="text-xs font-black" style={{ color: earned ? color : '#9ca3af' }}>
                  {grade?.label}
                </span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}
