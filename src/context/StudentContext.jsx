import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_STUDENT, BADGES } from '../api/mockData'
import { saveStudent, saveProgress, saveCheckIn as apiSaveCheckIn, getStudent } from '../api/api'

const StudentContext = createContext(null)
const STORAGE_KEY = 'mathcamp_student'

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  const [activityCounts, setActivityCounts] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mathcamp_counts') || '{}') }
    catch { return {} }
  })

  const [checkIns, setCheckIns] = useState(() => {
    try { return JSON.parse(localStorage.getItem('mathcamp_checkins') || '[]') }
    catch { return [] }
  })

  useEffect(() => {
    if (student) localStorage.setItem(STORAGE_KEY, JSON.stringify(student))
  }, [student])

  useEffect(() => {
    localStorage.setItem('mathcamp_counts', JSON.stringify(activityCounts))
  }, [activityCounts])

  useEffect(() => {
    localStorage.setItem('mathcamp_checkins', JSON.stringify(checkIns))
  }, [checkIns])

  async function login(email, grade, displayName) {
    // Guest mode — no email
    if (!email) {
      setStudent({
        ...MOCK_STUDENT,
        student_id: 'guest_' + Date.now(),
        display_name: displayName || 'Guest Camper',
        email: '',
        grade,
      })
      return
    }

    // Try to fetch existing student from sheet first
    let existing = null
    try {
      existing = await getStudent(email)
    } catch (_) {}

    if (existing && existing.student_id) {
      // Returning student — restore from sheet
      const s = {
        ...MOCK_STUDENT,
        ...existing,
        grade: grade || existing.grade,
        display_name: displayName || existing.display_name,
      }
      setStudent(s)
      saveStudent({ ...s, grade: grade || existing.grade, display_name: s.display_name })
    } else {
      // New student — create record
      const id = 'Camper' + Math.floor(Math.random() * 9000 + 1000)
      const s = {
        ...MOCK_STUDENT,
        student_id: id,
        display_name: displayName || email.split('@')[0] || 'Camper',
        email,
        grade,
        created_at: new Date().toISOString(),
      }
      setStudent(s)
      saveStudent(s)
    }
  }

  function logout() {
    setStudent(null)
    setActivityCounts({})
    setCheckIns([])
    localStorage.clear()
  }

  function completeActivity(activityId, points, isFraction = false) {
    const newCounts = { ...activityCounts, [activityId]: (activityCounts[activityId] || 0) + 1 }
    setActivityCounts(newCounts)
    setStudent(s => {
      const updated = {
        ...s,
        points: s.points + points,
        activitiesCompleted: (s.activitiesCompleted || 0) + 1,
        completedFraction: s.completedFraction || isFraction,
        recentActivity: [
          { id: activityId, completedAt: new Date().toISOString() },
          ...(s.recentActivity || []).slice(0, 9),
        ],
      }
      // Persist to sheet
      if (s.email) {
        saveProgress(s.student_id, activityId, newCounts[activityId], points)
        saveStudent({ student_id: s.student_id, email: s.email, points: updated.points, grade: s.grade, display_name: s.display_name })
      }
      return updated
    })
  }

  function submitCheckIn(mood, goal) {
    const today = new Date().toDateString()
    if (checkIns.find(c => new Date(c.date).toDateString() === today)) return
    const entry = { date: new Date().toISOString(), mood, goal }
    const updated = [entry, ...checkIns]
    setCheckIns(updated)
    setStudent(s => {
      const next = { ...s, checkIns: (s.checkIns || 0) + 1, streak: (s.streak || 0) + 1 }
      if (s.email) {
        apiSaveCheckIn(s.student_id, mood, goal)
        saveStudent({ student_id: s.student_id, email: s.email, points: s.points, grade: s.grade, display_name: s.display_name })
      }
      return next
    })
  }

  function earnedBadges() {
    if (!student) return BADGES.map(b => ({ ...b, earned: false }))
    const maxActivityRepeats = Object.values(activityCounts).length
      ? Math.max(...Object.values(activityCounts))
      : 0
    const stats = {
      checkIns: student.checkIns || 0,
      streak: student.streak || 0,
      activitiesCompleted: student.activitiesCompleted || 0,
      completedFraction: student.completedFraction || false,
      completedGrade: student.completedGrade || false,
      points: student.points || 0,
      maxActivityRepeats,
      badges: 0,
    }
    stats.badges = BADGES.filter(b => b.condition(stats)).length
    return BADGES.map(b => ({ ...b, earned: b.condition(stats) }))
  }

  const completedActivities = Object.keys(activityCounts).filter(id => activityCounts[id] > 0)

  const hasCheckedInToday = checkIns.length > 0 &&
    new Date(checkIns[0].date).toDateString() === new Date().toDateString()

  return (
    <StudentContext.Provider value={{
      student, completedActivities, activityCounts, checkIns,
      login, logout, completeActivity, submitCheckIn, earnedBadges, hasCheckedInToday,
    }}>
      {children}
    </StudentContext.Provider>
  )
}

export const useStudent = () => useContext(StudentContext)
