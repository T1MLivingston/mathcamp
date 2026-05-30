import { useState } from 'react'
import { useStudent } from '../context/StudentContext'

const MOODS = [
  { value: 'excited', label: 'Excited! 🤩' },
  { value: 'good',    label: 'Good 😊' },
  { value: 'okay',    label: 'Okay 😐' },
  { value: 'help',    label: 'Need Help 🙋' },
]

export default function DailyCheckIn() {
  const { submitCheckIn, hasCheckedInToday, checkIns } = useStudent()
  const [mood, setMood] = useState('')
  const [goal, setGoal] = useState('')
  const [submitted, setSubmitted] = useState(hasCheckedInToday)

  function handleSubmit(e) {
    e.preventDefault()
    if (!mood) return
    submitCheckIn(mood, goal)
    setSubmitted(true)
  }

  if (submitted || hasCheckedInToday) {
    const last = checkIns[0]
    return (
      <div className="bg-forest-50 border-2 border-forest-400 rounded-3xl p-5">
        <h3 className="font-black text-forest-800 text-lg mb-2">✅ Today's Check-In Complete!</h3>
        {last && (
          <div className="text-sm text-gray-600 space-y-1">
            <p><span className="font-bold">Mood:</span> {MOODS.find(m => m.value === last.mood)?.label}</p>
            {last.goal && <p><span className="font-bold">Goal:</span> {last.goal}</p>}
          </div>
        )}
        <p className="text-xs text-forest-600 font-bold mt-3">See you tomorrow! 🌟</p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-sky-300 rounded-3xl p-5 shadow-md">
      <h3 className="font-black text-forest-800 text-lg mb-4">🌅 Daily Check-In</h3>

      <div className="mb-4">
        <p className="font-bold text-gray-700 mb-2 text-sm">How are you feeling today?</p>
        <div className="grid grid-cols-2 gap-2">
          {MOODS.map(m => (
            <button
              key={m.value}
              type="button"
              onClick={() => setMood(m.value)}
              className={`py-2 px-3 rounded-2xl font-bold text-sm border-2 transition-all ${
                mood === m.value
                  ? 'bg-sky-500 border-sky-500 text-white'
                  : 'bg-sky-50 border-sky-200 text-sky-700 hover:border-sky-400'
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <label className="font-bold text-gray-700 mb-2 text-sm block">
          What's your math goal today?
        </label>
        <input
          type="text"
          value={goal}
          onChange={e => setGoal(e.target.value)}
          placeholder="e.g. Practice multiplication facts!"
          className="w-full border-2 border-gray-200 rounded-2xl px-4 py-2 text-sm font-semibold focus:outline-none focus:border-sky-400"
          maxLength={120}
        />
      </div>

      <button
        type="submit"
        disabled={!mood}
        className="w-full bg-campfire-500 hover:bg-campfire-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black py-3 rounded-2xl transition-colors shadow-md"
      >
        Check In! 🎯
      </button>
    </form>
  )
}
