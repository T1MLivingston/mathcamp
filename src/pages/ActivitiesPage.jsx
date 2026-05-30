import { useState, useEffect } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { GRADES } from '../api/mockData'
import { useStudent } from '../context/StudentContext'

const PLACEHOLDER_ACTIVITIES = Array.from({ length: 6 }, (_, i) => ({
  id: i,
  label: `Activity ${i + 1}`,
}))

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

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">

      {/* Back home */}
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-sm font-black text-forest-700 hover:text-forest-900 bg-white/80 hover:bg-white px-4 py-2 rounded-2xl shadow-sm border border-forest-200 mb-5 transition-all"
      >
        ← Home
      </Link>

      {/* Grade switcher — each image on its own color, no white */}
      <div className="flex gap-2 flex-wrap justify-center mb-6">
        {GRADES.map(g => (
          <button
            key={g.id}
            onClick={() => setSelectedGrade(g.id)}
            style={{ backgroundColor: g.bg }}
            className={`rounded-2xl overflow-hidden focus:outline-none transition-all duration-200 p-1 ${
              selectedGrade === g.id
                ? 'ring-4 ring-forest-600 scale-110 shadow-lg'
                : 'ring-2 ring-transparent opacity-70 hover:opacity-100 hover:ring-gray-300'
            }`}
          >
            <img src={g.image} alt={g.name} className="h-14 w-14 object-contain block" />
          </button>
        ))}
      </div>

      {/* Grade hero header — character seamlessly on its own bg color */}
      {gradeInfo && (
        <div
          className="rounded-3xl mb-6 flex items-end justify-between overflow-hidden shadow-sm px-6 pt-4"
          style={{ backgroundColor: gradeInfo.bg }}
        >
          <div className="pb-5">
            <h1 className="text-3xl font-black leading-tight text-gray-800">{gradeInfo.name}</h1>
            <p className="font-semibold text-sm mt-1 text-gray-600">Choose an activity to get started</p>
          </div>
          <img
            src={gradeInfo.image}
            alt={gradeInfo.animal}
            className="h-36 object-contain block"
          />
        </div>
      )}

      {!student && (
        <div className="bg-sunshine-100 border-2 border-sunshine-400 rounded-3xl p-4 mb-6 flex items-center justify-between gap-4">
          <p className="font-bold text-sunshine-700 text-sm">Log in to track your progress and earn points!</p>
          <Link to="/" className="shrink-0 bg-campfire-500 text-white font-black text-sm px-4 py-2 rounded-2xl hover:bg-campfire-600 transition-colors">
            Join Camp!
          </Link>
        </div>
      )}

      {/* 3×2 activity grid */}
      <div className="grid grid-cols-3 gap-4">
        {PLACEHOLDER_ACTIVITIES.map((a) => (
          <div
            key={a.id}
            className="aspect-square rounded-3xl bg-white border-2 border-gray-200 shadow-sm flex flex-col items-center justify-center p-4 text-center cursor-pointer hover:border-forest-400 hover:shadow-md transition-all duration-200 group"
          >
            <div
              className="w-12 h-12 rounded-2xl flex items-center justify-center mb-3 transition-colors"
              style={{ backgroundColor: gradeInfo?.bg ? gradeInfo.bg + '55' : '#f3f4f6' }}
            >
              <div className="w-5 h-5 rounded bg-white/60" />
            </div>
            <p className="font-black text-gray-700 text-sm">{a.label}</p>
            <p className="text-xs text-gray-400 mt-1">Coming soon</p>
          </div>
        ))}
      </div>
    </div>
  )
}
