import HeroBanner from '../components/HeroBanner'
import GradeGrid from '../components/GradeGrid'
import AccountInfoCard from '../components/AccountInfoCard'
import BadgePreviewCard from '../components/BadgePreviewCard'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">
      {/* Hero spans full width */}
      <HeroBanner />

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left column */}
        <div className="flex-1 min-w-0">
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
