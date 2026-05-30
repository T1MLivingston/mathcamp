import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { GRADES } from '../api/mockData'

export default function AccountInfoCard({ matchRef }) {
  const { student, login } = useStudent()
  const gradeInfo = student?.grade ? GRADES.find(g => g.id === student.grade) : null

  const [showLogin, setShowLogin] = useState(false)
  const [email, setEmail] = useState('')
  const [grade, setGrade] = useState('')
  const [displayName, setDisplayName] = useState('')

  function handleLogin(e) {
    e.preventDefault()
    if (!email || !grade) return
    login(email.trim(), grade, displayName.trim() || undefined)
    setShowLogin(false)
  }

  if (showLogin) {
    return (
      <div className="bg-white rounded-3xl shadow-lg border-2 border-forest-200 p-5 h-full flex flex-col">
        <button
          onClick={() => setShowLogin(false)}
          className="text-sm font-bold text-gray-400 hover:text-gray-600 mb-3 self-start"
        >
          ← Back
        </button>
        <h2 className="font-black text-forest-800 text-xl mb-4 text-center">Join Camp!</h2>
        <form onSubmit={handleLogin} className="flex flex-col gap-3 flex-1">
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-2.5 font-semibold text-sm focus:outline-none focus:border-forest-500"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1">Camper Name (optional)</label>
            <input
              type="text"
              value={displayName}
              onChange={e => setDisplayName(e.target.value)}
              placeholder="Your nickname"
              maxLength={30}
              className="w-full border-2 border-gray-200 rounded-2xl px-4 py-2.5 font-semibold text-sm focus:outline-none focus:border-forest-500"
            />
          </div>
          <div>
            <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Your Grade</label>
            <div className="grid grid-cols-3 gap-1.5">
              {GRADES.map(g => (
                <button
                  key={g.id}
                  type="button"
                  onClick={() => setGrade(g.id)}
                  style={grade === g.id ? { backgroundColor: g.bg } : {}}
                  className={`rounded-xl overflow-hidden border-2 transition-all focus:outline-none p-0.5 ${
                    grade === g.id ? 'ring-2 ring-forest-500 border-transparent scale-105' : 'border-gray-200 bg-gray-50 hover:border-gray-300'
                  }`}
                >
                  <img src={g.image} alt={g.name} className="w-full h-10 object-contain" />
                  <p className="text-xs font-black pb-0.5" style={grade === g.id ? { color: '#166534' } : { color: '#6b7280' }}>
                    {g.label}
                  </p>
                </button>
              ))}
            </div>
          </div>
          <button
            type="submit"
            disabled={!email || !grade}
            className="mt-auto w-full bg-campfire-500 hover:bg-campfire-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black py-3 rounded-2xl transition-colors shadow-md"
          >
            Start Camping!
          </button>
        </form>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-forest-200 p-5 h-full flex flex-col">
      {/* Circle avatar */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-sunshine-300 shadow-md bg-sunshine-100 flex items-center justify-center">
          {gradeInfo ? (
            <img src={gradeInfo.pfp} alt={gradeInfo.animal} className="w-full h-full object-cover" />
          ) : (
            <span className="text-4xl">🏕️</span>
          )}
        </div>
        <p className="font-black text-xl text-forest-800 mt-3">
          {student?.display_name || 'Guest Camper'}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          {gradeInfo ? gradeInfo.name : 'No grade selected'}
        </p>
      </div>

      {student ? (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-2 mb-3">
            <div className="bg-sunshine-100 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-sunshine-500">{student.points || 0}</p>
              <p className="text-xs font-bold text-gray-600">Points</p>
            </div>
            <div className="bg-campfire-50 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-campfire-600">{student.streak || 0}</p>
              <p className="text-xs font-bold text-gray-600">Day Streak</p>
            </div>
            <div className="bg-sky-100 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-sky-600">{student.activitiesCompleted || 0}</p>
              <p className="text-xs font-bold text-gray-600">Activities</p>
            </div>
            <div className="bg-forest-100 rounded-2xl p-3 text-center">
              <p className="text-2xl font-black text-forest-700">{student.checkIns || 0}</p>
              <p className="text-xs font-bold text-gray-600">Check-Ins</p>
            </div>
          </div>
          <Link
            to="/badges"
            className="block w-full text-center bg-sunshine-400 hover:bg-sunshine-500 text-forest-900 font-black py-2.5 rounded-2xl transition-colors shadow-sm"
          >
            My Badges
          </Link>
        </>
      ) : (
        <div className="flex flex-col gap-2 mt-auto">
          <button
            onClick={() => setShowLogin(true)}
            className="block w-full text-center bg-campfire-500 hover:bg-campfire-600 text-white font-black py-3 rounded-2xl transition-colors shadow-md"
          >
            Log In / Sign Up
          </button>
          <Link
            to="/badges"
            className="block w-full text-center bg-sunshine-400 hover:bg-sunshine-500 text-forest-900 font-black py-2.5 rounded-2xl transition-colors shadow-sm"
          >
            My Badges
          </Link>
        </div>
      )}
    </div>
  )
}
