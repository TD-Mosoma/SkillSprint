// ALL DATA BELOW IS FICTIONAL / SYNTHETIC. No real companies, candidates or results.
export const COMPANY = { name: 'CapeData Analytics (fictional)' }

export const ROLES = [
  { id: 'data-analyst', title: 'Junior Data Analyst', open: true, company: COMPANY.name, effort: '~45 minutes',
    summary: 'Analyse a small synthetic retail dataset, identify trends, describe two visualisations and recommend three actions.' },
  { id: 'business-analyst', title: 'Business Analyst', open: false, company: 'Sample employer (fictional)', effort: 'Catalogue only',
    summary: 'Map a process, identify a problem and propose requirements or improvements.' },
  { id: 'developer', title: 'Software Developer', open: false, company: 'Sample employer (fictional)', effort: 'Catalogue only',
    summary: 'Complete a small coding, debugging or code-reading task.' },
  { id: 'cyber', title: 'Cybersecurity Analyst', open: false, company: 'Sample employer (fictional)', effort: 'Catalogue only',
    summary: 'Assess a simulated security incident, prioritise risks and recommend defensive actions.' },
  { id: 'it-support', title: 'IT Support Analyst', open: false, company: 'Sample employer (fictional)', effort: 'Catalogue only',
    summary: 'Troubleshoot a simulated user/system issue and document a clear resolution.' },
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
