import { useState } from 'react'
import { useStudent } from '../context/StudentContext'
import { GRADES } from '../api/mockData'

export default function WelcomeModal({ onClose }) {
  const { login } = useStudent()
  const [email, setEmail] = useState('')
  const [grade, setGrade] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [step, setStep] = useState('welcome') // 'welcome' | 'form'

  function handleGuest() {
    login('', null, 'Guest Camper')
    onClose()
  }

  function handleSubmit(e) {
    e.preventDefault()
    if (!grade) return
    login(email.trim(), grade, displayName.trim() || undefined)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-forest-900/60 backdrop-blur-sm">
      <div className="bg-white rounded-3xl shadow-2xl border-2 border-forest-200 w-full max-w-md overflow-hidden">

        {step === 'welcome' ? (
          <div className="p-8 text-center">
            <div className="text-7xl mb-3">⛺</div>
            <h1 className="text-3xl font-black text-forest-800 mb-2">Welcome to Math Camp!</h1>
            <p className="text-gray-500 font-semibold mb-8">
              Practice math, earn badges, and keep your brain sharp all summer.
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => setStep('form')}
                className="w-full bg-campfire-500 hover:bg-campfire-600 text-white font-black text-lg py-4 rounded-2xl transition-colors shadow-lg"
              >
                Log In / Sign Up
              </button>
              <button
                onClick={handleGuest}
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-600 font-black py-3 rounded-2xl transition-colors"
              >
                Continue as Guest
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-4">
              Logging in lets us save your progress and badges!
            </p>
          </div>
        ) : (
          <div className="p-8">
            <button onClick={() => setStep('welcome')} className="text-sm font-bold text-gray-400 hover:text-gray-600 mb-4 block">
              ← Back
            </button>
            <h2 className="text-2xl font-black text-forest-800 mb-5 text-center">Join Camp!</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-1">Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@example.com"
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-forest-500"
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
                  className="w-full border-2 border-gray-200 rounded-2xl px-4 py-3 font-semibold focus:outline-none focus:border-forest-500"
                />
              </div>
              <div>
                <label className="block text-xs font-black text-gray-500 uppercase tracking-wide mb-2">Pick Your Grade *</label>
                <div className="grid grid-cols-3 gap-2">
                  {GRADES.map(g => (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => setGrade(g.id)}
                      style={{ backgroundColor: g.bg }}
                      className={`rounded-2xl overflow-hidden p-1 border-2 transition-all focus:outline-none ${
                        grade === g.id
                          ? 'ring-4 ring-forest-500 border-transparent scale-105 shadow-md'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img src={g.image} alt={g.name} className="w-full h-16 object-contain block" />
                      <p className="text-xs font-black text-center pb-1 text-gray-700">{g.label}</p>
                    </button>
                  ))}
                </div>
              </div>
              <button
                type="submit"
                disabled={!email || !grade}
                className="w-full bg-campfire-500 hover:bg-campfire-600 disabled:bg-gray-200 disabled:cursor-not-allowed text-white font-black text-lg py-4 rounded-2xl transition-colors shadow-lg"
              >
                Start Camping!
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
