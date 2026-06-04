import { useState, useMemo, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { GRADES } from '../api/mockData'
import { GRADE_ACTIVITIES } from '../api/mathContent'
import { useCampProgress } from '../context/CampProgressContext'

// ─── Dice SVG ────────────────────────────────────────────────────
const DICE_DOTS = {
  1: [[50, 50]],
  2: [[28, 28], [72, 72]],
  3: [[28, 28], [50, 50], [72, 72]],
  4: [[28, 28], [72, 28], [28, 72], [72, 72]],
  5: [[28, 28], [72, 28], [50, 50], [28, 72], [72, 72]],
  6: [[28, 28], [72, 28], [28, 50], [72, 50], [28, 72], [72, 72]],
}

function DiceFace({ value, size = 72, shaking }) {
  const dots = DICE_DOTS[value] || []
  return (
    <svg
      width={size} height={size} viewBox="0 0 100 100"
      className={`transition-transform ${shaking ? 'animate-dice-shake' : ''}`}
      style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.18))' }}
    >
      <rect x="4" y="4" width="92" height="92" rx="18" ry="18" fill="white" stroke="#e2e8f0" strokeWidth="3" />
      {dots.map(([cx, cy], i) => (
        <circle key={i} cx={cx} cy={cy} r="8" fill="#1e293b" />
      ))}
    </svg>
  )
}

