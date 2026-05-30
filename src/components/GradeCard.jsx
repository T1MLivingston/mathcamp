import { useNavigate } from 'react-router-dom'
import { useStudent } from '../context/StudentContext'

export default function GradeCard({ grade }) {
  const navigate = useNavigate()
  const { student } = useStudent()

  function handleClick() {
    navigate(`/activities?grade=${grade.id}`)
  }

  return (
    <button
      onClick={handleClick}
      className="w-full cursor-pointer focus:outline-none group transition-transform duration-200 hover:scale-105"
    >
      <img
        src={grade.imageBg}
        alt={grade.animal}
        className="w-full h-auto block rounded-2xl ring-4 ring-gray-300 group-hover:ring-4 group-hover:ring-forest-500 shadow-sm transition-all duration-200"
        loading="lazy"
      />
    </button>
  )
}
