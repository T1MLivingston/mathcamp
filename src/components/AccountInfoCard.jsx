import { Link } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { GRADES } from '../api/mockData'

export default function AccountInfoCard() {
  const { student } = useStudent()
  const gradeInfo = student?.grade ? GRADES.find(g => g.id === student.grade) : null

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-forest-200 p-5">
      {/* Avatar — always a circle */}
      <div className="flex flex-col items-center mb-4">
        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-sunshine-300 shadow-md bg-sunshine-100 flex items-center justify-center">
          {gradeInfo ? (
            <img
              src={gradeInfo.image}
              alt={gradeInfo.animal}
              className="w-full h-full object-contain p-1"
            />
          ) : (
            <span className="text-4xl">🏕️</span>
          )}
        </div>
        <p className="font-black text-xl text-forest-800 mt-3">
          {student?.display_name || 'Guest Camper'}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          {gradeInfo ? gradeInfo.name : 'No grade selected'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2 mb-3">
        <div className="bg-sunshine-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-sunshine-500">{student?.points || 0}</p>
          <p className="text-xs font-bold text-gray-600">Points</p>
        </div>
        <div className="bg-campfire-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-campfire-600">{student?.streak || 0}</p>
          <p className="text-xs font-bold text-gray-600">Day Streak</p>
        </div>
        <div className="bg-sky-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-sky-600">{student?.activitiesCompleted || 0}</p>
          <p className="text-xs font-bold text-gray-600">Activities</p>
        </div>
        <div className="bg-forest-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-forest-700">{student?.checkIns || 0}</p>
          <p className="text-xs font-bold text-gray-600">Check-Ins</p>
        </div>
      </div>

      {/* My Badges button */}
      <Link
        to="/badges"
        className="block w-full text-center bg-sunshine-400 hover:bg-sunshine-500 text-forest-900 font-black py-2.5 rounded-2xl transition-colors shadow-sm mb-2"
      >
        My Badges
      </Link>

      {!student && (
        <Link
          to="/login"
          className="block w-full text-center bg-campfire-500 hover:bg-campfire-600 text-white font-black py-3 rounded-2xl transition-colors shadow-md"
        >
          Start Camping!
        </Link>
      )}
    </div>
  )
}