// ─── Counting Visual ─────────────────────────────────────────────
function CountingVisual({ data }) {
  const { count, emoji, word } = data
  const rows = []
  const perRow = count <= 10 ? count : Math.ceil(count / 2)
  for (let i = 0; i < count; i += perRow) {
    rows.push(emoji.repeat(Math.min(perRow, count - i)))
  }
  return (
    <div className="text-center">
      <p className="text-xl font-black text-gray-700 mb-4">
        How many <span className="underline decoration-dotted">{word}</span> are there?
      </p>
      <div className="mt-3 flex flex-col items-center gap-1">
        {rows.map((row, i) => (
          <div key={i} style={{ fontSize: '2.4rem', lineHeight: 1.2, letterSpacing: '0.12em' }}>
            {row}
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Fruit Sort Visual ───────────────────────────────────────────
function FruitSortVisual({ data }) {
  const { items, targetEmoji, targetWord } = data
  return (
    <div className="text-center">
      <p className="text-xl font-black text-gray-700 mb-4">
        How many <span className="underline decoration-dotted">{targetWord}</span> are in the basket?
      </p>
      {/* Basket */}
      <div className="relative mx-auto" style={{ maxWidth: 320 }}>
        <div
          className="rounded-2xl border-4 border-amber-600 bg-amber-50 px-4 pt-4 pb-6 mx-auto"
          style={{ borderStyle: 'dashed', minHeight: 90 }}
        >
          <div className="flex flex-wrap justify-center gap-1.5" style={{ fontSize: '2rem', lineHeight: 1 }}>
            {items.map((item, i) => (
              <span key={i} style={{ display: 'inline-block' }}>{item}</span>
            ))}
          </div>
        </div>
        {/* basket handle arc */}
        <div
          className="absolute left-1/2 -translate-x-1/2"
          style={{ top: -18, width: 60, height: 22, border: '4px solid #92400e', borderBottom: 'none', borderRadius: '40px 40px 0 0' }}
        />
      </div>
    </div>
  )
}

// ─── Number Bond Tree Visual ─────────────────────────────────────
function NumberBondVisual({ data, color, colorLight }) {
  const { total, left, right } = data
  return (
    <div className="text-center">
      <p className="text-xl font-black text-gray-700 mb-5">Find the missing part!</p>
      <div className="flex flex-col items-center">
        {/* Total circle */}
        <BondCircle value={total} size="lg" color={color} />

        {/* Connector lines */}
        <div className="relative flex items-start justify-center w-36 h-10">
          <svg width="144" height="40" viewBox="0 0 144 40" className="absolute inset-0">
            <line x1="72" y1="0" x2="28" y2="40" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
            <line x1="72" y1="0" x2="116" y2="40" stroke="#9ca3af" strokeWidth="3" strokeLinecap="round" />
          </svg>
        </div>

        {/* Parts */}
        <div className="flex gap-8 mt-1">
          <BondCircle value={left} size="md" color={color} colorLight={colorLight} />
          <BondCircle value={right} size="md" color={color} colorLight={colorLight} />
        </div>
      </div>
    </div>
  )
}

function BondCircle({ value, size, color, colorLight }) {
  const isBlank = value === '?'
  const dim = size === 'lg' ? 72 : 60
  const fontSize = size === 'lg' ? '1.7rem' : '1.5rem'
  return (
    <div
      className="rounded-full flex items-center justify-center font-black shadow-md border-4"
      style={{
        width: dim, height: dim, fontSize,
        backgroundColor: isBlank ? colorLight || '#f3f4f6' : color || '#6366f1',
        color: isBlank ? color || '#6366f1' : '#fff',
        borderColor: color || '#6366f1',
      }}
    >
      {isBlank ? '?' : value}
    </div>
  )
}

// ─── Bond Box Visual (1st grade addition) ───────────────────────
function BondBoxVisual({ data, color, colorLight }) {
  const { a, b, sum, missing } = data
  return (
    <div className="text-center">
      <p className="text-lg font-black text-gray-600 mb-5">
        {missing === 'sum' ? 'What is the sum?' : 'Find the missing number!'}
      </p>
      <div
        className="rounded-2xl px-6 py-5 mx-auto inline-flex items-center gap-3 shadow-sm border-2"
        style={{ backgroundColor: colorLight, borderColor: color + '55' }}
      >
        {/* Part A box */}
        <PartBox value={missing === 'a' ? '?' : a} color={color} colorLight={colorLight} missing={missing === 'a'} />

        <span className="text-3xl font-black text-gray-500">+</span>

        {/* Part B box */}
        <PartBox value={missing === 'b' ? '?' : b} color={color} colorLight={colorLight} missing={missing === 'b'} />

        <span className="text-3xl font-black text-gray-500">=</span>

        {/* Sum box — bigger */}
        <SumBox value={missing === 'sum' ? '?' : sum} color={color} colorLight={colorLight} missing={missing === 'sum'} />
      </div>
    </div>
  )
}

function PartBox({ value, color, colorLight, missing }) {
  return (
    <div
      className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl font-black border-4 shadow-sm"
      style={{
        backgroundColor: missing ? '#fff' : color,
        color: missing ? color : '#fff',
        borderColor: color,
        borderStyle: missing ? 'dashed' : 'solid',
      }}
    >
      {value}
    </div>
  )
}

function SumBox({ value, color, colorLight, missing }) {
  return (
    <div
      className="w-20 h-20 rounded-2xl flex items-center justify-center text-4xl font-black border-4 shadow-md"
      style={{
        backgroundColor: missing ? '#fff' : color,
        color: missing ? color : '#fff',
        borderColor: color,
        borderStyle: missing ? 'dashed' : 'solid',
      }}
    >
      {value}
    </div>
  )
}

// ─── Dice Addition Visual ────────────────────────────────────────
function DiceVisual({ data, color, shaking, onShake, answered }) {
  const { dice } = data
  return (
    <div className="text-center">
      <p className="text-xl font-black text-gray-700 mb-5">Add up the dice!</p>
      <div className="flex items-center justify-center gap-4 mb-5 flex-wrap">
        {dice.map((val, i) => (
          <span key={i} className="flex flex-col items-center gap-1">
            <DiceFace value={val} size={80} shaking={shaking} />
          </span>
        ))}
      </div>
      {!answered && (
        <button
          onClick={onShake}
          className="px-5 py-2.5 rounded-2xl font-black text-white text-sm shadow-sm hover:opacity-90 active:scale-95 transition-all select-none"
          style={{ backgroundColor: color }}
        >
          Shake Dice!
        </button>
      )}
    </div>
  )
}

// ─── Question renderer dispatch ──────────────────────────────────
function QuestionDisplay({ question, color, colorLight, shaking, onShake, answered }) {
  if (!question) return null
  switch (question.type) {
    case 'counting':
      return <CountingVisual data={question.data} />
    case 'fruit-sort':
      return <FruitSortVisual data={question.data} />
    case 'number-bond':
      return <NumberBondVisual data={question.data} color={color} colorLight={colorLight} />
    case 'bond-box':
      return <BondBoxVisual data={question.data} color={color} colorLight={colorLight} />
    case 'dice-add':
      return <DiceVisual data={question.data} color={color} shaking={shaking} onShake={onShake} answered={answered} />
    default:
      return (
        <p className="text-2xl lg:text-3xl font-black text-gray-800 text-center leading-snug whitespace-pre-line">
          {question.text}
        </p>
      )
  }
}

// ─── Main Game Page ──────────────────────────────────────────────
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
  const [shaking, setShaking] = useState(false)

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
      setShaking(false)
    }
  }

  function handleShake() {
    setShaking(true)
    setTimeout(() => setShaking(false), 600)
  }

  function handleMarkComplete() {
    if (marked) return
    setMarked(true)
    if (isQuiz) {
      completeQuiz(gradeId, correctCount, totalQ)
    } else {
      completeActivity(gradeId, activityId, 50 + score)
    }
    navigate(`/grade/${gradeId}`)
  }

  if (!gradeInfo || !gradeContent || !activityConfig) {
    return <div className="p-8 text-center font-black text-gray-500">Activity not found.</div>
  }

  if (done) {
    return (
      <SummaryScreen
        score={score} correctCount={correctCount} totalQ={totalQ} isQuiz={isQuiz}
        color={color} colorLight={colorLight} gradeInfo={gradeInfo}
        activityTitle={activityConfig.title}
        onMarkComplete={handleMarkComplete}
        onReplay={() => { setQIndex(0); setSelected(null); setScore(0); setCorrectCount(0); setDone(false); setMarked(false) }}
        marked={marked}
      />
    )
  }

  if (!current) return null

  const hasVisual = !!current.type
  const questionBg = hasVisual ? colorLight : 'white'

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50">
      {/* Mobile header */}
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

        {/* Question area */}
        <div className="flex-1 flex flex-col">
          <div
            className="rounded-3xl border-2 p-6 mb-5 overflow-hidden flex items-center justify-center relative"
            style={{
              backgroundColor: questionBg,
              borderColor: hasVisual ? color + '55' : '#e5e7eb',
              minHeight: hasVisual ? 220 : 160,
            }}
          >
            {/* Grade character — only shown on text questions */}
            {!hasVisual && (
              <img
                src={gradeInfo.image}
                alt={gradeInfo.name}
                className="absolute right-4 bottom-0 h-28 object-contain opacity-50 pointer-events-none hidden sm:block"
              />
            )}
            <div className="relative z-10 w-full">
              <QuestionDisplay
                question={current}
                color={color}
                colorLight={colorLight}
                shaking={shaking}
                onShake={handleShake}
                answered={selected !== null}
              />
            </div>
          </div>

          {/* Answer choices 2×2 */}
          <div className="grid grid-cols-2 gap-3 mb-5">
            {current.choices.map((choice, idx) => {
              let bg = 'bg-white'
              let borderColor = '#e5e7eb'
              let textColor = '#1f2937'
              let opacity = 1
              if (selected !== null) {
                if (idx === current.correct) { bg = 'bg-green-100'; borderColor = '#22c55e'; textColor = '#166534' }
                else if (idx === selected) { bg = 'bg-red-100'; borderColor = '#f87171'; textColor = '#b91c1c' }
                else { opacity = 0.45 }
              }
              return (
                <button
                  key={idx}
                  onClick={() => handleAnswer(idx)}
                  disabled={selected !== null}
                  className={`${bg} border-2 rounded-2xl p-4 text-center font-black text-xl transition-all duration-150 shadow-sm disabled:cursor-default`}
                  style={{ borderColor, color: textColor, opacity }}
                  onMouseEnter={e => { if (selected === null) e.currentTarget.style.borderColor = color }}
                  onMouseLeave={e => { if (selected === null) e.currentTarget.style.borderColor = '#e5e7eb' }}
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
                {selected === current.correct
                  ? `Great job! +${isQuiz ? 15 : 10} pts`
                  : `Not quite! The answer is ${current.choices[current.correct]}`}
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
        <div className="bg-white rounded-2xl p-4 mb-4 shadow-sm">
          <div className="grid grid-cols-2 gap-3 text-center">
            <StatBox label="Score" value={score} color={color} />
            <StatBox label="Question" value={`${qIndex + 1}/${totalQ}`} color={color} />
            <StatBox label="Correct" value={correctCount} color={color} />
            <StatBox label="Streak" value={`${correctCount}🔥`} color={color} />
          </div>
        </div>

        {/* Progress dots */}
        <div className="flex gap-1.5 mb-5 flex-wrap">
          {questions.map((_, i) => (
            <div
              key={i}
              className="w-5 h-5 rounded-full border-2 transition-all"
              style={{
                backgroundColor: i < qIndex ? color : i === qIndex ? color + '80' : '#e5e7eb',
                borderColor: i <= qIndex ? color : '#e5e7eb',
              }}
            />
          ))}
        </div>

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
          {!marked ? (
            <button
              onClick={onMarkComplete}
              className="w-full py-3 rounded-2xl font-black text-white text-base shadow-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: color }}
            >
              Mark Complete (+{isQuiz ? score + 100 : 50 + score} pts)
            </button>
          ) : (
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
