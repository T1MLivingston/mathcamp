import React, { createContext, useContext, useState, useEffect } from 'react'
import { MOCK_STUDENT, BADGES } from '../api/mockData'

const StudentContext = createContext(null)

const STORAGE_KEY = 'mathcamp_student'

export function StudentProvider({ children }) {
  const [student, setStudent] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY)
      return saved ? JSON.parse(saved) : null
    } catch {
      return null
    }
  })

  const [completedActivities, setCompletedActivities] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mathcamp_completed') || '[]')
    } catch {
      return []
    }
  })

  const [checkIns, setCheckIns] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('mathcamp_checkins') || '[]')
    } catch {
      return []
    }
  })

  useEffect(() => {
    if (student) localStorage.setItem(STORAGE_KEY, JSON.stringify(student))
  }, [student])

  useEffect(() => {
    localStorage.setItem('mathcamp_completed', JSON.stringify(completedActivities))
  }, [completedActivities])

  useEffect(() => {
    localStorage.setItem('mathcamp_checkins', JSON.stringify(checkIns))
  }, [checkIns])

  function login(displayName, grade) {
    const id = 'MathKid' + Math.floor(Math.random() * 90 + 10)
    const newStudent = {
      ...MOCK_STUDENT,
      student_id: id,
      display_name: displayName || 'Guest Camper',
      grade,
    }
    setStudent(newStudent)
    return newStudent
  }

  function logout() {
    setStudent(null)
    setCompletedActivities([])
    setCheckIns([])
    localStorage.clear()
  }

  function completeActivity(activityId, points, isFraction = false) {
    if (completedActivities.includes(activityId)) return
    const updated = [...completedActivities, activityId]
    setCompletedActivities(updated)
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
    if (!student) return []
    const stats = {
      checkIns: student.checkIns || 0,
      streak: student.streak || 0,
      activitiesCompleted: student.activitiesCompleted || 0,
      completedFraction: student.completedFraction || false,
      completedGrade: student.completedGrade || false,
      badges: 0,
      points: student.points || 0,
    }
    // Always earn first_camper
    stats.badges = BADGES.filter(b => b.condition(stats)).length
    return BADGES.map(b => ({ ...b, earned: b.condition(stats) }))
  }

  const hasCheckedInToday = checkIns.length > 0 &&
    new Date(checkIns[0].date).toDateString() === new Date().toDateString()

  return (
    <StudentContext.Provider value={{
      student,
      completedActivities,
      checkIns,
      login,
      logout,
      completeActivity,
      submitCheckIn,
      earnedBadges,
      hasCheckedInToday,
    }}>
      {children}
    </StudentContext.Provider>
  )
}

export const useStudent = () => useContext(StudentContext)
