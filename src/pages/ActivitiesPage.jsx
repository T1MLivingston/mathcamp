import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { GRADES, ACTIVITIES } from '../api/mockData'
import ActivityCard from '../components/ActivityCard'
import { useStudent } from '../context/StudentContext'

export default function ActivitiesPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const { student } = useStudent()
  const [selectedGrade, setSelectedGrade] = useState(
    searchParams.get('grade') || student?.grade || 'k'
  )

  useEffect(() => {
    const g = searchParams.get('grade')
    if (g) setSelectedGrade(g)
  }, [searchParams])

  const gradeInfo = GRADES.find(g => g.id === selectedGrade)
  const activities = ACTIVITIES[selectedGrade] || []

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-3xl font-black text-forest-800 mb-2">📚 Activities</h1>
      <p className="text-gray-600 font-semibold mb-6">
        Choose a grade and complete activities to earn points and badges!
      </p>

      {/* Grade tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {GRADES.map(g => (
          <button
            key={g.id}
            onClick={() => { setSelectedGrade(g.id); setSearchParams({ grade: g.id }) }}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-2xl font-black text-sm border-2 transition-all ${
              selectedGrade === g.id
                ? `${g.color} ${g.borderColor} ${g.textColor} shadow-md scale-105`
                : 'bg-white border-gray-200 text-gray-600 hover:border-gray-400'
            }`}
          >
            <img src={g.image} alt="" className="h-6 w-6 object-contain" />
            {g.label}
          </button>
        ))}
      </div>

      {/* Grade header */}
      {gradeInfo && (
        <div className={`flex items-center gap-4 rounded-3xl ${gradeInfo.color} border-2 ${gradeInfo.borderColor} p-4 mb-6 shadow-sm`}>
          <img src={gradeInfo.image} alt={gradeInfo.animal} className="h-20 object-contain" />
          <div>
            <h2 className={`text-2xl font-black ${gradeInfo.textColor}`}>{gradeInfo.name}</h2>
            <p className="text-gray-600 font-semibold text-sm">
              {activities.length} activities • Complete them all!
            </p>
          </div>
        </div>
      )}

      {!student && (
        <div className="bg-sunshine-100 border-2 border-sunshine-400 rounded-3xl p-4 mb-6 flex items-center justify-between gap-4">
          <p className="font-bold text-sunshine-600 text-sm">
            ⭐ Log in to track your progress and earn points!
          </p>
          <Link to="/login" className="shrink-0 bg-campfire-500 text-white font-black text-sm px-4 py-2 rounded-2xl hover:bg-campfire-600 transition-colors">
            Join Camp!
          </Link>
        </div>
      )}

      {/* Activity cards */}
      <div className="grid md:grid-cols-2 gap-4">
        {activities.map(a => <ActivityCard key={a.id} activity={a} />)}
      </div>
    </div>
  )
}
