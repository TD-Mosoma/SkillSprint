
# SkillSprint

**Show your skills. Earn your opportunity.**
A hackathon MVP that tests one practical intervention in the graduate "experience gap": give graduates a short, role-specific challenge scored against a transparent rubric, and let employers review that evidence alongside a ProofOfSkill portfolio.

> **Demo only.** All companies, datasets, candidates and scores are fictional or illustrative. Nothing here is a real partner or a real assessment result.

## What it does

**Role-based demo sign-in**
- Start at the sign-in page and choose Graduate or Employee to open the corresponding workspace.
- Sign-in is only a local demo flow; there are no passwords, real accounts, or server-side authentication.
- Graduate and employee navigation is separated. All demo data remains in the current browser.

**Graduate journey**
1. Browse five entry-level IT roles, each with a matching image and fictional company: Business Analyst at BrightPath Commerce, Data Analyst at CapeData Analytics, Software Developer at Copperleaf Software Studio, Cybersecurity Analyst at Sentinel Ridge Security, and IT Support Analyst at Harborlight IT Services.
2. Open a role-specific challenge with its scenario, task prompts and published review rubric: process analysis and requirements for Business Analysts, an order-summary function for Software Developers, suspicious-login alert triage for Cybersecurity Analysts, and shared-folder troubleshooting for IT Support Analysts.
3. Submit written answers (client-side validation); Data Analyst answers are partly auto-checked, while the other roles are assessed by a human reviewer.
4. Add **ProofOfSkill** portfolio entries (title, link, technologies, individual contribution) – always labelled *Self-reported*.
5. Track application status and score.

**Employer journey**
1. Pick a candidate and role-specific submission; Data Analyst answers include auto-check results.
2. Rate the role-specific criteria (0–5) against the published rubric.
3. View portfolio evidence **separately** from the challenge score.
4. Set status (Under Review / Shortlisted / Interview / Not Progressing) and add notes. The platform never hires or rejects automatically.

**Scoring honesty** – every score is labelled. Weights apply within a role; percentages across different roles are not combined.

| Role / criterion | Weight | How scored |
|---|---|---|
| Data Analyst: data accuracy and preparation | 30% | **Calculated** – 3 questions auto-checked against an answer key derived from the dataset |
| Data Analyst: reasoning, visualisation and recommendations | 70% | Human review across the published criteria |
| Business Analyst, Software Developer, Cybersecurity Analyst, IT Support Analyst | 100% | Human review against that role’s published criteria and weights |

Until a human completes the review the total shows *Pending human review*. Seeded sample scores show *Illustrative*. **No AI evaluation is implemented or claimed.**

## Technologies

React 18 (JavaScript), Vite 5, plain CSS (responsive, light/dark), `localStorage` for persistence, Node's built-in test runner. No backend, no external APIs.

## Setup and run

Requires Node.js 18+.

```bash
git clone <your-repo-url>
cd skillsprint
npm install
npm run dev        # http://localhost:5173
npm test           # scoring unit tests
npm run build      # static build in dist/ (deployable to GitHub Pages, Netlify, Vercel)
```

**Suggested 2-minute demo:** Sign in as a graduate → Opportunities → choose a role → complete its challenge → My applications (*Pending human review*) → sign out → sign in as an employee → select a candidate and role-specific submission → rate criteria and save → set status Shortlisted. Use *Reset demo data* in the footer to start over.

## Project structure

```
src/data.js          fictional roles, synthetic dataset, seeded sample candidates
src/scoring.js       rubric, answer key, accuracy + weighted total
src/scoring.test.js  unit tests (weights = 100, key derived from data, scoring maths)
src/App.jsx          all views: roles, challenge, portfolio, my application, employer review
src/styles.css       responsive styling, visible focus states
```

## Systems-thinking link

The intervention targets one leverage point in the experience-gap cycle: the evidence used at early screening. Design choices that follow from the root-cause analysis: rubric visible before starting (trust), bounded ~45-minute task with text-only input (access and unpaid-work risk), challenge score kept separate from portfolio (avoids misleading precision), self-reported labels (portfolio exaggeration), human final decision (employer over-reliance).

## Known limitations

- Single-browser demo: `localStorage` only, no real authentication, no shared data between users. The sign-in role and name are not verified.
- Challenges are text-only and use fictional scenarios. The Data Analyst is the only role with auto-checked answers; other role responses are fully human-reviewed.
- Free-text answers are not auto-scored; they need human review (by design).
- Portfolio entries cannot be verified and links are not checked.
- Answer-key questions are fixed, so repeat candidates could share answers (future: varied scenarios).
- Accessibility basics are in place (labels, keyboard focus, `role="alert"` errors, responsive layout) but no formal audit or screen-reader testing has been done.
- No evidence yet of employment impact; the usability, rubric-clarity and fairness tests proposed in the project proposal are still to be run with real users.

## Future work

Supabase auth and shared records, file uploads with size limits, reviewer-agreement tracking, accessibility audit, and a small pilot comparing standard CV screening with CV + structured skill evidence.
