import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { GRADES } from '../api/mockData'

export default function LoginPage() {
  const [name, setName] = useState('')
  const [grade, setGrade] = useState('')
  const { login } = useStudent()
  const navigate = useNavigate()

  function handleStart(e) {
    e.preventDefault()
    if (!grade) return
    login(name.trim() || 'Guest Camper', grade)
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-100 to-cream flex items-center justify-center px-4 py-12">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-forest-200 p-8 w-full max-w-md">
        <div className="text-center mb-8">
          <div className="text-7xl mb-3">⛺</div>
          <h1 className="text-3xl font-black text-forest-800">Welcome to Math Camp!</h1>
          <p className="text-gray-500 font-semibold mt-2">
            Pick your name and grade to start your adventure.
          </p>
        </div>

        <form onSubmit={handleStart} className="space-y-5">
          <div>
            <label className="block font-black text-forest-700 mb-2">
              Your Camper Name (optional)
            </label>
            <input
              type="text"
              value={name}
              onChange={e => setName(e.target.value)}
              placeholder="e.g. MathKid, StarCamper…"
              maxLength={30}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 font-bold text-lg focus:outline-none focus:border-forest-500"
            />
          </div>

          <div>
            <label className="block font-black text-forest-700 mb-2">
              Your Grade Level *
            </label>
            <div className="grid grid-cols-3 gap-2">
              {GRADES.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGrade(g.id)}
                  className={`flex flex-col items-center rounded-2xl border-4 p-2 transition-all ${
                    grade === g.id
                      ? `${g.color} ${g.borderColor} scale-105 shadow-lg`
                      : 'bg-gray-50 border-gray-200 hover:border-gray-400'
                  }`}
                >
                  <img src={g.image} alt={g.name} className="h-14 object-contain" />
                  <span className={`font-black text-lg ${grade === g.id ? g.textColor : 'text-gray-600'}`}>
                    {g.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={!grade}
            className="w-full bg-campfire-500 hover:bg-campfire-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-black text-xl py-4 rounded-2xl transition-colors shadow-lg"
          >
            🚀 Start Camping!
          </button>
        </form>
      </div>
    </div>
  )
}
