import { useNavigate, useParams } from 'react-router-dom'
import { GRADES } from '../api/mockData'
import { GRADE_ACTIVITIES } from '../api/mathContent'
import { useCampProgress } from '../context/CampProgressContext'

export default function GradeViewPage() {
  const { gradeId } = useParams()
  const navigate = useNavigate()
  const gradeInfo = GRADES.find(g => g.id === gradeId)
  const gradeContent = GRADE_ACTIVITIES[gradeId]
  const { getGradeProgress, hasBadge } = useCampProgress()

  if (!gradeInfo || !gradeContent) {
    return <div className="p-8 text-center font-black text-gray-500">Grade not found.</div>
  }

  const progress = getGradeProgress(gradeId)
  const badge = hasBadge(gradeId)
  const completedCount = progress.completedActivities.length + (progress.quizDone ? 1 : 0)
  const totalItems = 4
  const quizUnlocked = progress.completedActivities.length >= 1
  const color = gradeContent.color
  const colorLight = gradeContent.colorLight

  return (
    <div className="max-w-2xl mx-auto px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-5">
        <button
          onClick={() => navigate('/')}
          className="w-11 h-11 rounded-2xl bg-white shadow-sm border border-gray-200 flex items-center justify-center text-xl font-black text-gray-600 hover:bg-gray-50 transition-colors shrink-0"
        >
          ←
        </button>
        <div className="flex-1 min-w-0">
          <h1 className="text-2xl font-black text-gray-800 leading-tight">{gradeInfo.name}</h1>
          <p className="text-sm font-semibold text-gray-500">{completedCount}/{totalItems} completed</p>
        </div>
        <img src={gradeInfo.pfp} alt={gradeInfo.name} className="w-14 h-14 rounded-full border-4 object-cover shrink-0" style={{ borderColor: color }} />
      </div>

      {/* Progress bar */}
      <div className="mb-6">
        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ width: `${(completedCount / totalItems) * 100}%`, backgroundColor: color }}
          />
        </div>
      </div>

      {/* Badge earned banner */}
      {badge && (
        <div
          className="rounded-3xl p-5 mb-6 flex items-center gap-4 shadow-sm"
          style={{ backgroundColor: colorLight, border: `2px solid ${color}` }}
        >
          <img src={gradeInfo.image} alt={gradeInfo.name} className="h-20 object-contain shrink-0" />
          <div>
            <div className="text-lg font-black" style={{ color }}>Badge Earned!</div>
            <div className="text-sm font-semibold text-gray-600">{gradeInfo.name} Math Master</div>
          </div>
          <div className="ml-auto text-4xl">
            <BadgeIcon color={color} />
          </div>
        </div>
      )}

      {/* Activity cards */}
      <div className="space-y-3 mb-3">
        {gradeContent.activities.map((act, idx) => {
          const done = progress.completedActivities.includes(act.id)
          return (
            <ActivityCard
              key={act.id}
              title={act.title}
              description={act.description}
              done={done}
              color={color}
              colorLight={colorLight}
              index={idx + 1}
              onStart={() => navigate(`/play/${gradeId}/${act.id}`)}
            />
          )
        })}
      </div>

      {/* Quiz card */}
      <ActivityCard
        title={gradeContent.quiz.title}
        description={gradeContent.quiz.description}
        done={progress.quizDone}
        color={color}
        colorLight={colorLight}
        index="Q"
        locked={!quizUnlocked}
        isQuiz
        onStart={() => navigate(`/play/${gradeId}/quiz`)}
      />
    </div>
  )
}

function ActivityCard({ title, description, done, color, colorLight, index, locked, isQuiz, onStart }) {
  return (
    <div
      className="rounded-2xl bg-white border-2 shadow-sm overflow-hidden transition-all duration-200"
      style={{ borderColor: done ? color : '#e5e7eb' }}
    >
      <div className="flex items-center gap-4 p-4">
        <div
          className="w-11 h-11 rounded-xl flex items-center justify-center text-lg font-black shrink-0"
          style={{ backgroundColor: done ? color : colorLight, color: done ? '#fff' : color }}
        >
          {done ? '✓' : index}
        </div>
        <div className="flex-1 min-w-0">
          <div className="font-black text-gray-800 text-sm leading-tight">{title}</div>
          <div className="text-xs text-gray-500 mt-0.5 leading-snug">{description}</div>
        </div>
        {locked ? (
          <div className="text-gray-400 text-lg shrink-0">🔒</div>
        ) : (
          <button
            onClick={onStart}
            className="shrink-0 text-sm font-black px-4 py-2 rounded-xl text-white transition-opacity hover:opacity-90 active:scale-95"
            style={{ backgroundColor: color }}
          >
            {done ? 'Replay' : 'Start'}
          </button>
        )}
      </div>
    </div>
  )
}

function BadgeIcon({ color }) {
  return (
    <svg width="44" height="44" viewBox="0 0 44 44" fill="none">
      <polygon points="22,2 27,16 42,16 30,25 35,40 22,31 9,40 14,25 2,16 17,16" fill={color} stroke="white" strokeWidth="2" />
    </svg>
  )
}
