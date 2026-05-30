import { Link } from 'react-router-dom'
import DailyCheckIn from '../components/DailyCheckIn'
import { useStudent } from '../context/StudentContext'
import { GRADES, ACTIVITIES } from '../api/mockData'

export default function DashboardPage() {
  const { student, completedActivities, checkIns, earnedBadges } = useStudent()

  if (!student) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="text-7xl mb-4">🏕️</div>
        <h2 className="text-2xl font-black text-forest-800 mb-3">Join Camp First!</h2>
        <p className="text-gray-600 font-semibold mb-6">
          Create your camper profile to track your progress.
        </p>
        <Link to="/login" className="inline-block bg-campfire-500 text-white font-black text-lg px-8 py-4 rounded-2xl hover:bg-campfire-600 transition-colors shadow-lg">
          🚀 Start Camping!
        </Link>
      </div>
    )
  }

  const gradeInfo = GRADES.find(g => g.id === student.grade)
  const gradeActivities = ACTIVITIES[student.grade] || []
  const gradeCompleted = gradeActivities.filter(a => completedActivities.includes(a.id))
  const badges = earnedBadges()
  const earnedCount = badges.filter(b => b.earned).length

  const recent = (student.recentActivity || []).slice(0, 5).map(r => {
    const allActivities = Object.values(ACTIVITIES).flat()
    return allActivities.find(a => a.id === r.id)
  }).filter(Boolean)

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Welcome */}
      <div className={`${gradeInfo?.color || 'bg-forest-100'} border-2 ${gradeInfo?.borderColor || 'border-forest-300'} rounded-3xl p-6 mb-6 flex items-center gap-5 shadow-sm`}>
        {gradeInfo && <img src={gradeInfo.image} alt="" className="h-24 object-contain" />}
        <div>
          <h1 className="text-3xl font-black text-forest-800">
            Welcome back, {student.display_name}! 🎉
          </h1>
          <p className="text-gray-600 font-semibold mt-1">
            {gradeInfo?.name} • {student.student_id}
          </p>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left: Stats + check-in */}
        <div className="lg:col-span-2 space-y-5">
          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              { label: 'Activities', value: student.activitiesCompleted || 0, icon: '📚', bg: 'bg-sky-100', text: 'text-sky-700' },
              { label: 'Day Streak', value: student.streak || 0, icon: '🔥', bg: 'bg-campfire-50', text: 'text-campfire-700' },
              { label: 'Total Points', value: student.points || 0, icon: '⭐', bg: 'bg-sunshine-100', text: 'text-sunshine-600' },
              { label: 'Badges', value: earnedCount, icon: '🏅', bg: 'bg-forest-100', text: 'text-forest-700' },
            ].map(s => (
              <div key={s.label} className={`${s.bg} rounded-3xl p-4 text-center shadow-sm`}>
                <div className="text-2xl mb-1">{s.icon}</div>
                <p className={`text-2xl font-black ${s.text}`}>{s.value}</p>
                <p className="text-xs font-bold text-gray-500 mt-0.5">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Grade Progress */}
          {gradeInfo && (
            <div className="bg-white rounded-3xl border-2 border-gray-200 p-5 shadow-sm">
              <h3 className="font-black text-forest-800 mb-3">
                📊 {gradeInfo.name} Progress
              </h3>
              <div className="flex items-center justify-between mb-2 text-sm font-semibold text-gray-600">
                <span>{gradeCompleted.length} of {gradeActivities.length} complete</span>
                <span>{Math.round((gradeCompleted.length / gradeActivities.length) * 100)}%</span>
              </div>
              <div className="h-4 bg-gray-100 rounded-full overflow-hidden mb-4">
                <div
                  className="h-full bg-gradient-to-r from-forest-400 to-forest-600 rounded-full transition-all"
                  style={{ width: `${(gradeCompleted.length / gradeActivities.length) * 100}%` }}
                />
              </div>
              <Link to={`/activities?grade=${student.grade}`}
                className="block text-center bg-campfire-500 hover:bg-campfire-600 text-white font-black py-2.5 rounded-2xl transition-colors shadow text-sm">
                Continue Activities →
              </Link>
            </div>
          )}

          {/* Daily Check-In */}
          <DailyCheckIn />
        </div>

        {/* Right: Recent Activity */}
        <div className="space-y-5">
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-5 shadow-sm">
            <h3 className="font-black text-forest-800 mb-3">🕐 Recent Activity</h3>
            {recent.length === 0 ? (
              <p className="text-gray-400 font-semibold text-sm">
                No activities completed yet. Let's go! 🚀
              </p>
            ) : (
              <div className="space-y-2">
                {recent.map(a => (
                  <div key={a.id} className="flex items-center gap-2 text-sm">
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <p className="font-bold text-gray-800">{a.title}</p>
                      <p className="text-xs text-gray-500">+{a.points} pts</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent check-ins */}
          <div className="bg-white rounded-3xl border-2 border-gray-200 p-5 shadow-sm">
            <h3 className="font-black text-forest-800 mb-3">📅 Check-In Log</h3>
            {checkIns.length === 0 ? (
              <p className="text-gray-400 font-semibold text-sm">No check-ins yet.</p>
            ) : (
              <div className="space-y-2">
                {checkIns.slice(0, 5).map((c, i) => (
                  <div key={i} className="text-sm border-b border-gray-100 pb-2">
                    <p className="font-bold text-gray-700">
                      {new Date(c.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                    </p>
                    <p className="text-gray-500 capitalize">Mood: {c.mood}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
