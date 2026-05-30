import HeroBanner from '../components/HeroBanner'
import GradeGrid from '../components/GradeGrid'
import AccountInfoCard from '../components/AccountInfoCard'
import BadgePreviewCard from '../components/BadgePreviewCard'

export default function HomePage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-6">

      {/* Desktop: hero + account card side by side. Mobile: stacked */}
      <div className="flex flex-col lg:flex-row gap-6 mb-8">
        <div className="flex-1 min-w-0">
          <HeroBanner />
        </div>
        {/* Account card only — desktop, beside hero */}
        <div className="hidden lg:block lg:w-72 shrink-0">
          <AccountInfoCard />
        </div>
      </div>

      {/* Grade grid — full width */}
      <GradeGrid />

      {/* Badge preview — full width below grade grid */}
      <div className="mt-8">
        <BadgePreviewCard wide />
      </div>

      {/* Mobile: account card below badges */}
      <div className="mt-6 lg:hidden">
        <AccountInfoCard />
      </div>

    </div>
  )
}
