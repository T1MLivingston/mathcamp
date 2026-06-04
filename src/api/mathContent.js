// Math content: question generators for each grade's activities and quizzes

function rnd(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

function makeChoices(correct, distractors) {
  const choices = shuffle([correct, ...distractors.slice(0, 3)])
  return { choices: choices.map(String), correct: choices.indexOf(correct) }
}

function nearDistractors(correct, count = 3, spread = 4) {
  const set = new Set()
  while (set.size < count) {
    const d = correct + rnd(-spread, spread)
    if (d !== correct && d >= 0) set.add(d)
  }
  return [...set]
}

// ─── KINDERGARTEN ───────────────────────────────────────────────

const COUNTING_ITEMS = [
  { emoji: '🍎', word: 'apples' },
  { emoji: '⭐', word: 'stars' },
  { emoji: '🌸', word: 'flowers' },
  { emoji: '🐸', word: 'frogs' },
  { emoji: '🦋', word: 'butterflies' },
  { emoji: '🍭', word: 'lollipops' },
  { emoji: '🐥', word: 'chicks' },
  { emoji: '🍄', word: 'mushrooms' },
]

function kCounting() {
  const n = rnd(1, 20)
  const item = COUNTING_ITEMS[rnd(0, COUNTING_ITEMS.length - 1)]
  const { choices, correct } = makeChoices(n, nearDistractors(n, 3, 3))
  return {
    type: 'counting',
    data: { count: n, emoji: item.emoji, word: item.word },
    text: `How many ${item.word} are there?`,
    choices,
    correct,
  }
}

// Fruit Sorting — replaces Shape Safari
const BASKET_FRUITS = [
  { emoji: '🍎', word: 'apples' },
  { emoji: '🍊', word: 'oranges' },
  { emoji: '🍇', word: 'grapes' },
  { emoji: '🍓', word: 'strawberries' },
  { emoji: '🍌', word: 'bananas' },
  { emoji: '🍋', word: 'lemons' },
]

function kFruitSort() {
  // Pick one target fruit and 1–2 other fruits
  const fruits = shuffle(BASKET_FRUITS).slice(0, 3)
  const targetFruit = fruits[0]
  const targetCount = rnd(2, 6)
  // Build a shuffled list of items with targetCount of target + 1–4 of others
  const items = []
  for (let i = 0; i < targetCount; i++) items.push(targetFruit.emoji)
  fruits.slice(1).forEach(f => {
    const extra = rnd(1, 4)
    for (let i = 0; i < extra; i++) items.push(f.emoji)
  })
  const shuffledItems = shuffle(items)
  const { choices, correct } = makeChoices(targetCount, nearDistractors(targetCount, 3, 2).filter(x => x > 0 && x <= 10))
  return {
    type: 'fruit-sort',
    data: { items: shuffledItems, targetEmoji: targetFruit.emoji, targetWord: targetFruit.word, count: targetCount },
    text: `How many ${targetFruit.word} are in the basket?`,
    choices,
    correct,
  }
}

// Number Bonds — visual tree diagram
function kNumberBond() {
  const total = rnd(3, 10)
  const part1 = rnd(1, total - 1)
  const part2 = total - part1
  // Sometimes hide part1, sometimes part2
  const hideRight = Math.random() > 0.4
  const hiddenPart = hideRight ? part2 : part1
  const shownPart = hideRight ? part1 : part2
  const { choices, correct } = makeChoices(hiddenPart, nearDistractors(hiddenPart, 3, 3).filter(x => x > 0 && x < total))
  return {
    type: 'number-bond',
    data: { total, left: hideRight ? part1 : '?', right: hideRight ? '?' : part2 },
    text: `${total} = ${shownPart} + ?`,
    choices,
    correct,
  }
}

function kQuiz() {
  const q = rnd(0, 4)
  if (q === 0) return kCounting()
  if (q === 1) return kFruitSort()
  if (q === 2) return kNumberBond()
  if (q === 3) {
    const a = rnd(1, 10), b = rnd(1, 10)
    const ans = a > b ? a : b
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 3).filter(x => x > 0))
    return { text: `Which number is bigger: ${a} or ${b}?`, choices, correct }
  }
  const n = rnd(11, 19)
  const { choices, correct } = makeChoices(n, nearDistractors(n, 3, 2).filter(x => x > 0))
  return { text: `What number comes right after ${n - 1}?`, choices, correct }
}

