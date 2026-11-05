import ActionLinkLabel from "@/components/ui/action-link-label";
import ScrollReveal from "@/components/motion/scroll-reveal";
import Image from "next/image";

import { contactLinks, education, experience, skillGroups, leadership, type TimelineEntry } from "./resume-data";

function DownloadIcon() {
  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 5v11" />
      <path d="M7 12l5 5 5-5" />
      <path d="M5 19h14" />
    </svg>
  );
}

function SectionTitle({ number, title }: { number: string; title: string }) {
  return (
    <div className="mb-5 flex items-center gap-3">
      <span className="text-[11px] font-medium uppercase tracking-[0.2em] text-foreground/40">{number}</span>
      <h2 className="display-heading text-2xl text-foreground">{title}</h2>
    </div>
  );
}

function BulletList({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2 text-sm leading-6 text-foreground/65">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-foreground/35" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Panel({ children }: { children: React.ReactNode }) {
  return <div className="py-2">{children}</div>;
}

function CompanyMark({ mark }: { mark: TimelineEntry["mark"] }) {
  if (mark === "J") {
    return <div className="grid h-9 w-9 place-items-center rounded-lg bg-white p-1.5"><Image src="/images/resume/chase-logo.png" alt="JPMorgan Chase" width={72} height={14} className="h-auto w-full" /></div>;
  }
  if (mark === "A") {
    return <div className="relative grid h-9 w-9 place-items-center rounded-lg border border-foreground/15 bg-foreground/[0.05] text-foreground"><span className="text-base font-semibold tracking-[-0.12em]">a</span><span className="absolute bottom-1.5 h-0.5 w-3 rounded-full bg-[#ff9900]" /></div>;
  }
  return <div className="grid h-9 w-9 place-items-center rounded-lg border border-foreground/15 bg-foreground/[0.05] text-xs font-medium text-foreground/65">{mark}</div>;
}

function Timeline({ entries }: { entries: TimelineEntry[] }) {
  return (
    <div className="relative before:absolute before:bottom-7 before:left-1.5 before:top-2 before:w-px before:bg-foreground/10">
      <div className="space-y-9">
        {entries.map((entry, index) => (
          <ScrollReveal key={`${entry.name}-${entry.date}`} delay={index * 100} className="relative grid grid-cols-[3.5rem_minmax(0,1fr)] gap-x-4">
            <div className="relative z-10 flex items-start"><span className="absolute left-1.5 top-3 h-3 w-3 rounded-full border border-foreground/20 bg-background ring-4 ring-foreground/[0.025]" /><span className="ml-7"><CompanyMark mark={entry.mark} /></span></div>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold tracking-tight text-foreground">{entry.name}</h3>
                {entry.badge ? <span className="rounded-full border border-foreground/15 px-2 py-0.5 text-[10px] font-medium uppercase tracking-[0.14em] text-foreground/50">{entry.badge}</span> : null}
              </div>
              <div className="mt-1 flex flex-col gap-1 text-sm sm:flex-row sm:items-start sm:justify-between sm:gap-6"><p className="text-foreground/55">{entry.role}</p><p className="shrink-0 text-xs leading-5 text-foreground/40 sm:text-right">{entry.date}<br />{entry.location}</p></div>
              {entry.stack?.length ? <p className="mt-3 text-xs leading-5 text-foreground/35">{entry.stack.join(" · ")}</p> : null}
              <BulletList items={entry.bullets} />
            </div>
          </ScrollReveal>
        ))}
      </div>
    </div>
  );
}

export default function ResumePage() {
  return (
    <main className="min-h-screen bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-3xl">
      <header className="mb-10 grid gap-7 border-b border-foreground/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
        <ScrollReveal>
          <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/40">Resume</p>
          <h1 className="display-heading mt-4 text-4xl text-foreground sm:text-5xl">Yakob <span className="font-serif italic font-normal">Getu</span></h1>
          <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/55">Computer Science &amp; Engineering · The Ohio State University · Software engineer</p>
          <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {contactLinks.map((link) => (
              <a key={link.href} href={link.href} target={link.external ? "_blank" : undefined} rel={link.external ? "noreferrer" : undefined} className="text-foreground/55 transition hover:text-foreground">
                <ActionLinkLabel>{link.label}</ActionLinkLabel>
              </a>
            ))}
          </div>
        </ScrollReveal>
        <ScrollReveal delay={130}>
          <a href="/documents/yakob_getu_resume.pdf" download className="inline-flex items-center gap-2 rounded-full border border-foreground/15 bg-foreground/[0.06] px-4 py-2.5 text-xs font-medium text-foreground/70 transition hover:border-foreground/35 hover:bg-foreground/[0.1] hover:text-foreground">
            <DownloadIcon />
            Download PDF
          </a>
        </ScrollReveal>
      </header>

      <div className="space-y-5">
        <section>
          <ScrollReveal><SectionTitle number="01" title="Education" /></ScrollReveal>
          <ScrollReveal delay={100}><Panel><div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between sm:gap-6"><div><h3 className="text-base font-semibold text-foreground">{education.institution}</h3><p className="mt-1 text-sm text-foreground/55">{education.degree} · {education.concentration}</p></div><p className="shrink-0 text-xs leading-5 text-foreground/40 sm:text-right">{education.location}<br />{education.date}</p></div><BulletList items={education.honors} /><p className="mt-5 text-xs leading-5 text-foreground/35"><span className="font-medium text-foreground/55">Coursework:</span> {education.coursework}</p></Panel></ScrollReveal>
        </section>

        <section>
          <ScrollReveal><SectionTitle number="02" title="Experience" /></ScrollReveal>
          <Panel><Timeline entries={experience} /></Panel>
        </section>

        <section>
          <ScrollReveal><SectionTitle number="03" title="Skills &amp; tools" /></ScrollReveal>
          <Panel><div className="grid gap-x-10 gap-y-6 md:grid-cols-2">
            {skillGroups.map((group, index) => (
              <ScrollReveal key={group.label} delay={index * 75}>
                <h3 className="text-[11px] font-medium uppercase tracking-[0.14em] text-foreground/40">{group.label}</h3>
                <div className="mt-3 flex flex-wrap gap-2">{group.items.map((item) => <span key={item} className="rounded-full border border-foreground/15 bg-foreground/[0.07] px-2.5 py-1 text-xs text-foreground/65">{item}</span>)}</div>
              </ScrollReveal>
            ))}
          </div></Panel>
        </section>

        <section>
          <ScrollReveal><SectionTitle number="04" title="Leadership" /></ScrollReveal>
          <Panel><Timeline entries={leadership} /></Panel>
        </section>
      </div>
      </div>
    </main>
  );
}
