import { useState, useMemo, useCallback } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GRADES } from '../api/mockData'
import { GRADE_ACTIVITIES } from '../api/mathContent'
import { useCampProgress } from '../context/CampProgressContext'

export default function GamePage() {
  const { gradeId, activityId } = useParams()
  const navigate = useNavigate()
  const gradeInfo = GRADES.find(g => g.id === gradeId)
  const gradeContent = GRADE_ACTIVITIES[gradeId]
  const { completeActivity, completeQuiz } = useCampProgress()

  const isQuiz = activityId === 'quiz'
  const activityConfig = isQuiz
    ? gradeContent?.quiz
    : gradeContent?.activities.find(a => a.id === activityId)

  const questions = useMemo(() => {
    if (!activityConfig) return []
    return activityConfig.generate()
  }, [activityConfig?.id])

  const [qIndex, setQIndex] = useState(0)
  const [selected, setSelected] = useState(null)
  const [score, setScore] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [done, setDone] = useState(false)
  const [marked, setMarked] = useState(false)

  const color = gradeContent?.color || '#2980B9'
  const colorLight = gradeContent?.colorLight || '#d5e8f5'
  const totalQ = questions.length
  const current = questions[qIndex]

  function handleAnswer(idx) {
    if (selected !== null) return
    setSelected(idx)
    if (idx === current.correct) {
      setScore(s => s + (isQuiz ? 15 : 10))
      setCorrectCount(c => c + 1)
    }
  }

  function handleNext() {
    if (qIndex + 1 >= totalQ) {
      setDone(true)
    } else {
      setQIndex(i => i + 1)
      setSelected(null)
    }
  }

  function handleMarkComplete() {
    if (marked) return
    setMarked(true)
    if (isQuiz) {
      completeQuiz(gradeId, correctCount, totalQ)
    } else {
      const pts = 50 + score
      completeActivity(gradeId, activityId, pts)
    }
    navigate(`/grade/${gradeId}`)
  }

  if (!gradeInfo || !gradeContent || !activityConfig) {
    return <div className="p-8 text-center font-black text-gray-500">Activity not found.</div>
  }

  if (done) {
    return (
      <SummaryScreen
        score={score}
        correctCount={correctCount}
        totalQ={totalQ}
        isQuiz={isQuiz}
        color={color}
        colorLight={colorLight}
        gradeInfo={gradeInfo}
        activityTitle={activityConfig.title}
        onMarkComplete={handleMarkComplete}
        onReplay={() => { setQIndex(0); setSelected(null); setScore(0); setCorrectCount(0); setDone(false); setMarked(false) }}
        marked={marked}
      />
    )
  }

  if (!current) return null

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Header bar */}
      <div className="lg:hidden flex items-center gap-3 px-4 py-3 bg-white border-b border-gray-200">
        <button
          onClick={() => navigate(`/grade/${gradeId}`)}
          className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center font-black text-gray-600 text-lg"
        >←</button>
        <span className="font-black text-gray-700 flex-1 truncate text-sm">{activityConfig.title}</span>
        <img src={gradeInfo.pfp} alt="" className="w-9 h-9 rounded-full border-2 object-cover" style={{ borderColor: color }} />
      </div>

      {/* LEFT — Game panel */}
      <div className="flex-1 flex flex-col p-4 lg:p-8">
        {/* Desktop header */}
        <div className="hidden lg:flex items-center gap-3 mb-6">
          <button
            onClick={() => navigate(`/grade/${gradeId}`)}
            className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center font-black text-gray-600 text-xl hover:bg-gray-50 transition-colors"
          >←</button>
          <span className="font-black text-gray-800 text-lg flex-1">{activityConfig.title}</span>
          <img src={gradeInfo.pfp} alt="" className="w-12 h-12 rounded-full border-4 object-cover" style={{ borderColor: color }} />
        </div>

        {/* Character + question area */}
        <div className="flex-1 flex flex-col">
          <div className="relative bg-white rounded-3xl shadow-sm border border-gray-200 p-6 mb-5 overflow-hidden min-h-[160px] flex items-center justify-center">
            <img
              src={gradeInfo.image}
              alt={gradeInfo.name}
              className="absolute right-4 bottom-0 h-28 object-contain opacity-60 pointer-events-none hidden sm:block"
            />
            <p className="text-2xl lg:text-3xl font-black text-gray-800 text-center leading-snug whitespace-pre-line relative z-10 max-w-lg">
              {current.text}
            </p>
          </div>

          {/* Answer choices 2×2 */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {current.choices.map((choice, idx) => {
              let bg = 'bg-white'
              let border = 'border-gray-200'
              let text = 'text-gray-800'
              if (selected !== null) {
                if (idx === current.correct) { bg = 'bg-green-100'; border = 'border-green-500'; text = 'text-green-800' }
                else if (idx === selected && selected !== current.correct) { bg = 'bg-red-100'; border = 'border-red-400'; text = 'text-red-700' }
                else { bg = 'bg-white'; border = 'border-gray-100'; text = 'text-gray-400' }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selected !== null}
                  className={`${bg} ${text} border-2 ${border} rounded-2xl p-4 text-center font-black text-lg lg:text-xl transition-all duration-150 shadow-sm
                    ${selected === null ? 'hover:border-current hover:shadow-md active:scale-95' : ''}
                    disabled:cursor-default`}
                  style={selected === null ? { '--tw-border-opacity': 1 } : {}}
                  onMouseEnter={e => { if (selected === null) e.currentTarget.style.borderColor = color }}
                  onMouseLeave={e => { if (selected === null) e.currentTarget.style.borderColor = '' }}
                >
                  {choice}
                </button>
              )
            })}
          </div>

          {/* Feedback + Next */}
          {selected !== null && (
            <div className="flex items-center gap-3">
              <div className={`flex-1 rounded-2xl px-4 py-3 font-black text-base ${selected === current.correct ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                {selected === current.correct ? 'Great job! +' + (isQuiz ? 15 : 10) + ' pts' : `Not quite! The answer is ${current.choices[current.correct]}`}
              </div>
              <button
                onClick={handleNext}
                className="shrink-0 px-6 py-3 rounded-2xl font-black text-white text-base shadow-sm hover:opacity-90 active:scale-95 transition-all"
                style={{ backgroundColor: color }}
              >
                {qIndex + 1 >= totalQ ? 'Finish' : 'Next →'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT — Stats panel */}
      <div
        className="lg:w-72 shrink-0 p-4 lg:p-6 lg:border-l-2 border-gray-200"
        style={{ backgroundColor: colorLight }}
      >
        {/* Score card */}
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 text-center">
            <StatBox label="Score" value={score} color={color} />
            <StatBox label="Question" value={`${qIndex + 1}/${totalQ}`} color={color} />
            <StatBox label="Correct" value={correctCount} color={color} />
            <StatBox label="Streak" value={`${correctCount === qIndex + 1 - (selected !== null ? 0 : 0) ? correctCount : correctCount}🔥`} color={color} />
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {questions.map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2"
              style={{
                backgroundColor: i < qIndex ? color : i === qIndex ? color + '80' : '#e5e7eb',
                borderColor: i <= qIndex ? color : '#e5e7eb',
              }}
            />
          ))}
        </div>

        {/* Learning goals */}
        {!isQuiz && activityConfig.goals && (
          <div className="bg-white rounded-2xl p-4 shadow-sm">
            <div className="font-black text-sm text-gray-700 mb-2">Learning Goals</div>
            <ul className="space-y-1.5">
              {activityConfig.goals.map((g, i) => (
                <li key={i} className="flex gap-2 text-xs text-gray-600 font-semibold">
                  <span style={{ color }} className="shrink-0 font-black">•</span>
                  {g}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2">
      <div className="text-xs font-bold text-gray-500 uppercase tracking-wide">{label}</div>
      <div className="text-xl font-black mt-0.5" style={{ color }}>{value}</div>
    </div>
  )
}

function SummaryScreen({ score, correctCount, totalQ, isQuiz, color, colorLight, gradeInfo, activityTitle, onMarkComplete, onReplay, marked }) {
  const pct = Math.round((correctCount / totalQ) * 100)
  return (
    <div className="min-h-screen flex items-center justify-center p-4" style={{ backgroundColor: colorLight }}>
      <div className="bg-white rounded-3xl shadow-lg p-8 max-w-sm w-full text-center">
        <img src={gradeInfo.image} alt="" className="h-32 mx-auto object-contain mb-4" />
        <h2 className="text-2xl font-black text-gray-800 mb-1">{activityTitle}</h2>
        <p className="text-sm font-semibold text-gray-500 mb-6">Activity Complete!</p>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-2xl p-4" style={{ backgroundColor: colorLight }}>
            <div className="text-3xl font-black" style={{ color }}>{correctCount}/{totalQ}</div>
            <div className="text-xs font-bold text-gray-500 mt-1">Correct</div>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: colorLight }}>
            <div className="text-3xl font-black" style={{ color }}>{score}</div>
            <div className="text-xs font-bold text-gray-500 mt-1">Points</div>
          </div>
        </div>

        <div className="mb-4 text-base font-black text-gray-700">
          {pct === 100 ? 'Perfect score!' : pct >= 80 ? 'Great work!' : pct >= 60 ? 'Good effort!' : 'Keep practicing!'}
        </div>

        <div className="flex flex-col gap-3">
          {!marked && (
            <button
              onClick={onMarkComplete}
              className="w-full py-3 rounded-2xl font-black text-white text-base shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: color }}
            >
              Mark Complete (+{isQuiz ? score + 100 : 50 + score} pts)
            </button>
          )}
          {marked && (
            <div className="w-full py-3 rounded-2xl font-black text-white text-base text-center" style={{ backgroundColor: color }}>
              Saved!
            </div>
          )}
          <button
            onClick={onReplay}
            className="w-full py-3 rounded-2xl font-black text-gray-600 bg-gray-100 text-base hover:bg-gray-200 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}
