import { Link } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'
import { GRADES } from '../api/mockData'

export default function AccountInfoCard() {
  const { student } = useStudent()

  const gradeInfo = student?.grade ? GRADES.find(g => g.id === student.grade) : null

  return (
    <div className="bg-white rounded-3xl shadow-lg border-2 border-forest-200 p-5">
      <h3 className="text-lg font-black text-forest-800 mb-4 flex items-center gap-2">
        🏕️ Camper Info
      </h3>

      {/* Avatar */}
      <div className="flex flex-col items-center mb-4">
        {gradeInfo ? (
          <img
            src={gradeInfo.image}
            alt={gradeInfo.animal}
            className="w-24 h-24 object-contain drop-shadow"
          />
        ) : (
          <div className="w-24 h-24 rounded-full bg-sunshine-100 border-4 border-sunshine-300 flex items-center justify-center text-4xl">
            🏕️
          </div>
        )}
        <p className="font-black text-xl text-forest-800 mt-2">
          {student?.display_name || 'Guest Camper'}
        </p>
        <p className="text-sm font-semibold text-gray-500">
          {gradeInfo ? gradeInfo.name : 'No grade selected'}
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-sunshine-100 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-sunshine-500">{student?.points || 0}</p>
          <p className="text-xs font-bold text-gray-600">Points</p>
        </div>
        <div className="bg-campfire-50 rounded-2xl p-3 text-center">
          <p className="text-2xl font-black text-campfire-600">{student?.streak || 0}</p>
          <p className="text-xs font-bold text-gray-600">Day Streak 🔥</p>
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

      {!student && (
        <Link
          to="/login"
          className="mt-4 block w-full text-center bg-campfire-500 hover:bg-campfire-600 text-white font-black py-3 rounded-2xl transition-colors shadow-md"
        >
          🚀 Start Camping!
        </Link>
      )}
    </div>
  )
}
