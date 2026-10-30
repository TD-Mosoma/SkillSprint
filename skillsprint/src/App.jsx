import { useEffect, useState } from 'react'
import { ROLES, SALES, REGIONS, STATUSES, SEED } from './data.js'
import { QUESTIONS, correctness, rubricForRole, scoreAccuracy, totalScore } from './scoring.js'
import businessAnalystImage from './assets/business-analyst.webp'
import cybersecurityAnalystImage from './assets/CybersecurityAnalyst.webp'
import dataAnalystImage from './assets/data-analytics.jpg'
import itSupportAnalystImage from './assets/ITsupport-analyst.jpg'
import softwareDeveloperImage from './assets/Software-developer.webp'
import { getCv, saveCv } from './cvStorage.js'

const KEY = 'skillsprint-v1'
const THEME_KEY = 'skillsprint-theme'
const CV_MAX_SIZE = 5 * 1024 * 1024
const ROLE_IMAGES = {
  'data-analyst': dataAnalystImage,
  'business-analyst': businessAnalystImage,
  developer: softwareDeveloperImage,
  cyber: cybersecurityAnalystImage,
  'it-support': itSupportAnalystImage,
}
const fresh = () => ({ user: '', subs: SEED.subs, ports: SEED.ports })
function load() {
  try { return JSON.parse(localStorage.getItem(KEY)) || fresh() } catch { return fresh() }
}

const Badge = ({ kind, children }) => <span className={`badge ${kind}`}>{children}</span>

function latestCv(cvs = [], owner) {
  return cvs.filter((cv) => cv.owner === owner).slice(-1)[0]
}

function ThemeToggle({ theme, onToggle }) {
  const nextTheme = theme === 'dark' ? 'light' : 'dark'
  return <button className="theme-toggle" onClick={onToggle}>Switch to {nextTheme} mode</button>
}

function Roles({ openChallenge }) {
  return (
    <section>
      <h2>Entry-level IT opportunities</h2>
      <p className="muted">Every company, role and result in this prototype is fictional or illustrative.</p>
      <div className="grid">
        {ROLES.map((r) => (
          <article key={r.id} className="card">
            <img className="role-image" src={ROLE_IMAGES[r.id]} alt={`${r.title} role`} />
            <h3>{r.title}</h3>
            <p className="muted">{r.company} · {r.effort}</p>
            <p>{r.summary}</p>
            <button onClick={() => openChallenge(r.id)}>View challenge</button>
          </article>
        ))}
      </div>
    </section>
  )
}

function Rubric({ roleId }) {
  const rubric = rubricForRole(roleId)
  return (
    <table>
      <caption>Scoring rubric (published before you start)</caption>
      <thead><tr><th>Criterion</th><th>Weight</th><th>How it is scored</th></tr></thead>
      <tbody>{rubric.map((r) => <tr key={r.key}><td>{r.label}</td><td>{r.weight}%</td><td>{r.mode}</td></tr>)}</tbody>
    </table>
  )
}