// ─── 1ST GRADE ──────────────────────────────────────────────────

// Addition — visual part-part-whole bond boxes
function grade1BondBox() {
  const a = rnd(1, 9), b = rnd(1, 11 - a)
  const sum = a + b
  // Randomly hide sum, a, or b (weighted toward hiding sum most)
  const r = rnd(0, 2)
  const missing = r === 0 ? 'sum' : r === 1 ? 'b' : 'a'
  const answer = missing === 'sum' ? sum : missing === 'b' ? b : a
  const { choices, correct } = makeChoices(answer, nearDistractors(answer, 3, 3).filter(x => x > 0))
  const label = missing === 'sum' ? `${a} + ${b} = ?` : missing === 'b' ? `${a} + ? = ${sum}` : `? + ${b} = ${sum}`
  return {
    type: 'bond-box',
    data: { a, b, sum, missing },
    text: label,
    choices,
    correct,
  }
}

// Dice Addition — roll dice and add them up
function grade1Dice() {
  const numDice = rnd(2, 3)
  const dice = Array.from({ length: numDice }, () => rnd(1, 6))
  const total = dice.reduce((s, d) => s + d, 0)
  const { choices, correct } = makeChoices(total, nearDistractors(total, 3, 3).filter(x => x > 0))
  return {
    type: 'dice-add',
    data: { dice, total },
    text: `What is ${dice.join(' + ')}?`,
    choices,
    correct,
  }
}

function grade1Sub() {
  const b = rnd(1, 10), a = rnd(b, 20)
  const ans = a - b
  const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 3).filter(x => x >= 0))
  return { text: `${a} − ${b} = ?`, choices, correct }
}

function grade1Quiz() {
  const pick = rnd(0, 4)
  if (pick === 0) return grade1BondBox()
  if (pick === 1) return grade1Sub()
  if (pick === 2) return grade1Dice()
  if (pick === 3) {
    const hours = rnd(1, 12)
    const half = Math.random() > 0.5
    const ans = half ? `${hours}:30` : `${hours}:00`
    const wrongs = [`${hours === 12 ? 1 : hours + 1}:00`, `${hours}:15`, half ? `${hours}:00` : `${hours}:30`]
    const { choices, correct } = makeChoices(ans, wrongs)
    return { text: `The clock shows the hour hand on ${hours} and minute hand on ${half ? 6 : 12}. What time is it?`, choices, correct }
  }
  const coins = [
    { name: 'penny', value: 1 },
    { name: 'nickel', value: 5 },
    { name: 'dime', value: 10 },
    { name: 'quarter', value: 25 },
  ]
  const coin = coins[rnd(0, 3)]
  const { choices, correct } = makeChoices(`${coin.value}¢`, [`${coin.value + 1}¢`, `${coin.value >= 2 ? coin.value - 1 : coin.value + 2}¢`, `${coin.value + 5}¢`])
  return { text: `How much is a ${coin.name} worth?`, choices, correct }
}

// ─── 2ND GRADE ──────────────────────────────────────────────────
function grade2PlaceValue() {
  const n = rnd(100, 999)
  const hundreds = Math.floor(n / 100)
  const tens = Math.floor((n % 100) / 10)
  const ones = n % 10
  const pick = rnd(0, 2)
  if (pick === 0) {
    const { choices, correct } = makeChoices(hundreds, nearDistractors(hundreds, 3, 3))
    return { text: `In the number ${n}, how many HUNDREDS are there?`, choices, correct }
  }
  if (pick === 1) {
    const { choices, correct } = makeChoices(tens, nearDistractors(tens, 3, 3))
    return { text: `In the number ${n}, how many TENS are there?`, choices, correct }
  }
  const { choices, correct } = makeChoices(ones, nearDistractors(ones, 3, 3))
  return { text: `In the number ${n}, how many ONES are there?`, choices, correct }
}

