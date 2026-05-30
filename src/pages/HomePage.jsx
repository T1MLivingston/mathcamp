import HeroBanner from '../components/HeroBanner'
import GradeGrid from '../components/GradeGrid'
import AccountInfoCard from '../components/AccountInfoCard'
import BadgePreviewCard from '../components/BadgePreviewCard'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Desktop: hero + account card same height side by side */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8 lg:items-stretch">
        <div className="flex-1 min-w-0">
          <HeroBanner />
        </div>
        <div className="hidden lg:block lg:w-72 shrink-0">
          <AccountInfoCard />
        </div>
      </div>

      {/* Grade grid */}
      <GradeGrid />

      {/* Badges — full width below grades */}
      <div className="mt-8">
        <BadgePreviewCard wide />
      </div>

      {/* Mobile: account card below everything */}
      <div className="mt-6 lg:hidden">
        <AccountInfoCard />
      </div>

    </div>
  )
}