function Challenge({ state, setState, go, roleId, startedAt }) {
  const role = ROLES.find((item) => item.id === roleId) || ROLES[0]
  const isDataAnalyst = role.id === 'data-analyst'
  const durationSeconds = Number(role.effort.match(/\d+/)?.[0] || 45) * 60
  const [f, setF] = useState({ name: state.user, q1: '', q2: '', q3: '', analysis: '', visuals: '', recs: '' })
  const [errs, setErrs] = useState({})
  const [remainingSeconds, setRemainingSeconds] = useState(() => Math.max(0, durationSeconds - Math.floor((Date.now() - startedAt) / 1000)))
  const set = (k) => (e) => setF({ ...f, [k]: e.target.value })
  useEffect(() => {
    const updateRemaining = () => setRemainingSeconds(Math.max(0, durationSeconds - Math.floor((Date.now() - startedAt) / 1000)))
    updateRemaining()
    const interval = window.setInterval(updateRemaining, 1000)
    return () => window.clearInterval(interval)
  }, [startedAt])

  function submit(e) {
    e.preventDefault()
    const er = {}
    if (!f.name.trim()) er.name = 'Enter your name.'
    const cv = latestCv(state.cvs, state.user)
    if (!cv) er.cv = 'Upload your CV on the Portfolio page before submitting this challenge.'
    if (isDataAnalyst) {
      if (f.q1.trim() === '' || isNaN(Number(f.q1))) er.q1 = 'Enter a number.'
      if (!f.q2) er.q2 = 'Choose a region.'
      if (!f.q3) er.q3 = 'Choose a month.'
      if (f.analysis.trim().length < 40) er.analysis = 'Describe the trends in at least 40 characters.'
      if (!f.visuals.trim()) er.visuals = 'Describe two visualisations.'
      if (f.recs.trim().length < 20) er.recs = 'Give three recommended actions.'
    } else {
      for (const prompt of role.challenge.prompts) {
        if (f[prompt.key].trim().length < 20) er[prompt.key] = 'Please provide at least 20 characters.'
      }
    }
    setErrs(er)
    if (Object.keys(er).length) return
    const sub = { id: 'u' + Date.now(), candidate: f.name.trim(), roleId: role.id, seeded: false,
      cvId: cv.id,
      answers: { q1: f.q1.trim(), q2: f.q2, q3: f.q3 }, analysis: f.analysis, visuals: f.visuals, recs: f.recs,
      ratings: null, ratingSource: null, status: 'Under Review', notes: '' }
    setState({
      ...state,
      user: sub.candidate,
      cvs: (state.cvs || []).map((item) => item.id === cv.id ? { ...item, owner: sub.candidate } : item),
      subs: [...state.subs.filter((s) => s.candidate !== sub.candidate || s.roleId !== sub.roleId), sub],
    })
    go('mine')
  }
  const Err = ({ k }) => errs[k] ? <span className="err" role="alert">{errs[k]}</span> : null

  return (
    <section>
      <h2>{role.title} – {role.company}</h2>
      {isDataAnalyst
        ? <p>Scenario: you have six months of synthetic retail sales (R thousands) for three regions. Find the trends, describe two useful visualisations and recommend three actions. Expected effort: {role.effort}. Challenge answers are text only.</p>
        : <><p>{role.challenge.scenario}</p><p className="muted">Expected effort: {role.effort}. Challenge answers are text only.</p></>}
      {isDataAnalyst && <div className="scroll">
        <table>
          <caption>Synthetic sales data (R thousands)</caption>
          <thead><tr><th>Month</th>{REGIONS.map((r) => <th key={r}>{r}</th>)}</tr></thead>
          <tbody>{SALES.map((m) => <tr key={m.month}><td>{m.month}</td>{REGIONS.map((r) => <td key={r}>{m[r]}</td>)}</tr>)}</tbody>
        </table>
      </div>}
      <p className="challenge-timer" role="timer" aria-label={`${Math.floor(remainingSeconds / 60)} minutes ${remainingSeconds % 60} seconds remaining`}>
        Time remaining: {String(Math.floor(remainingSeconds / 60)).padStart(2, '0')}:{String(remainingSeconds % 60).padStart(2, '0')}
      </p>
      <form onSubmit={submit} noValidate>
        <label>Your name<input value={f.name} onChange={set('name')} /></label><Err k="name" />
        {isDataAnalyst ? QUESTIONS.map((q) => (
          <div key={q.key}>
            <label>{q.label}
              {q.type === 'number'
                ? <input inputMode="decimal" value={f[q.key]} onChange={set(q.key)} />
                : <select value={f[q.key]} onChange={set(q.key)}><option value="">Select…</option>{q.options.map((o) => <option key={o}>{o}</option>)}</select>}
            </label><Err k={q.key} />
          </div>
        )) : role.challenge.prompts.map((prompt) => (
          <div key={prompt.key}>
            <label>{prompt.label}<textarea rows="5" value={f[prompt.key]} onChange={set(prompt.key)} /></label>
            <Err k={prompt.key} />
          </div>
        ))}
        {isDataAnalyst && <>
          <label>What trends do you see, and why might they matter?<textarea rows="4" value={f.analysis} onChange={set('analysis')} /></label><Err k="analysis" />
          <label>Describe two visualisations you would create (or link to them)<textarea rows="3" value={f.visuals} onChange={set('visuals')} /></label><Err k="visuals" />
          <label>Three recommended actions for the business<textarea rows="3" value={f.recs} onChange={set('recs')} /></label><Err k="recs" />
        </>}
        {errs.cv && <span className="err" role="alert">{errs.cv} <button type="button" className="link" onClick={() => go('portfolio')}>Go to Portfolio</button></span>}
        <button type="submit">Submit response</button>
      </form>
      <details className="rubric-disclosure">
        <summary>View scoring rubric</summary>
        <Rubric roleId={role.id} />
      </details>
    </section>
  )
}

