import { useState, useEffect } from 'react'
import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { StudentProvider, useStudent } from './context/StudentContext'
import Footer from './components/Footer'
import MathBackground from './components/MathBackground'
import WelcomeModal from './components/WelcomeModal'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ActivitiesPage from './pages/ActivitiesPage'
import BadgesPage from './pages/BadgesPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'

function AppInner() {
  const { student } = useStudent()
  // Show modal if no student and not already dismissed this session
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
          <Route path="/"           element={<HomePage />} />
          <Route path="/login"      element={<LoginPage />} />
          <Route path="/activities" element={<ActivitiesPage />} />
          <Route path="/badges"     element={<BadgesPage />} />
          <Route path="/dashboard"  element={<DashboardPage />} />
          <Route path="/about"      element={<AboutPage />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}

export default function App() {
  return (
    <StudentProvider>
      <BrowserRouter>
        <AppInner />
      </BrowserRouter>
    </StudentProvider>
  )
}
