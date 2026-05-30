import { GRADES } from '../api/mockData'

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        <div className="text-7xl mb-4">⛺</div>
        <h1 className="text-4xl font-black text-forest-800">About Math Camp</h1>
        <p className="text-gray-600 font-semibold mt-3 text-lg">
          A summer learning adventure for Kindergarten through 5th Grade!
        </p>
      </div>

      <div className="space-y-6">
        <div className="bg-sunshine-100 border-2 border-sunshine-400 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-forest-800 mb-2">Our Mission</h2>
          <p className="text-gray-700 font-semibold">
            Math Camp helps students in grades K–5 keep their math skills sharp all summer long.
            Through fun activities, daily check-ins, and a badge reward system, we make learning
            feel like a summer adventure — not homework!
          </p>
        </div>

        <div className="bg-sky-100 border-2 border-sky-300 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-forest-800 mb-3">What You Can Do</h2>
          <ul className="space-y-2 font-semibold text-gray-700">
            {[
              'Complete math activities for your grade level',
              'Earn badges for your accomplishments',
              'Build a daily check-in streak',
              'Collect points and track your progress',
              'View your progress on your personal dashboard',
            ].map((item, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-forest-500 font-black mt-0.5">→</span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="bg-forest-50 border-2 border-forest-300 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-forest-800 mb-4">Meet the Campers</h2>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {GRADES.map(g => (
              <div key={g.id} className="rounded-2xl overflow-hidden">
                <img src={g.image} alt={g.animal} className="w-full h-auto object-contain" />
              </div>
            ))}
          </div>
        </div>

        <div className="bg-campfire-50 border-2 border-campfire-300 rounded-3xl p-6 shadow-sm">
          <h2 className="text-xl font-black text-forest-800 mb-2">🔒 Privacy & Safety</h2>
          <p className="text-gray-700 font-semibold">
            Math Camp uses guest login — no passwords, no personal information.
            Students only need a display name and grade level. No birthdates,
            addresses, or phone numbers are ever collected.
          </p>
        </div>
      </div>
    </div>
  )
}