function grade2AddSub() {
  const op = Math.random() > 0.5 ? '+' : '-'
  if (op === '+') {
    const a = rnd(100, 500), b = rnd(10, 400)
    const ans = a + b
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 15))
    return { text: `${a} + ${b} = ?`, choices, correct }
  } else {
    const b = rnd(10, 400), a = rnd(b + 1, 999)
    const ans = a - b
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 15))
    return { text: `${a} − ${b} = ?`, choices, correct }
  }
}

function grade2Measurement() {
  const type = rnd(0, 2)
  if (type === 0) {
    const n = rnd(1, 90) * 5
    const h = rnd(1, 12)
    const ans = `${h}:${n < 10 ? '0' + n : n}`
    const wrongs = [
      `${h}:${(n + 5) % 60 < 10 ? '0' + (n + 5) % 60 : (n + 5) % 60}`,
      `${h === 12 ? 1 : h + 1}:${n < 10 ? '0' + n : n}`,
      `${h}:${(n + 10) % 60 < 10 ? '0' + (n + 10) % 60 : (n + 10) % 60}`,
    ]
    const { choices, correct } = makeChoices(ans, wrongs)
    return { text: `The minute hand points to ${n / 5 === 0 ? 12 : n / 5}, the hour hand to ${h}. What time is it?`, choices, correct }
  }
  if (type === 1) {
    const dollars = rnd(1, 9)
    const cents = rnd(0, 99)
    const total = dollars * 100 + cents
    const spent = rnd(50, total)
    const change = total - spent
    const ans = `$${(change / 100).toFixed(2)}`
    const wrongs = [`$${((change + 25) / 100).toFixed(2)}`, `$${((change - 10 + (change < 10 ? 20 : 0)) / 100).toFixed(2)}`, `$${((change + 50) / 100).toFixed(2)}`]
    const { choices, correct } = makeChoices(ans, wrongs)
    return { text: `You have $${(total / 100).toFixed(2)} and spend $${(spent / 100).toFixed(2)}. How much change do you get?`, choices, correct }
  }
  const a = rnd(1, 20), b = rnd(1, 20)
  const longer = a >= b ? a : b
  const { choices, correct } = makeChoices(longer, [a < b ? a : b, longer + 2, longer - 1 >= 1 ? longer - 1 : longer + 3])
  return { text: `One pencil is ${a} cm long. Another is ${b} cm long. How long is the LONGER pencil?`, choices, correct }
}

function grade2Quiz() {
  const pick = rnd(0, 4)
  if (pick === 0) return grade2PlaceValue()
  if (pick === 1) return grade2AddSub()
  if (pick === 2) {
    const n = rnd(1, 50)
    const ans = n % 2 === 0 ? 'Even' : 'Odd'
    const { choices, correct } = makeChoices(ans, ['Even', 'Odd'].filter(x => x !== ans))
    return { text: `Is ${n} odd or even?`, choices, correct }
  }
  if (pick === 3) return grade2Measurement()
  const items = ['Dogs', 'Cats', 'Birds']
  const counts = [rnd(2, 8), rnd(2, 8), rnd(2, 8)]
  const maxIdx = counts.indexOf(Math.max(...counts))
  return { text: `A graph shows: Dogs=${counts[0]}, Cats=${counts[1]}, Birds=${counts[2]}. Which has the most?`, choices: shuffle(items), correct: shuffle(items).indexOf(items[maxIdx]) }
}

// ─── 3RD GRADE ──────────────────────────────────────────────────
function grade3Multiply() {
  const a = rnd(2, 9), b = rnd(2, 9)
  const ans = a * b
  const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 5))
  return { text: `${a} × ${b} = ?`, choices, correct }
}

