// API layer — URL injected at build time via VITE_GAS_URL secret
const GAS_URL = import.meta.env.VITE_GAS_URL || null

async function gasRequest(action, payload = {}) {
  if (!GAS_URL) return null
  const params = new URLSearchParams({ action, ...payload })
  const res = await fetch(`${GAS_URL}?${params}`)
  return res.json()
}

// --- Students ---
export async function getStudent(student_id) {
  return gasRequest('getStudent', { student_id })
}

export async function saveStudent(student) {
  return gasRequest('saveStudent', student)
}

// --- Activities ---
export async function getActivities(grade) {
  return gasRequest('getActivities', { grade })
}

// --- Progress ---
export async function saveProgress(student_id, activity_id) {
  return gasRequest('saveProgress', { student_id, activity_id })
}

export async function getProgress(student_id) {
  return gasRequest('getProgress', { student_id })
}

// --- Check-Ins ---
export async function saveCheckIn(student_id, mood, goal) {
  return gasRequest('saveCheckIn', { student_id, mood, goal })
}

export async function getCheckIns(student_id) {
  return gasRequest('getCheckIns', { student_id })
}

// --- Badges ---
export async function getBadges(student_id) {
  return gasRequest('getBadges', { student_id })
}
