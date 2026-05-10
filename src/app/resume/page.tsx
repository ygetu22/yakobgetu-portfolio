import type { ReactNode } from "react";

const contactLinks = [
  { label: "ygetu21@gmail.com", href: "mailto:ygetu21@gmail.com", external: false },
  { label: "linkedin.com/in/ygetu", href: "https://linkedin.com/in/ygetu/", external: true },
  { label: "github.com/ygetu22", href: "https://github.com/ygetu22", external: true },
];

const education = {
  institution: "The Ohio State University",
  degree: "B.S. Computer Science and Engineering",
  concentration: "Software Engineering",
  location: "Columbus, OH",
  date: "Expected May 2027",
  coursework:
    "Software Development and Design, Data Structures and Algorithms, Algorithm Design and Analysis",
  honors: [
    "Amazon Future Engineer Scholar — one of 400 recipients in the U.S.",
    "Choose Ohio First Scholar",
    "Dean's List (3×)",
  ],
};

const experience: ExperienceEntry[] = [
  {
    name: "JPMorgan Chase & Co.",
    role: "Software Engineering Intern",
    location: "Columbus, OH",
    date: "Summer 2026",
    badge: "Returning",
    stack: [],
    bullets: [
      "Returning for a second summer of software engineering at JPMorgan Chase.",
      "Building on previous experience shipping internal tools, backend services, and test-backed product improvements.",
    ],
  },
  {
    name: "JPMorgan Chase & Co.",
    role: "Software Engineering Intern",
    location: "Columbus, OH",
    date: "Jun 2025 – Jul 2025",
    stack: ["React", "TypeScript", "Spring Boot", "Java", "JUnit", "Jest"],
    bullets: [
      "Modernized an internal employee directory app with React and TypeScript, cutting average page load time.",
      "Implemented backend services with Spring Boot and Java, adding REST endpoints for phonebook search and updates.",
      "Built JUnit and Jest test suites that pushed line coverage above 90% and improved release confidence.",
    ],
  },
  {
    name: "Amazon Devices",
    role: "Software Development Engineer Intern",
    location: "Seattle, WA",
    date: "May 2024 – Aug 2024",
    stack: ["Java", "AWS", "Microservices"],
    bullets: [
      "Migrated Amazon's Devices Sales Page toward a microservice architecture, improving performance by 80%.",
      "Developed three core service packages with Java and AWS, increasing backend efficiency by 50%.",
      "Built an independent deployment pipeline enabling zero-downtime releases.",
      "Created dashboards and alerts for real-time visibility into performance metrics.",
    ],
  },
];

const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "Java", "JavaScript", "TypeScript", "SQL", "HTML/CSS", "Bash", "LaTeX"],
  },
  { label: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
  { label: "Backend", items: ["Node.js", "Express", "Spring Boot"] },
  { label: "Cloud & DevOps", items: ["AWS", "Azure", "Docker", "CDK", "Git", "Linux"] },
  { label: "Testing & Data", items: ["Jest", "JUnit", "MySQL"] },
];

const leadership: LeadershipEntry[] = [
  {
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
    name: "Management Leadership for Tomorrow (MLT)",
    role: "Career Preparation Fellow",
    location: "Washington, DC",
    date: "Nov 2024 – Present",
    bullets: [
      "Selected from thousands for an 18-month program led by Deloitte, LinkedIn, and Bloomberg.",
      "Completed business case studies and cohort projects strengthening leadership and communication.",
    ],
  },
  {
    name: "DEV at The Ohio State University",
    role: "Project Manager",
    location: "Columbus, OH",
    date: "Aug 2023 – May 2024",
    bullets: [
      "Led a team of 6 engineers and designers building software for the Ohio State community.",
      "Managed timelines, delegated work, and coordinated with stakeholders for 360+ members.",
    ],
  },
];

type ExperienceEntry = {
  name: string;
  role: string;
  location: string;
  date: string;
  badge?: string;
  stack: string[];
  bullets: string[];
};

type LeadershipEntry = {
  name: string;
  role: string;
  location: string;
  date: string;
  bullets: string[];
};

function SectionHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.26em] text-foreground/40">
        {title}
      </span>
      <div className="h-px flex-1 bg-black/10 dark:bg-white/10" />
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5 text-sm leading-relaxed text-foreground/68">
          <span className="mt-[7px] h-1 w-1 shrink-0 rounded-full bg-foreground/25" />
          {item}
        </li>
      ))}
    </ul>
  );
}

