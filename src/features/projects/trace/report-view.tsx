import type { ReactNode } from "react";
import styles from "./trace.module.css";
import type {
  ReportAction,
  ReportJourney,
  ReportPresentation,
  ScreenshotEvidence,
} from "./report-types";

export function actionLocation(value: string) {
  try {
    const url = new URL(value);
    return `${url.hostname}${url.pathname}`;
  } catch {
    return "Page";
  }
}

export function ActionResult({
  action,
  screenshots,
}: {
  action: ReportAction;
  screenshots: ScreenshotEvidence[];
}) {
  const label =
    action.outcome === "passed"
      ? "Passed"
      : action.outcome === "failed"
        ? "Failed"
        : "Unverified";
  return (
    <div className={styles.actionResult}>
      <div className={styles.actionHeading}>
        <strong>{action.label || "Unnamed action"}</strong>
        <span className={`${styles.outcome} ${styles[action.outcome]}`}>
          {label}
        </span>
      </div>
      <span className={styles.actionLocation}>
        {action.viewport} · {actionLocation(action.beforeUrl)}
      </span>
      <p>{action.detail.replace(/https?:\/\/[^\s]+/g, actionLocation)}</p>
      {action.expected && (
        <details className={styles.stepDetails}>
          <summary>Step details</summary>
          <p>
            <strong>Expected:</strong> {action.expected}
          </p>
          <p>
            <strong>Observed:</strong> {action.observed || action.detail}
          </p>
        </details>
      )}
      <EvidenceView reference={action} screenshots={screenshots} />
    </div>
  );
}

function EvidenceView({
  reference,
  screenshots,
}: {
  reference: { evidenceId?: string; evidenceNote?: string };
  screenshots: ScreenshotEvidence[];
}) {
  const evidence = screenshots.find(
    (item) =>
      item.id === reference.evidenceId &&
      /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(item.dataUrl) &&
      item.dataUrl.length < 140_000,
  );
  return evidence ? (
    <details className={styles.screenshot}>
      <summary>View screenshot</summary>
      <figure>
        {/* These temporary data images are not sent through server optimization. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={evidence.dataUrl} alt={evidence.caption} loading="lazy" />
        <figcaption>{evidence.caption}</figcaption>
      </figure>
      <a href={evidence.dataUrl} download={`trace-${evidence.id}.jpg`}>
        Save screenshot ↓
      </a>
    </details>
  ) : reference.evidenceNote ? (
    <small className={styles.evidenceNote}>{reference.evidenceNote}</small>
  ) : null;
}

export function ReportOverview({
  presentation,
  children,
  screenshots = [],
}: {
  presentation: ReportPresentation;
  screenshots?: ScreenshotEvidence[];
  children?: ReactNode;
}) {
  return (
    <div className={styles.reportOverview}>
      <div className={styles.reportSummary}>
        <p className={styles.response}>{presentation.response}</p>
        <h3>{presentation.summary}</h3>
        <p>{presentation.title}</p>
        <p className={styles.reportUrl}>{presentation.url}</p>
        <p>
          {presentation.sample} {presentation.completion}
        </p>
      </div>
      {children}
      {presentation.sections.map((section) => (
        <FindingSection
          key={section.kind}
          section={section}
          screenshots={screenshots}
        />
      ))}
    </div>
  );
}

function FindingSection({
  section,
  screenshots,
}: {
  section: ReportPresentation["sections"][number];
  screenshots: ScreenshotEvidence[];
}) {
  const content = (
    <>
      {section.items.slice(0, 3).map((item, index) => (
        <Finding key={index} item={item} screenshots={screenshots} />
      ))}
      {section.items.length > 3 && (
        <details className={styles.moreFindings}>
          <summary>{section.items.length - 3} more findings</summary>
          {section.items.slice(3).map((item, index) => (
            <Finding key={index} item={item} screenshots={screenshots} />
          ))}
        </details>
      )}
    </>
  );
  const className = `${styles.findingSection} ${styles[section.kind]}`;
  return section.kind === "recommendation" ? (
    <details className={className}>
      <summary>
        {section.title} ({section.items.length})
      </summary>
      {content}
    </details>
  ) : (
    <section className={className}>
      <h3>
        {section.title} <span>{section.items.length}</span>
      </h3>
      {content}
    </section>
  );
}

function Finding({
  item,
  screenshots,
}: {
  item: ReportPresentation["sections"][number]["items"][number];
  screenshots: ScreenshotEvidence[];
}) {
  return (
    <article className={styles.finding}>
      <h4>{item.title}</h4>
      {item.location && (
        <span className={styles.actionLocation}>{item.location}</span>
      )}
      <p>{item.detail}</p>
      {item.nextStep && <p className={styles.nextStep}>{item.nextStep}</p>}
      {item.examples?.map((example, index) => (
        <div key={index} className={styles.findingEvidence}>
          <span>Example: {example.label}</span>
          <EvidenceView reference={example} screenshots={screenshots} />
        </div>
      ))}
    </article>
  );
}

export function JourneyResult({
  journey,
  actions,
  screenshots,
}: {
  journey: ReportJourney;
  actions: ReportAction[];
  screenshots: ScreenshotEvidence[];
}) {
  return (
    <section className={styles.journey} aria-label="Selected visitor path">
      <p className={styles.panelKicker}>Selected visitor path</p>
      <h3>{journey.name}</h3>
      <p className={styles.journeyReason}>{journey.reason}</p>
      <ol className={styles.journeySteps}>
        {journey.steps
          .filter((index) => actions[index])
          .map((index) => (
            <li key={index}>
              <ActionResult action={actions[index]} screenshots={screenshots} />
            </li>
          ))}
      </ol>
      <p className={styles.journeyReason}>{journey.detail}</p>
    </section>
  );
}
