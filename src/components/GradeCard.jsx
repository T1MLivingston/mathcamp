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
      className="card-hover w-full cursor-pointer focus:outline-none"
    >
      <img
        src={grade.image}
        alt={grade.animal}
        className="w-full h-auto block drop-shadow-md rounded-2xl"
        loading="lazy"
      />
    </button>
  )
}
