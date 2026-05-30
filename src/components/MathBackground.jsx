const SYMBOLS = ['+', '−', '×', '÷', '=', 'π', '√', '∑', '²', '³', '∞', '%']

// Deterministic spread: force each symbol to appear at least twice,
// distributed evenly across the viewport in a grid, with random jitter
function buildItems() {
  const cols = 6
  const rows = 4
  const items = []
  let idx = 0
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < cols; col++) {
      // Seed from position so it's stable
      const seed = idx * 317 + 11
      let s = seed
      const rand = () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }

      // Base position spread evenly, jitter up to half a cell
      const cellW = 100 / cols
      const cellH = 100 / rows
      const left = col * cellW + rand() * cellW * 0.8 + cellW * 0.1
      const top  = row * cellH + rand() * cellH * 0.8 + cellH * 0.1

      items.push({
        symbol:   SYMBOLS[(idx) % SYMBOLS.length],
        left,
        top,
        size:     1.0 + rand() * 1.8,
        duration: 8  + rand() * 10,
        delay:    -(rand() * 14),
        peakOp:   0.06 + rand() * 0.08,
      })
      idx++
    }
  }
  return items
}

const ITEMS = buildItems()

export default function MathBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="absolute font-black select-none text-forest-700"
          style={{
            left: `${item.left}%`,
            top:  `${item.top}%`,
            fontSize: `${item.size}rem`,
            animationName: 'mathFloat',
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationTimingFunction: 'ease-in-out',
            animationIterationCount: 'infinite',
            '--peak': item.peakOp,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  )
}
