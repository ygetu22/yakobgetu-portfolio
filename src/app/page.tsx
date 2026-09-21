import Image from "next/image";
import { readdir } from "node:fs/promises";
import path from "node:path";
import PhotoRotator from "@/components/photo-rotator";

const experience: Array<{
  company: string;
  logo: "jpmorgan" | "amazon";
  role: string;
  date: string;
  highlights: string[];
}> = [
  {
    company: "JPMorgan Chase & Co.",
    logo: "jpmorgan",
    role: "Software Engineer Intern, 2x Summer",
    date: "Jun 2025 - Aug 2026",
    highlights: [
      "Migrated the regression suite to Playwright, delivering 200+ scenarios across 12 core user flows.",
      "Wrote Gherkin scenarios and ran them in CI/CD on every pull request, cutting manual regression testing before releases by 70%.",
      "Rebuilt an employee directory in React and TypeScript with Spring Boot search and profile endpoints.",
    ],
  },
  {
    company: "Amazon, Device Team",
    logo: "amazon",
    role: "Software Development Engineer Intern",
    date: "May 2024 - Aug 2024",
    highlights: [
      "Helped migrate services behind the Devices Sales Page to microservices, improving performance by more than 80%.",
      "Built three Java service packages on AWS for customer-facing post-purchase features.",
      "Set up an AWS CDK deployment pipeline with runtime flags and fallbacks for safer releases.",
    ],
  },
];

function CompanyMark({ company }: { company: "jpmorgan" | "amazon" }) {
  if (company === "jpmorgan") {
    return (
      <div className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-foreground/10 bg-white p-1.5">
        <Image src="/chaseLogo.png" alt="JPMorgan Chase" width={76} height={14} className="h-auto w-full" />
      </div>
    );
  }

  return (
    <div className="relative grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-foreground/10 bg-[#171717] text-white">
      <span className="text-lg font-semibold tracking-[-0.12em]">a</span>
      <span className="absolute bottom-2 h-1 w-4 rounded-full border-b-2 border-[#ff9900]" />
      <span className="sr-only">Amazon</span>
    </div>
  );
}

const skills = [
  ["Languages", "Python, Java, TypeScript, JavaScript, SQL, HTML/CSS"],
  ["Frameworks", "React, Next.js, Node.js, Express, Spring Boot, Playwright, Gherkin"],
  ["Tools", "AWS, CDK, Git, Firebase, MongoDB, REST APIs, MCP, CI/CD, LLM APIs"],
];

const leadership = [
  ["DEV at The Ohio State University", "Project Manager, 2023 - 2024", "Led six engineers and designers building web tools for DEV's 360+ members."],
  ["Wonder of Our World", "Outreach Volunteer, 2023 - 2024", "Taught hands-on science lessons to elementary students through OSU's outreach program."],
];

async function getPortraits() {
  const directory = path.join(process.cwd(), "public", "portraits");
  const files = await readdir(directory);

  return files
    .filter((file) => file.endsWith(".jpg"))
    .sort((left, right) => left.localeCompare(right, undefined, { numeric: true }))
    .map((file, index) => ({
      src: `/portraits/${file}`,
      alt: `Yakob Getu, photo ${index + 1}`,
    }));
}

export default async function Home() {
  const portraits = await getPortraits();

  return (
    <>
      <section className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[1fr_0.9fr] lg:px-12">
        <div className="max-w-xl">
          <p className="mb-7 text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Yakob Getu</p>
          <h1 className="max-w-md text-6xl font-medium leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            Yakob <span className="font-serif italic font-normal">Getu</span>
          </h1>
          <div className="mt-10 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full border border-foreground/15 bg-foreground/[0.045] px-3.5 py-2">software engineer</span>
            <span className="rounded-full border border-foreground/15 bg-foreground/[0.045] px-3.5 py-2">Columbus, Ohio</span>
          </div>
          <p className="mt-12 text-sm text-foreground/45">Scroll to learn more</p>
        </div>

        <PhotoRotator slides={portraits} />
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24 pt-16 sm:px-10 lg:px-12 lg:pb-36">
        <div className="mb-20 max-w-2xl">
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">About</p>
          <p className="mt-6 text-lg leading-8 text-foreground/65">I&apos;m a fourth-year Computer Science and Engineering student at The Ohio State University. I care about software that earns trust: tools that stay clear under pressure, thoughtful in the details, and useful to the people who depend on them.</p>
        </div>

        <div className="grid gap-16 lg:grid-cols-[0.8fr_1.2fr]">
          <aside>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Education</p>
            <h3 className="mt-4 text-xl font-medium">The Ohio State University</h3>
            <p className="mt-2 text-sm leading-6 text-foreground/60">B.S. Computer Science and Engineering<br />Expected May 2027</p>
            <p className="mt-5 text-sm leading-6 text-foreground/60">Amazon Future Engineer Scholar · Dean&apos;s List (5x) · ColorStack · NSBE · CodePath · Ethiopian Student Association</p>
          </aside>

          <div>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Experience</p>
              <a
                href="/yakob_getu_resume.pdf"
                download
                className="rounded-full border border-foreground/15 bg-background/70 px-3.5 py-2 text-xs font-medium text-foreground/70 transition hover:border-foreground/35 hover:text-foreground"
              >
                Download resume ↓
              </a>
            </div>
            <div className="mt-6 divide-y divide-foreground/10 border-t border-foreground/10">
              {experience.map((item) => (
                <article key={item.company} className="py-8">
                  <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-start">
                    <div className="flex items-start gap-3">
                      <CompanyMark company={item.logo} />
                      <div>
                        <h3 className="text-lg font-medium">{item.company}</h3>
                        <p className="mt-1 text-sm text-foreground/55">{item.role}</p>
                      </div>
                    </div>
                    <p className="shrink-0 text-sm text-foreground/45">{item.date}</p>
                  </div>
                  <ul className="mt-5 space-y-2 text-sm leading-6 text-foreground/65">
                    {item.highlights.map((highlight) => <li key={highlight}>- {highlight}</li>)}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-24 grid gap-16 lg:grid-cols-2">
          <section>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Technical skills</p>
            <dl className="mt-6 divide-y divide-foreground/10 border-t border-foreground/10">
              {skills.map(([label, value]) => (
                <div key={label} className="py-5">
                  <dt className="text-sm font-medium">{label}</dt>
                  <dd className="mt-2 text-sm leading-6 text-foreground/60">{value}</dd>
                </div>
              ))}
            </dl>
          </section>

          <section>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Leadership &amp; community</p>
            <div className="mt-6 divide-y divide-foreground/10 border-t border-foreground/10">
              {leadership.map(([organization, role, detail]) => (
                <article key={organization} className="py-5">
                  <h3 className="text-sm font-medium">{organization}</h3>
                  <p className="mt-1 text-sm text-foreground/50">{role}</p>
                  <p className="mt-3 text-sm leading-6 text-foreground/65">{detail}</p>
                </article>
              ))}
            </div>
          </section>
        </div>
      </section>
    </>
  );
}
