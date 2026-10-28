import test from 'node:test'
import assert from 'node:assert/strict'
import { answerKey, scoreAccuracy, totalScore, RUBRIC } from './scoring.js'

test('rubric weights sum to 100', () => assert.equal(RUBRIC.reduce((a, r) => a + r.weight, 0), 100))
test('answer key is derived from the dataset', () => assert.deepEqual(answerKey(), { q1: '829', q2: 'North', q3: 'Jan' }))
test('accuracy scales 0–5', () => {
  assert.equal(scoreAccuracy(answerKey()), 5)
  assert.equal(scoreAccuracy({ q1: '0', q2: 'South', q3: 'Feb' }), 0)
  assert.equal(scoreAccuracy({ ...answerKey(), q1: '1' }), 3.3)
})
test('total is null until reviewed, then weighted', () => {
  assert.equal(totalScore(answerKey(), null), null)
  assert.equal(totalScore(answerKey(), { reasoning: 5, visual: 5, recs: 5 }), 100)
  assert.equal(totalScore(answerKey(), { reasoning: 0, visual: 0, recs: 0 }), 30)
})
