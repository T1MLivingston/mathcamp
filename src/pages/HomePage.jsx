import HeroBanner from '../components/HeroBanner'
import GradeGrid from '../components/GradeGrid'
import AccountInfoCard from '../components/AccountInfoCard'
import BadgePreviewCard from '../components/BadgePreviewCard'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Desktop: hero + account card side by side. Mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-6 mb-6">
        <div className="flex-1 min-w-0">
          <HeroBanner />
        </div>
        {/* Account card — hidden on mobile, shown on desktop */}
        <div className="hidden lg:flex lg:w-72 shrink-0 flex-col gap-4">
          <AccountInfoCard />
          <BadgePreviewCard />
        </div>
      </div>

      {/* Grade grid — full width on desktop */}
      <GradeGrid />

      {/* Account card — shown on mobile only, below grade grid */}
      <div className="flex flex-col gap-4 mt-6 lg:hidden">
        <AccountInfoCard />
        <BadgePreviewCard />
      </div>

    </div>
  )
}
