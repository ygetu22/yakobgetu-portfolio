import Image from "next/image";
import Link from "next/link";

type LogoKind = "osu" | "jpmc" | "amazon" | "codepath";

const sectionLinks = [
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#leadership", label: "Leadership" },
];

const logoStrip: { kind: LogoKind; label: string }[] = [
  { kind: "osu", label: "Ohio State" },
  { kind: "jpmc", label: "JPMorgan Chase" },
  { kind: "amazon", label: "Amazon Devices" },
  { kind: "codepath", label: "CodePath" },
];

const experienceEntries = [
  {
    kind: "jpmc" as const,
    status: "Incoming",
    title: "Software Engineering Intern",
    company: "JPMorgan Chase & Co.",
    location: "Summer 2026",
    date: "Upcoming",
    stack: ["Returning intern", "Enterprise systems", "Full-stack engineering"],
    bullets: [
      "Returning to JPMorgan Chase & Co. for another summer of software engineering work.",
      "Building on previous experience shipping internal tools, backend services, and test-backed product improvements.",
    ],
  },
  {
    kind: "jpmc" as const,
    status: "Completed",
    title: "Software Engineering Intern",
    company: "JPMorgan Chase & Co.",
    location: "Columbus, OH",
    date: "June 2025 - July 2025",
    stack: ["React", "TypeScript", "Spring Boot", "Java", "JUnit", "Jest"],
    bullets: [
      "Modernized an internal employee directory app with React and TypeScript, refactoring key UI components to reduce average page load time.",
      "Implemented backend services with Spring Boot and Java, adding REST endpoints for phonebook search and updates.",
      "Built JUnit and Jest test suites that pushed line coverage above 90% and improved release confidence.",
      "Delivered cleaner components, more predictable APIs, and smoother employee lookup workflows across the organization.",
    ],
  },
  {
    kind: "amazon" as const,
    status: "Completed",
    title: "Software Development Engineer Intern",
    company: "Amazon Devices",
    location: "Seattle, WA",
    date: "May 2024 - Aug 2024",
    stack: ["Java", "AWS", "Microservices", "Deployments", "Dashboards"],
    bullets: [
      "Migrated Amazon's Devices Sales Page toward a microservice architecture, improving performance by 80%.",
      "Developed three core service packages with Java and AWS, increasing backend efficiency by 50%.",
      "Built an independent deployment pipeline that enabled zero-downtime releases.",
      "Created dashboards and alerts for real-time visibility, helping the team debug faster and track performance more clearly.",
    ],
  },
];

const skillGroups = [
  {
    label: "Languages",
    items: ["Python", "Java", "JavaScript", "TypeScript", "HTML/CSS", "SQL", "Bash", "LaTeX"],
  },
  {
    label: "Web",
    items: ["React", "Next.js", "Node.js", "Express", "Spring Boot", "Tailwind CSS", "MERN Stack"],
  },
  {
    label: "Cloud + DevOps",
    items: ["AWS", "Azure", "Docker", "Git", "Linux", "SSH", "APIs", "CDK"],
  },
  {
    label: "Testing + Workflow",
    items: ["MySQL", "Excel", "Vim", "Jest", "JUnit"],
  },
];

const leadershipEntries = [
  {
    mark: "CP",
    title: "Career Preparation Fellow",
    organization: "CodePath Technical Interview Prep",
    location: "Washington, DC",
    date: "Feb 2025 - Present",
    bullets: [
      "Selected for a competitive national course focused on Python-based technical interviews.",
      "Solve data structures and algorithms problems weekly while sharpening debugging, whiteboarding, and peer review skills.",
    ],
  },
  {
    mark: "MLT",
    title: "Career Preparation Fellow",
    organization: "Management Leadership for Tomorrow",
    location: "Washington, DC",
    date: "Nov 2024 - Present",
    bullets: [
      "Selected from thousands for an 18-month career preparation program led by Deloitte, LinkedIn, and Bloomberg.",
      "Completed business case studies and cohort projects that strengthened leadership and professional communication.",
    ],
  },
  {
    mark: "DEV",
    title: "Project Manager",
    organization: "DEV at The Ohio State University",
    location: "Columbus, OH",
    date: "Aug 2023 - May 2024",
    bullets: [
      "Led a team of 6 engineers and designers building software for the Ohio State community.",
      "Managed timelines, delegated work, and kept milestones moving while coordinating with stakeholders.",
      "Helped shape solutions around real user needs for a community of more than 360 members.",
    ],
  },
];

function ArrowDownIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      className="h-4 w-4"
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

const badgeClass =
  "inline-flex items-center gap-2 rounded-full border border-black/10 bg-background/90 px-3 py-2 text-sm font-medium dark:border-white/10 dark:bg-black/40";

function LogoBadge({ kind, label }: { kind: LogoKind; label: string }) {
  if (kind === "jpmc") {
    return (
      <div className="inline-flex items-center rounded-full border border-black/10 bg-background/90 px-3 py-2 dark:border-white/10 dark:bg-black/40">
        <Image
          src="/chaseLogo.png"
          alt={label}
          width={118}
          height={28}
          className="h-6 w-auto object-contain"
        />
      </div>
    );
  }

  if (kind === "amazon") {
    return (
      <div className={badgeClass}>
        <span className="text-base font-semibold lowercase">amazon</span>
        <span className="h-1.5 w-8 rounded-full bg-[#ff9900]" />
      </div>
    );
  }

  if (kind === "osu") {
    return (
      <div className={badgeClass}>
        <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#bb0000] text-xs font-semibold text-white">
          O
        </span>
        <span>{label}</span>
      </div>
    );
  }

  return (
    <div className={badgeClass}>
      <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#12b886] text-xs font-semibold text-white">
        C
      </span>
      <span>{label}</span>
    </div>
  );
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="space-y-3">
      <p className="text-xs font-semibold uppercase tracking-[0.24em] opacity-60">{eyebrow}</p>
      <h2 className="text-2xl font-semibold tracking-tight md:text-4xl">{title}</h2>
      <p className="max-w-2xl text-sm leading-7 opacity-75 md:text-base">{description}</p>
    </div>
  );
}

