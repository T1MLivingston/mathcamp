export default function HeroBanner() {
  return (
    <div className="relative rounded-3xl overflow-hidden shadow-2xl mb-6 min-h-[220px]">
      <img
        src="https://cdn.prod.website-files.com/64aa957da446d8dc44869f81/6a1adb1b81b18d945970e36c_hero.png"
        alt="Math Camp — mountains, tent, and campfire"
        className="w-full h-64 object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-forest-900/80 via-forest-800/30 to-transparent flex flex-col items-center justify-end pb-8 px-6 text-center">
        <h1 className="text-5xl font-black text-white drop-shadow-lg tracking-tight leading-tight">
          ✦ Math Camp ✦
        </h1>
        <p className="text-sunshine-300 font-bold text-lg mt-2 drop-shadow">
          Practice math, earn badges, and keep your brain sharp all summer.
        </p>
      </div>
    </div>
  )
}
