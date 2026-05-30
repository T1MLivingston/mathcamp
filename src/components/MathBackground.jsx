const SYMBOLS = ['+', '−', '×', '÷', '=', '%', 'π', '∑', '√', '²', '³', '∞']

function seeded(seed) {
  let s = seed
  return () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646 }
}

const ITEMS = Array.from({ length: 24 }, (_, i) => {
  const r = seeded(i * 137 + 42)
  return {
    symbol:   SYMBOLS[Math.floor(r() * SYMBOLS.length)],
    left:     r() * 95,
    top:      r() * 95,
    size:     1.2 + r() * 2.0,
    duration: 7  + r() * 9,
    delay:    -(r() * 12),       // negative = start mid-cycle so they're visible immediately
    peakOp:   0.05 + r() * 0.08,
  }
})

export default function MathBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden="true">
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="absolute font-black select-none text-forest-700"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
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