function Portfolio({ state, setState, onCVSaved }) {
  const [p, setP] = useState({ title: '', link: '', tech: '', contribution: '' })
  const [err, setErr] = useState('')
  const [cvFile, setCvFile] = useState(null)
  const [cvError, setCvError] = useState('')
  const [uploadingCv, setUploadingCv] = useState(false)
  const set = (k) => (e) => setP({ ...p, [k]: e.target.value })
  const mine = state.ports.filter((x) => x.owner === state.user)
  const cv = latestCv(state.cvs, state.user)

  function add(e) {
    e.preventDefault()
    if (!state.user) return setErr('Submit the challenge first (or enter your name there) so entries are linked to you.')
    if (!p.title.trim() || !p.contribution.trim()) return setErr('Title and your individual contribution are required.')
    setErr('')
    setState({ ...state, ports: [...state.ports, { id: 'p' + Date.now(), owner: state.user, ...p }] })
    setP({ title: '', link: '', tech: '', contribution: '' })
  }

  async function uploadCv(e) {
    e.preventDefault()
    const form = e.currentTarget
    setCvError('')
    if (!state.user) {
      setCvError('Sign in as a graduate before uploading a CV.')
      return
    }
    if (!cvFile) {
      setCvError('Choose a PDF CV to upload.')
      return
    }
    if (!cvFile.name.toLowerCase().endsWith('.pdf') || (cvFile.type && cvFile.type !== 'application/pdf')) {
      setCvError('Upload a PDF file.')
      return
    }
    if (cvFile.size === 0 || cvFile.size > CV_MAX_SIZE) {
      setCvError('The PDF must be larger than 0 bytes and no larger than 5 MB.')
      return
    }

    setUploadingCv(true)
    const metadata = {
      id: window.crypto?.randomUUID?.() || `cv-${Date.now()}-${Math.random().toString(36).slice(2)}`,
      owner: state.user,
      fileName: cvFile.name,
      size: cvFile.size,
      uploadedAt: new Date().toISOString(),
    }
    try {
      await saveCv(metadata.id, cvFile)
      setState({ ...state, cvs: [...(state.cvs || []), metadata] })
      setCvFile(null)
      form.reset()
      onCVSaved(metadata)
    } catch (error) {
      setCvError(`Could not save your CV in this browser. ${error instanceof Error ? error.message : 'Try again.'}`)
    } finally {
      setUploadingCv(false)
    }
  }

  return (
    <section>
      <h2>ProofOfSkill portfolio</h2>
      <p className="muted">Entries are shown to employers as <b>self-reported</b>. This prototype has no verification step.</p>
      <section className="card cv-upload">
        <h3>CV upload (required before starting a challenge)</h3>
        {cv && <p>Current CV: <b>{cv.fileName}</b> ({(cv.size / (1024 * 1024)).toFixed(2)} MB)</p>}
        <form onSubmit={uploadCv} noValidate>
          <label htmlFor="cv-upload">Choose a PDF CV (5 MB maximum)
            <input id="cv-upload" type="file" accept=".pdf,application/pdf" required onChange={(e) => { setCvFile(e.target.files?.[0] || null); setCvError('') }} />
          </label>
          {cvError && <span className="err" role="alert">{cvError}</span>}
          <button type="submit" disabled={uploadingCv}>{uploadingCv ? 'Uploading…' : cv ? 'Replace CV' : 'Upload CV'}</button>
        </form>
      </section>
      <form onSubmit={add} noValidate>
        <label>Project title<input value={p.title} onChange={set('title')} /></label>
        <label>Link (GitHub, prototype, slides – optional)<input value={p.link} onChange={set('link')} /></label>
        <label>Technologies used<input value={p.tech} onChange={set('tech')} /></label>
        <label>Your individual contribution<textarea rows="3" value={p.contribution} onChange={set('contribution')} /></label>
        {err && <span className="err" role="alert">{err}</span>}
        <button type="submit">Add portfolio entry</button>
      </form>
      <h3>Your entries{state.user ? ` (${state.user})` : ''}</h3>
      {mine.length === 0 ? <p className="muted">No entries yet.</p> : mine.map((x) => <PortItem key={x.id} x={x} />)}
    </section>
  )
}
const PortItem = ({ x }) => (
  <article className="card">
    <h4>{x.title} <Badge kind="grey">Self-reported</Badge></h4>
    {x.link && <p><a href={x.link} target="_blank" rel="noreferrer noopener">{x.link}</a></p>}
    <p><b>Tech:</b> {x.tech || '—'}</p><p><b>Contribution:</b> {x.contribution}</p>
  </article>
)

