import { useState } from 'react'
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { StudentProvider, useStudent } from './context/StudentContext'
import { CampProgressProvider } from './context/CampProgressContext'
import Footer from './components/Footer'
import MathBackground from './components/MathBackground'
import WelcomeModal from './components/WelcomeModal'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ActivitiesPage from './pages/ActivitiesPage'
import BadgesPage from './pages/BadgesPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'
import GradeViewPage from './pages/GradeViewPage'
import GamePage from './pages/GamePage'

function AppInner() {
  const { student } = useStudent()
  const [showModal, setShowModal] = useState(() => {
    return !localStorage.getItem('mathcamp_welcomed')
  })

  function handleClose() {
    localStorage.setItem('mathcamp_welcomed', '1')
    setShowModal(false)
  }

  return (
    <div className="relative flex flex-col min-h-screen bg-cream">
      <MathBackground />
      {showModal && <WelcomeModal onClose={handleClose} />}
      <main className="flex-1 relative z-10">
        <Routes>
          <Route path="/"                         element={<HomePage />} />
          <Route path="/login"                    element={<LoginPage />} />
          <Route path="/activities"               element={<ActivitiesPage />} />
          <Route path="/badges"                   element={<BadgesPage />} />
          <Route path="/dashboard"                element={<DashboardPage />} />
          <Route path="/about"                    element={<AboutPage />} />
          <Route path="/grade/:gradeId"           element={<GradeViewPage />} />
          <Route path="/play/:gradeId/:activityId" element={<GamePage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <StudentProvider>
      <CampProgressProvider>
        <BrowserRouter>
          <AppInner />
        </BrowserRouter>
      </CampProgressProvider>
    </StudentProvider>
  )
}