function grade3Divide() {
  const b = rnd(2, 9), a = rnd(2, 9)
  const dividend = a * b
  const { choices, correct } = makeChoices(a, nearDistractors(a, 3, 3))
  return { text: `${dividend} ÷ ${b} = ?`, choices, correct }
}

function grade3Fraction() {
  const denoms = [2, 3, 4, 6, 8]
  const d = denoms[rnd(0, denoms.length - 1)]
  const n = rnd(1, d - 1)
  const type = rnd(0, 2)
  if (type === 0) {
    const ans = `${n}/${d}`
    const wrongs = [`${n + 1}/${d}`, `${n}/${d + 1}`, d > 2 ? `${n}/${d - 1}` : `${n + 2}/${d}`]
    const { choices, correct } = makeChoices(ans, wrongs)
    return { text: `A pizza has ${d} equal slices. You eat ${n} slices. What fraction did you eat?`, choices, correct }
  }
  if (type === 1) {
    const n2 = rnd(1, d - 1)
    const bigger = n >= n2 ? `${n}/${d}` : `${n2}/${d}`
    const { choices, correct } = makeChoices(bigger, [`${n < n2 ? n : n2}/${d}`, `${n + 1}/${d}`, `${d}/${n}`])
    return { text: `Which fraction is larger: ${n}/${d} or ${n2}/${d}?`, choices, correct }
  }
  const { choices, correct } = makeChoices(n, nearDistractors(n, 3, 2).filter(x => x > 0 && x < d))
  return { text: `On a number line from 0 to 1, divided into ${d} equal parts, where is ${n}/${d}? (How many parts from 0?)`, choices, correct }
}

function grade3Quiz() {
  const pick = rnd(0, 4)
  if (pick === 0) return grade3Multiply()
  if (pick === 1) return grade3Divide()
  if (pick === 2) return grade3Fraction()
  if (pick === 3) {
    const w = rnd(2, 8), h = rnd(2, 8)
    const ans = w * h
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 5))
    return { text: `What is the area of a rectangle ${w} units wide and ${h} units tall?`, choices, correct }
  }
  const w = rnd(2, 8), h = rnd(2, 8)
  const ans = 2 * (w + h)
  const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 4))
  return { text: `What is the perimeter of a rectangle ${w} units wide and ${h} units tall?`, choices, correct }
}

// ─── 4TH GRADE ──────────────────────────────────────────────────
function grade4Fraction() {
  const type = rnd(0, 2)
  if (type === 0) {
    const n = rnd(1, 4), d = rnd(2, 6)
    const mult = rnd(2, 4)
    const ans = `${n * mult}/${d * mult}`
    const wrongs = [`${n + 1}/${d * mult}`, `${n * mult}/${d + 1}`, `${n * (mult + 1)}/${d * mult}`]
    const { choices, correct } = makeChoices(ans, wrongs)
    return { text: `Which fraction is equivalent to ${n}/${d}?`, choices, correct }
  }
  if (type === 1) {
    const d = rnd(3, 8)
    const a = rnd(1, d - 1), b = rnd(1, d - a)
    const sum = a + b
    const ans = sum >= d ? `${Math.floor(sum / d)} ${sum % d}/${d}` : `${sum}/${d}`
    const { choices, correct } = makeChoices(ans, [`${a + b + 1}/${d}`, `${a}/${d + b}`, sum >= d ? `${sum}/${d}` : `${sum + 1}/${d}`])
    return { text: `${a}/${d} + ${b}/${d} = ?`, choices, correct }
  }
  const d = rnd(3, 8)
  const a = rnd(2, d - 1), b = rnd(1, a)
  const diff = a - b
  const ans = diff === 0 ? '0' : `${diff}/${d}`
  const { choices, correct } = makeChoices(ans, [`${diff + 1}/${d}`, `${a + b}/${d}`, diff > 1 ? `${diff - 1}/${d}` : `${diff + 2}/${d}`])
  return { text: `${a}/${d} − ${b}/${d} = ?`, choices, correct }
}

