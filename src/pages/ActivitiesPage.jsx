import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { GRADES } from '../api/mockData'
import { useStudent } from '../context/StudentContext'

const PLACEHOLDER_ACTIVITIES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  label: `Activity ${i + 1}`,
}))

// Exact background colors sampled from each character image
const GRADE_COLORS = {
  k:   { bg: '#BD9CEF', text: '#3b1f6e' },
  '1': { bg: '#F8E37D', text: '#5a4200' },
  '2': { bg: '#F5D4AA', text: '#6b3a0f' },
  '3': { bg: '#C0EDE3', text: '#0d4035' },
  '4': { bg: '#DDC1A5', text: '#4a2e10' },
  '5': { bg: '#DDC1A5', text: '#4a2e10' },
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
  const colors = GRADE_COLORS[selectedGrade] || { bg: '#C0EDE3', text: '#0d4035' }

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Grade switcher */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {GRADES.map(g => {
          const gc = GRADE_COLORS[g.id]
          return (
            <button
              key={g.id}
              onClick={() => setSelectedGrade(g.id)}
              style={selectedGrade === g.id ? { backgroundColor: gc.bg } : {}}
              className={`transition-all duration-200 rounded-xl overflow-hidden focus:outline-none p-1 ${
                selectedGrade === g.id
                  ? 'ring-4 ring-forest-500 scale-110 shadow-lg'
                  : 'ring-2 ring-gray-200 bg-white opacity-70 hover:opacity-100 hover:ring-gray-400'
              }`}
            >
              <img src={g.image} alt={g.name} className="h-14 w-14 object-contain" />
            </button>
          )
        })}
      </div>

      {/* Grade hero header */}
      {gradeInfo && (
        <div
          className="rounded-3xl mb-6 flex items-end justify-between overflow-hidden shadow-md px-6 pt-4"
          style={{ backgroundColor: colors.bg }}
        >
          <div className="pb-5" style={{ color: colors.text }}>
            <h1 className="text-3xl font-black leading-tight">{gradeInfo.name}</h1>
            <p className="font-semibold text-sm mt-1 opacity-75">Choose an activity to get started</p>
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

      {/* 3×2 activity grid (6 cards) */}
      <div className="grid grid-cols-3 gap-4">
        {PLACEHOLDER_ACTIVITIES.map((a) => (
          <div
            key={a.id}
            className="aspect-square rounded-3xl bg-white border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-forest-400 hover:shadow-md transition-all duration-200 group"
            style={{ '--hover-bg': colors.bg }}
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors bg-gray-100 group-hover:opacity-80"
              style={{}}
            >
              <div className="w-5 h-5 rounded bg-gray-300 group-hover:bg-gray-400 transition-colors" />
            </div>
            <p className="font-black text-gray-700 text-sm">{a.label}</p>
            <p className="text-xs text-gray-400 mt-1">Coming soon</p>
          </div>
        ))}
      </div>
    </div>
  )
}
