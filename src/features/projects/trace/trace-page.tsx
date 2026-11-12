import type { CSSProperties } from "react";
import Link from "next/link";
import ActionLinkLabel from "@/components/ui/action-link-label";
import { recordedOn, recordedRuns } from "./recorded-runs";
import styles from "./trace.module.css";

const repositoryUrl = "https://github.com/ygetu22/trace";

const setupCommands = [
  "git clone https://github.com/ygetu22/trace.git",
  "cd trace && npm install && npm run build",
  "npm install -g .",
  "export TRACE_BROWSER_CHANNEL=chrome",
  "webtrace check https://your-site.com",
];

const sectionHeadings = [
  "What Trace tried",
  "Needs review",
  "Optional",
  "Problems",
  "Comparing",
  "Changed",
  "Stopped working",
  "New problems",
  "Fixed",
];

// Colors a line of recorded output the same way the real terminal does.
function lineStyle(line: string): string | undefined {
  const text = line.trim();
  if (text.startsWith("✓")) return styles.passed;
  if (text.startsWith("✗")) return styles.failed;
  if (text.startsWith("?") || text.startsWith("!")) return styles.review;
  if (sectionHeadings.some((heading) => text.startsWith(heading))) return styles.heading;
  if (line.startsWith("    ") || /^(Checking|Sampling|Not tested|Same on both)/.test(text)) {
    return styles.dim;
  }
  return undefined;
}

export default function TracePage() {
  // Every line gets the next delay, so both runs play back in order.
  let lineNumber = 0;
  const nextDelay = () => ({ "--line": lineNumber++ }) as CSSProperties;

  return (
    <div className={styles.page}>
      <Link href="/projects" className={styles.back}>
        <ActionLinkLabel direction="back">All projects</ActionLinkLabel>
      </Link>

      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>
            <span className={styles.eyebrowMark} /> Terminal tool
          </p>
          <h1 className={styles.title}>
            Trace<span>.</span>
          </h1>
          <p className={styles.intro}>Know what broke before your visitors do.</p>
          <p className={styles.copy}>
            Trace opens a website in a real browser and uses it like a visitor: it clicks
            buttons, follows links, and tries forms without sending them. Compare your live
            site with a new version and it tells you what stopped working. No tests to write.
          </p>
        </div>
        <div className={styles.heroAside}>
          <span className={styles.asideRule} />
          <p>Real browser</p>
          <p>Desktop + mobile</p>
          <p>Free and open source</p>
        </div>
      </header>

      <section className={styles.terminal} aria-labelledby="terminal-heading">
        <div className={styles.terminalBar}>
          <span />
          <span />
          <span />
          <h2 id="terminal-heading">Recorded run · {recordedOn}</h2>
        </div>
        <pre className={styles.terminalBody}>
          {recordedRuns.map((run) => (
            <code key={run.command} className={styles.run}>
              <span className={styles.prompt} style={nextDelay()}>
                <span aria-hidden="true">$ </span>
                {run.command}
              </span>
              {run.output.map((line, index) => (
                <span key={index} className={lineStyle(line)} style={nextDelay()}>
                  {line || " "}
                </span>
              ))}
            </code>
          ))}
        </pre>
      </section>
      <p className={styles.caption}>
        Real output from public sites, not a mock-up. The diff compares Playwright&apos;s Node.js
        and Python docs: the same links lead to different pages, so Trace marks them changed,
        not broken.
      </p>

      <section className={styles.details} aria-label="How Trace works">
        <div>
          <h2>check</h2>
          <p>
            Tries one site on desktop and mobile and lists what worked, what failed, and what
            needs a look. It only calls something broken when it saw it break.
          </p>
        </div>
        <div>
          <h2>diff</h2>
          <p>
            Runs both versions and reports anything a visitor could do before but can&apos;t
            now. Speed numbers vary between visits, so they never fail a diff.
          </p>
        </div>
        <div>
          <h2>safe by default</h2>
          <p>
            Forms are never submitted, only page reads go out, private network addresses are
            blocked, and every check stops after 90 seconds.
          </p>
        </div>
      </section>

      <section className={styles.setup} aria-labelledby="setup-heading">
        <h2 id="setup-heading">Run it yourself</h2>
        <p className={styles.setupNote}>Needs Node 22+ and Google Chrome.</p>
        <pre className={styles.setupCode}>
          <code>{setupCommands.join("\n")}</code>
        </pre>
        <a
          className={styles.repoLink}
          href={repositoryUrl}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ActionLinkLabel>Source and setup guide on GitHub</ActionLinkLabel>
        </a>
      </section>
    </div>
  );
}
