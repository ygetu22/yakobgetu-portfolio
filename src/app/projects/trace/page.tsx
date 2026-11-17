import type { Metadata } from "next";
import Reveal from "@/components/motion/reveal";
import SectionHeading from "@/components/ui/section-heading";
import ProjectPage from "@/features/projects/project-page";
import { projects } from "@/features/projects/projects";
import TraceDemo from "@/features/projects/trace/trace-demo";
import styles from "@/features/projects/trace/trace.module.css";

const trace = projects.find((project) => project.id === "trace")!;

export const metadata: Metadata = {
  title: "Trace · Yakob Getu",
  description:
    "A terminal tool that opens a website in a real browser, uses it like a visitor, and reports what stopped working between two versions.",
};

const setupCommands = [
  "git clone https://github.com/ygetu22/trace.git",
  "cd trace && npm install && npm run build",
  "npm install -g .",
  "export TRACE_BROWSER_CHANNEL=chrome",
  "webtrace check https://your-site.com",
];

export default function TracePage() {
  return (
    <ProjectPage project={trace}>
      <section className="section" aria-labelledby="demo-title">
        <SectionHeading eyebrow="Recorded run" title="See it run" titleId="demo-title" />
        <Reveal>
          <TraceDemo />
        </Reveal>
      </section>

      <section className="section" aria-labelledby="how-title">
        <SectionHeading eyebrow="Inside" title="How it works" titleId="how-title" />
        <Reveal>
          <div className={styles.details}>
            <div>
              <h3>check</h3>
              <p>
                Tries one site on desktop and mobile and lists what worked, what failed, and what needs a
                look. It only calls something broken when it saw it break.
              </p>
            </div>
            <div>
              <h3>diff</h3>
              <p>
                Runs both versions and reports anything a visitor could do before but can&apos;t now. Speed
                numbers vary between visits, so they never fail a diff.
              </p>
            </div>
            <div>
              <h3>safe by default</h3>
              <p>
                Forms are never submitted, only page reads go out, private network addresses are blocked,
                and every check stops after 90 seconds.
              </p>
            </div>
          </div>

          <div className={styles.setup}>
            <h3>Run it yourself</h3>
            <p className="muted">Needs Node 22+ and Google Chrome.</p>
            <pre className={styles.setupCode} tabIndex={0} aria-label="Setup commands">
              <code>{setupCommands.join("\n")}</code>
            </pre>
            <a
              className="pill pill-link"
              href={trace.repositoryUrl}
              target="_blank"
              rel="noreferrer"
              data-cursor="visit"
            >
              Source and setup guide on GitHub<span className="sr-only"> (opens in a new tab)</span>
              <span aria-hidden="true"> ↗</span>
            </a>
          </div>
        </Reveal>
      </section>
    </ProjectPage>
  );
}
