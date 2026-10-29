// ALL DATA BELOW IS FICTIONAL / SYNTHETIC. No real companies, candidates or results.
export const COMPANY = { name: 'CapeData Analytics (fictional)' }

export const ROLES = [
  { id: 'data-analyst', title: 'Junior Data Analyst', open: true, company: COMPANY.name, effort: '~45 minutes',
    summary: 'Analyse a small synthetic retail dataset, identify trends, describe two visualisations and recommend three actions.' },
  { id: 'business-analyst', title: 'Business Analyst', open: true, company: 'BrightPath Commerce (fictional)', effort: '~45 minutes',
    summary: 'Analyse a fictional order-approval process, identify a bottleneck and propose testable requirements.',
    challenge: {
      scenario: 'A fictional small retailer approves online orders manually. Staff copy order details into a spreadsheet, check stock by messaging the warehouse, then email customers. Approvals often take two days, and duplicate orders sometimes appear.',
      prompts: [
        { key: 'q1', label: 'Who are the key stakeholders, and what outcome should an improved process achieve?' },
        { key: 'q2', label: 'Describe the current process and identify its main bottleneck or risk.' },
        { key: 'q3', label: 'Propose two system or process requirements. Give each a measurable acceptance criterion.' },
      ],
      rubric: [
        { key: 'task', label: 'Requirements and acceptance criteria', weight: 30, mode: 'Human review' },
        { key: 'reasoning', label: 'Process analysis and problem definition', weight: 30, mode: 'Human review' },
        { key: 'communication', label: 'Stakeholder and user focus', weight: 20, mode: 'Human review' },
        { key: 'recommendations', label: 'Feasibility and prioritisation', weight: 20, mode: 'Human review' },
      ],
    } },
  { id: 'developer', title: 'Software Developer', open: true, company: 'Copperleaf Software Studio (fictional)', effort: '~45 minutes',
    summary: 'Design a small order-summary function, explain its edge cases and describe how you would test it.',
    challenge: {
      scenario: 'A fictional shop needs a function that receives a list of orders. Each order has an amount and a status. Return the number of completed orders and the total amount for completed orders only. You may answer in any programming language or clear pseudocode. Example: [{amount: 12, status: "complete"}, {amount: 8, status: "pending"}] should produce a count of 1 and a total of 12.',
      prompts: [
        { key: 'q1', label: 'Write the function or pseudocode that returns the completed-order count and total.' },
        { key: 'q2', label: 'Describe at least three useful tests, including an empty list and an edge case.' },
        { key: 'q3', label: 'Explain any assumptions you made and how you would keep the function readable and reliable.' },
      ],
      rubric: [
        { key: 'implementation', label: 'Correctness and implementation approach', weight: 40, mode: 'Human review' },
        { key: 'testing', label: 'Test coverage and edge cases', weight: 25, mode: 'Human review' },
        { key: 'reasoning', label: 'Technical reasoning', weight: 20, mode: 'Human review' },
        { key: 'communication', label: 'Clarity and maintainability', weight: 15, mode: 'Human review' },
      ],
    } },
  { id: 'cyber', title: 'Cybersecurity Analyst', open: true, company: 'Sentinel Ridge Security (fictional)', effort: '~45 minutes',
    summary: 'Triage a simulated suspicious-login alert and recommend safe containment and follow-up actions.',
    challenge: {
      scenario: 'In a fictional training environment, an employee reports an unexpected sign-in notification. The alert shows several failed sign-ins followed by one successful sign-in from an unfamiliar location. No other evidence is available yet. Treat this as a defensive tabletop exercise; do not access real systems.',
      prompts: [
        { key: 'q1', label: 'How would you assess and prioritise this alert? What would you verify first?' },
        { key: 'q2', label: 'What immediate, proportionate containment steps would you recommend, and who should be involved?' },
        { key: 'q3', label: 'What evidence would you preserve, and what follow-up or prevention steps would you propose?' },
      ],
      rubric: [
        { key: 'triage', label: 'Alert triage and risk prioritisation', weight: 30, mode: 'Human review' },
        { key: 'containment', label: 'Safe and proportionate containment', weight: 30, mode: 'Human review' },
        { key: 'evidence', label: 'Evidence handling and follow-up', weight: 20, mode: 'Human review' },
        { key: 'communication', label: 'Clear escalation and communication', weight: 20, mode: 'Human review' },
      ],
    } },
  { id: 'it-support', title: 'IT Support Analyst', open: true, company: 'Harborlight IT Services (fictional)', effort: '~45 minutes',
    summary: 'Troubleshoot a simulated shared-folder access problem and explain the resolution to a user.',
    challenge: {
      scenario: 'A fictional employee says they can no longer open the team shared folder after changing their password this morning. They can still sign in to their computer, and one colleague can access the folder. You are helping remotely and should avoid asking for the employee’s password.',
      prompts: [
        { key: 'q1', label: 'What clarifying questions would you ask, and what would you check first?' },
        { key: 'q2', label: 'Give a safe, ordered troubleshooting plan. Explain how you would narrow down the cause.' },
        { key: 'q3', label: 'Describe a likely resolution, how you would confirm it worked, and what you would tell the user.' },
      ],
      rubric: [
        { key: 'diagnosis', label: 'Diagnostic questions and problem isolation', weight: 30, mode: 'Human review' },
        { key: 'troubleshooting', label: 'Safe and systematic troubleshooting', weight: 30, mode: 'Human review' },
        { key: 'resolution', label: 'Verification and resolution quality', weight: 25, mode: 'Human review' },
        { key: 'communication', label: 'User-focused communication', weight: 15, mode: 'Human review' },
      ],
    } },
]