function StatusPill({ status }: { status: string }) {
  const classes =
    status === "Incoming"
      ? "border-[#0f766e]/20 bg-[#0f766e]/10 text-[#0f766e] dark:border-[#5eead4]/20 dark:bg-[#134e4a]/40 dark:text-[#99f6e4]"
      : "border-black/10 bg-black/[0.04] text-foreground/80 dark:border-white/10 dark:bg-white/[0.05] dark:text-white/80";

  return (
    <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${classes}`}>
      {status}
    </span>
  );
}

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <section className="relative overflow-hidden rounded-[2.25rem] border border-black/10 bg-background/80 shadow-[0_24px_80px_rgba(0,0,0,0.08)] backdrop-blur dark:border-white/10 dark:shadow-[0_24px_80px_rgba(0,0,0,0.34)]">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(15,118,110,0.13),transparent_36%),radial-gradient(circle_at_bottom_right,rgba(251,191,36,0.14),transparent_28%)] dark:bg-[radial-gradient(circle_at_top_left,rgba(45,212,191,0.12),transparent_38%),radial-gradient(circle_at_bottom_right,rgba(245,158,11,0.12),transparent_28%)]" />

        <div className="relative grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <div className="inline-flex w-fit rounded-full border border-black/10 bg-background/90 px-3 py-1 text-xs font-medium uppercase tracking-[0.24em] opacity-75 dark:border-white/10 dark:bg-black/40">
              Resume
            </div>

            <div className="space-y-4">
              <h1 className="max-w-3xl text-4xl font-semibold tracking-tight md:text-6xl">
                Yakob Getu
              </h1>
              <p className="max-w-3xl text-lg leading-8 opacity-82 md:text-xl">
                Computer Science and Engineering student at The Ohio State University focused on
                full-stack development and software engineering.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 text-sm">
              <a
                href="mailto:ygetu21@gmail.com"
                className="rounded-full border border-black/10 bg-background/90 px-4 py-2 font-medium transition hover:-translate-y-0.5 hover:opacity-90 dark:border-white/10 dark:bg-black/35"
              >
                ygetu21@gmail.com
              </a>
              <a
                href="https://github.com/ygetu22"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/10 bg-background/90 px-4 py-2 font-medium transition hover:-translate-y-0.5 hover:opacity-90 dark:border-white/10 dark:bg-black/35"
              >
                github.com/ygetu22
              </a>
              <a
                href="https://linkedin.com/in/ygetu/"
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-black/10 bg-background/90 px-4 py-2 font-medium transition hover:-translate-y-0.5 hover:opacity-90 dark:border-white/10 dark:bg-black/35"
              >
                linkedin.com/in/ygetu
              </a>
            </div>

            <div className="rounded-[1.75rem] border border-black/10 bg-background/75 p-5 dark:border-white/10 dark:bg-black/30">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">
                Selected experience
              </p>
              <div className="mt-4 flex flex-wrap gap-3">
                {logoStrip.map((logo) => (
                  <LogoBadge key={logo.label} kind={logo.kind} label={logo.label} />
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-[1.75rem] border border-black/10 bg-background/80 p-5 dark:border-white/10 dark:bg-black/30">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">Highlights</p>
              <div className="mt-4 space-y-4">
                <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/[0.04]">
                  <p className="text-3xl font-semibold">Summer 2026</p>
                  <p className="mt-1 text-sm opacity-72">Incoming Software Engineering Intern at JPMorgan Chase</p>
                </div>
                <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/[0.04]">
                  <p className="text-3xl font-semibold">May 2027</p>
                  <p className="mt-1 text-sm opacity-72">Expected Ohio State graduation in Computer Science and Engineering</p>
                </div>
                <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/[0.04]">
                  <p className="text-3xl font-semibold">2x JPMC</p>
                  <p className="mt-1 text-sm opacity-72">Returning after a previous software engineering internship</p>
                </div>
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-black/10 bg-background/80 p-5 dark:border-white/10 dark:bg-black/30">
              <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">Actions</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <a
                  href="/yakob_resume_cse.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 font-medium text-background transition hover:-translate-y-0.5 hover:opacity-90"
                >
                  <ArrowDownIcon />
                  Download PDF
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-3 font-medium transition hover:-translate-y-0.5 hover:opacity-90 dark:border-white/10"
                >
                  Reach out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-28 lg:self-start">
          <div className="rounded-[1.75rem] border border-black/10 bg-background/80 p-4 dark:border-white/10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.22em] opacity-60">
              On this page
            </p>
            <nav className="flex flex-col gap-2 text-sm">
              {sectionLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  className="rounded-xl px-3 py-2 transition hover:bg-black/[0.04] dark:hover:bg-white/[0.05]"
                >
                  {link.label}
                </a>
              ))}
            </nav>
          </div>
        </aside>

        <div className="space-y-8">
          <section
            id="education"
            className="rounded-[2rem] border border-black/10 bg-background/80 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.04)] dark:border-white/10 dark:shadow-[0_12px_36px_rgba(0,0,0,0.2)] md:p-8"
          >
            <SectionHeading
              eyebrow="Education"
              title="A foundation built at Ohio State"
              description="Education, coursework, and honors."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[1.75rem] border border-black/10 p-5 dark:border-white/10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-3">
                    <LogoBadge kind="osu" label="The Ohio State University" />
                    <div>
                      <h3 className="text-2xl font-semibold">The Ohio State University</h3>
                      <p className="mt-1 text-sm opacity-72">B.S. in Computer Science and Engineering</p>
                    </div>
                  </div>

                  <div className="text-sm opacity-72">
                    <p>Columbus, OH</p>
                    <p>Expected May 2027</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/[0.04]">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60">Concentration</p>
                    <p className="mt-2 font-medium">Software Engineering</p>
                  </div>
                  <div className="rounded-2xl bg-black/[0.04] p-4 dark:bg-white/[0.04]">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60">Relevant coursework</p>
                    <p className="mt-2 font-medium">
                      Software Development and Design, Data Structures and Algorithms, Algorithm
                      Design and Analysis
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.75rem] border border-black/10 p-5 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">Recognition</p>
                <div className="mt-4 space-y-3">
                  {[
                    "Amazon Future Engineer Scholar, one of 400 recipients in the U.S.",
                    "Choose Ohio First Scholar",
                    "Dean's List, 3 times",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-black/10 px-4 py-3 text-sm leading-7 dark:border-white/10"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section
            id="experience"
            className="rounded-[2rem] border border-black/10 bg-background/80 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.04)] dark:border-white/10 dark:shadow-[0_12px_36px_rgba(0,0,0,0.2)] md:p-8"
          >
            <SectionHeading
              eyebrow="Experience"
              title="Internship experience"
              description="Product, platform, and full-stack engineering work across enterprise teams."
            />

            <div className="mt-8 space-y-5">
              {experienceEntries.map((entry) => (
                <article
                  key={`${entry.company}-${entry.date}`}
                  className="rounded-[1.85rem] border border-black/10 p-5 transition hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(0,0,0,0.06)] dark:border-white/10 dark:hover:shadow-[0_14px_36px_rgba(0,0,0,0.22)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        <LogoBadge kind={entry.kind} label={entry.company} />
                        <StatusPill status={entry.status} />
                      </div>

                      <div>
                        <h3 className="text-2xl font-semibold">{entry.title}</h3>
                        <p className="mt-1 text-sm opacity-72">{entry.company}</p>
                      </div>
                    </div>

                    <div className="text-sm opacity-72">
                      <p>{entry.location}</p>
                      <p>{entry.date}</p>
                    </div>
                  </div>

                  <div className="mt-5 flex flex-wrap gap-2">
                    {entry.stack.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-medium uppercase tracking-[0.16em] dark:border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>

                  <div className="mt-5 grid gap-3">
                    {entry.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-2xl bg-black/[0.04] px-4 py-3 text-sm leading-7 dark:bg-white/[0.04]"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section
            id="skills"
            className="rounded-[2rem] border border-black/10 bg-background/80 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.04)] dark:border-white/10 dark:shadow-[0_12px_36px_rgba(0,0,0,0.2)] md:p-8"
          >
            <SectionHeading
              eyebrow="Skills"
              title="Technical skills"
              description="Languages, frameworks, and tools."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {skillGroups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-[1.75rem] border border-black/10 p-5 transition hover:-translate-y-1 dark:border-white/10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.22em] opacity-60">
                    {group.label}
                  </p>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {group.items.map((item) => (
                      <span
                        key={item}
                        className="rounded-full border border-black/10 px-3 py-1.5 text-sm dark:border-white/10"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section
            id="leadership"
            className="rounded-[2rem] border border-black/10 bg-background/80 p-6 shadow-[0_12px_36px_rgba(0,0,0,0.04)] dark:border-white/10 dark:shadow-[0_12px_36px_rgba(0,0,0,0.2)] md:p-8"
          >
            <SectionHeading
              eyebrow="Leadership"
              title="Leadership and development"
              description="Programs and roles focused on leadership, communication, and execution."
            />

            <div className="mt-8 grid gap-5">
              {leadershipEntries.map((entry) => (
                <article
                  key={`${entry.organization}-${entry.date}`}
                  className="rounded-[1.75rem] border border-black/10 p-5 dark:border-white/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-black text-sm font-semibold text-white dark:bg-white dark:text-black">
                        {entry.mark}
                      </div>

                      <div>
                        <p className="text-sm uppercase tracking-[0.18em] opacity-55">
                          {entry.organization}
                        </p>
                        <h3 className="mt-2 text-xl font-semibold">{entry.title}</h3>
                      </div>
                    </div>

                    <div className="text-sm opacity-72">
                      <p>{entry.location}</p>
                      <p>{entry.date}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {entry.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-2xl bg-black/[0.04] px-4 py-3 text-sm leading-7 dark:bg-white/[0.04]"
                      >
                        {bullet}
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}