function EntryHeader({
  name,
  role,
  date,
  location,
  badge,
  children,
}: {
  name: string;
  role: string;
  date?: string;
  location?: string;
  badge?: string;
  children?: ReactNode;
}) {
  const meta = [date, location].filter(Boolean).join(" · ");

  return (
    <div className="mb-3">
      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-1 mb-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm font-semibold">{name}</span>
          {badge && (
            <span className="rounded-full border border-emerald-600/25 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-emerald-700 dark:border-emerald-400/20 dark:bg-emerald-950/40 dark:text-emerald-400">
              {badge}
            </span>
          )}
        </div>
        {meta && (
          <span className="shrink-0 text-xs text-foreground/42">{meta}</span>
        )}
      </div>
      <p className="text-sm text-foreground/52">{role}</p>
      {children}
    </div>
  );
}

function StackTags({ items }: { items: string[] }) {
  if (!items.length) return null;
  return (
    <div className="flex flex-wrap gap-1.5 mb-3">
      {items.map((tag) => (
        <span
          key={tag}
          className="rounded-full border border-black/10 dark:border-white/10 px-2.5 py-0.5 text-[11px] text-foreground/52"
        >
          {tag}
        </span>
      ))}
    </div>
  );
}

function DownloadIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden
      className="h-3.5 w-3.5"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 5v11" />
      <path d="M7 12l5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-12 md:px-6 md:py-16">
      <header className="mb-12">
        <div className="flex flex-wrap items-start justify-between gap-4 mb-2">
          <h1 className="text-4xl font-semibold tracking-tight">Yakob Getu</h1>
          <a
            href="/yakob_resume_cse.pdf"
            download
            className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-black/15 dark:border-white/15 px-4 py-2 text-xs font-medium text-foreground/60 transition-colors hover:border-black/30 hover:text-foreground dark:hover:border-white/30 dark:hover:text-foreground"
          >
            <DownloadIcon />
            Download PDF
          </a>
        </div>
        <p className="mb-5 text-sm text-foreground/50">
          Computer Science &amp; Engineering · The Ohio State University · Incoming SWE Intern @ JPMorgan Chase
        </p>
        <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
          {contactLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target={link.external ? "_blank" : undefined}
              rel={link.external ? "noreferrer" : undefined}
              className="text-foreground/52 underline underline-offset-4 decoration-foreground/20 transition-colors hover:text-foreground hover:decoration-foreground/50"
            >
              {link.label}
            </a>
          ))}
        </div>
      </header>

      <div className="space-y-11">
        <section>
          <SectionHeader title="Education" />
          <EntryHeader
            name={education.institution}
            role={education.degree}
            date={education.date}
            location={education.location}
          >
            <div className="mt-3 space-y-3">
              <BulletList items={education.honors} />
              <p className="text-xs text-foreground/40 leading-relaxed">
                <span className="font-medium">Concentration:</span> {education.concentration}
                &ensp;·&ensp;
                <span className="font-medium">Relevant coursework:</span> {education.coursework}
              </p>
            </div>
          </EntryHeader>
        </section>

        <section>
          <SectionHeader title="Experience" />
          <div className="space-y-8">
            {experience.map((exp, i) => (
              <div key={`${exp.name}-${i}`}>
                <EntryHeader
                  name={exp.name}
                  role={exp.role}
                  date={exp.date}
                  location={exp.location}
                  badge={exp.badge}
                />
                <StackTags items={exp.stack} />
                <BulletList items={exp.bullets} />
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Skills" />
          <div className="space-y-2.5">
            {skillGroups.map((group) => (
              <div
                key={group.label}
                className="grid grid-cols-[6.5rem_1fr] gap-x-4 text-sm"
              >
                <span className="text-foreground/42 font-medium">{group.label}</span>
                <span className="text-foreground/72">{group.items.join(", ")}</span>
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionHeader title="Leadership" />
          <div className="space-y-8">
            {leadership.map((entry, i) => (
              <div key={`${entry.name}-${i}`}>
                <EntryHeader
                  name={entry.name}
                  role={entry.role}
                  date={entry.date}
                  location={entry.location}
                />
                <BulletList items={entry.bullets} />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
