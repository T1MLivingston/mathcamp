import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_STUDENT, BADGES } from '../api/mockData'

const StudentContext = createContext(null)
const STORAGE_KEY = 'mathcamp_student'

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch { return null }
  })

  // activityCounts: { [activityId]: number }
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

  function login(email, grade, displayName) {
    const existing = student && student.email === email
    if (existing) {
      // update grade if changed
      setStudent(s => ({ ...s, grade, display_name: displayName || s.display_name }))
      return
    }
    const id = 'Camper' + Math.floor(Math.random() * 9000 + 1000)
    setStudent({
      ...MOCK_STUDENT,
      student_id: id,
      display_name: displayName || email.split('@')[0] || 'Camper',
      email,
      grade,
    })
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
    setStudent(s => ({
      ...s,
      points: s.points + points,
      activitiesCompleted: (s.activitiesCompleted || 0) + 1,
      completedFraction: s.completedFraction || isFraction,
      recentActivity: [
        { id: activityId, completedAt: new Date().toISOString() },
        ...(s.recentActivity || []).slice(0, 9),
      ],
    }))
  }

  function submitCheckIn(mood, goal) {
    const today = new Date().toDateString()
    if (checkIns.find(c => new Date(c.date).toDateString() === today)) return
    const updated = [{ date: new Date().toISOString(), mood, goal }, ...checkIns]
    setCheckIns(updated)
    setStudent(s => ({
      ...s,
      checkIns: (s.checkIns || 0) + 1,
      streak: (s.streak || 0) + 1,
    }))
  }

  function earnedBadges() {
    if (!student) return BADGES.map(b => ({ ...b, earned: false }))
    const maxActivityRepeats = Math.max(0, ...Object.values(activityCounts))
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
