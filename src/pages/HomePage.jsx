import HeroBanner from '../components/HeroBanner'
import GradeGrid from '../components/GradeGrid'
import AccountInfoCard from '../components/AccountInfoCard'
import BadgePreviewCard from '../components/BadgePreviewCard'
import { useStudent } from '../context/StudentContext'
import { Link } from 'react-router-dom'

export default function HomePage() {
  const { student } = useStudent()

  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 min-w-0">
          <HeroBanner />

          {!student && (
            <div className="bg-campfire-50 border-2 border-campfire-300 rounded-3xl p-5 mb-6 flex items-center justify-between gap-4">
              <p className="font-bold text-campfire-800">
                🏕️ Ready to start your math adventure?
              </p>
              <Link
                to="/login"
                className="shrink-0 bg-campfire-500 hover:bg-campfire-600 text-white font-black px-5 py-2.5 rounded-2xl transition-colors shadow-md"
              >
                Join Camp! 🚀
              </Link>
            </div>
          )}

          <GradeGrid />
        </div>

        {/* Right column */}
        <div className="lg:w-72 shrink-0">
          <AccountInfoCard />
          <BadgePreviewCard />
        </div>
      </div>
    </div>
  )
}
