import GradeCard from './GradeCard'
import { GRADES } from '../api/mockData'

export default function GradeGrid() {
  return (
    <div>
      <h2 className="text-2xl font-black text-forest-800 mb-3">
        🎒 Pick Your Grade!
      </h2>
      <p className="text-gray-600 font-semibold mb-4 text-sm">
        Choose your grade to see your activities →
      </p>
      <div className="grid grid-cols-3 gap-3">
        {GRADES.map(g => <GradeCard key={g.id} grade={g} />)}
      </div>
    </div>
  )
}
