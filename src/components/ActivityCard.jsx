import { useStudent } from '../context/StudentContext'

const FRACTION_IDS = ['3c', '4b', '5a']

export default function ActivityCard({ activity }) {
  const { completedActivities, completeActivity, student } = useStudent()
  const done = completedActivities.includes(activity.id)

  function handleComplete() {
    if (done) return
    const isFraction = FRACTION_IDS.includes(activity.id)
    completeActivity(activity.id, activity.points, isFraction)
  }

  return (
    <div className={`rounded-3xl border-2 p-4 shadow-md transition-all ${done ? 'bg-forest-50 border-forest-400' : 'bg-white border-gray-200 hover:border-campfire-400 hover:shadow-lg'}`}>
      <div className="flex items-start gap-3">
        <span className="text-4xl">{activity.icon}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-black text-forest-800 text-base">{activity.title}</h3>
            {done && <span className="text-xs bg-forest-500 text-white font-bold px-2 py-0.5 rounded-full">✓ Done</span>}
          </div>
          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
          <div className="flex items-center justify-between mt-3">
            <span className="text-xs font-bold text-sunshine-500 bg-sunshine-100 px-2 py-1 rounded-full">
              ⭐ {activity.points} pts
            </span>
            {!done && student && (
              <button
                onClick={handleComplete}
                className="bg-campfire-500 hover:bg-campfire-600 text-white font-black text-sm px-4 py-2 rounded-2xl transition-colors shadow"
              >
                Complete!
              </button>
            )}
            {done && (
              <span className="text-forest-600 font-bold text-sm">🎉 Completed!</span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