function grade4Multiply() {
  const type = rnd(0, 1)
  if (type === 0) {
    const a = rnd(100, 999), b = rnd(2, 9)
    const ans = a * b
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 50))
    return { text: `${a} × ${b} = ?`, choices, correct }
  }
  const a = rnd(11, 30), b = rnd(11, 25)
  const ans = a * b
  const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 20))
  return { text: `${a} × ${b} = ?`, choices, correct }
}

function grade4Angles() {
  const type = rnd(0, 2)
  if (type === 0) {
    const angle = rnd(5, 175)
    let cls
    if (angle < 90) cls = 'acute'
    else if (angle === 90) cls = 'right'
    else cls = 'obtuse'
    const { choices, correct } = makeChoices(cls, ['acute', 'right', 'obtuse'].filter(x => x !== cls))
    return { text: `An angle that measures ${angle}° is called a(n) ______ angle.`, choices, correct }
  }
  if (type === 1) {
    const angle = rnd(10, 170)
    const { choices, correct } = makeChoices(`${angle}°`, [`${angle + 5}°`, `${angle - 5}°`, `${angle + 10}°`])
    return { text: `If one angle of a straight line is ${180 - angle}°, what is the other angle?`, choices, correct }
  }
  const q = [
    { text: 'How many degrees are in a right angle?', ans: '90°', wrongs: ['45°', '180°', '360°'] },
    { text: 'How many degrees are in a straight angle?', ans: '180°', wrongs: ['90°', '270°', '360°'] },
    { text: 'Acute angles are always less than...?', ans: '90°', wrongs: ['45°', '180°', '360°'] },
    { text: 'Obtuse angles are always between 90° and...?', ans: '180°', wrongs: ['90°', '270°', '360°'] },
  ][rnd(0, 3)]
  const { choices, correct } = makeChoices(q.ans, q.wrongs)
  return { text: q.text, choices, correct }
}

function grade4Quiz() {
  const pick = rnd(0, 4)
  if (pick === 0) return grade4Fraction()
  if (pick === 1) return grade4Multiply()
  if (pick === 2) {
    const a = rnd(20, 50), b = rnd(2, 9)
    const ans = Math.floor(a / b)
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 3))
    return { text: `${a} ÷ ${b} = ? (round to nearest whole)`, choices, correct }
  }
  if (pick === 3) {
    const n = rnd(1, 9)
    const { choices, correct } = makeChoices(`0.${n}`, [`${n}.0`, `0.0${n}`, `${n}/100`])
    return { text: `What decimal equals ${n}/10?`, choices, correct }
  }
  return grade4Angles()
}

// ─── 5TH GRADE ──────────────────────────────────────────────────
function grade5FractionOps() {
  const type = rnd(0, 2)
  if (type === 0) {
    const n1 = rnd(1, 4), d1 = rnd(2, 6), n2 = rnd(1, 4), d2 = rnd(2, 6)
    const nr = n1 * n2, dr = d1 * d2
    const g = gcd(nr, dr)
    const ans = g === dr ? `${nr / g}` : `${nr / g}/${dr / g}`
    const { choices, correct } = makeChoices(ans, [`${n1 * n2 + 1}/${d1 * d2}`, `${n1 + n2}/${d1 + d2}`, `${n1 * n2}/${d1 * d2 + 1}`])
    return { text: `${n1}/${d1} × ${n2}/${d2} = ?`, choices, correct }
  }
  if (type === 1) {
    const d1 = rnd(2, 5), d2 = rnd(2, 5)
    const n1 = rnd(1, d1 - 1), n2 = rnd(1, d2 - 1)
    const lcd = d1 * d2 / gcd(d1, d2)
    const nr = n1 * (lcd / d1) + n2 * (lcd / d2)
    const g = gcd(nr, lcd)
    const ans = nr >= lcd ? `${Math.floor(nr / lcd)} ${(nr % lcd) / g}/${lcd / g}` : `${nr / g}/${lcd / g}`
    const { choices, correct } = makeChoices(ans, [`${n1 + n2}/${d1 + d2}`, `${n1 + n2}/${d1 * d2}`, `${nr + 1}/${lcd}`])
    return { text: `${n1}/${d1} + ${n2}/${d2} = ?`, choices, correct }
  }
  const d = rnd(2, 8)
  const whole = rnd(2, 6)
  const ans = `${whole * d}`
  const { choices, correct } = makeChoices(ans, [`${whole / d}`, `${d * whole + 1}`, `${whole + d}`])
  return { text: `1/${d} ÷ 1/${whole * d} = ?`, choices, correct }
}

