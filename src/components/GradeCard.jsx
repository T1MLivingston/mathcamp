import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'

export default function GradeCard({ grade }) {
  const navigate = useNavigate()
  const { student, login } = useStudent()

  function handleClick() {
    if (!student) {
      login('Guest Camper', grade.id)
    }
    navigate(`/activities?grade=${grade.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className={`group relative flex flex-col items-center rounded-3xl border-4 ${grade.borderColor} ${grade.color} p-2 shadow-md cursor-pointer card-hover w-full aspect-square`}
    >
      <img
        src={grade.image}
        alt={grade.animal}
        className="w-full h-full object-contain drop-shadow-md"
        loading="lazy"
      />
    </button>
  )
}
