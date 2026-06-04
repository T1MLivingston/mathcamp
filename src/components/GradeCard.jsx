import { useNavigate } from 'react-router-dom'
import { useCampProgress } from '../context/CampProgressContext'
import { GRADE_ACTIVITIES } from '../api/mathContent'

export default function GradeCard({ grade }) {
  const navigate = useNavigate()
  const { hasBadge, getGradeProgress } = useCampProgress()
  const earned = hasBadge(grade.id)
  const progress = getGradeProgress(grade.id)
  const gradeContent = GRADE_ACTIVITIES[grade.id]
  const totalItems = gradeContent ? gradeContent.activities.length + 1 : 4
  const completedCount = (progress?.completedActivities?.length || 0) + (progress?.quizDone ? 1 : 0)
  const color = gradeContent?.color || '#555'

  return (
    <button
      onClick={() => navigate(`/grade/${grade.id}`)}
      className="w-full cursor-pointer focus:outline-none group transition-transform duration-200 hover:scale-105 relative"
    >
      <img
        src={grade.imageBg}
        alt={grade.animal}
        className="w-full h-auto block rounded-2xl shadow-sm transition-all duration-200"
        style={{
          outline: earned ? `4px solid ${color}` : '3px solid #e5e7eb',
          outlineOffset: '2px',
          boxShadow: earned ? `0 0 16px 2px ${color}55` : undefined,
        }}
        loading="lazy"
      />
      {/* Badge indicator */}
      {earned && (
        <div
          className="absolute top-2 right-2 w-7 h-7 rounded-full flex items-center justify-center shadow-md"
          style={{ backgroundColor: color }}
        >
          <svg width="14" height="14" viewBox="0 0 44 44" fill="none">
            <polygon points="22,2 27,16 42,16 30,25 35,40 22,31 9,40 14,25 2,16 17,16" fill="white" />
          </svg>
        </div>
      )}
      {/* Progress bar at bottom */}
      {completedCount > 0 && !earned && (
        <div className="absolute bottom-0 left-0 right-0 h-2 bg-black/20 rounded-b-2xl overflow-hidden">
          <div
            className="h-full rounded-b-2xl transition-all"
            style={{ width: `${(completedCount / totalItems) * 100}%`, backgroundColor: color }}
          />
        </div>
      )}
    </button>
  )
}