function ScoreLine({ sub }) {
  const total = totalScore(sub.answers, sub.ratings, sub.roleId)
  const label = sub.ratingSource === 'human' ? 'Human-reviewed' : sub.ratingSource === 'illustrative' ? 'Illustrative sample score' : null
  return total === null
    ? <p><Badge kind="amber">Pending human review</Badge> {sub.roleId === 'data-analyst' && <>Calculated accuracy so far: {scoreAccuracy(sub.answers)}/5 (auto-checked).</>}</p>
    : <p><b>Challenge score: {total}/100</b> <Badge kind={sub.ratingSource === 'human' ? 'green' : 'grey'}>{label}</Badge> – task-specific, not a prediction of job performance.</p>
}

function CVDownload({ cv }) {
  const [error, setError] = useState('')

  async function download() {
    try {
      const file = await getCv(cv.id)
      if (!file) throw new Error('The saved CV file is not available in this browser.')
      const url = URL.createObjectURL(file)
      const link = document.createElement('a')
      link.href = url
      link.download = cv.fileName
      document.body.append(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
      setError('')
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : 'Could not download the CV.')
    }
  }

  return (
    <div>
      <p><b>CV:</b> {cv.fileName} ({(cv.size / (1024 * 1024)).toFixed(2)} MB)</p>
      <button type="button" onClick={download}>Download CV</button>
      {error && <span className="err" role="alert">{error}</span>}
    </div>
  )
}

function Mine({ state, go }) {
  const submissions = state.subs.filter((s) => s.candidate === state.user && !s.seeded)
  if (submissions.length === 0) return <section><h2>My applications</h2><p>No submissions yet.</p><button onClick={() => go('roles')}>Browse opportunities</button></section>
  return (
    <section>
      <h2>My applications</h2>
      {submissions.map((sub) => {
        const role = ROLES.find((item) => item.id === sub.roleId) || ROLES[0]
        return <article className="card" key={sub.id}>
          <h3>{role.title}</h3>
          <p><b>Status:</b> <Badge kind="blue">{sub.status}</Badge></p>
          <ScoreLine sub={sub} />
        </article>
      })}
      <p className="muted">Open-ended criteria are scored by a human reviewer using the role-specific rubric; this prototype never claims AI evaluation.</p>
      <button onClick={() => go('portfolio')}>Add portfolio evidence</button>
    </section>
  )
}

function Login({ onSignIn }) {
  const [name, setName] = useState('')
  const [role, setRole] = useState('graduate')
  const [error, setError] = useState('')

  function submit(e) {
    e.preventDefault()
    if (!name.trim()) {
      setError('Enter your name to continue.')
      return
    }
    onSignIn({ name: name.trim(), role })
  }

  return (
    <main className="login-page">
      <section className="card login-card">
        <h2>Sign in to SkillSprint</h2>
        <p className="muted">Choose the workspace that matches your role.</p>
        <form onSubmit={submit} noValidate>
          <label htmlFor="login-name">Name</label>
          <input id="login-name" autoComplete="name" value={name} onChange={(e) => setName(e.target.value)} />
          <label htmlFor="login-role">I am a</label>
          <select id="login-role" value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="graduate">Graduate</option>
            <option value="employee">Employee</option>
          </select>
          {error && <span className="err" role="alert">{error}</span>}
          <button type="submit">Continue as {role}</button>
        </form>
        <p className="muted login-note">Demo sign-in only. No password or real account is required; access is not verified.</p>
      </section>
    </main>
  )
}

