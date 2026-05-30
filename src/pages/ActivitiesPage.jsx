import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { GRADES } from '../api/mockData'
import { useStudent } from '../context/StudentContext'

// 6 placeholder activity slots per grade
const PLACEHOLDER_ACTIVITIES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  label: `Activity ${i + 1}`,
}))

// Solid bg colors per grade that match the character art palette
const GRADE_BG = {
  k:   'bg-sunshine-300',
  '1': 'bg-sky-300',
  '2': 'bg-campfire-400',
  '3': 'bg-forest-500',
  '4': 'bg-sky-400',
  '5': 'bg-campfire-500',
}

const GRADE_TEXT = {
  k:   'text-sunshine-900',
  '1': 'text-sky-900',
  '2': 'text-campfire-900',
  '3': 'text-white',
  '4': 'text-sky-900',
  '5': 'text-white',
}

export default function ActivitiesPage() {
  const [searchParams] = useSearchParams()
  const { student } = useStudent()
  const [selectedGrade, setSelectedGrade] = useState(
    searchParams.get('grade') || student?.grade || 'k'
  )

  useEffect(() => {
    const g = searchParams.get('grade')
    if (g) setSelectedGrade(g)
  }, [searchParams])

  const gradeInfo = GRADES.find(g => g.id === selectedGrade)
  const bg = GRADE_BG[selectedGrade] || 'bg-forest-500'
  const textColor = GRADE_TEXT[selectedGrade] || 'text-white'

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Grade switcher — small image buttons */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {GRADES.map(g => (
          <button
            key={g.id}
            onClick={() => setSelectedGrade(g.id)}
            className={`transition-all duration-200 rounded-xl overflow-hidden focus:outline-none ${
              selectedGrade === g.id
                ? 'ring-4 ring-forest-500 scale-110 shadow-lg'
                : 'ring-2 ring-gray-200 opacity-70 hover:opacity-100 hover:ring-gray-400'
            }`}
          >
            <img src={g.image} alt={g.name} className="h-14 w-14 object-contain bg-white p-1" />
          </button>
        ))}
      </div>

      {/* Grade hero header — character on solid color band */}
      {gradeInfo && (
        <div className={`${bg} rounded-3xl mb-6 flex items-end justify-between overflow-hidden shadow-md px-6 pt-4`}>
          <div className={`pb-5 ${textColor}`}>
            <h1 className="text-3xl font-black leading-tight">{gradeInfo.name}</h1>
            <p className="font-semibold text-sm mt-1 opacity-80">Choose an activity to get started</p>
          </div>
          <img
            src={gradeInfo.image}
            alt={gradeInfo.animal}
            className="h-36 object-contain drop-shadow-lg"
          />
        </div>
      )}

      {!student && (
        <div className="bg-sunshine-100 border-2 border-sunshine-400 rounded-3xl p-4 mb-6 flex items-center justify-between gap-4">
          <p className="font-bold text-sunshine-700 text-sm">
            Log in to track your progress and earn points!
          </p>
          <Link to="/login" className="shrink-0 bg-campfire-500 text-white font-black text-sm px-4 py-2 rounded-2xl hover:bg-campfire-600 transition-colors">
            Join Camp!
          </Link>
        </div>
      )}

      {/* 3×3 activity grid */}
      <div className="grid grid-cols-3 gap-4">
        {PLACEHOLDER_ACTIVITIES.map((a) => (
          <div
            key={a.id}
            className="aspect-square rounded-3xl bg-white border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-forest-400 hover:shadow-md transition-all duration-200 group"
          >
            <div className="w-12 h-12 rounded-2xl bg-gray-100 group-hover:bg-forest-100 flex items-center justify-center mb-3 transition-colors">
              <div className="w-5 h-5 rounded bg-gray-300 group-hover:bg-forest-300 transition-colors" />
            </div>
            <p className="font-black text-gray-700 text-sm">{a.label}</p>
            <p className="text-xs text-gray-400 mt-1">Coming soon</p>
          </div>
        ))}
      </div>
    </div>
  )
}