function gcd(a, b) { return b === 0 ? a : gcd(b, a % b) }

function grade5Decimals() {
  const type = rnd(0, 2)
  if (type === 0) {
    const a = rnd(2, 9), b = rnd(2, 9)
    const d1 = rnd(1, 2), d2 = 1
    const fa = a / Math.pow(10, d1), fb = b / Math.pow(10, d2)
    const ans = parseFloat((fa * fb).toFixed(d1 + d2))
    const { choices, correct } = makeChoices(String(ans), [String(ans + 0.1), String(ans * 10), String(parseFloat((ans - 0.1).toFixed(d1 + d2)))])
    return { text: `${fa} × ${fb} = ?`, choices, correct }
  }
  if (type === 1) {
    const n = parseFloat((rnd(1000, 9999) / 1000).toFixed(4))
    const ans = n.toFixed(3)
    const { choices, correct } = makeChoices(ans, [(n + 0.001).toFixed(3), (n - 0.001).toFixed(3), n.toFixed(2)])
    return { text: `Round ${n} to the nearest thousandth.`, choices, correct }
  }
  const n = parseFloat((rnd(1, 99) / 1000).toFixed(3))
  const str = n.toFixed(3)
  const thousandths = parseInt(str[str.length - 1])
  const { choices, correct } = makeChoices(thousandths, nearDistractors(thousandths, 3, 2).filter(x => x >= 0 && x <= 9))
  return { text: `In the number ${n}, what digit is in the THOUSANDTHS place?`, choices, correct }
}

function grade5Volume() {
  const type = rnd(0, 1)
  if (type === 0) {
    const l = rnd(2, 8), w = rnd(2, 8), h = rnd(2, 8)
    const ans = l * w * h
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 10))
    return { text: `What is the volume of a box that is ${l} long, ${w} wide, and ${h} tall? (V = l × w × h)`, choices, correct }
  }
  const x = rnd(1, 9), y = rnd(1, 9)
  const { choices, correct } = makeChoices(`(${x}, ${y})`, [`(${y}, ${x})`, `(${x + 1}, ${y})`, `(${x}, ${y + 1})`])
  return { text: `A point is ${x} units right and ${y} units up from the origin. What are its coordinates?`, choices, correct }
}

function grade5Quiz() {
  const pick = rnd(0, 4)
  if (pick === 0) return grade5FractionOps()
  if (pick === 1) return grade5Decimals()
  if (pick === 2) return grade5Volume()
  if (pick === 3) {
    const l = rnd(2, 6), w = rnd(2, 6), h = rnd(2, 6)
    const ans = l * w * h
    const { choices, correct } = makeChoices(ans, nearDistractors(ans, 3, 8))
    return { text: `Volume of a ${l} × ${w} × ${h} rectangular prism?`, choices, correct }
  }
  const a = rnd(2, 5), b = rnd(2, 4), c = rnd(1, 5)
  const ans = a + b * c
  const wrong = (a + b) * c
  const { choices, correct } = makeChoices(ans, [wrong, ans + 1, ans - 1])
  return { text: `${a} + ${b} × ${c} = ? (Use order of operations)`, choices, correct }
}

