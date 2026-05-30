import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'

export default function GradeCard({ grade }) {
  const navigate = useNavigate()
  const { student, login } = useStudent()

  function handleClick() {
    if (!student) {
      login('Guest Camper', grade.id)
    } else {
      // Update grade selection
      // just navigate to activities filtered by grade
    }
    navigate(`/activities?grade=${grade.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={`group relative flex flex-col items-center rounded-3xl border-4 ${grade.borderColor} ${grade.color} p-3 shadow-md cursor-pointer card-hover w-full`}
    >
      <img
        src={grade.image}
        alt={grade.animal}
        className="w-full h-28 object-contain drop-shadow-md"
        loading="lazy"
      />
      <span className={`font-black text-2xl mt-1 ${grade.textColor}`}>
        {grade.label}
      </span>
      <span className="text-xs font-semibold text-gray-500 mt-0.5">
        {grade.name}
      </span>
    </button>
  )
}
