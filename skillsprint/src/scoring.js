import { SALES, REGIONS } from './data.js'

export const RUBRIC = [
  { key: 'accuracy',  label: 'Data accuracy and preparation',   weight: 30, mode: 'Calculated (auto-checked)' },
  { key: 'reasoning', label: 'Analytical reasoning',            weight: 30, mode: 'Human review' },
  { key: 'visual',    label: 'Visualisation and interpretation', weight: 20, mode: 'Human review' },
  { key: 'recs',      label: 'Business recommendations',        weight: 20, mode: 'Human review' },
]

const sum = (arr) => arr.reduce((a, b) => a + b, 0)
const regionTotal = (r) => sum(SALES.map((m) => m[r]))
const monthTotal = (m) => sum(REGIONS.map((r) => m[r]))

// Answer key is computed from the dataset, never hard-coded.
export function answerKey() {
  const top = [...REGIONS].sort((a, b) => regionTotal(b) - regionTotal(a))[0]
  const low = [...SALES].sort((a, b) => monthTotal(a) - monthTotal(b))[0].month
  return { q1: String(regionTotal('North')), q2: top, q3: low }
}

export const QUESTIONS = [
  { key: 'q1', label: 'What are North region’s total sales over the six months (R thousands)?', type: 'number' },
  { key: 'q2', label: 'Which region has the highest six-month total?', type: 'select', options: REGIONS },
  { key: 'q3', label: 'Which month has the lowest combined sales across all regions?', type: 'select', options: SALES.map((m) => m.month) },
]

export function correctness(answers) {
  const key = answerKey()
  return Object.fromEntries(Object.keys(key).map((k) => [k, String(answers[k] ?? '').trim() === key[k]]))
}

// Accuracy criterion on a 0–5 scale (matches the human-rated criteria).
export function scoreAccuracy(answers) {
  const c = correctness(answers)
  const right = Object.values(c).filter(Boolean).length
  return Math.round((right / Object.keys(c).length) * 5 * 10) / 10
}

// Returns a 0–100 weighted total, or null until every criterion has a score.
export function totalScore(answers, ratings) {
  if (!ratings) return null
  const vals = { accuracy: scoreAccuracy(answers), ...ratings }
  if (RUBRIC.some((r) => typeof vals[r.key] !== 'number')) return null
  return Math.round(sum(RUBRIC.map((r) => (vals[r.key] / 5) * r.weight)) * 10) / 10
}
