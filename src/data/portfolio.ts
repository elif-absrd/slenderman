export const PERSONAL = {
  name: 'VINAY LUNAWAT',
  petname: 'elif_absrd',
  role: 'Systems Programmer · CSE @ JKLU',
  email: 'lunawatvinay8@gmail.com',
  linkedin: 'https://linkedin.com/in/vinay-lunawat-944a93287/',
  github: 'https://github.com/elif-absrd',
  location: 'Jaipur, Rajasthan, IN',
  bio: `I am something of an engineering student myself, I prefer using technology to build fun, interactive digital projects. I also occasionally experiment with game development and learning algorithms. Outside of the coding world, I love staring at those starry stars, space and hooping on the basketball court.`,
};

export const SKILLS = [
  {
    category: 'Languages',
    items: [
      { name: 'Rust', hot: true },
      { name: 'C', hot: true },
      { name: 'C++', hot: true },
      { name: 'Python', hot: true },
      { name: 'JavaScript', hot: false },
      { name: 'SQL', hot: false },
      { name: 'HTML/CSS', hot: false },
    ],
  },
  {
    category: 'Frameworks',
    items: [
      { name: 'React', hot: true },
      { name: 'Next.js', hot: false },
      { name: 'Node.js', hot: false },
      { name: 'Flask', hot: false },
      { name: 'Tailwind CSS', hot: false },
      { name: 'Flutter', hot: false },
    ],
  },
  {
    category: 'Data / ML',
    items: [
      { name: 'NumPy', hot: true },
      { name: 'Pandas', hot: true },
      { name: 'Matplotlib', hot: false },
      { name: 'YOLO Pose', hot: false },
    ],
  },
  {
    category: 'Infrastructure',
    items: [
      { name: 'Linux', hot: true },
      { name: 'Docker', hot: true },
      { name: 'MySQL', hot: false },
      { name: 'Aiven', hot: false },
      { name: 'GitHub', hot: false },
      { name: 'Grafana', hot: false },
    ],
  },
  {
    category: 'Experimental',
    items: [
      { name: 'IBM Quantum', hot: false },
      { name: 'UART / ATAGS', hot: false },
      { name: 'Kernel Dev', hot: true },
    ],
  },
];

export const PROJECTS = [
  {
    id: '01',
    name: 'Custom OS Kernel',
    period: 'Low-level Systems',
    stack: ['Rust', 'UART', 'ATAGS', 'Panic Abstractions'],
    description:
      'Programmed a modular OS kernel from scratch. Implemented custom concurrent thread primitives, explicit hardware memory management architectures, UART I/O, and panic abstractions. No HAL. No shortcuts. Pure bare-metal control.',
  },
  {
    id: '02',
    name: 'NOC Video Stream Monitor',
    period: 'Real-time Infrastructure',
    stack: ['Next.js', 'React', 'Grafana', 'Log Pipelines'],
    description:
      'Multi-stream configurable real-time tracking interface designed for Network Operations Centers. Structured granular log pipelines with integrated Grafana dashboard aggregators. Built for operational pressure, not demos.',
  },
  {
    id: '03',
    name: 'Automated Attendance Platform',
    period: 'Computer Vision',
    stack: ['Flask', 'MySQL', 'YOLO', 'Face Recognition'],
    description:
      'Contactless biometric tracking using real-time face recognition loops paired with YOLO spatial pose detection models. Replaced manual attendance entirely. Zero physical contact required.',
  },
  {
    id: '04',
    name: 'Disaster Fatality Statistical Engine',
    period: 'Data Analysis',
    stack: ['Python', 'Pandas', 'NumPy', 'Matplotlib', 'Excel'],
    description:
      'Compiled extensive datasets of historical natural disaster casualties. Modeled predictive mathematical trends, mapped regional risk variables, and generated visualization reports for proactive disaster contingency analysis.',
  },
];

export const MILESTONES = [
  {
    tag: 'Experience',
    title: 'Software / Technical Intern',
    desc: 'Solviser · Production engineering work, not coffee runs.',
  },
  {
    tag: 'Competition',
    title: 'ICPC Regional 2024',
    desc: 'International Collegiate Programming Contest · Regional Contestant. One of the hardest rooms in competitive programming.',
  },
  {
    tag: 'Leadership',
    title: 'Robotics Club Chair',
    desc: 'Official Robotics Club, JKLU · Running the club, not just attending it.',
  },
  {
    tag: 'Leadership',
    title: 'Lead IT Coordinator · HackJKLU',
    desc: 'MSI Hackathon V3.0 (2024) · Full technical infrastructure and operations for a large-scale hackathon.',
  },
  {
    tag: 'Global Program',
    title: 'Circular Campus Program (ASIA)',
    desc: 'Asia-wide sustainability initiative · Participant and contributor.',
  },
  {
    tag: 'Community',
    title: 'YP Foundation',
    desc: 'Active Member · Social impact and community development programs.',
  },
];

export const NAV_ITEMS = [
  { id: 'hero', label: 'INIT', num: '00' },
  { id: 'skills', label: 'SKILLS', num: '01' },
  { id: 'projects', label: 'PROJECTS', num: '02' },
  { id: 'milestones', label: 'MILESTONES', num: '03' },
];

export const BOOT_LINES: { text: string; type: 'amber' | 'green' | 'white' | 'muted' }[] = [
  { text: 'VINAY_OS v1.0.0 — Kernel init sequence', type: 'amber' },
  { text: 'Loading ELF binary...                   [ OK ]', type: 'muted' },
  { text: 'Mounting /proc/vinay...                 [ OK ]', type: 'muted' },
  { text: 'ATAGS parsed: 4GB addressable RAM...    [ OK ]', type: 'muted' },
  { text: 'UART console attached at 115200 baud... [ OK ]', type: 'muted' },
  { text: 'Thread primitives initialized...        [ OK ]', type: 'muted' },
  { text: 'Loading process table:', type: 'white' },
  { text: '  PID 0002  SKILLS       running     core_tech', type: 'muted' },
  { text: '  PID 0003  PROJECTS     running     rs/py/js', type: 'muted' },
  { text: '  PID 0004  ICPC_2024    zombie      competitive', type: 'muted' },
  { text: '  PID 1337  PORTFOLIO    active      ████████', type: 'amber' },
  { text: '', type: 'muted' },
  { text: 'Boot sequence complete. System ready.', type: 'green' },
];
