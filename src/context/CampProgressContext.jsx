import { createContext, useContext, useState, useEffect } from 'react'
import { GRADE_ACTIVITIES } from '../api/mathContent'

const CampProgressContext = createContext(null)
const KEY = 'mathcamp_progress_v2'

function defaultProgress() {
  return Object.keys(GRADE_ACTIVITIES).reduce((acc, gId) => {
    acc[gId] = { completedActivities: [], quizDone: false, quizScore: 0 }
    return acc
  }, {})
}

export function CampProgressProvider({ children }) {
  const [progress, setProgress] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || '{}')
      return { ...defaultProgress(), ...saved }
    } catch { return defaultProgress() }
  })

  const [points, setPoints] = useState(() => {
    return parseInt(localStorage.getItem('mathcamp_points_v2') || '0', 10)
  })

  const [streak, setStreak] = useState(() => {
    return parseInt(localStorage.getItem('mathcamp_streak_v2') || '0', 10)
  })

  const [lastGrade, setLastGrade] = useState(() => {
    return localStorage.getItem('mathcamp_last_grade') || null
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(progress))
  }, [progress])

  useEffect(() => {
    localStorage.setItem('mathcamp_points_v2', String(points))
  }, [points])

  useEffect(() => {
    localStorage.setItem('mathcamp_streak_v2', String(streak))
  }, [streak])

  useEffect(() => {
    if (lastGrade) localStorage.setItem('mathcamp_last_grade', lastGrade)
  }, [lastGrade])

  function getGradeProgress(gradeId) {
    return progress[gradeId] || { completedActivities: [], quizDone: false, quizScore: 0 }
  }

  function hasBadge(gradeId) {
    const gp = getGradeProgress(gradeId)
    const gradeContent = GRADE_ACTIVITIES[gradeId]
    if (!gradeContent) return false
    return (
      gp.completedActivities.length >= gradeContent.activities.length &&
      gp.quizDone
    )
  }

  function getBadgeCount() {
    return Object.keys(GRADE_ACTIVITIES).filter(hasBadge).length
  }

  function getTotalActivities() {
    return Object.values(progress).reduce((sum, gp) => {
      return sum + gp.completedActivities.length + (gp.quizDone ? 1 : 0)
    }, 0)
  }

  function completeActivity(gradeId, activityId, earnedPoints) {
    setLastGrade(gradeId)
    setPoints(p => p + earnedPoints)
    setStreak(s => s + 1)
    setProgress(prev => {
      const gp = prev[gradeId] || { completedActivities: [], quizDone: false, quizScore: 0 }
      if (gp.completedActivities.includes(activityId)) return prev
      const updated = { ...gp, completedActivities: [...gp.completedActivities, activityId] }
      const next = { ...prev, [gradeId]: updated }

      // Check badge
      const gradeContent = GRADE_ACTIVITIES[gradeId]
      if (
        gradeContent &&
        updated.completedActivities.length >= gradeContent.activities.length &&
        updated.quizDone
      ) {
        setPoints(p => p + 200)
      }
      return next
    })
  }

  function completeQuiz(gradeId, score, total) {
    setLastGrade(gradeId)
    const earned = score * 15 + 100
    setPoints(p => p + earned)
    setStreak(s => s + 1)
    setProgress(prev => {
      const gp = prev[gradeId] || { completedActivities: [], quizDone: false, quizScore: 0 }
      if (gp.quizDone && score <= gp.quizScore) return prev
      const updated = { ...gp, quizDone: true, quizScore: Math.max(gp.quizScore || 0, score) }
      const next = { ...prev, [gradeId]: updated }

      // Check badge
      const gradeContent = GRADE_ACTIVITIES[gradeId]
      if (
        gradeContent &&
        updated.completedActivities.length >= gradeContent.activities.length &&
        !gp.quizDone
      ) {
        setPoints(p => p + 200)
      }
      return next
    })
  }

  return (
    <CampProgressContext.Provider value={{
      progress, points, streak, lastGrade,
      getGradeProgress, hasBadge, getBadgeCount, getTotalActivities,
      completeActivity, completeQuiz,
    }}>
      {children}
    </CampProgressContext.Provider>
  )
}

export const useCampProgress = () => useContext(CampProgressContext)
