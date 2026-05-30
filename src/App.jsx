import { HashRouter as BrowserRouter, Routes, Route } from 'react-router-dom'
import { StudentProvider } from './context/StudentContext'
import Footer from './components/Footer'
import MathBackground from './components/MathBackground'
import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import ActivitiesPage from './pages/ActivitiesPage'
import BadgesPage from './pages/BadgesPage'
import DashboardPage from './pages/DashboardPage'
import AboutPage from './pages/AboutPage'

export default function App() {
  return (
    <StudentProvider>
      <BrowserRouter>
        <div className="relative flex flex-col min-h-screen bg-cream">
          <MathBackground />
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
      </BrowserRouter>
    </StudentProvider>
  )
}