function Employer({ state, setState }) {
  const subs = state.subs
  const [id, setId] = useState(subs[0]?.id)
  const sub = subs.find((s) => s.id === id) || subs[0]
  const [ratings, setRatings] = useState({})
  useEffect(() => { setRatings(sub?.ratings || {}) }, [sub?.id])
  if (!sub) return <section><h2>Employer review</h2><p>No submissions.</p></section>

  const role = ROLES.find((item) => item.id === sub.roleId) || ROLES[0]
  const isDataAnalyst = role.id === 'data-analyst'
  const update = (patch) => setState({ ...state, subs: subs.map((s) => (s.id === sub.id ? { ...s, ...patch } : s)) })
  const c = isDataAnalyst ? correctness(sub.answers) : null
  const ports = state.ports.filter((x) => x.owner === sub.candidate)
  const cv = (state.cvs || []).find((item) => item.id === sub.cvId)
  const rubric = rubricForRole(role.id)
  const hr = rubric.filter((r) => r.mode !== 'Calculated (auto-checked)')
  const complete = hr.every((r) => ratings[r.key] !== undefined && ratings[r.key] !== '')
  const saveReview = () => update({ ratings: Object.fromEntries(hr.map((r) => [r.key, Number(ratings[r.key])])), ratingSource: 'human' })

  return (
    <section>
      <h2>Employer review – {role.title}</h2>
      <p className="muted">The platform never hires or rejects automatically. You make the final decision.</p>
      <label>Candidate
        <select value={sub.id} onChange={(e) => setId(e.target.value)}>
          {subs.map((s) => {
            const submissionRole = ROLES.find((item) => item.id === s.roleId) || ROLES[0]
            return <option key={s.id} value={s.id}>{s.candidate} · {submissionRole.title}{s.seeded ? ' – sample' : ''}</option>
          })}
        </select>
      </label>
      <h3>1. Challenge performance</h3>
      <ScoreLine sub={sub} />
      {isDataAnalyst ? <>
        <ul>
          {QUESTIONS.map((q) => <li key={q.key}>{q.label} → <b>{sub.answers[q.key]}</b> {c[q.key] ? '✓' : '✗'}</li>)}
        </ul>
        <p><b>Trends:</b> {sub.analysis}</p><p><b>Visualisations:</b> {sub.visuals}</p><p><b>Recommendations:</b> {sub.recs}</p>
      </> : <dl>
        {role.challenge.prompts.map((prompt) => <React.Fragment key={prompt.key}>
          <dt><b>{prompt.label}</b></dt><dd>{sub.answers[prompt.key]}</dd>
        </React.Fragment>)}
      </dl>}
      <fieldset>
        <legend>Rate against the rubric (0–5)</legend>
        {hr.map((r) => (
          <label key={r.key}>{r.label} ({r.weight}%)
            <select value={ratings[r.key] ?? ''} onChange={(e) => setRatings({ ...ratings, [r.key]: e.target.value })}>
              <option value="">Select…</option>{[0, 1, 2, 3, 4, 5].map((n) => <option key={n}>{n}</option>)}
            </select>
          </label>
        ))}
      </fieldset>
      <h3>2. Portfolio evidence (separate signal)</h3>
      {cv ? <CVDownload cv={cv} /> : <p className="muted">No CV was attached to this submission.</p>}
      {ports.length === 0 ? <p className="muted">No portfolio entries.</p> : ports.map((x) => <PortItem key={x.id} x={x} />)}
      <h3>3. Decision</h3>
      <label>Application status
        <select value={sub.status} onChange={(e) => update({ status: e.target.value })}>{STATUSES.map((s) => <option key={s}>{s}</option>)}</select>
      </label>
      <label>Reviewer notes<textarea rows="3" value={sub.notes} onChange={(e) => update({ notes: e.target.value })} /></label>
      <button type="button" disabled={!complete} onClick={saveReview}>Save changes</button>
    </section>
  )
}

