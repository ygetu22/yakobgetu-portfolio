import Link from "next/link";

const sectionLinks = [
  { href: "#education", label: "Education" },
  { href: "#experience", label: "Experience" },
  { href: "#skills", label: "Skills" },
  { href: "#leadership", label: "Leadership" },
];

const experienceEntries = [
  {
    title: "Software Engineering Intern",
    company: "JPMorgan Chase & Co.",
    location: "Columbus, OH",
    date: "June 2025 - July 2025",
    bullets: [
      "Modernized an internal employee directory app with React and TypeScript, refactoring key UI components to reduce average page load time.",
      "Implemented backend services with Spring Boot and Java, adding REST endpoints for phonebook search and updates.",
      "Built JUnit and Jest test suites that pushed line coverage above 90% and improved release confidence.",
      "Delivered cleaner components, more predictable APIs, and smoother employee lookup workflows across the organization.",
    ],
  },
  {
    title: "Software Development Engineer Intern",
    company: "Amazon Devices",
    location: "Seattle, WA",
    date: "May 2024 - Aug 2024",
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
    label: "Tools",
    items: ["MySQL", "Excel", "Vim", "Jest", "JUnit"],
  },
];

const leadershipEntries = [
  {
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
    title: "Career Preparation Fellow",
    organization: "Management Leadership for Tomorrow (MLT)",
    location: "Washington, DC",
    date: "Nov 2024 - Present",
    bullets: [
      "Selected from thousands for an 18-month career preparation program led by Deloitte, LinkedIn, and Bloomberg.",
      "Completed business case studies and cohort projects that strengthened leadership and professional communication.",
    ],
  },
  {
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

function SectionHeading(props: { eyebrow: string; title: string; description: string }) {
  const { eyebrow, title, description } = props;

  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">{eyebrow}</p>
      <div className="space-y-3">
        <h2 className="text-2xl font-semibold tracking-tight md:text-3xl">{title}</h2>
        <p className="max-w-2xl text-sm leading-7 opacity-75 md:text-base">{description}</p>
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-8 md:px-6 md:py-12">
      <section className="overflow-hidden rounded-[2rem] border border-black/10 bg-background/80 shadow-[0_20px_60px_rgba(0,0,0,0.06)] backdrop-blur dark:border-white/10 dark:shadow-[0_20px_60px_rgba(0,0,0,0.3)]">
        <div className="grid gap-10 px-6 py-8 md:px-10 md:py-10 lg:grid-cols-[1.3fr_0.7fr]">
          <div className="space-y-6">
            <div className="inline-flex w-fit rounded-full border border-black/10 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] opacity-70 dark:border-white/10">
              Resume
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <h1 className="text-4xl font-semibold tracking-tight md:text-6xl">Yakob Getu</h1>
                <p className="max-w-2xl text-lg leading-8 opacity-80 md:text-xl">
                  Computer Science and Engineering student at The Ohio State University focused on
                  full-stack development, reliable systems, and thoughtful product work.
                </p>
              </div>

              <div className="flex flex-wrap gap-3 text-sm">
                <a
                  href="mailto:ygetu21@gmail.com"
                  className="rounded-full border border-black/10 px-4 py-2 hover:opacity-80 dark:border-white/10"
                >
                  ygetu21@gmail.com
                </a>
                <a
                  href="https://github.com/ygetu22"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 px-4 py-2 hover:opacity-80 dark:border-white/10"
                >
                  github.com/ygetu22
                </a>
                <a
                  href="https://linkedin.com/in/ygetu/"
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-full border border-black/10 px-4 py-2 hover:opacity-80 dark:border-white/10"
                >
                  linkedin.com/in/ygetu
                </a>
              </div>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-3xl border border-black/10 bg-black/[0.03] p-5 dark:border-white/10 dark:bg-white/[0.03]">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">At a glance</p>
              <div className="mt-4 space-y-4">
                <div>
                  <p className="text-3xl font-semibold">3.80</p>
                  <p className="text-sm opacity-70">Cumulative GPA at Ohio State</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold">May 2027</p>
                  <p className="text-sm opacity-70">Expected graduation</p>
                </div>
                <div>
                  <p className="text-3xl font-semibold">2</p>
                  <p className="text-sm opacity-70">Recent software engineering internships</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-black/10 p-5 dark:border-white/10">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Actions</p>
              <div className="mt-4 flex flex-col gap-3 text-sm">
                <a
                  href="/yakob_resume_cse.pdf"
                  download
                  className="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-4 py-3 font-medium text-background transition hover:opacity-90"
                >
                  <ArrowDownIcon />
                  Download PDF
                </a>
                <Link
                  href="/contact"
                  className="inline-flex items-center justify-center rounded-full border border-black/10 px-4 py-3 font-medium hover:opacity-80 dark:border-white/10"
                >
                  Reach out
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mt-8 grid gap-8 lg:grid-cols-[220px_minmax(0,1fr)]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="rounded-3xl border border-black/10 bg-background/80 p-4 dark:border-white/10">
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
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
              title="Built on a strong academic foundation"
              description="A mix of rigorous coursework, national recognition, and steady academic performance that supports the engineering work."
            />

            <div className="mt-8 grid gap-5 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="rounded-3xl border border-black/10 p-5 dark:border-white/10">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div>
                    <h3 className="text-xl font-semibold">The Ohio State University</h3>
                    <p className="mt-1 text-sm opacity-70">B.S. in Computer Science and Engineering</p>
                  </div>
                  <div className="text-sm opacity-70">
                    <p>Columbus, OH</p>
                    <p>Expected May 2027</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-4 text-sm sm:grid-cols-2">
                  <div className="rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.03]">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60">Concentration</p>
                    <p className="mt-2 font-medium">Software Engineering</p>
                  </div>
                  <div className="rounded-2xl bg-black/[0.03] p-4 dark:bg-white/[0.03]">
                    <p className="text-xs uppercase tracking-[0.2em] opacity-60">Relevant coursework</p>
                    <p className="mt-2 font-medium">
                      Software Development and Design, Data Structures and Algorithms, Algorithm
                      Design and Analysis
                    </p>
                  </div>
                </div>
              </div>

              <div className="rounded-3xl border border-black/10 p-5 dark:border-white/10">
                <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">Honors</p>
                <div className="mt-4 space-y-3">
                  {[
                    "Amazon Future Engineer Scholar, one of 400 recipients in the U.S.",
                    "Choose Ohio First Scholar",
                    "Dean's List, 3 times",
                  ].map((item) => (
                    <div
                      key={item}
                      className="rounded-2xl border border-black/10 px-4 py-3 text-sm dark:border-white/10"
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
              title="Hands-on engineering across enterprise environments"
              description="Internship work focused on full-stack delivery, backend services, reliability, and clearer release paths."
            />

            <div className="mt-8 space-y-5">
              {experienceEntries.map((entry) => (
                <article
                  key={`${entry.company}-${entry.date}`}
                  className="rounded-3xl border border-black/10 p-5 transition hover:-translate-y-0.5 hover:shadow-[0_12px_30px_rgba(0,0,0,0.06)] dark:border-white/10 dark:hover:shadow-[0_12px_30px_rgba(0,0,0,0.2)]"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] opacity-55">{entry.company}</p>
                      <h3 className="mt-2 text-xl font-semibold">{entry.title}</h3>
                    </div>
                    <div className="text-sm opacity-70">
                      <p>{entry.location}</p>
                      <p>{entry.date}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {entry.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-2xl bg-black/[0.03] px-4 py-3 text-sm leading-7 dark:bg-white/[0.03]"
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
              title="Tools I reach for when building"
              description="A practical stack centered around web products, backend systems, and the tooling needed to ship cleanly."
            />

            <div className="mt-8 grid gap-5 md:grid-cols-2">
              {skillGroups.map((group) => (
                <div
                  key={group.label}
                  className="rounded-3xl border border-black/10 p-5 dark:border-white/10"
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] opacity-60">
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
              title="Growth outside the classroom and internship cycle"
              description="Programs and roles that strengthened leadership, communication, and team execution."
            />

            <div className="mt-8 grid gap-5">
              {leadershipEntries.map((entry) => (
                <article
                  key={`${entry.organization}-${entry.date}`}
                  className="rounded-3xl border border-black/10 p-5 dark:border-white/10"
                >
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.2em] opacity-55">
                        {entry.organization}
                      </p>
                      <h3 className="mt-2 text-xl font-semibold">{entry.title}</h3>
                    </div>
                    <div className="text-sm opacity-70">
                      <p>{entry.location}</p>
                      <p>{entry.date}</p>
                    </div>
                  </div>

                  <div className="mt-5 grid gap-3">
                    {entry.bullets.map((bullet) => (
                      <div
                        key={bullet}
                        className="rounded-2xl bg-black/[0.03] px-4 py-3 text-sm leading-7 dark:bg-white/[0.03]"
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
