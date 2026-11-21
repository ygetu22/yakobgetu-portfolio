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
      "Wrote 200+ Playwright regression scenarios covering the first 2 of 12 planned core user flows.",
      "Wrote them in Gherkin (BDD) so QA and product partners could read and review the expected behavior.",
      "Opened pull requests for team review and helped get the suite ready to run in the CI/CD pipeline.",
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
      "Worked on the existing internal employee directory, adding features and design updates in React and TypeScript.",
      "Added Java/Spring Boot endpoints for phonebook search and profile updates and connected them to the front end.",
      "Added loading and error states, and wrote JUnit and Jest tests for the code I worked on.",
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
      "Helped move the Devices Sales Page's post-purchase carousel to a microservice architecture.",
      "Worked on 3 Java service packages on AWS behind customer-facing post-purchase features.",
      "Set up an AWS CDK pipeline so the new services could deploy on their own.",
      "Added CloudWatch dashboards and alarms for latency and errors to make problems easier to spot.",
      "Put new features behind runtime flags with fallbacks so they could be switched off without a redeploy.",
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
  // My resume itself is written in LaTeX.
  { label: "My resume", stack: ["LaTeX"] },
  // Used in school and my own work, but not in anything shown on this site.
  { label: "Work outside this site", stack: ["Bash", "LLM APIs"] },
];

export const leadership: TimelineEntry[] = [
  {
    id: "codepath",
    name: "CodePath Technical Interview Prep",
    role: "Career Preparation Fellow",
    location: "Remote",
    date: "Feb 2025 – Present",
    bullets: [
      "Practicing data structures and algorithms in Python each week through CodePath's interview prep course, and reviewing other students' solutions.",
    ],
  },
  {
    id: "mlt",
    name: "Management Leadership for Tomorrow",
    role: "Career Preparation Fellow",
    location: "Washington, DC",
    date: "Nov 2024 – Present",
    bullets: [
      "Part of MLT Career Prep, an 18-month program with coaching, business case studies and cohort projects.",
    ],
  },
  {
    id: "dev-osu",
    name: "DEV at The Ohio State University",
    role: "Project Manager",
    location: "Columbus, OH",
    date: "Aug 2023 – May 2024",
    bullets: [
      "Managed a team of 6 student engineers and designers building software for Ohio State clubs.",
      "Ran two-week sprints, kept track of who owned what, and demoed progress to the clubs at the end of each cycle.",
    ],
  },
  {
    id: "wow",
    name: "Wonder of Our World",
    role: "Outreach Volunteer, OSU College of Engineering",
    location: "Columbus, OH",
    date: "Sep 2023 – Mar 2024",
    bullets: [
      "Helped run hands-on science activities for elementary students through OSU's Honors & Scholars outreach.",
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