// ─── ACTIVITY CONFIGS ────────────────────────────────────────────
export const GRADE_ACTIVITIES = {
  k: {
    color: '#9B59B6',
    colorLight: '#f0e3fa',
    activities: [
      {
        id: 'k-a1',
        title: 'Counting Camp',
        description: 'Count groups of objects (1–20), compare groups, write the number.',
        goals: ['Count objects up to 20', 'Compare two groups (more/less)', 'Write numbers 1–20'],
        generate: () => Array.from({ length: 6 }, kCounting),
      },
      {
        id: 'k-a2',
        title: 'Fruit Basket',
        description: 'Sort colorful fruits and count how many of each kind!',
        goals: ['Sort objects by type', 'Count items in a group', 'Compare groups of objects'],
        generate: () => Array.from({ length: 6 }, kFruitSort),
      },
      {
        id: 'k-a3',
        title: 'Number Bonds',
        description: 'Break numbers 1–10 into two parts.',
        goals: ['Decompose numbers up to 10', 'Find missing addends', 'Understand part-part-whole'],
        generate: () => Array.from({ length: 6 }, kNumberBond),
      },
    ],
    quiz: {
      id: 'k-quiz',
      title: 'Kindergarten Quiz',
      description: 'Test your Kindergarten math skills!',
      generate: () => Array.from({ length: 5 }, kQuiz),
    },
  },

  '1': {
    color: '#EE5A24',
    colorLight: '#fde8e0',
    activities: [
      {
        id: '1-a1',
        title: 'Addition Adventure',
        description: 'Add two numbers using part-part-whole bond boxes.',
        goals: ['Add within 20', 'Use part-part-whole thinking', 'Find missing addends'],
        generate: () => Array.from({ length: 6 }, grade1BondBox),
      },
      {
        id: '1-a2',
        title: 'Dice Addition',
        description: 'Roll the dice and add up the numbers!',
        goals: ['Add 2–3 numbers together', 'Count dots on dice faces', 'Practice mental addition'],
        generate: () => Array.from({ length: 6 }, grade1Dice),
      },
      {
        id: '1-a3',
        title: 'Subtraction Station',
        description: 'Subtract within 20.',
        goals: ['Subtract within 20', 'Use counting-back strategies', 'Relate subtraction to addition'],
        generate: () => Array.from({ length: 6 }, grade1Sub),
      },
    ],
    quiz: {
      id: '1-quiz',
      title: '1st Grade Quiz',
      description: 'Show off your 1st grade math!',
      generate: () => Array.from({ length: 5 }, grade1Quiz),
    },
  },

  '2': {
    color: '#2980B9',
    colorLight: '#d5e8f5',
    activities: [
      {
        id: '2-a1',
        title: 'Place Value Power',
        description: 'Identify hundreds, tens, and ones in 3-digit numbers.',
        goals: ['Read 3-digit numbers', 'Identify hundreds, tens, and ones', 'Compare 3-digit numbers'],
        generate: () => Array.from({ length: 6 }, grade2PlaceValue),
      },
      {
        id: '2-a2',
        title: 'Addition & Subtraction Sprint',
        description: 'Add and subtract within 1,000.',
        goals: ['Add 3-digit numbers', 'Subtract 3-digit numbers', 'Use regrouping strategies'],
        generate: () => Array.from({ length: 6 }, grade2AddSub),
      },
      {
        id: '2-a3',
        title: 'Measurement Master',
        description: 'Tell time to 5 minutes and solve money problems.',
        goals: ['Tell time to the nearest 5 minutes', 'Solve money problems up to $10', 'Compare lengths in cm and m'],
        generate: () => Array.from({ length: 6 }, grade2Measurement),
      },
    ],
    quiz: {
      id: '2-quiz',
      title: '2nd Grade Quiz',
      description: 'Prove your 2nd grade math power!',
      generate: () => Array.from({ length: 5 }, grade2Quiz),
    },
  },

  '3': {
    color: '#F39C12',
    colorLight: '#fef3d5',
    activities: [
      {
        id: '3-a1',
        title: 'Multiplication Mission',
        description: 'Master multiplication tables 1–9.',
        goals: ['Multiply single-digit numbers', 'Recognize multiplication patterns', 'Apply multiplication facts fluently'],
        generate: () => Array.from({ length: 6 }, grade3Multiply),
      },
      {
        id: '3-a2',
        title: 'Division Dojo',
        description: 'Division facts up to 81 ÷ 9.',
        goals: ['Divide within 81', 'Understand division as equal sharing', 'Connect multiplication and division facts'],
        generate: () => Array.from({ length: 6 }, grade3Divide),
      },
      {
        id: '3-a3',
        title: 'Fraction Foundations',
        description: 'Fractions as parts of a whole, comparing fractions.',
        goals: ['Write fractions for parts of a whole', 'Compare fractions with the same denominator', 'Place fractions on a number line'],
        generate: () => Array.from({ length: 6 }, grade3Fraction),
      },
    ],
    quiz: {
      id: '3-quiz',
      title: '3rd Grade Quiz',
      description: 'Put your 3rd grade skills to the test!',
      generate: () => Array.from({ length: 5 }, grade3Quiz),
    },
  },

  '4': {
    color: '#6C5CE7',
    colorLight: '#e5e3fc',
    activities: [
      {
        id: '4-a1',
        title: 'Fraction Feast',
        description: 'Equivalent fractions, adding/subtracting same-denominator fractions.',
        goals: ['Find equivalent fractions', 'Add fractions with same denominators', 'Subtract fractions with same denominators'],
        generate: () => Array.from({ length: 6 }, grade4Fraction),
      },
      {
        id: '4-a2',
        title: 'Multi-Digit Multiplication',
        description: 'Multiply up to 4-digit × 1-digit and 2-digit × 2-digit.',
        goals: ['Multiply 3–4 digit numbers by 1 digit', 'Multiply 2-digit × 2-digit numbers', 'Use the standard algorithm'],
        generate: () => Array.from({ length: 6 }, grade4Multiply),
      },
      {
        id: '4-a3',
        title: 'Geometry Angles',
        description: 'Measure and classify angles.',
        goals: ['Identify acute, right, and obtuse angles', 'Understand angle measurement in degrees', 'Find missing angles on a straight line'],
        generate: () => Array.from({ length: 6 }, grade4Angles),
      },
    ],
    quiz: {
      id: '4-quiz',
      title: '4th Grade Quiz',
      description: 'Show what you know in 4th grade math!',
      generate: () => Array.from({ length: 5 }, grade4Quiz),
    },
  },

  '5': {
    color: '#00B894',
    colorLight: '#d0f5ee',
    activities: [
      {
        id: '5-a1',
        title: 'Fraction Operations',
        description: 'Multiply fractions, divide unit fractions, add/subtract unlike denominators.',
        goals: ['Multiply fractions by fractions', 'Divide unit fractions', 'Add/subtract fractions with unlike denominators'],
        generate: () => Array.from({ length: 6 }, grade5FractionOps),
      },
      {
        id: '5-a2',
        title: 'Decimal Detectives',
        description: 'Multiply and divide decimals, round to thousandths.',
        goals: ['Multiply decimals', 'Round to the nearest thousandth', 'Identify place values to 0.001'],
        generate: () => Array.from({ length: 6 }, grade5Decimals),
      },
      {
        id: '5-a3',
        title: 'Volume & Coordinate Grids',
        description: 'Find volume of rectangular prisms and plot coordinate points.',
        goals: ['Apply V = l × w × h', 'Plot points on a coordinate grid', 'Read coordinates (x, y)'],
        generate: () => Array.from({ length: 6 }, grade5Volume),
      },
    ],
    quiz: {
      id: '5-quiz',
      title: '5th Grade Quiz',
      description: 'Tackle the 5th grade challenge!',
      generate: () => Array.from({ length: 5 }, grade5Quiz),
    },
  },
}
