import test from 'node:test'
import assert from 'node:assert/strict'
import { answerKey, scoreAccuracy, totalScore, RUBRIC, rubricForRole } from './scoring.js'
import { ROLES } from './data.js'

test('rubric weights sum to 100', () => assert.equal(RUBRIC.reduce((a, r) => a + r.weight, 0), 100))
test('every interactive role has a complete, role-specific rubric', () => {
  for (const role of ROLES) {
    const rubric = rubricForRole(role.id)
    assert.equal(rubric.reduce((sum, criterion) => sum + criterion.weight, 0), 100)
    if (role.id !== 'data-analyst') {
      assert.equal(rubric.length, 4)
      assert.ok(rubric.every((criterion) => criterion.mode === 'Human review'))
      assert.equal(role.challenge.prompts.length, 3)
    }
  }
})
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
test('non-data challenges are scored only after every role-specific criterion is reviewed', () => {
  assert.equal(totalScore({}, { task: 5, reasoning: 5, communication: 5 }, 'business-analyst'), null)
  assert.equal(totalScore({}, { task: 5, reasoning: 5, communication: 5, recommendations: 5 }, 'business-analyst'), 100)
  assert.equal(totalScore({}, { implementation: 0, testing: 0, reasoning: 0, communication: 0 }, 'developer'), 0)
})
