import ActionLinkLabel from "@/components/ui/action-link-label";
import FadePreview from "@/components/ui/fade-preview";
import Image from "next/image";
import Link from "next/link";
import type { ReactNode } from "react";
import PhotoPlaceholder from "@/components/ui/photo-placeholder";
import ScrollReveal from "@/components/motion/scroll-reveal";
import { ProjectGrid, projectCards } from "@/features/projects/project-list";
import {
  DownloadResumeLink,
  EducationSection,
  ExperienceSection,
  LeadershipSection,
  SkillsSection,
} from "@/features/resume/resume-sections";
import AboutSection from "./about-section";
import { professionalPortrait } from "./portrait";

type HomeSectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  action?: ReactNode;
  children: ReactNode;
};

function HomeSection({ id, eyebrow, title, action, children }: HomeSectionProps) {
  const titleId = `home-${id}-title`;

  return (
    <section id={id} aria-labelledby={titleId} className="home-section">
      <ScrollReveal variant="wipe">
        <div className="mb-8 flex items-end justify-between gap-4 border-b border-foreground/10 pb-5">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">{eyebrow}</p>
            <h2 id={titleId} className="display-heading mt-3 text-4xl">
              {title}
            </h2>
          </div>
          {action}
        </div>
      </ScrollReveal>
      {children}
    </section>
  );
}

export default function Home() {
  const featuredProjects = projectCards.slice(0, 3);
  const moreProjects = projectCards.slice(3);

  return (
    <>
      <section className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-6 py-24 sm:px-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.9fr)] lg:px-12">
        <div className="min-w-0 max-w-xl">
          <ScrollReveal variant="title">
            <p className="mb-7 text-xs font-medium uppercase tracking-[0.28em] text-foreground/45">Yakob Getu</p>
          </ScrollReveal>
          <h1 className="hero-name display-heading max-w-md">
            Yakob <span>Getu</span>
          </h1>
          <ScrollReveal variant="from-left" delay={280}>
            <div className="mt-10 flex flex-wrap gap-2 text-sm">
              <span className="rounded-full border border-foreground/15 bg-foreground/[0.045] px-3.5 py-2">
                software engineer
              </span>
              <span className="rounded-full border border-foreground/15 bg-foreground/[0.045] px-3.5 py-2">
                columbus, ohio
              </span>
            </div>
          </ScrollReveal>
          <ScrollReveal delay={340}>
            <div className="mt-12 flex flex-wrap items-center gap-6 text-sm">
              <p className="text-foreground/45">Scroll to learn more</p>
              <Link href="/projects" className="text-foreground/65 hover:text-foreground">
                <ActionLinkLabel>Projects</ActionLinkLabel>
              </Link>
            </div>
          </ScrollReveal>
        </div>

        <ScrollReveal variant="portrait" delay={140} className="min-w-0">
          <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-[2rem] border border-foreground/10 bg-background shadow-2xl shadow-black/10">
            {professionalPortrait.image ? (
              <Image
                src={professionalPortrait.image}
                alt={professionalPortrait.alt}
                fill
                sizes="(max-width: 640px) 144vw, 720px"
                quality={90}
                className="scale-[1.6] object-cover object-[60%_42%]"
                preload
              />
            ) : (
              <PhotoPlaceholder label="Professional portrait to come" />
            )}
          </div>
        </ScrollReveal>
      </section>

      <div className="mx-auto max-w-6xl space-y-28 px-6 pb-24 pt-16 sm:px-10 lg:px-12 lg:pb-36">
        <HomeSection id="about" eyebrow="About" title="About me">
          <AboutSection />
        </HomeSection>

        <HomeSection
          id="posts"
          eyebrow="Writing"
          title="Posts"
          action={
            <Link href="/posts" className="text-xs text-foreground/60 hover:text-foreground">
              <ActionLinkLabel>View posts</ActionLinkLabel>
            </Link>
          }
        >
          <ScrollReveal variant="settle" delay={100}>
            <p className="max-w-xl text-sm leading-6 text-foreground/60">Notes, updates, and writeups will live here.</p>
          </ScrollReveal>
        </HomeSection>

        <HomeSection id="resume" eyebrow="Experience" title="Resume" action={<DownloadResumeLink />}>
          <div className="max-w-3xl space-y-5">
            <EducationSection />
            <ExperienceSection />
            <FadePreview href="/resume" linkLabel="Full resume">
              <div className="space-y-5">
                <SkillsSection />
                <LeadershipSection />
              </div>
            </FadePreview>
          </div>
        </HomeSection>

        <HomeSection id="projects" eyebrow="Work" title="Projects">
          <div className="space-y-6">
            <ProjectGrid cards={featuredProjects} />
            <FadePreview href="/projects" linkLabel="All projects">
              <ProjectGrid cards={moreProjects} />
            </FadePreview>
          </div>
        </HomeSection>
      </div>
    </>
  );
}
