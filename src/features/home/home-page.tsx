import { SiteLink } from "@/components/layout/page-curtain";
import ReadAlong from "@/components/motion/read-along";
import Reveal from "@/components/motion/reveal";
import SectionHeading from "@/components/ui/section-heading";
import ContactSection from "@/features/contact/contact-section";
import GeezNameCard from "@/features/geez-name/geez-name-card";
import PostList from "@/features/posts/post-list";
import ProjectCards from "@/features/projects/project-cards";
import ProjectIndex from "@/features/projects/project-index";
import { FEATURED_PROJECT_COUNT, projects } from "@/features/projects/projects";
import ResumeBlocks, { DownloadResumeLink } from "@/features/resume/resume-blocks";
import Hero from "./hero";
import { lifePhotos } from "./life-photos";
import LifeStrip from "./life-strip";
import lifeStyles from "./life.module.css";
import styles from "./home.module.css";

const aboutParagraphs = [
  "I'm Yakob. I study computer science at Ohio State and live in Columbus.",
  "Outside of class I'm usually building something, taking pictures on my Fujifilm, or listening to Ethiopian music. I travel when I can, and most of what I make ends up on this page.",
];

const featuredProjects = projects.slice(0, FEATURED_PROJECT_COUNT);
const otherProjects = projects.slice(FEATURED_PROJECT_COUNT);

export default function Home() {
  return (
    <>
      <Hero />

      <section id="about" className="section" aria-labelledby="about-title">
        <SectionHeading eyebrow="About" title="About me" titleId="about-title" />
        <div className={styles.about}>
          {aboutParagraphs.map((paragraph) => (
            <ReadAlong key={paragraph} text={paragraph} />
          ))}
        </div>
      </section>

      {/* Right after About, so visitors meet it early. Phones only for now; desktop keeps its layout. */}
      <section id="your-name" className="section phone-only" aria-labelledby="your-name-title">
        <Reveal>
          <GeezNameCard />
        </Reveal>
      </section>

      <section id="resume" className="section" aria-labelledby="resume-title">
        <SectionHeading
          eyebrow="Experience"
          title="Resume"
          titleId="resume-title"
          action={<DownloadResumeLink />}
        />
        <ResumeBlocks />
      </section>

      <section id="projects" className="section" aria-labelledby="projects-title">
        <SectionHeading eyebrow="Work" title="Projects" titleId="projects-title" />
        <Reveal className="desktop-only">
          <ProjectIndex projects={featuredProjects} />
        </Reveal>
        <div className="phone-only">
          <ProjectCards projects={featuredProjects} layout="row" />
        </div>

        {/* The remaining projects are only hinted at here; the Projects page lists every one. */}
        <Reveal className={styles.moreProjects}>
          <ul className={styles.fadedNames} aria-hidden="true">
            {otherProjects.map((project) => (
              <li key={project.id} className="display-heading">
                {project.name}
              </li>
            ))}
          </ul>
          <SiteLink href="/projects" curtainTitle="Projects" className="pill pill-link" data-cursor="open">
            See all projects <span aria-hidden="true">↗</span>
          </SiteLink>
        </Reveal>
      </section>

      <section id="life" className="section" aria-labelledby="life-title">
        <SectionHeading eyebrow="Outside of work" title="Life" titleId="life-title" />
        <ReadAlong text="Places I've been and everyday moments, some shot on my Fujifilm X-M5." />
        <Reveal>
          <LifeStrip photos={lifePhotos} />
          <p className={`muted ${lifeStyles.note}`}>
            <SiteLink href="/projects/elsewhere" curtainTitle="Elsewhere" className="text-link" data-cursor="open">
              Open the full journal <span aria-hidden="true">↗</span>
            </SiteLink>
          </p>
        </Reveal>
      </section>

      <section id="posts" className="section" aria-labelledby="posts-title">
        <SectionHeading eyebrow="Writing" title="Posts" titleId="posts-title" />
        <Reveal>
          <PostList />
        </Reveal>
      </section>

      <ContactSection />
    </>
  );
}