export default function App() {
  const [state, setState] = useState(load)
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(THEME_KEY) === 'light' ? 'light' : 'dark' } catch { return 'dark' }
  })
  const [view, setView] = useState('roles')
  const [selectedRoleId, setSelectedRoleId] = useState('data-analyst')
  const [pendingChallengeRoleId, setPendingChallengeRoleId] = useState(null)
  const [challengeStarts, setChallengeStarts] = useState({})
  const [session, setSession] = useState(null)
  useEffect(() => { try { localStorage.setItem(KEY, JSON.stringify(state)) } catch { /* storage unavailable: demo still works in-memory */ } }, [state])
  useEffect(() => {
    document.documentElement.dataset.theme = theme
    try { localStorage.setItem(THEME_KEY, theme) } catch { /* storage unavailable: theme still works in-memory */ }
  }, [theme])
  const graduateTabs = [['roles', 'Opportunities'], ['challenge', 'Challenge'], ['portfolio', 'Portfolio'], ['mine', 'My application']]
  const tabs = session?.role === 'employee' ? [['employer', 'Employee view']] : graduateTabs
  const signIn = ({ name, role }) => {
    setSession({ name, role })
    if (role === 'graduate') {
      setState((current) => ({ ...current, user: name }))
      setView('roles')
    } else {
      setView('employer')
    }
  }
  const signOut = () => {
    setSession(null)
    setView('roles')
  }
  const beginChallenge = (roleId) => {
    const timerKey = `${state.user}:${roleId}`
    setChallengeStarts((current) => current[timerKey] ? current : { ...current, [timerKey]: Date.now() })
    setSelectedRoleId(roleId)
    setPendingChallengeRoleId(null)
    setView('challenge')
  }
  const openChallenge = (roleId) => {
    setSelectedRoleId(roleId)
    if (!latestCv(state.cvs, state.user)) {
      setPendingChallengeRoleId(roleId)
      setView('portfolio')
      return
    }
    beginChallenge(roleId)
  }
  const resumePendingChallenge = () => {
    if (pendingChallengeRoleId) beginChallenge(pendingChallengeRoleId)
  }
  const reset = () => { if (confirm('Reset all demo data?')) { setState(fresh()); setView(session?.role === 'employee' ? 'employer' : 'roles') } }
  if (!session) {
    return (
      <>
        <header>
          <h1>SkillSprint</h1><p>Show your skills. Earn your opportunity.</p>
          <nav className="header-nav" aria-label="Appearance">
            <div className="nav-actions">
              <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
            </div>
          </nav>
        </header>
        <Login onSignIn={signIn} />
      </>
    )
  }
  return (
    <>
      <header>
        <h1>SkillSprint</h1><p>Show your skills. Earn your opportunity.</p>
        <div className="session-bar">
          <span className="muted">{session.name} · {session.role === 'employee' ? 'Employee' : 'Graduate'}</span>
        </div>
        <nav className="header-nav" aria-label="Main">
          {tabs.map(([k, l]) => <button key={k} className={view === k ? 'on' : ''} aria-current={view === k ? 'page' : undefined} onClick={() => k === 'challenge' ? openChallenge(selectedRoleId) : setView(k)}>{l}</button>)}
          <div className="nav-actions">
            <ThemeToggle theme={theme} onToggle={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
            <button className="link" onClick={signOut}>Sign out</button>
          </div>
        </nav>
      </header>
      <main>
        {session.role === 'graduate' && view === 'roles' && <Roles openChallenge={openChallenge} />}
        {session.role === 'graduate' && view === 'challenge' && <Challenge key={selectedRoleId} state={state} setState={setState} go={setView} roleId={selectedRoleId} startedAt={challengeStarts[`${state.user}:${selectedRoleId}`] || Date.now()} />}
        {session.role === 'graduate' && view === 'portfolio' && <Portfolio state={state} setState={setState} onCVSaved={resumePendingChallenge} />}
        {session.role === 'graduate' && view === 'mine' && <Mine state={state} go={setView} />}
        {session.role === 'employee' && view === 'employer' && <Employer state={state} setState={setState} />}
      </main>
      <footer><button className="link" onClick={reset}>Reset demo data</button></footer>
    </>
  )
}