export const REGIONS = ['North', 'South', 'West']
// Monthly sales in R thousands (synthetic)
export const SALES = [
  { month: 'Jan', North: 120, South: 95, West: 80 },
  { month: 'Feb', North: 132, South: 90, West: 86 },
  { month: 'Mar', North: 128, South: 102, West: 91 },
  { month: 'Apr', North: 141, South: 98, West: 104 },
  { month: 'May', North: 150, South: 105, West: 118 },
  { month: 'Jun', North: 158, South: 99, West: 131 },
]

export const STATUSES = ['Under Review', 'Shortlisted', 'Interview', 'Not Progressing']

// Seeded sample candidates – clearly labelled as illustrative in the UI.
export const SEED = {
  subs: [
    { id: 's1', candidate: 'Thandi M. (sample)', roleId: 'data-analyst', seeded: true,
      answers: { q1: '829', q2: 'North', q3: 'Jan' },
      analysis: 'North leads every month, and West grows fastest (80 to 131). South is flat and may need attention.',
      visuals: '1) Line chart of monthly sales per region to show growth. 2) Bar chart of 6-month totals per region.',
      recs: '1) Investigate why South is flat. 2) Replicate West growth tactics. 3) Protect North stock levels.',
      ratings: { reasoning: 4, visual: 4, recs: 3 }, ratingSource: 'illustrative', status: 'Under Review', notes: '' },
    { id: 's2', candidate: 'Sipho K. (sample)', roleId: 'data-analyst', seeded: true,
      answers: { q1: '792', q2: 'North', q3: 'Feb' },
      analysis: 'North is biggest. Sales seem to go up over time.',
      visuals: 'A pie chart of regions.',
      recs: '1) Sell more. 2) Advertise. 3) Hire staff.',
      ratings: null, ratingSource: null, status: 'Under Review', notes: '' },
  ],
  ports: [
    { id: 'p1', owner: 'Thandi M. (sample)', title: 'Taxi route dashboard', link: 'https://github.com/example/taxi-dashboard',
      tech: 'Python, Pandas, Plotly', contribution: 'Built the data cleaning pipeline and two charts (group project of 4).' },
    { id: 'p2', owner: 'Sipho K. (sample)', title: 'Student budget tracker', link: '',
      tech: 'Excel', contribution: 'Solo project; designed the workbook and formulas.' },
  ],
}
