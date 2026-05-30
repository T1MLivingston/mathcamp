export default function BadgeCard({ badge }) {
  return (
    <div className={`rounded-3xl border-2 p-5 text-center shadow-md transition-all ${
      badge.earned
        ? `${badge.color} border-current shadow-md`
        : 'bg-gray-100 border-gray-200 opacity-60 grayscale'
    }`}>
      <div className="text-5xl mb-2">{badge.earned ? badge.icon : '🔒'}</div>
      <h3 className="font-black text-base mb-1">{badge.name}</h3>
      <p className="text-xs font-semibold opacity-80">{badge.description}</p>
      {badge.earned && (
        <span className="inline-block mt-2 text-xs bg-white/60 font-bold px-2 py-1 rounded-full">
          ✓ Earned!
        </span>
      )}
    </div>
  )
}
