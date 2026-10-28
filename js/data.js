/* data.js  */

const SEED_EVENTS = [
  {
    id: 'evt-001',
    title: 'Finish Your Semester Well - SCSIT First Year Student Learning Workshop',
    course: 'SCSIT First Year Student Learning',
    category: 'Academic',
    date: '2026-10-07',
    time: '10:00',
    mode: 'Face-to-face',
    location: 'City East Campus, Barr Smith South 2052, Flat Floor Teaching 2 space',
    description: 'A workshop walking through tips and tricks for managing your time as you work towards major assessments and final exams. Attendees finish the session with an actionable plan for managing their learning and finishing the semester strong.',
    notes: 'RSVP was required by Friday 2 October for catering. Four $50 vouchers were drawn in a raffle on the day.',
    recommended: true
  },
  {
    id: 'evt-002',
    title: 'INFO 1012 Practical Exam Revision Session',
    course: 'INFO 1012 Information Technology Systems',
    category: 'Academic',
    date: '2026-11-09',
    time: '14:00',
    mode: 'Face-to-face',
    location: 'North Terrace Campus, Ingkarni Wardli B17',
    description: 'A revision session covering the whole course ahead of the practical exam: number representations, operating systems, web technologies and the TCP/IP model. Bring questions from the weekly studios.',
    notes: 'The practical exam carries a 50% hurdle, so this one is worth turning up to.',
    recommended: true
  },
  {
    id: 'evt-003',
    title: 'Computer Science Club Game Jam',
    course: '',
    category: 'Social',
    date: '2026-11-14',
    time: '17:30',
    mode: 'Face-to-face',
    location: 'North Terrace Campus, Hub Central Level 4',
    description: 'A 24-hour game jam run by the Computer Science Club. Teams of up to four build a small game from a theme announced on the night. Beginners are welcome and there is a separate first-year prize.',
    notes: 'Bring a laptop and a power board. Pizza provided at 8pm.',
    recommended: false
  },
  {
    id: 'evt-004',
    title: 'Tech Industry Careers Night',
    course: '',
    category: 'Careers',
    date: '2026-11-19',
    time: '18:00',
    mode: 'Face-to-face',
    location: 'National Wine Centre, Hackney Road',
    description: 'An evening connecting computer science and IT students with local employers. Short talks from graduates in their first year of work, followed by open networking with recruiters from Adelaide software and defence companies.',
    notes: 'Business casual. Bring printed copies of your CV.',
    recommended: false
  },
  {
    id: 'evt-005',
    title: 'Social Sport: Wednesday Indoor Soccer',
    course: '',
    category: 'Sports',
    date: '2026-11-04',
    time: '19:00',
    mode: 'Face-to-face',
    location: 'Adelaide University Sports Association, Park 10 Courts',
    description: 'Weekly mixed indoor soccer run through the Sports Association. Teams are drawn on the night so you can come without a team, and no previous experience is expected.',
    notes: 'Registration is per semester. Wear indoor court shoes.',
    recommended: false
  },
  {
    id: 'evt-006',
    title: 'International Student Welcome Festival',
    course: '',
    category: 'Cultural',
    date: '2027-02-23',
    time: '11:00',
    mode: 'Face-to-face',
    location: 'North Terrace Campus, Barr Smith Lawns',
    description: 'A festival opening the new academic year with food stalls, performances and information stands from cultural societies across the university. A good first stop for meeting people outside your own degree.',
    notes: 'Runs across the whole day; societies take sign-ups at their stalls.',
    recommended: false
  },
  {
    id: 'evt-007',
    title: 'Introduction to Git and GitHub for First Years',
    course: 'SCSIT Student Learning',
    category: 'Academic',
    date: '2026-11-11',
    time: '13:00',
    mode: 'Online',
    location: 'Online via Microsoft Teams',
    description: 'A hands-on session covering version control basics: repositories, commits, branches, and pushing work to a remote on GitHub. Aimed at students who have used GitHub Classroom but are not confident with the command line.',
    notes: 'A recording is made available afterwards on MyUni.',
    recommended: false
  }
];

/* The categories offered in the filter dropdown and the create form.
   Keeping this in one array means the two dropdowns can never disagree. */
const EVENT_CATEGORIES = ['Academic', 'Careers', 'Cultural', 'Social', 'Sports'];

/* The two delivery modes the brief asks for. */
const EVENT_MODES = ['Face-to-face', 'Online'];
