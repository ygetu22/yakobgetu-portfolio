export const contactLinks = [
  { label: "ygetu21@gmail.com", href: "mailto:ygetu21@gmail.com", external: false },
  { label: "LinkedIn", href: "https://linkedin.com/in/ygetu/", external: true },
  { label: "GitHub", href: "https://github.com/ygetu22", external: true },
];

export const education = {
  institution: "The Ohio State University",
  degree: "B.S. Computer Science and Engineering",
  concentration: "Software Engineering",
  location: "Columbus, OH",
  date: "Expected May 2027",
  coursework: "Software Development and Design, Data Structures and Algorithms, Algorithm Design and Analysis",
  honors: [
    "Amazon Future Engineer Scholar — one of 400 recipients in the U.S.",
    "Choose Ohio First Scholar",
    "Dean's List (4×)",
  ],
};

export const experience: TimelineEntry[] = [
  {
    id: "jpmc-2026",
    shortName: "JPMorgan Chase ’26",
    name: "JPMorgan Chase & Co.",
    role: "Software Engineering Intern",
    location: "Columbus, OH",
    date: "Jun 2026 – Aug 2026",
    stack: ["Playwright", "Gherkin", "BDD", "CI/CD"],
    bullets: [
      "Authored 200+ Playwright regression scenarios for the first 2 of 12 planned core user flows.",
      "Wrote the scenarios in Gherkin BDD so QA and product partners could review the expected behavior.",
      "Submitted the scenarios through pull requests and prepared the suite for CI/CD pipeline integration.",
    ],
  },
  {
    id: "jpmc-2025",
    shortName: "JPMorgan Chase ’25",
    name: "JPMorgan Chase & Co.",
    role: "Software Engineering Intern",
    location: "Columbus, OH",
    date: "Jun 2025 – Aug 2025",
    stack: ["React", "TypeScript", "Spring Boot", "Java", "JUnit", "Jest"],
    bullets: [
      "Rebuilt the internal employee directory in React and TypeScript, splitting the interface into reusable components.",
      "Built Java/Spring Boot REST endpoints for phonebook search and profile updates, wiring them into React.",
      "Added loading and error handling and wrote JUnit and Jest tests for the new endpoints and components.",
    ],
  },
  {
    id: "amazon-2024",
    shortName: "Amazon ’24",
    name: "Amazon Devices",
    role: "Software Development Engineer Intern",
    location: "Seattle, WA",
    date: "May 2024 – Aug 2024",
    stack: ["Java", "AWS", "CDK", "Brazil", "CI/CD", "Microservices"],
    bullets: [
      "Helped migrate the Devices Sales Page's post-purchase carousel to a microservice architecture.",
      "Built 3 core service packages in Java on AWS powering customer-facing post-purchase features.",
      "Set up an independent AWS CDK deployment pipeline for the new services, enabling zero-downtime releases.",
      "Added CloudWatch dashboards and alerts on latency and error rates, cutting time spent triaging issues.",
      "Guarded new services behind runtime flags with fallbacks, so releases rolled back without a redeploy.",
    ],
  },
];

export const skillGroups = [
  { label: "Languages", items: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "HTML/CSS", "Bash", "LaTeX"] },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "Express", "Spring Boot"] },
  { label: "Cloud & DevOps", items: ["AWS", "CDK", "Brazil", "Git", "CI/CD"] },
  { label: "Testing & Data", items: ["Playwright", "Gherkin", "Jest", "JUnit", "MongoDB"] },
  { label: "AI & Developer Tools", items: ["FastMCP", "MCP", "LLM APIs", "Claude Code", "Codex"] },
];

// Skills I used in places whose listed stack doesn't name them (this site isn't a listed
// project, and a project's stack lists its main tools only). Shown next to each skill.
export const otherSkillUses = [
  { label: "This site", stack: ["Next.js", "React", "TypeScript", "Tailwind CSS", "HTML/CSS", "Git", "Claude Code", "Codex"] },
  { label: "Fruitful", stack: ["SQL", "Git", "Claude Code", "Codex"] },
  { label: "Trace", stack: ["Git", "Claude Code", "Codex"] },
  { label: "Gradient", stack: ["JavaScript", "HTML/CSS", "Git"] },
];

export const leadership: TimelineEntry[] = [
  {
    id: "codepath",
    name: "CodePath Technical Interview Prep",
    role: "Career Preparation Fellow",
    location: "Remote",
    date: "Feb 2025 – Present",
    bullets: [
      "Selected for a competitive national course focused on Python-based technical interviews.",
      "Solve data structures and algorithms problems weekly, sharpening debugging and peer review skills.",
    ],
  },
  {
    id: "mlt",
    name: "Management Leadership for Tomorrow",
    role: "Career Preparation Fellow",
    location: "Washington, DC",
    date: "Nov 2024 – Present",
    bullets: [
      "Selected from thousands for an 18-month program led by Deloitte, LinkedIn, and Bloomberg.",
      "Completed business case studies and cohort projects strengthening leadership and communication.",
    ],
  },
  {
    id: "dev-osu",
    name: "DEV at The Ohio State University",
    role: "Project Manager",
    location: "Columbus, OH",
    date: "Aug 2023 – May 2024",
    bullets: [
      "Led a team of 6 engineers and designers building software for the Ohio State community.",
      "Ran sprint planning and translated the roadmap into two-week cycles with clear owners and deadlines.",
      "Scoped requirements with club stakeholders and demoed working builds at the end of each cycle.",
    ],
  },
  {
    id: "wow",
    name: "Wonder of Our World",
    role: "Outreach Volunteer, OSU College of Engineering",
    location: "Columbus, OH",
    date: "Sep 2023 – Mar 2024",
    bullets: [
      "Taught hands-on science lessons to 15+ elementary students through OSU's Honors & Scholars outreach program.",
    ],
  },
];

export type TimelineEntry = {
  // Used in links such as /#entry-jpmc-2026.
  id: string;
  // Short label used where space is tight, e.g. next to a skill ("JPMorgan Chase ’26").
  shortName?: string;
  name: string;
  role: string;
  location: string;
  date: string;
  stack?: string[];
  bullets: string[];
};
