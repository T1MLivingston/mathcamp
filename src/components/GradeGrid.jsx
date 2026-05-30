import GradeCard from './GradeCard'
import { GRADES } from '../api/mockData'

export default function GradeGrid() {
  return (
    <div>
      <h2 className="text-2xl font-black text-forest-800 mb-5 text-center tracking-wide uppercase">
        Pick Your Grade
      </h2>
      <div className="grid grid-cols-3 gap-5 sm:gap-6">
        {GRADES.map(g => <GradeCard key={g.id} grade={g} />)}
      </div>
    </div>
  )
}
