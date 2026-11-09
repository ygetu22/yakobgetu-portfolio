import ActionLinkLabel from "@/components/ui/action-link-label";
import ScrollReveal from "@/components/motion/scroll-reveal";
import { contactLinks } from "./resume-data";
import {
  DownloadResumeLink,
  EducationSection,
  ExperienceSection,
  LeadershipSection,
  SkillsSection,
} from "./resume-sections";

export default function ResumePage() {
  return (
    <div className="min-h-screen bg-background px-6 py-20 sm:px-10 lg:py-28">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10 grid gap-7 border-b border-foreground/10 pb-10 lg:grid-cols-[1fr_auto] lg:items-end">
          <ScrollReveal>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/40">Resume</p>
            <h1 className="display-heading mt-4 text-4xl text-foreground sm:text-5xl">
              Yakob <span className="font-serif font-normal italic">Getu</span>
            </h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-foreground/55">
              Computer Science &amp; Engineering · The Ohio State University · Software engineer
            </p>

            <div className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-sm">
              {contactLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  target={link.external ? "_blank" : undefined}
                  rel={link.external ? "noreferrer" : undefined}
                  className="text-foreground/55 transition hover:text-foreground"
                >
                  <ActionLinkLabel>{link.label}</ActionLinkLabel>
                </a>
              ))}
            </div>
          </ScrollReveal>

          <ScrollReveal delay={130}>
            <DownloadResumeLink />
          </ScrollReveal>
        </header>

        <div className="space-y-5">
          <EducationSection />
          <ExperienceSection />
          <SkillsSection />
          <LeadershipSection />
        </div>
      </div>
    </div>
  );
}
