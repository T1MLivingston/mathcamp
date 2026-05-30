import { useEffect, useRef } from 'react'

const SYMBOLS = ['+', '−', '×', '÷', '=', '%', 'π', '∑', '√', '²', '³', '∞', '<', '>']

// Deterministic pseudo-random from seed
function seeded(seed) {
  let s = seed
  return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646 }
}

const ITEMS = Array.from({ length: 22 }, (_, i) => {
  const r = seeded(i * 137 + 42)
  return {
    symbol: SYMBOLS[Math.floor(r() * SYMBOLS.length)],
    left: r() * 100,
    top: r() * 100,
    size: 1.1 + r() * 1.6,          // rem
    duration: 6 + r() * 10,          // seconds
    delay: r() * 8,                   // seconds
    opacity: 0.04 + r() * 0.07,
  }
})

export default function MathBackground() {
  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0" aria-hidden>
      {ITEMS.map((item, i) => (
        <span
          key={i}
          className="absolute font-black select-none"
          style={{
            left: `${item.left}%`,
            top: `${item.top}%`,
            fontSize: `${item.size}rem`,
            color: '#166534',
            opacity: 0,
            animation: `mathFloat ${item.duration}s ${item.delay}s ease-in-out infinite`,
          }}
        >
          {item.symbol}
        </span>
      ))}
    </div>
  )
}
